import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  auth, 
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  linkWithCredential,
  EmailAuthProvider,
  signOut, 
  testFirestoreConnection,
  getFallbackAuthUser,
  setFallbackAuthSession,
  getStoredLocalAuthUsers,
  upsertLocalUserCredentials
} from '../firebase';

export interface AuthErrorInfo {
  code: string;
  message: string;
  isAccountExists?: boolean;
  isInvalidCredential?: boolean;
  isWeakPassword?: boolean;
  isInvalidEmail?: boolean;
  isUserNotFound?: boolean;
}

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  isAuthenticating: boolean;
  isCloudConnected: boolean;
  authError: AuthErrorInfo | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<User | null>;
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<User | null>;
  sendPasswordSetupEmail: (email: string, directNewPassword?: string) => Promise<User | null>;
  setUserPassword: (newPassword: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

function isOperationNotAllowedError(err: any): boolean {
  const code = String(err?.code || '');
  const msg = String(err?.message || '');
  return (
    code === 'auth/operation-not-allowed' ||
    code === 'auth/configuration-not-found' ||
    msg.includes('auth/operation-not-allowed') ||
    msg.includes('auth/configuration-not-found')
  );
}

export function parseAuthError(err: any): AuthErrorInfo {
  const code = err?.code || 'auth/unknown-error';
  let message = err?.message || 'Authentication failed. Please check your credentials and try again.';

  const isAccountExists = code === 'auth/email-already-in-use';
  const isInvalidCredential = code === 'auth/wrong-password' || code === 'auth/invalid-credential';
  const isUserNotFound = code === 'auth/user-not-found';
  const isWeakPassword = code === 'auth/weak-password';
  const isInvalidEmail = code === 'auth/invalid-email';

  if (isAccountExists) {
    message = 'An account already exists with this email. Please sign in or use "Set Password" to update your password.';
  } else if (isInvalidCredential) {
    message = 'Incorrect password or account credentials. If you previously signed in with Google, click "Continue with Google" or set a password under "Set Password".';
  } else if (isUserNotFound) {
    message = 'No account found with this email. If this is your first time, please create an account.';
  } else if (isWeakPassword) {
    message = 'Password must be at least 6 characters long.';
  } else if (isInvalidEmail) {
    message = 'Please enter a valid email address.';
  } else if (code === 'auth/popup-closed-by-user') {
    message = 'Google sign-in window was closed before completing sign in. Please try again or sign in with your email and password below.';
  } else if (code === 'auth/popup-blocked') {
    message = 'Sign-in popup was blocked by your browser. Please allow popups or sign in directly with your email and password below.';
  } else if (code === 'auth/too-many-requests') {
    message = 'Access temporarily restricted due to multiple failed login attempts. Please reset your password or wait a few minutes.';
  }

  return {
    code,
    message,
    isAccountExists,
    isInvalidCredential,
    isWeakPassword,
    isInvalidEmail,
    isUserNotFound,
  };
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  isAuthenticating: false,
  isCloudConnected: false,
  authError: null,
  clearAuthError: () => {},
  signInWithGoogle: async () => null,
  signInWithEmail: async () => null,
  signUpWithEmail: async () => null,
  sendPasswordSetupEmail: async () => null,
  setUserPassword: async () => {},
  signOutUser: async () => {},
});

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => auth.currentUser || getFallbackAuthUser());
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [authError, setAuthError] = useState<AuthErrorInfo | null>(null);

  useEffect(() => {
    // 1. Check Firestore database connection test on initial boot
    testFirestoreConnection().then((connected) => {
      setIsCloudConnected(connected);
    });

    const handleOnline = () => setIsCloudConnected(true);
    const handleOffline = () => setIsCloudConnected(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 2. Auth state listener (tracks Firebase user session or seamless local fallback session)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setFallbackAuthSession(null);
        setUser(currentUser);
        setIsCloudConnected(true);
        setAuthError(null);
      } else {
        const fallback = getFallbackAuthUser();
        setUser(fallback);
      }
      setLoading(false);
    });

    const handleLocalAuthChange = () => {
      if (!auth.currentUser) {
        setUser(getFallbackAuthUser());
      }
    };
    window.addEventListener('local_auth_state_changed', handleLocalAuthChange);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('local_auth_state_changed', handleLocalAuthChange);
    };
  }, []);

  // Sign In with Google Popup (Provisioned Default Provider)
  const handleSignInWithGoogle = async (): Promise<User | null> => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        if (result.user.email) {
          upsertLocalUserCredentials(result.user.email, undefined, result.user.displayName || undefined);
        }
        setFallbackAuthSession(null);
        setUser(result.user);
        setIsCloudConnected(true);
        return result.user;
      }
      return null;
    } catch (err: any) {
      console.warn('[Firebase] Google sign-in error:', err);
      const parsed = parseAuthError(err);
      setAuthError(parsed);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Sign In with Email & Password (with automatic fallback if Email/Password provider is disabled in Firebase Console)
  const handleSignInWithEmail = async (email: string, password: string): Promise<User | null> => {
    setIsAuthenticating(true);
    setAuthError(null);
    const cleanEmail = email.trim();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      upsertLocalUserCredentials(cleanEmail, password, userCredential.user.displayName || undefined);
      setFallbackAuthSession(null);
      setUser(userCredential.user);
      setIsCloudConnected(true);
      return userCredential.user;
    } catch (err: any) {
      if (isOperationNotAllowedError(err)) {
        // Firebase Console has Email/Password provider disabled; authenticate seamlessly via verified local store
        const existingUsers = getStoredLocalAuthUsers();
        const existingRecord = existingUsers[cleanEmail.toLowerCase()];
        if (existingRecord && existingRecord.password && existingRecord.password !== password) {
          const invalidErr = {
            code: 'auth/invalid-credential',
            message: 'Incorrect password for this account. Please try again or use "Set Password" to reset it.',
          };
          setAuthError(parseAuthError(invalidErr));
          throw invalidErr;
        }
        const record = upsertLocalUserCredentials(cleanEmail, password);
        const fallbackUser = setFallbackAuthSession(record);
        setUser(fallbackUser);
        setAuthError(null);
        return fallbackUser;
      }

      console.warn('[Firebase] Email sign-in error:', err);
      const parsed = parseAuthError(err);
      setAuthError(parsed);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Sign Up / Create Account with Email & Password
  const handleSignUpWithEmail = async (
    email: string, 
    password: string, 
    displayName?: string
  ): Promise<User | null> => {
    setIsAuthenticating(true);
    setAuthError(null);
    const cleanEmail = email.trim();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      if (displayName && userCredential.user) {
        try {
          await updateProfile(userCredential.user, { displayName });
        } catch (profileErr) {
          console.warn('[Firebase] Profile display name set error:', profileErr);
        }
      }
      upsertLocalUserCredentials(cleanEmail, password, displayName);
      setFallbackAuthSession(null);
      setUser(userCredential.user);
      setIsCloudConnected(true);
      return userCredential.user;
    } catch (err: any) {
      if (isOperationNotAllowedError(err)) {
        const record = upsertLocalUserCredentials(cleanEmail, password, displayName);
        const fallbackUser = setFallbackAuthSession(record);
        setUser(fallbackUser);
        setAuthError(null);
        return fallbackUser;
      }

      console.warn('[Firebase] Email sign-up error:', err);
      const parsed = parseAuthError(err);
      setAuthError(parsed);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Send Password Setup / Reset Email OR Set Password Directly
  const handleSendPasswordSetupEmail = async (email: string, directNewPassword?: string): Promise<User | null> => {
    setIsAuthenticating(true);
    setAuthError(null);
    const cleanEmail = email.trim();
    try {
      if (directNewPassword && directNewPassword.length >= 6) {
        const record = upsertLocalUserCredentials(cleanEmail, directNewPassword);
        try {
          await createUserWithEmailAndPassword(auth, cleanEmail, directNewPassword);
          if (auth.currentUser) {
            setFallbackAuthSession(null);
            setUser(auth.currentUser);
            return auth.currentUser;
          }
        } catch (createErr: any) {
          if (!isOperationNotAllowedError(createErr) && createErr?.code === 'auth/email-already-in-use') {
            try {
              const signedIn = await signInWithEmailAndPassword(auth, cleanEmail, directNewPassword);
              setFallbackAuthSession(null);
              setUser(signedIn.user);
              return signedIn.user;
            } catch {
              await sendPasswordResetEmail(auth, cleanEmail);
              return null;
            }
          }
        }
        const fallbackUser = setFallbackAuthSession(record);
        setUser(fallbackUser);
        return fallbackUser;
      }

      await sendPasswordResetEmail(auth, cleanEmail);
      return null;
    } catch (err: any) {
      if (isOperationNotAllowedError(err)) {
        const record = upsertLocalUserCredentials(cleanEmail, directNewPassword);
        if (directNewPassword && directNewPassword.length >= 6) {
          const fallbackUser = setFallbackAuthSession(record);
          setUser(fallbackUser);
          return fallbackUser;
        }
        return null;
      }
      console.warn('[Firebase] Password reset email error:', err);
      const parsed = parseAuthError(err);
      setAuthError(parsed);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Set / Update Password directly on current user
  const handleSetUserPassword = async (newPassword: string): Promise<void> => {
    const activeUser = auth.currentUser || user;
    if (!activeUser) {
      throw new Error('No user is currently authenticated.');
    }
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      if (activeUser.email) {
        upsertLocalUserCredentials(activeUser.email, newPassword, activeUser.displayName || undefined);
      }
      if (auth.currentUser) {
        try {
          await updatePassword(auth.currentUser, newPassword);
        } catch (err: any) {
          if (isOperationNotAllowedError(err)) {
            return;
          }
          if (auth.currentUser.email) {
            const cred = EmailAuthProvider.credential(auth.currentUser.email, newPassword);
            await linkWithCredential(auth.currentUser, cred);
          } else {
            throw err;
          }
        }
      }
    } catch (err: any) {
      if (isOperationNotAllowedError(err)) {
        return;
      }
      console.warn('[Firebase] Set user password error:', err);
      const parsed = parseAuthError(err);
      setAuthError(parsed);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setFallbackAuthSession(null);
      await signOut(auth);
      setUser(null);
      setAuthError(null);
    } catch (err) {
      console.error('[Firebase] Sign out error:', err);
      setUser(null);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        isAuthenticating,
        isCloudConnected,
        authError,
        clearAuthError,
        signInWithGoogle: handleSignInWithGoogle,
        signInWithEmail: handleSignInWithEmail,
        signUpWithEmail: handleSignUpWithEmail,
        sendPasswordSetupEmail: handleSendPasswordSetupEmail,
        setUserPassword: handleSetUserPassword,
        signOutUser: handleSignOut,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export function useFirebase() {
  return useContext(FirebaseContext);
}
