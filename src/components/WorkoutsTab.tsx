import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';
import {
  WorkoutProgram,
  AthleteProfile,
  ProgramKey,
  WorkoutSessionLog,
  isBodyweightExercise,
  isExerciseTimed,
} from '../types';
import { isMasterExemptAccount, isCoachSession } from '../utils/athleteAuth';
import { auth } from '../firebase';
import { DashboardView } from './DashboardView';

interface WorkoutsTabProps {
  programs?: WorkoutProgram[];
  onStartWorkout: (program: WorkoutProgram) => void;
  onSelectWarmup: (warmupId: string) => void;
  onSavePrograms?: (programs: WorkoutProgram[]) => void;
  currentAthlete?: AthleteProfile;
  activeProgramKey?: ProgramKey | 'custom_ai';
  onSelectProgram?: (programKey: ProgramKey | 'custom_ai') => void;
  onOpenQuestionnaire?: () => void;
  onOpenAthleteModal?: () => void;
  onOpenAIGenerator?: (baseProgramKey?: ProgramKey) => void;
  onOpenSingleDayWorkout?: () => void;
  onOpenGuidedTour?: () => void;
  activeCustomProgram?: WorkoutProgram | null;
  onClearCustomProgram?: () => void;
  readinessScore?: number;
  readinessTier?: string;
  latestCoachLog?: WorkoutSessionLog | null;
  onNavigateToLogs?: () => void;
  coachPublishedPrograms?: WorkoutProgram[];
  onAdaptCustomProgram?: (program: WorkoutProgram) => void;
  onOpenCoachBuilder?: (programToEdit?: WorkoutProgram | null) => void;
  onDeleteCoachProgram?: (programId: string) => Promise<void>;
  workoutLogs?: WorkoutSessionLog[];
  userId?: string;
}

export const WorkoutsTab: React.FC<WorkoutsTabProps> = ({
  onStartWorkout,
  onSelectWarmup,
  currentAthlete,
  activeProgramKey,
  onSelectProgram,
  onOpenQuestionnaire,
  onOpenAIGenerator,
  onOpenSingleDayWorkout,
  activeCustomProgram,
  onClearCustomProgram,
  latestCoachLog,
  onNavigateToLogs,
  coachPublishedPrograms = [],
  onOpenCoachBuilder,
  onDeleteCoachProgram,
  workoutLogs = [],
  userId,
}) => {
  const isMasterExempt = Boolean(
    (currentAthlete?.email && isMasterExemptAccount(currentAthlete.email)) ||
      (auth.currentUser?.email && isMasterExemptAccount(auth.currentUser.email)) ||
      isCoachSession()
  );

  const handleRunLatestCoachLog = () => {
    if (!latestCoachLog) return;
    const program: WorkoutProgram = {
      id: `coach-latest-${latestCoachLog.id}`,
      title: latestCoachLog.workoutTitle.startsWith("Coach AJ's")
        ? latestCoachLog.workoutTitle
        : `Coach AJ's: ${latestCoachLog.workoutTitle}`,
      subtitle: 'Coach AJ Risner Verified Mission Session',
      category: 'Hybrid',
      frequency: 'Mission Session',
      estimatedDurationMinutes: latestCoachLog.durationMinutes || 60,
      description: `Direct from Coach AJ Risner's verified mission session (${latestCoachLog.date}). Total volume: ${latestCoachLog.totalVolumeLbs.toLocaleString()} lbs. Notes: ${latestCoachLog.notes || 'Mission protocol followed.'}`,
      exercises: latestCoachLog.exercises.map((ex, idx) => {
        const isBw = isBodyweightExercise(ex.exerciseName);
        const isTimedEx = Boolean(ex.isTimed || isExerciseTimed(ex.exerciseName));
        return {
          id: `adopted-ex-${idx}-${Date.now()}`,
          name: ex.exerciseName,
          muscleGroup: ex.muscleGroup,
          type: isTimedEx ? 'cardio' : undefined,
          defaultSets: Math.max(1, ex.sets.length),
          targetReps: isTimedEx
            ? ex.sets.map((s) => s.timeFormatted).filter(Boolean).join('/') || '45s'
            : ex.sets.map((s) => s.reps).filter(Boolean).join('/') || '8-10',
          targetRpe: ex.sets[0]?.rpe || 8.5,
          weight_lbs: isBw ? 0 : (ex.sets[0]?.weightLbs ?? 0),
          restPeriodSeconds: 90,
          notes: `Coach AJ Logged: ${ex.sets
            .map((s) =>
              s.timeFormatted
                ? s.timeFormatted
                : !isBw && s.weightLbs > 0
                ? `${s.weightLbs} lbs × ${s.reps}`
                : `${s.reps} reps`
            )
            .join(', ')}.`,
        };
      }),
    };
    onStartWorkout(program);
  };

  return (
    <div className="space-y-4">
      <DashboardView
        userId={userId || auth.currentUser?.uid}
        workoutLogs={workoutLogs}
        activeProgramKey={activeProgramKey}
        activeCustomProgram={activeCustomProgram}
        coachPublishedPrograms={coachPublishedPrograms}
        isMasterExempt={isMasterExempt}
        onStartWorkout={onStartWorkout}
        onSelectWarmup={onSelectWarmup}
        onSyncLegacyProgramKey={(key) => onSelectProgram?.(key)}
        onOpenAIGenerator={onOpenAIGenerator}
        onOpenSingleDayWorkout={onOpenSingleDayWorkout}
        onOpenQuestionnaire={onOpenQuestionnaire}
        onOpenCoachBuilder={onOpenCoachBuilder}
        onDeleteCoachProgram={onDeleteCoachProgram}
        onClearCustomProgram={onClearCustomProgram}
      />

      {/* Compact Single-Line Coach AJ Latest Mission Strip */}
      {latestCoachLog && (
        <section
          aria-label="Coach AJ Latest Mission Workout"
          className="rounded-xl bg-[#11161F] border border-[#222B3B] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 min-w-0 text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0 truncate">
              <span className="text-amber-400 font-semibold">Coach AJ&apos;s Latest</span>
              <span aria-hidden="true" className="text-slate-600 mx-2">·</span>
              <span className="text-white font-semibold">{latestCoachLog.workoutTitle}</span>
              <span aria-hidden="true" className="text-slate-600 mx-2 hidden md:inline">·</span>
              <span className="text-slate-400 font-mono tabular-nums hidden md:inline">
                {latestCoachLog.date} · {latestCoachLog.durationMinutes}m
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRunLatestCoachLog}
              className="min-h-[36px] px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#0B0E14] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Run Session</span>
            </button>

            {onNavigateToLogs && (
              <button
                type="button"
                onClick={onNavigateToLogs}
                className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[#262F40] hover:border-slate-500 text-slate-300 hover:text-white font-medium text-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Logs
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default WorkoutsTab;
