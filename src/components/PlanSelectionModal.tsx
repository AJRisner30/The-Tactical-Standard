import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, CheckCircle2, 
  ArrowRight, KeyRound, Lock, Clock, CreditCard
} from 'lucide-react';
import { TacticalStandardCompanyEmblem } from './BrandingLogos';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onStartTrial: () => Promise<void>;
  onOpenPricingModal: () => void;
  onOpenCodeModal?: () => void;
}

export const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  isOpen,
  onStartTrial,
  onOpenPricingModal,
  onOpenCodeModal,
}) => {
  const [isStartingTrial, setIsStartingTrial] = useState(false);

  if (!isOpen) return null;

  const handleStartTrial = async () => {
    setIsStartingTrial(true);
    try {
      await onStartTrial();
    } finally {
      setIsStartingTrial(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#090b0d] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Brass Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500" />

        {/* Header */}
        <div className="p-6 sm:p-8 bg-[#0e1217] border-b border-zinc-800 text-center relative">
          <div className="flex justify-center mb-3">
            <div className="p-1.5 bg-[#090b0d] rounded-2xl border border-amber-500/40 shadow-lg">
              <TacticalStandardCompanyEmblem size="md" />
            </div>
          </div>

          <p className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-400 mb-2">
            Welcome to The Tactical Standard
          </p>

          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-athletic tracking-wide">
            Select Your Membership Plan
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto mt-1.5 leading-relaxed">
            Choose how you would like to proceed. Start with your <strong className="text-white">14-day risk-free Pro trial</strong> or subscribe directly to lock in uninterrupted tactical training.
          </p>
        </div>

        {/* Options Grid */}
        <div className="p-5 sm:p-7 space-y-4 overflow-y-auto">
          {/* PRIMARY OPTION: 14-DAY RISK-FREE PRO TRIAL */}
          <div className="relative rounded-2xl p-5 sm:p-6 bg-[#141a21] border-2 border-amber-500/70 shadow-xl">
            <div className="absolute -top-3 right-4 bg-amber-500 text-black px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider font-athletic shadow tabular-nums">
              Most Popular · $0 Today
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black uppercase text-white font-athletic tracking-wide">
                    14-Day Risk-Free Pro Trial
                  </h3>
                </div>
                <p className="text-xs text-zinc-300 leading-snug">
                  Experience full Pro Tactical access with automated progressive overload, multi-phase periodization, live workout execution, and readiness metrics.
                </p>
                <div className="mt-2.5 flex flex-wrap gap-3 text-[11px] text-amber-200 font-mono">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Full Pro Features
                  </span>
                  <span className="flex items-center gap-1 tabular-nums">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Active 14-Day Clock
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> No Initial Charge
                  </span>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <div className="text-2xl font-black font-mono text-white mb-2 sm:mb-3 tabular-nums">
                  $0 <span className="text-xs font-normal text-zinc-400 font-sans">/ 14 days</span>
                </div>
                <button
                  type="button"
                  disabled={isStartingTrial}
                  onClick={handleStartTrial}
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  {isStartingTrial ? (
                    <span>Activating Access...</span>
                  ) : (
                    <>
                      <span>Activate 14-Day Free Trial</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* SECONDARY OPTION: SUBSCRIBE DIRECTLY WITH SQUARE */}
          <div className="rounded-2xl p-4 sm:p-5 bg-[#0e1217] border border-zinc-800 hover:border-zinc-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-athletic">
                    Direct Membership Subscriptions
                  </h4>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">
                    · Square Checkout
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 tabular-nums">
                  Pro ($30/mo) or Standard ($15/mo). Secure monthly billing via credit card, Apple Pay, or Google Pay.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenPricingModal}
              className="w-full sm:w-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-zinc-700 transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap"
            >
              <span>View Plans &amp; Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>

          {/* TERTIARY OPTION: ENTER PROMO / UNIT CODE */}
          {onOpenCodeModal && (
            <div className="rounded-2xl p-3.5 sm:p-4 bg-[#0e1217] border border-zinc-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-zinc-400" />
                <span className="text-xs text-zinc-300">
                  Have a unit access code or promotional pass?
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenCodeModal}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider cursor-pointer transition shrink-0 whitespace-nowrap"
              >
                Enter Code →
              </button>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-[#090b0d] border-t border-zinc-800/80 text-center text-[11px] text-zinc-500">
          Once your 14-day free trial concludes, your account will prompt you to select an ongoing subscription. You will never be billed without your explicit consent.
        </div>
      </div>
    </div>
  );
};
