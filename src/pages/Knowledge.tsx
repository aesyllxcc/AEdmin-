import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Search, 
  Plus, 
  FileText, 
  Copy, 
  Check, 
  Tag, 
  Calendar, 
  Edit, 
  Trash2, 
  Sparkles, 
  X, 
  Building2, 
  ShieldCheck, 
  Users, 
  ExternalLink,
  ChevronRight,
  Layers,
  GraduationCap,
  Scale,
  Lock,
  Compass,
  FolderKanban
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { KnowledgeArticle } from "@/types";

const INTERNAL_CATEGORIES: { id: string; label: string; icon?: any }[] = [
  { id: 'all', label: 'All Internal Records' },
  { id: 'sop', label: 'SOPs (Standard Operating Procedures)' },
  { id: 'playbook', label: 'Playbooks & Execution Guides' },
  { id: 'policy', label: 'Policies & Governance' },
  { id: 'training', label: 'Training Materials' },
  { id: 'template', label: 'Operational Templates' }
];

export default function Knowledge() {
  const { 
    knowledgeArticles, 
    addKnowledgeArticle, 
    updateKnowledgeArticle, 
    deleteKnowledgeArticle, 
    clients, 
    projects,
    userProfile 
  } = useApp();

  // Two distinct areas: Internal Knowledge Base vs. Client Knowledge Base
  const [activeArea, setActiveArea] = useState<'internal' | 'client'>('internal');
  
  // Internal search & filter
  const [internalCategory, setInternalCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(knowledgeArticles[0] || null);
  const [copied, setCopied] = useState(false);

  // Client Knowledge Base state
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [clientSearchTerm, setClientSearchTerm] = useState<string>('');

  // Modal State for New Article
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<KnowledgeArticle | null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalCategory, setModalCategory] = useState<KnowledgeArticle['category']>("sop");
  const [modalContent, setModalContent] = useState("");
  const [modalTags, setModalTags] = useState("Operations, Standard");

  const filteredInternalArticles = knowledgeArticles.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (internalCategory === 'all') return true;
    return art.category === internalCategory;
  });

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const clientProjects = projects.filter(p => !p.isArchived && p.clientId === selectedClientId);

  const handleCopyContent = () => {
    if (!activeArticle) return;
    navigator.clipboard.writeText(activeArticle.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenCreateModal = () => {
    setArticleToEdit(null);
    setModalTitle("");
    setModalCategory("sop");
    setModalContent("");
    setModalTags("Operations, Standard");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (art: KnowledgeArticle) => {
    setArticleToEdit(art);
    setModalTitle(art.title);
    setModalCategory(art.category);
    setModalContent(art.content);
    setModalTags(art.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim() || !modalContent.trim()) return;

    const tags = modalTags.split(',').map(t => t.trim()).filter(Boolean);

    if (articleToEdit) {
      updateKnowledgeArticle(articleToEdit.id, {
        title: modalTitle.trim(),
        category: modalCategory,
        content: modalContent.trim(),
        tags
      });
      if (activeArticle?.id === articleToEdit.id) {
        setActiveArticle({
          ...articleToEdit,
          title: modalTitle.trim(),
          category: modalCategory,
          content: modalContent.trim(),
          tags
        });
      }
    } else {
      addKnowledgeArticle({
        title: modalTitle.trim(),
        category: modalCategory,
        content: modalContent.trim(),
        tags
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-card-blue/30 text-blue-950 text-xs font-semibold tracking-wide flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-blue-700" />
              CENTRAL KNOWLEDGE & OPERATING SYSTEM
            </span>
            <span className="text-xs text-text-muted font-medium">
              {knowledgeArticles.length} Internal SOPs & Playbooks
            </span>
            <span className="text-xs text-text-muted font-medium">•</span>
            <span className="text-xs text-text-muted font-medium">
              {clients.length} Client Workspaces
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mt-1.5">
            Knowledge Base
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Structured repository separating core internal operational SOPs from dedicated client workspace operating manuals.
          </p>
        </div>

        {/* Master Action: Create SOP */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            New Knowledge Article / SOP
          </button>
        </div>
      </div>

      {/* Two Distinct Structural Navigation Areas */}
      <div className="flex items-center gap-3 border-b border-border-subtle pb-px">
        <button
          onClick={() => setActiveArea('internal')}
          className={`px-6 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeArea === 'internal'
              ? 'border-sidebar-bg text-sidebar-bg'
              : 'border-transparent text-text-muted hover:text-text-main'
          }`}
        >
          <Compass className="w-4 h-4" />
          Internal Knowledge Base (SOPs, Playbooks, Policies & Training)
        </button>

        <button
          onClick={() => setActiveArea('client')}
          className={`px-6 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeArea === 'client'
              ? 'border-sidebar-bg text-sidebar-bg'
              : 'border-transparent text-text-muted hover:text-text-main'
          }`}
        >
          <Building2 className="w-4 h-4 text-purple-600" />
          Client Knowledge Base (Dedicated to Client Workspaces)
        </button>
      </div>

      {/* ========================================================================= */}
      {/* AREA 1: INTERNAL KNOWLEDGE BASE */}
      {/* ========================================================================= */}
      {activeArea === 'internal' && (
        <div className="space-y-6">
          
          {/* Internal Category Chips & Search Filter */}
          <div className="p-4 bg-white rounded-[24px] border border-border-subtle shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search SOPs, playbooks, governance rules, tags..."
                  className="w-full pl-9 pr-4 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="text-xs text-text-muted">
                Showing <strong>{filteredInternalArticles.length}</strong> internal documents
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {INTERNAL_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setInternalCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    internalCategory === cat.id
                      ? 'bg-sidebar-bg text-white shadow-xs'
                      : 'bg-[#FDFBF7] border border-border-subtle text-text-muted hover:text-text-main'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Master 2-Column Reader / Directory */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Article Directory List (4 Cols) */}
            <div className="lg:col-span-4 space-y-2.5 max-h-[700px] overflow-y-auto custom-scrollbar pr-1">
              {filteredInternalArticles.map(art => {
                const isSelected = activeArticle?.id === art.id;

                return (
                  <div
                    key={art.id}
                    onClick={() => setActiveArticle(art)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-white border-sidebar-bg shadow-sm ring-1 ring-sidebar-bg/20' 
                        : 'bg-white border-border-subtle hover:border-gray-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-card-blue/20 text-blue-900 px-2 py-0.5 rounded">
                        {art.category}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {art.lastUpdated || 'Active'}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-text-main mt-1.5 line-clamp-1">
                      {art.title}
                    </h3>

                    <p className="text-[11px] text-text-muted line-clamp-2 mt-1 leading-relaxed">
                      {art.content}
                    </p>

                    <div className="flex items-center gap-1 flex-wrap pt-2 mt-2 border-t border-border-subtle/50">
                      {art.tags.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[9px] text-gray-500 bg-[#FDFBF7] px-1.5 py-0.2 rounded border border-border-subtle">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}

              {filteredInternalArticles.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-border-subtle text-text-muted text-xs">
                  No internal articles match your search.
                </div>
              )}
            </div>

            {/* Right Column: Article Viewer & Full Document Inspector (8 Cols) */}
            <div className="lg:col-span-8">
              {activeArticle ? (
                <div className="p-6 rounded-[28px] bg-white border border-border-subtle shadow-xs space-y-5 min-h-[580px]">
                  
                  {/* Article Reader Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
                          {activeArticle.category}
                        </span>
                        <span className="text-xs text-text-muted">
                          Last Updated: {activeArticle.lastUpdated || '2026'}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-text-main mt-1.5">
                        {activeArticle.title}
                      </h2>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleCopyContent}
                        className="px-3 py-1.5 rounded-xl bg-[#FDFBF7] hover:bg-gray-100 border border-border-subtle text-text-main text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(activeArticle)}
                        className="px-3 py-1.5 rounded-xl bg-[#FDFBF7] hover:bg-gray-100 border border-border-subtle text-text-main text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5 text-purple-600" /> Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete article "${activeArticle.title}"?`)) {
                            deleteKnowledgeArticle(activeArticle.id);
                            setActiveArticle(knowledgeArticles[0] || null);
                          }
                        }}
                        className="p-1.5 rounded-xl hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Article Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activeArticle.tags.map((tg, idx) => (
                      <span key={idx} className="text-xs text-text-muted bg-[#FDFBF7] border border-border-subtle px-2.5 py-0.5 rounded-full font-medium">
                        #{tg}
                      </span>
                    ))}
                  </div>

                  {/* Formatted Content Body */}
                  <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-border-subtle font-mono text-xs text-text-main leading-relaxed whitespace-pre-wrap select-text">
                    {activeArticle.content}
                  </div>

                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-[28px] border border-border-subtle text-text-muted">
                  <FileText className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm font-semibold text-text-main">No Article Selected</p>
                  <p className="text-xs text-text-muted mt-1">Select an article from the left to view its documentation.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* AREA 2: CLIENT KNOWLEDGE BASE (DEDICATED PER CLIENT WORKSPACE) */}
      {/* ========================================================================= */}
      {activeArea === 'client' && (
        <div className="space-y-6">
          
          {/* Client Workspace Selector Bar */}
          <div className="p-4 bg-white rounded-[24px] border border-border-subtle shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                  Client Workspace Knowledge Base
                </span>
                <h3 className="text-sm font-bold text-text-main mt-0.5">
                  Operating Guidelines for {selectedClient?.name}
                </h3>
              </div>
            </div>

            {/* Client Dropdown Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-text-muted whitespace-nowrap">
                Select Client Workspace:
              </label>
              <select
                value={selectedClientId}
                onChange={e => setSelectedClientId(e.target.value)}
                className="px-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-bold text-text-main focus:outline-none"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company || c.code})
                  </option>
                ))}
              </select>

              <Link
                to={`/clients/${selectedClient?.id}`}
                className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                Open Full CRM Profile <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

          </div>

          {/* Client-Dedicated Knowledge Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Card 1: Operating Manual & Executive Preferences */}
            <div className="p-5 rounded-[24px] bg-white border border-border-subtle shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-text-main">Executive Preferences & Rules</h4>
              </div>

              <div className="p-3 bg-[#FDFBF7] rounded-xl border border-border-subtle text-xs text-text-muted space-y-2">
                <p className="font-semibold text-text-main">Communication Cadence:</p>
                <p>• Prefers Slack async updates over impromptu Zoom syncs.</p>
                <p>• Daily summary email sent at 5:00 PM local time.</p>
                <p className="font-semibold text-text-main pt-1">Deliverable Format:</p>
                <p>• Google Slides for presentations (16:9, Dark mode preferred).</p>
                <p>• Notion docs for all specs and engineering RFC reviews.</p>
              </div>
            </div>

            {/* Card 2: Shared Credentials & Vault Locations */}
            <div className="p-5 rounded-[24px] bg-white border border-border-subtle shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-text-main">Access & Vault References</h4>
              </div>

              <div className="p-3 bg-[#FDFBF7] rounded-xl border border-border-subtle text-xs text-text-muted space-y-2">
                <p className="font-semibold text-text-main">1Password Vault:</p>
                <p className="font-mono text-[11px] bg-white p-1 rounded border border-border-subtle">
                  Shared Vault: {selectedClient?.name}_Production_Ops
                </p>
                <p className="font-semibold text-text-main pt-1">Google Drive Asset Vault:</p>
                <p className="text-blue-600 underline text-[11px] truncate">
                  drive.google.com/drive/folders/{selectedClient?.code || 'vault'}_root
                </p>
                <p className="font-semibold text-text-main pt-1">GitHub / Linear Organization:</p>
                <p className="font-mono text-[11px]">@{selectedClient?.company?.toLowerCase().replace(/\s+/g, '') || 'client'}-ops</p>
              </div>
            </div>

            {/* Card 3: Active Projects in this Workspace */}
            <div className="p-5 rounded-[24px] bg-white border border-border-subtle shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-text-main">Dedicated Projects ({clientProjects.length})</h4>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {clientProjects.map(p => (
                  <div key={p.id} className="p-2.5 bg-[#FDFBF7] rounded-xl border border-border-subtle text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-text-main">{p.name}</p>
                      <p className="text-[10px] text-text-muted">Deadline: {p.deadline}</p>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full">
                      {p.progress || 0}%
                    </span>
                  </div>
                ))}

                {clientProjects.length === 0 && (
                  <p className="text-xs text-text-muted italic p-3">No active projects assigned to this client.</p>
                )}
              </div>
            </div>

          </div>

          {/* Client Operating Playbook Detail Section */}
          <div className="p-6 rounded-[28px] bg-white border border-border-subtle shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-600" />
                Client Operating Standards & SLA Commitments
              </h3>
              <span className="text-xs text-text-muted font-medium">
                Timezone: {selectedClient?.timezone || 'UTC'} • Tier: {selectedClient?.retainerTier || 'Executive'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-muted leading-relaxed">
              <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-border-subtle space-y-2">
                <h4 className="font-bold text-text-main">Emergency Escalations</h4>
                <p>For urgent board deliverables or critical system blockers, contact {selectedClient?.primaryContact || 'Primary Executive'} via Telegram/WhatsApp.</p>
                <p>SLA for critical blockers: Within 60 minutes during standard working window.</p>
              </div>

              <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-border-subtle space-y-2">
                <h4 className="font-bold text-text-main">Billing & Invoicing Cycle</h4>
                <p>Monthly retainer fee: {selectedClient?.retainerAmount ? `$${selectedClient.retainerAmount.toLocaleString()}/mo` : '$3,500/mo'}.</p>
                <p>Invoices generated on the 1st of each calendar month with Net-14 payment terms.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Modal for Creating or Editing Knowledge Article */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-gray-50/50">
              <h3 className="text-base font-bold text-text-main">
                {articleToEdit ? 'Edit Knowledge Article' : 'Create New Knowledge Article / SOP'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SOP: Morning Executive Calendar Triage & Gatekeeping"
                  value={modalTitle}
                  onChange={e => setModalTitle(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-border-subtle rounded-xl px-3.5 py-2.5 text-xs font-semibold text-text-main focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Category *</label>
                  <select
                    value={modalCategory}
                    onChange={e => setModalCategory(e.target.value as any)}
                    className="w-full bg-[#FDFBF7] border border-border-subtle rounded-xl px-3 py-2 text-xs font-semibold text-text-main focus:outline-none"
                  >
                    <option value="sop">SOP (Standard Operating Procedure)</option>
                    <option value="playbook">Playbook & Guide</option>
                    <option value="policy">Policy & Governance</option>
                    <option value="training">Training Material</option>
                    <option value="template">Operational Template</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Operations, Executive, Triage"
                    value={modalTags}
                    onChange={e => setModalTags(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Article Content (Markdown supported) *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Write clear, step-by-step instructions or operational policies..."
                  value={modalContent}
                  onChange={e => setModalContent(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-border-subtle rounded-xl p-3.5 text-xs font-mono text-text-main focus:outline-none custom-scrollbar"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sidebar-bg hover:bg-sidebar-active text-white text-xs font-bold transition-colors"
                >
                  {articleToEdit ? 'Save Changes' : 'Create Article'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
