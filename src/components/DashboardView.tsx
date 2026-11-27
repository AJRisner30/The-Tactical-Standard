import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Play,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  Trophy,
  RotateCcw,
  Check,
  AlertTriangle,
  Loader2,
  Flame,
  Activity,
  Coffee,
  SlidersHorizontal,
  BookOpen,
  TrendingUp,
  Compass,
  Zap,
  MoreHorizontal,
  Pencil,
  X,
} from 'lucide-react';
import {
  TrackId,
  VolumeTier,
  ConstraintMode,
  UserProgramState,
  GlobalBenchmarkLog,
  FlexBlockAdaptationResult,
  TransformedExercise,
  TransformedWorkoutSession,
} from '../types/trainingTracks';
import { mergeWorkoutLogsIntoBenchmarks } from '../data/trainingTracksData';
import {
  buildAllProgramTracks,
  normalizeTrackId,
  transformRealProgramDay,
  transformRealProgramWeek,
  buildWorkoutProgramForLaunch,
} from '../data/programTrackAdapter';
import {
  loadLocalUserProgramState,
  loadLocalGlobalBenchmarks,
  saveLocalGlobalBenchmarks,
  saveUserActiveProgramToFirestore,
  subscribeToUserActiveProgram,
  saveGlobalBenchmarkToFirestore,
  subscribeToUserGlobalBenchmarks,
} from '../utils/trackStatePersistence';
import { TrackSwitcherCarousel } from './TrackSwitcherCarousel';
import { VolumeConstraintToggles } from './VolumeConstraintToggles';
import {
  ProgramKey,
  WorkoutProgram,
  WorkoutSessionLog,
  ExerciseTemplate,
  OperationalCondition,
} from '../types';
import { COACH_RULES } from '../data/protocolData';
import { auth } from '../firebase';

export interface DashboardViewProps {
  userId?: string;
  workoutLogs?: WorkoutSessionLog[];
  activeProgramKey?: ProgramKey | 'custom_ai';
  activeCustomProgram?: WorkoutProgram | null;
  coachPublishedPrograms?: WorkoutProgram[];
  isMasterExempt?: boolean;
  onStartWorkout?: (program: WorkoutProgram) => void;
  onSelectWarmup?: (warmupId: string) => void;
  onSyncLegacyProgramKey?: (programKey: ProgramKey | 'custom_ai') => void;
  onOpenAIGenerator?: (baseProgramKey?: ProgramKey) => void;
  onOpenSingleDayWorkout?: () => void;
  onOpenQuestionnaire?: () => void;
  onOpenCoachBuilder?: (programToEdit?: WorkoutProgram | null) => void;
  onDeleteCoachProgram?: (programId: string) => Promise<void>;
  onClearCustomProgram?: () => void;
}

const QUICK_FLEX_PRESETS = [
  'Only 30 minutes before shift starts',
  'Right knee & hip tight from ruck march',
  'Hotel gym: DBs up to 50 lbs only',
  'Post-night shift fatigue — keep CNS fresh',
];

function formatBenchmarkValue(bm?: GlobalBenchmarkLog, isBodyweight?: boolean): string {
  if (!bm) return isBodyweight ? 'PR: 0 reps' : 'PR: 0 lb';
  if (bm.metric_type === 'load_pr' && bm.best_weight_lbs && bm.best_weight_lbs > 0) {
    const repPart = bm.best_reps ? ` × ${bm.best_reps}` : '';
    const rmPart = bm.estimated_1rm_lbs ? ` (1RM ${bm.estimated_1rm_lbs})` : '';
    return `PR: ${bm.best_weight_lbs} lb${repPart}${rmPart}`;
  }
  if (bm.metric_type === 'carry_load' && bm.best_weight_lbs && bm.best_weight_lbs > 0) {
    const dist = bm.best_distance_meters ? ` · ${bm.best_distance_meters}m` : '';
    const time = bm.best_time_formatted ? ` (${bm.best_time_formatted})` : '';
    return `PR: ${bm.best_weight_lbs} lb${dist}${time}`;
  }
  if ((bm.metric_type === 'time_trial' || bm.metric_type === 'erg_split') && bm.best_time_formatted) {
    return `Best ${bm.best_time_formatted}`;
  }
  if (bm.metric_type === 'bodyweight_reps' && bm.best_reps && bm.best_reps > 0) {
    return `PR: ${bm.best_reps} reps`;
  }
  return isBodyweight ? 'PR: 0 reps' : 'PR: 0 lb';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userId: propUserId,
  workoutLogs = [],
  activeProgramKey,
  activeCustomProgram,
  coachPublishedPrograms = [],
  isMasterExempt = false,
  onStartWorkout,
  onSelectWarmup,
  onSyncLegacyProgramKey,
  onOpenAIGenerator,
  onOpenSingleDayWorkout,
  onOpenQuestionnaire,
  onOpenCoachBuilder,
  onDeleteCoachProgram,
  onClearCustomProgram,
}) => {
  const effectiveUserId = propUserId || auth.currentUser?.uid || 'local-operator';

  const allTracks = useMemo(
    () => buildAllProgramTracks(activeCustomProgram, coachPublishedPrograms, isMasterExempt),
    [activeCustomProgram, coachPublishedPrograms, isMasterExempt]
  );

  const [programState, setProgramState] = useState<UserProgramState>(() =>
    loadLocalUserProgramState(effectiveUserId, activeProgramKey ? normalizeTrackId(activeProgramKey) : 'hybrid_db')
  );

  const [operationalCondition, setOperationalCondition] = useState<OperationalCondition>('garrison');
  const [previewTrackId, setPreviewTrackId] = useState<TrackId>(programState.active_track_id);
  const [viewMode, setViewMode] = useState<'today' | 'week'>('today');

  // Optional drawers & contextual overflow menu
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [activeInfoDrawer, setActiveInfoDrawer] = useState<'overload' | 'cues' | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const [rawBenchmarks, setRawBenchmarks] = useState<GlobalBenchmarkLog[]>(() =>
    loadLocalGlobalBenchmarks(effectiveUserId)
  );

  // Inline quick-PR editor state
  const [editingBenchmarkMovementId, setEditingBenchmarkMovementId] = useState<string | null>(null);
  const [quickWeightInput, setQuickWeightInput] = useState<string>('');
  const [quickRepsInput, setQuickRepsInput] = useState<string>('5');
  const [quickRpeInput, setQuickRpeInput] = useState<string>('8');

  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Flex Block live adaptation state
  const [flexNote, setFlexNote] = useState<string>('');
  const [isFlexPanelOpen, setIsFlexPanelOpen] = useState<boolean>(false);
  const [isGeneratingFlex, setIsGeneratingFlex] = useState<boolean>(false);
  const [flexError, setFlexError] = useState<string | null>(null);
  const [activeFlexAdaptation, setActiveFlexAdaptation] = useState<FlexBlockAdaptationResult | null>(null);

  // Close overflow menu on outside click or Escape
  useEffect(() => {
    if (!isMoreMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMoreMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isMoreMenuOpen]);

  useEffect(() => {
    const localState = loadLocalUserProgramState(
      effectiveUserId,
      activeProgramKey ? normalizeTrackId(activeProgramKey) : 'hybrid_db'
    );
    setProgramState(localState);
    setPreviewTrackId(localState.active_track_id);
    setRawBenchmarks(loadLocalGlobalBenchmarks(effectiveUserId));

    const unsubProgram = subscribeToUserActiveProgram(effectiveUserId, (incoming) => {
      setProgramState(incoming);
      setPreviewTrackId(incoming.active_track_id);
    });

    const unsubBenchmarks = subscribeToUserGlobalBenchmarks(effectiveUserId, (incoming) => {
      setRawBenchmarks((prev) => {
        const merged = new Map<string, GlobalBenchmarkLog>();
        for (const b of prev) merged.set(b.movement_id, b);
        for (const b of incoming) merged.set(b.movement_id, b);
        const list = Array.from(merged.values());
        saveLocalGlobalBenchmarks(effectiveUserId, list);
        return list;
      });
    });

    return () => {
      unsubProgram();
      unsubBenchmarks();
    };
  }, [effectiveUserId, activeProgramKey]);

  useEffect(() => {
    if (activeCustomProgram && activeProgramKey === 'custom_ai') {
      setPreviewTrackId('custom_ai');
    }
  }, [activeCustomProgram, activeProgramKey]);

  const displayedTrack = useMemo(() => {
    return (
      allTracks.find((t) => t.id === previewTrackId) ||
      allTracks.find((t) => t.id === programState.active_track_id) ||
      allTracks[0]
    );
  }, [allTracks, previewTrackId, programState.active_track_id]);

  useEffect(() => {
    if (allTracks.some((t) => t.id === programState.active_track_id)) {
      setPreviewTrackId(programState.active_track_id);
    }
  }, [programState.active_track_id, allTracks]);

  const globalBenchmarks = useMemo(
    () => mergeWorkoutLogsIntoBenchmarks(rawBenchmarks, workoutLogs, effectiveUserId),
    [rawBenchmarks, workoutLogs, effectiveUserId]
  );

  const totalTrackDays = Math.max(1, displayedTrack.totalWeeks * 7);
  const wrappedSeqDay = ((Math.max(1, programState.sequential_day_index) - 1) % totalTrackDays) + 1;
  const currentWeekNumber = Math.min(displayedTrack.totalWeeks, Math.floor((wrappedSeqDay - 1) / 7) + 1);
  const currentDayInWeek = ((wrappedSeqDay - 1) % 7) + 1;

  useEffect(() => {
    if (
      activeFlexAdaptation &&
      (activeFlexAdaptation.trackId !== displayedTrack.id ||
        activeFlexAdaptation.volumeTier !== programState.volume_tier ||
        activeFlexAdaptation.constraintMode !== programState.constraint_mode ||
        activeFlexAdaptation.sequentialDayIndex !== programState.sequential_day_index)
    ) {
      setActiveFlexAdaptation(null);
    }
  }, [
    activeFlexAdaptation,
    displayedTrack.id,
    programState.volume_tier,
    programState.constraint_mode,
    programState.sequential_day_index,
  ]);

  const transformed = useMemo(
    () =>
      transformRealProgramDay(
        displayedTrack,
        currentWeekNumber,
        currentDayInWeek,
        programState,
        globalBenchmarks,
        operationalCondition
      ),
    [
      displayedTrack,
      currentWeekNumber,
      currentDayInWeek,
      programState,
      globalBenchmarks,
      operationalCondition,
    ]
  );

  const weekSessions = useMemo(
    () =>
      transformRealProgramWeek(
        displayedTrack,
        currentWeekNumber,
        programState,
        globalBenchmarks,
        operationalCondition
      ),
    [displayedTrack, currentWeekNumber, programState, globalBenchmarks, operationalCondition]
  );

  const weekOptions = useMemo(() => {
    const items: Array<{ week: number; label: string }> = [];
    for (let wk = 1; wk <= displayedTrack.totalWeeks; wk++) {
      const phase = displayedTrack.mesocycles?.find((m) => m.weekRange.includes(wk));
      items.push({
        week: wk,
        label: phase ? `Week ${wk} · ${phase.badge}` : `Week ${wk} of ${displayedTrack.totalWeeks}`,
      });
    }
    return items;
  }, [displayedTrack.totalWeeks, displayedTrack.mesocycles]);

  const persistProgramState = (next: UserProgramState) => {
    setProgramState(next);
    saveUserActiveProgramToFirestore(next).catch(() => {});
  };

  const showTransientNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => {
      setStatusNotice((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  const handleActivateTrack = (trackId: TrackId) => {
    const track = allTracks.find((t) => t.id === trackId) || allTracks[0];
    const next: UserProgramState = {
      ...programState,
      active_track_id: track.id,
      updated_at: new Date().toISOString(),
    };
    persistProgramState(next);
    setPreviewTrackId(track.id);
    setActiveFlexAdaptation(null);
    if (onSyncLegacyProgramKey && track.linkedProgramKey) {
      onSyncLegacyProgramKey(track.linkedProgramKey);
    }
    showTransientNotice(
      `Activated ${track.title}. ${globalBenchmarks.length} saved PRs and Day ${next.sequential_day_index} preserved.`
    );
  };

  const handleVolumeChange = (volume_tier: VolumeTier) => {
    persistProgramState({
      ...programState,
      volume_tier,
      updated_at: new Date().toISOString(),
    });
  };

  const handleConstraintChange = (constraint_mode: ConstraintMode) => {
    persistProgramState({
      ...programState,
      constraint_mode,
      updated_at: new Date().toISOString(),
    });
  };

  const handleJumpToWeekDay = (weekNum: number, dayNum: number) => {
    const clampedWeek = Math.max(1, Math.min(displayedTrack.totalWeeks, weekNum));
    const clampedDay = Math.max(1, Math.min(7, dayNum));
    const nextSeq = (clampedWeek - 1) * 7 + clampedDay;
    persistProgramState({
      ...programState,
      sequential_day_index: nextSeq,
      updated_at: new Date().toISOString(),
    });
  };

  const handleStepSequentialDay = (delta: number) => {
    const nextDay = Math.max(1, programState.sequential_day_index + delta);
    persistProgramState({
      ...programState,
      sequential_day_index: nextDay,
      updated_at: new Date().toISOString(),
    });
  };

  const handleCompleteSequentialDay = () => {
    const todayIso = new Date().toISOString().split('T')[0];
    const nextDay = programState.sequential_day_index + 1;
    persistProgramState({
      ...programState,
      sequential_day_index: nextDay,
      completed_sessions_count: (programState.completed_sessions_count || 0) + 1,
      last_completed_date: todayIso,
      updated_at: new Date().toISOString(),
    });
    setActiveFlexAdaptation(null);
    showTransientNotice(
      `Week ${currentWeekNumber} Day ${currentDayInWeek} completed. Advanced to Day ${nextDay}.`
    );
  };

  const handleOpenQuickBenchmark = (ex: TransformedExercise) => {
    setEditingBenchmarkMovementId(ex.movement_id);
    setQuickWeightInput(
      ex.benchmark?.best_weight_lbs && ex.benchmark.best_weight_lbs > 0
        ? String(ex.benchmark.best_weight_lbs)
        : ''
    );
    setQuickRepsInput(String(ex.benchmark?.best_reps || 5));
    setQuickRpeInput(String(ex.benchmark?.last_rpe || ex.targetRpe || 8));
  };

  const handleSaveQuickBenchmark = (ex: TransformedExercise) => {
    const parsedWeight = parseFloat(quickWeightInput);
    const weightNum = !isNaN(parsedWeight) && parsedWeight > 0 ? parsedWeight : 0;
    const repsNum = Math.max(0, parseInt(quickRepsInput, 10) || 0);
    const rpeNum = Math.min(10, Math.max(1, parseFloat(quickRpeInput) || 8));

    const isBodyweightOnly = ex.isBodyweight && weightNum === 0;
    if (!isBodyweightOnly && weightNum <= 0) return;
    if (isBodyweightOnly && repsNum <= 0) return;

    const effectiveReps = Math.max(1, repsNum);
    const today = new Date().toISOString().split('T')[0];
    const est1RM = weightNum > 0 ? Math.round(weightNum * (1 + effectiveReps / 30)) : undefined;
    const existing = globalBenchmarks.find((b) => b.movement_id === ex.movement_id);

    const updatedRecord: GlobalBenchmarkLog = {
      id: existing?.id || `bm-${effectiveUserId}-${ex.movement_id}`,
      user_id: effectiveUserId,
      movement_id: ex.movement_id,
      movement_name: existing?.movement_name || ex.name,
      metric_type: isBodyweightOnly
        ? 'bodyweight_reps'
        : ex.isCarryDistance || ex.blockType === 'Carry'
        ? 'carry_load'
        : 'load_pr',
      best_weight_lbs: weightNum > 0 ? Math.max(weightNum, existing?.best_weight_lbs || 0) : existing?.best_weight_lbs,
      best_reps: isBodyweightOnly
        ? Math.max(effectiveReps, existing?.best_reps || 0)
        : weightNum >= (existing?.best_weight_lbs || 0)
        ? effectiveReps
        : existing?.best_reps,
      estimated_1rm_lbs:
        est1RM && est1RM > 0 ? Math.max(est1RM, existing?.estimated_1rm_lbs || 0) : existing?.estimated_1rm_lbs,
      last_rpe: rpeNum,
      last_logged_date: today,
      session_count: (existing?.session_count || 0) + 1,
      history: [
        ...(existing?.history || []).slice(-29),
        {
          date: today,
          weight_lbs: weightNum > 0 ? weightNum : undefined,
          reps: effectiveReps,
          rpe: rpeNum,
        },
      ],
      updated_at: new Date().toISOString(),
    };

    const nextList = [
      ...rawBenchmarks.filter((b) => b.movement_id !== ex.movement_id),
      updatedRecord,
    ];
    setRawBenchmarks(nextList);
    saveLocalGlobalBenchmarks(effectiveUserId, nextList);
    saveGlobalBenchmarkToFirestore(updatedRecord).catch(() => {});
    setEditingBenchmarkMovementId(null);
    showTransientNotice(
      isBodyweightOnly
        ? `Saved ${updatedRecord.movement_name} (${effectiveReps} reps) to your global PRs.`
        : `Saved ${updatedRecord.movement_name} (${weightNum} lb × ${effectiveReps}) to your global PRs.`
    );
  };

  const handleGenerateFlexBlock = async () => {
    setIsGeneratingFlex(true);
    setFlexError(null);
    try {
      const response = await fetch('/api/gemini/flex-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: displayedTrack.id,
          trackTitle: displayedTrack.title,
          volumeTier: programState.volume_tier,
          constraintMode: programState.constraint_mode,
          sequentialDayIndex: programState.sequential_day_index,
          sessionTitle: `Week ${currentWeekNumber} Day ${currentDayInWeek}: ${transformed.session.title}`,
          sessionFocus: transformed.session.focus,
          exercises: transformed.exercises,
          benchmarks: globalBenchmarks,
          customNote: [
            operationalCondition !== 'garrison' ? `Operational Condition: ${operationalCondition}` : '',
            flexNote.trim(),
          ]
            .filter(Boolean)
            .join(' · '),
        }),
      });
      const json = await response.json();
      if (!response.ok || !json?.success) {
        throw new Error(json?.error || `Flex Block request failed (${response.status})`);
      }
      setActiveFlexAdaptation(json.data as FlexBlockAdaptationResult);
      showTransientNotice('Flex Block adapted today’s session using your active program, constraints, and PRs.');
    } catch (err: any) {
      setFlexError(err?.message || 'Unable to reach Flex Block adaptation service right now.');
    } finally {
      setIsGeneratingFlex(false);
    }
  };

  const handleLaunchSession = (sessionToLaunch: TransformedWorkoutSession, useFlex = false) => {
    if (!onStartWorkout) return;

    if (useFlex && activeFlexAdaptation) {
      const exercisesToRun: ExerciseTemplate[] = activeFlexAdaptation.exercises.map((fx, idx) => ({
        id: `flex-${fx.movement_id}-${idx}`,
        name: fx.name,
        muscleGroup: 'Full Body',
        defaultSets: fx.sets,
        targetReps: fx.reps,
        targetRpe: fx.targetRpe,
        restPeriodSeconds: fx.restSeconds,
        notes: [fx.prescribedLoadNote, fx.notes, fx.adaptationReason].filter(Boolean).join(' · '),
      }));

      onStartWorkout({
        id: `flex-${displayedTrack.id}-w${sessionToLaunch.weekNumber}-d${sessionToLaunch.dayInWeek}-${Date.now()}`,
        title: `Flex Block · Wk ${sessionToLaunch.weekNumber} Day ${sessionToLaunch.dayInWeek}: ${activeFlexAdaptation.title}`,
        subtitle: `${displayedTrack.title} · ${
          programState.volume_tier === 'standard' ? 'Standard' : 'High Volume'
        }`,
        category: 'Hybrid',
        frequency: displayedTrack.frequencyLabel,
        estimatedDurationMinutes: activeFlexAdaptation.estimatedMinutes,
        recommendedWarmupId: displayedTrack.recommendedWarmupId,
        description: activeFlexAdaptation.rationale,
        exercises: exercisesToRun,
      });
      return;
    }

    const launchProgram = buildWorkoutProgramForLaunch(
      sessionToLaunch,
      displayedTrack,
      programState,
      operationalCondition
    );
    onStartWorkout(launchProgram);
  };

  const isPreviewMode = displayedTrack.id !== programState.active_track_id;

  return (
    <div className="space-y-4">
      {/* 1. Compact, Collapsible Horizontal Program Switcher */}
      <TrackSwitcherCarousel
        tracks={allTracks}
        activeTrackId={programState.active_track_id}
        previewTrackId={displayedTrack.id}
        volumeTier={programState.volume_tier}
        onSelectPreview={setPreviewTrackId}
        onActivateTrack={handleActivateTrack}
        preservedBenchmarkCount={globalBenchmarks.length}
        isMasterExempt={isMasterExempt}
        onOpenCoachBuilder={onOpenCoachBuilder}
        onDeleteCoachProgram={onDeleteCoachProgram}
        onClearCustomProgram={onClearCustomProgram}
      />

      {/* 2. Single-Line Expandable Session Modifiers (Volume / Readiness / Duty Condition) */}
      <VolumeConstraintToggles
        volumeTier={programState.volume_tier}
        constraintMode={programState.constraint_mode}
        operationalCondition={operationalCondition}
        onChangeVolumeTier={handleVolumeChange}
        onChangeConstraintMode={handleConstraintChange}
        onChangeOperationalCondition={setOperationalCondition}
        volumeReductionPct={transformed.volumeReductionPct}
        swappedCount={transformed.swappedCount}
      />

      {/* Transient Confirmation Toast */}
      {statusNotice && (
        <div
          role="status"
          className="rounded-xl bg-emerald-500/10 border border-emerald-500/35 px-4 py-2.5 text-xs text-emerald-200 flex items-center justify-between gap-2"
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusNotice}</span>
          </span>
          <button
            type="button"
            onClick={() => setStatusNotice(null)}
            className="text-emerald-300 hover:text-white cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Unified Workout Workspace (Navigation + Active Day / Full Week) */}
      <section
        aria-label="Training Workspace"
        className="rounded-2xl bg-[#11161F] border border-[#222B3B] overflow-hidden"
      >
        {/* Top Workspace Control Bar: Week Selector + Day Steppers + Day/Week View Switch */}
        <div className="px-4 sm:px-5 py-3 border-b border-[#1E2635] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            {displayedTrack.totalWeeks > 1 ? (
              <select
                aria-label="Select training week"
                value={currentWeekNumber}
                onChange={(e) => handleJumpToWeekDay(Number(e.target.value), currentDayInWeek)}
                className="min-h-[38px] pl-3 pr-8 py-1.5 rounded-lg bg-[#0B0E14] border border-[#262F40] text-xs font-medium text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {weekOptions.map((opt) => (
                  <option key={opt.week} value={opt.week} className="bg-[#11161F] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs font-semibold text-amber-400">{displayedTrack.title}</span>
            )}

            <div className="inline-flex items-center rounded-lg border border-[#262F40] bg-[#0B0E14]">
              <button
                type="button"
                onClick={() => handleStepSequentialDay(-1)}
                disabled={programState.sequential_day_index <= 1}
                aria-label="Previous day"
                className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-mono text-slate-200 tabular-nums whitespace-nowrap">
                Day {currentDayInWeek}
              </span>
              <button
                type="button"
                onClick={() => handleStepSequentialDay(1)}
                aria-label="Next day"
                className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {isPreviewMode && (
              <span className="text-xs font-medium text-emerald-400">Previewing</span>
            )}
          </div>

          {/* Day Focus vs Full Week Segmented Switch */}
          <div
            role="group"
            aria-label="Schedule View"
            className="inline-flex items-center p-0.5 rounded-lg bg-[#0B0E14] border border-[#262F40] gap-0.5 shrink-0"
          >
            <button
              type="button"
              onClick={() => setViewMode('today')}
              aria-pressed={viewMode === 'today'}
              className={`min-h-[34px] px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'today'
                  ? 'bg-amber-400 text-[#0B0E14]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Day Focus
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              aria-pressed={viewMode === 'week'}
              className={`min-h-[34px] px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'week'
                  ? 'bg-amber-400 text-[#0B0E14]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Week ({weekSessions.length}d)
            </button>
          </div>
        </div>

        {/* Clean Single-Line Day 1..N Tabs (Day Focus mode) */}
        {viewMode === 'today' && weekSessions.length > 1 && (
          <div className="px-4 sm:px-5 border-b border-[#1E2635] flex items-center gap-1 overflow-x-auto no-scrollbar">
            {weekSessions.map((daySess) => {
              const isSelected = daySess.dayInWeek === currentDayInWeek;
              return (
                <button
                  key={daySess.session.id}
                  type="button"
                  onClick={() => handleJumpToWeekDay(currentWeekNumber, daySess.dayInWeek)}
                  className={`relative py-2.5 px-3 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isSelected
                      ? 'text-white font-semibold'
                      : daySess.isRestDay
                      ? 'text-slate-500 hover:text-slate-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-mono tabular-nums">Day {daySess.dayInWeek}</span>
                  {daySess.isRestDay && (
                    <span className="ml-1 text-[10px] text-slate-500">· Rest</span>
                  )}
                  {isSelected && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-400 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* VIEW A: TODAY'S FOCUS */}
        {viewMode === 'today' && (
          <>
            {/* Dominant Session Header */}
            <div className="px-4 sm:px-6 py-5 border-b border-[#1E2635] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400 font-mono tabular-nums">
                  <span className="text-amber-400 font-semibold">{displayedTrack.title}</span>
                  <span aria-hidden="true">·</span>
                  <span>~{activeFlexAdaptation ? activeFlexAdaptation.estimatedMinutes : transformed.estimatedMinutes} min</span>
                  {!transformed.isRestDay && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>
                        {activeFlexAdaptation
                          ? `${activeFlexAdaptation.exercises.reduce((sum, e) => sum + e.sets, 0)} sets`
                          : transformed.totalSetsAdjusted > 0
                          ? `${transformed.totalSetsAdjusted} sets`
                          : 'Conditioning'}
                      </span>
                    </>
                  )}
                  {!transformed.isRestDay && onSelectWarmup && (
                    <>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={() => onSelectWarmup(displayedTrack.recommendedWarmupId)}
                        className="text-amber-400 hover:text-amber-300 font-sans font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Flame className="w-3 h-3" />
                        <span>Warm-Up</span>
                      </button>
                    </>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {activeFlexAdaptation
                    ? `Flex Block: ${activeFlexAdaptation.title}`
                    : transformed.session.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
                  {activeFlexAdaptation ? activeFlexAdaptation.rationale : transformed.session.focus}
                </p>
              </div>

              {/* Action Cluster: 1 Dominant CTA + Subtle Flex Block + Overflow Menu */}
              <div className="flex items-center gap-2 shrink-0">
                {onStartWorkout && !transformed.isRestDay && (
                  <button
                    type="button"
                    onClick={() => handleLaunchSession(transformed, Boolean(activeFlexAdaptation))}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0B0E14] text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap active:scale-[0.98]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span>Start Session</span>
                  </button>
                )}

                {!transformed.isRestDay && (
                  <button
                    type="button"
                    onClick={() => setIsFlexPanelOpen((prev) => !prev)}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isFlexPanelOpen || activeFlexAdaptation
                        ? 'border-amber-400/70 bg-amber-400/12 text-amber-300'
                        : 'border-[#262F40] bg-[#0B0E14] hover:border-slate-500 text-slate-200'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                    <span>Flex Block</span>
                  </button>
                )}

                {/* Contextual More Menu (Adapt Program, Single-Day, Matcher, Rules, Cues) */}
                <div ref={moreMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                    aria-label="More workout options"
                    aria-expanded={isMoreMenuOpen}
                    className="min-w-[44px] min-h-[44px] rounded-xl border border-[#262F40] bg-[#0B0E14] hover:border-slate-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {isMoreMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-60 rounded-xl bg-[#141923] border border-[#262F40] shadow-2xl py-1.5 z-40"
                    >
                      {onOpenAIGenerator && (
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setIsMoreMenuOpen(false);
                            onOpenAIGenerator(
                              displayedTrack.linkedProgramKey === 'custom_ai'
                                ? 'hybrid_db'
                                : displayedTrack.linkedProgramKey
                            );
                          }}
                          className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-[#1C2333] hover:text-white flex items-center gap-2.5 cursor-pointer"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Adapt Program (Injuries / Gear)</span>
                        </button>
                      )}
                      {onOpenSingleDayWorkout && (
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setIsMoreMenuOpen(false);
                            onOpenSingleDayWorkout();
                          }}
                          className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-[#1C2333] hover:text-white flex items-center gap-2.5 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Single-Day Workout</span>
                        </button>
                      )}
                      {onOpenQuestionnaire && (
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setIsMoreMenuOpen(false);
                            onOpenQuestionnaire();
                          }}
                          className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-[#1C2333] hover:text-white flex items-center gap-2.5 cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Program Matcher</span>
                        </button>
                      )}

                      <div className="my-1 border-t border-[#262F40]" />

                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          setActiveInfoDrawer((prev) => (prev === 'overload' ? null : 'overload'));
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-[#1C2333] hover:text-white flex items-center gap-2.5 cursor-pointer"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Auto-Overload Rules</span>
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          setActiveInfoDrawer((prev) => (prev === 'cues' ? null : 'cues'));
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-[#1C2333] hover:text-white flex items-center gap-2.5 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Coach Execution Cues</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Operational Condition Notice (Only when non-Garrison) */}
            {transformed.session.operationalNote && !transformed.isRestDay && (
              <div className="px-4 sm:px-6 py-2.5 border-b border-[#1E2635] bg-sky-500/8 text-xs text-sky-200 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{transformed.session.operationalNote}</span>
              </div>
            )}

            {/* Collapsible Flex Block Adaptation Drawer */}
            {isFlexPanelOpen && !transformed.isRestDay && (
              <div className="px-4 sm:px-6 py-4 border-b border-[#1E2635] bg-[#0B0E14]/70 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Flex Block Adaptation</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Customize today&apos;s session for time, soreness, or available gear.
                    </p>
                  </div>
                  {activeFlexAdaptation && (
                    <button
                      type="button"
                      onClick={() => setActiveFlexAdaptation(null)}
                      className="min-h-[34px] px-2.5 py-1 rounded-lg border border-[#262F40] text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Revert</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {QUICK_FLEX_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFlexNote(preset)}
                      className="min-h-[34px] px-2.5 py-1 rounded-lg border border-[#262F40] bg-[#11161F] hover:border-amber-400/50 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={flexNote}
                    onChange={(e) => setFlexNote(e.target.value)}
                    placeholder="e.g., 25 min cap, sore shoulder, dumbbells only..."
                    className="flex-1 min-h-[42px] px-3.5 py-2 rounded-lg bg-[#11161F] border border-[#262F40] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateFlexBlock}
                    disabled={isGeneratingFlex}
                    className="min-h-[42px] px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-[#0B0E14] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    {isGeneratingFlex ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Adapting...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Adapt Session</span>
                      </>
                    )}
                  </button>
                </div>

                {flexError && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/35 px-3 py-2 text-xs text-red-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{flexError}</span>
                  </div>
                )}
              </div>
            )}

            {/* Rest Day vs Clean Exercise Table */}
            {transformed.isRestDay ? (
              <div className="px-6 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <Coffee className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-white">
                      Rest &amp; Recovery Day
                    </h4>
                    <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                      Zero mandatory lifting today. Focus on sleep, hydration, and 10–15 minutes of light mobility work.
                    </p>
                  </div>
                </div>
                {onSelectWarmup && (
                  <button
                    type="button"
                    onClick={() => onSelectWarmup(displayedTrack.recommendedWarmupId)}
                    className="min-h-[40px] px-3.5 py-2 rounded-lg border border-[#262F40] hover:border-emerald-400/60 text-slate-200 hover:text-emerald-300 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Optional Mobility Flow
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="divide-y divide-[#1E2635]">
                  {activeFlexAdaptation
                    ? activeFlexAdaptation.exercises.map((fx, idx) => {
                        const matchedBm = globalBenchmarks.find((b) => b.movement_id === fx.movement_id);
                        return (
                          <div
                            key={`${fx.movement_id}-${idx}`}
                            className="px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#151B26]/60 transition-colors"
                          >
                            <div className="min-w-0 space-y-1">
                              <div className="flex items-baseline gap-2.5">
                                <span className="font-mono text-xs text-slate-500 tabular-nums shrink-0">
                                  {String(idx + 1).padStart(2, '0')}
                                </span>
                                <h4 className="text-sm sm:text-base font-semibold text-white">
                                  {fx.name}
                                </h4>
                              </div>
                              <div className="pl-6 text-xs text-slate-400 flex flex-wrap items-center gap-x-2">
                                <span>{fx.blockType}</span>
                                <span aria-hidden="true">·</span>
                                <span className="text-emerald-400">Flex Adapted</span>
                                {fx.notes && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="text-slate-400">{fx.notes}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="pl-6 md:pl-0 flex flex-wrap md:flex-col md:items-end gap-1 shrink-0 font-mono tabular-nums">
                              <div className="text-sm font-semibold text-white">
                                {fx.sets} × {fx.reps}{' '}
                                <span className="text-xs font-normal text-slate-400">
                                  @ RPE {fx.targetRpe}
                                </span>
                              </div>
                              {fx.prescribedLoadNote && (
                                <div className="text-xs text-amber-300">{fx.prescribedLoadNote}</div>
                              )}
                              <div
                                className={`text-[11px] flex items-center gap-1 ${
                                  matchedBm ? 'text-emerald-400' : 'text-slate-500'
                                }`}
                              >
                                <Trophy className="w-3 h-3 shrink-0" />
                                <span>{formatBenchmarkValue(matchedBm)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : transformed.exercises.map((ex, idx) => {
                        const isEditing = editingBenchmarkMovementId === ex.movement_id;
                        const isSuperset =
                          ex.format === 'superset' &&
                          ex.supersetExercises &&
                          ex.supersetExercises.length > 0;
                        const supersetLetter = String.fromCharCode(65 + idx);
                        const isNoteExpanded = Boolean(expandedNotes[ex.id]);

                        const metaParts = [
                          ex.muscleGroup,
                          ex.isCarryDistance ? 'Weight + Distance' : '',
                          ex.isIntervalRun ? 'Intervals' : '',
                          ex.isEasyRun ? 'Distance & Time' : '',
                          ex.wasVolumeTrimmed ? `Trimmed ${ex.originalSets}→${ex.sets}` : '',
                        ].filter(Boolean);

                        return (
                          <div
                            key={ex.id}
                            className="px-4 sm:px-6 py-4 flex flex-col gap-3 hover:bg-[#151B26]/60 transition-colors"
                          >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                              {/* Left: Index, Movement Title/Superset, Clean 1-line Meta & Expandable Note */}
                              <div className="min-w-0 flex-1 space-y-1">
                                {isSuperset && ex.supersetExercises ? (
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
                                      <span>{String(idx + 1).padStart(2, '0')}</span>
                                      <span>·</span>
                                      <span className="font-semibold">Superset {supersetLetter}</span>
                                    </div>
                                    <div className="pl-6 space-y-1">
                                      {ex.supersetExercises.map((sub, subIdx) => (
                                        <div
                                          key={`${ex.id}-sub-${subIdx}`}
                                          className="flex flex-wrap items-baseline gap-2 text-sm text-white"
                                        >
                                          <span className="font-mono text-xs text-amber-400 w-6 shrink-0">
                                            {supersetLetter}
                                            {subIdx + 1}
                                          </span>
                                          <span className="font-semibold">{sub.name}</span>
                                          <span className="font-mono text-xs text-slate-400 tabular-nums">
                                            ({sub.targetReps})
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-baseline gap-2.5">
                                    <span className="font-mono text-xs text-slate-500 tabular-nums shrink-0">
                                      {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <h4 className="text-sm sm:text-base font-semibold text-white">
                                      {ex.name}
                                    </h4>
                                  </div>
                                )}

                                <div className="pl-6 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400">
                                  <span>{metaParts.join(' · ')}</span>
                                  {ex.wasSwapped && ex.originalName && (
                                    <>
                                      <span aria-hidden="true">·</span>
                                      <span className="text-emerald-400 inline-flex items-center gap-1">
                                        <ArrowRightLeft className="w-3 h-3" />
                                        <span>Replaced {ex.originalName}</span>
                                      </span>
                                    </>
                                  )}
                                </div>

                                {ex.notes && (
                                  <div className="pl-6">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedNotes((prev) => ({
                                          ...prev,
                                          [ex.id]: !prev[ex.id],
                                        }))
                                      }
                                      className={`text-left text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer ${
                                        isNoteExpanded ? '' : 'line-clamp-1'
                                      }`}
                                    >
                                      {ex.notes}
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Right: Tabular Prescription + Target Load + PR */}
                              <div className="pl-6 md:pl-0 flex flex-col md:items-end gap-1 shrink-0 font-mono tabular-nums">
                                {ex.isEasyRun ? (
                                  <div className="text-sm font-semibold text-emerald-300">
                                    {ex.distanceMiles ? `${ex.distanceMiles} mi` : ex.reps}
                                    <span className="text-xs font-normal text-slate-400 ml-1.5">
                                      · Distance &amp; Time
                                    </span>
                                  </div>
                                ) : isSuperset ? (
                                  <div className="text-sm font-semibold text-white">
                                    {ex.sets} Rounds
                                    <span className="text-xs font-normal text-slate-400 ml-1.5">
                                      RPE {ex.targetRpe}
                                      {ex.restSeconds > 0 ? ` · ${ex.restSeconds}s` : ''}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="text-sm font-semibold text-white">
                                    {ex.sets} × {ex.reps}
                                    <span className="text-xs font-normal text-slate-400 ml-1.5">
                                      RPE {ex.targetRpe}
                                      {ex.restSeconds > 0 ? ` · ${ex.restSeconds}s` : ''}
                                    </span>
                                  </div>
                                )}

                                {ex.prescribedWeightLbs ? (
                                  <div className="text-xs text-amber-300">
                                    Target {ex.prescribedWeightLbs} lb
                                    {ex.loadPercent1RM ? ` (${Math.round(ex.loadPercent1RM * 100)}%)` : ''}
                                  </div>
                                ) : null}

                                {!ex.isEasyRun && !ex.isIntervalRun && (
                                  <div className="flex items-center gap-2 text-[11px]">
                                    <span
                                      className={`inline-flex items-center gap-1 ${
                                        ex.benchmark ? 'text-emerald-400' : 'text-slate-500'
                                      }`}
                                    >
                                      <Trophy className="w-3 h-3 shrink-0" />
                                      <span>{formatBenchmarkValue(ex.benchmark, ex.isBodyweight)}</span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        isEditing
                                          ? setEditingBenchmarkMovementId(null)
                                          : handleOpenQuickBenchmark(ex)
                                      }
                                      aria-label={`Edit PR for ${ex.name}`}
                                      className="text-slate-400 hover:text-amber-300 transition-colors cursor-pointer inline-flex items-center gap-0.5 font-sans"
                                    >
                                      <Pencil className="w-3 h-3" />
                                      <span>{isEditing ? 'Close' : 'Log PR'}</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Inline Quick Global PR Editor */}
                            {isEditing && (
                              <div className="ml-0 sm:ml-6 rounded-xl bg-[#0B0E14] border border-[#262F40] p-3 flex flex-col sm:flex-row sm:items-end gap-2.5">
                                <div className="flex-1 min-w-[100px]">
                                  <label className="block text-[11px] text-slate-400 mb-1">
                                    Weight (lbs){ex.isBodyweight ? ' — 0 for BW' : ''}
                                  </label>
                                  <input
                                    type="number"
                                    value={quickWeightInput}
                                    onChange={(e) => setQuickWeightInput(e.target.value)}
                                    className="w-full min-h-[38px] px-3 rounded-lg bg-[#11161F] border border-[#262F40] text-xs font-mono text-white tabular-nums focus:outline-none focus:border-amber-400"
                                    placeholder={ex.isBodyweight ? '0' : 'e.g. 225'}
                                  />
                                </div>
                                <div className="w-full sm:w-20">
                                  <label className="block text-[11px] text-slate-400 mb-1">Reps</label>
                                  <input
                                    type="number"
                                    value={quickRepsInput}
                                    onChange={(e) => setQuickRepsInput(e.target.value)}
                                    className="w-full min-h-[38px] px-3 rounded-lg bg-[#11161F] border border-[#262F40] text-xs font-mono text-white tabular-nums focus:outline-none focus:border-amber-400"
                                  />
                                </div>
                                <div className="w-full sm:w-20">
                                  <label className="block text-[11px] text-slate-400 mb-1">RPE</label>
                                  <input
                                    type="number"
                                    step="0.5"
                                    min="1"
                                    max="10"
                                    value={quickRpeInput}
                                    onChange={(e) => setQuickRpeInput(e.target.value)}
                                    className="w-full min-h-[38px] px-3 rounded-lg bg-[#11161F] border border-[#262F40] text-xs font-mono text-white tabular-nums focus:outline-none focus:border-amber-400"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleSaveQuickBenchmark(ex)}
                                  className="min-h-[38px] px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#0B0E14] text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Save PR</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                </div>

                {/* Conditioning / Cardio Row */}
                {transformed.cardio && !activeFlexAdaptation && (
                  <div className="px-4 sm:px-6 py-4 border-t border-[#1E2635] bg-[#0B0E14]/45">
                    {transformed.cardio.isRest ? (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Activity className="w-3.5 h-3.5 shrink-0" />
                        <span>Cardio: Rest Day — no separate run prescribed</span>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                            <Activity className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {transformed.cardio.isInterval
                                ? 'Interval Conditioning'
                                : 'Continuous Conditioning'}
                            </span>
                            {transformed.cardio.wasSwapped && (
                              <span className="text-amber-300 font-normal">· Auto-Swapped</span>
                            )}
                          </div>
                          <h4 className="text-sm sm:text-base font-semibold text-white">
                            {transformed.cardio.run}
                          </h4>
                          <p className="text-xs text-slate-400">
                            Effort: {transformed.cardio.pace}
                          </p>
                        </div>

                        <div className="shrink-0 font-mono tabular-nums md:text-right">
                          {transformed.cardio.isInterval ? (
                            <div className="text-sm font-semibold text-amber-300">
                              {transformed.cardio.intervalSets || 6} × {transformed.cardio.intervalReps || '400m'}
                              <div className="text-[11px] font-normal text-slate-400">
                                Distance &amp; split time
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm font-semibold text-emerald-300">
                              {transformed.cardio.distanceMiles
                                ? `${transformed.cardio.distanceMiles} ${
                                    transformed.cardio.distanceMiles === 1 ? 'mile' : 'miles'
                                  }`
                                : 'Distance & Time'}
                              <div className="text-[11px] font-normal text-slate-400">
                                Log distance &amp; time
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Quiet Workspace Footer */}
            <div className="px-4 sm:px-6 py-3.5 border-t border-[#1E2635] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-400 font-mono tabular-nums">
                Completed:{' '}
                <span className="text-white font-semibold">
                  {programState.completed_sessions_count + workoutLogs.length}
                </span>{' '}
                sessions
              </div>

              <button
                type="button"
                onClick={handleCompleteSequentialDay}
                className="min-h-[40px] px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Mark Day {currentDayInWeek} Complete</span>
              </button>
            </div>
          </>
        )}

        {/* VIEW B: FULL WEEK OVERVIEW */}
        {viewMode === 'week' && (
          <div className="divide-y divide-[#1E2635]">
            {weekSessions.map((daySess) => {
              const isCurrentDay = daySess.dayInWeek === currentDayInWeek;
              return (
                <div
                  key={daySess.session.id}
                  className={`px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
                    isCurrentDay ? 'bg-amber-400/[0.04]' : 'hover:bg-[#151B26]/50'
                  }`}
                >
                  <div className="min-w-0 space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums">
                      <span className="text-amber-400 font-semibold">Day {daySess.dayInWeek}</span>
                      {isCurrentDay && <span className="text-emerald-400 font-semibold">· Up Next</span>}
                      <span className="text-slate-500">
                        · {daySess.isRestDay ? 'Rest' : `~${daySess.estimatedMinutes}m`}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-white">
                      {daySess.session.title}
                    </h4>
                    {daySess.isRestDay ? (
                      <p className="text-xs text-slate-500">Complete Rest &amp; Recovery</p>
                    ) : (
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {daySess.exercises
                          .map((ex) =>
                            ex.format === 'superset' && ex.supersetExercises
                              ? ex.supersetExercises.map((s) => s.name).join(' + ')
                              : ex.name
                          )
                          .join(' · ')}
                        {daySess.cardio && !daySess.cardio.isRest ? ` · ${daySess.cardio.run}` : ''}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        handleJumpToWeekDay(daySess.weekNumber, daySess.dayInWeek);
                        setViewMode('today');
                      }}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#262F40] hover:border-slate-500 text-xs font-medium text-slate-300 hover:text-white cursor-pointer whitespace-nowrap"
                    >
                      Details
                    </button>
                    {onStartWorkout && !daySess.isRestDay && (
                      <button
                        type="button"
                        onClick={() => handleLaunchSession(daySess, false)}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#0B0E14] text-xs font-bold cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Start</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Optional On-Demand Reference Drawers (Opened from More Menu) */}
      {activeInfoDrawer === 'overload' && (
        <div className="rounded-xl bg-[#11161F] border border-[#222B3B] p-4 space-y-2 text-xs text-slate-300">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-white">Auto-Overload Progression Rules</h4>
            <button
              type="button"
              onClick={() => setActiveInfoDrawer(null)}
              className="text-slate-400 hover:text-white cursor-pointer"
              aria-label="Close Auto-Overload Rules"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
            <li>
              <strong className="text-slate-200">Double Progression:</strong> Start at the low end of each rep range. When all sets reach the top of the range at RPE ≤ 8.5, add weight next session.
            </li>
            <li>
              <strong className="text-slate-200">Load Increments:</strong> +10 lbs lower compounds, +5 lbs upper compounds and carries, +2.5–5 lbs accessories and dumbbells.
            </li>
            <li>
              <strong className="text-slate-200">Deload Weeks:</strong> Drop working volume ~40% on scheduled deload weeks while keeping bar speed sharp.
            </li>
          </ul>
        </div>
      )}

      {activeInfoDrawer === 'cues' && (
        <div className="rounded-xl bg-[#11161F] border border-[#222B3B] p-4 space-y-2 text-xs text-slate-300">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-white">Coach AJ&apos;s Execution Rules</h4>
            <button
              type="button"
              onClick={() => setActiveInfoDrawer(null)}
              className="text-slate-400 hover:text-white cursor-pointer"
              aria-label="Close Coach Cues"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
            <li>
              <strong className="text-amber-300">{COACH_RULES.orderOfOperations.title}:</strong>{' '}
              {COACH_RULES.orderOfOperations.splitSessions} {COACH_RULES.orderOfOperations.backToBack}
            </li>
            <li>
              <strong className="text-amber-300">{COACH_RULES.zone2Guidance.title}:</strong>{' '}
              {COACH_RULES.zone2Guidance.rule}
            </li>
            <li>
              <strong className="text-amber-300">{COACH_RULES.progressiveOverload.title}:</strong>{' '}
              {COACH_RULES.progressiveOverload.rule}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
