import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Lightbulb, 
  BookOpen, 
  DollarSign, 
  FileText, 
  Save,
  Check,
  Plus,
  HelpCircle,
  Clock
} from 'lucide-react';
import { Client, ClientPortalConfig } from '@/types';
import { useApp } from '@/context/AppContext';

interface PortalSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onOpenNewObjective?: () => void;
  onOpenNewApproval?: () => void;
  onOpenNewBriefing?: () => void;
  onOpenNewRecommendation?: () => void;
  onOpenNewDoc?: () => void;
}

export function PortalSetupModal({
  isOpen,
  onClose,
  client,
  onOpenNewObjective,
  onOpenNewApproval,
  onOpenNewBriefing,
  onOpenNewRecommendation,
  onOpenNewDoc
}: PortalSetupModalProps) {
  const { updateClient } = useApp();

  const [headerTitle, setHeaderTitle] = useState(
    client.portalConfig?.portalHeaderTitle || 'Client Executive Portal'
  );
  const [welcomeHeadline, setWelcomeHeadline] = useState(
    client.portalConfig?.welcomeHeadline || `${client.name} — Confidential Executive Workspace`
  );
  const [welcomeMessage, setWelcomeMessage] = useState(
    client.portalCustomNotes || 
    client.portalConfig?.welcomeMessage || 
    'Confidential executive command center for strategic decision-making, in-flight momentum briefings, deliverable greenlights, and operational growth opportunities.'
  );

  // Module visibility toggles (default to true)
  const [showBriefings, setShowBriefings] = useState(
    client.portalConfig?.showBriefings !== false
  );
  const [showApprovals, setShowApprovals] = useState(
    client.portalConfig?.showApprovals !== false
  );
  const [showStrategicObjectives, setShowStrategicObjectives] = useState(
    client.portalConfig?.showStrategicObjectives !== false
  );
  const [showRecommendations, setShowRecommendations] = useState(
    client.portalConfig?.showRecommendations !== false
  );
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(
    client.portalConfig?.showKnowledgeBase !== false
  );
  const [showBillingInvoices, setShowBillingInvoices] = useState(
    client.portalConfig?.showBillingInvoices !== false
  );
  const [showRetainerBurnRate, setShowRetainerBurnRate] = useState(
    client.portalConfig?.showRetainerBurnRate !== false
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (client) {
      setHeaderTitle(client.portalConfig?.portalHeaderTitle || 'Client Executive Portal');
      setWelcomeHeadline(client.portalConfig?.welcomeHeadline || `${client.name} — Confidential Executive Workspace`);
      setWelcomeMessage(
        client.portalCustomNotes || 
        client.portalConfig?.welcomeMessage || 
        'Confidential executive command center for strategic decision-making, in-flight momentum briefings, deliverable greenlights, and operational growth opportunities.'
      );
      setShowBriefings(client.portalConfig?.showBriefings !== false);
      setShowApprovals(client.portalConfig?.showApprovals !== false);
      setShowStrategicObjectives(client.portalConfig?.showStrategicObjectives !== false);
      setShowRecommendations(client.portalConfig?.showRecommendations !== false);
      setShowKnowledgeBase(client.portalConfig?.showKnowledgeBase !== false);
      setShowBillingInvoices(client.portalConfig?.showBillingInvoices !== false);
      setShowRetainerBurnRate(client.portalConfig?.showRetainerBurnRate !== false);
    }
  }, [client, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const portalConfig: ClientPortalConfig = {
      ...(client.portalConfig || {}),
      portalHeaderTitle: headerTitle.trim(),
      welcomeHeadline: welcomeHeadline.trim(),
      welcomeMessage: welcomeMessage.trim(),
      showBriefings,
      showApprovals,
      showStrategicObjectives,
      showRecommendations,
      showKnowledgeBase,
      showBillingInvoices,
      showRetainerBurnRate,
      hasUnpublishedDraftChanges: true,
      lastDraftEditedAt: new Date().toISOString()
    };

    updateClient(client.id, {
      portalCustomNotes: welcomeMessage.trim(),
      portalConfig
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white max-w-3xl w-full rounded-[32px] border border-slate-200/80 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-slate-800 shadow-inner">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Client Portal Setup & Permissions
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  {client.name}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Curate and customize exactly what {client.name} sees when accessing their private portal.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          
          {/* Section 1: How the Portal Contents Are Made (Zero Noise Principle) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/40 border border-blue-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold text-slate-900 text-xs block">
                Zero Internal Noise Architecture
              </strong>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                The Client Portal preview dynamically aggregates high-level executive data linked to this client ({client.name}): 
                <strong className="text-slate-800"> Strategic Briefings, Pending Deliverables & Sign-offs, Strategic Objectives, Proactive Recommendations, Knowledge SOPs, and Retainer Invoices</strong>. 
                Clients never see internal operator tasks, raw contractor time entries, or internal CRM notes.
              </p>
            </div>
          </div>

          {/* Section 2: Header & Welcome Customization */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Portal Welcome & Header Directives
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Portal Navigation Header</label>
                <input
                  type="text"
                  value={headerTitle}
                  onChange={e => setHeaderTitle(e.target.value)}
                  placeholder="e.g. Client Executive Portal"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Welcome Headline</label>
                <input
                  type="text"
                  value={welcomeHeadline}
                  onChange={e => setWelcomeHeadline(e.target.value)}
                  placeholder="e.g. Arkstone Capital — Executive Ops Hub"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Custom Welcome Directive / Message</label>
              <textarea
                rows={2}
                value={welcomeMessage}
                onChange={e => setWelcomeMessage(e.target.value)}
                placeholder="Personal greeting, communication expectations, or weekly priority focus..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none font-medium"
              />
            </div>
          </div>

          {/* Section 3: Module Visibility Toggles */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Module Visibility Controls (Client-Facing Tabs)
              </h3>
              <span className="text-[11px] text-slate-500">Toggle on/off based on engagement scope</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Toggle Briefings */}
              <div 
                onClick={() => setShowBriefings(!showBriefings)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  showBriefings ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Executive Briefings</span>
                    <span className="text-[10px] text-slate-500">Weekly briefs & daily digests</span>
                  </div>
                </div>
                {showBriefings ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </div>

              {/* Toggle Approvals */}
              <div 
                onClick={() => setShowApprovals(!showApprovals)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  showApprovals ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Action & Sign-Offs</span>
                    <span className="text-[10px] text-slate-500">Deliverable approvals & greenlights</span>
                  </div>
                </div>
                {showApprovals ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </div>

              {/* Toggle Strategic Objectives */}
              <div 
                onClick={() => setShowStrategicObjectives(!showStrategicObjectives)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  showStrategicObjectives ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Strategic Objectives</span>
                    <span className="text-[10px] text-slate-500">Milestone pacing & outcomes</span>
                  </div>
                </div>
                {showStrategicObjectives ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </div>

              {/* Toggle Recommendations */}
              <div 
                onClick={() => setShowRecommendations(!showRecommendations)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  showRecommendations ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Recommendations Hub</span>
                    <span className="text-[10px] text-slate-500">Proactive optimizations & ideas</span>
                  </div>
                </div>
                {showRecommendations ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </div>

              {/* Toggle Knowledge Base */}
              <div 
                onClick={() => setShowKnowledgeBase(!showKnowledgeBase)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  showKnowledgeBase ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Operating Manual</span>
                    <span className="text-[10px] text-slate-500">Shared SOPs, docs, and assets</span>
                  </div>
                </div>
                {showKnowledgeBase ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </div>

              {/* Toggle Invoices & Billing */}
              <div 
                onClick={() => setShowBillingInvoices(!showBillingInvoices)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  showBillingInvoices ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Invoices & Statements</span>
                    <span className="text-[10px] text-slate-500">Retainer invoices & receipts</span>
                  </div>
                </div>
                {showBillingInvoices ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </div>

              {/* Toggle Retainer Burn Rate Card */}
              <div 
                onClick={() => setShowRetainerBurnRate(!showRetainerBurnRate)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between sm:col-span-2 ${
                  showRetainerBurnRate ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Retainer Capacity & Hours Burn Rate Banner</span>
                    <span className="text-[10px] text-slate-500">Displays current month purchased vs used hours gauge</span>
                  </div>
                </div>
                {showRetainerBurnRate ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </div>

            </div>
          </div>

          {/* Section 4: Quick Content Generation Shortcuts */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              3. Publish New Content to this Portal
            </h3>
            <div className="flex flex-wrap gap-2">
              {onOpenNewObjective && (
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenNewObjective(); }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> New Strategic Objective
                </button>
              )}
              {onOpenNewApproval && (
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenNewApproval(); }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> New Approval / Deliverable
                </button>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Changes reflect immediately on preview and live client portal.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold shadow-md transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Portal Settings
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
