import React, { useState, useEffect } from 'react';
import { X, Clock, ShieldCheck, AlertCircle, History, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { RetainerPeriodLog, Client } from '@/types';

interface RetainerAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  periodToEdit?: RetainerPeriodLog | null;
}

export function RetainerAdjustmentModal({
  isOpen,
  onClose,
  client,
  periodToEdit
}: RetainerAdjustmentModalProps) {
  const { 
    clients, 
    updateRetainerPeriod, 
    addRetainerPeriod, 
    adjustClientAvailableHours, 
    userProfile 
  } = useApp();

  const activeClient = client || clients.find(c => c.id === periodToEdit?.clientId) || clients[0];
  const [clientId, setClientId] = useState(activeClient?.id || '');
  const [periodMonth, setPeriodMonth] = useState(periodToEdit?.periodMonth || new Date().toISOString().slice(0, 7));
  const [purchasedHours, setPurchasedHours] = useState<number>(periodToEdit?.purchasedHours ?? activeClient?.purchasedHours ?? 20);
  const [rolloverHours, setRolloverHours] = useState<number>(periodToEdit?.rolloverHours ?? 0);
  const [manualAdjustmentHours, setManualAdjustmentHours] = useState<number>(periodToEdit?.manualAdjustmentHours ?? 0);
  const [usedHours, setUsedHours] = useState<number>(periodToEdit?.usedHours ?? activeClient?.usedHoursThisMonth ?? 0);
  const [hourlyRate, setHourlyRate] = useState<number>(periodToEdit?.hourlyRate ?? activeClient?.hourlyRate ?? 150);
  const [status, setStatus] = useState<'active' | 'closed' | 'reconciled' | 'disputed'>(periodToEdit?.status || 'active');
  const [adjustmentReason, setAdjustmentReason] = useState(periodToEdit?.adjustmentReason || '');
  const [notes, setNotes] = useState(periodToEdit?.notes || '');

  useEffect(() => {
    if (periodToEdit) {
      setClientId(periodToEdit.clientId);
      setPeriodMonth(periodToEdit.periodMonth);
      setPurchasedHours(periodToEdit.purchasedHours);
      setRolloverHours(periodToEdit.rolloverHours || 0);
      setManualAdjustmentHours(periodToEdit.manualAdjustmentHours || 0);
      setUsedHours(periodToEdit.usedHours);
      setHourlyRate(periodToEdit.hourlyRate);
      setStatus(periodToEdit.status);
      setAdjustmentReason(periodToEdit.adjustmentReason || '');
      setNotes(periodToEdit.notes || '');
    } else if (client) {
      setClientId(client.id);
      setPeriodMonth(new Date().toISOString().slice(0, 7));
      setPurchasedHours(client.purchasedHours || 20);
      setRolloverHours(0);
      setManualAdjustmentHours(0);
      setUsedHours(client.usedHoursThisMonth || 0);
      setHourlyRate(client.hourlyRate || 150);
      setStatus('active');
      setAdjustmentReason('');
      setNotes(`Monthly retainer allocation for ${client.name}`);
    }
  }, [periodToEdit, client, isOpen]);

  if (!isOpen) return null;

  const currentClientObj = clients.find(c => c.id === clientId);
  const effectiveAvailable = Number(((purchasedHours || 0) + (rolloverHours || 0) + (manualAdjustmentHours || 0)).toFixed(1));
  const remainingHours = Number((effectiveAvailable - (usedHours || 0)).toFixed(1));
  const monthlyFee = effectiveAvailable * hourlyRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reasonText = adjustmentReason.trim() || 'Operational retainer capacity adjustment';

    if (periodToEdit) {
      updateRetainerPeriod(periodToEdit.id, {
        clientId,
        clientName: currentClientObj?.name || periodToEdit.clientName,
        periodMonth,
        purchasedHours: Number(purchasedHours),
        rolloverHours: Number(rolloverHours),
        manualAdjustmentHours: Number(manualAdjustmentHours),
        usedHours: Number(usedHours),
        hourlyRate: Number(hourlyRate),
        monthlyFee,
        status,
        notes,
        adjustmentReason: reasonText
      }, reasonText);
    } else {
      // Also update client top-level available hours
      adjustClientAvailableHours(
        clientId, 
        Number(purchasedHours), 
        Number(rolloverHours), 
        Number(manualAdjustmentHours), 
        reasonText
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] border border-border-subtle shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/80 text-amber-900 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main">
                {periodToEdit ? 'Edit Retainer Cycle & Capacity' : 'Adjust Client Retainer & Available Hours'}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Traceable operational adjustments with automated audit logging.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Client Account</label>
              <select 
                value={clientId} 
                onChange={e => setClientId(e.target.value)}
                disabled={Boolean(periodToEdit)}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none disabled:opacity-75"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Billing Period / Month</label>
              <input 
                type="month" 
                value={periodMonth}
                onChange={e => setPeriodMonth(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Hours Capacity Breakdown */}
          <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/60 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-950">Hours Configuration & Calculations</span>
              <span className="text-xs font-semibold text-amber-800 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                Formula: Base + Rollover + Adjustment
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">Contract Base Hours</label>
                <input 
                  type="number" 
                  step="0.5"
                  min="0"
                  value={purchasedHours}
                  onChange={e => setPurchasedHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-sm font-bold text-amber-950 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">Rollover Hours (Prior Cycle)</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={rolloverHours}
                  onChange={e => setRolloverHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-sm font-bold text-amber-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">Manual Operational Adj (+/-)</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={manualAdjustmentHours}
                  onChange={e => setManualAdjustmentHours(Number(e.target.value))}
                  placeholder="e.g. +2.0 or -1.5"
                  className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-sm font-bold text-amber-950 focus:outline-none"
                />
              </div>
            </div>

            {/* Calculations preview */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-amber-200/60 text-center">
              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                <span className="text-[10px] uppercase font-bold text-amber-800">Effective Available</span>
                <div className="text-base font-extrabold text-amber-950">{effectiveAvailable} hrs</div>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                <span className="text-[10px] uppercase font-bold text-amber-800">Consumed / Used</span>
                <div className="text-base font-extrabold text-amber-950">{usedHours} hrs</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${remainingHours < 0 ? 'bg-rose-100 border-rose-200 text-rose-950' : 'bg-emerald-50 border-emerald-200 text-emerald-950'}`}>
                <span className="text-[10px] uppercase font-bold">Remaining Balance</span>
                <div className="text-base font-extrabold">{remainingHours} hrs</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Hourly Billing Rate ($/hr)</label>
              <input 
                type="number" 
                min="0"
                value={hourlyRate}
                onChange={e => setHourlyRate(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-bold focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Cycle Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none"
              >
                <option value="active">Active Current Cycle</option>
                <option value="reconciled">Reconciled & Invoiced</option>
                <option value="closed">Closed Historical Period</option>
                <option value="disputed">Disputed / Under Review</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Cycle Notes & Scope Description</label>
            <textarea 
              rows={2} 
              value={notes} 
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Standard 25h retainer agreement with 4h strategic buffer."
              className="w-full px-4 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-medium focus:outline-none"
            />
          </div>

          {/* Audit Logging Requirement Notice */}
          <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-gray-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Audit Log Reason (Mandatory Traceability)
              </label>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Actor: {userProfile.fullName || 'Olivia Vance'}
              </span>
            </div>
            <input 
              type="text" 
              value={adjustmentReason} 
              onChange={e => setAdjustmentReason(e.target.value)}
              placeholder="e.g. Granted 3h complimentary credit for Q3 board deck sprint delay"
              className="w-full px-4 py-2.5 bg-white border border-border-subtle rounded-xl text-xs font-medium focus:outline-none"
              required
            />
            {periodToEdit?.lastModified && (
              <p className="text-[11px] text-text-muted">
                Last modified: {new Date(periodToEdit.lastModified).toLocaleString()} by {periodToEdit.modifiedBy || 'System Admin'}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
            <div className="text-xs text-text-muted">
              Estimated Monthly Value: <strong className="text-text-main font-bold">${monthlyFee.toLocaleString()}</strong>
            </div>
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-border-subtle text-xs font-semibold text-text-muted hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 rounded-full bg-sidebar-bg text-white text-xs font-semibold hover:bg-sidebar-active transition-colors shadow-sm"
              >
                {periodToEdit ? 'Save Retainer Changes' : 'Apply Hour Adjustments'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
