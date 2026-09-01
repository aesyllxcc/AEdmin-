import React, { useState } from 'react';
import { 
  CheckSquare, 
  Users, 
  FileText, 
  Clock, 
  Briefcase, 
  Send, 
  Plus, 
  X,
  Wallet,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { TaskModal } from './TaskModal';
import { ClientModal } from './ClientModal';
import { InvoiceModal } from './InvoiceModal';
import { TimeModal } from './TimeModal';

export function QuickActionModal() {
  const { quickActionOpen, setQuickActionOpen, startTimer } = useApp();

  const [activeModal, setActiveModal] = useState<'task' | 'client' | 'invoice' | 'time' | null>(null);

  if (!quickActionOpen) return (
    <>
      {activeModal === 'task' && <TaskModal isOpen={true} onClose={() => setActiveModal(null)} />}
      {activeModal === 'client' && <ClientModal isOpen={true} onClose={() => setActiveModal(null)} />}
      {activeModal === 'invoice' && <InvoiceModal isOpen={true} onClose={() => setActiveModal(null)} />}
      {activeModal === 'time' && <TimeModal isOpen={true} onClose={() => setActiveModal(null)} />}
    </>
  );

  const actions = [
    {
      id: 'task',
      title: 'New Master Task',
      desc: 'Add actionable item with urgency & priority scoring',
      icon: CheckSquare,
      color: 'bg-card-blue/20 text-blue-800',
      onClick: () => { setQuickActionOpen(false); setActiveModal('task'); }
    },
    {
      id: 'timer',
      title: 'Start Live Timer',
      desc: 'Begin tracking active billable session right now',
      icon: Clock,
      color: 'bg-emerald-50 text-emerald-800',
      onClick: () => { setQuickActionOpen(false); startTimer(); }
    },
    {
      id: 'client',
      title: 'New Client Workspace',
      desc: 'Set up executive intelligence, retainer, and onboarding',
      icon: Users,
      color: 'bg-card-yellow/30 text-amber-900',
      onClick: () => { setQuickActionOpen(false); setActiveModal('client'); }
    },
    {
      id: 'invoice',
      title: 'Generate Invoice',
      desc: 'Create and issue a template-based invoice',
      icon: Wallet,
      color: 'bg-card-pink/30 text-purple-900',
      onClick: () => { setQuickActionOpen(false); setActiveModal('invoice'); }
    },
    {
      id: 'time',
      title: 'Manual Time Entry',
      desc: 'Log completed hours with multi-target allocations',
      icon: Clock,
      color: 'bg-gray-100 text-gray-800',
      onClick: () => { setQuickActionOpen(false); setActiveModal('time'); }
    }
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="bg-white rounded-[28px] border border-border-subtle shadow-2xl max-w-lg w-full p-6 md:p-8">
          
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-6">
            <div>
              <h2 className="text-xl font-semibold text-text-main">Quick Command Bar</h2>
              <p className="text-xs text-text-muted mt-0.5">AEDMIN Fast Execution Action Center</p>
            </div>
            <button onClick={() => setQuickActionOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {actions.map(action => (
              <button
                key={action.id}
                onClick={action.onClick}
                className="w-full p-4 rounded-2xl border border-border-subtle hover:border-gray-300 bg-[#FDFBF7] hover:bg-white flex items-center gap-4 transition-all text-left group shadow-xs hover:shadow-md"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color} shrink-0`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-text-main group-hover:text-black">{action.title}</h4>
                  <p className="text-xs text-text-muted truncate mt-0.5">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>

      {activeModal === 'task' && <TaskModal isOpen={true} onClose={() => setActiveModal(null)} />}
      {activeModal === 'client' && <ClientModal isOpen={true} onClose={() => setActiveModal(null)} />}
      {activeModal === 'invoice' && <InvoiceModal isOpen={true} onClose={() => setActiveModal(null)} />}
      {activeModal === 'time' && <TimeModal isOpen={true} onClose={() => setActiveModal(null)} />}
    </>
  );
}
