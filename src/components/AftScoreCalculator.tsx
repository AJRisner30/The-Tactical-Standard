import React, { useState, useMemo, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Save,
  Trash2,
  TrendingUp,
  Target,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { AftAgeBracket, PtTestRecord, PtTestTag } from '../types';
import {
  AFT_AGE_BRACKETS,
  calculateAftScore,
  calculateGeneralPftScore,
  parseClockToSeconds,
} from '../utils/aftScoringEngine';
import { getStoredPtTestLogs, saveStoredPtTestLogs } from '../utils/storage';
import {
  subscribeToUserPtTestLogs,
  savePtTestLogToFirestore,
  deletePtTestLogFromFirestore,
} from '../utils/firebaseSync';
import { useFirebase } from '../context/FirebaseContext';
import { getCurrentAthlete } from '../utils/athleteAuth';
import { soundManager } from '../utils/audio';

const TAG_LABELS: Record<PtTestTag, string> = {
  baseline: 'Week 0 Baseline',
  mock: 'Mock / Diagnostic',
  rehearsal: 'Week 7 Rehearsal',
  record: 'Official Record',
};

export const AftScoreCalculator: React.FC = () => {
  const { user } = useFirebase();
  const currentAthlete = getCurrentAthlete();

  // Evaluation Type & Standards
  const [testType, setTestType] = useState<'aft' | 'general_pft'>('aft');
  const [standard, setStandard] = useState<'combat' | 'general'>('combat');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [ageBracket, setAgeBracket] = useState<AftAgeBracket>('22-26');

  // 5-Event AFT Raw Inputs
  const [mdlLbs, setMdlLbs] = useState<number>(280);
  const [hrpReps, setHrpReps] = useState<number>(46);
  const [sdcClock, setSdcClock] = useState<string>('1:44');
  const [plkClock, setPlkClock] = useState<string>('3:15');
  const [twoMileClock, setTwoMileClock] = useState<string>('14:45');

  // General PFT Raw Inputs
  const [pullUps, setPullUps] = useState<number>(18);
  const [pftPlankClock, setPftPlankClock] = useState<string>('3:20');
  const [threeMileClock, setThreeMileClock] = useState<string>('21:15');

  // Logging Controls
  const [logTag, setLogTag] = useState<PtTestTag>('baseline');
  const [logDate, setLogDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [logNotes, setLogNotes] = useState<string>('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Persisted History (Firestore + Offline Local Cache)
  const [savedRecords, setSavedRecords] = useState<PtTestRecord[]>(() => getStoredPtTestLogs());
  const [historyFilter, setHistoryFilter] = useState<'all' | 'aft' | 'general_pft'>('all');

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToUserPtTestLogs(user.uid, (cloudRecords) => {
      if (cloudRecords.length > 0) {
        setSavedRecords(cloudRecords);
        saveStoredPtTestLogs(cloudRecords);
      }
    });
    return () => unsub();
  }, [user?.uid]);

  const aftResult = useMemo(() => {
    return calculateAftScore({
      standard,
      sex,
      ageBracket,
      mdlLbs: Math.max(0, Number(mdlLbs) || 0),
      hrpReps: Math.max(0, Number(hrpReps) || 0),
      sdcSeconds: parseClockToSeconds(sdcClock),
      plkSeconds: parseClockToSeconds(plkClock),
      twoMileSeconds: parseClockToSeconds(twoMileClock),
    });
  }, [standard, sex, ageBracket, mdlLbs, hrpReps, sdcClock, plkClock, twoMileClock]);

  const pftResult = useMemo(() => {
    return calculateGeneralPftScore({
      sex,
      ageBracket,
      pullUps: Math.max(0, Number(pullUps) || 0),
      plankSeconds: parseClockToSeconds(pftPlankClock),
      threeMileSeconds: parseClockToSeconds(threeMileClock),
    });
  }, [sex, ageBracket, pullUps, pftPlankClock, threeMileClock]);

  const activeTotal = testType === 'aft' ? aftResult.totalScore : pftResult.totalScore;
  const activeMax = testType === 'aft' ? aftResult.maxScore : pftResult.maxScore;
  const activePassed = testType === 'aft' ? aftResult.passed : pftResult.passed;
  const activeEvents = testType === 'aft' ? aftResult.events : pftResult.events;
  const activeWeakest = testType === 'aft' ? aftResult.weakestEvent : pftResult.weakestEvent;
  const activeHeadline = testType === 'aft' ? aftResult.statusHeadline : pftResult.statusHeadline;

  const filteredHistory = useMemo(() => {
    const base =
      historyFilter === 'all'
        ? savedRecords
        : savedRecords.filter((r) => r.testType === historyFilter);
    return [...base].sort((a, b) => (b.date + (b.createdAt || '')).localeCompare(a.date + (a.createdAt || '')));
  }, [savedRecords, historyFilter]);

  const chartData = useMemo(() => {
    const matching = savedRecords
      .filter((r) => r.testType === testType)
      .sort((a, b) => (a.date + (a.createdAt || '')).localeCompare(b.date + (b.createdAt || '')));
    return matching.map((rec, idx) => ({
      label: `${rec.date.slice(5)} (${TAG_LABELS[rec.tag].split(' ')[0]})`,
      score: rec.totalScore,
      index: idx + 1,
    }));
  }, [savedRecords, testType]);

  const scoreDeltaFromBaseline = useMemo(() => {
    const matching = savedRecords
      .filter((r) => r.testType === testType)
      .sort((a, b) => (a.date + (a.createdAt || '')).localeCompare(b.date + (b.createdAt || '')));
    if (matching.length === 0) return null;
    const baseline = matching.find((r) => r.tag === 'baseline') || matching[0];
    return {
      baselineScore: baseline.totalScore,
      baselineDate: baseline.date,
      delta: activeTotal - baseline.totalScore,
    };
  }, [savedRecords, testType, activeTotal]);

  const handleSaveRecord = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    const nowIso = new Date().toISOString();
    const record: PtTestRecord = {
      id: `pt_${testType}_${Date.now()}`,
      userId: user?.uid || currentAthlete.id,
      athleteId: currentAthlete.id,
      testType,
      standard,
      sex,
      ageBracket,
      date: logDate || nowIso.split('T')[0],
      tag: logTag,
      events: activeEvents.map((ev) => ({
        key: ev.key,
        label: ev.label,
        rawDisplay: ev.rawDisplay,
        rawValue: ev.rawValue,
        points: ev.points,
        passed: ev.passed,
      })),
      totalScore: activeTotal,
      maxScore: activeMax,
      passed: activePassed,
      promotionPoints: testType === 'aft' ? aftResult.promotionPoints : undefined,
      notes: logNotes.trim(),
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const next = [record, ...savedRecords];
    setSavedRecords(next);
    saveStoredPtTestLogs(next);

    try {
      if (user?.uid) {
        await savePtTestLogToFirestore(record, user.uid);
      }
      soundManager.playSetLogged();
      setLogNotes('');
      setSaveMessage(
        `${TAG_LABELS[logTag]} (${record.totalScore}/${record.maxScore}) saved${user?.uid ? ' and synced to cloud' : ' locally'}.`
      );
      setTimeout(() => setSaveMessage(null), 4000);
    } catch (err) {
      console.error('Failed to sync PT score:', err);
      setSaveMessage('Saved locally. Cloud sync will retry when online.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    const next = savedRecords.filter((r) => r.id !== id);
    setSavedRecords(next);
    saveStoredPtTestLogs(next);
    if (user?.uid) {
      try {
        await deletePtTestLogFromFirestore(id);
      } catch (err) {
        console.warn('Could not delete remote PT log:', err);
      }
    }
  };

  const handleResetDefaults = () => {
    if (testType === 'aft') {
      setMdlLbs(280);
      setHrpReps(46);
      setSdcClock('1:44');
      setPlkClock('3:15');
      setTwoMileClock('14:45');
    } else {
      setPullUps(18);
      setPftPlankClock('3:20');
      setThreeMileClock('21:15');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Evaluation Selector */}
      <div className="bg-[#0e1217] border border-amber-500/30 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
              <span className="text-amber-400 font-bold">Official Military Standards</span>
              <span aria-hidden="true">·</span>
              <span>5-Event 500-Pt AFT &amp; 300-Pt General PFT</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white font-athletic">
              AFT &amp; Military PT <span className="text-amber-400">Score Calculator &amp; Tracker</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              Calculate live event points, verify Combat (350+) vs. General (300+) standards and 60-pt event minimums, and track Week 0 Baseline through Week 8 Record Test gains.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-[#090b0d] p-1 rounded-xl border border-zinc-800 flex items-center">
              <button
                type="button"
                onClick={() => setTestType('aft')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                  testType === 'aft'
                    ? 'bg-amber-500 text-black font-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Army AFT (500 Pt)
              </button>
              <button
                type="button"
                onClick={() => setTestType('general_pft')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                  testType === 'general_pft'
                    ? 'bg-amber-500 text-black font-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                General PFT (300 Pt)
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-2 rounded-xl bg-[#090b0d] hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="Reset sample values"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Standard, Sex & Age Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-zinc-800/80">
          {testType === 'aft' ? (
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">MOS Scoring Standard</label>
              <div className="grid grid-cols-2 gap-1.5 bg-[#090b0d] p-1 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStandard('combat')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    standard === 'combat'
                      ? 'bg-amber-500 text-black font-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Combat (≥350)
                </button>
                <button
                  type="button"
                  onClick={() => setStandard('general')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    standard === 'general'
                      ? 'bg-amber-500 text-black font-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  General (≥300)
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Evaluation Format</label>
              <div className="px-3 py-2 rounded-xl bg-[#090b0d] border border-zinc-800 text-xs text-zinc-300 font-medium">
                3-Event PFT (Pull-Ups · Plank · 3-Mi Run)
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1.5">
              Scoring Table {testType === 'aft' && standard === 'combat' ? '(Sex-Neutral Combat)' : '(Normed)'}
            </label>
            <div className="grid grid-cols-2 gap-1.5 bg-[#090b0d] p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                disabled={testType === 'aft' && standard === 'combat'}
                onClick={() => setSex('male')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  testType === 'aft' && standard === 'combat'
                    ? 'bg-zinc-800 text-zinc-300 cursor-not-allowed'
                    : sex === 'male'
                    ? 'bg-amber-500 text-black font-black cursor-pointer'
                    : 'text-zinc-400 hover:text-white cursor-pointer'
                }`}
              >
                {testType === 'aft' && standard === 'combat' ? 'Sex-Neutral' : 'Male'}
              </button>
              <button
                type="button"
                disabled={testType === 'aft' && standard === 'combat'}
                onClick={() => setSex('female')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  testType === 'aft' && standard === 'combat'
                    ? 'text-zinc-600 cursor-not-allowed'
                    : sex === 'female'
                    ? 'bg-amber-500 text-black font-black cursor-pointer'
                    : 'text-zinc-400 hover:text-white cursor-pointer'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="aft-age-bracket" className="block text-xs font-bold text-zinc-400 mb-1.5">
              Age Bracket
            </label>
            <select
              id="aft-age-bracket"
              value={ageBracket}
              onChange={(e) => setAgeBracket(e.target.value as AftAgeBracket)}
              className="w-full px-3 py-2 rounded-xl bg-[#090b0d] border border-zinc-800 text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-500"
            >
              {AFT_AGE_BRACKETS.map((b) => (
                <option key={b} value={b}>
                  Age {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Live Score Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0e1217] border border-zinc-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-zinc-400 block">Composite Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black font-mono tabular-nums text-white">{activeTotal}</span>
            <span className="text-sm font-mono text-zinc-500">/ {activeMax}</span>
          </div>
          {scoreDeltaFromBaseline && (
            <span
              className={`text-xs font-mono tabular-nums mt-1 block ${
                scoreDeltaFromBaseline.delta >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {scoreDeltaFromBaseline.delta >= 0 ? '+' : ''}
              {scoreDeltaFromBaseline.delta} pts vs. baseline ({scoreDeltaFromBaseline.baselineScore})
            </span>
          )}
        </div>

        <div className="bg-[#0e1217] border border-zinc-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-zinc-400 block">Qualification Status</span>
          <div className="flex items-center gap-2 mt-1.5">
            {activePassed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span
              className={`text-sm font-black uppercase tracking-wide ${
                activePassed ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {activePassed ? 'PASS' : 'FAIL'}
            </span>
          </div>
          <span className="text-xs text-zinc-400 block mt-1 leading-snug">{activeHeadline}</span>
        </div>

        <div className="bg-[#0e1217] border border-zinc-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-zinc-400 block">
            {testType === 'aft' ? 'Est. Promotion Points (SGT/SSG)' : 'PFT Classification'}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            {testType === 'aft' ? (
              <>
                <span className="text-3xl font-black font-mono tabular-nums text-amber-400">
                  {aftResult.promotionPoints}
                </span>
                <span className="text-xs font-mono text-zinc-500">/ 120 max</span>
              </>
            ) : (
              <span className="text-lg font-black text-amber-400 font-athletic uppercase mt-1">
                {pftResult.classification}
              </span>
            )}
          </div>
          <span className="text-xs text-zinc-400 block mt-1">
            {testType === 'aft'
              ? 'Requires 60+ pts on all 5 events'
              : 'Minimum 40 pts per event required'}
          </span>
        </div>

        <div className="bg-[#0e1217] border border-zinc-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-zinc-400 block">Primary Training Priority</span>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Target className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-sm font-bold text-white truncate">{activeWeakest}</span>
          </div>
          <span className="text-xs text-zinc-400 block mt-1">
            Lowest-scoring event — highest point-gain leverage
          </span>
        </div>
      </div>

      {/* Main Two-Column Grid: Event Inputs + Save Log Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Event Inputs Table */}
        <div className="lg:col-span-2 bg-[#0e1217] border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between gap-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-white font-athletic">
              {testType === 'aft' ? '5 Official AFT Events' : '3 General PFT Events'}
            </h3>
            <span className="text-xs font-mono text-zinc-400">
              Enter raw weight, reps, or mm:ss time
            </span>
          </div>

          <div className="divide-y divide-zinc-800/80">
            {testType === 'aft' ? (
              <>
                <EventInputRow
                  label="1. 3RM Deadlift (MDL)"
                  subtext={`60 pts: ${aftResult.events[0].min60Target} · 100 pts: ${aftResult.events[0].max100Target}`}
                  points={aftResult.events[0].points}
                  passed={aftResult.events[0].passed}
                  inputEl={
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={60}
                        max={500}
                        step={10}
                        value={mdlLbs}
                        onChange={(e) => setMdlLbs(Number(e.target.value))}
                        aria-label="3RM Deadlift pounds"
                        className="w-24 px-3 py-1.5 rounded-lg bg-[#090b0d] border border-zinc-700 text-right font-mono font-bold text-white tabular-nums focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-xs font-mono text-zinc-400">lbs</span>
                    </div>
                  }
                />
                <EventInputRow
                  label="2. Hand-Release Push-Ups (HRP)"
                  subtext={`60 pts: ${aftResult.events[1].min60Target} · 100 pts: ${aftResult.events[1].max100Target}`}
                  points={aftResult.events[1].points}
                  passed={aftResult.events[1].passed}
                  inputEl={
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={120}
                        value={hrpReps}
                        onChange={(e) => setHrpReps(Number(e.target.value))}
                        aria-label="Hand-Release Push-Ups reps"
                        className="w-24 px-3 py-1.5 rounded-lg bg-[#090b0d] border border-zinc-700 text-right font-mono font-bold text-white tabular-nums focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-xs font-mono text-zinc-400">reps</span>
                    </div>
                  }
                />
                <EventInputRow
                  label="3. 250m Sprint-Drag-Carry (SDC)"
                  subtext={`60 pts: ${aftResult.events[2].min60Target} · 100 pts: ${aftResult.events[2].max100Target}`}
                  points={aftResult.events[2].points}
                  passed={aftResult.events[2].passed}
                  inputEl={
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={sdcClock}
                        onChange={(e) => setSdcClock(e.target.value)}
                        placeholder="1:44"
                        aria-label="Sprint-Drag-Carry time mm:ss"
                        className="w-24 px-3 py-1.5 rounded-lg bg-[#090b0d] border border-zinc-700 text-right font-mono font-bold text-white tabular-nums focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-xs font-mono text-zinc-400">m:ss</span>
                    </div>
                  }
                />
                <EventInputRow
                  label="4. Forearm Plank (PLK)"
                  subtext={`60 pts: ${aftResult.events[3].min60Target} · 100 pts: ${aftResult.events[3].max100Target}`}
                  points={aftResult.events[3].points}
                  passed={aftResult.events[3].passed}
                  inputEl={
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={plkClock}
                        onChange={(e) => setPlkClock(e.target.value)}
                        placeholder="3:15"
                        aria-label="Plank duration mm:ss"
                        className="w-24 px-3 py-1.5 rounded-lg bg-[#090b0d] border border-zinc-700 text-right font-mono font-bold text-white tabular-nums focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-xs font-mono text-zinc-400">m:ss</span>
                    </div>
                  }
                />
                <EventInputRow
                  label="5. 2-Mile Run (2MR)"
                  subtext={`60 pts: ${aftResult.events[4].min60Target} · 100 pts: ${aftResult.events[4].max100Target}`}
                  points={aftResult.events[4].points}
                  passed={aftResult.events[4].passed}
                  inputEl={
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={twoMileClock}
                        onChange={(e) => setTwoMileClock(e.target.value)}
                        placeholder="14:45"
                        aria-label="Two-mile run time mm:ss"
                        className="w-24 px-3 py-1.5 rounded-lg bg-[#090b0d] border border-zinc-700 text-right font-mono font-bold text-white tabular-nums focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-xs font-mono text-zinc-400">m:ss</span>
                    </div>
                  }
                />
              </>
            ) : (
              <>
                <EventInputRow
                  label="1. Strict Dead-Hang Pull-Ups"
                  subtext={`Pass: ${pftResult.events[0].min60Target} · Max 100: ${pftResult.events[0].max100Target}`}
                  points={pftResult.events[0].points}
                  passed={pftResult.events[0].passed}
                  inputEl={
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={pullUps}
                        onChange={(e) => setPullUps(Number(e.target.value))}
                        aria-label="Pull-ups reps"
                        className="w-24 px-3 py-1.5 rounded-lg bg-[#090b0d] border border-zinc-700 text-right font-mono font-bold text-white tabular-nums focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-xs font-mono text-zinc-400">reps</span>
                    </div>
                  }
                />
                <EventInputRow
                  label="2. Forearm Plank"
                  subtext={`Pass: ${pftResult.events[1].min60Target} · Max 100: ${pftResult.events[1].max100Target}`}
                  points={pftResult.events[1].points}
                  passed={pftResult.events[1].passed}
                  inputEl={
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={pftPlankClock}
                        onChange={(e) => setPftPlankClock(e.target.value)}
                        placeholder="3:20"
                        aria-label="PFT plank time mm:ss"
                        className="w-24 px-3 py-1.5 rounded-lg bg-[#090b0d] border border-zinc-700 text-right font-mono font-bold text-white tabular-nums focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-xs font-mono text-zinc-400">m:ss</span>
                    </div>
                  }
                />
                <EventInputRow
                  label="3. 3-Mile Run"
                  subtext={`Pass: ${pftResult.events[2].min60Target} · Max 100: ${pftResult.events[2].max100Target}`}
                  points={pftResult.events[2].points}
                  passed={pftResult.events[2].passed}
                  inputEl={
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={threeMileClock}
                        onChange={(e) => setThreeMileClock(e.target.value)}
                        placeholder="21:15"
                        aria-label="Three-mile run time mm:ss"
                        className="w-24 px-3 py-1.5 rounded-lg bg-[#090b0d] border border-zinc-700 text-right font-mono font-bold text-white tabular-nums focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-xs font-mono text-zinc-400">m:ss</span>
                    </div>
                  }
                />
              </>
            )}
          </div>
        </div>

        {/* Log & Track Score Panel */}
        <div className="bg-[#0e1217] border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white font-athletic flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Save to PT Record Tracker</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Log your Week 0 Baseline, Week 7 Rehearsal, or Official Record test to chart point progression across your 8-week cycle.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1">Milestone Tag</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['baseline', 'mock', 'rehearsal', 'record'] as PtTestTag[]).map((tagKey) => (
                  <button
                    key={tagKey}
                    type="button"
                    onClick={() => setLogTag(tagKey)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                      logTag === tagKey
                        ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                        : 'bg-[#090b0d] border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {TAG_LABELS[tagKey]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="pt-log-date" className="block text-xs font-bold text-zinc-400 mb-1">
                Test Date
              </label>
              <input
                id="pt-log-date"
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#090b0d] border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label htmlFor="pt-log-notes" className="block text-xs font-bold text-zinc-400 mb-1">
                Conditions / Notes (Optional)
              </label>
              <textarea
                id="pt-log-notes"
                rows={2}
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                placeholder="e.g., 42°F outdoor track, slight wind on final 800m..."
                className="w-full px-3 py-2 rounded-xl bg-[#090b0d] border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveRecord}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-black uppercase text-xs tracking-wider font-athletic flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSaving ? 'Saving...' : `Log ${activeTotal}/${activeMax} Score`}
              </span>
            </button>

            {saveMessage && (
              <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-500/40 rounded-xl px-3 py-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{saveMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progression Chart & Recorded Test History */}
      <div className="bg-[#0e1217] border border-zinc-800 rounded-2xl p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-black uppercase tracking-wider text-white font-athletic flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Logged PT Evaluations &amp; Score Progression</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Compare Week 0 Baseline against Week 7 Dress Rehearsal and Week 8 Official Record tests.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#090b0d] p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
            {(['all', 'aft', 'general_pft'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setHistoryFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  historyFilter === f
                    ? 'bg-amber-500 text-black font-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {f === 'all' ? 'All Tests' : f === 'aft' ? 'AFT' : 'General PFT'}
              </button>
            ))}
          </div>
        </div>

        {chartData.length >= 2 && (
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="label" stroke="#a1a1aa" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#a1a1aa"
                  tick={{ fontSize: 11 }}
                  domain={testType === 'aft' ? [200, 500] : [100, 300]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090b0d',
                    borderColor: '#3f3f46',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  name={testType === 'aft' ? 'AFT Total' : 'PFT Total'}
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#f59e0b' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-[#090b0d]/60">
            <p className="text-sm font-bold text-zinc-300">No PT evaluations logged yet</p>
            <p className="text-xs text-zinc-500 mt-1">
              Enter your current numbers above and click &ldquo;Log Score&rdquo; to record your Week 0 Baseline.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-[11px] font-mono uppercase text-zinc-400">
                  <th className="py-2.5 pr-4">Date &amp; Milestone</th>
                  <th className="py-2.5 px-3">Format</th>
                  <th className="py-2.5 px-3">Event Breakdown</th>
                  <th className="py-2.5 px-3 text-right">Score</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                  <th className="py-2.5 pl-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70 text-xs">
                {filteredHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-white tabular-nums">{rec.date}</div>
                      <div className="text-[11px] text-amber-400">{TAG_LABELS[rec.tag]}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-zinc-300">
                      {rec.testType === 'aft' ? 'Army AFT' : 'General PFT'}
                      <span className="text-zinc-500"> · </span>
                      <span className="capitalize">{rec.standard}</span>
                      <span className="text-zinc-500"> · </span>
                      <span>{rec.ageBracket}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] tabular-nums text-zinc-300">
                        {rec.events.map((ev) => (
                          <span key={ev.key}>
                            <span className="text-zinc-500 uppercase">{ev.key}:</span>{' '}
                            <span className={ev.passed ? 'text-zinc-200' : 'text-red-400 font-bold'}>
                              {ev.rawDisplay} ({ev.points})
                            </span>
                          </span>
                        ))}
                      </div>
                      {rec.notes && (
                        <div className="text-[11px] text-zinc-500 mt-1">{rec.notes}</div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-white tabular-nums whitespace-nowrap">
                      {rec.totalScore}
                      <span className="text-zinc-500 font-normal">/{rec.maxScore}</span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span
                        className={`font-mono font-bold uppercase ${
                          rec.passed ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {rec.passed ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                    <td className="py-3 pl-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteRecord(rec.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete test record"
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

interface EventInputRowProps {
  label: string;
  subtext: string;
  points: number;
  passed: boolean;
  inputEl: React.ReactNode;
}

const EventInputRow: React.FC<EventInputRowProps> = ({
  label,
  subtext,
  points,
  passed,
  inputEl,
}) => {
  return (
    <div className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/40 transition-colors">
      <div className="min-w-0">
        <div className="text-sm font-bold text-white">{label}</div>
        <div className="text-xs font-mono text-zinc-400 tabular-nums mt-0.5">{subtext}</div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
        {inputEl}
        <div className="w-24 text-right">
          <div
            className={`text-base font-black font-mono tabular-nums ${
              !passed ? 'text-red-400' : points >= 90 ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {points} <span className="text-[11px] font-normal text-zinc-500">pts</span>
          </div>
          <div className={`text-[10px] font-mono font-bold uppercase ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
            {passed ? 'Pass' : 'Below Min'}
          </div>
        </div>
      </div>
    </div>
  );
};
