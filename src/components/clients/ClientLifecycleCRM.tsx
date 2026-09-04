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
  ExternalLink,
  Target,
  Layers,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Check
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
  { id: 'lead', name: 'Inbound Leads', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200', description: 'Qualified inquiries & Tally intake prospects' },
  { id: 'discovery', name: 'Discovery & Scoping', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200', description: 'Discovery call held, requirements & scope aligned' },
  { id: 'proposal', name: 'Proposal & Negotiation', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200', description: 'Proposal delivered, terms and SLA under review' },
  { id: 'won_onboarding', name: 'Won & Onboarding', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', description: 'Contract signed, deposit received, system access kickoff' },
  { id: 'active', name: 'Active Retainer / VIP', badgeColor: 'bg-teal-100 text-teal-800 border-teal-200', description: 'Operational rhythm, weekly briefings & deliverable execution' },
  { id: 'upsell', name: 'Retention & Upsell', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200', description: 'High-utilization reviews, scope expansion & retainer bump' },
  { id: 'offboarding', name: 'Offboarding Protocol', badgeColor: 'bg-rose-100 text-rose-800 border-rose-200', description: 'Credential rotation, asset handoff, feedback review' }
];

export function ClientLifecycleCRM() {
  const { clients, updateClient, opportunities, addOpportunity, updateOpportunity, addClient, deleteOpportunity } = useApp();

  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadContact, setNewLeadContact] = useState('');
  const [newLeadValue, setNewLeadValue] = useState('5000');
  const [newLeadStage, setNewLeadStage] = useState<Opportunity['stage']>('lead');
  const [newLeadSource, setNewLeadSource] = useState('Referral');
  const [convertedNotice, setConvertedNotice] = useState<string | null>(null);

  // Synchronize deals & clients across stages
  const getStageItems = (stageId: string) => {
    if (stageId === 'lead') {
      return {
        opps: opportunities.filter(o => o.stage === 'lead' || o.stage === 'prospect'),
        clients: [] as Client[]
      };
    }
    if (stageId === 'discovery') {
      return {
        opps: opportunities.filter(o => o.stage === 'discovery'),
        clients: [] as Client[]
      };
    }
    if (stageId === 'proposal') {
      return {
        opps: opportunities.filter(o => o.stage === 'proposal' || o.stage === 'negotiation'),
        clients: [] as Client[]
      };
    }
    if (stageId === 'won_onboarding') {
      return {
        opps: opportunities.filter(o => o.stage === 'won' || o.stage === 'closed_won'),
        clients: clients.filter(c => c.status === 'onboarding')
      };
    }
    if (stageId === 'active') {
      return {
        opps: [] as Opportunity[],
        clients: clients.filter(c => c.status === 'active')
      };
    }
    if (stageId === 'upsell') {
      return {
        opps: opportunities.filter(o => o.type === 'upsell' && o.stage !== 'won' && o.stage !== 'lost'),
        clients: clients.filter(c => c.status === 'active' && (c.relationshipHealth === 'exceptional' || (c.purchasedHours || 0) >= 35))
      };
    }
    if (stageId === 'offboarding') {
      return {
        opps: [] as Opportunity[],
        clients: clients.filter(c => c.status === 'offboarding' || c.status === 'paused')
      };
    }
    return { opps: [] as Opportunity[], clients: [] as Client[] };
  };

  const handleAdvanceClient = (clientId: string, currentStatus: Client['status']) => {
    const nextStatus: Client['status'] = 
      currentStatus === 'onboarding' ? 'active' :
      currentStatus === 'active' ? 'offboarding' : 'active';
    updateClient(clientId, { status: nextStatus });
  };

  const handleConvertToClient = (opp: Opportunity) => {
    const token = `portal-${opp.company.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const initials = (opp.company || opp.prospectName)
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 4);

    addClient({
      code: initials || 'VIP',
      name: opp.company || opp.prospectName,
      company: opp.company,
      primaryContact: opp.prospectName || opp.contactPerson || 'Executive Client',
      email: opp.email || `contact@${opp.company.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client'}.com`,
      status: 'onboarding',
      contractType: 'retainer',
      monthlyRetainerFee: opp.estimatedValue,
      hourlyRate: 150,
      purchasedHours: Math.max(15, Math.round(opp.estimatedValue / 150)),
      relationshipHealth: 'exceptional',
      onboardingProgress: 0,
      portalToken: token,
      portalCustomNotes: `Welcome ${opp.prospectName}. Your executive deliverables, monthly retainer hours, and active sign-offs are tracked live below.`,
      onboardingPhases: [
        {
          id: 1,
          name: "Phase 1: Welcome & Executive Setup",
          description: "Systems access, credentials, and async communication norms",
          completed: false,
          items: [
            { id: 'ob-1', title: 'Collect Google Workspace & password access', completed: false },
            { id: 'ob-2', title: 'Schedule kickoff & communications alignment sync', completed: false },
            { id: 'ob-3', title: 'Review & Publish Executive Briefing Portal', completed: false }
          ]
        }
      ],
      avatarColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      intelligence: {
        executiveProfile: {
          preferredName: opp.prospectName || 'Executive Lead',
          timezone: 'America/New_York (EST)',
          communicationStyle: 'Direct, async updates via Slack/Email with weekly executive briefing.',
          meetingPreferences: 'Mornings, agenda required in advance.',
          decisionMakingStyle: 'Options-oriented with pros/cons.',
          reportingPreferences: 'Weekly Friday briefing.'
        },
        businessProfile: {
          company: opp.company,
          industry: 'Professional Services / Venture / Tech',
          website: 'https://example.com',
          coreServices: opp.serviceInterest || 'Executive Retainer',
          currentGoals: 'Scale executive bandwidth and operational cadence.',
          keyChallenges: 'Calendar fragmentation and deliverable bottlenecks.',
          keyTeamMembers: 'Executive Team',
          primaryVendors: 'Google Workspace, Slack, Notion',
          coreSystems: 'Google Drive, Slack, Notion'
        },
        relationshipProfile: {
          hobbies: 'Fitness, Travel',
          interests: 'Strategy, Tech & AI',
          travelPreferences: 'Aisle seat, boutique hotels',
          favoriteRestaurants: 'Farm-to-table',
          giftIdeas: 'Executive stationery, specialty coffee',
          personalNotes: opp.notes || 'Converted from Business Development pipeline.'
        },
        lifestyleContext: {},
        memoryVault: [
          {
            id: `mv-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            title: 'Client Onboarding from Pipeline',
            content: `Converted from Deal Pipeline database. Scope: ${opp.serviceInterest || 'Executive Retainer'}. Monthly value: $${opp.estimatedValue}. Portal Key: ${token}`,
            category: 'context',
            visibility: 'internal_only'
          }
        ]
      }
    });

    updateOpportunity(opp.id, { stage: 'won' });
    setConvertedNotice(`Converted "${opp.company || opp.prospectName}" into an active client workspace with portal key: ${token}`);
    setTimeout(() => setConvertedNotice(null), 5000);
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadCompany.trim() && !newLeadName.trim()) return;

    addOpportunity({
      prospectName: newLeadContact || newLeadName || 'Executive Lead',
      company: newLeadCompany || newLeadName,
      contactPerson: newLeadContact || newLeadName,
      clientName: newLeadCompany || newLeadName,
      type: 'lead',
      stage: newLeadStage,
      estimatedValue: Number(newLeadValue) || 5000,
      confidencePercentage: newLeadStage === 'proposal' ? 70 : newLeadStage === 'discovery' ? 50 : 30,
      serviceInterest: 'Executive Operations & Strategic EA',
      source: newLeadSource || 'Inbound',
      nextFollowUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      notes: `Ingested into synced Lifecycle CRM. Target retainer: $${newLeadValue}/mo.`,
      createdAt: new Date().toISOString().split('T')[0]
    });

    setNewLeadName('');
    setNewLeadCompany('');
    setNewLeadContact('');
    setNewLeadValue('5000');
    setNewLeadModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. APPLE LIGHT SILVER SOFT GLASS HERO BANNER */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-white/95 via-slate-50/90 to-slate-100/90 backdrop-blur-2xl border border-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-6 md:p-8 space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-100/30 via-blue-100/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-100/20 via-slate-100/20 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-800 text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5 backdrop-blur-md">
                <Target className="w-3.5 h-3.5 text-purple-600" />
                Synced Pipeline & Client Lifecycle CRM
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Directly Synchronized with Deal Pipeline Database
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Client Lifecycle & Pipeline Flow
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Seamlessly monitor every executive relationship from inbound lead capture through discovery, proposal, active onboarding, high-touch retainer governance, and graceful offboarding.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setNewLeadModalOpen(true)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Add Pipeline Deal
            </button>
          </div>
        </div>

        {convertedNotice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-2xs">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{convertedNotice}</span>
          </div>
        )}
      </div>

      {/* 2. SYNCED KANBAN PIPELINE BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {CRM_STAGES.map((stage) => {
          const { opps, clients: stageClients } = getStageItems(stage.id);
          const totalCount = opps.length + stageClients.length;

          return (
            <div 
              key={stage.id} 
              className="bg-white/80 backdrop-blur-md rounded-[24px] border border-slate-200/80 p-4 flex flex-col min-h-[520px] shadow-xs hover:border-slate-300 transition-all"
            >
              {/* Stage Header */}
              <div className="pb-3 border-b border-slate-200/60 mb-3">
                <div className="flex items-center justify-between gap-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border truncate ${stage.badgeColor}`}>
                    {stage.name}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                    {totalCount}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-snug">{stage.description}</p>
              </div>

              {/* Stage Items List */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[640px] pr-1">
                
                {/* 1. Deals from Pipeline */}
                {opps.map((opp) => (
                  <div 
                    key={opp.id} 
                    className="p-3.5 bg-[#FAF7F2] hover:bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-2.5 group"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md border border-purple-100">
                          {opp.source || 'Pipeline Deal'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate mt-1">
                          {opp.company || opp.prospectName}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate">
                          {opp.prospectName || opp.contactPerson}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
                        ${(opp.estimatedValue || 0).toLocaleString()}/mo
                      </span>
                    </div>

                    {opp.notes && (
                      <p className="text-[10px] text-slate-600 line-clamp-2 bg-white/80 p-2 rounded-xl border border-slate-200/60 leading-relaxed">
                        {opp.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>{opp.confidencePercentage || opp.probability || 50}% Prob</span>
                      {opp.nextFollowUpDate && (
                        <span className="text-slate-400 font-mono text-[9px]">Due {opp.nextFollowUpDate}</span>
                      )}
                    </div>

                    {/* Quick Pipeline Stage Changer */}
                    <div className="pt-1 flex items-center justify-between gap-1">
                      <select
                        value={opp.stage ?? 'lead'}
                        onChange={e => updateOpportunity(opp.id, { stage: e.target.value as Opportunity['stage'] })}
                        aria-label="Change Stage"
                        className="text-[10px] font-semibold bg-white border border-slate-300 rounded-xl px-2 py-1 w-full text-slate-800 focus:outline-none"
                      >
                        <option value="lead">Lead</option>
                        <option value="discovery">Discovery</option>
                        <option value="proposal">Proposal</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="won">Closed / Won</option>
                        <option value="lost">Lost</option>
                      </select>

                      <button
                        onClick={() => deleteOpportunity(opp.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Deal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Convert Button if Won or in Won Stage */}
                    {(opp.stage === 'won' || opp.stage === 'closed_won') && (
                      <button
                        onClick={() => handleConvertToClient(opp)}
                        className="w-full mt-1 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        Create Workspace
                      </button>
                    )}
                  </div>
                ))}

                {/* 2. Active / Onboarding Clients */}
                {stageClients.map((client) => (
                  <div 
                    key={client.id} 
                    className="p-3.5 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-bold">
                          {client.code}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{client.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{client.primaryContact}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                        ${(client.monthlyRetainerFee || 0).toLocaleString()}/mo
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1 border-t border-slate-100">
                      <span className="font-mono text-slate-500">
                        {client.usedHoursThisMonth || 0}h / {client.purchasedHours || 0}h
                      </span>
                      <span className="text-[9px] font-semibold text-slate-400 capitalize">
                        {client.status}
                      </span>
                    </div>

                    {stage.id === 'won_onboarding' && (
                      <div className="bg-amber-50 p-2 rounded-xl border border-amber-200/80 text-[10px] space-y-1">
                        <div className="flex items-center justify-between font-bold text-amber-900">
                          <span>Onboarding</span>
                          <span>{client.onboardingProgress || 0}%</span>
                        </div>
                        <div className="w-full bg-amber-200/60 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-amber-600 h-full rounded-full transition-all" 
                            style={{ width: `${client.onboardingProgress || 0}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {stage.id === 'offboarding' && (
                      <div className="bg-rose-50 p-2 rounded-xl border border-rose-200 text-[10px] space-y-1">
                        <span className="font-bold text-rose-900 block flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-rose-600" /> Offboarding Checklist
                        </span>
                        <div className="text-slate-600">
                          {client.offboardingChecklist?.filter(i => i.completed).length || 0} of {client.offboardingChecklist?.length || 4} tasks done
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 gap-1">
                      <Link 
                        to={`/clients/${client.id}`}
                        className="text-[10px] text-slate-700 hover:text-purple-700 font-bold flex items-center gap-1"
                      >
                        Workspace <ExternalLink className="w-2.5 h-2.5" />
                      </Link>

                      {stage.id === 'won_onboarding' && (
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
                          className="text-[9px] px-2 py-0.5 bg-slate-100 hover:bg-rose-100 hover:text-rose-800 text-slate-700 font-bold rounded-full transition-colors"
                        >
                          Offboard
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {totalCount === 0 && (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
                    <p className="text-[10px] text-slate-400 font-medium">No records in this stage</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to Add New Pipeline Deal */}
      {newLeadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-[28px] border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-600" />
                Add Inbound Lead to Pipeline Database
              </h3>
              <button onClick={() => setNewLeadModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Company / Entity Name</label>
                <input 
                  type="text" 
                  value={newLeadCompany} 
                  onChange={e => setNewLeadCompany(e.target.value)} 
                  placeholder="e.g. Apex Frontier VC" 
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Primary Executive Contact</label>
                <input 
                  type="text" 
                  value={newLeadContact} 
                  onChange={e => setNewLeadContact(e.target.value)} 
                  placeholder="e.g. Elena Rostova" 
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Retainer ($/mo)</label>
                  <input 
                    type="number" 
                    value={newLeadValue} 
                    onChange={e => setNewLeadValue(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Initial Stage</label>
                  <select 
                    value={newLeadStage} 
                    onChange={e => setNewLeadStage(e.target.value as Opportunity['stage'])} 
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none"
                  >
                    <option value="lead">Inbound Lead</option>
                    <option value="discovery">Discovery Call</option>
                    <option value="proposal">Proposal Sent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lead Source</label>
                <select 
                  value={newLeadSource} 
                  onChange={e => setNewLeadSource(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none"
                >
                  <option value="Referral">Client Referral</option>
                  <option value="Tally.so Form">Tally.so Intake Form</option>
                  <option value="LinkedIn">LinkedIn Outreach</option>
                  <option value="Website">Website Inbound</option>
                  <option value="Network">Personal Network</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setNewLeadModalOpen(false)} 
                  className="px-4 py-2 text-slate-600 rounded-full hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-full font-bold shadow-xs active:scale-95"
                >
                  Save Deal to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

