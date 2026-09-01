import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  AlertCircle, 
  Check, 
  User, 
  ArrowRight,
  Sparkles,
  Share2,
  Copy,
  Link2,
  Lock,
  Target,
  Lightbulb,
  BookOpen,
  DollarSign,
  Layers,
  ChevronRight,
  Zap,
  Filter,
  Eye,
  RefreshCw
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BriefingCard } from "@/components/portal/BriefingCard";
import { RecommendationCard } from "@/components/portal/RecommendationCard";
import { ApprovalReviewCard } from "@/components/portal/ApprovalReviewCard";
import { ClientKnowledgeModal } from "@/components/portal/ClientKnowledgeModal";
import { ExecutiveDecisionBriefingView } from "@/components/portal/ExecutiveDecisionBriefingView";
import { ClientKnowledgeDocument } from "@/types";

export default function ClientPortal() {
  const { 
    clients, 
    approvals, 
    tasks,
    projects,
    invoices, 
    updateApprovalStatus, 
    askApprovalQuestion,
    briefings,
    recommendations,
    updateRecommendationStatus,
    strategicObjectives,
    clientKnowledgeDocs,
    userProfile,
    portalClientId,
    setPortalClientId,
    generateClientPortalToken
  } = useApp();

  const [selectedClientId, setSelectedClientId] = useState<string>(
    portalClientId || (clients.length > 0 ? clients[0].id : '')
  );

  useEffect(() => {
    if (portalClientId && portalClientId !== selectedClientId) {
      setSelectedClientId(portalClientId);
    }
  }, [portalClientId]);

  type PortalTab = 'briefings' | 'approvals' | 'recommendations' | 'objectives' | 'knowledge' | 'billing';
  const [activeTab, setActiveTab] = useState<PortalTab>('briefings');
  const [briefingFilter, setBriefingFilter] = useState<string>('all');
  const [recFilter, setRecFilter] = useState<string>('all');
  const [selectedKbDoc, setSelectedKbDoc] = useState<ClientKnowledgeDocument | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const client = clients.find(c => c.id === selectedClientId) || clients[0];

  const clientToken = client?.portalToken || client?.id || 'demo-token';
  const portalUrl = `${window.location.origin}/portal/${clientToken}`;

  const handleCopyLink = () => {
    if (!client) return;
    navigator.clipboard.writeText(portalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleRegenerateToken = () => {
    if (!client) return;
    setIsRegenerating(true);
    generateClientPortalToken(client.id);
    setTimeout(() => {
      setIsRegenerating(false);
    }, 400);
  };

  // Filter client-specific executive portal data
  const clientBriefings = briefings.filter(b => b.clientId === client?.id);
  const filteredBriefings = clientBriefings.filter(b => {
    if (briefingFilter === 'all') return true;
    return b.type === briefingFilter;
  });

  const clientRecommendations = recommendations.filter(r => r.clientId === client?.id);
  const filteredRecommendations = clientRecommendations.filter(r => {
    if (recFilter === 'all') return true;
    return r.status === recFilter;
  });

  const clientApprovals = approvals.filter(a => a.clientId === client?.id);
  const pendingApprovals = clientApprovals.filter(a => a.status === 'pending');
  const clientObjectives = strategicObjectives.filter(o => o.clientId === client?.id);
  const clientDocs = clientKnowledgeDocs.filter(d => d.clientId === client?.id);
  const clientInvoices = invoices.filter(i => i.clientId === client?.id);

  const purchased = client?.purchasedHours || 0;
  const used = client?.usedHoursThisMonth || 0;
  const usagePercent = purchased > 0 ? Math.min(100, Math.round((used / purchased) * 100)) : 0;

  if (!client) {
    return (
      <div className="text-center py-20 bg-white/70 backdrop-blur-xl rounded-[32px] border border-slate-200/80 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">No Client Workspaces Available</h3>
        <p className="text-xs text-slate-500 mt-1">Please create a client workspace first to generate their briefing portal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. APPLE LIGHT SILVER SOFT GLASS PORTAL LINK & SIMULATOR DISPATCH HUB */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-white/90 via-slate-50/80 to-slate-100/90 backdrop-blur-2xl border border-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-6 md:p-8 space-y-6">
        
        {/* Soft Ambient Glow Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-100/40 via-blue-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-100/30 via-slate-100/20 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-800 text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Executive Briefing Portal Preview & Dispatch
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[11px] font-bold">
                Isolated Client View
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              Client Portal Preview & Access Keys
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              This preview reflects the dedicated executive briefing desk your client accesses. Internal operator tools, task lists, hourly logs, and CRM memory notes are strictly shielded.
            </p>
          </div>

          {/* Client Workspace Selector Switcher */}
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 shadow-xs shrink-0">
            <span className="text-xs font-semibold text-slate-500 pl-2">Select Client:</span>
            <select
              value={selectedClientId}
              onChange={e => {
                setSelectedClientId(e.target.value);
                setPortalClientId(e.target.value);
              }}
              aria-label="Select Client"
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200/70 border border-slate-300/80 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all cursor-pointer"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.company} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Portal Link Sharing Command Bar */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[24px] border border-white/90 p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5B21B6] border border-purple-100 flex items-center justify-center font-bold text-sm shadow-xs">
                <Link2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Confidential Client Access Link
                </h3>
                <p className="text-[11px] text-slate-500">
                  Unique secured URL generated exclusively for <span className="font-semibold text-slate-800">{client.primaryContact}</span> at {client.company}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRegenerateToken}
                disabled={isRegenerating}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Regenerate secure access token"
              >
                <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin text-blue-600' : ''}`} />
                <span>Rotate Key</span>
              </button>

              <a
                href={portalUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>Open in New Tab</span>
              </a>
            </div>
          </div>

          {/* URL Bar & Copy Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <div className="w-full flex-1 flex items-center gap-2 px-4 py-2.5 bg-slate-50/90 border border-slate-200 rounded-2xl font-mono text-xs text-slate-700 overflow-hidden">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate select-all">{portalUrl}</span>
            </div>

            <button
              onClick={handleCopyLink}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 active:scale-95 ${
                copiedLink 
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                  : 'bg-slate-900 hover:bg-black text-white'
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Portal Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Client Portal Link</span>
                </>
              )}
            </button>
          </div>

          {/* Privacy & Governance Notice */}
          <div className="flex items-start gap-2 pt-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-700 font-semibold">Zero Internal Noise Principle:</strong> Clients see high-level briefings, strategic recommendations, milestone sign-offs, and outcomes. They will never see internal task backlogs, freelancer time logs, hourly rate calculations, or operator CRM notes.
            </p>
          </div>
        </div>

      </div>

      {/* 2. EXECUTIVE BRIEFING PORTAL LIVE SIMULATOR */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-8">
        
        {/* Simulator Client Header Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/70">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${client.avatarColor} flex items-center justify-center text-xl font-extrabold text-slate-900 shadow-sm border border-black/5`}>
              {client.code}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  EXECUTIVE BRIEFING DESK
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Live Preview
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{client.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {client.company} • Executive Partner: <span className="font-semibold text-slate-800">{userProfile.fullName || 'Lead Partner'}</span> ({userProfile.agencyName || 'AEDMIN OS'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200/80 text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Monthly Retainer</span>
              <span className="text-xs font-bold text-slate-800 font-mono">${(client.monthlyRetainerFee || 0).toLocaleString()}/mo</span>
            </div>
            <div className="px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-200/60 text-right">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Hours Used</span>
              <span className="text-xs font-bold text-emerald-950 font-mono">{used}h / {purchased}h</span>
            </div>
          </div>
        </div>

        {/* Simulator Tabs Navigation Bar */}
        <div className="flex border-b border-slate-200/80 gap-6 overflow-x-auto">
          {[
            { id: 'briefings', label: 'Executive Briefings', icon: Target, count: clientBriefings.length },
            { id: 'approvals', label: 'Action & Sign-Offs', icon: CheckCircle2, count: pendingApprovals.length, badgeColor: pendingApprovals.length > 0 ? 'bg-amber-100 text-amber-800' : undefined },
            { id: 'recommendations', label: 'Strategic Recommendations', icon: Lightbulb, count: clientRecommendations.length },
            { id: 'objectives', label: 'Strategic Objectives', icon: Layers, count: clientObjectives.length },
            { id: 'knowledge', label: 'Client Operating Manual', icon: BookOpen, count: clientDocs.length },
            { id: 'billing', label: 'Billing & Terms', icon: DollarSign, count: clientInvoices.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PortalTab)}
                className={`pb-3.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive 
                    ? 'border-slate-900 text-slate-900' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    tab.badgeColor || (isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600')
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: EXECUTIVE BRIEFINGS */}
        {activeTab === 'briefings' && (
          <div className="space-y-8">
            {/* Primary Executive Daily Briefing Desk */}
            <ExecutiveDecisionBriefingView 
              client={client}
              approvals={approvals}
              tasks={tasks}
              projects={projects}
              userFullName={userProfile.fullName || 'Lead Executive Partner'}
              userTitle={userProfile.title || 'Principal EA'}
              onApprove={(id) => updateApprovalStatus(id, 'approved', 'Approved via executive briefing center')}
              onReject={(id) => updateApprovalStatus(id, 'rejected', 'Revision requested')}
              onAskQuestion={(id, q) => askApprovalQuestion(id, q)}
            />

            <div className="pt-6 border-t border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Historical Executive Briefings & Recaps</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Archive of weekly strategic reports and end-of-day digests.</p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
                  {[
                    { id: 'all', label: 'All Updates' },
                    { id: 'weekly_briefing', label: 'Weekly' },
                    { id: 'quick_checkin', label: 'Check-Ins' },
                    { id: 'milestone_report', label: 'Milestones' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setBriefingFilter(f.id)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        briefingFilter === f.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredBriefings.map((briefing, idx) => (
                  <BriefingCard 
                    key={briefing.id} 
                    briefing={briefing} 
                    defaultExpanded={idx === 0} 
                  />
                ))}

                {filteredBriefings.length === 0 && (
                  <div className="text-center py-12 bg-slate-50/60 rounded-2xl border border-slate-200/60">
                    <Target className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-600">No briefings matching this filter.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTION & SIGN-OFFS (APPROVALS) */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Decision & Action Items Awaiting Sign-Off</h3>
                <p className="text-xs text-slate-500 mt-0.5">Context, recommendation reasoning, risk mitigation, and one-click approvals.</p>
              </div>

              <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                {pendingApprovals.length} Pending Client Review
              </div>
            </div>

            <div className="space-y-4">
              {clientApprovals.map(approval => (
                <ApprovalReviewCard
                  key={approval.id}
                  approval={approval}
                  onUpdateStatus={updateApprovalStatus}
                  onAskQuestion={askApprovalQuestion}
                  clientName={client.primaryContact || client.name}
                />
              ))}

              {clientApprovals.length === 0 && (
                <div className="text-center py-12 bg-slate-50/60 rounded-2xl border border-slate-200/60">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">All deliverables and decisions are current. No pending approvals.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: STRATEGIC RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Proactive Strategic Recommendations</h3>
                <p className="text-xs text-slate-500 mt-0.5">High-leverage business moves, automation suggestions, and ROI opportunities.</p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
                {[
                  { id: 'all', label: 'All Moves' },
                  { id: 'proposed', label: 'New' },
                  { id: 'accepted', label: 'Accepted' },
                  { id: 'exploring', label: 'Exploring' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setRecFilter(f.id)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      recFilter === f.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredRecommendations.map(rec => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onUpdateStatus={(id, status, feedback) => updateRecommendationStatus(id, status, feedback)}
                />
              ))}

              {filteredRecommendations.length === 0 && (
                <div className="text-center py-12 bg-slate-50/60 rounded-2xl border border-slate-200/60">
                  <Lightbulb className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">No strategic recommendations matching this filter.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: STRATEGIC OBJECTIVES & ROADMAP */}
        {activeTab === 'objectives' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Strategic Objectives & Outcomes</h3>
              <p className="text-xs text-slate-500 mt-0.5">High-level milestones and quarterly outcomes tracked for this engagement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {clientObjectives.map(obj => (
                <div key={obj.id} className="p-6 rounded-[24px] bg-slate-50/80 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        {obj.timeframe}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">{obj.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{obj.description}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize shrink-0 ${
                      obj.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      obj.status === 'on_track' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {obj.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Milestone Progress</span>
                      <span className="font-mono">{obj.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                      <div className="bg-slate-900 h-full rounded-full transition-all" style={{ width: `${obj.progress}%` }} />
                    </div>
                  </div>

                  {/* Milestones List */}
                  <div className="space-y-2 pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] font-bold text-slate-700 block">Deliverables & Sign-Offs:</span>
                    {obj.milestones.map(m => (
                      <div key={m.id} className="flex items-center justify-between text-xs p-2 bg-white rounded-xl border border-slate-200/60">
                        <div className="flex items-center gap-2">
                          {m.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                          )}
                          <span className={`font-medium ${m.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {m.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{m.targetDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {clientObjectives.length === 0 && (
                <div className="col-span-2 text-center py-12 bg-slate-50/60 rounded-2xl border border-slate-200/60">
                  <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">No strategic objectives defined yet for this workspace.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: CLIENT KNOWLEDGE BASE */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Client Operating Manual & Shared Knowledge</h3>
              <p className="text-xs text-slate-500 mt-0.5">Operating protocols, SOPs, brand references, and technical specifications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientDocs.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedKbDoc(doc)}
                  className="p-5 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer shadow-xs space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{doc.lastUpdated}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {doc.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {doc.content}
                    </p>
                  </div>

                  <div className="text-[11px] font-bold text-blue-600 flex items-center gap-1 pt-1">
                    <span>Read Manual</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}

              {clientDocs.length === 0 && (
                <div className="col-span-full text-center py-12 bg-slate-50/60 rounded-2xl border border-slate-200/60">
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">No operating documents published for this client.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: BILLING & TERMS */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Retainer Allocation & Invoices</h3>
              <p className="text-xs text-slate-500 mt-0.5">High-level financial summaries and invoice receipt downloads.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase text-slate-400">Retainer Fee</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">${(client.monthlyRetainerFee || 0).toLocaleString()}/mo</div>
                <p className="text-[11px] text-slate-500 mt-1">Guaranteed dedicated capacity</p>
              </div>

              <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase text-slate-400">Hours Included</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{purchased} hrs / mo</div>
                <p className="text-[11px] text-slate-500 mt-1">{used} hrs consumed this billing cycle</p>
              </div>

              <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase text-slate-400">Payment Terms</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">Net 14</div>
                <p className="text-[11px] text-slate-500 mt-1">Direct wire or auto-pay</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recent Invoices</h4>
              {clientInvoices.map(inv => (
                <div key={inv.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{inv.invoiceNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">Issued: {inv.issueDate} • Due: {inv.dueDate}</span>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-slate-900">${(inv.total || 0).toLocaleString()}</div>
                    <span className="text-[11px] text-slate-400">Receipt Available</span>
                  </div>
                </div>
              ))}

              {clientInvoices.length === 0 && (
                <p className="text-xs text-slate-500 py-4 text-center">No invoices recorded for this client.</p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Modal for Reading Knowledge Base Docs */}
      <ClientKnowledgeModal
        document={selectedKbDoc}
        onClose={() => setSelectedKbDoc(null)}
      />

    </div>
  );
}
