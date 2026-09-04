import React, { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Edit3, 
  Plus, 
  Trash2, 
  Sparkles, 
  Save, 
  Send, 
  Check, 
  RefreshCw, 
  Sliders, 
  Layers, 
  Calendar, 
  AlertCircle, 
  Briefcase, 
  Heart, 
  CheckCheck, 
  Clock, 
  DollarSign, 
  ChevronDown, 
  ChevronUp,
  Flame,
  Target
} from 'lucide-react';
import { 
  Client, 
  ExecutiveBriefingSnapshot, 
  ExecutiveBriefingSection, 
  Task, 
  ApprovalItem, 
  Project, 
  Invoice, 
  UserProfile 
} from '@/types';
import { generateInitialDraftBriefing } from '@/utils/executiveBriefingUtils';

interface ExecutiveBriefingCuratorProps {
  client: Client;
  draftBriefing: ExecutiveBriefingSnapshot;
  tasks: Task[];
  approvals: ApprovalItem[];
  projects: Project[];
  invoices: Invoice[];
  userProfile?: UserProfile;
  onUpdateDraft: (updatedBriefing: ExecutiveBriefingSnapshot) => void;
  onPublish: (snapshotToPublish: ExecutiveBriefingSnapshot) => void;
  onSwitchToPreview: () => void;
  isPublishing?: boolean;
}

export const ExecutiveBriefingCurator: React.FC<ExecutiveBriefingCuratorProps> = ({
  client,
  draftBriefing,
  tasks,
  approvals,
  projects,
  invoices,
  userProfile,
  onUpdateDraft,
  onPublish,
  onSwitchToPreview,
  isPublishing = false
}) => {
  const [activeSectionEdit, setActiveSectionEdit] = useState<string>('today');
  const [showSectionManager, setShowSectionManager] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const sections = draftBriefing.sections || [];

  // Helper to update draft
  const updateDraft = (updates: Partial<ExecutiveBriefingSnapshot>) => {
    const updated = {
      ...draftBriefing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    onUpdateDraft(updated);
  };

  const handleSaveDraft = () => {
    updateDraft({});
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleRefreshFromWorkspace = () => {
    if (window.confirm('Re-generate draft briefing from current workspace data? Any custom manual edits will be refreshed.')) {
      const fresh = generateInitialDraftBriefing(client, tasks, approvals, projects, invoices, userProfile);
      // preserve section reordering if existing
      if (draftBriefing.sections && draftBriefing.sections.length > 0) {
        fresh.sections = draftBriefing.sections;
      }
      onUpdateDraft(fresh);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2000);
    }
  };

  // Section Reorder / Toggle Handlers
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // re-index orders
    newSections.forEach((s, idx) => {
      s.order = idx;
    });

    updateDraft({ sections: newSections });
  };

  const toggleSectionVisibility = (id: string) => {
    const newSections = sections.map(s => {
      if (s.id === id) return { ...s, enabled: !s.enabled };
      return s;
    });
    updateDraft({ sections: newSections });
  };

  const renameSection = (id: string, newTitle: string) => {
    const newSections = sections.map(s => {
      if (s.id === id) return { ...s, customTitle: newTitle };
      return s;
    });
    updateDraft({ sections: newSections });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP CURATION TOOLBAR */}
      <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h2 className="text-base font-bold text-slate-900">Briefing Curation & Staging Studio</h2>
            <span className="text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
              Draft Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review, edit, rearrange, or hide any section before publishing to your client.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleRefreshFromWorkspace}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Re-populate briefing draft with latest tasks and approvals"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            Sync Workspace
          </button>

          <button
            type="button"
            onClick={() => setShowSectionManager(!showSectionManager)}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              showSectionManager 
                ? 'bg-purple-50 text-purple-800 border-purple-200' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-purple-600" />
            Customize Sections ({sections.filter(s => s.enabled).length}/{sections.length})
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            {saveToast ? 'Draft Saved!' : 'Save Draft'}
          </button>

          <button
            type="button"
            onClick={onSwitchToPreview}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            Preview Portal
          </button>

          <button
            type="button"
            onClick={() => onPublish(draftBriefing)}
            disabled={isPublishing}
            className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            {isPublishing ? 'Publishing...' : 'Publish to Client'}
          </button>
        </div>
      </div>

      {/* 2. SECTION ORDER & VISIBILITY MANAGER (DRAWER/DRAWER BLOCK) */}
      {showSectionManager && (
        <div className="p-6 rounded-3xl bg-slate-50/80 backdrop-blur-xl border border-slate-200/80 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                Customize Portal Layout, Order & Visibility
              </h3>
              <p className="text-[11px] text-slate-500">
                Drag or use arrows to reorder sections. Hide sections that are not relevant to this client.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSectionManager(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Done Customizing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((sec, idx) => (
              <div 
                key={sec.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  sec.enabled 
                    ? 'bg-white border-slate-200/80 shadow-2xs' 
                    : 'bg-slate-100/70 border-dashed border-slate-300 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400 w-4">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <input
                      type="text"
                      value={sec.customTitle || sec.title}
                      onChange={(e) => renameSection(sec.id, e.target.value)}
                      className="w-full text-xs font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-900 focus:outline-none transition-all"
                      placeholder={sec.title}
                    />
                    <p className="text-[10px] text-slate-400 truncate">{sec.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveSection(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(idx, 'down')}
                    disabled={idx === sections.length - 1}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility(sec.id)}
                    className={`p-1.5 rounded-lg font-semibold text-xs cursor-pointer transition-all ${
                      sec.enabled 
                        ? 'text-emerald-700 hover:bg-emerald-50' 
                        : 'text-slate-400 hover:bg-slate-200'
                    }`}
                    title={sec.enabled ? 'Enabled (Click to hide)' : 'Hidden (Click to show)'}
                  >
                    {sec.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SECTION CONTENT EDITORS (TABBED / ACCORDION) */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Navigation tabs for content editing */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 scrollbar-none">
          {[
            { id: 'today', label: 'Today Summary', icon: Sparkles },
            { id: 'important', label: 'Important Today', icon: Flame },
            { id: 'attention', label: 'Your Attention', icon: AlertCircle },
            { id: 'schedule', label: 'Schedule & Commitments', icon: Calendar },
            { id: 'work', label: 'Work Deliverables', icon: Briefcase },
            { id: 'personal', label: 'Personal & Lifestyle', icon: Heart },
            { id: 'handled', label: 'Handled By EA', icon: CheckCheck },
            { id: 'upcoming', label: 'Upcoming Horizon', icon: Clock },
            { id: 'ea_note', label: 'EA Note & Meta', icon: Edit3 }
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeSectionEdit === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSectionEdit(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: TODAY SUMMARY */}
        {activeSectionEdit === 'today' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Today’s Situational Summary</h3>
                <p className="text-xs text-slate-500">Concise 60-second summary displayed prominently to the client.</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Executive Greeting Headline
              </label>
              <input
                type="text"
                value={draftBriefing.eaGreeting || ''}
                onChange={e => updateDraft({ eaGreeting: e.target.value })}
                placeholder="Good morning, [Name]. Here’s what matters today."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Concise Situational Digest
              </label>
              <textarea
                value={draftBriefing.todaySummary || ''}
                onChange={e => updateDraft({ todaySummary: e.target.value })}
                rows={3}
                placeholder="High-focus operational day. You have 3 critical meetings scheduled..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900 leading-relaxed"
              />
            </div>

            {/* Quick Today Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Today's Spotlight Cards (Up to 3)</span>
                <button
                  type="button"
                  onClick={() => {
                    const items = [...(draftBriefing.todayItems || [])];
                    items.push({
                      id: `ti-${Date.now()}`,
                      time: '02:00 PM',
                      title: 'New Priority Agenda',
                      category: 'Operations',
                      detail: 'Action notes logged by EA',
                      isPriority: false
                    });
                    updateDraft({ todayItems: items });
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Spotlight Card
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(draftBriefing.todayItems || []).map((item, idx) => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={item.time}
                        onChange={e => {
                          const items = [...draftBriefing.todayItems];
                          items[idx].time = e.target.value;
                          updateDraft({ todayItems: items });
                        }}
                        className="text-[11px] font-bold text-purple-700 bg-transparent focus:outline-none"
                        placeholder="Time/Date"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const items = draftBriefing.todayItems.filter((_, i) => i !== idx);
                          updateDraft({ todayItems: items });
                        }}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.title}
                      onChange={e => {
                        const items = [...draftBriefing.todayItems];
                        items[idx].title = e.target.value;
                        updateDraft({ todayItems: items });
                      }}
                      className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                      placeholder="Title"
                    />

                    <input
                      type="text"
                      value={item.detail || ''}
                      onChange={e => {
                        const items = [...draftBriefing.todayItems];
                        items[idx].detail = e.target.value;
                        updateDraft({ todayItems: items });
                      }}
                      className="w-full text-[11px] text-slate-500 bg-transparent focus:outline-none"
                      placeholder="Context detail..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: YOUR ATTENTION (DECISIONS & APPROVALS) */}
        {activeSectionEdit === 'attention' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Your Attention Required (Decisions & Approvals)</h3>
                <p className="text-xs text-slate-500">Items that require client sign-off before your team can advance.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const items = [...(draftBriefing.attentionItems || [])];
                  items.push({
                    id: `att-${Date.now()}`,
                    title: 'New Sign-Off Request',
                    type: 'approval',
                    deadline: 'Today, 5:00 PM',
                    impact: 'Needed to advance next deliverable sprint',
                    status: 'pending'
                  });
                  updateDraft({ attentionItems: items });
                }}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Decision Item
              </button>
            </div>

            <div className="space-y-3">
              {(draftBriefing.attentionItems || []).map((item, idx) => (
                <div key={item.id} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <select
                        value={item.type}
                        onChange={e => {
                          const items = [...draftBriefing.attentionItems];
                          items[idx].type = e.target.value as any;
                          updateDraft({ attentionItems: items });
                        }}
                        className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-1 rounded-md border border-amber-200"
                      >
                        <option value="approval">Approval</option>
                        <option value="decision">Decision</option>
                        <option value="risk">Risk / Blocker</option>
                        <option value="input">Input Needed</option>
                      </select>

                      <input
                        type="text"
                        value={item.title}
                        onChange={e => {
                          const items = [...draftBriefing.attentionItems];
                          items[idx].title = e.target.value;
                          updateDraft({ attentionItems: items });
                        }}
                        className="flex-1 text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                        placeholder="Decision Title..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.deadline || ''}
                        onChange={e => {
                          const items = [...draftBriefing.attentionItems];
                          items[idx].deadline = e.target.value;
                          updateDraft({ attentionItems: items });
                        }}
                        className="text-[11px] text-slate-500 font-mono bg-transparent w-28 text-right focus:outline-none"
                        placeholder="Due: 5:00 PM"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const items = draftBriefing.attentionItems.filter((_, i) => i !== idx);
                          updateDraft({ attentionItems: items });
                        }}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={item.impact || ''}
                    onChange={e => {
                      const items = [...draftBriefing.attentionItems];
                      items[idx].impact = e.target.value;
                      updateDraft({ attentionItems: items });
                    }}
                    className="w-full text-xs text-slate-600 bg-transparent focus:outline-none"
                    placeholder="Impact note (e.g. Needed to lock in specialized DevOps support)..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SCHEDULE */}
        {activeSectionEdit === 'schedule' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Schedule & Calendar Commitments</h3>
                <p className="text-xs text-slate-500">Meetings, appointments, and prep notes.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const items = [...(draftBriefing.scheduleItems || [])];
                    items.push({
                      id: `sc-pers-${Date.now()}`,
                      time: '05:30 PM - 06:30 PM',
                      title: 'Equinox Personal Training & Mobility',
                      location: 'Equinox Club',
                      prepNote: 'Trainer confirmed; gear packed',
                      isPersonal: true,
                      commitmentType: 'personal'
                    });
                    updateDraft({ scheduleItems: items });
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Personal Item
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const items = [...(draftBriefing.scheduleItems || [])];
                    items.push({
                      id: `sc-${Date.now()}`,
                      time: '04:00 PM - 04:45 PM',
                      title: 'New Calendar Sync',
                      location: 'Google Meet',
                      prepNote: 'Prep notes in Drive',
                      isPersonal: false,
                      commitmentType: 'business'
                    });
                    updateDraft({ scheduleItems: items });
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Business Meeting
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {(draftBriefing.scheduleItems || []).map((item, idx) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="text"
                        value={item.time}
                        onChange={e => {
                          const items = [...draftBriefing.scheduleItems];
                          items[idx].time = e.target.value;
                          updateDraft({ scheduleItems: items });
                        }}
                        className="text-xs font-bold font-mono text-blue-800 bg-transparent w-36 focus:outline-none"
                        placeholder="Time range"
                      />
                      <input
                        type="text"
                        value={item.location || ''}
                        onChange={e => {
                          const items = [...draftBriefing.scheduleItems];
                          items[idx].location = e.target.value;
                          updateDraft({ scheduleItems: items });
                        }}
                        className="text-xs text-slate-400 bg-transparent flex-1 focus:outline-none"
                        placeholder="Location / Link"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const items = [...draftBriefing.scheduleItems];
                          const nextVal = !items[idx].isPersonal;
                          items[idx].isPersonal = nextVal;
                          items[idx].commitmentType = nextVal ? 'personal' : 'business';
                          updateDraft({ scheduleItems: items });
                        }}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                          item.isPersonal 
                            ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                        title="Click to toggle between Personal & Lifestyle and Business"
                      >
                        {item.isPersonal ? (
                          <>
                            <Heart className="w-3 h-3 text-rose-600" />
                            Personal & Lifestyle
                          </>
                        ) : (
                          <>
                            <Briefcase className="w-3 h-3 text-blue-600" />
                            Business
                          </>
                        )}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.title}
                      onChange={e => {
                        const items = [...draftBriefing.scheduleItems];
                        items[idx].title = e.target.value;
                        updateDraft({ scheduleItems: items });
                      }}
                      className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                      placeholder="Meeting Title"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.prepNote || ''}
                      onChange={e => {
                        const items = [...draftBriefing.scheduleItems];
                        items[idx].prepNote = e.target.value;
                        updateDraft({ scheduleItems: items });
                      }}
                      className="text-[11px] text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 w-44 focus:outline-none"
                      placeholder="Prep notes..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const items = draftBriefing.scheduleItems.filter((_, i) => i !== idx);
                        updateDraft({ scheduleItems: items });
                      }}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: IMPORTANT TODAY */}
        {activeSectionEdit === 'important' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Important Today Highlights</h3>
                <p className="text-xs text-slate-500">Critical deadlines, travel movements, and high-impact logistics.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const items = [...(draftBriefing.importantItems || [])];
                  items.push({
                    id: `imp-${Date.now()}`,
                    title: 'New Critical Highlight',
                    detail: 'Context description',
                    impact: 'high',
                    category: 'Operations'
                  });
                  updateDraft({ importantItems: items });
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Highlight
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(draftBriefing.importantItems || []).map((item, idx) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={item.category || ''}
                      onChange={e => {
                        const items = [...draftBriefing.importantItems];
                        items[idx].category = e.target.value;
                        updateDraft({ importantItems: items });
                      }}
                      className="text-[10px] font-bold uppercase text-slate-500 bg-transparent focus:outline-none"
                      placeholder="Category"
                    />
                    <div className="flex items-center gap-1">
                      <select
                        value={item.impact}
                        onChange={e => {
                          const items = [...draftBriefing.importantItems];
                          items[idx].impact = e.target.value as any;
                          updateDraft({ importantItems: items });
                        }}
                        className="text-[10px] font-bold rounded bg-white border border-slate-200"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="info">Info</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const items = draftBriefing.importantItems.filter((_, i) => i !== idx);
                          updateDraft({ importantItems: items });
                        }}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={item.title}
                    onChange={e => {
                      const items = [...draftBriefing.importantItems];
                      items[idx].title = e.target.value;
                      updateDraft({ importantItems: items });
                    }}
                    className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                    placeholder="Highlight Title"
                  />

                  <textarea
                    value={item.detail || ''}
                    onChange={e => {
                      const items = [...draftBriefing.importantItems];
                      items[idx].detail = e.target.value;
                      updateDraft({ importantItems: items });
                    }}
                    rows={2}
                    className="w-full text-[11px] text-slate-600 bg-transparent focus:outline-none"
                    placeholder="Detail description..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: WORK */}
        {activeSectionEdit === 'work' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Work & Active Deliverables</h3>
                <p className="text-xs text-slate-500">Project progress, milestone status, and sprint updates.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const items = [...(draftBriefing.workItems || [])];
                  items.push({
                    id: `wi-${Date.now()}`,
                    title: 'New Strategic Workstream',
                    category: 'Strategy',
                    status: 'In Progress',
                    progressPercent: 60,
                    summary: 'Deliverables tracking smoothly.'
                  });
                  updateDraft({ workItems: items });
                }}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Workstream
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(draftBriefing.workItems || []).map((item, idx) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={item.category}
                      onChange={e => {
                        const items = [...draftBriefing.workItems];
                        items[idx].category = e.target.value;
                        updateDraft({ workItems: items });
                      }}
                      className="text-[10px] font-bold text-teal-800 bg-transparent focus:outline-none"
                      placeholder="Category"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={item.status}
                        onChange={e => {
                          const items = [...draftBriefing.workItems];
                          items[idx].status = e.target.value;
                          updateDraft({ workItems: items });
                        }}
                        className="text-xs font-bold text-slate-700 bg-transparent text-right w-20 focus:outline-none"
                        placeholder="Status"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const items = draftBriefing.workItems.filter((_, i) => i !== idx);
                          updateDraft({ workItems: items });
                        }}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={item.title}
                    onChange={e => {
                      const items = [...draftBriefing.workItems];
                      items[idx].title = e.target.value;
                      updateDraft({ workItems: items });
                    }}
                    className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                    placeholder="Project Title"
                  />

                  <textarea
                    value={item.summary || ''}
                    onChange={e => {
                      const items = [...draftBriefing.workItems];
                      items[idx].summary = e.target.value;
                      updateDraft({ workItems: items });
                    }}
                    rows={2}
                    className="w-full text-xs text-slate-600 bg-transparent focus:outline-none"
                    placeholder="Summary of active deliverables..."
                  />

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold">Progress:</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={item.progressPercent || 0}
                      onChange={e => {
                        const items = [...draftBriefing.workItems];
                        items[idx].progressPercent = parseInt(e.target.value) || 0;
                        updateDraft({ workItems: items });
                      }}
                      className="w-16 text-xs font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200"
                    />
                    <span className="text-[10px] text-slate-400">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PERSONAL */}
        {activeSectionEdit === 'personal' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Personal & Lifestyle Details</h3>
                <p className="text-xs text-slate-500">Travel details, reservations, appointments, and wellness.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const items = [...(draftBriefing.personalItems || [])];
                  items.push({
                    id: `pi-${Date.now()}`,
                    title: 'New Personal Item',
                    category: 'Travel',
                    timeOrDate: 'Tomorrow',
                    summary: 'Details and reservations confirmed.'
                  });
                  updateDraft({ personalItems: items });
                }}
                className="text-xs font-bold text-pink-700 hover:text-pink-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Personal Item
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(draftBriefing.personalItems || []).map((item, idx) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={item.category}
                      onChange={e => {
                        const items = [...draftBriefing.personalItems];
                        items[idx].category = e.target.value;
                        updateDraft({ personalItems: items });
                      }}
                      className="text-[10px] font-bold text-pink-700 bg-transparent focus:outline-none"
                      placeholder="Category"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const items = draftBriefing.personalItems.filter((_, i) => i !== idx);
                        updateDraft({ personalItems: items });
                      }}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.title}
                    onChange={e => {
                      const items = [...draftBriefing.personalItems];
                      items[idx].title = e.target.value;
                      updateDraft({ personalItems: items });
                    }}
                    className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                    placeholder="Title"
                  />

                  <input
                    type="text"
                    value={item.timeOrDate || ''}
                    onChange={e => {
                      const items = [...draftBriefing.personalItems];
                      items[idx].timeOrDate = e.target.value;
                      updateDraft({ personalItems: items });
                    }}
                    className="w-full text-[10px] font-mono text-slate-400 bg-transparent focus:outline-none"
                    placeholder="Date / Time"
                  />

                  <textarea
                    value={item.summary || ''}
                    onChange={e => {
                      const items = [...draftBriefing.personalItems];
                      items[idx].summary = e.target.value;
                      updateDraft({ personalItems: items });
                    }}
                    rows={2}
                    className="w-full text-[11px] text-slate-600 bg-transparent focus:outline-none"
                    placeholder="Summary..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: HANDLED BY YOUR EA */}
        {activeSectionEdit === 'handled' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Handled By Your EA</h3>
                <p className="text-xs text-slate-500">Showcase resolved issues, delegated tasks, and completed administrative work.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const items = [...(draftBriefing.handledItems || [])];
                  items.push({
                    id: `hi-${Date.now()}`,
                    title: 'New Action Handled',
                    timeAgo: 'Just now',
                    category: 'Inbox Triage',
                    completed: true
                  });
                  updateDraft({ handledItems: items });
                }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Handled Action
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(draftBriefing.handledItems || []).map((item, idx) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={item.category || ''}
                      onChange={e => {
                        const items = [...draftBriefing.handledItems];
                        items[idx].category = e.target.value;
                        updateDraft({ handledItems: items });
                      }}
                      className="text-[10px] font-bold uppercase text-emerald-800 bg-transparent focus:outline-none"
                      placeholder="Category"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={item.timeAgo || ''}
                        onChange={e => {
                          const items = [...draftBriefing.handledItems];
                          items[idx].timeAgo = e.target.value;
                          updateDraft({ handledItems: items });
                        }}
                        className="text-[10px] text-slate-400 bg-transparent text-right w-20 focus:outline-none"
                        placeholder="e.g. 2 hours ago"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const items = draftBriefing.handledItems.filter((_, i) => i !== idx);
                          updateDraft({ handledItems: items });
                        }}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={item.title}
                    onChange={e => {
                      const items = [...draftBriefing.handledItems];
                      items[idx].title = e.target.value;
                      updateDraft({ handledItems: items });
                    }}
                    className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                    placeholder="Action description..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: UPCOMING */}
        {activeSectionEdit === 'upcoming' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Upcoming Horizon</h3>
                <p className="text-xs text-slate-500">Future milestones, renewals, and planned events.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const items = [...(draftBriefing.upcomingItems || [])];
                  items.push({
                    id: `ui-${Date.now()}`,
                    timeframe: 'Next Week',
                    title: 'New Planned Milestone',
                    detail: 'Milestone preparation details'
                  });
                  updateDraft({ upcomingItems: items });
                }}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Upcoming Item
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(draftBriefing.upcomingItems || []).map((item, idx) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={item.timeframe}
                      onChange={e => {
                        const items = [...draftBriefing.upcomingItems];
                        items[idx].timeframe = e.target.value;
                        updateDraft({ upcomingItems: items });
                      }}
                      className="text-[10px] font-bold text-indigo-700 bg-transparent focus:outline-none"
                      placeholder="Timeframe"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const items = draftBriefing.upcomingItems.filter((_, i) => i !== idx);
                        updateDraft({ upcomingItems: items });
                      }}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.title}
                    onChange={e => {
                      const items = [...draftBriefing.upcomingItems];
                      items[idx].title = e.target.value;
                      updateDraft({ upcomingItems: items });
                    }}
                    className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                    placeholder="Title"
                  />

                  <textarea
                    value={item.detail || ''}
                    onChange={e => {
                      const items = [...draftBriefing.upcomingItems];
                      items[idx].detail = e.target.value;
                      updateDraft({ upcomingItems: items });
                    }}
                    rows={2}
                    className="w-full text-[11px] text-slate-500 bg-transparent focus:outline-none"
                    placeholder="Details..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: EA NOTE & META */}
        {activeSectionEdit === 'ea_note' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Strategic Note & Account Status</h3>
              <p className="text-xs text-slate-500">Personal advisory note and overall account cadence message.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Account Status Badge Text
              </label>
              <input
                type="text"
                value={draftBriefing.accountStatusText || ''}
                onChange={e => updateDraft({ accountStatusText: e.target.value })}
                placeholder="All Systems Green • Operational Cadence Active"
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Personal Strategic Guidance from EA
              </label>
              <textarea
                value={draftBriefing.eaNote || ''}
                onChange={e => updateDraft({ eaNote: e.target.value })}
                rows={4}
                placeholder="All calendar briefings for today's investor meetings have been updated..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900 leading-relaxed"
              />
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
