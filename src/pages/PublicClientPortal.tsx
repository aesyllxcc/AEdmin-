import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Check, 
  Sparkles, 
  ExternalLink,
  Lock,
  ArrowRight,
  Send,
  Calendar,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Target,
  BookOpen,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Layers,
  ChevronRight,
  MessageSquare,
  Zap,
  Briefcase
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AppLogo } from "@/components/common/AppLogo";
import { BriefingCard } from "@/components/portal/BriefingCard";
import { RecommendationCard } from "@/components/portal/RecommendationCard";
import { ApprovalReviewCard } from "@/components/portal/ApprovalReviewCard";
import { ClientKnowledgeModal } from "@/components/portal/ClientKnowledgeModal";
import { ExecutiveDecisionBriefingView } from "@/components/portal/ExecutiveDecisionBriefingView";
import { ClientKnowledgeDocument } from "@/types";

export default function PublicClientPortal() {
  const { token, clientId } = useParams<{ token?: string; clientId?: string }>();
  const { 
    clients, 
    approvals, 
    invoices, 
    updateApprovalStatus, 
    askApprovalQuestion,
    briefings,
    recommendations,
    updateRecommendationStatus,
    strategicObjectives,
    clientKnowledgeDocs,
    userProfile, 
    addApproval 
  } = useApp();

  type PortalTab = 'briefing' | 'approvals' | 'recommendations' | 'objectives' | 'knowledge' | 'partnership';
  const [activeTab, setActiveTab] = useState<PortalTab>('briefing');
  
  // Briefings Filter
  const [briefingFilter, setBriefingFilter] = useState<string>('all');
  
  // Recommendations Filter
  const [recFilter, setRecFilter] = useState<string>('all');

  // Knowledge search & category
  const [kbSearch, setKbSearch] = useState('');
  const [kbCategory, setKbCategory] = useState('All');
  const [selectedKbDoc, setSelectedKbDoc] = useState<ClientKnowledgeDocument | null>(null);

  // Quick Priority Request Form
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestTitle, setRequestTitle] = useState("");
  const [requestCategory, setRequestCategory] = useState("Strategic Deliverable");
  const [requestNotes, setRequestNotes] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Find client matching token or ID
  const client = clients.find(c => 
    (token && (c.portalToken === token || c.id === token || c.code.toLowerCase() === token.toLowerCase())) ||
    (clientId && c.id === clientId)
  ) || clients[0]; // Fallback to first client for live preview convenience if token not matched

  if (!client) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white/90 backdrop-blur-xl p-8 rounded-[32px] border border-slate-200/80 shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Private Briefing Desk Secured</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            This workspace portal is private. Please contact your executive lead at {userProfile.email} for your secure access key.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-black transition-all">
            Return to Studio
          </Link>
        </div>
      </div>
    );
  }

  // Client-specific data filtering
  const clientApprovals = approvals.filter(a => a.clientId === client.id);
  const pendingApprovalsCount = clientApprovals.filter(a => a.status === 'pending').length;

  const clientBriefings = briefings.filter(b => b.clientId === client.id);
  const filteredBriefings = clientBriefings.filter(b => {
    if (briefingFilter === 'all') return true;
    return b.type === briefingFilter;
  });

  const clientRecs = recommendations.filter(r => r.clientId === client.id || r.clientId === 'all');
  const filteredRecs = clientRecs.filter(r => {
    if (recFilter === 'all') return true;
    return r.category === recFilter;
  });

  const clientObjectives = strategicObjectives.filter(o => o.clientId === client.id);
  const clientInvoices = invoices.filter(i => i.clientId === client.id);

  // Client Knowledge base articles
  const clientKbArticles = clientKnowledgeDocs.filter(d => d.clientId === client.id || d.clientId === 'all');
  const filteredKb = clientKbArticles.filter(d => {
    const matchesCat = kbCategory === 'All' || d.category === kbCategory;
    const matchesSearch = !kbSearch.trim() || 
      d.title.toLowerCase().includes(kbSearch.toLowerCase()) || 
      d.summary.toLowerCase().includes(kbSearch.toLowerCase()) ||
      d.content.toLowerCase().includes(kbSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const purchased = client.purchasedHours || 0;
  const used = client.usedHoursThisMonth || 0;
  const usagePercent = purchased > 0 ? Math.min(100, Math.round((used / purchased) * 100)) : 0;
  const remainingHours = Math.max(0, purchased - used).toFixed(1);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTitle.trim()) return;

    addApproval({
      clientId: client.id,
      clientName: client.name,
      title: `Executive Request: ${requestTitle}`,
      comments: requestNotes || "Submitted directly through client executive briefing center.",
      context: `Priority request from ${client.primaryContact}. Category: ${requestCategory}`,
      recommendation: "Review context and schedule required production work in next sprint.",
      expectedOutcomes: "Expedited execution aligned with client strategic goal.",
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      type: 'deliverable',
      status: 'pending',
      reviewLink: client.googleDriveFolderUrl || 'https://drive.google.com'
    });

    setRequestTitle("");
    setRequestNotes("");
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setRequestModalOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F4F6] via-[#F8F9FB] to-[#FFFFFF] text-slate-900 font-sans antialiased selection:bg-black selection:text-white">
      
      {/* Top Apple-style Silver Soft Glass Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AppLogo size={32} className="w-8 h-8 drop-shadow-xs" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-tight text-slate-900 uppercase">
                  Executive Briefing Center
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/60 text-slate-600 text-[10px] font-semibold hidden sm:inline-block">
                  Confidential Desk
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] sm:max-w-none">
                {client.name} • {client.company}
              </p>
            </div>
          </div>

          {/* Right Header Status & Controls */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Retainer Capacity Defended
            </span>

            <button
              onClick={() => setRequestModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 shrink-0"
            >
              <Send className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Submit Priority Request</span>
              <span className="sm:hidden">Request</span>
            </button>

            <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-slate-200/80">
              {userProfile.avatarUrl ? (
                <img 
                  src={userProfile.avatarUrl} 
                  alt={userProfile.fullName} 
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center">
                  {userProfile.fullName.charAt(0)}
                </div>
              )}
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">{userProfile.fullName}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{userProfile.title}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Executive Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
        
        {/* Executive Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.05)] p-6 sm:p-8 md:p-10">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-gradient-to-br from-amber-100/40 via-blue-100/30 to-purple-100/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full ${client.avatarColor || 'bg-blue-100'} text-slate-900 text-xs font-bold border border-black/5`}>
                  {client.code} Executive Suite
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                Executive Briefing Desk — {client.primaryContact.split(' ')[0]}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                {client.portalCustomNotes || `Confidential executive command center for strategic decision-making, in-flight momentum briefings, deliverable greenlights, and operational growth opportunities.`}
              </p>
            </div>

            {/* Quick Vault & Cloud Link Hub */}
            <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
              {client.googleDriveFolderUrl && (
                <a
                  href={client.googleDriveFolderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-95"
                >
                  <FileText className="w-4 h-4 text-amber-300" />
                  <span>Master Google Drive Vault</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}
              {client.slackChannel && (
                <div className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Priority Channel: {client.slackChannel}</span>
                </div>
              )}
            </div>
          </div>

          {/* Executive KPI & Health Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-8 pt-6 border-t border-slate-100">
            
            {/* KPI 1: Strategic Priorities On Track */}
            <div className="p-4 rounded-2xl bg-[#F9FAFC] border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Strategic Momentum
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">
                  {clientObjectives.filter(o => o.progressStatus === 'ahead' || o.progressStatus === 'on_track').length} / {clientObjectives.length || 1}
                </span>
                <span className="text-xs text-emerald-700 font-semibold">Objectives On Track</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Outcome velocity aligned with Q3 target</p>
            </div>

            {/* KPI 2: Pending Decisions */}
            <div className="p-4 rounded-2xl bg-[#F9FAFC] border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Decision Queue
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-amber-900">
                  {pendingApprovalsCount} Items
                </span>
                <span className="text-xs text-slate-500 font-medium">awaiting review</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                {pendingApprovalsCount > 0 ? 'Approvals unblock immediate production' : 'Zero blockers in production'}
              </p>
            </div>

            {/* KPI 3: Retainer Balance & Capacity */}
            <div className="p-4 rounded-2xl bg-[#F9FAFC] border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Monthly Retainer Hours
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">{remainingHours}h</span>
                <span className="text-xs text-slate-500 font-medium">available of {purchased}h</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                <div 
                  className={`h-full rounded-full transition-all ${usagePercent > 90 ? 'bg-amber-500' : 'bg-slate-900'}`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>

            {/* KPI 4: Growth Recommendations */}
            <div className="p-4 rounded-2xl bg-[#F9FAFC] border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Strategic Recommendations
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-blue-900">
                  {clientRecs.filter(r => r.status === 'proposed').length} Proposed
                </span>
                <span className="text-xs text-slate-500 font-medium">initiatives</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Proactive optimizations ready to adopt</p>
            </div>

          </div>
        </div>

        {/* Clean Apple-style Liquid Tab Bar */}
        <div className="flex items-center justify-between border-b border-slate-200/90 pb-px overflow-x-auto no-scrollbar">
          <div className="flex gap-2 sm:gap-6 shrink-0">
            <button
              onClick={() => setActiveTab('briefing')}
              className={`pb-3 px-1 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'briefing' 
                  ? 'border-slate-900 text-slate-900' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              Executive Briefings ({clientBriefings.length})
            </button>

            <button
              onClick={() => setActiveTab('approvals')}
              className={`pb-3 px-1 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'approvals' 
                  ? 'border-slate-900 text-slate-900' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Approvals & Decisions
              {pendingApprovalsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className={`pb-3 px-1 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'recommendations' 
                  ? 'border-slate-900 text-slate-900' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              Recommendations Hub ({clientRecs.length})
            </button>

            <button
              onClick={() => setActiveTab('objectives')}
              className={`pb-3 px-1 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'objectives' 
                  ? 'border-slate-900 text-slate-900' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Target className="w-4 h-4" />
              Goals & Outcomes
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`pb-3 px-1 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'knowledge' 
                  ? 'border-slate-900 text-slate-900' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Knowledge Base & SOPs
            </button>

            <button
              onClick={() => setActiveTab('partnership')}
              className={`pb-3 px-1 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'partnership' 
                  ? 'border-slate-900 text-slate-900' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Partnership & Billing
            </button>
          </div>
        </div>

        {/* 1. EXECUTIVE BRIEFINGS & DECISION HUB TAB */}
        {activeTab === 'briefing' && (
          <div className="space-y-8">
            <ExecutiveDecisionBriefingView
              client={client}
              approvals={approvals}
              tasks={[]}
              projects={[]}
              userFullName={userProfile.fullName}
              userTitle={userProfile.title}
              onApprove={(id) => updateApprovalStatus(id, 'approved')}
              onReject={(id) => updateApprovalStatus(id, 'changes_requested')}
              onAskQuestion={(id, q) => askApprovalQuestion(id, client.primaryContact, q)}
            />

            {/* Historical Executive Briefings Archive Section */}
            <div className="pt-6 border-t border-slate-200/90 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Past Executive Briefings & Weekly Archive ({filteredBriefings.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Historical record of weekly briefings, milestone reviews, and end-of-day recaps.
                  </p>
                </div>

                {/* Type Filter Buttons */}
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'weekly_briefing', label: 'Weekly' },
                    { id: 'quick_checkin', label: 'Async' },
                    { id: 'eod_report', label: 'EOD' },
                    { id: 'monthly_review', label: 'Monthly' }
                  ].map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setBriefingFilter(filter.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                        briefingFilter === filter.id
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Briefings List */}
              <div className="space-y-4">
                {filteredBriefings.map((briefing, index) => (
                  <BriefingCard 
                    key={briefing.id} 
                    briefing={briefing} 
                    defaultExpanded={false} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. APPROVALS & DECISIONS TAB */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Strategic Approvals & Review Center
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Context-rich review area with freelancer recommendations, reasoning, expected business outcomes, and interactive question threads.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  {clientApprovals.filter(a => a.status === 'approved').length} of {clientApprovals.length} Approved
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {clientApprovals.map(approval => (
                <ApprovalReviewCard
                  key={approval.id}
                  approval={approval}
                  onUpdateStatus={updateApprovalStatus}
                  onAskQuestion={askApprovalQuestion}
                  clientName={client.primaryContact}
                />
              ))}

              {clientApprovals.length === 0 && (
                <div className="p-12 text-center bg-white/80 rounded-3xl border border-slate-200 text-slate-500 space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900">All Decisions Clear</h3>
                  <p className="text-xs text-slate-500">There are no pending approvals or deliverables requiring review at this time.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. STRATEGIC RECOMMENDATIONS HUB TAB */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Strategic Recommendations & Optimization Hub
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Proactive business growth, operations scaling, systems automation, and cost-savings initiatives curated for your business.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'All Categories' },
                  { id: 'systems_automation', label: 'Automation' },
                  { id: 'cost_savings', label: 'Cost Savings' },
                  { id: 'productivity', label: 'Executive Leverage' },
                  { id: 'business_growth', label: 'Growth' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setRecFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                      recFilter === filter.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredRecs.map(rec => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onUpdateStatus={updateRecommendationStatus}
                />
              ))}

              {filteredRecs.length === 0 && (
                <div className="p-12 text-center bg-white/80 rounded-3xl border border-slate-200 text-slate-500 space-y-2">
                  <Lightbulb className="w-8 h-8 mx-auto text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">No initiatives in this category</h3>
                  <p className="text-xs text-slate-500">Your executive lead is constantly analyzing opportunities to scale your bandwidth.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. STRATEGIC OBJECTIVES & OUTCOMES TAB */}
        {activeTab === 'objectives' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Strategic Goals & High-Impact Outcomes
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Outcome-focused milestone tracking aligned directly with your high-level business vision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {clientObjectives.map(obj => (
                <div 
                  key={obj.id}
                  className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                      {obj.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      obj.progressStatus === 'ahead'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : obj.progressStatus === 'on_track'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {obj.progressStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {obj.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {obj.strategicIntent}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
                    <strong className="font-bold text-slate-900 block mb-1">Current Outcome Status:</strong>
                    <p className="text-slate-700">{obj.outcomeDescription}</p>
                  </div>

                  {/* Milestones List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Target Milestones & Accomplishments
                    </span>
                    <div className="space-y-2">
                      {obj.milestones.map(m => (
                        <div 
                          key={m.id}
                          className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-start gap-2.5 text-xs"
                        >
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            m.completed ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                          }`}>
                            {m.completed && <Check className="w-3 h-3" />}
                          </div>
                          <div className="space-y-0.5 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`font-bold ${m.completed ? 'text-slate-900 line-through opacity-80' : 'text-slate-900'}`}>
                                {m.title}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500 shrink-0">
                                {m.targetTimeline}
                              </span>
                            </div>
                            {m.outcomeAchieved && (
                              <p className="text-[11px] text-emerald-800 font-medium">
                                ✓ {m.outcomeAchieved}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. KNOWLEDGE BASE & SOPS TAB */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Business Operating Manuals & SOPs
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Instant, transparent access to your executive operating rhythm, decision frameworks, and SOPs.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={kbSearch}
                  onChange={e => setKbSearch(e.target.value)}
                  placeholder="Search manuals & SOPs..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {['All', 'Business Manuals', 'Company SOPs', 'Key Resources & Vaults'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setKbCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                    kbCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredKb.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedKbDoc(doc)}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] transition-all cursor-pointer space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-bold">
                        {doc.category}
                      </span>
                      <span className="text-[11px]">Updated {doc.lastUpdated}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {doc.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Read Manual</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
                  </div>
                </div>
              ))}
            </div>

            {/* Reader Modal */}
            <ClientKnowledgeModal
              document={selectedKbDoc}
              onClose={() => setSelectedKbDoc(null)}
            />

          </div>
        )}

        {/* 6. PARTNERSHIP & BILLING TAB */}
        {activeTab === 'partnership' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Partnership Capacity & Executive Retainer
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Executive-level overview of monthly retainer hours, billing schedule, and historical receipts.
              </p>
            </div>

            {/* Retainer Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Retainer Tier</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    ${(client.monthlyRetainerFee || 5000).toLocaleString()}/month • {purchased} Dedicated Hours
                  </h3>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Effective Hourly Value</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">${client.hourlyRate || 150}/hr</p>
                </div>
              </div>

              {/* Hours Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{used} hours utilized this cycle</span>
                  <span>{remainingHours} hours remaining</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className={`h-full rounded-full transition-all ${usagePercent > 90 ? 'bg-amber-500' : 'bg-slate-900'}`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Invoices List */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">Billing History & Invoices</h3>
              
              <div className="space-y-3">
                {clientInvoices.map(inv => (
                  <div 
                    key={inv.id} 
                    className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{inv.invoiceNumber}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Issued: {inv.issueDate} • Due: {inv.dueDate} {inv.paidDate && `• Paid on ${inv.paidDate}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-base font-mono font-bold text-slate-900">${(inv.total || 0).toLocaleString()}</div>
                        <span className="text-[11px] text-slate-400">Net 14 Retainer</span>
                      </div>

                      {inv.receiptLink && (
                        <a
                          href={inv.receiptLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                          title="View Receipt"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Submit Priority Request Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Submit Priority Request</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Directly dispatched to your executive lead's priority queue.
                </p>
              </div>
              <button
                onClick={() => setRequestModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                ✕
              </button>
            </div>

            {requestSubmitted && (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                Request received! Your executive lead has been alerted.
              </div>
            )}

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Request Title / Outcome
                </label>
                <input 
                  type="text" 
                  value={requestTitle} 
                  onChange={e => setRequestTitle(e.target.value)}
                  placeholder="e.g. Schedule Series B LP presentation dry run" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Category
                </label>
                <select
                  value={requestCategory}
                  onChange={e => setRequestCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Strategic Deliverable">Strategic Deliverable</option>
                  <option value="Calendar Defense & Scheduling">Calendar Defense & Scheduling</option>
                  <option value="Investor / Partner Relations">Investor / Partner Relations</option>
                  <option value="Operations & Systems Setup">Operations & Systems Setup</option>
                  <option value="Urgent Executive Task">Urgent Executive Task</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Key Context & Constraints
                </label>
                <textarea 
                  value={requestNotes} 
                  onChange={e => setRequestNotes(e.target.value)}
                  rows={4}
                  placeholder="Provide background, links, deadlines, or constraints..." 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Request
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Executive Portal Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center text-xs text-slate-400 border-t border-slate-200/80 mt-16">
        <div className="flex items-center justify-center gap-2 mb-2">
          <AppLogo size={20} className="w-4 h-4" />
          <span className="font-semibold text-slate-700">Executive Briefing Center • AEDMIN OS</span>
        </div>
        <p>Private & Confidential Executive Suite • Managed by {userProfile.fullName} ({userProfile.title})</p>
      </footer>

    </div>
  );
}
