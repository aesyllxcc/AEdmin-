import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Link2, 
  Calendar, 
  User, 
  FileText, 
  Sparkles,
  Layers,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { ApprovalItem } from '@/types';
import { useApp } from '@/context/AppContext';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  approvalToEdit?: ApprovalItem | null;
  defaultClientId?: string;
}

export function ApprovalModal({
  isOpen,
  onClose,
  approvalToEdit,
  defaultClientId
}: ApprovalModalProps) {
  const { clients, userProfile, addApproval, updateApprovalStatus } = useApp();

  const [clientId, setClientId] = useState(defaultClientId || clients[0]?.id || '');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ApprovalItem['type']>('deliverable');
  const [priority, setPriority] = useState<ApprovalItem['priority']>('high');
  const [ownerName, setOwnerName] = useState(userProfile.fullName || 'Executive Lead');
  const [assignedApprover, setAssignedApprover] = useState('');
  const [reviewLink, setReviewLink] = useState('');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]);
  const [context, setContext] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [slaHours, setSlaHours] = useState(24);

  useEffect(() => {
    if (approvalToEdit) {
      setClientId(approvalToEdit.clientId);
      setTitle(approvalToEdit.title);
      setType(approvalToEdit.type || 'deliverable');
      setPriority(approvalToEdit.priority || 'high');
      setOwnerName(approvalToEdit.ownerName || userProfile.fullName);
      setAssignedApprover(approvalToEdit.assignedApprover || '');
      setReviewLink(approvalToEdit.reviewLink || '');
      setDueDate(approvalToEdit.dueDate || new Date().toISOString().split('T')[0]);
      setContext(approvalToEdit.context || '');
      setRecommendation(approvalToEdit.recommendation || '');
      setSlaHours(approvalToEdit.slaHours || 24);
    } else {
      const curClient = clients.find(c => c.id === (defaultClientId || clients[0]?.id));
      setClientId(defaultClientId || clients[0]?.id || '');
      setTitle('');
      setType('deliverable');
      setPriority('high');
      setOwnerName(userProfile.fullName || 'Executive Lead');
      setAssignedApprover(curClient?.primaryContact || curClient?.name || 'Client Lead');
      setReviewLink('');
      setDueDate(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]);
      setContext('');
      setRecommendation('');
      setSlaHours(24);
    }
  }, [approvalToEdit, defaultClientId, isOpen, clients, userProfile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientId) return;

    const selectedClient = clients.find(c => c.id === clientId);

    addApproval({
      clientId,
      clientName: selectedClient?.name || 'Client',
      title: title.trim(),
      type,
      priority,
      ownerName: ownerName.trim() || userProfile.fullName,
      assignedApprover: assignedApprover.trim() || selectedClient?.primaryContact || 'Client Lead',
      reviewLink: reviewLink.trim(),
      dueDate,
      comments: '',
      context: context.trim(),
      recommendation: recommendation.trim(),
      status: 'pending',
      slaHours: Number(slaHours) || 24,
      reminderCount: 0
    } as any);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white max-w-xl w-full rounded-[32px] border border-slate-200/80 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-inner">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                {approvalToEdit ? 'Edit Deliverable Approval' : 'New Approval Request'}
              </h2>
              <p className="text-xs text-slate-500">
                Publish a high-priority sign-off for client review and unblock workflows.
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Client *</label>
              <select
                value={clientId}
                onChange={e => {
                  setClientId(e.target.value);
                  const cl = clients.find(c => c.id === e.target.value);
                  if (cl) setAssignedApprover(cl.primaryContact || cl.name);
                }}
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
              <label className="block font-bold text-slate-700 mb-1">Approval Category</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
              >
                <option value="deliverable">Finished Deliverable</option>
                <option value="design_proof">Design & Visual Proof</option>
                <option value="content_copy">Content & Copy Draft</option>
                <option value="schedule_change">Calendar & Schedule Shift</option>
                <option value="budget_expansion">Budget & Scope Expansion</option>
                <option value="expense_reimbursement">Expense Reimbursement</option>
                <option value="invoice_approval">Invoice / Payment Greenlight</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Deliverable / Decision Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Q3 Investor Summit Pitch Deck (vFinal Sign-off)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Review Asset URL / Google Drive Link</label>
            <div className="relative">
              <Link2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                placeholder="https://docs.google.com/presentation/d/..."
                value={reviewLink}
                onChange={e => setReviewLink(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
              >
                <option value="urgent">Urgent (Immediate)</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Decision Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target SLA (Hours)</label>
              <input
                type="number"
                value={slaHours}
                onChange={e => setSlaHours(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Context & Summary</label>
              <textarea
                rows={2}
                placeholder="Background context regarding what was completed..."
                value={context}
                onChange={e => setContext(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Assistant Recommendation</label>
              <textarea
                rows={2}
                placeholder="Suggested path forward or next action upon approval..."
                value={recommendation}
                onChange={e => setRecommendation(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none font-medium"
              />
            </div>
          </div>

          {/* Actions */}
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
              Publish for Approval
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
