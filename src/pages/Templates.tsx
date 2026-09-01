import React, { useState } from "react";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Star, 
  Edit, 
  Archive, 
  RotateCcw, 
  Trash2, 
  Play, 
  Layers, 
  FolderKanban, 
  CheckCircle2,
  Clock,
  Tag,
  Building2,
  ExternalLink,
  ChevronRight,
  Code2
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ManagedTemplate, TemplateCategory, GeneratedDraftRecord } from "@/types";
import { TemplateEditorModal } from "@/components/templates/TemplateEditorModal";
import { TemplateRunnerModal } from "@/components/templates/TemplateRunnerModal";
import { CoverLetterGenerator } from "@/components/templates/CoverLetterGenerator";

const CATEGORY_TABS: { id: string; label: string; icon?: any }[] = [
  { id: 'all', label: 'All Templates' },
  { id: 'cover_letter', label: 'Cover Letters' },
  { id: 'proposal', label: 'Proposals & SOW' },
  { id: 'report', label: 'Executive Reports' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'client_communication', label: 'Communications' },
  { id: 'legal_agreement', label: 'Agreements & Legal' },
  { id: 'favorites', label: '⭐ Favorites' },
  { id: 'archived', label: 'Archived' }
];

export default function Templates() {
  const { 
    templates, 
    generatedDrafts, 
    addTemplate, 
    updateTemplate, 
    deleteTemplate, 
    duplicateTemplate, 
    archiveTemplate, 
    restoreTemplate, 
    toggleTemplateFavorite,
    deleteGeneratedDraft,
    updateGeneratedDraft
  } = useApp();

  const [activeTab, setActiveTab] = useState<'library' | 'generator' | 'drafts'>('library');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<ManagedTemplate | null>(null);

  const [runnerModalOpen, setRunnerModalOpen] = useState(false);
  const [templateToRun, setTemplateToRun] = useState<ManagedTemplate | null>(null);

  // Draft inspection / quick edit
  const [activeDraft, setActiveDraft] = useState<GeneratedDraftRecord | null>(null);
  const [draftEditText, setDraftEditText] = useState<string>('');
  const [copiedDraftId, setCopiedDraftId] = useState<string | null>(null);

  // Filter templates
  const filteredTemplates = templates.filter(tpl => {
    // Search
    const matchesSearch = 
      tpl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tpl.tags && tpl.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    if (!matchesSearch) return false;

    if (selectedCategory === 'favorites') return tpl.isFavorite && !tpl.isArchived;
    if (selectedCategory === 'archived') return tpl.isArchived;
    if (tpl.isArchived) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'proposal') return tpl.category === 'proposal' || tpl.category === 'sow';
    return tpl.category === selectedCategory;
  });

  const handleSaveTemplate = (data: Omit<ManagedTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (templateToEdit) {
      updateTemplate(templateToEdit.id, data);
    } else {
      addTemplate(data);
    }
  };

  const handleOpenDraft = (draft: GeneratedDraftRecord) => {
    setActiveDraft(draft);
    setDraftEditText(draft.content);
  };

  const handleSaveDraftChanges = () => {
    if (!activeDraft) return;
    updateGeneratedDraft(activeDraft.id, { content: draftEditText });
    setActiveDraft(prev => prev ? { ...prev, content: draftEditText } : null);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraftId(id);
    setTimeout(() => setCopiedDraftId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-semibold tracking-wide flex items-center gap-1">
              <FileText className="w-3 h-3 text-purple-700" />
              CENTRALIZED TEMPLATE & DRAFT ENGINE
            </span>
            <span className="text-xs text-text-muted font-medium">
              {templates.filter(t => !t.isArchived).length} Templates
            </span>
            <span className="text-xs text-text-muted font-medium">•</span>
            <span className="text-xs text-text-muted font-medium">
              {generatedDrafts.length} Saved Drafts
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mt-1.5">
            Template Management & Cover Letter Generator
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Build parameterized proposals, cover letters, and client documents with dynamic variable injection. Outputs are 100% editable.
          </p>
        </div>

        {/* Master Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setTemplateToEdit(null);
              setEditorModalOpen(true);
            }}
            className="px-5 py-2.5 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Create New Template
          </button>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-px">
        <button
          onClick={() => setActiveTab('library')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'library'
              ? 'border-sidebar-bg text-sidebar-bg'
              : 'border-transparent text-text-muted hover:text-text-main'
          }`}
        >
          <Layers className="w-4 h-4" />
          Template Library ({templates.filter(t => !t.isArchived).length})
        </button>

        <button
          onClick={() => setActiveTab('generator')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'generator'
              ? 'border-sidebar-bg text-sidebar-bg'
              : 'border-transparent text-text-muted hover:text-text-main'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          Cover Letter & Outreach AI Generator
        </button>

        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'drafts'
              ? 'border-sidebar-bg text-sidebar-bg'
              : 'border-transparent text-text-muted hover:text-text-main'
          }`}
        >
          <Clock className="w-4 h-4" />
          Generated Drafts Repository ({generatedDrafts.length})
        </button>
      </div>

      {/* TAB 1: TEMPLATE LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          
          {/* Filter Bar & Search */}
          <div className="p-4 bg-white rounded-[24px] border border-border-subtle shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search templates, variables, keywords..."
                  className="w-full pl-9 pr-4 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>Showing <strong>{filteredTemplates.length}</strong> templates</span>
              </div>
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {CATEGORY_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === tab.id
                      ? 'bg-sidebar-bg text-white shadow-xs'
                      : 'bg-[#FDFBF7] border border-border-subtle text-text-muted hover:text-text-main'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map(tpl => {
              const vars = tpl.variables || [];
              const isArchived = Boolean(tpl.isArchived);

              return (
                <div
                  key={tpl.id}
                  className="p-5 rounded-[24px] bg-white border border-border-subtle hover:border-gray-300 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    
                    {/* Category & Favorite & Actions Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 bg-purple-100/80 px-2.5 py-0.5 rounded-full">
                        {tpl.category.replace('_', ' ')}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleTemplateFavorite(tpl.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            tpl.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-gray-300 hover:text-amber-400'
                          }`}
                          title="Toggle Favorite"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>

                        <button
                          type="button"
                          onClick={() => duplicateTemplate(tpl.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                          title="Duplicate Template"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setTemplateToEdit(tpl);
                            setEditorModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 transition-colors"
                          title="Edit Template Structure"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {!isArchived ? (
                          <button
                            type="button"
                            onClick={() => archiveTemplate(tpl.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 transition-colors"
                            title="Archive"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => restoreTemplate(tpl.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors"
                            title="Restore"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete template "${tpl.title}"?`)) {
                              deleteTemplate(tpl.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-text-main line-clamp-1 group-hover:text-purple-900 transition-colors">
                      {tpl.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                      {tpl.description || 'Flexible reusable template for structured client deliverables.'}
                    </p>

                    {/* Variable Chips */}
                    {vars.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap pt-1">
                        <span className="text-[10px] text-text-muted font-medium">Variables:</span>
                        {vars.slice(0, 3).map(v => (
                          <span key={v.key} className="text-[10px] font-mono bg-[#FDFBF7] text-purple-900 border border-purple-200/60 px-1.5 py-0.2 rounded">
                            {`{{${v.key}}}`}
                          </span>
                        ))}
                        {vars.length > 3 && (
                          <span className="text-[10px] text-gray-400">+{vars.length - 3} more</span>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    {tpl.tags && tpl.tags.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap pt-1">
                        {tpl.tags.map((tg, idx) => (
                          <span key={idx} className="text-[9px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-border-subtle">
                            #{tg}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Card Bottom: Generate / Run Button */}
                  <div className="pt-4 mt-4 border-t border-border-subtle/80 flex items-center justify-between">
                    <span className="text-[10px] text-text-muted">
                      v{tpl.version || 1} • {tpl.usageCount || 0} runs
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setTemplateToRun(tpl);
                        setRunnerModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 text-xs font-bold flex items-center gap-1.5 transition-colors border border-purple-200/60"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      Run / Generate
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-16 bg-white rounded-[28px] border border-border-subtle">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-base font-semibold text-text-main">No Templates Found</h3>
              <p className="text-xs text-text-muted mt-1">Try a different category filter or click "Create New Template".</p>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: COVER LETTER & OUTREACH AI GENERATOR */}
      {activeTab === 'generator' && (
        <CoverLetterGenerator />
      )}

      {/* TAB 3: GENERATED DRAFTS REPOSITORY */}
      {activeTab === 'drafts' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Drafts List (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Saved Drafts ({generatedDrafts.length})
                </h3>
                <span className="text-[11px] text-text-muted">Click to inspect and edit</span>
              </div>

              <div className="space-y-2.5 max-h-[650px] overflow-y-auto custom-scrollbar pr-1">
                {generatedDrafts.map(draft => {
                  const isSelected = activeDraft?.id === draft.id;

                  return (
                    <div
                      key={draft.id}
                      onClick={() => handleOpenDraft(draft)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-purple-50/80 border-purple-300 shadow-xs' 
                          : 'bg-white border-border-subtle hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          {draft.category.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-text-muted">
                          {new Date(draft.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-text-main mt-1.5 truncate">
                        {draft.title}
                      </h4>

                      {draft.clientName && (
                        <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
                          Client: {draft.clientName}
                        </p>
                      )}

                      <p className="text-[11px] text-text-muted line-clamp-2 mt-1">
                        {draft.content}
                      </p>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-border-subtle/50 text-[10px] text-text-muted">
                        <span>{draft.content.split(/\s+/).filter(Boolean).length} words</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this generated draft?')) {
                              deleteGeneratedDraft(draft.id);
                              if (activeDraft?.id === draft.id) setActiveDraft(null);
                            }
                          }}
                          className="text-rose-500 hover:text-rose-700 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}

                {generatedDrafts.length === 0 && (
                  <div className="p-8 text-center bg-white rounded-2xl border border-border-subtle text-text-muted text-xs">
                    No generated drafts saved yet. Run a template or use the Cover Letter Generator to save drafts.
                  </div>
                )}
              </div>
            </div>

            {/* Right: Draft Live Editor & Exporter (7 Cols) */}
            <div className="lg:col-span-7">
              {activeDraft ? (
                <div className="p-5 rounded-[24px] bg-white border border-border-subtle shadow-xs space-y-4 min-h-[580px] flex flex-col justify-between">
                  
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
                    <div>
                      <h3 className="text-sm font-bold text-text-main">{activeDraft.title}</h3>
                      <p className="text-xs text-text-muted">From template: {activeDraft.templateTitle}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyText(activeDraft.id, draftEditText)}
                        className="px-3 py-1.5 rounded-xl bg-[#FDFBF7] hover:bg-gray-100 border border-border-subtle text-text-main text-xs font-semibold flex items-center gap-1.5"
                      >
                        {copiedDraftId === activeDraft.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedDraftId === activeDraft.id ? 'Copied' : 'Copy'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const element = document.createElement("a");
                          const file = new Blob([draftEditText], { type: 'text/markdown;charset=utf-8' });
                          element.href = URL.createObjectURL(file);
                          element.download = `${activeDraft.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#FDFBF7] hover:bg-gray-100 border border-border-subtle text-text-main text-xs font-semibold flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> .MD
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveDraftChanges}
                        className="px-4 py-1.5 rounded-xl bg-sidebar-bg hover:bg-sidebar-active text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        Save Edits
                      </button>
                    </div>
                  </div>

                  {/* Draft Text Canvas (Never Locked) */}
                  <div className="flex-1 min-h-[400px]">
                    <textarea
                      value={draftEditText}
                      onChange={e => setDraftEditText(e.target.value)}
                      className="w-full h-full min-h-[400px] bg-[#FDFBF7] border border-border-subtle rounded-2xl p-5 text-xs text-text-main font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none custom-scrollbar"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-xs text-text-muted">
                    <span>{draftEditText.split(/\s+/).filter(Boolean).length} Words</span>
                    <span className="text-[11px] text-emerald-700 font-semibold">100% Editable Canvas</span>
                  </div>

                </div>
              ) : (
                <div className="h-full min-h-[500px] flex items-center justify-center p-8 bg-white rounded-[24px] border border-border-subtle text-center text-text-muted">
                  <div>
                    <FileText className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-semibold text-text-main">Select a Saved Draft to Inspect & Edit</p>
                    <p className="text-xs text-text-muted mt-1">Or run any template to generate new customized documents.</p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Modals */}
      <TemplateEditorModal
        isOpen={editorModalOpen}
        onClose={() => setEditorModalOpen(false)}
        onSave={handleSaveTemplate}
        templateToEdit={templateToEdit}
      />

      <TemplateRunnerModal
        isOpen={runnerModalOpen}
        onClose={() => setRunnerModalOpen(false)}
        template={templateToRun}
      />

    </div>
  );
}
