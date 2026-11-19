import { MuscleGroup } from '../types';

export interface EventStandardGuide {
  id: string;
  shortCode: string;
  eventName: string;
  category: 'AFT' | 'General PFT / CFT';
  passingTarget: string;
  maxTarget: string;
  matchKeywords: string[];
  executionStandards: string[];
  commonNoReps: string[];
  coachPacingCue: string;
}

export const MILITARY_EVENT_STANDARDS: EventStandardGuide[] = [
  {
    id: 'aft-mdl',
    shortCode: 'MDL',
    eventName: '3-Repetition Maximum Deadlift (AFT Event 1)',
    category: 'AFT',
    passingTarget: '60 pts: 150 lb (Combat/M) · 120 lb (Gen F)',
    maxTarget: '100 pts: 350 lb (Combat/M) · 230 lb (Gen F)',
    matchKeywords: ['deadlift', 'hex bar', 'trap bar', 'mdl', 'rdl'],
    executionStandards: [
      'Performed with a 60-lb hex/trap bar inside the handles; 3 continuous repetitions with controlled descent.',
      'Stand fully upright at the top with hips and knees locked and shoulders squared (no excessive leaning back).',
      'Plates must make controlled contact with the ground between reps without bouncing or dropping the bar.',
      'Feet remain planted; hands stay inside the hex handles with neutral grip.',
    ],
    commonNoReps: [
      'Bouncing the plates off the ground to gain momentum on reps 2 or 3.',
      'Dropping the bar from the top or letting go of handles before plates settle.',
      'Failing to fully lock knees and hips at the top of a repetition.',
      'Rounding the lumbar spine dangerously or resting longer than 2 seconds on the floor.',
    ],
    coachPacingCue:
      'Set your lats and brace your core before pulling slack out of the bar. Treat all 3 reps as one crisp sequence—control the eccentric to protect your lower back for the SDC and 2-Mile Run.',
  },
  {
    id: 'aft-hrp',
    shortCode: 'HRP',
    eventName: 'Hand-Release Push-Up — 2 Min (AFT Event 2)',
    category: 'AFT',
    passingTarget: '60 pts: 14–15 reps (Combat/M) · 10 reps (Gen F)',
    maxTarget: '100 pts: 61 reps (Combat/M) · 46–48 reps (Gen F)',
    matchKeywords: ['hand-release', 'hrp', 'push-up', 'pushup', 'bench press', 'floor press'],
    executionStandards: [
      'Start prone with index fingers inside the outer edge of the shoulders; body moves as a single straight unit.',
      'Push to full elbow lockout (front-leaning rest), then lower chest, hips, and thighs to the ground simultaneously.',
      'At the bottom, lift hands off the ground and extend arms straight out to the sides into a full "T" (arm extension), then return hands under shoulders.',
      'Front-leaning rest is the ONLY authorized rest position (sagging or arching the back is allowed briefly while resting, but knees cannot touch).',
    ],
    commonNoReps: [
      'Failing to lock elbows completely at the top before descending.',
      'Snaking / worming the torso up off the ground instead of moving as a single rigid unit.',
      'Incomplete arm extension on the ground (elbows bent instead of straight T-release).',
      'Resting a knee, chest, or stomach on the ground or lifting a foot off the ground (terminates event).',
    ],
    coachPacingCue:
      'Keep elbows tucked at ~45 degrees to spare your front delts. Break reps into smooth sets of 10–15 with a quick 1-second breath at the top plank rather than burning out in the first 45 seconds.',
  },
  {
    id: 'aft-sdc',
    shortCode: 'SDC',
    eventName: '250m Sprint-Drag-Carry (AFT Event 3)',
    category: 'AFT',
    passingTarget: '60 pts: 2:28–2:31 (Combat/M) · 3:05–3:08 (Gen F)',
    maxTarget: '100 pts: 1:29–1:30 (Combat/M) · 1:55–1:58 (Gen F)',
    matchKeywords: ['sprint-drag-carry', 'sdc', 'sled', 'drag', 'lateral shuffle', 'kettlebell carry', 'farmer carry', 'shuttle'],
    executionStandards: [
      'Five continuous 50m shuttles (25m out and 25m back) on a 25m lane: (1) Sprint, (2) 90-lb Sled Drag backward, (3) Lateral Shuffle, (4) Two 40-lb KB Carry, (5) Final Sprint.',
      'Sprint turn: Touch the 25m line with one hand and one foot simultaneously before accelerating back.',
      'Sled Drag: Pull sled completely across the 25m line, turn it around, and pull completely across the start line.',
      'Lateral Shuffle: Face the same direction going out and coming back (lead with opposite foot on return); never cross feet.',
      'KB Carry: Carry both 40-lb kettlebells down and back, placing them down under control at the start line without dropping.',
    ],
    commonNoReps: [
      'Crossing feet during the lateral shuffle (grader requires immediate correction).',
      'Failing to pull the entire sled across the 25m turnaround or start line.',
      'Dropping the 40-lb kettlebells instead of setting them down controlled.',
      'Missing the hand-and-foot touch on the 25m sprint turnaround.',
    ],
    coachPacingCue:
      'The 90-lb sled drag is where races are won or lost: drop your hips low, lean back into the straps, and drive short, violent steps. Stay low on the lateral shuffle and open your stride on the final 50m sprint.',
  },
  {
    id: 'aft-plk',
    shortCode: 'PLK',
    eventName: 'Forearm Plank (AFT Event 4)',
    category: 'AFT',
    passingTarget: '60 pts: 1:25–1:30 (All Standards)',
    maxTarget: '100 pts: 3:35–3:40 (All Standards)',
    matchKeywords: ['plank', 'plk', 'rkc', 'core', 'ab wheel', 'dead bug'],
    executionStandards: [
      'Elbows aligned directly beneath shoulders, forearms flat on the ground forming a triangle or parallel lines.',
      'Hands may be flat or in fists, resting on the ground (fingers cannot be interlaced tightly if elevating wrists off ground; check unit grader preference—flat fists/palms are always safe).',
      'Feet no wider than hip-width apart; body maintains a straight line from ears through hips to ankles.',
      'Eyes oriented toward the ground/hands; no shaking out hands or lifting feet.',
    ],
    commonNoReps: [
      'Dropping knees, hips, or chest to the ground (immediate termination).',
      'Piking hips high or sagging the lower back after receiving one grader warning.',
      'Lifting a forearm, elbow, or foot off the ground during the hold.',
    ],
    coachPacingCue:
      'Use rhythmic 4-second nasal inhales and controlled exhales. Gently squeeze glutes and pull elbows toward toes at 60% tension—over-squeezing at 100% drains oxygen before the 2:30 mark.',
  },
  {
    id: 'aft-2mr',
    shortCode: '2MR',
    eventName: '2-Mile Run (AFT Event 5)',
    category: 'AFT',
    passingTarget: '60 pts: 19:30–19:45 (Combat/M) · 21:55–22:10 (Gen F)',
    maxTarget: '100 pts: 13:22–13:25 (Combat/M) · 15:20–15:30 (Gen F)',
    matchKeywords: ['2-mile', '2mr', 'two-mile', '800m', '400m', 'tempo run', 'track intervals', 'time trial', 'zone 2'],
    executionStandards: [
      'Measured 2.0-mile flat outdoor course or 8 laps on a standard 400m track.',
      'Performed after completing MDL, HRP, SDC, and PLK within the official AFT test window (minimum 10 min rest after Plank).',
      'Walking is permitted if needed, but pacing assistance (physical pulling/pushing) or leaving the course is prohibited.',
    ],
    commonNoReps: [
      'Cutting corners or leaving the marked course boundary.',
      'Receiving physical assistance from another Soldier.',
      'Starting too fast on Lap 1 after heavy SDC leg fatigue and blowing up at Mile 1.25.',
    ],
    coachPacingCue:
      'Your legs will feel heavy for the first 400m from the SDC. Lock into your exact goal lap split on Lap 1–2 (e.g., 1:40/400m for 13:20 pace), hold rhythm through Mile 1.5, and empty the tank on the final 400m.',
  },
  {
    id: 'pft-pullup',
    shortCode: 'PFT',
    eventName: 'Strict Dead-Hang Pull-Ups (General PFT / Selection)',
    category: 'General PFT / CFT',
    passingTarget: 'Min: 8 reps (M) · 3 reps (F)',
    maxTarget: 'Max 100 pts: 23 reps (M) · 11 reps (F)',
    matchKeywords: ['pull-up', 'pullup', 'chin-up', 'chinup', 'lat pulldown'],
    executionStandards: [
      'Full dead-hang lockout at the bottom of every rep (arms completely straight, shoulders relaxed or active hang).',
      'Chin must clearly break the horizontal plane above the top of the bar.',
      'Overhand (pronated) or underhand (supinated) grip allowed depending on branch PFT; zero kipping or leg kicking.',
    ],
    commonNoReps: [
      'Short-arming the bottom without reaching full elbow lockout.',
      'Tilting the head back without clearing the chin cleanly over the bar.',
      'Excessive swinging, bicycle-kicking, or kipping momentum.',
    ],
    coachPacingCue:
      'Drive elbows down to your ribs and keep ankles crossed lightly behind you to kill swing. Pause 0.2s at dead-hang lockout so every rep is indisputable.',
  },
];

/**
 * Finds the most relevant Military Event Standard guide for a given exercise name.
 */
export function matchEventStandardForExercise(exerciseName: string): EventStandardGuide | null {
  const lower = (exerciseName || '').toLowerCase();
  if (!lower) return null;
  for (const guide of MILITARY_EVENT_STANDARDS) {
    if (guide.matchKeywords.some((kw) => lower.includes(kw))) {
      return guide;
    }
  }
  return null;
}

export interface ExerciseSwapOption {
  name: string;
  tier: 'Equipment Busy' | 'Joint Safe' | 'Field / Bodyweight';
  reason: string;
  muscleGroup: MuscleGroup;
}

interface PatternSwapSet {
  keywords: string[];
  muscleGroup: MuscleGroup;
  options: ExerciseSwapOption[];
}

const MOVEMENT_SWAP_CATALOG: PatternSwapSet[] = [
  {
    keywords: ['deadlift', 'trap bar', 'hex bar', 'rdl', 'romanian'],
    muscleGroup: 'Hamstrings & Glutes',
    options: [
      {
        name: 'Dumbbell Romanian Deadlift (Heavy DBs)',
        tier: 'Equipment Busy',
        reason: 'Zero rack or hex bar required; trains identical posterior hinge.',
        muscleGroup: 'Hamstrings & Glutes',
      },
      {
        name: 'High-Handle Trap Bar Pull or Barbell Hip Thrust',
        tier: 'Joint Safe',
        reason: 'Reduces lumbar shear while keeping glute/hamstring force output high.',
        muscleGroup: 'Hamstrings & Glutes',
      },
      {
        name: 'Ruck Good Mornings + Single-Leg Glute Bridge',
        tier: 'Field / Bodyweight',
        reason: 'Austere field hinge alternative using zero gym iron.',
        muscleGroup: 'Hamstrings & Glutes',
      },
    ],
  },
  {
    keywords: ['squat', 'leg press', 'split squat', 'lunge', 'step-up'],
    muscleGroup: 'Quads',
    options: [
      {
        name: 'Heavy Dumbbell Goblet Squat or Bulgarian Split Squat',
        tier: 'Equipment Busy',
        reason: 'Fast setup when squat racks are full; builds unilateral drive.',
        muscleGroup: 'Quads',
      },
      {
        name: 'Box Squat to Parallel or Backward Sled Drag',
        tier: 'Joint Safe',
        reason: 'Maintains vertical shins and reduces patellar tendon strain.',
        muscleGroup: 'Quads',
      },
      {
        name: 'Ruck-Loaded Split Squats or Tempo Air Squats',
        tier: 'Field / Bodyweight',
        reason: 'Full lower-body stimulus anywhere in garrison or field.',
        muscleGroup: 'Quads',
      },
    ],
  },
  {
    keywords: ['bench', 'incline press', 'floor press', 'chest press', 'push-up', 'pushup', 'hrp'],
    muscleGroup: 'Chest',
    options: [
      {
        name: 'Flat or Incline Dumbbell Press',
        tier: 'Equipment Busy',
        reason: 'Zero bench-rack wait; allows natural shoulder path.',
        muscleGroup: 'Chest',
      },
      {
        name: 'Neutral-Grip Dumbbell Floor Press',
        tier: 'Joint Safe',
        reason: 'Limits bottom range to protect anterior shoulder capsule.',
        muscleGroup: 'Chest',
      },
      {
        name: 'Hand-Release Push-Ups (Weighted / Deficit)',
        tier: 'Field / Bodyweight',
        reason: 'Direct AFT HRP carryover with zero equipment.',
        muscleGroup: 'Chest',
      },
    ],
  },
  {
    keywords: ['overhead press', 'ohp', 'military press', 'shoulder press', 'landmine press', 'arnold'],
    muscleGroup: 'Shoulders',
    options: [
      {
        name: 'Seated Dumbbell Shoulder Press',
        tier: 'Equipment Busy',
        reason: 'No rack needed; isolates vertical pressing strength.',
        muscleGroup: 'Shoulders',
      },
      {
        name: 'Half-Kneeling Landmine Press',
        tier: 'Joint Safe',
        reason: 'Angled pressing arc eliminates subacromial shoulder pinch.',
        muscleGroup: 'Shoulders',
      },
      {
        name: 'Pike Push-Ups or Ruck Overhead Press',
        tier: 'Field / Bodyweight',
        reason: 'Field-ready vertical push using body or ruck pack.',
        muscleGroup: 'Shoulders',
      },
    ],
  },
  {
    keywords: ['pull-up', 'pullup', 'chin-up', 'lat pulldown', 'row', 'face pull'],
    muscleGroup: 'Back',
    options: [
      {
        name: 'Single-Arm Dumbbell Row or Neutral-Grip Cable Row',
        tier: 'Equipment Busy',
        reason: 'Quick swap when pull-up rigs or barbell stations are taken.',
        muscleGroup: 'Back',
      },
      {
        name: 'Chest-Supported Dumbbell Seal Row',
        tier: 'Joint Safe',
        reason: 'Eliminates lower-back fatigue while loading upper back heavily.',
        muscleGroup: 'Back',
      },
      {
        name: 'Inverted Bar Rows or Heavy Ruck Bent-Over Rows',
        tier: 'Field / Bodyweight',
        reason: 'Zero-gym horizontal pull for barracks or field ops.',
        muscleGroup: 'Back',
      },
    ],
  },
  {
    keywords: ['sled', 'drag', 'sdc', 'carry', 'farmer', 'suitcase'],
    muscleGroup: 'Full Body',
    options: [
      {
        name: 'Heavy Dumbbell Farmer Carries (2x50m)',
        tier: 'Equipment Busy',
        reason: 'Matches SDC grip and trunk bracing when turf/sled is busy.',
        muscleGroup: 'Full Body',
      },
      {
        name: 'Incline Treadmill Power March (12–15% Grade)',
        tier: 'Joint Safe',
        reason: 'Replicates sled quad burn with low eccentric impact.',
        muscleGroup: 'Full Body',
      },
      {
        name: 'Heavy Ruck Backward Hill March + Shuttle Sprints',
        tier: 'Field / Bodyweight',
        reason: 'Outdoor field replica of the 250m Sprint-Drag-Carry.',
        muscleGroup: 'Full Body',
      },
    ],
  },
  {
    keywords: ['plank', 'core', 'ab', 'pallof', 'hanging leg', 'dead bug', 'bird dog'],
    muscleGroup: 'Core',
    options: [
      {
        name: 'RKC High-Tension Forearm Plank (45–60s)',
        tier: 'Equipment Busy',
        reason: 'Zero equipment required; direct carryover to AFT/PFT Plank.',
        muscleGroup: 'Core',
      },
      {
        name: 'Dead Bug Core Brace or Pallof Press',
        tier: 'Joint Safe',
        reason: 'Anti-extension trunk stability with zero lumbar flexion.',
        muscleGroup: 'Core',
      },
      {
        name: 'Hollow Body Hold or Ruck March Suitcase Hold',
        tier: 'Field / Bodyweight',
        reason: 'High-tension isometric core endurance anywhere.',
        muscleGroup: 'Core',
      },
    ],
  },
  {
    keywords: ['curl', 'bicep', 'tricep', 'dip', 'skullcrusher', 'pushdown', 'lateral raise'],
    muscleGroup: 'Arms',
    options: [
      {
        name: 'Dumbbell Hammer Curls / Overhead DB Triceps Extension',
        tier: 'Equipment Busy',
        reason: 'Single dumbbell pair replaces busy cable stacks.',
        muscleGroup: 'Arms',
      },
      {
        name: 'Cable Rope Pushdowns / Incline Dumbbell Curls',
        tier: 'Joint Safe',
        reason: 'Neutral wrist & elbow alignment for tendon longevity.',
        muscleGroup: 'Arms',
      },
      {
        name: 'Close-Grip Diamond Push-Ups / Ruck Strap Curls',
        tier: 'Field / Bodyweight',
        reason: 'No-gym arm armor finisher.',
        muscleGroup: 'Arms',
      },
    ],
  },
  {
    keywords: ['run', 'sprint', 'interval', '400m', '800m', 'tempo', 'zone 2', 'ruck', 'cardio'],
    muscleGroup: 'Full Body',
    options: [
      {
        name: 'Treadmill Pace Intervals (1% Incline)',
        tier: 'Equipment Busy',
        reason: 'Exact split control during bad weather or closed tracks.',
        muscleGroup: 'Full Body',
      },
      {
        name: 'Assault Bike or Rowing Ergometer Intervals (Zero Impact)',
        tier: 'Joint Safe',
        reason: 'Matches aerobic/lactate HR zone while protecting shins & knees.',
        muscleGroup: 'Full Body',
      },
      {
        name: 'Outdoor 50m–200m Field Shuttles or Brisk Ruck March',
        tier: 'Field / Bodyweight',
        reason: 'No track or machine required.',
        muscleGroup: 'Full Body',
      },
    ],
  },
];

/**
 * Returns 3 categorized instant 1-tap swap options for any exercise during a live workout.
 */
export function getLiveExerciseSwapOptions(
  exerciseName: string,
  fallbackMuscleGroup: MuscleGroup = 'Full Body'
): ExerciseSwapOption[] {
  const lower = (exerciseName || '').toLowerCase();
  for (const pattern of MOVEMENT_SWAP_CATALOG) {
    if (pattern.keywords.some((kw) => lower.includes(kw))) {
      return pattern.options.filter(
        (opt) => opt.name.toLowerCase() !== lower
      );
    }
  }
  return [
    {
      name: 'Dumbbell Variation (Same Movement Pattern)',
      tier: 'Equipment Busy',
      reason: 'Use dumbbells to avoid waiting for racks or cables.',
      muscleGroup: fallbackMuscleGroup,
    },
    {
      name: 'Controlled Tempo Machine or Cable Variation',
      tier: 'Joint Safe',
      reason: 'Stabilized joint path for high-fatigue or tender days.',
      muscleGroup: fallbackMuscleGroup,
    },
    {
      name: 'Ruck-Weighted Bodyweight Equivalent',
      tier: 'Field / Bodyweight',
      reason: 'Field-ready calisthenic alternative.',
      muscleGroup: fallbackMuscleGroup,
    },
  ];
}
