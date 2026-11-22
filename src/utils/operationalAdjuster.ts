import { ExerciseTemplate, OperationalCondition, WorkoutProgram, isContinuousRunOrRuckExercise, isIntervalRunExercise } from '../types';
import { ProtocolDay } from '../data/protocolData';

export interface OperationalConditionMeta {
  id: OperationalCondition;
  shortLabel: string;
  label: string;
  summary: string;
  ruleDetail: string;
}

export const OPERATIONAL_CONDITIONS: OperationalConditionMeta[] = [
  {
    id: 'garrison',
    shortLabel: 'Garrison (Full)',
    label: 'Standard Garrison',
    summary: 'Full prescribed volume, intensity, loads, and conditioning.',
    ruleDetail: 'Preserves exact master program prescription for both strength and cardio as written.',
  },
  {
    id: 'unit_pt_run',
    shortLabel: 'Unit PT Today',
    label: 'Unit PT Today (3+ Mi Run / Heavy PT)',
    summary: 'Trims strength sets ~25% @ RPE 7.5 (-10% load) & scales cardio/intervals for recovery.',
    ruleDetail:
      'Unit PT Full-Day Rule: Trims working strength sets by ~25% and caps intensity at RPE 7.5 (2–3 RIR, -10% load) to account for morning PT fatigue; skips redundant continuous runs or cuts sprint/track interval volume by 50% at controlled RPE 6.5.',
  },
  {
    id: 'ftx_low_sleep',
    shortLabel: 'FTX / Low Sleep',
    label: 'FTX / Low Sleep (<5h)',
    summary: 'Cuts strength & interval sets ~40-50%, caps intensity at RPE 6.5-7 (3 RIR), 15-20m Zone 1-2 flush.',
    ruleDetail:
      'FTX / Low-Sleep Full-Day Protocol: Cuts strength and interval sets by 40–50%, lowers target intensity to RPE 6.5–7.0 (3 RIR / -15% load) with +30s rest, and converts high-CNS cardio/runs into a 15–20 min low-impact Zone 1–2 recovery flush (<135 BPM).',
  },
  {
    id: 'austere_field',
    shortLabel: 'Austere / Field',
    label: 'Austere / Field Kit (Zero-Gym)',
    summary: 'Swaps gym lifts to ruck/sandbag/bodyweight (+density @ RPE 8) & track/treadmill cardio to field patrol.',
    ruleDetail:
      'Austere Field Full-Day Mode: Swaps barbell, dumbbell, cable, and machine lifts (including supersets) to ruck, sandbag, and bodyweight field equivalents at high density (RPE 8, 60–75s rest) and adapts track/treadmill cardio to unmarked field shuttles or outdoor patrol rucks.',
  },
];

function reduceSetsInPrescription(line: string, ratio: number, minSets = 1): string {
  // Matches patterns like "(4x8-10 each)", "(6-8x400m)", "4x8-10", "5x5", "3-4x10"
  return line.replace(/\b(\d+)(?:\s*[-–]\s*(\d+))?\s*(x|×)\s*/gi, (_match, s1, _s2, mult) => {
    const baseSets = parseInt(s1, 10);
    if (isNaN(baseSets) || baseSets <= 1) return _match;
    const reduced = Math.max(minSets, Math.round(baseSets * ratio));
    return `${reduced}${mult}`;
  });
}

function adjustIntensityTagsInStrengthLine(
  line: string,
  targetRpeLabel: string,
  extraRestNote?: string
): string {
  let updated = line
    .replace(/Challenging\s*RPE\s*[\d.]+/gi, targetRpeLabel)
    .replace(/Heavy\s*RPE\s*[\d.]+/gi, targetRpeLabel)
    .replace(/RPE\s*8(?:\.5)?(?:[-–]9(?:\.5)?)?/gi, targetRpeLabel)
    .replace(/All-Out\s*95%\s*effort/gi, `Controlled ${targetRpeLabel} effort`)
    .replace(/Hard\s*8[05]%\s*effort/gi, `Controlled ${targetRpeLabel} effort`);

  if (extraRestNote && /Rest:\s*(\d+)\s*s/i.test(updated)) {
    updated = updated.replace(/Rest:\s*(\d+)\s*s/i, (_m, secStr) => {
      const baseSec = parseInt(secStr, 10);
      if (isNaN(baseSec)) return _m;
      return `Rest: ${baseSec + 30}s`;
    });
  }
  return updated;
}

function isCardioOrIntervalLine(line: string): boolean {
  const lower = line.toLowerCase();
  return (
    isIntervalRunExercise(line, line) ||
    isContinuousRunOrRuckExercise(line, line) ||
    lower.includes('track/treadmill repeats') ||
    lower.includes('hill sprints') ||
    lower.includes('shuttle') ||
    lower.includes('sprint-drag-carry')
  );
}

function isRealRunString(runStr?: string): boolean {
  if (!runStr) return false;
  const lower = runStr.replace(/\[.*?\]/g, '').trim().toLowerCase();
  if (
    !lower ||
    lower === 'rest' ||
    lower.startsWith('rest ') ||
    lower.startsWith('rest/') ||
    lower.startsWith('rest /') ||
    lower.startsWith('rest -') ||
    lower.startsWith('rest —') ||
    lower.startsWith('rest:') ||
    lower.startsWith('none') ||
    lower.includes('complete rest') ||
    lower.includes('rest from running') ||
    lower.includes('no cardio') ||
    lower.includes('no separate run') ||
    lower.includes('included in session') ||
    lower.includes('cns recovery') ||
    lower === 'n/a'
  ) {
    return false;
  }
  return true;
}

function swapSingleMovementNameToAustere(name: string): string {
  const lower = name.toLowerCase();

  if (lower.includes('deadlift') || lower.includes('rdl') || lower.includes('sumo') || lower.includes('hip thrust')) {
    return 'Heavy Ruck / Sandbag Deadlift or Good Morning';
  }
  if (
    lower.includes('goblet squat') ||
    lower.includes('front squat') ||
    lower.includes('back squat') ||
    lower.includes('leg press') ||
    lower.includes('hack squat')
  ) {
    return 'Ruck-Loaded Tempo Squat (3-Sec Lowering)';
  }
  if (
    lower.includes('bulgarian split squat') ||
    lower.includes('reverse lunge') ||
    lower.includes('walking lunge') ||
    lower.includes('step-up')
  ) {
    return 'Ruck-Loaded Split Squat / Ammo-Can Step-Up';
  }
  if (lower.includes('glute bridge')) {
    return 'Ruck-on-Hips Glute Bridge';
  }
  if (lower.includes('box jump')) {
    return 'Explosive Ruck Squat Jumps (or Broad Jumps)';
  }
  if (
    lower.includes('bench press') ||
    lower.includes('incline') && lower.includes('press') ||
    lower.includes('floor press') ||
    lower.includes('chest press')
  ) {
    return 'Ruck-Weighted Deficit Hand-Release Push-Ups';
  }
  if (
    lower.includes('shoulder press') ||
    lower.includes('push press') ||
    lower.includes('overhead press') ||
    lower.includes('military press') ||
    lower.includes('thruster')
  ) {
    return 'Ruck / Sandbag Overhead Push Press (or Pike Push-Ups)';
  }
  if (lower.includes('pull-up') || lower.includes('chin-up') || lower.includes('lat pulldown')) {
    return 'Tactical Beam Pull-Ups or Heavy Ruck Bent-Over Rows';
  }
  if (
    lower.includes('row') &&
    (lower.includes('dumbbell') ||
      lower.includes('barbell') ||
      lower.includes('cable') ||
      lower.includes('chest-supported') ||
      lower.includes('seal') ||
      lower.includes('bird-dog'))
  ) {
    return 'Heavy Ruck / Sandbag Bent-Over Row';
  }
  if (lower.includes('swing')) {
    return 'Two-Hand Ruck / Sandbag Hip-Hinge Swings';
  }
  if (lower.includes('plank pull-through')) {
    return 'Ruck Plank Pull-Throughs';
  }
  if (lower.includes('weighted forearm plank')) {
    return 'Ruck-Loaded Forearm Plank (35 lb Pack)';
  }
  if (lower.includes('curl') && !lower.includes('leg curl') && !lower.includes('nordic') && !lower.includes('mcgill')) {
    return 'Ruck Top-Handle / Sandbag Biceps Curls';
  }
  if (lower.includes('tricep') || lower.includes('pushdown') || lower.includes('skullcrusher') || lower.includes('dip')) {
    return 'Ruck Overhead Triceps Extensions or Diamond Push-Ups';
  }
  if (lower.includes('lateral raise') || lower.includes('rear-delt') || lower.includes('rear delt') || lower.includes('face pull')) {
    return 'Ruck-Plate Lateral Raises & Prone Y-T-W Scapular Raises';
  }
  if (lower.includes('farmer') || lower.includes('suitcase carry') || lower.includes('front-rack carry') || lower.includes('carry')) {
    return 'Heavy Ruck / Dual Water-Can Tactical Carry (40m)';
  }
  if (lower.includes('leg curl') || lower.includes('hamstring')) {
    return 'Slick-Floor Boot Hamstring Sliders or Single-Leg Bridges';
  }
  if (lower.includes('sled')) {
    return 'Heavy Ruck Backward Drag / Buddy Drag (50m)';
  }
  return name;
}

function swapToAustereMovement(line: string): string {
  const lower = line.toLowerCase();
  if (lower.includes('complete rest')) {
    return line;
  }

  // Handle cardio/interval items inside day.strength
  if (isCardioOrIntervalLine(line)) {
    if (lower.includes('400m')) {
      return 'Unmarked Field Shuttle Repeats (~90s Hard Effort / 60s Walk) (6-8x90s) [Austere Field Equivalent • RPE 8 • Rest: 60s walk]';
    }
    if (lower.includes('800m')) {
      return 'Unmarked Field Threshold Repeats (~3:15 Hard Effort / 90s Walk) (4x3:15) [Austere Field Equivalent • RPE 8.5 • Rest: 90s walk]';
    }
    if (lower.includes('hill sprints') || lower.includes('100m') || lower.includes('40m')) {
      return 'Field Combat Sprints (10s All-Out Burst / 50s Walk Recovery) (12-15x10s) [Austere Field Equivalent • RPE 9 • Rest: 50s walk]';
    }
    return `${line.replace(/\[.*?\]/g, '').trim()} [Austere Field Patrol Equivalent • RPE 8]`;
  }

  // Handle 20-Minute Dumbbell Conditioning Circuit (AMRAP)
  if (lower.includes('conditioning circuit') && lower.includes('amrap')) {
    return '20-Minute Field Kit Combat Conditioning Circuit (AMRAP): 15 Ruck Hip-Hinge Swings + 10 Ruck Thrusters + 12 Hand-Release Push-Ups + 30m Heavy Ruck Front-Carry (5x1 full circuit) [Austere Field AMRAP • Hard RPE 8.5 • Rest: 30s as needed]';
  }

  // Extract bracket notes and trailing set/rep parentheses if present
  const bracketMatches = line.match(/\[.*?\]/g) || [];
  const withoutBrackets = line.replace(/\[.*?\]/g, '').trim();

  // Check if this is a Superset line with " + "
  const prefixMatch = withoutBrackets.match(/^((?:.*?(?:Superset\s*\d+|Finisher\s*Pair|Core\s*Finisher|Carry\s*Finisher)[^:]*:\s*))/i);
  const prefix = prefixMatch ? prefixMatch[1] : '';
  const bodyAfterPrefix = prefix ? withoutBrackets.slice(prefix.length).trim() : withoutBrackets;

  // Match trailing "(4x8-10 each)" etc.
  const trailingParensMatch = bodyAfterPrefix.match(/(\(\d+[^)]*\))\s*$/);
  const trailingSetRep = trailingParensMatch ? trailingParensMatch[1] : '';
  const movementCore = trailingParensMatch
    ? bodyAfterPrefix.slice(0, bodyAfterPrefix.length - trailingParensMatch[0].length).trim()
    : bodyAfterPrefix;

  if (movementCore.includes(' + ')) {
    const parts = movementCore.split(/\s+\+\s+/);
    const swappedParts = parts.map((p) => swapSingleMovementNameToAustere(p.trim()));
    const noteSuffix =
      bracketMatches.length > 0
        ? `${bracketMatches.join(' ').replace(/\]$/, ' • Austere Field Kit Swap: +2 Reps Density @ RPE 8]')}`
        : '[Austere Field Kit Swap: +2 Reps Density @ RPE 8 • Rest: 60s]';
    return `${prefix}${swappedParts.join(' + ')} ${trailingSetRep} ${noteSuffix}`.replace(/\s+/g, ' ').trim();
  }

  const swappedSingle = swapSingleMovementNameToAustere(movementCore);
  if (swappedSingle !== movementCore) {
    const noteSuffix =
      bracketMatches.length > 0
        ? `${bracketMatches.join(' ').replace(/\]$/, ' • Austere Field Kit Swap: RPE 8]')}`
        : '[Austere Field Kit Swap: RPE 8 • Rest: 60s]';
    return `${prefix}${swappedSingle} ${trailingSetRep} ${noteSuffix}`.replace(/\s+/g, ' ').trim();
  }

  return line;
}

function adaptCardioRunForCondition(
  runStr: string,
  paceStr: string,
  condition: OperationalCondition
): { run: string; pace: string; skipped: boolean } {
  if (!isRealRunString(runStr)) {
    return { run: runStr, pace: paceStr, skipped: false };
  }

  const isInterval = isIntervalRunExercise(runStr, paceStr);

  if (condition === 'unit_pt_run') {
    if (isInterval) {
      const reducedIntervals = reduceSetsInPrescription(runStr, 0.5, 2);
      return {
        run: `${reducedIntervals} [Unit PT Adjustment: -50% Volume or Optional 15-Min Recovery Flush]`,
        pace: 'Controlled Technique Pace (RPE 6.5 / 70% Effort • +30s Walk Recovery) — Morning Unit PT Covered Primary Cardio',
        skipped: false,
      };
    }
    return {
      run: 'Rest / Optional 12-Min Easy Zone 1 Recovery Walk (Morning Unit PT 3+ Mi Run Covered Cardio Volume)',
      pace: 'Unit PT Adjustment Active • Easy Recovery Flush Only (RPE 2–3, HR < 125 BPM)',
      skipped: true,
    };
  }

  if (condition === 'ftx_low_sleep') {
    if (isInterval) {
      const reducedIntervals = reduceSetsInPrescription(runStr, 0.5, 2);
      return {
        run: `15–20 Min Easy Zone 1–2 Recovery Walk / Flush (or ${reducedIntervals} @ Controlled RPE 6.5)`,
        pace: 'FTX Low-Sleep Intensity Cap: Nasal Breathing • RPE 3–4 (HR < 135 BPM) to Protect CNS',
        skipped: false,
      };
    }
    return {
      run: '15–20 Min Easy Zone 1–2 Recovery Walk or Mobility Flush (~1.25–1.5 Miles — FTX Recovery)',
      pace: 'FTX Low-Sleep Intensity Cap: Nasal Breathing • RPE 3–4 (HR < 135 BPM)',
      skipped: false,
    };
  }

  if (condition === 'austere_field') {
    const lower = runStr.toLowerCase();
    if (isInterval) {
      if (lower.includes('400m')) {
        return {
          run: '6–8 × 90-Sec Unmarked Field Patrol Shuttles (Austere Track Equivalent)',
          pace: 'Hard Field Effort (RPE 8 / 80% Effort) • 60 sec walk recovery on flat ground or dirt road',
          skipped: false,
        };
      }
      if (lower.includes('800m')) {
        return {
          run: '4 × 3:15 Unmarked Field Threshold Runs (Austere 800m Equivalent)',
          pace: 'Hard Threshold Effort (RPE 8.5) • 90 sec walk recovery',
          skipped: false,
        };
      }
      return {
        run: `${runStr} [Austere Field Shuttle / Dirt-Road Equivalent]`,
        pace: `${paceStr} • Executed on unmarked field course or perimeter road`,
        skipped: false,
      };
    }

    if (lower.includes('incline') || lower.includes('treadmill') || lower.includes('ruck')) {
      return {
        run: '20–25 Min Outdoor Field Patrol Ruck March (~1.5–1.75 Miles with 35–45 lb Field Pack)',
        pace: 'Brisk Tactical Patrol Pace (15:00/mi • RPE 7.5–8) on Field Terrain / Perimeter Route',
        skipped: false,
      };
    }

    return {
      run: `${runStr} (Field Perimeter / Unmarked Route)`,
      pace: `${paceStr} • Paced by Effort (RPE 7 / Talk Test) on Field Terrain`,
      skipped: false,
    };
  }

  return { run: runStr, pace: paceStr, skipped: false };
}

export interface AdjustedProtocolDay extends ProtocolDay {
  operationalNote?: string;
  runSkippedByUnitPt?: boolean;
}

/**
 * Non-destructively transforms an entire ProtocolDay (both main strength program AND cardio/conditioning,
 * adjusting both volume and intensity) for display on WorkoutsTab according to the active Operational Condition.
 */
export function applyOperationalConditionToDay(
  day: ProtocolDay,
  condition: OperationalCondition
): AdjustedProtocolDay {
  if (condition === 'garrison') {
    return day;
  }

  const isRest =
    day.focus.toLowerCase().includes('rest') &&
    (!day.strength || day.strength.every((s) => s.toLowerCase().includes('rest'))) &&
    !isRealRunString(day.run);

  if (isRest) {
    return day;
  }

  if (condition === 'unit_pt_run') {
    const adjustedStrength = day.strength.map((line) => {
      if (line.toLowerCase().includes('complete rest')) return line;

      // If this strength entry is an interval/cardio block (e.g. Day 2 400m/800m/hill sprints), cut sets 50% and cap intensity at RPE 6.5
      if (isCardioOrIntervalLine(line)) {
        const reduced = reduceSetsInPrescription(line, 0.5, 2);
        const toned = adjustIntensityTagsInStrengthLine(reduced, 'RPE 6.5 Technique', '+30s');
        return `${toned} [Unit PT Cardio Scale: -50% Repeats @ Controlled RPE 6.5 (or 15m Easy Walk)]`;
      }

      // Strength / Superset movement: reduce volume by ~25% (e.g., 4x -> 3x, 3x -> 2x) and cap intensity at RPE 7.5 (-10% load)
      const reducedSets = reduceSetsInPrescription(line, 0.75, 2);
      const tonedIntensity = adjustIntensityTagsInStrengthLine(reducedSets, 'RPE 7.5 (2-3 RIR)');
      return `${tonedIntensity} [Unit PT Adjust: -25% Sets • Cap @ RPE 7.5 / -10% Load]`;
    });

    const adaptedCardio = adaptCardioRunForCondition(day.run, day.pace, 'unit_pt_run');

    return {
      ...day,
      focus: `${day.focus} [Unit PT Adjusted]`,
      strength: adjustedStrength,
      run: adaptedCardio.run,
      pace: adaptedCardio.pace,
      runSkippedByUnitPt: adaptedCardio.skipped,
      operationalNote:
        'Unit PT Full-Day Adjustment Active: Strength volume trimmed ~25% and intensity capped at RPE 7.5 (2–3 RIR, -10% load) to account for morning PT fatigue; continuous runs converted to recovery rest/flush and interval volume reduced 50%.',
    };
  }

  if (condition === 'ftx_low_sleep') {
    const adjustedStrength = day.strength.map((line, index) => {
      if (line.toLowerCase().includes('complete rest')) return line;

      if (isCardioOrIntervalLine(line)) {
        const reduced = reduceSetsInPrescription(line, 0.5, 2);
        const toned = adjustIntensityTagsInStrengthLine(reduced, 'RPE 6.5 Easy', '+30s');
        return `${toned} [FTX Cardio Cap: -50% Volume @ RPE 6.5 or 15-20m Zone 2 Walk]`;
      }

      // Cut sets by 40-50%, lower intensity to RPE 6.5-7 (3 RIR / -15% load), and add +30s rest
      const ratio = index === 0 ? 0.6 : 0.5;
      const cappedSets = reduceSetsInPrescription(line, ratio, 2);
      const toned = adjustIntensityTagsInStrengthLine(cappedSets, 'RPE 6.5-7 (3 RIR)', '+30s');
      return `${toned} [FTX Low-Sleep: -45% Volume • 3 RIR (~80% Load) • +30s Rest]`;
    });

    const adaptedCardio = adaptCardioRunForCondition(day.run, day.pace, 'ftx_low_sleep');

    return {
      ...day,
      focus: `${day.focus} [FTX / Low-Sleep Adjusted]`,
      strength: adjustedStrength,
      run: adaptedCardio.run,
      pace: adaptedCardio.pace,
      operationalNote:
        'FTX / Low-Sleep (<5h) Full-Day Protocol Active: Strength & interval sets cut ~40–50%, intensity capped at RPE 6.5–7.0 (3 RIR / -15% load) with +30s rest, and conditioning shifted to a 15–20 min Zone 1–2 recovery flush (<135 BPM).',
    };
  }

  if (condition === 'austere_field') {
    const austereStrength = day.strength.map((line) => swapToAustereMovement(line));
    const adaptedCardio = adaptCardioRunForCondition(day.run, day.pace, 'austere_field');

    return {
      ...day,
      focus: `${day.focus} [Austere Field Kit]`,
      strength: austereStrength,
      run: adaptedCardio.run,
      pace: adaptedCardio.pace,
      operationalNote:
        'Austere / Field Kit Full-Day Mode Active: Gym lifts and supersets swapped to ruck, sandbag, and bodyweight field equivalents (+2 rep density @ RPE 8), and track/treadmill cardio converted to unmarked field shuttles or outdoor patrol rucks.',
    };
  }

  return day;
}

/**
 * Applies the selected Operational Condition across an array of ExerciseTemplates
 * (adjusting both strength and cardio exercises for both volume and intensity).
 * Used for both live launched workouts and Adapted Master Program schedule cards.
 */
export function applyOperationalConditionToExercises(
  exercises: ExerciseTemplate[],
  condition: OperationalCondition
): ExerciseTemplate[] {
  if (condition === 'garrison' || !exercises || exercises.length === 0) {
    return exercises;
  }

  if (condition === 'unit_pt_run') {
    return exercises.map((ex) => {
      const isCardio =
        ex.type === 'cardio' ||
        isContinuousRunOrRuckExercise(ex.name, ex.targetReps, ex.type) ||
        isIntervalRunExercise(ex.name, ex.targetReps);

      if (isCardio) {
        if (isIntervalRunExercise(ex.name, ex.targetReps)) {
          const reducedSets = Math.max(2, Math.round((ex.defaultSets || 6) * 0.5));
          return {
            ...ex,
            defaultSets: reducedSets,
            targetRpe: 6.5,
            restPeriodSeconds: (ex.restPeriodSeconds || 60) + 30,
            pace: 'Controlled Technique Pace (RPE 6.5 • +30s Rest)',
            scalingNote: 'Unit PT: -50% Intervals @ RPE 6.5',
            notes: `${ex.notes ? ex.notes + ' · ' : ''}Unit PT Cardio Adjustment: Cut interval volume by 50% at controlled RPE 6.5 (or log a 12-min recovery walk).`,
          };
        }

        // Continuous run or ruck -> optional 12-min easy Zone 1 recovery walk
        return {
          ...ex,
          name: `Optional 12-Min Easy Zone 1 Recovery Flush (Unit PT Covered: ${ex.name.replace(/\[.*?\]/g, '').trim()})`,
          defaultSets: 1,
          targetReps: '12 mins (1.0 mi recovery walk)',
          distance_miles: 1.0,
          targetRpe: 3,
          pace: 'Easy Zone 1 Recovery Walk (RPE 2–3 • HR < 125 BPM)',
          scalingNote: 'Unit PT: Scaled to 12m Recovery Flush',
          notes: 'Morning Unit PT 3+ Mi Run covered primary aerobic load. Log a 12-min recovery flush walk or mark complete.',
        };
      }

      // Strength / Superset / Circuit exercise: reduce sets ~25% and cap intensity at RPE 7.5 (-10% load)
      const nextSets = ex.defaultSets > 2 ? Math.max(2, Math.round(ex.defaultSets * 0.75)) : ex.defaultSets;
      const nextWeight = ex.weight_lbs ? Math.max(5, Math.round((ex.weight_lbs * 0.9) / 2.5) * 2.5) : ex.weight_lbs;
      const nextRpe = Math.min(ex.targetRpe || 8, 7.5);

      return {
        ...ex,
        defaultSets: nextSets,
        targetRpe: nextRpe,
        weight_lbs: nextWeight,
        restPeriodSeconds: (ex.restPeriodSeconds || 60) + 15,
        scalingNote: `Unit PT: ${nextSets} sets @ RPE ${nextRpe} (-10% load)`,
        notes: `${ex.notes ? ex.notes + ' · ' : ''}Unit PT Adjustment: Volume trimmed to ${nextSets} sets & intensity capped at RPE 7.5 (2–3 RIR, -10% load).`,
      };
    });
  }

  if (condition === 'ftx_low_sleep') {
    return exercises.map((ex, idx) => {
      const isCardio =
        ex.type === 'cardio' ||
        isContinuousRunOrRuckExercise(ex.name, ex.targetReps, ex.type) ||
        isIntervalRunExercise(ex.name, ex.targetReps);

      if (isCardio) {
        if (isIntervalRunExercise(ex.name, ex.targetReps)) {
          const reducedSets = Math.max(2, Math.round((ex.defaultSets || 6) * 0.5));
          return {
            ...ex,
            defaultSets: reducedSets,
            targetRpe: 6.5,
            restPeriodSeconds: (ex.restPeriodSeconds || 60) + 30,
            pace: 'FTX Low-CNS Pace (RPE 6.5 • Nasal Recovery)',
            scalingNote: 'FTX: -50% Intervals @ RPE 6.5',
            notes: `${ex.notes ? ex.notes + ' · ' : ''}FTX / Low-Sleep Adjustment: Interval volume cut 50% and intensity capped at RPE 6.5 (or swap to 15-min Zone 2 walk).`,
          };
        }

        return {
          ...ex,
          name: '15–20 Min Easy Zone 1–2 Recovery Walk / Flush',
          defaultSets: 1,
          targetReps: '15–20 mins (1.25 mi recovery flush)',
          distance_miles: 1.25,
          targetRpe: 3.5,
          pace: 'Zone 1–2 Nasal Recovery (<135 BPM • RPE 3–4)',
          scalingNote: 'FTX: 15-20m Zone 1-2 Flush (<135 BPM)',
          notes: 'FTX / Low-Sleep (<5h) Adjustment: High-CNS conditioning shifted to a 15–20 min low-impact Zone 1–2 recovery flush.',
        };
      }

      const ratio = idx === 0 ? 0.6 : 0.5;
      const nextSets = ex.defaultSets > 1 ? Math.max(2, Math.round(ex.defaultSets * ratio)) : 1;
      const nextWeight = ex.weight_lbs ? Math.max(5, Math.round((ex.weight_lbs * 0.85) / 2.5) * 2.5) : ex.weight_lbs;
      const nextRpe = Math.min(ex.targetRpe || 7, 6.5);

      return {
        ...ex,
        defaultSets: nextSets,
        targetRpe: nextRpe,
        weight_lbs: nextWeight,
        restPeriodSeconds: (ex.restPeriodSeconds || 60) + 30,
        scalingNote: `FTX: ${nextSets} sets @ RPE ${nextRpe} (3 RIR / -15% load)`,
        notes: `${ex.notes ? ex.notes + ' · ' : ''}FTX / Low-Sleep Cap: Volume cut to ${nextSets} sets, stop at 3 RIR (~80–85% load), +30s rest.`,
      };
    });
  }

  if (condition === 'austere_field') {
    return exercises.map((ex) => {
      const isCardio =
        ex.type === 'cardio' ||
        isContinuousRunOrRuckExercise(ex.name, ex.targetReps, ex.type) ||
        isIntervalRunExercise(ex.name, ex.targetReps);

      if (isCardio) {
        if (isIntervalRunExercise(ex.name, ex.targetReps)) {
          return {
            ...ex,
            name: `${ex.name.replace(/Track\/Treadmill/gi, 'Unmarked Field Shuttle')} (Field Course)`,
            targetRpe: 8,
            pace: `${ex.pace || 'Hard Field Effort'} • Unmarked Field Shuttle / Perimeter Course`,
            scalingNote: 'Austere Field: Unmarked Shuttle Course @ RPE 8',
            notes: `${ex.notes ? ex.notes + ' · ' : ''}Austere Field Cardio: Execute repeats as timed hard shuttles on flat dirt road or field perimeter.`,
          };
        }

        const lower = ex.name.toLowerCase();
        if (lower.includes('incline') || lower.includes('treadmill') || lower.includes('ruck')) {
          return {
            ...ex,
            name: 'Outdoor Field Patrol Ruck March (35–45 lb Field Pack)',
            targetReps: ex.targetReps || '20 mins (1.5 mi target)',
            distance_miles: ex.distance_miles || 1.5,
            targetRpe: 8,
            pace: 'Brisk Patrol Pace (~15:00/mi • RPE 8) on Field Terrain',
            scalingNote: 'Austere Field: Outdoor Field Patrol Ruck',
            notes: `${ex.notes ? ex.notes + ' · ' : ''}Austere Field Swap: Replaced incline treadmill with outdoor field patrol ruck march.`,
          };
        }

        return {
          ...ex,
          name: `${ex.name} (Field Perimeter Route)`,
          targetRpe: ex.targetRpe || 7.5,
          pace: `${ex.pace || 'Conversational Pace'} • Field Terrain Effort`,
          scalingNote: 'Austere Field: Unmarked Perimeter Route',
        };
      }

      // If it's a superset with supersetExercises, swap each sub-movement to its field equivalent
      if (ex.supersetExercises && ex.supersetExercises.length > 0) {
        const swappedSub = ex.supersetExercises.map((sub) => ({
          ...sub,
          name: swapSingleMovementNameToAustere(sub.name),
        }));
        const swappedTitle = swappedSub.map((s) => s.name).join(' + ');
        return {
          ...ex,
          name: swappedTitle,
          supersetExercises: swappedSub,
          targetRpe: Math.min(8.5, Math.max(ex.targetRpe || 8, 8)),
          restPeriodSeconds: Math.min(ex.restPeriodSeconds || 75, 75),
          originalExerciseName: ex.originalExerciseName || ex.name,
          scalingNote: 'Austere Field Kit Swap (+2 Rep Density @ RPE 8)',
          notes: `${ex.notes ? ex.notes + ' · ' : ''}Austere Field Kit Mode: Swapped to Ruck/Sandbag/Bodyweight pair (+2 reps/set or strict 3-sec lowering @ RPE 8).`,
        };
      }

      const swappedLine = swapToAustereMovement(ex.name);
      const cleanNewName = swappedLine.replace(/\[.*?\]/g, '').trim();
      const didChange = cleanNewName.toLowerCase() !== ex.name.toLowerCase();

      return {
        ...ex,
        name: didChange ? cleanNewName : ex.name,
        targetRpe: Math.min(8.5, Math.max(ex.targetRpe || 8, 8)),
        restPeriodSeconds: Math.min(ex.restPeriodSeconds || 75, 75),
        originalExerciseName: didChange ? ex.originalExerciseName || ex.name : ex.originalExerciseName,
        scalingNote: 'Austere Field Kit (+2 Rep Density @ RPE 8)',
        notes: `${ex.notes ? ex.notes + ' · ' : ''}Austere Field Kit Mode: Execute with 35–45 lb Ruck, Sandbag, or strict 3s tempo bodyweight at RPE 8.`,
      };
    });
  }

  return exercises;
}

/**
 * Applies the selected Operational Condition to a launched WorkoutProgram
 * before passing it into ActiveWorkoutModal.
 */
export function applyOperationalConditionToProgram(
  program: WorkoutProgram,
  condition: OperationalCondition
): WorkoutProgram {
  if (condition === 'garrison') return program;

  const meta = OPERATIONAL_CONDITIONS.find((c) => c.id === condition);
  const badgePrefix = meta ? `[${meta.shortLabel}] ` : '';
  const adjustedExercises = applyOperationalConditionToExercises(program.exercises, condition);

  return {
    ...program,
    title: program.title.startsWith('[') ? program.title : `${badgePrefix}${program.title}`,
    description: `${program.description || ''} • ${meta?.ruleDetail || ''}`,
    exercises: adjustedExercises,
  };
}
