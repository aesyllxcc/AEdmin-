import React from 'react';
import { 
  X, 
  Building2, 
  Mail, 
  Globe, 
  Calendar, 
  CreditCard, 
  HardDrive, 
  Users, 
  CheckSquare, 
  Layers, 
  KeyRound, 
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { TenantWorkspace, ManualPaymentRecord } from '@/types/saas';
import { calculateTenantStats } from '@/utils/workspaceManager';

interface TenantDetailsModalProps {
  workspace: TenantWorkspace | null;
  payments: ManualPaymentRecord[];
  onClose: () => void;
  onInspect: (tenantId: string) => void;
  onChangePlan: (workspace: TenantWorkspace) => void;
  onRecordRenewal: (workspace: TenantWorkspace) => void;
  onResetPassword: (userId: string, userName: string) => void;
}

export function TenantDetailsModal({
  workspace,
  payments,
  onClose,
  onInspect,
  onChangePlan,
  onRecordRenewal,
  onResetPassword
}: TenantDetailsModalProps) {
  if (!workspace) return null;

  const stats = calculateTenantStats(workspace.id);
  const tenantPayments = payments.filter(p => p.tenantId === workspace.id);

  const planLabels: Record<string, { name: string; color: string }> = {
    starter_freelance: { name: 'Freelance Starter', color: 'bg-stone-100 text-stone-700' },
    pro_executive: { name: 'Executive Pro', color: 'bg-amber-100 text-amber-800' },
    agency_studio: { name: 'Agency & Studio', color: 'bg-purple-100 text-purple-800' }
  };

  const planInfo = planLabels[workspace.plan] || { name: workspace.plan, color: 'bg-stone-100 text-stone-700' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white max-w-3xl w-full rounded-[32px] border border-[#ECE6DD] shadow-2xl p-6 sm:p-8 space-y-6 text-[#18191D] my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#ECE6DD] pb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center font-black text-xl shadow-md">
              {workspace.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  {workspace.name}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${planInfo.color}`}>
                  {planInfo.name}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  workspace.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {workspace.status === 'active' ? '● Active' : '● Suspended'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Tenant ID: <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-800 font-mono">{workspace.id}</code> · Created {new Date(workspace.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onInspect(workspace.id);
              }}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Inspect & View Workspace Live
            </button>
            <button
              onClick={() => {
                onClose();
                onChangePlan(workspace);
              }}
              className="px-3 py-2 bg-white hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-bold border border-stone-300 flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              Change Plan
            </button>
            <button
              onClick={() => {
                onClose();
                onRecordRenewal(workspace);
              }}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Record Renewal
            </button>
          </div>

          <button
            onClick={() => onResetPassword(workspace.ownerUserId || `usr_${workspace.id}`, workspace.ownerFullName)}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold border border-amber-200 flex items-center gap-1.5 transition-all"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-700" />
            Issue Temporary Password
          </button>
        </div>

        {/* Tenant Profile & Subscription Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Owner Profile */}
          <div className="bg-white p-5 rounded-2xl border border-[#ECE6DD] space-y-3">
            <h3 className="font-bold text-stone-900 flex items-center gap-2 text-sm border-b border-stone-100 pb-2">
              <Users className="w-4 h-4 text-stone-600" />
              Owner & Account Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Primary Contact:</span>
                <span className="font-semibold text-stone-900">{workspace.ownerFullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Account Email:</span>
                <span className="font-mono text-stone-900">{workspace.ownerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Studio / Business:</span>
                <span className="font-semibold text-stone-900">{workspace.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Workspace ID:</span>
                <span className="font-mono text-stone-700">/{workspace.id}</span>
              </div>
            </div>
          </div>

          {/* Subscription Dossier */}
          <div className="bg-white p-5 rounded-2xl border border-[#ECE6DD] space-y-3">
            <h3 className="font-bold text-stone-900 flex items-center gap-2 text-sm border-b border-stone-100 pb-2">
              <CreditCard className="w-4 h-4 text-stone-600" />
              Subscription & Entitlements
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Plan Tier:</span>
                <span className="font-bold text-stone-900">{planInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Current Period End:</span>
                <span className="font-bold text-emerald-800">
                  {workspace.subscription?.currentPeriodEnd 
                    ? new Date(workspace.subscription.currentPeriodEnd).toLocaleDateString(undefined, { dateStyle: 'long' })
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Client Limit:</span>
                <span className="font-semibold text-stone-900">
                  {stats.clientCount} / {workspace.subscription?.maxClients ?? 25} active clients
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Last Payment Ref:</span>
                <span className="font-mono text-stone-700">
                  {workspace.subscription?.lastPaymentReference || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Real Isolated Storage & Resource Usage */}
        <div className="bg-white p-5 rounded-2xl border border-[#ECE6DD] space-y-4">
          <h3 className="font-bold text-stone-900 flex items-center gap-2 text-sm">
            <HardDrive className="w-4 h-4 text-stone-600" />
            Isolated Tenant Storage & Resource Metrics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="text-2xl font-black text-stone-900">{stats.clientCount}</div>
              <div className="text-[11px] font-bold text-stone-500 uppercase mt-0.5">Clients</div>
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="text-2xl font-black text-stone-900">{stats.taskCount}</div>
              <div className="text-[11px] font-bold text-stone-500 uppercase mt-0.5">Active Tasks</div>
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="text-2xl font-black text-stone-900">{stats.projectCount}</div>
              <div className="text-[11px] font-bold text-stone-500 uppercase mt-0.5">Projects</div>
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="text-2xl font-black text-stone-900">{stats.storageUsedKB} KB</div>
              <div className="text-[11px] font-bold text-stone-500 uppercase mt-0.5">Storage Used</div>
            </div>
          </div>
        </div>

        {/* Payment History for this tenant */}
        <div className="space-y-3">
          <h3 className="font-bold text-stone-900 text-sm flex items-center justify-between">
            <span>Verified Payment Records ({tenantPayments.length})</span>
          </h3>
          {tenantPayments.length === 0 ? (
            <div className="p-4 bg-stone-50 rounded-2xl text-center text-xs text-stone-500 border border-stone-200">
              No manual payment records logged for this workspace yet.
            </div>
          ) : (
            <div className="border border-[#ECE6DD] rounded-2xl overflow-hidden divide-y divide-[#ECE6DD] text-xs">
              {tenantPayments.map(p => (
                <div key={p.id} className="p-3.5 flex flex-wrap items-center justify-between gap-2 hover:bg-stone-50">
                  <div>
                    <div className="font-bold text-stone-900 flex items-center gap-2">
                      <span>{p.currency} {p.amount.toLocaleString()}</span>
                      <span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-semibold uppercase">
                        {p.paymentMethod}
                      </span>
                    </div>
                    <div className="text-stone-500 text-[11px] font-mono mt-0.5">
                      Ref: {p.referenceNumber} · Verified {new Date(p.verifiedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      <CheckSquare className="w-3 h-3" /> Valid until {new Date(p.periodEndDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
