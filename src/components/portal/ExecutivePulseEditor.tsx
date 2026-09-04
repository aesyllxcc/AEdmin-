import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Zap, 
  Target, 
  ShieldCheck,
  Save,
  Send,
  Eye,
  Sliders,
  Layers,
  ArrowRight,
  Flame,
  FileText
} from 'lucide-react';
import { Client, ClientPortalConfig, ApprovalItem, ClientStrategicObjective } from '@/types';

interface ExecutivePulseEditorProps {
  client: Client;
  approvals: ApprovalItem[];
  objectives: ClientStrategicObjective[];
  onSaveDraft: (updatedConfig: Partial<ClientPortalConfig>) => void;
  onPublish: (updatedConfig: Partial<ClientPortalConfig>) => void;
  isPublishing?: boolean;
}

export function ExecutivePulseEditor({
  client,
  approvals,
  objectives,
  onSaveDraft,
  onPublish,
  isPublishing = false
}: ExecutivePulseEditorProps) {
  const pConfig = client.portalConfig || {};

  // Form State
  const [pulseStatusText, setPulseStatusText] = useState(
    pConfig.pulseStatusText || 'All Systems Green • Strategic Deliverables On Track'
  );
  const [pulseStatusType, setPulseStatusType] = useState<'optimal' | 'attention' | 'in_review'>(
    pConfig.pulseStatusType || 'optimal'
  );
  const [executiveSummary60s, setExecutiveSummary60s] = useState(
    pConfig.executiveSummary60s || 
    'All quarterly deliverables are tracking smoothly. Review the pending design deliverable below to keep production on schedule for Friday launch.'
  );

  const [highlights, setHighlights] = useState<string[]>(
    pConfig.keyHighlights && pConfig.keyHighlights.length > 0 
      ? pConfig.keyHighlights 
      : [
          'Strategic milestone objectives advanced on schedule',
          'Executive approval queue ready for 1-click review',
          'Capacity and dedicated retainer hours aligned with monthly targets'
        ]
  );

  const [newHighlight, setNewHighlight] = useState('');

  const [priorities, setPriorities] = useState<string[]>(
    pConfig.priorityFocusThisWeek && pConfig.priorityFocusThisWeek.length > 0
      ? pConfig.priorityFocusThisWeek
      : [
          'Deliver executive slide deck and financial model review',
          'Finalize vendor agreements and operational SOPs',
          'Review client feedback on creative draft'
        ]
  );
  const [newPriority, setNewPriority] = useState('');

  const [bannerActive, setBannerActive] = useState(
    pConfig.announcementBanner?.active || false
  );
  const [bannerTitle, setBannerTitle] = useState(
    pConfig.announcementBanner?.title || 'Notice: Scheduled Q3 Strategy Review'
  );
  const [bannerMessage, setBannerMessage] = useState(
    pConfig.announcementBanner?.message || 'Our team will be presenting the quarterly performance review this Thursday at 2:00 PM EST.'
  );

  const [pinnedActionId, setPinnedActionId] = useState(
    pConfig.pinnedActionId || (approvals.find(a => a.clientId === client.id && a.status === 'pending')?.id || '')
  );

  const [isDirty, setIsDirty] = useState(false);
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  // Sync with client prop updates
  useEffect(() => {
    if (client.portalConfig) {
      setPulseStatusText(client.portalConfig.pulseStatusText || 'All Systems Green • Strategic Deliverables On Track');
      setPulseStatusType(client.portalConfig.pulseStatusType || 'optimal');
      setExecutiveSummary60s(
        client.portalConfig.executiveSummary60s || 
        'All quarterly deliverables are tracking smoothly. Review the pending design deliverable below to keep production on schedule for Friday launch.'
      );
      if (client.portalConfig.keyHighlights) {
        setHighlights(client.portalConfig.keyHighlights);
      }
      if (client.portalConfig.priorityFocusThisWeek) {
        setPriorities(client.portalConfig.priorityFocusThisWeek);
      }
      if (client.portalConfig.announcementBanner) {
        setBannerActive(client.portalConfig.announcementBanner.active);
        setBannerTitle(client.portalConfig.announcementBanner.title || '');
        setBannerMessage(client.portalConfig.announcementBanner.message || '');
      }
      if (client.portalConfig.pinnedActionId) {
        setPinnedActionId(client.portalConfig.pinnedActionId);
      }
      setIsDirty(false);
    }
  }, [client.id, client.portalConfig]);

  const markDirty = () => setIsDirty(true);

  // Auto-generate 60-Second Pulse from client live state
  const handleAutoGenerateSnapshot = () => {
    const clientApps = approvals.filter(a => a.clientId === client.id && a.status === 'pending');
    const clientObjs = objectives.filter(o => o.clientId === client.id);
    const completedM = clientObjs.reduce((acc, o) => acc + (o.milestones?.filter(m => m.completed).length || 0), 0);
    const totalM = clientObjs.reduce((acc, o) => acc + (o.milestones?.length || 0), 0);

    const pendingCount = clientApps.length;
    const hoursLeft = Math.max(0, (client.purchasedHours || 0) - (client.usedHoursThisMonth || 0));

    const generatedStatus = pendingCount > 0 
      ? `Action Required • ${pendingCount} Deliverable${pendingCount > 1 ? 's' : ''} Ready for Sign-Off`
      : `All Deliverables Green • ${completedM}/${totalM} Milestones Achieved`;
    
    const generatedMemo = `Summary for ${client.primaryContact}: Operations and strategic deliverables are progressing smoothly with ${hoursLeft.toFixed(0)} retainer hours available. ${pendingCount > 0 ? `Please review and greenlight the pending ${clientApps[0].title} deliverable below.` : 'All key milestones for this sprint have been successfully delivered.'}`;

    const generatedHighlights = [
      `Delivered ${completedM} strategic milestones across active quarterly objectives`,
      pendingCount > 0 ? `${pendingCount} deliverable sign-off pending your 1-click review` : 'All deliverable sign-offs up to date',
      `Dedicated capacity maintained: ${client.usedHoursThisMonth || 0} of ${client.purchasedHours || 0} retainer hours consumed`
    ];

    setPulseStatusText(generatedStatus);
    setPulseStatusType(pendingCount > 0 ? 'attention' : 'optimal');
    setExecutiveSummary60s(generatedMemo);
    setHighlights(generatedHighlights);
    if (clientApps.length > 0) {
      setPinnedActionId(clientApps[0].id);
    }
    setIsDirty(true);
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setHighlights([...highlights, newHighlight.trim()]);
    setNewHighlight('');
    setIsDirty(true);
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const handleAddPriority = () => {
    if (!newPriority.trim()) return;
    setPriorities([...priorities, newPriority.trim()]);
    setNewPriority('');
    setIsDirty(true);
  };

  const handleRemovePriority = (index: number) => {
    setPriorities(priorities.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const constructConfigPayload = (): Partial<ClientPortalConfig> => ({
    ...pConfig,
    pulseStatusText: pulseStatusText.trim(),
    pulseStatusType,
    executiveSummary60s: executiveSummary60s.trim(),
    keyHighlights: highlights,
    priorityFocusThisWeek: priorities,
    pinnedActionId: pinnedActionId || undefined,
    announcementBanner: {
      active: bannerActive,
      title: bannerTitle.trim(),
      message: bannerMessage.trim(),
      type: 'info'
    },
    hasUnpublishedDraftChanges: true,
    lastDraftEditedAt: new Date().toISOString()
  });

  const handleSave = () => {
    const payload = constructConfigPayload();
    onSaveDraft(payload);
    setIsDirty(false);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 2000);
  };

  const handlePublishNow = () => {
    const payload = {
      ...constructConfigPayload(),
      isPublished: true,
      publishedAt: new Date().toISOString(),
      hasUnpublishedDraftChanges: false
    };
    onPublish(payload);
    setIsDirty(false);
  };

  const clientApprovals = approvals.filter(a => a.clientId === client.id);

  return (
    <div className="rounded-[32px] bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6">
      
      {/* Top Header Row with Smart Staging Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Smart 60-Second Pulse Staging Studio
            </span>
            {pConfig.isPublished ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Live Published
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 text-[10px] font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                Draft Only (Unpublished)
              </span>
            )}
          </div>
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
            Review & Edit Client Executive Snapshot
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Craft the high-impact summary your client sees in under 60 seconds. Changes stay in draft until you hit <strong>Publish to Client</strong>.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleAutoGenerateSnapshot}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200/70 text-slate-800 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Auto-generate summary based on active milestones and pending deliverables"
          >
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>Auto-Draft Summary</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
              isDirty
                ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            {showSavedNotification ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Draft Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePublishNow}
            disabled={isPublishing}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-emerald-100" />
            <span>Publish to Client</span>
          </button>
        </div>
      </div>

      {/* Editor Sections */}
      <div className="space-y-5 text-xs">
        
        {/* Row 1: Status Headline & Mood Badge */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <span>Executive Status Headline</span>
              <span className="text-[10px] text-slate-400 font-normal">(Visible at top of 60-second summary)</span>
            </label>
            <input
              type="text"
              value={pulseStatusText}
              onChange={e => {
                setPulseStatusText(e.target.value);
                markDirty();
              }}
              placeholder="e.g. All Systems Green • Q3 Deliverables On Track"
              className="w-full p-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-bold text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Status Indicator Style</label>
            <select
              value={pulseStatusType}
              onChange={e => {
                setPulseStatusType(e.target.value as any);
                markDirty();
              }}
              className="w-full p-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-bold text-slate-800 cursor-pointer"
            >
              <option value="optimal">🟢 Green / Optimal (All Good)</option>
              <option value="attention">⚡ Action Required (Sign-Off Needed)</option>
              <option value="in_review">🟡 In Production Review</option>
            </select>
          </div>
        </div>

        {/* Row 2: 60-Second Executive Memo (2 Sentences) */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 flex items-center justify-between">
            <span>60-Second Executive Memo (Context & Guidance)</span>
            <span className="text-[10px] text-slate-400 font-normal">Keep it to 2 crisp, high-value sentences</span>
          </label>
          <textarea
            rows={2}
            value={executiveSummary60s}
            onChange={e => {
              setExecutiveSummary60s(e.target.value);
              markDirty();
            }}
            placeholder="High-level briefing for the client to digest immediately upon opening..."
            className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none font-medium leading-relaxed text-slate-800"
          />
        </div>

        {/* Row 3: Top 3-4 High-Impact Highlights */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Key Highlights (Top 3 Accomplishments & Statuses)</span>
            </label>
            <span className="text-[10px] text-slate-400">Scannable bullets for fast review</span>
          </div>

          <div className="space-y-2">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={highlight}
                  onChange={e => {
                    const newH = [...highlights];
                    newH[index] = e.target.value;
                    setHighlights(newH);
                    markDirty();
                  }}
                  className="flex-1 p-2 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(index)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Remove highlight"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {highlights.length < 5 && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={e => setNewHighlight(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHighlight();
                    }
                  }}
                  placeholder="+ Add another high-impact highlight..."
                  className="flex-1 p-2 bg-white border border-dashed border-slate-300 rounded-xl focus:outline-none focus:border-slate-800 text-slate-800 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row 4: Spotlight Immediate Action (Pending Approval) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Spotlight Urgent Action / Approval</span>
            </label>
            <p className="text-[10px] text-slate-400">Presents a 1-click decision card at the top of the client's screen</p>
            <select
              value={pinnedActionId}
              onChange={e => {
                setPinnedActionId(e.target.value);
                markDirty();
              }}
              className="w-full p-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-800 cursor-pointer"
            >
              <option value="">-- No specific item spotlighted (Show default queue) --</option>
              {clientApprovals.map(app => (
                <option key={app.id} value={app.id}>
                  {app.status === 'pending' ? '⚡ [PENDING] ' : '✓ '} {app.title || (app as any).deliverableTitle} ({app.status})
                </option>
              ))}
            </select>
          </div>

          {/* Announcement Banner */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-purple-600" />
                <span>Notice / Announcement Banner</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setBannerActive(!bannerActive);
                  markDirty();
                }}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                  bannerActive ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {bannerActive ? 'Banner Active' : 'Banner Off'}
              </button>
            </div>

            {bannerActive && (
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={e => {
                    setBannerTitle(e.target.value);
                    markDirty();
                  }}
                  placeholder="Banner Title (e.g. Scheduled Review Meeting)"
                  className="w-full p-2 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold text-slate-800"
                />
                <input
                  type="text"
                  value={bannerMessage}
                  onChange={e => {
                    setBannerMessage(e.target.value);
                    markDirty();
                  }}
                  placeholder="Banner Message details..."
                  className="w-full p-2 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white text-xs text-slate-700"
                />
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Publication Meta Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>
            {pConfig.publishedAt 
              ? `Last Published Live: ${new Date(pConfig.publishedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
              : 'Status: Draft initialized (Not published yet)'}
          </span>
        </div>
        {pConfig.hasUnpublishedDraftChanges && (
          <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Unsaved staging modifications pending publish
          </span>
        )}
      </div>

    </div>
  );
}
