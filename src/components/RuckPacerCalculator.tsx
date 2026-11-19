import React, { useState, useMemo, useEffect } from 'react';
import {
  Compass,
  Clock,
  Save,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Mountain,
} from 'lucide-react';
import { RuckSessionLog } from '../types';
import { parseClockToSeconds, formatSecondsToClock } from '../utils/aftScoringEngine';
import { getStoredRuckLogs, saveStoredRuckLogs } from '../utils/storage';
import {
  subscribeToUserRuckLogs,
  saveRuckLogToFirestore,
  deleteRuckLogFromFirestore,
} from '../utils/firebaseSync';
import { useFirebase } from '../context/FirebaseContext';
import { getCurrentAthlete } from '../utils/athleteAuth';
import { soundManager } from '../utils/audio';

interface RuckPreset {
  label: string;
  distance: number;
  weightLbs: number;
  targetClock: string;
  note: string;
}

const MILITARY_RUCK_PRESETS: RuckPreset[] = [
  {
    label: '12-Mi Standard (3:00)',
    distance: 12,
    weightLbs: 35,
    targetClock: '3:00:00',
    note: 'Air Assault / EIB / EFMB 15:00/mi standard',
  },
  {
    label: '12-Mi Competitive (2:45)',
    distance: 12,
    weightLbs: 45,
    targetClock: '2:45:00',
    note: '13:45/mi strong selection buffer',
  },
  {
    label: '12-Mi Selection (2:30)',
    distance: 12,
    weightLbs: 45,
    targetClock: '2:30:00',
    note: '12:30/mi SFAS / Ranger / RASP competitive pace',
  },
  {
    label: '6-Mi Heavy (55 lb)',
    distance: 6,
    weightLbs: 55,
    targetClock: '1:27:00',
    note: 'Phase 3 Military Bodybuilding heavy ruck',
  },
];

export const RuckPacerCalculator: React.FC = () => {
  const { user } = useFirebase();
  const currentAthlete = getCurrentAthlete();

  const [distanceMiles, setDistanceMiles] = useState<number>(12);
  const [packWeightLbs, setPackWeightLbs] = useState<number>(35);
  const [targetClock, setTargetClock] = useState<string>('3:00:00');
  const [terrain, setTerrain] = useState<string>('Road / Garrison Loop');
  const [rpe, setRpe] = useState<number>(7);
  const [ruckTitle, setRuckTitle] = useState<string>('12-Mile Qualification Ruck');
  const [ruckDate, setRuckDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [ruckNotes, setRuckNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const [ruckLogs, setRuckLogs] = useState<RuckSessionLog[]>(() => getStoredRuckLogs());

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToUserRuckLogs(user.uid, (cloudLogs) => {
      if (cloudLogs.length > 0) {
        setRuckLogs(cloudLogs);
        saveStoredRuckLogs(cloudLogs);
      }
    });
    return () => unsub();
  }, [user?.uid]);

  const metrics = useMemo(() => {
    const safeDist = Math.max(0.5, Number(distanceMiles) || 1);
    const safeWeight = Math.max(0, Number(packWeightLbs) || 0);
    const totalSecs = Math.max(60, parseClockToSeconds(targetClock) || safeDist * 900);
    const secsPerMile = totalSecs / safeDist;
    const paceMinPerMile = Number((secsPerMile / 60).toFixed(2));
    const speedMph = Number((3600 / secsPerMile).toFixed(2));
    const workloadIndex = Math.round(safeDist * safeWeight);
    const meetsFifteenMinStandard = secsPerMile <= 900; // 15:00/mi

    const wholeMiles = Math.min(26, Math.ceil(safeDist));
    const checkpoints = Array.from({ length: wholeMiles }).map((_, idx) => {
      const mileNum = idx + 1;
      const actualMile = mileNum > safeDist ? safeDist : mileNum;
      const cumulativeSecs = Math.round(actualMile * secsPerMile);
      const isHalfway = Math.abs(actualMile - safeDist / 2) < 0.51;
      return {
        mile: Number(actualMile.toFixed(1)),
        splitClock: formatSecondsToClock(secsPerMile),
        cumulativeClock: formatSecondsToClock(cumulativeSecs),
        isHalfway,
        isFinish: actualMile === safeDist,
      };
    });

    return {
      totalSecs,
      durationMinutes: Number((totalSecs / 60).toFixed(1)),
      secsPerMile,
      paceClock: formatSecondsToClock(secsPerMile),
      paceMinPerMile,
      speedMph,
      workloadIndex,
      halfwayClock: formatSecondsToClock(totalSecs / 2),
      meetsFifteenMinStandard,
      checkpoints,
    };
  }, [distanceMiles, packWeightLbs, targetClock]);

  const applyPreset = (p: RuckPreset) => {
    setDistanceMiles(p.distance);
    setPackWeightLbs(p.weightLbs);
    setTargetClock(p.targetClock);
    setRuckTitle(p.label);
    soundManager.playSetLogged();
  };

  const handleLogRuck = async () => {
    setIsSaving(true);
    setSaveFeedback(null);
    const nowIso = new Date().toISOString();
    const entry: RuckSessionLog = {
      id: `ruck_${Date.now()}`,
      userId: user?.uid || currentAthlete.id,
      athleteId: currentAthlete.id,
      title: ruckTitle.trim() || `${distanceMiles}-Mile Tactical Ruck (${packWeightLbs} lb)`,
      date: ruckDate || nowIso.split('T')[0],
      distanceMiles: Number(distanceMiles) || 0,
      weightLbs: Number(packWeightLbs) || 0,
      durationMinutes: metrics.durationMinutes,
      paceMinPerMile: metrics.paceMinPerMile,
      workloadIndex: metrics.workloadIndex,
      terrain,
      rpe,
      notes: ruckNotes.trim(),
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const next = [entry, ...ruckLogs];
    setRuckLogs(next);
    saveStoredRuckLogs(next);

    try {
      if (user?.uid) {
        await saveRuckLogToFirestore(entry, user.uid);
      }
      soundManager.playSetLogged();
      setRuckNotes('');
      setSaveFeedback(
        `Logged ${entry.distanceMiles} mi @ ${entry.weightLbs} lb (${metrics.paceClock}/mi)${user?.uid ? ' and synced to cloud' : ''}.`
      );
      setTimeout(() => setSaveFeedback(null), 4000);
    } catch (err) {
      console.error('Failed to sync ruck log:', err);
      setSaveFeedback('Saved locally. Cloud sync will retry when online.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRuck = async (id: string) => {
    const next = ruckLogs.filter((l) => l.id !== id);
    setRuckLogs(next);
    saveStoredRuckLogs(next);
    if (user?.uid) {
      try {
        await deleteRuckLogFromFirestore(id);
      } catch (err) {
        console.warn('Could not delete remote ruck log:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Military Presets */}
      <div className="bg-[#0e1217] border border-amber-500/30 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
              <span className="text-amber-400 font-bold">Load Carriage Pacing</span>
              <span aria-hidden="true">·</span>
              <span>Air Assault, Ranger &amp; Garrison Ruck Standards</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white font-athletic">
              12-Mile <span className="text-amber-400">Ruck Pacer</span> &amp; Split Logger
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              Generate exact mile-by-mile checkpoint splits, calculate your load-carriage Workload Index, and save completed rucks directly to your cloud log.
            </p>
          </div>
        </div>

        {/* 1-Tap Qualification Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4 pt-4 border-t border-zinc-800/80">
          {MILITARY_RUCK_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className="p-3 rounded-xl bg-[#090b0d] hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-black uppercase tracking-wide text-amber-400 font-athletic">
                {preset.label}
              </div>
              <div className="text-[11px] font-mono text-zinc-300 mt-0.5 tabular-nums">
                {preset.distance} mi · {preset.weightLbs} lb · {preset.targetClock}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5 truncate">{preset.note}</div>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Output Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0e1217] border border-zinc-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-zinc-400 block">Required Pace / Mile</span>
          <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-amber-400 mt-1">
            {metrics.paceClock}
            <span className="text-xs font-normal text-zinc-500"> /mi</span>
          </div>
          <span className="text-xs font-mono text-zinc-400 mt-1 block tabular-nums">
            {metrics.speedMph} mph avg speed
          </span>
        </div>

        <div className="bg-[#0e1217] border border-zinc-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-zinc-400 block">Halfway Turnaround</span>
          <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-white mt-1">
            {metrics.halfwayClock}
          </div>
          <span className="text-xs text-zinc-400 mt-1 block tabular-nums">
            At Mile {(distanceMiles / 2).toFixed(1)}
          </span>
        </div>

        <div className="bg-[#0e1217] border border-zinc-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-zinc-400 block">Ruck Workload Index</span>
          <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-white mt-1">
            {metrics.workloadIndex}
          </div>
          <span className="text-xs text-zinc-400 mt-1 block tabular-nums">
            {distanceMiles} mi × {packWeightLbs} lb dry pack
          </span>
        </div>

        <div className="bg-[#0e1217] border border-zinc-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-zinc-400 block">15:00/Mi Qualifier Check</span>
          <div className="flex items-center gap-1.5 mt-1.5">
            <CheckCircle2
              className={`w-5 h-5 shrink-0 ${
                metrics.meetsFifteenMinStandard ? 'text-emerald-400' : 'text-amber-400'
              }`}
            />
            <span
              className={`text-sm font-black uppercase ${
                metrics.meetsFifteenMinStandard ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {metrics.meetsFifteenMinStandard ? 'Meets Standard' : 'Slower Than 15:00/Mi'}
            </span>
          </div>
          <span className="text-xs text-zinc-400 mt-1 block">
            {metrics.meetsFifteenMinStandard
              ? 'On pace for Air Assault / EIB cutoff'
              : 'Tighten target time for 3-hr 12-mi cutoff'}
          </span>
        </div>
      </div>

      {/* Main Layout: Inputs + Checkpoint Splits + Log Ruck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Mile-by-Mile Checkpoint Table */}
        <div className="lg:col-span-2 bg-[#0e1217] border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="ruck-distance" className="block text-xs font-bold text-zinc-400 mb-1">
                Distance (Miles)
              </label>
              <input
                id="ruck-distance"
                type="number"
                min={1}
                max={26}
                step={0.5}
                value={distanceMiles}
                onChange={(e) => setDistanceMiles(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#090b0d] border border-zinc-700 font-mono font-bold text-white tabular-nums focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label htmlFor="ruck-weight" className="block text-xs font-bold text-zinc-400 mb-1">
                Pack Weight (lbs)
              </label>
              <input
                id="ruck-weight"
                type="number"
                min={10}
                max={120}
                step={5}
                value={packWeightLbs}
                onChange={(e) => setPackWeightLbs(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#090b0d] border border-zinc-700 font-mono font-bold text-white tabular-nums focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label htmlFor="ruck-time" className="block text-xs font-bold text-zinc-400 mb-1">
                Target / Actual Time (h:mm:ss)
              </label>
              <input
                id="ruck-time"
                type="text"
                value={targetClock}
                onChange={(e) => setTargetClock(e.target.value)}
                placeholder="3:00:00"
                className="w-full px-3 py-2 rounded-xl bg-[#090b0d] border border-zinc-700 font-mono font-bold text-white tabular-nums focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-white font-athletic flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Mile-by-Mile Checkpoint Splits</span>
            </h3>
            <span className="text-xs font-mono text-zinc-400">Even-Split Target Clock</span>
          </div>

          <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#0e1217] border-b border-zinc-800 text-[11px] font-mono uppercase text-zinc-400">
                <tr>
                  <th className="py-2.5 px-5">Checkpoint</th>
                  <th className="py-2.5 px-4 text-right">Mile Split</th>
                  <th className="py-2.5 px-5 text-right">Elapsed Clock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono text-xs tabular-nums">
                {metrics.checkpoints.map((cp) => (
                  <tr
                    key={cp.mile}
                    className={
                      cp.isFinish
                        ? 'bg-amber-500/10 text-amber-300 font-bold'
                        : cp.isHalfway
                        ? 'bg-zinc-900/70 text-white font-bold'
                        : 'text-zinc-300 hover:bg-zinc-900/40'
                    }
                  >
                    <td className="py-2.5 px-5">
                      Mile {cp.mile}
                      {cp.isHalfway && !cp.isFinish && (
                        <span className="ml-2 text-[10px] text-amber-400 font-sans font-bold uppercase">
                          Halfway Turnaround
                        </span>
                      )}
                      {cp.isFinish && (
                        <span className="ml-2 text-[10px] text-emerald-400 font-sans font-bold uppercase">
                          Finish Line
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right text-zinc-400">{cp.splitClock}</td>
                    <td className="py-2.5 px-5 text-right font-bold">{cp.cumulativeClock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log Completed Ruck Form */}
        <div className="bg-[#0e1217] border border-zinc-800 rounded-2xl p-5 space-y-3.5">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white font-athletic flex items-center gap-2">
              <Mountain className="w-4 h-4 text-amber-400" />
              <span>Log Completed Ruck</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Saves directly to your cloud-synced Ruck March history with Workload Index tracking.
            </p>
          </div>

          <div>
            <label htmlFor="ruck-title" className="block text-xs font-bold text-zinc-400 mb-1">
              Route / Session Title
            </label>
            <input
              id="ruck-title"
              type="text"
              value={ruckTitle}
              onChange={(e) => setRuckTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#090b0d] border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="ruck-date" className="block text-xs font-bold text-zinc-400 mb-1">
                Date
              </label>
              <input
                id="ruck-date"
                type="date"
                value={ruckDate}
                onChange={(e) => setRuckDate(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-[#090b0d] border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label htmlFor="ruck-rpe" className="block text-xs font-bold text-zinc-400 mb-1">
                Effort (RPE 1–10)
              </label>
              <input
                id="ruck-rpe"
                type="number"
                min={1}
                max={10}
                value={rpe}
                onChange={(e) => setRpe(Math.max(1, Math.min(10, Number(e.target.value))))}
                className="w-full px-2.5 py-2 rounded-xl bg-[#090b0d] border border-zinc-800 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="ruck-terrain" className="block text-xs font-bold text-zinc-400 mb-1">
              Terrain
            </label>
            <select
              id="ruck-terrain"
              value={terrain}
              onChange={(e) => setTerrain(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#090b0d] border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Road / Garrison Loop">Road / Garrison Loop</option>
              <option value="Rolling Dirt / Tank Trail">Rolling Dirt / Tank Trail</option>
              <option value="Hilly / Mountain Grade">Hilly / Mountain Grade</option>
              <option value="Incline Treadmill">Incline Treadmill</option>
            </select>
          </div>

          <div>
            <label htmlFor="ruck-notes" className="block text-xs font-bold text-zinc-400 mb-1">
              Boots / Hotspots / Fueling Notes
            </label>
            <textarea
              id="ruck-notes"
              rows={2}
              value={ruckNotes}
              onChange={(e) => setRuckNotes(e.target.value)}
              placeholder="e.g., Dry socks at Mile 6, 1L electrolytes/hr, zero blisters..."
              className="w-full px-3 py-2 rounded-xl bg-[#090b0d] border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleLogRuck}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-black uppercase text-xs tracking-wider font-athletic flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Ruck...' : 'Save Completed Ruck'}</span>
          </button>

          {saveFeedback && (
            <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-500/40 rounded-xl px-3 py-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{saveFeedback}</span>
            </div>
          )}
        </div>
      </div>

      {/* Logged Ruck History */}
      <div className="bg-[#0e1217] border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-base font-black uppercase tracking-wider text-white font-athletic flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Logged Ruck March History</span>
          </h3>
          <span className="text-xs font-mono text-zinc-400 tabular-nums">
            {ruckLogs.length} {ruckLogs.length === 1 ? 'session' : 'sessions'}
          </span>
        </div>

        {ruckLogs.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-[#090b0d]/60">
            <p className="text-sm font-bold text-zinc-300">No ruck marches logged yet</p>
            <p className="text-xs text-zinc-500 mt-1">
              Use the pacer above to plan your splits, then save your completed march to build your ruck progression log.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-[11px] font-mono uppercase text-zinc-400">
                  <th className="py-2 pr-4">Date &amp; Route</th>
                  <th className="py-2 px-3 text-right">Distance</th>
                  <th className="py-2 px-3 text-right">Pack</th>
                  <th className="py-2 px-3 text-right">Pace</th>
                  <th className="py-2 px-3 text-right">Workload</th>
                  <th className="py-2 pl-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {ruckLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/40">
                    <td className="py-3 pr-4">
                      <div className="font-bold text-white">{log.title}</div>
                      <div className="text-[11px] font-mono text-zinc-400">
                        {log.date} · {log.terrain || 'Road'} {log.rpe ? `· RPE ${log.rpe}` : ''}
                      </div>
                      {log.notes && <div className="text-[11px] text-zinc-500 mt-0.5">{log.notes}</div>}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                      {log.distanceMiles} mi
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-amber-400 font-bold tabular-nums">
                      {log.weightLbs} lb
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-200 tabular-nums">
                      {formatSecondsToClock(log.paceMinPerMile * 60)}/mi
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-300 tabular-nums">
                      {log.workloadIndex}
                    </td>
                    <td className="py-3 pl-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteRuck(log.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete ruck log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
