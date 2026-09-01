import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  ArrowRight, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ChevronRight, 
  FileText, 
  Briefcase, 
  UserPlus, 
  MoveRight,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Client, Opportunity } from '@/types';
import { Link } from 'react-router-dom';

interface LifecycleStage {
  id: string;
  name: string;
  badgeColor: string;
  description: string;
}

const CRM_STAGES: LifecycleStage[] = [
  { id: 'lead', name: 'Prospect / Lead', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200', description: 'Inbound inquiries and qualified executive leads' },
  { id: 'discovery', name: 'Discovery & Proposal', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200', description: 'Scope alignment, discovery call, and proposal sent' },
  { id: 'onboarding', name: 'Active Onboarding', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200', description: 'Access setup, NDA/MSA execution, and kickoff' },
  { id: 'active', name: 'Active Retainer / VIP', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', description: 'Ongoing executive partnership and operational rhythm' },
  { id: 'upsell', name: 'Retention & Upsell', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200', description: 'Quarterly reviews, scope expansion, and retainer increases' },
  { id: 'offboarding', name: 'Offboarding & Transition', badgeColor: 'bg-rose-100 text-rose-800 border-rose-200', description: 'Credential revoking, asset handover, and final audit' }
];

export function ClientLifecycleCRM() {
  const { clients, updateClient, opportunities, addOpportunity, updateOpportunity } = useApp();

  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadContact, setNewLeadContact] = useState('');
  const [newLeadValue, setNewLeadValue] = useState('5000');
  const [newLeadStage, setNewLeadStage] = useState('lead');

  // Convert pipeline stage to client lists
  const getStageClients = (stageId: string) => {
    if (stageId === 'lead') {
      return opportunities.filter(o => o.stage === 'lead' || o.stage === 'prospect');
    }
    if (stageId === 'discovery') {
      return opportunities.filter(o => o.stage === 'discovery' || o.stage === 'proposal');
    }
    if (stageId === 'onboarding') {
      return clients.filter(c => c.status === 'onboarding');
    }
    if (stageId === 'active') {
      return clients.filter(c => c.status === 'active');
    }
    if (stageId === 'upsell') {
      return clients.filter(c => c.status === 'active' && (c.relationshipHealth === 'exceptional' || (c.purchasedHours || 0) >= 35));
    }
    if (stageId === 'offboarding') {
      return clients.filter(c => c.status === 'offboarding' || c.status === 'paused');
    }
    return [];
  };

  const handleAdvanceClient = (clientId: string, currentStatus: Client['status']) => {
    const nextStatus: Client['status'] = 
      currentStatus === 'onboarding' ? 'active' :
      currentStatus === 'active' ? 'offboarding' : 'active';
    updateClient(clientId, { status: nextStatus });
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim()) return;

    addOpportunity({
      clientName: newLeadCompany || newLeadName,
      contactPerson: newLeadContact || newLeadName,
      title: `Executive Retainer - ${newLeadCompany || newLeadName}`,
      estimatedValue: Number(newLeadValue) || 5000,
      stage: (newLeadStage === 'discovery' ? 'discovery' : 'lead') as Opportunity['stage'],
      probability: newLeadStage === 'discovery' ? 60 : 30,
      expectedCloseDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      serviceType: 'Executive Retainer',
      notes: `Lead added via Client Lifecycle CRM. Target budget: $${newLeadValue}/mo.`
    });

    setNewLeadName('');
    setNewLeadCompany('');
    setNewLeadContact('');
    setNewLeadValue('5000');
    setNewLeadModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* CRM Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-purple-950 text-white rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-[11px] font-bold tracking-wide uppercase">
              Client Lifecycle CRM Pipeline
            </span>
            <span className="text-xs text-stone-300">End-to-end Relationship Management</span>
          </div>
          <h2 className="text-xl font-bold">Client Acquisition, Retention & Offboarding Hub</h2>
          <p className="text-xs text-stone-300 mt-1 max-w-2xl">
            Track potential executive clients through discovery, manage active high-touch retainers, coordinate scope expansions, and execute structured offboarding protocols.
          </p>
        </div>

        <button
          onClick={() => setNewLeadModalOpen(true)}
          className="px-5 py-2.5 bg-white text-stone-900 hover:bg-stone-100 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Add Pipeline Lead
        </button>
      </div>

      {/* Kanban Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {CRM_STAGES.map((stage) => {
          const items = getStageClients(stage.id);
          const isClientList = stage.id === 'onboarding' || stage.id === 'active' || stage.id === 'upsell' || stage.id === 'offboarding';

          return (
            <div 
              key={stage.id} 
              className="bg-white rounded-2xl border border-[#ECE6DD] p-4 flex flex-col min-h-[480px] shadow-xs"
            >
              {/* Stage Header */}
              <div className="pb-3 border-b border-[#ECE6DD] mb-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${stage.badgeColor}`}>
                    {stage.name}
                  </span>
                  <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 mt-1 line-clamp-2">{stage.description}</p>
              </div>

              {/* Stage Items List */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-1">
                {items.map((item: any) => {
                  if (isClientList) {
                    const client = item as Client;
                    return (
                      <div 
                        key={client.id} 
                        className="p-3 bg-[#FAF8F5] hover:bg-[#F3EFEA] rounded-xl border border-[#ECE6DD] transition-all space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="min-w-0">
                            <span className="text-[9px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-bold">
                              {client.code}
                            </span>
                            <h4 className="text-xs font-bold text-stone-900 truncate mt-0.5">{client.name}</h4>
                            <p className="text-[10px] text-stone-500 truncate">{client.primaryContact}</p>
                          </div>
                          <span className="text-base shrink-0">{client.flagEmoji || '🌐'}</span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-stone-600 pt-1 border-t border-stone-200/60">
                          <span className="font-semibold text-emerald-800">${(client.monthlyRetainerFee || 0).toLocaleString()}/mo</span>
                          <span className="text-stone-500 font-mono">{client.usedHoursThisMonth || 0}h / {client.purchasedHours || 0}h</span>
                        </div>

                        {stage.id === 'offboarding' && (
                          <div className="bg-rose-50 p-2 rounded-lg border border-rose-200 text-[10px] space-y-1">
                            <span className="font-bold text-rose-900 block flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-rose-600" /> Offboarding Checklist
                            </span>
                            <div className="text-stone-600">
                              {client.offboardingChecklist?.filter(i => i.completed).length || 0} of {client.offboardingChecklist?.length || 4} tasks done
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 gap-1">
                          <Link 
                            to={`/clients/${client.id}`}
                            className="text-[10px] text-stone-700 hover:text-purple-700 font-bold flex items-center gap-1"
                          >
                            Workspace <ExternalLink className="w-2.5 h-2.5" />
                          </Link>

                          {stage.id === 'onboarding' && (
                            <button
                              onClick={() => handleAdvanceClient(client.id, 'onboarding')}
                              className="text-[9px] px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-colors"
                            >
                              Launch VIP
                            </button>
                          )}
                          {stage.id === 'active' && (
                            <button
                              onClick={() => handleAdvanceClient(client.id, 'active')}
                              className="text-[9px] px-2 py-0.5 bg-stone-200 hover:bg-rose-100 hover:text-rose-800 text-stone-700 font-bold rounded-full transition-colors"
                            >
                              Offboard
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Opportunity / Lead Item
                  const opp = item as Opportunity;
                  return (
                    <div 
                      key={opp.id} 
                      className="p-3 bg-white hover:bg-stone-50 rounded-xl border border-stone-200 shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 truncate">{opp.clientName}</h4>
                          <p className="text-[10px] text-stone-500 truncate">{opp.contactPerson}</p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                          ${(opp.estimatedValue || 0).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-[10px] text-stone-600 line-clamp-2 bg-[#FAF8F5] p-1.5 rounded-lg border border-[#ECE6DD]">
                        {opp.notes || opp.title}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1">
                        <span>Win Prob: {opp.probability}%</span>
                        <button
                          onClick={() => {
                            const nextStage = stage.id === 'lead' ? 'discovery' : 'closed_won';
                            updateOpportunity(opp.id, { stage: nextStage });
                          }}
                          className="px-2 py-0.5 bg-purple-700 hover:bg-purple-800 text-white text-[9px] font-bold rounded-full flex items-center gap-1"
                        >
                          Advance <ChevronRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {items.length === 0 && (
                  <div className="text-center py-10 border border-dashed border-stone-200 rounded-xl">
                    <p className="text-[10px] text-stone-400">No records in this stage</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to Add New Lead */}
      {newLeadModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#ECE6DD] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECE6DD] pb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-700" />
                Add Inbound Lead or Opportunity
              </h3>
              <button onClick={() => setNewLeadModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Company / Entity Name</label>
                <input 
                  type="text" 
                  value={newLeadCompany} 
                  onChange={e => setNewLeadCompany(e.target.value)} 
                  placeholder="e.g. Apex Frontier VC" 
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Primary Executive Contact</label>
                <input 
                  type="text" 
                  value={newLeadContact} 
                  onChange={e => setNewLeadContact(e.target.value)} 
                  placeholder="e.g. Elena Rostova" 
                  className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Estimated Monthly Retainer ($)</label>
                  <input 
                    type="number" 
                    value={newLeadValue} 
                    onChange={e => setNewLeadValue(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Initial Stage</label>
                  <select 
                    value={newLeadStage} 
                    onChange={e => setNewLeadStage(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border border-[#ECE6DD] bg-white"
                  >
                    <option value="lead">Prospect / Lead</option>
                    <option value="discovery">Discovery & Proposal</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#ECE6DD]">
                <button 
                  type="button" 
                  onClick={() => setNewLeadModalOpen(false)} 
                  className="px-4 py-2 text-stone-600 rounded-full hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-full font-bold shadow-sm"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
