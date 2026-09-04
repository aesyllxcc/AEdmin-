import { useState } from "react";
import { 
  Plus, 
  Search, 
  Users, 
  ArrowRight, 
  DollarSign, 
  Clock, 
  Folder, 
  MoreVertical, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Archive,
  Trash2,
  Edit,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ClientModal } from "@/components/modals/ClientModal";
import { WorkflowBuilder } from "@/components/clients/WorkflowBuilder";
import { Client } from "@/types";

export default function Clients() {
  const { clients, deleteClient, archiveClient, restoreClient, duplicateClient } = useApp();
  
  const [viewMode, setViewMode] = useState<'directory' | 'workflows'>('directory');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.primaryContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'archived') return matchesSearch && client.status === 'archived';
    return matchesSearch && client.status === statusFilter;
  });

  const totalMonthlyRetainers = clients
    .filter(c => c.status === 'active')
    .reduce((acc, c) => acc + (c.monthlyRetainerFee || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-card-pink/30 text-purple-900 text-xs font-semibold tracking-wide">
              CLIENT WORKSPACE DIRECTORY
            </span>
            <span className="text-xs text-text-muted font-medium">
              {clients.filter(c => c.status === 'active').length} Active Engagements
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mt-1.5">Client Directory & Workspaces</h1>
          <p className="text-sm text-text-muted mt-1">
            Dedicated operational workspaces, executive intelligence profiles, and retainer management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-stone-100 p-1 rounded-full border border-border-subtle">
            <button
              onClick={() => setViewMode('directory')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'directory' 
                  ? 'bg-sidebar-bg text-white shadow-xs' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Directory Grid
            </button>
            <button
              onClick={() => setViewMode('workflows')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'workflows' 
                  ? 'bg-sidebar-bg text-white shadow-xs' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Workflow Automation
            </button>
          </div>

          <Link
            to="/opportunities"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-full text-xs font-semibold border border-purple-200 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
            <span>Lifecycle CRM & Pipeline →</span>
          </Link>

          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-900 rounded-full text-xs font-semibold border border-emerald-200">
            <DollarSign className="w-3.5 h-3.5" />
            <span>MRR: ${totalMonthlyRetainers.toLocaleString()}/mo</span>
          </div>
          <button
            onClick={() => { setClientToEdit(null); setClientModalOpen(true); }}
            className="px-5 py-2.5 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            New Client Workspace
          </button>
        </div>
      </div>

      {viewMode === 'workflows' ? (
        <WorkflowBuilder />
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
              {['all', 'active', 'onboarding', 'paused', 'offboarding', 'archived'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                    statusFilter === filter 
                      ? 'bg-sidebar-bg text-white shadow-xs' 
                      : 'bg-white border border-border-subtle text-text-muted hover:text-text-main'
                  }`}
                >
                  {filter} ({filter === 'all' ? clients.length : clients.filter(c => c.status === filter).length})
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name, company, or contact..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-border-subtle rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-card-blue/50"
              />
            </div>
          </div>

      {/* Client Bento Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => {
          const purchased = client.purchasedHours || 0;
          const used = client.usedHoursThisMonth || 0;
          const fee = client.monthlyRetainerFee || 0;
          const usagePercent = purchased > 0 
            ? Math.round((used / purchased) * 100) 
            : 0;

          return (
            <div 
              key={client.id}
              className="bg-white rounded-[28px] border border-border-subtle hover:border-gray-300 p-6 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md relative group"
            >
              {/* Top Row: Avatar & Status & Menu */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${client.avatarColor} flex items-center justify-center font-bold text-sm text-text-main shadow-xs`}>
                      {client.code}
                    </div>
                    <div>
                      <Link 
                        to={`/clients/${client.id}`}
                        className="text-base font-bold text-text-main hover:text-card-blue transition-colors block"
                      >
                        {client.name}
                      </Link>
                      <p className="text-xs text-text-muted">{client.company}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === client.id ? null : client.id)}
                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === client.id && (
                      <div className="absolute right-0 mt-1 w-44 bg-white rounded-2xl border border-border-subtle shadow-xl p-2 z-20 text-xs space-y-1 animate-in fade-in duration-150">
                        <button
                          onClick={() => { setClientToEdit(client); setClientModalOpen(true); setActiveMenuId(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-text-main font-medium"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Workspace
                        </button>
                        <button
                          onClick={() => { duplicateClient(client.id); setActiveMenuId(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-text-main font-medium"
                        >
                          <Copy className="w-3.5 h-3.5" /> Clone Client
                        </button>
                        {client.status !== 'archived' ? (
                          <button
                            onClick={() => { archiveClient(client.id); setActiveMenuId(null); }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-50 text-amber-900 font-medium"
                          >
                            <Archive className="w-3.5 h-3.5" /> Archive Client
                          </button>
                        ) : (
                          <button
                            onClick={() => { restoreClient(client.id); setActiveMenuId(null); }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-emerald-50 text-emerald-900 font-medium"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Restore Client
                          </button>
                        )}
                        <button
                          onClick={() => { deleteClient(client.id); setActiveMenuId(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                    client.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                    client.status === 'onboarding' ? 'bg-blue-100 text-blue-800' :
                    client.status === 'offboarding' ? 'bg-rose-100 text-rose-800 border border-rose-200 font-extrabold' :
                    client.status === 'paused' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {client.status}
                  </span>
                  <span className="text-[10px] font-semibold text-text-muted bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                    {client.contractType}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-full ml-auto">
                    ${fee.toLocaleString()}/mo
                  </span>
                </div>

                {/* Executive Contact Info */}
                <div className="p-3 bg-[#FDFBF7] rounded-2xl border border-border-subtle space-y-1.5 text-xs mb-4">
                  <div className="flex justify-between text-text-muted">
                    <span>Executive Contact:</span>
                    <span className="font-semibold text-text-main">{client.primaryContact}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Email:</span>
                    <span className="font-mono text-[11px] text-text-main">{client.email}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Timezone:</span>
                    <span className="text-[11px] text-text-main truncate max-w-[140px]">{client.intelligence?.executiveProfile?.timezone || 'N/A'}</span>
                  </div>
                </div>

                {/* Retainer Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-text-muted">
                    <span>Monthly Retainer Hours</span>
                    <span className="text-text-main font-mono">{used}h / {purchased}h ({usagePercent}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        usagePercent > 90 ? 'bg-rose-500' : usagePercent > 70 ? 'bg-amber-500' : 'bg-sidebar-bg'
                      }`}
                      style={{ width: `${Math.min(100, usagePercent)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Footer Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-border-subtle text-xs gap-2">
                <span className="text-[11px] text-text-muted">
                  {client.contractType === 'retainer' ? `${purchased} hrs/mo` : 'Milestone base'}
                </span>

                <Link
                  to={`/clients/${client.id}`}
                  className="px-4 py-1.5 rounded-full bg-sidebar-bg hover:bg-sidebar-active text-white font-medium flex items-center gap-1.5 transition-all shadow-xs"
                >
                  Enter Workspace <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

            </div>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-16 bg-white rounded-[28px] border border-border-subtle">
          <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-semibold text-text-main">No Client Workspaces Found</h3>
          <p className="text-xs text-text-muted mt-1">Try adjusting your search criteria or add a new client.</p>
          <button
            onClick={() => { setClientToEdit(null); setClientModalOpen(true); }}
            className="mt-4 px-5 py-2.5 bg-sidebar-bg text-white text-xs font-semibold rounded-full hover:bg-sidebar-active"
          >
            Create Client Workspace
          </button>
        </div>
      )}
      </>
      )}

      {/* Client Modal */}
      <ClientModal 
        isOpen={clientModalOpen} 
        onClose={() => setClientModalOpen(false)} 
        clientToEdit={clientToEdit} 
      />

    </div>
  );
}
