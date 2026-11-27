import React, { useState, useEffect } from 'react';
import { 
  getStoredPrograms, savePrograms, 
  getStoredWorkoutLogs,
  saveActiveCustomAIProgram,
  getStoredActiveCustomAIProgram,
  clearActiveCustomAIProgram,
  saveActiveProgramKey,
  getStoredActiveProgramKey
} from './utils/storage';
import { WorkoutProgram, WorkoutSessionLog, ProgramKey, QuestionnaireAnswers, SubscriptionRecord } from './types';
import { Navbar, TabType } from './components/Navbar';
import { WorkoutsTab } from './components/WorkoutsTab';
import { OfficerPortalTab } from './components/OfficerPortalTab';
import { WarmupsTab } from './components/WarmupsTab';
import { RepLoadCalculatorTab } from './components/RepLoadCalculatorTab';
import { ProgressGraphsTab } from './components/ProgressGraphsTab';
import { WorkoutLogsTab } from './components/WorkoutLogsTab';
import { ContactTab } from './components/ContactTab';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { AthleteLoginModal } from './components/AthleteLoginModal';
import { AbilityQuestionnaireModal } from './components/AbilityQuestionnaireModal';
import { PricingTiersModal } from './components/PricingTiersModal';
import { SquareConfirmationModal } from './components/SquareConfirmationModal';
import { ActivateTrialCodeModal } from './components/ActivateTrialCodeModal';
import { TrialBanner } from './components/TrialBanner';
import { SignInGate } from './components/SignInGate';
import { LoadingSplash } from './components/LoadingSplash';
import { GuidedTourModal } from './components/GuidedTourModal';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { AndroidAppModal } from './components/AndroidAppModal';
import { useAndroidBackButton } from './hooks/useAndroidBackButton';
import { useAndroidWakeLock } from './hooks/useAndroidWakeLock';
import { useUserTier } from './hooks/useUserTier';
import { 
  getCurrentAthlete, 
  AthleteProfile, 
  updateAthleteProfile, 
  registerAthlete, 
  isCoachSession 
} from './utils/athleteAuth';
import { 
  calculateReadinessScore, 
  hasCompletedDailyReadinessToday, 
  markDailyReadinessCompletedToday 
} from './utils/readinessEngine';
import { PlanSelectionModal } from './components/PlanSelectionModal';
import { DailyReadinessModal } from './components/DailyReadinessModal';
import {
  ShieldCheck, Mail,
  Instagram, ExternalLink, Zap, Lock, CreditCard, ArrowRight
} from 'lucide-react';
import { TacticalStandardCompanyEmblem } from './components/BrandingLogos';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import { AIWorkoutGeneratorModal } from './components/AIWorkoutGeneratorModal';
import { AISingleDayWorkoutModal } from './components/AISingleDayWorkoutModal';
import { CoachProgramBuilderModal } from './components/CoachProgramBuilderModal';
import { useFirebase } from './context/FirebaseContext';
import { 
  subscribeToUserWorkoutLogs, 
  subscribeToUserAthlete, 
  subscribeToOfficerProgram,
  subscribeToUserCustomPrograms,
  subscribeToCoachWorkoutLogs,
  subscribeToCoachPublishedPrograms,
  cleanUpLegacyMockCoachLogs,
  saveWorkoutLogToFirestore,
  saveAthleteToFirestore,
  saveCustomProgramToFirestore,
  saveCoachProgramToFirestore,
  deleteCoachProgramFromFirestore
} from './utils/firebaseSync';

export default function App() {
  const { user, loading } = useFirebase();

  // Aryan Risner (risneraryan@gmail.com) is the single exempt account with permanent full access
  const isMasterExempt = Boolean(
    user?.email && user.email.trim().toLowerCase() === 'risneraryan@gmail.com'
  );
  const isCoach = isMasterExempt;

  const [hasOfficerProgram, setHasOfficerProgram] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('workouts');
  const [programs, setPrograms] = useState<WorkoutProgram[]>(() => getStoredPrograms());
  const [logs, setLogs] = useState<WorkoutSessionLog[]>(() => getStoredWorkoutLogs());
  const [coachLogs, setCoachLogs] = useState<WorkoutSessionLog[]>([]);
  const [currentAthlete, setCurrentAthlete] = useState<AthleteProfile>(() => getCurrentAthlete());
  const [isAthleteModalOpen, setIsAthleteModalOpen] = useState<boolean>(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState<boolean>(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState<boolean>(false);
  const [isSquareSuccessModalOpen, setIsSquareSuccessModalOpen] = useState<boolean>(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [confirmedSquareTier, setConfirmedSquareTier] = useState<'standard' | 'pro' | 'enterprise'>('pro');
  const [squareSubRecord, setSquareSubRecord] = useState<SubscriptionRecord | null>(null);

  // AI Workout Architect Generator modal & active custom AI program
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState<boolean>(false);
  const [adapterTargetProgramKey, setAdapterTargetProgramKey] = useState<ProgramKey | undefined>(undefined);
  const [adapterCustomProgram, setAdapterCustomProgram] = useState<WorkoutProgram | null>(null);
  const [isSingleDayModalOpen, setIsSingleDayModalOpen] = useState<boolean>(false);
  const [activeCustomAIProgram, setActiveCustomAIProgram] = useState<WorkoutProgram | null>(() => 
    getStoredActiveCustomAIProgram()
  );

  // Coach-only Custom Programs & Single Workouts (risneraryan@gmail.com authors; all users can view & adapt)
  const [coachPublishedPrograms, setCoachPublishedPrograms] = useState<WorkoutProgram[]>([]);
  const [isCoachBuilderOpen, setIsCoachBuilderOpen] = useState<boolean>(false);
  const [editingCoachProgram, setEditingCoachProgram] = useState<WorkoutProgram | null>(null);

  const handleOpenProgramAdapter = (baseKey?: ProgramKey) => {
    setAdapterCustomProgram(null);
    if (baseKey) {
      setAdapterTargetProgramKey(baseKey);
    } else if (activeProgramKey !== 'custom_ai') {
      setAdapterTargetProgramKey(activeProgramKey);
    } else if (activeCustomAIProgram?.baseProgramKey) {
      setAdapterTargetProgramKey(activeCustomAIProgram.baseProgramKey as ProgramKey);
    }
    setIsAIGeneratorOpen(true);
  };

  const handleOpenCustomProgramAdapter = (program: WorkoutProgram) => {
    setAdapterCustomProgram(program);
    setIsAIGeneratorOpen(true);
  };

  const handleOpenCoachBuilder = (programToEdit?: WorkoutProgram | null) => {
    if (!isMasterExempt) return;
    setEditingCoachProgram(programToEdit || null);
    setIsCoachBuilderOpen(true);
  };

  const handleSaveCoachProgram = async (program: WorkoutProgram) => {
    if (!isMasterExempt || !user) return;
    await saveCoachProgramToFirestore(program);
    setCoachPublishedPrograms((prev) => {
      const idx = prev.findIndex((p) => p.id === program.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = program;
        return next;
      }
      return [program, ...prev];
    });
    setIsCoachBuilderOpen(false);
    setEditingCoachProgram(null);
  };

  const handleDeleteCoachProgram = async (programId: string) => {
    if (!isMasterExempt) return;
    await deleteCoachProgramFromFirestore(programId);
    setCoachPublishedPrograms((prev) => prev.filter((p) => p.id !== programId));
  };

  // Guided App Tour & Feature Showcase state
  const [isGuidedTourOpen, setIsGuidedTourOpen] = useState<boolean>(false);

  // Daily Readiness Questionnaire state (Once daily at first login of the day for everyone)
  const [isDailyReadinessOpen, setIsDailyReadinessOpen] = useState<boolean>(false);
  const [isAthleteCloudLoaded, setIsAthleteCloudLoaded] = useState<boolean>(false);

  const { 
    tier, 
    status, 
    isTrialActive, 
    isTrialExpired, 
    trialDaysRemaining,
    trialHoursRemaining,
    hasActiveAccess, 
    hasSelectedPlan, 
    isExempt,
    activateSubscription,
    startFreeTrial,
    resetTestAccount,
  } = useUserTier();

  const [activeProgramKey, setActiveProgramKey] = useState<ProgramKey | 'custom_ai'>(() => {
    const storedKey = getStoredActiveProgramKey();
    if (storedKey === 'custom_ai' && getStoredActiveCustomAIProgram()) {
      return 'custom_ai';
    }
    if (storedKey && ['apex_protocol', 'tactical_hypertrophy', 'hybrid_protocol', 'hybrid_db', 'aft_protocol', 'universal_pat'].includes(storedKey)) {
      return storedKey as ProgramKey;
    }
    if (getStoredActiveCustomAIProgram()) {
      return 'custom_ai';
    }
    const recKey = getCurrentAthlete().questionnaire?.recommendedProgramKey;
    return recKey || 'hybrid_db';
  });

  // Active workout session modal state
  const [activeLiveProgram, setActiveLiveProgram] = useState<WorkoutProgram | null>(null);

  // Pre-selected warmup flow
  const [targetWarmupId, setTargetWarmupId] = useState<string | null>(null);

  // Android Back Button handler: close open modals or return to workouts
  const hasOpenModal = 
    activeLiveProgram !== null || 
    isCoachBuilderOpen ||
    isGuidedTourOpen ||
    isSingleDayModalOpen ||
    isAIGeneratorOpen ||
    isAthleteModalOpen || 
    isQuestionnaireOpen || 
    isPricingModalOpen || 
    isAndroidModalOpen ||
    isSquareSuccessModalOpen ||
    isCodeModalOpen;

  const handleCloseTopModal = () => {
    if (activeLiveProgram !== null) {
      setActiveLiveProgram(null);
    } else if (isCoachBuilderOpen) {
      setIsCoachBuilderOpen(false);
      setEditingCoachProgram(null);
    } else if (isGuidedTourOpen) {
      setIsGuidedTourOpen(false);
    } else if (isSingleDayModalOpen) {
      setIsSingleDayModalOpen(false);
    } else if (isAIGeneratorOpen) {
      setIsAIGeneratorOpen(false);
      setAdapterCustomProgram(null);
    } else if (isCodeModalOpen) {
      setIsCodeModalOpen(false);
    } else if (isSquareSuccessModalOpen) {
      setIsSquareSuccessModalOpen(false);
    } else if (isAndroidModalOpen) {
      setIsAndroidModalOpen(false);
    } else if (isPricingModalOpen) {
      setIsPricingModalOpen(false);
    } else if (isQuestionnaireOpen) {
      setIsQuestionnaireOpen(false);
    } else if (isAthleteModalOpen) {
      setIsAthleteModalOpen(false);
    }
  };

  useAndroidBackButton({
    hasOpenModal,
    onCloseModal: handleCloseTopModal,
    activeTab,
    onSelectTab: setActiveTab,
  });

  // Android Screen Wake Lock: Keeps display on during live workouts
  useAndroidWakeLock(activeLiveProgram !== null);

  // Handle URL query parameters (e.g. Android Home Screen Shortcuts or Square payment return ?payment=success)
  useEffect(() => {
    const handleUrlParams = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      
      // 1. Square Checkout return handler: ?payment=success&tier=pro
      const paymentParam = params.get('payment');
      if (paymentParam === 'success') {
        const rawTier = (params.get('tier') || 'pro').toLowerCase();
        const tierParam = rawTier === 'standard' ? 'standard' : rawTier === 'enterprise' ? 'enterprise' : 'pro';
        const orderIdParam = params.get('session_id') || params.get('order_id') || `sq_ord_${Date.now().toString(36)}`;

        activateSubscription(tierParam, {
          orderId: orderIdParam,
          environment: 'sandbox',
        }).then(() => {
          setConfirmedSquareTier(tierParam);
          setSquareSubRecord({
            tier: tierParam,
            status: 'active_subscriber',
            provider: 'square',
            squareOrderId: orderIdParam,
            subscribedAt: new Date().toISOString(),
            amount: tierParam === 'pro' ? 30 : tierParam === 'enterprise' ? 99 : 15,
            currency: 'USD',
            environment: 'sandbox',
          });
          setIsSquareSuccessModalOpen(true);
        }).catch((err) => {
          console.warn('[Square] Automated subscription unlock error:', err);
        });

        // Strip payment parameters cleanly without reloading
        try {
          const cleanUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
        } catch {}
      }

      // 2. Navigation tab shortcut (supports both command_portal & legacy officer_portal)
      const rawTab = params.get('tab');
      const normalizedTab = rawTab === 'command_portal' ? 'officer_portal' : rawTab;
      if (normalizedTab && ['workouts', 'officer_portal', 'warmups', 'calculator', 'logs', 'graphs', 'contact'].includes(normalizedTab)) {
        setActiveTab(normalizedTab as TabType);
      }
    };
    handleUrlParams();
  }, [activateSubscription]);

  // Real-time Firestore sync when authenticated
  useEffect(() => {
    if (!user) {
      setIsAthleteCloudLoaded(false);
      setIsDailyReadinessOpen(false);
      return;
    }

    // Fallback timer so daily readiness check still runs even if offline or slow network
    const fallbackTimer = setTimeout(() => {
      setIsAthleteCloudLoaded(true);
    }, 600);

    // 1. Subscribe to workout logs in Firestore
    const unsubscribeLogs = subscribeToUserWorkoutLogs(user.uid, (cloudLogs) => {
      if (cloudLogs.length > 0) {
        setLogs(cloudLogs);
        try {
          localStorage.setItem('rpa_workout_logs_v1', JSON.stringify(cloudLogs));
        } catch {}
      } else {
        // First-time sync: backfill existing local logs to the user's cloud account
        const localLogs = getStoredWorkoutLogs();
        if (localLogs.length > 0) {
          localLogs.forEach((l) => {
            saveWorkoutLogToFirestore(l, user.uid, user.email || undefined).catch(() => {});
          });
        }
      }
    });

    // 2. Subscribe to athlete profile in Firestore
    const unsubscribeAthlete = subscribeToUserAthlete(user.uid, (cloudAthlete) => {
      if (cloudAthlete) {
        setCurrentAthlete(cloudAthlete);
        updateAthleteProfile(cloudAthlete.id, cloudAthlete);
        if (cloudAthlete.trialActivation || cloudAthlete.trialState) {
          const t = cloudAthlete.trialActivation || cloudAthlete.trialState;
          try {
            if (user.email) {
              localStorage.setItem(`rpa_trial_v2_${user.email.toLowerCase()}`, JSON.stringify(t));
            }
            localStorage.setItem(`rpa_trial_v2_${user.uid}`, JSON.stringify(t));
          } catch {}
        }
        setIsAthleteCloudLoaded(true);
      } else {
        const athleteName = user.displayName || user.email?.split('@')[0] || 'Service Member';
        const athleteEmail = (user.email || '').trim().toLowerCase();
        const existingLocal = getCurrentAthlete();
        const initialTrial = {
          code: 'INITIAL_14D',
          activatedAt: new Date().toISOString(),
          startedAtMs: Date.now(),
          trialEndMs: Date.now() + 14 * 24 * 60 * 60 * 1000,
          daysGranted: 14,
          hasSelectedPlan: true,
          tier: 'pro' as const,
          status: 'trialing' as const,
        };

        let targetAthlete: AthleteProfile;
        if (existingLocal && existingLocal.email && existingLocal.email.trim().toLowerCase() === athleteEmail) {
          targetAthlete = {
            ...existingLocal,
            trialActivation: existingLocal.trialActivation || initialTrial,
            trialState: existingLocal.trialState || initialTrial,
          };
          updateAthleteProfile(targetAthlete.id, targetAthlete);
        } else {
          const newAthlete = registerAthlete({
            name: athleteName,
            email: athleteEmail,
            experienceLevel: 'Intermediate',
            primaryGoal: 'Tactical Conditioning & Pursuit',
            weightLbs: 185,
          });
          newAthlete.trialActivation = initialTrial;
          newAthlete.trialState = initialTrial;
          targetAthlete = newAthlete;
        }
        setCurrentAthlete(targetAthlete);
        saveAthleteToFirestore(targetAthlete, user.uid).catch((err) => {
          console.warn('[Firebase] Initial athlete save note:', err);
        });
        setIsAthleteCloudLoaded(true);
      }
    });

    // 3. Subscribe to officer individual assigned program
    const unsubscribeOfficerProg = subscribeToOfficerProgram(user.uid, (prog) => {
      setHasOfficerProgram(!!prog);
    });

    // 4. Subscribe to user custom AI programs
    const unsubscribeCustomProgs = subscribeToUserCustomPrograms(user.uid, (cloudProgs) => {
      if (cloudProgs && cloudProgs.length > 0) {
        // Prioritize structured multi-week AI programs over single-day sessions
        const multiWeekProgs = cloudProgs.filter((p) => p.schedule && p.schedule.length > 1 && !p.id.startsWith('ai-single-'));
        const programToActivate = multiWeekProgs[0] || cloudProgs[0];

        setActiveCustomAIProgram((prev) => {
          // If we already have an active multi-week plan, preserve it!
          if (prev && prev.schedule && prev.schedule.length > 1) {
            const updatedMatching = cloudProgs.find((p) => p.id === prev.id);
            return updatedMatching || prev;
          }
          if (!prev && programToActivate) {
            saveActiveCustomAIProgram(programToActivate);
            return programToActivate;
          }
          return prev;
        });
      }
    });

    // 5. Subscribe to Coach AJ's published custom programs & single workouts
    const unsubscribeCoachProgs = subscribeToCoachPublishedPrograms(isMasterExempt, (incoming) => {
      setCoachPublishedPrograms(incoming);
    });

    // 6. Clean up any legacy fictitious mock coach logs from Firestore
    cleanUpLegacyMockCoachLogs().catch((err) => {
      console.warn('[Firebase] Legacy coach logs cleanup note:', err);
    });

    return () => {
      clearTimeout(fallbackTimer);
      unsubscribeLogs();
      unsubscribeAthlete();
      unsubscribeOfficerProg();
      unsubscribeCustomProgs();
      unsubscribeCoachProgs();
    };
  }, [user, isMasterExempt]);

  // Mandatory Once-Daily Readiness Questionnaire at First Login of the Day for Everyone
  useEffect(() => {
    if (loading || !user || !isAthleteCloudLoaded) return;
    if (!hasActiveAccess && !isMasterExempt && !isExempt) return;

    const alreadyCompletedToday = hasCompletedDailyReadinessToday(
      currentAthlete,
      user.uid,
      user.email
    );

    if (alreadyCompletedToday) {
      markDailyReadinessCompletedToday(currentAthlete, user.uid, user.email);
      setIsDailyReadinessOpen(false);
    } else {
      setIsDailyReadinessOpen(true);
    }
  }, [
    loading,
    user,
    isAthleteCloudLoaded,
    hasActiveAccess,
    isMasterExempt,
    isExempt,
    currentAthlete,
  ]);

  const handleDailyReadinessComplete = (updatedAthlete: AthleteProfile) => {
    markDailyReadinessCompletedToday(updatedAthlete, user?.uid, user?.email);
    setCurrentAthlete(updatedAthlete);
    updateAthleteProfile(updatedAthlete.id, updatedAthlete);
    setIsDailyReadinessOpen(false);
    if (user) {
      saveAthleteToFirestore(updatedAthlete, user.uid).catch((err) => {
        console.warn('[Firebase] Daily readiness sync note:', err);
      });
    }
  };

  // Real-time subscription to Coach AJ's workout logs - every single athlete sees every workout Coach AJ logs!
  useEffect(() => {
    const unsubscribeCoach = subscribeToCoachWorkoutLogs((incomingCoachLogs) => {
      setCoachLogs(incomingCoachLogs);
    });
    return () => unsubscribeCoach();
  }, []);

  // Strict Tab Protection: Only Coach AJ or officers with an assigned program can view the officer portal
  useEffect(() => {
    if (activeTab === 'officer_portal' && !isCoach && !hasOfficerProgram) {
      setActiveTab('workouts');
    }
  }, [activeTab, isCoach, hasOfficerProgram]);

  // Handle hash navigation to checkout/pricing modal
  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== 'undefined' && (window.location.hash === '#checkout' || window.location.hash === '#pricing')) {
        setIsPricingModalOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleUpdatePrograms = (updated: WorkoutProgram[]) => {
    setPrograms(updated);
    savePrograms(updated);
  };

  const handleStartWorkout = (program: WorkoutProgram) => {
    if (!hasActiveAccess && !isMasterExempt && !isExempt) {
      if (isTrialExpired) {
        setIsPricingModalOpen(true);
      }
      return;
    }
    setActiveLiveProgram(program);
  };

  const handleSelectWarmupFromProgram = (warmupId: string) => {
    setTargetWarmupId(warmupId);
    setActiveTab('warmups');
  };

  const handleWorkoutCompleted = (newLog: WorkoutSessionLog) => {
    const isCoachUser = Boolean(
      (user?.email && user.email.trim().toLowerCase() === 'risneraryan@gmail.com') ||
      isCoach
    );

    const stampedLog: WorkoutSessionLog = {
      ...newLog,
      isCoachLog: isCoachUser,
      userEmail: isCoachUser ? 'risneraryan@gmail.com' : (user?.email || undefined),
      athleteName: isCoachUser ? 'Aryan "AJ" Risner' : (currentAthlete?.name || 'Tactical Warfighter'),
    };

    setLogs((prev) => [stampedLog, ...prev]);
    if (isCoachUser) {
      setCoachLogs((prev) => [stampedLog, ...prev.filter((l) => l.id !== stampedLog.id)]);
    }
    setActiveLiveProgram(null);
    setActiveTab('logs');

    if (user) {
      saveWorkoutLogToFirestore(stampedLog, user.uid, user.email).catch((err) => {
        console.warn('[Firebase] Background log sync note:', err);
      });
    }
  };

  const handleSaveQuestionnaire = (answers: QuestionnaireAnswers, recommendedProgram: ProgramKey) => {
    const updatedAthlete: AthleteProfile = {
      ...currentAthlete,
      questionnaire: answers,
      primaryGoal: answers.primaryGoalCategory === 'muscle_armor_hypertrophy'
        ? 'Hypertrophy'
        : answers.primaryGoalCategory === 'hybrid_strength_running'
        ? 'Hybrid Athlete'
        : answers.primaryGoalCategory === 'custom_ai_individualized'
        ? 'Hybrid Athlete'
        : 'Tactical Conditioning & Pursuit',
    };
    setCurrentAthlete(updatedAthlete);
    updateAthleteProfile(updatedAthlete.id, updatedAthlete);
    setActiveProgramKey(recommendedProgram);
    setActiveTab('workouts');

    if (recommendedProgram === 'custom_ai') {
      setIsAIGeneratorOpen(true);
    }

    if (user) {
      saveAthleteToFirestore(updatedAthlete, user.uid).catch((err) => {
        console.warn('[Firebase] Background athlete save note:', err);
      });
    }
  };

  // Guided Tour Auto-Activation upon sign-up or first free trial activation
  useEffect(() => {
    if (!user) return;
    try {
      const pendingTour = localStorage.getItem('patrol_ready_show_tour');
      const neverShowTour = localStorage.getItem('patrol_ready_never_show_tour');
      const tourCompleted = localStorage.getItem('patrol_ready_tour_completed_v1');

      if (neverShowTour === 'true') return;

      if (pendingTour === 'true') {
        setIsGuidedTourOpen(true);
        localStorage.removeItem('patrol_ready_show_tour');
      } else if (!tourCompleted && (hasSelectedPlan || isTrialActive || isMasterExempt || isExempt)) {
        setIsGuidedTourOpen(true);
      }
    } catch {}
  }, [user, hasSelectedPlan, isTrialActive, isMasterExempt, isExempt]);

  const handleActivateFreeTrial = async () => {
    await startFreeTrial(14);
    if (user) {
      const athlete = getCurrentAthlete();
      await saveAthleteToFirestore(athlete, user.uid);
    }
    // Automatically trigger guided tour on free trial activation
    setIsGuidedTourOpen(true);
  };

  // 1. Initial page boot: display branded loading splash while auth state is resolving
  if (loading) {
    return <LoadingSplash />;
  }

  // 2. Strict Authentication Gate: Direct all visitors to the Activate Free Trial & Sign Up screen
  if (!user) {
    return (
      <>
        <SignInGate 
          onOpenPricingModal={() => setIsPricingModalOpen(true)}
          onOpenCodeModal={() => setIsCodeModalOpen(true)}
        />
        <PricingTiersModal
          isOpen={isPricingModalOpen}
          onClose={() => setIsPricingModalOpen(false)}
          onPaymentSuccess={() => setIsPricingModalOpen(false)}
        />
        <ActivateTrialCodeModal
          isOpen={isCodeModalOpen}
          onClose={() => setIsCodeModalOpen(false)}
          onCodeActivated={() => setIsCodeModalOpen(false)}
        />
      </>
    );
  }

  const readiness = calculateReadinessScore(currentAthlete, logs);

  return (
    <div className="min-h-screen bg-[#090b0d] text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Brand & Tab Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'warmups') setTargetWarmupId(null);
        }}
        onStartActiveWorkout={() => handleStartWorkout(programs[0])}
        currentAthlete={currentAthlete}
        onOpenAthleteModal={() => setIsAthleteModalOpen(true)}
        onOpenQuestionnaire={() => setIsQuestionnaireOpen(true)}
        onOpenPricingModal={() => setIsPricingModalOpen(true)}
        onOpenAndroidAppModal={() => setIsAndroidModalOpen(true)}
        onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
        onOpenSingleDayWorkout={() => setIsSingleDayModalOpen(true)}
        onOpenGuidedTour={() => setIsGuidedTourOpen(true)}
        readinessScore={readiness.overallScore}
        readinessTier={readiness.tier}
        hasOfficerProgram={hasOfficerProgram}
      />

      {/* Main Content Area (With bottom padding for Android bottom navigation bar on mobile) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5 pb-24 md:pb-6">
        {/* 14-Day Risk-Free Trial Status & Upgrade Warning Banner */}
        <TrialBanner 
          onOpenCheckout={() => setIsPricingModalOpen(true)}
          onOpenCodeModal={() => setIsCodeModalOpen(true)}
          className="mb-4"
        />

        {/* STRICT TRIAL ACCESS GATE & TRIAL LOCKER:
            Non-exempt users MUST start their 14-day free trial or subscribe before gaining access to anything.
            - If !hasActiveAccess && !isMasterExempt && !isExempt:
              1) If isTrialExpired: render the expired lockdown screen.
              2) If !hasSelectedPlan: render the 14-day free trial required gate.
            - Only render workout protocols and tabs when access is active or user is exempt!
        */}
        {!hasActiveAccess && !isMasterExempt && !isExempt ? (
          isTrialExpired ? (
            /* 14-DAY TRIAL EXPIRED LOCKDOWN */
            <div className="rounded-3xl border-2 border-red-500/60 bg-gradient-to-b from-[#18080c] via-[#12161d] to-[#090b0d] p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden my-4 animate-in fade-in duration-200">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
              
              <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center text-red-400 mb-4 shadow-lg shadow-red-950/50">
                <Lock className="w-8 h-8" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/90 border border-red-700/60 text-red-200 text-xs font-mono font-black uppercase mb-3">
                <span>Access Locked · 14-Day Free Trial Ended</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-athletic tracking-wide">
                14-Day Risk-Free Trial Concluded
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto mt-2 leading-relaxed">
                Your 14-day free trial access to The Tactical Standard has ended. All military training protocols, automated progressive overload tracking, and readiness metrics are locked. Subscribe to an active membership plan to restore immediate access.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
                {/* Pro Tier Card */}
                <div className="p-5 rounded-2xl bg-[#141a21] border-2 border-amber-500/60 flex flex-col justify-between shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase">Pro Warfighter</span>
                      <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-black tabular-nums">$30/mo</span>
                    </div>
                    <h4 className="text-base font-black text-white font-athletic uppercase">Full Auto-Overload Engine</h4>
                    <p className="text-xs text-zinc-400 mt-1">Complete 52-week military periodization, automated double progression (+2.5 to +10 lbs), Universal Military PT (ACFT/PFT/CFT), and readiness telemetry.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPricingModalOpen(true)}
                    className="mt-5 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Subscribe to Pro ($30)</span>
                  </button>
                </div>

                {/* Standard Tier Card */}
                <div className="p-5 rounded-2xl bg-[#0e1217] border border-zinc-700 flex flex-col justify-between shadow-md">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-zinc-400 uppercase">Standard Tier</span>
                      <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-bold tabular-nums">$15/mo</span>
                    </div>
                    <h4 className="text-base font-black text-white font-athletic uppercase">Core Workout Logging</h4>
                    <p className="text-xs text-zinc-400 mt-1">Access all military training protocols and core workout logs without automated telemetry.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPricingModalOpen(true)}
                    className="mt-5 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2 border border-zinc-700"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Subscribe Standard ($15)</span>
                  </button>
                </div>
              </div>

              {/* Authorized Test Account Direct Reset Action */}
              {(user?.email?.trim().toLowerCase() === 'risnerathletics@gmail.com' || currentAthlete.email?.trim().toLowerCase() === 'risnerathletics@gmail.com') && (
                <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-center max-w-md mx-auto space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-amber-300 uppercase">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Authorized Test Account (risnerathletics@gmail.com)</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    Your test account was reset. Click below to re-arm your fresh 14-day Pro testing window with 1-click.
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      await resetTestAccount('risnerathletics@gmail.com');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Restart 14-Day Free Trial (Test Account)</span>
                  </button>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => setIsPricingModalOpen(true)}
                  className="text-white hover:text-amber-300 font-bold uppercase tracking-wider cursor-pointer underline flex items-center gap-1.5"
                >
                  <span>View Full Plan Comparison &amp; Square Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <span className="text-zinc-600 hidden sm:inline">·</span>

                <button
                  type="button"
                  onClick={() => setIsCodeModalOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-mono font-bold uppercase tracking-wider cursor-pointer"
                >
                  Have a Unit / Promotional Code?
                </button>
              </div>
            </div>
          ) : (
            /* 14-DAY FREE TRIAL ONBOARDING REQUIRED GATE */
            <div className="rounded-3xl border border-amber-500/45 bg-gradient-to-b from-[#141a21] via-[#0e1217] to-[#090b0d] p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden my-4 animate-in fade-in duration-200">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 shadow-lg">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-mono font-black uppercase mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>14-Day Free Trial Required · $0 Today</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-athletic tracking-wide">
                Start Your 14-Day Free Trial
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto mt-2 leading-relaxed">
                Welcome to The Tactical Standard. Access to all military training protocols, the Universal Military PT (ACFT/PFT/CFT) 8-week protocol, automated progressive overload engine, and combat readiness scoring requires activating your 14-day risk-free trial or selecting a membership plan.
              </p>

              {/* Primary 1-Click Action Card */}
              <div className="mt-8 max-w-xl mx-auto p-6 rounded-2xl bg-[#141a21] border-2 border-amber-500/60 shadow-xl text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-black">
                        Recommended · $0 Today
                      </span>
                    </div>
                    <h3 className="text-lg font-black uppercase text-white font-athletic">
                      14-Day Risk-Free Pro Access
                    </h3>
                    <p className="text-xs text-zinc-300 mt-1 leading-snug">
                      Instant access to all military workouts, periodization plans, and double progression tracking for 14 days.
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-3 text-[11px] text-amber-200 font-mono">
                      <span>✓ All Protocols Unlocked</span>
                      <span>✓ Auto-Overload Engine</span>
                      <span>✓ No Commitment</span>
                    </div>
                  </div>

                  <div className="shrink-0 sm:text-right">
                    <button
                      type="button"
                      onClick={handleActivateFreeTrial}
                      className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
                    >
                      <span>Start 14-Day Free Trial</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Secondary Options */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => setIsPricingModalOpen(true)}
                  className="text-zinc-300 hover:text-white font-bold uppercase tracking-wider cursor-pointer underline flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>Subscribe Directly (Pro $30 / Standard $15)</span>
                </button>

                <span className="text-zinc-600 hidden sm:inline">·</span>

                <button
                  type="button"
                  onClick={() => setIsCodeModalOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-mono font-bold uppercase tracking-wider cursor-pointer"
                >
                  Have a Unit / Command Access Code?
                </button>
              </div>
            </div>
          )
        ) : (
          <div key={activeTab} className="animate-tab-fade">
            {activeTab === 'workouts' && (
              <WorkoutsTab
                programs={programs}
                onStartWorkout={handleStartWorkout}
                onSelectWarmup={handleSelectWarmupFromProgram}
                onSavePrograms={handleUpdatePrograms}
                currentAthlete={currentAthlete}
                activeProgramKey={activeProgramKey}
                onSelectProgram={(key) => {
                  setActiveProgramKey(key);
                  saveActiveProgramKey(key);
                }}
                onOpenQuestionnaire={() => setIsQuestionnaireOpen(true)}
                onOpenAthleteModal={() => setIsAthleteModalOpen(true)}
                onOpenAIGenerator={handleOpenProgramAdapter}
                onOpenSingleDayWorkout={() => setIsSingleDayModalOpen(true)}
                onOpenGuidedTour={() => setIsGuidedTourOpen(true)}
                activeCustomProgram={activeCustomAIProgram}
                onClearCustomProgram={() => {
                  clearActiveCustomAIProgram();
                  setActiveCustomAIProgram(null);
                  const fallback = currentAthlete.questionnaire?.recommendedProgramKey || 'apex_protocol';
                  setActiveProgramKey(fallback);
                  saveActiveProgramKey(fallback);
                }}
                readinessScore={readiness.overallScore}
                readinessTier={readiness.tier}
                latestCoachLog={coachLogs[0] || null}
                onNavigateToLogs={() => setActiveTab('logs')}
                coachPublishedPrograms={coachPublishedPrograms}
                onAdaptCustomProgram={handleOpenCustomProgramAdapter}
                onOpenCoachBuilder={isMasterExempt ? handleOpenCoachBuilder : undefined}
                onDeleteCoachProgram={isMasterExempt ? handleDeleteCoachProgram : undefined}
                workoutLogs={logs}
                userId={user?.uid}
              />
            )}

            {activeTab === 'officer_portal' && (
              <OfficerPortalTab
                currentAthlete={currentAthlete}
                onStartCustomWorkout={handleStartWorkout}
                onOpenPricingModal={() => setIsPricingModalOpen(true)}
              />
            )}

            {activeTab === 'warmups' && (
              <WarmupsTab selectedWarmupId={targetWarmupId} />
            )}

            {activeTab === 'calculator' && (
              <RepLoadCalculatorTab logs={logs} />
            )}

            {activeTab === 'logs' && (
              <WorkoutLogsTab
                logs={logs}
                coachLogs={coachLogs}
                currentAthlete={currentAthlete}
                onUpdateLogs={setLogs}
                onOpenLiveWorkout={() => handleStartWorkout(programs[0])}
                onStartWorkout={handleStartWorkout}
                onNavigateToGraphs={() => setActiveTab('graphs')}
              />
            )}

            {activeTab === 'graphs' && (
              <ProgressGraphsTab 
                logs={logs} 
                coachLogs={coachLogs}
                currentAthlete={currentAthlete}
                onNavigateToLogs={() => setActiveTab('logs')}
              />
            )}

            {activeTab === 'contact' && (
              <ContactTab />
            )}
          </div>
        )}
      </main>

      {/* Live Interactive Weights Tracker Modal */}
      {activeLiveProgram && (
        <ActiveWorkoutModal
          program={activeLiveProgram}
          onClose={() => setActiveLiveProgram(null)}
          onWorkoutCompleted={handleWorkoutCompleted}
        />
      )}

      {/* Athlete Login & Profile Modal */}
      <AthleteLoginModal
        isOpen={isAthleteModalOpen}
        onClose={() => setIsAthleteModalOpen(false)}
        onAthleteChanged={(athlete) => {
          setCurrentAthlete(athlete);
          setLogs(getStoredWorkoutLogs());
        }}
        onOpenQuestionnaire={() => setIsQuestionnaireOpen(true)}
        onOpenGuidedTour={() => setIsGuidedTourOpen(true)}
      />

      {/* Physical Ability & Program Matcher Modal */}
      <AbilityQuestionnaireModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        currentAthlete={currentAthlete}
        onSaveQuestionnaire={handleSaveQuestionnaire}
        onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
      />

      {/* Plan Selection Onboarding Gate: Prompts everyone upon sign in to pick a free trial or subscription */}
      <PlanSelectionModal
        isOpen={!isMasterExempt && !isExempt && !hasSelectedPlan && !loading}
        onStartTrial={handleActivateFreeTrial}
        onOpenPricingModal={() => setIsPricingModalOpen(true)}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
      />

      {/* Agency & Promotional Code Redemption Modal */}
      <ActivateTrialCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onCodeActivated={(record) => {
          setIsCodeModalOpen(false);
          setIsPricingModalOpen(false);
        }}
      />

      {/* RBAC Pricing Tiers & Square Payment Links Modal */}
      <PricingTiersModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onPaymentSuccess={(activatedTier) => {
          setIsPricingModalOpen(false);
          setConfirmedSquareTier(activatedTier);
          setIsSquareSuccessModalOpen(true);
        }}
      />

      {/* Square Payment Activation Confirmation Modal */}
      <SquareConfirmationModal
        isOpen={isSquareSuccessModalOpen}
        tier={confirmedSquareTier}
        subscriptionRecord={squareSubRecord}
        onClose={() => setIsSquareSuccessModalOpen(false)}
        onNavigateToWorkouts={() => {
          setIsSquareSuccessModalOpen(false);
          setActiveTab('workouts');
        }}
      />

      {/* Quiet Single-Row Footer */}
      <footer className="mt-auto border-t border-[#1E2635] bg-[#0B0E14] py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <TacticalStandardCompanyEmblem size="xs" className="h-5 w-auto opacity-90" />
            <span className="font-semibold text-slate-200">The Tactical Standard</span>
            <PWAInstallButton variant="pill" withPrefixDivider />
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a
              href="mailto:risnerathletics@gmail.com"
              className="hover:text-white transition-colors"
            >
              risnerathletics@gmail.com
            </a>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <a
              href="https://www.instagram.com/ajrisner"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              @ajrisner
            </a>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <a
              href="https://50callabz.com/risner55"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              50 Cal Labz (Code: TACTICALSTANDARD)
            </a>
          </div>
        </div>
      </footer>

      {/* Real-time Network Offline Detection Status */}
      <OfflineIndicator />

      {/* Android Native Bottom Navigation (Mobile Viewports Only) */}
      <AndroidBottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'warmups') setTargetWarmupId(null);
        }}
        currentAthlete={currentAthlete}
        onOpenAthleteModal={() => setIsAthleteModalOpen(true)}
        onOpenPricingModal={() => setIsPricingModalOpen(true)}
        onOpenAndroidAppModal={() => setIsAndroidModalOpen(true)}
        onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
        onOpenSingleDayWorkout={() => setIsSingleDayModalOpen(true)}
        readinessScore={readiness.overallScore}
        hasOfficerProgram={hasOfficerProgram}
      />

      {/* AI Tactical Workout Plan Architect Modal */}
      <AIWorkoutGeneratorModal
        isOpen={isAIGeneratorOpen}
        onClose={() => {
          setIsAIGeneratorOpen(false);
          setAdapterCustomProgram(null);
        }}
        onActivateProgram={(program) => {
          saveActiveCustomAIProgram(program);
          setActiveCustomAIProgram(program);
          setActiveProgramKey('custom_ai');
          saveActiveProgramKey('custom_ai');
          setActiveTab('workouts');
          if (user) {
            saveCustomProgramToFirestore(program, user.uid).catch((err) => {
              console.warn('[Firebase] Auto-save custom AI program note:', err);
            });
          }
        }}
        onStartWorkout={(program) => {
          saveActiveCustomAIProgram(program);
          setActiveCustomAIProgram(program);
          setActiveProgramKey('custom_ai');
          saveActiveProgramKey('custom_ai');
          setActiveTab('workouts');
          if (user) {
            saveCustomProgramToFirestore(program, user.uid).catch((err) => {
              console.warn('[Firebase] Auto-save custom AI program note:', err);
            });
          }
          handleStartWorkout(program);
        }}
        onSaveToCloud={async (program) => {
          saveActiveCustomAIProgram(program);
          if (user) {
            await saveCustomProgramToFirestore(program, user.uid);
          }
        }}
        currentAthlete={currentAthlete}
        userEmail={user?.email || ''}
        onSwitchToSingleDay={() => setIsSingleDayModalOpen(true)}
        initialBaseProgramKey={adapterTargetProgramKey}
        coachPublishedPrograms={coachPublishedPrograms}
        initialCustomProgram={adapterCustomProgram}
      />

      {/* Coach-Only Custom Program & Workout Builder Modal (risneraryan@gmail.com only) */}
      {isMasterExempt && (
        <CoachProgramBuilderModal
          isOpen={isCoachBuilderOpen}
          onClose={() => {
            setIsCoachBuilderOpen(false);
            setEditingCoachProgram(null);
          }}
          initialProgram={editingCoachProgram}
          onSaveProgram={handleSaveCoachProgram}
          userEmail={user?.email || 'risneraryan@gmail.com'}
        />
      )}

      {/* AI Single Day On-Demand Workout Modal */}
      <AISingleDayWorkoutModal
        isOpen={isSingleDayModalOpen}
        onClose={() => setIsSingleDayModalOpen(false)}
        onStartWorkout={(program) => {
          // Launch the single-day workout directly into the live workout tracker WITHOUT canceling the active multi-week AI plan!
          handleStartWorkout(program);
        }}
        onSaveToCloud={async (program) => {
          if (user) {
            await saveCustomProgramToFirestore(program, user.uid);
          }
        }}
        currentAthlete={currentAthlete}
        userEmail={user?.email || undefined}
      />

      {/* Android Native App Packaging & Installation Modal */}
      <AndroidAppModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />

      {/* Guided App Tour & Feature Showcase Modal (Onboarding & Promotional Demo) */}
      <GuidedTourModal
        isOpen={isGuidedTourOpen}
        onClose={() => setIsGuidedTourOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'warmups') setTargetWarmupId(null);
        }}
        onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
        onOpenSingleDayWorkout={() => setIsSingleDayModalOpen(true)}
        onOpenQuestionnaire={() => setIsQuestionnaireOpen(true)}
      />

      {/* Mandatory Once-Daily Tactical Readiness Questionnaire at First Login of the Day */}
      <DailyReadinessModal
        isOpen={isDailyReadinessOpen}
        athlete={currentAthlete}
        logs={logs}
        userId={user?.uid}
        userEmail={user?.email}
        onComplete={handleDailyReadinessComplete}
      />
    </div>
  );
}
