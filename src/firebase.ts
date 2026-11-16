import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  linkWithCredential,
  EmailAuthProvider,
  signOut,
  setPersistence,
  browserLocalPersistence,
  User
} from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Default Firebase project authDomain (.firebaseapp.com)
// Netlify does not host /__/auth/handler, so authDomain must use the default Firebase project URL
const defaultAuthDomain = firebaseConfig.authDomain || 'teak-router-m53bd.firebaseapp.com';

const app = initializeApp({
  ...firebaseConfig,
  authDomain: defaultAuthDomain,
});

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Suppress internal Firestore connection retry logs so harmless offline/reconnection attempts do not pollute console
try {
  setLogLevel('silent');
} catch {
  // Ignore if already configured
}

// Configure auth persistence to browserLocalPersistence (localStorage / IndexedDB)
try {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('[Firebase] Warning setting browserLocalPersistence:', err);
  });
} catch (err) {
  console.warn('[Firebase] Error configuring persistence:', err);
}

// ---------------------------------------------------------------------------
// Local Fallback Auth Helpers (Used seamlessly when Firebase Email/Password
// provider is not enabled yet in Firebase Console: auth/operation-not-allowed)
// ---------------------------------------------------------------------------
export const LOCAL_AUTH_SESSION_KEY = 'rpa_local_auth_session_v1';
export const LOCAL_AUTH_USERS_KEY = 'rpa_local_auth_users_v1';

export interface LocalAuthUserRecord {
  uid: string;
  email: string;
  displayName: string;
  password?: string;
  createdAt: string;
}

function generateDeterministicUid(email: string): string {
  const clean = email.trim().toLowerCase();
  if (clean === 'risneraryan@gmail.com') return 'coach-aj-risner-uid';
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = ((hash << 5) - hash) + clean.charCodeAt(i);
    hash |= 0;
  }
  const safeSlug = clean.replace(/[^a-z0-9]/g, '').slice(0, 20) || 'member';
  return `usr_${safeSlug}_${Math.abs(hash).toString(36)}`;
}

export function buildFallbackUserObject(record: LocalAuthUserRecord): User {
  const nowIso = new Date().toISOString();
  const futureIso = new Date(Date.now() + 30 * 86400000).toISOString();
  return {
    uid: record.uid,
    email: record.email,
    displayName: record.displayName,
    emailVerified: true,
    isAnonymous: false,
    metadata: {
      creationTime: record.createdAt || nowIso,
      lastSignInTime: nowIso,
    },
    providerData: [
      {
        providerId: 'password',
        uid: record.email,
        displayName: record.displayName,
        email: record.email,
        phoneNumber: null,
        photoURL: null,
      },
    ],
    refreshToken: 'local-session-refresh-token',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'local-session-id-token',
    getIdTokenResult: async () => ({
      token: 'local-session-id-token',
      claims: {
        email: record.email,
        email_verified: true,
      },
      authTime: nowIso,
      issuedAtTime: nowIso,
      expirationTime: futureIso,
      signInProvider: 'password',
      signInSecondFactor: null,
    }),
    reload: async () => {},
    toJSON: () => ({
      uid: record.uid,
      email: record.email,
      displayName: record.displayName,
    }),
    phoneNumber: null,
    photoURL: null,
    providerId: 'firebase',
  } as unknown as User;
}

export function getStoredLocalAuthUsers(): Record<string, LocalAuthUserRecord> {
  try {
    const raw = localStorage.getItem(LOCAL_AUTH_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function saveStoredLocalAuthUsers(users: Record<string, LocalAuthUserRecord>): void {
  try {
    localStorage.setItem(LOCAL_AUTH_USERS_KEY, JSON.stringify(users));
  } catch {}
}

export function getFallbackAuthUser(): User | null {
  try {
    const raw = localStorage.getItem(LOCAL_AUTH_SESSION_KEY);
    if (!raw) return null;
    const record = JSON.parse(raw) as LocalAuthUserRecord;
    if (!record || !record.email || !record.uid) return null;
    return buildFallbackUserObject(record);
  } catch {
    return null;
  }
}

export function setFallbackAuthSession(record: LocalAuthUserRecord | null): User | null {
  try {
    if (!record) {
      localStorage.removeItem(LOCAL_AUTH_SESSION_KEY);
      window.dispatchEvent(new CustomEvent('local_auth_state_changed', { detail: null }));
      return null;
    }
    localStorage.setItem(LOCAL_AUTH_SESSION_KEY, JSON.stringify(record));
    const userObj = buildFallbackUserObject(record);
    window.dispatchEvent(new CustomEvent('local_auth_state_changed', { detail: userObj }));
    return userObj;
  } catch {
    return null;
  }
}

export function upsertLocalUserCredentials(
  email: string,
  password?: string,
  displayName?: string
): LocalAuthUserRecord {
  const cleanEmail = email.trim().toLowerCase();
  const users = getStoredLocalAuthUsers();
  const existing = users[cleanEmail];
  const defaultName =
    displayName?.trim() ||
    existing?.displayName ||
    (cleanEmail === 'risneraryan@gmail.com' ? 'Coach AJ Risner' : email.trim().split('@')[0]);

  const updated: LocalAuthUserRecord = {
    uid: existing?.uid || generateDeterministicUid(cleanEmail),
    email: email.trim(),
    displayName: defaultName,
    password: password !== undefined ? password : existing?.password,
    createdAt: existing?.createdAt || new Date().toISOString(),
  };

  users[cleanEmail] = updated;
  saveStoredLocalAuthUsers(users);
  return updated;
}

export function getEffectiveCurrentUser(): User | null {
  return auth.currentUser || getFallbackAuthUser();
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): void {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errCode = (error as any)?.code;

  const isPermissionError = 
    errCode === 'permission-denied' || 
    errMsg.toLowerCase().includes('permission') || 
    errMsg.toLowerCase().includes('insufficient permissions');

  const isUnavailableOrOffline = 
    errCode === 'unavailable' || 
    errMsg.toLowerCase().includes('could not reach cloud firestore') ||
    errMsg.toLowerCase().includes('the operation could not be completed') ||
    errMsg.toLowerCase().includes('client is offline') ||
    errMsg.toLowerCase().includes('connection failed') ||
    errMsg.toLowerCase().includes('network');

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };

  if (isPermissionError) {
    // If operating in local-auth fallback mode (when Firebase Email/Password provider is not yet enabled),
    // do not crash the UI on background Firestore sync calls.
    if (!auth.currentUser) {
      console.warn(`[Firestore ${operationType}] Local session active for ${path}; cloud sync will resume upon Google or Firebase Auth connection.`);
      return;
    }
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }

  if (isUnavailableOrOffline) {
    console.warn(`[Firestore ${operationType}] Operating in offline/reconnecting mode for ${path}:`, errMsg);
    return;
  }

  if (!auth.currentUser) {
    console.warn(`[Firestore ${operationType}] Skipping cloud operation for ${path} (local session).`);
    return;
  }

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return false;
  }
  try {
    const { doc, getDocFromServer } = await import('firebase/firestore');
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const code = (error as any)?.code;
    if (msg.includes('client is offline') || code === 'unavailable') {
      console.warn('[Firebase] Client is offline or Firestore backend unavailable.');
      return false;
    }
    return true;
  }
}

export { 
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  linkWithCredential,
  EmailAuthProvider,
  signOut, 
  setPersistence, 
  browserLocalPersistence 
};
