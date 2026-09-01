import { useState } from "react";
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Clock, 
  DollarSign, 
  Download, 
  Percent, 
  Trash2, 
  Edit, 
  Copy,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sliders,
  History,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { TimeModal } from "@/components/modals/TimeModal";
import { RetainerAdjustmentModal } from "@/components/modals/RetainerAdjustmentModal";
import { AuditLogModal } from "@/components/modals/AuditLogModal";
import { TimeEntry, RetainerPeriodLog, Client } from "@/types";

export default function TimeTracking() {
  const { 
    clients, 
    timeEntries, 
    retainerPeriods,
    deleteRetainerPeriod,
    activeTimer, 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    stopTimer, 
    deleteTimeEntry,
    duplicateTimeEntry,
    auditLogs,
    exportAuditLogsCSV,
    exportAuditLogsJSON
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tracker' | 'retainers' | 'history' | 'audit'>('tracker');
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<TimeEntry | null>(null);
  const [retainerModalOpen, setRetainerModalOpen] = useState(false);
  const [selectedClientForRetainer, setSelectedClientForRetainer] = useState<Client | null>(null);
  const [periodToEdit, setPeriodToEdit] = useState<RetainerPeriodLog | null>(null);
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('all');
  const [selectedClientForTimer, setSelectedClientForTimer] = useState<string>(clients[0]?.id || '');
  const [timerNotesInput, setTimerNotesInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const formatTimer = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredEntries = timeEntries.filter(e => {
    if (selectedClientFilter !== 'all' && e.clientId !== selectedClientFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        (e.clientName || '').toLowerCase().includes(term) ||
        (e.notes || '').toLowerCase().includes(term) ||
        (e.projectName || '').toLowerCase().includes(term) ||
        (e.taskTitle || '').toLowerCase().includes(term)
      );
    }
    return true;
  });

  const totalMinutes = filteredEntries.reduce((acc, e) => acc + e.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const billableMinutes = filteredEntries.filter(e => e.isBillable).reduce((acc, e) => acc + e.durationMinutes, 0);
  const billableHours = (billableMinutes / 60).toFixed(1);
  const billablePercent = totalMinutes > 0 ? Math.round((billableMinutes / totalMinutes) * 100) : 0;
  const totalValue = filteredEntries.reduce((acc, e) => acc + e.value, 0);

  const handleExportCSV = () => {
    const headers = "Date,Client,Project,Task,Duration(Min),Billable,HourlyRate,Value($),Notes,LastModified,ModifiedBy,EditReason\n";
    const rows = filteredEntries.map(e => 
      `"${e.date}","${e.clientName}","${e.projectName || ''}","${e.taskTitle || ''}",${e.durationMinutes},${e.isBillable ? 'Yes' : 'No'},${e.hourlyRate},${e.value},"${(e.notes || '').replace(/"/g, '""')}","${e.lastModified || ''}","${e.modifiedBy || ''}","${(e.editReason || '').replace(/"/g, '""')}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AEDMIN_Timesheet_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const openAdjustHoursModal = (client: Client) => {
    setSelectedClientForRetainer(client);
    setPeriodToEdit(null);
    setRetainerModalOpen(true);
  };

  const openEditPeriodModal = (period: RetainerPeriodLog) => {
    setPeriodToEdit(period);
    setSelectedClientForRetainer(null);
    setRetainerModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-card-yellow/50 text-amber-950 text-xs font-semibold tracking-wide">
              PRECISION TIME & RETAINER ENGINE
            </span>
            <span className="text-xs text-text-muted font-medium">
              {timeEntries.length} Sessions • {auditLogs.length} Traceable Audits
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mt-1.5">Time Tracking & Retainers</h1>
          <p className="text-sm text-text-muted mt-1">
            Real-time live timer, multi-target allocations, retainer cycle management, and auditable adjustments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAuditModalOpen(true)}
            className="px-4 py-2.5 bg-white border border-border-subtle hover:bg-gray-50 text-text-main rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Audit Inspector ({auditLogs.length})
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white border border-border-subtle hover:bg-gray-50 text-text-main rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export Timesheet
          </button>
          <button
            onClick={() => { setEntryToEdit(null); setTimeModalOpen(true); }}
            className="px-5 py-2.5 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Manual Entry
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#FDFBF7] rounded-2xl border border-border-subtle max-w-fit">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'tracker' 
              ? 'bg-sidebar-bg text-white shadow-sm' 
              : 'text-text-muted hover:text-text-main hover:bg-white/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Live Tracker & Burn Rates
        </button>
        <button
          onClick={() => setActiveTab('retainers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'retainers' 
              ? 'bg-sidebar-bg text-white shadow-sm' 
              : 'text-text-muted hover:text-text-main hover:bg-white/60'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Retainer Cycles & Available Hours ({retainerPeriods.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'history' 
              ? 'bg-sidebar-bg text-white shadow-sm' 
              : 'text-text-muted hover:text-text-main hover:bg-white/60'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Historical Time Logs ({timeEntries.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'audit' 
              ? 'bg-sidebar-bg text-white shadow-sm' 
              : 'text-text-muted hover:text-text-main hover:bg-white/60'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Traceable Audit Log ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: TRACKER & BURN RATES */}
      {activeTab === 'tracker' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Live Timer Interactive Console */}
          <div className="bg-sidebar-bg text-white p-6 md:p-8 rounded-[32px] shadow-xl border border-white/10 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              
              {/* Timer Display */}
              <div className="flex items-center gap-6">
                <div className="font-mono text-5xl md:text-6xl font-bold tracking-tight text-white">
                  {formatTimer(activeTimer.seconds)}
                </div>
                {activeTimer.isRunning && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Active Recording</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                {!activeTimer.isRunning ? (
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                      value={selectedClientForTimer}
                      onChange={e => setSelectedClientForTimer(e.target.value)}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs font-semibold text-white focus:outline-none"
                    >
                      {clients.map(c => (
                        <option key={c.id} value={c.id} className="bg-sidebar-bg text-white">{c.name}</option>
                      ))}
                    </select>

                    <input 
                      type="text"
                      value={timerNotesInput}
                      onChange={e => setTimerNotesInput(e.target.value)}
                      placeholder="Task or deliverable notes..."
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs text-white placeholder-gray-400 focus:outline-none flex-1 sm:w-64"
                    />

                    <button
                      onClick={() => startTimer({ clientId: selectedClientForTimer, notes: timerNotesInput })}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Start Timer
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    {activeTimer.isPaused ? (
                      <button
                        onClick={resumeTimer}
                        className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white font-bold rounded-2xl text-xs flex items-center gap-2 transition-all"
                      >
                        <Play className="w-4 h-4 fill-current" /> Resume
                      </button>
                    ) : (
                      <button
                        onClick={pauseTimer}
                        className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white font-bold rounded-2xl text-xs flex items-center gap-2 transition-all"
                      >
                        <Pause className="w-4 h-4 fill-current" /> Pause
                      </button>
                    )}

                    <button
                      onClick={() => stopTimer(true)}
                      className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                      <Square className="w-4 h-4 fill-current" /> Complete & Save Session
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-card-yellow p-5 rounded-[24px] border border-black/5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-950/70">Total Hours Tracked</span>
              <div className="text-3xl font-extrabold text-amber-950 mt-1">{totalHours} hrs</div>
              <p className="text-xs text-amber-900/80 mt-1">{filteredEntries.length} logged sessions</p>
            </div>

            <div className="bg-card-green p-5 rounded-[24px] border border-black/5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-950/70">Billable Utilization</span>
              <div className="text-3xl font-extrabold text-emerald-950 mt-1">{billablePercent}%</div>
              <p className="text-xs text-emerald-900/80 mt-1">{billableHours} billable hours</p>
            </div>

            <div className="bg-card-blue p-5 rounded-[24px] border border-black/5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-950/70">Calculated Value</span>
              <div className="text-3xl font-extrabold text-blue-950 mt-1">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-blue-900/80 mt-1">Based on client hourly rates</p>
            </div>

            <div className="bg-card-pink p-5 rounded-[24px] border border-black/5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-950/70">Retainer Workspaces</span>
              <div className="text-3xl font-extrabold text-purple-950 mt-1">{clients.filter(c => c.status === 'active').length} Active</div>
              <p className="text-xs text-purple-900/80 mt-1">Monitored for capacity</p>
            </div>
          </div>

          {/* Retainer Burn Rate Forecast Gauges with Available Hours Adjustment */}
          <div className="bg-white p-6 md:p-8 rounded-[28px] border border-border-subtle shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
              <div>
                <h3 className="text-base font-bold text-text-main">Client Retainer Burn Rates & Available Hours</h3>
                <p className="text-xs text-text-muted">Adjust contract capacity, rollover balances, and manual credits with automatic audit logging.</p>
              </div>
              <button
                onClick={() => { setSelectedClientForRetainer(null); setPeriodToEdit(null); setRetainerModalOpen(true); }}
                className="px-4 py-2 bg-[#FDFBF7] hover:bg-gray-100 border border-border-subtle text-text-main text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-text-muted" />
                Adjust Available Hours
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {clients.filter(c => c.status === 'active').map(c => {
                const totalAvailable = Number((c.purchasedHours + (c.rolloverHours || 0) + (c.manualAdjustmentHours || 0)).toFixed(1));
                const usagePercent = totalAvailable > 0 ? Math.round((c.usedHoursThisMonth / totalAvailable) * 100) : 0;
                const remainingHours = (totalAvailable - c.usedHoursThisMonth).toFixed(1);

                return (
                  <div key={c.id} className="p-5 bg-[#FDFBF7] rounded-2xl border border-border-subtle space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-xl ${c.avatarColor} flex items-center justify-center text-xs font-bold`}>
                          {c.code}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-text-main block">{c.name}</span>
                          <span className="text-[10px] text-text-muted font-medium">${c.hourlyRate}/h rate</span>
                        </div>
                      </div>
                      <button
                        onClick={() => openAdjustHoursModal(c)}
                        className="px-2.5 py-1 bg-white border border-border-subtle hover:border-sidebar-bg rounded-lg text-[11px] font-bold text-text-main shadow-2xs transition-colors"
                        title="Adjust available hours with audit trail"
                      >
                        Adjust
                      </button>
                    </div>

                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          usagePercent > 90 ? 'bg-rose-500' : usagePercent > 70 ? 'bg-amber-500' : 'bg-sidebar-bg'
                        }`}
                        style={{ width: `${Math.min(100, usagePercent)}%` }}
                      />
                    </div>

                    <div className="space-y-1 text-xs text-text-muted pt-1">
                      <div className="flex justify-between">
                        <span>Base: <strong className="text-text-main">{c.purchasedHours}h</strong></span>
                        {(c.rolloverHours || 0) !== 0 && <span>Rollover: <strong className="text-emerald-700 font-bold">+{c.rolloverHours}h</strong></span>}
                        {(c.manualAdjustmentHours || 0) !== 0 && <span>Adj: <strong className="text-blue-700 font-bold">{c.manualAdjustmentHours > 0 ? `+${c.manualAdjustmentHours}` : c.manualAdjustmentHours}h</strong></span>}
                      </div>
                      <div className="flex justify-between border-t border-border-subtle/60 pt-1.5 font-medium">
                        <span>Used: <strong className="text-text-main">{c.usedHoursThisMonth}h</strong> / {totalAvailable}h</span>
                        <span>Balance: <strong className={Number(remainingHours) < 3 ? "text-rose-600 font-bold" : "text-emerald-700 font-bold"}>{remainingHours}h</strong></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RETAINER PERIOD CYCLES & AVAILABLE HOURS */}
      {activeTab === 'retainers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] border border-border-subtle shadow-xs overflow-hidden">
            <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-text-main">Retainer Billing Cycles & Historical Records</h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Full historical records for contract hours, rollover carry-forward, and manual adjustments with complete audit traceability.
                </p>
              </div>
              <button
                onClick={() => { setSelectedClientForRetainer(null); setPeriodToEdit(null); setRetainerModalOpen(true); }}
                className="px-5 py-2.5 bg-sidebar-bg text-white text-xs font-semibold rounded-full hover:bg-sidebar-active transition-colors flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add / Adjust Retainer Cycle
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] border-b border-border-subtle text-text-muted uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Period Month</th>
                    <th className="p-4">Client Name</th>
                    <th className="p-4">Contract Base</th>
                    <th className="p-4">Rollover / Adj</th>
                    <th className="p-4">Effective Capacity</th>
                    <th className="p-4">Hours Used</th>
                    <th className="p-4">Monthly Fee</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Audit Reason</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {retainerPeriods.map(period => {
                    const effectiveHours = period.purchasedHours + (period.rolloverHours || 0) + (period.manualAdjustmentHours || 0);
                    return (
                      <tr key={period.id} className="hover:bg-[#FDFBF7]/60 transition-colors">
                        <td className="p-4 font-mono font-bold whitespace-nowrap">{period.periodMonth}</td>
                        <td className="p-4 font-semibold text-text-main">{period.clientName}</td>
                        <td className="p-4 font-mono">{period.purchasedHours} hrs</td>
                        <td className="p-4 font-mono text-text-muted">
                          {period.rolloverHours ? `+${period.rolloverHours}h roll` : '-'}
                          {period.manualAdjustmentHours ? ` / ${period.manualAdjustmentHours > 0 ? `+${period.manualAdjustmentHours}` : period.manualAdjustmentHours}h adj` : ''}
                        </td>
                        <td className="p-4 font-mono font-bold text-text-main">{effectiveHours} hrs</td>
                        <td className="p-4 font-mono text-emerald-800 font-bold">{period.usedHours} hrs</td>
                        <td className="p-4 font-mono font-bold text-text-main">${period.monthlyFee.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            period.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                            period.status === 'reconciled' ? 'bg-blue-100 text-blue-800' :
                            period.status === 'closed' ? 'bg-gray-100 text-gray-700' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {period.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-text-muted max-w-xs truncate" title={period.adjustmentReason}>
                          {period.adjustmentReason || period.notes || 'Standard cycle allocation'}
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditPeriodModal(period)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-text-main"
                              title="Edit Retainer Period"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteRetainerPeriod(period.id, 'Removed redundant historical retainer period')}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600"
                              title="Delete Period"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HISTORICAL TIME LOGS */}
      {activeTab === 'history' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] border border-border-subtle shadow-xs overflow-hidden">
            
            <div className="p-5 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-text-main">Historical Work Log Records</h3>
                <p className="text-xs text-text-muted">Edit past entries with justification notes for continuous audit integrity.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search logs..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <select
                  value={selectedClientFilter}
                  onChange={e => setSelectedClientFilter(e.target.value)}
                  className="px-3 py-1.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-medium focus:outline-none"
                >
                  <option value="all">All Clients</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] border-b border-border-subtle text-text-muted uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Work Summary & Allocations</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Billable</th>
                    <th className="p-4">Hourly Rate</th>
                    <th className="p-4 text-right">Value</th>
                    <th className="p-4">Last Audit Info</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-[#FDFBF7]/60 transition-colors">
                      <td className="p-4 font-mono whitespace-nowrap">{entry.date}</td>
                      <td className="p-4 font-semibold text-text-main">{entry.clientName}</td>
                      <td className="p-4">
                        <p className="font-medium text-text-main">{entry.notes}</p>
                        
                        {/* Multi Allocation Pill Badges */}
                        {entry.allocations && entry.allocations.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                            {entry.allocations.map((alc, aIdx) => (
                              <span key={aIdx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900 border border-amber-200">
                                {alc.targetName}: {alc.percentage}%
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold whitespace-nowrap">
                        {entry.durationMinutes} min ({(entry.durationMinutes / 60).toFixed(2)}h)
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${entry.isBillable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
                          {entry.isBillable ? 'Billable' : 'Internal'}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-text-muted">${entry.hourlyRate}/h</td>
                      <td className="p-4 text-right font-mono font-bold text-text-main">${entry.value}</td>
                      <td className="p-4 text-text-muted text-[11px]">
                        {entry.lastModified ? (
                          <div>
                            <span className="font-medium text-amber-800 block">Mod: {new Date(entry.lastModified).toLocaleDateString()}</span>
                            <span className="text-[10px] text-gray-500 italic truncate block max-w-[140px]">{entry.editReason}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Original Record</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setEntryToEdit(entry); setTimeModalOpen(true); }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-text-main"
                            title="Edit Entry with Audit Log"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => duplicateTimeEntry(entry.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-text-main"
                            title="Duplicate Entry"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTimeEntry(entry.id, 'Deleted historical time entry')}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRACEABLE AUDIT LOG INLINE */}
      {activeTab === 'audit' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] border border-border-subtle shadow-xs p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
              <div>
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Operational Audit Trail & Change Ledger
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Immutable record of every retainer adjustment, time modification, available hours recalculation, and invoice status change.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportAuditLogsJSON}
                  className="px-3.5 py-2 bg-[#FDFBF7] border border-border-subtle hover:bg-gray-100 text-text-main rounded-xl text-xs font-semibold"
                >
                  Export JSON
                </button>
                <button
                  onClick={exportAuditLogsCSV}
                  className="px-3.5 py-2 bg-[#FDFBF7] border border-border-subtle hover:bg-gray-100 text-text-main rounded-xl text-xs font-semibold"
                >
                  Export CSV
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 25).map(log => (
                <div key={log.id} className="p-4 bg-[#FDFBF7] rounded-2xl border border-border-subtle space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-sidebar-bg text-white font-mono text-[10px] font-bold uppercase">
                        {log.action}
                      </span>
                      <span className="text-xs font-bold text-text-main">{log.entityName}</span>
                      <span className="text-[11px] text-text-muted">({log.entityType})</span>
                    </div>
                    <div className="text-[11px] text-text-muted font-mono">
                      {new Date(log.timestamp).toLocaleString()} by <strong>{log.actorName}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-text-main font-medium">{log.details}</p>
                  
                  {log.reason && (
                    <div className="text-xs text-amber-900 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200">
                      <strong>Audit Reason:</strong> {log.reason}
                    </div>
                  )}

                  {log.changes && log.changes.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {log.changes.map((c, i) => (
                        <span key={i} className="text-[11px] font-mono bg-white px-2 py-0.5 rounded-md border border-border-subtle">
                          <strong>{c.field}:</strong> <span className="text-rose-600 line-through mr-1">{String(c.oldValue)}</span> &rarr; <span className="text-emerald-700 font-bold ml-1">{String(c.newValue)}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <TimeModal 
        isOpen={timeModalOpen} 
        onClose={() => setTimeModalOpen(false)} 
        entryToEdit={entryToEdit} 
      />

      <RetainerAdjustmentModal
        isOpen={retainerModalOpen}
        onClose={() => setRetainerModalOpen(false)}
        client={selectedClientForRetainer}
        periodToEdit={periodToEdit}
      />

      <AuditLogModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
      />

    </div>
  );
}
