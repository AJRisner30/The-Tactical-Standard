import {
  TrainingTrack,
  TrackId,
  UserProgramState,
  GlobalBenchmarkLog,
  TransformedWorkoutSession,
  TransformedExercise,
  PrescribedExercise,
  CardioPrescription,
  BlockType,
  TrackMesocyclePhase,
  ConstraintMode,
} from '../types/trainingTracks';
import {
  MuscleGroup,
  OperationalCondition,
  WorkoutProgram,
  ExerciseTemplate,
  ProgramScheduleDay,
  isBodyweightExercise,
  isExerciseTimed,
  isIntervalRunExercise,
  isContinuousRunOrRuckExercise,
  isCarryDistanceExercise,
} from '../types';
import {
  PROTOCOL_DATA,
  ProtocolPhase,
  ProtocolDay,
  getDefaultRestPeriod,
  parseExerciseString,
  parseIntervalSetsAndReps,
  getApexWeekData,
  getTacticalHypertrophyWeekData,
  getUniversalPatWeekData,
  getAftWeekData,
  getExpressDbWeekData,
} from './protocolData';
import { matchExerciseNameToMovementId } from './trainingTracksData';
import {
  applyOperationalConditionToDay,
  applyOperationalConditionToExercises,
  applyOperationalConditionToProgram,
} from '../utils/operationalAdjuster';
import {
  getExerciseFormat,
  parseSupersetDetails,
  parseEmomDetails,
  parseAmrapDetails,
  parseCircuitDetails,
} from '../utils/workoutFormats';

const LEGACY_TRACK_ID_MAP: Record<string, TrackId> = {
  'hybrid-tactical': 'hybrid_protocol',
  'army-aft': 'aft_protocol',
  'leo-patrol': 'apex_protocol',
  'engine-outlast': 'universal_pat',
  'return-to-duty': 'hybrid_db',
  'express-30': 'hybrid_db',
};

export function normalizeTrackId(id?: string | null): TrackId {
  if (!id) return 'hybrid_db';
  if (LEGACY_TRACK_ID_MAP[id]) return LEGACY_TRACK_ID_MAP[id];
  return id as TrackId;
}

const EXPRESS_DB_MESOCYCLES: TrackMesocyclePhase[] = [
  {
    id: 'express_db_phase1',
    label: 'Phase 1: Foundation Strength & Cardio Base',
    weeksLabel: 'Wks 1–4',
    badge: '8–12 Rep Supersets & 400m Repeats',
    weekRange: [1, 2, 3, 4],
    defaultWeek: 1,
  },
  {
    id: 'express_db_phase2',
    label: 'Phase 2: Heavy DB Overload & Threshold Speed',
    weeksLabel: 'Wks 5–8',
    badge: '1s Pauses & 800m Race-Pace',
    weekRange: [5, 6, 7, 8],
    defaultWeek: 5,
  },
  {
    id: 'express_db_phase3',
    label: 'Phase 3: Peak Strength & Combat Stamina',
    weeksLabel: 'Wks 9–12',
    badge: 'Unilateral Peak & 20m Combat AMRAP',
    weekRange: [9, 10, 11, 12],
    defaultWeek: 9,
  },
];

const APEX_MESOCYCLES: TrackMesocyclePhase[] = [
  {
    id: 'apex_phase1',
    label: 'Quarter 1: Aerobic Base & Movement Foundation',
    weeksLabel: 'Q1 · Wks 1–13',
    badge: 'Zone 2 & 4–6 Mi Ruck',
    weekRange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    defaultWeek: 1,
  },
  {
    id: 'apex_phase2',
    label: 'Quarter 2: Running Stamina & Base Strength',
    weeksLabel: 'Q2 · Wks 14–26',
    badge: '400m Repeats & 6–8 Mi Ruck',
    weekRange: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
    defaultWeek: 14,
  },
  {
    id: 'apex_phase3',
    label: 'Quarter 3: Peak Strength, Sprint Speed & Tempo',
    weeksLabel: 'Q3 · Wks 27–39',
    badge: 'Heavy 3–5s & 8–10 Mi Ruck',
    weekRange: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
    defaultWeek: 27,
  },
  {
    id: 'apex_phase4',
    label: 'Quarter 4: Combat Readiness & Annual Peak',
    weeksLabel: 'Q4 · Wks 40–52',
    badge: 'Combat Circuit & 6–12 Mi Peak Ruck',
    weekRange: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52],
    defaultWeek: 40,
  },
];

const TACTICAL_BB_MESOCYCLES: TrackMesocyclePhase[] = [
  {
    id: 'tb_phase1',
    label: 'Phase 1: Armor & Base',
    weeksLabel: 'Wks 1–4',
    badge: '8–10 Hypertrophy & 4-Mi Ruck',
    weekRange: [1, 2, 3, 4],
    defaultWeek: 1,
  },
  {
    id: 'tb_phase2',
    label: 'Phase 2: Power-Building',
    weeksLabel: 'Wks 5–8',
    badge: '5–6 Heavy Force & 5-Mi Ruck',
    weekRange: [5, 6, 7, 8],
    defaultWeek: 5,
  },
  {
    id: 'tb_phase3',
    label: 'Phase 3: Peak & Velocity',
    weeksLabel: 'Wks 9–12',
    badge: '3–5 Peak & 6-Mi Ruck',
    weekRange: [9, 10, 11, 12],
    defaultWeek: 9,
  },
];

const HYBRID_PROTOCOL_MESOCYCLES: TrackMesocyclePhase[] = [
  {
    id: 'phase1',
    label: 'Phase 1: Foundation',
    weeksLabel: 'Wks 1–4',
    badge: 'Hypertrophy & Zone 2 Base',
    weekRange: [1, 2, 3, 4],
    defaultWeek: 1,
  },
  {
    id: 'phase2',
    label: 'Phase 2: Build & Intensify',
    weeksLabel: 'Wks 5–8',
    badge: 'Heavy Strength & Threshold',
    weekRange: [5, 6, 7, 8],
    defaultWeek: 5,
  },
  {
    id: 'phase3',
    label: 'Phase 3: Peak Performance',
    weeksLabel: 'Wks 9–12',
    badge: 'Max CNS Power & Race Pace',
    weekRange: [9, 10, 11, 12],
    defaultWeek: 9,
  },
];

const AFT_MESOCYCLES: TrackMesocyclePhase[] = [
  {
    id: 'aft_block1',
    label: 'Block 1: Event Technique & Base',
    weeksLabel: 'Wks 1–2',
    badge: 'Base Strength & Aerobic',
    weekRange: [1, 2],
    defaultWeek: 1,
  },
  {
    id: 'aft_block2',
    label: 'Block 2: Heavy Strength & Threshold',
    weeksLabel: 'Wks 3–4',
    badge: '80% MDL & 800m Repeats',
    weekRange: [3, 4],
    defaultWeek: 3,
  },
  {
    id: 'aft_block3',
    label: 'Block 3: Peak 3RM MDL & Full SDC',
    weeksLabel: 'Wks 5–6',
    badge: '85–90% MDL & 250m SDC',
    weekRange: [5, 6],
    defaultWeek: 5,
  },
  {
    id: 'aft_block4',
    label: 'Block 4: Dress Rehearsal & AFT Test',
    weeksLabel: 'Wks 7–8',
    badge: 'Rehearsal & Official AFT',
    weekRange: [7, 8],
    defaultWeek: 7,
  },
];

const UNIVERSAL_PAT_MESOCYCLES: TrackMesocyclePhase[] = [
  {
    id: 'pat_block1',
    label: 'Block 1: Foundational Calisthenics & Aerobic Base',
    weeksLabel: 'Wks 1–4',
    badge: 'Pull-Ups, Push-Ups & Base Run',
    weekRange: [1, 2, 3, 4],
    defaultWeek: 1,
  },
  {
    id: 'pat_block2',
    label: 'Block 2: Selection Pacing & PFT Peak',
    weeksLabel: 'Wks 5–8',
    badge: 'Event Pacing & Test Peak',
    weekRange: [5, 6, 7, 8],
    defaultWeek: 5,
  },
];

export const BUILT_IN_PROGRAM_TRACKS: TrainingTrack[] = [
  {
    id: 'hybrid_db',
    badge: "Coach AJ's Preferred",
    category: 'Express',
    title: '12-Week Military Express 30-Min DB',
    focusSummary: 'High-efficiency 30-minute paired dumbbell supersets, 400m/800m speed, Zone 2 & incline rucks built for busy schedules.',
    frequencyLabel: '12 Wks · 5–6 d/wk',
    totalWeeks: 12,
    standardDaysPerWeek: 5,
    highVolumeDaysPerWeek: 6,
    avgDurationMinutes: 30,
    equipment: ['Dumbbells', 'Bench', 'Pull-Up Bar', 'Ruck'],
    accentColor: 'amber',
    linkedProgramKey: 'hybrid_db',
    recommendedWarmupId: 'warmup-dime-express-6min',
    isCoachPreferred: true,
    mesocycles: EXPRESS_DB_MESOCYCLES,
    splitSummary: [
      'Day 1: Upper Push/Pull Supersets',
      'Day 2: Track/Treadmill Intervals + Core',
      'Day 3: Lower Quad/Hinge Supersets',
      'Day 4: Zone 2 Aerobic Run',
      'Day 5: Full-Body Tactical Armor',
      'Day 6: Incline Ruck March',
    ],
    sessions: [],
  },
  {
    id: 'apex_protocol',
    badge: 'Military · 52 Wks',
    category: 'Military',
    title: '52-Week Military Combat Fitness',
    focusSummary: '4-quarter annual progression combining compound strength, track sprints, tempo runs, and 4–12 mile tactical rucks.',
    frequencyLabel: '52 Wks · 5–6 d/wk',
    totalWeeks: 52,
    standardDaysPerWeek: 4,
    highVolumeDaysPerWeek: 6,
    avgDurationMinutes: 55,
    equipment: ['Barbell', 'Dumbbells', 'Ruck (35–65 lb)', 'Track'],
    accentColor: 'amber',
    linkedProgramKey: 'apex_protocol',
    recommendedWarmupId: 'warmup-dime-mandatory',
    mesocycles: APEX_MESOCYCLES,
    splitSummary: [
      'Day 1: Lower Strength & Zone 2',
      'Day 2: Upper Push/Pull Armor',
      'Day 3: Speed / Track Intervals',
      'Day 4: Posterior Chain & Carry',
      'Day 5: Combat Conditioning',
      'Day 6: Tactical Ruck March',
    ],
    sessions: [],
  },
  {
    id: 'tactical_hypertrophy',
    badge: 'Hypertrophy · 12 Wks',
    category: 'Hypertrophy',
    title: '12-Week Tactical Bodybuilding',
    focusSummary: '3-phase garrison armor-building split: 4 heavy hypertrophy lifts, Day 3 IMT speed & agility, and Day 6 ruck + arms.',
    frequencyLabel: '12 Wks · 5–6 d/wk',
    totalWeeks: 12,
    standardDaysPerWeek: 5,
    highVolumeDaysPerWeek: 6,
    avgDurationMinutes: 55,
    equipment: ['Barbell', 'Dumbbells', 'Cables', 'Ruck (35–55 lb)'],
    accentColor: 'amber',
    linkedProgramKey: 'tactical_hypertrophy',
    recommendedWarmupId: 'warmup-dime-tactical-bb',
    mesocycles: TACTICAL_BB_MESOCYCLES,
    splitSummary: [
      'Day 1: Upper Push & Back Thickness',
      'Day 2: Lower Quad & Posterior Armor',
      'Day 3: IMT Speed & Shuttle Agility',
      'Day 4: Upper Shoulders & Pull Power',
      'Day 5: Heavy Hinge & Unilateral Legs',
      'Day 6: 4–6 Mi Ruck + Arm Finisher',
    ],
    sessions: [],
  },
  {
    id: 'hybrid_protocol',
    badge: 'Hybrid · 12 Wks',
    category: 'Hybrid',
    title: '12-Week Hybrid Protocol',
    focusSummary: 'Foundational barbell strength paired with structured Zone 2 base, tempo thresholds, and anaerobic run repeats.',
    frequencyLabel: '12 Wks · 5–6 d/wk',
    totalWeeks: 12,
    standardDaysPerWeek: 4,
    highVolumeDaysPerWeek: 6,
    avgDurationMinutes: 55,
    equipment: ['Barbell', 'Dumbbells', 'Pull-Up Bar', 'Road / Track'],
    accentColor: 'emerald',
    linkedProgramKey: 'hybrid_protocol',
    recommendedWarmupId: 'warmup-dime-mandatory',
    mesocycles: HYBRID_PROTOCOL_MESOCYCLES,
    splitSummary: [
      'Day 1: Lower Strength & Easy Base',
      'Day 2: Upper Press/Pull & Threshold',
      'Day 3: Aerobic Engine Run',
      'Day 4: Posterior Chain & Core',
      'Day 5: Upper Hypertrophy & Intervals',
      'Day 6: Long Aerobic Run / Ruck',
    ],
    sessions: [],
  },
  {
    id: 'aft_protocol',
    badge: 'Army AFT · 8 Wks',
    category: 'Military',
    title: 'Army Fitness Test (AFT) 8-Week',
    focusSummary: '4-block event-specific peak for 3RM Hex Bar Deadlift, Hand-Release Push-Ups, 250m Sprint-Drag-Carry, Plank & 2-Mile Run.',
    frequencyLabel: '8 Wks · 5 d/wk',
    totalWeeks: 8,
    standardDaysPerWeek: 4,
    highVolumeDaysPerWeek: 5,
    avgDurationMinutes: 50,
    equipment: ['Trap Bar', '90 lb Sled', '40 lb KBs', 'Track'],
    accentColor: 'amber',
    linkedProgramKey: 'aft_protocol',
    recommendedWarmupId: 'warmup-dime-mandatory',
    mesocycles: AFT_MESOCYCLES,
    splitSummary: [
      'Day 1: 3RM Trap Bar MDL & Core',
      'Day 2: HRP Volume & 2-Mile Pacing',
      'Day 3: Sprint-Drag-Carry Mechanics',
      'Day 4: Posterior Power & Plank Hold',
      'Day 5: Event Simulation & Threshold',
    ],
    sessions: [],
  },
  {
    id: 'universal_pat',
    badge: 'PFT / Selection · 8 Wks',
    category: 'LEO',
    title: 'General Military PFT & Selection',
    focusSummary: '8-week PFT, CFT, PRT, and academy selection preparation focused on pull-ups, push-ups, carries, and timed 1.5–3 mile runs.',
    frequencyLabel: '8 Wks · 5 d/wk',
    totalWeeks: 8,
    standardDaysPerWeek: 4,
    highVolumeDaysPerWeek: 5,
    avgDurationMinutes: 50,
    equipment: ['Pull-Up Bar', 'Barbell / DBs', 'Track'],
    accentColor: 'sky',
    linkedProgramKey: 'universal_pat',
    recommendedWarmupId: 'warmup-dime-mandatory',
    mesocycles: UNIVERSAL_PAT_MESOCYCLES,
    splitSummary: [
      'Day 1: Calisthenics Pull/Push & Speed',
      'Day 2: Lower Strength & Core Stability',
      'Day 3: Threshold & Tempo Run',
      'Day 4: Upper Endurance & Carry',
      'Day 5: Selection PFT Circuit',
    ],
    sessions: [],
  },
];

/**
 * Builds the complete unified track list combining:
 * 1. Athlete's active Adapted/Custom AI program (if present)
 * 2. All 6 built-in Coach AJ master programs (starting with Coach AJ's Preferred 30-Min Express DB)
 * 3. Any Coach-Published programs visible to the user
 */
export function buildAllProgramTracks(
  activeCustomProgram?: WorkoutProgram | null,
  coachPublishedPrograms: WorkoutProgram[] = [],
  isMasterExempt = false
): TrainingTrack[] {
  const tracks: TrainingTrack[] = [...BUILT_IN_PROGRAM_TRACKS];

  if (activeCustomProgram) {
    const scheduleDays = activeCustomProgram.schedule || [];
    const totalDays = Math.max(1, scheduleDays.length);
    const totalWeeks = Math.max(1, Math.ceil(totalDays / 7));
    const trainingDaysPerWeek = Math.min(
      6,
      Math.max(
        3,
        scheduleDays.slice(0, 7).filter((d) => !d.isRestDay && (d.exercises?.length || 0) > 0).length || 4
      )
    );

    const customTrack: TrainingTrack = {
      id: 'custom_ai',
      badge: 'Adapted · Personal',
      category: 'Custom',
      title: activeCustomProgram.title,
      focusSummary: activeCustomProgram.subtitle || activeCustomProgram.description || 'Personalized adapted training program.',
      frequencyLabel: `${totalWeeks} Wk${totalWeeks === 1 ? '' : 's'} · ${activeCustomProgram.frequency || `${trainingDaysPerWeek} d/wk`}`,
      totalWeeks,
      standardDaysPerWeek: Math.max(3, trainingDaysPerWeek - 1),
      highVolumeDaysPerWeek: trainingDaysPerWeek,
      avgDurationMinutes: activeCustomProgram.estimatedDurationMinutes || 45,
      equipment: ['Custom Equipment Profile'],
      accentColor: 'emerald',
      linkedProgramKey: 'custom_ai',
      recommendedWarmupId: activeCustomProgram.recommendedWarmupId || 'warmup-dime-mandatory',
      isCustom: true,
      sourceProgram: activeCustomProgram,
      splitSummary: scheduleDays.slice(0, 6).map((d) => `Day ${d.day}: ${d.focus}`),
      sessions: [],
    };
    tracks.unshift(customTrack);
  }

  const visibleCoachPrograms = coachPublishedPrograms.filter(
    (p) => isMasterExempt || p.isPublished !== false
  );

  for (const cp of visibleCoachPrograms) {
    const scheduleDays = cp.schedule && cp.schedule.length > 0 ? cp.schedule : null;
    const totalDays = scheduleDays ? scheduleDays.length : 1;
    const totalWeeks = Math.max(1, Math.ceil(totalDays / 7));
    const activeDays = scheduleDays
      ? Math.max(1, scheduleDays.slice(0, 7).filter((d) => !d.isRestDay).length)
      : 1;

    tracks.push({
      id: `coach:${cp.id}`,
      badge: cp.isPublished === false ? 'Coach Draft' : cp.programKind === 'single_workout' ? 'Coach Workout' : 'Coach Program',
      category: 'Coach',
      title: cp.title,
      focusSummary: cp.subtitle || cp.description || 'Published directly by Coach Aryan Risner.',
      frequencyLabel:
        cp.programKind === 'single_workout'
          ? 'Single Session'
          : `${totalWeeks} Wk${totalWeeks === 1 ? '' : 's'} · ${cp.frequency || `${activeDays} d/wk`}`,
      totalWeeks,
      standardDaysPerWeek: activeDays,
      highVolumeDaysPerWeek: activeDays,
      avgDurationMinutes: cp.estimatedDurationMinutes || 45,
      equipment: [cp.category || 'Tactical'],
      accentColor: 'amber',
      linkedProgramKey: 'hybrid_db',
      recommendedWarmupId: cp.recommendedWarmupId || 'warmup-dime-mandatory',
      isCoachPublished: true,
      coachProgramId: cp.id,
      isDraft: cp.isPublished === false,
      sourceProgram: cp,
      splitSummary: scheduleDays
        ? scheduleDays.slice(0, 6).map((d) => `Day ${d.day}: ${d.focus}`)
        : [`Session: ${cp.title}`],
      sessions: [],
    });
  }

  return tracks;
}

// ============================================================================
// REAL PROTOCOL PARSING & REST / CARDIO / CARRY / SUPERSET CLASSIFICATION
// ============================================================================

export function isRealStrengthEntry(str: string): boolean {
  if (!str) return false;
  const clean = str.replace(/\[.*?\]/g, '').trim().toLowerCase();
  if (!clean) return false;
  if (
    clean === 'rest' ||
    clean.startsWith('rest ') ||
    clean.startsWith('rest/') ||
    clean.startsWith('rest /') ||
    clean.startsWith('rest -') ||
    clean.startsWith('rest:') ||
    clean === 'complete rest' ||
    clean.includes('complete rest') ||
    clean.includes('nutrition replenishment') ||
    clean.includes('meal prep') ||
    clean.includes('sleep quality') ||
    clean === 'none' ||
    clean === 'n/a'
  ) {
    return false;
  }
  return true;
}

export function isRealConditioningRunEntry(runStr?: string): boolean {
  if (!runStr) return false;
  const clean = runStr.replace(/\[.*?\]/g, '').trim().toLowerCase();
  if (
    !clean ||
    clean === 'rest' ||
    clean.startsWith('rest ') ||
    clean.startsWith('rest/') ||
    clean.startsWith('rest /') ||
    clean.startsWith('rest -') ||
    clean.startsWith('rest —') ||
    clean.startsWith('rest:') ||
    clean.startsWith('none') ||
    clean.includes('complete rest') ||
    clean.includes('rest from running') ||
    clean.includes('no cardio') ||
    clean.includes('no separate run') ||
    clean.includes('included in session') ||
    clean.includes('cns recovery') ||
    clean === 'n/a'
  ) {
    return false;
  }
  return true;
}

export function isProtocolDayRest(day: ProtocolDay): boolean {
  const focusLower = (day.focus || '').toLowerCase();
  if (
    focusLower.includes('complete rest') ||
    focusLower === 'rest' ||
    focusLower.startsWith('rest /') ||
    focusLower.startsWith('rest -') ||
    focusLower.startsWith('rest day')
  ) {
    return true;
  }
  const hasRealStrength = (day.strength || []).some(isRealStrengthEntry);
  const hasRealRun = isRealConditioningRunEntry(day.run);
  return !hasRealStrength && !hasRealRun;
}

function inferMuscleGroup(name: string): MuscleGroup {
  const lower = name.toLowerCase();
  if (/\b(squat|lunge|leg press|calf|box jump|sled|step-up|step up)\b/.test(lower)) return 'Quads';
  if (/\b(deadlift|rdl|romanian|hip thrust|leg curl|hamstring|swing|glute)\b/.test(lower)) return 'Hamstrings & Glutes';
  if (/\b(bench|floor press|push-?up|chest|dip|fly)\b/.test(lower)) return 'Chest';
  if (/\b(row|pull-?up|lat|chin-?up|face pull|shrug|pullover)\b/.test(lower)) return 'Back';
  if (/\b(overhead press|ohp|push press|lateral raise|shoulder|delt|arnold|landmine press|z-press)\b/.test(lower)) return 'Shoulders';
  if (/\b(curl|tricep|skull|pushdown|close-grip|wrist|hammer)\b/.test(lower)) return 'Arms';
  if (/\b(plank|pallof|twist|woodchop|leg raise|knee raise|crunch|core|ab-?wheel|dead bug|bird-?dog|hollow)\b/.test(lower)) return 'Core';
  return 'Full Body';
}

function inferBlockType(name: string, format?: string, isCarry?: boolean, isInterval?: boolean, isEasyRun?: boolean, idx = 0): BlockType {
  if (format === 'superset') return 'Superset';
  if (isCarry) return 'Carry';
  if (isInterval || isEasyRun) return 'Engine';
  const lower = name.toLowerCase();
  if (/\b(box jump|broad jump|med ball|power clean|sprint|shuttle|agility|t-drill|plyo|bounds)\b/.test(lower)) return 'Power';
  if (/\b(plank|pallof|ab|core|leg raise|knee raise|dead bug|crunch|woodchop|hollow)\b/.test(lower)) return 'Core';
  if (/\b(amrap|emom|circuit|conditioning|sled|erg|bike|row)\b/.test(lower)) return 'Conditioning';
  return idx <= 1 ? 'Strength' : 'Accessory';
}

function extractDistanceMiles(text: string, pace?: string): number | undefined {
  const combined = `${text} ${pace || ''}`;
  const rangeMatch = combined.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\s*mile/i);
  if (rangeMatch) return parseFloat(rangeMatch[1]);
  const singleMatch = combined.match(/(\d+(?:\.\d+)?)\s*mile/i);
  if (singleMatch) return parseFloat(singleMatch[1]);
  const meterRangeMatch = combined.match(/(\d[\d,]*)\s*[-–]\s*(\d[\d,]*)\s*m\b/i);
  if (meterRangeMatch) {
    const lowMeters = parseInt(meterRangeMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(lowMeters) && lowMeters >= 800) return parseFloat((lowMeters / 1609.34).toFixed(1));
  }
  const singleMeterMatch = combined.match(/(\d[\d,]{3,})\s*m\b/i);
  if (singleMeterMatch) {
    const meters = parseInt(singleMeterMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(meters) && meters >= 800) return parseFloat((meters / 1609.34).toFixed(1));
  }
  return undefined;
}

// ============================================================================
// DYNAMIC CONSTRAINT SWAP ENGINE (LOW-IMPACT / JOINT SAFE & MINIMAL GEAR)
// ============================================================================

function getConstraintSwapForExercise(
  name: string,
  reps: string,
  constraintMode: ConstraintMode,
  isSuperset: boolean
): { name: string; movementId?: string; reps?: string; reason: string; notes: string } | null {
  if (constraintMode === 'full_duty') return null;
  const lower = name.toLowerCase();

  if (constraintMode === 'low_impact_rehab') {
    if (isSuperset && name.includes(' + ')) {
      const parts = name.split(/\s+\+\s+/);
      let anyChanged = false;
      const swappedParts = parts.map((p) => {
        const subSwap = getConstraintSwapForExercise(p.trim(), reps, 'low_impact_rehab', false);
        if (subSwap) {
          anyChanged = true;
          return subSwap.name;
        }
        return p.trim();
      });
      if (anyChanged) {
        return {
          name: swappedParts.join(' + '),
          reason: 'Joint-safe low-impact superset adaptation — eliminates deep flexion & plyometric shock.',
          notes: 'Controlled tempo, pain-free range of motion, strict trunk bracing.',
        };
      }
      return null;
    }

    if (/\b(box jump|broad jump|squat jump|jump lunge|burpee|plyo|bounds|hurdle)\b/.test(lower)) {
      return {
        name: 'Weighted Controlled Box Step-Ups (16 in)',
        movementId: 'controlled-step-up',
        reps: '8–10 reps/leg',
        reason: 'Eliminates plyometric landing impact while preserving unilateral drive.',
        notes: 'Drive through lead heel, soft controlled descent, zero impact.',
      };
    }
    if (/\b(bulgarian split squat|rear-?foot elevated|walking lunge|reverse lunge|split squat)\b/.test(lower)) {
      return {
        name: 'Low-Box Controlled Step-Ups (90° Knee Cap)',
        movementId: 'controlled-step-up',
        reps: '10 reps/leg',
        reason: 'Caps knee & hip flexion angle to protect patellar tendon and hip labrum.',
        notes: 'Tall torso, vertical front shin, controlled eccentric.',
      };
    }
    if (/\b(back squat|front squat|goblet squat)\b/.test(lower) && !lower.includes('box squat')) {
      return {
        name: 'Parallel Box Squat (Controlled Pause)',
        movementId: 'back-squat',
        reason: 'Box stops depth at parallel to eliminate deep hip/knee compression.',
        notes: 'Sit back softly to box, keep shins vertical, drive explosively.',
      };
    }
    if (/\b(deadlift|trap bar|hex bar)\b/.test(lower) && !lower.includes('block') && !lower.includes('high-handle')) {
      return {
        name: 'High-Handle / Elevated Block Deadlift',
        movementId: 'trap-bar-deadlift',
        reason: 'Elevated pull reduces lumbar shear and deep hip flexion under load.',
        notes: 'Neutral spine, pull from mid-shin / high handles.',
      };
    }
    if (/\b(hanging leg raise|toes-to-bar|hanging knee|sit-?up|v-?up)\b/.test(lower)) {
      return {
        name: 'Tall-Kneeling Band/Cable Pallof Press',
        movementId: 'pallof-press',
        reps: '12 reps/side',
        reason: 'Replaces deep hip-flexion core work with low-flexion anti-rotation bracing.',
        notes: 'Ribs stacked over pelvis, 2-second hold at full extension.',
      };
    }
    if (/\b(sprint|400m|800m|100m|hill sprint|track|shuttle|run|agility)\b/.test(lower)) {
      return {
        name: 'SkiErg / RowErg / Assault Bike Threshold Intervals',
        movementId: 'skierg-1000m',
        reps: '6 × 90s hard / 60s easy',
        reason: 'Replaces footstrike impact with zero-impact ergometer threshold conditioning.',
        notes: 'Matches Zone 4 cardiovascular stimulus with zero joint impact.',
      };
    }
    if (/\b(overhead press|military press|push press|shoulder press)\b/.test(lower) && !lower.includes('landmine')) {
      return {
        name: 'Half-Kneeling Landmine / Neutral-Grip DB Press',
        movementId: 'overhead-press',
        reason: 'Scapular-plane arc eliminates overhead shoulder impingement & lumbar arch.',
        notes: 'Ribs down, brace glutes, smooth scapular glide.',
      };
    }
    return null;
  }

  if (constraintMode === 'minimal_gear') {
    if (isSuperset && name.includes(' + ')) {
      const parts = name.split(/\s+\+\s+/);
      let anyChanged = false;
      const swappedParts = parts.map((p) => {
        const subSwap = getConstraintSwapForExercise(p.trim(), reps, 'minimal_gear', false);
        if (subSwap) {
          anyChanged = true;
          return subSwap.name;
        }
        return p.trim();
      });
      if (anyChanged) {
        return {
          name: swappedParts.join(' + '),
          reason: 'Adapted for dumbbells, kettlebells, and bodyweight only.',
          notes: 'Use 3-second controlled eccentric tempo to maximize stimulus with lighter loads.',
        };
      }
      return null;
    }

    if (/\b(trap bar|hex bar|barbell deadlift|conventional deadlift|sumo deadlift)\b/.test(lower)) {
      return {
        name: 'Heavy Dumbbell / Kettlebell Romanian Deadlift',
        movementId: 'db-rdl',
        reps: '8–10 reps',
        reason: 'No barbell or trap bar required; maintains posterior-chain hypertrophy & strength.',
        notes: '3-second eccentric hinge, dumbbells tight to thighs.',
      };
    }
    if (/\b(barbell back squat|back squat|front squat|leg press|hack squat)\b/.test(lower) && !lower.includes('dumbbell') && !lower.includes('goblet')) {
      return {
        name: 'Tempo Dumbbell Goblet / Double-DB Front Squat',
        movementId: 'db-goblet-squat',
        reps: '10–12 reps',
        reason: 'Adapted for dumbbell-only setup with tempo overload.',
        notes: '3-second lowering, 1-second pause at bottom.',
      };
    }
    if (/\b(barbell bench|barbell incline|chest press machine)\b/.test(lower)) {
      return {
        name: 'Dumbbell Floor Press or Deficit Push-Ups',
        movementId: 'incline-db-press',
        reps: '8–12 reps',
        reason: 'Replaces barbell/machine press with minimal-gear pressing equivalent.',
        notes: 'Control descent for 2 seconds, strong lockout.',
      };
    }
    if (/\b(cable|lat pulldown|machine row|seated row|barbell row|pendlay|chest-supported)\b/.test(lower)) {
      return {
        name: 'Single-Arm Dumbbell Gorilla Row (or Strict Pull-Ups)',
        movementId: 'weighted-pull-up',
        reason: 'Eliminates cable/machine dependency using a pair of dumbbells.',
        notes: 'Brace core hard, squeeze lats for 1 second at top.',
      };
    }
    if (/\b(sled|prowler)\b/.test(lower)) {
      return {
        name: 'Heavy Dumbbell Farmers Carry / Backward Walk',
        movementId: 'farmers-carry',
        reps: '40m carry',
        reason: 'Replaces turf sled with heavy loaded carries.',
        notes: 'Brisk stride, packed shoulders, rigid trunk.',
      };
    }
    if (/\b(leg curl|hamstring curl)\b/.test(lower)) {
      return {
        name: 'Single-Leg Glute Bridge / Towel Hamstring Sliders',
        movementId: 'db-rdl',
        reps: '12 reps/leg',
        reason: 'No leg-curl machine needed.',
        notes: 'Full hip extension, 2-second squeeze at top.',
      };
    }
    if (/\b(ski\s*erg|row\s*erg|assault bike|air bike)\b/.test(lower)) {
      return {
        name: 'Kettlebell / Dumbbell Swings + Shadow Shuttle Bursts',
        movementId: 'skierg-1000m',
        reason: 'Replaces ergometer with high-output DB/KB conditioning.',
        notes: 'Crisp hip snap, controlled nasal recovery between rounds.',
      };
    }
    return null;
  }

  return null;
}

function adaptCardioForConstraintMode(
  cardio: CardioPrescription,
  constraintMode: ConstraintMode
): CardioPrescription {
  if (cardio.isRest || constraintMode === 'full_duty') return cardio;
  const lower = cardio.run.toLowerCase();

  if (constraintMode === 'low_impact_rehab') {
    const isAlreadyLowImpact = /\b(ski\s*erg|row\s*erg|bike|swim|incline walk|elliptical|recovery walk|zone 1)\b/.test(lower);
    if (isAlreadyLowImpact) return cardio;

    if (cardio.isInterval) {
      return {
        ...cardio,
        originalRun: cardio.run,
        run: `${cardio.intervalSets || 6} × 90s Zero-Impact SkiErg / RowErg / Bike Threshold Repeats`,
        pace: 'Zone 4 Threshold Effort (RPE 8) · 60–90s easy spin recovery — Zero Ground Impact',
        intervalSets: cardio.intervalSets || 6,
        intervalReps: '90s hard',
        wasSwapped: true,
        swapReason: 'Swapped high-impact running intervals to zero-impact ergometer threshold repeats.',
      };
    }

    return {
      ...cardio,
      originalRun: cardio.run,
      run: lower.includes('ruck')
        ? '25–30 Min Incline Treadmill Walk (6–10% Grade, Unweighted or Light Pack)'
        : '25–35 Min Zero-Impact Zone 2 Bike / RowErg / Incline Walk',
      pace: 'Strict Zone 2 Conversational Aerobic Base (130–145 BPM) — Joint-Safe Impact Reduction',
      wasSwapped: true,
      swapReason: 'Replaced road-impact running/heavy rucking with zero-impact aerobic conditioning.',
    };
  }

  if (constraintMode === 'minimal_gear') {
    if (/\b(ski\s*erg|row\s*erg|assault bike|treadmill|sled)\b/.test(lower)) {
      return {
        ...cardio,
        originalRun: cardio.run,
        run: cardio.isInterval
          ? `${cardio.intervalSets || 6} × 90s Outdoor / Field Shuttle Repeats`
          : '20–30 Min Outdoor Road Run or Brisk Patrol Walk (No Machines)',
        pace: cardio.pace,
        wasSwapped: true,
        swapReason: 'Adapted machine/treadmill cardio for outdoor minimal-gear execution.',
      };
    }
  }

  return cardio;
}

// ============================================================================
// REAL WEEK LOADER FOR EVERY PROGRAM
// ============================================================================

export function getRealWeekProtocol(track: TrainingTrack, weekNumber: number): ProtocolPhase {
  const clampedWeek = Math.max(1, Math.min(track.totalWeeks, weekNumber));

  switch (track.id) {
    case 'hybrid_db':
      return getExpressDbWeekData(clampedWeek);
    case 'apex_protocol':
      return getApexWeekData(clampedWeek);
    case 'tactical_hypertrophy':
      return getTacticalHypertrophyWeekData(clampedWeek);
    case 'hybrid_protocol': {
      const phaseKey = clampedWeek <= 4 ? 'phase1' : clampedWeek <= 8 ? 'phase2' : 'phase3';
      const base = PROTOCOL_DATA[phaseKey] || PROTOCOL_DATA.phase1;
      return {
        ...base,
        weeks: `Week ${clampedWeek} of 12 (${base.weeks})`,
      };
    }
    case 'aft_protocol':
      return getAftWeekData(clampedWeek);
    case 'universal_pat':
      return getUniversalPatWeekData(clampedWeek);
    default: {
      // Custom AI or Coach-Published WorkoutProgram
      const prog = track.sourceProgram;
      if (!prog) {
        return getExpressDbWeekData(1);
      }
      const schedule: ProgramScheduleDay[] =
        prog.schedule && prog.schedule.length > 0
          ? prog.schedule
          : [
              {
                day: 1,
                focus: prog.title,
                warmup: '6–8 min DIME Tactical Warm-Up',
                exercises: prog.exercises || [],
              },
            ];

      const startIdx = (clampedWeek - 1) * 7;
      const weekSlice = schedule.slice(startIdx, startIdx + 7);
      const effectiveSlice = weekSlice.length > 0 ? weekSlice : schedule.slice(0, 7);

      return {
        id: `${track.id}-wk-${clampedWeek}`,
        title: prog.title,
        weeks: track.totalWeeks > 1 ? `Week ${clampedWeek} of ${track.totalWeeks}` : 'Active Session',
        desc: prog.description || prog.subtitle,
        days: effectiveSlice.map((sd, i) => ({
          day: `Day ${i + 1}`,
          focus: sd.focus || `Training Day ${i + 1}`,
          warmup: sd.warmup || '6–8 min DIME Tactical Warm-Up',
          run: sd.conditioning || (sd.isRestDay ? 'Rest' : 'No separate run'),
          pace: sd.conditioning ? 'As prescribed' : 'Recovery',
          strength: sd.isRestDay
            ? ['Complete Rest & Active Mobility']
            : (sd.exercises || []).map((ex) => `${ex.name} (${ex.defaultSets}x${ex.targetReps})`),
        })),
      };
    }
  }
}

function getCustomScheduleDayForSlot(
  track: TrainingTrack,
  weekNumber: number,
  dayIndexZeroBased: number
): ProgramScheduleDay | null {
  const prog = track.sourceProgram;
  if (!prog) return null;
  if (prog.schedule && prog.schedule.length > 0) {
    const absoluteIdx = (weekNumber - 1) * 7 + dayIndexZeroBased;
    return prog.schedule[absoluteIdx] || prog.schedule[dayIndexZeroBased % prog.schedule.length] || null;
  }
  return {
    day: 1,
    focus: prog.title,
    warmup: '6–8 min DIME Tactical Warm-Up',
    exercises: prog.exercises || [],
  };
}

// ============================================================================
// BUILD TRANSFORMED WORKOUT SESSION FOR ANY REAL PROGRAM DAY
// ============================================================================

function roundToNearest5(weight: number): number {
  return Math.max(5, Math.round(weight / 5) * 5);
}

function buildPrescribedExercisesFromProtocolDay(
  adjustedDay: ProtocolDay,
  track: TrainingTrack,
  dayNumber: number
): PrescribedExercise[] {
  const rawStrengthLines = (adjustedDay.strength || []).filter(isRealStrengthEntry);

  return rawStrengthLines.map((str, idx) => {
    const parsed = parseExerciseString(str);
    const name = parsed.name;
    const muscleGroup = inferMuscleGroup(name);
    const configuredRest = (() => {
      const m = str.match(/\[.*?rest:\s*(\d+)s?.*?\]/i);
      if (m) {
        const v = parseInt(m[1], 10);
        if (!isNaN(v) && v > 0) return v;
      }
      return getDefaultRestPeriod(str.replace(/\[.*?\]/g, '').trim());
    })();

    const isInterval = isIntervalRunExercise(name, parsed.targetReps) || isIntervalRunExercise(str, str);
    const isEasyRun = !isInterval && isContinuousRunOrRuckExercise(name, parsed.targetReps);
    const isCarry = isCarryDistanceExercise(name, parsed.targetReps);
    const isBw = isBodyweightExercise(name, adjustedDay.focus);

    const candidateTemplate: ExerciseTemplate = {
      id: `${track.id}-d${dayNumber}-ex-${idx}`,
      name,
      muscleGroup,
      type: isInterval || isEasyRun ? 'cardio' : muscleGroup === 'Core' ? 'core' : 'strength',
      defaultSets: parsed.defaultSets,
      targetReps: parsed.targetReps,
      targetRpe: parsed.targetRpe || 8,
      restPeriodSeconds: configuredRest,
      notes: parsed.notes || `${adjustedDay.day} · ${adjustedDay.focus}`,
    };

    const detectedFormat = getExerciseFormat(candidateTemplate);
    let supersetExercises = undefined;
    let finalSets = parsed.defaultSets;
    let finalRest = configuredRest;
    let enrichedTemplate: ExerciseTemplate = candidateTemplate;

    if (detectedFormat === 'superset') {
      const ss = parseSupersetDetails(candidateTemplate);
      supersetExercises = ss.movements;
      finalSets = ss.rounds;
      enrichedTemplate = {
        ...candidateTemplate,
        format: 'superset',
        type: 'superset',
        defaultSets: ss.rounds,
        supersetExercises: ss.movements,
      };
    } else if (detectedFormat === 'emom') {
      const emom = parseEmomDetails(candidateTemplate);
      enrichedTemplate = {
        ...candidateTemplate,
        format: 'emom',
        type: 'emom',
        emomMinutes: emom.totalMinutes,
        emomIntervalSeconds: emom.intervalSeconds,
        emomMovements: emom.movements,
      };
    } else if (detectedFormat === 'amrap') {
      const amrap = parseAmrapDetails(candidateTemplate);
      enrichedTemplate = {
        ...candidateTemplate,
        format: 'amrap',
        type: 'amrap',
        amrapDurationMinutes: amrap.durationMinutes,
        amrapMovements: amrap.movements,
      };
    } else if (detectedFormat === 'circuit') {
      const cir = parseCircuitDetails(candidateTemplate);
      finalSets = cir.rounds;
      finalRest = cir.restBetweenRoundsSeconds;
      enrichedTemplate = {
        ...candidateTemplate,
        format: 'circuit',
        type: 'circuit',
        defaultSets: cir.rounds,
        restPeriodSeconds: cir.restBetweenRoundsSeconds,
      };
    }

    const blockType = inferBlockType(name, detectedFormat, isCarry, isInterval, isEasyRun, idx);
    const movementId =
      matchExerciseNameToMovementId(name) ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 48);

    const isPrimaryCompound =
      idx === 0 ||
      /\b(deadlift|back squat|front squat|bench press|overhead press|pull-up|trap bar)\b/i.test(name);

    const loadPercent1RM =
      !isBw && !isEasyRun && !isInterval && !isCarry && isPrimaryCompound
        ? parsed.targetRpe && parsed.targetRpe >= 8.5
          ? 0.85
          : 0.78
        : undefined;

    return {
      id: `${track.id}-d${dayNumber}-ex-${idx}`,
      movement_id: movementId,
      name,
      blockType,
      muscleGroup,
      sets: isEasyRun ? 1 : finalSets,
      reps: parsed.targetReps,
      targetRpe: parsed.targetRpe || 8,
      restSeconds: isEasyRun ? 0 : finalRest,
      loadPercent1RM,
      isAccessory: idx >= 2 && !isInterval && !isEasyRun,
      isHighImpact: /\b(box jump|sprint|burpee|lunge|split squat|back squat|hanging leg|run)\b/i.test(name),
      notes: parsed.notes || `${adjustedDay.focus}`,
      format: detectedFormat,
      supersetExercises,
      isEasyRun,
      isIntervalRun: isInterval,
      isCarryDistance: isCarry,
      isBodyweight: isBw,
      distanceMiles: isEasyRun ? extractDistanceMiles(str) : undefined,
      sourceTemplate: enrichedTemplate,
    };
  });
}

function buildPrescribedExercisesFromTemplates(
  templates: ExerciseTemplate[],
  track: TrainingTrack,
  dayNumber: number,
  operationalCondition: OperationalCondition
): PrescribedExercise[] {
  const adjustedTemplates = applyOperationalConditionToExercises(templates, operationalCondition);
  return adjustedTemplates.map((tpl, idx) => {
    const isInterval = isIntervalRunExercise(tpl.name, tpl.targetReps);
    const isEasyRun = !isInterval && isContinuousRunOrRuckExercise(tpl.name, tpl.targetReps, tpl.type);
    const isCarry = isCarryDistanceExercise(tpl.name, tpl.targetReps);
    const isBw = isBodyweightExercise(tpl.name);
    const detectedFormat = getExerciseFormat(tpl);
    const supersetExercises =
      tpl.supersetExercises && tpl.supersetExercises.length > 0
        ? tpl.supersetExercises
        : detectedFormat === 'superset'
        ? parseSupersetDetails(tpl).movements
        : undefined;

    const movementId =
      matchExerciseNameToMovementId(tpl.name) ||
      tpl.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 48);

    const blockType = inferBlockType(tpl.name, detectedFormat, isCarry, isInterval, isEasyRun, idx);

    return {
      id: tpl.id || `${track.id}-d${dayNumber}-ex-${idx}`,
      movement_id: movementId,
      name: tpl.name,
      blockType,
      muscleGroup: tpl.muscleGroup || inferMuscleGroup(tpl.name),
      sets: isEasyRun ? 1 : tpl.defaultSets || 3,
      reps: tpl.targetReps || '10',
      targetRpe: tpl.targetRpe || 8,
      restSeconds: isEasyRun ? 0 : tpl.restPeriodSeconds || 60,
      isAccessory: idx >= 2 && !isInterval && !isEasyRun,
      isHighImpact: /\b(box jump|sprint|burpee|lunge|split squat|back squat|hanging leg|run)\b/i.test(tpl.name),
      notes: tpl.scalingNote ? `${tpl.scalingNote}${tpl.notes ? ` · ${tpl.notes}` : ''}` : tpl.notes || '',
      format: detectedFormat,
      supersetExercises,
      isEasyRun,
      isIntervalRun: isInterval,
      isCarryDistance: isCarry,
      isBodyweight: isBw,
      distanceMiles: tpl.distance_miles || (isEasyRun ? extractDistanceMiles(tpl.name, tpl.targetReps) : undefined),
      pace: tpl.pace,
      sourceTemplate: tpl,
    };
  });
}

function buildCardioPrescription(
  day: ProtocolDay & { runSkippedByUnitPt?: boolean },
  exercises: PrescribedExercise[],
  constraintMode: ConstraintMode
): CardioPrescription {
  const hasRealRun = isRealConditioningRunEntry(day.run);
  if (!hasRealRun) {
    return {
      run: day.run || 'Rest — No Separate Cardio',
      pace: day.pace || 'Recovery / Included in Session',
      isRest: true,
      isEasyRun: false,
      isInterval: false,
    };
  }

  // Avoid duplicate cardio card if the exact interval run is already listed inside exercises
  const isInterval = isIntervalRunExercise(day.run, day.pace);
  const alreadyListedInStrength = exercises.some(
    (ex) =>
      (isInterval && ex.isIntervalRun) ||
      ex.name.toLowerCase().includes(day.run.trim().toLowerCase().slice(0, 18))
  );

  if (alreadyListedInStrength && !day.runSkippedByUnitPt) {
    return {
      run: day.run,
      pace: day.pace,
      isRest: false,
      isEasyRun: !isInterval,
      isInterval,
      intervalSets: isInterval ? parseIntervalSetsAndReps(day.run, day.pace)?.sets : undefined,
      intervalReps: isInterval ? parseIntervalSetsAndReps(day.run, day.pace)?.targetReps : undefined,
      distanceMiles: !isInterval ? extractDistanceMiles(day.run, day.pace) : undefined,
    };
  }

  const intervalSpec = isInterval ? parseIntervalSetsAndReps(day.run, day.pace) : null;
  const baseCardio: CardioPrescription = {
    run: day.run.trim(),
    pace: day.pace || 'Target Pace as Prescribed',
    isRest: false,
    isEasyRun: !isInterval,
    isInterval,
    intervalSets: intervalSpec?.sets,
    intervalReps: intervalSpec?.targetReps,
    distanceMiles: !isInterval ? extractDistanceMiles(day.run, day.pace) : undefined,
    runSkippedByUnitPt: day.runSkippedByUnitPt,
  };

  return adaptCardioForConstraintMode(baseCardio, constraintMode);
}

/**
 * Resolves and transforms a specific (weekNumber, dayInWeek) of ANY real program track
 * applying Volume Tier, Readiness/Constraint Mode, Operational Condition, and Global PRs.
 */
export function transformRealProgramDay(
  track: TrainingTrack,
  weekNumber: number,
  dayInWeek: number,
  programState: UserProgramState,
  benchmarks: GlobalBenchmarkLog[],
  operationalCondition: OperationalCondition = 'garrison'
): TransformedWorkoutSession {
  const clampedWeek = Math.max(1, Math.min(track.totalWeeks, weekNumber));
  const phase = getRealWeekProtocol(track, clampedWeek);
  const totalDaysInWeek = Math.max(1, phase.days.length);
  const clampedDayInWeek = Math.max(1, Math.min(totalDaysInWeek, dayInWeek));
  const rawDay = phase.days[clampedDayInWeek - 1] || phase.days[0];
  const sequentialDayIndex = (clampedWeek - 1) * 7 + clampedDayInWeek;

  // Apply 1-Tap Operational Condition (adjusts both strength & cardio volume + intensity)
  const adjustedProtocolDay = applyOperationalConditionToDay(rawDay, operationalCondition);

  const customScheduleDay =
    track.isCustom || track.isCoachPublished
      ? getCustomScheduleDayForSlot(track, clampedWeek, clampedDayInWeek - 1)
      : null;

  const isRestDay = customScheduleDay
    ? Boolean(customScheduleDay.isRestDay || (!customScheduleDay.exercises?.length && !customScheduleDay.conditioning))
    : isProtocolDayRest(rawDay);

  const baseExercises: PrescribedExercise[] = isRestDay
    ? []
    : customScheduleDay
    ? buildPrescribedExercisesFromTemplates(
        customScheduleDay.exercises || [],
        track,
        clampedDayInWeek,
        operationalCondition
      )
    : buildPrescribedExercisesFromProtocolDay(adjustedProtocolDay, track, clampedDayInWeek);

  const cardio = buildCardioPrescription(adjustedProtocolDay, baseExercises, programState.constraint_mode);

  const bmMap = new Map<string, GlobalBenchmarkLog>();
  for (const bm of benchmarks) {
    bmMap.set(bm.movement_id, bm);
  }

  let totalSetsOriginal = 0;
  let totalSetsAdjusted = 0;
  let swappedCount = cardio.wasSwapped ? 1 : 0;

  const transformedExercises: TransformedExercise[] = baseExercises.map((ex) => {
    const originalSets = ex.sets;
    if (!ex.isEasyRun) {
      totalSetsOriginal += originalSets;
    }

    let activeName = ex.name;
    let activeMovementId = ex.movement_id;
    let activeReps = ex.reps;
    let activeNotes = ex.notes;
    let activeSupersetExercises = ex.supersetExercises;
    let wasSwapped = false;
    let swapReason: string | undefined;

    const constraintSwap = getConstraintSwapForExercise(
      ex.name,
      ex.reps,
      programState.constraint_mode,
      ex.format === 'superset'
    );

    if (constraintSwap) {
      activeName = constraintSwap.name;
      if (constraintSwap.movementId) activeMovementId = constraintSwap.movementId;
      if (constraintSwap.reps) activeReps = constraintSwap.reps;
      activeNotes = `${constraintSwap.notes}${ex.notes ? ` · ${ex.notes}` : ''}`;
      wasSwapped = true;
      swapReason = constraintSwap.reason;
      swappedCount += 1;

      if (ex.format === 'superset' && activeSupersetExercises && activeSupersetExercises.length > 0) {
        const swappedParts = constraintSwap.name.split(/\s+\+\s+/);
        activeSupersetExercises = activeSupersetExercises.map((sub, i) => ({
          ...sub,
          name: swappedParts[i] || sub.name,
        }));
      }
    }

    // Standard Volume Tier trims accessory sets by ~20–25%
    let adjustedSets = originalSets;
    let wasVolumeTrimmed = false;
    if (
      programState.volume_tier === 'standard' &&
      ex.isAccessory &&
      !ex.isEasyRun &&
      adjustedSets >= 3
    ) {
      const reduced = Math.max(2, Math.round(adjustedSets * 0.75));
      if (reduced < adjustedSets) {
        adjustedSets = reduced;
        wasVolumeTrimmed = true;
      }
    }

    if (!ex.isEasyRun) {
      totalSetsAdjusted += adjustedSets;
    }

    const benchmark = bmMap.get(activeMovementId) || bmMap.get(ex.movement_id);
    let prescribedWeightLbs: number | undefined;
    if (benchmark?.estimated_1rm_lbs && ex.loadPercent1RM && !ex.isBodyweight) {
      prescribedWeightLbs = roundToNearest5(benchmark.estimated_1rm_lbs * ex.loadPercent1RM);
    } else if (benchmark?.best_weight_lbs && ex.isCarryDistance) {
      prescribedWeightLbs = benchmark.best_weight_lbs;
    }

    return {
      ...ex,
      movement_id: activeMovementId,
      name: activeName,
      reps: activeReps,
      notes: activeNotes,
      supersetExercises: activeSupersetExercises,
      sets: adjustedSets,
      originalSets,
      originalName: wasSwapped ? ex.name : undefined,
      wasVolumeTrimmed,
      wasSwapped,
      swapReason,
      benchmark,
      prescribedWeightLbs,
    };
  });

  const volumeReductionPct =
    totalSetsOriginal > 0 && totalSetsAdjusted < totalSetsOriginal
      ? Math.round(((totalSetsOriginal - totalSetsAdjusted) / totalSetsOriginal) * 100)
      : 0;

  const baseMinutes = track.avgDurationMinutes || 45;
  const estimatedMinutes = isRestDay
    ? 15
    : programState.volume_tier === 'standard'
    ? Math.max(25, Math.round(baseMinutes * 0.9))
    : baseMinutes;

  const warmupSummary =
    customScheduleDay?.warmup ||
    (track.id === 'hybrid_db'
      ? '6-Min Express DIME Warm-Up (Dynamic mobility, isometric brace, movement prep)'
      : track.id === 'tactical_hypertrophy'
      ? '8-Min Tactical Bodybuilding DIME Warm-Up + 2 ramp-up sets on first lift'
      : '8–10 Min Mandatory DIME Tactical Warm-Up + progressive bar ramp-up');

  return {
    trackId: track.id,
    trackTitle: track.title,
    weekNumber: clampedWeek,
    totalWeeks: track.totalWeeks,
    phaseTitle: phase.title,
    phaseWeeksLabel: phase.weeks,
    phaseDescription: phase.desc,
    dayInWeek: clampedDayInWeek,
    sequentialDayIndex,
    totalCycleDays: totalDaysInWeek,
    isRestDay,
    session: {
      id: `${track.id}-w${clampedWeek}-d${clampedDayInWeek}`,
      dayNumber: clampedDayInWeek,
      title: adjustedProtocolDay.focus,
      focus: phase.desc || adjustedProtocolDay.focus,
      estimatedMinutes,
      isRestDay,
      warmupSummary,
      conditioningSummary: cardio.isRest ? undefined : `${cardio.run} (${cardio.pace})`,
      cardio,
      operationalNote: adjustedProtocolDay.operationalNote,
      exercises: transformedExercises,
      rawProtocolDay: adjustedProtocolDay,
    },
    exercises: transformedExercises,
    cardio,
    totalSetsOriginal,
    totalSetsAdjusted,
    volumeReductionPct,
    swappedCount,
    estimatedMinutes,
  };
}

/**
 * Returns all days for the selected week so the user can toggle between Today's Focus and Full Week Overview.
 */
export function transformRealProgramWeek(
  track: TrainingTrack,
  weekNumber: number,
  programState: UserProgramState,
  benchmarks: GlobalBenchmarkLog[],
  operationalCondition: OperationalCondition = 'garrison'
): TransformedWorkoutSession[] {
  const phase = getRealWeekProtocol(track, weekNumber);
  return phase.days.map((_, idx) =>
    transformRealProgramDay(track, weekNumber, idx + 1, programState, benchmarks, operationalCondition)
  );
}

/**
 * Converts a TransformedWorkoutSession into a complete, launch-ready WorkoutProgram
 * for ActiveWorkoutModal (preserving supersets, carry distances, interval runs, easy runs,
 * Auto-Overload progression rules, and Global PR target loads).
 */
export function buildWorkoutProgramForLaunch(
  transformed: TransformedWorkoutSession,
  track: TrainingTrack,
  programState: UserProgramState,
  operationalCondition: OperationalCondition
): WorkoutProgram {
  const exercises: ExerciseTemplate[] = transformed.exercises.map((ex, idx) => {
    const baseTpl = ex.sourceTemplate;
    const lowerName = ex.name.toLowerCase();

    let progressionRuleObj = baseTpl?.progression_rules;
    if (!progressionRuleObj) {
      if (ex.isIntervalRun) {
        progressionRuleObj = {
          metric: 'seconds',
          trigger: 'pace_progression',
          increment_value: -2,
          action: 'drop 2-3s per interval repeat',
        };
      } else if (ex.isEasyRun) {
        progressionRuleObj = {
          metric: 'distance_miles',
          trigger: 'per_week',
          increment_value: 0.5,
          action: '+0.5 mi weekly aerobic expansion',
        };
      } else if (ex.isBodyweight) {
        progressionRuleObj = isExerciseTimed(ex.name, undefined, ex.reps)
          ? { metric: 'seconds', trigger: 'per_set', increment_value: 5, action: '+5s hold' }
          : { metric: 'reps', trigger: 'complete_max_reps', increment_value: 1, action: '+1 clean rep' };
      } else if (/\b(deadlift|squat|hip thrust|rdl|romanian)\b/.test(lowerName) && !lowerName.includes('split')) {
        progressionRuleObj = {
          metric: 'weight_lbs',
          trigger: 'complete_max_reps',
          increment_value: 10,
          action: '+10 lbs next session',
        };
      } else {
        progressionRuleObj = {
          metric: 'weight_lbs',
          trigger: 'complete_max_reps',
          increment_value: 5,
          action: '+5 lbs next session',
        };
      }
    }

    return {
      ...(baseTpl || {}),
      id: ex.id || `launch-ex-${idx}-${Date.now()}`,
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      type:
        ex.format === 'superset'
          ? 'superset'
          : ex.format === 'emom'
          ? 'emom'
          : ex.format === 'amrap'
          ? 'amrap'
          : ex.format === 'circuit'
          ? 'circuit'
          : ex.isEasyRun || ex.isIntervalRun
          ? 'cardio'
          : ex.muscleGroup === 'Core'
          ? 'core'
          : 'strength',
      format: ex.format,
      supersetExercises: ex.supersetExercises,
      defaultSets: ex.isEasyRun ? 1 : ex.sets,
      targetReps: ex.reps,
      targetRpe: ex.targetRpe,
      restPeriodSeconds: ex.restSeconds,
      weight_lbs: ex.prescribedWeightLbs ?? baseTpl?.weight_lbs,
      distance_miles: ex.distanceMiles ?? baseTpl?.distance_miles,
      pace: ex.pace ?? baseTpl?.pace,
      progression_rules: progressionRuleObj,
      originalExerciseName: ex.originalName,
      adaptationReason: ex.swapReason,
      notes: [
        ex.prescribedWeightLbs ? `Target Load: ${ex.prescribedWeightLbs} lb` : undefined,
        ex.notes,
        ex.swapReason ? `Constraint Swap: ${ex.swapReason}` : undefined,
      ]
        .filter(Boolean)
        .join(' · '),
    };
  });

  // Append cardio block as a trackable cardio exercise if it is real conditioning and not already present
  const cardio = transformed.cardio;
  if (cardio && !cardio.isRest) {
    const alreadyInList = exercises.some(
      (e) =>
        (cardio.isInterval && isIntervalRunExercise(e.name, e.targetReps)) ||
        (e.type === 'cardio' &&
          e.name.toLowerCase().includes(cardio.run.toLowerCase().slice(0, 14)))
    );

    if (!alreadyInList) {
      if (cardio.isInterval) {
        exercises.push({
          id: `launch-cardio-${Date.now()}`,
          name: cardio.run,
          muscleGroup: 'Full Body',
          type: 'cardio',
          defaultSets: cardio.intervalSets || 6,
          targetReps: cardio.intervalReps || '400m',
          targetRpe: 8.5,
          restPeriodSeconds: 90,
          pace: cardio.pace,
          progression_rules: {
            metric: 'seconds',
            trigger: 'pace_progression',
            increment_value: -2,
            action: 'drop 2-3s per interval repeat',
          },
          notes: `${cardio.run} · Target Pace: ${cardio.pace}`,
        });
      } else {
        const dist = cardio.distanceMiles || 2.5;
        exercises.push({
          id: `launch-cardio-${Date.now()}`,
          name: cardio.run,
          muscleGroup: 'Full Body',
          type: 'cardio',
          defaultSets: 1,
          targetReps: `${dist} ${dist === 1 ? 'mile' : 'miles'}`,
          restPeriodSeconds: 0,
          distance_miles: dist,
          pace: cardio.pace,
          progression_rules: {
            metric: 'distance_miles',
            trigger: 'per_week',
            increment_value: 0.5,
            action: '+0.5 mi weekly aerobic expansion',
          },
          notes: `${cardio.run} · Target Pace: ${cardio.pace}`,
        });
      }
    }
  }

  const baseProgram: WorkoutProgram = {
    id: `session-${track.id}-w${transformed.weekNumber}-d${transformed.dayInWeek}-${Date.now()}`,
    title: `${track.title} · Wk ${transformed.weekNumber} Day ${transformed.dayInWeek}: ${transformed.session.title}`,
    subtitle: `${transformed.phaseTitle} (${transformed.phaseWeeksLabel}) · ${
      programState.volume_tier === 'standard' ? 'Standard' : 'High Volume'
    } · ${
      programState.constraint_mode === 'low_impact_rehab'
        ? 'Low-Impact'
        : programState.constraint_mode === 'minimal_gear'
        ? 'Minimal Gear'
        : 'Full Duty'
    }`,
    category: 'Hybrid',
    frequency: track.frequencyLabel,
    estimatedDurationMinutes: transformed.estimatedMinutes,
    recommendedWarmupId: track.recommendedWarmupId,
    description: transformed.session.focus,
    exercises:
      exercises.length > 0
        ? exercises
        : [
            {
              id: 'recovery-mobility',
              name: 'Active Recovery & Mobility Flow',
              muscleGroup: 'Core',
              defaultSets: 1,
              targetReps: '15 mins',
              restPeriodSeconds: 0,
              notes: 'Light mobility, nasal breathing, and tissue recovery.',
            },
          ],
  };

  // Note: Operational condition is already reflected on protocol days, but applying badge prefix keeps modal clarity
  if (operationalCondition !== 'garrison' && !track.isCustom && !track.isCoachPublished) {
    return {
      ...baseProgram,
      title: `[${operationalCondition.replace(/_/g, ' ').toUpperCase()}] ${baseProgram.title}`,
    };
  }
  return operationalCondition !== 'garrison'
    ? applyOperationalConditionToProgram(baseProgram, operationalCondition)
    : baseProgram;
}
