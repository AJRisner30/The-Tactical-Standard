import { QuestionnaireAnswers, ProgramKey } from '../types';

export interface AbilityBenchmarkOption<T> {
  id: T;
  label: string;
  sublabel: string;
  score: number;
}

export const PAT_PREPARATION_OPTIONS = [
  {
    id: 'yes_upcoming_pat' as const,
    label: 'YES — Preparing for Military PT Test (ACFT / PFT / CFT) or Selection',
    badge: 'Triggers Universal Military PT Protocol',
    description: 'Directly triggers and enrolls you in the Universal Military PT & Selection Readiness Protocol (2-mile / 1.5-mile run, 300m–400m sprint shuttle, push-ups/HRP, 180 lb casualty drag, and obstacle conditioning).',
  },
  {
    id: 'no_general_tactical' as const,
    label: 'NO — General Combat Readiness, Strength Armor & Hypertrophy',
    badge: 'Comprehensive Military Track',
    description: 'Customized based on your lifting experience, equipment access, and primary military performance goals.',
  },
];

export const PUSH_UP_OPTIONS: AbilityBenchmarkOption<QuestionnaireAnswers['pushUpScore']>[] = [
  {
    id: 'under_15',
    label: 'Under 15 Reps',
    sublabel: 'Building foundational pushing mechanics and joint stability',
    score: 1,
  },
  {
    id: '15_to_30',
    label: '15 – 30 Reps',
    sublabel: 'Solid base; working toward Armed Forces operational PT standards',
    score: 2,
  },
  {
    id: '30_to_50',
    label: '30 – 50 Reps',
    sublabel: 'Meets and exceeds most Military PT passing & competitive benchmarks',
    score: 3,
  },
  {
    id: 'over_50',
    label: '50+ Reps Unbroken',
    sublabel: 'High-density tactical stamina and upper-body combat endurance',
    score: 4,
  },
];

export const PULL_UP_OPTIONS: AbilityBenchmarkOption<QuestionnaireAnswers['pullUpScore']>[] = [
  {
    id: 'zero',
    label: '0 Strict Reps',
    sublabel: 'Requires eccentric hangs, lat pull-downs, and inverted rows',
    score: 1,
  },
  {
    id: '1_to_5',
    label: '1 – 5 Strict Reps',
    sublabel: 'Developing relative bodyweight strength and scapular retraction',
    score: 2,
  },
  {
    id: '6_to_12',
    label: '6 – 12 Strict Reps',
    sublabel: 'Strong tactical pulling strength for obstacle clearance and rope climbs',
    score: 3,
  },
  {
    id: 'over_12',
    label: '12+ Strict Reps',
    sublabel: 'Special Operations chassis power; ready for weighted pull-up progressions',
    score: 4,
  },
];

export const AEROBIC_OPTIONS: AbilityBenchmarkOption<QuestionnaireAnswers['aerobicScore']>[] = [
  {
    id: 'under_1_mile',
    label: 'Cannot run 1 continuous mile',
    sublabel: 'Aerobic base building needed; walk/jog and Zone 2 heart rate protocols',
    score: 1,
  },
  {
    id: '13_to_16_min',
    label: '1.5–2.0 Miles in Passing Entry Range (8:30–10:30/mi)',
    sublabel: 'Entry military PT passing range; needs aerobic threshold expansion',
    score: 2,
  },
  {
    id: '10_30_to_13_min',
    label: '1.5 Mi 10:30–13:00 / 2.0 Mi 14:00–17:00',
    sublabel: 'Capable combat operational pace and sustainable aerobic threshold',
    score: 3,
  },
  {
    id: 'sub_10_30',
    label: '1.5 Mi Sub-10:30 / 2.0 Mi Sub-14:00 (Elite)',
    sublabel: 'Selection-grade endurance, superior VO2 max and rapid pulse recovery',
    score: 4,
  },
];

export const EQUIPMENT_OPTIONS = [
  {
    id: 'bodyweight_dumbbells' as const,
    label: 'Dumbbells & Calisthenics Only',
    sublabel: 'Barracks floor, austere FOB, home gym, or minimal equipment (dumbbells, bench, pull-up bar)',
  },
  {
    id: 'full_tactical_gym' as const,
    label: 'Full Commercial / Military Base Gym',
    sublabel: 'Olympic barbells, squat racks, trap bars, dumbbells, turf, sleds, and cardio equipment',
  },
  {
    id: 'basic_station_gym' as const,
    label: 'Basic Unit / Company Gym',
    sublabel: 'Moderate dumbbells, cable stack, pull-up bar, and standard treadmill',
  },
];

export const EXPERIENCE_OPTIONS = [
  {
    id: 'beginner' as const,
    label: 'Beginner (< 6 months)',
    sublabel: 'New to progressive overload and periodized structured lifting',
  },
  {
    id: 'intermediate' as const,
    label: 'Intermediate (6 mos – 2 yrs)',
    sublabel: 'Familiar with core compound lifts (squat, bench, deadlift, overhead press)',
  },
  {
    id: 'advanced_tactical' as const,
    label: 'Advanced / Combat Veteran (2+ yrs)',
    sublabel: 'Consistent training history; seeking peak combat conditioning and load density',
  },
];

export const GOAL_OPTIONS = [
  {
    id: 'tactical_duty_readiness' as const,
    label: 'Combat Readiness & Tactical Agility',
    badge: 'Military Agility & Combat Sprints',
    description: 'Specialized for service members needing high-speed bounding sprints, combat chassis armor, and fatigue resistance during extended field operations.',
    preferredProgram: 'apex_protocol' as ProgramKey,
  },
  {
    id: 'muscle_armor_hypertrophy' as const,
    label: '12-Week Military Tactical Bodybuilding Program',
    badge: 'Warfighter Strength, Hypertrophy & Field Readiness',
    description: '12-week 7-Day Garrison Cycle periodization (Armor & Base → Power-Building → Peak & Combat Velocity) with daily 8-min DIME warm-ups, Unit PT Adjustment Rule, FTX Protocol, Deload Weeks 4/8/12, and Zero Olympic/Burpee/Jump-Rope guardrails.',
    preferredProgram: 'tactical_hypertrophy' as ProgramKey,
  },
  {
    id: 'complete_apex_peak' as const,
    label: 'Military 52-Week Fitness & Readiness Program',
    badge: 'Comprehensive 4-Quarter Annual Engine',
    description: 'Year-round military periodization taking you from Aerobic Base & Movement Foundation through Running Stamina & Base Strength, Peak Strength & Sprint Speed, and Combat Readiness & Annual Peak.',
    preferredProgram: 'apex_protocol' as ProgramKey,
  },
  {
    id: 'hybrid_strength_running' as const,
    label: 'Hybrid Barbell Strength & Running Engine',
    badge: 'Strength + 2-Mi/5K/10K Expansion',
    description: 'Classic dual-engine military development: build maximum barbell squat/bench/deadlift power while progressing running mileage and VO2 max.',
    preferredProgram: 'hybrid_protocol' as ProgramKey,
  },
  {
    id: 'aft_specific_testing' as const,
    label: 'Army Fitness Test (AFT) 8-Week Specific Program',
    badge: '5-Event AFT Peak (MDL • HRP • SDC • PLK • 2MR)',
    description: 'Dedicated 8-week progression for the 5-event Army Fitness Test: 3RM Deadlift (MDL), 2-Min Hand-Release Push-Ups (HRP), 250m Sprint-Drag-Carry (SDC), Forearm Plank (PLK), and 2-Mile Run (2MR).',
    preferredProgram: 'aft_protocol' as ProgramKey,
  },
  {
    id: 'universal_pat_testing' as const,
    label: 'General Military PFT & Selection Readiness (PFT / CFT / PRT)',
    badge: 'General Armed Forces PFT & Selection Standard',
    description: 'General military physical fitness test & selection course preparation: 1.5–3 mile benchmark runs, 300m–400m anaerobic shuttles, cadence push-ups, pull-ups, and 180 lb casualty drags.',
    preferredProgram: 'universal_pat' as ProgramKey,
  },
  {
    id: 'station_db_minimal' as const,
    label: "12-Week Military Express 30-Minute Dumbbell Program (Coach AJ's Preferred)",
    badge: "Coach AJ's Personal Preferred • Busy Schedule 30m DB",
    description: "Coach AJ Risner's personal preferred program for a busy schedule: build strength, lean muscle, and running/rucking endurance in strictly 30 minutes a day (6m Express DIME + 20m Work + 4m Cool-Down) using only dumbbells, a bench, and a pull-up bar.",
    preferredProgram: 'hybrid_db' as ProgramKey,
  },
  {
    id: 'custom_ai_individualized' as const,
    label: 'Custom Individualized Protocol (AI Program Adapter)',
    badge: '100% Bespoke • AI Tailored',
    description: 'Have our AI Adaptation Engine tailor any master training protocol to your exact deployment schedule, equipment access, and specific joint/injury constraints.',
    preferredProgram: 'custom_ai' as ProgramKey,
  },
];

export interface RecommendationResult {
  programKey: ProgramKey;
  programTitle: string;
  badge: string;
  durationText: string;
  weeklySplit: string;
  fitnessTier: 'Recruit Foundation' | 'Operational Service Member' | 'Special Operations Tier';
  startingWeek: number;
  startingPhaseTitle: string;
  primaryRationale: string;
  keyActionPoints: string[];
  equipmentNotice?: string;
}

/**
 * Calculates service member fitness tier and determines the exact recommended program
 * matching their physical ability, equipment constraints, and primary goals.
 */
export function calculateProgramRecommendation(
  answers: Omit<QuestionnaireAnswers, 'completedAt' | 'recommendedProgramKey' | 'recommendedProgramTitle' | 'recommendationReason' | 'recommendedStartingWeek' | 'fitnessTier'>
): RecommendationResult {
  const pushScore = PUSH_UP_OPTIONS.find((o) => o.id === answers.pushUpScore)?.score || 2;
  const pullScore = PULL_UP_OPTIONS.find((o) => o.id === answers.pullUpScore)?.score || 2;
  const runScore = AEROBIC_OPTIONS.find((o) => o.id === answers.aerobicScore)?.score || 2;
  const totalScore = pushScore + pullScore + runScore;

  let fitnessTier: 'Recruit Foundation' | 'Operational Service Member' | 'Special Operations Tier';
  if (totalScore <= 5 || answers.liftingExperience === 'beginner') {
    fitnessTier = 'Recruit Foundation';
  } else if (totalScore <= 9) {
    fitnessTier = 'Operational Service Member';
  } else {
    fitnessTier = 'Special Operations Tier';
  }

  if (answers.primaryGoalCategory === 'custom_ai_individualized') {
    return {
      programKey: 'custom_ai',
      programTitle: 'Individualized AI Military Tactical Protocol',
      badge: 'AI Architect Bespoke System',
      durationText: 'Bespoke Custom AI Schedule',
      weeklySplit: `${answers.weeklyDays} Days Custom Tailored Split`,
      fitnessTier,
      startingWeek: 1,
      startingPhaseTitle: 'Bespoke Phase: Personalized Progression',
      primaryRationale:
        'Matched to your preference for 100% individualized military programming. Our AI Workout Architect will generate a bespoke schedule taking your baseline capacity, operational tempo, and injury constraints directly into account.',
      keyActionPoints: [
        'Custom exercise selections built around your joint limitations.',
        'Linear progression pacing calibrated to your weekly field and garrison hours.',
        'Dynamic tactical conditioning matched to your operational demands.',
      ],
      equipmentNotice: answers.equipmentAccess === 'bodyweight_dumbbells'
        ? 'Engineered exclusively for dumbbells and bodyweight calisthenics.'
        : 'Engineered for your full base gym access.',
    };
  }

  if (answers.primaryGoalCategory === 'aft_specific_testing') {
    return {
      programKey: 'aft_protocol',
      programTitle: 'Army Fitness Test (AFT) 8-Week Specific Training Program',
      badge: 'Official 5-Event AFT Peak',
      durationText: '8-Week Periodized AFT Progression (4 Two-Week Blocks)',
      weeklySplit: '6 Days Event-Specific Strength, SDC & Run Intervals + Day 7 Rest',
      fitnessTier,
      startingWeek: 1,
      startingPhaseTitle: 'Weeks 1–2: Event Technique, Base Strength & Aerobic Foundation',
      primaryRationale:
        'Selected directly by your goal: maximizing your official 5-event Army Fitness Test (AFT) score. Progresses across 4 two-week blocks to peak your 3RM Deadlift, 2-Min Hand-Release Push-Ups, 250m Sprint-Drag-Carry, Forearm Plank, and 2-Mile Run simultaneously without CNS burnout.',
      keyActionPoints: [
        'Day 1 & Day 5 build 3RM Deadlift (MDL) and HRP stamina while protecting lower-back fatigue before runs.',
        'Day 3 replicates the exact 250m Sprint-Drag-Carry (SDC) legs so your legs adapt to heavy lactic clearance.',
        'Week 7 Dress Rehearsal and Week 8 50% Taper guarantee peak freshness for your official Day 6 AFT Record Test.',
      ],
      equipmentNotice: 'Hex/Trap Bar, 90-lb Sled, Pair of 40-lb Kettlebells, and 400m Running Track recommended (Injury-Only Adaptation active).',
    };
  }

  if (answers.preparingForPat === 'yes_upcoming_pat' || answers.primaryGoalCategory === 'universal_pat_testing') {
    return {
      programKey: 'universal_pat',
      programTitle: 'General Military PFT & Selection Readiness (PFT / CFT / PRT)',
      badge: 'General Armed Forces PFT & Selection Standard',
      durationText: '8-Week High-Stakes Military PFT & Speed Prep',
      weeklySplit: '5 Days Strength & Combat Conditioning + 1-2 Days 1.5–3 Mi & 300m Shuttles',
      fitnessTier,
      startingWeek: 1,
      startingPhaseTitle: 'Weeks 1-8: Foundational Conditioning & PFT Benchmark Capacity',
      primaryRationale:
        'Selected directly by your answer: actively preparing for an upcoming general Military PFT (PFT / CFT / PRT) or selection course. Engineered specifically to excel in general Armed Forces physical evaluations: 1.5–3 mile run, 300m–400m anaerobic shuttle sprints, cadence push-ups, pull-ups, plank/core endurance, and 180 lb casualty drag power.',
      keyActionPoints: [
        'Cadence push-ups & strict pull-up progressions build unbreakable upper-body stamina under fatigue.',
        'Weekly 300m anaerobic sprint intervals build high-intensity lactate threshold.',
        'Heavy casualty drags, sled pulls, and farmer carries guarantee maximum grip and posterior drive.',
      ],
      equipmentNotice: 'Barbell, trap bar, pull-up bar, sled/turf, and running track recommended.',
    };
  }

  if (answers.equipmentAccess === 'bodyweight_dumbbells' || answers.primaryGoalCategory === 'station_db_minimal') {
    return {
      programKey: 'hybrid_db',
      programTitle: "12-Week Military Express 30-Minute Dumbbell Program (Coach AJ's Preferred)",
      badge: "Coach AJ's Personal Preferred • 30-Min Busy Schedule DB",
      durationText: '12-Week Express Periodized Program (3 Phases • 30 Mins/Day)',
      weeklySplit: '6 Days / Week: 3 DB Antagonist Superset Days + 3 Cardio/Ruck Days + Day 7 Rest',
      fitnessTier,
      startingWeek: 1,
      startingPhaseTitle: 'Phase 1 (Weeks 1–4): Foundation Strength, Muscle & Cardio Base',
      primaryRationale:
        "Coach AJ Risner's personal preferred training program for a busy schedule. Engineered to build serious tactical strength, lean muscle, and aerobic/anaerobic endurance in strictly 30 minutes a day using only dumbbells, a bench, and a pull-up bar (Minutes 0:00–6:00 Express DIME Warm-Up → Minutes 6:00–26:00 Main Work Block → Minutes 26:00–30:00 Express Cool-Down).",
      keyActionPoints: [
        'Double Progression: Add 1–2 reps per set each week until hitting top of rep range, then add +5 lbs/hand (or 3s lowering / 1s pause if heavier DBs are unavailable).',
        '3 Days Dumbbell Antagonist Supersets + 3 Days Running/Incline Rucking (400m/800m/Hill Sprints, 2.5–3 Mi Zone 2/Tempo, 20m Weighted Incline Ruck).',
        'Every 4th Week (Weeks 4, 8, and 12) cuts sets by 40%–50% to prevent burnout and peak your 2-Mile Run, Goblet Squat, DB Bench, Pull-Ups, and Plank.',
      ],
      equipmentNotice: 'Requires only Dumbbells, a Bench, and a Pull-Up Bar (Barracks / Home / Deployment Tent).',
    };
  }

  if (answers.primaryGoalCategory === 'muscle_armor_hypertrophy') {
    const startWeek = 1;
    return {
      programKey: 'tactical_hypertrophy',
      programTitle: '12-Week Military Tactical Bodybuilding Program',
      badge: '3-Phase Armor, Power & Combat Velocity System',
      durationText: '12-Week 3-Phase Tactical Mesocycle',
      weeklySplit: '7-Day Garrison Cycle: 4 Lift + Day 3 Speed/Bounding + Day 6 Ruck & Arm Pump + Day 7 Rest',
      fitnessTier,
      startingWeek: startWeek,
      startingPhaseTitle: 'Phase 1 (Weeks 1–4): Armor & Base (8–10 Main • 10–12 Acc • 3–4 Mi Ruck)',
      primaryRationale:
        'Selected for building dense tactical muscle armor, ruck stability, and IMT bounding velocity without Olympic lifts, burpees, or high-impact jump ropes. Progresses linearly from Armor & Base (Weeks 1–4) into Power-Building (Weeks 5–8) and Peak & Combat Velocity (Weeks 9–12) with built-in Unit PT and FTX/Range protocols.',
      keyActionPoints: [
        'Mandatory 8-Minute DIME Warm-Up before every single session.',
        'Double Progression: +5 lbs upper / +10 lbs lower once hitting top reps with 1–2 RIR; Deloads at Weeks 4, 8, and 12 (-40% sets, 2-mi unweighted walk).',
        'Unit PT & FTX Rules: Drop 1 lower accessory set after heavy (>3 mi) morning unit PT runs; pause barbell loading during multi-day field exercises.',
      ],
    };
  }

  if (answers.primaryGoalCategory === 'hybrid_strength_running') {
    return {
      programKey: 'hybrid_protocol',
      programTitle: 'The Tactical Standard 12-Week Hybrid Protocol',
      badge: 'Barbell Strength & Running Engine',
      durationText: '12-Week Master (3 Progressive Phases)',
      weeklySplit: '4 Days Barbell Strength + 2-3 Days Aerobic Run',
      fitnessTier,
      startingWeek: 1,
      startingPhaseTitle: 'Phase 1: Foundation (Aerobic Base & Volume)',
      primaryRationale:
        'Ideal for service members seeking equal mastery of heavy barbell strength and sustained running performance. Follows structured linear progression for squat/bench/deadlift paired with progressive weekly mileage expansion.',
      keyActionPoints: [
        'Build raw barbell power with heavy compound sets.',
        'Zone 2 conversational base running develops high cardiac stroke volume.',
        'Threshold runs expand your sustained top speed and stamina under fatigue.',
      ],
    };
  }

  const startingWeek = 1;
  const startingPhase = 'Quarter 1: Aerobic Base & Movement Foundation (Weeks 1–13)';

  return {
    programKey: 'apex_protocol',
    programTitle: 'Military 52-Week Fitness & Readiness Program',
    badge: '52-Week Armed Forces Performance System',
    durationText: '52-Week 4-Quarter Periodized Protocol',
    weeklySplit: '7-Day Cycle: 3 Strength Days + 3–4 Runs/Progressive Rucks + Day 7 Rest',
    fitnessTier,
    startingWeek,
    startingPhaseTitle: startingPhase,
    primaryRationale:
      'The complete 52-week military fitness and readiness blueprint. Engineered across 4 progressive 13-week quarters to build your aerobic base, barbell strength, sprint speed, ruck stamina, and combat readiness with every-4th-week 40% deloads.',
    keyActionPoints: [
      'Mandatory 10-Minute DIME Warm-Up before every session to protect hips, knees, shoulders, and lower back.',
      'Starts at the low end of prescribed set and rep ranges (1. Reps First -> 2. Weight Second -> 3. Sets Third).',
      'Intra-session Set 1 auto-pacing automatically recommends weights for all subsequent sets to maintain target effort.',
    ],
  };
}

/**
 * Returns user-friendly summary of the questionnaire results
 */
export function formatQuestionnaireSummary(answers: QuestionnaireAnswers): string {
  const pushLabel = PUSH_UP_OPTIONS.find((o) => o.id === answers.pushUpScore)?.label || answers.pushUpScore;
  const pullLabel = PULL_UP_OPTIONS.find((o) => o.id === answers.pullUpScore)?.label || answers.pullUpScore;
  const runLabel = AEROBIC_OPTIONS.find((o) => o.id === answers.aerobicScore)?.label || answers.aerobicScore;

  return `Push-ups: ${pushLabel} • Pull-ups: ${pullLabel} • Run: ${runLabel} • Tier: ${answers.fitnessTier}`;
}
