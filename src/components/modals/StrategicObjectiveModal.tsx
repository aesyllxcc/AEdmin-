import React, { useState, useEffect } from 'react';
import { 
  X, 
  Layers, 
  Target, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  Calendar,
  Tag,
  UserCheck
} from 'lucide-react';
import { ClientStrategicObjective } from '@/types';
import { useApp } from '@/context/AppContext';

interface StrategicObjectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  objectiveToEdit?: ClientStrategicObjective | null;
  defaultClientId?: string;
}

export function StrategicObjectiveModal({
  isOpen,
  onClose,
  objectiveToEdit,
  defaultClientId
}: StrategicObjectiveModalProps) {
  const { clients, addStrategicObjective, updateStrategicObjective } = useApp();

  const [clientId, setClientId] = useState(defaultClientId || clients[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ClientStrategicObjective['category']>('Revenue & Growth');
  const [strategicIntent, setStrategicIntent] = useState('');
  const [progressStatus, setProgressStatus] = useState<ClientStrategicObjective['progressStatus']>('on_track');
  const [outcomeDescription, setOutcomeDescription] = useState('');
  const [milestones, setMilestones] = useState<{
    id: string;
    title: string;
    targetTimeline: string;
    completed: boolean;
    outcomeAchieved?: string;
    owner: 'assistant' | 'client';
  }[]>([]);

  // New milestone input
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneTimeline, setNewMilestoneTimeline] = useState('Q3 2026');
  const [newMilestoneOwner, setNewMilestoneOwner] = useState<'assistant' | 'client'>('assistant');

  useEffect(() => {
    if (objectiveToEdit) {
      setClientId(objectiveToEdit.clientId);
      setTitle(objectiveToEdit.title);
      setCategory(objectiveToEdit.category);
      setStrategicIntent(objectiveToEdit.strategicIntent);
      setProgressStatus(objectiveToEdit.progressStatus);
      setOutcomeDescription(objectiveToEdit.outcomeDescription);
      setMilestones(objectiveToEdit.milestones || []);
    } else {
      setClientId(defaultClientId || clients[0]?.id || '');
      setTitle('');
      setCategory('Revenue & Growth');
      setStrategicIntent('');
      setProgressStatus('on_track');
      setOutcomeDescription('');
      setMilestones([
        {
          id: `m_${Date.now()}_1`,
          title: 'Establish key baseline metrics and audit workflows',
          targetTimeline: 'Month 1',
          completed: false,
          owner: 'assistant'
        }
      ]);
    }
  }, [objectiveToEdit, defaultClientId, isOpen, clients]);

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    setMilestones(prev => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        title: newMilestoneTitle.trim(),
        targetTimeline: newMilestoneTimeline.trim() || 'Next Sprint',
        completed: false,
        owner: newMilestoneOwner
      }
    ]);
    setNewMilestoneTitle('');
  };

  const handleToggleMilestone = (index: number) => {
    setMilestones(prev => prev.map((m, i) => i === index ? { ...m, completed: !m.completed } : m));
  };

  const handleDeleteMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientId) return;

    if (objectiveToEdit) {
      updateStrategicObjective(objectiveToEdit.id, {
        clientId,
        title: title.trim(),
        category,
        strategicIntent: strategicIntent.trim(),
        progressStatus,
        outcomeDescription: outcomeDescription.trim(),
        milestones
      });
    } else {
      addStrategicObjective({
        clientId,
        title: title.trim(),
        category,
        strategicIntent: strategicIntent.trim(),
        progressStatus,
        outcomeDescription: outcomeDescription.trim(),
        milestones
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white max-w-2xl w-full rounded-[32px] border border-slate-200/80 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-slate-800 shadow-inner">
              <Layers className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                {objectiveToEdit ? 'Edit Strategic Objective' : 'New Strategic Objective'}
              </h2>
              <p className="text-xs text-slate-500">
                Define high-impact milestones and executive outcomes for client portal tracking.
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Client Workspace *</label>
              <select
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company || 'Private'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Strategic Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
              >
                <option value="Revenue & Growth">Revenue & Growth</option>
                <option value="Operational Scaling">Operational Scaling</option>
                <option value="Brand & Market Position">Brand & Market Position</option>
                <option value="Executive Focus & Freedom">Executive Focus & Freedom</option>
                <option value="Product & Launch">Product & Launch</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Objective Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Executive Calendar Defense & 15+ Hours Weekly Focus Protection"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Strategic Intent & Core Mandate</label>
            <textarea
              rows={2}
              placeholder="What high-level impact does this deliver for the executive?"
              value={strategicIntent}
              onChange={e => setStrategicIntent(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Progress Status</label>
              <select
                value={progressStatus}
                onChange={e => setProgressStatus(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
              >
                <option value="on_track">On Track (Standard Pacing)</option>
                <option value="ahead">Ahead of Schedule</option>
                <option value="needs_alignment">Needs Alignment / Review</option>
                <option value="achieved">Achieved & Completed</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Outcome Status Description</label>
              <input
                type="text"
                placeholder="e.g. 14.2 hrs deep work defended weekly; inbox zero daily"
                value={outcomeDescription}
                onChange={e => setOutcomeDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Milestones Section */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs">Milestones & Key Sign-offs ({milestones.length})</span>
              <span className="text-[11px] text-slate-500">
                {milestones.filter(m => m.completed).length} of {milestones.length} Completed
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {milestones.map((m, idx) => (
                <div key={m.id || idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleMilestone(idx)}
                      className={`w-4 h-4 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                        m.completed ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {m.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <span className={`truncate font-medium ${m.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {m.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-mono">
                      {m.targetTimeline}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 capitalize font-medium">
                      {m.owner}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteMilestone(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Milestone Sub-form */}
            <div className="p-3 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="New Milestone title..."
                value={newMilestoneTitle}
                onChange={e => setNewMilestoneTitle(e.target.value)}
                className="flex-1 p-2 bg-white border border-slate-200 rounded-xl focus:outline-none text-xs"
              />
              <input
                type="text"
                placeholder="Timeline (e.g. Q3 2026)"
                value={newMilestoneTimeline}
                onChange={e => setNewMilestoneTimeline(e.target.value)}
                className="w-28 p-2 bg-white border border-slate-200 rounded-xl focus:outline-none text-xs"
              />
              <select
                value={newMilestoneOwner}
                onChange={e => setNewMilestoneOwner(e.target.value as any)}
                className="p-2 bg-white border border-slate-200 rounded-xl focus:outline-none text-xs"
              >
                <option value="assistant">Specialist</option>
                <option value="client">Client Lead</option>
              </select>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-2 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-1 shrink-0 hover:bg-black transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              {objectiveToEdit ? 'Save Changes' : 'Create Objective'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
