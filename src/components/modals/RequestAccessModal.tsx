import React, { useState } from 'react';
import { 
  X, 
  Check, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  CheckCircle2, 
  ShieldCheck,
  Send,
  Zap,
  Globe
} from 'lucide-react';
import { getPlatformSettings } from '@/utils/workspaceManager';
import { TenantPlanTier, ManualPaymentMethod } from '@/types/saas';

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planId: TenantPlanTier) => void;
}

export function RequestAccessModal({ isOpen, onClose }: RequestAccessModalProps) {
  const platformSettings = getPlatformSettings();
  const [currency, setCurrency] = useState<'USD' | 'PHP'>('USD');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<TenantPlanTier>('pro_executive');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<ManualPaymentMethod>('gcash');

  // Contact / Verification Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSendPaymentEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !referenceNumber) {
      alert('Please fill in your name, email, and payment reference number.');
      return;
    }

    const currentPlan = platformSettings.plans.find(p => p.id === selectedPlan);
    const amount = currency === 'USD' 
      ? (billingCycle === 'annual' ? Math.round(currentPlan!.monthlyPriceUSD * 0.8 * 12) : currentPlan!.monthlyPriceUSD)
      : (billingCycle === 'annual' ? Math.round(currentPlan!.monthlyPricePHP * 0.8 * 12) : currentPlan!.monthlyPricePHP);

    const subject = encodeURIComponent(`[AEDMIN Access Request] ${fullName} - ${currentPlan?.name} (${currency} ${amount})`);
    const body = encodeURIComponent(
      `Hi Ellysa,\n\nI have completed my manual payment for AEDMIN OS.\n\n` +
      `👤 Full Name: ${fullName}\n` +
      `📧 Account Email: ${email}\n` +
      `🏢 Studio / Business Name: ${businessName || 'Independent Freelancer'}\n` +
      `📦 Selected Plan: ${currentPlan?.name} (${billingCycle})\n` +
      `💳 Payment Method: ${selectedPaymentMethod.toUpperCase()}\n` +
      `🔢 Transaction Reference Number: ${referenceNumber}\n` +
      `💵 Amount Paid: ${currency} ${amount}\n` +
      `📝 Additional Notes: ${notes || 'None'}\n\n` +
      `Please verify my payment and issue my temporary login credentials.\n\nThank you!`
    );

    window.open(`mailto:${platformSettings.ownerEmail}?subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white max-w-4xl w-full rounded-[32px] border border-[#ECE6DD] shadow-2xl p-6 sm:p-8 space-y-8 text-[#18191D] my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#ECE6DD] pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-xs font-bold text-stone-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-stone-900" />
              <span>Multi-Tenant Executive SaaS Platform</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#18191D]">
              Subscribe to AEDMIN OS
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Private, isolated workspaces for Executive Assistants, Freelancers, and Service Studios.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Currency & Billing Cycle Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FAF8F5] p-3 rounded-2xl border border-[#ECE6DD]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">Currency:</span>
            <div className="inline-flex bg-white p-1 rounded-xl border border-[#ECE6DD] text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-lg transition-all ${currency === 'USD' ? 'bg-[#18191D] text-white shadow-xs' : 'text-stone-600 hover:text-black'}`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('PHP')}
                className={`px-3 py-1 rounded-lg transition-all ${currency === 'PHP' ? 'bg-[#18191D] text-white shadow-xs' : 'text-stone-600 hover:text-black'}`}
              >
                PHP (₱)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">Billing:</span>
            <div className="inline-flex bg-white p-1 rounded-xl border border-[#ECE6DD] text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1 rounded-lg transition-all ${billingCycle === 'monthly' ? 'bg-[#18191D] text-white shadow-xs' : 'text-stone-600 hover:text-black'}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1 rounded-lg transition-all ${billingCycle === 'annual' ? 'bg-[#18191D] text-white shadow-xs' : 'text-stone-600 hover:text-black'}`}
              >
                Annual <span className="text-[9px] text-emerald-600 font-extrabold ml-1">Save 20-30%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platformSettings.plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const price = currency === 'USD' 
              ? (billingCycle === 'annual' ? Math.round(plan.monthlyPriceUSD * (1 - plan.annualDiscountPercent / 100)) : plan.monthlyPriceUSD)
              : (billingCycle === 'annual' ? Math.round(plan.monthlyPricePHP * (1 - plan.annualDiscountPercent / 100)) : plan.monthlyPricePHP);

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative rounded-3xl p-5 sm:p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'border-[#18191D] bg-[#FAF8F5] shadow-lg ring-2 ring-black/10' 
                    : 'border-[#ECE6DD] bg-white hover:border-stone-400'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-200/80 text-stone-800">
                      {plan.badge}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#18191D] text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[#18191D]">{plan.name}</h3>
                    <p className="text-[11px] text-stone-500 mt-1 leading-snug">{plan.description}</p>
                  </div>

                  <div className="pt-2 border-t border-[#ECE6DD]/60">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black tracking-tight text-[#18191D]">
                        {currency === 'USD' ? '$' : '₱'}{price.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-stone-500">/ month</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                        Billed annually ({plan.annualDiscountPercent}% savings)
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-2 text-xs">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-stone-700 text-[11px] leading-tight">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#ECE6DD]/60">
                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      isSelected ? 'bg-[#18191D] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>{isSelected ? 'Selected Plan' : 'Select Plan'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step-by-Step Manual Payment Instructions */}
        <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#ECE6DD] space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#18191D] text-white flex items-center justify-center text-xs font-black">
              2
            </div>
            <div>
              <h3 className="text-base font-black text-[#18191D]">
                Manual Payment Instructions (Verified by Owner)
              </h3>
              <p className="text-xs text-stone-500">
                Choose your preferred payment method and transfer the exact subscription amount.
              </p>
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedPaymentMethod('gcash')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                selectedPaymentMethod === 'gcash'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-stone-700 border-[#ECE6DD] hover:bg-stone-50'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>GCash (PH)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPaymentMethod('maya')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                selectedPaymentMethod === 'maya'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-stone-700 border-[#ECE6DD] hover:bg-stone-50'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Maya (PH)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPaymentMethod('bank_transfer')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                selectedPaymentMethod === 'bank_transfer'
                  ? 'bg-[#18191D] text-white border-black shadow-xs'
                  : 'bg-white text-stone-700 border-[#ECE6DD] hover:bg-stone-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Bank Transfer (BDO)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPaymentMethod('paypal')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                selectedPaymentMethod === 'paypal'
                  ? 'bg-[#003087] text-white border-[#003087] shadow-xs'
                  : 'bg-white text-stone-700 border-[#ECE6DD] hover:bg-stone-50'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>PayPal (USD)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPaymentMethod('wise')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                selectedPaymentMethod === 'wise'
                  ? 'bg-[#2ed06e] text-[#18191D] border-[#2ed06e] shadow-xs'
                  : 'bg-white text-stone-700 border-[#ECE6DD] hover:bg-stone-50'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Wise (Multi-Currency)</span>
            </button>
          </div>

          {/* Active Payment Method Details Box */}
          <div className="bg-white p-5 rounded-2xl border border-[#ECE6DD] space-y-4">
            {selectedPaymentMethod === 'gcash' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Account Name</span>
                    <p className="text-sm font-black text-[#18191D]">{platformSettings.manualPaymentInstructions.gcash.accountName}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FAF8F5] px-3.5 py-1.5 rounded-xl border border-[#ECE6DD]">
                    <span className="text-sm font-mono font-black text-[#18191D]">{platformSettings.manualPaymentInstructions.gcash.accountNumber}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(platformSettings.manualPaymentInstructions.gcash.accountNumber, 'gcash')}
                      className="text-stone-500 hover:text-black"
                    >
                      {copiedField === 'gcash' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {platformSettings.manualPaymentInstructions.gcash.instructions}
                </p>
              </div>
            )}

            {selectedPaymentMethod === 'maya' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Account Name</span>
                    <p className="text-sm font-black text-[#18191D]">{platformSettings.manualPaymentInstructions.maya.accountName}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FAF8F5] px-3.5 py-1.5 rounded-xl border border-[#ECE6DD]">
                    <span className="text-sm font-mono font-black text-[#18191D]">{platformSettings.manualPaymentInstructions.maya.accountNumber}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(platformSettings.manualPaymentInstructions.maya.accountNumber, 'maya')}
                      className="text-stone-500 hover:text-black"
                    >
                      {copiedField === 'maya' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {platformSettings.manualPaymentInstructions.maya.instructions}
                </p>
              </div>
            )}

            {selectedPaymentMethod === 'bank_transfer' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Bank</span>
                    <p className="text-sm font-black text-[#18191D]">{platformSettings.manualPaymentInstructions.bankTransfer.bankName}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Account Name</span>
                    <p className="text-sm font-black text-[#18191D]">{platformSettings.manualPaymentInstructions.bankTransfer.accountName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-[#FAF8F5] p-3 rounded-xl border border-[#ECE6DD]">
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase">Account Number</span>
                    <p className="text-sm font-mono font-black text-[#18191D]">{platformSettings.manualPaymentInstructions.bankTransfer.accountNumber}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(platformSettings.manualPaymentInstructions.bankTransfer.accountNumber, 'bdo')}
                    className="px-3 py-1.5 bg-white border border-[#ECE6DD] rounded-lg text-xs font-bold text-stone-700 flex items-center gap-1 hover:bg-stone-50"
                  >
                    {copiedField === 'bdo' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'bdo' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {platformSettings.manualPaymentInstructions.bankTransfer.instructions}
                </p>
              </div>
            )}

            {selectedPaymentMethod === 'paypal' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">PayPal Recipient</span>
                    <p className="text-sm font-black text-[#18191D]">{platformSettings.manualPaymentInstructions.paypal.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(platformSettings.manualPaymentInstructions.paypal.email, 'paypal')}
                    className="px-3 py-1.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl text-xs font-bold text-stone-700 flex items-center gap-1 hover:bg-stone-100"
                  >
                    {copiedField === 'paypal' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'paypal' ? 'Copied' : 'Copy Email'}</span>
                  </button>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {platformSettings.manualPaymentInstructions.paypal.instructions}
                </p>
              </div>
            )}

            {selectedPaymentMethod === 'wise' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Wise Account Email</span>
                    <p className="text-sm font-black text-[#18191D]">{platformSettings.manualPaymentInstructions.wise.emailOrTag}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(platformSettings.manualPaymentInstructions.wise.emailOrTag, 'wise')}
                    className="px-3 py-1.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl text-xs font-bold text-stone-700 flex items-center gap-1 hover:bg-stone-100"
                  >
                    {copiedField === 'wise' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'wise' ? 'Copied' : 'Copy Email'}</span>
                  </button>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {platformSettings.manualPaymentInstructions.wise.instructions}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Submit Verification & Request Credentials Form */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#18191D] text-white flex items-center justify-center text-xs font-black">
              3
            </div>
            <div>
              <h3 className="text-base font-black text-[#18191D]">
                Submit Payment Reference to Ellysa May M. Del Prado
              </h3>
              <p className="text-xs text-stone-500">
                After completing your payment, enter your reference number below to notify the Owner.
              </p>
            </div>
          </div>

          <form onSubmit={handleSendPaymentEmail} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g., Sarah Jenkins"
                className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Your Email Address (For Credentials) *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="sarah@executiveops.com"
                className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Studio / Business Name (Optional)
              </label>
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="Sarah Jenkins Executive Support"
                className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Payment Reference Number *
              </label>
              <input
                type="text"
                required
                value={referenceNumber}
                onChange={e => setReferenceNumber(e.target.value)}
                placeholder="e.g., GCASH-9821049281 or Bank Ref"
                className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Additional Notes / Requests (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Preferred timezone, custom onboarding questions, or urgent start date"
                className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-[#18191D] hover:bg-black text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Verification & Email Ellysa Directly</span>
              </button>
            </div>
          </form>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-900 text-xs animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Access Request Prepared!</p>
                <p className="mt-0.5 text-emerald-700">
                  Your email client should have opened with the pre-formatted payment verification details. Ellysa will verify your transaction and provision your isolated workspace with temporary credentials within 1-2 hours.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-[#ECE6DD]">
            <span>Direct Support: <a href="mailto:hello.aespace@gmail.com" className="font-bold text-black underline">hello.aespace@gmail.com</a></span>
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Isolated Data Guarantee
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
