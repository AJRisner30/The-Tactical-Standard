import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  CheckCircle2,
  Zap,
  HardDrive,
  Radio,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useAndroidHaptics } from '../hooks/useAndroidHaptics';
import { TacticalStandardCompanyEmblem } from './BrandingLogos';

interface AndroidAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidAppModal: React.FC<AndroidAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install, markAsInstalled } = usePWAInstall();
  const { tap, success } = useAndroidHaptics();
  const [activeTab, setActiveTab] = useState<'install' | 'features'>('install');

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    tap();
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        success();
      }
    } else {
      markAsInstalled();
      success();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#141a21] via-[#0e1217] to-[#090b0d] border border-amber-500/35 rounded-2xl shadow-2xl overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-400" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                  Android Native Edition
                </span>
                {isInstalled ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    App Installed
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    WebAPK &amp; TWA Ready
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white font-athletic uppercase tracking-wide">
                The Tactical Standard Android App
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              tap();
              onClose();
            }}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-800 bg-[#090b0d] px-4 pt-2 gap-2">
          <button
            type="button"
            onClick={() => {
              tap();
              setActiveTab('install');
            }}
            className={`pb-2.5 px-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'install'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install on Android</span>
          </button>

          <button
            type="button"
            onClick={() => {
              tap();
              setActiveTab('features');
            }}
            className={`pb-2.5 px-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'features'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Android Capabilities</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[70vh]">
          {activeTab === 'install' && (
            <div className="space-y-5">
              {isInstalled ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Running as Installed Android App</h4>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      The Tactical Standard is active in standalone mode with full hardware screen wake-lock, tactical vibration feedback, and offline caching.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#141a21] border border-emerald-500/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wide text-white flex items-center gap-2">
                        <span>Direct Android WebAPK Install</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500 text-black font-black">
                          RECOMMENDED
                        </span>
                      </h4>
                      <p className="text-xs text-zinc-300 mt-1">
                        Installs The Tactical Standard directly to your Android Home Screen and App Drawer with high-res tactical crest icon and no browser search bar.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleInstallClick}
                      className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      <Download className="w-4 h-4 stroke-[3]" />
                      <span>{isInstallable ? 'Install Android App' : 'Add to Android Home'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step by Step Manual Android Guide */}
              <div className="p-4 rounded-xl bg-[#0e1217] border border-zinc-800 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Manual Installation Steps on Android Devices</span>
                </h4>

                <ol className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <span>Open this application in <strong>Google Chrome</strong> or <strong>Samsung Internet</strong> on your Android device.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <span>Tap the three dots <strong>⋮ menu</strong> located in the top-right or bottom-right corner of the browser.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <span>Select <strong>&quot;Install app&quot;</strong> (or <strong>&quot;Add to Home screen&quot;</strong>).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                    <span>Confirm by tapping <strong>Install</strong>. Android will build a native WebAPK with The Tactical Standard icon in your app drawer!</span>
                  </li>
                </ol>
              </div>

              {/* Home Screen App Shortcuts Info */}
              <div className="p-4 rounded-xl bg-[#0e1217] border border-zinc-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4" />
                  <span>Android Long-Press App Shortcuts</span>
                </h4>
                <p className="text-xs text-zinc-300">
                  Once installed on your Android home screen, long-press <strong>The Tactical Standard</strong> app icon to instantly jump to:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                  <div className="p-2.5 rounded-lg bg-[#141a21] border border-zinc-700/60 text-center">
                    <div className="text-xs font-bold text-white">Today&apos;s Workout</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Direct into mission lifting</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#141a21] border border-zinc-700/60 text-center">
                    <div className="text-xs font-bold text-amber-300">Command Portal</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Private assigned protocol</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#141a21] border border-zinc-700/60 text-center">
                    <div className="text-xs font-bold text-emerald-300">Readiness Test</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Military PT calculation</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#0e1217] border border-zinc-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                    <Zap className="w-4 h-4" />
                    <span>Android Screen Wake-Lock</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Keeps the Android display actively awake during active workout sets and rest timers so your screen never turns black while training.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0e1217] border border-zinc-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wide">
                    <Radio className="w-4 h-4" />
                    <span>Tactical Vibration Haptics</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Subtle tactile feedback for button clicks, set completion, rest timer alerts, and navigation taps using Android&apos;s hardware vibration engine.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0e1217] border border-zinc-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wide">
                    <Smartphone className="w-4 h-4" />
                    <span>Hardware Back Button Support</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Android edge-swipe gestures and hardware back buttons smoothly close open sheets, questionnaires, and modals instead of closing the app.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0e1217] border border-zinc-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wide">
                    <HardDrive className="w-4 h-4" />
                    <span>Offline Tactical Cache</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Programs, calculators, warm-ups, and logs are cached offline with Service Workers so you can train in field gyms or deployed environments.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0e1217] border border-zinc-800 flex items-center gap-4">
                <img
                  src="/pwa-maskable-512x512.png"
                  alt="Maskable Android Icon"
                  className="w-14 h-14 rounded-2xl border border-zinc-700 shadow-md bg-[#090b0d] shrink-0"
                />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Android Adaptive Icon (Maskable Safe Zone)
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Engineered with 80% safe-zone margin conforming to Android 14+ squircle, teardrop, and circle adaptive icon masks.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-[#090b0d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TacticalStandardCompanyEmblem size="xs" />
            <span className="text-xs text-zinc-400 font-athletic uppercase">
              The Tactical Standard Systems
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              tap();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
