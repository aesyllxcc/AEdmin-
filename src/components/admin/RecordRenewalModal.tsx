import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';
import { TenantWorkspace, ManualPaymentMethod, PlatformSettings } from '@/types/saas';

interface RecordRenewalModalProps {
  workspace: TenantWorkspace | null;
  platformSettings: PlatformSettings;
  onClose: () => void;
  onConfirmRenewal: (paymentData: {
    tenantId: string;
    amount: number;
    currency: 'USD' | 'PHP';
    paymentMethod: ManualPaymentMethod;
    referenceNumber: string;
    billingPeriod: 'monthly' | 'annual';
    validMonths: number;
    notes?: string;
  }) => void;
}

export function RecordRenewalModal({
  workspace,
  platformSettings,
  onClose,
  onConfirmRenewal
}: RecordRenewalModalProps) {
  if (!workspace) return null;

  const currentPlan = platformSettings.plans.find(p => p.id === workspace.plan);

  const [currency, setCurrency] = useState<'USD' | 'PHP'>('PHP');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [validMonths, setValidMonths] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<ManualPaymentMethod>('gcash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Default calculation
  const defaultAmount = currency === 'PHP'
    ? (billingPeriod === 'annual' ? (currentPlan?.monthlyPricePHP || 3990) * 0.8 * 12 : (currentPlan?.monthlyPricePHP || 3990) * validMonths)
    : (billingPeriod === 'annual' ? (currentPlan?.monthlyPriceUSD || 79) * 0.8 * 12 : (currentPlan?.monthlyPriceUSD || 79) * validMonths);

  const [amount, setAmount] = useState<number>(defaultAmount);

  // Update amount automatically when period / months change
  const handlePeriodChange = (period: 'monthly' | 'annual') => {
    setBillingPeriod(period);
    const months = period === 'annual' ? 12 : 1;
    setValidMonths(months);
    const calc = currency === 'PHP'
      ? (period === 'annual' ? (currentPlan?.monthlyPricePHP || 3990) * 0.8 * 12 : (currentPlan?.monthlyPricePHP || 3990) * months)
      : (period === 'annual' ? (currentPlan?.monthlyPriceUSD || 79) * 0.8 * 12 : (currentPlan?.monthlyPriceUSD || 79) * months);
    setAmount(Math.round(calc));
  };

  const handleCurrencyChange = (newCurr: 'USD' | 'PHP') => {
    setCurrency(newCurr);
    const calc = newCurr === 'PHP'
      ? (billingPeriod === 'annual' ? (currentPlan?.monthlyPricePHP || 3990) * 0.8 * 12 : (currentPlan?.monthlyPricePHP || 3990) * validMonths)
      : (billingPeriod === 'annual' ? (currentPlan?.monthlyPriceUSD || 79) * 0.8 * 12 : (currentPlan?.monthlyPriceUSD || 79) * validMonths);
    setAmount(Math.round(calc));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber) {
      alert('Please enter a payment reference number.');
      return;
    }

    onConfirmRenewal({
      tenantId: workspace.id,
      amount,
      currency,
      paymentMethod,
      referenceNumber,
      billingPeriod,
      validMonths,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white max-w-xl w-full rounded-[32px] border border-[#ECE6DD] shadow-2xl p-6 sm:p-8 space-y-6 text-[#18191D] my-8">
        
        <div className="flex items-start justify-between border-b border-[#ECE6DD] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900">Record Manual Payment Renewal</h2>
              <p className="text-xs text-stone-500">Extending subscription for <strong className="text-stone-900">{workspace.name}</strong></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Billing Cycle</label>
              <select
                value={billingPeriod}
                onChange={(e) => handlePeriodChange(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual (12 Months · 20% Discount)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Duration (Months)</label>
              <input
                type="number"
                min="1"
                max="36"
                value={validMonths}
                onChange={(e) => {
                  const m = Number(e.target.value) || 1;
                  setValidMonths(m);
                  if (billingPeriod === 'monthly') {
                    const unit = currency === 'PHP' ? (currentPlan?.monthlyPricePHP || 3990) : (currentPlan?.monthlyPriceUSD || 79);
                    setAmount(unit * m);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
              >
                <option value="PHP">PHP (₱)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Verified Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-bold text-stone-900 focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
              >
                <option value="gcash">GCash (Philippines)</option>
                <option value="maya">Maya (Philippines)</option>
                <option value="bank_transfer">Bank Transfer (BDO / Local)</option>
                <option value="paypal">PayPal</option>
                <option value="wise">Wise Multi-Currency</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Transaction / Reference #</label>
              <input
                type="text"
                placeholder="e.g. GCASH-98214912"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-mono uppercase focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Verification Notes</label>
            <input
              type="text"
              placeholder="e.g. Verified payment receipt screenshot sent via email"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#ECE6DD]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <span>Confirm & Extend Subscription</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
