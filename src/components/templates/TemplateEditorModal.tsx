import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Code2, 
  FileText, 
  Sparkles, 
  Check, 
  HelpCircle,
  FolderKanban,
  Tag,
  Star
} from 'lucide-react';
import { ManagedTemplate, TemplateCategory, TemplateVariable } from '@/types';

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Omit<ManagedTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  templateToEdit?: ManagedTemplate | null;
}

const CATEGORIES: { id: TemplateCategory; label: string }[] = [
  { id: 'cover_letter', label: 'Cover Letters & Outreach' },
  { id: 'proposal', label: 'Proposals & Pitches' },
  { id: 'sow', label: 'Statements of Work (SOW)' },
  { id: 'report', label: 'Executive Reports & Recaps' },
  { id: 'onboarding', label: 'Client Onboarding' },
  { id: 'client_communication', label: 'Client Communications' },
  { id: 'legal_agreement', label: 'Agreements & Legal' },
  { id: 'executive_brief', label: 'Executive Briefs' },
  { id: 'custom', label: 'Custom Template' },
];

export function TemplateEditorModal({ isOpen, onClose, onSave, templateToEdit }: TemplateEditorModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TemplateCategory>('cover_letter');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [variables, setVariables] = useState<TemplateVariable[]>([]);

  // Variable builder state
  const [varKey, setVarKey] = useState('');
  const [varLabel, setVarLabel] = useState('');
  const [varType, setVarType] = useState<TemplateVariable['type']>('text');
  const [varDefault, setVarDefault] = useState('');
  const [varPlaceholder, setVarPlaceholder] = useState('');
  const [varRequired, setVarRequired] = useState(true);

  useEffect(() => {
    if (templateToEdit) {
      setTitle(templateToEdit.title);
      setDescription(templateToEdit.description);
      setCategory(templateToEdit.category);
      setContent(templateToEdit.content);
      setTagsInput((templateToEdit.tags || []).join(', '));
      setIsFavorite(Boolean(templateToEdit.isFavorite));
      setVariables(templateToEdit.variables || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory('cover_letter');
      setContent(`Dear {{hiring_manager}},\n\nI am writing to express my enthusiastic interest in the {{role_title}} opportunity with {{company_name}}.\n\nWith extensive background in operations, executive support, and scalable business systems, I specialize in solving {{core_pain_point}} while accelerating project delivery.\n\nKey Strengths I Bring to {{company_name}}:\n• {{strength_1}}\n• {{strength_2}}\n• Proven track record in high-velocity executive defense and proactive execution\n\nI would welcome the opportunity to discuss how I can drive immediate operational clarity for {{company_name}}.\n\nBest regards,\n{{your_name}}`);
      setTagsInput('Outreach, Executive');
      setIsFavorite(false);
      setVariables([
        { key: 'hiring_manager', label: 'Hiring Manager / Recipient', type: 'text', defaultValue: 'Hiring Team', placeholder: 'e.g. Jane Smith or Hiring Team', required: true },
        { key: 'role_title', label: 'Role / Project Title', type: 'text', defaultValue: 'Fractional Chief of Staff', placeholder: 'e.g. Senior Operations Consultant', required: true },
        { key: 'company_name', label: 'Company Name', type: 'text', defaultValue: 'Acme Growth Labs', placeholder: 'e.g. Stripe, Acme Corp', required: true },
        { key: 'core_pain_point', label: 'Core Pain Point', type: 'text', defaultValue: 'operational fragmentation and backlog triage', placeholder: 'Key challenge mentioned in JD', required: false },
        { key: 'strength_1', label: 'Key Highlight #1', type: 'text', defaultValue: 'Architected multi-entity operating rhythms saving 15+ leadership hours/week', placeholder: 'Measurable achievement', required: false },
        { key: 'strength_2', label: 'Key Highlight #2', type: 'text', defaultValue: 'Led executive communications and cross-functional board deliverables', placeholder: 'Domain alignment', required: false },
        { key: 'your_name', label: 'Your Full Name', type: 'text', defaultValue: 'Alex Vance', placeholder: 'Your Name', required: true }
      ]);
    }
  }, [templateToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddVariable = () => {
    if (!varKey.trim()) return;
    const cleanKey = varKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    
    // Check if key already exists
    if (variables.some(v => v.key === cleanKey)) {
      alert(`A variable with key "${cleanKey}" already exists.`);
      return;
    }

    const newVar: TemplateVariable = {
      key: cleanKey,
      label: varLabel.trim() || cleanKey.replace(/_/g, ' ').toUpperCase(),
      type: varType,
      defaultValue: varDefault,
      placeholder: varPlaceholder || `Enter ${cleanKey}`,
      required: varRequired
    };

    setVariables(prev => [...prev, newVar]);
    setVarKey('');
    setVarLabel('');
    setVarDefault('');
    setVarPlaceholder('');
  };

  const handleRemoveVariable = (keyToRemove: string) => {
    setVariables(prev => prev.filter(v => v.key !== keyToRemove));
  };

  const handleInsertPlaceholder = (key: string) => {
    const placeholderText = `{{${key}}}`;
    setContent(prev => prev + ` ${placeholderText} `);
  };

  // Auto detect variables from content text
  const handleAutoExtractVariables = () => {
    const regex = /\{\{([a-zA-Z0-9_]+)\}\}/g;
    const matches = Array.from(content.matchAll(regex)).map(m => m[1]);
    const uniqueKeys = Array.from(new Set(matches));

    const newVars = [...variables];
    uniqueKeys.forEach(k => {
      if (!newVars.some(v => v.key === k)) {
        newVars.push({
          key: k,
          label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          type: 'text',
          placeholder: `Enter ${k}`,
          required: true
        });
      }
    });

    setVariables(newVars);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      content,
      tags,
      isFavorite,
      variables,
      version: templateToEdit ? (templateToEdit.version || 1) + 1 : 1
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#18191D] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141518]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {templateToEdit ? 'Edit Template' : 'Create Custom Template'}
              </h2>
              <p className="text-xs text-stone-400">
                Define dynamic placeholders, variables, and reusable business documentation structures.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Title & Category & Favorite */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-7">
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Template Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Fractional Chief of Staff Pitch & Outreach"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TemplateCategory)}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-purple-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1 flex items-end justify-center pb-1">
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                title={isFavorite ? "Favorited" : "Mark as favorite"}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isFavorite 
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                    : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
                }`}
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>

          {/* Description & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Description / Purpose
              </label>
              <input
                type="text"
                placeholder="Brief summary of when and how to deploy this template..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="Cover Letter, Executive, Outreach, Retainer"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Content Area with Placeholder Chips */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                Template Body Content (Supports <span className="font-mono text-purple-300">{"{{variable}}"}</span> placeholders)
              </label>

              <button
                type="button"
                onClick={handleAutoExtractVariables}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-Detect Variables from Text
              </button>
            </div>

            {/* Quick Insert Variable Chips */}
            {variables.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-[11px] text-stone-400 font-medium mr-1">Click to insert:</span>
                {variables.map(v => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => handleInsertPlaceholder(v.key)}
                    className="px-2 py-0.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-mono transition-colors"
                  >
                    + {`{{${v.key}}}`}
                  </button>
                ))}
              </div>
            )}

            <textarea
              rows={12}
              required
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your template structure here. Use {{variable_name}} anywhere to inject dynamic values..."
              className="w-full bg-[#121316] border border-white/10 rounded-xl p-4 text-xs font-mono text-stone-100 focus:outline-hidden focus:border-purple-500 leading-relaxed custom-scrollbar"
            />
          </div>

          {/* Dynamic Variables Management Section */}
          <div className="space-y-3 bg-[#141518] p-4 rounded-xl border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-purple-400" />
                  Dynamic Template Variables ({variables.length})
                </h3>
                <p className="text-[11px] text-stone-400">
                  Variables defined here will be prompted when running or generating documents from this template.
                </p>
              </div>
            </div>

            {/* Variables List */}
            {variables.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {variables.map((v) => (
                  <div 
                    key={v.key} 
                    className="flex items-center justify-between p-2.5 bg-[#121316] rounded-xl border border-white/5 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-purple-400 font-semibold">{`{{${v.key}}}`}</span>
                        <span className="text-[10px] text-stone-400 bg-white/5 px-1.5 py-0.2 rounded capitalize">{v.type}</span>
                        {v.required && <span className="text-[9px] text-rose-400 font-bold">*req</span>}
                      </div>
                      <p className="text-[11px] text-stone-300 truncate mt-0.5">{v.label}</p>
                      {v.defaultValue && (
                        <p className="text-[10px] text-stone-500 truncate">Default: {v.defaultValue}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariable(v.key)}
                      className="p-1 text-stone-500 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Variable Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-white/5">
              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="variable_key"
                  value={varKey}
                  onChange={e => setVarKey(e.target.value)}
                  className="w-full bg-[#121316] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="Display Label"
                  value={varLabel}
                  onChange={e => setVarLabel(e.target.value)}
                  className="w-full bg-[#121316] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="Default Value"
                  value={varDefault}
                  onChange={e => setVarDefault(e.target.value)}
                  className="w-full bg-[#121316] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <select
                  value={varType}
                  onChange={e => setVarType(e.target.value as any)}
                  className="w-full bg-[#121316] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <button
                  type="button"
                  onClick={handleAddVariable}
                  className="w-full h-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#141518]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-xl text-xs font-bold text-[#121316] bg-[#F6D5EE] hover:bg-[#edd0e5] shadow-lg shadow-purple-500/10 transition-colors"
          >
            {templateToEdit ? 'Save Template Changes' : 'Create Template'}
          </button>
        </div>

      </div>
    </div>
  );
}
