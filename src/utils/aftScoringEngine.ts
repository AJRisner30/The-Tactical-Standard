import { AftAgeBracket, PtEventScoreRecord } from '../types';

/**
 * Official 5-Event Army Fitness Test (AFT — Effective June 2025, 500-Point Max)
 * Events:
 *   1. MDL — 3-Repetition Maximum Deadlift (lbs)
 *   2. HRP — Hand-Release Push-Up (reps in 2 min)
 *   3. SDC — 250m Sprint-Drag-Carry (seconds, lower is better)
 *   4. PLK — Forearm Plank (seconds, higher is better)
 *   5. 2MR — Two-Mile Run (seconds, lower is better)
 *
 * Passing rules:
 *   - Minimum 60 points on EVERY event (failing any single event fails the test)
 *   - Combat MOS Standard: Sex-neutral (male/combat table), >= 350 total points
 *   - General MOS Standard: Sex- & age-normed table, >= 300 total points
 */

export const AFT_AGE_BRACKETS: AftAgeBracket[] = [
  '17-21',
  '22-26',
  '27-31',
  '32-36',
  '37-41',
  '42-46',
  '47-51',
  '52-56',
  '57-61',
  '62+',
];

interface EventAnchor {
  // [min60, combat70, strong85, max100]
  // For higher-is-better (MDL, HRP, PLK): ascending values
  // For lower-is-better (SDC, 2MR): descending values (in seconds)
  p60: number;
  p70: number;
  p85: number;
  p100: number;
}

interface BracketAnchors {
  mdl: EventAnchor;
  hrp: EventAnchor;
  sdc: EventAnchor; // seconds
  plk: EventAnchor; // seconds
  twoMile: EventAnchor; // seconds
}

// Sex-Neutral Combat / Male General AFT anchors (age-normed, aligned to 2025 AFT 500-pt scale)
const COMBAT_MALE_ANCHORS: Record<AftAgeBracket, BracketAnchors> = {
  '17-21': {
    mdl: { p60: 150, p70: 200, p85: 280, p100: 350 },
    hrp: { p60: 15, p70: 27, p85: 44, p100: 61 },
    sdc: { p60: 148, p70: 130, p85: 108, p100: 89 }, // 2:28 -> 1:29
    plk: { p60: 90, p70: 120, p85: 170, p100: 220 }, // 1:30 -> 3:40
    twoMile: { p60: 1170, p70: 1040, p85: 905, p100: 802 }, // 19:30 -> 13:22
  },
  '22-26': {
    mdl: { p60: 150, p70: 200, p85: 280, p100: 350 },
    hrp: { p60: 14, p70: 26, p85: 43, p100: 61 },
    sdc: { p60: 151, p70: 132, p85: 110, p100: 90 }, // 2:31 -> 1:30
    plk: { p60: 85, p70: 115, p85: 165, p100: 215 }, // 1:25 -> 3:35
    twoMile: { p60: 1185, p70: 1055, p85: 915, p100: 805 }, // 19:45 -> 13:25
  },
  '27-31': {
    mdl: { p60: 150, p70: 200, p85: 280, p100: 350 },
    hrp: { p60: 14, p70: 25, p85: 42, p100: 59 },
    sdc: { p60: 154, p70: 135, p85: 112, p100: 92 },
    plk: { p60: 85, p70: 115, p85: 165, p100: 215 },
    twoMile: { p60: 1200, p70: 1070, p85: 930, p100: 815 }, // 20:00 -> 13:35
  },
  '32-36': {
    mdl: { p60: 140, p70: 190, p85: 270, p100: 340 },
    hrp: { p60: 13, p70: 24, p85: 40, p100: 57 },
    sdc: { p60: 158, p70: 138, p85: 115, p100: 95 },
    plk: { p60: 80, p70: 110, p85: 160, p100: 210 },
    twoMile: { p60: 1220, p70: 1090, p85: 945, p100: 830 },
  },
  '37-41': {
    mdl: { p60: 140, p70: 190, p85: 260, p100: 330 },
    hrp: { p60: 12, p70: 22, p85: 38, p100: 54 },
    sdc: { p60: 163, p70: 143, p85: 119, p100: 99 },
    plk: { p60: 80, p70: 110, p85: 158, p100: 205 },
    twoMile: { p60: 1245, p70: 1110, p85: 965, p100: 845 },
  },
  '42-46': {
    mdl: { p60: 140, p70: 180, p85: 250, p100: 320 },
    hrp: { p60: 11, p70: 20, p85: 35, p100: 50 },
    sdc: { p60: 168, p70: 148, p85: 124, p100: 104 },
    plk: { p60: 75, p70: 105, p85: 155, p100: 200 },
    twoMile: { p60: 1275, p70: 1140, p85: 990, p100: 870 },
  },
  '47-51': {
    mdl: { p60: 130, p70: 170, p85: 240, p100: 300 },
    hrp: { p60: 10, p70: 18, p85: 32, p100: 46 },
    sdc: { p60: 175, p70: 155, p85: 130, p100: 110 },
    plk: { p60: 75, p70: 100, p85: 150, p100: 195 },
    twoMile: { p60: 1305, p70: 1170, p85: 1020, p100: 900 },
  },
  '52-56': {
    mdl: { p60: 130, p70: 165, p85: 225, p100: 280 },
    hrp: { p60: 10, p70: 16, p85: 29, p100: 42 },
    sdc: { p60: 185, p70: 164, p85: 138, p100: 117 },
    plk: { p60: 70, p70: 95, p85: 145, p100: 190 },
    twoMile: { p60: 1340, p70: 1205, p85: 1055, p100: 930 },
  },
  '57-61': {
    mdl: { p60: 120, p70: 155, p85: 210, p100: 260 },
    hrp: { p60: 10, p70: 15, p85: 26, p100: 38 },
    sdc: { p60: 195, p70: 173, p85: 146, p100: 124 },
    plk: { p60: 70, p70: 90, p85: 140, p100: 185 },
    twoMile: { p60: 1380, p70: 1245, p85: 1095, p100: 970 },
  },
  '62+': {
    mdl: { p60: 120, p70: 145, p85: 195, p100: 240 },
    hrp: { p60: 10, p70: 14, p85: 24, p100: 34 },
    sdc: { p60: 205, p70: 182, p85: 154, p100: 132 },
    plk: { p60: 65, p70: 85, p85: 130, p100: 180 },
    twoMile: { p60: 1425, p70: 1290, p85: 1140, p100: 1015 },
  },
};

// Female General Standard AFT anchors (age-normed, sex-specific for General MOS only)
const FEMALE_GENERAL_ANCHORS: Record<AftAgeBracket, BracketAnchors> = {
  '17-21': {
    mdl: { p60: 120, p70: 150, p85: 190, p100: 230 },
    hrp: { p60: 10, p70: 19, p85: 33, p100: 48 },
    sdc: { p60: 185, p70: 160, p85: 135, p100: 115 },
    plk: { p60: 90, p70: 120, p85: 170, p100: 220 },
    twoMile: { p60: 1315, p70: 1175, p85: 1030, p100: 920 },
  },
  '22-26': {
    mdl: { p60: 120, p70: 150, p85: 190, p100: 230 },
    hrp: { p60: 10, p70: 18, p85: 32, p100: 46 },
    sdc: { p60: 188, p70: 164, p85: 138, p100: 118 },
    plk: { p60: 85, p70: 115, p85: 165, p100: 215 },
    twoMile: { p60: 1330, p70: 1190, p85: 1045, p100: 930 },
  },
  '27-31': {
    mdl: { p60: 120, p70: 145, p85: 185, p100: 220 },
    hrp: { p60: 10, p70: 17, p85: 30, p100: 44 },
    sdc: { p60: 192, p70: 168, p85: 142, p100: 121 },
    plk: { p60: 85, p70: 115, p85: 165, p100: 215 },
    twoMile: { p60: 1345, p70: 1205, p85: 1060, p100: 945 },
  },
  '32-36': {
    mdl: { p60: 120, p70: 140, p85: 180, p100: 215 },
    hrp: { p60: 10, p70: 16, p85: 28, p100: 42 },
    sdc: { p60: 197, p70: 173, p85: 146, p100: 125 },
    plk: { p60: 80, p70: 110, p85: 160, p100: 210 },
    twoMile: { p60: 1370, p70: 1230, p85: 1085, p100: 965 },
  },
  '37-41': {
    mdl: { p60: 120, p70: 140, p85: 175, p100: 210 },
    hrp: { p60: 10, p70: 15, p85: 27, p100: 40 },
    sdc: { p60: 204, p70: 179, p85: 152, p100: 130 },
    plk: { p60: 80, p70: 110, p85: 158, p100: 205 },
    twoMile: { p60: 1395, p70: 1255, p85: 1110, p100: 990 },
  },
  '42-46': {
    mdl: { p60: 120, p70: 135, p85: 170, p100: 200 },
    hrp: { p60: 10, p70: 14, p85: 25, p100: 38 },
    sdc: { p60: 212, p70: 186, p85: 158, p100: 136 },
    plk: { p60: 75, p70: 105, p85: 155, p100: 200 },
    twoMile: { p60: 1425, p70: 1285, p85: 1140, p100: 1020 },
  },
  '47-51': {
    mdl: { p60: 120, p70: 135, p85: 165, p100: 195 },
    hrp: { p60: 10, p70: 13, p85: 23, p100: 35 },
    sdc: { p60: 222, p70: 195, p85: 166, p100: 143 },
    plk: { p60: 75, p70: 100, p85: 150, p100: 195 },
    twoMile: { p60: 1455, p70: 1315, p85: 1170, p100: 1050 },
  },
  '52-56': {
    mdl: { p60: 120, p70: 130, p85: 160, p100: 185 },
    hrp: { p60: 10, p70: 12, p85: 21, p100: 32 },
    sdc: { p60: 234, p70: 206, p85: 176, p100: 152 },
    plk: { p60: 70, p70: 95, p85: 145, p100: 190 },
    twoMile: { p60: 1490, p70: 1350, p85: 1205, p100: 1085 },
  },
  '57-61': {
    mdl: { p60: 120, p70: 130, p85: 155, p100: 180 },
    hrp: { p60: 10, p70: 12, p85: 19, p100: 29 },
    sdc: { p60: 246, p70: 217, p85: 186, p100: 160 },
    plk: { p60: 70, p70: 90, p85: 140, p100: 185 },
    twoMile: { p60: 1530, p70: 1390, p85: 1245, p100: 1125 },
  },
  '62+': {
    mdl: { p60: 120, p70: 125, p85: 150, p100: 175 },
    hrp: { p60: 10, p70: 11, p85: 17, p100: 26 },
    sdc: { p60: 258, p70: 228, p85: 196, p100: 170 },
    plk: { p60: 65, p70: 85, p85: 130, p100: 180 },
    twoMile: { p60: 1575, p70: 1435, p85: 1290, p100: 1170 },
  },
};

export function parseClockToSeconds(clock: string): number {
  const cleaned = (clock || '').trim();
  if (!cleaned) return 0;
  if (/^\d+$/.test(cleaned)) {
    return parseInt(cleaned, 10);
  }
  const parts = cleaned.split(':').map((p) => parseInt(p, 10));
  if (parts.some((n) => isNaN(n) || n < 0)) return 0;
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

export function formatSecondsToClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hrs > 0) {
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function interpolateHigherIsBetter(val: number, a: EventAnchor): number {
  if (val <= 0) return 0;
  if (val >= a.p100) return 100;
  if (val >= a.p85) {
    return Math.round(85 + ((val - a.p85) / Math.max(1, a.p100 - a.p85)) * 15);
  }
  if (val >= a.p70) {
    return Math.round(70 + ((val - a.p70) / Math.max(1, a.p85 - a.p70)) * 15);
  }
  if (val >= a.p60) {
    return Math.round(60 + ((val - a.p60) / Math.max(1, a.p70 - a.p60)) * 10);
  }
  // Below 60-pt minimum scales linearly down to 0
  const floorZero = Math.max(0, a.p60 * 0.4);
  if (val <= floorZero) return 0;
  return Math.max(0, Math.min(59, Math.round(((val - floorZero) / Math.max(1, a.p60 - floorZero)) * 59)));
}

function interpolateLowerIsBetter(secs: number, a: EventAnchor): number {
  if (secs <= 0) return 0;
  if (secs <= a.p100) return 100;
  if (secs <= a.p85) {
    return Math.round(85 + ((a.p85 - secs) / Math.max(1, a.p85 - a.p100)) * 15);
  }
  if (secs <= a.p70) {
    return Math.round(70 + ((a.p70 - secs) / Math.max(1, a.p70 - a.p85)) * 15);
  }
  if (secs <= a.p60) {
    return Math.round(60 + ((a.p60 - secs) / Math.max(1, a.p60 - a.p70)) * 10);
  }
  // Slower than 60-pt cutoff
  const worstCutoff = a.p60 * 1.3;
  if (secs >= worstCutoff) return 0;
  return Math.max(0, Math.min(59, Math.round(((worstCutoff - secs) / Math.max(1, worstCutoff - a.p60)) * 59)));
}

/**
 * Estimates Regular Army / USAR SGT/SSG Fitness Promotion Points from a 500-point AFT score.
 * Max 500 AFT = 120 promotion points; minimum passing 300 = 20 points.
 */
export function estimateAftPromotionPoints(totalScore: number, allEventsPassed: boolean): number {
  if (!allEventsPassed || totalScore < 300) return 0;
  if (totalScore >= 500) return 120;
  if (totalScore >= 495) return 117;
  // Smooth official-style scale from 300 pts (~20 promo) up to 494 pts (~115 promo)
  const ratio = (totalScore - 300) / 195;
  return Math.round(20 + ratio * 96);
}

export interface AftCalculationInput {
  standard: 'combat' | 'general';
  sex: 'male' | 'female';
  ageBracket: AftAgeBracket;
  mdlLbs: number;
  hrpReps: number;
  sdcSeconds: number;
  plkSeconds: number;
  twoMileSeconds: number;
}

export interface AftCalculationResult {
  events: (PtEventScoreRecord & {
    min60Target: string;
    max100Target: string;
    pointsToMax: number;
  })[];
  totalScore: number;
  maxScore: 500;
  requiredTotal: number;
  allEventsPassed: boolean;
  totalPassed: boolean;
  passed: boolean;
  promotionPoints: number;
  weakestEvent: string;
  statusHeadline: string;
}

export function calculateAftScore(input: AftCalculationInput): AftCalculationResult {
  // Combat MOS uses sex-neutral (male/combat) scoring regardless of sex
  const table =
    input.standard === 'combat' || input.sex === 'male'
      ? COMBAT_MALE_ANCHORS[input.ageBracket]
      : FEMALE_GENERAL_ANCHORS[input.ageBracket];

  const mdlPts = interpolateHigherIsBetter(input.mdlLbs, table.mdl);
  const hrpPts = interpolateHigherIsBetter(input.hrpReps, table.hrp);
  const sdcPts = interpolateLowerIsBetter(input.sdcSeconds, table.sdc);
  const plkPts = interpolateHigherIsBetter(input.plkSeconds, table.plk);
  const runPts = interpolateLowerIsBetter(input.twoMileSeconds, table.twoMile);

  const events = [
    {
      key: 'mdl',
      label: '3RM Deadlift (MDL)',
      rawDisplay: `${input.mdlLbs} lbs`,
      rawValue: input.mdlLbs,
      points: mdlPts,
      passed: mdlPts >= 60,
      min60Target: `${table.mdl.p60} lbs`,
      max100Target: `${table.mdl.p100} lbs`,
      pointsToMax: 100 - mdlPts,
    },
    {
      key: 'hrp',
      label: 'Hand-Release Push-Ups (HRP)',
      rawDisplay: `${input.hrpReps} reps`,
      rawValue: input.hrpReps,
      points: hrpPts,
      passed: hrpPts >= 60,
      min60Target: `${table.hrp.p60} reps`,
      max100Target: `${table.hrp.p100} reps`,
      pointsToMax: 100 - hrpPts,
    },
    {
      key: 'sdc',
      label: '250m Sprint-Drag-Carry (SDC)',
      rawDisplay: formatSecondsToClock(input.sdcSeconds),
      rawValue: input.sdcSeconds,
      points: sdcPts,
      passed: sdcPts >= 60,
      min60Target: formatSecondsToClock(table.sdc.p60),
      max100Target: formatSecondsToClock(table.sdc.p100),
      pointsToMax: 100 - sdcPts,
    },
    {
      key: 'plk',
      label: 'Forearm Plank (PLK)',
      rawDisplay: formatSecondsToClock(input.plkSeconds),
      rawValue: input.plkSeconds,
      points: plkPts,
      passed: plkPts >= 60,
      min60Target: formatSecondsToClock(table.plk.p60),
      max100Target: formatSecondsToClock(table.plk.p100),
      pointsToMax: 100 - plkPts,
    },
    {
      key: '2mr',
      label: '2-Mile Run (2MR)',
      rawDisplay: formatSecondsToClock(input.twoMileSeconds),
      rawValue: input.twoMileSeconds,
      points: runPts,
      passed: runPts >= 60,
      min60Target: formatSecondsToClock(table.twoMile.p60),
      max100Target: formatSecondsToClock(table.twoMile.p100),
      pointsToMax: 100 - runPts,
    },
  ];

  const totalScore = events.reduce((sum, ev) => sum + ev.points, 0);
  const requiredTotal = input.standard === 'combat' ? 350 : 300;
  const allEventsPassed = events.every((ev) => ev.passed);
  const totalPassed = totalScore >= requiredTotal;
  const passed = allEventsPassed && totalPassed;

  const sortedByPoints = [...events].sort((a, b) => a.points - b.points);
  const weakestEvent = sortedByPoints[0]?.label || '2-Mile Run (2MR)';

  let statusHeadline = 'Fails Minimum Standard';
  if (passed && totalScore >= 460) {
    statusHeadline = 'Elite Tier — Exceeds All Combat & Promotion Standards';
  } else if (passed && input.standard === 'combat') {
    statusHeadline = 'Combat MOS Standard Passed (≥350 & ≥60/Event)';
  } else if (passed) {
    statusHeadline = 'General MOS Standard Passed (≥300 & ≥60/Event)';
  } else if (!allEventsPassed) {
    statusHeadline = 'Event Failure — Minimum 60 Points Required Per Event';
  } else {
    statusHeadline = `Below ${requiredTotal}-Point Cumulative Minimum`;
  }

  return {
    events,
    totalScore,
    maxScore: 500,
    requiredTotal,
    allEventsPassed,
    totalPassed,
    passed,
    promotionPoints: estimateAftPromotionPoints(totalScore, allEventsPassed),
    weakestEvent,
    statusHeadline,
  };
}

/**
 * General Military PFT / Selection Readiness Scorer (300-Point Scale: Pull-Ups, Plank, 3-Mile Run)
 * Aligned to Marine PFT / Joint Selection 3-Event standards.
 */
export interface GeneralPftInput {
  sex: 'male' | 'female';
  ageBracket: AftAgeBracket;
  pullUps: number;
  plankSeconds: number;
  threeMileSeconds: number;
}

export interface GeneralPftResult {
  events: (PtEventScoreRecord & {
    min60Target: string;
    max100Target: string;
    pointsToMax: number;
  })[];
  totalScore: number;
  maxScore: 300;
  requiredTotal: number;
  passed: boolean;
  classification: '1st Class (235+)' | '2nd Class (200–234)' | '3rd Class (150–199)' | 'Below Minimum';
  weakestEvent: string;
  statusHeadline: string;
}

export function calculateGeneralPftScore(input: GeneralPftInput): GeneralPftResult {
  const isMale = input.sex === 'male';
  const pullAnchor: EventAnchor = isMale
    ? { p60: 8, p70: 12, p85: 18, p100: 23 }
    : { p60: 3, p70: 5, p85: 8, p100: 11 };

  const plankAnchor: EventAnchor = { p60: 110, p70: 140, p85: 185, p100: 225 }; // 1:50 -> 3:45
  const runAnchor: EventAnchor = isMale
    ? { p60: 1560, p70: 1410, p85: 1230, p100: 1080 } // 26:00 -> 18:00
    : { p60: 1740, p70: 1590, p85: 1410, p100: 1260 }; // 29:00 -> 21:00

  const pullPts = interpolateHigherIsBetter(input.pullUps, pullAnchor);
  const plkPts = interpolateHigherIsBetter(input.plankSeconds, plankAnchor);
  const runPts = interpolateLowerIsBetter(input.threeMileSeconds, runAnchor);

  const events = [
    {
      key: 'pullups',
      label: 'Strict Dead-Hang Pull-Ups',
      rawDisplay: `${input.pullUps} reps`,
      rawValue: input.pullUps,
      points: pullPts,
      passed: pullPts >= 40,
      min60Target: `${pullAnchor.p60} reps`,
      max100Target: `${pullAnchor.p100} reps`,
      pointsToMax: 100 - pullPts,
    },
    {
      key: 'plank',
      label: 'Forearm Plank',
      rawDisplay: formatSecondsToClock(input.plankSeconds),
      rawValue: input.plankSeconds,
      points: plkPts,
      passed: plkPts >= 40,
      min60Target: formatSecondsToClock(plankAnchor.p60),
      max100Target: formatSecondsToClock(plankAnchor.p100),
      pointsToMax: 100 - plkPts,
    },
    {
      key: '3mr',
      label: '3-Mile Run',
      rawDisplay: formatSecondsToClock(input.threeMileSeconds),
      rawValue: input.threeMileSeconds,
      points: runPts,
      passed: runPts >= 40,
      min60Target: formatSecondsToClock(runAnchor.p60),
      max100Target: formatSecondsToClock(runAnchor.p100),
      pointsToMax: 100 - runPts,
    },
  ];

  const totalScore = pullPts + plkPts + runPts;
  const allMin = events.every((e) => e.passed);
  const passed = allMin && totalScore >= 150;

  let classification: GeneralPftResult['classification'] = 'Below Minimum';
  if (passed && totalScore >= 235) classification = '1st Class (235+)';
  else if (passed && totalScore >= 200) classification = '2nd Class (200–234)';
  else if (passed) classification = '3rd Class (150–199)';

  const sorted = [...events].sort((a, b) => a.points - b.points);
  const weakestEvent = sorted[0]?.label || '3-Mile Run';

  return {
    events,
    totalScore,
    maxScore: 300,
    requiredTotal: 150,
    passed,
    classification,
    weakestEvent,
    statusHeadline: passed ? `${classification} Qualified` : 'Below PFT Minimum Standard',
  };
}
