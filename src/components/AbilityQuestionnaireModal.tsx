import React, { useState } from 'react';
import {
  X, ShieldCheck, Dumbbell, Activity, CheckCircle2,
  ArrowRight, ArrowLeft, Award, Zap,
  RefreshCw, Check
} from 'lucide-react';
import { AthleteProfile, ProgramKey, QuestionnaireAnswers } from '../types';
import {
  PUSH_UP_OPTIONS,
  PULL_UP_OPTIONS,
  AEROBIC_OPTIONS,
  EQUIPMENT_OPTIONS,
  EXPERIENCE_OPTIONS,
  GOAL_OPTIONS,
  PAT_PREPARATION_OPTIONS,
  calculateProgramRecommendation,
  RecommendationResult
} from '../utils/questionnaireEngine';
import { TacticalStandardCompanyEmblem } from './BrandingLogos';

interface AbilityQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAthlete: AthleteProfile;
  onSaveQuestionnaire: (answers: QuestionnaireAnswers, recommendedProgram: ProgramKey) => void;
  onOpenAIGenerator?: () => void;
}

export const AbilityQuestionnaireModal: React.FC<AbilityQuestionnaireModalProps> = ({
  isOpen,
  onClose,
  currentAthlete,
  onSaveQuestionnaire,
  onOpenAIGenerator,
}) => {
  const existing = currentAthlete.questionnaire;

  // Step 1: Military PT Test Trigger & Benchmarks
  const [preparingForPat, setPreparingForPat] = useState<QuestionnaireAnswers['preparingForPat']>(
    existing?.preparingForPat || 'no_general_tactical'
  );
  const [pushUpScore, setPushUpScore] = useState<QuestionnaireAnswers['pushUpScore']>(
    existing?.pushUpScore || '15_to_30'
  );
  const [pullUpScore, setPullUpScore] = useState<QuestionnaireAnswers['pullUpScore']>(
    existing?.pullUpScore || '1_to_5'
  );
  const [aerobicScore, setAerobicScore] = useState<QuestionnaireAnswers['aerobicScore']>(
    existing?.aerobicScore || '10_30_to_13_min'
  );

  // Step 2: Training logistics
  const [equipmentAccess, setEquipmentAccess] = useState<QuestionnaireAnswers['equipmentAccess']>(
    existing?.equipmentAccess || 'full_tactical_gym'
  );
  const [liftingExperience, setLiftingExperience] = useState<QuestionnaireAnswers['liftingExperience']>(
    existing?.liftingExperience || 'intermediate'
  );
  const [weeklyDays, setWeeklyDays] = useState<QuestionnaireAnswers['weeklyDays']>(
    existing?.weeklyDays || 4
  );
  const [injuryConstraints, setInjuryConstraints] = useState<string>(
    existing?.injuryConstraints || ''
  );

  // Step 3: Goals
  const [primaryGoalCategory, setPrimaryGoalCategory] = useState<QuestionnaireAnswers['primaryGoalCategory']>(
    existing?.primaryGoalCategory || 'tactical_duty_readiness'
  );

  // Wizard state: 1, 2, 3, 4 (Result)
  const [currentStep, setCurrentStep] = useState<number>(existing ? 4 : 1);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(() => {
    if (existing) {
      return calculateProgramRecommendation({
        pushUpScore: existing.pushUpScore,
        pullUpScore: existing.pullUpScore,
        aerobicScore: existing.aerobicScore,
        equipmentAccess: existing.equipmentAccess,
        liftingExperience: existing.liftingExperience,
        weeklyDays: existing.weeklyDays,
        primaryGoalCategory: existing.primaryGoalCategory,
        injuryConstraints: existing.injuryConstraints,
      });
    }
    return null;
  });

  const [appliedProgramMsg, setAppliedProgramMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCalculateRecommendation = () => {
    const result = calculateProgramRecommendation({
      preparingForPat,
      pushUpScore,
      pullUpScore,
      aerobicScore,
      equipmentAccess,
      liftingExperience,
      weeklyDays,
      primaryGoalCategory,
      injuryConstraints,
    });
    setRecommendation(result);
    setCurrentStep(4);
  };

  const handleApplyProgram = (overrideProgramKey?: ProgramKey) => {
    if (!recommendation) return;

    const chosenKey = overrideProgramKey || recommendation.programKey;
    const finalAnswers: QuestionnaireAnswers = {
      completedAt: new Date().toISOString(),
      preparingForPat,
      pushUpScore,
      pullUpScore,
      aerobicScore,
      equipmentAccess,
      liftingExperience,
      weeklyDays,
      primaryGoalCategory,
      ...(injuryConstraints.trim() ? { injuryConstraints: injuryConstraints.trim() } : {}),
      recommendedProgramKey: chosenKey,
      recommendedProgramTitle: recommendation.programTitle,
      recommendationReason: recommendation.primaryRationale,
      recommendedStartingWeek: recommendation.startingWeek,
      fitnessTier: recommendation.fitnessTier,
    };

    onSaveQuestionnaire(finalAnswers, chosenKey);
    setAppliedProgramMsg(
      chosenKey === 'custom_ai'
        ? 'Launching Adaptive Program Engine...'
        : `Enrolled in ${recommendation.programTitle}!`
    );
    setTimeout(() => {
      setAppliedProgramMsg(null);
      onClose();
      if (chosenKey === 'custom_ai') {
        onOpenAIGenerator?.();
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#090b0d] border border-amber-500/35 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Tactical Brass Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-500" />

        {/* Modal Top Rail */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-[#0e1217] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <TacticalStandardCompanyEmblem size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 font-athletic">
                  Combat Readiness Assessment
                </span>
                <span className="text-[10px] bg-amber-500/15 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded font-mono tabular-nums">
                  {currentStep <= 3 ? `Step ${currentStep} of 3` : 'Diagnostic Match'}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white font-athletic tracking-wide uppercase">
                Physical Ability &amp; Program Matcher
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            title="Close Assessment"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-zinc-900 h-1 shrink-0">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-400 transition-all duration-300"
            style={{ width: `${(Math.min(currentStep, 3) / 3) * 100}%` }}
          />
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* ============================================================ */}
          {/* STEP 1: PHYSICAL ABILITY BENCHMARKS                         */}
          {/* ============================================================ */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-tab-fade">
              <div className="border-b border-zinc-800/80 pb-3">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  Step 1: Your Baseline Physical Capacity
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Be honest with your current numbers. This ensures you start at an overload intensity that builds combat durability without early burnout or injury.
                </p>
              </div>

              {/* HIGH PRIORITY: Military PT Test (ACFT/PFT/CFT) Preparation Question */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#141a21] to-[#0e1217] border-2 border-amber-500/50 shadow-lg space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300 flex items-center gap-2 font-athletic">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Military PT Test (ACFT / PFT / CFT) &amp; Selection Prep</span>
                  </label>
                  <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    High Priority Filter
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-snug">
                  Are you currently preparing for an upcoming Military PT Test (ACFT, Marine PFT/CFT, Navy PRT, Air Force PT) or Selection Course?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {PAT_PREPARATION_OPTIONS.map((opt) => {
                    const isSelected = preparingForPat === opt.id;
                    const isYes = opt.id === 'yes_upcoming_pat';
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setPreparingForPat(opt.id);
                          if (isYes && primaryGoalCategory !== 'aft_specific_testing') {
                            setPrimaryGoalCategory('universal_pat_testing');
                          }
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? isYes
                              ? 'bg-amber-950/70 border-amber-400 shadow-md ring-2 ring-amber-400/40 text-white'
                              : 'bg-zinc-900 border-amber-400 shadow-md ring-2 ring-amber-400/30 text-white'
                            : 'bg-[#090b0d] border-zinc-800 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs sm:text-sm font-bold font-athletic uppercase">
                            {opt.label}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 shrink-0 text-amber-400" />
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                          {opt.description}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {preparingForPat === 'yes_upcoming_pat' && (
                  <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2 animate-in fade-in duration-200">
                    <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-athletic uppercase tracking-wide">
                        Universal Military PT Protocol Activated
                      </strong>
                      <span className="text-amber-200/90 text-[11px]">
                        This evaluation will direct-match you to the 8-Week Universal Military PT &amp; Selection Readiness Protocol, prioritizing 2-mile/3-mile timed run pace, anaerobic shuttle sprints, strict push-up/plank/pull-up volume, and combat casualty drag/carry power.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 1. Push-ups */}
              <div className="space-y-2.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                  <span>1. Max Unbroken Push-ups (Chest-to-Floor)</span>
                  <span className="text-[10px] text-amber-400 font-mono">Upper Body Pushing Endurance</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PUSH_UP_OPTIONS.map((opt) => {
                    const isSelected = pushUpScore === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPushUpScore(opt.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400/40 text-white'
                            : 'bg-[#0e1217] border-zinc-800 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-bold font-athletic uppercase">{opt.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                        </div>
                        <span className="text-[11px] text-zinc-400 mt-1 leading-snug">{opt.sublabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Pull-ups */}
              <div className="space-y-2.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                  <span>2. Strict Pull-ups (Dead-Hang, No Kipping)</span>
                  <span className="text-[10px] text-amber-400 font-mono">Posterior Chain &amp; Pulling Strength</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PULL_UP_OPTIONS.map((opt) => {
                    const isSelected = pullUpScore === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPullUpScore(opt.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400/40 text-white'
                            : 'bg-[#0e1217] border-zinc-800 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-bold font-athletic uppercase">{opt.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                        </div>
                        <span className="text-[11px] text-zinc-400 mt-1 leading-snug">{opt.sublabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Aerobic Run Pace */}
              <div className="space-y-2.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                  <span>3. Timed 1.5–2.0 Mile Run or Aerobic Base</span>
                  <span className="text-[10px] text-amber-400 font-mono">Military PT Standard</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AEROBIC_OPTIONS.map((opt) => {
                    const isSelected = aerobicScore === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAerobicScore(opt.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400/40 text-white'
                            : 'bg-[#0e1217] border-zinc-800 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-bold font-athletic uppercase">{opt.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                        </div>
                        <span className="text-[11px] text-zinc-400 mt-1 leading-snug">{opt.sublabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: EQUIPMENT ACCESS & SCHEDULE                         */}
          {/* ============================================================ */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-tab-fade">
              <div className="border-b border-zinc-800/80 pb-3">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-amber-400" />
                  Step 2: Training Environment &amp; Schedule
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  We match your protocol to what gear you actually have available on base, deployed, or at home.
                </p>
              </div>

              {/* Equipment */}
              <div className="space-y-2.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-300">
                  Equipment Available
                </label>
                <div className="space-y-2">
                  {EQUIPMENT_OPTIONS.map((opt) => {
                    const isSelected = equipmentAccess === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setEquipmentAccess(opt.id)}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400/40 text-white'
                            : 'bg-[#0e1217] border-zinc-800 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <div>
                          <span className="text-xs sm:text-sm font-bold block">{opt.label}</span>
                          <span className="text-[11px] text-zinc-400 block mt-0.5">{opt.sublabel}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lifting History */}
              <div className="space-y-2.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-300">
                  Strength Training Experience
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {EXPERIENCE_OPTIONS.map((opt) => {
                    const isSelected = liftingExperience === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setLiftingExperience(opt.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400/40 text-white'
                            : 'bg-[#0e1217] border-zinc-800 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">{opt.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                        </div>
                        <span className="text-[10px] text-zinc-400">{opt.sublabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weekly Days */}
              <div className="space-y-2.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                  <span>Target Training Days Per Week</span>
                  <span className="text-[10px] text-amber-400 font-mono">Resistance + Conditioning</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 4, 5, 6].map((days) => {
                    const isSelected = weeklyDays === days;
                    return (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setWeeklyDays(days as 3 | 4 | 5 | 6)}
                        className={`py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-black border-amber-400 shadow-md font-black'
                            : 'bg-[#0e1217] border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <span className="text-sm font-black font-mono tabular-nums block">{days} Days</span>
                        <span className="text-[9px] opacity-80 block font-athletic uppercase">
                          {days === 3 ? 'Minimal' : days === 4 ? 'Optimal' : days === 5 ? 'High Volume' : 'Elite Split'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Injury Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">
                  Deployment Schedule or Joint Limitations <span className="text-zinc-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={injuryConstraints}
                  onChange={(e) => setInjuryConstraints(e.target.value)}
                  placeholder="e.g., 24-hr CQ/Staff Duty shifts, lower back caution with heavy deadlifts"
                  className="w-full bg-[#0e1217] border border-zinc-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: MISSION GOALS                                       */}
          {/* ============================================================ */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-tab-fade">
              <div className="border-b border-zinc-800/80 pb-3">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Step 3: Your Primary Mission Goal
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  What is your highest priority outcome over the upcoming training cycle?
                </p>
              </div>

              <div className="space-y-2.5">
                {GOAL_OPTIONS.map((g) => {
                  const isSelected = primaryGoalCategory === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setPrimaryGoalCategory(g.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400/40 text-white'
                          : 'bg-[#0e1217] border-zinc-800 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-black font-athletic uppercase text-white">
                            {g.label}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            {g.badge}
                          </span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {g.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 4: RECOMMENDATION & DIAGNOSTIC REPORT                   */}
          {/* ============================================================ */}
          {currentStep === 4 && recommendation && (
            <div className="space-y-6 animate-tab-fade">
              {/* Tactical Tier Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#141a21] via-[#0e1217] to-[#141a21] border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/45 flex items-center justify-center text-amber-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                      Calculated Readiness Classification
                    </span>
                    <span className="text-base sm:text-lg font-black text-white font-athletic uppercase">
                      {recommendation.fitnessTier}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <span className="text-xs text-zinc-300 font-mono tabular-nums">
                    {weeklyDays} Days/Wk Target
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs text-amber-400 font-mono font-bold">
                    {equipmentAccess === 'bodyweight_dumbbells' ? 'DB & BW' : 'Full Gym'}
                  </span>
                </div>
              </div>

              {/* Recommended Program Showcase Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1217] border-2 border-amber-400 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl font-athletic tracking-wider shadow">
                  Top Tactical Match
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">
                      Recommended Beginning Track
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white font-athletic tracking-wide uppercase">
                    {recommendation.programTitle}
                  </h3>

                  <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold">
                      {recommendation.durationText}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {recommendation.weeklySplit}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
                      Start: {recommendation.startingPhaseTitle}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-2 border-t border-zinc-800">
                    {recommendation.primaryRationale}
                  </p>

                  {recommendation.equipmentNotice && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{recommendation.equipmentNotice}</span>
                    </div>
                  )}

                  {/* Key Action Points */}
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 font-athletic block">
                      Program Directives &amp; Overload Focus:
                    </span>
                    <div className="space-y-1">
                      {recommendation.keyActionPoints.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
                  {recommendation.programKey === 'custom_ai' ? (
                    <button
                      type="button"
                      onClick={() => handleApplyProgram()}
                      className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-athletic font-black uppercase text-sm tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <Zap className="w-5 h-5 text-black fill-black" />
                      <span>Launch Adaptive Program Engine</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApplyProgram()}
                      className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-athletic font-black uppercase text-sm tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      <span>Apply &amp; Launch {recommendation.programTitle.split('(')[0].trim()}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>
                </div>

                {appliedProgramMsg && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{appliedProgramMsg}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Rail (Steps 1 to 3) */}
        {currentStep <= 3 && (
          <div className="p-4 border-t border-zinc-800 bg-[#0e1217] flex items-center justify-between gap-3 shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="py-2.5 px-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black font-athletic uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-2 ml-auto"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCalculateRecommendation}
                className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black font-athletic uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-2 ml-auto active:scale-[0.98]"
              >
                <Award className="w-4 h-4 text-black" />
                <span>Analyze Ability &amp; Recommend Program</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
