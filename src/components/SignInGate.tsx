import React, { useState } from 'react';
import {
  ShieldCheck, Zap, Lock, LogIn, TrendingUp,
  Mail, Instagram, AlertCircle, RefreshCw,
  Activity, CheckCircle2, Shield,
  Eye, EyeOff, UserPlus, KeyRound
} from 'lucide-react';
import { TacticalStandardCompanyEmblem } from './BrandingLogos';
import { useFirebase } from '../context/FirebaseContext';
import { PWAInstallButton } from './PWAInstallButton';
import { getSelectableAthletes, registerAthlete, setCurrentAthlete } from '../utils/athleteAuth';
import { saveAthleteToFirestore } from '../utils/firebaseSync';

interface SignInGateProps {
  onOpenPricingModal?: () => void;
  onOpenCodeModal?: () => void;
}

type AuthMode = 'signin' | 'signup' | 'set_password';

export const SignInGate: React.FC<SignInGateProps> = ({
  onOpenPricingModal,
  onOpenCodeModal,
}) => {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordSetupEmail,
    isAuthenticating,
    authError,
    clearAuthError
  } = useFirebase();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSuccessEmail, setResetSuccessEmail] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const syncAthleteAfterAuth = (userEmail: string, displayName?: string, uid?: string) => {
    try {
      const existing = getSelectableAthletes();
      let matched = existing.find((a) => (a.email || '').toLowerCase() === userEmail.toLowerCase());
      if (!matched) {
        const defaultName = displayName || (userEmail.toLowerCase() === 'risneraryan@gmail.com' ? 'Coach AJ Risner' : userEmail.split('@')[0]);
        matched = registerAthlete({
          name: defaultName,
          email: userEmail,
          experienceLevel: 'Intermediate',
          primaryGoal: 'Hybrid Athlete',
          weightLbs: 185,
        });
      } else {
        setCurrentAthlete(matched.id);
      }
      if (uid && matched) {
        saveAthleteToFirestore(matched, uid).catch(() => {});
      }
    } catch (err) {
      console.warn('[SignInGate] Athlete sync note:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    clearAuthError();
    setLocalError(null);
    setResetSuccessEmail(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        syncAthleteAfterAuth(user.email || '', user.displayName || undefined, user.uid);
      }
    } catch {
      // Handled by FirebaseContext
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLocalError(null);
    setResetSuccessEmail(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    try {
      const user = await signInWithEmail(cleanEmail, password);
      if (user) {
        syncAthleteAfterAuth(user.email || cleanEmail, user.displayName || undefined, user.uid);
      }
    } catch {
      // Auth error is captured in FirebaseContext
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLocalError(null);
    setResetSuccessEmail(null);

    const cleanEmail = email.trim();
    const cleanName = fullName.trim();

    if (!cleanName) {
      setLocalError('Please enter your full name or rank.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      const user = await signUpWithEmail(cleanEmail, password, cleanName);
      if (user) {
        syncAthleteAfterAuth(cleanEmail, cleanName, user.uid);
        try {
          localStorage.setItem('patrol_ready_show_tour', 'true');
          localStorage.setItem('patrol_ready_tour_trigger_reason', 'signup');
        } catch {}
      }
    } catch {
      // Error handled by context
    }
  };

  const handleSendResetEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearAuthError();
    setLocalError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLocalError('Please enter the email address associated with your account.');
      return;
    }

    if (password && password.length > 0 && password.length < 6) {
      setLocalError('New password must be at least 6 characters long.');
      return;
    }

    try {
      await sendPasswordSetupEmail(cleanEmail, password.length >= 6 ? password : undefined);
      if (password.length >= 6) {
        syncAthleteAfterAuth(cleanEmail);
      } else {
        setResetSuccessEmail(cleanEmail);
      }
    } catch {
      // Handled by context
    }
  };

  return (
    <div className="min-h-screen bg-[#090b0d] text-zinc-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-500 selection:text-black">
      {/* Gunmetal Obsidian Ambience & Tactical Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(245,158,11,0.12),transparent_70%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top Banner & Brand Rail */}
      <header className="relative z-10 border-b border-amber-500/25 bg-[#0e1217]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TacticalStandardCompanyEmblem size="sm" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-athletic font-black text-sm sm:text-base tracking-wider text-white uppercase whitespace-nowrap">
                The Tactical
              </span>
              <span className="font-athletic font-black text-sm sm:text-base tracking-wider text-amber-400 uppercase whitespace-nowrap">
                Standard
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/35 font-mono">
                MILITARY v2.6
              </span>
            </div>
            <span className="text-[11px] text-amber-300/90 font-bold block tracking-wider uppercase font-athletic">
              Tactical Readiness for the Modern Warfighter.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PWAInstallButton variant="pill" className="text-xs py-1 px-2.5 hidden sm:inline-flex" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/15 border border-amber-500/40 rounded-lg text-xs font-mono text-amber-300 font-bold whitespace-nowrap">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>14-Day Free Trial</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 my-auto flex flex-col items-center">
        {/* Emblem Hero Badge */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <div className="relative mb-3">
            <div className="p-1.5 bg-gradient-to-b from-amber-500/25 via-zinc-800 to-zinc-950 rounded-2xl shadow-2xl border border-amber-500/35">
              <TacticalStandardCompanyEmblem size="lg" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/35 rounded-full text-[11px] font-bold text-amber-300 uppercase tracking-widest font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>14-Day Risk-Free Trial · $0 Today · No Commitment</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-athletic">
            {mode === 'signin' && 'Sign In to The Tactical Standard'}
            {mode === 'signup' && 'Activate 14-Day Free Trial & Sign Up'}
            {mode === 'set_password' && 'Set / Reset Account Password'}
          </h1>

          <p className="mt-2 text-xs sm:text-base text-zinc-300 max-w-xl leading-relaxed">
            {mode === 'signin' && 'Welcome back, Service Member. Sign in with Google or enter your email and password to access your military training protocols, progressive overload logs, and readiness scores.'}
            {mode === 'signup' && 'Sign up to start your 14-day free trial. Instant access to the 52-Week Military Combat Fitness Program, 12-Week Tactical Bodybuilding, 12-Week Hybrid Protocol, Universal Military PT (ACFT/PFT/CFT), and the Adaptive Program Engine.'}
            {mode === 'set_password' && 'Set a new password directly for your account or request a reset link.'}
          </p>
        </div>

        {/* Primary Action Box */}
        <div className="w-full max-w-lg bg-[#0e1217]/95 border border-amber-500/35 hover:border-amber-400/55 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative transition-all">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-3.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider font-athletic shadow-md whitespace-nowrap">
            {mode === 'signin' && 'Service Member Sign-In'}
            {mode === 'signup' && '14-Day Free Trial Gateway'}
            {mode === 'set_password' && 'Account Password Setup'}
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 bg-[#090b0d] p-1 rounded-2xl border border-zinc-800 mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                clearAuthError();
                setLocalError(null);
              }}
              className={`py-2 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                clearAuthError();
                setLocalError(null);
              }}
              className={`py-2 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('set_password');
                clearAuthError();
                setLocalError(null);
              }}
              className={`py-2 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'set_password'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Set Password</span>
            </button>
          </div>

          {/* One-Click Google Sign-In Button */}
          {mode !== 'set_password' && (
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isAuthenticating}
                className="w-full py-3 px-4 bg-white hover:bg-zinc-100 text-zinc-950 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3.5">
                <div className="border-t border-zinc-800 w-full" />
                <span className="bg-[#0e1217] px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">
                  Or with Email &amp; Password
                </span>
                <div className="border-t border-zinc-800 w-full" />
              </div>
            </div>
          )}

          {/* Trial Value Callout Banner for Sign Up */}
          {mode === 'signup' && (
            <div className="mb-5 p-3.5 bg-[#141a21] border border-amber-500/35 rounded-2xl text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-black uppercase text-amber-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Full Pro Access Included
                </span>
                <span className="text-xs font-mono font-black text-black bg-amber-500 px-2 py-0.5 rounded">
                  $0 / 14 Days
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>52-Week Military Program, Tactical Bodybuilding, Hybrid &amp; ACFT/PFT</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Automated Double Progression (+2.5 to +10 lbs)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Adaptive Injury &amp; Equipment Program Engine</span>
                </div>
              </div>
            </div>
          )}

          {/* Local Validation Error */}
          {localError && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{localError}</span>
            </div>
          )}

          {/* Auth Error Notification */}
          {authError && (
            <div className="mb-5 p-3.5 bg-red-950/50 border border-red-500/50 rounded-2xl text-left animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs text-zinc-200 space-y-1.5 flex-1">
                  <div className="font-bold text-white">Sign-In Notice</div>
                  <p className="leading-snug text-zinc-300">
                    {authError.message}
                  </p>

                  {authError.isAccountExists && (
                    <div className="mt-2 pt-2 border-t border-red-800/60 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-amber-300">
                        Previously signed in with Google? Set a password for this email now:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('set_password');
                          clearAuthError();
                        }}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-lg text-[11px] cursor-pointer shrink-0 shadow"
                      >
                        Set Password
                      </button>
                    </div>
                  )}

                  {authError.isInvalidCredential && (
                    <div className="mt-2 pt-2 border-t border-red-800/60">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('set_password');
                          clearAuthError();
                        }}
                        className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
                      >
                        Need to set or reset your password? Click here &rarr;
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Password Reset Success Banner */}
          {resetSuccessEmail && (
            <div className="mb-5 p-4 bg-emerald-950/50 border border-emerald-500/60 rounded-2xl text-left animate-in fade-in duration-150 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Password Setup Updated!</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Password configuration processed for <strong className="text-white">{resetSuccessEmail}</strong>.
                You can now return to Sign In using your email and password.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setResetSuccessEmail(null);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs cursor-pointer shadow"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          )}

          {/* MODE: SIGN IN */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="block text-zinc-300 text-xs font-bold mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="service.member@military.mil or personal email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#090b0d] border border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-300 text-xs font-bold uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('set_password');
                      clearAuthError();
                      setLocalError(null);
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
                  >
                    Forgot / Set Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#090b0d] border border-zinc-700 rounded-xl pl-9 pr-10 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-200 cursor-pointer p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4 active:scale-[0.99]"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-black animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to The Tactical Standard</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: SIGN UP */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-zinc-300 text-xs font-bold mb-1 uppercase tracking-wider">
                  Full Name / Rank
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SGT Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#090b0d] border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-zinc-300 text-xs font-bold mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="service.member@military.mil or personal email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#090b0d] border border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 text-xs font-bold mb-1 uppercase tracking-wider">
                    Password (min 6 chars)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#090b0d] border border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 text-xs font-bold mb-1 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#090b0d] border border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 border border-emerald-400/40 cursor-pointer disabled:opacity-50 mt-4 active:scale-[0.99]"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    <span>Creating Account &amp; Starting Trial...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Activate 14-Day Free Trial</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: SET / RESET PASSWORD */}
          {mode === 'set_password' && (
            <form onSubmit={handleSendResetEmail} className="space-y-4">
              <div className="p-3.5 bg-[#141a21] border border-amber-500/30 rounded-2xl text-left space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Set or Reset Account Password</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Enter your account email and choose a new password below to set your password and sign in immediately.
                </p>
              </div>

              <div>
                <label className="block text-zinc-300 text-xs font-bold mb-1 uppercase tracking-wider">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your account email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#090b0d] border border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 text-xs font-bold mb-1 uppercase tracking-wider">
                  New Password (min 6 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Choose your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#090b0d] border border-zinc-700 rounded-xl pl-9 pr-10 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-200 cursor-pointer p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    clearAuthError();
                    setLocalError(null);
                  }}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-black text-xs sm:text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-black animate-spin" />
                      <span>Setting Password...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Set Password &amp; Sign In</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Secondary Links */}
          <div className="pt-4 mt-4 border-t border-zinc-800/80 flex flex-col gap-2.5 text-center text-xs">
            <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-400 flex-wrap">
              {onOpenPricingModal && (
                <button
                  type="button"
                  onClick={onOpenPricingModal}
                  className="text-zinc-300 hover:text-white underline cursor-pointer"
                >
                  View Membership Pricing ($30 / $15)
                </button>
              )}
              {onOpenPricingModal && onOpenCodeModal && <span>·</span>}
              {onOpenCodeModal && (
                <button
                  type="button"
                  onClick={onOpenCodeModal}
                  className="text-amber-400 hover:text-amber-300 font-mono font-bold cursor-pointer"
                >
                  Have a Unit / Command Code?
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>256-Bit Encrypted Cloud Sync · No Card Required for 14-Day Trial</span>
          </div>
        </div>

        {/* Military Performance Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full mt-8 sm:mt-12 text-left">
          <div className="p-4 bg-[#0e1217] border border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-amber-400 mb-1.5">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider font-athletic">
                Combat Chassis &amp; Armor
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Structural durability engineered to carry plate carriers, combat loads, and rucks across extended field operations.
            </p>
          </div>

          <div className="p-4 bg-[#0e1217] border border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-amber-400 mb-1.5">
              <Activity className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider font-athletic">
                Combat Sprint Velocity
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Explosive sprint mechanics, shuttle change-of-direction agility, and anaerobic power for high-stress tactical movement.
            </p>
          </div>

          <div className="p-4 bg-[#0e1217] border border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-emerald-400 mb-1.5">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider font-athletic">
                Auto-Overload Engine
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Data-driven progression (+2.5 to +10 lbs) calculated automatically from completed sets, reps, and RPE telemetry.
            </p>
          </div>

          <div className="p-4 bg-[#0e1217] border border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-amber-400 mb-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider font-athletic">
                Military PT Readiness
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              ACFT, PFT, and CFT physical readiness intervals, 2-mile run standards, and combat casualty drag work capacity.
            </p>
          </div>
        </div>

        {/* Coach Directive */}
        <div className="mt-8 text-center max-w-xl">
          <blockquote className="text-xs sm:text-sm text-zinc-400 italic">
            &ldquo;In combat, you don&apos;t rise to the occasion — you fall back to the level of your training. Build your combat chassis before deployment.&rdquo;
          </blockquote>
          <span className="text-[11px] font-bold text-amber-400 font-athletic uppercase tracking-wider block mt-1">
            — Coach Aryan Risner · The Tactical Standard
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 bg-[#0e1217] py-4 px-4 sm:px-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span className="text-zinc-200 font-bold uppercase tracking-wider">The Tactical Standard</span>
            <span className="text-zinc-700">·</span>
            <span className="text-amber-400 font-semibold">Tactical Readiness for the Modern Warfighter.</span>
            <span className="text-zinc-700 hidden sm:inline">·</span>
            <a
              href="https://50callabz.com/risner55"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 transition-colors font-bold inline-flex items-center gap-1"
              title="Official Supplement Partner: 50 Cal Labz (Code: TACTICALSTANDARD)"
            >
              <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>50 Cal Labz Partner (Code: TACTICALSTANDARD)</span>
            </a>
            <span className="text-zinc-700 hidden sm:inline">·</span>
            <a
              href="https://www.instagram.com/ajrisner"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-amber-400 transition-colors hidden sm:inline-flex items-center gap-1"
            >
              <Instagram className="w-3 h-3 text-amber-400" />
              <span>@ajrisner</span>
            </a>
          </div>

          <span className="text-zinc-500 font-mono text-[11px]">
            &copy; {new Date().getFullYear()} The Tactical Standard. All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};
