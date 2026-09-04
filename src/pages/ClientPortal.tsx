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
  RefreshCw,
  Plus,
  Settings,
  Sliders,
  Edit2,
  Send,
  Save,
  MessageSquare,
  Globe,
  SlidersHorizontal,
  Flame,
  CheckCheck
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BriefingCard } from "@/components/portal/BriefingCard";
import { RecommendationCard } from "@/components/portal/RecommendationCard";
import { ApprovalReviewCard } from "@/components/portal/ApprovalReviewCard";
import { ClientKnowledgeModal } from "@/components/portal/ClientKnowledgeModal";
import { StrategicObjectiveModal } from "@/components/modals/StrategicObjectiveModal";
import { ApprovalModal } from "@/components/modals/ApprovalModal";
import { PortalSetupModal } from "@/components/portal/PortalSetupModal";
import { NotifyClientModal } from "@/components/portal/NotifyClientModal";
import { ExecutiveBriefingCurator } from "@/components/portal/ExecutiveBriefingCurator";
import { ExecutiveBriefingPortalFeed } from "@/components/portal/ExecutiveBriefingPortalFeed";
import { generateInitialDraftBriefing } from "@/utils/executiveBriefingUtils";
import { 
  ClientKnowledgeDocument, 
  ClientStrategicObjective, 
  ClientPortalConfig, 
  ExecutiveBriefingSnapshot 
} from "@/types";

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
    updateStrategicObjective,
    clientKnowledgeDocs,
    userProfile,
    portalClientId,
    setPortalClientId,
    generateClientPortalToken,
    updateClient
  } = useApp();

  const [selectedClientId, setSelectedClientId] = useState<string>(
    portalClientId || (clients.length > 0 ? clients[0].id : '')
  );

  useEffect(() => {
    if (portalClientId && portalClientId !== selectedClientId) {
      setSelectedClientId(portalClientId);
    }
  }, [portalClientId]);

  // Mode: 'curate' (Review & Edit draft) vs 'preview' (Exact client view preview)
  const [viewMode, setViewMode] = useState<'curate' | 'preview'>('curate');

  type PortalTab = 'approvals' | 'briefings' | 'objectives' | 'recommendations' | 'knowledge' | 'billing';
  const [activeTab, setActiveTab] = useState<PortalTab>('approvals');
  const [briefingFilter, setBriefingFilter] = useState<string>('all');
  const [recFilter, setRecFilter] = useState<string>('all');
  const [selectedKbDoc, setSelectedKbDoc] = useState<ClientKnowledgeDocument | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Modals for portal setup and quick content publishing
  const [portalSetupOpen, setPortalSetupOpen] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [objectiveModalOpen, setObjectiveModalOpen] = useState(false);
  const [objectiveToEdit, setObjectiveToEdit] = useState<ClientStrategicObjective | null>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);

  const client = clients.find(c => c.id === selectedClientId) || clients[0];

  // Local draft state for editing before committing to client state
  const [currentDraft, setCurrentDraft] = useState<ExecutiveBriefingSnapshot | null>(null);

  // Initialize draft briefing whenever client changes
  useEffect(() => {
    if (!client) return;
    if (client.portalConfig?.draftBriefing) {
      setCurrentDraft(client.portalConfig.draftBriefing);
    } else {
      const initialDraft = generateInitialDraftBriefing(
        client, 
        tasks, 
        approvals, 
        projects, 
        invoices, 
        userProfile
      );
      setCurrentDraft(initialDraft);
      // Persist draft initially
      updateClient(client.id, {
        portalConfig: {
          ...(client.portalConfig || {}),
          draftBriefing: initialDraft,
          hasUnpublishedDraftChanges: false
        }
      });
    }
  }, [client?.id]);

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

  const handleUpdateDraft = (updatedSnapshot: ExecutiveBriefingSnapshot) => {
    if (!client) return;
    setCurrentDraft(updatedSnapshot);
    updateClient(client.id, {
      portalConfig: {
        ...(client.portalConfig || {}),
        draftBriefing: updatedSnapshot,
        hasUnpublishedDraftChanges: true,
        lastDraftEditedAt: new Date().toISOString()
      }
    });
  };

  const handlePublishToClient = (snapshotToPublish: ExecutiveBriefingSnapshot) => {
    if (!client) return;
    setIsPublishing(true);
    
    setTimeout(() => {
      const publishedVersion = {
        ...snapshotToPublish,
        isPublished: true,
        publishedAt: new Date().toISOString()
      };

      updateClient(client.id, {
        portalConfig: {
          ...(client.portalConfig || {}),
          draftBriefing: snapshotToPublish,
          publishedBriefing: publishedVersion,
          isPublished: true,
          publishedAt: new Date().toISOString(),
          publishedBy: userProfile.fullName,
          hasUnpublishedDraftChanges: false
        }
      });
      setIsPublishing(false);
      setNotifyModalOpen(true);
    }, 300);
  };

  if (!client) {
    return (
      <div className="text-center py-20 bg-white/70 backdrop-blur-xl rounded-[32px] border border-slate-200/80 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">No Client Workspaces Available</h3>
        <p className="text-xs text-slate-500 mt-1">Please create a client workspace first to generate their briefing portal.</p>
      </div>
    );
  }

  // Filter client-specific executive portal data
  const clientBriefings = briefings.filter(b => b.clientId === client.id);
  const filteredBriefings = clientBriefings.filter(b => {
    if (briefingFilter === 'all') return true;
    return b.type === briefingFilter;
  });

  const clientRecommendations = recommendations.filter(r => r.clientId === client.id);
  const filteredRecommendations = clientRecommendations.filter(r => {
    if (recFilter === 'all') return true;
    return r.status === recFilter;
  });

  const clientApprovals = approvals.filter(a => a.clientId === client.id);
  const pendingApprovals = clientApprovals.filter(a => a.status === 'pending');
  const clientObjectives = strategicObjectives.filter(o => o.clientId === client.id);
  const clientDocs = clientKnowledgeDocs.filter(d => d.clientId === client.id);
  const clientInvoices = invoices.filter(i => i.clientId === client.id);

  const purchased = client.purchasedHours || 0;
  const used = client.usedHoursThisMonth || 0;
  const usagePercent = purchased > 0 ? Math.min(100, Math.round((used / purchased) * 100)) : 0;

  const pConfig = client.portalConfig || {};
  const isPublished = pConfig.isPublished === true;
  const hasPendingDraftChanges = pConfig.hasUnpublishedDraftChanges === true;

  const activeBriefingForPreview = currentDraft || pConfig.publishedBriefing || generateInitialDraftBriefing(
    client, tasks, approvals, projects, invoices, userProfile
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. APPLE LIGHT SILVER SOFT GLASS PORTAL COMMAND & STAGING HUB */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-white/95 via-slate-50/90 to-slate-100/90 backdrop-blur-2xl border border-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-6 md:p-8 space-y-6">
        
        {/* Ambient Soft Glow Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-100/40 via-blue-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-100/30 via-slate-100/20 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

        {/* Top Bar: Workspace Selector, Workflow Stepper & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-800 text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Executive Briefing Portal Studio
              </span>

              {isPublished ? (
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live & Published to Client
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-amber-800 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Draft Staging (Unpublished)
                </span>
              )}

              {hasPendingDraftChanges && isPublished && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-[10px] font-bold">
                  Draft Changes Not Yet Published
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              Executive Briefing Desk • {client.company}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Curate the situational briefing your client digests in under 2 minutes. Information remains confidential until you publish.
            </p>
          </div>

          {/* Right Controls: Mode Toggle & Client Workspace Selector */}
          <div className="flex items-center gap-3 flex-wrap shrink-0">
            
            {/* View Mode Toggle: Draft/Curate vs Live Preview */}
            <div className="flex items-center p-1 bg-slate-200/60 rounded-2xl border border-slate-300/60">
              <button
                type="button"
                onClick={() => setViewMode('curate')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'curate'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit2 className="w-3.5 h-3.5" />
                Review & Edit Draft
              </button>

              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'preview'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Portal Preview Mode
              </button>
            </div>

            {/* Client Selector */}
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 pl-2">Client:</span>
              <select
                value={selectedClientId}
                onChange={e => {
                  setSelectedClientId(e.target.value);
                  setPortalClientId(e.target.value);
                }}
                aria-label="Select Client"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/70 border border-slate-300/80 rounded-xl text-xs font-bold text-slate-900 focus:outline-none transition-all cursor-pointer"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.company} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Settings Button */}
            <button
              onClick={() => setPortalSetupOpen(true)}
              className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              title="Portal Permissions & Tab Setup"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* WORKFLOW PIPELINE TRACKER */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[24px] border border-white/90 p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Workflow Cadence:</span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">1. Internal Workspace</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className={`px-2.5 py-0.5 rounded-md ${viewMode === 'curate' ? 'bg-amber-100 text-amber-900 font-extrabold' : 'bg-slate-100 text-slate-700'}`}>
                2. Draft & Curate
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className={`px-2.5 py-0.5 rounded-md ${viewMode === 'preview' ? 'bg-blue-100 text-blue-900 font-extrabold' : 'bg-slate-100 text-slate-700'}`}>
                3. Preview Mode
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className={`px-2.5 py-0.5 rounded-md ${isPublished ? 'bg-emerald-100 text-emerald-900 font-extrabold' : 'bg-slate-100 text-slate-500'}`}>
                4. Client Portal Live
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setNotifyModalOpen(true)}
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Share Memo (Slack/Email)</span>
              </button>

              <a
                href={portalUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>Open Live Client Link</span>
              </a>
            </div>
          </div>
        </div>

        {/* URL Bar & Copy Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full flex-1 flex items-center gap-2 px-4 py-2.5 bg-slate-50/90 border border-slate-200 rounded-2xl font-mono text-xs text-slate-700 overflow-hidden">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate select-all">{portalUrl}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleRegenerateToken}
              disabled={isRegenerating}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Regenerate client security token"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-blue-600' : ''}`} />
              <span>Rotate Key</span>
            </button>

            <button
              onClick={handleCopyLink}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0 active:scale-95 cursor-pointer ${
                copiedLink 
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                  : 'bg-slate-900 hover:bg-black text-white'
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Client URL</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY VIEW MODE CONTENT: CURATOR vs PREVIEW MODE */}
      {viewMode === 'curate' ? (
        <ExecutiveBriefingCurator
          client={client}
          draftBriefing={activeBriefingForPreview}
          tasks={tasks}
          approvals={approvals}
          projects={projects}
          invoices={invoices}
          userProfile={userProfile}
          onUpdateDraft={handleUpdateDraft}
          onPublish={handlePublishToClient}
          onSwitchToPreview={() => setViewMode('preview')}
          isPublishing={isPublishing}
        />
      ) : (
        <div className="space-y-6">
          {/* Floating Action Bar for Preview Mode */}
          <div className="p-4 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                You are viewing the exact live layout as your client will experience it.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('curate')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Back to Edit
              </button>

              <button
                type="button"
                onClick={() => handlePublishToClient(activeBriefingForPreview)}
                disabled={isPublishing}
                className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                {isPublishing ? 'Publishing...' : 'Publish to Client Portal'}
              </button>
            </div>
          </div>

          {/* Actual Feed Component */}
          <ExecutiveBriefingPortalFeed
            client={client}
            briefing={activeBriefingForPreview}
            invoices={invoices}
            projects={projects}
            isPreviewMode={true}
          />
        </div>
      )}

      {/* 3. INTERNAL OPERATIONAL DEEP-DIVE ASSET VAULTS */}
      <div className="pt-8 border-t border-slate-200/80 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-700" />
              Internal Operational Assets & Records
            </h3>
            <p className="text-xs text-slate-500">
              Underlying operational databases backing this client’s briefing desk.
            </p>
          </div>

          {/* Tab navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'approvals', label: `Decisions (${pendingApprovals.length})`, icon: CheckCircle2 },
              { id: 'briefings', label: `Briefing Archives (${clientBriefings.length})`, icon: FileText },
              { id: 'objectives', label: `Objectives (${clientObjectives.length})`, icon: Target },
              { id: 'recommendations', label: `Recommendations (${clientRecommendations.length})`, icon: Lightbulb },
              { id: 'knowledge', label: `SOPs & Manual (${clientDocs.length})`, icon: BookOpen },
              { id: 'billing', label: `Billing Ledger (${clientInvoices.length})`, icon: DollarSign }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: APPROVALS REVIEW */}
        {activeTab === 'approvals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Internal Approvals Database</span>
              <button
                onClick={() => setApprovalModalOpen(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> New Approval Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientApprovals.map(approval => (
                <ApprovalReviewCard
                  key={approval.id}
                  approval={approval}
                  onApprove={(id) => updateApprovalStatus(id, 'approved', 'Approved by EA in internal workspace')}
                  onReject={(id) => updateApprovalStatus(id, 'rejected', 'Flagged for revision')}
                  onAskQuestion={askApprovalQuestion}
                />
              ))}

              {clientApprovals.length === 0 && (
                <div className="col-span-2 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400">No approval items logged for this client.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: BRIEFING ARCHIVES */}
        {activeTab === 'briefings' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBriefings.map(briefing => (
                <BriefingCard key={briefing.id} briefing={briefing} />
              ))}

              {filteredBriefings.length === 0 && (
                <div className="col-span-2 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400">No archived historical briefings on file.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: OBJECTIVES */}
        {activeTab === 'objectives' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Client Strategic Objectives</span>
              <button
                onClick={() => {
                  setObjectiveToEdit(null);
                  setObjectiveModalOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> New Strategic Objective
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientObjectives.map(obj => (
                <div key={obj.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      {obj.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{obj.progressPercentage || 0}%</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{obj.title}</h4>
                  <p className="text-xs text-slate-500">{obj.description}</p>
                </div>
              ))}

              {clientObjectives.length === 0 && (
                <div className="col-span-2 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400">No strategic objectives recorded.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRecommendations.map(rec => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onUpdateStatus={updateRecommendationStatus}
                />
              ))}

              {filteredRecommendations.length === 0 && (
                <div className="col-span-2 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400">No proactive recommendations recorded.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: KNOWLEDGE BASE */}
        {activeTab === 'knowledge' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {clientDocs.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedKbDoc(doc)}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{doc.category}</span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{doc.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{doc.content}</p>
                </div>
              ))}

              {clientDocs.length === 0 && (
                <div className="col-span-3 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400">No SOP documents recorded.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 6: BILLING */}
        {activeTab === 'billing' && (
          <div className="space-y-4">
            <div className="space-y-2">
              {clientInvoices.map(inv => (
                <div key={inv.id} className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900">{inv.invoiceNumber}</span>
                    <p className="text-[11px] text-slate-500">Due {inv.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 font-mono">${(inv.totalAmount || 0).toLocaleString()}</span>
                    <span className={`block text-[10px] font-bold capitalize ${inv.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}

              {clientInvoices.length === 0 && (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400">No invoices issued for this client.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODALS */}
      {selectedKbDoc && (
        <ClientKnowledgeModal
          isOpen={!!selectedKbDoc}
          onClose={() => setSelectedKbDoc(null)}
          doc={selectedKbDoc}
        />
      )}

      <StrategicObjectiveModal
        isOpen={objectiveModalOpen}
        onClose={() => {
          setObjectiveModalOpen(false);
          setObjectiveToEdit(null);
        }}
        objectiveToEdit={objectiveToEdit}
        defaultClientId={client.id}
      />

      <ApprovalModal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        defaultClientId={client.id}
      />

      <PortalSetupModal
        isOpen={portalSetupOpen}
        onClose={() => setPortalSetupOpen(false)}
        client={client}
        onOpenNewObjective={() => {
          setObjectiveToEdit(null);
          setObjectiveModalOpen(true);
        }}
        onOpenNewApproval={() => setApprovalModalOpen(true)}
      />

      <NotifyClientModal
        isOpen={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        client={client}
        portalUrl={portalUrl}
        publishedHighlights={activeBriefingForPreview?.todayItems?.map(i => i.title)}
        pendingApprovalsCount={pendingApprovals.length}
      />

    </div>
  );
}
