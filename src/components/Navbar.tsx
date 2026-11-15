import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Dumbbell, Flame, Calculator, History, TrendingUp, Mail,
  Instagram, ExternalLink, Zap, UserCheck, Cloud, LogOut, Award, ShieldCheck, Lock,
  ChevronLeft, ChevronRight, Compass
} from 'lucide-react';
import { TacticalStandardCompanyEmblem } from './BrandingLogos';
import { AthleteProfile } from '../utils/athleteAuth';
import { useFirebase } from '../context/FirebaseContext';
import { useUserTier } from '../hooks/useUserTier';

export type TabType = 'workouts' | 'officer_portal' | 'warmups' | 'calculator' | 'logs' | 'graphs' | 'contact';

interface NavbarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onStartActiveWorkout: () => void;
  currentAthlete?: AthleteProfile;
  onOpenAthleteModal: () => void;
  onOpenQuestionnaire?: () => void;
  onOpenPricingModal?: () => void;
  onOpenAndroidAppModal?: () => void;
  onOpenAIGenerator?: () => void;
  onOpenGuidedTour?: () => void;
  readinessScore?: number;
  readinessTier?: string;
  hasOfficerProgram?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentAthlete,
  onOpenAthleteModal,
  onOpenQuestionnaire,
  onOpenPricingModal,
  onOpenAIGenerator,
  onOpenGuidedTour,
  readinessScore,
  readinessTier,
  hasOfficerProgram = false,
}) => {
  const { user, isCloudConnected, authError, signOutUser } = useFirebase();
  const { tier, hasActiveAccess, isTrialActive, isTrialExpired, isExempt } = useUserTier();

  const isCoach = Boolean(
    user?.email && user.email.trim().toLowerCase() === 'risneraryan@gmail.com'
  );

  const tabs: Array<{ id: TabType; label: string; icon: any; highlight?: boolean }> = [
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    ...(isCoach
      ? [{ id: 'officer_portal' as TabType, label: 'Command Portal', icon: ShieldCheck, highlight: true }]
      : hasOfficerProgram
      ? [{ id: 'officer_portal' as TabType, label: 'My Mission Protocol', icon: ShieldCheck, highlight: true }]
      : []),
    { id: 'warmups', label: 'Warm-Ups', icon: Flame },
    { id: 'calculator', label: 'Calculators', icon: Calculator },
    { id: 'logs', label: 'Workout Logs', icon: History },
    { id: 'graphs', label: 'Progress', icon: TrendingUp },
    { id: 'contact', label: 'Contact Me', icon: Mail },
  ];

  const tier1ScrollRef = useRef<HTMLDivElement>(null);
  const navScrollRef = useRef<HTMLElement>(null);
  const [canScrollTier1Left, setCanScrollTier1Left] = useState(false);
  const [canScrollTier1Right, setCanScrollTier1Right] = useState(false);
  const [canScrollNavLeft, setCanScrollNavLeft] = useState(false);
  const [canScrollNavRight, setCanScrollNavRight] = useState(false);

  const handleWheelScroll = (e: React.WheelEvent<HTMLElement>) => {
    if (Math.abs(e.deltaY) > 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  const checkScrollStates = useCallback(() => {
    if (tier1ScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tier1ScrollRef.current;
      setCanScrollTier1Left(scrollLeft > 6);
      setCanScrollTier1Right(scrollLeft + clientWidth < scrollWidth - 6);
    }
    if (navScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current;
      setCanScrollNavLeft(scrollLeft > 6);
      setCanScrollNavRight(scrollLeft + clientWidth < scrollWidth - 6);
    }
  }, []);

  useEffect(() => {
    checkScrollStates();
    const t1 = tier1ScrollRef.current;
    const nav = navScrollRef.current;

    const onResize = () => checkScrollStates();
    window.addEventListener('resize', onResize);
    t1?.addEventListener('scroll', checkScrollStates, { passive: true });
    nav?.addEventListener('scroll', checkScrollStates, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      t1?.removeEventListener('scroll', checkScrollStates);
      nav?.removeEventListener('scroll', checkScrollStates);
    };
  }, [checkScrollStates, tabs.length]);

  const scrollTier1 = (direction: 'left' | 'right') => {
    if (tier1ScrollRef.current) {
      tier1ScrollRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth',
      });
    }
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0b0f14]/98 backdrop-blur-md border-b border-amber-500/25 shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Tier 1: Brand & Operator Controls Bar */}
        <div className="relative group/tier1">
          {canScrollTier1Left && (
            <button
              type="button"
              onClick={() => scrollTier1('left')}
              aria-label="Scroll top bar left"
              className="absolute left-0 top-0 bottom-0 z-20 px-1 bg-gradient-to-r from-[#0b0f14] via-[#0b0f14]/95 to-transparent flex items-center justify-center text-zinc-300 hover:text-white transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 bg-zinc-800/90 hover:bg-amber-500 hover:text-black rounded-full p-0.5 border border-zinc-700 shadow" />
            </button>
          )}

          <div
            ref={tier1ScrollRef}
            onWheel={handleWheelScroll}
            className="flex items-center justify-between px-3 sm:px-4 py-2 gap-2 topbar-scroll"
          >
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-2 shrink-0 select-none">
              <TacticalStandardCompanyEmblem size="xs" className="h-8 w-auto drop-shadow-sm" />
              <div className="flex items-baseline gap-1">
                <span className="font-athletic font-black uppercase tracking-wider text-white text-sm sm:text-base leading-none whitespace-nowrap">
                  The Tactical
                </span>
                <span className="font-athletic font-black uppercase tracking-wider text-amber-400 text-sm sm:text-base leading-none whitespace-nowrap">
                  Standard
                </span>
              </div>
              <span className="hidden xl:inline text-[10px] text-amber-300/80 font-mono pl-2 border-l border-zinc-700 whitespace-nowrap">
                Military Strength &amp; Combat Readiness
              </span>
            </div>

            {/* Top Quick Links & Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* 50 Cal Labz Partner Link */}
              <a
                href="https://50callabz.com/risner55"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-[#141a21] hover:bg-amber-950/40 text-amber-200 hover:text-white border border-amber-500/40 hover:border-amber-400 rounded-lg text-[11px] font-black transition-all shadow-sm shrink-0 cursor-pointer whitespace-nowrap"
                title="Official Supplement Partner: 50 Cal Labz (Discount Code: TACTICALSTANDARD)"
              >
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                <span className="hidden sm:inline font-bold">50 Cal Labz</span>
                <span className="text-[9px] bg-amber-500 text-black px-1 rounded font-mono font-black">
                  Code: TACTICALSTANDARD
                </span>
                <ExternalLink className="w-2.5 h-2.5 text-amber-400/80 shrink-0" />
              </a>

              {/* Instagram: AJ Risner */}
              <a
                href="https://www.instagram.com/ajrisner"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-[#141a21] hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 hover:border-amber-500/50 rounded-lg text-[11px] font-bold transition-all shadow-sm shrink-0 cursor-pointer whitespace-nowrap"
                title="Follow Instagram: AJ Risner"
              >
                <Instagram className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="hidden md:inline">@ajrisner</span>
                <ExternalLink className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
              </a>

              {/* Cloud Sync Status */}
              <button
                type="button"
                onClick={onOpenAthleteModal}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                  authError
                    ? 'bg-red-950/40 border border-red-500/50 hover:border-red-400 text-red-300'
                    : 'bg-[#141a21] hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-500/50'
                }`}
                title={
                  authError
                    ? 'Sign-In Notice: Click to view details'
                    : user
                    ? `Cloud Synced: ${user.email}`
                    : isCloudConnected
                    ? 'Cloud Synced'
                    : 'Syncing Data...'
                }
              >
                <span
                  className={`inline-block rounded-full h-2 w-2 shrink-0 ${
                    authError
                      ? 'bg-red-400'
                      : user
                      ? 'bg-emerald-400'
                      : isCloudConnected
                      ? 'bg-amber-400'
                      : 'bg-zinc-500'
                  }`}
                />
                <Cloud className={`w-3 h-3 ${authError ? 'text-red-400' : 'text-zinc-300'}`} />
              </button>

              {/* Ability Matcher Quick Action */}
              {onOpenQuestionnaire && (
                <button
                  type="button"
                  onClick={onOpenQuestionnaire}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-[#141a21] hover:bg-amber-500/15 text-amber-300 hover:text-amber-200 border border-amber-500/35 hover:border-amber-400 rounded-lg text-[11px] font-bold transition-all shadow-sm cursor-pointer shrink-0 whitespace-nowrap"
                  title="Take Physical Ability Assessment & Match Recommended Program"
                >
                  <Award className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline">Program Matcher</span>
                </button>
              )}

              {/* Adaptive Program Action */}
              {onOpenAIGenerator && (
                <button
                  type="button"
                  onClick={onOpenAIGenerator}
                  className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 hover:text-white border border-amber-500/45 hover:border-amber-400 rounded-lg text-[11px] font-bold transition-all shadow-sm cursor-pointer shrink-0 whitespace-nowrap"
                  title="Adapt Coach Risner's Core Programs for Injuries & Ability"
                >
                  <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline">Adapt Program</span>
                </button>
              )}

              {/* Guided App Tour Action */}
              {onOpenGuidedTour && (
                <button
                  type="button"
                  onClick={onOpenGuidedTour}
                  className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 bg-[#141a21] hover:bg-emerald-950/60 text-emerald-300 hover:text-white border border-emerald-500/40 hover:border-emerald-400 rounded-lg text-[11px] font-bold transition-all shadow-sm cursor-pointer shrink-0 whitespace-nowrap"
                  title="Guided App Tour & Feature Showcase"
                >
                  <Compass className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>App Tour</span>
                </button>
              )}

              {/* Service Member Profile Chip */}
              <button
                type="button"
                onClick={onOpenAthleteModal}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#141a21] hover:bg-zinc-800 text-white border border-amber-500/40 hover:border-amber-400 rounded-lg text-[11px] font-black transition-all shadow-sm cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                title={`View service member profile and combat readiness score (${readinessScore ?? 85}% ${readinessTier || ''})`}
              >
                <div className={`w-4 h-4 rounded-full bg-gradient-to-tr ${currentAthlete?.avatarColor || 'from-amber-600 to-amber-400'} flex items-center justify-center text-[9px] font-black text-black shrink-0`}>
                  {currentAthlete ? currentAthlete.name.charAt(0).toUpperCase() : 'T'}
                </div>
                <span className="font-bold text-white whitespace-nowrap truncate max-w-[80px] sm:max-w-none">
                  {currentAthlete ? currentAthlete.name : 'Service Member'}
                </span>
                {readinessScore !== undefined && (
                  <span className={`text-[9px] font-mono font-bold tabular-nums px-1.5 py-0.5 rounded border ${
                    readinessScore >= 85
                      ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                      : readinessScore >= 70
                      ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                      : 'bg-red-950/80 border-red-500/40 text-red-300'
                  }`}>
                    {readinessScore}% Ready
                  </span>
                )}
                <UserCheck className="w-3 h-3 text-amber-400 shrink-0" />
              </button>

              {/* Membership Tier Badge */}
              <button
                type="button"
                onClick={onOpenPricingModal}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-black font-mono transition-all shadow-sm cursor-pointer border shrink-0 whitespace-nowrap ${
                  isTrialExpired
                    ? 'bg-red-950/90 hover:bg-red-900 text-red-200 border-red-500'
                    : !hasActiveAccess && !isExempt
                    ? 'bg-amber-950/90 hover:bg-amber-900 text-amber-200 border-amber-500'
                    : tier === 'pro'
                    ? 'bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border-amber-500/50'
                    : tier === 'enterprise'
                    ? 'bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border-emerald-500/50'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
                title={
                  isTrialExpired
                    ? 'Trial Ended: Access locked. Click to subscribe.'
                    : !hasActiveAccess && !isExempt
                    ? 'Trial Not Activated: Click to activate your 14-day free trial.'
                    : `Membership: ${tier.toUpperCase()} Tier. Click to inspect pricing tiers & plans.`
                }
              >
                {isTrialExpired ? (
                  <Lock className="w-3 h-3 text-red-400 shrink-0" />
                ) : !hasActiveAccess && !isExempt ? (
                  <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                ) : (
                  <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                )}
                <span className="uppercase">
                  {isTrialExpired
                    ? 'Locked • Subscribe'
                    : !hasActiveAccess && !isExempt
                    ? 'Activate Trial'
                    : isTrialActive
                    ? 'Trial Pro'
                    : tier}
                </span>
              </button>

              {/* Quick Sign Out Button */}
              {user && (
                <button
                  type="button"
                  onClick={signOutUser}
                  className="flex items-center gap-1 px-2 py-1 bg-[#141a21] hover:bg-red-950/50 text-zinc-400 hover:text-red-300 border border-zinc-700/80 hover:border-red-500/50 rounded-lg text-[11px] font-bold transition-all shadow-sm cursor-pointer shrink-0 whitespace-nowrap"
                  title={`Signed in as ${user.email}. Click to sign out.`}
                >
                  <LogOut className="w-3 h-3 text-red-400 shrink-0" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              )}
            </div>
          </div>

          {canScrollTier1Right && (
            <button
              type="button"
              onClick={() => scrollTier1('right')}
              aria-label="Scroll top bar right"
              className="absolute right-0 top-0 bottom-0 z-20 px-1 bg-gradient-to-l from-[#0b0f14] via-[#0b0f14]/95 to-transparent flex items-center justify-center text-zinc-300 hover:text-white transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 bg-zinc-800/90 hover:bg-amber-500 hover:text-black rounded-full p-0.5 border border-zinc-700 shadow" />
            </button>
          )}
        </div>

        {/* Tier 2: Streamlined Single-Line Tab Rail (Desktop/Tablet only) */}
        <div className="relative group/nav border-t border-zinc-800/80 bg-[#080a0d]/95 hidden md:block">
          {canScrollNavLeft && (
            <button
              type="button"
              onClick={() => scrollNav('left')}
              aria-label="Scroll tabs left"
              className="absolute left-0 top-0 bottom-0 z-20 px-1 bg-gradient-to-r from-[#080a0d] via-[#080a0d]/95 to-transparent flex items-center justify-center text-zinc-300 hover:text-white transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 bg-zinc-800/90 hover:bg-amber-500 hover:text-black rounded-full p-0.5 border border-zinc-700 shadow" />
            </button>
          )}

          <nav
            ref={navScrollRef}
            onWheel={handleWheelScroll}
            className="px-2 sm:px-4 py-1.5 topbar-scroll"
            aria-label="Main Navigation"
          >
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-max justify-start md:justify-center">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isLocked = !hasActiveAccess && !isExempt;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (isLocked) {
                        if (onOpenPricingModal) onOpenPricingModal();
                        return;
                      }
                      onSelectTab(tab.id as TabType);
                    }}
                    className={`nav-tab-interactive group relative flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap cursor-pointer select-none shrink-0 ${
                      isActive
                        ? 'bg-amber-500 text-black shadow-md border border-amber-400'
                        : isLocked
                        ? 'bg-[#0e1217] opacity-70 hover:opacity-100 text-zinc-400 hover:text-amber-300 border border-zinc-800 hover:border-amber-500/40'
                        : 'bg-[#141a21] hover:bg-[#1c242e] text-zinc-300 hover:text-white border border-zinc-800 hover:border-amber-500/40'
                    }`}
                    title={isLocked ? 'Access Locked: Activate 14-day free trial or subscribe to access' : tab.label}
                  >
                    {isLocked ? (
                      <Lock className="w-3 h-3 text-amber-400/80 shrink-0" />
                    ) : (
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ease-out ${
                          isActive
                            ? 'text-black stroke-[2.5] scale-105'
                            : 'text-amber-400 stroke-[2] group-hover:scale-105'
                        }`}
                      />
                    )}
                    <span className="whitespace-nowrap transition-colors duration-200">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {canScrollNavRight && (
            <button
              type="button"
              onClick={() => scrollNav('right')}
              aria-label="Scroll tabs right"
              className="absolute right-0 top-0 bottom-0 z-20 px-1 bg-gradient-to-l from-[#080a0d] via-[#080a0d]/95 to-transparent flex items-center justify-center text-zinc-300 hover:text-white transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 bg-zinc-800/90 hover:bg-amber-500 hover:text-black rounded-full p-0.5 border border-zinc-700 shadow" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
