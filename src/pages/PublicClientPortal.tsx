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
  MessageSquare, 
  Briefcase, 
  CheckCheck,
  BookOpen,
  DollarSign,
  Target,
  Lightbulb,
  Layers
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AppLogo } from "@/components/common/AppLogo";
import { ExecutiveBriefingPortalFeed } from "@/components/portal/ExecutiveBriefingPortalFeed";
import { ClientKnowledgeModal } from "@/components/portal/ClientKnowledgeModal";
import { generateInitialDraftBriefing } from "@/utils/executiveBriefingUtils";
import { ClientKnowledgeDocument } from "@/types";

export default function PublicClientPortal() {
  const { token, clientId } = useParams<{ token?: string; clientId?: string }>();
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
    strategicObjectives,
    clientKnowledgeDocs,
    userProfile, 
    addApproval 
  } = useApp();

  // Selected knowledge doc modal
  const [selectedKbDoc, setSelectedKbDoc] = useState<ClientKnowledgeDocument | null>(null);

  // Quick Priority Request Form Modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestTitle, setRequestTitle] = useState("");
  const [requestCategory, setRequestCategory] = useState("Strategic Deliverable");
  const [requestNotes, setRequestNotes] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Action Success Toast
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Deep-dive archives view toggle
  const [showArchives, setShowArchives] = useState(false);

  // Find client matching token or ID
  const client = clients.find(c => 
    (token && (c.portalToken === token || c.id === token || c.code.toLowerCase() === token.toLowerCase())) ||
    (clientId && c.id === clientId)
  ) || clients[0]; // Fallback to first client for preview convenience

  if (!client) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white/90 backdrop-blur-xl p-8 rounded-[32px] border border-slate-200/80 shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Private Briefing Desk Secured</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            This workspace portal is private. Please contact your executive lead for your secure access link.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-black transition-all">
            Return to Studio
          </Link>
        </div>
      </div>
    );
  }

  const pConfig = client.portalConfig || {};
  // Always provide active briefing for client view (published, draft, or generated)
  const publishedBriefing = pConfig.publishedBriefing || pConfig.draftBriefing || generateInitialDraftBriefing(
    client, tasks, approvals, projects, invoices, userProfile
  );
  const isPublished = true;

  const handle1ClickApprove = (approvalId: string) => {
    updateApprovalStatus(approvalId, 'approved', 'Approved directly by client in Executive Briefing Desk');
    setActionSuccessMessage('Decision Approved & Recorded. Your EA has been notified.');
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handle1ClickClarification = (approvalId: string, notes: string) => {
    askApprovalQuestion(approvalId, notes);
    setActionSuccessMessage('Notes & clarification request sent to your EA.');
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTitle.trim()) return;

    addApproval({
      clientId: client.id,
      clientName: client.name,
      title: `Client Request: ${requestTitle}`,
      comments: requestNotes || "Submitted via Executive Briefing Portal.",
      context: `Priority request from ${client.primaryContact}. Category: ${requestCategory}`,
      recommendation: "Review context and process in current operational sprint.",
      expectedOutcomes: "Rapid turnaround aligned with executive priorities.",
      dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
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
      setActionSuccessMessage('Priority Request submitted to your Executive Assistant!');
      setTimeout(() => setActionSuccessMessage(null), 3000);
    }, 1500);
  };

  const clientDocs = clientKnowledgeDocs.filter(d => d.clientId === client.id);
  const clientBriefingArchives = briefings.filter(b => b.clientId === client.id);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 font-sans antialiased selection:bg-stone-900 selection:text-white pb-20">
      
      {/* Top Header with Soft Glass */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#ECE6DE] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AppLogo size={32} className="w-8 h-8 drop-shadow-xs" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-tight text-slate-900 uppercase font-sans">
                  {pConfig.portalHeaderTitle || 'Executive Briefing Desk'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/60 text-slate-600 text-[10px] font-semibold hidden sm:inline-block">
                  Confidential
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] sm:max-w-none">
                {client.company} • {client.primaryContact}
              </p>
            </div>
          </div>

          {/* Right Status & Actions */}
          <div className="flex items-center gap-3">
            {client.googleDriveFolderUrl && (
              <a
                href={client.googleDriveFolderUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Drive</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}

            <button
              onClick={() => setRequestModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-full text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>Priority Request</span>
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

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
        
        {/* Floating Toast Notification */}
        {actionSuccessMessage && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
            <CheckCheck className="w-5 h-5 text-white" />
            <span className="text-xs font-bold">{actionSuccessMessage}</span>
          </div>
        )}

        {/* CONDITION: IS BRIEFING PUBLISHED? */}
        {isPublished && publishedBriefing ? (
          <div className="space-y-8">
            
            {/* The Smart Executive Briefing Portal Feed */}
            <ExecutiveBriefingPortalFeed
              client={client}
              briefing={publishedBriefing}
              invoices={invoices}
              projects={projects}
              onApproveDecision={handle1ClickApprove}
              onRequestDecisionChange={handle1ClickClarification}
              onOpenMessageModal={() => setRequestModalOpen(true)}
            />

            {/* Optional Collapsible Drawer for Historical Archives & Operating SOPs */}
            <div className="pt-6 border-t border-slate-200/80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Additional Operational Vaults
                  </h3>
                  <p className="text-xs text-slate-600">
                    Operating manuals, historical briefings, and deep-dive documentation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowArchives(!showArchives)}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                >
                  {showArchives ? 'Hide Operational Vaults' : 'Explore Operational Vaults'}
                </button>
              </div>

              {showArchives && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 animate-in fade-in">
                  
                  {/* SOPs Card */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <h4 className="text-xs font-bold text-slate-900">Operating SOPs & Knowledge Documents</h4>
                    </div>
                    {clientDocs.length > 0 ? (
                      <div className="space-y-1.5">
                        {clientDocs.map(doc => (
                          <div
                            key={doc.id}
                            onClick={() => setSelectedKbDoc(doc)}
                            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs cursor-pointer transition-all"
                          >
                            <span className="font-semibold text-slate-800 truncate">{doc.title}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-mono">v{doc.version || '1.0'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No SOP documents published yet.</p>
                    )}
                  </div>

                  {/* Briefing Archives Card */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <h4 className="text-xs font-bold text-slate-900">Historical Briefing Records</h4>
                    </div>
                    {clientBriefingArchives.length > 0 ? (
                      <div className="space-y-1.5">
                        {clientBriefingArchives.slice(0, 4).map(b => (
                          <div
                            key={b.id}
                            className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs"
                          >
                            <span className="font-semibold text-slate-800 truncate">{b.title}</span>
                            <span className="text-[10px] text-slate-400">{b.date}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No prior archived briefings.</p>
                    )}
                  </div>

                </div>
              )}
            </div>

          </div>
        ) : (
          /* STANDBY STATE: Briefing is currently being curated by EA and has not yet been published */
          <div className="text-center py-20 px-6 max-w-2xl mx-auto bg-white/80 backdrop-blur-2xl rounded-[36px] border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.03)] space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-100 to-blue-100 text-purple-700 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
                Situational Briefing Being Prepared
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Your Executive Briefing is Being Curated
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Your Executive Assistant ({userProfile.fullName}) is currently auditing today's operational updates, decisions, and calendar commitments. 
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 max-w-md mx-auto text-xs text-slate-600 text-left space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>What to Expect in Your Briefing:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-500 pl-1">
                <li>Concise situational digest readable in under 2 minutes</li>
                <li>Instant 1-click approvals for critical blockers</li>
                <li>Upcoming meetings with tailored preparation notes</li>
                <li>Administrative actions already completed by your team</li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setRequestModalOpen(true)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Send Urgent Note to EA
              </button>
            </div>
          </div>
        )}

      </main>

      {/* PRIORITY REQUEST MODAL */}
      {requestModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-[28px] border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                Priority Request to Your EA
              </h3>
              <button 
                onClick={() => setRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {requestSubmitted ? (
              <div className="text-center py-8 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Request Dispatched</h4>
                <p className="text-xs text-slate-500">Your Executive Assistant has received your item and queued it into active production.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateRequest} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Request Title
                  </label>
                  <input
                    type="text"
                    value={requestTitle}
                    onChange={e => setRequestTitle(e.target.value)}
                    placeholder="e.g. Schedule call with investor lead, update board slide..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={requestCategory}
                    onChange={e => setRequestCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-slate-900"
                  >
                    <option value="Calendar & Scheduling">Calendar & Scheduling</option>
                    <option value="Travel & Logistics">Travel & Logistics</option>
                    <option value="Strategic Deliverable">Strategic Deliverable</option>
                    <option value="Inbox Triage">Inbox Triage</option>
                    <option value="Research & Sourcing">Research & Sourcing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Instructions or Context
                  </label>
                  <textarea
                    value={requestNotes}
                    onChange={e => setRequestNotes(e.target.value)}
                    rows={3}
                    placeholder="Provide any critical links, deadlines, or expectations..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-slate-900 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setRequestModalOpen(false)}
                    className="px-4 py-2 text-slate-600 rounded-full hover:bg-slate-100 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Send to EA
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* KNOWLEDGE MODAL */}
      {selectedKbDoc && (
        <ClientKnowledgeModal
          isOpen={!!selectedKbDoc}
          onClose={() => setSelectedKbDoc(null)}
          doc={selectedKbDoc}
        />
      )}

    </div>
  );
}
