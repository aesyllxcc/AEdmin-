import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  User, 
  Globe, 
  DollarSign, 
  Key, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { evaluatePasswordStrength } from '@/utils/authUtils';
import { COMMON_TIMEZONES } from '@/utils/timezoneUtils';

export default function SetupWizard() {
  const { completeSetupWizard } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [studioName, setStudioName] = useState('AEDMIN Executive Studio');
  const [title, setTitle] = useState('Executive Assistant & Operations Lead');
  const [timezone, setTimezone] = useState('Asia/Manila');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [hourlyRate, setHourlyRate] = useState<number>(85);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Terms Agreement
  const [agreedSecurity, setAgreedSecurity] = useState(false);
  const [agreedConfidentiality, setAgreedConfidentiality] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordEval = evaluatePasswordStrength(password);

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!passwordEval.isValid) {
      setErrorMsg('Password does not meet minimum security strength requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleNextStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedSecurity || !agreedConfidentiality) {
      setErrorMsg('Please review and accept both security and confidentiality protocols.');
      return;
    }
    setErrorMsg('');
    setStep(4);
  };

  const handleFinalInitialize = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await completeSetupWizard({
        fullName,
        email,
        password,
        studioName,
        timezone,
        hourlyRate: Number(hourlyRate) || 85,
        baseCurrency
      });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Initialization failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between p-4 sm:p-8 font-sans antialiased text-[#18191D]">
      
      {/* Top Brand Bar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#18191D] text-white flex items-center justify-center font-black text-lg tracking-wider shadow-sm">
            AE
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-[#18191D]">AEDMIN</h1>
            <p className="text-[11px] font-medium text-stone-500">First-Time Setup & Security Provisioning</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#ECE6DD] shadow-2xs">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={`w-2 h-2 rounded-full transition-all ${
                s === step 
                  ? 'w-6 bg-[#18191D]' 
                  : s < step 
                  ? 'bg-emerald-500' 
                  : 'bg-stone-200'
              }`} 
            />
          ))}
          <span className="text-[11px] font-bold text-stone-600 ml-1.5">Step {step} of 4</span>
        </div>
      </div>

      {/* Main Wizard Box */}
      <div className="max-w-xl mx-auto w-full my-auto py-6">
        <div className="bg-white p-7 sm:p-10 rounded-[32px] border border-[#ECE6DD] shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: STUDIO IDENTITY */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 uppercase tracking-wider">
                  Step 1 • Studio & Profile Identity
                </span>
                <h2 className="text-2xl font-black text-[#18191D] pt-1">
                  Welcome to AEDMIN
                </h2>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Configure your primary executive profile. You will be initialized as the sole Super Admin and Owner of this workspace.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full text-xs font-semibold p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Executive Studio / Business Name
                  </label>
                  <input
                    type="text"
                    value={studioName}
                    onChange={e => setStudioName(e.target.value)}
                    placeholder="e.g. AEDMIN Executive Studio"
                    className="w-full text-xs p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Primary Operating Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={e => setTimezone(e.target.value)}
                      className="w-full text-xs font-semibold p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {COMMON_TIMEZONES.map(tz => (
                        <option key={tz.value} value={tz.value}>{tz.flag} {tz.label} ({tz.city})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Default Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={e => setHourlyRate(Number(e.target.value))}
                      min="10"
                      className="w-full text-xs font-semibold p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#18191D] hover:bg-black text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>Continue to Security Credentials</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: MASTER ADMIN CREDENTIALS */}
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 uppercase tracking-wider">
                  Step 2 • Super Admin Security Credentials
                </span>
                <h2 className="text-2xl font-black text-[#18191D] pt-1">
                  Create Master Admin Login
                </h2>
                <p className="text-xs text-stone-500 leading-relaxed">
                  As the workspace owner, you will be the only one with permission to provision secondary staff or contractor accounts.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Master Admin Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@yourexecutivestudio.com"
                    className="w-full text-xs font-semibold p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Master Password <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] font-bold text-stone-500 hover:text-black flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs font-semibold p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
                  />

                  {/* Password Strength Meter */}
                  {password && (
                    <div className="mt-2.5 space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-stone-600">Password Strength:</span>
                        <span className={`font-bold ${
                          passwordEval.score >= 3 ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {passwordEval.score === 4 ? 'Very Strong' : passwordEval.score === 3 ? 'Strong' : 'Weak'}
                        </span>
                      </div>
                      <div className="flex gap-1 h-1.5">
                        {[1, 2, 3, 4].map(bar => (
                          <div 
                            key={bar} 
                            className={`flex-1 rounded-full ${
                              bar <= passwordEval.score 
                                ? passwordEval.score >= 3 ? 'bg-emerald-500' : 'bg-amber-500'
                                : 'bg-stone-200'
                            }`} 
                          />
                        ))}
                      </div>
                      {passwordEval.feedback.length > 0 && (
                        <p className="text-[10px] text-stone-500">
                          Recommended: {passwordEval.feedback.join(' • ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Confirm Master Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs font-semibold p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-2xl text-xs font-bold text-stone-600 hover:bg-stone-100 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#18191D] hover:bg-black text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>Review Governance</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SECURITY & GOVERNANCE POLICIES */}
          {step === 3 && (
            <form onSubmit={handleNextStep3} className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 uppercase tracking-wider">
                  Step 3 • Security & Access Control Policy
                </span>
                <h2 className="text-2xl font-black text-[#18191D] pt-1">
                  Workspace Governance
                </h2>
                <p className="text-xs text-stone-500 leading-relaxed">
                  AEDMIN operates with client data isolation, role-based permissions, and automatic brute-force lockout safeguards.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div 
                  onClick={() => setAgreedSecurity(!agreedSecurity)}
                  className="p-4 rounded-2xl border border-[#ECE6DD] hover:border-black/30 cursor-pointer bg-[#FAF8F5] flex items-start gap-3 transition-colors"
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    agreedSecurity ? 'bg-[#18191D] text-white' : 'border border-stone-300 bg-white'
                  }`}>
                    {agreedSecurity && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#18191D]">
                      Master Administrator Access Rule
                    </h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      I understand that as Owner, only I can provision credentials for assistant or contractor accounts, and master credentials are never displayed publicly.
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => setAgreedConfidentiality(!agreedConfidentiality)}
                  className="p-4 rounded-2xl border border-[#ECE6DD] hover:border-black/30 cursor-pointer bg-[#FAF8F5] flex items-start gap-3 transition-colors"
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    agreedConfidentiality ? 'bg-[#18191D] text-white' : 'border border-stone-300 bg-white'
                  }`}>
                    {agreedConfidentiality && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#18191D]">
                      Client Confidentiality & Local Vault Encryption
                    </h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      All client executive briefs, rate structures, meeting transcripts, and Drive audits are strictly contained within your encrypted local environment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 rounded-2xl text-xs font-bold text-stone-600 hover:bg-stone-100 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#18191D] hover:bg-black text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>Verify Configuration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: VERIFICATION & INITIALIZE */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase tracking-wider">
                  Step 4 • Final Confirmation
                </span>
                <h2 className="text-2xl font-black text-[#18191D] pt-1">
                  Ready to Launch AEDMIN
                </h2>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Review your setup parameters before cryptographic vault initialization.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DD]">
                  <span className="text-xs text-stone-500 font-medium">Super Admin:</span>
                  <span className="text-xs font-bold text-[#18191D]">{fullName}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DD]">
                  <span className="text-xs text-stone-500 font-medium">Login Email:</span>
                  <span className="text-xs font-bold text-[#18191D]">{email}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DD]">
                  <span className="text-xs text-stone-500 font-medium">Studio Name:</span>
                  <span className="text-xs font-bold text-[#18191D]">{studioName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-500 font-medium">Operating Timezone:</span>
                  <span className="text-xs font-bold text-[#18191D]">{timezone}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={isSubmitting}
                  className="px-5 py-3 rounded-2xl text-xs font-bold text-stone-600 hover:bg-stone-100 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalInitialize}
                  disabled={isSubmitting}
                  className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Initializing Vault...' : 'Launch AEDMIN Workspace'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer info */}
      <div className="max-w-4xl mx-auto w-full text-center py-4 text-[11px] text-stone-400 font-medium">
        AEDMIN Executive Operating System • Role-Based Access Control • Salted SHA-256 Vault
      </div>

    </div>
  );
}
