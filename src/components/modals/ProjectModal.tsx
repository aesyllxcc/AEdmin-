import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Project } from '@/types';
import { 
  X, 
  FolderKanban, 
  Building2, 
  Calendar, 
  DollarSign, 
  FileText, 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  ExternalLink,
  Archive,
  CheckCircle2,
  ListChecks,
  Sparkles
} from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
  defaultClientId?: string;
}

export function ProjectModal({ isOpen, onClose, projectToEdit, defaultClientId }: ProjectModalProps) {
  const { clients, addProject, updateProject, deleteProject, archiveProject, restoreProject } = useApp();

  const [formData, setFormData] = useState({
    clientId: defaultClientId || clients[0]?.id || '',
    name: '',
    description: '',
    scope: '',
    status: 'in_progress' as Project['status'],
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
    budget: 5000,
    progress: 0,
    driveFolderLink: '',
    reviewLink: '',
    notes: '',
    deliverables: [''] as string[],
    milestones: [] as { id: string; title: string; dueDate: string; completed: boolean }[]
  });

  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        clientId: projectToEdit.clientId,
        name: projectToEdit.name,
        description: projectToEdit.description || '',
        scope: projectToEdit.scope || '',
        status: projectToEdit.status,
        startDate: projectToEdit.startDate,
        deadline: projectToEdit.deadline,
        budget: projectToEdit.budget || 0,
        progress: projectToEdit.progress || 0,
        driveFolderLink: projectToEdit.driveFolderLink || '',
        reviewLink: projectToEdit.reviewLink || '',
        notes: (projectToEdit as any).notes || '',
        deliverables: projectToEdit.deliverables && projectToEdit.deliverables.length > 0 
          ? [...projectToEdit.deliverables] 
          : [''],
        milestones: projectToEdit.milestones ? [...projectToEdit.milestones] : []
      });
    } else {
      setFormData({
        clientId: defaultClientId || clients[0]?.id || '',
        name: '',
        description: '',
        scope: '',
        status: 'in_progress',
        startDate: new Date().toISOString().split('T')[0],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        budget: 5000,
        progress: 0,
        driveFolderLink: '',
        reviewLink: '',
        notes: '',
        deliverables: [''],
        milestones: []
      });
    }
  }, [projectToEdit, defaultClientId, isOpen, clients]);

  if (!isOpen) return null;

  const handleAddDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, '']
    }));
  };

  const handleUpdateDeliverable = (index: number, value: string) => {
    setFormData(prev => {
      const next = [...prev.deliverables];
      next[index] = value;
      return { ...prev, deliverables: next };
    });
  };

  const handleRemoveDeliverable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    const newM = {
      id: `m_${Date.now()}`,
      title: newMilestoneTitle.trim(),
      dueDate: newMilestoneDate || formData.deadline || new Date().toISOString().split('T')[0],
      completed: false
    };
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, newM]
    }));
    setNewMilestoneTitle('');
    setNewMilestoneDate('');
  };

  const handleToggleMilestone = (mId: string) => {
    setFormData(prev => {
      const next = prev.milestones.map(m => m.id === mId ? { ...m, completed: !m.completed } : m);
      const completedCount = next.filter(m => m.completed).length;
      const calcProgress = next.length > 0 ? Math.round((completedCount / next.length) * 100) : prev.progress;
      return { ...prev, milestones: next, progress: calcProgress };
    });
  };

  const handleRemoveMilestone = (mId: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== mId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const selectedClient = clients.find(c => c.id === formData.clientId);
    const cleanedDeliverables = formData.deliverables.filter(d => d.trim().length > 0);

    const projectPayload = {
      clientId: formData.clientId,
      clientName: selectedClient?.name || 'Internal Studio',
      name: formData.name.trim(),
      description: formData.description.trim(),
      scope: formData.scope.trim(),
      status: formData.status,
      startDate: formData.startDate,
      deadline: formData.deadline,
      budget: Number(formData.budget) || 0,
      progress: Number(formData.progress) || 0,
      driveFolderLink: formData.driveFolderLink.trim(),
      reviewLink: formData.reviewLink.trim(),
      notes: formData.notes.trim(),
      deliverables: cleanedDeliverables,
      milestones: formData.milestones
    };

    if (projectToEdit) {
      updateProject(projectToEdit.id, projectPayload);
    } else {
      addProject(projectPayload);
    }

    onClose();
  };

  const isArchived = projectToEdit?.status === 'archived' || (projectToEdit as any)?.isArchived;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#18191D] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl text-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141518]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {projectToEdit ? 'Edit Project' : 'Create New Project'}
              </h2>
              <p className="text-xs text-stone-400">
                {projectToEdit ? `Updating ${projectToEdit.name}` : 'Configure project scope, timeline, milestones, and client linkages'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          
          {/* Project Name & Client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Project Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Series B Data Room & Executive Operations Setup"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                Linked Client *
              </label>
              <select
                value={formData.clientId}
                onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-purple-500 transition-colors"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Project Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-purple-500 transition-colors"
              >
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="review">In Review / Client Sign-off</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Description & Scope */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Project Summary & Objectives
              </label>
              <textarea
                rows={2}
                placeholder="High-level description of this engagement and the value delivered..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#121316] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-hidden focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Detailed Scope of Work (SOW)
              </label>
              <textarea
                rows={2}
                placeholder="Specific boundaries, inclusions, and operational protocols..."
                value={formData.scope}
                onChange={e => setFormData({ ...formData, scope: e.target.value })}
                className="w-full bg-[#121316] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-hidden focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Timeline & Budget & Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white/[0.02] p-4 rounded-xl border border-white/5">
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-[#121316] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Target Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full bg-[#121316] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Budget / Value ($)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full bg-[#121316] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Progress ({formData.progress}%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={e => setFormData({ ...formData, progress: Number(e.target.value) })}
                className="w-full bg-[#121316] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          {/* Links & Vaults */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                Google Drive Vault Link
              </label>
              <input
                type="url"
                placeholder="https://drive.google.com/drive/folders/..."
                value={formData.driveFolderLink}
                onChange={e => setFormData({ ...formData, driveFolderLink: e.target.value })}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                Figma / Review Portal Link
              </label>
              <input
                type="url"
                placeholder="https://figma.com/file/... or Frame.io"
                value={formData.reviewLink}
                onChange={e => setFormData({ ...formData, reviewLink: e.target.value })}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Key Deliverables */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5 text-purple-400" />
                Key Deliverables ({formData.deliverables.filter(d => d.trim()).length})
              </label>
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Deliverable
              </button>
            </div>
            
            <div className="space-y-1.5">
              {formData.deliverables.map((deliv, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Deliverable #${idx + 1}`}
                    value={deliv}
                    onChange={e => handleUpdateDeliverable(idx, e.target.value)}
                    className="flex-1 bg-[#121316] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  />
                  {formData.deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(idx)}
                      className="p-1.5 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-white/5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Project Milestones
            </label>

            {/* List of existing milestones */}
            {formData.milestones.length > 0 && (
              <div className="space-y-1.5 bg-[#121316] p-3 rounded-xl border border-white/5">
                {formData.milestones.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleToggleMilestone(m.id)}
                      className="flex items-center gap-2 text-left flex-1 min-w-0"
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        m.completed ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'border-white/20'
                      }`}>
                        {m.completed && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className={`truncate ${m.completed ? 'line-through text-stone-500' : 'text-stone-200'}`}>
                        {m.title}
                      </span>
                    </button>
                    <span className="text-[10px] text-stone-400 bg-white/5 px-2 py-0.5 rounded-sm shrink-0">
                      {m.dueDate}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(m.id)}
                      className="p-1 text-stone-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add milestone inputs */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="New milestone title..."
                value={newMilestoneTitle}
                onChange={e => setNewMilestoneTitle(e.target.value)}
                className="flex-1 bg-[#121316] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
              />
              <input
                type="date"
                value={newMilestoneDate}
                onChange={e => setNewMilestoneDate(e.target.value)}
                className="w-32 bg-[#121316] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-xs font-semibold text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Operational Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Operational Notes & Governance Rules
            </label>
            <textarea
              rows={2}
              placeholder="Internal reminders, communication preferences, or partner instructions..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-[#121316] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-hidden focus:border-purple-500 transition-colors"
            />
          </div>

        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#141518]">
          <div className="flex items-center gap-2">
            {projectToEdit && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (isArchived) {
                      restoreProject(projectToEdit.id);
                    } else {
                      archiveProject(projectToEdit.id);
                    }
                    onClose();
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <Archive className="w-3.5 h-3.5" />
                  {isArchived ? 'Restore Project' : 'Archive Project'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${projectToEdit.name}"?`)) {
                      deleteProject(projectToEdit.id);
                      onClose();
                    }
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl text-xs font-bold text-[#121316] bg-[#F6D5EE] hover:bg-[#edd0e5] shadow-lg shadow-purple-500/10 transition-colors"
            >
              {projectToEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
