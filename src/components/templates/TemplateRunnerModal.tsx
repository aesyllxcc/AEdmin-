import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Save, 
  Building2, 
  FileText, 
  RefreshCw, 
  Eye, 
  Edit3,
  Sliders
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ManagedTemplate } from '@/types';

interface TemplateRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ManagedTemplate | null;
  onDraftSaved?: () => void;
  onGenerated?: (content: string, title: string) => void;
}

export function TemplateRunnerModal({ isOpen, onClose, template, onDraftSaved, onGenerated }: TemplateRunnerModalProps) {
  const { clients, saveGeneratedDraft, userProfile } = useApp();

  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [draftTitle, setDraftTitle] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (template) {
      // Initialize variables with defaults
      const initVals: Record<string, string> = {};
      (template.variables || []).forEach(v => {
        initVals[v.key] = v.defaultValue || '';
      });

      // Provide standard defaults if matched
      if (!initVals['your_name']) initVals['your_name'] = userProfile.fullName || 'Alex Vance';
      if (!initVals['agency_name']) initVals['agency_name'] = userProfile.agencyName || 'AEDMIN Ops';
      if (!initVals['date']) initVals['date'] = new Date().toISOString().split('T')[0];

      setVariableValues(initVals);
      setDraftTitle(`${template.title} - ${new Date().toISOString().split('T')[0]}`);
      
      // Initial render
      renderContent(template.content, initVals);
    }
  }, [template, userProfile]);

  if (!isOpen || !template) return null;

  const renderContent = (tplContent: string, vals: Record<string, string>) => {
    let result = tplContent;
    Object.entries(vals).forEach(([k, v]) => {
      const regex = new RegExp(`\\{\\{${k}\\}\\}`, 'g');
      result = result.replace(regex, v || `[${k}]`);
    });
    setGeneratedOutput(result);
  };

  const handleVariableChange = (key: string, val: string) => {
    const nextVals = { ...variableValues, [key]: val };
    setVariableValues(nextVals);
    renderContent(template.content, nextVals);
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const nextVals = { ...variableValues };
    if (nextVals['client_name'] !== undefined || template.variables?.some(v => v.key === 'client_name')) {
      nextVals['client_name'] = client.name;
    }
    if (nextVals['company_name'] !== undefined || template.variables?.some(v => v.key === 'company_name')) {
      nextVals['company_name'] = client.company || client.name;
    }
    if (nextVals['contact_person'] !== undefined || template.variables?.some(v => v.key === 'contact_person')) {
      nextVals['contact_person'] = client.primaryContact || client.name;
    }
    if (nextVals['client_email'] !== undefined || template.variables?.some(v => v.key === 'client_email')) {
      nextVals['client_email'] = client.email || '';
    }
    if (nextVals['monthly_rate'] !== undefined || template.variables?.some(v => v.key === 'monthly_rate')) {
      nextVals['monthly_rate'] = client.retainerAmount ? `$${client.retainerAmount.toLocaleString()}` : '$3,500';
    }

    setVariableValues(nextVals);
    setDraftTitle(`${template.title} (${client.name})`);
    renderContent(template.content, nextVals);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedOutput], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${draftTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportMd = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedOutput], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${draftTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveToDrafts = () => {
    const client = clients.find(c => c.id === selectedClientId);

    saveGeneratedDraft({
      title: draftTitle.trim() || template.title,
      templateId: template.id,
      templateTitle: template.title,
      category: template.category,
      content: generatedOutput,
      variablesUsed: variableValues,
      clientId: selectedClientId || undefined,
      clientName: client?.name,
      status: 'draft'
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    if (onDraftSaved) onDraftSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#18191D] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141518]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Generate from Template: {template.title}
              </h2>
              <p className="text-xs text-stone-400">
                Populate dynamic placeholders to create fully editable proposals, reports, letters, and agreements.
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

        {/* Modal Split View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Variable Form & Client Selector */}
          <div className="lg:col-span-5 border-r border-white/10 p-5 overflow-y-auto space-y-4 custom-scrollbar bg-[#141518]/50">
            
            {/* Quick Auto-Fill with Client */}
            <div className="bg-[#121316] p-3.5 rounded-xl border border-white/5 space-y-2">
              <label className="block text-xs font-bold text-stone-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                Auto-Fill from Client Workspace
              </label>
              <select
                value={selectedClientId}
                onChange={e => handleClientSelect(e.target.value)}
                className="w-full bg-[#18191D] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500"
              >
                <option value="">-- Select Client to Auto-Populate --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company || c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Document Draft Title */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Draft Document Title
              </label>
              <input
                type="text"
                value={draftTitle}
                onChange={e => setDraftTitle(e.target.value)}
                className="w-full bg-[#121316] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500 font-medium"
              />
            </div>

            {/* Dynamic Variable Inputs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  Template Variables ({template.variables?.length || 0})
                </span>
                <span className="text-[10px] text-stone-400">Live preview updates</span>
              </div>

              {(!template.variables || template.variables.length === 0) ? (
                <p className="text-xs text-stone-500 italic p-3 bg-white/[0.02] rounded-lg">
                  This template does not require dynamic variables.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {template.variables.map(v => (
                    <div key={v.key} className="space-y-1">
                      <label className="block text-[11px] font-semibold text-stone-300">
                        {v.label} {v.required && <span className="text-rose-400">*</span>}
                        <span className="text-[10px] font-mono text-purple-400 ml-1.5">{"{{" + v.key + "}}"}</span>
                      </label>

                      {v.type === 'textarea' ? (
                        <textarea
                          rows={2}
                          value={variableValues[v.key] ?? ''}
                          onChange={e => handleVariableChange(v.key, e.target.value)}
                          placeholder={v.placeholder}
                          className="w-full bg-[#121316] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-purple-500"
                        />
                      ) : (
                        <input
                          type={v.type === 'number' ? 'number' : v.type === 'date' ? 'date' : 'text'}
                          value={variableValues[v.key] ?? ''}
                          onChange={e => handleVariableChange(v.key, e.target.value)}
                          placeholder={v.placeholder}
                          className="w-full bg-[#121316] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-purple-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Live Output Editor (Never Locked) */}
          <div className="lg:col-span-7 p-5 flex flex-col overflow-hidden bg-[#121316]">
            
            {/* Output Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                  Live Editable Document
                </span>
                <span className="text-[10px] text-stone-400 bg-white/5 px-2 py-0.5 rounded-full">
                  {generatedOutput.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>

                <button
                  type="button"
                  onClick={handleExportMd}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> .MD
                </button>

                <button
                  type="button"
                  onClick={handleExportTxt}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> .TXT
                </button>
              </div>
            </div>

            {/* Editable Content Area */}
            <div className="flex-1 min-h-[350px] relative">
              <textarea
                value={generatedOutput}
                onChange={e => setGeneratedOutput(e.target.value)}
                className="w-full h-full bg-[#141518] border border-white/10 rounded-xl p-4 text-xs font-mono text-stone-100 focus:outline-hidden focus:border-purple-500 leading-relaxed custom-scrollbar resize-none"
                placeholder="Live generated content will appear here and remains 100% editable..."
              />
            </div>

            {/* Bottom Status Note */}
            <div className="flex items-center justify-between pt-3 text-[11px] text-stone-400">
              <span>All changes you make directly in this box are preserved in the saved draft.</span>
              {savedSuccess && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved to Generated Drafts!
                </span>
              )}
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#141518]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveToDrafts}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save to Generated Drafts
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
