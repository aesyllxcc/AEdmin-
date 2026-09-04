import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  CheckCircle2, 
  ShieldCheck,
  Send,
  Building2,
  User,
  MessageSquare
} from 'lucide-react';
import { getPlatformSettings, addAccessRequest } from '@/utils/workspaceManager';

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequestAccessModal({ isOpen, onClose }: RequestAccessModalProps) {
  const platformSettings = getPlatformSettings();

  // Contact Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [notes, setNotes] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const copyEmail = () => {
    navigator.clipboard.writeText('hello.aespace@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      alert('Please provide your name and email address.');
      return;
    }

    // Save to persistent access request queue for Super Admin dashboard
    addAccessRequest({
      fullName: fullName.trim(),
      email: email.trim(),
      businessName: businessName.trim() || `${fullName} Workspace`,
      notes: notes.trim() || 'Direct workspace access inquiry'
    });

    const subject = encodeURIComponent(`[AEDMIN Workspace Access Request] ${fullName}`);
    const body = encodeURIComponent(
      `Hi Ellysa,\n\nI would like to request an isolated workspace on AEDMIN OS.\n\n` +
      `👤 Full Name: ${fullName}\n` +
      `📧 Email: ${email}\n` +
      `🏢 Studio / Business: ${businessName || 'Independent Specialist'}\n` +
      `💬 Requirements / Note: ${notes || 'Please provide direct payment and onboarding instructions.'}\n\n` +
      `Looking forward to hearing from you with direct onboarding details.\n\nThank you!`
    );

    window.open(`mailto:hello.aespace@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white max-w-xl w-full rounded-[32px] border border-[#ECE6DD] shadow-2xl p-6 sm:p-8 space-y-6 text-[#18191D] my-8">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#ECE6DD] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-xs font-bold text-stone-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-stone-900" />
              <span>Direct Platform Onboarding</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[#18191D]">
              Request Workspace Access
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Connect directly with <strong>Ellysa May M. Del Prado</strong> for private account setup.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-900">Request Dispatched!</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                Your request has been submitted to the admin queue. Ellysa will review your inquiry and contact you directly at <strong className="text-stone-900">{email}</strong> with your setup details and credentials.
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] text-xs text-stone-600 flex items-center justify-between gap-3 max-w-md mx-auto">
              <span className="truncate font-mono">hello.aespace@gmail.com</span>
              <button
                type="button"
                onClick={copyEmail}
                className="px-3 py-1.5 bg-white border border-[#ECE6DD] rounded-xl font-bold text-stone-900 hover:bg-stone-100 flex items-center gap-1.5 shrink-0"
              >
                {copiedEmail ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
              </button>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-3 bg-[#18191D] hover:bg-black text-white text-xs font-bold rounded-2xl shadow-md cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Direct Contact Card */}
            <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#18191D] text-white flex items-center justify-center font-bold text-xs">
                    EM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Ellysa May M. Del Prado</h4>
                    <p className="text-[11px] text-stone-500">Platform Owner & Executive Consultant</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={copyEmail}
                  className="px-3 py-1.5 bg-white border border-[#ECE6DD] hover:border-stone-400 rounded-xl text-[11px] font-bold text-stone-700 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  {copiedEmail ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEmail ? 'Copied Email' : 'Copy Email'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-stone-700 bg-white p-2.5 rounded-xl border border-[#ECE6DD]">
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="font-semibold select-all">hello.aespace@gmail.com</span>
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed">
                Workspaces are private and individually configured. To request an isolated account, submit your information below or email Ellysa directly to discuss setup, direct payment arrangements, and custom workspace needs.
              </p>
            </div>

            {/* Inbound Request Form */}
            <form onSubmit={handleSendRequest} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Santos"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      required
                      placeholder="jane@studio.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Business / Studio Name (Optional)
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="e.g. Apex Virtual Operations"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Workspace Requirements / Message
                </label>
                <div className="relative">
                  <MessageSquare className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                  <textarea
                    rows={3}
                    placeholder="Tell Ellysa about your client workload, required tools, or questions..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#18191D] hover:bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Request to Ellysa</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
