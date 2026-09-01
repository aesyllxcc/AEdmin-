import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Folder, 
  Slack, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Edit, 
  FileText, 
  User, 
  Heart, 
  Building2, 
  BookOpen, 
  MessageSquare,
  Play,
  Send,
  Eye,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Globe,
  Plane,
  Sparkles,
  Settings2,
  MapPin,
  Sun,
  Moon
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { TaskModal } from "@/components/modals/TaskModal";
import { ClientModal } from "@/components/modals/ClientModal";
import { InvoiceModal } from "@/components/modals/InvoiceModal";
import { TimeModal } from "@/components/modals/TimeModal";
import { ClientGlobalOpsModal } from "@/components/globalOps/ClientGlobalOpsModal";
import { StakeholderMeetingOverlapFinder } from "@/components/clients/StakeholderMeetingOverlapFinder";
import { ClientProfileExpanded } from "@/components/clients/ClientProfileExpanded";
import { ClientOnboardingWorkspace } from "@/components/clients/ClientOnboardingWorkspace";
import { ClientOffboardingWorkspace } from "@/components/clients/ClientOffboardingWorkspace";
import { getClientLiveTime, getClientEffectiveLocation } from "@/utils/timezoneUtils";

export default function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { 
    clients, 
    tasks, 
    invoices, 
    timeEntries, 
    approvals, 
    updateClient, 
    toggleTaskStatus, 
    startTimer, 
    setPortalClientId 
  } = useApp();

  const client = clients.find(c => c.id === clientId);

  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence' | 'stakeholders' | 'onboarding' | 'tasks' | 'time' | 'finance' | 'approvals' | 'offboarding'>('overview');
  
  // Modals
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [globalOpsModalOpen, setGlobalOpsModalOpen] = useState(false);

  // New Memory Vault item state
  const [newMemoryNote, setNewMemoryNote] = useState("");
  const [newMemoryCategory, setNewMemoryCategory] = useState<"preference" | "fact" | "rule" | "contact">("preference");

  if (!client) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-text-main">Client Workspace Not Found</h2>
        <p className="text-xs text-text-muted mt-2">The client you requested does not exist or has been removed.</p>
        <Link to="/clients" className="mt-4 inline-block px-5 py-2.5 bg-sidebar-bg text-white text-xs font-semibold rounded-full">
          Return to Client Directory
        </Link>
      </div>
    );
  }

  // Filtered Client specific data
  const clientTasks = tasks.filter(t => t.clientId === client.id && !t.isArchived);
  const clientInvoices = invoices.filter(i => i.clientId === client.id);
  const clientTimeEntries = timeEntries.filter(t => t.clientId === client.id);
  const clientApprovals = approvals.filter(a => a.clientId === client.id);

  const purchased = client.purchasedHours || 0;
  const used = client.usedHoursThisMonth || 0;
  const monthlyFee = client.monthlyRetainerFee || 0;
  const hourlyRate = client.hourlyRate || 0;
  const totalRevenue = client.totalRevenueYTD || 0;
  const usagePercent = purchased > 0 
    ? Math.round((used / purchased) * 100) 
    : 0;

  const handleAddMemoryVaultItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryNote.trim()) return;

    const newItem = {
      id: `mem_${Date.now()}`,
      category: newMemoryCategory,
      content: newMemoryNote.trim(),
      dateAdded: new Date().toISOString().split('T')[0]
    };

    const currentVault = client.intelligence.memoryVault || [];
    updateClient(client.id, {
      intelligence: {
        ...client.intelligence,
        memoryVault: [newItem, ...currentVault]
      }
    });

    setNewMemoryNote("");
  };

  const handleToggleOnboardingItem = (phaseIndex: number, itemIndex: number) => {
    const phases = [...(client.onboardingPhases || [])];
    if (!phases[phaseIndex]) return;

    phases[phaseIndex].items[itemIndex].completed = !phases[phaseIndex].items[itemIndex].completed;
    
    // Recalculate progress
    const allItems = phases.flatMap(p => p.items);
    const completedItems = allItems.filter(i => i.completed).length;
    const progress = allItems.length > 0 ? Math.round((completedItems / allItems.length) * 100) : 100;

    updateClient(client.id, {
      onboardingPhases: phases,
      onboardingProgress: progress,
      status: progress === 100 ? 'active' : 'onboarding'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle/60">
        <div className="flex items-center gap-4">
          <Link 
            to="/clients" 
            className="p-2 rounded-full bg-white border border-border-subtle hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${client.avatarColor} flex items-center justify-center font-bold text-base text-text-main shadow-xs`}>
              {client.code}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-text-main">{client.name}</h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                  client.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                  client.status === 'onboarding' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {client.status}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {client.company} • Principal: <span className="font-semibold text-text-main">{client.primaryContact}</span> ({client.email})
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {client.googleDriveFolderUrl && (
            <a
              href={client.googleDriveFolderUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-white border border-border-subtle hover:bg-gray-50 text-text-main rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Folder className="w-3.5 h-3.5 text-card-blue" />
              Drive Hub
            </a>
          )}

          <button
            onClick={() => {
              setPortalClientId(client.id);
              navigate('/portal');
            }}
            className="px-3.5 py-2 bg-white border border-border-subtle hover:bg-gray-50 text-text-main rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            title="Preview Client Briefing Portal"
          >
            <Eye className="w-3.5 h-3.5 text-card-pink" />
            Portal Preview
          </button>

          <button
            onClick={() => startTimer({ clientId: client.id, notes: `Client deep work session for ${client.name}` })}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Play className="w-3 h-3 fill-current" />
            Track Time
          </button>

          <button
            onClick={() => setGlobalOpsModalOpen(true)}
            className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            title="Configure Client Global Times & Hours"
          >
            <Globe className="w-3.5 h-3.5 text-purple-600" />
            Global Times
          </button>

          <button
            onClick={() => setClientModalOpen(true)}
            className="p-2 bg-white border border-border-subtle hover:bg-gray-50 text-gray-600 rounded-full transition-colors"
            title="Edit Client Settings"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border-subtle gap-6 overflow-x-auto">
        {[
          { id: 'overview', label: 'Workspace Overview' },
          { id: 'intelligence', label: 'Executive Intelligence & 360° Profile' },
          { id: 'stakeholders', label: 'Stakeholder Overlap' },
          { id: 'onboarding', label: `Onboarding (${client.onboardingProgress}%)` },
          { id: 'tasks', label: `Tasks (${clientTasks.length})` },
          { id: 'time', label: `Time & Retainer (${client.usedHoursThisMonth}h)` },
          { id: 'finance', label: `Invoices (${clientInvoices.length})` },
          { id: 'approvals', label: `Approvals (${clientApprovals.length})` },
          { id: 'offboarding', label: 'Offboarding Protocol' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-sidebar-bg text-text-main font-bold' 
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Top Metric Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-card-yellow p-5 rounded-[24px] border border-black/5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-950/70">Retainer Allocation</span>
              <div className="text-2xl font-extrabold text-amber-950 mt-1">{used}h / {purchased}h</div>
              <div className="w-full bg-amber-950/15 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-950 h-full rounded-full" style={{ width: `${Math.min(100, usagePercent)}%` }} />
              </div>
            </div>

            <div className="bg-card-green p-5 rounded-[24px] border border-black/5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-950/70">Monthly Retainer</span>
              <div className="text-2xl font-extrabold text-emerald-950 mt-1">${monthlyFee.toLocaleString()}/mo</div>
              <p className="text-[11px] text-emerald-900/80 mt-1">Rate: ${hourlyRate}/hr billable</p>
            </div>

            <div className="bg-card-blue p-5 rounded-[24px] border border-black/5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-950/70">Revenue YTD</span>
              <div className="text-2xl font-extrabold text-blue-950 mt-1">${totalRevenue.toLocaleString()}</div>
              <p className="text-[11px] text-blue-900/80 mt-1">Joined {client.joinedDate || 'Recent'}</p>
            </div>

            <div className="bg-card-pink p-5 rounded-[24px] border border-black/5">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-950/70">Relationship Health</span>
              <div className="text-2xl font-extrabold text-purple-950 mt-1 capitalize">{client.relationshipHealth}</div>
              <p className="text-[11px] text-purple-900/80 mt-1">High retention probability</p>
            </div>
          </div>

          {/* Quick Hub Grid: Executive Snapshot & Active Deliverables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Active Tasks & Open Approvals */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white p-6 rounded-[28px] border border-border-subtle shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-text-main">In-Flight Deliverables & Tasks</h3>
                  <button 
                    onClick={() => setTaskModalOpen(true)}
                    className="text-xs font-semibold text-card-blue hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Task
                  </button>
                </div>

                <div className="space-y-2.5">
                  {clientTasks.slice(0, 5).map(task => (
                    <div 
                      key={task.id}
                      className="p-3.5 bg-[#FDFBF7] rounded-xl border border-border-subtle flex items-center justify-between group hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button onClick={() => toggleTaskStatus(task.id)}>
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                          )}
                        </button>
                        <span className={`text-xs font-medium truncate ${task.status === 'completed' ? 'line-through text-text-muted' : 'text-text-main'}`}>
                          {task.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-text-muted shrink-0 ml-3">
                        Due {task.dueDate}
                      </span>
                    </div>
                  ))}

                  {clientTasks.length === 0 && (
                    <p className="text-xs text-text-muted py-4 text-center">No active tasks for this workspace.</p>
                  )}
                </div>
              </div>

              {/* Memory Vault Highlights */}
              <div className="bg-white p-6 rounded-[28px] border border-border-subtle shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-card-blue" />
                    <h3 className="text-base font-bold text-text-main">Executive Memory Vault & Quick Notes</h3>
                  </div>
                  <button 
                    onClick={() => setActiveTab('intelligence')}
                    className="text-xs font-semibold text-card-blue hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(client.intelligence.memoryVault || []).slice(0, 4).map(mem => (
                    <div key={mem.id} className="p-3 bg-[#FDFBF7] rounded-xl border border-border-subtle text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{mem.category}</span>
                      <p className="font-medium text-text-main">{mem.content}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col: Client Intelligence Summary */}
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-[28px] border border-border-subtle shadow-xs space-y-4">
                <h3 className="text-base font-bold text-text-main">Executive Working Style</h3>
                
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#FDFBF7] rounded-xl border border-border-subtle">
                    <span className="text-text-muted font-semibold block mb-0.5">Communication Preference:</span>
                    <span className="text-text-main font-medium">{client.intelligence.executiveProfile.communicationStyle}</span>
                  </div>
                  <div className="p-3 bg-[#FDFBF7] rounded-xl border border-border-subtle">
                    <span className="text-text-muted font-semibold block mb-0.5">Meeting Habits:</span>
                    <span className="text-text-main font-medium">{client.intelligence.executiveProfile.meetingPreferences}</span>
                  </div>
                  <div className="p-3 bg-[#FDFBF7] rounded-xl border border-border-subtle">
                    <span className="text-text-muted font-semibold block mb-0.5">Decision Making:</span>
                    <span className="text-text-main font-medium">{client.intelligence.executiveProfile.decisionMakingStyle}</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="p-5 bg-sidebar-bg text-white rounded-[24px] space-y-3">
                <h4 className="text-xs font-semibold text-card-yellow uppercase tracking-wider">
                  Client Operational Hubs
                </h4>
                <div className="space-y-2 text-xs">
                  {client.googleDriveFolderUrl && (
                    <a 
                      href={client.googleDriveFolderUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-between transition-colors block"
                    >
                      <span className="flex items-center gap-2">
                        <Folder className="w-3.5 h-3.5 text-card-yellow" /> Google Drive Directory
                      </span>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </a>
                  )}
                  {client.slackChannel && (
                    <div className="p-2.5 rounded-xl bg-white/10 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Slack className="w-3.5 h-3.5 text-card-pink" /> {client.slackChannel}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 2. INTELLIGENCE & 360° PROFILE TAB */}
      {activeTab === 'intelligence' && (
        <div className="space-y-8">
          
          {/* Expanded 360 Client Profile */}
          <ClientProfileExpanded client={client} />

          {/* Memory Vault Interactive Engine */}
          <div className="bg-white p-6 rounded-[28px] border border-border-subtle shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div>
                <h3 className="text-base font-bold text-text-main">Executive Memory Vault</h3>
                <p className="text-xs text-text-muted">Permanent operational rules, quirks, family context, and key decisions.</p>
              </div>
            </div>

            <form onSubmit={handleAddMemoryVaultItem} className="flex gap-3">
              <select
                value={newMemoryCategory ?? 'preference'}
                onChange={e => setNewMemoryCategory(e.target.value as any)}
                className="px-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="preference">Preference</option>
                <option value="rule">Ironclad Rule</option>
                <option value="fact">Fact / Detail</option>
                <option value="contact">Key Contact</option>
              </select>

              <input 
                type="text" 
                value={newMemoryNote ?? ''} 
                onChange={e => setNewMemoryNote(e.target.value)}
                placeholder="Log a new executive intelligence note (e.g. Always sends decks in 16:9 PDF format)..."
                className="flex-1 px-4 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs focus:outline-none"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Add to Vault
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(client.intelligence.memoryVault || []).map(item => (
                <div key={item.id} className="p-4 bg-[#FDFBF7] rounded-2xl border border-border-subtle text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-border-subtle text-text-muted">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-text-muted">{item.dateAdded}</span>
                  </div>
                  <p className="font-medium text-text-main leading-relaxed pt-1">{item.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* STAKEHOLDERS & MEETING OVERLAP FINDER TAB */}
      {activeTab === 'stakeholders' && (
        <StakeholderMeetingOverlapFinder client={client} />
      )}

      {/* 3. ONBOARDING TAB */}
      {activeTab === 'onboarding' && (
        <ClientOnboardingWorkspace client={client} />
      )}

      {/* 4. TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-main">Workspace Tasks & Milestones</h3>
              <p className="text-xs text-text-muted">All active deliverables for {client.name}</p>
            </div>
            <button
              onClick={() => setTaskModalOpen(true)}
              className="px-4 py-2 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-full text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> New Task
            </button>
          </div>

          <div className="space-y-2.5">
            {clientTasks.map(task => (
              <div 
                key={task.id}
                className="p-4 bg-white rounded-2xl border border-border-subtle hover:border-gray-300 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <button onClick={() => toggleTaskStatus(task.id)}>
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
                    )}
                  </button>
                  <div>
                    <h4 className={`text-sm font-semibold ${task.status === 'completed' ? 'line-through text-text-muted' : 'text-text-main'}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
                      <span>Due {task.dueDate}</span>
                      <span>Score: {task.calculatedScore}</span>
                      {task.driveLink && (
                        <a href={task.driveLink} target="_blank" rel="noreferrer" className="text-card-blue hover:underline">
                          Drive Link
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => startTimer({ clientId: client.id, taskId: task.id, notes: task.title })}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-emerald-600"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TIME & RETAINER TAB */}
      {activeTab === 'time' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-main">Retainer & Billable Hours Log</h3>
              <p className="text-xs text-text-muted">{client.usedHoursThisMonth} of {client.purchasedHours} hours utilized this cycle</p>
            </div>
            <button
              onClick={() => setTimeModalOpen(true)}
              className="px-4 py-2 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-full text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Log Time Entry
            </button>
          </div>

          <div className="bg-white rounded-[28px] border border-border-subtle shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDFBF7] border-b border-border-subtle text-text-muted uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Description / Deliverable</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Billable</th>
                  <th className="p-4 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {clientTimeEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-[#FDFBF7]/50">
                    <td className="p-4 font-mono">{entry.date}</td>
                    <td className="p-4 font-medium text-text-main">{entry.notes}</td>
                    <td className="p-4 font-mono font-semibold">{entry.durationMinutes} min ({(entry.durationMinutes / 60).toFixed(2)}h)</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${entry.isBillable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
                        {entry.isBillable ? 'Billable' : 'Internal'}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-text-main">${entry.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. FINANCE TAB */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-main">Client Invoices & Billing History</h3>
              <p className="text-xs text-text-muted">Total YTD Revenue: ${(client.totalRevenueYTD || 0).toLocaleString()}</p>
            </div>
            <button
              onClick={() => setInvoiceModalOpen(true)}
              className="px-4 py-2 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-full text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Generate Invoice
            </button>
          </div>

          <div className="space-y-3">
            {clientInvoices.map(inv => (
              <div key={inv.id} className="p-5 bg-white rounded-2xl border border-border-subtle flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-mono text-sm font-bold text-text-main">{inv.invoiceNumber}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">Issued: {inv.issueDate} • Due: {inv.dueDate}</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-text-main">${(inv.total || 0).toLocaleString()}</div>
                  <p className="text-xs text-text-muted">{(inv.items || []).length} line items</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. APPROVALS TAB */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-main">Deliverables Pending Client Approval</h3>
              <p className="text-xs text-text-muted">Track sign-offs, revision requests, and client feedback.</p>
            </div>
          </div>

          <div className="space-y-3">
            {clientApprovals.map(app => (
              <div key={app.id} className="p-5 bg-white rounded-2xl border border-border-subtle space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-text-main">{app.deliverableTitle}</h4>
                    <p className="text-xs text-text-muted mt-0.5">{app.description}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                    app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    app.status === 'pending' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>

                {app.driveLink && (
                  <a href={app.driveLink} target="_blank" rel="noreferrer" className="text-xs text-card-blue hover:underline flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Review Deliverable Document
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OFFBOARDING & TRANSITION TAB */}
      {activeTab === 'offboarding' && (
        <ClientOffboardingWorkspace client={client} />
      )}

      {/* Modals */}
      <TaskModal isOpen={taskModalOpen} onClose={() => setTaskModalOpen(false)} defaultClientId={client.id} />
      <ClientModal isOpen={clientModalOpen} onClose={() => setClientModalOpen(false)} clientToEdit={client} />
      <InvoiceModal isOpen={invoiceModalOpen} onClose={() => setInvoiceModalOpen(false)} defaultClientId={client.id} />
      <TimeModal isOpen={timeModalOpen} onClose={() => setTimeModalOpen(false)} defaultClientId={client.id} />
      <ClientGlobalOpsModal 
        isOpen={globalOpsModalOpen} 
        onClose={() => setGlobalOpsModalOpen(false)} 
        client={client} 
        onSave={(cId, updates) => updateClient(cId, updates)} 
      />

    </div>
  );
}
