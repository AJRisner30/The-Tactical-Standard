import { MuscleGroup, ProgramKey, WorkoutFormat, WorkoutProgram, ExerciseTemplate, SupersetMovementItem } from '../types';
import { ProtocolDay } from '../data/protocolData';

/**
 * Unified TrackId supporting all 6 of Coach AJ's master programs,
 * athlete-adapted AI programs (`custom_ai`), and coach-published programs (`coach:<id>`).
 */
export type BuiltInTrackId =
  | 'hybrid_db'
  | 'apex_protocol'
  | 'tactical_hypertrophy'
  | 'hybrid_protocol'
  | 'aft_protocol'
  | 'universal_pat';

export type TrackId = BuiltInTrackId | 'custom_ai' | `coach:${string}` | string;

export type TrackCategory =
  | 'Hybrid'
  | 'Military'
  | 'LEO'
  | 'Conditioning'
  | 'Rehab'
  | 'Express'
  | 'Hypertrophy'
  | 'Custom'
  | 'Coach';

export type VolumeTier = 'standard' | 'high_volume';

export type ConstraintMode = 'full_duty' | 'low_impact_rehab' | 'minimal_gear';

export type MovementMetricType =
  | 'load_pr'
  | 'bodyweight_reps'
  | 'time_trial'
  | 'erg_split'
  | 'carry_load';

export type BlockType =
  | 'Strength'
  | 'Power'
  | 'Engine'
  | 'Accessory'
  | 'Carry'
  | 'Core'
  | 'Mobility'
  | 'Superset'
  | 'Conditioning';

export interface ExerciseConstraintSwap {
  movement_id: string;
  name: string;
  reps?: string;
  setsDelta?: number;
  notes: string;
  reason: string;
  muscleGroup?: MuscleGroup;
}

export interface PrescribedExercise {
  id: string;
  /** Global canonical movement identifier — decouples user PRs from track_id */
  movement_id: string;
  name: string;
  blockType: BlockType;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: string;
  targetRpe: number;
  restSeconds: number;
  /** Optional % of estimated 1RM used to auto-calculate prescribed working weight */
  loadPercent1RM?: number;
  /** True for accessory/assistance work that trims ~20-25% volume in Standard tier */
  isAccessory?: boolean;
  /** True for high-impact or deep-flexion movements flagged during Low-Impact mode */
  isHighImpact?: boolean;
  notes: string;
  lowImpactSwap?: ExerciseConstraintSwap;
  minimalGearSwap?: ExerciseConstraintSwap;
  /** Real program metadata for faithful workout launch & display */
  format?: WorkoutFormat;
  supersetExercises?: SupersetMovementItem[];
  isEasyRun?: boolean;
  isIntervalRun?: boolean;
  isCarryDistance?: boolean;
  isBodyweight?: boolean;
  distanceMiles?: number;
  pace?: string;
  sourceTemplate?: ExerciseTemplate;
}

export interface CardioPrescription {
  run: string;
  pace: string;
  isRest: boolean;
  isEasyRun: boolean;
  isInterval: boolean;
  intervalSets?: number;
  intervalReps?: string;
  distanceMiles?: number;
  wasSwapped?: boolean;
  originalRun?: string;
  swapReason?: string;
  runSkippedByUnitPt?: boolean;
}

export interface WorkoutSession {
  id: string;
  /** 1-based sequential day number (Day 1, Day 2, Day 3...) — never bound to Mon-Sun */
  dayNumber: number;
  title: string;
  focus: string;
  estimatedMinutes: number;
  /** Optional flag indicating this day is only mandatory in High Volume tier */
  highVolumeOnly?: boolean;
  isRestDay?: boolean;
  warmupSummary: string;
  conditioningSummary?: string;
  cardio?: CardioPrescription;
  operationalNote?: string;
  exercises: PrescribedExercise[];
  rawProtocolDay?: ProtocolDay;
}

export interface TrackMesocyclePhase {
  id: string;
  label: string;
  weeksLabel: string;
  badge: string;
  weekRange: number[];
  defaultWeek: number;
}

export interface TrainingTrack {
  id: TrackId;
  badge: string;
  category: TrackCategory;
  title: string;
  focusSummary: string;
  frequencyLabel: string;
  totalWeeks: number;
  standardDaysPerWeek: number;
  highVolumeDaysPerWeek: number;
  avgDurationMinutes: number;
  equipment: string[];
  accentColor: 'amber' | 'emerald' | 'sky';
  /** Maps to the full multi-week protocol library */
  linkedProgramKey: ProgramKey | 'custom_ai';
  recommendedWarmupId: string;
  isCoachPreferred?: boolean;
  isCustom?: boolean;
  isCoachPublished?: boolean;
  coachProgramId?: string;
  isDraft?: boolean;
  sourceProgram?: WorkoutProgram;
  mesocycles?: TrackMesocyclePhase[];
  splitSummary: string[];
  sessions: WorkoutSession[];
}

/**
 * Decoupled active program state (`user_active_program` store/collection).
 * Switching `active_track_id` never deletes or resets `GlobalBenchmarkLog` history.
 */
export interface UserProgramState {
  user_id: string;
  active_track_id: TrackId;
  volume_tier: VolumeTier;
  constraint_mode: ConstraintMode;
  /** Non-punitive sequential progression index (Day 1, Day 2, Day 3...) */
  sequential_day_index: number;
  completed_sessions_count: number;
  last_completed_date?: string;
  updated_at: string;
}

export interface BenchmarkHistoryEntry {
  date: string;
  weight_lbs?: number;
  reps?: number;
  time_seconds?: number;
  distance_meters?: number;
  rpe?: number;
  notes?: string;
}

/**
 * Decoupled global performance history (`user_benchmarks_and_logs` store/collection).
 * Keyed strictly by `user_id` + `movement_id`, NEVER `track_id`.
 */
export interface GlobalBenchmarkLog {
  id: string;
  user_id: string;
  movement_id: string;
  movement_name: string;
  metric_type: MovementMetricType;
  best_weight_lbs?: number;
  best_reps?: number;
  estimated_1rm_lbs?: number;
  best_time_seconds?: number;
  best_time_formatted?: string;
  best_distance_meters?: number;
  last_rpe?: number;
  last_logged_date: string;
  session_count: number;
  history: BenchmarkHistoryEntry[];
  updated_at: string;
}

export interface TransformedExercise extends PrescribedExercise {
  originalSets: number;
  originalName?: string;
  wasVolumeTrimmed: boolean;
  wasSwapped: boolean;
  swapReason?: string;
  benchmark?: GlobalBenchmarkLog;
  prescribedWeightLbs?: number;
}

export interface TransformedWorkoutSession {
  trackId: TrackId;
  trackTitle: string;
  weekNumber: number;
  totalWeeks: number;
  phaseTitle: string;
  phaseWeeksLabel: string;
  phaseDescription?: string;
  dayInWeek: number;
  sequentialDayIndex: number;
  totalCycleDays: number;
  isRestDay: boolean;
  session: WorkoutSession;
  exercises: TransformedExercise[];
  cardio?: CardioPrescription;
  totalSetsOriginal: number;
  totalSetsAdjusted: number;
  volumeReductionPct: number;
  swappedCount: number;
  estimatedMinutes: number;
}

export interface FlexBlockExerciseAdaptation {
  movement_id: string;
  name: string;
  blockType: BlockType;
  sets: number;
  reps: string;
  targetRpe: number;
  restSeconds: number;
  prescribedLoadNote?: string;
  notes: string;
  adaptationReason?: string;
}

export interface FlexBlockAdaptationResult {
  title: string;
  rationale: string;
  estimatedMinutes: number;
  volumeTier: VolumeTier;
  constraintMode: ConstraintMode;
  trackId: TrackId;
  sequentialDayIndex: number;
  exercises: FlexBlockExerciseAdaptation[];
  generatedAt: string;
}
