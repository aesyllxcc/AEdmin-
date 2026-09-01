import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, Calendar, AlertCircle, Plus, FolderKanban } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Task, PriorityLevel, TaskStatus } from '@/types';
import { ProjectModal } from './ProjectModal';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  defaultClientId?: string;
}

export function TaskModal({ isOpen, onClose, taskToEdit, defaultClientId }: TaskModalProps) {
  const { clients, projects, addTask, updateTask } = useApp();

  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [clientId, setClientId] = useState(taskToEdit?.clientId || defaultClientId || clients[0]?.id || '');
  const [projectId, setProjectId] = useState(taskToEdit?.projectId || '');
  const [dueDate, setDueDate] = useState(taskToEdit?.dueDate || new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState(taskToEdit?.dueTime || '17:00');
  const [priority, setPriority] = useState<PriorityLevel>(taskToEdit?.priority || 'high');
  const [status, setStatus] = useState<TaskStatus>(taskToEdit?.status || 'todo');
  const [importanceScore, setImportanceScore] = useState<number>(taskToEdit?.importanceScore ?? 4);
  const [urgencyScore, setUrgencyScore] = useState<number>(taskToEdit?.urgencyScore ?? 4);
  const [revenueImpactScore, setRevenueImpactScore] = useState<number>(taskToEdit?.revenueImpactScore ?? 4);
  const [clientPriorityScore, setClientPriorityScore] = useState<number>(taskToEdit?.clientPriorityScore ?? 4);
  const [estimatedHours, setEstimatedHours] = useState<number>(taskToEdit?.estimatedHours ?? 1);
  const [notes, setNotes] = useState(taskToEdit?.notes || '');
  const [driveLink, setDriveLink] = useState(taskToEdit?.driveLink || '');
  const [tagInput, setTagInput] = useState((taskToEdit?.tags || []).join(', ') || 'Operations');
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  const filteredProjects = projects.filter(p => !p.isArchived && p.clientId === clientId);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setClientId(taskToEdit.clientId || defaultClientId || clients[0]?.id || '');
      setProjectId(taskToEdit.projectId || '');
      setDueDate(taskToEdit.dueDate || new Date().toISOString().split('T')[0]);
      setDueTime(taskToEdit.dueTime || '17:00');
      setPriority(taskToEdit.priority || 'high');
      setStatus(taskToEdit.status || 'todo');
      setImportanceScore(taskToEdit.importanceScore ?? 4);
      setUrgencyScore(taskToEdit.urgencyScore ?? 4);
      setRevenueImpactScore(taskToEdit.revenueImpactScore ?? 4);
      setClientPriorityScore(taskToEdit.clientPriorityScore ?? 4);
      setEstimatedHours(taskToEdit.estimatedHours ?? 1);
      setNotes(taskToEdit.notes || '');
      setDriveLink(taskToEdit.driveLink || '');
      setTagInput((taskToEdit.tags || []).join(', ') || 'Operations');
    } else {
      setTitle('');
      setClientId(defaultClientId || clients[0]?.id || '');
      setProjectId('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setDueTime('17:00');
      setPriority('high');
      setStatus('todo');
      setImportanceScore(4);
      setUrgencyScore(4);
      setRevenueImpactScore(4);
      setClientPriorityScore(4);
      setEstimatedHours(1);
      setNotes('');
      setDriveLink('');
      setTagInput('Operations');
    }
  }, [taskToEdit, isOpen, defaultClientId, clients]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedClient = clients.find(c => c.id === clientId);
    const selectedProject = projects.find(p => p.id === projectId);
    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);

    const taskData = {
      title,
      clientId,
      clientName: selectedClient?.name || 'General Client',
      projectId: projectId || undefined,
      projectName: selectedProject?.name,
      dueDate,
      dueTime,
      priority,
      status,
      importanceScore: Number(importanceScore),
      urgencyScore: Number(urgencyScore),
      revenueImpactScore: Number(revenueImpactScore),
      clientPriorityScore: Number(clientPriorityScore),
      estimatedHours: Number(estimatedHours),
      notes,
      driveLink,
      tags
    };

    if (taskToEdit) {
      updateTask(taskToEdit.id, taskData);
    } else {
      addTask(taskData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] border border-border-subtle shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-main">
              {taskToEdit ? 'Edit Task' : 'New Master Task'}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">AEDMIN Task Engine with Multi-Attribute Urgency Scoring</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Task Description</label>
            <input 
              type="text" 
              value={title ?? ''} 
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Finalize Q3 LP Executive Presentation & Agenda"
              className="w-full px-4 py-3 bg-[#FDFBF7] border border-border-subtle rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-card-blue/50"
              required
              autoFocus
            />
          </div>

          {/* Client & Project */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Client Workspace</label>
              <select 
                value={clientId ?? ''} 
                onChange={e => { setClientId(e.target.value); setProjectId(''); }}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Project (Optional)</label>
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> New Project
                </button>
              </div>
              <select 
                value={projectId ?? ''} 
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
              >
                <option value="">-- Standalone / General Ops --</option>
                {filteredProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date & Time & Estimated Hours */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Due Date</label>
              <input 
                type="date" 
                value={dueDate ?? ''} 
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Due Time</label>
              <input 
                type="time" 
                value={dueTime ?? ''} 
                onChange={e => setDueTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Estimated Hours</label>
              <input 
                type="number" 
                step="0.25"
                min="0.25"
                value={estimatedHours ?? 1} 
                onChange={e => setEstimatedHours(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Status</label>
              <select 
                value={status ?? 'todo'} 
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="waiting_client">Waiting for Client</option>
                <option value="waiting_approval">Waiting for Approval</option>
                <option value="waiting_payment">Waiting for Payment</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Priority Tier</label>
              <select 
                value={priority ?? 'high'} 
                onChange={e => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
              >
                <option value="urgent">Urgent & Critical</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low / Backlog</option>
              </select>
            </div>
          </div>

          {/* Formula Scoring Grid */}
          <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-border-subtle">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">AEDMIN Priority Algorithm Factors</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-card-yellow/40 text-amber-900 font-semibold">
                Score: {Math.min(100, Math.round(((importanceScore ?? 4) * 6) + ((urgencyScore ?? 4) * 6) + ((revenueImpactScore ?? 4) * 4) + ((clientPriorityScore ?? 4) * 4)))} / 100
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Importance (1-5)</label>
                <input type="number" min="1" max="5" value={importanceScore ?? 4} onChange={e => setImportanceScore(Number(e.target.value))} className="w-full px-2 py-1.5 bg-white border border-border-subtle rounded-lg text-center font-semibold" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Urgency (1-5)</label>
                <input type="number" min="1" max="5" value={urgencyScore ?? 4} onChange={e => setUrgencyScore(Number(e.target.value))} className="w-full px-2 py-1.5 bg-white border border-border-subtle rounded-lg text-center font-semibold" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Revenue Impact (1-5)</label>
                <input type="number" min="1" max="5" value={revenueImpactScore ?? 4} onChange={e => setRevenueImpactScore(Number(e.target.value))} className="w-full px-2 py-1.5 bg-white border border-border-subtle rounded-lg text-center font-semibold" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Client Priority (1-5)</label>
                <input type="number" min="1" max="5" value={clientPriorityScore ?? 4} onChange={e => setClientPriorityScore(Number(e.target.value))} className="w-full px-2 py-1.5 bg-white border border-border-subtle rounded-lg text-center font-semibold" />
              </div>
            </div>
          </div>

          {/* Drive Link & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Google Drive / Review Link</label>
              <input 
                type="url" 
                value={driveLink ?? ''} 
                onChange={e => setDriveLink(e.target.value)}
                placeholder="https://docs.google.com/..."
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Tags (Comma Separated)</label>
              <input 
                type="text" 
                value={tagInput ?? ''} 
                onChange={e => setTagInput(e.target.value)}
                placeholder="Investor Relations, Ops, Board"
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Operational Context & Notes</label>
            <textarea 
              rows={3} 
              value={notes ?? ''} 
              onChange={e => setNotes(e.target.value)}
              placeholder="Add deliverables, client preferences, or checklist notes..."
              className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-border-subtle text-sm font-medium text-text-muted hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-full bg-sidebar-bg text-white text-sm font-medium hover:bg-sidebar-active transition-colors shadow-sm"
            >
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>

        </form>

      </div>

      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        defaultClientId={clientId}
      />
    </div>
  );
}
