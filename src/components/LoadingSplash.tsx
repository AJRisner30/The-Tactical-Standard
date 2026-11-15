import React from 'react';
import { TacticalStandardCompanyEmblem } from './BrandingLogos';
import { RefreshCw } from 'lucide-react';

export const LoadingSplash: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090b0d] text-zinc-100 flex flex-col items-center justify-center p-4 relative font-sans">
      {/* Gunmetal Obsidian Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(245,158,11,0.12),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-4 max-w-sm">
        <div className="p-1.5 bg-gradient-to-b from-amber-500/30 via-zinc-800 to-zinc-950 rounded-2xl shadow-2xl border border-amber-500/40">
          <TacticalStandardCompanyEmblem size="lg" />
        </div>

        <div className="space-y-1 pt-2">
          <div className="flex items-center justify-center gap-1.5">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-athletic">
              The Tactical
            </h2>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-amber-400 font-athletic">
              Standard
            </h2>
          </div>
          <span className="text-xs text-amber-300 font-bold tracking-widest uppercase font-mono block">
            Tactical Readiness for the Modern Warfighter.
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono pt-3">
          <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Authenticating Service Member Credentials...</span>
        </div>
      </div>
    </div>
  );
};
