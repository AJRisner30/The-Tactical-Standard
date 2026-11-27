import React, { useState, useRef, useEffect } from 'react';
import {
  Dumbbell,
  Flame,
  Calculator,
  History,
  TrendingUp,
  Mail,
  Instagram,
  ExternalLink,
  Zap,
  UserCheck,
  Cloud,
  LogOut,
  Award,
  ShieldCheck,
  Lock,
  Compass,
  ChevronDown,
  SlidersHorizontal,
  Wrench,
  CreditCard,
} from 'lucide-react';
import { TacticalStandardCompanyEmblem } from './BrandingLogos';
import { AthleteProfile } from '../utils/athleteAuth';
import { useFirebase } from '../context/FirebaseContext';
import { useUserTier } from '../hooks/useUserTier';

export type TabType =
  | 'workouts'
  | 'officer_portal'
  | 'warmups'
  | 'calculator'
  | 'logs'
  | 'graphs'
  | 'contact';

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
  onOpenSingleDayWorkout?: () => void;
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
  onOpenSingleDayWorkout,
  onOpenGuidedTour,
  readinessScore,
  readinessTier,
  hasOfficerProgram = false,
}) => {
  const { user, isCloudConnected, authError, signOutUser } = useFirebase();
  const { tier, hasActiveAccess, isTrialActive, isTrialExpired, isExempt } = useUserTier();

  const [openMenu, setOpenMenu] = useState<'tools' | 'account' | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  const isCoach = Boolean(
    user?.email && user.email.trim().toLowerCase() === 'risneraryan@gmail.com'
  );

  const tabs: Array<{ id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    ...(isCoach
      ? [{ id: 'officer_portal' as TabType, label: 'Command', icon: ShieldCheck }]
      : hasOfficerProgram
      ? [{ id: 'officer_portal' as TabType, label: 'Protocol', icon: ShieldCheck }]
      : []),
    { id: 'warmups', label: 'Warm-Ups', icon: Flame },
    { id: 'calculator', label: 'Calculators', icon: Calculator },
    { id: 'logs', label: 'Logs', icon: History },
    { id: 'graphs', label: 'Progress', icon: TrendingUp },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  // Close dropdown menus on click outside or Escape
  useEffect(() => {
    if (!openMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenu]);

  const isLocked = !hasActiveAccess && !isExempt;
  const tierLabel = isTrialExpired
    ? 'Trial Ended'
    : isLocked
    ? 'Activate Trial'
    : isTrialActive
    ? 'Trial Pro'
    : tier.charAt(0).toUpperCase() + tier.slice(1);

  return (
    <header className="sticky top-0 z-30 bg-[#0B0E14]/95 backdrop-blur-md border-b border-[#1E2635]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Clean Single-Line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('workouts')}
          className="flex items-center gap-2.5 shrink-0 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
        >
          <TacticalStandardCompanyEmblem size="xs" className="h-7 w-auto" />
          <span className="font-athletic font-bold tracking-wide text-white text-base sm:text-lg leading-none whitespace-nowrap">
            The Tactical <span className="text-amber-400">Standard</span>
          </span>
        </button>

        {/* Zone 2: Clean Unboxed Primary Navigation Links (Desktop / Tablet) */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 lg:gap-5 overflow-x-auto no-scrollbar"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (isLocked) {
                    onOpenPricingModal?.();
                    return;
                  }
                  onSelectTab(tab.id);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative h-14 sm:h-16 px-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white font-semibold'
                    : isLocked
                    ? 'text-slate-500 hover:text-amber-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isLocked && <Lock className="w-3 h-3 text-amber-400/70 shrink-0" />}
                <span>{tab.label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-400 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Minimal Right Controls (Tools Menu + Account Menu) */}
        <div ref={menuContainerRef} className="flex items-center gap-2 shrink-0 relative">
          {/* Urgent Lock / Trial CTA only when locked or expired */}
          {(isTrialExpired || isLocked) && onOpenPricingModal && (
            <button
              type="button"
              onClick={onOpenPricingModal}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isTrialExpired
                  ? 'bg-red-500 hover:bg-red-400 text-white'
                  : 'bg-amber-400 hover:bg-amber-300 text-[#0B0E14]'
              }`}
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>{isTrialExpired ? 'Subscribe' : 'Activate Trial'}</span>
            </button>
          )}

          {/* Tools Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu((prev) => (prev === 'tools' ? null : 'tools'))}
              aria-expanded={openMenu === 'tools'}
              aria-haspopup="menu"
              className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                openMenu === 'tools'
                  ? 'bg-[#182030] text-white'
                  : 'text-slate-300 hover:text-white hover:bg-[#141923]'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Tools</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  openMenu === 'tools' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openMenu === 'tools' && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 rounded-xl bg-[#141923] border border-[#262F40] shadow-2xl py-1.5 z-50"
              >
                <div className="px-3 py-1.5 text-[11px] font-medium text-slate-500">
                  Training Tools
                </div>

                {onOpenAIGenerator && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpenMenu(null);
                      onOpenAIGenerator();
                    }}
                    className="w-full px-3 py-2.5 text-left hover:bg-[#1C2333] transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white">Adapt Core Program</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Adjust for injuries, schedule &amp; gear
                      </div>
                    </div>
                  </button>
                )}

                {onOpenSingleDayWorkout && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpenMenu(null);
                      onOpenSingleDayWorkout();
                    }}
                    className="w-full px-3 py-2.5 text-left hover:bg-[#1C2333] transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white">Single-Day Workout</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        On-demand session for today
                      </div>
                    </div>
                  </button>
                )}

                {onOpenQuestionnaire && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpenMenu(null);
                      onOpenQuestionnaire();
                    }}
                    className="w-full px-3 py-2.5 text-left hover:bg-[#1C2333] transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white">Program Matcher</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {currentAthlete?.questionnaire?.recommendedProgramTitle
                          ? `Matched: ${currentAthlete.questionnaire.recommendedProgramTitle}`
                          : '2-minute physical assessment'}
                      </div>
                    </div>
                  </button>
                )}

                {onOpenGuidedTour && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpenMenu(null);
                      onOpenGuidedTour();
                    }}
                    className="w-full px-3 py-2.5 text-left hover:bg-[#1C2333] transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-sky-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white">Guided App Tour</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Walkthrough of all app features
                      </div>
                    </div>
                  </button>
                )}

                <div className="my-1.5 border-t border-[#262F40]" />

                <div className="px-3 py-1 text-[11px] font-medium text-slate-500">
                  Community &amp; Partner
                </div>

                <a
                  href="https://50callabz.com/risner55"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpenMenu(null)}
                  className="w-full px-3 py-2 hover:bg-[#1C2333] transition-colors flex items-center justify-between gap-2 text-xs text-amber-300"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">50 Cal Labz · TACTICALSTANDARD</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                </a>

                <a
                  href="https://www.instagram.com/ajrisner"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpenMenu(null)}
                  className="w-full px-3 py-2 hover:bg-[#1C2333] transition-colors flex items-center justify-between gap-2 text-xs text-slate-300 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Instagram className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>@ajrisner</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                </a>
              </div>
            )}
          </div>

          {/* Account / Profile Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu((prev) => (prev === 'account' ? null : 'account'))}
              aria-expanded={openMenu === 'account'}
              aria-haspopup="menu"
              className={`min-h-[40px] pl-1.5 pr-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                openMenu === 'account'
                  ? 'bg-[#182030] border-amber-400/60 text-white'
                  : 'bg-[#141923] border-[#262F40] hover:border-slate-500 text-slate-200'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-tr ${
                  currentAthlete?.avatarColor || 'from-amber-600 to-amber-400'
                } flex items-center justify-center text-[11px] font-bold text-[#0B0E14] shrink-0`}
              >
                {currentAthlete ? currentAthlete.name.charAt(0).toUpperCase() : 'T'}
              </div>
              <span className="text-xs font-semibold text-white truncate max-w-[90px] hidden sm:inline">
                {currentAthlete ? currentAthlete.name.split(' ')[0] : 'Account'}
              </span>
              {readinessScore !== undefined && (
                <span className="text-[11px] font-mono tabular-nums text-slate-400 hidden lg:inline">
                  {readinessScore}%
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  openMenu === 'account' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openMenu === 'account' && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 rounded-xl bg-[#141923] border border-[#262F40] shadow-2xl py-2 z-50"
              >
                {/* Account Header Summary */}
                <div className="px-3.5 pb-2.5 border-b border-[#262F40] space-y-1">
                  <div className="text-sm font-semibold text-white truncate">
                    {currentAthlete ? currentAthlete.name : 'Service Member'}
                  </div>
                  {user?.email && (
                    <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  )}
                  <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums pt-0.5 text-slate-400">
                    {readinessScore !== undefined && (
                      <span
                        className={
                          readinessScore >= 85
                            ? 'text-emerald-400'
                            : readinessScore >= 70
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }
                      >
                        {readinessScore}% {readinessTier || 'Ready'}
                      </span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Cloud
                        className={`w-3 h-3 ${
                          authError
                            ? 'text-red-400'
                            : user || isCloudConnected
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                        }`}
                      />
                      <span>{authError ? 'Sync issue' : 'Synced'}</span>
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpenMenu(null);
                      onOpenAthleteModal();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-[#1C2333] hover:text-white flex items-center gap-2.5 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Profile &amp; Readiness</span>
                  </button>

                  {onOpenPricingModal && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setOpenMenu(null);
                        onOpenPricingModal();
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-[#1C2333] hover:text-white flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Membership</span>
                      </span>
                      <span className="text-[11px] font-mono text-amber-300">{tierLabel}</span>
                    </button>
                  )}
                </div>

                {user && (
                  <div className="pt-1 border-t border-[#262F40]">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setOpenMenu(null);
                        signOutUser();
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-red-300 hover:bg-red-950/40 hover:text-red-200 flex items-center gap-2.5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
