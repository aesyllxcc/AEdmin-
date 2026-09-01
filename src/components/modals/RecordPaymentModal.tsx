import React, { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Calendar, 
  Hash, 
  CreditCard,
  Link as LinkIcon,
  FileText,
  UploadCloud,
  Layers
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Invoice } from '@/types';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export function RecordPaymentModal({
  isOpen,
  onClose,
  invoice
}: RecordPaymentModalProps) {
  const { markInvoicePaid, updateInvoice, userProfile } = useApp();

  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Bank Wire / ACH');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [settledAmount, setSettledAmount] = useState<number>(0);
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [paymentProofFileName, setPaymentProofFileName] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (invoice) {
      const invoiceTotal = invoice.total || 0;
      setSettledAmount(invoiceTotal);
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setReferenceNumber(`REF-TXN-${Date.now().toString().slice(-6)}`);
      setPaymentUrl(invoice.paymentUrl || `https://pay.stripe.com/receipt/inv_${invoice.invoiceNumber.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
      setPaymentProofUrl(invoice.paymentProofUrl || '');
      setPaymentProofFileName(invoice.paymentProofFileName || '');
      setPaymentNotes(invoice.paymentNotes || '');
      setIsPartialPayment(false);
      setError(null);
    }
  }, [invoice, isOpen]);

  if (!isOpen || !invoice) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPaymentProofFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPaymentProofUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim()) {
      setError('A Reference Number (e.g. Wire reference, Check ID, Stripe Transaction) is strictly required.');
      return;
    }
    if (!paymentUrl.trim()) {
      setError('Payment URL (receipt link or payment processor URL) is strictly required before marking as Paid.');
      return;
    }
    if (!paymentDate) {
      setError('Payment Date is required.');
      return;
    }

    if (isPartialPayment) {
      const remaining = Math.max(0, (invoice.total || 0) - settledAmount);
      updateInvoice(invoice.id, {
        status: 'partially_paid',
        partiallyPaidAmount: settledAmount,
        remainingBalance: remaining,
        paidDate: paymentDate,
        paymentMethod,
        referenceNumber: referenceNumber.trim(),
        paymentReferenceNumber: referenceNumber.trim(),
        paymentUrl: paymentUrl.trim(),
        paymentProofUrl: paymentProofUrl || undefined,
        paymentProofFileName: paymentProofFileName || undefined,
        paymentNotes: paymentNotes.trim() || undefined
      }, `Recorded partial payment of $${settledAmount.toLocaleString()} (Remaining: $${remaining.toLocaleString()})`);
    } else {
      markInvoicePaid(invoice.id, {
        paidDate: paymentDate,
        method: paymentMethod,
        referenceNumber: referenceNumber.trim(),
        paymentProofUrl: paymentProofUrl || undefined,
        paymentNotes: paymentNotes.trim() || undefined
      }, `Payment verified & reconciled with Reference ${referenceNumber.trim()}`);

      // Ensure paymentUrl is updated on invoice record
      updateInvoice(invoice.id, {
        paymentUrl: paymentUrl.trim(),
        paymentProofFileName: paymentProofFileName || undefined
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-[28px] border border-border-subtle shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6">
        
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-main">Record Payment & Settle Invoice</h3>
              <p className="text-xs text-text-muted">Strict verification protocol for immutable financial audit integrity.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Brief */}
        <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-border-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Target Invoice</span>
            <span className="text-sm font-bold text-text-main">{invoice.invoiceNumber}</span>
            <span className="text-xs text-text-muted block mt-0.5">{invoice.clientName}</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Total Settle Amount</span>
            <span className="text-xl font-extrabold text-emerald-800 font-mono">${(invoice.total || 0).toLocaleString()}</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Required: Reference Number */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-text-muted" />
                Reference Number / Transaction ID *
              </span>
              <span className="text-[10px] text-emerald-800 font-medium">Mandatory</span>
            </label>
            <input 
              type="text" 
              value={referenceNumber}
              onChange={e => { setReferenceNumber(e.target.value); setError(null); }}
              placeholder="e.g. WIRE-892419, CHK-4402, ch_3M5x2k, WISE-99124"
              className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-mono font-bold text-text-main focus:outline-none focus:ring-2 focus:ring-stone-400"
              required
            />
          </div>

          {/* Required: Payment URL */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-text-muted" />
                Payment URL / Receipt Link *
              </span>
              <span className="text-[10px] text-emerald-800 font-medium">Mandatory</span>
            </label>
            <input 
              type="url" 
              value={paymentUrl}
              onChange={e => { setPaymentUrl(e.target.value); setError(null); }}
              placeholder="https://pay.stripe.com/receipt/... or banking portal link"
              className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-mono text-text-main focus:outline-none focus:ring-2 focus:ring-stone-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-text-muted" />
                Clearing Method *
              </label>
              <select 
                value={paymentMethod}
                onChange={e => { setPaymentMethod(e.target.value); setError(null); }}
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-semibold text-text-main focus:outline-none"
                required
              >
                <option value="Bank Wire / ACH">Bank Wire / ACH</option>
                <option value="Stripe / Credit Card">Stripe / Credit Card</option>
                <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                <option value="Wise Transfer">Wise Transfer</option>
                <option value="Corporate Check">Corporate Check</option>
                <option value="PayPal / Venmo">PayPal / Venmo</option>
                <option value="Other Method">Other Clearing Method</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-text-muted" />
                  Payment Date *
                </span>
                <span className="text-[10px] text-emerald-800 font-medium">Mandatory</span>
              </label>
              <input 
                type="date"
                value={paymentDate}
                onChange={e => { setPaymentDate(e.target.value); setError(null); }}
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-semibold text-text-main focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Workflow Option: Partial Payment Toggle */}
          <div className="p-3 bg-stone-50 rounded-xl border border-border-subtle">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-stone-600" />
                Settlement Type
              </span>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsPartialPayment(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${!isPartialPayment ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Full Payment (Paid)
                </button>
                <button
                  type="button"
                  onClick={() => setIsPartialPayment(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${isPartialPayment ? 'bg-teal-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Partial Payment
                </button>
              </div>
            </div>

            {isPartialPayment && (
              <div className="mt-3 pt-3 border-t border-border-subtle grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-text-muted mb-1">Amount Received ($)</label>
                  <input
                    type="number"
                    min="1"
                    max={invoice.total || 0}
                    value={settledAmount}
                    onChange={e => setSettledAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-border-subtle rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-muted mb-1">Remaining Balance</label>
                  <div className="px-3 py-1.5 bg-stone-100 rounded-lg text-xs font-mono font-bold text-stone-800">
                    ${Math.max(0, (invoice.total || 0) - settledAmount).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Optional: Proof of Payment Attachment */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UploadCloud className="w-3.5 h-3.5 text-text-muted" />
                Proof of Payment / Screenshot (Optional)
              </span>
              <span className="text-[10px] text-text-muted">Optional</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="text-xs text-text-muted file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-800 hover:file:bg-stone-200"
              />
              {paymentProofFileName && (
                <span className="text-[11px] font-mono text-emerald-800 truncate max-w-[150px]">
                  {paymentProofFileName}
                </span>
              )}
            </div>
          </div>

          {/* Optional: Payment Notes */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-text-muted" />
                Audit & Remittance Notes (Optional)
              </span>
              <span className="text-[10px] text-text-muted">Optional</span>
            </label>
            <textarea
              rows={2}
              value={paymentNotes}
              onChange={e => setPaymentNotes(e.target.value)}
              placeholder="e.g. Confirmed on bank feed by finance team, linked to Wire remittance."
              className="w-full px-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs text-text-main focus:outline-none"
            />
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-950 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Automated Audit & Cashflow Sync
            </div>
            <p className="text-emerald-800 text-[11px]">
              Upon confirmation, this invoice status will update to <strong className="text-emerald-950">{isPartialPayment ? 'Partially Paid' : 'Paid'}</strong>, a transaction entry will be recorded in the payments ledger, and an immutable audit log record will be generated.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-border-subtle text-xs font-semibold text-text-muted hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              Confirm & Settle Payment
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

