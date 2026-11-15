import React, { useState } from 'react';
import {
  Dumbbell,
  ShieldCheck,
  Flame,
  Calculator,
  Menu,
  X,
  History,
  TrendingUp,
  Mail,
  UserCheck,
  Smartphone,
  LogOut,
  Zap,
  ChevronRight
} from 'lucide-react';
import { TabType } from './Navbar';
import { AthleteProfile } from '../types';
import { useFirebase } from '../context/FirebaseContext';
import { useUserTier } from '../hooks/useUserTier';
import { useAndroidHaptics } from '../hooks/useAndroidHaptics';
import { TacticalStandardCompanyEmblem } from './BrandingLogos';

interface AndroidBottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  currentAthlete?: AthleteProfile;
  onOpenAthleteModal: () => void;
  onOpenPricingModal?: () => void;
  onOpenAndroidAppModal?: () => void;
  onOpenAIGenerator?: () => void;
  onOpenSingleDayWorkout?: () => void;
  readinessScore?: number;
  hasOfficerProgram?: boolean;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAthleteModal,
  onOpenPricingModal,
  onOpenAndroidAppModal,
  onOpenAIGenerator,
  onOpenSingleDayWorkout,
  hasOfficerProgram = false,
}) => {
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const { user, signOutUser } = useFirebase();
  const { tier, hasActiveAccess, isExempt } = useUserTier();
  const { tap, doubleTap } = useAndroidHaptics();

  const handleTabClick = (tabId: TabType) => {
    tap();
    if (!hasActiveAccess && !isExempt) {
      if (onOpenPricingModal) onOpenPricingModal();
      return;
    }
    onSelectTab(tabId);
    setIsMoreSheetOpen(false);
  };

  const openSheet = () => {
    doubleTap();
    setIsMoreSheetOpen(true);
  };

  const closeSheet = () => {
    tap();
    setIsMoreSheetOpen(false);
  };

  const isMoreTabActive = activeTab === 'logs' || activeTab === 'graphs' || activeTab === 'contact';

  const isCoach = Boolean(
    user?.email && user.email.trim().toLowerCase() === 'risneraryan@gmail.com'
  );

  const canViewOfficerPortal = isCoach || hasOfficerProgram;

  return (
    <>
      {/* Android Native Fixed Bottom Navigation Bar (Mobile Viewports Only) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090b0d]/98 backdrop-blur-xl border-t border-zinc-800 shadow-[0_-8px_30px_rgba(0,0,0,0.85)] pb-[max(0.6rem,env(safe-area-inset-bottom))]"
        aria-label="Android Bottom Navigation"
      >
        <div className="grid grid-cols-5 items-center justify-around px-1 py-1.5 max-w-md mx-auto">
          {/* 1. Workouts */}
          <button
            type="button"
            onClick={() => handleTabClick('workouts')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none relative ${
              activeTab === 'workouts' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className={`flex items-center justify-center w-10 h-7 rounded-full transition-all ${
              activeTab === 'workouts'
                ? 'bg-amber-500 shadow-md text-black scale-105'
                : 'text-zinc-400'
            }`}>
              <Dumbbell className="w-4 h-4 stroke-[2.3]" />
            </div>
            <span className={`text-[10px] font-athletic font-bold uppercase tracking-wider mt-0.5 ${
              activeTab === 'workouts' ? 'text-amber-400 font-black' : 'text-zinc-400'
            }`}>
              Workouts
            </span>
          </button>

          {/* 2. Command Portal / Mission Protocol OR Warm-Ups */}
          {canViewOfficerPortal ? (
            <button
              type="button"
              onClick={() => handleTabClick('officer_portal')}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none relative ${
                activeTab === 'officer_portal' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-7 rounded-full transition-all relative ${
                activeTab === 'officer_portal'
                  ? 'bg-amber-500 shadow-md text-black scale-105'
                  : 'text-amber-400/90 bg-amber-500/10'
              }`}>
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className={`text-[10px] font-athletic font-bold uppercase tracking-wider mt-0.5 ${
                activeTab === 'officer_portal' ? 'text-amber-400 font-black' : 'text-amber-300/80'
              }`}>
                {isCoach ? 'Command' : 'Protocol'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleTabClick('warmups')}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none relative ${
                activeTab === 'warmups' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-7 rounded-full transition-all ${
                activeTab === 'warmups'
                  ? 'bg-amber-500 shadow-md text-black scale-105'
                  : 'text-zinc-400'
              }`}>
                <Flame className="w-4 h-4 stroke-[2.3]" />
              </div>
              <span className={`text-[10px] font-athletic font-bold uppercase tracking-wider mt-0.5 ${
                activeTab === 'warmups' ? 'text-amber-400 font-black' : 'text-zinc-400'
              }`}>
                Warm-Ups
              </span>
            </button>
          )}

          {/* 3. Warm-Ups (if portal shown) OR Calculators */}
          {canViewOfficerPortal ? (
            <button
              type="button"
              onClick={() => handleTabClick('warmups')}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none relative ${
                activeTab === 'warmups' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-7 rounded-full transition-all ${
                activeTab === 'warmups'
                  ? 'bg-amber-500 shadow-md text-black scale-105'
                  : 'text-zinc-400'
              }`}>
                <Flame className="w-4 h-4 stroke-[2.3]" />
              </div>
              <span className={`text-[10px] font-athletic font-bold uppercase tracking-wider mt-0.5 ${
                activeTab === 'warmups' ? 'text-amber-400 font-black' : 'text-zinc-400'
              }`}>
                Warm-Ups
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleTabClick('calculator')}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none relative ${
                activeTab === 'calculator' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-7 rounded-full transition-all ${
                activeTab === 'calculator'
                  ? 'bg-amber-500 shadow-md text-black scale-105'
                  : 'text-zinc-400'
              }`}>
                <Calculator className="w-4 h-4 stroke-[2.3]" />
              </div>
              <span className={`text-[10px] font-athletic font-bold uppercase tracking-wider mt-0.5 ${
                activeTab === 'calculator' ? 'text-amber-400 font-black' : 'text-zinc-400'
              }`}>
                Calculators
              </span>
            </button>
          )}

          {/* 4. Calculators (if portal shown) OR Workout Logs */}
          {canViewOfficerPortal ? (
            <button
              type="button"
              onClick={() => handleTabClick('calculator')}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none relative ${
                activeTab === 'calculator' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-7 rounded-full transition-all ${
                activeTab === 'calculator'
                  ? 'bg-amber-500 shadow-md text-black scale-105'
                  : 'text-zinc-400'
              }`}>
                <Calculator className="w-4 h-4 stroke-[2.3]" />
              </div>
              <span className={`text-[10px] font-athletic font-bold uppercase tracking-wider mt-0.5 ${
                activeTab === 'calculator' ? 'text-amber-400 font-black' : 'text-zinc-400'
              }`}>
                Calculators
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleTabClick('logs')}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none relative ${
                activeTab === 'logs' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-7 rounded-full transition-all ${
                activeTab === 'logs'
                  ? 'bg-amber-500 shadow-md text-black scale-105'
                  : 'text-zinc-400'
              }`}>
                <History className="w-4 h-4 stroke-[2.3]" />
              </div>
              <span className={`text-[10px] font-athletic font-bold uppercase tracking-wider mt-0.5 ${
                activeTab === 'logs' ? 'text-amber-400 font-black' : 'text-zinc-400'
              }`}>
                Logs
              </span>
            </button>
          )}

          {/* 5. More / Quick Actions Drawer */}
          <button
            type="button"
            onClick={openSheet}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none relative ${
              isMoreSheetOpen || isMoreTabActive
                ? 'text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className={`flex items-center justify-center w-10 h-7 rounded-full transition-all relative ${
              isMoreSheetOpen || isMoreTabActive
                ? 'bg-zinc-700 shadow-md text-white scale-105'
                : 'text-zinc-400'
            }`}>
              <Menu className="w-4 h-4 stroke-[2.3]" />
            </div>
            <span className={`text-[10px] font-athletic font-bold uppercase tracking-wider mt-0.5 ${
              isMoreSheetOpen || isMoreTabActive ? 'text-amber-400 font-black' : 'text-zinc-400'
            }`}>
              More
            </span>
          </button>
        </div>
      </nav>

      {/* Android Bottom Sheet */}
      {isMoreSheetOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end animate-fadeIn"
          onClick={closeSheet}
        >
          <div
            className="w-full bg-[#0e1217] border-t border-amber-500/35 rounded-t-3xl shadow-2xl p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] animate-slideUp overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <TacticalStandardCompanyEmblem size="xs" />
                <div>
                  <h3 className="text-sm font-athletic font-black uppercase text-white tracking-wide">
                    Tactical Command Menu
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    The Tactical Standard · Android Edition
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeSheet}
                className="p-1.5 rounded-full bg-zinc-800/80 text-zinc-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2 overflow-y-auto">
              {onOpenAIGenerator && (
                <button
                  type="button"
                  onClick={() => {
                    closeSheet();
                    onOpenAIGenerator();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-500/45 bg-[#141a21] text-left transition-all cursor-pointer shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/15 text-amber-300">
                      <Zap className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider text-white">Adapt Core Program</div>
                      <div className="text-[11px] text-amber-300/90">Alter core programs for injuries, ability &amp; gear</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              )}

              {onOpenSingleDayWorkout && (
                <button
                  type="button"
                  onClick={() => {
                    closeSheet();
                    onOpenSingleDayWorkout();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-500/40 bg-[#141a21] text-left transition-all cursor-pointer shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
                      <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider text-white">Single-Day Tactical Session</div>
                      <div className="text-[11px] text-amber-200/90">On-demand workout for today&apos;s time &amp; equipment</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              )}

              <button
                type="button"
                onClick={() => handleTabClick('logs')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  activeTab === 'logs'
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-[#141a21]/80 hover:bg-[#141a21] border-zinc-800 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-white">Workout Logs &amp; History</div>
                    <div className="text-[11px] text-zinc-400">Review past sessions &amp; load volume</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>

              <button
                type="button"
                onClick={() => handleTabClick('graphs')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  activeTab === 'graphs'
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-[#141a21]/80 hover:bg-[#141a21] border-zinc-800 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-white">Progress Analytics</div>
                    <div className="text-[11px] text-zinc-400">Strength gains, run pace &amp; combat readiness</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>

              <button
                type="button"
                onClick={() => handleTabClick('contact')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  activeTab === 'contact'
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-[#141a21]/80 hover:bg-[#141a21] border-zinc-800 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-white">Contact &amp; Coaching</div>
                    <div className="text-[11px] text-zinc-400">Message coach &amp; unit training inquiries</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>

              {onOpenAndroidAppModal && (
                <button
                  type="button"
                  onClick={() => {
                    tap();
                    closeSheet();
                    onOpenAndroidAppModal();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-500/40 bg-[#141a21] text-left transition-all hover:border-emerald-400"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                        Android App Hub
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/30 text-emerald-200 font-mono">APK / PWA</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">Install native app, wake-lock &amp; offline tools</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </button>
              )}

              <div className="pt-2 border-t border-zinc-800 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    tap();
                    closeSheet();
                    onOpenAthleteModal();
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-bold"
                >
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>Member Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    tap();
                    closeSheet();
                    onOpenPricingModal?.();
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-bold"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="uppercase">{tier} Tier</span>
                </button>
              </div>

              {user && (
                <button
                  type="button"
                  onClick={() => {
                    tap();
                    closeSheet();
                    signOutUser();
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-2 p-2 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-bold transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out ({user.email})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
