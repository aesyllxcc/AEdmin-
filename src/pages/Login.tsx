import React, { useState } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound,
  CheckCircle2,
  Building2,
  CreditCard,
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SUPER_ADMIN_EMAIL, SUPER_ADMIN_NAME } from '@/utils/workspaceManager';
import { RequestAccessModal } from '@/components/modals/RequestAccessModal';

export default function Login() {
  const { login, userAccounts } = useAuth();

  const [email, setEmail] = useState(SUPER_ADMIN_EMAIL);
  const [password, setPassword] = useState('AedminOwner2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Login failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAccount = (targetEmail: string, defaultPass: string) => {
    setEmail(targetEmail);
    setPassword(defaultPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between p-4 sm:p-8 font-sans antialiased text-[#18191D]">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#18191D] text-white flex items-center justify-center font-black text-lg tracking-wider shadow-sm">
            AE
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-[#18191D]">AEDMIN</h1>
            <p className="text-[11px] font-medium text-stone-500">Multi-Tenant Executive SaaS</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAccessModalOpen(true)}
            className="px-4 py-2 bg-white hover:bg-stone-50 border border-[#ECE6DD] rounded-full text-xs font-bold text-[#18191D] flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-stone-700" />
            <span>Pricing & Manual Payment</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-[#ECE6DD] text-xs font-semibold text-stone-600 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Isolated Multi-Tenant Vault</span>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-6">
        <div className="bg-white p-8 sm:p-10 rounded-[32px] border border-[#ECE6DD] shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          <div className="space-y-1.5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full text-[11px] font-bold text-stone-700 mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Private Workspace Login</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[#18191D]">
              Sign In to AEDMIN
            </h2>
            <p className="text-xs text-stone-500">
              Enter your credentials to enter your private isolated workspace.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@executivestudio.com"
                className="w-full text-xs font-semibold p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Password / Temporary Key
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#18191D] hover:bg-black text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'Verifying & Loading Workspace...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-4 border-t border-[#ECE6DD] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Quick Role & Workspace Switcher
              </span>
              <span className="text-[9px] text-stone-400 font-semibold">1-Click Test Login</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              
              {/* Ellysa (Super Admin) */}
              <button
                type="button"
                onClick={() => handleSelectAccount(SUPER_ADMIN_EMAIL, 'AedminOwner2026!')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  email === SUPER_ADMIN_EMAIL
                    ? 'bg-[#FAF8F5] border-black ring-1 ring-black'
                    : 'bg-white border-[#ECE6DD] hover:border-stone-400'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-900">{SUPER_ADMIN_NAME}</span>
                    <span className="px-2 py-0.5 bg-black text-white text-[9px] font-black rounded-full">
                      Owner & Super Admin
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">{SUPER_ADMIN_EMAIL}</p>
                </div>
                <div className="text-[10px] font-bold text-stone-400">
                  Master Workspace
                </div>
              </button>

              {/* Sarah Chen (Freelance Tenant with first-time password flow) */}
              <button
                type="button"
                onClick={() => handleSelectAccount('sarah.ops@freelance.studio', 'SarahChen2026!')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  email === 'sarah.ops@freelance.studio'
                    ? 'bg-[#FAF8F5] border-black ring-1 ring-black'
                    : 'bg-white border-[#ECE6DD] hover:border-stone-400'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-900">Sarah Chen</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full">
                      Freelance Tenant
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">sarah.ops@freelance.studio</p>
                </div>
                <div className="text-[10px] font-bold text-amber-700">
                  Isolated Workspace
                </div>
              </button>

            </div>
          </div>

          {/* Prospective User Callout */}
          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] text-center space-y-2">
            <p className="text-xs text-stone-600">
              Need your own isolated workspace?
            </p>
            <button
              type="button"
              onClick={() => setIsAccessModalOpen(true)}
              className="text-xs font-black text-[#18191D] hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <span>View Plans & Manual Payment Guide</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center py-4 text-[11px] text-stone-400 font-medium">
        Encrypted Salted SHA-256 Authentication • Strict Single-Tenant Data Isolation
      </div>

      {/* Request Access & Manual Payment Modal */}
      <RequestAccessModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
      />

    </div>
  );
}
