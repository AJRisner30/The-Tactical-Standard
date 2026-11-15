import React, { useState, useEffect } from 'react';
import { 
  X, ChevronRight, ChevronLeft, Check, Compass, Film,
  Dumbbell, Timer, TrendingUp, Calculator, ShieldCheck, Zap, 
  Activity, Copy, CheckCircle2, Play, Flame, Award, 
  ExternalLink, ArrowRight, Eye, RefreshCw, Smartphone, Cloud, Share2,
  SlidersHorizontal
} from 'lucide-react';
import { TacticalStandardCompanyEmblem } from './BrandingLogos';
import { TabType } from './Navbar';

export interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenAIGenerator?: () => void;
  onOpenSingleDayWorkout?: () => void;
  onOpenQuestionnaire?: () => void;
  initialStepIndex?: number;
}

interface TourStep {
  id: string;
  badge: string;
  title: string;
  tagline: string;
  tabTarget: TabType;
  actionLabel?: string;
  actionCallback?: 'ai_generator' | 'single_day' | 'questionnaire' | 'navigate';
  icon: React.ElementType;
  iconColor: string;
  features: string[];
  locationTip: string;
  promoPitch: string;
  socialHook: string;
  visualPreviewType: 'readiness' | 'programs' | 'adaptive_ai' | 'live_tracker' | 'auto_overload' | 'pt_calculator' | 'coach_logs' | 'offline_perks';
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'readiness',
    badge: 'Warfighter Command Center',
    title: 'Daily Tactical Readiness Scoring',
    tagline: 'Gauge physical capacity and operational fatigue before every training session or field op',
    tabTarget: 'workouts',
    icon: Activity,
    iconColor: 'text-amber-400',
    locationTip: 'Found in: Workouts Tab → Top Status Bar & Readiness Gauge',
    features: [
      '1–100% composite score combining sleep quality, operational fatigue, muscle soreness, and hydration.',
      'Operational Tiers: Combat Peak (PR attempts), Mission Ready (optimal working volume), CNS Caution, and Deload.',
      'Ops-aware training recommendations: tells you when to push intensity and when to consolidate working weights.',
      'Personalized biometric baseline tracking for resting heart rate and recovery trends.'
    ],
    promoPitch: 'Stop training blindly under high field op tempo. The Tactical Standard scores your physical readiness every morning so you build combat strength without burning out.',
    socialHook: 'When your training system actually accounts for sleep debt, field ops, and heavy kit load.',
    visualPreviewType: 'readiness'
  },
  {
    id: 'programs',
    badge: 'Core Protocols',
    title: '4 Periodized Coach Risner Core Protocols',
    tagline: 'Mission-tested tracks from 8-week Military PT prep to 12-week Tactical Bodybuilding & the 52-week annual blueprint',
    tabTarget: 'workouts',
    actionLabel: 'Take Ability Matcher',
    actionCallback: 'questionnaire',
    icon: Award,
    iconColor: 'text-amber-400',
    locationTip: 'Found in: Workouts Tab → Program Selector & Diagnostic Ability Matcher',
    features: [
      'Military 52-Week Combat Readiness Program: 4-Quarter annual periodization covering Aerobic Base, Heavy Ruck & Armor Strength, Sprint Velocity & Combat Peak.',
      '12-Week Tactical Bodybuilding Program: Armor & Base, Power-Building & Peak Velocity with daily 8-min DIME warm-ups and High-Stress Ops Protocol.',
      '12-Week Hybrid Protocol: Full barbell/run architecture that also adapts 1-for-1 to Dumbbells & Bodyweight via the Adaptive Engine.',
      'Universal Military PT & Combat Standard (8-Week): Preparation for timed 1.5–2 mi runs, 300m sprints, and casualty drags.',
      'Mandatory DIME Warm-Up Protocol recommended daily across all programs for joint durability.'
    ],
    promoPitch: 'Built for modern warfighters and tactical athletes. Choose from 4 battle-tested Coach Risner training protocols—including the complete 52-Week Combat Readiness Program.',
    socialHook: 'Zero fluff. Complete 52-week periodized strength and conditioning built for combat readiness.',
    visualPreviewType: 'programs'
  },
  {
    id: 'adaptive_ai',
    badge: 'Adaptive AI',
    title: 'Adaptive AI Injury & Ability Engine',
    tagline: 'Surgically alters Coach Risner’s core programs around your injuries, ability level, and gear',
    tabTarget: 'workouts',
    actionLabel: 'Open Adaptive AI',
    actionCallback: 'ai_generator',
    icon: SlidersHorizontal,
    iconColor: 'text-amber-400',
    locationTip: 'Found in: Top Bar → "Adapt Program" or "Adapt This Program" on any protocol',
    features: [
      'Adapts Proven Core Programs: Modifies any of Coach Risner’s 4 master tracks—preserving authentic splits, mesocycles, and deload weeks instead of building random workouts.',
      '1-for-1 Clinical Injury Swaps: Automatically intercepts movements that aggravate hip labrum, lumbar disc, shoulder, or knee limitations and tags replacements ("Replaced: [Original]").',
      'Ability-Level Calibration: Scales sets, target reps, rest periods, and target RPE across Beginner, Intermediate, Advanced, and Elite tiers.',
      'Equipment & Conditioning Scaling: Converts barbell lifts to DB/bodyweight when deployed or away from a gym and swaps high-impact runs to low-impact tactical circuits.',
      'On-Demand Single Day Ops Sessions: Launch a standalone workout anytime without overwriting your active multi-week adapted plan.'
    ],
    promoPitch: 'Dealing with a torn hip labrum, bad knee, or limited deployment gear? Adaptive AI takes Coach Risner\'s core programs and surgically swaps aggravating exercises around your limitations.',
    socialHook: 'Stop letting a knee or back limitation sideline your readiness. Adaptive AI modifies tactical programs around your exact injuries.',
    visualPreviewType: 'adaptive_ai'
  },
  {
    id: 'live_tracker',
    badge: 'In-Session Tracking',
    title: 'Live Workout Tracker & Rest Countdown',
    tagline: 'Real-time set logging, live rest timer progress, and automatic 1RM calculation',
    tabTarget: 'workouts',
    icon: Timer,
    iconColor: 'text-emerald-400',
    locationTip: 'Found in: Workouts Tab → Tap any scheduled day → "Start Live Workout"',
    features: [
      'Friction-free set logging: Log weights, reps, and RPE with instant completion checkmarks.',
      'Uncluttered Rest Countdown: Prominent countdown digits, visual progress bar, +30s adjustment, and audible cues.',
      'Conditioning Stopwatch: Live split times and lap pacing for timed runs, interval sprints, and isometric holds.',
      'Dynamic 1RM Engine: Live calculation of your peak estimated one-rep max as you complete each set.'
    ],
    promoPitch: 'Zero clutter and built for the gym floor. Log your weights and RPE with one tap, hear your rest countdown, and monitor your estimated 1RM cleanly.',
    socialHook: 'High-contrast live workout execution with audible rest timers and instant 1RM telemetry.',
    visualPreviewType: 'live_tracker'
  },
  {
    id: 'auto_overload',
    badge: 'Progression Engine',
    title: 'Automated Progressive Overload & Set 1 Pacing',
    tagline: 'Starts at the low end of set/rep ranges and auto-calculates Set 2+ weights from Set 1 effort',
    tabTarget: 'workouts',
    icon: TrendingUp,
    iconColor: 'text-amber-400',
    locationTip: 'Found in: Live Workout Screen → Set 1 Auto-Pacing & Overload Banner',
    features: [
      'Low-End Range Start: Prescriptions with set/rep ranges (e.g., 3–4 × 10–12) automatically start at the low end (3 × 10) until your logged sessions earn volume expansion.',
      '3-Step Double Progression: 1. Reps First (hit top of rep range) → 2. Weight Second (+2.5–5 lbs upper / +5–10 lbs lower) → 3. Sets Third.',
      'Intra-Session Set 1 Auto-Pacing: As soon as you log Set 1, the engine automatically calculates and recommends weights for all remaining sets to maintain your target RPE.',
      'Every-4th-Week 40% Deloads: Built-in structural recovery weeks prevent overtraining and operational fatigue.'
    ],
    promoPitch: 'Never guess what weight to put on the bar again. Log your first set and The Tactical Standard calculates the exact working load for your remaining sets.',
    socialHook: 'Log Set 1 and let auto-regulation dial in your working weights for Sets 2, 3, and 4.',
    visualPreviewType: 'auto_overload'
  },
  {
    id: 'pt_calculator',
    badge: 'Test Simulators',
    title: 'Military PT & Combat Load Calculators',
    tagline: 'ACFT / PFT / CFT physical readiness benchmarks and rep-load percentages',
    tabTarget: 'calculator',
    actionLabel: 'Open Calculators Tab',
    actionCallback: 'navigate',
    icon: Calculator,
    iconColor: 'text-amber-400',
    locationTip: 'Found in: Top Navigation Bar → "Calculators" Tab',
    features: [
      'Military PT Test simulators with official scoring benchmarks (pushups, planks, sprint-drag-carry, 2-mi / 1.5-mi run).',
      'Instant percentile ranking and pass/fail grading against military service readiness standards.',
      'Rep-Max percentage load calculator: Instantly calculates 70%, 80%, 85%, and 90% of your 1RM for any lift.',
      'Aerobic heart-rate zone and running pace calculators for target combat fitness test run times.'
    ],
    promoPitch: 'Verify your ACFT, PFT, and special operations readiness benchmarks in seconds with exact scoring tables and rep-max load percentages.',
    socialHook: 'Verify your combat readiness score and target run splits in seconds.',
    visualPreviewType: 'pt_calculator'
  },
  {
    id: 'coach_logs',
    badge: 'Real Accountability',
    title: 'Warfighter Training Record & Live Coach AJ Feed',
    tagline: 'Train alongside Coach AJ with live verified training logs',
    tabTarget: 'logs',
    actionLabel: 'View Workout Logs',
    actionCallback: 'navigate',
    icon: ShieldCheck,
    iconColor: 'text-amber-400',
    locationTip: 'Found in: Top Navigation Bar → "Workout Logs" & "Progress" Tabs',
    features: [
      'Warfighter Training Record: Permanent historical record of every workout, total volume, tonnage, and exertion.',
      'Live Coach AJ Risner Feed: Every workout logged by Coach AJ appears live in your feed in real-time.',
      'Progress analytics: Interactive strength curves and tonnage graphs across upper and lower body compounds.',
      'Unit / Command export: Download full training log summaries for physical readiness records.'
    ],
    promoPitch: 'Real accountability. View Coach AJ Risner\'s live workout logs and maintain your verified Training Record across every training cycle.',
    socialHook: 'No fake workouts. Every session Coach AJ logs drops live into your feed.',
    visualPreviewType: 'coach_logs'
  },
  {
    id: 'offline_perks',
    badge: 'Field Ready & Perks',
    title: 'Offline Field Mode, Nutrition & Partner Perks',
    tagline: '100% offline logging, operational fueling guidelines, and exclusive partner discounts',
    tabTarget: 'contact',
    actionLabel: 'View Contact & Perks',
    actionCallback: 'navigate',
    icon: Compass,
    iconColor: 'text-emerald-400',
    locationTip: 'Found in: Top Navigation, Contact Tab, and Profile Modal',
    features: [
      'Progressive Web App (PWA): Install directly to your iPhone, Android, or PC home screen for native speed.',
      'Offline-First Capability: Logs workouts seamlessly in austere field environments or gyms without cellular signal.',
      'Operational Fueling Protocol: Meal timing, hydration formulas, and fatigue mitigation guidelines.',
      'Exclusive Partner Perk: 50 Cal Labz supplements discount with code "PATROLREADY".'
    ],
    promoPitch: 'Zero signal on deployment or in a concrete gym? The Tactical Standard works 100% offline and auto-syncs when signal returns.',
    socialHook: 'Built to log workouts offline in field gyms with zero cell service, auto-syncing on reconnect.',
    visualPreviewType: 'offline_perks'
  }
];

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenAIGenerator,
  onOpenSingleDayWorkout,
  onOpenQuestionnaire,
  initialStepIndex = 0,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStepIndex);
  const [promoMode, setPromoMode] = useState<boolean>(false);
  const [copiedPitch, setCopiedPitch] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(Math.max(0, Math.min(TOUR_STEPS.length - 1, initialStepIndex)));
      setCopiedPitch(false);
    }
  }, [isOpen, initialStepIndex]);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const StepIcon = step.icon;
  const isFirst = currentStep === 0;
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      setCurrentStep((prev) => Math.min(TOUR_STEPS.length - 1, prev + 1));
      setCopiedPitch(false);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setCopiedPitch(false);
  };

  const handleComplete = () => {
    try {
      localStorage.setItem('patrol_ready_tour_completed_v1', 'true');
      localStorage.removeItem('patrol_ready_show_tour');
      if (dontShowAgain) {
        localStorage.setItem('patrol_ready_never_show_tour', 'true');
      }
    } catch {}
    onClose();
  };

  const handleJumpToFeatureInApp = () => {
    if (step.actionCallback === 'ai_generator' && onOpenAIGenerator) {
      onClose();
      onOpenAIGenerator();
      return;
    }
    if (step.actionCallback === 'single_day' && onOpenSingleDayWorkout) {
      onClose();
      onOpenSingleDayWorkout();
      return;
    }
    if (step.actionCallback === 'questionnaire' && onOpenQuestionnaire) {
      onClose();
      onOpenQuestionnaire();
      return;
    }
    onNavigateTab(step.tabTarget);
    onClose();
  };

  const handleCopyPitch = () => {
    const textToCopy = `${step.title}\n${step.promoPitch}\n\nSocial Hook: ${step.socialHook}\n\nTrain at The Tactical Standard`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#090b0d] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] relative">
        
        {/* Top Header Bar */}
        <div className="bg-[#0e1217] border-b border-zinc-800 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <TacticalStandardCompanyEmblem size="xs" className="h-7 w-auto drop-shadow" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-athletic font-black uppercase tracking-wider text-white text-xs sm:text-sm truncate">
                  The Tactical Standard Tour
                </span>
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold shrink-0">
                  · Feature Guide
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono truncate hidden sm:block">
                Everything you need to know about your tactical training system
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Promotional Mode Toggle Button */}
            <button
              type="button"
              onClick={() => setPromoMode(!promoMode)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold font-athletic uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                promoMode
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md font-black'
                  : 'bg-[#141a21] text-amber-300 border-amber-500/40 hover:bg-amber-950/40'
              }`}
              title="Toggle Promotional Demo Mode with copy-ready pitch and caption hooks"
            >
              <Film className={`w-3.5 h-3.5 ${promoMode ? 'text-black' : 'text-amber-400'}`} />
              <span>Promo Demo</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleComplete}
              className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Close tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progression Timeline */}
        <div className="bg-[#090b0d] px-4 py-2 border-b border-zinc-800/80 overflow-x-auto flex items-center gap-1.5 shrink-0 topbar-scroll">
          {TOUR_STEPS.map((s, idx) => {
            const isCurrent = idx === currentStep;
            const isPassed = idx < currentStep;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setCurrentStep(idx);
                  setCopiedPitch(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  isCurrent
                    ? 'bg-amber-500 text-black shadow-md border border-amber-400 font-black'
                    : isPassed
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/40'
                    : 'bg-[#141a21] text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                }`}
                title={`Jump to ${s.title}`}
              >
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 tabular-nums">
                  {isPassed ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                </span>
                <span className="truncate max-w-[110px] sm:max-w-none">{s.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Promotional Pitch Box (Visible when Promo Mode is On) */}
          {promoMode && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950/50 via-[#181308] to-amber-950/40 border border-amber-500/50 text-xs shadow-lg animate-in fade-in space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/30 pb-2">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-400" />
                  <span className="font-athletic font-black uppercase text-amber-300 text-xs tracking-wider">
                    Promotional Demo & Reel Hook Copy
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPitch}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-black font-mono text-[11px] rounded-lg transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm active:scale-95"
                >
                  {copiedPitch ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Caption</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-1.5 text-zinc-300">
                <p className="leading-relaxed">
                  <strong className="text-amber-200">Pitch: </strong>
                  {step.promoPitch}
                </p>
                <p className="text-zinc-400 font-mono text-[11px]">
                  <strong className="text-amber-300">Social Hook: </strong>
                  {step.socialHook}
                </p>
              </div>
            </div>
          )}

          {/* Main 2-Column Feature Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Left Column: Feature Details & Location Guidance (7 cols) */}
            <div className="lg:col-span-7 bg-[#0e1217] border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Badge & Step indicator */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 tabular-nums">
                      Step {currentStep + 1} of {TOUR_STEPS.length} · {step.badge}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Tab: {step.tabTarget}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-athletic tracking-wide leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-snug">
                    {step.tagline}
                  </p>
                </div>

                {/* Bulleted Feature Highlights */}
                <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                  <span className="text-[11px] font-athletic font-bold uppercase tracking-wider text-zinc-400 block">
                    What This Does For You:
                  </span>
                  <div className="space-y-1.5">
                    {step.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-zinc-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location & Quick Jump Callout */}
              <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#141a21] p-3 rounded-xl border border-zinc-800">
                <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5 min-w-0 truncate">
                  <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{step.locationTip}</span>
                </div>
                <button
                  type="button"
                  onClick={handleJumpToFeatureInApp}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1 shadow-sm whitespace-nowrap"
                  title="Switch to this feature in the app"
                >
                  <span>{step.actionLabel || 'Jump to Feature'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Visual Preview Mockup (5 cols) */}
            <div className="lg:col-span-5 bg-[#0e1217] border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-center space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                <span className="text-[11px] font-athletic font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  Live Preview Snapshot
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  Interactive UI
                </span>
              </div>

              {/* Dynamic Feature Mockup Rendering */}
              {step.visualPreviewType === 'readiness' && (
                <div className="space-y-3 p-3.5 rounded-xl bg-[#141a21] border border-amber-500/30 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-200">Daily Tactical Readiness</span>
                    <span className="text-emerald-400 font-mono font-black text-sm tabular-nums">88% Ready</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 w-[88%] rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded bg-[#090b0d] border border-zinc-800">
                      <span className="text-zinc-400 block text-[9px]">Op Tempo:</span>
                      <span className="text-amber-300 font-bold">High Stress / Ops</span>
                    </div>
                    <div className="p-2 rounded bg-[#090b0d] border border-zinc-800">
                      <span className="text-zinc-400 block text-[9px]">Recommendation:</span>
                      <span className="text-emerald-300 font-bold">Optimal PR Zone</span>
                    </div>
                  </div>
                </div>
              )}

              {step.visualPreviewType === 'programs' && (
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#141a21] border border-amber-500/40">
                    <div className="flex items-center justify-between font-bold text-amber-200">
                      <span>52-Week Combat Readiness</span>
                      <span className="text-[10px] font-mono text-amber-400 tabular-nums">52 Weeks</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">4-Quarter strength, ruck stamina, sprint velocity &amp; combat peak.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141a21] border border-zinc-800">
                    <div className="flex items-center justify-between font-bold text-zinc-200">
                      <span>12-Week Hybrid Protocol (AI DB Ready)</span>
                      <span className="text-[10px] font-mono text-amber-400 tabular-nums">12 Weeks</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Full gym or AI-adapted Dumbbell &amp; Bodyweight + DIME Warm-Up.</p>
                  </div>
                </div>
              )}

              {step.visualPreviewType === 'adaptive_ai' && (
                <div className="space-y-2.5 p-3 rounded-xl bg-[#141a21] border border-amber-500/30 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5 font-athletic uppercase">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                      12-Wk Tactical Bodybuilding · Adapted
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 font-bold">
                      Hip-Sparing
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#090b0d] border border-amber-500/40 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white">Box Squat to Parallel</span>
                      <span className="font-mono text-amber-300 font-bold tabular-nums">3 × 8-10 · RPE 7.5</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
                      <span className="text-amber-300 flex items-center gap-1">
                        <RefreshCw className="w-2.5 h-2.5" />
                        Replaced: Barbell Back Squat
                      </span>
                      <span className="text-zinc-500" aria-hidden="true">·</span>
                      <span className="text-zinc-300">
                        Beginner Scaled (-1 Set)
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between border-b border-zinc-800 pb-1">
                      <span className="text-zinc-400">Equipment Match:</span>
                      <span className="text-white font-mono font-bold">DB &amp; Home Gym Ready</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Conditioning:</span>
                      <span className="text-emerald-400 font-mono font-bold">Low-Impact Circuit Swap</span>
                    </div>
                  </div>
                </div>
              )}

              {step.visualPreviewType === 'live_tracker' && (
                <div className="space-y-2.5 p-3 rounded-xl bg-[#141a21] border border-emerald-500/40 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-200">Live Rest Interval</span>
                    <span className="text-amber-400 font-mono font-black text-sm tabular-nums">01:15</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 w-[60%]" />
                  </div>
                  <div className="p-2 rounded bg-[#090b0d] border border-zinc-800 flex items-center justify-between text-[11px] font-mono tabular-nums">
                    <span className="text-zinc-400">Set 2: 225 lbs × 8</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Done
                    </span>
                  </div>
                </div>
              )}

              {step.visualPreviewType === 'auto_overload' && (
                <div className="space-y-2 p-3 rounded-xl bg-[#141a21] border border-amber-500/40 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold font-athletic uppercase">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Auto-Overload Engine
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-snug tabular-nums">
                    Target <strong>230 lbs</strong> (+5 lbs) recommended for next week.
                  </p>
                  <div className="pt-1">
                    <span className="px-2 py-1 rounded bg-amber-500 text-black font-mono text-[10px] font-black inline-block">
                      Apply Overload to All Sets
                    </span>
                  </div>
                </div>
              )}

              {step.visualPreviewType === 'pt_calculator' && (
                <div className="space-y-2 p-3 rounded-xl bg-[#141a21] border border-amber-500/30 text-xs font-mono tabular-nums">
                  <div className="flex items-center justify-between font-bold text-amber-300">
                    <span>Military PT Readiness</span>
                    <span className="text-emerald-400">PASS (92%)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="p-1.5 rounded bg-[#090b0d] border border-zinc-800">
                      <span className="text-zinc-500 block">Push-Ups:</span>
                      <span className="text-white font-bold">48 reps</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#090b0d] border border-zinc-800">
                      <span className="text-zinc-500 block">1.5 Mi Run:</span>
                      <span className="text-white font-bold">10:45 min</span>
                    </div>
                  </div>
                </div>
              )}

              {step.visualPreviewType === 'coach_logs' && (
                <div className="space-y-2 p-3 rounded-xl bg-[#141a21] border border-amber-500/30 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-black font-black text-[10px] flex items-center justify-center">
                        AJ
                      </div>
                      <span className="font-bold text-amber-300">Coach AJ Live Feed</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">Just Now</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 tabular-nums">
                    Heavy Barbell Squats + 4x400m interval sprints logged. Total Volume: 18,450 lbs.
                  </p>
                </div>
              )}

              {step.visualPreviewType === 'offline_perks' && (
                <div className="space-y-2 p-3 rounded-xl bg-[#141a21] border border-emerald-500/30 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 flex items-center gap-1">
                      <Cloud className="w-3.5 h-3.5" />
                      Offline Mode Active
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">Syncs on Signal</span>
                  </div>
                  <div className="p-2 rounded bg-amber-950/30 border border-amber-500/30 text-[11px]">
                    <div className="font-bold text-amber-300">50 Cal Labz Partner Code</div>
                    <div className="font-mono text-zinc-300 text-[10px] mt-0.5">Use code <strong className="text-white">PATROLREADY</strong> for warfighter discount.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="bg-[#0e1217] border-t border-zinc-800 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0 cursor-pointer"
              />
              <span className="text-[11px]">Don't auto-open again on sign-in</span>
            </label>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={isFirst}
              onClick={handlePrev}
              className="px-3.5 py-2 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {isLast ? (
              <button
                type="button"
                onClick={handleComplete}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider text-xs font-athletic flex items-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>Complete Tour & Start Training</span>
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs font-athletic flex items-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>Next Feature</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
