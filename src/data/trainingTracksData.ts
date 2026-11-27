import {
  TrainingTrack,
  TrackId,
  UserProgramState,
  GlobalBenchmarkLog,
  TransformedWorkoutSession,
  TransformedExercise,
  WorkoutSession,
} from '../types/trainingTracks';
import { WorkoutSessionLog } from '../types';

export const TRAINING_TRACKS: TrainingTrack[] = [
  {
    id: 'hybrid-tactical',
    badge: 'Hybrid',
    category: 'Hybrid',
    title: 'Tactical Hybrid',
    focusSummary: 'Heavy compound strength paired with aerobic threshold and sled engine work.',
    frequencyLabel: '4–5 days/wk',
    standardDaysPerWeek: 4,
    highVolumeDaysPerWeek: 5,
    avgDurationMinutes: 55,
    equipment: ['Barbell', 'Dumbbells', 'Rower / SkiErg', 'Pull-Up Bar'],
    accentColor: 'amber',
    linkedProgramKey: 'hybrid_protocol',
    totalWeeks: 12,
    recommendedWarmupId: 'warmup-dime-mandatory',
    splitSummary: [
      'Day 1: Lower Strength & Threshold Run',
      'Day 2: Upper Armor Push/Pull',
      'Day 3: Aerobic Engine & Loaded Carry',
      'Day 4: Hinge Power & Unilateral Stability',
      'Day 5: High-Volume Mixed Modal Conditioning',
    ],
    sessions: [
      {
        id: 'ht-d1',
        dayNumber: 1,
        title: 'Lower Force Production & Engine Intervals',
        focus: 'Posterior strength, unilateral drive, and anaerobic repeatability',
        estimatedMinutes: 55,
        warmupSummary: '6 min hip CARS, world’s greatest stretch, 2x15 glute bridges, bar ramp-up',
        conditioningSummary: '4x800m threshold intervals or SkiErg equivalent',
        exercises: [
          {
            id: 'ht-d1-e1',
            movement_id: 'trap-bar-deadlift',
            name: 'Trap Bar Deadlift',
            blockType: 'Strength',
            muscleGroup: 'Hamstrings & Glutes',
            sets: 4,
            reps: '5 reps',
            targetRpe: 8,
            restSeconds: 150,
            loadPercent1RM: 0.82,
            notes: 'Crisp lockout, vertical shins, reset every rep on floor.',
            lowImpactSwap: {
              movement_id: 'trap-bar-deadlift',
              name: 'High-Handle Trap Bar Deadlift (Block Pull)',
              reps: '5 reps',
              notes: 'Elevated handles reduce deep hip/knee flexion while preserving maximal force output.',
              reason: 'Joint-safe elevated pull reduces lumbar shear and deep hip flexion.',
            },
            minimalGearSwap: {
              movement_id: 'db-rdl',
              name: 'Heavy Dumbbell Romanian Deadlift',
              reps: '8-10 reps',
              notes: '3-second eccentric hinge with dumbbells hugging thighs.',
              reason: 'Adapted for dumbbell-only setup with identical posterior-chain stimulus.',
            },
          },
          {
            id: 'ht-d1-e2',
            movement_id: 'box-jump',
            name: 'Explosive Box Jumps (24 in)',
            blockType: 'Power',
            muscleGroup: 'Quads',
            sets: 4,
            reps: '5 reps',
            targetRpe: 7.5,
            restSeconds: 90,
            isHighImpact: true,
            isAccessory: true,
            notes: 'Full hip extension, soft landing, step down every rep.',
            lowImpactSwap: {
              movement_id: 'controlled-step-up',
              name: 'Weighted Controlled Box Step-Ups',
              reps: '8 reps/leg',
              notes: 'Drive strictly through lead heel without rebound landing impact.',
              reason: 'Eliminates plyometric landing impact while building single-leg concentric drive.',
            },
            minimalGearSwap: {
              movement_id: 'db-goblet-squat',
              name: 'Explosive Tempo Goblet Squat',
              reps: '8 reps',
              notes: '3-second controlled descent, fast concentric drive.',
              reason: 'No plyo box required; retains lower-body speed-strength.',
            },
          },
          {
            id: 'ht-d1-e3',
            movement_id: 'bulgarian-split-squat',
            name: 'Rear-Foot Elevated Split Squat',
            blockType: 'Accessory',
            muscleGroup: 'Quads',
            sets: 4,
            reps: '8 reps/leg',
            targetRpe: 8,
            restSeconds: 75,
            isAccessory: true,
            loadPercent1RM: 0.72,
            notes: 'Tall torso, vertical front shin, controlled eccentric.',
            lowImpactSwap: {
              movement_id: 'controlled-step-up',
              name: 'Low-Box Eccentric Step-Up (16 in)',
              reps: '10 reps/leg',
              notes: 'Restricts knee flexion angle to 90 deg to protect patellar tendon and hip labrum.',
              reason: 'Avoids deep hip/knee flexion under load.',
            },
          },
          {
            id: 'ht-d1-e4',
            movement_id: 'two-mile-run',
            name: '4 x 800m Threshold Run Intervals',
            blockType: 'Engine',
            muscleGroup: 'Full Body',
            sets: 4,
            reps: '800m @ 5K pace',
            targetRpe: 8.5,
            restSeconds: 120,
            isHighImpact: true,
            notes: 'Target consistent split pacing across all 4 intervals.',
            lowImpactSwap: {
              movement_id: 'skierg-1000m',
              name: '4 x 500m SkiErg Threshold Intervals',
              reps: '500m @ 2K pace',
              notes: 'Zero ground-reaction impact while matching Zone 4 lactate threshold heart rate.',
              reason: 'Replaces high-impact footstrike running with zero-impact SkiErg intervals.',
            },
            minimalGearSwap: {
              movement_id: 'two-mile-run',
              name: '4 x 3:00 Outdoor/Treadmill Tempo Intervals',
              reps: '3:00 @ RPE 8',
              notes: 'Sustained Zone 4 aerobic effort with 90s walk recovery.',
              reason: 'No track markers required; time-based pacing.',
            },
          },
          {
            id: 'ht-d1-e5',
            movement_id: 'hanging-leg-raise',
            name: 'Hanging Toes-to-Bar / Leg Raises',
            blockType: 'Core',
            muscleGroup: 'Core',
            sets: 3,
            reps: '12 reps',
            targetRpe: 8,
            restSeconds: 60,
            isAccessory: true,
            isHighImpact: true,
            notes: 'Strict pelvic tuck, zero kipping swing.',
            lowImpactSwap: {
              movement_id: 'pallof-press',
              name: 'Tall-Kneeling Band/Cable Pallof Press',
              reps: '12 reps/side',
              notes: 'Anti-rotation trunk bracing with zero lumbar or anterior hip flexion.',
              reason: 'Replaces deep hip-flexion hanging core work with low-flexion trunk stability.',
            },
            minimalGearSwap: {
              movement_id: 'plank-hold',
              name: 'RKC Hardstyle Forearm Plank',
              reps: '45 sec hold',
              notes: 'Max glute and lat tension without pull-up bar.',
              reason: 'Bodyweight-only anti-extension core equivalent.',
            },
          },
        ],
      },
      {
        id: 'ht-d2',
        dayNumber: 2,
        title: 'Upper Tactical Armor (Press & Pull)',
        focus: 'Upper pressing power, strict vertical pulling, and shoulder durability',
        estimatedMinutes: 50,
        warmupSummary: '5 min band pull-aparts, scapular push-ups, thoracic windmills',
        exercises: [
          {
            id: 'ht-d2-e1',
            movement_id: 'incline-db-press',
            name: 'Incline Dumbbell Bench Press (30 deg)',
            blockType: 'Strength',
            muscleGroup: 'Chest',
            sets: 4,
            reps: '6-8 reps',
            targetRpe: 8,
            restSeconds: 120,
            loadPercent1RM: 0.8,
            notes: '45-degree elbow path, 2-second pause at bottom stretch.',
          },
          {
            id: 'ht-d2-e2',
            movement_id: 'weighted-pull-up',
            name: 'Weighted Strict Pull-Ups',
            blockType: 'Strength',
            muscleGroup: 'Back',
            sets: 4,
            reps: '5-6 reps',
            targetRpe: 8.5,
            restSeconds: 120,
            loadPercent1RM: 0.82,
            notes: 'Full dead hang to chest-to-bar lockout.',
            minimalGearSwap: {
              movement_id: 'weighted-pull-up',
              name: 'Strict Bodyweight Pull-Ups (3s Eccentric)',
              reps: '6-8 reps',
              notes: 'Slow lowering phase compensates for absence of dip belt.',
              reason: 'No weight belt required.',
            },
          },
          {
            id: 'ht-d2-e3',
            movement_id: 'overhead-press',
            name: 'Standing Barbell Overhead Press',
            blockType: 'Accessory',
            muscleGroup: 'Shoulders',
            sets: 4,
            reps: '8 reps',
            targetRpe: 8,
            restSeconds: 90,
            isAccessory: true,
            loadPercent1RM: 0.75,
            notes: 'Ribs stacked over pelvis, glutes braced hard.',
            lowImpactSwap: {
              movement_id: 'overhead-press',
              name: 'Half-Kneeling Landmine Press',
              reps: '10 reps/arm',
              notes: 'Scapular-plane arc eliminates overhead shoulder impingement and lumbar arch.',
              reason: 'Protects shoulder capsule and lumbar spine.',
            },
            minimalGearSwap: {
              movement_id: 'overhead-press',
              name: 'Seated Neutral-Grip DB Overhead Press',
              reps: '10 reps',
              notes: 'Dumbbells only; strict vertical lockout.',
              reason: 'Adapted for dumbbell-only setup.',
            },
          },
          {
            id: 'ht-d2-e4',
            movement_id: 'farmers-carry',
            name: 'Heavy Tactical Farmers Carry',
            blockType: 'Carry',
            muscleGroup: 'Full Body',
            sets: 4,
            reps: '50m carry',
            targetRpe: 8,
            restSeconds: 75,
            isAccessory: true,
            notes: 'Tall posture, packed shoulders, brisk combat walk pace.',
          },
        ],
      },
      {
        id: 'ht-d3',
        dayNumber: 3,
        title: 'Aerobic Engine & Loaded Carry Work',
        focus: 'Zone 2 cardiac output paired with grip and trunk endurance',
        estimatedMinutes: 45,
        warmupSummary: '5 min progressive erg spin + ankle & calf prep',
        exercises: [
          {
            id: 'ht-d3-e1',
            movement_id: 'row-2000m',
            name: '3 x 2,000m Aerobic Erg Intervals',
            blockType: 'Engine',
            muscleGroup: 'Full Body',
            sets: 3,
            reps: '2,000m @ Zone 2-3',
            targetRpe: 7,
            restSeconds: 120,
            notes: 'Hold steady 22–24 spm stroke rate; nose-breathing ceiling.',
            minimalGearSwap: {
              movement_id: 'two-mile-run',
              name: '35-Min Zone 2 Steady-State Run / Brisk Incline Walk',
              reps: '35 min @ HR 135-148',
              notes: 'Pure aerobic base building with zero gym equipment.',
              reason: 'No Concept2 erg required.',
            },
          },
          {
            id: 'ht-d3-e2',
            movement_id: 'sled-drag-carry',
            name: 'Backward Heavy Sled Drag',
            blockType: 'Carry',
            muscleGroup: 'Quads',
            sets: 4,
            reps: '40m drag',
            targetRpe: 7.5,
            restSeconds: 75,
            isAccessory: true,
            notes: 'Continuous quad pump with zero eccentric knee stress.',
            minimalGearSwap: {
              movement_id: 'farmers-carry',
              name: 'Heavy DB Suitcase Carry',
              reps: '40m/side',
              notes: 'Lateral core and grip endurance substitute.',
              reason: 'No sled track required.',
            },
          },
        ],
      },
      {
        id: 'ht-d4',
        dayNumber: 4,
        title: 'Posterior Power & Combat Durability',
        focus: 'Squat mechanics, horizontal pulling, and anti-rotation core',
        estimatedMinutes: 55,
        warmupSummary: '6 min goblet pry squats, band walks, T-spine openers',
        exercises: [
          {
            id: 'ht-d4-e1',
            movement_id: 'back-squat',
            name: 'Barbell Back Squat',
            blockType: 'Strength',
            muscleGroup: 'Quads',
            sets: 4,
            reps: '5 reps',
            targetRpe: 8,
            restSeconds: 150,
            loadPercent1RM: 0.82,
            isHighImpact: true,
            notes: 'Brace 360 degrees, controlled descent, drive through mid-foot.',
            lowImpactSwap: {
              movement_id: 'back-squat',
              name: 'Parallel Box Squat (Controlled Pause)',
              reps: '6 reps',
              notes: 'Vertical tibia and controlled box touch remove bottom-end hip/knee shear.',
              reason: 'Eliminates uncontrolled deep flexion under axial load.',
            },
            minimalGearSwap: {
              movement_id: 'db-goblet-squat',
              name: 'Heavy Double-DB Front Squat',
              reps: '8-10 reps',
              notes: 'Front-racked dumbbells challenge upper back and quads safely.',
              reason: 'Barbell/rack-free lower strength substitution.',
            },
          },
          {
            id: 'ht-d4-e2',
            movement_id: 'hand-release-pushup',
            name: 'Weighted / Tempo Hand-Release Push-Ups',
            blockType: 'Accessory',
            muscleGroup: 'Chest',
            sets: 4,
            reps: '15-20 reps',
            targetRpe: 8,
            restSeconds: 60,
            isAccessory: true,
            notes: 'Full chest contact, crisp hand lift, explosive press.',
          },
          {
            id: 'ht-d4-e3',
            movement_id: 'skierg-1000m',
            name: '1,000m SkiErg Max-Effort Finisher',
            blockType: 'Engine',
            muscleGroup: 'Full Body',
            sets: 2,
            reps: '1,000m sprint',
            targetRpe: 9,
            restSeconds: 150,
            isAccessory: true,
            notes: 'Long hip-hinge strokes, drive lat pull through pockets.',
            minimalGearSwap: {
              movement_id: 'farmers-carry',
              name: 'Shuttle Carry Conditioning (DB)',
              reps: '6 x 25m sprint carry',
              notes: 'High output anaerobic finisher using dumbbells.',
              reason: 'No SkiErg required.',
            },
          },
        ],
      },
      {
        id: 'ht-d5',
        dayNumber: 5,
        title: 'High-Volume Mixed-Modal Tactical Engine',
        focus: 'Extra capacity day — burpees, sleds, carries, and repeat power',
        estimatedMinutes: 50,
        highVolumeOnly: true,
        warmupSummary: '5 min jump rope or erg spin + dynamic shoulders/hips',
        exercises: [
          {
            id: 'ht-d5-e1',
            movement_id: 'burpee-broad-jump',
            name: 'Burpee Broad Jumps + Sled Sprint',
            blockType: 'Engine',
            muscleGroup: 'Full Body',
            sets: 5,
            reps: '8 burpees + 25m sled',
            targetRpe: 8.5,
            restSeconds: 90,
            isHighImpact: true,
            notes: 'Sustained tactical output under elevated heart rate.',
            lowImpactSwap: {
              movement_id: 'skierg-1000m',
              name: 'SkiErg 250m + Heavy Sled Push (25m)',
              reps: '250m Ski + 25m Sled',
              notes: 'Zero sprawl/jump impact with identical full-body metabolic demand.',
              reason: 'Swaps high-impact burpee jumps for SkiErg + concentric sled drive.',
            },
            minimalGearSwap: {
              movement_id: 'db-goblet-squat',
              name: 'DB Thruster + Shadow Shuttle EMOM',
              reps: '10 DB thrusters / min',
              notes: 'High-efficiency minimal-gear metabolic conditioning.',
              reason: 'Dumbbell-only mixed modal adaptation.',
            },
          },
          {
            id: 'ht-d5-e2',
            movement_id: 'plank-hold',
            name: 'Weighted Tactical Plank Hold',
            blockType: 'Core',
            muscleGroup: 'Core',
            sets: 3,
            reps: '60 sec hold',
            targetRpe: 8,
            restSeconds: 60,
            isAccessory: true,
            notes: 'Neutral pelvis, brace as if taking impact.',
          },
        ],
      },
    ],
  },
  {
    id: 'army-aft',
    badge: 'Military',
    category: 'Military',
    title: 'Military Readiness (AFT / Ruck)',
    focusSummary: '5-event AFT dominance: 3RM deadlift, HRP, SDC, plank, 2-mile run & ruck.',
    frequencyLabel: '4–5 days/wk',
    standardDaysPerWeek: 4,
    highVolumeDaysPerWeek: 5,
    avgDurationMinutes: 55,
    equipment: ['Trap Bar', 'Sled & Kettlebells', 'Ruck Pack (35 lb)', 'Track'],
    accentColor: 'amber',
    linkedProgramKey: 'aft_protocol',
    totalWeeks: 8,
    recommendedWarmupId: 'warmup-dime-mandatory',
    splitSummary: [
      'Day 1: 3RM Trap Bar Deadlift & SDC Power',
      'Day 2: Hand-Release Push-Up Density & Plank',
      'Day 3: 2-Mile Run Speed Intervals',
      'Day 4: Tactical Ruck Endurance & Carry',
      'Day 5: High-Volume AFT Event Simulation',
    ],
    sessions: [
      {
        id: 'aft-d1',
        dayNumber: 1,
        title: 'AFT Deadlift Power & Sprint-Drag-Carry',
        focus: 'Maximal posterior force and anaerobic shuttle turnover',
        estimatedMinutes: 55,
        warmupSummary: '6 min hip openers, glute activation, progressive trap bar ramp sets',
        exercises: [
          {
            id: 'aft-d1-e1',
            movement_id: 'trap-bar-deadlift',
            name: 'AFT Hex Trap Bar Deadlift (3RM Progression)',
            blockType: 'Strength',
            muscleGroup: 'Hamstrings & Glutes',
            sets: 5,
            reps: '3 reps',
            targetRpe: 8.5,
            restSeconds: 180,
            loadPercent1RM: 0.87,
            notes: 'Touch-and-go prohibited; full dead stop and controlled eccentric per AFT standard.',
            lowImpactSwap: {
              movement_id: 'trap-bar-deadlift',
              name: 'High-Handle Trap Bar Deadlift (Controlled Tempo)',
              reps: '4 reps',
              notes: 'High handles protect lumbar spine and anterior hip while driving 3RM peak force.',
              reason: 'Reduces bottom-end hip/back flexion torque.',
            },
            minimalGearSwap: {
              movement_id: 'db-rdl',
              name: 'Heavy Twin-DB Deadlift from Blocks',
              reps: '8 reps',
              notes: 'Simulates neutral-grip hex bar mechanics using heavy dumbbells.',
              reason: 'No trap bar available.',
            },
          },
          {
            id: 'aft-d1-e2',
            movement_id: 'sled-drag-carry',
            name: 'Sprint-Drag-Carry (90 lb Sled + 40 lb KBs)',
            blockType: 'Carry',
            muscleGroup: 'Full Body',
            sets: 4,
            reps: '5 x 50m shuttle',
            targetRpe: 8.5,
            restSeconds: 120,
            isHighImpact: true,
            notes: 'Low hips on backward drag, crisp lateral shuffle without crossing feet.',
            lowImpactSwap: {
              movement_id: 'sled-drag-carry',
              name: 'Continuous Heavy Backward Sled Drag + KB Farmers March',
              reps: '50m drag + 50m carry',
              notes: 'Removes hard cutting/sprint deceleration while building exact SDC leg and grip stamina.',
              reason: 'Zero high-impact cutting or sprint braking.',
            },
            minimalGearSwap: {
              movement_id: 'farmers-carry',
              name: 'Heavy DB Farmers Shuttle Carry',
              reps: '4 x 50m brisk shuttle',
              notes: 'Rapid turnaround grip and lower-body conditioning without sled.',
              reason: 'Sled-free SDC conditioning.',
            },
          },
          {
            id: 'aft-d1-e3',
            movement_id: 'bulgarian-split-squat',
            name: 'DB Split Squat (Quad & Glute Armor)',
            blockType: 'Accessory',
            muscleGroup: 'Quads',
            sets: 4,
            reps: '8 reps/leg',
            targetRpe: 8,
            restSeconds: 75,
            isAccessory: true,
            notes: 'Builds sled-drag knee extension strength.',
            lowImpactSwap: {
              movement_id: 'controlled-step-up',
              name: 'Controlled Step-Up to 16" Box',
              reps: '10 reps/leg',
              notes: 'Zero patellar shear; slow 2-second lowering.',
              reason: 'Joint-friendly unilateral quad work.',
            },
          },
          {
            id: 'aft-d1-e4',
            movement_id: 'plank-hold',
            name: 'AFT Forearm Plank Progression',
            blockType: 'Core',
            muscleGroup: 'Core',
            sets: 3,
            reps: '90 sec hold',
            targetRpe: 8,
            restSeconds: 60,
            isAccessory: true,
            notes: 'Hands no wider than fists apart, straight body line per official grading.',
          },
        ],
      },
      {
        id: 'aft-d2',
        dayNumber: 2,
        title: 'HRP Muscular Endurance & Upper Strength',
        focus: 'High-rep hand-release push-up pacing and vertical pulling balance',
        estimatedMinutes: 45,
        warmupSummary: '5 min shoulder CARs, band dislocations, scapular push-ups',
        exercises: [
          {
            id: 'aft-d2-e1',
            movement_id: 'hand-release-pushup',
            name: 'AFT Hand-Release Push-Up (T-Extension) EMOM',
            blockType: 'Strength',
            muscleGroup: 'Chest',
            sets: 5,
            reps: '12-15 reps',
            targetRpe: 8,
            restSeconds: 60,
            notes: 'Crisp full T-arm extension on deck; rapid lockout to build 2-minute race cadence.',
          },
          {
            id: 'aft-d2-e2',
            movement_id: 'incline-db-press',
            name: 'Incline DB Press (Strength Reserve)',
            blockType: 'Strength',
            muscleGroup: 'Chest',
            sets: 4,
            reps: '8 reps',
            targetRpe: 8,
            restSeconds: 90,
            loadPercent1RM: 0.78,
            notes: 'Builds pressing ceiling so bodyweight push-ups feel submaximal.',
          },
          {
            id: 'aft-d2-e3',
            movement_id: 'weighted-pull-up',
            name: 'Strict Pull-Ups (Postural Balance)',
            blockType: 'Accessory',
            muscleGroup: 'Back',
            sets: 4,
            reps: '8 reps',
            targetRpe: 8,
            restSeconds: 90,
            isAccessory: true,
            notes: 'Balances high pressing volume for shoulder longevity.',
          },
        ],
      },
      {
        id: 'aft-d3',
        dayNumber: 3,
        title: '2-Mile Run Speed & VO2 Max Intervals',
        focus: 'Sub-13:30 2-mile pace development and lactate clearance',
        estimatedMinutes: 45,
        warmupSummary: '8 min easy jog + A-skips + 3x60m progressive strides',
        exercises: [
          {
            id: 'aft-d3-e1',
            movement_id: 'two-mile-run',
            name: '6 x 400m Track Repeats @ Goal 2MR Pace - 10s',
            blockType: 'Engine',
            muscleGroup: 'Full Body',
            sets: 6,
            reps: '400m fast / 90s jog',
            targetRpe: 8.5,
            restSeconds: 90,
            isHighImpact: true,
            notes: 'Relaxed shoulders, quick 180 spm cadence.',
            lowImpactSwap: {
              movement_id: 'skierg-1000m',
              name: '6 x 500m SkiErg / Assault Bike Threshold Repeats',
              reps: '500m @ 90% max HR',
              notes: 'Develops exact VO2max aerobic power with zero shin/knee impact.',
              reason: 'Replaces track running with zero-impact erg intervals.',
            },
          },
          {
            id: 'aft-d3-e2',
            movement_id: 'plank-hold',
            name: 'Post-Fatigue AFT Plank Hold',
            blockType: 'Core',
            muscleGroup: 'Core',
            sets: 2,
            reps: '2:00 hold',
            targetRpe: 8.5,
            restSeconds: 90,
            isAccessory: true,
            notes: 'Practice bracing core immediately under elevated breathing.',
          },
        ],
      },
      {
        id: 'aft-d4',
        dayNumber: 4,
        title: 'Tactical Ruck March & Loaded Chassis',
        focus: '35-lb dry ruck pacing (<14:30/mi) and trap/core durability',
        estimatedMinutes: 60,
        warmupSummary: '5 min calf raises, hip swings, shoulder pack strap check',
        exercises: [
          {
            id: 'aft-d4-e1',
            movement_id: 'ruck-march-4mi',
            name: '4-Mile Tactical Ruck (35 lb Dry Pack)',
            blockType: 'Engine',
            muscleGroup: 'Full Body',
            sets: 1,
            reps: '4.0 miles @ 14:15/mi',
            targetRpe: 7.5,
            restSeconds: 0,
            isHighImpact: true,
            notes: 'Fast march stride; avoid shuffling or heavy heel striking.',
            lowImpactSwap: {
              movement_id: 'row-2000m',
              name: '40-Min Weighted Vest Incline Treadmill Walk (8% Grade)',
              reps: '40 min @ Zone 2-3',
              notes: 'Steep incline eliminates impact jarring while hammering glutes and calves.',
              reason: 'Joint-safe incline load substitute for hard pavement rucking.',
            },
          },
          {
            id: 'aft-d4-e2',
            movement_id: 'farmers-carry',
            name: 'Heavy Suitcase Carry Finisher',
            blockType: 'Carry',
            muscleGroup: 'Core',
            sets: 3,
            reps: '50m/side',
            targetRpe: 8,
            restSeconds: 60,
            isAccessory: true,
            notes: 'Anti-lateral flexion stability for pack carry posture.',
          },
        ],
      },
      {
        id: 'aft-d5',
        dayNumber: 5,
        title: 'High-Volume AFT Full-Event Rehearsal',
        focus: 'Back-to-back event pacing under cumulative fatigue',
        estimatedMinutes: 55,
        highVolumeOnly: true,
        warmupSummary: '8 min full-body tactical warm-up',
        exercises: [
          {
            id: 'aft-d5-e1',
            movement_id: 'trap-bar-deadlift',
            name: 'Trap Bar Opener Singles + HRP + SDC',
            blockType: 'Strength',
            muscleGroup: 'Full Body',
            sets: 3,
            reps: '3 MDL + 20 HRP + 100m Carry',
            targetRpe: 8.5,
            restSeconds: 180,
            loadPercent1RM: 0.82,
            notes: 'Simulated AFT transitions with controlled breathing.',
          },
        ],
      },
    ],
  },
  {
    id: 'leo-patrol',
    badge: 'LEO',
    category: 'LEO',
    title: 'Patrol & Academy Prep (PAT/POPAT)',
    focusSummary: 'Foot-pursuit agility, sprint acceleration, dummy drag, and upper control strength.',
    frequencyLabel: '4 days/wk',
    standardDaysPerWeek: 3,
    highVolumeDaysPerWeek: 4,
    avgDurationMinutes: 48,
    equipment: ['Gym / Dumbbells', 'Sled', 'Track / Turf', 'Pull-Up Bar'],
    accentColor: 'sky',
    linkedProgramKey: 'universal_pat',
    totalWeeks: 8,
    recommendedWarmupId: 'warmup-dime-mandatory',
    splitSummary: [
      'Day 1: Pursuit Sprint Acceleration & Dummy Drag',
      'Day 2: Upper Control Strength (Push/Pull/Grip)',
      'Day 3: PAT/POPAT Obstacle Circuit & 1.5-Mi Run',
      'Day 4: High-Volume Shift Durability & Core Armor',
    ],
    sessions: [
      {
        id: 'leo-d1',
        dayNumber: 1,
        title: 'Foot-Pursuit Acceleration & Rescue Drag',
        focus: 'First-step burst speed, change of direction, and 165-lb rescue drag power',
        estimatedMinutes: 48,
        warmupSummary: '6 min ankle hops, hip openers, lateral shuffles, 3x20m build-ups',
        exercises: [
          {
            id: 'leo-d1-e1',
            movement_id: 'box-jump',
            name: 'Broad Jump to 20m Pursuit Acceleration',
            blockType: 'Power',
            muscleGroup: 'Quads',
            sets: 5,
            reps: '1 jump + 20m sprint',
            targetRpe: 8,
            restSeconds: 90,
            isHighImpact: true,
            notes: 'Explosive 45-degree shin angle out of start.',
            lowImpactSwap: {
              movement_id: 'sled-drag-carry',
              name: 'Heavy Sled Acceleration March (20m)',
              reps: '20m high-drive march',
              notes: 'Develops exact horizontal pursuit drive with zero landing impact.',
              reason: 'Eliminates jump/sprint impact stress on knees and Achilles.',
            },
            minimalGearSwap: {
              movement_id: 'controlled-step-up',
              name: 'Explosive Wall Drive + 20m High-Cadence Stride',
              reps: '6 drives + 20m stride',
              notes: 'Minimal-gear acceleration mechanics.',
              reason: 'No box or sled needed.',
            },
          },
          {
            id: 'leo-d1-e2',
            movement_id: 'sled-drag-carry',
            name: '165-lb Victim Rescue Backward Drag',
            blockType: 'Carry',
            muscleGroup: 'Hamstrings & Glutes',
            sets: 4,
            reps: '30m continuous drag',
            targetRpe: 8.5,
            restSeconds: 120,
            notes: 'Sit low into hips, short powerful choppy steps, keep torso braced.',
            minimalGearSwap: {
              movement_id: 'farmers-carry',
              name: 'Heavy DB Reverse Bear-Hug / Farmers March',
              reps: '40m march',
              notes: 'High-tension lower and grip substitute when sled is unavailable.',
              reason: 'Dumbbell-only rescue carry adaptation.',
            },
          },
          {
            id: 'leo-d1-e3',
            movement_id: 'trap-bar-deadlift',
            name: 'Trap Bar Deadlift (Duty-Belt Posterior Armor)',
            blockType: 'Strength',
            muscleGroup: 'Hamstrings & Glutes',
            sets: 4,
            reps: '6 reps',
            targetRpe: 8,
            restSeconds: 120,
            loadPercent1RM: 0.78,
            notes: 'Protects lower back against heavy duty-belt load.',
          },
          {
            id: 'leo-d1-e4',
            movement_id: 'pallof-press',
            name: 'Standing Cable/Band Anti-Rotation Press',
            blockType: 'Core',
            muscleGroup: 'Core',
            sets: 4,
            reps: '12 reps/side',
            targetRpe: 7.5,
            restSeconds: 45,
            isAccessory: true,
            notes: 'Resists torsional torque during subject control.',
          },
        ],
      },
      {
        id: 'leo-d2',
        dayNumber: 2,
        title: 'Upper Control Strength & Grip Torque',
        focus: 'Fence-climb pull strength, push-up test capacity, and grappling grip',
        estimatedMinutes: 45,
        warmupSummary: '5 min shoulder mobility, wrist prep, scapular pull-ups',
        exercises: [
          {
            id: 'leo-d2-e1',
            movement_id: 'weighted-pull-up',
            name: 'Chest-to-Bar Pull-Ups (6-Ft Wall Climb Prep)',
            blockType: 'Strength',
            muscleGroup: 'Back',
            sets: 4,
            reps: '6-8 reps',
            targetRpe: 8.5,
            restSeconds: 120,
            notes: 'Explosive pull to sternum to build wall-top dominance.',
          },
          {
            id: 'leo-d2-e2',
            movement_id: 'incline-db-press',
            name: 'Incline Dumbbell Press',
            blockType: 'Strength',
            muscleGroup: 'Chest',
            sets: 4,
            reps: '8-10 reps',
            targetRpe: 8,
            restSeconds: 90,
            loadPercent1RM: 0.78,
            notes: 'Upper chest and tricep pressing power.',
          },
          {
            id: 'leo-d2-e3',
            movement_id: 'hand-release-pushup',
            name: '1-Minute Academy Push-Up Test Pacing',
            blockType: 'Accessory',
            muscleGroup: 'Chest',
            sets: 3,
            reps: '25-35 reps',
            targetRpe: 8.5,
            restSeconds: 90,
            isAccessory: true,
            notes: 'Strict full lockout; target top-quartile academy pace.',
          },
          {
            id: 'leo-d2-e4',
            movement_id: 'farmers-carry',
            name: 'Fat-Grip / Towel Heavy Farmers Hold',
            blockType: 'Carry',
            muscleGroup: 'Arms',
            sets: 4,
            reps: '45 sec hold',
            targetRpe: 8.5,
            restSeconds: 60,
            isAccessory: true,
            notes: 'Crushing grip endurance for defensive tactics.',
          },
        ],
      },
      {
        id: 'leo-d3',
        dayNumber: 3,
        title: 'POPAT / Obstacle Engine & 1.5-Mile Pacing',
        focus: 'Anaerobic obstacle transitions and 1.5-mile run standard',
        estimatedMinutes: 50,
        warmupSummary: '6 min jog + mobility + agility ladder / line hops',
        exercises: [
          {
            id: 'leo-d3-e1',
            movement_id: 'two-mile-run',
            name: '5 x 400m @ 1.5-Mile Goal Pace',
            blockType: 'Engine',
            muscleGroup: 'Full Body',
            sets: 5,
            reps: '400m fast / 75s rest',
            targetRpe: 8.5,
            restSeconds: 75,
            isHighImpact: true,
            notes: 'Consistent 1:35–1:45 laps for sub-10:30 1.5-mile readiness.',
            lowImpactSwap: {
              movement_id: 'assault-bike-cals',
              name: '5 x 90s Assault Bike / Erg Threshold Intervals',
              reps: '90s hard / 75s spin',
              notes: 'Zero-impact cardiovascular peak matching 1.5-mile race HR.',
              reason: 'Joint-safe anaerobic conditioning substitute.',
            },
          },
          {
            id: 'leo-d3-e2',
            movement_id: 'burpee-broad-jump',
            name: 'POPAT Floor-to-Standing Sprawl Shuttles',
            blockType: 'Engine',
            muscleGroup: 'Full Body',
            sets: 4,
            reps: '6 sprawls + 25m shuttle',
            targetRpe: 8.5,
            restSeconds: 90,
            isHighImpact: true,
            isAccessory: true,
            notes: 'Crisp drop-to-chest and rapid stand-up acceleration.',
            lowImpactSwap: {
              movement_id: 'skierg-1000m',
              name: 'SkiErg 200m Sprint + Controlled Step-Back Squat',
              reps: '200m Ski + 8 reps',
              notes: 'Zero floor-impact sprawl while maintaining rapid heart-rate spikes.',
              reason: 'Eliminates wrist/knee sprawl impact.',
            },
          },
        ],
      },
      {
        id: 'leo-d4',
        dayNumber: 4,
        title: 'High-Volume Shift Armor & Lower Stability',
        focus: 'Duty-gear spine resilience and unilateral leg strength',
        estimatedMinutes: 45,
        highVolumeOnly: true,
        warmupSummary: '5 min hip bridges, dead bugs, goblet pry',
        exercises: [
          {
            id: 'leo-d4-e1',
            movement_id: 'db-goblet-squat',
            name: 'Tempo Goblet Squat (3-1-1)',
            blockType: 'Strength',
            muscleGroup: 'Quads',
            sets: 4,
            reps: '10 reps',
            targetRpe: 8,
            restSeconds: 75,
            notes: 'Upright vest posture; braced core.',
          },
          {
            id: 'leo-d4-e2',
            movement_id: 'plank-hold',
            name: 'Front + Side Plank Duty-Belt Circuit',
            blockType: 'Core',
            muscleGroup: 'Core',
            sets: 3,
            reps: '45s each position',
            targetRpe: 8,
            restSeconds: 45,
            isAccessory: true,
            notes: '360-degree spinal armor for long patrol shifts.',
          },
        ],
      },
    ],
  },
  {
    id: 'engine-outlast',
    badge: 'Conditioning',
    category: 'Conditioning',
    title: 'Engine & Conditioning',
    focusSummary: 'Aerobic base capacity, lactate threshold power, and multi-erg work capacity.',
    frequencyLabel: '3–4 days/wk',
    standardDaysPerWeek: 3,
    highVolumeDaysPerWeek: 4,
    avgDurationMinutes: 45,
    equipment: ['Concept2 RowErg', 'SkiErg', 'Assault Bike', 'Run / Track'],
    accentColor: 'emerald',
    linkedProgramKey: 'apex_protocol',
    totalWeeks: 52,
    recommendedWarmupId: 'warmup-dime-mandatory',
    splitSummary: [
      'Day 1: Threshold Erg / Run Repeats (Zone 4)',
      'Day 2: Aerobic Base Builder (Zone 2, 45 min)',
      'Day 3: VO2 Max Mixed-Erg Power Intervals',
      'Day 4: High-Volume Long Engine Progression',
    ],
    sessions: [
      {
        id: 'eng-d1',
        dayNumber: 1,
        title: 'Lactate Threshold Engine (Zone 4)',
        focus: 'Raise sustainable pace ceiling across SkiErg, Rower, and Run',
        estimatedMinutes: 45,
        warmupSummary: '8 min progressive Zone 1->2 erg ramp + 3x15s crisp pulls',
        exercises: [
          {
            id: 'eng-d1-e1',
            movement_id: 'skierg-1000m',
            name: '3 x 1,000m SkiErg Threshold Repeats',
            blockType: 'Engine',
            muscleGroup: 'Full Body',
            sets: 3,
            reps: '1,000m @ 5K pace - 4s',
            targetRpe: 8.5,
            restSeconds: 150,
            notes: 'Target negative splits on set 3; crisp hip snap.',
            minimalGearSwap: {
              movement_id: 'two-mile-run',
              name: '3 x 1,000m Tempo Run Repeats',
              reps: '1,000m @ threshold',
              notes: 'Outdoor/treadmill threshold intervals.',
              reason: 'Erg-free threshold substitute.',
            },
          },
          {
            id: 'eng-d1-e2',
            movement_id: 'row-2000m',
            name: '2 x 1,500m RowErg Cruise Intervals',
            blockType: 'Engine',
            muscleGroup: 'Back',
            sets: 2,
            reps: '1,500m @ 24 spm',
            targetRpe: 8,
            restSeconds: 120,
            isAccessory: true,
            notes: 'Consistent split watts from meter 1 to meter 1,500.',
            minimalGearSwap: {
              movement_id: 'farmers-carry',
              name: '6-Min Brisk Loaded Carry / Incline March',
              reps: '6 min continuous',
              notes: 'Sustained aerobic output without Concept2 rower.',
              reason: 'Minimal-gear aerobic bridge.',
            },
          },
          {
            id: 'eng-d1-e3',
            movement_id: 'plank-hold',
            name: 'Post-Engine Breathing Reset Plank',
            blockType: 'Core',
            muscleGroup: 'Core',
            sets: 3,
            reps: '60 sec nasal breathing',
            targetRpe: 7,
            restSeconds: 45,
            isAccessory: true,
            notes: 'Lower heart rate rapidly via controlled 4-second exhales.',
          },
        ],
      },
      {
        id: 'eng-d2',
        dayNumber: 2,
        title: 'Zone 2 Aerobic Base Builder',
        focus: 'Mitochondrial density and low-HR cardiac efficiency',
        estimatedMinutes: 45,
        warmupSummary: '5 min easy cadence spin',
        exercises: [
          {
            id: 'eng-d2-e1',
            movement_id: 'two-mile-run',
            name: '40-Min Continuous Zone 2 Run (HR 135–148)',
            blockType: 'Engine',
            muscleGroup: 'Full Body',
            sets: 1,
            reps: '40 min steady aerobic',
            targetRpe: 6,
            restSeconds: 0,
            isHighImpact: true,
            notes: 'Conversational pace; zero ego sprinting.',
            lowImpactSwap: {
              movement_id: 'row-2000m',
              name: '40-Min Zone 2 RowErg / BikeErg Alternating Split',
              reps: '20m Row + 20m Bike @ Zone 2',
              notes: 'Identical cardiac stroke-volume stimulus with zero joint pounding.',
              reason: 'Zero-impact Zone 2 aerobic base builder.',
            },
          },
        ],
      },
      {
        id: 'eng-d3',
        dayNumber: 3,
        title: 'VO2 Max Assault Bike & Erg Power',
        focus: 'Peak oxygen uptake and rapid recovery between high-output bursts',
        estimatedMinutes: 40,
        warmupSummary: '7 min easy bike/row + 3x10s sprint primers',
        exercises: [
          {
            id: 'eng-d3-e1',
            movement_id: 'assault-bike-cals',
            name: '8 x 60s Assault Bike VO2 Intervals',
            blockType: 'Engine',
            muscleGroup: 'Full Body',
            sets: 8,
            reps: '60s hard / 60s easy',
            targetRpe: 9,
            restSeconds: 60,
            notes: 'Maintain target RPM/cal output within 10% across all 8 rounds.',
            minimalGearSwap: {
              movement_id: 'two-mile-run',
              name: '8 x 200m Hill / Track Stride Intervals',
              reps: '200m fast / 60s walk',
              notes: 'High-output aerobic power without fan bike.',
              reason: 'No Assault Bike available.',
            },
          },
          {
            id: 'eng-d3-e2',
            movement_id: 'pallof-press',
            name: 'Anti-Rotation Core Finisher',
            blockType: 'Core',
            muscleGroup: 'Core',
            sets: 3,
            reps: '12 reps/side',
            targetRpe: 7.5,
            restSeconds: 45,
            isAccessory: true,
            notes: 'Stabilize trunk for efficient erg and run mechanics.',
          },
        ],
      },
      {
        id: 'eng-d4',
        dayNumber: 4,
        title: 'High-Volume Mixed-Erg Pyramid',
        focus: 'Extended stamina across RowErg, SkiErg, and Carries',
        estimatedMinutes: 55,
        highVolumeOnly: true,
        warmupSummary: '6 min easy erg spin',
        exercises: [
          {
            id: 'eng-d4-e1',
            movement_id: 'row-2000m',
            name: 'Row 1000m + Ski 1000m + Carry 100m',
            blockType: 'Engine',
            muscleGroup: 'Full Body',
            sets: 3,
            reps: '1 full round @ Zone 3',
            targetRpe: 8,
            restSeconds: 180,
            notes: 'Smooth transitions; strong aerobic durability.',
          },
        ],
      },
    ],
  },
  {
    id: 'return-to-duty',
    badge: 'Rehab',
    category: 'Rehab',
    title: 'Low-Impact / Return-to-Duty',
    focusSummary: 'Joint-friendly strength, sled drives, and zero-impact erg conditioning.',
    frequencyLabel: '3–4 days/wk',
    standardDaysPerWeek: 3,
    highVolumeDaysPerWeek: 4,
    avgDurationMinutes: 42,
    equipment: ['SkiErg / Bike', 'Sled', 'Dumbbells', 'Bands'],
    accentColor: 'emerald',
    linkedProgramKey: 'tactical_hypertrophy',
    totalWeeks: 12,
    recommendedWarmupId: 'warmup-dime-mandatory',
    splitSummary: [
      'Day 1: Joint-Safe Lower Concentric & SkiErg',
      'Day 2: Scapular Upper Armor & Neutral Press',
      'Day 3: Zero-Impact Zone 2 Erg & Core Bracing',
      'Day 4: High-Volume Tissue Capacity & Carries',
    ],
    sessions: [
      {
        id: 'rtd-d1',
        dayNumber: 1,
        title: 'Joint-Safe Lower Strength & SkiErg Engine',
        focus: 'Zero impact, restricted flexion angles, and high concentric quad/glute drive',
        estimatedMinutes: 42,
        warmupSummary: '8 min isometric TKEs, glute bridge holds, gentle hip CARs',
        exercises: [
          {
            id: 'rtd-d1-e1',
            movement_id: 'sled-drag-carry',
            name: 'Backward Heavy Sled Drag (Zero Eccentric Load)',
            blockType: 'Strength',
            muscleGroup: 'Quads',
            sets: 4,
            reps: '40m controlled drag',
            targetRpe: 7.5,
            restSeconds: 90,
            notes: 'Pumps blood into patellar tendon and quads with zero joint pounding.',
            minimalGearSwap: {
              movement_id: 'controlled-step-up',
              name: 'Spanish Squat Isometric + Slow Concentric',
              reps: '12 reps (3s hold)',
              notes: 'Heavy band behind knees maintains vertical shin.',
              reason: 'Sled-free tendon-loading quad work.',
            },
          },
          {
            id: 'rtd-d1-e2',
            movement_id: 'controlled-step-up',
            name: 'Controlled Low-Box Step-Ups (14–16 in)',
            blockType: 'Strength',
            muscleGroup: 'Quads',
            sets: 4,
            reps: '10 reps/leg',
            targetRpe: 7.5,
            restSeconds: 75,
            isAccessory: true,
            notes: 'Keep knee aligned over 2nd toe; 2-second slow descent.',
          },
          {
            id: 'rtd-d1-e3',
            movement_id: 'db-rdl',
            name: 'Mid-Shin Dumbbell RDL (Restricted Depth)',
            blockType: 'Strength',
            muscleGroup: 'Hamstrings & Glutes',
            sets: 4,
            reps: '10 reps',
            targetRpe: 7.5,
            restSeconds: 90,
            loadPercent1RM: 0.72,
            notes: 'Stop above any hip pinch; squeeze glutes to neutral lockout.',
          },
          {
            id: 'rtd-d1-e4',
            movement_id: 'skierg-1000m',
            name: '4 x 500m Zero-Impact SkiErg Engine',
            blockType: 'Engine',
            muscleGroup: 'Full Body',
            sets: 4,
            reps: '500m @ RPE 7.5',
            targetRpe: 7.5,
            restSeconds: 75,
            isAccessory: true,
            notes: 'High cardiovascular return with zero footstrike load.',
            minimalGearSwap: {
              movement_id: 'farmers-carry',
              name: '4 x 60s Brisk DB March in Place',
              reps: '60s march / 45s rest',
              notes: 'Zero-impact heart rate elevation.',
              reason: 'No SkiErg required.',
            },
          },
          {
            id: 'rtd-d1-e5',
            movement_id: 'pallof-press',
            name: 'Dead-Bug / Pallof Low-Flexion Core Hold',
            blockType: 'Core',
            muscleGroup: 'Core',
            sets: 3,
            reps: '10 reps/side (3s hold)',
            targetRpe: 7,
            restSeconds: 45,
            isAccessory: true,
            notes: 'Neutral lumbar spine glued to floor/ribcage stacked.',
          },
        ],
      },
      {
        id: 'rtd-d2',
        dayNumber: 2,
        title: 'Shoulder-Safe Upper Armor & Pulling',
        focus: 'Neutral-grip pressing, scapular upward rotation, and lat strength',
        estimatedMinutes: 40,
        warmupSummary: '6 min band pull-aparts, external rotations, wall slides',
        exercises: [
          {
            id: 'rtd-d2-e1',
            movement_id: 'incline-db-press',
            name: 'Neutral-Grip Incline DB Press (Floor/30 deg)',
            blockType: 'Strength',
            muscleGroup: 'Chest',
            sets: 4,
            reps: '10 reps',
            targetRpe: 7.5,
            restSeconds: 90,
            loadPercent1RM: 0.74,
            notes: 'Palms facing each other protects anterior shoulder capsule.',
          },
          {
            id: 'rtd-d2-e2',
            movement_id: 'weighted-pull-up',
            name: 'Chest-Supported DB Row / Assisted Pull-Up',
            blockType: 'Strength',
            muscleGroup: 'Back',
            sets: 4,
            reps: '10 reps',
            targetRpe: 7.5,
            restSeconds: 90,
            notes: 'Full scapular depression and retraction without lower-back fatigue.',
          },
          {
            id: 'rtd-d2-e3',
            movement_id: 'farmers-carry',
            name: 'Controlled Suitcase Carry (Spinal Alignment)',
            blockType: 'Carry',
            muscleGroup: 'Core',
            sets: 3,
            reps: '40m/side',
            targetRpe: 7,
            restSeconds: 60,
            isAccessory: true,
            notes: 'Slow, deliberate steps; zero hip drop.',
          },
        ],
      },
      {
        id: 'rtd-d3',
        dayNumber: 3,
        title: 'Zero-Impact Aerobic Flush & Trunk Stability',
        focus: 'Zone 2 blood flow recovery and tendon perfusion',
        estimatedMinutes: 38,
        warmupSummary: '5 min easy spin + thoracic mobility',
        exercises: [
          {
            id: 'rtd-d3-e1',
            movement_id: 'assault-bike-cals',
            name: '30-Min Low-Resistance Assault Bike / Erg Zone 2',
            blockType: 'Engine',
            muscleGroup: 'Full Body',
            sets: 1,
            reps: '30 min steady @ HR 130-142',
            targetRpe: 6,
            restSeconds: 0,
            notes: 'Promotes recovery and keeps aerobic engine sharp during rehab.',
          },
          {
            id: 'rtd-d3-e2',
            movement_id: 'plank-hold',
            name: 'Bird-Dog & Forearm Plank Stability Sets',
            blockType: 'Core',
            muscleGroup: 'Core',
            sets: 3,
            reps: '45 sec hold',
            targetRpe: 7,
            restSeconds: 45,
            isAccessory: true,
            notes: 'Strict neutral spine; zero lumbar sag.',
          },
        ],
      },
      {
        id: 'rtd-d4',
        dayNumber: 4,
        title: 'High-Volume Tissue Resilience & Carries',
        focus: 'Additional eccentric control and grip capacity',
        estimatedMinutes: 40,
        highVolumeOnly: true,
        warmupSummary: '5 min banded hip/shoulder warm-up',
        exercises: [
          {
            id: 'rtd-d4-e1',
            movement_id: 'trap-bar-deadlift',
            name: 'Elevated High-Handle Trap Bar Tempo Pulls',
            blockType: 'Strength',
            muscleGroup: 'Hamstrings & Glutes',
            sets: 4,
            reps: '6 reps (3s lower)',
            targetRpe: 7.5,
            restSeconds: 120,
            loadPercent1RM: 0.72,
            notes: 'Rebuilds posterior chain confidence under controlled range of motion.',
          },
        ],
      },
    ],
  },
  {
    id: 'express-30',
    badge: 'Express',
    category: 'Express',
    title: '30-Minute Shift / Field Express',
    focusSummary: 'Zero-fluff 30-min superset blocks built for busy shift schedules & minimal gear.',
    frequencyLabel: '3–5 days/wk',
    standardDaysPerWeek: 4,
    highVolumeDaysPerWeek: 5,
    avgDurationMinutes: 30,
    equipment: ['Dumbbells', 'Kettlebell / Bench', 'Pull-Up Bar', 'Bodyweight'],
    accentColor: 'amber',
    linkedProgramKey: 'hybrid_db',
    totalWeeks: 12,
    recommendedWarmupId: 'warmup-dime-express-6min',
    splitSummary: [
      'Day 1: 30m Upper Push/Pull Density Supersets',
      'Day 2: 30m Lower Power & Carry Express',
      'Day 3: 30m Full-Body Metabolic DB Complex',
      'Day 4: 30m Posterior Chain & Core Armor',
      'Day 5: High-Volume 30m Shift Finisher EMOM',
    ],
    sessions: [
      {
        id: 'exp-d1',
        dayNumber: 1,
        title: '30-Min Upper Armor Density Supersets',
        focus: '6m warm-up + 20m antagonistic supersets + 4m finisher',
        estimatedMinutes: 30,
        warmupSummary: '6 min DIME warm-up (arm circles, thoracic rotations, band pulls)',
        exercises: [
          {
            id: 'exp-d1-e1',
            movement_id: 'incline-db-press',
            name: 'A1: Incline Dumbbell Bench Press',
            blockType: 'Strength',
            muscleGroup: 'Chest',
            sets: 4,
            reps: '8-10 reps',
            targetRpe: 8,
            restSeconds: 45,
            loadPercent1RM: 0.76,
            notes: 'Superset directly with A2 Pull-Ups; zero wasted clock time.',
          },
          {
            id: 'exp-d1-e2',
            movement_id: 'weighted-pull-up',
            name: 'A2: Strict Pull-Ups (or DB Bent-Over Row)',
            blockType: 'Strength',
            muscleGroup: 'Back',
            sets: 4,
            reps: '8-10 reps',
            targetRpe: 8,
            restSeconds: 60,
            notes: 'Full stretch at bottom, drive elbows into back pockets.',
          },
          {
            id: 'exp-d1-e3',
            movement_id: 'overhead-press',
            name: 'B1: Standing Neutral-Grip DB Overhead Press',
            blockType: 'Accessory',
            muscleGroup: 'Shoulders',
            sets: 3,
            reps: '10 reps',
            targetRpe: 8,
            restSeconds: 45,
            isAccessory: true,
            loadPercent1RM: 0.72,
            notes: 'Strict core lock; zero lower-back hyperextension.',
            lowImpactSwap: {
              movement_id: 'overhead-press',
              name: 'B1: Tall-Kneeling Single-Arm DB Press',
              reps: '10 reps/arm',
              notes: 'Locks ribcage down and eases shoulder/lumbar compression.',
              reason: 'Joint-friendly overhead pressing mechanics.',
            },
          },
          {
            id: 'exp-d1-e4',
            movement_id: 'farmers-carry',
            name: 'B2: Heavy DB Farmers Walk Finisher',
            blockType: 'Carry',
            muscleGroup: 'Core',
            sets: 3,
            reps: '40m brisk walk',
            targetRpe: 8,
            restSeconds: 45,
            isAccessory: true,
            notes: 'Immediate grip and trunk finisher to close out the 30-min block.',
          },
        ],
      },
      {
        id: 'exp-d2',
        dayNumber: 2,
        title: '30-Min Lower Power & Posterior Express',
        focus: 'High-density leg strength and hinge work with dumbbells only',
        estimatedMinutes: 30,
        warmupSummary: '6 min DIME lower prep (glute bridges, world’s greatest stretch)',
        exercises: [
          {
            id: 'exp-d2-e1',
            movement_id: 'db-goblet-squat',
            name: 'A1: Heavy Goblet Squat (2s Pause)',
            blockType: 'Strength',
            muscleGroup: 'Quads',
            sets: 4,
            reps: '10 reps',
            targetRpe: 8,
            restSeconds: 45,
            loadPercent1RM: 0.75,
            notes: 'Elbows tight, chest proud, explosive drive out of hole.',
            lowImpactSwap: {
              movement_id: 'controlled-step-up',
              name: 'A1: Controlled DB Box Step-Up',
              reps: '10 reps/leg',
              notes: 'Protects knees/hips while maximizing quad output.',
              reason: 'Limits deep hip/knee flexion.',
            },
          },
          {
            id: 'exp-d2-e2',
            movement_id: 'db-rdl',
            name: 'A2: Heavy Dumbbell Romanian Deadlift',
            blockType: 'Strength',
            muscleGroup: 'Hamstrings & Glutes',
            sets: 4,
            reps: '10 reps',
            targetRpe: 8,
            restSeconds: 60,
            loadPercent1RM: 0.76,
            notes: 'Hinge hips straight back; crisp hamstring tension.',
          },
          {
            id: 'exp-d2-e3',
            movement_id: 'plank-hold',
            name: 'B1: RKC Plank + Dead-Bug Core Block',
            blockType: 'Core',
            muscleGroup: 'Core',
            sets: 3,
            reps: '45 sec hold',
            targetRpe: 8,
            restSeconds: 30,
            isAccessory: true,
            notes: 'High-tension trunk bracing to finish inside 30 minutes.',
          },
        ],
      },
      {
        id: 'exp-d3',
        dayNumber: 3,
        title: '30-Min Tactical Conditioning Express',
        focus: '20-min EMOM work capacity with zero wasted transitions',
        estimatedMinutes: 30,
        warmupSummary: '5 min dynamic prep + movement rehearsal',
        exercises: [
          {
            id: 'exp-d3-e1',
            movement_id: 'burpee-broad-jump',
            name: '20-Min EMOM: Odd 10 Burpees / Even 12 DB Thrusters',
            blockType: 'Engine',
            muscleGroup: 'Full Body',
            sets: 5,
            reps: '4-min rounds (EMOM)',
            targetRpe: 8.5,
            restSeconds: 30,
            isHighImpact: true,
            notes: 'Move cleanly on the top of each minute; earn 20s recovery.',
            lowImpactSwap: {
              movement_id: 'skierg-1000m',
              name: '20-Min EMOM: Odd 150m SkiErg / Even 10 DB RDL + Carry',
              reps: '4-min low-impact rounds',
              notes: 'Zero burpee impact while keeping heart rate in Zone 3–4.',
              reason: 'Replaces high-impact burpees with SkiErg/low-impact hinge.',
            },
          },
        ],
      },
      {
        id: 'exp-d4',
        dayNumber: 4,
        title: '30-Min Posterior Chain & Arms Express',
        focus: 'Hinge power, rows, and push-up endurance',
        estimatedMinutes: 30,
        warmupSummary: '6 min DIME warm-up',
        exercises: [
          {
            id: 'exp-d4-e1',
            movement_id: 'db-rdl',
            name: 'Single-Leg Supported DB RDL',
            blockType: 'Strength',
            muscleGroup: 'Hamstrings & Glutes',
            sets: 4,
            reps: '8 reps/leg',
            targetRpe: 8,
            restSeconds: 60,
            notes: 'Rear toe kickstand for balance; heavy unilateral posterior work.',
          },
          {
            id: 'exp-d4-e2',
            movement_id: 'hand-release-pushup',
            name: 'Hand-Release Push-Up Density Sets',
            blockType: 'Accessory',
            muscleGroup: 'Chest',
            sets: 4,
            reps: '15 reps',
            targetRpe: 8,
            restSeconds: 45,
            isAccessory: true,
            notes: 'Strict chest contact every rep.',
          },
        ],
      },
      {
        id: 'exp-d5',
        dayNumber: 5,
        title: 'High-Volume 30-Min Shift Carry & Engine',
        focus: 'Extra busy-week conditioning and carry density',
        estimatedMinutes: 30,
        highVolumeOnly: true,
        warmupSummary: '5 min brisk walk + shoulder circles',
        exercises: [
          {
            id: 'exp-d5-e1',
            movement_id: 'farmers-carry',
            name: '15-Min AMRAP: 40m Carry + 10 Goblet Squat + 10 Push-Ups',
            blockType: 'Carry',
            muscleGroup: 'Full Body',
            sets: 4,
            reps: 'Continuous 15m pace',
            targetRpe: 8,
            restSeconds: 45,
            notes: 'Smooth tactical grit under clock pressure.',
          },
        ],
      },
    ],
  },
];

export function getTrainingTrackById(trackId: TrackId): TrainingTrack {
  return TRAINING_TRACKS.find((t) => t.id === trackId) || TRAINING_TRACKS[0];
}

/**
 * Default baseline global benchmarks (`user_benchmarks_and_logs`) keyed strictly by
 * Returns an empty benchmark array by default.
 * All PRs and maxes remain strictly at 0 until established through a completed
 * workout session or manually inputted by the user.
 */
export function buildDefaultGlobalBenchmarks(_userId: string): GlobalBenchmarkLog[] {
  return [];
}

const MOVEMENT_NAME_TO_ID_RULES: Array<{ pattern: RegExp; movementId: string }> = [
  { pattern: /trap bar|hex bar|deadlift/i, movementId: 'trap-bar-deadlift' },
  { pattern: /incline.*(db|dumbbell|bench)|bench press/i, movementId: 'incline-db-press' },
  { pattern: /pull-?up|chin-?up/i, movementId: 'weighted-pull-up' },
  { pattern: /back squat|front squat|box squat/i, movementId: 'back-squat' },
  { pattern: /goblet squat/i, movementId: 'db-goblet-squat' },
  { pattern: /rdl|romanian/i, movementId: 'db-rdl' },
  { pattern: /overhead press|military press|shoulder press|landmine press/i, movementId: 'overhead-press' },
  { pattern: /ski\s*erg/i, movementId: 'skierg-1000m' },
  { pattern: /row\s*erg|concept2|2,?000m row/i, movementId: 'row-2000m' },
  { pattern: /2[- ]?mile|two[- ]?mile|800m|400m.*run/i, movementId: 'two-mile-run' },
  { pattern: /farmer|suitcase carry/i, movementId: 'farmers-carry' },
  { pattern: /sled|sprint-drag-carry|sdc|rescue drag/i, movementId: 'sled-drag-carry' },
  { pattern: /hand-?release push|push-?up/i, movementId: 'hand-release-pushup' },
  { pattern: /plank/i, movementId: 'plank-hold' },
];

export function matchExerciseNameToMovementId(name: string): string | null {
  for (const rule of MOVEMENT_NAME_TO_ID_RULES) {
    if (rule.pattern.test(name)) {
      return rule.movementId;
    }
  }
  return null;
}

function getCanonicalMovementId(name: string): string {
  return (
    matchExerciseNameToMovementId(name) ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48)
  );
}

/**
 * Merges real completed WorkoutSessionLog records into the decoupled global
 * `user_benchmarks_and_logs` map by `movement_id`, preserving history across every track.
 * Only non-zero established performances are recorded.
 */
export function mergeWorkoutLogsIntoBenchmarks(
  baseBenchmarks: GlobalBenchmarkLog[],
  sessionLogs: WorkoutSessionLog[],
  userId: string
): GlobalBenchmarkLog[] {
  const byMovement = new Map<string, GlobalBenchmarkLog>();
  for (const bm of baseBenchmarks) {
    const hasRealValue =
      (bm.best_weight_lbs && bm.best_weight_lbs > 0) ||
      (bm.best_reps && bm.best_reps > 0) ||
      (bm.estimated_1rm_lbs && bm.estimated_1rm_lbs > 0) ||
      (bm.best_time_seconds && bm.best_time_seconds > 0);
    if (!hasRealValue) continue;
    byMovement.set(bm.movement_id, { ...bm, history: [...(bm.history || [])] });
  }

  const recordExerciseBest = (
    exerciseName: string,
    logDate: string,
    bestWeight: number,
    bestReps: number,
    best1Rm: number,
    lastRpe: number | undefined,
    bestTime: number,
    bestDistanceMeters: number
  ) => {
    if (bestWeight <= 0 && bestReps <= 0 && bestTime <= 0) return;
    const matchedId = getCanonicalMovementId(exerciseName);
    if (!matchedId) return;

    const existing = byMovement.get(matchedId);
    if (existing) {
      const updated: GlobalBenchmarkLog = {
        ...existing,
        best_weight_lbs: bestWeight > (existing.best_weight_lbs || 0) ? bestWeight : existing.best_weight_lbs,
        best_reps: bestReps > (existing.best_reps || 0) ? bestReps : existing.best_reps,
        estimated_1rm_lbs: best1Rm > (existing.estimated_1rm_lbs || 0) ? best1Rm : existing.estimated_1rm_lbs,
        best_distance_meters:
          bestDistanceMeters > (existing.best_distance_meters || 0)
            ? bestDistanceMeters
            : existing.best_distance_meters,
        last_rpe: lastRpe ?? existing.last_rpe,
        last_logged_date: logDate > existing.last_logged_date ? logDate : existing.last_logged_date,
        session_count: existing.session_count + 1,
        updated_at: new Date().toISOString(),
      };
      byMovement.set(matchedId, updated);
    } else {
      byMovement.set(matchedId, {
        id: `bm-${userId}-${matchedId}`,
        user_id: userId,
        movement_id: matchedId,
        movement_name: exerciseName,
        metric_type:
          bestDistanceMeters > 0 && bestWeight > 0
            ? 'carry_load'
            : bestWeight > 0
            ? 'load_pr'
            : bestTime > 0
            ? 'time_trial'
            : 'bodyweight_reps',
        best_weight_lbs: bestWeight > 0 ? bestWeight : undefined,
        best_reps: bestReps > 0 ? bestReps : undefined,
        estimated_1rm_lbs: best1Rm > 0 ? best1Rm : undefined,
        best_time_seconds: bestTime > 0 ? bestTime : undefined,
        best_distance_meters: bestDistanceMeters > 0 ? bestDistanceMeters : undefined,
        last_rpe: lastRpe,
        last_logged_date: logDate,
        session_count: 1,
        history: [
          {
            date: logDate,
            weight_lbs: bestWeight > 0 ? bestWeight : undefined,
            reps: bestReps > 0 ? bestReps : undefined,
            time_seconds: bestTime > 0 ? bestTime : undefined,
            distance_meters: bestDistanceMeters > 0 ? bestDistanceMeters : undefined,
            rpe: lastRpe,
          },
        ],
        updated_at: new Date().toISOString(),
      });
    }
  };

  for (const log of sessionLogs) {
    for (const ex of log.exercises || []) {
      let bestWeight = 0;
      let bestReps = 0;
      let best1Rm = 0;
      let lastRpe: number | undefined;
      let bestTime = 0;
      let bestDist = 0;

      // Also track individual superset sub-movements if logged
      const supersetAgg = new Map<
        string,
        { weight: number; reps: number; e1rm: number; dist: number; time: number }
      >();

      for (const s of ex.sets || []) {
        if (s.weightLbs && s.weightLbs > bestWeight) bestWeight = s.weightLbs;
        if (s.reps && s.reps > bestReps) bestReps = s.reps;
        const est =
          s.estimated1RM ||
          (s.weightLbs > 0 && s.reps > 0 ? Math.round(s.weightLbs * (1 + s.reps / 30)) : 0);
        if (est > best1Rm) best1Rm = est;
        if (typeof s.rpe === 'number') lastRpe = s.rpe;
        if (s.timeSeconds && s.timeSeconds > 0 && (bestTime === 0 || s.timeSeconds < bestTime)) {
          bestTime = s.timeSeconds;
        }
        if (s.distanceMeters && s.distanceMeters > bestDist) {
          bestDist = s.distanceMeters;
        }

        const subEntries = (s as any).supersetEntries;
        if (Array.isArray(subEntries)) {
          for (const sub of subEntries) {
            if (!sub?.name) continue;
            const prev = supersetAgg.get(sub.name) || { weight: 0, reps: 0, e1rm: 0, dist: 0, time: 0 };
            const w = Number(sub.weightLbs || 0);
            const r = Number(sub.reps || 0);
            const d = Number(sub.distanceMeters || 0);
            const t = Number(sub.timeSeconds || 0);
            const subEst = w > 0 && r > 0 ? Math.round(w * (1 + r / 30)) : 0;
            supersetAgg.set(sub.name, {
              weight: Math.max(prev.weight, w),
              reps: Math.max(prev.reps, r),
              e1rm: Math.max(prev.e1rm, subEst),
              dist: Math.max(prev.dist, d),
              time: t > 0 && (prev.time === 0 || t < prev.time) ? t : prev.time,
            });
          }
        }
      }

      recordExerciseBest(ex.exerciseName, log.date, bestWeight, bestReps, best1Rm, lastRpe, bestTime, bestDist);

      supersetAgg.forEach((stats, subName) => {
        recordExerciseBest(
          subName,
          log.date,
          stats.weight,
          stats.reps,
          stats.e1rm,
          lastRpe,
          stats.time,
          stats.dist
        );
      });
    }
  }

  return Array.from(byMovement.values());
}

function roundToNearest5(weight: number): number {
  return Math.max(5, Math.round(weight / 5) * 5);
}

/**
 * Dynamically transforms the selected track's sequential day session in real time
 * based on `volume_tier`, `constraint_mode`, and decoupled `user_benchmarks_and_logs`.
 */
export function transformSessionForProgramState(
  track: TrainingTrack,
  programState: UserProgramState,
  benchmarks: GlobalBenchmarkLog[],
  overrideDayIndex?: number
): TransformedWorkoutSession {
  const { volume_tier, constraint_mode } = programState;
  const activeSessions: WorkoutSession[] =
    volume_tier === 'standard'
      ? track.sessions.filter((s) => !s.highVolumeOnly)
      : track.sessions;

  const safeSessions = activeSessions.length > 0 ? activeSessions : track.sessions;
  const dayIdx = Math.max(1, overrideDayIndex ?? programState.sequential_day_index);
  const wrappedIndex = (dayIdx - 1) % safeSessions.length;
  const baseSession = safeSessions[wrappedIndex];

  const bmMap = new Map<string, GlobalBenchmarkLog>();
  for (const bm of benchmarks) {
    bmMap.set(bm.movement_id, bm);
  }

  let totalSetsOriginal = 0;
  let totalSetsAdjusted = 0;
  let swappedCount = 0;

  const transformedExercises: TransformedExercise[] = baseSession.exercises.map((ex) => {
    const originalSets = ex.sets;
    totalSetsOriginal += originalSets;

    let activeName = ex.name;
    let activeMovementId = ex.movement_id;
    let activeReps = ex.reps;
    let activeNotes = ex.notes;
    let activeMuscleGroup = ex.muscleGroup;
    let wasSwapped = false;
    let swapReason: string | undefined;
    let setsDelta = 0;

    if (constraint_mode === 'low_impact_rehab' && ex.lowImpactSwap) {
      activeName = ex.lowImpactSwap.name;
      activeMovementId = ex.lowImpactSwap.movement_id;
      activeReps = ex.lowImpactSwap.reps || ex.reps;
      activeNotes = ex.lowImpactSwap.notes;
      activeMuscleGroup = ex.lowImpactSwap.muscleGroup || ex.muscleGroup;
      swapReason = ex.lowImpactSwap.reason;
      setsDelta = ex.lowImpactSwap.setsDelta || 0;
      wasSwapped = true;
      swappedCount += 1;
    } else if (constraint_mode === 'minimal_gear' && ex.minimalGearSwap) {
      activeName = ex.minimalGearSwap.name;
      activeMovementId = ex.minimalGearSwap.movement_id;
      activeReps = ex.minimalGearSwap.reps || ex.reps;
      activeNotes = ex.minimalGearSwap.notes;
      activeMuscleGroup = ex.minimalGearSwap.muscleGroup || ex.muscleGroup;
      swapReason = ex.minimalGearSwap.reason;
      setsDelta = ex.minimalGearSwap.setsDelta || 0;
      wasSwapped = true;
      swappedCount += 1;
    }

    // Volume Tier adjustment: Standard trims accessory volume by ~20-25%
    let adjustedSets = Math.max(1, originalSets + setsDelta);
    let wasVolumeTrimmed = false;
    if (volume_tier === 'standard' && ex.isAccessory && adjustedSets >= 3) {
      const reduced = Math.max(2, Math.round(adjustedSets * 0.75));
      if (reduced < adjustedSets) {
        adjustedSets = reduced;
        wasVolumeTrimmed = true;
      }
    }

    totalSetsAdjusted += adjustedSets;

    const benchmark = bmMap.get(activeMovementId) || bmMap.get(ex.movement_id);
    let prescribedWeightLbs: number | undefined;
    if (benchmark?.estimated_1rm_lbs && ex.loadPercent1RM) {
      prescribedWeightLbs = roundToNearest5(benchmark.estimated_1rm_lbs * ex.loadPercent1RM);
    } else if (benchmark?.best_weight_lbs && ex.blockType === 'Carry') {
      prescribedWeightLbs = benchmark.best_weight_lbs;
    }

    return {
      ...ex,
      movement_id: activeMovementId,
      name: activeName,
      reps: activeReps,
      notes: activeNotes,
      muscleGroup: activeMuscleGroup,
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

  const estimatedMinutes =
    volume_tier === 'standard'
      ? Math.max(25, Math.round(baseSession.estimatedMinutes * 0.88))
      : baseSession.estimatedMinutes;

  return {
    trackId: track.id,
    trackTitle: track.title,
    weekNumber: 1,
    totalWeeks: track.totalWeeks || 1,
    phaseTitle: track.title,
    phaseWeeksLabel: track.frequencyLabel,
    dayInWeek: wrappedIndex + 1,
    sequentialDayIndex: dayIdx,
    totalCycleDays: safeSessions.length,
    isRestDay: false,
    session: baseSession,
    exercises: transformedExercises,
    totalSetsOriginal,
    totalSetsAdjusted,
    volumeReductionPct,
    swappedCount,
    estimatedMinutes,
  };
}
