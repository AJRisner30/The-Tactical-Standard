export interface ProtocolDay {
  day: string;
  focus: string;
  warmup: string;
  strength: string[];
  run: string;
  pace: string;
  progressionRule?: string;
}

export interface ProtocolPhase {
  id: string;
  title: string;
  weeks: string;
  desc: string;
  coachRule?: string;
  days: ProtocolDay[];
}

export interface HybridStrengthLogItem {
  id: number;
  date: string;
  exercise: string;
  weight: string;
  reps: number;
  estimated1RM?: number;
}

// 12-Week Protocol (7-Day Split + Warmups) - The Tactical Standard Military Hybrid Template
export const PROTOCOL_DATA: Record<string, ProtocolPhase> = {
  phase1: {
    id: 'phase1',
    title: "Phase 1: Foundation",
    weeks: "Weeks 1-4",
    desc: "Establish aerobic base (Zone 2) and build foundational movement strength. Progress by adding 10% volume each week.",
    coachRule: "The Tactical Standard Overload Laws: +10 lbs on lower compound lifts (Squat, Deadlift) and +5 lbs on upper compound lifts (Bench, OHP, Rows) upon completing top rep range with strict form. Weekly Zone 2 volume increases by 0.5 - 1.0 mile.",
    days: [
      {
        day: 'Day 1',
        focus: "Lower Strength + Base",
        warmup: "Mandatory 10-Minute DIME Warm-Up (Recommended): 1) Bodyweight Squats (10), 2) Squat Jumps (8), 3) Forward Lunges (8/leg), 4) Side Plank (20s/side), 5) Push-Ups (10), 6) Single-Leg Reach (6/leg), 7) Side Hop to Balance (6/side), 8) Ice Skaters (8/side), 9) 'L' Hops (5/leg).",
        strength: [
          "Barbell Back Squat (4x8) [Overload: +10 lbs on 8 reps]",
          "RDLs (3x10) [Overload: +10 lbs on 10 reps]",
          "Bulgarian Split Squats (3x10/leg)"
        ],
        run: "30-45 Min Base Run",
        pace: "Zone 2 / RPE 3-4 (Conversational Pace)",
        progressionRule: "Back Squat: +10 lbs upon hitting 8 reps; Base Run: +0.5 mi/wk"
      },
      {
        day: 'Day 2',
        focus: "Upper Hypertrophy",
        warmup: "Mandatory 10-Minute DIME Warm-Up (Recommended) + band pull-aparts and thoracic rotations.",
        strength: [
          "Barbell Bench (4x8) [Overload: +5 lbs on 8 reps]",
          "Weighted Pull-Ups (4x6-8) [Overload: +2.5-5 lbs on 8 reps]",
          "DB Overhead Press (3x10) [Overload: +5 lbs on 10 reps]"
        ],
        run: "Rest from running.",
        pace: "N/A",
        progressionRule: "Bench: +5 lbs on 8 reps; Pull-Ups: +2.5-5 lbs on 8 reps"
      },
      {
        day: 'Day 3',
        focus: "Interval Speed Work",
        warmup: "Mandatory 10-Minute DIME Warm-Up (Recommended) + 3 short progressive strides.",
        strength: [
          "Planks (3x60s) [Overload: +15s per set]",
          "Russian Twists (3x20)",
          "Mobility Drills"
        ],
        run: "Track Intervals (20-30 Mins)",
        pace: "6x400m at 5K Pace (RPE 8). 90s jog recovery.",
        progressionRule: "Intervals: Drop 2-3s per 400m repeat; Planks: +15s"
      },
      {
        day: 'Day 4',
        focus: "Full Body + Tempo",
        warmup: "Mandatory 10-Minute DIME Warm-Up (Recommended) + light kettlebell swings and hip openers.",
        strength: [
          "Deadlift (4x5 Heavy) [Overload: +10 lbs on 5 reps]",
          "Push Press (4x6) [Overload: +5 lbs on 6 reps]",
          "Chest-Supported Row (3x10) [Overload: +5 lbs on 10 reps]"
        ],
        run: "Tempo Run (3-4 Miles)",
        pace: "3-4 Miles at Tempo Pace (RPE 6-7 with 0.5 mi warm-up/cool-down).",
        progressionRule: "Deadlift: +10 lbs on 5 reps; Push Press: +5 lbs on 6 reps"
      },
      {
        day: 'Day 5',
        focus: "Active Recovery",
        warmup: "Cat-cow transitions, 90/90 hip stretches, and deep diaphragmatic breathing.",
        strength: ["Stretching, foam rolling, or light yoga."],
        run: "Optional Light Spin (20-30 mins)",
        pace: "Keep heart rate under 110 bpm.",
        progressionRule: "Active recovery & mobility. Heart rate < 110 bpm."
      },
      {
        day: 'Day 6',
        focus: "Long Endurance",
        warmup: "Mandatory 10-Minute DIME Warm-Up (Recommended) + calf and hip flexor activation.",
        strength: ["Pre-hab exercises (glute bridges, clamshells)."],
        run: "Long Run (6-10 Miles)",
        pace: "6-10 Miles in Zone 2 / RPE 3-4. Time on feet is the goal.",
        progressionRule: "Zone 2 Long Run: +0.5 to +1.0 mile/week base building"
      },
      {
        day: 'Day 7',
        focus: "Complete Rest",
        warmup: "None. Enjoy the rest!",
        strength: ["Rest and meal prep."],
        run: "Rest.",
        pace: "N/A",
        progressionRule: "Complete Rest & Nutrition replenishment"
      }
    ]
  },
  phase2: {
    id: 'phase2',
    title: "Phase 2: Build & Intensify",
    weeks: "Weeks 5-8",
    desc: "Increase strength loads and expand aerobic threshold (harder intervals, longer tempos).",
    coachRule: "The Tactical Standard Overload Laws: +10 lbs on lower compound lifts (Squat, Deadlift) and +5 lbs on upper compound lifts (Bench, OHP, Rows) upon completing top rep range with strict form. Weekly Zone 2 volume increases by 0.5 - 1.0 mile.",
    days: [
      {
        day: 'Day 1',
        focus: "Lower Power + Recovery",
        warmup: "Mandatory 10-Minute DIME Warm-Up (Recommended) + empty bar warm-up sets.",
        strength: [
          "Back Squat (5x5) [Overload: +10 lbs on 5 reps]",
          "Front Squat (3x8) [Overload: +5-10 lbs on 8 reps]",
          "Hip Thrusts (4x8) [Overload: +10 lbs on 8 reps]"
        ],
        run: "30 Min Recovery Run",
        pace: "Very Easy / RPE 2-3.",
        progressionRule: "Back Squat: +10 lbs on 5x5; Hip Thrusts: +10 lbs"
      },
      {
        day: 'Day 2',
        focus: "Upper Body Strength",
        warmup: "Mandatory 10-Minute DIME Warm-Up (Recommended) + band dislocates and scapular pull-ups.",
        strength: [
          "Incline Bench (4x6) [Overload: +5 lbs on 6 reps]",
          "Bent Over Row (4x6) [Overload: +5 lbs on 6 reps]",
          "Arnold Press (3x8) [Overload: +5 lbs on 8 reps]"
        ],
        run: "Rest from running.",
        pace: "N/A",
        progressionRule: "Incline Bench: +5 lbs on 6 reps; Rows: +5 lbs on 6 reps"
      },
      {
        day: 'Day 3',
        focus: "Threshold Intervals",
        warmup: "Mandatory 10-Minute DIME Warm-Up (Recommended) + 3-4 tempo buildups.",
        strength: [
          "Hanging Leg Raises (3x12)",
          "Ab Wheel Rollouts (3x10) [Overload: +2 reps/set]"
        ],
        run: "Long Intervals (40 Mins)",
        pace: "4x800m at 5K Pace (RPE 8-9). 2 Min recovery.",
        progressionRule: "800m Repeats: Maintain target 5K pace; Rest: strict 2 min"
      },
      {
        day: 'Day 4',
        focus: "Full Body Volume",
        warmup: "Mandatory 10-Minute DIME Warm-Up (Recommended) + bird-dogs and kettlebell halos.",
        strength: [
          "Deadlift (4x4) [Overload: +10 lbs on 4 reps]",
          "DB Bench Press (3x10) [Overload: +5 lbs on 10 reps]",
          "Single Arm Row (3x10) [Overload: +5 lbs on 10 reps]"
        ],
        run: "Threshold Run (4-6 Miles)",
        pace: "4-6 Miles total (1 mi warmup + 3-4 Miles at Threshold Pace RPE 7-8 + 1 mi cooldown).",
        progressionRule: "Deadlift: +10 lbs on 4x4; DB Bench: +5 lbs on 10 reps"
      },
      {
        day: 'Day 5',
        focus: "Active Recovery",
        warmup: "Foam rolling calves and quads, followed by a light mobility flow.",
        strength: ["Light mobility work."],
        run: "Cross-training (20 mins)",
        pace: "Low intensity.",
        progressionRule: "Active recovery & low-impact aerobic flush"
      },
      {
        day: 'Day 6',
        focus: "Long Endurance",
        warmup: "Mandatory 10-Minute DIME Warm-Up (Recommended) + ankle circles and dynamic stretching.",
        strength: ["None."],
        run: "Long Run (8-14 Miles)",
        pace: "Zone 2. Add 2-3 surges in final miles.",
        progressionRule: "Long Run: Zone 2 pacing with 2-3 surges in final 2 miles"
      },
      {
        day: 'Day 7',
        focus: "Complete Rest",
        warmup: "None.",
        strength: ["Hydrate and recover."],
        run: "Rest.",
        pace: "N/A",
        progressionRule: "Rest, hydration, and central nervous system recovery"
      }
    ]
  },
  phase3: {
    id: 'phase3',
    title: "Phase 3: Peak Performance",
    weeks: "Weeks 9-12",
    desc: "Peak power output and race pacing. Volume drops slightly while intensity hits maximum.",
    coachRule: "The Tactical Standard Overload Laws: +10 lbs on lower compound lifts (Squat, Deadlift) and +5 lbs on upper compound lifts (Bench, OHP, Rows) upon completing top rep range with strict form. Weekly Zone 2 volume increases by 0.5 - 1.0 mile.",
    days: [
      {
        day: 'Day 1',
        focus: "Lower Max Strength",
        warmup: "Mandatory 10-Minute DIME Warm-Up (Recommended) + CNS Prep box jumps (3x3).",
        strength: [
          "Back Squat (3x3 Heavy) [Overload: +10 lbs on 3 reps]",
          "Speed Deadlifts (3x3) [Overload: Max bar speed]",
          "Walking Lunges (3x10/leg)"
        ],
        run: "20 Min Shakeout Run",
        pace: "RPE 2. Just moving blood.",
        progressionRule: "Back Squat: +10 lbs on heavy triple; CNS Max Power"
      },
      {
        day: 'Day 2',
        focus: "Upper Max Strength",
        warmup: "Mandatory 10-Minute DIME Warm-Up (Recommended) + rotator cuff warm-up.",
        strength: [
          "Bench Press (3x3) [Overload: +5 lbs on 3 reps]",
          "Weighted Pull-Ups (3x4) [Overload: +5 lbs on 4 reps]",
          "Plyo Pushups (3x8) [Overload: Max explosive height]"
        ],
        run: "Rest from running.",
        pace: "N/A",
        progressionRule: "Bench Press: +5 lbs on triple; Weighted Pull-Ups: +5 lbs"
      },
      {
        day: 'Day 3',
        focus: "Speed Endurance",
        warmup: "Mandatory 10-Minute DIME Warm-Up (Recommended) + 3x50m progressive sprints.",
        strength: [
          "Weighted Planks (3x45s) [Overload: +5-10 lbs plate]",
          "Cable Woodchoppers (3x12/side)"
        ],
        run: "Short Sprint Intervals",
        pace: "10x200m at Mile Pace (RPE 9+). 200m walk recovery.",
        progressionRule: "Sprint Intervals: 10x200m at Mile Pace (RPE 9+)"
      },
      {
        day: 'Day 4',
        focus: "Race Pace Sim",
        warmup: "Mandatory 10-Minute DIME Warm-Up (Recommended) + dial into race pace for 1 min.",
        strength: [
          "Trap Bar Deadlift (3x5) [Overload: +10 lbs on 5 reps]",
          "DB Overhead Press (3x8) [Overload: +5 lbs on 8 reps]"
        ],
        run: "Race Pace Simulation (2-3 Miles)",
        pace: "2-3 Miles at Goal Race Pace (RPE 8.5-9).",
        progressionRule: "Trap Bar Deadlift: +10 lbs on 5 reps; Race Pace Sim"
      },
      {
        day: 'Day 5',
        focus: "Active Recovery",
        warmup: "Yoga flow, deep stretching, and parasympathetic breathing.",
        strength: ["Yoga or dynamic stretching."],
        run: "Rest.",
        pace: "N/A",
        progressionRule: "Parasympathetic breathing, light yoga, and recovery"
      },
      {
        day: 'Day 6',
        focus: "Long Endurance (Taper)",
        warmup: "Mandatory 10-Minute DIME Warm-Up (Recommended) + light walk and mental visualization.",
        strength: ["None."],
        run: "Long Run (10-15+ Miles)",
        pace: "Zone 2. (Reduce mileage by 50% in Week 12).",
        progressionRule: "Taper & peak: reduce volume by 50% in Week 12"
      },
      {
        day: 'Day 7',
        focus: "Complete Rest",
        warmup: "None.",
        strength: ["Refuel and rest."],
        run: "Rest.",
        pace: "N/A",
        progressionRule: "Complete Rest & Mental preparation for testing"
      }
    ]
  }
};

export const COACH_RULES = {
  orderOfOperations: {
    title: "Order of Operations",
    splitSessions: "Try to separate lifting and running by 6+ hours to maximize recovery.",
    backToBack: "If you must do both at the same time, always lift first. Hitting heavy compound lifts under severe aerobic fatigue ruins your form and invites injury. Sip BCAAs to bridge the gap, then immediately hit your run."
  },
  zone2Guidance: {
    title: "Zone 2 Heart Rate Standard",
    rule: "Keep base and long runs strictly conversational (RPE 3-4, ~65-75% max HR). Building mitochondrial density and capillary beds allows you to clear lactate during heavy lifting intervals."
  },
  progressiveOverload: {
    title: "Progressive Overload Rule",
    rule: "Start at the low end of any prescribed set or rep range. Build reps to the top of the range first, then add 2.5-5 lbs (upper body) or 5-10 lbs (lower body) and drop back to the bottom of the rep range."
  }
};

export const TEMPLATE_EXERCISES = [
  "Goblet Squat or Back Squat (to parallel)",
  "Barbell Back Squat",
  "Trap-Bar Deadlift or Dumbbell RDL",
  "Conventional or Sumo Barbell Deadlift",
  "Conventional Barbell Deadlift",
  "Conventional or Trap-Bar Deadlift",
  "Reverse Lunges",
  "Bulgarian Split Squat",
  "Lateral Lunges",
  "Box Jumps",
  "Standing Long Jump (Broad Jump)",
  "Trap-Bar Jumps",
  "Dumbbell Bench Press or Push-Ups",
  "Barbell Bench Press or Incline Press",
  "Barbell Bench Press",
  "Speed Bench Press",
  "Single-Arm Dumbbell Bench Press",
  "Chin-Ups (or Band-Assisted Pull-Ups)",
  "Weighted or Strict Pull-Ups",
  "Weighted Pull-Ups",
  "Strict Pronated Pull-Ups",
  "Seated or Standing Dumbbell Shoulder Press",
  "Single-Arm Landmine Press",
  "Standing Barbell Push Press + Face Pulls",
  "Single-Arm Dumbbell Row + Band Pull-Aparts",
  "Inverted Row + Barbell Deadlift Grip Hold",
  "Two-Arm Kettlebell Swings",
  "Sandbag Shouldering",
  "Sandbag Bear-Hug Walk + Squats",
  "Heavy Sled Push & Backward Drag",
  "One-Arm Suitcase Carry",
  "Heavy Farmer's Walk",
  "Standing Overhead Barbell Press (OHP)",
  "Weighted Neutral-Grip Pull-Ups",
  "Barbell Incline Bench Press (30°)",
  "Barbell Bent-Over Row (Strict)",
  "Barbell Z-Press",
  "Bodyweight Dips",
  "Incline Dumbbell Hammer Curls",
  "Trap Bar Deadlift",
  "Front Squat",
  "Romanian Deadlift (RDL)",
  "Standing Barbell Calf Raises",
  "Hanging Leg / Knee Raises",
  "Flush & Pace Aerobic Interval",
  "Sorensen Back Extension",
  "Copenhagen Side Plank",
  "Flat Barbell Bench Press",
  "Chest-Supported T-Bar Row",
  "Standing Push Press",
  "Dual Dumbbell Lateral Raises",
  "Cable Rope Face Pulls",
  "Close-Grip Barbell Bench Press",
  "Barbell EZ-Curl",
  "Barbell Hip Thrusts",
  "Walking Dumbbell Lunges",
  "Lying or Seated Leg Curls",
  "Heavy Farmer's Walks",
  "Suitcase Carry",
  "Barbell Wrist Rollers",
  "Back Squat",
  "Deadlift",
  "Bench Press",
  "Incline Bench",
  "Overhead Press",
  "Pull-Ups (Weighted)",
  "Other"
];

export const getDefaultRestPeriod = (exerciseStr: string): number => {
  // If explicit rest period is defined in brackets, always respect it
  const bracketMatch = exerciseStr.match(/rest:\s*(\d+)s?/i);
  if (bracketMatch) {
    const val = parseInt(bracketMatch[1], 10);
    if (!isNaN(val) && val >= 0) return val;
  }

  const lower = exerciseStr.toLowerCase();
  // 150s for Trap Bar Deadlift in Tactical Hypertrophy
  if (lower.includes('trap bar') && (lower.includes('150') || lower.includes('tactical'))) {
    return 150;
  }
  // 180s (3 Min) for Trap Bar Deadlift & heavy power compounds
  if (lower.includes('trap bar') || lower.includes('deadlift') || lower.includes('speed deadlift')) {
    return 180;
  }
  // 120s (2 Min) for Barbell Back Squat, Strict OHP, Push Press, Weighted Pull-Ups, Front Squat, and Track Sprints
  if (
    lower.includes('squat') ||
    lower.includes('overhead press') ||
    lower.includes('ohp') ||
    lower.includes('push press') ||
    lower.includes('pull-up') ||
    lower.includes('pullup') ||
    lower.includes('bench') ||
    lower.includes('800m') ||
    lower.includes('sprint') ||
    lower.includes('flush & pace')
  ) {
    return 120;
  }
  // 90s for Romanian Deadlift, Bulgarian Split Squat, DB Incline Bench, Chest-Supported Row, Farmer's Carry, Walking Lunges, Hip Thrusts
  if (
    lower.includes('rdl') ||
    lower.includes('romanian') ||
    lower.includes('split squat') ||
    lower.includes('incline') ||
    lower.includes('row') ||
    lower.includes('farmer') ||
    lower.includes('carry') ||
    lower.includes('lunge') ||
    lower.includes('thrust')
  ) {
    return 90;
  }
  // 75s for Z-Press
  if (lower.includes('z-press') || lower.includes('z press')) {
    return 75;
  }
  // 60s for Pallof Press, Dips, Curls, Calf Raises, Leg Curls, Face Pulls, Close-Grip Bench, Kettlebell Swings
  if (
    lower.includes('dip') ||
    lower.includes('curl') ||
    lower.includes('calf') ||
    lower.includes('face pull') ||
    lower.includes('close-grip') ||
    lower.includes('close grip') ||
    lower.includes('pallof') ||
    lower.includes('swing') ||
    lower.includes('twist') ||
    lower.includes('raise') ||
    lower.includes('roller') ||
    lower.includes('pinch')
  ) {
    return 60;
  }
  // 45s for Copenhagen Plank & Plank Series
  if (lower.includes('copenhagen') || lower.includes('plank')) {
    return 45;
  }
  return 90;
};

export interface ParsedExercise {
  name: string;
  defaultSets: number;
  setRangeMin: number;
  setRangeMax: number;
  targetReps: string;
  repRangeMin?: number;
  repRangeMax?: number;
  targetRpe?: number;
  restSeconds: number;
  notes: string;
  overloadHint?: string;
}

export function parseExerciseString(exerciseStr: string): ParsedExercise {
  let overloadHint = '';
  const bracketMatches = [...exerciseStr.matchAll(/\[(.*?)\]/g)];
  if (bracketMatches.length > 0) {
    overloadHint = bracketMatches.map((m) => m[1].trim()).join(' • ');
  }
  const cleanStr = exerciseStr.replace(/\[.*?\]/g, '').trim().replace(/\.$/, '');

  let name = cleanStr;
  let defaultSets = 3;
  let setRangeMin = 3;
  let setRangeMax = 3;
  let targetReps = '8-10';
  let repRangeMin: number | undefined;
  let repRangeMax: number | undefined;
  const notes = overloadHint;

  // Match the LAST parenthetical group as the (sets x reps) specification, preserving earlier parens in exercise name
  const lastOpenParen = cleanStr.lastIndexOf('(');
  const lastCloseParen = cleanStr.lastIndexOf(')');
  if (lastOpenParen > 0 && lastCloseParen === cleanStr.length - 1) {
    name = cleanStr.slice(0, lastOpenParen).trim().replace(/\.$/, '');
    const spec = cleanStr.slice(lastOpenParen + 1, lastCloseParen).trim();

    if (spec.toLowerCase() === '5x5' || spec.toLowerCase() === '5 x 5') {
      defaultSets = 5;
      setRangeMin = 5;
      setRangeMax = 5;
      targetReps = '5';
      repRangeMin = 5;
      repRangeMax = 5;
    } else if (spec.toLowerCase() === '3x3' || spec.toLowerCase() === '3 x 3') {
      defaultSets = 3;
      setRangeMin = 3;
      setRangeMax = 3;
      targetReps = '3';
      repRangeMin = 3;
      repRangeMax = 3;
    } else {
      const xMatch = spec.match(/^(\d+(?:\s*[-–]\s*\d+)?)\s*[x×]\s*(.+)$/i);
      if (xMatch) {
        const setPart = xMatch[1].trim();
        const repPart = xMatch[2].trim();
        const setNums = setPart.match(/\d+/g);
        if (setNums && setNums.length >= 2) {
          setRangeMin = parseInt(setNums[0], 10);
          setRangeMax = parseInt(setNums[1], 10);
          // Start at the low end of the set range until session history dictates more
          defaultSets = setRangeMin;
        } else if (setNums && setNums.length === 1) {
          setRangeMin = parseInt(setNums[0], 10);
          setRangeMax = setRangeMin;
          defaultSets = setRangeMin;
        }

        targetReps = repPart;
        // Parse rep range min/max if purely numeric or starting with a range (e.g., "10-12", "6-8", "3-5", "3-4", "10/leg")
        const rangeMatch = repPart.match(/^(\d+)\s*[-–]\s*(\d+)/);
        if (rangeMatch) {
          repRangeMin = parseInt(rangeMatch[1], 10);
          repRangeMax = parseInt(rangeMatch[2], 10);
        } else {
          const singleRepMatch = repPart.match(/^(\d+)/);
          if (singleRepMatch) {
            repRangeMin = parseInt(singleRepMatch[1], 10);
            repRangeMax = repRangeMin;
          }
        }
      } else {
        targetReps = spec;
      }
    }
  }

  let restSeconds = getDefaultRestPeriod(exerciseStr);
  if (overloadHint) {
    const restMatch = overloadHint.match(/rest:\s*(\d+)\s*s/i);
    if (restMatch) {
      const parsedRest = parseInt(restMatch[1], 10);
      if (!isNaN(parsedRest) && parsedRest >= 0) {
        restSeconds = parsedRest;
      }
    }
  }

  // Extract targetRpe if specified in brackets (e.g. "RPE 7", "RPE 8", "RPE 8.5-9", "RPE 8-8.5")
  let targetRpe: number | undefined;
  if (overloadHint) {
    const rpeMatch = overloadHint.match(/rpe\s*(\d+(?:\.\d+)?)/i);
    if (rpeMatch) {
      const parsedRpe = parseFloat(rpeMatch[1]);
      if (!isNaN(parsedRpe) && parsedRpe >= 5 && parsedRpe <= 10) {
        targetRpe = parsedRpe;
      }
    }
  }

  return {
    name,
    defaultSets,
    setRangeMin,
    setRangeMax,
    targetReps,
    repRangeMin,
    repRangeMax,
    targetRpe,
    restSeconds,
    notes,
    overloadHint
  };
}

// ---------------------------------------------------------------------------
// MILITARY 52-WEEK FITNESS & READINESS PROGRAM
// A Year-Long Guide to Building Strength, Endurance, Power & Injury Resilience
// ---------------------------------------------------------------------------
export const DIME_WARMUP_TEXT =
  'Mandatory 10-Minute DIME Warm-Up (Do Before Every Workout): 1) Bodyweight Squats (10 reps), 2) Squat Jumps (8 reps), 3) Forward Lunges (8 reps/leg), 4) Side Plank (20 sec/side), 5) Push-Ups (10 reps), 6) Single-Leg Reach (6 reps/leg), 7) Side Hop to Balance (6 hops/side), 8) Ice Skaters Lateral (8/side), 9) "L" Hops Forward/Side (5 hops/leg). Cool-Down (5–10 Mins): Light walking + 20–30s static stretches for calves, hamstrings, hips, and chest.';

export const APEX_PROTOCOL_PHASES: Record<string, ProtocolPhase> = {
  apex_phase1: {
    id: 'apex_phase1',
    title: 'Quarter 1 (Weeks 1–13): Aerobic Base & Movement Foundation',
    weeks: 'Weeks 1–13',
    desc: 'Build a strong cardiovascular running base (3–4 runs/week), master proper lifting form, and strengthen tendons and joints. Lower weights slowly (3 seconds down).',
    coachRule:
      'Quarter 1 Progression Rules: 1) Reps First (Double Progression) — Start at the low end of every set and rep range (e.g., 3 sets of 10 reps on 3-4x10-12). Add 1–2 reps per set each week until hitting the top of the rep range with 1–2 RIR. 2) Weight Second — Add +2.5–5 lbs (upper body) or +5–10 lbs (lower body) and drop back to the bottom of the rep range. 3) Sets Third — Perform 3 sets in Week 1, 4 sets in Weeks 2–3, and 2 sets on Week 4 (Deload). 4) Cardio & Rucks — Never increase ruck weight, running distance, and running speed in the same week (<=10% distance/wk). Deload (-40% sets & run distance) on Weeks 4, 8, 12. Benchmark Test on Week 13.',
    days: [
      {
        day: 'Day 1',
        focus: 'Lower-Body Strength + Easy Base Run',
        warmup: DIME_WARMUP_TEXT,
        strength: [
          'Goblet Squat or Back Squat (to parallel) (3-4x10-12) [Overload: Start at 3 sets x 10 reps; build to 12 reps then +5-10 lbs - Effort: Moderate (RPE 7) - Rest: 90s - Lower slowly (3s down), thighs parallel, flat braced back]',
          'Romanian Deadlift (RDL) (3-4x10-12) [Overload: Start at 3 sets x 10 reps; build to 12 reps then +5-10 lbs - Effort: Moderate (RPE 7) - Rest: 90s - Lower slowly (3s down)]',
          'Forward or Reverse Lunges (3x10/leg) [Overload: Start at 3 sets x 10/leg; add light DBs once stable - Effort: Bodyweight / Light DBs (RPE 7) - Rest: 60s]',
          'Front Plank + Glute Bridges (3x30 sec / 15 reps) [Effort: Bodyweight (RPE 7) - Rest: 45s - Spine-safe core bracing; skip sit-ups and twisting crunches]'
        ],
        run: 'Post-Lift Aerobic Run: 3,200m (2 miles) (1 set)',
        pace: 'Easy Conversational Pace (Rest: 0s)',
        progressionRule: 'Start at 3 sets x 10 reps (RPE 7, 3s eccentric). Build to 12 reps across all sets before adding +5–10 lbs. Post-Lift Run: 3,200m (2 miles) easy conversational pace.'
      },
      {
        day: 'Day 2',
        focus: 'Cardio Base & Aerobic Endurance',
        warmup: DIME_WARMUP_TEXT,
        strength: [],
        run: 'Steady Aerobic Run (build distance weekly): 4,800–6,400m (3–4 miles)',
        pace: 'Conversational Pace (Rest: 0s)',
        progressionRule: 'Start at 4,800m (3 miles) and build distance by no more than 10% per week up to 6,400m (4 miles).'
      },
      {
        day: 'Day 3',
        focus: 'Upper-Body Strength & Core',
        warmup: DIME_WARMUP_TEXT,
        strength: [
          'Dumbbell or Barbell Bench Press (3-4x10-12) [Overload: Start at 3 sets x 10 reps; build to 12 reps then +2.5-5 lbs - Effort: Moderate (RPE 7) - Rest: 90s - Lower slowly (3s down)]',
          'Pull-Ups (or Band-Assisted / Flexed Hang) (4x5-8) [Overload: Start at 4 sets x 5 reps (or 20s hang); build to 8 reps across all sets - Effort: Bodyweight (RPE 7) - Rest: 90s]',
          'Standing Dumbbell Shoulder Press (3x10-12) [Overload: Start at 3 sets x 10 reps; build to 12 reps then +2.5-5 lbs - Effort: Moderate (RPE 7) - Rest: 90s - Lower slowly (3s down)]',
          'Chest-Supported Row + Band Pull-Aparts (3x12 reps each) [Overload: +2.5-5 lbs on 3x12 row when crisp - Effort: Moderate / Light (RPE 7) - Rest: 60s]'
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: 'Bench & Shoulder Press: Start at 3x10 (RPE 7), build to 12 reps then +2.5–5 lbs. Pull-Ups: Start at 4x5 (or 20s hang), build to 4x8.'
      },
      {
        day: 'Day 4',
        focus: 'Mid-Week Aerobic Run & Mobility',
        warmup: DIME_WARMUP_TEXT,
        strength: [],
        run: 'Steady Aerobic Run + 10-Min Mobility: 4,800m (3 miles) (1 set)',
        pace: 'Easy Conversational Pace (Rest: 0s)',
        progressionRule: '4,800m (3 miles) easy conversational Zone 2 run followed by 10 minutes of foam rolling and mobility.'
      },
      {
        day: 'Day 5',
        focus: 'Full-Body Power & Conditioning',
        warmup: DIME_WARMUP_TEXT,
        strength: [
          'Two-Arm Kettlebell Swings (4x15) [Overload: +5 lbs KB when 4x15 is explosive - Effort: Moderate KB (RPE 7) - Rest: 60s]',
          'Box Step-Ups (knee at 90 degrees) (3x10/leg) [Overload: Start bodyweight/light DBs; +2.5-5 lbs - Effort: Bodyweight / Light DBs (RPE 7) - Rest: 60s]',
          'Strict Push-Ups (3x12-15) [Overload: Start at 3 sets x 12 reps; build to 15 reps across all sets - Effort: Bodyweight (RPE 7) - Rest: 60s]',
          "Farmer's Carry + Bird Dogs (3x30m / 8 per side) [Overload: +5 lbs DBs when posture stays vertical - Effort: Moderate Dumbbells (RPE 7) - Rest: 60s]"
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: 'Complete all 4 full-body power, step-up, push-up, and loaded carry + bird-dog core blocks at RPE 7.'
      },
      {
        day: 'Day 6',
        focus: 'Entry Ruck March (Flat to Rolling Hills)',
        warmup: DIME_WARMUP_TEXT,
        strength: [],
        run: 'Entry Ruck March (Flat to Rolling Hills): 3,200–4,800m (2–3 miles) (1 set)',
        pace: '35 lb pack (5–6 km/h brisk pace — add distance first; only add +5–10 lbs pack weight on a week distance stays the same)',
        progressionRule: 'Start at 3,200m (2 miles) with a 35 lb pack at 5–6 km/h. Build toward 4,800m (3 miles); never increase pack weight and distance in the same week.'
      },
      {
        day: 'Day 7',
        focus: 'Complete Rest & Recovery',
        warmup: 'None — Full physical and mental recovery; prioritize 7–9 hours of dark, cool sleep.',
        strength: [
          'Complete Rest: Full physical and mental recovery; prioritize 7–9 hours of sleep, hydration, and meal prep (0.75–1.0g lean protein per lb of bodyweight).'
        ],
        run: 'Complete Rest',
        pace: 'N/A',
        progressionRule: 'Complete physiological & nervous system recovery before Day 1 Lower-Body Strength + Run.'
      }
    ]
  },
  apex_phase2: {
    id: 'apex_phase2',
    title: 'Quarter 2 (Weeks 14–26): Running Stamina & Base Strength',
    weeks: 'Weeks 14–26',
    desc: 'Expand aerobic and threshold running capacity with 400m–800m track intervals and 6,400–8,000m (4–5 mile) runs while building base barbell strength.',
    coachRule:
      'Quarter 2 Progression Rules: Start at the low end of set and rep ranges (e.g., 4 sets x 6 reps on 4-5x6-8 Back Squat & Bench Press) at Challenging Effort (RPE 8). Build to 8 reps across all sets before adding +2.5–5 lbs (upper) or +5–10 lbs (lower). Never increase ruck weight, running distance, and running speed in the same week. Deload (-40% volume) on Weeks 16, 20, 24. Benchmark Test on Week 26.',
    days: [
      {
        day: 'Day 1',
        focus: 'Lower-Body Strength + Post-Lift Aerobic Run',
        warmup: DIME_WARMUP_TEXT,
        strength: [
          'Barbell Back Squat (parallel depth) (4-5x6-8) [Overload: Start at 4 sets x 6 reps; build to 8 reps then +5-10 lbs, then 5th set - Effort: Challenging (RPE 8) - Rest: 120s (2-3 min)]',
          'Conventional or Trap-Bar Deadlift (4x6) [Overload: +5-10 lbs on 4x6 with clean bar speed - Effort: Challenging (RPE 8) - Rest: 120s (2-3 min)]',
          'Bulgarian Split Squat (rear foot elevated) (3x8/leg) [Overload: +5 lbs DBs when 3x8/leg is solid - Effort: Moderate Dumbbells (RPE 8) - Rest: 90s]',
          'Pallof Press (Anti-Rotation) + Hanging Knee Raise (3x10/side + 12 reps) [Effort: Moderate Band/Cable (RPE 8) - Rest: 60s]'
        ],
        run: 'Post-Lift Aerobic Run: 3,200m (2 miles) (1 set)',
        pace: 'Easy Recovery Pace (Rest: 0s)',
        progressionRule: 'Back Squat: Start at 4x6 (RPE 8), build to 8 reps then +5–10 lbs. Deadlift: 4x6 at RPE 8. Finish with 3,200m (2 miles) easy recovery run.'
      },
      {
        day: 'Day 2',
        focus: 'Cardio Intervals & Speed Endurance (400m Repeats)',
        warmup: DIME_WARMUP_TEXT,
        strength: [
          '400m Run Repeats (or 10 x 100m Tempo Runs) (6-8x400m (~75-90s)) [Overload: Start at 6 sets x 400m; build to 8 repeats - Effort: Hard (75-80% effort, RPE 8) - Rest: 120s (2 min walk)]'
        ],
        run: '6–8 × 400m Run Repeats (~75–90s) or 10 × 100m Tempo Runs',
        pace: 'Hard (75–80% effort) • 2 min walk recovery between repeats',
        progressionRule: 'Start at 6x400m (~75–90s per repeat, 2 min walk rest) and progress to 8x400m with consistent split pacing.'
      },
      {
        day: 'Day 3',
        focus: 'Upper-Body Strength & Core',
        warmup: DIME_WARMUP_TEXT,
        strength: [
          'Barbell Bench Press (1-second pause on chest) (4-5x6-8) [Overload: Start at 4 sets x 6 reps; build to 8 reps then +2.5-5 lbs, then 5th set - Effort: Challenging (RPE 8) - Rest: 120s (2-3 min)]',
          'Weighted or Strict Pull-Ups (4x6-8) [Overload: Start at 4 sets x 6 reps; build to 8 reps (BW or +10-25 lbs) - Effort: Challenging (RPE 8) - Rest: 120s (2 min)]',
          'Standing Barbell Overhead Press (4x6-8) [Overload: Start at 4 sets x 6 reps; build to 8 reps then +2.5-5 lbs - Effort: Challenging (RPE 8) - Rest: 120s (2 min)]',
          'Bent-Over Barbell Row + Face Pulls (3x8-10 + 15 reps) [Overload: Start at 3x8 row; build to 10 reps then +5 lbs - Effort: Moderate (RPE 8) - Rest: 90s]'
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: 'Bench Press (1s pause), Pull-Ups & Barbell OHP: Start at 4x6 (RPE 8), build to 8 reps then add +2.5–5 lbs.'
      },
      {
        day: 'Day 4',
        focus: 'Mid-Week Long Steady Aerobic Run',
        warmup: DIME_WARMUP_TEXT,
        strength: [],
        run: 'Long Steady Aerobic Run: 6,400–8,000m (4–5 miles) (start at 4 miles)',
        pace: 'Steady Zone 2 Pace (Rest: 0s)',
        progressionRule: 'Start at 6,400m (4 miles) and build weekly by no more than 10% toward 8,000m (5 miles) at steady Zone 2 pace.'
      },
      {
        day: 'Day 5',
        focus: 'Anaerobic Conditioning (Sled, Sandbag & Grip)',
        warmup: DIME_WARMUP_TEXT,
        strength: [
          'Heavy Sled Push & Backward Drag (5x15m out / 15m back) [Overload: +10 lbs sled load when all 5 rounds stay crisp - Effort: Heavy (75-85% effort, RPE 8.5) - Rest: 120s (2 min)]',
          'Sandbag Bear-Hug Carry (4x30m) [Overload: Progress from 80 lb toward 120 lb sandbag - Effort: 80-120 lb Sandbag (RPE 8) - Rest: 90s]',
          'Barbell Deadlift Grip Holds (3x30-45 sec) [Overload: Build from 30s to 45s at 60-70% Max Deadlift - Effort: 60-70% Max Deadlift (RPE 8) - Rest: 90s]',
          'Ab Wheel Rollouts (or Plank Saw) (3x10-12) [Overload: Start at 3 sets x 10 reps; build to 12 reps - Effort: Bodyweight (RPE 8) - Rest: 60s]'
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: '5x15m out/15m back Heavy Sled Push & Backward Drag + 4x30m Sandbag Bear-Hug Carry (80–120 lbs) + 3x30–45s Barbell Deadlift Grip Holds.'
      },
      {
        day: 'Day 6',
        focus: 'Progressive Ruck March (Rolling Hills)',
        warmup: DIME_WARMUP_TEXT,
        strength: [],
        run: 'Progressive Ruck March (Rolling Hills): 4,800–6,400m (3–4 miles) (1 set)',
        pace: '40–50 lb pack (5–6 km/h brisk pace on rolling hills)',
        progressionRule: 'Progress from 4,800m (3 miles) to 6,400m (4 miles) with a 40–50 lb pack at 5–6 km/h. Never increase weight and distance in the same week.'
      },
      {
        day: 'Day 7',
        focus: 'Complete Rest & Recovery',
        warmup: 'None — Full physical and mental recovery; prioritize 7–9 hours of dark, cool sleep.',
        strength: [
          'Complete Rest: Full physical and mental recovery; prioritize 7–9 hours of sleep, hydration, and meal prep (0.75–1.0g lean protein per lb of bodyweight).'
        ],
        run: 'Complete Rest',
        pace: 'N/A',
        progressionRule: 'Complete physiological & nervous system recovery before next training week.'
      }
    ]
  },
  apex_phase3: {
    id: 'apex_phase3',
    title: 'Quarter 3 (Weeks 27–39): Peak Strength, Sprint Speed & Tempo Runs',
    weeks: 'Weeks 27–39',
    desc: 'Lift heavy weights with maximum upward speed (Compensatory Acceleration) while building high-speed sprint stamina and fast 5,000m–8,000m running endurance.',
    coachRule:
      'Quarter 3 Progression Rules: Start at the low end of every set and rep range (e.g., 4 sets x 3 reps on 4-5x3-5 Back Squat & Bench Press; 8 sprints on 8-10x20-40m Hill/Sled Sprints). Explode upward fast on every concentric rep at 85–92% Max (RPE 8.5–9). Deload (-40% volume, -20 lbs ruck weight) on Weeks 28, 32, 36. Benchmark Test on Week 39.',
    days: [
      {
        day: 'Day 1',
        focus: 'Lower Max Strength & Explosive Power',
        warmup: DIME_WARMUP_TEXT,
        strength: [
          'Box Jumps (step down; land softly) (4x4) [Effort: Max Jump Height (RPE 8.5) - Rest: 120s (2 min)]',
          'Barbell Back Squat (explode up fast) (4-5x3-5) [Overload: Start at 4 sets x 3 reps; build to 5 reps then +5-10 lbs, then 5th set - Effort: Heavy (85-92% Max, RPE 8.5-9) - Rest: 180s (3-5 min)]',
          'Deficit Deadlift (stand on 5 cm plate) (3x4) [Overload: +5-10 lbs on 3x4 with crisp bar speed - Effort: Heavy (80-85% Max, RPE 8.5-9) - Rest: 180s (3 min)]',
          'Heavy Suitcase Carry (one hand at a time) (3x25m/arm) [Overload: +5 lbs DB/KB on 25m/arm - Effort: Heavy Dumbbell/KB (RPE 8.5) - Rest: 60s]'
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: 'Back Squat: Start at 4x3 (85–92% Max), build to 5 reps before adding +5–10 lbs. Deficit Deadlift (5 cm plate): 3x4 at 80–85% Max.'
      },
      {
        day: 'Day 2',
        focus: 'Hill / Sled Sprint Speed + Easy Recovery Run',
        warmup: DIME_WARMUP_TEXT,
        strength: [
          'Hill Sprints or Weighted Sled Sprints (8-10x20-40m (<= 6 sec)) [Overload: Start at 8 sets x 20-40m; build to 10 sprints - Effort: All-Out (95-100%, RPE 9.5) - Rest: 90s (90-120 sec)]'
        ],
        run: 'Easy Recovery Run: 3,200m (2 miles) (1 set)',
        pace: 'Easy Pace (after 8–10 × 20–40m Hill or Weighted Sled Sprints)',
        progressionRule: 'Execute 8–10x20–40m Hill Sprints or Weighted Sled Sprints (<= 6 sec work, 90–120s full rest) at 95–100% effort, then 3,200m (2 miles) easy recovery run.'
      },
      {
        day: 'Day 3',
        focus: 'Upper Max Strength & Explosive Pressing',
        warmup: DIME_WARMUP_TEXT,
        strength: [
          'Explosive Medicine Ball Chest Pass (4x5) [Effort: 10-14 lb Med Ball (RPE 8.5) - Rest: 90s]',
          'Barbell Bench Press (explode up fast) (4-5x3-5) [Overload: Start at 4 sets x 3 reps; build to 5 reps then +2.5-5 lbs, then 5th set - Effort: Heavy (85-92% Max, RPE 8.5-9) - Rest: 180s (3-5 min)]',
          'Weighted Pull-Ups (4x4-6) [Overload: Start at 4 sets x 4 reps; build to 6 reps then +2.5-5 lbs - Effort: Heavy (RPE 8.5) - Rest: 180s (3 min)]',
          'Barbell Push Press (use leg drive) (4x4) [Overload: +2.5-5 lbs on 4x4 Push Press - Effort: Heavy (80-85% Max, RPE 8.5) - Rest: 120s (2 min)]'
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: 'Bench Press: Start at 4x3 (85–92% Max), build to 5 reps then +2.5–5 lbs. Weighted Pull-Ups: Start at 4x4, build to 4x6. Push Press: 4x4 at 80–85% Max.'
      },
      {
        day: 'Day 4',
        focus: 'Mid-Week Sustained Tempo Run',
        warmup: DIME_WARMUP_TEXT,
        strength: [],
        run: 'Sustained Tempo Run (fast, controlled pace): 5,000–8,000m (3–5 miles) (start at 3 miles)',
        pace: 'Threshold (75–80% HRR, Rest: 0s)',
        progressionRule: 'Start at 5,000m (3.1 miles) at Threshold pace (75–80% HRR) and build progressively toward 8,000m (5 miles).'
      },
      {
        day: 'Day 5',
        focus: 'Speed-Power & Ballistic Conditioning',
        warmup: DIME_WARMUP_TEXT,
        strength: [
          'Trap-Bar Jumps (jump explosively) (5x3) [Effort: Light (20% Squat Max, RPE 8) - Rest: 120s (2 min)]',
          'Speed Bench Press (max bar speed) (6x3) [Effort: Moderate (55-65% Max, RPE 8) - Rest: 60s]',
          'Single-Arm Kettlebell Snatch (4x5/arm) [Overload: Progress from 35 lb toward 53 lb KB - Effort: Explosive (35-53 lb, RPE 8.5) - Rest: 90s]',
          'Rotational Medicine Ball Throws (3x6/side) [Effort: 10-12 lb Med Ball (RPE 8) - Rest: 60s]'
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: 'Explosive Trap-Bar Jumps (5x3 @ 20% Squat Max) + Speed Bench (6x3 @ 55–65% Max) + Single-Arm KB Snatch (4x5/arm) + Rotational Med Ball Throws (3x6/side).'
      },
      {
        day: 'Day 6',
        focus: 'Heavy Hill Ruck March',
        warmup: DIME_WARMUP_TEXT,
        strength: [],
        run: 'Heavy Hill Ruck March (Deload 20 lbs every 4th wk): 4,000–6,000m (2.5–3.7 miles) (1 set)',
        pace: '60–80 lb pack (4–5.5 km/h — Deload pack weight by 20 lbs every 4th week)',
        progressionRule: '4,000–6,000m Heavy Hill Ruck March with a 60–80 lb pack at 4–5.5 km/h. Drop pack weight by 20 lbs on every 4th Deload week.'
      },
      {
        day: 'Day 7',
        focus: 'Complete Rest & Recovery',
        warmup: 'None — Full physical and mental recovery; prioritize 7–9 hours of dark, cool sleep.',
        strength: [
          'Complete Rest: Full physical and mental recovery; prioritize 7–9 hours of sleep, hydration, and meal prep (0.75–1.0g lean protein per lb of bodyweight).'
        ],
        run: 'Complete Rest',
        pace: 'N/A',
        progressionRule: 'Complete physiological & nervous system recovery before next training week.'
      }
    ]
  },
  apex_phase4: {
    id: 'apex_phase4',
    title: 'Quarter 4 (Weeks 40–52): Combat Readiness & Annual Peak',
    weeks: 'Weeks 40–52',
    desc: 'Combine peak running endurance, strength, and speed into realistic combat conditioning circuits. Week 51: Cut volume by 50% (Taper). Week 52: Final Fitness Test.',
    coachRule:
      'Quarter 4 Progression Rules: Maintain peak strength with low-volume heavy triples/quads (start at 3 sets x 3 reps on 3x3-4 Back Squat, Bench Press & Conventional Deadlift; 3x4-5 Barbell OHP at 80–85% Max, RPE 8–8.5) so legs stay fresh for Day 2 Agility/Fartlek, Day 5 4-Round Combat Medley, and Day 6 5,000m Battle Simulation March. Deload (-40% volume) on Weeks 40, 44, 48. Week 51: Cut volume by 50% (Taper). Week 52: Final Fitness Test.',
    days: [
      {
        day: 'Day 1',
        focus: 'Squat, Bench & Pull-Up Strength Maintenance',
        warmup: DIME_WARMUP_TEXT,
        strength: [
          'Barbell Back Squat (3x3-4) [Overload: Start at 3 sets x 3 reps; build to 4 reps then +5-10 lbs - Effort: Heavy (80-85% Max, RPE 8-8.5) - Rest: 180s (3 min)]',
          'Barbell Bench Press (3x3-4) [Overload: Start at 3 sets x 3 reps; build to 4 reps then +2.5-5 lbs - Effort: Heavy (80-85% Max, RPE 8-8.5) - Rest: 180s (3 min)]',
          'Weighted Pull-Ups + Standing Pallof Press (3x5 + 10/side) [Overload: +2.5-5 lbs on 3x5 Weighted Pull-Ups - Effort: Challenging (RPE 8.5) - Rest: 90s]'
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: 'Back Squat & Bench Press: Start at 3x3 (80–85% Max, RPE 8–8.5), build to 4 reps then add load. Weighted Pull-Ups + Standing Pallof Press: 3x5 + 10/side.'
      },
      {
        day: 'Day 2',
        focus: 'Pro Agility, T-Test Drills & Fartlek Run',
        warmup: DIME_WARMUP_TEXT,
        strength: [
          'Pro Agility (5m-10m-5m) & 10m T-Test Drills (4x1 rep each drill) [Effort: All-Out (95%, RPE 9) - Rest: 90s]'
        ],
        run: 'Fartlek Run (jog mixed with 45s sprints & 200m hills): 6,400–8,000m (4–5 miles)',
        pace: 'Moderate to Hard (Jog mixed with 45s sprints & 200m hills)',
        progressionRule: 'Complete 4x1 rep each of Pro Agility (5m-10m-5m) & 10m T-Test Drills at 95% effort (90s rest), then 6,400–8,000m (4–5 miles) Fartlek Run.'
      },
      {
        day: 'Day 3',
        focus: 'Deadlift, Overhead Press & Sandbag Maintenance',
        warmup: DIME_WARMUP_TEXT,
        strength: [
          'Conventional Deadlift (3x3-4) [Overload: Start at 3 sets x 3 reps; build to 4 reps then +5-10 lbs - Effort: Heavy (80-85% Max, RPE 8-8.5) - Rest: 180s (3 min)]',
          'Standing Barbell Overhead Press (3x4-5) [Overload: Start at 3 sets x 4 reps; build to 5 reps then +2.5-5 lbs - Effort: Heavy (80-85% Max, RPE 8-8.5) - Rest: 150s (2-3 min)]',
          'Sandbag Clean & Press + Hanging Leg Raises (3x6 + 12 reps) [Effort: 80-120 lb Sandbag (RPE 8.5) - Rest: 90s]'
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: 'Conventional Deadlift: Start at 3x3 (80–85% Max), build to 4 reps. Barbell OHP: Start at 3x4, build to 5 reps. Sandbag Clean & Press + Hanging Leg Raises: 3x6 + 12.'
      },
      {
        day: 'Day 4',
        focus: 'Mid-Week Steady Zone 2 Recovery Run',
        warmup: DIME_WARMUP_TEXT,
        strength: [],
        run: 'Steady Zone 2 Recovery Run: 4,800m (3 miles) (1 set)',
        pace: 'Easy Conversational Pace (Rest: 0s)',
        progressionRule: 'Maintain an easy conversational Zone 2 pace across 4,800m (3 miles) to flush fatigue before Day 5 Combat Medley & Day 6 Battle Simulation.'
      },
      {
        day: 'Day 5',
        focus: '4-Round Combat Readiness Medley',
        warmup: DIME_WARMUP_TEXT,
        strength: [
          '4 Rounds Back-to-Back Combat Medley (60-90 sec work/round) (4x1 full circuit) [Effort: Hard (85-90% effort, RPE 9) - Rest: 150s (2-3 min between rounds) - Circuit Stations: 1) 70m Casualty Drag / Heavy Sled Drag (~165 lbs), 2) 70m Sprint carrying two 30-50 lb Ammo Cans / Dumbbells, 3) 15m Low Crawl + 15m High Crawl + 5 Push-Ups, 4) 10 Sledgehammer Strikes per side on a tire]'
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: 'Complete 4 rounds back-to-back (60–90s work/round, 2–3 min rest): 70m Casualty Drag (~165 lbs) + 70m Ammo Can Sprint (30–50 lbs/hand) + 15m Low/High Crawl + 5 Push-Ups + 10/side Tire Sledgehammer Strikes.'
      },
      {
        day: 'Day 6',
        focus: 'Battle Simulation March & Obstacle Course',
        warmup: DIME_WARMUP_TEXT,
        strength: [],
        run: 'Battle Simulation March & Obstacle Course: 5,000m (3.1 miles) (1 set)',
        pace: '60 lb pack / full kit',
        progressionRule: 'Complete a 5,000m (3.1 miles) Battle Simulation March & Obstacle Course under a 60 lb pack / full kit.'
      },
      {
        day: 'Day 7',
        focus: 'Complete Rest & Recovery',
        warmup: 'None — Full physical and mental recovery; prioritize 7–9 hours of dark, cool sleep.',
        strength: [
          'Complete Rest: Full physical and mental recovery; prioritize 7–9 hours of sleep, hydration, and meal prep (0.75–1.0g lean protein per lb of bodyweight).'
        ],
        run: 'Complete Rest',
        pace: 'N/A',
        progressionRule: 'Complete physiological & nervous system recovery before next training week.'
      }
    ]
  }
};

/**
 * Returns customized week data for any week 1 through 52 of the Military 52-Week Fitness & Readiness Program.
 * Incorporates Quarter 1–4 templates, 3-week progressive blocks, every-4th-week 40% Deloads (Weeks 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48),
 * Week 51 Taper (-50% volume), and Quarterly/Annual Benchmark Tests (Weeks 13, 26, 39, 52).
 */
export function getApexWeekData(weekNumber: number): ProtocolPhase {
  const week = Math.max(1, Math.min(52, weekNumber));

  let basePhaseId = 'apex_phase1';
  let quarterNum = 1;
  if (week >= 1 && week <= 13) {
    basePhaseId = 'apex_phase1';
    quarterNum = 1;
  } else if (week >= 14 && week <= 26) {
    basePhaseId = 'apex_phase2';
    quarterNum = 2;
  } else if (week >= 27 && week <= 39) {
    basePhaseId = 'apex_phase3';
    quarterNum = 3;
  } else {
    basePhaseId = 'apex_phase4';
    quarterNum = 4;
  }

  const basePhase = APEX_PROTOCOL_PHASES[basePhaseId];
  const clonedDays = JSON.parse(JSON.stringify(basePhase.days)) as ProtocolDay[];

  const isDeloadWeek = week % 4 === 0 && week <= 48;
  const isTaperWeek = week === 51;
  const isTestWeek = week === 13 || week === 26 || week === 39 || week === 52;

  let weekBadge = '';
  let weekRulePrefix = `Week ${week} of 52 (Quarter ${quarterNum}): `;

  if (isDeloadWeek) {
    weekBadge = ' (DELOAD WEEK — -40% VOLUME)';
    weekRulePrefix +=
      'RECOVERY / DELOAD WEEK (Every 4th Week Rule): Cut your strength sets and running mileage by 40% this week so your joints and nervous system recover. ';
    clonedDays.forEach((d) => {
      if (d.run && !d.run.toLowerCase().includes('rest')) {
        d.run = `${d.run} [Deload Week ${week}: Cut running distance/rounds by 40%]`;
      }
      d.progressionRule = `Deload Week ${week}: Cut strength sets and running mileage by 40% for joint & CNS recovery. ${d.progressionRule || ''}`;
    });
  } else if (isTaperWeek) {
    weekBadge = ' (WEEK 51 TAPER — -50% VOLUME)';
    weekRulePrefix +=
      'WEEK 51 TAPER: Cut all strength sets, circuit rounds, and running volume by 50% this week while maintaining crisp movement speed to peak for Week 52 Final Fitness Testing. ';
    clonedDays.forEach((d) => {
      if (d.run && !d.run.toLowerCase().includes('rest')) {
        d.run = `${d.run} [Week 51 Taper: Cut volume by 50%]`;
      }
      d.progressionRule = `Week 51 Taper: Cut volume by 50% to shed fatigue before Week 52 Final Fitness Test. ${d.progressionRule || ''}`;
    });
  } else if (isTestWeek) {
    weekBadge = week === 52 ? ' (FINAL ANNUAL FITNESS TEST)' : ` (QUARTER ${quarterNum} BENCHMARK TEST)`;
    weekRulePrefix +=
      'TARGET FITNESS BENCHMARK WEEK (Test Well-Rested): Test 1) 3,200m (2-Mile) Run [Solid ≤15:00 | Strong ≤13:30 | Elite ≤12:30] & 5,000m Run [≤24:30 | ≤21:30 | ≤19:30], 2) Back Squat & Deadlift 1RM [2.0x | 2.2x | 2.5x BW], 3) Bench Press 1RM [1.25x | 1.5x | 1.75x BW] & Overhead Press 1RM [0.8x | 1.0x | 1.25x BW], 4) Strict Pull-Ups [8 | 12 | 15+ reps] & 40m Sprint [≤5.70s | ≤5.30s | ≤5.00s], 5) Vertical Jump [50 cm | 60 cm | 70+ cm]. ';
  } else {
    const blockWeek = ((week - 1) % 4) + 1; // 1, 2, or 3 within the 4-week cycle
    weekRulePrefix += `3-Week Progressive Block (Week ${blockWeek} of 3): Start at the low end of set & rep ranges; add 1–2 reps per set until hitting the top of the rep range with 1–2 RIR, then add +2.5–5 lbs (upper) or +5–10 lbs (lower). `;
  }

  return {
    ...basePhase,
    id: `apex_week_${week}`,
    title: `${basePhase.title} — Week ${week}${weekBadge}`,
    weeks: `Week ${week} of 52 • Quarter ${quarterNum}`,
    coachRule: `${weekRulePrefix}${basePhase.coachRule || ''}`,
    days: clonedDays
  };
}

// Merge Military 52-Week Fitness & Readiness Program into PROTOCOL_DATA
Object.assign(PROTOCOL_DATA, APEX_PROTOCOL_PHASES);

// ---------------------------------------------------------------------------
// 12-WEEK MILITARY TACTICAL BODYBUILDING PROGRAM
// Warfighter Strength, Hypertrophy & Field Readiness (7-Day Garrison Cycle)
// ---------------------------------------------------------------------------
export const TACTICAL_BB_DIME_WARMUP_TEXT =
  'Mandatory 8-Minute DIME Warm-Up Protocol (Before Every Session): Dynamic Mobility — 10 World\'s Greatest Stretches with thoracic reach (5/side), 10 Leg Swings (front/back and side-to-side/leg); Isolation & Activation — 15 Glute Bridges (2-sec hold), 15 Band Pull-Aparts (palms up); Movement Prep — 20m High Knees, 20m Butt Kicks, 20m A-Skips; Explosive Primer — 3 Broad Jumps (step back and fully reset between reps).';

export const TACTICAL_BB_DAILY_RECOVERY_DIME_TEXT =
  'Complete Rest & Garrison Prep: Full CNS recovery, foot care, meal prep, and 8+ hours of sleep prioritization (Optional: light 8-minute DIME dynamic mobility & activation flow to relieve ruck and plate-carrier stiffness).';

export interface TacticalConditioningWeek {
  week: number;
  phase: 1 | 2 | 3;
  phaseName: string;
  conditioningSummary: string;
  is_deload?: boolean;
}

export const TACTICAL_CONDITIONING_MATRIX: TacticalConditioningWeek[] = [
  { week: 1, phase: 1, phaseName: 'Phase 1: Armor & Base', conditioningSummary: 'Day 3: 6×20m Prone Starts + 4×40m Build-Ups + 4×40m Backward Sled | Day 6: 3–4 mi Ruck @ 35 lbs + Arm Pump', is_deload: false },
  { week: 2, phase: 1, phaseName: 'Phase 1: Armor & Base', conditioningSummary: 'Day 3: 6×20m Prone Starts + 4×40m Build-Ups + 4×40m Backward Sled | Day 6: 3–4 mi Ruck @ 35 lbs + Arm Pump', is_deload: false },
  { week: 3, phase: 1, phaseName: 'Phase 1: Armor & Base', conditioningSummary: 'Day 3: 6×20m Prone Starts + 4×40m Build-Ups + 4×40m Backward Sled | Day 6: 3–4 mi Ruck @ 35 lbs + Arm Pump', is_deload: false },
  { week: 4, phase: 1, phaseName: 'Phase 1 Deload', conditioningSummary: 'Deload (-40% sets, ~80% load, cap Day 6 ruck at 2 miles unweighted)', is_deload: true },
  { week: 5, phase: 2, phaseName: 'Phase 2: Power-Building', conditioningSummary: 'Day 3: 6× Pro Agility (5-10-5m) + 5×30m Flying Sprints + 6×15s/45s Bike | Day 6: 4–5 mi Ruck @ 45 lbs + Arm Pump', is_deload: false },
  { week: 6, phase: 2, phaseName: 'Phase 2: Power-Building', conditioningSummary: 'Day 3: 6× Pro Agility (5-10-5m) + 5×30m Flying Sprints + 6×15s/45s Bike | Day 6: 4–5 mi Ruck @ 45 lbs + Arm Pump', is_deload: false },
  { week: 7, phase: 2, phaseName: 'Phase 2: Power-Building', conditioningSummary: 'Day 3: 6× Pro Agility (5-10-5m) + 5×30m Flying Sprints + 6×15s/45s Bike | Day 6: 4–5 mi Ruck @ 45 lbs + Arm Pump', is_deload: false },
  { week: 8, phase: 2, phaseName: 'Phase 2 Deload', conditioningSummary: 'Deload (-40% sets, ~80% load, cap Day 6 ruck at 2 miles unweighted)', is_deload: true },
  { week: 9, phase: 3, phaseName: 'Phase 3: Peak & Combat Velocity', conditioningSummary: 'Day 3: 4× IMT Bound Series + 4×50m Farmer Walk/50m Sprint Shuttle | Day 6: 5–6 mi Ruck @ 45–55 lbs + Arm Pump', is_deload: false },
  { week: 10, phase: 3, phaseName: 'Phase 3: Peak & Combat Velocity', conditioningSummary: 'Day 3: 4× IMT Bound Series + 4×50m Farmer Walk/50m Sprint Shuttle | Day 6: 5–6 mi Ruck @ 45–55 lbs + Arm Pump', is_deload: false },
  { week: 11, phase: 3, phaseName: 'Phase 3: Peak & Combat Velocity', conditioningSummary: 'Day 3: 4× IMT Bound Series + 4×50m Farmer Walk/50m Sprint Shuttle | Day 6: 5–6 mi Ruck @ 45–55 lbs + Arm Pump', is_deload: false },
  { week: 12, phase: 3, phaseName: 'Phase 3 Deload / Peak', conditioningSummary: 'Deload (-40% sets, ~80% load, 2-mile unweighted Zone 2 walk)', is_deload: true },
];

function buildTacticalBodybuildingPhase(phaseNum: 1 | 2 | 3): ProtocolPhase {
  const isP1 = phaseNum === 1;
  const isP2 = phaseNum === 2;
  const mainReps = isP1 ? '8-10' : isP2 ? '5-6' : '3-5';
  const upperAccReps = isP1 ? '10-12' : isP2 ? '8-10' : '6-8';
  const lowerAccSingleReps = isP1 ? '10/leg' : isP2 ? '8/leg' : '6/leg';
  const legCurlReps = isP1 ? '12' : isP2 ? '10' : '8';
  const compoundRest = isP1 ? 120 : isP2 ? 150 : 180;
  const accessoryRest = isP1 ? 75 : isP2 ? 90 : 75;

  const phaseTitle = isP1
    ? 'Phase 1 (Weeks 1–4): Armor & Base — 12-Week Military Tactical Bodybuilding Program'
    : isP2
    ? 'Phase 2 (Weeks 5–8): Power-Building — 12-Week Military Tactical Bodybuilding Program'
    : 'Phase 3 (Weeks 9–12): Peak & Combat Velocity — 12-Week Military Tactical Bodybuilding Program';

  const phaseWeeks = isP1 ? 'Weeks 1–4' : isP2 ? 'Weeks 5–8' : 'Weeks 9–12';
  const phaseDesc = isP1
    ? 'Phase 1 (Armor & Base): Structural hypertrophy (8–10 main, 10–15 accessory), tendon resilience, acceleration mechanics, and aerobic ruck base (3–4 mi @ 35 lbs). 7-Day Garrison Cycle. Guardrails: Zero Olympic lifts, burpees, or high-impact jump ropes. Mandatory 8-Min DIME Warm-Up daily.'
    : isP2
    ? 'Phase 2 (Power-Building): Maximal force production (5–6 main, 8–10 accessory), yoke/upper-back density, top-end sprint velocity, and 4–5 mi ruck @ 45 lbs. Guardrails: Zero Olympic lifts, burpees, or high-impact jump ropes. Mandatory 8-Min DIME Warm-Up daily.'
    : 'Phase 3 (Peak & Combat Velocity): Heavy strength maintenance (3–5 main, 6–8 explosive/hypertrophy), IMT bounding power under fatigue, casualty-drag stamina, and 5–6 mi ruck @ 45–55 lbs. Guardrails: Zero Olympic lifts, burpees, or high-impact jump ropes. Mandatory 8-Min DIME Warm-Up daily.';

  const coachRule =
    'Military Tactical Bodybuilding & Garrison Rules: 1) Double Progression — Pick a weight within the target rep range; once you hit the top of the rep range for all sets with 1–2 RIR, add +5 lbs (upper body) or +10 lbs (lower body) next week. 2) Unit PT Adjustment Rule — If morning unit PT includes heavy running (>3 miles) or high-rep leg calisthenics, drop 1 working set from lower-body accessory lifts that afternoon and prioritize carbs + electrolytes before lifting. 3) Guardrails — Zero Olympic lifts, burpees, or high-impact jump ropes. 4) Deload Weeks (4, 8, 12) — Cut working sets by 40% (~80% load) and cap Day 6 rucking at 2 miles unweighted. 5) Field Exercise (FTX) / Range Protocol — During multi-day field ops, pause heavy lower-body barbell loading, perform 15–20 mins bodyweight push-ups, pull-ups, and mobility, and resume at previous week\'s weights upon return to garrison.';

  const day3SpeedDay: ProtocolDay = isP1
    ? {
        day: 'Day 3',
        focus: 'Tactical Speed & Bounding Conditioning (Track / Field — Phase 1 Acceleration & Mechanics)',
        warmup: TACTICAL_BB_DIME_WARMUP_TEXT,
        strength: [
          '20m Prone-to-Sprint Starts (6x20m) [Overload: Explosive prone push-off & first 3 steps - Effort: Max Acceleration (RPE 9) - Rest: 90s - 90s walk-back rest between starts]',
          '40m Build-Up Sprints (4x40m) [Overload: Smooth acceleration to 85-90% effort - Effort: Hard (85-90% effort, RPE 8.5) - Rest: 120s - 2 min rest]',
          '40m Backwards Sled Drag Finisher (Casualty-Drag Simulation) (4x40m) [Overload: Add +10 lbs sled when crisp - Effort: Casualty-Drag Simulation (RPE 8.5) - Rest: 60s - 4 rounds of 40m backwards sled drag]'
        ],
        run: 'Rest from distance running',
        pace: 'N/A',
        progressionRule: 'Phase 1 Acceleration & Mechanics: 6×20m prone-to-sprint starts (90s rest) + 4×40m build-up sprints at 85–90% (2 min rest) + 4×40m backwards sled drag finisher (60s rest).'
      }
    : isP2
    ? {
        day: 'Day 3',
        focus: 'Tactical Speed & Bounding Conditioning (Track / Field — Phase 2 Agility & Top-End Velocity)',
        warmup: TACTICAL_BB_DIME_WARMUP_TEXT,
        strength: [
          'Pro Agility Shuttle (5-10-5m) (6x5-10-5m) [Overload: Sharp plant & low hip turns - Effort: All-Out Change of Direction (RPE 9) - Rest: 90s]',
          '30m Flying Sprints (15m build-up, 30m max velocity) (5x30m) [Overload: Upright relaxed top-end velocity - Effort: Max Velocity (RPE 9.5) - Rest: 120s - 2 min full rest]',
          'Assault Bike Max Sprint / Easy Spin Finisher (6x15s sprint / 45s spin) [Effort: All-Out 15s / Easy 45s (RPE 9) - Rest: 45s]'
        ],
        run: 'Rest from distance running',
        pace: 'N/A',
        progressionRule: 'Phase 2 Agility & Top-End Velocity: 6× Pro Agility Shuttle (90s rest) + 5×30m flying sprints (2 min rest) + 6 rounds of 15s assault bike max sprint / 45s easy spin.'
      }
    : {
        day: 'Day 3',
        focus: 'Tactical Speed & Bounding Conditioning (Track / Field — Phase 3 Combat Bounding Simulation)',
        warmup: TACTICAL_BB_DIME_WARMUP_TEXT,
        strength: [
          'IMT Bound Series (sprint 15m, drop to prone 2s, pop up, sprint 15m, cut 90 deg, sprint 15m) (4x45m IMT Bound) [Effort: Combat Bounding Simulation (RPE 9.5) - Rest: 150s - 2.5 min full recovery]',
          "50m Heavy Farmer's Walk + 50m Sprint Shuttle (4x50m carry + 50m sprint) [Overload: +5 lbs/hand on farmer walk - Effort: Sprint-Drag-Carry Power (RPE 9) - Rest: 120s - 2 min rest]"
        ],
        run: 'Rest from distance running',
        pace: 'N/A',
        progressionRule: 'Phase 3 Combat Bounding Simulation: 4× IMT Bound Series (15m sprint, 2s prone drop, 15m sprint, 90° cut, 15m sprint — 2.5 min rest) + 4× 50m heavy farmer\'s walk + 50m sprint shuttle (2 min rest).'
      };

  const day6RuckRun = isP1
    ? 'Part A — Aerobic Ruck March (Morning — 45–60 mins): 3–4 miles @ 35 lbs dry weight'
    : isP2
    ? 'Part A — Aerobic Ruck March (Morning — 45–60 mins): 4–5 miles @ 45 lbs dry weight'
    : 'Part A — Aerobic Ruck March (Morning — 45–60 mins): 5–6 miles @ 45–55 lbs dry weight';

  const day6RuckPace = isP1
    ? '15:00/mile pace (Zone 2 HR 130–145 BPM; brisk power-walk, no running)'
    : isP2
    ? '14:30/mile pace on rolling terrain (Zone 2 HR 130–145 BPM; brisk power-walk)'
    : '14:00–14:30/mile pace (Zone 2 HR 130–145 BPM; Week 12 Deload: 2-mile unweighted Zone 2 walk)';

  return {
    id: `tactical_bodybuilding_p${phaseNum}`,
    title: phaseTitle,
    weeks: phaseWeeks,
    desc: phaseDesc,
    coachRule,
    days: [
      {
        day: 'Day 1',
        focus: 'Upper Body — Push & Plate-Carrier Armor',
        warmup: TACTICAL_BB_DIME_WARMUP_TEXT,
        strength: [
          `Incline Barbell or Dumbbell Bench Press (4x${mainReps}) [Overload: Double progression (+5 lbs upper at top reps, 1-2 RIR) - Effort: RPE 8 - Rest: ${compoundRest}s - Builds upper-chest shelf for plate carriers; 2-sec eccentric]`,
          `Standing Barbell or Dumbbell Overhead Press (3x${upperAccReps}) [Overload: +5 lbs on top reps (1-2 RIR) - Effort: RPE 8 - Rest: ${accessoryRest}s - Strict overhead stability and trunk bracing under axial load]`,
          `Weighted Dips or Close-Grip Bench Press (3x${upperAccReps}) [Overload: +5 lbs on top reps (1-2 RIR) - Effort: RPE 8 - Rest: ${accessoryRest}s - Tricep lockout strength for hand-release push-ups and obstacle climbs]`,
          `Explosive Med-Ball Chest Pass (from kneeling) (4x5) [Overload: Max velocity per throw - Effort: Explosive (RPE 8.5) - Rest: 60s - Simulates prone-to-sprint push-off; max velocity per throw (All Phases)]`,
          `Superset: Lateral Raises + Cable Tricep Pushdowns (3x12-15 / 12-15) [Overload: Minimal rest between paired movements; +2.5-5 lbs at 15 reps - Effort: RPE 8.5 - Rest: 60s - Medial delt armor and elbow tendon resilience]`
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: `Primary Press: 4×${mainReps} (+5 lbs upper when hitting top reps w/ 1–2 RIR); OHP & Dips/CGBP: 3×${upperAccReps}. Mandatory 8-Min DIME Warm-Up.`
      },
      {
        day: 'Day 2',
        focus: 'Lower Body — Quad Drive & Ruck Stability',
        warmup: TACTICAL_BB_DIME_WARMUP_TEXT,
        strength: [
          `Trap Bar Deadlift (4x${mainReps}) [Overload: Double progression (+10 lbs lower at top reps, 1-2 RIR) - Effort: RPE 8 - Rest: ${compoundRest}s - Direct ACFT carryover and high-output lower-body force]`,
          `Rear-Foot Elevated Split Squats (Dumbbells) (3x${lowerAccSingleReps}) [Overload: +5-10 lbs DBs when hitting top reps - Effort: RPE 8 - Rest: ${accessoryRest}s - Bulletproofs knees and hips for uneven terrain under a ruck]`,
          `Front Squat or Hack Squat (3x${upperAccReps}) [Overload: +10 lbs at crisp eccentric control - Effort: RPE 8 - Rest: ${accessoryRest}s - Anterior core bracing and quad hypertrophy without spinal shear]`,
          `Seated-to-Box Jump (from 90-degree bench) (4x4) [Overload: Step down and fully reset each rep - Effort: Explosive Power (RPE 8.5) - Rest: 90s - Eliminates stretch reflex; trains explosive get-up from cover (All Phases)]`,
          `Superset: Standing Calf Raises + Weighted Plank (3x12-15 / 45 sec) [Overload: +5-10 lbs on calf raises & weighted plank - Effort: RPE 8.5 - Rest: 60s - Ankle stiffness for rucking + anti-extension trunk endurance]`
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: `Trap Bar Deadlift: 4×${mainReps} (+10 lbs lower at top reps w/ 1–2 RIR); Split Squats ${lowerAccSingleReps}, Front/Hack Squat 3×${upperAccReps}. Unit PT Rule: Drop 1 accessory set if morning PT had >3 mi run.`
      },
      day3SpeedDay,
      {
        day: 'Day 4',
        focus: 'Upper Body — Yoke, Pull & Ruck Posture',
        warmup: TACTICAL_BB_DIME_WARMUP_TEXT,
        strength: [
          `Weighted Pull-Ups (Overhand / Tactical Grip) (4x${mainReps}) [Overload: Double progression (+5 lbs upper at top reps, 1-2 RIR) - Effort: RPE 8 - Rest: ${compoundRest}s - Wall/obstacle climb strength and lats for torso stabilization]`,
          `Chest-Supported T-Bar or Seal Row (4x${upperAccReps}) [Overload: +5 lbs on top reps - Effort: RPE 8 - Rest: ${accessoryRest}s - Zero lower-back fatigue; builds mid-back thickness against kit pull]`,
          `Face Pulls with External Rotation (4x15) [Overload: +5 lbs when external rotation stays crisp - Effort: RPE 8.5 - Rest: 60s - Rotator cuff health for weapon manipulation and overhead carries (All Phases)]`,
          `Heavy Barbell or Trap-Bar Shrugs (3x10-12) [Overload: +5-10 lbs on 12 reps - Effort: RPE 8 - Rest: 60s - Builds upper-trap yoke to protect brachial plexus under heavy rucks (All Phases)]`,
          `Superset: Hammer Curls + Heavy Farmer's Carries (3x10 / 50m) [Overload: +5 lbs at crisp posture - Effort: RPE 8.5 - Rest: 90s - Litter-carry grip stamina; keep ribs stacked over pelvis]`
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: `Weighted Pull-Ups: 4×${mainReps} (+5 lbs upper at top reps); T-Bar/Seal Row: 4×${upperAccReps}; Shrugs + Hammer Curl/50m Farmer Carry superset.`
      },
      {
        day: 'Day 5',
        focus: 'Lower Body — Posterior Chain & Casualty-Drag Power',
        warmup: TACTICAL_BB_DIME_WARMUP_TEXT,
        strength: [
          `Romanian Deadlift (Barbell or Dumbbell) (4x${mainReps}) [Overload: Double progression (+10 lbs lower at top reps, 1-2 RIR) - Effort: RPE 8 - Rest: ${compoundRest}s - Eccentric hamstring resilience to prevent sprint pulls]`,
          `Heavy Reverse Sled Drag + Forward Sled Sprint (4x25m rev + 25m fwd) [Overload: +10 lbs sled when trips stay crisp - Effort: Sprint-Drag-Carry Power (RPE 8.5) - Rest: 90s - Direct Sprint-Drag-Carry metabolic conditioning (All Phases)]`,
          `Lying or Seated Leg Curls (3x${legCurlReps}) [Overload: +5-10 lbs with strict 3-sec eccentric - Effort: RPE 8 - Rest: ${accessoryRest}s - 3-second controlled eccentric; isolate knee flexion]`,
          `Heavy Kettlebell Swings (4x12) [Overload: +5 lbs KB when hip snap is explosive - Effort: Ballistic Hip Extension (RPE 8) - Rest: 60s - Ballistic hip extension for sprinting and obstacle vaulting (All Phases)]`,
          `Superset: Pallof Press + Hanging Knee/Leg Raises (3x10/side / 12) [Overload: +2.5-5 lbs or band tension - Effort: RPE 8.5 - Rest: 60s - Anti-rotation core stability under asymmetric weapon/pack loads]`
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: `RDL: 4×${mainReps} (+10 lbs lower at top reps); Reverse Sled Drag + Sled Sprint: 4×25m+25m (90s rest); Leg Curls: 3×${legCurlReps}. Unit PT Rule: Drop 1 accessory set if morning PT had >3 mi run.`
      },
      {
        day: 'Day 6',
        focus: 'Ruck Conditioning & Arm Hypertrophy ("Ruck + Arm Pump")',
        warmup: TACTICAL_BB_DIME_WARMUP_TEXT,
        strength: [
          'EZ-Bar or Dumbbell Bicep Curls (3x10-12) [Overload: +5 lbs upper at 12 reps - Effort: RPE 8.5 - Rest: 60s - Part B Arm & Rear-Delt Pump (25 mins)]',
          'Overhead Cable Tricep Extension or Skullcrushers (3x10-12) [Overload: +5 lbs upper at 12 reps - Effort: RPE 8.5 - Rest: 60s - Controlled eccentric, full elbow lock]',
          'Superset: Band Pull-Aparts + Dead Hang (Decompression) (3x20 / 45 sec hang) [Effort: RPE 7.5 - Rest: 60s - Decompress spine and restore shoulder posture post-ruck]'
        ],
        run: day6RuckRun,
        pace: day6RuckPace,
        progressionRule: `${day6RuckRun} (${day6RuckPace}) + Part B (25 mins Arm & Rear-Delt Pump + Spinal Decompression Hang).`
      },
      {
        day: 'Day 7',
        focus: 'Complete Rest & Garrison Prep',
        warmup: TACTICAL_BB_DAILY_RECOVERY_DIME_TEXT,
        strength: [
          'Complete Rest & Garrison Prep: Full CNS recovery, foot care, meal prep, and 8+ hours of sleep prioritization.'
        ],
        run: 'Complete Rest',
        pace: 'N/A',
        progressionRule: 'Full CNS recovery, foot care, hydration, and sleep prioritization before starting Day 1 Upper Push.'
      }
    ]
  };
}

export const TACTICAL_BODYBUILDING_PHASES: Record<'tb_phase1' | 'tb_phase2' | 'tb_phase3', ProtocolPhase> = {
  tb_phase1: buildTacticalBodybuildingPhase(1),
  tb_phase2: buildTacticalBodybuildingPhase(2),
  tb_phase3: buildTacticalBodybuildingPhase(3),
};

export const TACTICAL_HYPERTROPHY_BASE_PHASE: ProtocolPhase = TACTICAL_BODYBUILDING_PHASES.tb_phase1;

/**
 * Applies 40% set reduction & ~80% weight deload guidance for Weeks 4, 8, and 12.
 */
function applyDeloadToExerciseString(exerciseStr: string): string {
  const bracketMatch = exerciseStr.match(/\[(.*?)\]/);
  const hint = bracketMatch ? bracketMatch[1] : '';
  const withoutBracket = exerciseStr.replace(/\[.*?\]/g, '').trim();
  const lastOpenParen = withoutBracket.lastIndexOf('(');
  const lastCloseParen = withoutBracket.lastIndexOf(')');

  let updatedCore = withoutBracket;
  if (lastOpenParen > 0 && lastCloseParen === withoutBracket.length - 1) {
    const spec = withoutBracket.slice(lastOpenParen + 1, lastCloseParen).trim();
    const xMatch = spec.match(/^(\d+)\s*[x×]\s*(.+)$/i);
    if (xMatch) {
      const origSets = parseInt(xMatch[1], 10);
      if (origSets >= 2) {
        // 40% reduction (e.g. 4 sets -> 2-3 sets; 3 sets -> 2 sets; 6 rounds -> 3-4 rounds)
        const deloadSets = origSets === 4 ? '2-3' : `${Math.max(2, Math.round(origSets * 0.6))}`;
        updatedCore = `${withoutBracket.slice(0, lastOpenParen)}(${deloadSets}x${xMatch[2]})`;
      }
    }
  }

  const deloadHint = hint
    ? `DELOAD (-40% sets, ~80% weight, crisp bar speed) • ${hint}`
    : 'DELOAD (-40% sets, ~80% weight, crisp bar speed)';
  return `${updatedCore} [${deloadHint}]`;
}

/**
 * Returns customized week data for any week 1 through 12 of the 12-Week Military Tactical Bodybuilding Program.
 * Incorporates Phase 1 (Wks 1–4), Phase 2 (Wks 5–8), Phase 3 (Wks 9–12),
 * Deload Weeks (Weeks 4, 8, 12: -40% working sets, ~80% weight, cap Day 6 ruck at 2 miles unweighted), and Mandated 8-Min DIME Warm-Up.
 */
export function getTacticalHypertrophyWeekData(weekNumber: number): ProtocolPhase {
  const week = Math.max(1, Math.min(12, weekNumber));
  const phaseNum: 1 | 2 | 3 = week <= 4 ? 1 : week <= 8 ? 2 : 3;
  const basePhase = TACTICAL_BODYBUILDING_PHASES[`tb_phase${phaseNum}`];
  const clonedDays = JSON.parse(JSON.stringify(basePhase.days)) as ProtocolDay[];

  const isDeloadWeek = week === 4 || week === 8 || week === 12;
  if (isDeloadWeek) {
    clonedDays.forEach((d) => {
      const isRest = d.focus.toLowerCase().includes('complete rest');
      if (!isRest) {
        d.strength = d.strength.map((s) => applyDeloadToExerciseString(s));
        if (d.day === 'Day 6') {
          d.run = `Part A — Deload Week ${week} Unweighted Walk: 2 miles unweighted Zone 2 walk`;
          d.pace = 'Unweighted brisk walk (Zone 2 HR 130–145 BPM — cap Day 6 rucking at 2 miles unweighted on Deload Weeks)';
        } else if (d.run && !d.run.toLowerCase().includes('rest')) {
          d.run = `${d.run} [Week ${week} Deload: -40% rounds/volume]`;
        }
        d.progressionRule = `DELOAD WEEK ${week}: Reduce working sets by 40% (e.g. 4 sets → 2–3 sets), keep weights at ~80% of prior week's load, and cap Day 6 rucking at 2 miles unweighted. ${d.progressionRule || ''}`;
      }
    });
  }

  const phaseLabel =
    phaseNum === 1 ? 'Phase 1: Armor & Base' : phaseNum === 2 ? 'Phase 2: Power-Building' : 'Phase 3: Peak & Combat Velocity';

  return {
    ...basePhase,
    id: `tactical_bb_week_${week}`,
    title: `12-Week Military Tactical Bodybuilding — Week ${week} (${phaseLabel}${isDeloadWeek ? ' • DELOAD' : ''})`,
    weeks: `Week ${week} of 12 • ${phaseLabel}`,
    days: clonedDays
  };
}

// Add base tactical bodybuilding into PROTOCOL_DATA
PROTOCOL_DATA.tactical_hypertrophy = TACTICAL_HYPERTROPHY_BASE_PHASE;

// ---------------------------------------------------------------------------
// General Military PFT & Selection Readiness (PFT / CFT / PRT) Protocol
// ---------------------------------------------------------------------------
export const UNIVERSAL_PAT_PROTOCOL: ProtocolPhase = {
  id: 'universal_pat',
  title: 'General Military PFT & Selection Readiness Protocol (PFT / CFT / PRT)',
  weeks: 'Weeks 1-8',
  desc: 'Comprehensive 8-week general Armed Forces PFT, CFT, PRT, and selection preparation. Peak 1.5–3 mile running speed, 300m anaerobic shuttle sprint output, unbroken push-up & plank/core density, pull-up volume, and 180 lb casualty drag power.',
  coachRule: 'General PFT Laws: Target +1-2 reps per week on continuous push-ups, pull-ups, and plank/core density. Drop 3-5 seconds off 300m interval repeats. Progressive +10 lbs on Trap Bar Deadlift & Squats. 1.5-Mile threshold goal: sub-10:30 competitive standard.',
  days: [
    {
      day: 'Day 1',
      focus: 'Upper Combat Density: Bench, Pull-Ups & Push-Up Volume',
      warmup: DIME_WARMUP_TEXT,
      strength: [
        'Flat Barbell Bench Press (4x8) [Overload: +5 lbs on 8 reps - Rest: 90s - Retract scapulae, touch lower sternum]',
        'Strict Chest-to-Bar Pull-Ups (4x6-8) [Overload: +2.5 to 5 lbs - Rest: 90s - Full dead hang, clear chin above bar]',
        'Standing Military Overhead Press (3x8) [Overload: +5 lbs on 8 reps - Rest: 90s - Core braced, glutes squeezed]',
        'Incline Dumbbell Bench Press (3x10) [Overload: +5 lbs DBs on 10 reps - Rest: 75s - 30 deg incline, upper chest armor]',
        'Barbell Bent-Over Row (4x8-10) [Overload: +5 lbs on 10 reps - Rest: 75s - Strict 45 deg hinge, pull to navel]',
        'Military Cadence Push-Up Benchmark (3xMax) [Cadence test: 2 sec down, 1 sec up - Rest: 90s - Track unbroken reps]'
      ],
      run: 'Rest from running',
      pace: 'N/A',
      progressionRule: 'Bench & OHP: +5 lbs on 8 reps; Pull-Ups: +2.5-5 lbs; Cadence Push-Ups: +2 reps weekly'
    },
    {
      day: 'Day 2',
      focus: '300-Meter Anaerobic Sprint & Glycolytic Capacity',
      warmup: DIME_WARMUP_TEXT,
      strength: [
        "Heavy Trap Bar Farmer's Walks (4x50m) [Overload: +10 lbs total on 50m - Rest: 90s - Upright posture, maximum grip crush]",
        'Plank Series (Front & Side Planks) (3x60s) [Overload: +15s hold - Rest: 45s - Full body tension]',
        'Hollow Body Holds (3x45s) [Overload: +10s hold - Rest: 45s - Lower back pressed into floor]'
      ],
      run: '4 x 300m Track Intervals (Maximal Combat Sprint Speed)',
      pace: 'Target: 50-58 sec per 300m repeat. 2.5-3 min full walking recovery between rounds.',
      progressionRule: '300m Intervals: Drop 1-2s per repeat; Farmer Walks: +10 lbs total load'
    },
    {
      day: 'Day 3',
      focus: 'Combat Lower Strength & Posterior Armor',
      warmup: DIME_WARMUP_TEXT,
      strength: [
        'Trap Bar Deadlift (4x6) [Overload: +10 lbs on 6 reps - Rest: 120s - Explosive hip extension, neutral spine]',
        'Front Squat (Clean Grip or Cross-Arm) (3x8) [Overload: +10 lbs on 8 reps - Rest: 90s - High elbows, vertical torso]',
        'Romanian Deadlift (RDL) (3x10) [Overload: +10 lbs on 10 reps - Rest: 90s - Deep hamstring hinge stretch]',
        'Walking Dumbbell Lunges (3x12/leg) [Overload: +5 lbs DBs - Rest: 75s - Upright torso, knee taps floor]',
        'Timed Plank / Tuck Core Benchmark (3x60-90s) [Rest: 90s - Strict hollow brace, zero lumbar sag]'
      ],
      run: '20-25 Min Recovery Spin or Jog',
      pace: 'Zone 2 / Conversational recovery (HR under 135 BPM)',
      progressionRule: 'Trap Bar Deadlift & Front Squat: +10 lbs on target reps; Core Plank Hold: +10s weekly'
    },
    {
      day: 'Day 4',
      focus: 'Active Recovery & Tactical Decompression',
      warmup: "Cat-cow transitions (2 min), 90/90 hip flow (3 min), couch stretch (90s/side), diaphragmatic box breathing (4 min).",
      strength: [
        'Passive foam rolling, tissue flossing, ankle dorsiflexion stretches, thoracic foam roll extensions.'
      ],
      run: 'Complete Rest (or Optional 15-min light walk)',
      pace: 'N/A',
      progressionRule: 'Rest, tissue hydration, and joint mobility restoration'
    },
    {
      day: 'Day 5',
      focus: 'Obstacle Negotiation, Casualty Drag & Agility Circuit',
      warmup: DIME_WARMUP_TEXT,
      strength: [
        'Heavy Sled / Casualty Drag Simulation (5x50 yards) [Overload: +10 lbs or faster time - Rest: 90s - Backward drag, low hip stance]',
        'Explosive Box Jumps (4x5) [Overload: +2 inches height - Rest: 60s - 24-30 inch box, land soft, stand tall]',
        'Plyometric Push-Ups (or Deficit Push-Ups) (3x10) [Overload: +2 reps - Rest: 60s - Explosive hands leave ground]',
        'Dumbbell Step-Ups onto 20-inch Box (3x10/leg) [Overload: +5 lbs DBs - Rest: 60s - Simulates barrier clearing drive]',
        "Farmer's Suitcase Carry (Single Arm) (3x40m/side) [Overload: +5 lbs - Rest: 60s - Resists lateral trunk flexion]",
        'Hanging Knee Tucks / Leg Raises (3x12) [Overload: +1 rep - Rest: 45s - Strict pelvic curl, no swinging]'
      ],
      run: '15-20 Min Tactical Flush Run',
      pace: 'Zone 2 (130-145 BPM) easy flush',
      progressionRule: 'Casualty Drag: 5x50y under 25s each; Box Jumps: +2 inches; Step-Ups: +5 lbs'
    },
    {
      day: 'Day 6',
      focus: 'General PFT Run Benchmark & Aerobic Threshold',
      warmup: DIME_WARMUP_TEXT,
      strength: [
        'Post-Run Mandatory Core Bracing (3x15) [Deadbugs, bird-dogs, and side planks for lumbar spine integrity]'
      ],
      run: '1.5-Mile / 3-Mile General PFT Benchmark Run',
      pace: 'Target Pace: 6:30-7:20 min/mile (Sub-10:30 to 11:00 1.5-mi / Sub-21:00 3-mi PFT standard). 800m cool-down jog.',
      progressionRule: 'PFT Benchmark Run: Drop 5-10s off total time bi-weekly; Maintain steady continuous split pacing'
    },
    {
      day: 'Day 7',
      focus: 'Full Rest & Systemic Recovery',
      warmup: "None. Rest and recovery.",
      strength: [
        'Complete physiological reset, systemic recovery, hydration, optimal protein fueling and sleep.'
      ],
      run: 'Complete Rest',
      pace: 'N/A',
      progressionRule: 'Rest, 8+ hours sleep, optimal protein & micronutrient intake'
    }
  ]
};

// Add General Military PFT into PROTOCOL_DATA
PROTOCOL_DATA.universal_pat = UNIVERSAL_PAT_PROTOCOL;

/**
 * Returns customized week data for any week 1 through 8 of the General Military PFT & Selection Protocol.
 * Dynamically injects progressive 300m sprint repeats, casualty drag conditioning, and PFT test milestones.
 */
export function getUniversalPatWeekData(weekNumber: number): ProtocolPhase {
  const week = Math.max(1, Math.min(8, weekNumber));
  const clonedDays = JSON.parse(JSON.stringify(UNIVERSAL_PAT_PROTOCOL.days)) as ProtocolDay[];

  if (week === 1) {
    clonedDays[1].run = '4 x 300m Track Intervals (Maximal Combat Speed)';
    clonedDays[1].pace = 'Target: 52-58 sec per 300m repeat. 2.5-3 min full walking recovery between rounds.';
    clonedDays[1].progressionRule = 'Week 1 Benchmark: Establish baseline 300m sprint turnover.';
    clonedDays[5].run = '1.5-Mile / 3-Mile General PFT Benchmark Run';
    clonedDays[5].pace = 'Target: 6:45-7:30 min/mile (Sub-11:15 1.5-mi / Sub-22:00 3-mi benchmark). 800m cool-down jog.';
    clonedDays[5].progressionRule = 'Week 1 Diagnostic: Establish baseline general PFT readiness time.';
  } else if (week === 2) {
    clonedDays[1].run = '4 x 300m Track Intervals (Lactate Tolerance)';
    clonedDays[1].pace = 'Target: 51-56 sec per 300m repeat. 2.5 min recovery.';
    clonedDays[1].progressionRule = '300m Repeats: Drop 1-2s from Week 1 baseline.';
    clonedDays[5].run = '1.5-Mile Aerobic Threshold Pace Run';
    clonedDays[5].pace = 'Target: 6:40-7:20 min/mile (Negative split last 800m).';
    clonedDays[5].progressionRule = 'Pacing Discipline: Run second half 5-10s faster than first half.';
  } else if (week === 3) {
    clonedDays[1].run = '5 x 300m Track Intervals (Volume Overload)';
    clonedDays[1].pace = 'Target: 50-54 sec per 300m repeat. 2.5 min walking recovery.';
    clonedDays[1].progressionRule = '+1 Repeat added. Maintain sub-54s speed across all 5 intervals.';
    clonedDays[5].run = '2.5-Mile Over-Distance Capacity Run';
    clonedDays[5].pace = 'Target: 6:50-7:15 min/mile. Build aerobic stamina across PFT distance.';
    clonedDays[5].progressionRule = 'Over-distance: Build aerobic stamina across test distance.';
  } else if (week === 4) {
    clonedDays[1].run = '3 x 300m Technical Strides (Deload Flush)';
    clonedDays[1].pace = 'Smooth 75-80% mechanics. 3 min full recovery. Restore CNS.';
    clonedDays[1].progressionRule = 'Deload: Focus on sprint mechanics, posture, and arm drive.';
    clonedDays[5].run = '1.25-Mile Light Flush Jog (Deload)';
    clonedDays[5].pace = 'Conversational Zone 2 pace (125-135 BPM). Joint & nervous system recovery.';
    clonedDays[5].progressionRule = 'Deload Flush: Complete tissue restoration before Phase 2 intensity.';
  } else if (week === 5) {
    clonedDays[1].run = '5 x 300m Track Intervals (Max Combat Drive)';
    clonedDays[1].pace = 'Target: 48-52 sec per 300m repeat. 2 min walking recovery.';
    clonedDays[1].progressionRule = 'Speed Surge: Drop interval recovery to 2 mins while holding sub-52s.';
    clonedDays[5].run = '1.5-Mile Speed Endurance Run';
    clonedDays[5].pace = 'Target: 6:35-7:10 min/mile (Sub-11:00 standard). Fast cadence focus.';
    clonedDays[5].progressionRule = 'Target: Break the 11:00 barrier for 1.5 miles.';
  } else if (week === 6) {
    clonedDays[1].run = '6 x 300m Track Intervals (Peak Anaerobic Output)';
    clonedDays[1].pace = 'Target: 47-50 sec per 300m repeat. 2 min recovery.';
    clonedDays[1].progressionRule = 'Max Repeat Volume: 6 high-intensity reps under 50s.';
    clonedDays[5].run = '1.5-Mile / 3-Mile PFT Passing Threshold Push';
    clonedDays[5].pace = 'Target: 6:30-7:00 min/mile (Sub-10:45 1.5-mi / Sub-21:00 3-mi standard).';
    clonedDays[5].progressionRule = 'Passing Standard: Target top-tier service branch distinction mark.';
  } else if (week === 7) {
    clonedDays[1].run = '4 x 300m Test-Simulation Intervals';
    clonedDays[1].pace = 'Target: 46-49 sec per 300m. Exact PFT test pacing.';
    clonedDays[1].progressionRule = 'Test Simulation: Rehearse exact start-line cadence and turn mechanics.';
    clonedDays[5].run = 'Full General PFT Mock Assessment Run';
    clonedDays[5].pace = 'Maximal continuous effort. Goal: Official PFT / CFT / PRT distinction time.';
    clonedDays[5].progressionRule = 'Mock Test: Official simulation of physical readiness standards.';
  } else {
    clonedDays[1].run = '3 x 300m High-Speed Openers (Taper)';
    clonedDays[1].pace = 'Target: 45-48s. Explosive turnover with 4 min full recovery.';
    clonedDays[1].progressionRule = 'Taper Openers: Prime nervous system without accumulating fatigue.';
    clonedDays[5].run = 'OFFICIAL GENERAL PFT BENCHMARK ASSESSMENT';
    clonedDays[5].pace = 'Maximum competitive effort. Sub-10:30 1.5-mi / Sub-20:30 3-mi distinction standard.';
    clonedDays[5].progressionRule = 'Official PFT Assessment: Record best passing score for record / selection.';
  }

  const isDeload = week === 4;
  const isPeak = week === 8;

  return {
    ...UNIVERSAL_PAT_PROTOCOL,
    id: `universal_pat_week_${week}`,
    title: `General PFT & Selection Protocol — Week ${week}${isDeload ? ' (DELOAD)' : isPeak ? ' (PEAK ASSESSMENT)' : ''}`,
    weeks: `Week ${week} of 8`,
    days: clonedDays
  };
}

// ---------------------------------------------------------------------------
// Army Fitness Test (AFT) 8-Week Specific Training Program
// A Focused 8-Week Peaking Plan for All Five AFT Events & 2-Mile Run Endurance
// ---------------------------------------------------------------------------
export const AFT_DIME_WARMUP_TEXT =
  'MANDATORY 10-MINUTE DIME WARM-UP (Do Before Every Workout — Never do long static stretches before lifting, sprinting, or testing): ' +
  '1. Bodyweight Squats (10 reps) • 2. Squat Jumps (8 reps) • 3. Forward Lunges (8 reps/leg) • ' +
  '4. Side Plank (20 sec/side) • 5. Push-Ups (10 reps) • 6. Single-Leg Reach (6 reps/leg) • ' +
  '7. Side Hop to Balance (6 hops/side) • 8. Ice Skaters Lateral (8/side) • 9. "L" Hops Forward/Side (5 hops/leg). ' +
  'Cool-Down (5–10 Mins): Finish every session with easy walking and 20–30 second static stretches for calves, hamstrings, hip flexors, and chest.';

export const AFT_COACH_RULE =
  'AFT 4-Step Progression & Safety Rules: ' +
  '1. Reps First (Double Progression): Keep the same weight until you hit the top rep number on every set with strict form (add 1–2 reps/set from Week 1 to Week 2 of each block). ' +
  '2. Weight Second (Load Progression): Once hitting top reps on all sets with 1–2 RIR, add 2.5–5 lbs upper-body and 5–10 lbs deadlifts/squats in the next block (never jump >5% at once). ' +
  '3. Sets Third (Volume & Taper): Start each 2-week block at the lower set number in the first week and add 1 set in the second week if recovery is strong. In Week 8 (Test Week), cut all strength sets and running miles in half. ' +
  '4. Running & SDC Pacing: Run track intervals 5–10s faster per 400m than goal 2-mile pace; increase easy run distance by 0.5 miles every 2 weeks; shave 3–5s off each 250m SDC simulation across Weeks 5–7. ' +
  'Spine & Joint Safety: Hinge at the hips with a flat, 360-degree braced back on every deadlift and squat. Avoid straight-leg sit-ups and standing trunk twists—build core stiffness with planks, curl-ups, and heavy carries.';

export const AFT_PROTOCOL_BLOCKS: Record<'aft_block1' | 'aft_block2' | 'aft_block3' | 'aft_week7' | 'aft_week8', ProtocolPhase> = {
  aft_block1: {
    id: 'aft_block1',
    title: 'AFT 8-Week Program — Block 1: Event Technique, Base Strength & Aerobic Foundation',
    weeks: 'Weeks 1–2',
    desc: 'Goal: Dial in crisp trap-bar deadlift hip-hinge form, strict Hand-Release Push-Up rhythm, efficient SDC footwork, and 4 weekly aerobic runs.',
    coachRule: AFT_COACH_RULE,
    days: [
      {
        day: 'Day 1',
        focus: 'Deadlift Strength + Easy Base Run (Lower + Run)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'Trap-Bar Deadlift (reset every rep on the floor) (3-4x6-8) [Moderate (70–75% Max) - Rest: 120s - Reset every rep on the floor; flat 360-degree braced back]',
          'Barbell Back Squat or Goblet Squat (to parallel) (3x8-10) [Moderate (RPE 7–8) - Rest: 90s - Controlled descent to parallel]',
          'Reverse Lunges (3x8/leg) [Light Dumbbells - Rest: 60s - Controlled knee tracking and hip stability]',
          'Superset: Forearm Plank (60–75 sec) + Glute Bridges (15 reps) (3x60-75s / 15 reps) [Bodyweight - Rest: 60s - Core trunk stiffness + glute lockout]'
        ],
        run: 'Post-Lift Aerobic Run: 2 miles',
        pace: 'Easy Conversational Pace (Builds 3-Rep Max Deadlift pulling force, leg drive, and a 2-mile aerobic recovery run)',
        progressionRule: 'Wk 1→2: Start at 3 sets & 6 reps; add 1–2 reps per set and +1 set in Week 2 if recovery is strong'
      },
      {
        day: 'Day 2',
        focus: 'Track Speed-Endurance Intervals (Track Repeats)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          '400m Track Intervals (at goal 2-mile race pace) (6x400m) [Hard (80% effort) - Rest: 90s walk - Run 5–10 seconds faster per 400m than your goal 2-mile pace]'
        ],
        run: '6 x 400m Track Intervals (at goal 2-mile race pace)',
        pace: 'Hard (80% effort) • 90 sec walk rest between repeats (Lowers 2-Mile Run time and improves lactate clearance)',
        progressionRule: 'Run track intervals 5–10 seconds faster per 400m than your goal 2-mile pace'
      },
      {
        day: 'Day 3',
        focus: 'Hand-Release Push-Ups & Core Plank (HRP & Core)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'Hand-Release Push-Ups (30-sec timed sets) (4xMax in 30s) [Bodyweight (strict form) - Rest: 90s - Max clean reps in 30s; builds 2-minute HRP stamina]',
          'Dumbbell or Barbell Bench Press (3-4x8-10) [Moderate (RPE 7–8) - Rest: 90s - Upper-body pressing power]',
          'Pull-Ups (or Band-Assisted Pull-Ups) (3-4x6-8) [Bodyweight - Rest: 90s - Full dead hang to chin over bar]',
          'Superset: Chest-Supported Row (10–12 reps) + Face Pulls (10–12 reps) (3x10-12) [Moderate / Light - Rest: 60s - Scapular stability & upper back balance]',
          'Superset: McGill Curl-Up (10 reps) + Side Plank (30s/side) (3x10 + 30s/side) [Bodyweight - Rest: 45s - Spine-safe core endurance]'
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: 'HRP: Strict hand-release rhythm in 30s windows; Bench/Pull-Ups: +1–2 reps in Week 2'
      },
      {
        day: 'Day 4',
        focus: 'Steady Aerobic Base Run & Mobility (Aerobic Run)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          '10-Min Hip Mobility & Post-Run Stretching (1x10 mins) [Hip flexors, calves, hamstrings, and thoracic spine mobility]'
        ],
        run: 'Steady Zone 2 Run + 10-Min Hip Mobility: 3 miles',
        pace: 'Easy Conversational Pace (3–4 mile conversational Zone 2 run to build cardiovascular foundation)',
        progressionRule: 'Maintain comfortable conversational Zone 2 breathing throughout all 3 miles'
      },
      {
        day: 'Day 5',
        focus: 'Sprint-Drag-Carry (SDC) & Explosive Power (SDC Drills)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'Two-Arm Kettlebell Swings (explosive hip snap) (4x15) [Moderate KB - Rest: 60s - Explosive hip hinge snap]',
          'Backward Sled Drag (low hips, quick steps) (4x25m out / 25m back) [90 lb Sled (AFT weight) - Rest: 90s - Stay low in hips with quick, choppy backward steps]',
          'Lateral Shuffle (stay low, touch line, reverse) (4x25m out / 25m back) [Bodyweight (fast feet) - Rest: 60s - Stay low, touch line cleanly, reverse direction fast]',
          "40-lb Kettlebell Farmer's Carry (4x50m) [Two 40-lb KBs/DBs - Rest: 60s - Braced trunk, fast controlled footwork]"
        ],
        run: 'SDC Event Footwork & Sled/Carry Drills (Included in session)',
        pace: 'Crisp AFT event technique on 90-lb backward sled drags, lateral shuffles, and 40-lb KB carries',
        progressionRule: 'Master efficient turnaround mechanics and low hip position on 90-lb sled drags'
      },
      {
        day: 'Day 6',
        focus: 'Long Aerobic Run (or Light Ruck) (Long Run)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'Post-Run Cool-Down Walk & Static Stretches (1x10 mins) [20–30 second static stretches for calves, hamstrings, hip flexors, and chest]'
        ],
        run: 'Long Steady Aerobic Run: 3.5 miles',
        pace: 'Easy Conversational Pace (3.5–4.5 mile steady aerobic run so a 2-mile test effort feels controlled)',
        progressionRule: 'Increase easy run distance by 0.5 miles every 2 weeks (3.5 miles in Weeks 1–2 → 4.0 miles in Weeks 3–6)'
      },
      {
        day: 'Day 7',
        focus: 'Complete Rest',
        warmup: 'None. Full physical and nervous system recovery.',
        strength: [
          'Complete physical and nervous system recovery. Eat 0.75–1.0g protein/lb, hydrate steadily, and aim for 7–9 hours of sleep.'
        ],
        run: 'Complete Rest',
        pace: 'N/A',
        progressionRule: 'Full physical and nervous system recovery'
      }
    ]
  },

  aft_block2: {
    id: 'aft_block2',
    title: 'AFT 8-Week Program — Block 2: Heavy Strength & Threshold Running',
    weeks: 'Weeks 3–4',
    desc: 'Goal: Increase trap-bar deadlift intensity to 80–85% max, extend plank holds past 2 minutes, and sharpen 2-mile race stamina with 800m intervals and 3.5–4 mile runs.',
    coachRule: AFT_COACH_RULE,
    days: [
      {
        day: 'Day 1',
        focus: 'Heavy Deadlift Strength + Easy Base Run (Lower + Run)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'Trap-Bar Deadlift (explode upward, control down) (4-5x4-5) [Heavy (80–85% Max) - Rest: 180s - Explode upward, control down with 360-deg braced back]',
          'Barbell Back Squat (parallel depth) (3-4x6) [Challenging (75–80%) - Rest: 150s - 2–3 min rest; full parallel depth]',
          'Bulgarian Split Squat (rear foot elevated) (3x8/leg) [Moderate Dumbbells - Rest: 90s - Unilateral quad & glute drive]',
          'Forearm Plank (target 2:00–2:30 holds) (3x120-150s) [Bodyweight - Rest: 90s - Extend plank holds past 2 minutes]'
        ],
        run: 'Post-Lift Aerobic Run: 2 miles',
        pace: 'Easy Recovery Pace (2-mile aerobic flush after heavy 80–85% deadlifts & squats)',
        progressionRule: 'Add +5–10 lbs to Trap-Bar Deadlift & Squat from Block 1; extend Forearm Plank holds to 2:00–2:30'
      },
      {
        day: 'Day 2',
        focus: '800m Track Speed-Endurance Repeats (800m Repeats)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          '800m Track Repeats (at target 2-mile test pace) (4-5x800m) [Hard (85% effort) - Rest: 120s walk - Run at target 2-mile test pace]'
        ],
        run: '4–5 x 800m Track Repeats (at target 2-mile test pace)',
        pace: 'Hard (85% effort) • 2 min walk rest between repeats (Sharpens 2-mile race stamina)',
        progressionRule: 'Week 3: 4x800m • Week 4: 5x800m at exact target 2-mile test pace'
      },
      {
        day: 'Day 3',
        focus: 'Hand-Release Push-Ups & Heavy Upper Strength (HRP & Upper)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'Hand-Release Push-Ups (45-sec timed sets) (4xMax in 45s) [Bodyweight (steady pace) - Rest: 90s - Max clean reps in 45s]',
          'Barbell Bench Press (1-second pause on chest) (4x5-6) [Heavy (80% Max) - Rest: 150s - 1-second pause on chest; 2–3 min rest]',
          'Weighted or Strict Pull-Ups (4x6-8) [BW or +10–20 lbs - Rest: 120s - Full range pulling strength]',
          'Superset: Standing Barbell Overhead Press (6–8 reps) + Band Pull-Aparts (15 reps) (3x6-8 + 15) [Moderate-Heavy - Rest: 90s - Overhead lockout + rear delt stability]',
          'Pallof Press (Anti-Rotation) (3x12/side) [Moderate Band/Cable - Rest: 60s - Core anti-rotation stiffness]'
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: 'Extend HRP work window to 45s sets; add +2.5–5 lbs to Bench Press & Overhead Press'
      },
      {
        day: 'Day 4',
        focus: 'Sustained Tempo Run (Tempo Run)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'Post-Run Cool-Down & Static Stretches (1x10 mins) [Easy walking + 20–30s static stretches for calves, hamstrings, hip flexors, and chest]'
        ],
        run: 'Sustained Tempo Run (fast, controlled aerobic effort): 3 miles',
        pace: 'Threshold (75–80% HRR) — Fast, controlled aerobic effort',
        progressionRule: 'Hold steady lactate threshold pace across all 3 miles without slowing in Mile 3'
      },
      {
        day: 'Day 5',
        focus: 'Sprint-Drag-Carry (SDC) Combos & Grip Stamina (SDC Combos)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          '50m Sprint + 50m Backward 90-lb Sled Drag (4x100m continuous) [Hard (85–90% effort) - Rest: 120s - 100m continuous combo; 2 min rest]',
          '50m Lateral Shuffle + 50m 40-lb KB Carry (4x100m continuous) [Hard (85–90% effort) - Rest: 120s - 100m continuous combo; 2 min rest]',
          'Barbell Deadlift Grip Holds (overhand grip) (3x30-40s) [65% Deadlift Max - Rest: 90s - Double-overhand grip endurance for MDL & KB carry]'
        ],
        run: 'SDC 100m Continuous Combination Drills (Included in session)',
        pace: 'Hard (85–90% effort) with 2 min rest between 100m combination bouts',
        progressionRule: 'Eliminate transition hesitation between sprint/drag and shuffle/carry'
      },
      {
        day: 'Day 6',
        focus: 'Long Steady Aerobic Run (Long Run)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'Post-Run Cool-Down Walk & Static Stretches (1x10 mins) [20–30 second static stretches for calves, hamstrings, hip flexors, and chest]'
        ],
        run: 'Long Steady Aerobic Run: 4 miles',
        pace: 'Easy Zone 2 Pace (+0.5 miles progression from Weeks 1–2)',
        progressionRule: 'Complete 4.0 continuous miles at relaxed conversational Zone 2 effort'
      },
      {
        day: 'Day 7',
        focus: 'Complete Rest',
        warmup: 'None. Full physical and nervous system recovery.',
        strength: [
          'Complete physical and nervous system recovery. Prioritize 0.75–1.0g protein/lb, complex carbs, hydration, and 7–9 hours sleep.'
        ],
        run: 'Complete Rest',
        pace: 'N/A',
        progressionRule: 'Full physical and nervous system recovery'
      }
    ]
  },

  aft_block3: {
    id: 'aft_block3',
    title: 'AFT 8-Week Program — Block 3: Peak 3RM Deadlift & Full 250m SDC Conditioning',
    weeks: 'Weeks 5–6',
    desc: 'Goal: Peak your 3-rep trap-bar deadlift (88–93% max), build 1-minute HRP output, and run full 250m Sprint-Drag-Carry simulations.',
    coachRule: AFT_COACH_RULE,
    days: [
      {
        day: 'Day 1',
        focus: 'Peak 3RM Trap-Bar Deadlift & Explosive Lower (3RM Peak)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'Box Jumps (step down; land softly) (4x4) [Max Jump Height - Rest: 120s - Step down every rep; land softly to prime CNS]',
          'Trap-Bar Deadlift (practice AFT 3RM sets) (5x3) [Heavy (88–93% Max) - Rest: 240s - 3–5 min rest; practice official AFT 3RM sets]',
          'Barbell Back Squat (explode up fast) (3x4) [Heavy (80–85% Max) - Rest: 180s - Explode up fast out of parallel]',
          'Weighted Forearm Plank (10–25 lb plate on back) (3x75-90s) [Weighted (10–25 lb plate) - Rest: 90s - High-tension core armor]'
        ],
        run: 'Rest from running (Focus on maximal 3RM neural output)',
        pace: 'N/A',
        progressionRule: 'Peak 3RM Trap-Bar Deadlift at 88–93% max across 5 sets of 3 reps with full 3–5 min rest'
      },
      {
        day: 'Day 2',
        focus: '1,000m Race-Pace Track Repeats (Race Pace)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          '1,000m Track Repeats (at target 2-mile race pace) (3-4x1000m) [Hard (85–90% effort) - Rest: 120s walk - Run at target 2-mile race pace + 1-mile easy cooldown jog]'
        ],
        run: '3–4 x 1,000m Track Repeats (at target 2-mile race pace) + 1-Mile Easy Cooldown Jog',
        pace: 'Hard (85–90% effort) • 2 min walk rest between repeats + 1 mile Easy Pace cooldown',
        progressionRule: 'Lock in exact 2-mile goal pace across 1,000m repeats (3 repeats Wk 5 → 4 repeats Wk 6)'
      },
      {
        day: 'Day 3',
        focus: '60-Sec HRP Output & Heavy Upper Superset (HRP & Core)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'Weighted or Band-Resisted Push-Ups (3x8-10) [20 lb Vest or Band - Rest: 90s - Potentiate pressing force before timed HRP sets]',
          'Hand-Release Push-Ups (60-sec timed sets) (3xMax in 60s) [Bodyweight (fast rhythm) - Rest: 150s - Max reps in 60 sec; 2–3 min rest]',
          'Superset: Barbell Bench Press (5 reps) + Weighted Pull-Ups (5 reps) (3x5) [Heavy (80–85% Max) - Rest: 150s - 5 reps each; 2–3 min rest]',
          'Forearm Plank (aim for 3:00–3:40+ hold) (2xMax clean hold) [Bodyweight - Rest: 180s - Aim for 3:00–3:40+ max clean hold (100-pt AFT standard)]'
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: 'Build 60-second unbroken HRP output and push Forearm Plank hold to 3:00–3:40+'
      },
      {
        day: 'Day 4',
        focus: 'Steady Zone 2 Aerobic Run (Aerobic Run)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'Post-Run Cool-Down & Static Stretches (1x10 mins) [Easy walking and 20–30s static stretches for calves, hamstrings, hip flexors, and chest]'
        ],
        run: 'Steady Zone 2 Aerobic Run: 3.5 miles',
        pace: 'Easy Conversational Pace (+0.5 miles progression from Weeks 1–4)',
        progressionRule: 'Flush lower-body soreness and build aerobic recovery capacity'
      },
      {
        day: 'Day 5',
        focus: 'Full 250m Sprint-Drag-Carry Simulation & Trap-Bar Jumps (Full SDC)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'Full 250m Sprint-Drag-Carry Simulation: 50m Sprint → 50m 90-lb Sled Drag → 50m Lateral Shuffle → 50m 40-lb KB Carry → 50m Sprint (3x250m full event) [All-Out Race Effort - Rest: 270s - 4–5 min full rest between simulations]',
          'Trap-Bar Jumps (jump explosively) (3x3) [Light (20% Squat Max) - Rest: 120s - Explosive triple extension]'
        ],
        run: '3 x Full 250m Sprint-Drag-Carry (SDC) Event Simulations (All-Out Race Effort)',
        pace: 'Target: Passing ≤2:10 • Strong (80–90+ Pts) ≤1:45 • Max/Elite (100 Pts) ≤1:29 (4–5 min full rest)',
        progressionRule: 'Shave 3–5 seconds off each 250m SDC simulation across Weeks 5–7'
      },
      {
        day: 'Day 6',
        focus: 'Long Steady Aerobic Run (Long Run)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'Post-Run Cool-Down Walk & Static Stretches (1x10 mins) [20–30 second static stretches for calves, hamstrings, hip flexors, and chest]'
        ],
        run: 'Long Steady Aerobic Run: 4 miles',
        pace: 'Steady Zone 2 Pace',
        progressionRule: 'Maintain effortless aerobic rhythm across 4 miles so the 2-mile AFT run feels controlled'
      },
      {
        day: 'Day 7',
        focus: 'Complete Rest',
        warmup: 'None. Full physical and nervous system recovery.',
        strength: [
          'Complete physical and nervous system recovery.'
        ],
        run: 'Complete Rest',
        pace: 'N/A',
        progressionRule: 'Full physical and nervous system recovery'
      }
    ]
  },

  aft_week7: {
    id: 'aft_week7',
    title: 'AFT 8-Week Program — Week 7: AFT Event Simulation & Dress Rehearsal',
    weeks: 'Week 7 of 8 (Dress Rehearsal)',
    desc: 'Week 7 (Dress Rehearsal): Practice back-to-back AFT event pacing early in the week, rehearse the AFT Finisher Combo on tired legs, then begin taper.',
    coachRule: AFT_COACH_RULE,
    days: [
      {
        day: 'Day 1',
        focus: 'Dress Rehearsal: Deadlift (3×3 @ 85%) + Back Squat (2×4 @ 75%) + 1.5-Mile Easy Run',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'Trap-Bar Deadlift (3x3) [85% Max - Rest: 180s - Crisp speed; leave 2 reps in reserve]',
          'Barbell Back Squat (2x4) [75% Max - Rest: 150s - Crisp speed; leave 2 reps in reserve]'
        ],
        run: '1.5-Mile Easy Run (Post-Lift Dress Rehearsal)',
        pace: 'Easy conversational pace (Crisp bar speed on lifts; leave 2 reps in reserve)',
        progressionRule: 'Leave 2 reps in reserve on every set; focus on crisp bar speed'
      },
      {
        day: 'Day 2',
        focus: '400m Pace Repeats (at Exact 2-Mile Goal Pace) + 1-Mile Cooldown',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          '400m Pace Repeats (at exact 2-mile goal pace) (4x400m) [Exact 2-mile goal pace - Rest: 90s - Smooth, controlled rhythm + 1-Mile Easy Cooldown]'
        ],
        run: '4 x 400m Pace Repeats (at exact 2-mile goal pace) + 1-Mile Easy Cooldown',
        pace: 'Smooth, controlled rhythm at exact 2-mile goal pace (90s rest)',
        progressionRule: 'Dial in exact 400m lap split pacing for next week’s record 2-Mile Run'
      },
      {
        day: 'Day 3',
        focus: '2-Min HRP Test (1×Max) + Pull-Ups (3×6) + Forearm Plank (1×3:00)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          '2-Min Hand-Release Push-Up (HRP) Dress Rehearsal (1xMax in 2:00) [Bodyweight - Rest: 180s - Practice steady HRP breathing across full 2-minute test window]',
          'Pull-Ups (3x6) [Bodyweight - Rest: 120s - Crisp, controlled reps]',
          'Forearm Plank Dress Rehearsal (1x180s) [Bodyweight - Rest: 120s - 1×3:00 hold]'
        ],
        run: 'Rest from running',
        pace: 'N/A',
        progressionRule: 'Practice steady HRP breathing and pacing across the full 2-minute clock'
      },
      {
        day: 'Day 4',
        focus: 'Steady Zone 2 Aerobic Run + 10-Min Mobility',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          '10-Min Hip & Thoracic Mobility (1x10 mins) [Easy decompression and static stretching]'
        ],
        run: 'Steady Zone 2 Aerobic Run + 10-Min Mobility: 2.5 miles',
        pace: 'Easy conversational pace',
        progressionRule: 'Keep effort light and restorative ahead of Day 5 AFT Finisher Combo'
      },
      {
        day: 'Day 5',
        focus: 'AFT Finisher Combo: 250m SDC → 2:30 Plank → 2-Mile Run at Goal Pace',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'AFT Finisher Combo — Part 1: 1×250m Sprint-Drag-Carry (SDC) (1x250m) [95% effort - Rest: 300s - Rest 5 min before Plank]',
          'AFT Finisher Combo — Part 2: 1×2:30 Forearm Plank (1x150s) [Bodyweight - Rest: 300s - Rest 5 min before 2-Mile Run]'
        ],
        run: 'AFT Finisher Combo — Part 3: 2-Mile Run at Goal Pace (after 250m SDC & 2:30 Plank)',
        pace: 'Official 2-Mile Goal Pace — Rehearse pacing on tired legs',
        progressionRule: 'Full back-to-back AFT event rehearsal: 250m SDC (95%) → 5m rest → 2:30 Plank → 5m rest → 2-Mile Run at goal pace'
      },
      {
        day: 'Day 6',
        focus: 'Begin Taper: Active Recovery & Mobility Flush',
        warmup: 'Easy walking and 10-minute gentle hip/ankle/shoulder mobility.',
        strength: [
          'Complete Rest & Taper Initiation: Light walking and 20–30s static stretches for calves, hamstrings, hip flexors, and chest.'
        ],
        run: 'Complete Rest (Taper begins for Week 8 Record Test)',
        pace: 'N/A',
        progressionRule: 'Begin shedding cumulative fatigue for Week 8 Record Test'
      },
      {
        day: 'Day 7',
        focus: 'Complete Rest',
        warmup: 'None. Full physical and nervous system recovery.',
        strength: [
          'Complete physical and nervous system recovery.'
        ],
        run: 'Complete Rest',
        pace: 'N/A',
        progressionRule: 'Full physical and nervous system recovery'
      }
    ]
  },

  aft_week8: {
    id: 'aft_week8',
    title: 'AFT 8-Week Program — Week 8: Taper & Official AFT Record Test',
    weeks: 'Week 8 of 8 (Taper & Test Week)',
    desc: 'Week 8 (Taper & Test): Cut lifting volume and running miles by 50% early in the week, take 2 full days off to rest and hydrate, and execute your official AFT on Day 6.',
    coachRule: AFT_COACH_RULE,
    days: [
      {
        day: 'Day 1',
        focus: 'Taper Strength: Trap-Bar Deadlift (3×2 @ 80%) + HRP (2×15) + Plank (2×60s)',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'Trap-Bar Deadlift (Taper) (3x2) [80% Max - Rest: 180s - Low volume; fast, snappy reps; zero soreness]',
          'Hand-Release Push-Ups (Taper) (2x15) [Bodyweight - Rest: 90s - Fast, snappy reps; zero soreness]',
          'Forearm Plank (Taper) (2x60s) [Bodyweight - Rest: 60s - Crisp trunk activation; zero fatigue]'
        ],
        run: 'Rest from running (Volume cut 50% for Test Week)',
        pace: 'N/A',
        progressionRule: 'Low volume: Fast, snappy reps with zero soreness'
      },
      {
        day: 'Day 2',
        focus: 'Taper Recovery & Hydration',
        warmup: 'None. Light walking and mobility only.',
        strength: [
          'Complete Rest & CNS Recovery: Hydrate steadily all day and sleep 8+ hours.'
        ],
        run: 'Complete Rest',
        pace: 'N/A',
        progressionRule: 'Rest and glycogen restoration'
      },
      {
        day: 'Day 3',
        focus: 'Taper Primer: DIME Warm-Up + 4×100m Strides (80% Speed) + 1.5-Mile Easy Jog',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          '4×100m Strides (80% speed) (4x100m) [80% speed - Rest: 90s - Keep legs fresh and elastic (20 mins total session)]'
        ],
        run: '1.5-Mile Easy Jog + 4×100m Strides (80% speed)',
        pace: 'Easy elastic pace (20 mins total — keep legs fresh and elastic)',
        progressionRule: '20 mins total session; keep legs fresh and elastic for Test Day'
      },
      {
        day: 'Day 4',
        focus: 'Complete Rest & Hydration (Pre-Test Rest Day 1)',
        warmup: 'None. No heavy lifting or hard running.',
        strength: [
          'Complete Rest & Hydration: No heavy lifting or hard running. Hydrate with electrolytes and sleep 8+ hours.'
        ],
        run: 'Complete Rest',
        pace: 'N/A',
        progressionRule: 'No heavy lifting or hard running; sleep 8+ hours'
      },
      {
        day: 'Day 5',
        focus: 'Complete Rest, Electrolytes & Light Carb-Load (Pre-Test Rest Day 2)',
        warmup: 'None. No heavy lifting or hard running.',
        strength: [
          'Complete Rest & Hydration: Carb-load lightly, hydrate with electrolytes, and sleep 8+ hours.'
        ],
        run: 'Complete Rest',
        pace: 'N/A',
        progressionRule: 'Carb-load lightly, hydrate with electrolytes, and sleep 8+ hours'
      },
      {
        day: 'Day 6',
        focus: 'OFFICIAL AFT RECORD TEST: All 5 Events in Sequence',
        warmup: AFT_DIME_WARMUP_TEXT,
        strength: [
          'AFT Event 1: 3-Repetition Maximum Deadlift (MDL) (1x3RM) [Official Record Test - Passing: 180–200 lbs • Strong (80–90+ Pts): 260–300 lbs • Max (100 Pts): 340 lbs (2.0–2.5× BW)]',
          'AFT Event 2: Hand-Release Push-Ups (HRP — 2 Min) (1xMax in 2:00) [Official Record Test - Passing: 25–30 reps • Strong (80–90+ Pts): 42–50 reps • Max (100 Pts): 57–60+ reps]',
          'AFT Event 3: 250m Sprint-Drag-Carry (SDC) (1x250m) [Official Record Test - 50m Sprint → 50m 90-lb Sled Drag → 50m Lateral Shuffle → 50m 40-lb KB Carry → 50m Sprint • Passing: ≤2:10 • Strong: ≤1:45 • Max: ≤1:29]',
          'AFT Event 4: Forearm Plank (PLK) (1xMax Hold) [Official Record Test - Passing: 2:00 • Strong (80–90+ Pts): 2:50–3:15 • Max (100 Pts): 3:40+]'
        ],
        run: 'AFT Event 5: Official 2-Mile Run (2MR)',
        pace: 'Execute with confidence • Passing Baseline: ≤18:00 • Strong Target (80–90+ Pts): ≤15:00 • Max/Elite Target (100 Pts): ≤13:22',
        progressionRule: 'OFFICIAL AFT RECORD TEST: DIME Warm-Up → 3RM Deadlift → 2-Min HRP → 250m SDC → Plank → 2-Mile Run'
      },
      {
        day: 'Day 7',
        focus: 'Post-Test Complete Rest & Recovery',
        warmup: 'None. Full physical and nervous system recovery.',
        strength: [
          'Complete physical and nervous system recovery. Celebrate your AFT execution, refuel, and rehydrate.'
        ],
        run: 'Complete Rest',
        pace: 'N/A',
        progressionRule: 'Full post-test recovery'
      }
    ]
  }
};

export const AFT_BASE_PROTOCOL: ProtocolPhase = AFT_PROTOCOL_BLOCKS.aft_block1;
PROTOCOL_DATA.aft_protocol = AFT_BASE_PROTOCOL;

/**
 * Returns customized week data for any week 1 through 8 of the Army Fitness Test (AFT) 8-Week Training Program.
 */
export function getAftWeekData(weekNumber: number): ProtocolPhase {
  const week = Math.max(1, Math.min(8, weekNumber));
  const baseBlock =
    week <= 2
      ? AFT_PROTOCOL_BLOCKS.aft_block1
      : week <= 4
      ? AFT_PROTOCOL_BLOCKS.aft_block2
      : week <= 6
      ? AFT_PROTOCOL_BLOCKS.aft_block3
      : week === 7
      ? AFT_PROTOCOL_BLOCKS.aft_week7
      : AFT_PROTOCOL_BLOCKS.aft_week8;

  const clonedDays = JSON.parse(JSON.stringify(baseBlock.days)) as ProtocolDay[];
  const blockLabel =
    week <= 2
      ? 'Block 1 (Wks 1–2): Event Technique, Base Strength & Aerobic Foundation'
      : week <= 4
      ? 'Block 2 (Wks 3–4): Heavy Strength & Threshold Running'
      : week <= 6
      ? 'Block 3 (Wks 5–6): Peak 3RM Deadlift & Full 250m SDC'
      : week === 7
      ? 'Block 4 (Wk 7): AFT Event Simulation & Dress Rehearsal'
      : 'Block 4 (Wk 8): Taper & Official AFT Record Test';

  return {
    ...baseBlock,
    id: `aft_protocol_week_${week}`,
    title: `Army Fitness Test (AFT) 8-Week Program — Week ${week} (${blockLabel})`,
    weeks: `Week ${week} of 8 • ${blockLabel}`,
    days: clonedDays,
  };
}




