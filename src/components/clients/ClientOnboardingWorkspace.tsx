import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Save, 
  Check, 
  Workflow, 
  Layers, 
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import { Client, OnboardingPhase } from '@/types';
import { useApp } from '@/context/AppContext';
import { WorkflowBuilder } from './WorkflowBuilder';

interface ClientOnboardingWorkspaceProps {
  client: Client;
}

export function ClientOnboardingWorkspace({ client }: ClientOnboardingWorkspaceProps) {
  const { updateClient } = useApp();

  const [phases, setPhases] = useState<OnboardingPhase[]>(client.onboardingPhases || []);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemTitle, setEditItemTitle] = useState('');
  
  const [newPhaseName, setNewPhaseName] = useState('');
  const [showAddPhaseModal, setShowAddPhaseModal] = useState(false);

  const [newItemTitle, setNewItemTitle] = useState('');
  const [targetPhaseIndex, setTargetPhaseIndex] = useState<number>(0);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const allItems = phases.flatMap(p => p.items || []);
  const completedCount = allItems.filter(i => i.completed).length;
  const progressPercent = allItems.length > 0 ? Math.round((completedCount / allItems.length) * 100) : 100;

  // Toggle item completion
  const handleToggleItem = (phaseIdx: number, itemIdx: number) => {
    const updated = [...phases];
    updated[phaseIdx].items[itemIdx].completed = !updated[phaseIdx].items[itemIdx].completed;
    
    // Check if phase is completed
    const phaseItems = updated[phaseIdx].items;
    updated[phaseIdx].completed = phaseItems.every(i => i.completed);

    const total = updated.flatMap(p => p.items).length;
    const completed = updated.flatMap(p => p.items).filter(i => i.completed).length;
    const newProgress = total > 0 ? Math.round((completed / total) * 100) : 100;

    setPhases(updated);
    updateClient(client.id, {
      onboardingPhases: updated,
      onboardingProgress: newProgress,
      status: newProgress === 100 ? (client.status === 'onboarding' ? 'active' : client.status) : client.status
    });
  };

  // Add Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim() || targetPhaseIndex >= phases.length) return;

    const updated = [...phases];
    const newItem = {
      id: `ob_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: newItemTitle.trim(),
      completed: false
    };

    updated[targetPhaseIndex].items.push(newItem);
    updated[targetPhaseIndex].completed = false;

    const total = updated.flatMap(p => p.items).length;
    const completed = updated.flatMap(p => p.items).filter(i => i.completed).length;
    const newProgress = total > 0 ? Math.round((completed / total) * 100) : 100;

    setPhases(updated);
    updateClient(client.id, {
      onboardingPhases: updated,
      onboardingProgress: newProgress
    });

    setNewItemTitle('');
    setShowAddItemModal(false);
  };

  // Edit Item Title
  const handleSaveEditItem = (phaseIdx: number, itemIdx: number) => {
    if (!editItemTitle.trim()) return;
    const updated = [...phases];
    updated[phaseIdx].items[itemIdx].title = editItemTitle.trim();

    setPhases(updated);
    updateClient(client.id, { onboardingPhases: updated });
    setEditingItemId(null);
    setEditItemTitle('');
  };

  // Delete Item
  const handleDeleteItem = (phaseIdx: number, itemIdx: number) => {
    const updated = [...phases];
    updated[phaseIdx].items.splice(itemIdx, 1);

    const total = updated.flatMap(p => p.items).length;
    const completed = updated.flatMap(p => p.items).filter(i => i.completed).length;
    const newProgress = total > 0 ? Math.round((completed / total) * 100) : 100;

    setPhases(updated);
    updateClient(client.id, {
      onboardingPhases: updated,
      onboardingProgress: newProgress
    });
  };

  // Reorder Item within Phase
  const handleMoveItem = (phaseIdx: number, itemIdx: number, direction: 'up' | 'down') => {
    const updated = [...phases];
    const items = updated[phaseIdx].items;
    if (direction === 'up' && itemIdx > 0) {
      const temp = items[itemIdx];
      items[itemIdx] = items[itemIdx - 1];
      items[itemIdx - 1] = temp;
    } else if (direction === 'down' && itemIdx < items.length - 1) {
      const temp = items[itemIdx];
      items[itemIdx] = items[itemIdx + 1];
      items[itemIdx + 1] = temp;
    }

    setPhases(updated);
    updateClient(client.id, { onboardingPhases: updated });
  };

  // Add New Phase
  const handleAddPhase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhaseName.trim()) return;

    const newPhase: OnboardingPhase = {
      id: phases.length + 1,
      name: newPhaseName.trim(),
      description: 'Custom tailored milestone phase',
      completed: false,
      items: [
        {
          id: `ob_${Date.now()}_init`,
          title: 'Initial Phase Milestone Deliverable',
          completed: false
        }
      ]
    };

    const updated = [...phases, newPhase];
    setPhases(updated);
    updateClient(client.id, { onboardingPhases: updated });
    setNewPhaseName('');
    setShowAddPhaseModal(false);
  };

  // Delete Phase
  const handleDeletePhase = (phaseIdx: number) => {
    const updated = phases.filter((_, idx) => idx !== phaseIdx);
    const total = updated.flatMap(p => p.items).length;
    const completed = updated.flatMap(p => p.items).filter(i => i.completed).length;
    const newProgress = total > 0 ? Math.round((completed / total) * 100) : 100;

    setPhases(updated);
    updateClient(client.id, {
      onboardingPhases: updated,
      onboardingProgress: newProgress
    });
  };

  // Sync state if client props update
  React.useEffect(() => {
    if (client.onboardingPhases) {
      setPhases(client.onboardingPhases);
    }
  }, [client.onboardingPhases]);

  return (
    <div className="bg-white p-6 rounded-[28px] border border-border-subtle shadow-xs space-y-6 animate-in fade-in duration-200">
      
      {/* Onboarding Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-bold tracking-wide uppercase">
              Onboarding Playbook & Workflow Engine
            </span>
            <span className="text-xs text-text-muted font-medium">Status: {client.status.toUpperCase()}</span>
          </div>
          <h3 className="text-xl font-bold text-text-main mt-1">Client Onboarding Roadmap & SLA Alignment</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Standardized operational milestones, access delegations, and kickoff routines for {client.name}.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowBuilderModal(true)}
            className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Workflow className="w-3.5 h-3.5 text-purple-700" />
            Apply Workflow Template
          </button>

          <button
            onClick={() => setShowAddPhaseModal(true)}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-bold flex items-center gap-1 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Phase
          </button>

          <button
            onClick={() => setShowAddItemModal(true)}
            className="px-4 py-2 bg-sidebar-bg hover:bg-stone-800 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Checklist Item
          </button>
        </div>
      </div>

      {/* Progress Bar & Summary Stats */}
      <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex justify-between items-center text-xs font-bold text-stone-800 mb-2">
            <span>Overall Onboarding Completion</span>
            <span className="font-mono text-purple-700">{progressPercent}% ({completedCount} / {allItems.length} Tasks)</span>
          </div>
          <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-purple-700 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phases & Reorderable Checklist Items */}
      <div className="space-y-6">
        {phases.map((phase, pIdx) => {
          const phaseItems = phase.items || [];
          const phaseCompleted = phaseItems.filter(i => i.completed).length;

          return (
            <div key={phase.id || pIdx} className="p-5 bg-[#FCFAF8] rounded-2xl border border-[#ECE6DD] space-y-4">
              
              {/* Phase Title Bar */}
              <div className="flex items-center justify-between border-b border-[#ECE6DD] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-900 text-xs font-bold flex items-center justify-center">
                    {pIdx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{phase.name}</h4>
                    {phase.description && (
                      <p className="text-[11px] text-stone-500">{phase.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-stone-500">
                    {phaseCompleted} / {phaseItems.length} Complete
                  </span>
                  <button
                    onClick={() => {
                      setTargetPhaseIndex(pIdx);
                      setShowAddItemModal(true);
                    }}
                    className="px-2.5 py-1 bg-white border border-[#ECE6DD] hover:bg-stone-50 text-purple-700 text-xs font-bold rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Item
                  </button>
                  <button
                    onClick={() => handleDeletePhase(pIdx)}
                    className="p-1 text-stone-400 hover:text-rose-600 rounded-lg"
                    title="Delete Phase"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Checklist Items List */}
              <div className="space-y-2">
                {phaseItems.map((item, iIdx) => (
                  <div
                    key={item.id || iIdx}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      item.completed 
                        ? 'bg-emerald-50/40 border-emerald-200' 
                        : 'bg-white border-[#ECE6DD] hover:border-stone-300'
                    }`}
                  >
                    {/* Left: Checkbox & Title (or Edit Input) */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button 
                        onClick={() => handleToggleItem(pIdx, iIdx)} 
                        className="shrink-0 text-stone-400 hover:text-emerald-600 transition-colors"
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-4 h-4 text-stone-300 hover:text-stone-500" />
                        )}
                      </button>

                      {editingItemId === item.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editItemTitle}
                            onChange={(e) => setEditItemTitle(e.target.value)}
                            className="flex-1 text-xs p-1.5 bg-white border border-purple-600 rounded-lg font-medium outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEditItem(pIdx, iIdx)}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="p-1.5 bg-stone-200 text-stone-700 rounded-lg text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span 
                          onClick={() => handleToggleItem(pIdx, iIdx)}
                          className={`text-xs font-medium cursor-pointer select-none truncate ${
                            item.completed ? 'line-through text-stone-400' : 'text-stone-900'
                          }`}
                        >
                          {item.title}
                        </span>
                      )}
                    </div>

                    {/* Right: Item Management Controls (Reorder, Edit, Delete) */}
                    {editingItemId !== item.id && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleMoveItem(pIdx, iIdx, 'up')}
                          disabled={iIdx === 0}
                          className={`p-1 rounded-md ${
                            iIdx === 0 ? 'text-stone-200 cursor-not-allowed' : 'text-stone-500 hover:bg-stone-100'
                          }`}
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => handleMoveItem(pIdx, iIdx, 'down')}
                          disabled={iIdx === phaseItems.length - 1}
                          className={`p-1 rounded-md ${
                            iIdx === phaseItems.length - 1 ? 'text-stone-200 cursor-not-allowed' : 'text-stone-500 hover:bg-stone-100'
                          }`}
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => {
                            setEditingItemId(item.id);
                            setEditItemTitle(item.title);
                          }}
                          className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                          title="Edit checklist item"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => handleDeleteItem(pIdx, iIdx)}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded-md"
                          title="Delete checklist item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                  </div>
                ))}

                {phaseItems.length === 0 && (
                  <p className="text-xs text-stone-400 italic py-2 text-center">
                    No items in this phase. Click "+ Item" to add checklist deliverables.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#ECE6DD] max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-700" /> Add Checklist Action Item
            </h3>

            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Target Onboarding Phase</label>
                <select
                  value={targetPhaseIndex}
                  onChange={e => setTargetPhaseIndex(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl font-semibold"
                >
                  {phases.map((phase, idx) => (
                    <option key={phase.id || idx} value={idx}>
                      Phase {idx + 1}: {phase.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Checklist Item Title</label>
                <input
                  type="text"
                  value={newItemTitle}
                  onChange={e => setNewItemTitle(e.target.value)}
                  placeholder="e.g. Schedule weekly calendar strategy block"
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 text-stone-600 rounded-full font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-full font-bold shadow-xs"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Phase Modal */}
      {showAddPhaseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#ECE6DD] max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-700" /> Create New Onboarding Phase
            </h3>

            <form onSubmit={handleAddPhase} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Phase Name</label>
                <input
                  type="text"
                  value={newPhaseName}
                  onChange={e => setNewPhaseName(e.target.value)}
                  placeholder="e.g. Phase 4: Systems Integration & KPI Review"
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPhaseModal(false)}
                  className="px-4 py-2 text-stone-600 rounded-full font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sidebar-bg hover:bg-stone-800 text-white rounded-full font-bold shadow-xs"
                >
                  Create Phase
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
                <Workflow className="w-4 h-4 text-purple-700" /> Workflow Builder & Templates
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
