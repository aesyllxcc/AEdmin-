import React, { useState } from 'react';
import { X, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { TenantWorkspace, TenantPlanTier, PlatformSettings } from '@/types/saas';

interface ChangePlanModalProps {
  workspace: TenantWorkspace | null;
  platformSettings: PlatformSettings;
  onClose: () => void;
  onConfirmChange: (tenantId: string, newPlanTier: TenantPlanTier) => void;
}

export function ChangePlanModal({
  workspace,
  platformSettings,
  onClose,
  onConfirmChange
}: ChangePlanModalProps) {
  if (!workspace) return null;

  const [selectedPlan, setSelectedPlan] = useState<TenantPlanTier>(workspace.plan);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmChange(workspace.id, selectedPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white max-w-xl w-full rounded-[32px] border border-[#ECE6DD] shadow-2xl p-6 sm:p-8 space-y-6 text-[#18191D] my-8">
        
        <div className="flex items-start justify-between border-b border-[#ECE6DD] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900">Change Subscription Plan</h2>
              <p className="text-xs text-stone-500">Updating plan tier for <strong className="text-stone-900">{workspace.name}</strong></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Select New Plan Tier</label>
            
            <div className="space-y-2.5">
              {platformSettings.plans.map((p) => {
                const isSelected = selectedPlan === p.id;
                const isCurrent = workspace.plan === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-stone-900 bg-stone-50 shadow-xs ring-1 ring-stone-900'
                        : 'border-[#ECE6DD] bg-white hover:border-stone-400'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-stone-900">{p.name}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-stone-200 text-stone-700 text-[10px] font-bold rounded-full">
                            Current Plan
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500">{p.description}</p>
                      <div className="text-[11px] text-stone-600 font-semibold">
                        Limit: {p.clientLimit === 999 ? 'Unlimited' : p.clientLimit} Clients · {p.storageLimitMB / 1000}GB Storage
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-stone-900 text-base">${p.monthlyPriceUSD}/mo</div>
                      <div className="text-[11px] text-stone-500 font-medium">₱{p.monthlyPricePHP.toLocaleString()}/mo</div>
                    </div>
                  </div>
                );
              })}
            </div>
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
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <span>Apply Plan Change</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
