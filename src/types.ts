export * from './types/trainingTracks';

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Quads'
  | 'Hamstrings & Glutes'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Full Body';

export interface ProgressionRule {
  metric: string;
  trigger: string;
  increment_value: number;
  action?: string;
}

export type WorkoutFormat = 'straight' | 'superset' | 'emom' | 'amrap' | 'circuit';

export interface SupersetMovementItem {
  name: string;
  targetReps: string;
  muscleGroup?: MuscleGroup;
  weight_lbs?: number;
  notes?: string;
  originalExerciseName?: string;
  adaptationReason?: string;
}

export interface BlockMovementItem {
  name: string;
  targetReps: string;
  muscleGroup?: MuscleGroup;
  notes?: string;
  originalExerciseName?: string;
  adaptationReason?: string;
}

export interface ProgramScheduleDay {
  day: number;
  focus: string;
  warmup?: string;
  conditioning?: string;
  isRestDay?: boolean;
  exercises: ExerciseTemplate[];
}

export interface ExerciseTemplate {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  defaultSets: number;
  targetReps: string;
  targetRpe?: number;
  restPeriodSeconds: number; // e.g. 90
  notes?: string;
  videoGuide?: string;
  type?: 'strength' | 'cardio' | 'core' | 'circuit' | 'superset' | 'emom' | 'amrap';
  format?: WorkoutFormat;
  supersetExercises?: SupersetMovementItem[];
  emomMinutes?: number;
  emomIntervalSeconds?: number;
  emomMovements?: BlockMovementItem[];
  amrapDurationMinutes?: number;
  amrapMovements?: BlockMovementItem[];
  circuitStations?: string[];
  workSeconds?: number;
  restSeconds?: number;
  distance_miles?: number;
  weight_lbs?: number;
  pace?: string;
  progression_rules?: ProgressionRule;
  originalExerciseName?: string;
  adaptationReason?: string;
  scalingNote?: string;
}

export interface WorkoutProgram {
  id: string;
  title: string;
  subtitle: string;
  category: 'Strength' | 'Hypertrophy' | 'Athletic Conditioning' | 'Power' | 'Hybrid';
  frequency: string;
  estimatedDurationMinutes: number;
  description: string;
  recommendedWarmupId?: string;
  exercises: ExerciseTemplate[];
  schedule?: ProgramScheduleDay[];
  baseProgramKey?: string;
  programKind?: 'program' | 'single_workout';
  isCoachPublished?: boolean;
  isPublished?: boolean;
  allowAiAdaptation?: boolean;
  createdByEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupersetLiveEntry {
  name: string;
  muscleGroup?: MuscleGroup;
  weightLbs: number;
  reps: number;
  targetReps?: string;
  prevWeightLbs?: number;
  prevReps?: number;
  isBodyweight?: boolean;
  isTimed?: boolean;
  isCarryDistance?: boolean;
  distanceMeters?: number;
  prevDistanceMeters?: number;
  timeSeconds?: number;
  timeFormatted?: string;
  targetHoldSeconds?: number;
}

export interface LiveSet {
  id: string;
  setNumber: number;
  weightLbs: number;
  reps: number;
  timeSeconds?: number;
  timeFormatted?: string; // e.g. "30:00", "45s", "08:15", "01:25"
  distanceMiles?: number;
  distanceMeters?: number;
  rpe?: number;
  completed: boolean;
  restSeconds: number;
  prevWeightLbs?: number;
  prevReps?: number;
  prevTimeFormatted?: string;
  prevDistanceMiles?: number;
  prevDistanceMeters?: number;
  isTimed?: boolean;
  supersetEntries?: SupersetLiveEntry[];
  amrapRoundsCompleted?: number;
  amrapExtraReps?: number;
  emomRoundsCompleted?: number;
}

export interface AutoOverloadRecommendation {
  exerciseName: string;
  hasPreviousData: boolean;
  lastSessionDate?: string;
  previousWeightLbs: number;
  recommendedWeightLbs: number;
  incrementLbs: number;
  previousReps: number;
  recommendedReps?: number;
  repRangeMin?: number;
  repRangeMax?: number;
  recommendedSets?: number;
  setRangeMin?: number;
  setRangeMax?: number;
  targetRepsText?: string;
  lastRpe?: number;
  status: 'overload_applied' | 'rep_progression' | 'set_progression' | 'maintain' | 'baseline';
  reason: string;
  isLowerBodyCompound: boolean;
  isUpperBodyCompound: boolean;
  isDumbbell: boolean;
  isTimed: boolean;
  previousTimeFormatted?: string;
  recommendedTimeFormatted?: string;
}

export interface LiveExerciseSession {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  restPeriodSeconds: number;
  notes?: string;
  targetReps?: string;
  targetRpe?: number;
  progressionRules?: ProgressionRule;
  isTimed?: boolean;
  isBodyweight?: boolean;
  isCarryDistance?: boolean;
  isIntervalRun?: boolean;
  hasDistance?: boolean;
  targetHoldSeconds?: number;
  format?: WorkoutFormat;
  supersetExercises?: SupersetMovementItem[];
  emomMinutes?: number;
  emomIntervalSeconds?: number;
  emomMovements?: BlockMovementItem[];
  amrapDurationMinutes?: number;
  amrapMovements?: BlockMovementItem[];
  circuitStations?: string[];
  workSeconds?: number;
  restSeconds?: number;
  distanceMiles?: number;
  distance_miles?: number;
  autoOverload?: AutoOverloadRecommendation;
  sets: LiveSet[];
}

export interface WorkoutSessionLog {
  id: string;
  athleteId?: string;
  athleteName?: string;
  userEmail?: string;
  isCoachLog?: boolean;
  userId?: string;
  programId?: string;
  workoutTitle: string;
  date: string; // ISO format YYYY-MM-DD
  startTime: string;
  endTime: string;
  durationMinutes: number;
  totalVolumeLbs: number;
  totalSetsCompleted: number;
  rating?: number; // 1-5
  notes?: string;
  exercises: {
    exerciseName: string;
    muscleGroup: MuscleGroup;
    isTimed?: boolean;
    isCarryDistance?: boolean;
    isIntervalRun?: boolean;
    format?: WorkoutFormat;
    supersetGroupName?: string;
    sets: {
      setNumber: number;
      weightLbs: number;
      reps: number;
      timeSeconds?: number;
      timeFormatted?: string;
      distanceMiles?: number;
      distanceMeters?: number;
      isTimed?: boolean;
      rpe?: number;
      estimated1RM: number;
      amrapRoundsCompleted?: number;
      amrapExtraReps?: number;
      emomRoundsCompleted?: number;
      supersetEntries?: SupersetLiveEntry[];
    }[];
  }[];
}

export type ProgramKey = 'apex_protocol' | 'tactical_hypertrophy' | 'hybrid_protocol' | 'hybrid_db' | 'universal_pat' | 'aft_protocol' | 'custom_ai';

export interface QuestionnaireAnswers {
  completedAt: string;
  pushUpScore: 'under_15' | '15_to_30' | '30_to_50' | 'over_50';
  pullUpScore: 'zero' | '1_to_5' | '6_to_12' | 'over_12';
  aerobicScore: 'under_1_mile' | '13_to_16_min' | '10_30_to_13_min' | 'sub_10_30';
  equipmentAccess: 'bodyweight_dumbbells' | 'full_tactical_gym' | 'basic_station_gym';
  liftingExperience: 'beginner' | 'intermediate' | 'advanced_tactical';
  weeklyDays: 3 | 4 | 5 | 6;
  primaryGoalCategory: 
    | 'tactical_duty_readiness' 
    | 'muscle_armor_hypertrophy' 
    | 'hybrid_strength_running' 
    | 'station_db_minimal' 
    | 'complete_apex_peak'
    | 'universal_pat_testing'
    | 'aft_specific_testing'
    | 'custom_ai_individualized';
  preparingForPat?: 'yes_upcoming_pat' | 'no_general_tactical';
  injuryConstraints?: string;
  recommendedProgramKey: ProgramKey;
  recommendedProgramTitle: string;
  recommendationReason: string;
  recommendedStartingWeek: number;
  fitnessTier: 'Recruit Foundation' | 'Operational Service Member' | 'Special Operations Tier';
}

export interface WarmUpStep {
  id: string;
  name: string;
  targetArea: string;
  durationSeconds?: number;
  repsText?: string;
  cues: string[];
  coachingPoint: string;
}

export interface WarmUpRoutine {
  id: string;
  title: string;
  category: 'Upper Body' | 'Lower Body' | 'Full Body / CNS' | 'Mobility Flow';
  durationMinutes: number;
  description: string;
  focusMuscles: string[];
  steps: WarmUpStep[];
}

export type SupplementTimingPhase =
  | 'morning'
  | 'pre_workout'
  | 'intra_workout'
  | 'post_workout'
  | 'evening';

export interface SupplementProtocol {
  id: string;
  name: string;
  dosage: string;
  phase: SupplementTimingPhase;
  phaseLabel: string;
  timingWindow: string; // e.g. "30-45 min before training"
  benefit: string;
  issaGuideline: string;
  takenToday: boolean;
  takenAt?: string; // e.g. "14:32"
}

export interface PersonalRecord {
  exerciseName: string;
  maxWeightLbs: number;
  repsAtMax: number;
  estimated1RM: number;
  date: string;
}

export interface BodyweightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weightLbs: number;
  notes?: string;
}

export interface RecoveryCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  sleepHours: number; // e.g. 7.5
  sleepQuality: 1 | 2 | 3 | 4 | 5; // 1 = Poor, 5 = Deep / Restful
  muscleSoreness: 1 | 2 | 3 | 4 | 5; // 1 = Fresh, 5 = Very Sore
  shiftStress: 1 | 2 | 3 | 4 | 5; // 1 = Calm, 5 = Extreme Operational Tempo Stress
  restingHr?: number;
  notes?: string;
  createdAt: string;
}

export type ReadinessTier = 
  | 'Combat Ready: Peak'
  | 'Optimal: Combat Chassis'
  | 'Operational: Monitor Fatigue'
  | 'Recovery Advisory'
  | 'Strained / De-load Priority';

export interface ReadinessScoreBreakdown {
  overallScore: number; // 0 - 100
  tier: ReadinessTier;
  recoveryScore: number; // 0 - 100
  weightConsistencyScore: number; // 0 - 100
  workoutCompletionScore: number; // 0 - 100
  workoutsCompleted7d: number;
  targetWorkoutsPerWeek: number;
  workoutStreak: number;
  lastWeightDate?: string;
  lastWeightLbs?: number;
  daysSinceLastWeight?: number;
  lastRecoveryDate?: string;
  hoursOfSleep?: number;
  coachAdvisory: string;
  statusBadgeColor: string;
}

export interface SubscriptionRecord {
  tier: 'standard' | 'pro' | 'enterprise';
  status: 'active_subscriber' | 'trialing' | 'canceled' | 'past_due';
  provider: 'square' | 'manual' | 'promo';
  squareOrderId?: string;
  squarePaymentId?: string;
  subscribedAt: string; // ISO string
  amount: number; // 15 or 30
  currency: 'USD';
  environment?: 'sandbox' | 'production';
}

export interface SquareConfig {
  environment: 'sandbox' | 'production';
  standardPlanUrl: string;
  proPlanUrl: string;
  applicationId?: string;
  locationId?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface TrialCodeRecord {
  code: string;
  days: number;
  tier: 'pro' | 'standard';
  description: string;
  createdAt?: string;
  createdBy?: string;
  maxUses?: number;
  currentUses?: number;
}

export interface TrialActivationRecord {
  code?: string;
  activatedAt?: string;
  startedAtMs?: number;
  trialEndMs: number;
  daysGranted?: number;
  hasSelectedPlan?: boolean;
  tier: 'pro' | 'standard';
  status?: 'trialing' | 'active_subscriber' | 'expired' | 'unpaid';
  resetVersion?: number;
}

export interface AthleteProfile {
  id: string;
  name: string;
  email: string;
  pin?: string;
  avatarColor: string;
  joinedDate: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  primaryGoal: 'Hybrid Athlete' | 'Strength & Power' | 'Hypertrophy' | 'Tactical Conditioning & Pursuit' | 'Endurance & Running';
  weightLbs?: number;
  restingHr?: number;
  maxHr?: number;
  notes?: string;
  questionnaire?: QuestionnaireAnswers;
  weightHistory?: BodyweightEntry[];
  recoveryHistory?: RecoveryCheckIn[];
  lastRecoveryCheckIn?: RecoveryCheckIn;
  subscription?: SubscriptionRecord;
  trialActivation?: TrialActivationRecord;
  hasCompletedTour?: boolean;
  tourCompletedAt?: string;
  trialState?: {
    startedAtMs: number;
    trialEndMs: number;
    hasSelectedPlan: boolean;
    tier: 'pro' | 'standard';
    status: 'trialing' | 'active_subscriber' | 'expired' | 'unpaid';
  };
}

/**
 * Parses a prescribed hold/duration string like "60s", "45 sec", "20-30s/side",
 * "1:30", or "2 min" into seconds (starting at the low end for ranges).
 */
export function parseTimedHoldSeconds(
  targetReps?: string,
  exerciseName?: string
): number | undefined {
  const reps = (targetReps || '').trim();
  const mmssMatch = reps.match(/\b(\d+):(\d{2})\b/);
  if (mmssMatch) {
    const mins = parseInt(mmssMatch[1], 10);
    const secs = parseInt(mmssMatch[2], 10);
    if (!isNaN(mins) && !isNaN(secs)) return mins * 60 + secs;
  }

  const minRangeMatch = reps.match(/(\d+(?:\.\d+)?)\s*(?:[-–]\s*\d+(?:\.\d+)?)?\s*(?:min|mins|minute|minutes)\b/i);
  if (minRangeMatch) {
    const mins = parseFloat(minRangeMatch[1]);
    if (!isNaN(mins) && mins > 0) return Math.round(mins * 60);
  }

  const secRangeMatch = reps.match(/(\d+)\s*(?:[-–]\s*\d+)?\s*(?:s|sec|secs|second|seconds)\b/i);
  if (secRangeMatch) {
    const secs = parseInt(secRangeMatch[1], 10);
    if (!isNaN(secs) && secs > 0) return secs;
  }

  const name = (exerciseName || '').toLowerCase();
  if (/\b(plank|copenhagen|wall\s+sit|hollow\s+body|hollow\s+hold|dead\s+hang|active\s+hang|isometric|l-sit|bear\s+crawl\s+hold|negative\s+hold)\b/i.test(name)) {
    return 45;
  }
  return undefined;
}

/**
 * Checks if a timed exercise is an isometric/stationary hold (e.g. Plank, Side Plank,
 * Copenhagen Side Plank, Wall Sit, Hollow Body Hold, Dead Hang) rather than a distance
 * run/row/carry so the UI hides "Distance (mi)" and displays a Hold Timer instead.
 */
export function isTimedHoldExercise(
  exerciseName: string,
  targetReps?: string,
  distanceMiles?: number
): boolean {
  if (distanceMiles && distanceMiles > 0) return false;
  const name = (exerciseName || '').toLowerCase();
  const reps = (targetReps || '').toLowerCase();

  const hasExplicitTimeUnit =
    /\b\d+(?:\.\d+)?\s*(?:s|sec|secs|second|seconds|min|mins|minute|minutes)\b/i.test(reps) ||
    /\b\d+:\d{2}\b/.test(reps) ||
    (/\b(?:hold|holds|isometric)\b/i.test(reps) && !/\b(?:pause|eccentric|negative)\b/i.test(reps));

  if (
    /\b(plank\s+shoulder\s+taps?|plank\s+taps?|plank\s+up-?downs?|plank\s+jacks?|plank\s+walks?|plank\s+to\s+push(?:-?ups?)?|renegade\s+rows?|plank\s+rows?)\b/i.test(
      name
    ) &&
    !hasExplicitTimeUnit
  ) {
    return false;
  }

  if (
    /\b(run|runs|running|jog|jogging|sprint|sprints|mile|miles|mi|km|meter|meters|yard|yds|yd|rower|rowing|skierg|bike|assault|airdyne|treadmill|spin|ruck|carry|carries|farmer|suitcase|sled|drag|shuttle)\b/i.test(
      `${name} ${reps}`
    ) &&
    !/\b(plank|wall\s+sit|dead\s+hang|hollow\s+body|hollow\s+hold|bear\s+crawl\s+hold|negative\s+hold)\b/i.test(name)
  ) {
    return false;
  }

  return (
    /\b(plank|planks|side\s+plank|copenhagen|wall\s+sit|wall\s+sits|dead\s+hang|dead\s+hangs|active\s+hang|passive\s+hang|hollow\s+body|hollow\s+hold|l-sit|pallof\s+hold|superman\s+hold|bridge\s+hold|sorensen|isometric|iso\s+hold|bear\s+crawl\s+hold|negative\s+hold)\b/i.test(
      name
    ) ||
    (/\b(?:s|sec|secs|second|seconds|hold|holds|isometric)\b/i.test(reps) &&
      !/\b(?:mile|miles|mi|km|meter|meters|m|yd|yds|yard)\b/i.test(reps))
  );
}

/**
 * Checks if an exercise is an interval run, track repeat, sprint repeat, stride, or shuttle drill
 * that should be displayed and logged as Sets and Reps (rather than a single continuous distance/time log).
 */
export function isIntervalRunExercise(
  exerciseName: string,
  targetReps?: string,
  notes?: string
): boolean {
  const name = (exerciseName || '').toLowerCase().trim();
  const reps = (targetReps || '').toLowerCase().trim();
  const noteText = (notes || '').toLowerCase().trim();

  if (!name) return false;

  // Exclude traditional strength, calisthenics, core, carries, sled drags, and full-event SDC simulations
  if (
    /\b(squat|squats|deadlift|deadlifts|rdl|bench|press|presses|row|rows|pull-up|pull-ups|pullup|pullups|chin-up|chin-ups|push-up|push-ups|pushup|pushups|dip|dips|curl|curls|raise|raises|swing|swings|lunge|lunges|step-up|step-ups|plank|planks|copenhagen|wall\s+sit|dead\s+hang|hollow\s+body|hollow\s+hold|rollout|rollouts|hip\s+thrust|glute\s+bridge|calf|calves|shrug|shrugs|thruster|thrusters|clean|snatch|woodchop|woodchopper|russian\s+twist|bird-?dog|dead\s+bug|mcgill|crunch|sit-up|farmer|farmers|suitcase|bear-hug|casualty\s+drag|backward\s+sled\s+drag|reverse\s+sled\s+drag|heavy\s+sled\s+push|sprint-drag-carry|250m\s+sprint-drag-carry|combat\s+medley|amrap|emom|box\s+jump|broad\s+jump|trap-bar\s+jump)\b/i.test(
      name
    ) &&
    !/\b(hill\s+sprints?|sled\s+sprints?|flying\s+sprints?|build-up\s+sprints?|prone-to-sprint)\b/i.test(name)
  ) {
    return false;
  }

  // Exclude continuous runs / rucks / benchmarks even if their notes mention strides or intervals
  if (
    /\b(steady\s+aerobic|steady\s+zone\s*2|zone\s*2\s+run|zone\s*2\s+aerobic|zone\s*2\s+recovery|post-lift\s+aerobic|long\s+steady|long\s+aerobic|long\s+run|long\s+slow|base\s+run|recovery\s+run|recovery\s+spin|flush\s+run|flush\s+jog|shakeout|tempo\s+run|threshold\s+run|threshold\s+pace\s+run|threshold\s+push|over-distance|time\s+trial|benchmark\s+run|benchmark\s+time\s+trial|mock\s+assessment\s+run|benchmark\s+assessment|official\s+2-mile\s+run|2-mile\s+run|1\.5-mile|3-mile|fartlek|ruck|ruck\s+march|battle\s+simulation\s+march|cross-training|optional\s+light\s+spin)\b/i.test(
      name
    ) &&
    !/\b(track\s+intervals?|track\s+repeats?|track\/treadmill\s+repeats?|run\s+repeats?|pace\s+repeats?|400m\s+repeats?|800m\s+repeats?|1,?000m\s+repeats?|300m\s+track|hill\s+sprints?)\b/i.test(
      name
    )
  ) {
    return false;
  }

  // Explicit interval / repeat / sprint keywords in the exercise name
  if (
    /\b(track\s+intervals?|short\s+sprint\s+intervals?|long\s+intervals?|interval\s+speed|speed\s+intervals?|speed-endurance\s+intervals?|test-simulation\s+intervals?|high-speed\s+openers?|technical\s+strides?|track\s+repeats?|track\/treadmill\s+repeats?|unmarked\s+field\s+shuttle\s+repeats?|unmarked\s+field\s+threshold\s+repeats?|unmarked\s+field\s+threshold\s+runs?|unmarked\s+field\s+patrol\s+shuttles?|field\s+combat\s+sprints?|run\s+repeats?|pace\s+repeats?|sprint\s+repeats?|hill\s+sprints?|sled\s+sprints?|flying\s+sprints?|build-up\s+sprints?|prone-to-sprint|pro\s+agility|t-drill|t-test|imt\s+bound|strides?|30:30|60:60)\b/i.test(
      name
    )
  ) {
    return true;
  }

  // Explicit NxDistance repeat pattern in name or targetReps (e.g. "6x400m", "6-8x400m", "4x800m", "3-4x1,000m", "4x300m", "10x200m", "12-15x40m")
  const hasRepeatPattern =
    /\b(\d+(?:\s*[-–]\s*\d+)?)\s*[x×]\s*(\d[\d,]*(?:\s*[-–]\s*\d[\d,]*)?\s*(?:m|meters?|yds?|yards?))\b/i.test(
      `${name} ${reps}`
    ) ||
    (/^\d[\d,]*(?:\s*[-–]\s*\d[\d,]*)?\s*m\b/i.test(reps) &&
      /\b(repeat|repeats|interval|intervals|sprint|sprints|stride|strides|track|shuttle)\b/i.test(`${name} ${noteText}`));

  if (hasRepeatPattern) {
    return true;
  }

  // Hybrid Protocol Day 3 "Speed Work" with "8x200m" or "10x200m" in notes/pace
  if (
    /\b(speed\s+work|track\s+intervals|long\s+intervals|sprint\s+intervals)\b/i.test(name) &&
    /\b\d+\s*[x×]\s*\d+\s*m\b/i.test(`${reps} ${noteText}`)
  ) {
    return true;
  }

  return false;
}

/**
 * Checks if an exercise is a loaded carry or weighted distance drag/walk
 * (e.g., Farmer's Walk, Suitcase Carry, Bear-Hug Sandbag Carry, Front-Rack Carry, Sled Push/Drag)
 * where each set should log Weight Used (lbs) and Distance Gone (m).
 */
export function isCarryDistanceExercise(
  exerciseName: string,
  targetReps?: string,
  notes?: string
): boolean {
  const name = (exerciseName || '').toLowerCase().trim();
  const reps = (targetReps || '').toLowerCase().trim();
  if (!name) return false;

  if (
    isIntervalRunExercise(exerciseName, targetReps, notes) ||
    isTimedHoldExercise(exerciseName, targetReps)
  ) {
    return false;
  }

  // Exclude continuous ruck marches / runs
  if (
    /\b(ruck\s+march|weighted\s+ruck\s+march|treadmill\s+ruck|patrol\s+ruck\s+march|aerobic\s+run|tempo\s+run|zone\s*2)\b/i.test(
      name
    )
  ) {
    return false;
  }

  if (
    /\b(carry|carries|farmer|farmers|farmer's\s+walk|farmers\s+walk|suitcase\s+walk|suitcase\s+carry|front-rack\s+carry|bear-hug|overhead\s+carry|waiter\s+walk|waiter\s+carry|yoke\s+walk|yoke\s+carry|sandbag\s+carry|water-can|ammo-can\s+carry|sled\s+push|sled\s+pull|sled\s+drag|backward\s+sled\s+drag|reverse\s+sled\s+drag|backward\s+drag|partner\s+drag|buddy\s+drag|casualty\s+drag|dummy\s+drag)\b/i.test(
      name
    )
  ) {
    return true;
  }

  // Also match weighted exercises whose targetReps explicitly specify meters or yards (e.g. "30m", "25m/arm", "40m")
  if (
    /\b\d+(?:\s*[-–]\s*\d+)?\s*(?:m|meters?|yds?|yards?)(?:\/(?:arm|side|hand|leg))?\b/i.test(reps) &&
    !/\b(run|jog|sprint|stride|shuttle|repeat|interval|swim|row|rower|skierg|bike)\b/i.test(name)
  ) {
    return true;
  }

  return false;
}

/**
 * Extracts the prescribed distance in meters (or yards) for a carry or interval set.
 * Strips leading set prefixes like "3x30m" or "6-8x400m" first so "30" or "400" is returned.
 */
export function parseDefaultDistanceMeters(
  targetReps?: string,
  exerciseName?: string,
  fallbackMeters = 30
): number {
  const candidates = [targetReps || '', exerciseName || ''];
  for (const raw of candidates) {
    if (!raw) continue;
    // Strip leading "<sets>x" like "6-8x400m" or "3x30m" or "2x25m/arm"
    const cleaned = raw.replace(/\(\s*\d+(?:\s*[-–]\s*\d+)?\s*[x×]\s*/gi, '(').replace(/^\s*\d+(?:\s*[-–]\s*\d+)?\s*[x×]\s*/i, '');
    const mMatch = cleaned.match(/(\d[\d,]*)(?:\s*[-–]\s*\d[\d,]*)?\s*(?:m|meters?|yds?|yards?)(?:\b|\/)/i);
    if (mMatch) {
      const val = parseInt(mMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(val) && val > 0 && val <= 5000) {
        return val;
      }
    }
  }
  return fallbackMeters;
}

/**
 * Extracts or estimates a default interval split time ("mm:ss") for an interval repeat exercise.
 */
export function parseDefaultIntervalTimeFormatted(
  targetReps?: string,
  exerciseName?: string,
  notes?: string
): string {
  const combined = `${targetReps || ''} ${exerciseName || ''} ${notes || ''}`;

  // Look for explicit mm:ss range like "~3:00-3:30" or "3:15"
  const clockMatch = combined.match(/~?\s*(\d{1,2}):(\d{2})(?:\s*[-–]\s*\d{1,2}:\d{2})?/);
  if (clockMatch) {
    const mins = parseInt(clockMatch[1], 10);
    const secs = parseInt(clockMatch[2], 10);
    if (!isNaN(mins) && !isNaN(secs)) {
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
  }

  // Look for explicit seconds range for the work repeat (e.g., "~80-95s per repeat", "10s all-out sprint", "90s Hard Effort")
  const secMatch = combined.match(/~?\s*(\d+)(?:\s*[-–]\s*(\d+))?\s*(?:s|sec|secs)\s*(?:per\s+repeat|per\s+\d+m|all-out|sprint|hard\s+effort|work)/i);
  if (secMatch) {
    const s1 = parseInt(secMatch[1], 10);
    const s2 = secMatch[2] ? parseInt(secMatch[2], 10) : s1;
    const avgSec = Math.round((s1 + s2) / 2);
    if (!isNaN(avgSec) && avgSec > 0) {
      const m = Math.floor(avgSec / 60);
      const s = avgSec % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }
  }

  // Fallback based on prescribed distance in meters
  const dist = parseDefaultDistanceMeters(targetReps, exerciseName, 400);
  if (dist <= 50) return '0:10';
  if (dist <= 110) return '0:18';
  if (dist <= 220) return '0:38';
  if (dist <= 320) return '1:05';
  if (dist <= 450) return '1:25';
  if (dist <= 650) return '2:15';
  if (dist <= 850) return '3:15';
  if (dist <= 1050) return '4:05';
  return '1:30';
}

/**
 * Checks if an exercise is a continuous/easy run, tempo run, long run, time trial, or ruck march
 * that should be displayed and logged purely as Distance (mi) and Time / Stopwatch (never as sets & reps).
 */
export function isContinuousRunOrRuckExercise(
  exerciseName: string,
  targetReps?: string,
  type?: string,
  notes?: string
): boolean {
  const name = (exerciseName || '').toLowerCase().trim();
  const reps = (targetReps || '').toLowerCase().trim();
  if (!name) return false;

  if (isIntervalRunExercise(exerciseName, targetReps, notes)) {
    return false;
  }
  if (isTimedHoldExercise(exerciseName, targetReps)) {
    return false;
  }

  // Exclude strength, carries, sleds, SDC, jumps, core, circuits, supersets
  if (
    /\b(squat|squats|deadlift|deadlifts|rdl|bench|press|presses|row|rows|pull-up|pull-ups|pullup|pullups|chin-up|chin-ups|push-up|push-ups|pushup|pushups|dip|dips|curl|curls|raise|raises|swing|swings|lunge|lunges|step-up|step-ups|plank|planks|copenhagen|wall\s+sit|dead\s+hang|hollow\s+body|hollow\s+hold|rollout|rollouts|hip\s+thrust|glute\s+bridge|calf|calves|shrug|shrugs|thruster|thrusters|clean|snatch|woodchop|woodchopper|russian\s+twist|bird-?dog|dead\s+bug|mcgill|crunch|sit-up|farmer|farmers|suitcase|bear-hug|carry|carries|sled|sprint-drag-carry|sdc|lateral\s+shuffle|box\s+jump|broad\s+jump|trap-bar\s+jump|combat\s+medley|amrap|emom|superset|circuit)\b/i.test(
      name
    )
  ) {
    return false;
  }

  if (
    /\b(run|runs|running|jog|jogging|ruck|rucking|march|aerobic|zone\s*2|tempo|threshold|long\s+slow|shakeout|flush|time\s+trial|2-mile|1\.5-mile|3-mile|fartlek|spin|cross-training)\b/i.test(
      name
    )
  ) {
    return true;
  }

  if (
    (type || '').toLowerCase() === 'cardio' &&
    /\b(mile|miles|mi|km|min|mins|minute|minutes|m)\b/i.test(`${name} ${reps}`)
  ) {
    return true;
  }

  return false;
}

/**
 * Checks if an exercise is timed (continuous cardio runs, rucks, planks, isometric holds)
 * rather than repetition sets.
 * Note: Interval runs / track repeats return FALSE here so they render as Sets and Reps.
 */
export function isExerciseTimed(
  exerciseName: string,
  type?: string,
  targetReps?: string
): boolean {
  const normalizedType = (type || '').toLowerCase().trim();
  if (normalizedType === 'superset') return false;

  // Interval runs and sprint repeats must show up as Sets and Reps, NOT a single distance/time log
  if (isIntervalRunExercise(exerciseName, targetReps)) {
    return false;
  }

  // Easy / continuous runs and rucks ALWAYS show up as the Distance & Time log
  if (isContinuousRunOrRuckExercise(exerciseName, targetReps, type)) {
    return true;
  }

  const name = (exerciseName || '').toLowerCase();
  const reps = (targetReps || '').toLowerCase().trim();

  // Dynamic plank variations that prescribe rep counts instead of a hold
  const isDynamicPlankReps =
    /\b(plank\s+shoulder\s+taps?|plank\s+taps?|plank\s+up-?downs?|plank\s+jacks?|plank\s+walks?|plank\s+to\s+push(?:-?ups?)?|renegade\s+rows?|plank\s+rows?)\b/i.test(
      name
    );

  // Explicit time or duration units (note: check both "30s" and "20-30s/side" cleanly)
  const hasExplicitTimeUnit =
    /\b\d+(?:\.\d+)?\s*(?:s|sec|secs|second|seconds|min|mins|minute|minutes)\b/i.test(reps) ||
    /\b\d+:\d{2}\b/.test(reps) ||
    (/\b(?:hold|holds|isometric|time\s+trial)\b/i.test(reps) &&
      !/\b(?:pause|eccentric|negative)\b/i.test(reps));

  const hasExplicitRepsOnly =
    (/\b\d+(?:\s*[-–]\s*\d+)?\s*reps?\b/i.test(reps) || /\bmax\s*reps?\b/i.test(reps)) &&
    !hasExplicitTimeUnit;

  // Isometric / stationary hold movements (Plank, Side Plank, Copenhagen, Hollow Body Hold, Wall Sit, Dead Hang, etc.)
  const isHoldName =
    /\b(plank|planks|side\s+plank|copenhagen|wall\s+sit|wall\s+sits|dead\s+hang|dead\s+hangs|active\s+hang|passive\s+hang|hollow\s+body|hollow\s+hold|l-sit|pallof\s+hold|superman\s+hold|glute\s+bridge\s+hold|bridge\s+hold|sorensen\s+hold|isometric\s+hold|iso\s+hold|star\s+plank|rkc\s+plank|plank\s+series|bear\s+crawl\s+hold|negative\s+holds?|isometric\s+core\s+brace)\b/i.test(
      name
    ) && !isDynamicPlankReps;

  if (isHoldName && !hasExplicitRepsOnly) {
    return true;
  }

  // Ergometers / cardio machines MUST be checked before 'row'
  if (
    /\b(rower|rowing machine|concept2|ergometer|skierg|assault bike|air bike|airdyne|treadmill|spin bike)\b/i.test(name) ||
    /\bcalorie\s+row\b/i.test(name)
  ) {
    return true;
  }

  // Distance/time continuous cardio
  if (
    /\b\d+(?:\.\d+)?\s*(?:mile|miles|mi|km)\b/i.test(reps) ||
    /\b(?:time trial)\b/i.test(reps)
  ) {
    return true;
  }

  // If reps explicitly include a time duration (e.g. "40s", "45 sec hold", "20-30s/side") and not pause-rep lifts
  if (hasExplicitTimeUnit && !/\b(squat|deadlift|rdl|bench|press|curl|lunge)\b/i.test(name)) {
    return true;
  }

  // Strength and rep-based accessory movements that must NEVER be timed
  if (
    /\b(lunge|lunges|split squat|squat|squats|step-up|step-ups|step up|step down|step-down|deadlift|deadlifts|rdl|press|presses|row|rows|pull-up|pull-ups|pullup|pullups|chin-up|chin-ups|chinup|chinups|push-up|push-ups|pushup|pushups|dip|dips|curl|curls|raise|raises|swing|swings|bench|fly|flye|flyes|pulldown|pulldowns|pushdown|pushdowns|extension|extensions|thruster|thrusters|clean|snatch|shrug|shrugs|hip thrust|hip thrusts|glute bridge|glute bridges|calf|calves|tibialis|face pull|face pulls|high pull|high pulls|pull-through|pull through|skull crusher|skull crushers|rollout|rollouts|crunch|crunches|sit-up|sit-ups|situp|situps|russian twist|woodchop|tuck|tucks|inverted|dead bug|bird-?dog)\b/i.test(
      name
    ) ||
    reps.includes('steps') ||
    reps.includes('/leg') ||
    (reps.includes('/side') && !hasExplicitTimeUnit) ||
    (/\bper\s+(?:leg|arm|side)\b/i.test(reps) && !hasExplicitTimeUnit)
  ) {
    return false;
  }

  if (normalizedType === 'cardio') return true;

  // Pure rep prescriptions (e.g. "8-10 reps", "12 reps", "10-12")
  if (
    (/\b\d+(?:\s*[-–]\s*\d+)?\s*reps?\b/i.test(reps) || /^\d+(?:\s*[-–]\s*\d+)?$/.test(reps)) &&
    !/\b(hold|plank|mile|miles|min|mins|minute|minutes|sec|secs|second|seconds)\b/i.test(reps) &&
    !/\b(plank|wall sit|hollow body|bear crawl|run|jog|time trial)\b/i.test(name)
  ) {
    return false;
  }

  // Name matching for continuous runs, rucks, carries
  return /\b(run|runs|running|jog|jogging|tempo\s+run|tempo\s+jog|bear\s+crawl\s+hold|ruck|rucking|spin|bike|rower|skierg|active\s+recovery|shakeout|time\s+trial)\b/i.test(
    name
  );
}

/**
 * Determines whether an exercise is performed purely with bodyweight (no external load),
 * so workout loggers do NOT ask the athlete for weight (lbs).
 * Explicitly weighted variants (e.g. "Weighted Pull-Ups", "Weighted Dips", "Weighted Planks",
 * "Barbell", "Dumbbell", "Kettlebell") still return false.
 */
export function isBodyweightExercise(
  exerciseName: string,
  contextText?: string
): boolean {
  const name = (exerciseName || '').toLowerCase().trim();
  if (!name) return false;

  // Explicitly weighted / vest variations ALWAYS ask for weight
  if (
    /\b(weighted|weight\s+vest|plate\s+carrier|vested|with\s+vest|on\s+belt|dip\s+belt|chains?)\b/i.test(
      name
    )
  ) {
    return false;
  }

  // Unloaded running intervals, track repeats, sprints, strides, and agility shuttles are bodyweight (no weight column)
  if (isIntervalRunExercise(exerciseName) && !/\b(sled|farmer|suitcase|carry|sandbag)\b/i.test(name)) {
    return true;
  }

  const hasExplicitExternalEquipmentTool =
    /\b(barbell|bb|dumbbell|dumbbells|db|kettlebell|kettlebells|kb|ez[-\s]?bar|trap\s*bar|hex\s*bar|safety\s*squat\s*bar|cambered\s*bar|cable|cables|pulley|machine|smith|landmine|sandbag|sled|prowler|slamball|slam\s*ball|medicine\s*ball|med\s*ball|wall\s*ball|plate|plates|t-bar|lat\s+pulldown|pulldown|leg\s+press|hack\s+squat|pendulum\s+squat|seated\s+leg\s+curl|lying\s+leg\s+curl|leg\s+extension|goblet|dummy\s+drag|battle\s+rope|banded)\b/i.test(
      name
    );

  if (hasExplicitExternalEquipmentTool) {
    return false;
  }

  // Explicitly labeled as Bodyweight / Unweighted (even for lunge, RDL, hip thrust, calf raise, squat patterns)
  if (/\b(bodyweight|bw|unweighted|zero[-\s]equipment)\b/i.test(name)) {
    return true;
  }

  const hasCommonWeightedMovementPattern =
    /\b(sumo\s+deadlift|front\s+squat|back\s+squat|zercher|romanian\s+deadlift|rdl|deadlift|rack\s+pull|good\s+morning|hip\s+thrust|bench\s+press|floor\s+press|incline\s+press|overhead\s+press|ohp|shoulder\s+press|strict\s+press|push\s+press|z-press|z\s+press|arnold\s+press|military\s+press|pallof\s+press|chest\s+press|chest-supported|preacher\s+curl|hammer\s+curl|bicep\s+curl|tricep\s+pushdown|skull\s*crusher|shrug|farmer|farmers|suitcase|woodchopper|band\s+pull-?apart)\b/i.test(
      name
    );

  if (hasCommonWeightedMovementPattern) {
    return false;
  }

  // Bodyweight calisthenics, core, isometric holds, and unloaded speed/agility/cardio
  const isCalisthenicMovement =
    /\b(calisthenics?|air\s+squat|air\s+squats|squat\s+jump|squat\s+jumps|jump\s+squat|jump\s+squats|box\s+jump|box\s+jumps|broad\s+jump|broad\s+jumps|depth\s+jump|depth\s+jumps|tuck\s+jump|tuck\s+jumps|l-hop|l-hops|pogo\s+hop|pogo\s+hops|ice\s+skater|ice\s+skaters|skater|skaters|squat\s+thrust|burpee|burpees|sprawl|sprawls|push-?up|push-?ups|pushup|pushups|pull-?up|pull-?ups|pullup|pullups|chin-?up|chin-?ups|chinup|chinups|muscle-?up|muscle-?ups|inverted\s+(?:bodyweight\s+)?row|inverted\s+rows|trx\s+row|trx\s+rows|ring\s+row|ring\s+rows|pike\s+push|diamond\s+push|hand-release|scapular\s+push|bench\s+dip|box\s+dip|ring\s+dip|dip|dips|plank|planks|copenhagen|side\s+plank|hollow\s+body|hollow\s+rock|hollow\s+rocks|hollow\s+hold|hollow\s+holds|dead\s+bug|dead\s+bugs|deadbug|deadbugs|bird-?dog|bird-?dogs|mcgill|superman|supermans|prone\s+y-t-w|wall\s+sit|wall\s+sits|dead\s+hang|dead\s+hangs|active\s+hang|passive\s+hang|l-sit|mountain\s+climber|mountain\s+climbers|flutter\s+kick|flutter\s+kicks|bicycle\s+crunch|v-?up|v-?ups|sit-?up|sit-?ups|situp|situps|crunch|crunches|leg\s+raise|leg\s+raises|knee\s+raise|knee\s+raises|toes\s+to\s+bar|hanging\s+(?:knee|leg|l-sit)|ab\s+wheel|rollout|rollouts|russian\s+twist|russian\s+twists|bear\s+crawl|crab\s+walk|glute\s+bridge|glute\s+bridges|single-?leg\s+bridge|clamshell|clamshells|fire\s+hydrant|sorensen|back\s+extension|hyperextension|nordic|slider\s+leg\s+curl|jumping\s+jack|jumping\s+jacks|high\s+knee|high\s+knees|butt\s+kick|inchworm|inchworms|mobility|stretch|stretching|foam\s+roll|yoga|cat-cow|90\/90|sprint|sprints|shuttle|shuttles|pro\s+agility|t-drill|imt\s+bound|strides?|track\s+intervals?|track\s+repeats?|pace\s+repeats?|run\s+repeats?|agility\s+run|agility\s+runs|zone\s+2\s+run|aerobic\s+run|recovery\s+run|tempo\s+run|tempo\s+runs|finisher\s+run|assault\s+bike|air\s+bike|airdyne|echo\s+bike|treadmill|rowing\s+machine|skierg)\b/i.test(
      name
    );

  if (isCalisthenicMovement) {
    return true;
  }

  // If the entire workout/program explicitly enforces Bodyweight-Only mode (and movement isn't explicitly weighted)
  const ctx = (contextText || '').toLowerCase();
  if (
    /\b(bodyweight\s+only|bodyweight-only|100%\s+bodyweight|zero\s+weighted|zero\s+equipment|calisthenics\s+only)\b/i.test(
      ctx
    )
  ) {
    return true;
  }

  return false;
}

export interface OfficerAssignedProgram {
  id: string;
  officerUserId: string; // The specific officer account this program is exclusively tied to
  officerEmail?: string;
  officerName?: string;
  badgeNumber?: string;
  department?: string;
  programTitle: string;
  programSubtitle?: string;
  category: 'Strength' | 'Hypertrophy' | 'Athletic Conditioning' | 'Power' | 'Hybrid' | 'Tactical & Rucking';
  coachNotes?: string;
  frequency?: string;
  estimatedDurationMinutes?: number;
  scheduleDays?: {
    day: number;
    dayLabel?: string;
    focus: string;
    warmup?: string;
    exercises: ExerciseTemplate[];
    runPacing?: string;
    coachNotes?: string;
  }[];
  exercises: ExerciseTemplate[];
  assignedByEmail?: string;
  assignedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type OperationalCondition =
  | 'garrison'
  | 'unit_pt_run'
  | 'ftx_low_sleep'
  | 'austere_field';

export type AftAgeBracket =
  | '17-21'
  | '22-26'
  | '27-31'
  | '32-36'
  | '37-41'
  | '42-46'
  | '47-51'
  | '52-56'
  | '57-61'
  | '62+';

export type PtTestTag = 'baseline' | 'mock' | 'rehearsal' | 'record';

export interface PtEventScoreRecord {
  key: string;
  label: string;
  rawDisplay: string;
  rawValue: number;
  points: number;
  passed: boolean;
}

export interface PtTestRecord {
  id: string;
  userId?: string;
  athleteId?: string;
  testType: 'aft' | 'general_pft';
  standard: 'combat' | 'general';
  sex: 'male' | 'female';
  ageBracket: AftAgeBracket;
  date: string; // YYYY-MM-DD
  tag: PtTestTag;
  events: PtEventScoreRecord[];
  totalScore: number;
  maxScore: number;
  passed: boolean;
  promotionPoints?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RuckSessionLog {
  id: string;
  userId?: string;
  athleteId?: string;
  title: string;
  date: string; // YYYY-MM-DD
  distanceMiles: number;
  weightLbs: number;
  durationMinutes: number;
  paceMinPerMile: number;
  workloadIndex: number; // distanceMiles * weightLbs
  terrain?: string;
  heartRateAvg?: number;
  rpe?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
