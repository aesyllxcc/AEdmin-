import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Clock, Percent, DollarSign } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { TimeEntry, TimeAllocation } from '@/types';

interface TimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryToEdit?: TimeEntry | null;
  defaultClientId?: string;
}

export function TimeModal({ isOpen, onClose, entryToEdit, defaultClientId }: TimeModalProps) {
  const { clients, projects, tasks, addTimeEntry, updateTimeEntry } = useApp();

  const [clientId, setClientId] = useState(entryToEdit?.clientId || defaultClientId || clients[0]?.id || '');
  const [projectId, setProjectId] = useState(entryToEdit?.projectId || '');
  const [taskId, setTaskId] = useState(entryToEdit?.taskId || '');
  const [date, setDate] = useState(entryToEdit?.date || new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState<number>(entryToEdit?.durationMinutes ?? 60);
  const [isBillable, setIsBillable] = useState(entryToEdit?.isBillable ?? true);
  const [hourlyRate, setHourlyRate] = useState<number>(entryToEdit?.hourlyRate ?? 150);
  const [notes, setNotes] = useState(entryToEdit?.notes || '');
  const [tagsInput, setTagsInput] = useState((entryToEdit?.tags || []).join(', ') || 'Deep Work, Ops');
  const [editReason, setEditReason] = useState(entryToEdit?.editReason || '');

  // Multi-allocation toggle and items
  const [useMultiAllocation, setUseMultiAllocation] = useState(Boolean(entryToEdit?.allocations && entryToEdit.allocations.length > 0));
  const [allocations, setAllocations] = useState<TimeAllocation[]>(entryToEdit?.allocations || [
    { id: 'alc_1', targetType: 'client', targetId: clientId, targetName: 'Primary Client Work', percentage: 70 },
    { id: 'alc_2', targetType: 'task', targetId: 'general', targetName: 'Meeting Prep / Communications', percentage: 30 }
  ]);

  useEffect(() => {
    if (entryToEdit) {
      const selectedClient = entryToEdit.clientId || defaultClientId || clients[0]?.id || '';
      setClientId(selectedClient);
      setProjectId(entryToEdit.projectId || '');
      setTaskId(entryToEdit.taskId || '');
      setDate(entryToEdit.date || new Date().toISOString().split('T')[0]);
      setDurationMinutes(entryToEdit.durationMinutes ?? 60);
      setIsBillable(entryToEdit.isBillable ?? true);
      setHourlyRate(entryToEdit.hourlyRate ?? 150);
      setNotes(entryToEdit.notes || '');
      setTagsInput((entryToEdit.tags || []).join(', ') || 'Deep Work, Ops');
      setEditReason(entryToEdit.editReason || '');
      setUseMultiAllocation(Boolean(entryToEdit.allocations && entryToEdit.allocations.length > 0));
      setAllocations(entryToEdit.allocations && entryToEdit.allocations.length > 0 ? entryToEdit.allocations : [
        { id: 'alc_1', targetType: 'client', targetId: selectedClient, targetName: 'Primary Client Work', percentage: 70 },
        { id: 'alc_2', targetType: 'task', targetId: 'general', targetName: 'Meeting Prep / Communications', percentage: 30 }
      ]);
    } else {
      const defaultClient = defaultClientId || clients[0]?.id || '';
      setClientId(defaultClient);
      setProjectId('');
      setTaskId('');
      setDate(new Date().toISOString().split('T')[0]);
      setDurationMinutes(60);
      setIsBillable(true);
      setHourlyRate(150);
      setNotes('');
      setTagsInput('Deep Work, Ops');
      setEditReason('');
      setUseMultiAllocation(false);
      setAllocations([
        { id: 'alc_1', targetType: 'client', targetId: defaultClient, targetName: 'Primary Client Work', percentage: 70 },
        { id: 'alc_2', targetType: 'task', targetId: 'general', targetName: 'Meeting Prep / Communications', percentage: 30 }
      ]);
    }
  }, [entryToEdit, isOpen, defaultClientId, clients]);

  if (!isOpen) return null;

  const handleAddAllocation = () => {
    setAllocations(prev => [
      ...prev,
      { id: `alc_${Date.now()}`, targetType: 'project', targetId: '', targetName: 'Additional Allocation', percentage: 0 }
    ]);
  };

  const handleUpdateAllocation = (id: string, field: keyof TimeAllocation, value: any) => {
    setAllocations(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleRemoveAllocation = (id: string) => {
    if (allocations.length > 1) {
      setAllocations(prev => prev.filter(a => a.id !== id));
    }
  };

  const totalAllocationPercentage = allocations.reduce((sum, a) => sum + (Number(a.percentage) || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === clientId);
    const project = projects.find(p => p.id === projectId);
    const task = tasks.find(t => t.id === taskId);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const value = isBillable ? Math.round((durationMinutes / 60) * hourlyRate) : 0;

    const entryData = {
      date,
      startTime: entryToEdit?.startTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMinutes: Number(durationMinutes),
      isBillable,
      clientId,
      clientName: client?.name || 'General Client',
      projectId: projectId || undefined,
      projectName: project?.name,
      taskId: taskId || undefined,
      taskTitle: task?.title,
      hourlyRate: Number(hourlyRate),
      value,
      notes,
      tags,
      allocations: useMultiAllocation ? allocations : undefined
    };

    if (entryToEdit) {
      updateTimeEntry(entryToEdit.id, entryData, editReason || 'Operational adjustment to time log');
    } else {
      addTimeEntry(entryData, editReason || 'Logged new work session');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] border border-border-subtle shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-main">
              {entryToEdit ? 'Edit Time Log' : 'Log Work Time'}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">AEDMIN Precise Time Engine with Multi-Target Allocation</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Client</label>
              <select 
                value={clientId ?? ''} 
                onChange={e => setClientId(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Project (Optional)</label>
              <select 
                value={projectId ?? ''} 
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
              >
                <option value="">-- General Client Retainer Work --</option>
                {projects.filter(p => !clientId || p.clientId === clientId).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Date</label>
              <input 
                type="date" 
                value={date ?? ''} 
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Duration (Minutes)</label>
              <input 
                type="number" 
                min="5" 
                step="5" 
                value={durationMinutes ?? 60} 
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Hourly Rate ($)</label>
              <input 
                type="number" 
                value={hourlyRate ?? 150} 
                onChange={e => setHourlyRate(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 p-4 bg-[#FDFBF7] rounded-2xl border border-border-subtle">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input 
                type="checkbox" 
                checked={Boolean(isBillable)} 
                onChange={e => setIsBillable(e.target.checked)}
                className="w-4 h-4 rounded text-sidebar-bg focus:ring-card-blue"
              />
              Billable to Client
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input 
                type="checkbox" 
                checked={Boolean(useMultiAllocation)} 
                onChange={e => setUseMultiAllocation(e.target.checked)}
                className="w-4 h-4 rounded text-sidebar-bg focus:ring-card-blue"
              />
              Enable Multi-Allocation Breakdown
            </label>
          </div>

          {/* Multi-Allocation Details */}
          {useMultiAllocation && (
            <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-900">Multi-Target Time Allocation</h4>
                  <p className="text-xs text-amber-700">Split 1 single session across multiple projects or client work streams</p>
                </div>
                <button 
                  type="button" 
                  onClick={handleAddAllocation}
                  className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-amber-200"
                >
                  <Plus className="w-3 h-3" /> Add Target
                </button>
              </div>

              <div className="space-y-2">
                {allocations.map((alc, idx) => (
                  <div key={alc.id} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-amber-200/70">
                    <input 
                      type="text" 
                      value={alc.targetName ?? ''} 
                      onChange={e => handleUpdateAllocation(alc.id, 'targetName', e.target.value)}
                      placeholder="Target Stream (e.g. Website Design, Ops, Sync)"
                      className="flex-1 px-3 py-1 bg-transparent text-xs font-medium focus:outline-none"
                    />
                    <div className="flex items-center gap-1 w-24">
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={alc.percentage ?? 0} 
                        onChange={e => handleUpdateAllocation(alc.id, 'percentage', Number(e.target.value))}
                        className="w-14 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-center"
                      />
                      <span className="text-xs text-gray-500 font-bold">%</span>
                    </div>
                    {allocations.length > 1 && (
                      <button type="button" onClick={() => handleRemoveAllocation(alc.id)} className="p-1 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs font-semibold pt-1 text-amber-900">
                <span>Total Allocated:</span>
                <span className={totalAllocationPercentage === 100 ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>
                  {totalAllocationPercentage}% {totalAllocationPercentage !== 100 && '(Must total 100%)'}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Work Notes & Completed Items</label>
            <textarea 
              rows={3} 
              value={notes ?? ''} 
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Finalized LP prospectus revisions, updated cap table metrics..."
              className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
            />
          </div>

          {/* Audit Logging & Traceability Context */}
          <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-gray-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-text-main uppercase tracking-wider">
                {entryToEdit ? 'Reason for Modification (Audit Log)' : 'Session Justification / Scope'}
              </label>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Automatic Audit Trail Active
              </span>
            </div>
            <input 
              type="text" 
              value={editReason ?? ''} 
              onChange={e => setEditReason(e.target.value)}
              placeholder={entryToEdit ? "e.g. Client requested duration correction after task review" : "e.g. Regular monthly retainer support work"}
              className="w-full px-4 py-2 bg-white border border-border-subtle rounded-xl text-xs font-medium focus:outline-none"
            />
            {entryToEdit?.lastModified && (
              <p className="text-[11px] text-text-muted">
                Last modified: {new Date(entryToEdit.lastModified).toLocaleString()} by {entryToEdit.modifiedBy || 'System User'}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
            <div className="text-sm font-semibold text-text-muted">
              Calculated Value: <span className="text-text-main font-bold">${isBillable ? Math.round((durationMinutes / 60) * hourlyRate) : 0}</span>
            </div>
            <div className="flex items-center gap-3">
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
                {entryToEdit ? 'Update Entry' : 'Log Time'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
