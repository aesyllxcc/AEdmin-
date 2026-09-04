import React, { useState, useEffect } from 'react';
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
  HardDrive,
  Eye,
  Download,
  ArrowRight,
  ShieldAlert,
  Edit3,
  Calendar,
  BadgePercent,
  CheckCheck,
  XCircle,
  Inbox
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  getPlatformSettings, 
  savePlatformSettings, 
  getWorkspacesRegistry, 
  getManualPaymentsLedger,
  getAccessRequests,
  calculateTenantStats,
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_NAME
} from '@/utils/workspaceManager';
import { 
  TenantPlanTier, 
  ManualPaymentMethod, 
  TenantWorkspace, 
  ManualPaymentRecord, 
  PlatformSettings,
  AccessRequest 
} from '@/types/saas';
import { TenantDetailsModal } from '@/components/admin/TenantDetailsModal';
import { ChangePlanModal } from '@/components/admin/ChangePlanModal';
import { RecordRenewalModal } from '@/components/admin/RecordRenewalModal';
import { AccessRequestsList } from '@/components/admin/AccessRequestsList';
import { AuditLogsViewer } from '@/components/admin/AuditLogsViewer';
import { useNavigate } from 'react-router-dom';

export default function PlatformAdmin() {
  const { 
    currentUser, 
    isSuperAdmin, 
    userAccounts, 
    provisionTenantAccount,
    updateTenantSubscriptionStatus,
    updateTenantPlanTier,
    recordManualPaymentForTenant,
    resetTenantPasswordByAdmin,
    deleteTenantWorkspaceByAdmin,
    setInspectedTenantId,
    auditLogs
  } = useAuth();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'requests' | 'provision' | 'payments' | 'settings' | 'audit'>('overview');
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => getPlatformSettings());
  const [workspaces, setWorkspaces] = useState<TenantWorkspace[]>(() => getWorkspacesRegistry());
  const [payments, setPayments] = useState<ManualPaymentRecord[]>(() => getManualPaymentsLedger());
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(() => getAccessRequests());

  // Search & Filters for Tenants
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Search & Filters for Payments
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [paymentCurrencyFilter, setPaymentCurrencyFilter] = useState<string>('all');

  // Provisioning Form State
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
  const [payPeriod, setPayPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [payMonths, setPayMonths] = useState(1);
  const [payNotes, setPayNotes] = useState('');
  const [linkedRequestId, setLinkedRequestId] = useState<string | null>(null);

  // Auto-calculate payAmount when plan, currency, or period changes
  const updateProvisionAmount = (plan: TenantPlanTier, curr: 'USD' | 'PHP', period: 'monthly' | 'annual', months: number) => {
    const pConfig = platformSettings.plans.find(p => p.id === plan);
    if (!pConfig) return;
    if (curr === 'PHP') {
      const base = period === 'annual' ? Math.round(pConfig.monthlyPricePHP * 0.8 * 12) : pConfig.monthlyPricePHP * months;
      setPayAmount(base);
    } else {
      const base = period === 'annual' ? Math.round(pConfig.monthlyPriceUSD * 0.8 * 12) : pConfig.monthlyPriceUSD * months;
      setPayAmount(base);
    }
  };

  const handlePlanChange = (newPlan: TenantPlanTier) => {
    setProvisionPlan(newPlan);
    updateProvisionAmount(newPlan, payCurrency, payPeriod, payMonths);
  };

  const handleCurrencyChange = (newCurr: 'USD' | 'PHP') => {
    setPayCurrency(newCurr);
    updateProvisionAmount(provisionPlan, newCurr, payPeriod, payMonths);
  };

  const handlePeriodChange = (newPeriod: 'monthly' | 'annual') => {
    setPayPeriod(newPeriod);
    const m = newPeriod === 'annual' ? 12 : 1;
    setPayMonths(m);
    updateProvisionAmount(provisionPlan, payCurrency, newPeriod, m);
  };

  // Feedback State
  const [provisionResult, setProvisionResult] = useState<{ 
    success: boolean; 
    message: string; 
    tempPassword?: string;
    email?: string;
    fullName?: string;
    tenantId?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCredentials, setCopiedCredentials] = useState(false);

  // Modals State
  const [inspectModalWorkspace, setInspectModalWorkspace] = useState<TenantWorkspace | null>(null);
  const [changePlanWorkspace, setChangePlanWorkspace] = useState<TenantWorkspace | null>(null);
  const [renewalWorkspace, setRenewalWorkspace] = useState<TenantWorkspace | null>(null);
  const [resetUserResult, setResetUserResult] = useState<{ userName: string; tempPassword: string } | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Reload all platform registry data
  const reloadData = () => {
    setWorkspaces(getWorkspacesRegistry());
    setPayments(getManualPaymentsLedger());
    setPlatformSettings(getPlatformSettings());
    setAccessRequests(getAccessRequests());
  };

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

  // Handle Provisioning Submission
  const handleProvisionTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provisionName || !provisionEmail) {
      alert('Please enter user full name and email address.');
      return;
    }

    setIsSubmitting(true);
    setProvisionResult(null);

    const effectiveRef = payRef.trim() || `DIRECT-${Date.now().toString().slice(-6)}`;

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
          amount: payAmount || 0,
          currency: payCurrency,
          method: payMethod,
          referenceNumber: effectiveRef,
          billingPeriod: payPeriod,
          validMonths: payMonths,
          notes: payNotes || (linkedRequestId ? `Provisioned from direct contact inquiry ${linkedRequestId}` : 'Direct onboarding verified by Platform Owner')
        }
      });

      if (res.success) {
        setProvisionResult({
          success: true,
          message: res.message || 'Tenant workspace provisioned successfully!',
          tempPassword: res.tempPassword,
          email: provisionEmail,
          fullName: provisionName,
          tenantId: res.tenantId
        });

        // Reset form
        setProvisionName('');
        setProvisionEmail('');
        setProvisionStudio('');
        setPayRef('');
        setPayNotes('');
        setLinkedRequestId(null);
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
        message: err?.message || 'Unexpected error during provisioning.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle 1-Click Approve & Pre-fill from Inbound Access Request
  const handleApproveFromRequest = (req: AccessRequest) => {
    setProvisionName(req.fullName);
    setProvisionEmail(req.email);
    setProvisionStudio(req.businessName);
    setProvisionPlan(req.planId);
    setPayCurrency(req.currency);
    setPayPeriod(req.billingCycle);
    setPayMethod(req.paymentMethod);
    setPayRef(req.referenceNumber);
    setPayAmount(req.amount);
    setPayMonths(req.billingCycle === 'annual' ? 12 : 1);
    setPayNotes(`Approved from Access Request #${req.id}. ${req.notes || ''}`);
    setLinkedRequestId(req.id);
    setActiveTab('provision');
  };

  // Handle Plan Change
  const handleConfirmChangePlan = (tenantId: string, newPlanTier: TenantPlanTier) => {
    const res = updateTenantPlanTier(tenantId, newPlanTier);
    alert(res.message);
    reloadData();
  };

  // Handle Renewal Recording
  const handleConfirmRenewal = (paymentData: any) => {
    const res = recordManualPaymentForTenant(paymentData);
    alert(res.message);
    reloadData();
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

  // Handle Suspend / Reactivate with Immediate State Reload
  const handleToggleSubscriptionStatus = (tenantId: string, currentStatus: string, name: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const reason = prompt(
      `Enter reason for ${nextStatus === 'suspended' ? 'suspending' : 'reactivating'} workspace for "${name}":`,
      nextStatus === 'suspended' ? 'Subscription expired or non-payment' : 'Payment verified / renewed'
    );
    if (reason === null) return;

    updateTenantSubscriptionStatus(tenantId, nextStatus as any, reason);
    reloadData();
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

  // Handle Impersonation / View-As Mode
  const handleInspectWorkspace = (tenantId: string) => {
    setInspectedTenantId(tenantId);
    navigate('/');
  };

  // Handle Export Payment Ledger to CSV
  const handleExportPaymentLedgerCSV = () => {
    const headers = ['Record ID', 'Tenant ID', 'User Name', 'Email', 'Studio', 'Plan', 'Amount', 'Currency', 'Payment Method', 'Reference Number', 'Billing Period', 'Verified Date', 'Expires Date', 'Status'];
    const rows = payments.map(p => [
      p.id,
      p.tenantId,
      `"${p.userName.replace(/"/g, '""')}"`,
      p.userEmail,
      `"${p.businessName.replace(/"/g, '""')}"`,
      p.planTier,
      p.amount,
      p.currency,
      p.paymentMethod,
      p.referenceNumber,
      p.billingPeriod,
      p.verifiedAt,
      p.periodEndDate,
      p.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `aedmin_payment_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    savePlatformSettings(platformSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3500);
  };

  // Metrics Calculations
  const totalWorkspaces = workspaces.length;
  const activeWorkspaces = workspaces.filter(w => w.status === 'active').length;
  const suspendedWorkspaces = workspaces.filter(w => w.status === 'suspended').length;
  const pendingRequestsCount = accessRequests.filter(r => r.status === 'pending').length;

  const verifiedPayments = payments.filter(p => p.status === 'verified');
  const totalRevenuePHP = verifiedPayments
    .filter(p => p.currency === 'PHP')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalRevenueUSD = verifiedPayments
    .filter(p => p.currency === 'USD')
    .reduce((sum, p) => sum + p.amount, 0);

  // Filtered Workspaces
  const filteredWorkspaces = workspaces.filter(ws => {
    const matchesSearch = 
      ws.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ws.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.ownerFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : ws.status === statusFilter;
    const matchesPlan = planFilter === 'all' ? true : ws.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Filtered Payments
  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.referenceNumber.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      p.userName.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      p.userEmail.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      p.businessName.toLowerCase().includes(paymentSearch.toLowerCase());
    const matchesMethod = paymentMethodFilter === 'all' ? true : p.paymentMethod === paymentMethodFilter;
    const matchesCurr = paymentCurrencyFilter === 'all' ? true : p.currency === paymentCurrencyFilter;
    return matchesSearch && matchesMethod && matchesCurr;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#18191D] via-[#24262E] to-[#18191D] text-white p-6 sm:p-8 rounded-[32px] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-300 border border-white/10">
              <ShieldCheck className="w-4 h-4" />
              <span>Platform Owner & Master Super Administrator</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Platform Administration Hub
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Authorized to <span className="text-white font-bold">{SUPER_ADMIN_NAME}</span>. Oversee multi-tenant workspaces, approve inbound access requests, record manual payments across GCash, Maya, Bank Transfer, PayPal, and Wise, and inspect tenant workspaces live.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className="px-4 py-3 bg-amber-400 text-stone-950 hover:bg-amber-300 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Inbox className="w-4 h-4" />
              <span>Access Requests {pendingRequestsCount > 0 && `(${pendingRequestsCount})`}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('provision')}
              className="px-4 py-3 bg-white text-[#18191D] hover:bg-stone-100 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
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
          { id: 'requests', label: `Access Requests (${pendingRequestsCount} Pending)`, icon: Inbox, badge: pendingRequestsCount },
          { id: 'provision', label: 'Provision Tenant', icon: Plus },
          { id: 'payments', label: `Payment Ledger (${payments.length})`, icon: CreditCard },
          { id: 'settings', label: 'Platform & Payment Settings', icon: Settings },
          { id: 'audit', label: 'System Logs', icon: FileText }
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
              <p className="text-xs text-stone-500 font-medium">
                Verified via GCash, Maya & BDO
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-bold uppercase tracking-wider">Revenue (USD)</span>
                <Globe className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-[#18191D]">${totalRevenueUSD.toLocaleString()}</div>
              <p className="text-xs text-stone-500 font-medium">
                Verified via PayPal & Wise
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Access</span>
                <Inbox className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-amber-600">{pendingRequestsCount}</div>
              <p className="text-xs text-amber-800 font-medium">
                {pendingRequestsCount > 0 ? 'Awaiting payment approval' : 'All applications handled'}
              </p>
            </div>
          </div>

          {/* Quick Inspection & Jump Area */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Live Workspace Inspection Mode
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  As the Master Super Admin, you can switch into any tenant's isolated environment to inspect their clients, tasks, and setup.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {workspaces.map(ws => {
                const stats = calculateTenantStats(ws.id);
                return (
                  <div
                    key={ws.id}
                    className="p-4 rounded-2xl border border-[#ECE6DD] hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50 transition-all flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-xs text-stone-900">{ws.name}</div>
                      <div className="text-[11px] text-stone-500">{ws.ownerFullName} · {stats.clientCount} Clients</div>
                    </div>
                    <button
                      onClick={() => handleInspectWorkspace(ws.id)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                    >
                      <Eye className="w-3 h-3 text-amber-400" />
                      <span>Inspect</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Payments Preview */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-stone-700" />
                Recent Verified Manual Payments
              </h3>
              <button
                onClick={() => setActiveTab('payments')}
                className="text-xs font-bold text-stone-700 hover:text-stone-900 flex items-center gap-1"
              >
                View Full Ledger <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="border border-[#ECE6DD] rounded-2xl overflow-hidden divide-y divide-[#ECE6DD] text-xs">
              {payments.slice(0, 4).map(p => (
                <div key={p.id} className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-stone-50">
                  <div>
                    <div className="font-bold text-stone-900 flex items-center gap-2">
                      <span>{p.userName} ({p.businessName})</span>
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[10px] font-bold uppercase">
                        {p.paymentMethod}
                      </span>
                    </div>
                    <div className="text-stone-500 text-[11px] font-mono mt-0.5">
                      Ref: {p.referenceNumber} · Plan: {p.planTier}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-stone-900">{p.currency} {p.amount.toLocaleString()}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">
                      Verified on {new Date(p.verifiedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: WORKSPACES & USERS DIRECTORY */}
      {activeTab === 'tenants' && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#ECE6DD] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search by workspace, owner name, email, or tenant ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-[#ECE6DD] rounded-2xl text-xs font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3.5 py-2.5 bg-white border border-[#ECE6DD] rounded-2xl text-xs font-bold text-stone-700 focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
              </select>

              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-3.5 py-2.5 bg-white border border-[#ECE6DD] rounded-2xl text-xs font-bold text-stone-700 focus:outline-hidden"
              >
                <option value="all">All Plans</option>
                <option value="starter_freelance">Freelance Starter</option>
                <option value="pro_executive">Executive Pro</option>
                <option value="agency_studio">Agency & Studio</option>
              </select>

              <button
                onClick={reloadData}
                className="p-2.5 bg-stone-50 hover:bg-stone-100 border border-[#ECE6DD] rounded-2xl text-stone-700"
                title="Reload directory"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tenants Directory Table */}
          <div className="bg-white rounded-3xl border border-[#ECE6DD] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-[#ECE6DD] text-stone-500 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Workspace & Owner</th>
                    <th className="px-4 py-4">Plan & Entitlements</th>
                    <th className="px-4 py-4">Usage & Storage</th>
                    <th className="px-4 py-4">Subscription Period</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE6DD] font-medium text-stone-900">
                  {filteredWorkspaces.map(ws => {
                    const stats = calculateTenantStats(ws.id);
                    const isOwner = ws.id === 'ws_ellysa_owner';
                    const isActive = ws.status === 'active';

                    return (
                      <tr key={ws.id} className="hover:bg-stone-50/70 transition-colors">
                        
                        {/* Workspace & Owner */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                              {ws.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="space-y-0.5">
                              <div className="font-black text-stone-900 text-sm flex items-center gap-1.5">
                                <span>{ws.name}</span>
                                {isOwner && (
                                  <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded text-[9px] font-black uppercase">
                                    Master
                                  </span>
                                )}
                              </div>
                              <div className="text-stone-500 text-xs">
                                {ws.ownerFullName} · <span className="font-mono">{ws.ownerEmail}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                            ws.plan === 'agency_studio' ? 'bg-purple-100 text-purple-800' :
                            ws.plan === 'pro_executive' ? 'bg-amber-100 text-amber-800' :
                            'bg-stone-100 text-stone-700'
                          }`}>
                            {ws.subscription?.planName || ws.plan}
                          </span>
                        </td>

                        {/* Resource Stats */}
                        <td className="px-4 py-4">
                          <div className="space-y-0.5">
                            <div className="font-semibold text-stone-800">
                              {stats.clientCount} Clients · {stats.taskCount} Tasks
                            </div>
                            <div className="text-[11px] text-stone-500 font-mono">
                              Storage: {stats.storageUsedKB} KB
                            </div>
                          </div>
                        </td>

                        {/* Subscription Period */}
                        <td className="px-4 py-4">
                          <div className="space-y-0.5">
                            <div className="font-bold text-stone-800">
                              {ws.subscription?.currentPeriodEnd 
                                ? new Date(ws.subscription.currentPeriodEnd).toLocaleDateString()
                                : 'Perpetual'}
                            </div>
                            <div className="text-[11px] text-stone-400 font-mono">
                              Ref: {ws.subscription?.lastPaymentReference || 'DIRECT'}
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                            isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            <span>●</span> {isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Inspect Live */}
                            <button
                              onClick={() => handleInspectWorkspace(ws.id)}
                              className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-all"
                              title="Inspect Workspace Live"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* View Dossier */}
                            <button
                              onClick={() => setInspectModalWorkspace(ws)}
                              className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-all"
                              title="View Details & Storage"
                            >
                              <FileText className="w-4 h-4" />
                            </button>

                            {/* Change Plan */}
                            <button
                              onClick={() => setChangePlanWorkspace(ws)}
                              className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-all"
                              title="Upgrade / Change Plan"
                            >
                              <Layers className="w-4 h-4" />
                            </button>

                            {/* Record Renewal */}
                            <button
                              onClick={() => setRenewalWorkspace(ws)}
                              className="p-2 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-xl transition-all"
                              title="Record Renewal Payment"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>

                            {/* Reset Temp Password */}
                            <button
                              onClick={() => handleResetPassword(ws.ownerUserId || `usr_${ws.id}`, ws.ownerFullName)}
                              className="p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-xl transition-all"
                              title="Generate Temporary Password"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>

                            {/* Suspend / Reactivate */}
                            {!isOwner && (
                              <button
                                onClick={() => handleToggleSubscriptionStatus(ws.id, ws.status, ws.name)}
                                className={`p-2 rounded-xl transition-all ${
                                  isActive 
                                    ? 'text-rose-600 hover:bg-rose-50' 
                                    : 'text-emerald-700 hover:bg-emerald-50'
                                }`}
                                title={isActive ? 'Suspend Workspace' : 'Reactivate Workspace'}
                              >
                                {isActive ? <Lock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                              </button>
                            )}

                            {/* Delete */}
                            {!isOwner && (
                              <button
                                onClick={() => handleDeleteWorkspace(ws.id, ws.ownerUserId || `usr_${ws.id}`, ws.name)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                title="Delete Tenant"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: INBOUND ACCESS REQUESTS QUEUE */}
      {activeTab === 'requests' && (
        <AccessRequestsList
          requests={accessRequests}
          platformSettings={platformSettings}
          onRefresh={reloadData}
          onApproveAndProvision={handleApproveFromRequest}
        />
      )}

      {/* TAB 4: PROVISION NEW TENANT */}
      {activeTab === 'provision' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          
          {/* Result Card when account is created */}
          {provisionResult && provisionResult.success && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 space-y-4 animate-in slide-in-from-top-3">
              <div className="flex items-center gap-3 text-emerald-800">
                <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center">
                  <CheckCheck className="w-6 h-6 text-emerald-800" />
                </div>
                <div>
                  <h3 className="text-lg font-black">Workspace Successfully Provisioned!</h3>
                  <p className="text-xs text-emerald-700">Account and isolated database keys created.</p>
                </div>
              </div>

              {provisionResult.tempPassword && (
                <div className="bg-white p-5 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="font-bold text-xs text-stone-500 uppercase tracking-wider">
                    Client Onboarding Credentials Card
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-stone-500 block">User Name:</span>
                      <span className="font-bold text-stone-900">{provisionResult.fullName}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Login Email:</span>
                      <span className="font-mono font-bold text-stone-900">{provisionResult.email}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Temporary Password:</span>
                      <span className="font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {provisionResult.tempPassword}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 italic">
                    * The user will be automatically required to set a strong new private password upon their first login.
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const text = `Hi ${provisionResult.fullName},\n\nYour AEDMIN OS workspace has been provisioned!\n\n🔗 Login URL: ${window.location.origin}\n📧 Email: ${provisionResult.email}\n🔑 Temporary Password: ${provisionResult.tempPassword}\n\nYou will be prompted to set your new private password upon first login.`;
                        navigator.clipboard.writeText(text);
                        setCopiedCredentials(true);
                        setTimeout(() => setCopiedCredentials(false), 3000);
                      }}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow transition-all"
                    >
                      {copiedCredentials ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedCredentials ? 'Copied Welcome Message!' : 'Copy Client Welcome Email'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Provisioning Form */}
          <div className="bg-white rounded-3xl border border-[#ECE6DD] shadow-xs p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#ECE6DD] pb-4">
              <h2 className="text-xl font-black text-stone-900">Provision Tenant Workspace</h2>
              <p className="text-xs text-stone-500 mt-1">
                Enter freelancer information and verify manual payment details to initialize an isolated environment.
              </p>
            </div>

            <form onSubmit={handleProvisionTenant} className="space-y-6 text-xs">
              
              {/* Account Details */}
              <div className="space-y-3">
                <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] text-stone-400">
                  1. Freelancer / Tenant Account Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Maria Rodriguez"
                      value={provisionName}
                      onChange={e => setProvisionName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Account Email *</label>
                    <input
                      type="email"
                      placeholder="e.g. maria.assistant@ops.com"
                      value={provisionEmail}
                      onChange={e => setProvisionEmail(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Studio / Brand Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Valencia Executive Ops"
                      value={provisionStudio}
                      onChange={e => setProvisionStudio(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Timezone</label>
                    <select
                      value={provisionTimezone}
                      onChange={e => setProvisionTimezone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                    >
                      <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                      <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Currency Symbol</label>
                    <select
                      value={provisionCurrency}
                      onChange={e => setProvisionCurrency(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                    >
                      <option value="$">USD ($)</option>
                      <option value="₱">PHP (₱)</option>
                      <option value="£">GBP (£)</option>
                      <option value="€">EUR (€)</option>
                      <option value="A$">AUD (A$)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Default Hourly Rate</label>
                    <input
                      type="number"
                      value={provisionHourlyRate}
                      onChange={e => setProvisionHourlyRate(Number(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Plan Selection */}
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] text-stone-400">
                  2. Plan Tier & Quota Limits
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {platformSettings.plans.map(p => {
                    const isSelected = provisionPlan === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handlePlanChange(p.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900 shadow-xs'
                            : 'border-[#ECE6DD] bg-white hover:border-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-stone-900 text-sm">{p.name}</span>
                          <span className="font-bold text-stone-900">${p.monthlyPriceUSD}/mo</span>
                        </div>
                        <p className="text-[11px] text-stone-500 leading-relaxed">{p.description}</p>
                        <div className="text-[10px] font-bold text-stone-600 pt-1 border-t border-stone-200">
                          {p.clientLimit === 999 ? 'Unlimited' : p.clientLimit} Clients · {p.storageLimitMB / 1000}GB Storage
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Manual Payment Verification */}
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] text-stone-400">
                  3. Verified Manual Payment Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Billing Cycle</label>
                    <select
                      value={payPeriod}
                      onChange={e => handlePeriodChange(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="annual">Annual (12 Months · 20% Discount)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Payment Method *</label>
                    <select
                      value={payMethod}
                      onChange={e => setPayMethod(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                    >
                      <option value="gcash">GCash (Philippines)</option>
                      <option value="maya">Maya (Philippines)</option>
                      <option value="bank_transfer">Bank Transfer (BDO Unibank)</option>
                      <option value="paypal">PayPal International</option>
                      <option value="wise">Wise Multi-Currency</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Payment Currency</label>
                    <select
                      value={payCurrency}
                      onChange={e => handleCurrencyChange(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="PHP">PHP (₱)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Verified Amount ({payCurrency}) *</label>
                    <input
                      type="number"
                      value={payAmount}
                      onChange={e => setPayAmount(Number(e.target.value) || 0)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-bold text-stone-900 focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Transaction / Reference # *</label>
                    <input
                      type="text"
                      placeholder="e.g. GCASH-98214912"
                      value={payRef}
                      onChange={e => setPayRef(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-mono uppercase focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Admin Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Verified via Maya SMS alert"
                      value={payNotes}
                      onChange={e => setPayNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#ECE6DD]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isSubmitting ? 'Provisioning Workspace...' : 'Complete & Provision Workspace'}</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

      {/* TAB 5: MANUAL PAYMENT LEDGER */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#ECE6DD] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search payments by reference number, client name, email, or studio..."
                value={paymentSearch}
                onChange={e => setPaymentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-[#ECE6DD] rounded-2xl text-xs font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={paymentMethodFilter}
                onChange={e => setPaymentMethodFilter(e.target.value)}
                className="px-3.5 py-2.5 bg-white border border-[#ECE6DD] rounded-2xl text-xs font-bold text-stone-700 focus:outline-hidden"
              >
                <option value="all">All Payment Methods</option>
                <option value="gcash">GCash</option>
                <option value="maya">Maya</option>
                <option value="bank_transfer">Bank Transfer (BDO)</option>
                <option value="paypal">PayPal</option>
                <option value="wise">Wise</option>
              </select>

              <select
                value={paymentCurrencyFilter}
                onChange={e => setPaymentCurrencyFilter(e.target.value)}
                className="px-3.5 py-2.5 bg-white border border-[#ECE6DD] rounded-2xl text-xs font-bold text-stone-700 focus:outline-hidden"
              >
                <option value="all">All Currencies</option>
                <option value="PHP">PHP (₱)</option>
                <option value="USD">USD ($)</option>
              </select>

              <button
                type="button"
                onClick={handleExportPaymentLedgerCSV}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-3xl border border-[#ECE6DD] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-[#ECE6DD] text-stone-500 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Transaction Ref</th>
                    <th className="px-4 py-4">Client / Studio</th>
                    <th className="px-4 py-4">Plan & Period</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Method</th>
                    <th className="px-4 py-4">Verified By</th>
                    <th className="px-6 py-4 text-right">Valid Until</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE6DD] font-medium text-stone-900">
                  {filteredPayments.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-stone-900">
                        {p.referenceNumber}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-stone-900">{p.userName}</div>
                        <div className="text-stone-500 text-[11px]">{p.businessName} · <span className="font-mono">{p.userEmail}</span></div>
                      </td>
                      <td className="px-4 py-4 capitalize">
                        <span className="font-semibold text-stone-800">{p.planTier.replace('_', ' ')}</span>
                        <div className="text-[11px] text-stone-500 capitalize">{p.billingPeriod}</div>
                      </td>
                      <td className="px-4 py-4 font-black text-stone-900 text-sm">
                        {p.currency} {p.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 bg-stone-100 text-stone-800 rounded-full text-xs font-bold uppercase">
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-stone-600">
                        <div>{p.verifiedBy}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{new Date(p.verifiedAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                          <CheckCircle2 className="w-3 h-3" /> {new Date(p.periodEndDate).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 6: PLATFORM & PAYMENT SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl mx-auto">
          
          {settingsSaved && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 font-bold text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Platform and manual payment configuration saved successfully!
            </div>
          )}

          {/* Platform General Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-4 text-xs">
            <h3 className="text-base font-black text-stone-900 flex items-center gap-2 border-b border-[#ECE6DD] pb-3">
              <Building2 className="w-5 h-5 text-stone-700" />
              Platform Branding & Administration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Platform Name</label>
                <input
                  type="text"
                  value={platformSettings.platformName}
                  onChange={e => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Platform Owner / Super Admin Name</label>
                <input
                  type="text"
                  value={platformSettings.ownerName}
                  onChange={e => setPlatformSettings({ ...platformSettings, ownerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Owner Email</label>
                <input
                  type="email"
                  value={platformSettings.ownerEmail}
                  onChange={e => setPlatformSettings({ ...platformSettings, ownerEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Support Email</label>
                <input
                  type="email"
                  value={platformSettings.supportEmail}
                  onChange={e => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods Configuration */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-6 text-xs">
            <h3 className="text-base font-black text-stone-900 flex items-center gap-2 border-b border-[#ECE6DD] pb-3">
              <CreditCard className="w-5 h-5 text-stone-700" />
              Manual Payment Instructions Setup
            </h3>

            {/* GCash */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600" /> GCash (Philippines)
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={platformSettings.manualPaymentInstructions.gcash.enabled}
                    onChange={e => setPlatformSettings({
                      ...platformSettings,
                      manualPaymentInstructions: {
                        ...platformSettings.manualPaymentInstructions,
                        gcash: { ...platformSettings.manualPaymentInstructions.gcash, enabled: e.target.checked }
                      }
                    })}
                    className="rounded border-stone-300 text-stone-900 focus:ring-0"
                  />
                  <span className="font-semibold text-stone-700">Enabled</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">GCash Account Name</label>
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">GCash Mobile Number</label>
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">GCash Payment Instructions</label>
                <textarea
                  rows={2}
                  value={platformSettings.manualPaymentInstructions.gcash.instructions}
                  onChange={e => setPlatformSettings({
                    ...platformSettings,
                    manualPaymentInstructions: {
                      ...platformSettings.manualPaymentInstructions,
                      gcash: { ...platformSettings.manualPaymentInstructions.gcash, instructions: e.target.value }
                    }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ECE6DD] bg-white font-medium"
                />
              </div>
            </div>

            {/* Maya */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" /> Maya (Philippines)
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={platformSettings.manualPaymentInstructions.maya.enabled}
                    onChange={e => setPlatformSettings({
                      ...platformSettings,
                      manualPaymentInstructions: {
                        ...platformSettings.manualPaymentInstructions,
                        maya: { ...platformSettings.manualPaymentInstructions.maya, enabled: e.target.checked }
                      }
                    })}
                    className="rounded border-stone-300 text-stone-900 focus:ring-0"
                  />
                  <span className="font-semibold text-stone-700">Enabled</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Maya Account Name</label>
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Maya Mobile Number</label>
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bank Transfer / BDO */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-stone-700" /> Bank Transfer (BDO Unibank)
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={platformSettings.manualPaymentInstructions.bankTransfer.enabled}
                    onChange={e => setPlatformSettings({
                      ...platformSettings,
                      manualPaymentInstructions: {
                        ...platformSettings.manualPaymentInstructions,
                        bankTransfer: { ...platformSettings.manualPaymentInstructions.bankTransfer, enabled: e.target.checked }
                      }
                    })}
                    className="rounded border-stone-300 text-stone-900 focus:ring-0"
                  />
                  <span className="font-semibold text-stone-700">Enabled</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Bank Name</label>
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Account Name</label>
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Account Number</label>
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* PayPal */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-700" /> PayPal (International USD)
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={platformSettings.manualPaymentInstructions.paypal.enabled}
                    onChange={e => setPlatformSettings({
                      ...platformSettings,
                      manualPaymentInstructions: {
                        ...platformSettings.manualPaymentInstructions,
                        paypal: { ...platformSettings.manualPaymentInstructions.paypal, enabled: e.target.checked }
                      }
                    })}
                    className="rounded border-stone-300 text-stone-900 focus:ring-0"
                  />
                  <span className="font-semibold text-stone-700">Enabled</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">PayPal Email</label>
                  <input
                    type="email"
                    value={platformSettings.manualPaymentInstructions.paypal.email}
                    onChange={e => setPlatformSettings({
                      ...platformSettings,
                      manualPaymentInstructions: {
                        ...platformSettings.manualPaymentInstructions,
                        paypal: { ...platformSettings.manualPaymentInstructions.paypal, email: e.target.value }
                      }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">PayPal.me Payment Link</label>
                  <input
                    type="text"
                    placeholder="https://paypal.me/yourtag"
                    value={platformSettings.manualPaymentInstructions.paypal.paymentLink || ''}
                    onChange={e => setPlatformSettings({
                      ...platformSettings,
                      manualPaymentInstructions: {
                        ...platformSettings.manualPaymentInstructions,
                        paypal: { ...platformSettings.manualPaymentInstructions.paypal, paymentLink: e.target.value }
                      }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Wise */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" /> Wise Multi-Currency
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={platformSettings.manualPaymentInstructions.wise.enabled}
                    onChange={e => setPlatformSettings({
                      ...platformSettings,
                      manualPaymentInstructions: {
                        ...platformSettings.manualPaymentInstructions,
                        wise: { ...platformSettings.manualPaymentInstructions.wise, enabled: e.target.checked }
                      }
                    })}
                    className="rounded border-stone-300 text-stone-900 focus:ring-0"
                  />
                  <span className="font-semibold text-stone-700">Enabled</span>
                </label>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Wise Tag / Account Email</label>
                <input
                  type="text"
                  value={platformSettings.manualPaymentInstructions.wise.emailOrTag}
                  onChange={e => setPlatformSettings({
                    ...platformSettings,
                    manualPaymentInstructions: {
                      ...platformSettings.manualPaymentInstructions,
                      wise: { ...platformSettings.manualPaymentInstructions.wise, emailOrTag: e.target.value }
                    }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE6DD] bg-white font-mono"
                />
              </div>
            </div>

          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
            >
              Save Platform Configuration
            </button>
          </div>

        </form>
      )}

      {/* TAB 7: SYSTEM AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-[#ECE6DD] shadow-xs">
            <h2 className="text-lg font-black text-stone-900 mb-1">Platform System Audit Logs</h2>
            <p className="text-xs text-stone-500 mb-4">
              Real-time audit log of all provisioning, password resets, payment verifications, and tenant actions.
            </p>
            <AuditLogsViewer logs={auditLogs as any} />
          </div>
        </div>
      )}

      {/* MODAL 1: Tenant Details & Resource Usage Inspector */}
      {inspectModalWorkspace && (
        <TenantDetailsModal
          workspace={inspectModalWorkspace}
          payments={payments}
          onClose={() => setInspectModalWorkspace(null)}
          onInspect={(id) => handleInspectWorkspace(id)}
          onChangePlan={(ws) => setChangePlanWorkspace(ws)}
          onRecordRenewal={(ws) => setRenewalWorkspace(ws)}
          onResetPassword={(uid, name) => handleResetPassword(uid, name)}
        />
      )}

      {/* MODAL 2: Change Subscription Plan Tier */}
      {changePlanWorkspace && (
        <ChangePlanModal
          workspace={changePlanWorkspace}
          platformSettings={platformSettings}
          onClose={() => setChangePlanWorkspace(null)}
          onConfirmChange={handleConfirmChangePlan}
        />
      )}

      {/* MODAL 3: Record Renewal Modal */}
      {renewalWorkspace && (
        <RecordRenewalModal
          workspace={renewalWorkspace}
          platformSettings={platformSettings}
          onClose={() => setRenewalWorkspace(null)}
          onConfirmRenewal={handleConfirmRenewal}
        />
      )}

      {/* MODAL 4: Temporary Password Issued Modal */}
      {resetUserResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full rounded-[32px] border border-[#ECE6DD] shadow-2xl p-6 sm:p-8 space-y-4 text-[#18191D]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-stone-900">Temporary Password Generated</h3>
                <p className="text-xs text-stone-500">For {resetUserResult.userName}</p>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <span className="text-stone-500 font-medium block">Credentials:</span>
              <div className="font-mono font-black text-amber-800 text-base bg-white p-3 rounded-xl border border-amber-200 select-all">
                {resetUserResult.tempPassword}
              </div>
              <p className="text-[11px] text-stone-500">
                Send this password to the user. They will be forced to change it on their next login.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(resetUserResult.tempPassword);
                  alert('Password copied to clipboard!');
                }}
                className="px-4 py-2 bg-stone-900 text-white hover:bg-stone-800 rounded-xl text-xs font-bold shadow transition-all"
              >
                Copy Password
              </button>
              <button
                type="button"
                onClick={() => setResetUserResult(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
