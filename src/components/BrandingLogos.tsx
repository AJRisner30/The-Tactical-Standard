import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, X, Mail, Instagram, ExternalLink } from 'lucide-react';

/**
 * Official The Tactical Standard Emblem Logo Component
 * Loads the official vectorized military tactical crest emblem:
 * - Gunmetal obsidian & brushed tactical brass beveled borders
 * - Five-point star and military rank chevrons at apex
 * - Athletic tactical operator silhouette and crossed chevron crest
 * - Tactical brass laurel wreath branches
 * - Lower ribbon banner reading 'TACTICAL' and crest point 'TTS'
 */
export const TacticalStandardCompanyEmblem: React.FC<{
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
}> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    xs: 'h-6 w-auto',
    sm: 'h-8 sm:h-9 w-auto',
    md: 'h-11 sm:h-12 w-auto',
    lg: 'h-16 sm:h-20 w-auto',
    xl: 'h-24 sm:h-28 w-auto',
    hero: 'h-36 sm:h-44 w-auto',
  }[size];

  return (
    <img
      src="/tactical-standard-logo.svg"
      alt="The Tactical Standard Logo — Tactical Readiness for the Modern Warfighter."
      className={`${sizeClasses} ${className} object-contain select-none drop-shadow-md shrink-0`}
      loading="eager"
      decoding="async"
    />
  );
};

// Aliases for backwards-compatibility across the app
export const PatrolReadyCompanyEmblem = TacticalStandardCompanyEmblem;
export const OverlandCompanyEmblem = TacticalStandardCompanyEmblem;
export const RpaCompanyEmblem = TacticalStandardCompanyEmblem;

/**
 * Official The Tactical Standard Horizontal Logo Lockup
 */
export const TacticalStandardLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'hero' }> = ({ size = 'md' }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 select-none">
      {/* Official Military Crest Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <TacticalStandardCompanyEmblem size={size} />
      </div>

      {/* Brand Text Lockup */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-athletic font-black uppercase tracking-wider text-white text-lg sm:text-xl leading-none">
            The Tactical
          </span>
          <span className="font-athletic font-black uppercase tracking-wider text-amber-400 text-lg sm:text-xl leading-none">
            Standard
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5">
          <span className="tracking-widest uppercase font-extrabold text-amber-300/90 text-[10px] sm:text-xs whitespace-nowrap">
            Tactical Readiness For The Modern Warfighter
          </span>
        </div>
      </div>
    </div>
  );
};

// Aliases for backwards-compatibility
export const PatrolReadyLogo = TacticalStandardLogo;
export const OverlandLogo = TacticalStandardLogo;
export const RisnerLogo = TacticalStandardLogo;

export const IssaCertifiedBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="group relative flex items-center gap-2.5 px-3 py-1.5 bg-[#0e1217] hover:bg-[#141a21] border border-amber-500/40 hover:border-amber-400 rounded-lg shadow-md transition-all cursor-pointer text-left"
        title="View ISSA Certified Trainer Verification"
      >
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-zinc-700 p-0.5 shadow-sm shrink-0 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#090b0d] flex flex-col items-center justify-center border border-amber-400/30">
            <Award className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-black tracking-widest text-amber-400 font-athletic uppercase">
              ISSA CERTIFIED
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          {!compact && (
            <span className="text-[9px] text-zinc-400 tracking-tight font-medium">
              Military Strength &amp; Conditioning Specialist
            </span>
          )}
        </div>
      </button>

      {/* ISSA Credential Verification Modal */}
      {showModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md bg-[#0e1217] border border-amber-500/40 rounded-2xl p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-[#141a21] hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-zinc-700 cursor-pointer shadow-sm"
              title="Exit Verification Modal"
            >
              <X className="w-4 h-4 text-amber-400" />
              <span>Exit</span>
            </button>

            <div className="flex flex-col items-center text-center pb-5 border-b border-zinc-800 pt-2 sm:pt-0">
              <div className="mb-3">
                <TacticalStandardCompanyEmblem size="lg" />
              </div>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-zinc-700 p-0.5 mb-2 shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-[#090b0d] rounded-xl flex flex-col items-center justify-center p-1">
                  <span className="text-amber-400 font-athletic font-black text-base tracking-tighter">ISSA</span>
                  <span className="text-[7px] text-amber-200 font-bold uppercase tracking-wider">CERTIFIED</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white tracking-wide">
                International Sports Sciences Association
              </h3>
              <p className="text-xs text-amber-400 font-semibold tracking-wider uppercase mt-0.5">
                Military Tactical Conditioning &amp; Strength Specialist
              </p>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="p-3 bg-[#090b0d] rounded-xl border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400">Head Coach:</span>
                <span className="text-white font-bold tracking-wide">Coach AJ Risner, ISSA-CPT</span>
              </div>

              <div className="p-3 bg-[#090b0d] rounded-xl border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400">Platform:</span>
                <span className="text-amber-400 font-bold">The Tactical Standard</span>
              </div>

              <div className="p-3 bg-[#090b0d] rounded-xl border border-zinc-800 flex justify-between items-center gap-2">
                <span className="text-zinc-400 shrink-0">Mission:</span>
                <span className="text-zinc-200 font-medium text-xs text-right">
                  Tactical Readiness for the Modern Warfighter.
                </span>
              </div>

              <div className="p-3 bg-[#090b0d] rounded-xl border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  Contact Email:
                </span>
                <a
                  href="mailto:risnerathletics@gmail.com"
                  className="text-amber-400 hover:text-amber-300 font-mono text-xs font-bold underline"
                >
                  risnerathletics@gmail.com
                </a>
              </div>

              <div className="p-3 bg-[#090b0d] rounded-xl border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-amber-400" />
                  Instagram:
                </span>
                <a
                  href="https://www.instagram.com/ajrisner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center gap-1"
                >
                  <span>@ajrisner</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-2">
                <span className="text-xs text-zinc-400 font-semibold block mb-2">
                  Verified Military Performance Competencies:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
                  <div className="flex items-center gap-1.5 bg-[#090b0d] p-2 rounded-lg border border-zinc-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Combat Chassis Durability</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#090b0d] p-2 rounded-lg border border-zinc-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Armor &amp; Ruck Carriage</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#090b0d] p-2 rounded-lg border border-zinc-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Combat Sprint Velocity</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#090b0d] p-2 rounded-lg border border-zinc-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>ACFT / PFT / CFT Readiness</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-athletic font-black tracking-wider uppercase text-sm rounded-xl transition-all shadow-lg active:scale-[0.99] cursor-pointer"
              >
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
