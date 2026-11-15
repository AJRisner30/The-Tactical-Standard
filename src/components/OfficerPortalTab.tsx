import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Upload, User, UserCheck, Dumbbell, Calendar, 
  Plus, Trash2, Edit3, CheckCircle2, AlertCircle, FileText, 
  Send, ChevronRight, Lock, Eye, RefreshCw, X,
  BadgeAlert, Clock, ArrowRight, ShieldAlert, Award,
  CreditCard, ExternalLink, Link2, Save, Sliders, Info
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { AthleteProfile, OfficerAssignedProgram, ExerciseTemplate, WorkoutProgram, SquareConfig } from '../types';
import { 
  subscribeToOfficerProgram, 
  subscribeToAllOfficerPrograms, 
  subscribeToAllAthletes,
  saveOfficerProgramToFirestore,
  deleteOfficerProgramFromFirestore
} from '../utils/firebaseSync';
import { isCoachSession, resetAthleteTrial } from '../utils/athleteAuth';
import { 
  subscribeToSquareConfig, 
  saveSquareConfig, 
  DEFAULT_SQUARE_CONFIG, 
  SQUARE_REQUIREMENTS_CHECKLIST 
} from '../utils/squarePayments';

interface OfficerPortalTabProps {
  currentAthlete: AthleteProfile;
  onStartCustomWorkout?: (program: WorkoutProgram) => void;
  onOpenPricingModal?: () => void;
}

export const OfficerPortalTab: React.FC<OfficerPortalTabProps> = ({
  currentAthlete,
  onStartCustomWorkout,
  onOpenPricingModal,
}) => {
  const { user } = useFirebase();

  // Determine if viewer is Coach AJ / Administrator (strictly risneraryan@gmail.com)
  const isCoachOrAdmin = Boolean(
    user?.email && user.email.trim().toLowerCase() === 'risneraryan@gmail.com'
  );

  // State for the logged-in officer's individual assigned program
  const [officerProgram, setOfficerProgram] = useState<OfficerAssignedProgram | null>(null);
  const [loadingOfficerProg, setLoadingOfficerProg] = useState<boolean>(true);

  // Admin / Coach management state
  const [allOfficers, setAllOfficers] = useState<AthleteProfile[]>([]);
  const [allAssignedPrograms, setAllAssignedPrograms] = useState<OfficerAssignedProgram[]>([]);
  const [selectedTargetOfficer, setSelectedTargetOfficer] = useState<AthleteProfile | null>(null);

  // Upload modal / form state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Square Payment Link Configuration State
  const [squareConfig, setSquareConfig] = useState<SquareConfig>(() => DEFAULT_SQUARE_CONFIG);
  const [squareEnvInput, setSquareEnvInput] = useState<'sandbox' | 'production'>('sandbox');
  const [squareStandardUrlInput, setSquareStandardUrlInput] = useState('');
  const [squareProUrlInput, setSquareProUrlInput] = useState('');
  const [squareAppIdInput, setSquareAppIdInput] = useState('');
  const [savingSquareConfig, setSavingSquareConfig] = useState(false);
  const [squareFeedbackMsg, setSquareFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Upload Form Fields
  const [progTitle, setProgTitle] = useState('');
  const [progSubtitle, setProgSubtitle] = useState('');
  const [progCategory, setProgCategory] = useState<OfficerAssignedProgram['category']>('Tactical & Rucking');
  const [progFrequency, setProgFrequency] = useState('4 Days / Week');
  const [progDuration, setProgDuration] = useState('60');
  const [progNotes, setProgNotes] = useState('');
  const [badgeNumberInput, setBadgeNumberInput] = useState('');
  const [departmentInput, setDepartmentInput] = useState('Infantry / Combat Unit');

  // Days list for schedule builder
  const [scheduleDays, setScheduleDays] = useState<Array<{
    day: number;
    dayLabel: string;
    focus: string;
    warmup: string;
    exercises: ExerciseTemplate[];
    runPacing?: string;
    coachNotes?: string;
  }>>([
    {
      day: 1,
      dayLabel: 'Day 1: Combat Strength & Armor',
      focus: 'Lower Body Strength & Combat Chassis',
      warmup: '5 min dynamic flow, hip openers, glute activation',
      exercises: [
        {
          id: 'ex-1',
          name: 'Front Squat (Combat Stance)',
          muscleGroup: 'Quads',
          defaultSets: 4,
          targetReps: '6-8 reps',
          targetRpe: 8,
          restPeriodSeconds: 120,
          notes: 'Keep torso upright like wearing full tactical plate carrier.',
        },
        {
          id: 'ex-2',
          name: 'Romanian Deadlift',
          muscleGroup: 'Hamstrings & Glutes',
          defaultSets: 3,
          targetReps: '8-10 reps',
          targetRpe: 7,
          restPeriodSeconds: 90,
          notes: 'Feel deep hamstring hinge stretch.',
        },
      ],
      runPacing: 'Zone 2 / Conversational recovery',
      coachNotes: 'Focus on explosive hip drive on every rep.',
    },
    {
      day: 2,
      dayLabel: 'Day 2: Combat Sprint & Upper Armor',
      focus: 'Upper Push/Pull & Tactical Conditioning',
      warmup: 'Band pull-aparts, shoulder dislocates, push-up walks',
      exercises: [
        {
          id: 'ex-3',
          name: 'Barbell Incline Press',
          muscleGroup: 'Chest',
          defaultSets: 4,
          targetReps: '8 reps',
          targetRpe: 8,
          restPeriodSeconds: 90,
          notes: 'Upper chest armor for plate carrier comfort.',
        },
        {
          id: 'ex-4',
          name: 'Weighted Neutral Pull-Ups',
          muscleGroup: 'Back',
          defaultSets: 4,
          targetReps: '6 reps',
          targetRpe: 8,
          restPeriodSeconds: 90,
          notes: 'Strict lockout at top.',
        },
      ],
      runPacing: 'Sprint intervals: 6 x 60m combat sprints',
      coachNotes: 'Combat acceleration burst focus.',
    },
  ]);

  // Active view tab for the officer (e.g. Schedule Day 1, Day 2, etc.)
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  // 1. Subscribe to the logged-in officer's individual program
  useEffect(() => {
    if (!user) {
      setLoadingOfficerProg(false);
      return;
    }
    const unsub = subscribeToOfficerProgram(user.uid, (prog) => {
      setOfficerProgram(prog);
      setLoadingOfficerProg(false);
    });
    return () => unsub();
  }, [user]);

  // 2. If coach/admin, subscribe to all officers and all assigned programs
  useEffect(() => {
    if (!isCoachOrAdmin) return;

    const unsubOfficers = subscribeToAllAthletes((athletes) => {
      setAllOfficers(athletes);
      if (!selectedTargetOfficer && athletes.length > 0) {
        // Default target officer to first non-coach officer if available
        const firstOfficer = athletes.find((a) => a.id !== user?.uid) || athletes[0];
        setSelectedTargetOfficer(firstOfficer);
      }
    });

    const unsubPrograms = subscribeToAllOfficerPrograms((programs) => {
      setAllAssignedPrograms(programs);
    });

    const unsubSquare = subscribeToSquareConfig((cfg) => {
      setSquareConfig(cfg);
      setSquareEnvInput(cfg.environment);
      setSquareStandardUrlInput(cfg.standardPlanUrl);
      setSquareProUrlInput(cfg.proPlanUrl);
      setSquareAppIdInput(cfg.applicationId || '');
    });

    return () => {
      unsubOfficers();
      unsubPrograms();
      unsubSquare();
    };
  }, [isCoachOrAdmin, user]);

  const handleSaveSquareConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCoachOrAdmin) return;
    try {
      setSavingSquareConfig(true);
      setSquareFeedbackMsg(null);
      await saveSquareConfig({
        environment: squareEnvInput,
        standardPlanUrl: squareStandardUrlInput.trim() || DEFAULT_SQUARE_CONFIG.standardPlanUrl,
        proPlanUrl: squareProUrlInput.trim() || DEFAULT_SQUARE_CONFIG.proPlanUrl,
        applicationId: squareAppIdInput.trim() || undefined,
        locationId: squareConfig.locationId,
      }, user?.email || 'risnerathletics@gmail.com');
      setSquareFeedbackMsg({
        type: 'success',
        text: `Square payment configuration successfully saved in ${squareEnvInput.toUpperCase()} mode!`,
      });
      setTimeout(() => setSquareFeedbackMsg(null), 6000);
    } catch (err: any) {
      setSquareFeedbackMsg({
        type: 'error',
        text: err?.message || 'Failed to save Square payment configuration.',
      });
    } finally {
      setSavingSquareConfig(false);
    }
  };

  const handleOpenUploadModal = (target?: AthleteProfile, existingProg?: OfficerAssignedProgram) => {
    if (!isCoachOrAdmin) return;
    if (target) {
      setSelectedTargetOfficer(target);
    }
    if (existingProg) {
      setEditingProgramId(existingProg.id);
      setProgTitle(existingProg.programTitle);
      setProgSubtitle(existingProg.programSubtitle || '');
      setProgCategory(existingProg.category);
      setProgFrequency(existingProg.frequency || '4 Days / Week');
      setProgDuration(String(existingProg.estimatedDurationMinutes || 60));
      setProgNotes(existingProg.coachNotes || '');
      setBadgeNumberInput(existingProg.badgeNumber || '');
      setDepartmentInput(existingProg.department || 'Infantry / Combat Unit');
      if (existingProg.scheduleDays && existingProg.scheduleDays.length > 0) {
        setScheduleDays(existingProg.scheduleDays.map((d, i) => ({
          day: d.day || i + 1,
          dayLabel: d.dayLabel || `Day ${i + 1}`,
          focus: d.focus || 'Training Session',
          warmup: d.warmup || '',
          exercises: d.exercises || [],
          runPacing: d.runPacing,
          coachNotes: d.coachNotes,
        })));
      }
    } else {
      setEditingProgramId(null);
      setProgTitle(`${target?.name || 'Custom'} Mission Protocol`);
      setProgSubtitle('Tailored Combat Strength, Sprint Velocity & Body Armor Protocol');
      setProgCategory('Tactical & Rucking');
      setProgFrequency('4 Days / Week');
      setProgDuration('60');
      setProgNotes('Prescribed individually for your training cycle, unit PT standards, and joint mobility.');
      setBadgeNumberInput('');
      setDepartmentInput('Infantry / Combat Unit');
    }
    setIsUploadModalOpen(true);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetOfficer) {
      setFeedbackMsg({ type: 'error', text: 'Please select a service member to assign this program to.' });
      return;
    }
    if (!progTitle.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Please enter a program title.' });
      return;
    }

    try {
      setSubmitting(true);
      const programId = editingProgramId || `prog-officer-${Date.now()}`;
      
      // Flatten all exercises across days for root compatibility
      const allExercises: ExerciseTemplate[] = scheduleDays.flatMap((d) => d.exercises);

      const payload: OfficerAssignedProgram = {
        id: programId,
        officerUserId: selectedTargetOfficer.id, // Scoped specifically to this officer account
        officerEmail: selectedTargetOfficer.email,
        officerName: selectedTargetOfficer.name,
        badgeNumber: badgeNumberInput.trim() || undefined,
        department: departmentInput.trim() || undefined,
        programTitle: progTitle.trim(),
        programSubtitle: progSubtitle.trim() || undefined,
        category: progCategory,
        frequency: progFrequency.trim() || '4 Days / Week',
        estimatedDurationMinutes: Number(progDuration) || 60,
        coachNotes: progNotes.trim() || undefined,
        scheduleDays,
        exercises: allExercises,
        assignedByEmail: user?.email || 'risnerathletics@gmail.com',
        assignedAt: new Date().toISOString(),
      };

      await saveOfficerProgramToFirestore(payload);
      setFeedbackMsg({
        type: 'success',
        text: `Program successfully uploaded to ${selectedTargetOfficer.name}'s Command Portal!`
      });
      setIsUploadModalOpen(false);
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      console.error('Failed to save member program:', err);
      setFeedbackMsg({ type: 'error', text: err?.message || 'Failed to upload program to Firestore.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProgram = async (programId: string, officerName: string) => {
    if (!window.confirm(`Are you sure you want to remove the assigned program for ${officerName}?`)) {
      return;
    }
    try {
      await deleteOfficerProgramFromFirestore(programId);
      setFeedbackMsg({ type: 'success', text: `Program for ${officerName} deleted.` });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.message || 'Failed to delete program.' });
    }
  };

  const handleStartAssignedWorkout = (dayPlan: typeof scheduleDays[0]) => {
    if (!onStartCustomWorkout) return;
    const workoutProg: WorkoutProgram = {
      id: `live-officer-${dayPlan.day}-${Date.now()}`,
      title: `${officerProgram?.programTitle || 'Individual Program'} - ${dayPlan.dayLabel}`,
      subtitle: dayPlan.focus,
      category: (officerProgram?.category as any) || 'Strength',
      frequency: officerProgram?.frequency || '4 Days / Week',
      estimatedDurationMinutes: officerProgram?.estimatedDurationMinutes || 60,
      description: dayPlan.coachNotes || officerProgram?.coachNotes || 'Confidential mission program assigned by coach.',
      exercises: dayPlan.exercises,
    };
    onStartCustomWorkout(workoutProg);
  };

  // Helper to add an exercise to a day
  const handleAddExerciseToDay = (dayIndex: number) => {
    const updated = [...scheduleDays];
    const newEx: ExerciseTemplate = {
      id: `ex-${Date.now()}`,
      name: 'New Prescribed Exercise',
      muscleGroup: 'Full Body',
      defaultSets: 3,
      targetReps: '8-10 reps',
      targetRpe: 8,
      restPeriodSeconds: 90,
      notes: 'Prescribed tactical coaching cue',
    };
    updated[dayIndex].exercises.push(newEx);
    setScheduleDays(updated);
  };

  // Helper to remove an exercise
  const handleRemoveExerciseFromDay = (dayIndex: number, exIndex: number) => {
    const updated = [...scheduleDays];
    updated[dayIndex].exercises.splice(exIndex, 1);
    setScheduleDays(updated);
  };

  // Helper to add a schedule day
  const handleAddDay = () => {
    const nextDayNum = scheduleDays.length + 1;
    setScheduleDays([
      ...scheduleDays,
      {
        day: nextDayNum,
        dayLabel: `Day ${nextDayNum}: Custom Split`,
        focus: 'Duty Conditioning & Core',
        warmup: '5 mins mobility and core activation',
        exercises: [],
        coachNotes: 'Prescribed for recovery or shift duty.',
      },
    ]);
  };

  // Helper to remove a schedule day
  const handleRemoveDay = (dayIndex: number) => {
    if (scheduleDays.length <= 1) return;
    const updated = scheduleDays.filter((_, i) => i !== dayIndex).map((d, i) => ({
      ...d,
      day: i + 1,
    }));
    setScheduleDays(updated);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedbackMsg && (
        <div 
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm animate-fade-in ${
            feedbackMsg.type === 'success' 
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200' 
              : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="font-medium">{feedbackMsg.text}</span>
          </div>
          <button 
            onClick={() => setFeedbackMsg(null)}
            className="text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#141a21] via-[#0e1217] to-[#090b0d] border border-amber-500/30 p-5 sm:p-7 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Confidential Command Portal
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Encrypted Account Isolation
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-athletic font-black uppercase tracking-wider text-white">
              {isCoachOrAdmin ? 'Command Portal Administration' : 'My Confidential Mission Protocol'}
            </h1>
            <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
              {isCoachOrAdmin ? (
                <>
                  Unit Roster &amp; Mission Protocols · Upload and prescribe custom training splits for individual service members. <strong className="text-amber-300 font-semibold">Each member account can only see their own.</strong>
                </>
              ) : (
                <>
                  Isolated training protocol prescribed specifically for <strong className="text-white">{currentAthlete.name}</strong> by Coach Aryan &quot;AJ&quot; Risner. Scoped strictly to your profile.
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {isCoachOrAdmin && (
              <button
                onClick={() => handleOpenUploadModal()}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg cursor-pointer transition-all active:scale-95"
              >
                <Upload className="w-4 h-4 text-black" />
                <span>Upload Member Program</span>
              </button>
            )}
            <div className="px-3 py-2 bg-[#0e1217] border border-zinc-700/80 rounded-xl text-xs text-zinc-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Member: <strong className="text-white">{currentAthlete.name}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: COACH / ADMIN MANAGEMENT VIEW */}
      {isCoachOrAdmin && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-athletic font-black uppercase tracking-wider text-white">
                Coach Management: Unit Roster &amp; Assigned Programs
              </h2>
            </div>
            <span className="text-xs text-zinc-400 font-mono tabular-nums">
              Admin Access: {allOfficers.length} Members Registered
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Members List */}
            <div className="lg:col-span-1 bg-[#0e1217] border border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Select Member Account
                </span>
                <span className="text-[10px] text-amber-400 font-mono font-bold tabular-nums">
                  {allOfficers.length} Accounts
                </span>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {allOfficers.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center italic">
                    No registered service member profiles found in Firestore yet.
                  </p>
                ) : (
                  allOfficers.map((officer) => {
                    const isSelected = selectedTargetOfficer?.id === officer.id;
                    const assignedProg = allAssignedPrograms.find((p) => p.officerUserId === officer.id);

                    return (
                      <div
                        key={officer.id}
                        onClick={() => setSelectedTargetOfficer(officer)}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/70 shadow-md'
                            : 'bg-[#141a21]/70 border-zinc-800 hover:border-zinc-700 hover:bg-[#141a21]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center text-xs font-black text-black">
                              {officer.name[0] || 'M'}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>{officer.name}</span>
                                {officer.id === user?.uid && (
                                  <span className="text-[9px] px-1 bg-amber-500/30 text-amber-200 rounded">You</span>
                                )}
                              </div>
                              <div className="text-[10px] text-zinc-400 font-mono truncate max-w-[140px]">
                                {officer.email || 'Member Account'}
                              </div>
                            </div>
                          </div>
                          {assignedProg ? (
                            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 rounded font-bold">
                              Assigned
                            </span>
                          ) : (
                            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                              No Program
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Selected Member Detail & Action Card */}
            <div className="lg:col-span-2 bg-[#0e1217] border border-zinc-800 rounded-xl p-5 space-y-4">
              {selectedTargetOfficer ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-amber-400" />
                        <h3 className="text-base font-bold text-white">
                          Selected: {selectedTargetOfficer.name}
                        </h3>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">
                        UID: {selectedTargetOfficer.id} · Goal: {selectedTargetOfficer.primaryGoal} · Level: {selectedTargetOfficer.experienceLevel}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const existing = allAssignedPrograms.find((p) => p.officerUserId === selectedTargetOfficer.id);
                        handleOpenUploadModal(selectedTargetOfficer, existing);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer shadow transition-all active:scale-95 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5 text-black" />
                      <span>{allAssignedPrograms.some((p) => p.officerUserId === selectedTargetOfficer.id) ? 'Edit Assigned Program' : 'Upload Program for Member'}</span>
                    </button>
                  </div>

                  {/* Reset Test Account Action */}
                  {selectedTargetOfficer.email?.trim().toLowerCase() === 'risnerathletics@gmail.com' && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-amber-300">
                          Authorized Test Profile Detected
                        </div>
                        <p className="text-[11px] text-zinc-300">
                          Reset this test account&apos;s 14-day Pro free trial so you can resume live testing without paywalls.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          resetAthleteTrial('risnerathletics@gmail.com');
                          setFeedbackMsg({ type: 'success', text: '14-Day Pro Free Trial reset for risnerathletics@gmail.com!' });
                          setTimeout(() => setFeedbackMsg(null), 3000);
                        }}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-black uppercase tracking-wider transition cursor-pointer shrink-0 shadow"
                      >
                        Reset 14-Day Trial
                      </button>
                    </div>
                  )}

                  {/* Program Status for this member */}
                  {(() => {
                    const assigned = allAssignedPrograms.find((p) => p.officerUserId === selectedTargetOfficer.id);
                    if (!assigned) {
                      return (
                        <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl space-y-3">
                          <FileText className="w-10 h-10 text-zinc-600 mx-auto" />
                          <h4 className="text-sm font-bold text-zinc-300">
                            No Individual Program Uploaded Yet
                          </h4>
                          <p className="text-xs text-zinc-400 max-w-md mx-auto">
                            {selectedTargetOfficer.name} does not have an individualized program. Click &quot;Upload Program for Member&quot; above to create and upload their private protocol.
                          </p>
                          <button
                            onClick={() => handleOpenUploadModal(selectedTargetOfficer)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Create Program</span>
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-[#141a21] border border-amber-500/30 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/35 px-2 py-0.5 rounded font-black uppercase">
                                  {assigned.category}
                                </span>
                                <span className="text-xs text-zinc-400">
                                  {assigned.frequency}
                                </span>
                              </div>
                              <h4 className="text-base font-athletic font-black uppercase text-white mt-1">
                                {assigned.programTitle}
                              </h4>
                              {assigned.programSubtitle && (
                                <p className="text-xs text-amber-300/80 mt-0.5">
                                  {assigned.programSubtitle}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenUploadModal(selectedTargetOfficer, assigned)}
                                className="p-1.5 text-zinc-400 hover:text-amber-300 hover:bg-amber-500/15 rounded transition-colors"
                                title="Edit program"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProgram(assigned.id, selectedTargetOfficer.name)}
                                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                                title="Delete program"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {assigned.coachNotes && (
                            <div className="p-2.5 rounded-lg bg-[#090b0d] border border-zinc-800 text-xs text-zinc-300">
                              <strong className="text-amber-400 block mb-0.5">Coach Prescription Notes:</strong>
                              {assigned.coachNotes}
                            </div>
                          )}

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-mono">
                            <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                              <span className="text-[10px] text-zinc-500 block">Schedule Days</span>
                              <span className="font-bold text-white tabular-nums">{assigned.scheduleDays?.length || 0} Days</span>
                            </div>
                            <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                              <span className="text-[10px] text-zinc-500 block">Total Exercises</span>
                              <span className="font-bold text-white tabular-nums">{assigned.exercises?.length || 0} Exercises</span>
                            </div>
                            <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                              <span className="text-[10px] text-zinc-500 block">Est. Duration</span>
                              <span className="font-bold text-white tabular-nums">{assigned.estimatedDurationMinutes || 60} Min</span>
                            </div>
                            <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                              <span className="text-[10px] text-zinc-500 block">Uploaded By</span>
                              <span className="font-bold text-amber-300 truncate block">{assigned.assignedByEmail?.split('@')[0] || 'Coach'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  Select a member from the list on the left to view or upload their individualized program.
                </div>
              )}
            </div>
          </div>

          {/* Square Payment & Subscription Configuration Card (Coach AJ) */}
          <div className="bg-[#0e1217] border border-amber-500/30 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center text-amber-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-athletic">
                    Square Payment Configuration &amp; Subscription Setup
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Manage Square Hosted Payment Links for Standard ($15/mo) and Pro ($30/mo) recurring tiers.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase border ${
                  squareEnvInput === 'production'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                    : 'bg-amber-950 text-amber-300 border-amber-500/50'
                }`}>
                  Current Mode: {squareEnvInput}
                </span>
              </div>
            </div>

            {/* Status Alert */}
            {squareFeedbackMsg && (
              <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 border ${
                squareFeedbackMsg.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  : 'bg-red-950/80 border-red-500/50 text-red-300'
              }`}>
                {squareFeedbackMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{squareFeedbackMsg.text}</span>
              </div>
            )}

            {/* Checklist: Everything We Need From You */}
            <div className="p-4 rounded-xl bg-[#090b0d] border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  What We Need From You (Square Setup Guide)
                </span>
                <a
                  href="https://squareup.com/dashboard/payment-links"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                >
                  <span>Open Square Payment Links</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {SQUARE_REQUIREMENTS_CHECKLIST.map((step) => (
                  <div key={step.step} className="p-3 rounded-lg bg-[#141a21] border border-zinc-800/80 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/35 text-[10px] font-bold flex items-center justify-center tabular-nums">
                        {step.step}
                      </span>
                      <strong className="text-white text-xs">{step.title}</strong>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed pl-7">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Square Links Form */}
            <form onSubmit={handleSaveSquareConfig} className="space-y-4">
              {/* Environment Toggle */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 font-mono">
                  Square Environment
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => setSquareEnvInput('sandbox')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap ${
                      squareEnvInput === 'sandbox'
                        ? 'bg-amber-950/60 border-amber-500 text-amber-300 shadow'
                        : 'bg-[#141a21] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span>Sandbox Mode (Testing)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSquareEnvInput('production')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap ${
                      squareEnvInput === 'production'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow'
                        : 'bg-[#141a21] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span>Production Mode (Live)</span>
                  </button>
                </div>
              </div>

              {/* Standard Plan Link */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                    Standard Plan Recurring Payment Link ($15/mo)
                  </label>
                  {squareStandardUrlInput && (
                    <a
                      href={squareStandardUrlInput}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                    >
                      <Link2 className="w-3 h-3" />
                      <span>Test URL</span>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={squareStandardUrlInput}
                  onChange={(e) => setSquareStandardUrlInput(e.target.value)}
                  placeholder="https://square.link/u/... or https://sandbox.square.link/u/..."
                  className="w-full bg-[#090b0d] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
                <span className="text-[10px] text-zinc-500 block">
                  Copy from Square Dashboard &gt; Payment Links for the $15.00/month recurring plan.
                </span>
              </div>

              {/* Pro Plan Link */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                    Pro Warfighter Plan Recurring Payment Link ($30/mo)
                  </label>
                  {squareProUrlInput && (
                    <a
                      href={squareProUrlInput}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                    >
                      <Link2 className="w-3 h-3" />
                      <span>Test URL</span>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={squareProUrlInput}
                  onChange={(e) => setSquareProUrlInput(e.target.value)}
                  placeholder="https://square.link/u/... or https://sandbox.square.link/u/..."
                  className="w-full bg-[#090b0d] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
                <span className="text-[10px] text-zinc-500 block">
                  Copy from Square Dashboard &gt; Payment Links for the $30.00/month recurring plan.
                </span>
              </div>

              {/* Optional Square App ID / Location ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Square Application ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={squareAppIdInput}
                    onChange={(e) => setSquareAppIdInput(e.target.value)}
                    placeholder="sandbox-sq0idb-... or sq0idp-..."
                    className="w-full bg-[#090b0d] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Square Location ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={squareConfig.locationId || ''}
                    disabled
                    className="w-full bg-[#090b0d]/50 border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-500 font-mono"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                <span className="text-[11px] text-zinc-400 font-mono">
                  Last updated: {squareConfig.updatedAt ? new Date(squareConfig.updatedAt).toLocaleDateString() : 'Initial Setup'}
                </span>

                <button
                  type="submit"
                  disabled={savingSquareConfig}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded-xl transition cursor-pointer shadow-lg flex items-center gap-2"
                >
                  {savingSquareConfig ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{savingSquareConfig ? 'Saving Links...' : 'Save Square Links to Firestore'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 2: THE LOGGED-IN SERVICE MEMBER'S PRIVATE PORTAL VIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-athletic font-black uppercase tracking-wider text-white">
              My Individual Mission Protocol
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Private To: {currentAthlete.name}
          </span>
        </div>

        {loadingOfficerProg ? (
          <div className="p-12 text-center text-zinc-400 border border-zinc-800 rounded-2xl bg-[#0e1217] flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
            <span className="text-sm font-medium">Checking encrypted command portal...</span>
          </div>
        ) : !officerProgram ? (
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-gradient-to-b from-[#141a21] to-[#090b0d] border border-amber-500/20 shadow-xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-athletic font-black uppercase text-white tracking-wide">
                No Individual Program Assigned Yet
              </h3>
              <p className="text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
                Your account is ready for an individualized prescription. Once Coach Aryan &quot;AJ&quot; Risner creates your custom mission split, it will appear here instantly and exclusively on your account.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap justify-center items-center gap-3 text-xs">
              <div className="px-3 py-1.5 bg-[#0e1217] border border-zinc-800 rounded-lg text-zinc-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Account Verified: {user?.email}</span>
              </div>
              <a
                href="mailto:risnerathletics@gmail.com?subject=Custom%20Mission%20Protocol%20Request"
                className="px-3.5 py-1.5 bg-amber-500/15 hover:bg-amber-500 text-amber-200 hover:text-black border border-amber-500/40 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request Custom Program From Coach</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Program Overview Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#141a21] via-[#0e1217] to-[#090b0d] border border-amber-500/35 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-amber-500/15 text-amber-300 border border-amber-500/35">
                      {officerProgram.category}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {officerProgram.frequency}
                    </span>
                    {officerProgram.badgeNumber && (
                      <span className="text-xs text-zinc-300 font-mono bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700">
                        Rank/ID #{officerProgram.badgeNumber}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-athletic font-black uppercase tracking-wide text-white">
                    {officerProgram.programTitle}
                  </h3>
                  {officerProgram.programSubtitle && (
                    <p className="text-sm text-amber-300/90 leading-relaxed font-medium">
                      {officerProgram.programSubtitle}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-zinc-400 block font-mono">Prescribed By</span>
                  <span className="text-xs font-bold text-amber-400">
                    {officerProgram.assignedByEmail || 'Aryan "AJ" Risner (Coach)'}
                  </span>
                </div>
              </div>

              {officerProgram.coachNotes && (
                <div className="p-3.5 rounded-xl bg-[#090b0d] border border-amber-500/30 text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confidential Coaching &amp; Mission Directives</span>
                  </div>
                  <p className="whitespace-pre-line">{officerProgram.coachNotes}</p>
                </div>
              )}
            </div>

            {officerProgram.scheduleDays && officerProgram.scheduleDays.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {officerProgram.scheduleDays.map((dayPlan, idx) => (
                    <button
                      key={dayPlan.day}
                      onClick={() => setActiveDayIndex(idx)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                        activeDayIndex === idx
                          ? 'bg-amber-500 text-black shadow-lg'
                          : 'bg-[#141a21] text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <span>{dayPlan.dayLabel || `Day ${dayPlan.day}`}</span>
                    </button>
                  ))}
                </div>

                {/* Active Day View */}
                {(() => {
                  const currentDay = officerProgram.scheduleDays[activeDayIndex] || officerProgram.scheduleDays[0];
                  if (!currentDay) return null;

                  return (
                    <div className="rounded-2xl bg-[#0e1217] border border-amber-500/30 p-5 sm:p-6 space-y-5 shadow-xl">
                      {/* Day Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                              {currentDay.dayLabel || `Day ${currentDay.day}`}
                            </span>
                            <span className="text-zinc-600">·</span>
                            <span className="text-xs text-zinc-400 font-mono tabular-nums">
                              {currentDay.exercises.length} Prescribed Movements
                            </span>
                          </div>
                          <h4 className="text-lg sm:text-xl font-athletic font-black uppercase text-white mt-0.5">
                            {currentDay.focus}
                          </h4>
                        </div>

                        {onStartCustomWorkout && currentDay.exercises.length > 0 && (
                          <button
                            onClick={() => handleStartAssignedWorkout(currentDay)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg cursor-pointer transition-all active:scale-95 shrink-0 whitespace-nowrap"
                          >
                            <Dumbbell className="w-4 h-4" />
                            <span>Launch Live Tracker</span>
                          </button>
                        )}
                      </div>

                      {/* Warmup guidance */}
                      {currentDay.warmup && (
                        <div className="p-3 rounded-xl bg-[#090b0d] border border-zinc-800/80 text-xs text-zinc-300 flex items-start gap-2.5">
                          <span className="text-amber-400 font-black shrink-0 uppercase tracking-wider text-[10px] mt-0.5 px-1.5 py-0.5 bg-amber-950/70 rounded border border-amber-500/40">
                            Warm-Up
                          </span>
                          <span className="leading-relaxed">{currentDay.warmup}</span>
                        </div>
                      )}

                      {/* Prescribed Exercises Table / Cards */}
                      <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                          Prescribed Movement Stack
                        </span>

                        {currentDay.exercises.length === 0 ? (
                          <div className="p-6 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                            Rest / Active recovery day. No prescribed lifting movements.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {currentDay.exercises.map((ex, exIdx) => (
                              <div
                                key={ex.id || exIdx}
                                className="p-3.5 rounded-xl bg-[#141a21] border border-zinc-800/80 hover:border-amber-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-[10px] font-bold tabular-nums shrink-0">
                                      {exIdx + 1}
                                    </span>
                                    <h5 className="text-sm font-bold text-white">
                                      {ex.name}
                                    </h5>
                                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
                                      {ex.muscleGroup}
                                    </span>
                                  </div>
                                  {ex.notes && (
                                    <p className="text-xs text-zinc-400 pl-7 leading-relaxed">
                                      {ex.notes}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-3 pl-7 sm:pl-0 shrink-0 text-xs font-mono tabular-nums">
                                  <div className="px-2.5 py-1 rounded bg-[#090b0d] border border-zinc-800 text-center">
                                    <span className="text-[9px] text-zinc-500 block">Sets</span>
                                    <span className="font-bold text-white">{ex.defaultSets} Sets</span>
                                  </div>
                                  <div className="px-2.5 py-1 rounded bg-[#090b0d] border border-zinc-800 text-center">
                                    <span className="text-[9px] text-zinc-500 block">Target Reps</span>
                                    <span className="font-bold text-amber-300">{ex.targetReps}</span>
                                  </div>
                                  {ex.targetRpe && (
                                    <div className="px-2.5 py-1 rounded bg-[#090b0d] border border-zinc-800 text-center">
                                      <span className="text-[9px] text-zinc-500 block">Target RPE</span>
                                      <span className="font-bold text-amber-400">{ex.targetRpe}</span>
                                    </div>
                                  )}
                                  <div className="px-2.5 py-1 rounded bg-[#090b0d] border border-zinc-800 text-center">
                                    <span className="text-[9px] text-zinc-500 block">Rest</span>
                                    <span className="font-bold text-zinc-300">{ex.restPeriodSeconds}s</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Run / Conditioning pacing note */}
                      {currentDay.runPacing && (
                        <div className="p-3 rounded-xl bg-[#090b0d] border border-amber-500/20 text-xs text-zinc-300 flex items-start gap-2.5">
                          <span className="text-amber-400 font-black shrink-0 uppercase tracking-wider text-[10px] mt-0.5 px-1.5 py-0.5 bg-amber-950/70 rounded border border-amber-500/40">
                            Conditioning
                          </span>
                          <span className="leading-relaxed">{currentDay.runPacing}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 3: UPLOAD / EDIT MODAL FOR COACH AJ / ADMIN */}
      {isCoachOrAdmin && isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0e1217] border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col">
            <div className="sticky top-0 z-10 bg-[#0e1217]/95 backdrop-blur-md p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-athletic font-black uppercase text-white tracking-wide">
                  {editingProgramId ? 'Edit Assigned Member Protocol' : 'Upload Program Specific to Member'}
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="p-4 sm:p-6 space-y-5">
              {/* Target Member Selector */}
              <div className="p-4 rounded-xl bg-[#090b0d] border border-amber-500/30 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Target Service Member Account (Exclusive Access)</span>
                </label>
                <select
                  value={selectedTargetOfficer?.id || ''}
                  onChange={(e) => {
                    const match = allOfficers.find((o) => o.id === e.target.value);
                    if (match) setSelectedTargetOfficer(match);
                  }}
                  className="w-full bg-[#141a21] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                >
                  {allOfficers.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.email || o.id})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-400 font-mono">
                  This program will be scoped strictly with <code className="text-amber-300">officerUserId = &quot;{selectedTargetOfficer?.id}&quot;</code> so no other member can view it.
                </p>
              </div>

              {/* General Program Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Program Title *
                  </label>
                  <input
                    type="text"
                    value={progTitle}
                    onChange={(e) => setProgTitle(e.target.value)}
                    placeholder="e.g. SGT Davis 6-Week Selection Preparation Protocol"
                    className="w-full bg-[#141a21] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Subtitle / Operational Focus
                  </label>
                  <input
                    type="text"
                    value={progSubtitle}
                    onChange={(e) => setProgSubtitle(e.target.value)}
                    placeholder="e.g. Body Armor Joint Stability & Combat Sprint Acceleration"
                    className="w-full bg-[#141a21] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Category
                  </label>
                  <select
                    value={progCategory}
                    onChange={(e) => setProgCategory(e.target.value as any)}
                    className="w-full bg-[#141a21] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Tactical & Rucking">Tactical &amp; Rucking</option>
                    <option value="Strength">Strength &amp; Armor</option>
                    <option value="Hypertrophy">Hypertrophy</option>
                    <option value="Athletic Conditioning">Athletic Conditioning</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Frequency / Split
                  </label>
                  <input
                    type="text"
                    value={progFrequency}
                    onChange={(e) => setProgFrequency(e.target.value)}
                    placeholder="e.g. 4 Days / Week (Deployment Split)"
                    className="w-full bg-[#141a21] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Rank / Callsign (Optional)
                  </label>
                  <input
                    type="text"
                    value={badgeNumberInput}
                    onChange={(e) => setBadgeNumberInput(e.target.value)}
                    placeholder="e.g. SGT / E-5"
                    className="w-full bg-[#141a21] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Unit / Command
                  </label>
                  <input
                    type="text"
                    value={departmentInput}
                    onChange={(e) => setDepartmentInput(e.target.value)}
                    placeholder="e.g. 2nd Infantry Brigade"
                    className="w-full bg-[#141a21] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Confidential Coach Prescription &amp; Field Notes
                  </label>
                  <textarea
                    rows={3}
                    value={progNotes}
                    onChange={(e) => setProgNotes(e.target.value)}
                    placeholder="Detailed confidential notes on rest intervals, injury accommodations, plate carrier wear, or field schedule..."
                    className="w-full bg-[#141a21] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Schedule Days Builder */}
              <div className="space-y-4 pt-3 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-athletic font-black uppercase text-white tracking-wide">
                      Training Schedule Days ({scheduleDays.length} Days)
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Build the day-by-day workout splits and exercises for this service member.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Day</span>
                  </button>
                </div>

                {scheduleDays.map((dayPlan, dayIdx) => (
                  <div
                    key={dayPlan.day}
                    className="p-4 rounded-xl bg-[#090b0d] border border-zinc-800 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-6 h-6 rounded bg-amber-500/25 text-amber-300 border border-amber-500/35 text-xs font-bold flex items-center justify-center tabular-nums">
                          {dayPlan.day}
                        </span>
                        <input
                          type="text"
                          value={dayPlan.dayLabel}
                          onChange={(e) => {
                            const updated = [...scheduleDays];
                            updated[dayIdx].dayLabel = e.target.value;
                            setScheduleDays(updated);
                          }}
                          placeholder="Day Label (e.g. Day 1: Combat Strength)"
                          className="bg-[#141a21] border border-zinc-700 rounded px-2.5 py-1 text-xs text-white font-bold flex-1 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveDay(dayIdx)}
                        className="text-zinc-500 hover:text-rose-400 p-1 rounded cursor-pointer"
                        title="Remove Day"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                          Focus
                        </label>
                        <input
                          type="text"
                          value={dayPlan.focus}
                          onChange={(e) => {
                            const updated = [...scheduleDays];
                            updated[dayIdx].focus = e.target.value;
                            setScheduleDays(updated);
                          }}
                          placeholder="e.g. Lower Body & Combat Chassis"
                          className="w-full bg-[#141a21] border border-zinc-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                          Warm-Up Notes
                        </label>
                        <input
                          type="text"
                          value={dayPlan.warmup}
                          onChange={(e) => {
                            const updated = [...scheduleDays];
                            updated[dayIdx].warmup = e.target.value;
                            setScheduleDays(updated);
                          }}
                          placeholder="Dynamic mobility, band work..."
                          className="w-full bg-[#141a21] border border-zinc-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Exercises in this day */}
                    <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-400 uppercase text-[10px] tabular-nums">
                          Exercises ({dayPlan.exercises.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddExerciseToDay(dayIdx)}
                          className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Exercise</span>
                        </button>
                      </div>

                      {dayPlan.exercises.map((ex, exIdx) => (
                        <div
                          key={ex.id || exIdx}
                          className="p-2.5 rounded-lg bg-[#141a21] border border-zinc-800/80 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={ex.name}
                              onChange={(e) => {
                                const updated = [...scheduleDays];
                                updated[dayIdx].exercises[exIdx].name = e.target.value;
                                setScheduleDays(updated);
                              }}
                              placeholder="Exercise Name"
                              className="bg-[#090b0d] border border-zinc-700 rounded px-2 py-1 text-xs text-white font-bold flex-1 focus:outline-none focus:border-amber-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExerciseFromDay(dayIdx, exIdx)}
                              className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] tabular-nums">
                            <div>
                              <span className="text-zinc-500 block">Sets</span>
                              <input
                                type="number"
                                min={1}
                                max={20}
                                value={ex.defaultSets}
                                onChange={(e) => {
                                  const updated = [...scheduleDays];
                                  updated[dayIdx].exercises[exIdx].defaultSets = Number(e.target.value) || 3;
                                  setScheduleDays(updated);
                                }}
                                className="w-full bg-[#090b0d] border border-zinc-700 rounded px-1.5 py-0.5 text-white focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <div>
                              <span className="text-zinc-500 block">Target Reps</span>
                              <input
                                type="text"
                                value={ex.targetReps}
                                onChange={(e) => {
                                  const updated = [...scheduleDays];
                                  updated[dayIdx].exercises[exIdx].targetReps = e.target.value;
                                  setScheduleDays(updated);
                                }}
                                placeholder="8-10 reps"
                                className="w-full bg-[#090b0d] border border-zinc-700 rounded px-1.5 py-0.5 text-white focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <div>
                              <span className="text-zinc-500 block">Rest (sec)</span>
                              <input
                                type="number"
                                value={ex.restPeriodSeconds}
                                onChange={(e) => {
                                  const updated = [...scheduleDays];
                                  updated[dayIdx].exercises[exIdx].restPeriodSeconds = Number(e.target.value) || 90;
                                  setScheduleDays(updated);
                                }}
                                className="w-full bg-[#090b0d] border border-zinc-700 rounded px-1.5 py-0.5 text-white focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <div>
                              <span className="text-zinc-500 block">Muscle Group</span>
                              <select
                                value={ex.muscleGroup}
                                onChange={(e) => {
                                  const updated = [...scheduleDays];
                                  updated[dayIdx].exercises[exIdx].muscleGroup = e.target.value as any;
                                  setScheduleDays(updated);
                                }}
                                className="w-full bg-[#090b0d] border border-zinc-700 rounded px-1.5 py-0.5 text-white focus:outline-none focus:border-amber-500"
                              >
                                <option value="Chest">Chest</option>
                                <option value="Back">Back</option>
                                <option value="Quads">Quads</option>
                                <option value="Hamstrings & Glutes">Hamstrings &amp; Glutes</option>
                                <option value="Shoulders">Shoulders</option>
                                <option value="Arms">Arms</option>
                                <option value="Core">Core</option>
                                <option value="Full Body">Full Body</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="sticky bottom-0 bg-[#0e1217]/95 backdrop-blur-md pt-4 pb-2 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  {submitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{submitting ? 'Saving to Member Account...' : 'Confirm & Upload Program'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
