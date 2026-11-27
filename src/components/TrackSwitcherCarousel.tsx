import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Plus,
  Edit3,
  Trash2,
  Layers,
} from 'lucide-react';
import { TrainingTrack, TrackId, VolumeTier } from '../types/trainingTracks';
import { WorkoutProgram } from '../types';

export interface TrackSwitcherCarouselProps {
  tracks: TrainingTrack[];
  activeTrackId: TrackId;
  previewTrackId: TrackId;
  volumeTier: VolumeTier;
  onSelectPreview: (trackId: TrackId) => void;
  onActivateTrack: (trackId: TrackId) => void;
  preservedBenchmarkCount: number;
  isMasterExempt?: boolean;
  onOpenCoachBuilder?: (programToEdit?: WorkoutProgram | null) => void;
  onDeleteCoachProgram?: (programId: string) => Promise<void>;
  onClearCustomProgram?: () => void;
}

const COLLAPSE_STORAGE_KEY = 'tts_program_carousel_collapsed_v1';

export const TrackSwitcherCarousel: React.FC<TrackSwitcherCarouselProps> = ({
  tracks,
  activeTrackId,
  previewTrackId,
  volumeTier,
  onSelectPreview,
  onActivateTrack,
  preservedBenchmarkCount,
  isMasterExempt = false,
  onOpenCoachBuilder,
  onDeleteCoachProgram,
  onClearCustomProgram,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(COLLAPSE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const didDragMoveRef = useRef(false);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
      } catch {}
      return next;
    });
  };

  const updateScrollFades = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 12);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 12);
  }, []);

  useEffect(() => {
    if (isCollapsed) return;
    updateScrollFades();
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => updateScrollFades();
    const onResize = () => updateScrollFades();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [updateScrollFades, tracks.length, isCollapsed]);

  const scrollByCard = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const delta = Math.max(280, Math.round(el.clientWidth * 0.65));
    el.scrollBy({
      left: direction === 'left' ? -delta : delta,
      behavior: 'smooth',
    });
  };

  const handleCardClick = (trackId: TrackId) => {
    if (didDragMoveRef.current) return;
    onSelectPreview(trackId);
    const cardEl = cardRefs.current[trackId];
    if (cardEl) {
      cardEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsDragging(true);
    didDragMoveRef.current = false;
    dragStartXRef.current = e.pageX - el.offsetLeft;
    dragStartScrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragStartXRef.current) * 1.15;
    if (Math.abs(walk) > 6) {
      didDragMoveRef.current = true;
    }
    el.scrollLeft = dragStartScrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    setTimeout(() => {
      didDragMoveRef.current = false;
    }, 60);
  };

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];
  const previewTrack = tracks.find((t) => t.id === previewTrackId) || tracks[0];
  const isPreviewingInactive = previewTrack && previewTrack.id !== activeTrackId;

  // Compact single-line strip when user collapses the carousel
  if (isCollapsed && activeTrack && !isPreviewingInactive) {
    const activeDays =
      volumeTier === 'standard'
        ? activeTrack.standardDaysPerWeek
        : activeTrack.highVolumeDaysPerWeek;

    return (
      <section
        aria-label="Active Training Program"
        className="w-full rounded-xl bg-[#11161F] border border-[#222B3B] px-4 py-3 flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 min-w-0 text-xs">
          <span className="text-amber-400 font-semibold">Active Program</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-sm font-semibold text-white truncate">{activeTrack.title}</span>
          <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>
          <span className="text-slate-400 font-mono tabular-nums hidden sm:inline">
            {activeTrack.totalWeeks > 1 ? `${activeTrack.totalWeeks} Wks · ` : ''}
            {activeDays} d/wk · ~{activeTrack.avgDurationMinutes}m
          </span>
          <span aria-hidden="true" className="text-slate-600 hidden md:inline">·</span>
          <span className="text-emerald-400 font-mono tabular-nums hidden md:inline">
            {preservedBenchmarkCount} PR{preservedBenchmarkCount === 1 ? '' : 's'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isMasterExempt && onOpenCoachBuilder && (
            <button
              type="button"
              onClick={() => onOpenCoachBuilder(null)}
              className="min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium text-amber-300 hover:bg-amber-400/10 transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            className="min-h-[36px] px-3 py-1 rounded-lg border border-[#262F40] bg-[#0B0E14] hover:border-amber-400/50 text-xs font-medium text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Switch Program ({tracks.length})</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Program Track Switcher" className="w-full space-y-2.5">
      {/* Compact Single-Line Header */}
      <div className="flex items-center justify-between gap-3 px-0.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs min-w-0">
          <h2 className="text-sm font-semibold text-white">Programs</h2>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400 tabular-nums">{tracks.length} tracks</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-emerald-400 tabular-nums">
            {preservedBenchmarkCount} PR{preservedBenchmarkCount === 1 ? '' : 's'} saved
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isMasterExempt && onOpenCoachBuilder && (
            <button
              type="button"
              onClick={() => onOpenCoachBuilder(null)}
              className="min-h-[36px] px-2.5 py-1 rounded-lg border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">New Coach Program</span>
              <span className="sm:hidden">New</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => scrollByCard('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll programs left"
              className="w-8 h-8 rounded-lg border border-[#222B3B] bg-[#11161F] text-slate-300 hover:border-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard('right')}
              disabled={!canScrollRight}
              aria-label="Scroll programs right"
              className="w-8 h-8 rounded-lg border border-[#222B3B] bg-[#11161F] text-slate-300 hover:border-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={toggleCollapsed}
            className="min-h-[36px] px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-[#141923] transition-colors cursor-pointer whitespace-nowrap"
          >
            Collapse
          </button>
        </div>
      </div>

      {/* Horizontal Snap-Scrolling Program Carousel */}
      <div className="relative">
        {canScrollLeft && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 bottom-1 w-8 z-10 bg-gradient-to-r from-[#090b0d] to-transparent"
          />
        )}
        {canScrollRight && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 bottom-1 w-8 z-10 bg-gradient-to-l from-[#090b0d] to-transparent"
          />
        )}

        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex items-stretch gap-2.5 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1 select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {tracks.map((track) => {
            const isActive = track.id === activeTrackId;
            const isPreviewed = track.id === previewTrackId;
            const activeDays =
              volumeTier === 'standard'
                ? track.standardDaysPerWeek
                : track.highVolumeDaysPerWeek;

            return (
              <div
                key={track.id}
                ref={(el) => {
                  cardRefs.current[track.id] = el;
                }}
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(track.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(track.id);
                  }
                }}
                aria-pressed={isPreviewed}
                className={`snap-start shrink-0 w-[264px] sm:w-[288px] rounded-xl px-4 py-3.5 flex flex-col justify-between transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isActive
                    ? 'bg-[#141A26] border border-amber-400/80'
                    : isPreviewed
                    ? 'bg-[#131A24] border border-emerald-400/70'
                    : 'bg-[#11161F] border border-[#222B3B] hover:border-slate-500/70'
                }`}
              >
                <div className="space-y-1">
                  {/* Quiet 1-line unboxed kicker — zero pill sandwiches */}
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-slate-400 truncate">
                      {track.badge}
                    </span>
                    {isActive ? (
                      <span className="text-amber-400 font-semibold whitespace-nowrap shrink-0">
                        Active
                      </span>
                    ) : isPreviewed ? (
                      <span className="text-emerald-400 font-semibold whitespace-nowrap shrink-0">
                        Preview
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug truncate">
                    {track.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {track.focusSummary}
                  </p>
                </div>

                {/* Single-line quiet footer metadata */}
                <div className="mt-3 pt-2.5 border-t border-[#1E2635] flex items-center justify-between gap-2 text-[11px] text-slate-400 font-mono tabular-nums">
                  <span className="truncate">
                    {track.totalWeeks > 1 ? `${track.totalWeeks}w · ` : ''}
                    {activeDays}d/wk · ~{track.avgDurationMinutes}m
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {isMasterExempt && track.isCoachPublished && track.sourceProgram && (
                      <>
                        {onOpenCoachBuilder && (
                          <button
                            type="button"
                            onClick={() => onOpenCoachBuilder(track.sourceProgram!)}
                            aria-label={`Edit ${track.title}`}
                            className="p-1 rounded text-slate-400 hover:text-amber-300 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteCoachProgram && track.coachProgramId && (
                          confirmDeleteId === track.coachProgramId ? (
                            <button
                              type="button"
                              onClick={async () => {
                                await onDeleteCoachProgram(track.coachProgramId!);
                                setConfirmDeleteId(null);
                              }}
                              className="px-1.5 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-[10px] font-semibold cursor-pointer"
                            >
                              Delete
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(track.coachProgramId!)}
                              aria-label={`Delete ${track.title}`}
                              className="p-1 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )
                        )}
                      </>
                    )}

                    {track.isCustom && onClearCustomProgram && (
                      <button
                        type="button"
                        onClick={onClearCustomProgram}
                        className="text-[11px] font-sans text-slate-400 hover:text-red-400 underline underline-offset-2 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instant Non-Active Split Preview & 1-Tap Activation Bar */}
      {isPreviewingInactive && previewTrack && (
        <div className="rounded-xl bg-[#11161F] border border-emerald-500/40 px-4 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold text-white">{previewTrack.title}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">
                {previewTrack.equipment.slice(0, 3).join(', ')}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-slate-400 font-mono">
              {previewTrack.splitSummary.map((dayLine, idx) => (
                <span key={`${dayLine}-${idx}`} className="whitespace-nowrap">
                  {idx > 0 && <span className="text-slate-600 mr-2.5">/</span>}
                  {dayLine}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onSelectPreview(activeTrackId)}
              className="min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1A2232] transition-colors cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onActivateTrack(previewTrack.id)}
              className="min-h-[40px] px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#0B0E14] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Activate Track (History Preserved)</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default TrackSwitcherCarousel;
