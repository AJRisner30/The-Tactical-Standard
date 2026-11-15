import React, { useState } from 'react';
import { 
  Mail, Send, Instagram, ExternalLink, Copy, Check, 
  ShieldCheck, Award, MessageSquare, Dumbbell, 
  Flame, CheckCircle2, User, ArrowRight, Shield
} from 'lucide-react';
import { TacticalStandardCompanyEmblem } from './BrandingLogos';

export const ContactTab: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [inquiryType, setInquiryType] = useState('coaching');
  const [senderName, setSenderName] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [trainingGoal, setTrainingGoal] = useState('Combat Strength & Tactical Stamina');

  const coachEmail = 'risnerathletics@gmail.com';
  const instagramUrl = 'https://www.instagram.com/ajrisner';
  const fiftyCalLabzUrl = 'https://50callabz.com/risner55';
  const discountCode = 'PATROLREADY';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(coachEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectMap: Record<string, string> = {
      coaching: '1-on-1 Military Tactical Coaching Inquiry',
      programming: 'Custom Tactical Programming & Protocol Question',
      form_check: 'Combat Movement & Lift Form Review',
      supplements: '50 Cal Labz Nutrition & Supplement Advice',
      general: 'Inquiry for The Tactical Standard',
    };

    const subject = encodeURIComponent(
      `[The Tactical Standard] ${subjectMap[inquiryType] || 'Coaching Inquiry'} - ${senderName || 'Warfighter'}`
    );

    const bodyText = `Hi Coach,

Name: ${senderName || 'Warfighter'}
Training Focus: ${trainingGoal}
Inquiry Type: ${subjectMap[inquiryType] || inquiryType}

Message:
${senderMessage || 'I would like to inquire about military tactical conditioning or coaching with The Tactical Standard.'}

---
Sent via The Tactical Standard (Tactical Readiness for the Modern Warfighter)`;

    const body = encodeURIComponent(bodyText);
    window.location.href = `mailto:${coachEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Header Card: The Tactical Standard & Coaching */}
      <div className="bg-[#0e1217] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#090b0d] border-2 border-amber-500/50 p-2 flex items-center justify-center shadow-lg overflow-hidden">
                <TacticalStandardCompanyEmblem size="md" />
              </div>
              <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider rounded-md shadow">
                TTS
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap text-xs text-zinc-400">
                <span className="font-bold tracking-wider uppercase text-amber-400">
                  The Tactical Standard
                </span>
                <span className="text-zinc-600" aria-hidden="true">·</span>
                <span className="font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Tactical Readiness for the Modern Warfighter
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white font-athletic uppercase tracking-wide">
                The Tactical <span className="text-amber-400">Standard</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl leading-relaxed">
                Military combat readiness, heavy ruck &amp; armor load durability, sprint velocity, and operational work capacity.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <a
              href={`mailto:${coachEmail}`}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
            >
              <Mail className="w-4 h-4" />
              <span>Email Coach AJ</span>
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#141a21] hover:bg-zinc-800 text-zinc-100 hover:text-white border border-zinc-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md whitespace-nowrap shrink-0"
            >
              <Instagram className="w-4 h-4 text-amber-400" />
              <span>Instagram: @ajrisner</span>
              <ExternalLink className="w-3 h-3 text-zinc-400 ml-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 3 Quick Highlight Cards: Email, Instagram, 50 Cal Labz Supplements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Email Card */}
        <div className="bg-[#0e1217] border border-zinc-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-3">
              <Mail className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Direct Contact</span>
            <h3 className="text-lg font-bold text-white mt-0.5">Email Coach AJ</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Have questions regarding programs, 1RM calculator, custom coaching, or training feedback? Send an email directly.
            </p>
            <div className="mt-3.5 p-2.5 bg-[#090b0d] rounded-xl border border-zinc-800 flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-zinc-200 truncate select-all">
                {coachEmail}
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Copy email to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-medium tabular-nums">Response: &lt;24 hours</span>
            <a
              href={`mailto:${coachEmail}`}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Open Mail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Instagram Card */}
        <div className="bg-[#0e1217] border border-zinc-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-3">
              <Instagram className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Social Media</span>
            <h3 className="text-lg font-bold text-white mt-0.5">Instagram: AJ Risner</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Follow Coach AJ Risner for daily workout execution, lifting tips, combat conditioning, and warfighter fitness insights.
            </p>
            <div className="mt-3.5 p-2.5 bg-[#090b0d] rounded-xl border border-zinc-800 flex items-center justify-between">
              <span className="font-mono text-xs text-white font-bold">@ajrisner</span>
              <span className="text-[11px] text-zinc-400 font-medium">AJ Risner</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-medium">Daily training updates</span>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 50 Cal Labz Supplement Link Card */}
        <div className="bg-[#0e1217] border border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all relative overflow-hidden">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-3">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Official Partner · Supplements</span>
            <h3 className="text-lg font-bold text-white mt-0.5">50 Cal Labz Supplements</h3>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              Fuel your tactical workouts with Coach AJ Risner&apos;s personal recommendations: <strong className="text-white">Strapped EAA</strong>, <strong className="text-white">ISO Ammo</strong>, and <strong className="text-white">Shots Fired Hybrid Stim Free Pre Workout</strong>.
            </p>
            <div className="mt-3.5 p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-300">Discount Code:</span>
                <span className="text-xs font-mono font-black bg-amber-500 text-black px-2 py-0.5 rounded shadow-sm">
                  {discountCode}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-400">
                50callabz.com/risner55
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-[11px] text-amber-400/90 font-medium">Combat Readiness Fuel</span>
            <a
              href={fiftyCalLabzUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Shop 50 Cal Labz</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Coaching & Message Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Direct Email Composer Form */}
        <div className="lg:col-span-7 bg-[#0e1217] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center gap-2.5 mb-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-athletic uppercase tracking-wide">
              Send an Inquiry Directly to Coach AJ
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Fill out the form below to construct and launch an email message directly to <strong className="text-zinc-200">risnerathletics@gmail.com</strong>.
          </p>

          <form onSubmit={handleSendEmail} className="space-y-4">
            {/* Inquiry Type Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                What are you inquiring about?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'coaching', label: '1-on-1 Hybrid Coaching', icon: Dumbbell },
                  { id: 'programming', label: 'Custom 12-Week Protocol', icon: ShieldCheck },
                  { id: 'form_check', label: 'Lift Form & Technique Check', icon: Award },
                  { id: 'supplements', label: '50 Cal Labz & Nutrition Advice', icon: Flame },
                  { id: 'general', label: 'General Athletic Inquiry', icon: User },
                ].map((item) => {
                  const isSelected = inquiryType === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setInquiryType(item.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm'
                          : 'bg-[#090b0d] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name & Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#090b0d] border border-zinc-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Primary Athletic Goal
                </label>
                <select
                  value={trainingGoal}
                  onChange={(e) => setTrainingGoal(e.target.value)}
                  className="w-full bg-[#090b0d] border border-zinc-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                >
                  <option value="Combat Strength & Tactical Stamina">Combat Strength &amp; Tactical Stamina</option>
                  <option value="Push-Up & Upper Body Density">Push-Up &amp; Upper Body Density</option>
                  <option value="Dumbbell Power & Hypertrophy">Dumbbell Power &amp; Hypertrophy</option>
                  <option value="Zone 2 Running & Aerobic Engine">Zone 2 Running &amp; Aerobic Engine</option>
                  <option value="Body Recomposition & Fat Loss">Body Recomposition &amp; Fat Loss</option>
                </select>
              </div>
            </div>

            {/* Message Textarea */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Message / Details
              </label>
              <textarea
                value={senderMessage}
                onChange={(e) => setSenderMessage(e.target.value)}
                rows={4}
                placeholder="Describe your current training background, injuries or constraints, or specific questions for Coach AJ..."
                className="w-full bg-[#090b0d] border border-zinc-800 focus:border-amber-500 rounded-xl p-3.5 text-xs text-white placeholder-zinc-600 outline-none transition-colors resize-none"
              />
            </div>

            {/* Send Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto flex-1 py-3 px-6 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Send Email to risnerathletics@gmail.com</span>
              </button>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full sm:w-auto py-3 px-4 bg-[#090b0d] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                <span>{copied ? 'Copied Email!' : 'Copy Email Address'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Coach Credentials & 50 Cal Labz Spotlight */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coach Standards Box */}
          <div className="bg-[#0e1217] border border-amber-500/30 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <TacticalStandardCompanyEmblem size="sm" />
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-athletic">
                  The Tactical Standard
                </h3>
                <span className="text-[11px] text-amber-400 font-semibold">Tactical Readiness for the Modern Warfighter.</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-300">
              {[
                'Military tactical physical conditioning & combat readiness',
                'ISSA Certified Fitness & Tactical Conditioning Specialist',
                'Body armor, combat kit & heavy ruck structural load adaptation',
                'Sprint velocity, anaerobic power, and sustained combat work capacity',
                'ACFT / PFT / CFT Military Physical Readiness preparation & benchmarks',
              ].map((point, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">Direct Inquiries:</span>
              <a
                href={`mailto:${coachEmail}`}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 underline font-mono"
              >
                {coachEmail}
              </a>
            </div>
          </div>

          {/* 50 Cal Labz Featured Recommendation Box */}
          <div className="bg-[#0e1217] border border-amber-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-athletic">
                  Official Supplement Sponsor
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                50 Cal Labz
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Coach AJ personally recommends 50 Cal Labz for operational readiness. Use discount code <span className="font-mono font-black text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/40">{discountCode}</span> at checkout for exclusive athlete savings:
            </p>

            <div className="mt-3 space-y-2 text-xs">
              <div className="p-2.5 bg-[#090b0d] rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Shots Fired Hybrid Stim Free Pre Workout</span>
                  <span className="text-[11px] text-zinc-400">Cellular pump, nitric oxide vasodilation &amp; laser endurance focus without caffeine or crash</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0 ml-2">Pre-Workout</span>
              </div>

              <div className="p-2.5 bg-[#090b0d] rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Strapped EAA</span>
                  <span className="text-[11px] text-zinc-400">Full-spectrum essential amino acid matrix to halt muscle breakdown &amp; sustain hydration</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0 ml-2">Intra / Field</span>
              </div>

              <div className="p-2.5 bg-[#090b0d] rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">ISO Ammo (Pure Whey Isolate)</span>
                  <span className="text-[11px] text-zinc-400">Ultra-pure, rapid-digesting whey protein isolate for lean muscle armor and recovery</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0 ml-2">Post-Workout</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800">
              <a
                href={fiftyCalLabzUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Shop 50 Cal Labz (Code: PATROLREADY)</span>
                <ExternalLink className="w-3.5 h-3.5 text-black" />
              </a>
              <span className="block text-center text-[10px] text-zinc-400 font-mono mt-1.5">
                Support Coach AJ via link: 50callabz.com/risner55 · Code: PATROLREADY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
