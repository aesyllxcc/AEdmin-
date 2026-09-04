import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  Building2, 
  CreditCard, 
  Sparkles, 
  ArrowRight, 
  RefreshCw,
  Search,
  Check,
  Smartphone,
  Globe
} from 'lucide-react';
import { AccessRequest, PlatformSettings } from '@/types/saas';
import { updateAccessRequestStatus } from '@/utils/workspaceManager';

interface AccessRequestsListProps {
  requests: AccessRequest[];
  platformSettings: PlatformSettings;
  onRefresh: () => void;
  onApproveAndProvision: (request: AccessRequest) => void;
}

export function AccessRequestsList({
  requests,
  platformSettings,
  onRefresh,
  onApproveAndProvision
}: AccessRequestsListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [search, setSearch] = useState('');

  const filtered = requests.filter(r => {
    const matchesFilter = filter === 'all' ? true : r.status === filter;
    const matchesSearch = 
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.businessName.toLowerCase().includes(search.toLowerCase()) ||
      r.referenceNumber.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleReject = (id: string) => {
    const reason = prompt('Enter rejection or decline note (optional):', 'Invalid transaction reference');
    if (reason !== null) {
      updateAccessRequestStatus(id, 'rejected', reason);
      onRefresh();
    }
  };

  const getPlanName = (planId: string) => {
    const plan = platformSettings.plans.find(p => p.id === planId);
    return plan?.name || planId;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(['pending', 'all', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === tab
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-[#ECE6DD] hover:bg-stone-50'
              }`}
            >
              {tab} {tab === 'pending' && `(${requests.filter(r => r.status === 'pending').length})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search applicant or ref..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-[#ECE6DD] rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-stone-900 w-48 sm:w-64"
            />
          </div>
          <button
            onClick={onRefresh}
            className="p-2 bg-white border border-[#ECE6DD] rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50"
            title="Refresh requests"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Requests Table / Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#ECE6DD] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 text-base">No Access Requests Found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {filter === 'pending' 
              ? 'All prospective client applications have been reviewed. When users submit the Request Access modal, their payment proof will appear here for instant 1-click provisioning.'
              : 'No matching access requests under the selected filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => {
            const isPending = req.status === 'pending';
            return (
              <div
                key={req.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isPending
                    ? 'bg-white border-amber-300 shadow-sm ring-1 ring-amber-300/50'
                    : 'bg-white border-[#ECE6DD] opacity-80'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Applicant details */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-stone-900 text-base">{req.fullName}</span>
                      <span className="text-stone-400">·</span>
                      <span className="text-xs font-semibold text-stone-600">{req.businessName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        ● {req.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                      <span className="font-mono text-stone-700 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-stone-400" />
                        {req.email}
                      </span>
                      <span>·</span>
                      <span>Inquiry Date: {new Date(req.submittedAt).toLocaleDateString()}</span>
                    </div>

                    {req.notes && (
                      <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200 mt-2 max-w-xl">
                        <span className="font-bold text-stone-900 block mb-0.5">Message / Requirements:</span>
                        <span className="italic leading-relaxed">{req.notes}</span>
                      </p>
                    )}
                  </div>

                  {/* Middle: Direct Contact / Reference Details */}
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 min-w-[200px] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 font-medium">Onboarding Type:</span>
                      <span className="font-bold text-stone-900">Direct Contact</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 font-medium">Contact Email:</span>
                      <a 
                        href={`mailto:${req.email}?subject=${encodeURIComponent('AEDMIN Workspace Setup & Onboarding')}`}
                        className="text-stone-900 font-bold hover:underline"
                      >
                        Reply via Email
                      </a>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onApproveAndProvision(req)}
                          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Provision Workspace</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(req.id)}
                          className="p-2.5 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                          title="Decline request"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-xs text-stone-400 font-medium">
                        {req.status === 'approved' ? `Provisioned on ${req.approvedAt ? new Date(req.approvedAt).toLocaleDateString() : ''}` : `Declined`}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
