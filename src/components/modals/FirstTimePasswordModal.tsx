import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Globe, 
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { evaluatePasswordStrength } from '@/utils/authUtils';
import { COMMON_TIMEZONES } from '@/utils/timezoneUtils';

export function FirstTimePasswordModal() {
  const { currentUser, updatePasswordForCurrentUser } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [studioName, setStudioName] = useState(currentUser?.businessName || `${currentUser?.fullName || 'Freelancer'} Executive Studio`);
  const [timezone, setTimezone] = useState(currentUser?.timezone || 'Asia/Manila');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // If user does not require password change, do not render
  if (!currentUser || !currentUser.mustChangePassword) {
    return null;
  }

  const passwordEval = evaluatePasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setErrorMsg('Please enter a new password.');
      return;
    }
    if (!passwordEval.isValid) {
      setErrorMsg('Password does not meet minimum security requirements (at least 8 chars, mixed case, numbers or symbols).');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }
    if (!studioName.trim()) {
      setErrorMsg('Please enter your workspace or studio name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await updatePasswordForCurrentUser(newPassword, {
        businessName: studioName.trim(),
        timezone
      });
      if (res.success) {
        setSuccess(true);
      } else {
        setErrorMsg(res.message || 'Failed to update credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white max-w-lg w-full rounded-[32px] border border-[#ECE6DD] shadow-2xl p-6 sm:p-8 space-y-6 text-[#18191D]">
        
        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-900 text-xs font-bold">
            <KeyRound className="w-3.5 h-3.5 text-amber-700" />
            <span>Mandatory First-Time Security Verification</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#18191D]">
            Welcome to AEDMIN OS, {currentUser.fullName}!
          </h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            Your account was provisioned with temporary credentials. Please create your permanent password and configure your private workspace to activate your session.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Workspace Studio Name */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-stone-500" />
              <span>Your Workspace / Studio Name</span>
            </label>
            <input
              type="text"
              required
              value={studioName}
              onChange={e => setStudioName(e.target.value)}
              placeholder="e.g., Sarah Chen Executive Services"
              className="w-full text-xs font-semibold p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <span>Primary Operating Timezone</span>
            </label>
            <select
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="w-full text-xs font-semibold p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
            >
              {COMMON_TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>
                  {tz.label} ({tz.city})
                </option>
              ))}
            </select>
          </div>

          {/* New Permanent Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-stone-500" />
                <span>New Permanent Password</span>
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
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Min. 8 chars, uppercase, lowercase, numbers"
              className="w-full text-xs font-semibold p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
            />

            {/* Password Strength Meter */}
            {newPassword && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-stone-500">Security Strength:</span>
                  <span className={passwordEval.isValid ? "text-emerald-600" : "text-amber-600"}>
                    {passwordEval.score <= 1 ? "Weak" : passwordEval.score === 2 ? "Moderate" : "Strong"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full flex-1 rounded-full ${passwordEval.score >= 1 ? 'bg-amber-500' : 'bg-stone-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${passwordEval.score >= 2 ? 'bg-amber-500' : 'bg-stone-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${passwordEval.score >= 3 ? 'bg-emerald-500' : 'bg-stone-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${passwordEval.score >= 4 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Confirm New Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new permanent password"
              className="w-full text-xs font-semibold p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !passwordEval.isValid || newPassword !== confirmPassword}
            className="w-full py-4 bg-[#18191D] hover:bg-black text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Encrypting & Initializing Workspace...</span>
            ) : (
              <>
                <span>Save Password & Launch Private Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[10px] text-stone-400 font-medium">
          Multi-Tenant Isolated Vault • Zero Shared Cross-Tenant Records
        </div>

      </div>
    </div>
  );
}
