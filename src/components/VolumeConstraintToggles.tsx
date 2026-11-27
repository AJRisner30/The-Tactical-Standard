import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, RotateCcw } from 'lucide-react';
import { ConstraintMode, VolumeTier } from '../types/trainingTracks';
import { OperationalCondition } from '../types';
import { OPERATIONAL_CONDITIONS } from '../utils/operationalAdjuster';

export interface VolumeConstraintTogglesProps {
  volumeTier: VolumeTier;
  constraintMode: ConstraintMode;
  operationalCondition: OperationalCondition;
  onChangeVolumeTier: (tier: VolumeTier) => void;
  onChangeConstraintMode: (mode: ConstraintMode) => void;
  onChangeOperationalCondition: (condition: OperationalCondition) => void;
  volumeReductionPct?: number;
  swappedCount?: number;
}

export const VolumeConstraintToggles: React.FC<VolumeConstraintTogglesProps> = ({
  volumeTier,
  constraintMode,
  operationalCondition,
  onChangeVolumeTier,
  onChangeConstraintMode,
  onChangeOperationalCondition,
  volumeReductionPct = 0,
  swappedCount = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeOpMeta =
    OPERATIONAL_CONDITIONS.find((c) => c.id === operationalCondition) || OPERATIONAL_CONDITIONS[0];

  const volumeLabel = volumeTier === 'standard' ? 'Standard' : 'High Volume';
  const modeLabel =
    constraintMode === 'low_impact_rehab'
      ? 'Low-Impact'
      : constraintMode === 'minimal_gear'
      ? 'Minimal Gear'
      : 'Full Duty';

  const hasCustomAdjustments =
    constraintMode !== 'full_duty' || operationalCondition !== 'garrison';

  const handleResetDefaults = () => {
    onChangeVolumeTier('standard');
    onChangeConstraintMode('full_duty');
    onChangeOperationalCondition('garrison');
  };

  return (
    <div
      aria-label="Session Adjustments"
      className="w-full rounded-xl bg-[#11161F] border border-[#222B3B]"
    >
      {/* Compact Single-Line Summary Header */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-left cursor-pointer group min-w-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
            Session Modifiers
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">
            <span className="text-slate-200">{volumeLabel}</span>
            <span className="mx-1.5 text-slate-600">/</span>
            <span className={constraintMode !== 'full_duty' ? 'text-emerald-400 font-medium' : 'text-slate-200'}>
              {modeLabel}
            </span>
            <span className="mx-1.5 text-slate-600">/</span>
            <span className={operationalCondition !== 'garrison' ? 'text-sky-400 font-medium' : 'text-slate-200'}>
              {activeOpMeta.shortLabel}
            </span>
          </span>

          {(volumeReductionPct > 0 || swappedCount > 0) && (
            <>
              <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>
              <span className="text-[11px] font-mono tabular-nums text-amber-300/90 hidden sm:inline">
                {[
                  volumeReductionPct > 0 ? `-${volumeReductionPct}% sets` : '',
                  swappedCount > 0 ? `${swappedCount} swapped` : '',
                ]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {hasCustomAdjustments && (
            <button
              type="button"
              onClick={handleResetDefaults}
              className="min-h-[34px] px-2 py-1 rounded-lg text-[11px] text-slate-400 hover:text-white hover:bg-[#1A2232] transition-colors cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1A2232] transition-colors cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>{isExpanded ? 'Done' : 'Adjust'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Progressive Disclosure Controls Panel */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-3 border-t border-[#1E2635] grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 1. Volume Tier */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-medium text-slate-400">Volume Tier</div>
            <div
              role="group"
              aria-label="Volume Tier Selection"
              className="inline-flex items-center p-1 rounded-lg bg-[#0B0E14] border border-[#222B3B] gap-1 w-full sm:w-auto"
            >
              <button
                type="button"
                onClick={() => onChangeVolumeTier('standard')}
                aria-pressed={volumeTier === 'standard'}
                className={`flex-1 sm:flex-none min-h-[38px] px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  volumeTier === 'standard'
                    ? 'bg-amber-400 text-[#0B0E14]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Standard (-25%)
              </button>
              <button
                type="button"
                onClick={() => onChangeVolumeTier('high_volume')}
                aria-pressed={volumeTier === 'high_volume'}
                className={`flex-1 sm:flex-none min-h-[38px] px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  volumeTier === 'high_volume'
                    ? 'bg-amber-400 text-[#0B0E14]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                High Volume
              </button>
            </div>
          </div>

          {/* 2. Readiness / Constraint Mode */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-medium text-slate-400">Readiness Mode</div>
            <div
              role="group"
              aria-label="Readiness and Constraint Mode"
              className="inline-flex items-center p-1 rounded-lg bg-[#0B0E14] border border-[#222B3B] gap-1 overflow-x-auto no-scrollbar max-w-full"
            >
              <button
                type="button"
                onClick={() => onChangeConstraintMode('full_duty')}
                aria-pressed={constraintMode === 'full_duty'}
                className={`min-h-[38px] px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  constraintMode === 'full_duty'
                    ? 'bg-emerald-400 text-[#0B0E14]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Full Duty
              </button>
              <button
                type="button"
                onClick={() => onChangeConstraintMode('low_impact_rehab')}
                aria-pressed={constraintMode === 'low_impact_rehab'}
                className={`min-h-[38px] px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  constraintMode === 'low_impact_rehab'
                    ? 'bg-emerald-400 text-[#0B0E14]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Low-Impact
              </button>
              <button
                type="button"
                onClick={() => onChangeConstraintMode('minimal_gear')}
                aria-pressed={constraintMode === 'minimal_gear'}
                className={`min-h-[38px] px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  constraintMode === 'minimal_gear'
                    ? 'bg-emerald-400 text-[#0B0E14]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Minimal Gear
              </button>
            </div>
          </div>

          {/* 3. Operational Condition (scales strength + cardio) */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-medium text-slate-400">
              Duty Condition (Scales Strength + Cardio)
            </div>
            <div
              role="group"
              aria-label="1-Tap Operational Condition Adjuster"
              className="inline-flex items-center p-1 rounded-lg bg-[#0B0E14] border border-[#222B3B] gap-1 overflow-x-auto no-scrollbar max-w-full"
            >
              {OPERATIONAL_CONDITIONS.map((cond) => {
                const isSelected = operationalCondition === cond.id;
                return (
                  <button
                    key={cond.id}
                    type="button"
                    onClick={() => onChangeOperationalCondition(cond.id)}
                    aria-pressed={isSelected}
                    className={`min-h-[38px] px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? cond.id === 'garrison'
                          ? 'bg-slate-200 text-[#0B0E14]'
                          : 'bg-sky-400 text-[#0B0E14]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {cond.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolumeConstraintToggles;
