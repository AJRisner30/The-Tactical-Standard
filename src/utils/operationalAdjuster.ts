import { OperationalCondition, WorkoutProgram } from '../types';
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
    summary: 'Full prescribed volume, loads, and conditioning.',
    ruleDetail: 'Preserves exact master program prescription as written.',
  },
  {
    id: 'unit_pt_run',
    shortLabel: 'Unit PT Run',
    label: 'Unit PT Run Today (3+ Mi)',
    summary: 'Drops redundant cardio/runs; keeps full strength session.',
    ruleDetail: 'Unit PT Rule: If morning Unit PT included a 3+ mile run, skip duplicate Zone 2 / conditioning runs while completing strength work.',
  },
  {
    id: 'ftx_low_sleep',
    shortLabel: 'FTX / Low Sleep',
    label: 'FTX / Low Sleep (<5h)',
    summary: 'Cuts accessory sets ~40%, caps compounds at 3 RIR, 20m Zone 2 flush.',
    ruleDetail: 'FTX Protocol: Halve accessory sets, cap main lifts at 3 RIR (~80%), and replace intense sprints/rucks with a 20-min low-impact Zone 2 flush.',
  },
  {
    id: 'austere_field',
    shortLabel: 'Austere / Field',
    label: 'Austere / Field Kit',
    summary: 'Swaps gym/barbell lifts to bodyweight, ruck, or sandbag equivalents.',
    ruleDetail: 'Field Deployment Mode: Substitutes barbell, cable, and machine movements into zero-gym bodyweight, ruck pack, and sandbag equivalents.',
  },
];

function reduceSetsInPrescription(line: string, ratio: number): string {
  // Matches patterns like "4x8-10", "5x5", "3-4x10", "4 sets x 8"
  return line.replace(/\b(\d)(?:\s*[-–]\s*(\d))?\s*(x|×)\s*/i, (_match, s1, _s2, mult) => {
    const baseSets = parseInt(s1, 10);
    if (isNaN(baseSets) || baseSets <= 1) return _match;
    const reduced = Math.max(1, Math.round(baseSets * ratio));
    return `${reduced}${mult}`;
  });
}

function swapToAustereMovement(line: string): string {
  const lower = line.toLowerCase();
  if (lower.includes('rest') || lower.includes('zone 2') || lower.includes('run') || lower.includes('ruck') || lower.includes('sprint')) {
    return line;
  }

  // Extract set/rep suffix if present
  const setRepMatch = line.match(/(\d+(?:[-–]\d+)?\s*[x×]\s*[\d\-–]+(?:\s*(?:sec|s|min|m|yd|\/leg|\/side|each|reps))?)/i);
  const setRep = setRepMatch ? setRepMatch[1] : '4x12-15';

  if (lower.includes('deadlift') || lower.includes('rdl') || lower.includes('hip thrust')) {
    return `Ruck / Sandbag Good Mornings or Single-Leg Glute Bridge: ${setRep} [Austere Field Swap]`;
  }
  if (lower.includes('back squat') || lower.includes('front squat') || lower.includes('leg press') || lower.includes('hack squat')) {
    return `Ruck-Loaded Split Squats or Tempo Goblet Ruck Squats: ${setRep} [Austere Field Swap]`;
  }
  if (lower.includes('bench') || lower.includes('incline press') || lower.includes('floor press') || lower.includes('chest press')) {
    return `Deficit or Ruck-Weighted Hand-Release Push-Ups: ${setRep} [Austere Field Swap]`;
  }
  if (lower.includes('overhead press') || lower.includes('military press') || lower.includes('shoulder press')) {
    return `Pike Push-Ups or Ruck Overhead Strict Press: ${setRep} [Austere Field Swap]`;
  }
  if (lower.includes('lat pulldown') || lower.includes('cable row') || lower.includes('barbell row') || lower.includes('seal row') || lower.includes('chest-supported')) {
    return `Inverted Bar/Table Rows or Ruck Bent-Over Rows: ${setRep} [Austere Field Swap]`;
  }
  if (lower.includes('leg curl') || lower.includes('hamstring') || lower.includes('nordic')) {
    return `Single-Leg Towel/Boot Hamstring Sliders or Marching Bridges: ${setRep} [Austere Field Swap]`;
  }
  if (lower.includes('curl') && (lower.includes('bicep') || lower.includes('barbell') || lower.includes('ez') || lower.includes('cable') || lower.includes('dumbbell'))) {
    return `Ruck Strap / Sandbag Biceps Curls: ${setRep} [Austere Field Swap]`;
  }
  if (lower.includes('tricep') || lower.includes('pushdown') || lower.includes('skullcrusher') || lower.includes('dip')) {
    return `Diamond Close-Grip Push-Ups or Bench/Ammo-Can Dips: ${setRep} [Austere Field Swap]`;
  }
  if (lower.includes('sled') || lower.includes('drag')) {
    return `Heavy Ruck Backward Hill March or Partner Drag (50m): ${setRep} [Austere Field Swap]`;
  }
  if (lower.includes('carry') || lower.includes('farmer')) {
    return `Heavy Ruck / Water-Can Farmer Carry (50m): ${setRep} [Austere Field Swap]`;
  }
  if (lower.includes('face pull') || lower.includes('lateral raise') || lower.includes('rear delt')) {
    return `Prone Y-T-W Scapular Raises or Band Pull-Aparts: ${setRep} [Austere Field Swap]`;
  }
  return line;
}

export interface AdjustedProtocolDay extends ProtocolDay {
  operationalNote?: string;
  runSkippedByUnitPt?: boolean;
}

/**
 * Non-destructively transforms a ProtocolDay for display on WorkoutsTab
 * according to the active Operational Condition.
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
    (!day.strength || day.strength.every((s) => s.toLowerCase().includes('rest')));

  if (isRest) {
    return day;
  }

  if (condition === 'unit_pt_run') {
    const hasRun =
      day.run &&
      !day.run.toLowerCase().includes('rest') &&
      day.run.trim().toLowerCase() !== 'none';
    const filteredStrength = day.strength.filter((line) => {
      const l = line.toLowerCase();
      // Drop standalone duplicate Zone 2 / easy run entries inside strength list
      return !(l.includes('zone 2') && l.includes('run'));
    });

    return {
      ...day,
      strength: filteredStrength.length > 0 ? filteredStrength : day.strength,
      run: hasRun
        ? 'Rest — Skipped (Morning Unit PT 3+ Mi Run Covered Aerobic Volume)'
        : day.run,
      pace: hasRun ? 'Unit PT Adjustment Active • Preserve Leg Recovery' : day.pace,
      runSkippedByUnitPt: Boolean(hasRun),
      operationalNote:
        'Unit PT Run Mode Active: Redundant cardio/run volume skipped so your joints stay fresh for strength lifts.',
    };
  }

  if (condition === 'ftx_low_sleep') {
    const adjustedStrength = day.strength.map((line, index) => {
      const l = line.toLowerCase();
      if (l.includes('rest')) return line;
      // Primary compound (first 1-2 exercises): cap at 3 RIR (~80% load), drop 1 set if >= 4
      if (index < 2) {
        const cappedSets = reduceSetsInPrescription(line, 0.75);
        return cappedSets.includes('RIR')
          ? cappedSets
          : `${cappedSets} [FTX Cap: 3 RIR / ~80% Load]`;
      }
      // Accessories: halve volume (~50%)
      return `${reduceSetsInPrescription(line, 0.5)} [FTX: -50% Acc Volume]`;
    });

    const hasRun =
      day.run &&
      !day.run.toLowerCase().includes('rest') &&
      day.run.trim().toLowerCase() !== 'none';

    return {
      ...day,
      strength: adjustedStrength,
      run: hasRun ? '20-Min Easy Zone 2 Flush Walk or Light Bike (FTX Recovery)' : day.run,
      pace: hasRun ? 'Nasal Breathing • HR < 140 BPM (Protect CNS)' : day.pace,
      operationalNote:
        'FTX / Low-Sleep (<5h) Mode Active: Compound lifts capped at 3 RIR, accessory sets halved, high-CNS conditioning swapped to 20-min Zone 2 recovery.',
    };
  }

  if (condition === 'austere_field') {
    const austereStrength = day.strength.map((line) => swapToAustereMovement(line));
    return {
      ...day,
      strength: austereStrength,
      operationalNote:
        'Austere / Field Kit Mode Active: Barbell, cable, and machine lifts dynamically swapped to bodyweight, ruck pack, and sandbag equivalents.',
    };
  }

  return day;
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

  if (condition === 'unit_pt_run') {
    const filtered = program.exercises.filter((ex) => ex.type !== 'cardio');
    return {
      ...program,
      title: `${badgePrefix}${program.title}`,
      description: `${program.description || ''} • Unit PT Run Rule applied: duplicate conditioning run skipped.`,
      exercises: filtered.length > 0 ? filtered : program.exercises,
    };
  }

  if (condition === 'ftx_low_sleep') {
    const adjusted = program.exercises.map((ex, idx) => {
      if (ex.type === 'cardio') {
        return {
          ...ex,
          name: '20-Min Easy Zone 2 Recovery Walk / Flush',
          targetReps: '20 mins',
          distance_miles: 1.5,
          pace: 'Zone 2 Nasal Recovery (<140 BPM)',
          notes: 'FTX / Low-Sleep Adjustment: Replaced intense intervals/ruck with low-CNS aerobic flush.',
        };
      }
      const nextSets = idx < 2 ? Math.max(2, Math.round(ex.defaultSets * 0.75)) : Math.max(1, Math.round(ex.defaultSets * 0.5));
      return {
        ...ex,
        defaultSets: nextSets,
        targetRpe: Math.min(ex.targetRpe || 7, 7),
        notes: `${ex.notes ? ex.notes + ' · ' : ''}FTX Cap: Stop at 3 RIR (~80% load).`,
      };
    });

    return {
      ...program,
      title: `${badgePrefix}${program.title}`,
      description: `${program.description || ''} • FTX / Low-Sleep (<5h) adjustments active.`,
      exercises: adjusted,
    };
  }

  if (condition === 'austere_field') {
    const adjusted = program.exercises.map((ex) => {
      if (ex.type === 'cardio') return ex;
      const swappedLine = swapToAustereMovement(`${ex.name}: ${ex.defaultSets}x${ex.targetReps}`);
      const cleanNewName = swappedLine.split(':')[0].trim();
      if (cleanNewName.toLowerCase() === ex.name.toLowerCase()) return ex;
      return {
        ...ex,
        name: cleanNewName,
        notes: `${ex.notes ? ex.notes + ' · ' : ''}Austere Field Swap (replaced ${ex.name}).`,
      };
    });

    return {
      ...program,
      title: `${badgePrefix}${program.title}`,
      description: `${program.description || ''} • Austere / Field Kit swaps active.`,
      exercises: adjusted,
    };
  }

  return program;
}
