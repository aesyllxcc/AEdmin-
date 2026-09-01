import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowUp, 
  ArrowDown, 
  Workflow, 
  FileText, 
  AlertTriangle,
  Check,
  Save,
  Clock
} from 'lucide-react';
import { Client } from '@/types';
import { useApp } from '@/context/AppContext';
import { WorkflowBuilder } from './WorkflowBuilder';

interface ClientOffboardingWorkspaceProps {
  client: Client;
}

const DEFAULT_OFFBOARDING_STEPS = [
  { id: 'off_1', title: 'Revoke Google Workspace, Notion & Slack Access', category: 'Security & Access', completed: true, notes: 'Access revoked from all shared enterprise suites.' },
  { id: 'off_2', title: 'Export & Transfer Client File Archives to Client Drive', category: 'Data & Deliverables', completed: true, notes: 'Full zip export transferred to client primary storage.' },
  { id: 'off_3', title: 'Finalize Hours Audit & Reconcile Outstanding Invoices', category: 'Financial Settlement', completed: false, notes: 'Audit remaining retainer balance and issue final invoice.' },
  { id: 'off_4', title: 'Handover Operating Manuals & Standing SOPs', category: 'Operational Handover', completed: false, notes: 'Transferred executive briefing templates and recurring routine documents.' },
  { id: 'off_5', title: 'Archive 1Password & Password Vault Shared Keys', category: 'Security & Access', completed: false, notes: 'Wipe local credential cache and confirm MFA token ownership transfer.' },
  { id: 'off_6', title: 'Execute Formal Handover Signoff & Exit Interview', category: 'Executive Partnership', completed: false, notes: 'Confirm executive alignment and send appreciation letter.' }
];

export function ClientOffboardingWorkspace({ client }: ClientOffboardingWorkspaceProps) {
  const { updateClient } = useApp();

  const initialChecklist = client.offboardingChecklist && client.offboardingChecklist.length > 0
    ? client.offboardingChecklist
    : DEFAULT_OFFBOARDING_STEPS;

  const [steps, setSteps] = useState(initialChecklist);
  const [handoverNotes, setHandoverNotes] = useState(client.offboardingNotes || 'Client offboarding initiated. All primary data backups created.');
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Item State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Security & Access');
  const [newNotes, setNewNotes] = useState('');

  // Edit Item State
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 100;

  const toggleStep = (id: string) => {
    const updated = steps.map(s => s.id === id ? { ...s, completed: !s.completed } : s);
    setSteps(updated);
    updateClient(client.id, {
      offboardingChecklist: updated,
      offboardingProgress: Math.round((updated.filter(s => s.completed).length / updated.length) * 100)
    });
  };

  // Add Step
  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newStep = {
      id: `off_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory.trim() || 'General Protocol',
      notes: newNotes.trim() || 'Handover checklist item',
      completed: false
    };

    const updated = [...steps, newStep];
    setSteps(updated);
    updateClient(client.id, {
      offboardingChecklist: updated,
      offboardingProgress: Math.round((updated.filter(s => s.completed).length / updated.length) * 100)
    });

    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  // Edit Step
  const handleStartEdit = (step: any) => {
    setEditingStepId(step.id);
    setEditTitle(step.title || step.task || '');
    setEditCategory(step.category || 'Security & Access');
    setEditNotes(step.notes || '');
  };

  const handleSaveEdit = (id: string) => {
    const updated = steps.map(s => {
      if (s.id === id) {
        return {
          ...s,
          title: editTitle.trim(),
          category: editCategory.trim(),
          notes: editNotes.trim()
        };
      }
      return s;
    });

    setSteps(updated);
    updateClient(client.id, { offboardingChecklist: updated });
    setEditingStepId(null);
  };

  // Delete Step
  const handleDeleteStep = (id: string) => {
    const updated = steps.filter(s => s.id !== id);
    setSteps(updated);
    updateClient(client.id, {
      offboardingChecklist: updated,
      offboardingProgress: updated.length > 0 ? Math.round((updated.filter(s => s.completed).length / updated.length) * 100) : 100
    });
  };

  // Reorder Steps
  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const updated = [...steps];
    if (direction === 'up' && index > 0) {
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
    } else if (direction === 'down' && index < updated.length - 1) {
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
    }

    setSteps(updated);
    updateClient(client.id, { offboardingChecklist: updated });
  };

  const handleSaveNotes = () => {
    updateClient(client.id, {
      offboardingNotes: handoverNotes,
      offboardingChecklist: steps
    });
  };

  const handleMarkOffboarded = () => {
    updateClient(client.id, {
      status: 'offboarding',
      offboardingDate: new Date().toISOString().split('T')[0]
    });
  };

  React.useEffect(() => {
    if (client.offboardingChecklist) {
      setSteps(client.offboardingChecklist);
    }
  }, [client.offboardingChecklist]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Offboarding Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-rose-950 text-white rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/30 text-[11px] font-bold tracking-wide uppercase">
              Secure Offboarding Protocol
            </span>
            <span className="text-xs text-stone-300">Workspace Status: {client.status.toUpperCase()}</span>
          </div>
          <h2 className="text-xl font-bold">Executive Offboarding & Data Handover Center</h2>
          <p className="text-xs text-stone-300 mt-1 max-w-2xl">
            Structured protocol for credential revocation, final time & financial reconciliation, asset handover, and secure workspace archival.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowBuilderModal(true)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Workflow className="w-3.5 h-3.5 text-rose-300" />
            Apply Offboarding Template
          </button>

          {client.status !== 'offboarding' && (
            <button
              onClick={handleMarkOffboarded}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold transition-all shadow-sm"
            >
              Set Status: Offboarding
            </button>
          )}

          <div className="bg-white/10 px-3.5 py-2 rounded-full border border-white/20 text-xs font-bold text-white flex items-center gap-1.5">
            <span>{completedCount} / {steps.length} Steps ({progressPercent}%)</span>
          </div>
        </div>
      </div>

      {/* Offboarding Progress Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-4">
        <div className="flex justify-between items-center text-xs font-bold text-stone-800">
          <span>Offboarding Completion Progress</span>
          <span className="font-mono text-rose-700">{progressPercent}%</span>
        </div>
        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-rose-600 transition-all rounded-full duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist & Management Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Reorderable / Editable Checklist Items */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#ECE6DD] pb-3">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Offboarding Protocols & Verification Tasks
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-sidebar-bg hover:bg-stone-800 text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Task
            </button>
          </div>

          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div 
                key={step.id || idx}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  step.completed 
                    ? 'bg-emerald-50/50 border-emerald-200' 
                    : 'bg-[#FAF8F5] border-[#ECE6DD] hover:bg-[#F4EFEB]'
                }`}
              >
                {/* Left: Toggle & Info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button 
                    onClick={() => toggleStep(step.id)}
                    className="mt-0.5 shrink-0 text-stone-400 hover:text-emerald-600"
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 hover:text-stone-500" />
                    )}
                  </button>

                  {editingStepId === step.id ? (
                    <div className="space-y-2 flex-1">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-rose-500 rounded-xl font-bold"
                        placeholder="Task Title"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editCategory}
                          onChange={e => setEditCategory(e.target.value)}
                          className="text-xs p-2 bg-white border border-[#ECE6DD] rounded-xl"
                          placeholder="Category"
                        />
                        <input
                          type="text"
                          value={editNotes}
                          onChange={e => setEditNotes(e.target.value)}
                          className="text-xs p-2 bg-white border border-[#ECE6DD] rounded-xl"
                          placeholder="Protocol Notes"
                        />
                      </div>
                      <div className="flex justify-end gap-1.5 pt-1">
                        <button
                          onClick={() => setEditingStepId(null)}
                          className="px-3 py-1 bg-stone-200 text-stone-700 rounded-lg text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(step.id)}
                          className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span 
                          onClick={() => toggleStep(step.id)}
                          className={`text-xs font-bold cursor-pointer select-none ${step.completed ? 'line-through text-stone-400' : 'text-stone-900'}`}
                        >
                          {step.title || step.task}
                        </span>
                        <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full shrink-0">
                          {step.category || 'Security & Access'}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">{step.notes}</p>
                    </div>
                  )}
                </div>

                {/* Right: Step Action Controls (Reorder, Edit, Delete) */}
                {editingStepId !== step.id && (
                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      onClick={() => handleMoveStep(idx, 'up')}
                      disabled={idx === 0}
                      className={`p-1 rounded-md border border-[#ECE6DD] bg-white ${
                        idx === 0 ? 'text-stone-200 cursor-not-allowed' : 'text-stone-600 hover:bg-stone-100'
                      }`}
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMoveStep(idx, 'down')}
                      disabled={idx === steps.length - 1}
                      className={`p-1 rounded-md border border-[#ECE6DD] bg-white ${
                        idx === steps.length - 1 ? 'text-stone-200 cursor-not-allowed' : 'text-stone-600 hover:bg-stone-100'
                      }`}
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleStartEdit(step)}
                      className="p-1 hover:bg-stone-100 text-stone-500 rounded-md"
                      title="Edit checklist item"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteStep(step.id)}
                      className="p-1 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-md"
                      title="Delete checklist item"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Handover Log & Archival Notice */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-700" />
              Handover Log & Exit Summary
            </h3>
            <textarea
              rows={6}
              value={handoverNotes}
              onChange={(e) => setHandoverNotes(e.target.value)}
              placeholder="Record credential handover confirmations, drive export links, and final executive notes..."
              className="w-full text-xs p-3 rounded-2xl border border-[#ECE6DD] bg-[#FAF8F5]"
            />
            <button
              onClick={handleSaveNotes}
              className="w-full py-2.5 bg-sidebar-bg hover:bg-stone-800 text-white rounded-full text-xs font-bold transition-all shadow-xs"
            >
              Save Handover Notes
            </button>
          </div>

          <div className="bg-amber-50 p-5 rounded-3xl border border-amber-200 text-xs space-y-2">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Archival Notice
            </span>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              Once all offboarding steps are verified, this client's historical tasks, invoices, and time entries remain securely preserved in your audit logs and financial reports.
            </p>
          </div>
        </div>

      </div>

      {/* Add Step Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#ECE6DD] max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-rose-600" /> Add Offboarding Task
            </h3>

            <form onSubmit={handleAddStep} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Delete shared API keys and revoke webhook secrets"
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="e.g. Security & Access, Financial Settlement, Deliverables"
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Protocol Notes / Instructions</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Instructions for executing this step"
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-stone-600 rounded-full font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold shadow-xs"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workflow Builder Modal */}
      {showBuilderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#ECE6DD] max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECE6DD] pb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-rose-600" /> Custom Offboarding Workflow Builder
              </h3>
              <button
                onClick={() => setShowBuilderModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <WorkflowBuilder 
              selectedClientId={client.id}
              embedded={true}
              onApplyWorkflowToClient={() => {
                setShowBuilderModal(false);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
