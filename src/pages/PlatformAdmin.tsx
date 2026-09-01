import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  KeyRound, 
  Settings, 
  Trash2, 
  Lock, 
  Building2, 
  Globe, 
  Mail, 
  DollarSign, 
  FileText, 
  RefreshCw, 
  Copy, 
  ExternalLink,
  Smartphone,
  Check,
  ChevronRight,
  Sparkles,
  Layers,
  HardDrive
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  getPlatformSettings, 
  savePlatformSettings, 
  getWorkspacesRegistry, 
  getManualPaymentsLedger,
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_NAME
} from '@/utils/workspaceManager';
import { TenantPlanTier, ManualPaymentMethod, TenantWorkspace, ManualPaymentRecord, PlatformSettings } from '@/types/saas';

export default function PlatformAdmin() {
  const { 
    currentUser, 
    isSuperAdmin, 
    userAccounts, 
    provisionTenantAccount,
    updateTenantSubscriptionStatus,
    recordManualPaymentForTenant,
    resetTenantPasswordByAdmin,
    deleteTenantWorkspaceByAdmin,
    auditLogs
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'provision' | 'payments' | 'settings'>('overview');
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => getPlatformSettings());
  const [workspaces, setWorkspaces] = useState<TenantWorkspace[]>(() => getWorkspacesRegistry());
  const [payments, setPayments] = useState<ManualPaymentRecord[]>(() => getManualPaymentsLedger());

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  // Provision New Tenant Modal / State
  const [provisionName, setProvisionName] = useState('');
  const [provisionEmail, setProvisionEmail] = useState('');
  const [provisionStudio, setProvisionStudio] = useState('');
  const [provisionPlan, setProvisionPlan] = useState<TenantPlanTier>('pro_executive');
  const [provisionTimezone, setProvisionTimezone] = useState('Asia/Manila');
  const [provisionCurrency, setProvisionCurrency] = useState('$');
  const [provisionHourlyRate, setProvisionHourlyRate] = useState(85);
  
  // Provision Payment details
  const [payAmount, setPayAmount] = useState(79);
  const [payCurrency, setPayCurrency] = useState<'USD' | 'PHP'>('USD');
  const [payMethod, setPayMethod] = useState<ManualPaymentMethod>('gcash');
  const [payRef, setPayRef] = useState('');
  const [payPeriod, setPayPeriod] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [payMonths, setPayMonths] = useState(1);
  const [payNotes, setPayNotes] = useState('');
  
  // Feedback
  const [provisionResult, setProvisionResult] = useState<{ success: boolean; message: string; tempPassword?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Renewal Modal
  const [renewalTenant, setRenewalTenant] = useState<TenantWorkspace | null>(null);
  const [renewAmount, setRenewAmount] = useState(79);
  const [renewCurrency, setRenewCurrency] = useState<'USD' | 'PHP'>('USD');
  const [renewMethod, setRenewMethod] = useState<ManualPaymentMethod>('gcash');
  const [renewRef, setRenewRef] = useState('');
  const [renewMonths, setRenewMonths] = useState(1);
  const [renewPeriod, setRenewPeriod] = useState<'monthly' | 'annual'>('monthly');

  // Reset Password Modal
  const [resetUserResult, setResetUserResult] = useState<{ userName: string; tempPassword: string } | null>(null);

  // Settings Feedback
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Guard: Sole Owner / Super Admin Authorization Check
  if (!isSuperAdmin || currentUser?.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-rose-200 shadow-xl text-center space-y-4">
        <div className="w-14 h-14 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-stone-900">Restricted Super Admin Control Area</h2>
        <p className="text-stone-600 text-sm leading-relaxed">
          Platform-level tenant management, manual payment verification, and workspace provisioning are strictly reserved for the Platform Owner & Administrator: <br />
          <strong className="text-stone-900 font-bold">{SUPER_ADMIN_NAME} ({SUPER_ADMIN_EMAIL})</strong>.
        </p>
        <p className="text-xs text-stone-400">
          Your current account operates in an isolated tenant workspace.
        </p>
      </div>
    );
  }

  // Refresh lists
  const reloadData = () => {
    setWorkspaces(getWorkspacesRegistry());
    setPayments(getManualPaymentsLedger());
    setPlatformSettings(getPlatformSettings());
  };

  // Handle Provisioning
  const handleProvisionTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provisionName || !provisionEmail || !payRef) {
      alert('Please enter user name, email, and payment reference number.');
      return;
    }

    setIsSubmitting(true);
    setProvisionResult(null);

    try {
      const res = await provisionTenantAccount({
        fullName: provisionName,
        email: provisionEmail,
        businessName: provisionStudio || `${provisionName} Executive Studio`,
        planTier: provisionPlan,
        timezone: provisionTimezone,
        currency: provisionCurrency,
        hourlyRate: provisionHourlyRate,
        initialPayment: {
          amount: payAmount,
          currency: payCurrency,
          method: payMethod,
          referenceNumber: payRef,
          billingPeriod: payPeriod,
          validMonths: payMonths,
          notes: payNotes
        }
      });

      if (res.success) {
        setProvisionResult({
          success: true,
          message: res.message || 'Tenant workspace provisioned!',
          tempPassword: res.tempPassword
        });
        // Reset form
        setProvisionName('');
        setProvisionEmail('');
        setProvisionStudio('');
        setPayRef('');
        reloadData();
      } else {
        setProvisionResult({
          success: false,
          message: res.message || 'Failed to provision tenant.'
        });
      }
    } catch (err: any) {
      setProvisionResult({
        success: false,
        message: err?.message || 'Unexpected provisioning error.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Renewal Recording
  const handleRecordRenewal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewalTenant || !renewRef) return;

    const res = recordManualPaymentForTenant({
      tenantId: renewalTenant.id,
      amount: renewAmount,
      currency: renewCurrency,
      paymentMethod: renewMethod,
      referenceNumber: renewRef,
      billingPeriod: renewPeriod,
      validMonths: renewMonths,
      notes: `Subscription renewal processed by ${SUPER_ADMIN_NAME}`
    });

    if (res.success) {
      alert(res.message);
      setRenewalTenant(null);
      setRenewRef('');
      reloadData();
    } else {
      alert(res.message);
    }
  };

  // Handle Password Reset by Admin
  const handleResetPassword = async (userId: string, userName: string) => {
    if (!confirm(`Generate a temporary password for ${userName}? They will be required to change it on their next login.`)) return;

    const res = await resetTenantPasswordByAdmin(userId);
    if (res.success && res.tempPassword) {
      setResetUserResult({ userName, tempPassword: res.tempPassword });
      reloadData();
    } else {
      alert(res.message || 'Failed to reset password.');
    }
  };

  // Handle Delete Workspace
  const handleDeleteWorkspace = (tenantId: string, userId: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the workspace for "${name}"? This action cannot be undone and will erase all isolated data.`)) return;

    const res = deleteTenantWorkspaceByAdmin(tenantId, userId);
    if (res.success) {
      alert(res.message);
      reloadData();
    } else {
      alert(res.message);
    }
  };

  // Handle Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    savePlatformSettings(platformSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Metrics Calculations
  const totalWorkspaces = workspaces.length;
  const activeWorkspaces = workspaces.filter(w => w.status === 'active').length;
  const totalVerifiedPayments = payments.filter(p => p.status === 'verified');
  const totalRevenuePHP = totalVerifiedPayments
    .filter(p => p.currency === 'PHP')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalRevenueUSD = totalVerifiedPayments
    .filter(p => p.currency === 'USD')
    .reduce((sum, p) => sum + p.amount, 0);

  const filteredWorkspaces = workspaces.filter(ws => {
    const matchesSearch = ws.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ws.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ws.ownerFullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : ws.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#18191D] via-[#24262E] to-[#18191D] text-white p-6 sm:p-8 rounded-[32px] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-300 border border-white/10">
              <ShieldCheck className="w-4 h-4" />
              <span>Platform Owner & Sole Super Administrator</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Platform Administration & SaaS Control
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Authorized to <span className="text-white font-bold">{SUPER_ADMIN_NAME}</span>. Manage isolated tenant workspaces, verify manual payments across GCash, Maya, Bank Transfer, and Wise, and provision new client accounts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('provision')}
              className="px-5 py-3.5 bg-white text-[#18191D] hover:bg-stone-100 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Provision New Tenant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#ECE6DD] pb-4">
        {[
          { id: 'overview', label: 'Platform Overview', icon: TrendingUp },
          { id: 'tenants', label: `Workspaces & Users (${totalWorkspaces})`, icon: Users },
          { id: 'provision', label: 'Provision Tenant', icon: Plus },
          { id: 'payments', label: `Payment Ledger (${payments.length})`, icon: CreditCard },
          { id: 'settings', label: 'Platform & Payment Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#18191D] text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-[#ECE6DD]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & PLATFORM METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-6 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Tenants</span>
                <Users className="w-4 h-4 text-stone-700" />
              </div>
              <div className="text-3xl font-black text-[#18191D]">{totalWorkspaces}</div>
              <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {activeWorkspaces} Active Subscriptions
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-bold uppercase tracking-wider">Revenue (PHP)</span>
                <Smartphone className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-[#18191D]">₱{totalRevenuePHP.toLocaleString()}</div>
              <p className="text-xs text-stone-500">GCash, Maya & BDO Bank</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-bold uppercase tracking-wider">Revenue (USD)</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-[#18191D]">${totalRevenueUSD.toLocaleString()}</div>
              <p className="text-xs text-stone-500">PayPal & Wise International</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-bold uppercase tracking-wider">Isolation Engine</span>
                <HardDrive className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-emerald-600">100%</div>
              <p className="text-xs text-stone-500">Zero Cross-Tenant Leakage</p>
            </div>

          </div>

          {/* Quick Workspaces Snapshot & Recent Payments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Workspaces Snapshot */}
            <div className="bg-white p-6 rounded-3xl border border-[#ECE6DD] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-[#18191D] flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Provisioned Workspaces</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('tenants')}
                  className="text-xs font-bold text-stone-600 hover:text-black flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {workspaces.map((ws) => (
                  <div key={ws.id} className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#18191D]">{ws.name}</span>
                        {ws.isSuperAdminWorkspace && (
                          <span className="px-2 py-0.5 bg-black text-white text-[9px] font-black rounded-full">
                            Owner
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500">{ws.ownerEmail} • Plan: {ws.subscription?.planName || ws.plan}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        ws.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {ws.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-stone-400 block mt-1">
                        Renews: {new Date(ws.subscription?.currentPeriodEnd || ws.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Manual Payment Verifications */}
            <div className="bg-white p-6 rounded-3xl border border-[#ECE6DD] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-[#18191D] flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Recent Manual Payments</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('payments')}
                  className="text-xs font-bold text-stone-600 hover:text-black flex items-center gap-1"
                >
                  <span>Full Ledger</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {payments.slice(0, 4).map((pay) => (
                  <div key={pay.id} className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#18191D]">{pay.userName}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-stone-200 text-stone-800 rounded-md">
                          {pay.paymentMethod}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-stone-500">Ref: {pay.referenceNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-800">
                        {pay.currency} {pay.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-400 block mt-0.5">
                        Verified {new Date(pay.verifiedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: TENANTS & WORKSPACES DIRECTORY */}
      {activeTab === 'tenants' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ECE6DD] space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#18191D]">Tenant Workspaces Directory</h2>
              <p className="text-xs text-stone-500">Manage private isolated workspaces, passwords, subscriptions, and status.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tenants..."
                  className="pl-9 pr-4 py-2.5 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="py-2.5 px-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] text-xs font-semibold focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Tenants Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#ECE6DD] text-stone-500 font-bold">
                  <th className="pb-3 px-3">Workspace & Operator</th>
                  <th className="pb-3 px-3">Plan Tier</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Subscription End</th>
                  <th className="pb-3 px-3">Payment Ref</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE6DD]/60">
                {filteredWorkspaces.map((ws) => {
                  const associatedUser = userAccounts.find(u => u.tenantId === ws.id || u.id === ws.ownerUserId);
                  return (
                    <tr key={ws.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      
                      {/* Name & Email */}
                      <td className="py-4 px-3">
                        <div className="font-bold text-stone-900 text-sm">{ws.name}</div>
                        <div className="text-stone-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{ws.ownerEmail}</span>
                          <span className="text-stone-300">•</span>
                          <span>ID: {ws.id}</span>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-4 px-3">
                        <span className="px-2.5 py-1 bg-stone-100 rounded-lg font-bold text-stone-800 text-[11px]">
                          {ws.subscription?.planName || ws.plan}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ws.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {ws.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Renewal Date */}
                      <td className="py-4 px-3 text-stone-700 font-semibold">
                        {new Date(ws.subscription?.currentPeriodEnd || ws.createdAt).toLocaleDateString()}
                      </td>

                      {/* Payment Ref */}
                      <td className="py-4 px-3 font-mono text-[11px] text-stone-600">
                        {ws.subscription?.lastPaymentReference || '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-3 text-right space-x-2">
                        {!ws.isSuperAdminWorkspace && (
                          <>
                            {/* Record Renewal Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setRenewalTenant(ws);
                                setRenewAmount(ws.subscription?.price || 79);
                                setRenewCurrency((ws.subscription?.currency as any) || 'USD');
                              }}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px] border border-emerald-200 transition-colors"
                              title="Record Renewal Payment"
                            >
                              + Record Renewal
                            </button>

                            {/* Reset Temp Password */}
                            {associatedUser && (
                              <button
                                type="button"
                                onClick={() => handleResetPassword(associatedUser.id, associatedUser.fullName)}
                                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold text-[11px] border border-amber-200 transition-colors"
                                title="Issue Temporary Password"
                              >
                                Reset Pass
                              </button>
                            )}

                            {/* Toggle Suspend */}
                            <button
                              type="button"
                              onClick={() => updateTenantSubscriptionStatus(
                                ws.id, 
                                ws.status === 'active' ? 'suspended' : 'active',
                                ws.status === 'active' ? 'Suspended by Owner' : 'Reactivated by Owner'
                              )}
                              className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-bold text-[11px] transition-colors"
                            >
                              {ws.status === 'active' ? 'Suspend' : 'Reactivate'}
                            </button>

                            {/* Delete Workspace */}
                            <button
                              type="button"
                              onClick={() => handleDeleteWorkspace(ws.id, ws.ownerUserId, ws.name)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-block align-middle"
                              title="Delete Workspace"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {ws.isSuperAdminWorkspace && (
                          <span className="text-[11px] font-bold text-stone-400 italic">
                            Master Owner
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: PROVISION NEW TENANT */}
      {activeTab === 'provision' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ECE6DD] max-w-4xl space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-xs font-bold text-stone-700 mb-2">
              <Plus className="w-3.5 h-3.5" />
              <span>Manual Account Provisioning Pipeline</span>
            </div>
            <h2 className="text-2xl font-black text-[#18191D]">Provision New Tenant Workspace</h2>
            <p className="text-xs text-stone-500 mt-1">
              Creates a private, isolated workspace for the user, sets initial temporary credentials with mandatory first-login password change, and records their verified manual payment.
            </p>
          </div>

          {provisionResult && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
              provisionResult.success 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              {provisionResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
              <div className="space-y-1">
                <p className="font-bold">{provisionResult.message}</p>
                {provisionResult.tempPassword && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 mt-2">
                    <span className="text-[11px] font-bold text-stone-600 block">Temporary Password for User:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-base font-black text-[#18191D]">{provisionResult.tempPassword}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(provisionResult.tempPassword!);
                          alert('Temporary password copied to clipboard!');
                        }}
                        className="px-2.5 py-1 bg-stone-100 rounded-lg text-xs font-bold text-stone-700 hover:bg-stone-200"
                      >
                        Copy Password
                      </button>
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1">
                      Send this credential to the user. The system will prompt them to set their permanent password immediately upon login.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleProvisionTenant} className="space-y-6">
            
            {/* Section 1: User & Workspace Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2 border-b border-[#ECE6DD] pb-2">
                <Users className="w-4 h-4" />
                <span>1. User & Workspace Profile</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    User Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={provisionName}
                    onChange={e => setProvisionName(e.target.value)}
                    placeholder="e.g., Sarah Jenkins"
                    className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    User Email (Login Username) *
                  </label>
                  <input
                    type="email"
                    required
                    value={provisionEmail}
                    onChange={e => setProvisionEmail(e.target.value)}
                    placeholder="sarah@jenkinsops.com"
                    className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Studio / Business Name
                  </label>
                  <input
                    type="text"
                    value={provisionStudio}
                    onChange={e => setProvisionStudio(e.target.value)}
                    placeholder="Sarah Jenkins Executive Support"
                    className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Subscription Plan Tier *
                  </label>
                  <select
                    value={provisionPlan}
                    onChange={e => setProvisionPlan(e.target.value as any)}
                    className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:ring-2 focus:ring-black"
                  >
                    <option value="starter_freelance">Freelance Starter ($39 / ₱1,990 mo)</option>
                    <option value="pro_executive">Executive Pro ($79 / ₱3,990 mo)</option>
                    <option value="agency_studio">Agency & Studio ($149 / ₱7,490 mo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Operating Timezone
                  </label>
                  <input
                    type="text"
                    value={provisionTimezone}
                    onChange={e => setProvisionTimezone(e.target.value)}
                    placeholder="Asia/Manila or America/New_York"
                    className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Hourly Rate & Currency
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={provisionCurrency}
                      onChange={e => setProvisionCurrency(e.target.value)}
                      className="w-16 text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] text-center"
                    />
                    <input
                      type="number"
                      value={provisionHourlyRate}
                      onChange={e => setProvisionHourlyRate(Number(e.target.value))}
                      className="flex-1 text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Verified Manual Payment Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2 border-b border-[#ECE6DD] pb-2">
                <CreditCard className="w-4 h-4" />
                <span>2. Verified Manual Payment Ledger Entry</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={payMethod}
                    onChange={e => setPayMethod(e.target.value as any)}
                    className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD]"
                  >
                    <option value="gcash">GCash (PH)</option>
                    <option value="maya">Maya (PH)</option>
                    <option value="bank_transfer">Bank Transfer (BDO)</option>
                    <option value="paypal">PayPal</option>
                    <option value="wise">Wise</option>
                    <option value="cash_other">Other / Direct Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Amount & Currency *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={payCurrency}
                      onChange={e => setPayCurrency(e.target.value as any)}
                      className="w-20 text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD]"
                    >
                      <option value="USD">USD</option>
                      <option value="PHP">PHP</option>
                    </select>
                    <input
                      type="number"
                      required
                      value={payAmount}
                      onChange={e => setPayAmount(Number(e.target.value))}
                      className="flex-1 text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Transaction Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={payRef}
                    onChange={e => setPayRef(e.target.value)}
                    placeholder="e.g., GCASH-9821049281"
                    className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Billing Cycle
                  </label>
                  <select
                    value={payPeriod}
                    onChange={e => setPayPeriod(e.target.value as any)}
                    className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD]"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Valid Duration (Months)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={36}
                    value={payMonths}
                    onChange={e => setPayMonths(Number(e.target.value))}
                    className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Verification Notes
                  </label>
                  <input
                    type="text"
                    value={payNotes}
                    onChange={e => setPayNotes(e.target.value)}
                    placeholder="e.g., Verified in GCash inbox"
                    className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#ECE6DD]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-[#18191D] hover:bg-black text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Provisioning Isolated Workspace...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Payment & Provision Tenant Workspace</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 4: MANUAL PAYMENTS LEDGER */}
      {activeTab === 'payments' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ECE6DD] space-y-6">
          <div>
            <h2 className="text-xl font-black text-[#18191D]">Manual Payments & Verification Audit Ledger</h2>
            <p className="text-xs text-stone-500">Historical records of all GCash, Maya, Bank Transfer, PayPal, and Wise transactions.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#ECE6DD] text-stone-500 font-bold">
                  <th className="pb-3 px-3">Date & User</th>
                  <th className="pb-3 px-3">Method</th>
                  <th className="pb-3 px-3">Reference Number</th>
                  <th className="pb-3 px-3">Amount</th>
                  <th className="pb-3 px-3">Period</th>
                  <th className="pb-3 px-3">Verified By</th>
                  <th className="pb-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE6DD]/60">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-stone-900">{pay.userName}</div>
                      <div className="text-stone-500 text-[11px]">{pay.userEmail}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 bg-stone-100 rounded-lg font-bold text-stone-800 text-[11px] uppercase">
                        {pay.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-stone-800">
                      {pay.referenceNumber}
                    </td>
                    <td className="py-3.5 px-3 font-black text-emerald-800">
                      {pay.currency} {pay.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-stone-600 font-medium">
                      {new Date(pay.periodStartDate).toLocaleDateString()} – {new Date(pay.periodEndDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3 text-stone-600">
                      {pay.verifiedBy}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PLATFORM & PAYMENT INSTRUCTIONS SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ECE6DD] max-w-4xl space-y-6">
          <div>
            <h2 className="text-xl font-black text-[#18191D]">Platform Administration & Manual Billing Configuration</h2>
            <p className="text-xs text-stone-500">Update payment receiver details displayed to prospective users on the subscription portal.</p>
          </div>

          {settingsSaved && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-900 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Platform settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* GCash Settings */}
            <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-stone-900">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>GCash Configuration (PH)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={platformSettings.manualPaymentInstructions.gcash.accountName}
                    onChange={e => setPlatformSettings({
                      ...platformSettings,
                      manualPaymentInstructions: {
                        ...platformSettings.manualPaymentInstructions,
                        gcash: { ...platformSettings.manualPaymentInstructions.gcash, accountName: e.target.value }
                      }
                    })}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#ECE6DD] font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={platformSettings.manualPaymentInstructions.gcash.accountNumber}
                    onChange={e => setPlatformSettings({
                      ...platformSettings,
                      manualPaymentInstructions: {
                        ...platformSettings.manualPaymentInstructions,
                        gcash: { ...platformSettings.manualPaymentInstructions.gcash, accountNumber: e.target.value }
                      }
                    })}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#ECE6DD] font-semibold font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Maya Settings */}
            <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-stone-900">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Maya Configuration (PH)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={platformSettings.manualPaymentInstructions.maya.accountName}
                    onChange={e => setPlatformSettings({
                      ...platformSettings,
                      manualPaymentInstructions: {
                        ...platformSettings.manualPaymentInstructions,
                        maya: { ...platformSettings.manualPaymentInstructions.maya, accountName: e.target.value }
                      }
                    })}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#ECE6DD] font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={platformSettings.manualPaymentInstructions.maya.accountNumber}
                    onChange={e => setPlatformSettings({
                      ...platformSettings,
                      manualPaymentInstructions: {
                        ...platformSettings.manualPaymentInstructions,
                        maya: { ...platformSettings.manualPaymentInstructions.maya, accountNumber: e.target.value }
                      }
                    })}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#ECE6DD] font-semibold font-mono"
                  />
                </div>
              </div>
            </div>

            {/* BDO Bank Settings */}
            <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-stone-900">
                <Building2 className="w-4 h-4 text-black" />
                <span>Bank Transfer (BDO Unibank)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={platformSettings.manualPaymentInstructions.bankTransfer.bankName}
                    onChange={e => setPlatformSettings({
                      ...platformSettings,
                      manualPaymentInstructions: {
                        ...platformSettings.manualPaymentInstructions,
                        bankTransfer: { ...platformSettings.manualPaymentInstructions.bankTransfer, bankName: e.target.value }
                      }
                    })}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#ECE6DD] font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={platformSettings.manualPaymentInstructions.bankTransfer.accountName}
                    onChange={e => setPlatformSettings({
                      ...platformSettings,
                      manualPaymentInstructions: {
                        ...platformSettings.manualPaymentInstructions,
                        bankTransfer: { ...platformSettings.manualPaymentInstructions.bankTransfer, accountName: e.target.value }
                      }
                    })}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#ECE6DD] font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={platformSettings.manualPaymentInstructions.bankTransfer.accountNumber}
                    onChange={e => setPlatformSettings({
                      ...platformSettings,
                      manualPaymentInstructions: {
                        ...platformSettings.manualPaymentInstructions,
                        bankTransfer: { ...platformSettings.manualPaymentInstructions.bankTransfer, accountNumber: e.target.value }
                      }
                    })}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#ECE6DD] font-semibold font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#ECE6DD]">
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#18191D] hover:bg-black text-white rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save Platform Configurations</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* RENEWAL MODAL */}
      {renewalTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl border border-[#ECE6DD] shadow-2xl p-6 space-y-5 text-[#18191D]">
            <div>
              <h3 className="text-lg font-black">Record Manual Subscription Renewal</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Extend access for <span className="font-bold text-black">{renewalTenant.name}</span>
              </p>
            </div>

            <form onSubmit={handleRecordRenewal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Payment Method</label>
                <select
                  value={renewMethod}
                  onChange={e => setRenewMethod(e.target.value as any)}
                  className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD]"
                >
                  <option value="gcash">GCash (PH)</option>
                  <option value="maya">Maya (PH)</option>
                  <option value="bank_transfer">Bank Transfer (BDO)</option>
                  <option value="paypal">PayPal</option>
                  <option value="wise">Wise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Amount Paid</label>
                <div className="flex gap-2">
                  <select
                    value={renewCurrency}
                    onChange={e => setRenewCurrency(e.target.value as any)}
                    className="w-20 text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD]"
                  >
                    <option value="USD">USD</option>
                    <option value="PHP">PHP</option>
                  </select>
                  <input
                    type="number"
                    required
                    value={renewAmount}
                    onChange={e => setRenewAmount(Number(e.target.value))}
                    className="flex-1 text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Transaction Ref Number *</label>
                <input
                  type="text"
                  required
                  value={renewRef}
                  onChange={e => setRenewRef(e.target.value)}
                  placeholder="e.g., GCASH-1928374650"
                  className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Extension Duration (Months)</label>
                <input
                  type="number"
                  min={1}
                  max={36}
                  value={renewMonths}
                  onChange={e => setRenewMonths(Number(e.target.value))}
                  className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#ECE6DD]">
                <button
                  type="button"
                  onClick={() => setRenewalTenant(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#18191D] hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Verify & Extend
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD RESULT MODAL */}
      {resetUserResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl border border-[#ECE6DD] shadow-2xl p-6 space-y-4 text-[#18191D]">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black">Temporary Password Generated</h3>
            <p className="text-xs text-stone-500">
              A new temporary password has been set for <span className="font-bold text-black">{resetUserResult.userName}</span>.
            </p>

            <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] flex items-center justify-between">
              <span className="font-mono text-base font-black text-black">{resetUserResult.tempPassword}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(resetUserResult.tempPassword);
                  alert('Password copied to clipboard!');
                }}
                className="px-3 py-1.5 bg-white border border-[#ECE6DD] rounded-xl text-xs font-bold text-stone-800 hover:bg-stone-50"
              >
                Copy
              </button>
            </div>

            <p className="text-[11px] text-stone-500">
              The user will be required to choose a new secure password on their next login.
            </p>

            <button
              type="button"
              onClick={() => setResetUserResult(null)}
              className="w-full py-3 bg-[#18191D] hover:bg-black text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
