import {
  collection,
  doc,
  setDoc,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { sanitizeForFirestore } from './firebaseSync';
import {
  UserProgramState,
  GlobalBenchmarkLog,
  TrackId,
} from '../types/trainingTracks';
import { normalizeTrackId } from '../data/programTrackAdapter';

const ACTIVE_PROGRAM_STORAGE_KEY = 'tts_user_active_program_v2';
const LEGACY_ACTIVE_PROGRAM_STORAGE_KEY = 'tts_user_active_program_v1';
const BENCHMARKS_STORAGE_KEY = 'tts_user_benchmarks_and_logs_v2';
const LEGACY_BENCHMARKS_STORAGE_KEY = 'tts_user_benchmarks_and_logs_v1';

export function getDefaultUserProgramState(userId: string, preferredTrackId?: TrackId): UserProgramState {
  return {
    user_id: userId,
    active_track_id: normalizeTrackId(preferredTrackId || 'hybrid_db'),
    volume_tier: 'standard',
    constraint_mode: 'full_duty',
    sequential_day_index: 1,
    completed_sessions_count: 0,
    updated_at: new Date().toISOString(),
  };
}

export function loadLocalUserProgramState(userId: string, fallbackTrackId?: TrackId): UserProgramState {
  if (typeof window === 'undefined') return getDefaultUserProgramState(userId, fallbackTrackId);
  try {
    const raw =
      localStorage.getItem(`${ACTIVE_PROGRAM_STORAGE_KEY}_${userId}`) ||
      localStorage.getItem(`${LEGACY_ACTIVE_PROGRAM_STORAGE_KEY}_${userId}`);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UserProgramState>;
      if (parsed && parsed.active_track_id) {
        return {
          ...getDefaultUserProgramState(userId, fallbackTrackId),
          ...parsed,
          active_track_id: normalizeTrackId(parsed.active_track_id),
          user_id: userId,
        };
      }
    }
  } catch {}
  return getDefaultUserProgramState(userId, fallbackTrackId);
}

export function saveLocalUserProgramState(state: UserProgramState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${ACTIVE_PROGRAM_STORAGE_KEY}_${state.user_id}`, JSON.stringify(state));
  } catch {}
}

export function loadLocalGlobalBenchmarks(userId: string): GlobalBenchmarkLog[] {
  if (typeof window === 'undefined') return [];
  try {
    // Purge legacy v1 cache that previously contained pre-seeded fake PRs
    localStorage.removeItem(`${LEGACY_BENCHMARKS_STORAGE_KEY}_${userId}`);
    const raw = localStorage.getItem(`${BENCHMARKS_STORAGE_KEY}_${userId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return (parsed as GlobalBenchmarkLog[]).filter(
          (bm) =>
            (bm.best_weight_lbs && bm.best_weight_lbs > 0) ||
            (bm.best_reps && bm.best_reps > 0) ||
            (bm.estimated_1rm_lbs && bm.estimated_1rm_lbs > 0) ||
            (bm.best_time_seconds && bm.best_time_seconds > 0)
        );
      }
    }
  } catch {}
  return [];
}

export function saveLocalGlobalBenchmarks(userId: string, benchmarks: GlobalBenchmarkLog[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${BENCHMARKS_STORAGE_KEY}_${userId}`, JSON.stringify(benchmarks));
  } catch {}
}

/**
 * Persists `user_active_program` to Firestore (decoupled from user performance history).
 */
export async function saveUserActiveProgramToFirestore(state: UserProgramState): Promise<void> {
  saveLocalUserProgramState(state);
  if (!auth.currentUser || auth.currentUser.uid !== state.user_id) {
    return;
  }
  const path = `user_active_program/${state.user_id}`;
  try {
    const normalizedTrack = normalizeTrackId(state.active_track_id).slice(0, 100);
    const payload = sanitizeForFirestore({
      user_id: state.user_id,
      active_track_id: normalizedTrack,
      volume_tier: state.volume_tier,
      constraint_mode: state.constraint_mode,
      sequential_day_index: Math.max(1, Math.min(3650, Math.round(state.sequential_day_index))),
      completed_sessions_count: Math.max(0, Math.min(10000, Math.round(state.completed_sessions_count || 0))),
      last_completed_date: state.last_completed_date || null,
      updated_at: new Date().toISOString(),
    });
    await setDoc(doc(db, 'user_active_program', state.user_id), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribes in real time to `user_active_program/{userId}`.
 */
export function subscribeToUserActiveProgram(
  userId: string,
  onState: (state: UserProgramState) => void
): Unsubscribe {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return () => {};
  }
  const path = `user_active_program/${userId}`;
  try {
    return onSnapshot(
      doc(db, 'user_active_program', userId),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const hydrated: UserProgramState = {
            user_id: userId,
            active_track_id: normalizeTrackId(data.active_track_id as string),
            volume_tier: data.volume_tier === 'high_volume' ? 'high_volume' : 'standard',
            constraint_mode:
              data.constraint_mode === 'low_impact_rehab' || data.constraint_mode === 'minimal_gear'
                ? data.constraint_mode
                : 'full_duty',
            sequential_day_index: typeof data.sequential_day_index === 'number' ? data.sequential_day_index : 1,
            completed_sessions_count: typeof data.completed_sessions_count === 'number' ? data.completed_sessions_count : 0,
            last_completed_date: data.last_completed_date || undefined,
            updated_at: data.updated_at || new Date().toISOString(),
          };
          saveLocalUserProgramState(hydrated);
          onState(hydrated);
        }
      },
      (error) => {
        console.warn('[Firebase] user_active_program subscription note:', error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

/**
 * Persists a single global benchmark entry in `user_benchmarks_and_logs/{docId}`
 * keyed strictly by `user_id` + `movement_id` (NEVER `track_id`).
 */
export async function saveGlobalBenchmarkToFirestore(benchmark: GlobalBenchmarkLog): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== benchmark.user_id) {
    return;
  }
  const safeMovementId = benchmark.movement_id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
  const docId = `${benchmark.user_id}_${safeMovementId}`.slice(0, 128);
  const path = `user_benchmarks_and_logs/${docId}`;
  try {
    const payload = sanitizeForFirestore({
      id: docId,
      user_id: benchmark.user_id,
      movement_id: safeMovementId,
      movement_name: benchmark.movement_name.slice(0, 120),
      metric_type: benchmark.metric_type,
      best_weight_lbs: typeof benchmark.best_weight_lbs === 'number' ? benchmark.best_weight_lbs : null,
      best_reps: typeof benchmark.best_reps === 'number' ? benchmark.best_reps : null,
      estimated_1rm_lbs: typeof benchmark.estimated_1rm_lbs === 'number' ? benchmark.estimated_1rm_lbs : null,
      best_time_seconds: typeof benchmark.best_time_seconds === 'number' ? benchmark.best_time_seconds : null,
      best_time_formatted: benchmark.best_time_formatted ? benchmark.best_time_formatted.slice(0, 24) : null,
      best_distance_meters: typeof benchmark.best_distance_meters === 'number' ? benchmark.best_distance_meters : null,
      last_rpe: typeof benchmark.last_rpe === 'number' ? benchmark.last_rpe : null,
      last_logged_date: benchmark.last_logged_date.slice(0, 30),
      session_count: Math.max(1, Math.round(benchmark.session_count || 1)),
      history: (benchmark.history || []).slice(-30),
      updated_at: new Date().toISOString(),
    });
    await setDoc(doc(db, 'user_benchmarks_and_logs', docId), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribes in real time to all global benchmarks for the authenticated user.
 */
export function subscribeToUserGlobalBenchmarks(
  userId: string,
  onBenchmarks: (benchmarks: GlobalBenchmarkLog[]) => void
): Unsubscribe {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return () => {};
  }
  const path = 'user_benchmarks_and_logs';
  try {
    const q = query(collection(db, path), where('user_id', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onBenchmarks([]);
          return;
        }
        const incoming: GlobalBenchmarkLog[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          const hasRealValue =
            (typeof d.best_weight_lbs === 'number' && d.best_weight_lbs > 0) ||
            (typeof d.best_reps === 'number' && d.best_reps > 0) ||
            (typeof d.estimated_1rm_lbs === 'number' && d.estimated_1rm_lbs > 0) ||
            (typeof d.best_time_seconds === 'number' && d.best_time_seconds > 0);
          if (!hasRealValue) return;
          incoming.push({
            id: docSnap.id,
            user_id: d.user_id,
            movement_id: d.movement_id,
            movement_name: d.movement_name,
            metric_type: d.metric_type || 'load_pr',
            best_weight_lbs: typeof d.best_weight_lbs === 'number' ? d.best_weight_lbs : undefined,
            best_reps: typeof d.best_reps === 'number' ? d.best_reps : undefined,
            estimated_1rm_lbs: typeof d.estimated_1rm_lbs === 'number' ? d.estimated_1rm_lbs : undefined,
            best_time_seconds: typeof d.best_time_seconds === 'number' ? d.best_time_seconds : undefined,
            best_time_formatted: d.best_time_formatted || undefined,
            best_distance_meters: typeof d.best_distance_meters === 'number' ? d.best_distance_meters : undefined,
            last_rpe: typeof d.last_rpe === 'number' ? d.last_rpe : undefined,
            last_logged_date: d.last_logged_date || new Date().toISOString().split('T')[0],
            session_count: typeof d.session_count === 'number' ? d.session_count : 1,
            history: Array.isArray(d.history) ? d.history : [],
            updated_at: d.updated_at || new Date().toISOString(),
          });
        });
        onBenchmarks(incoming);
      },
      (error) => {
        console.warn('[Firebase] user_benchmarks_and_logs subscription note:', error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}
