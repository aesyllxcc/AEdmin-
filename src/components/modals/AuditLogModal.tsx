import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Download, 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AuditLogEntry } from '@/types';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterEntityId?: string;
  filterEntityType?: string;
}

export function AuditLogModal({
  isOpen,
  onClose,
  filterEntityId,
  filterEntityType
}: AuditLogModalProps) {
  const { auditLogs, exportAuditLogsJSON, exportAuditLogsCSV, clients } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedEntityType, setSelectedEntityType] = useState<string>(filterEntityType || 'all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter(log => {
    if (filterEntityId && log.entityId !== filterEntityId) return false;
    if (selectedEntityType !== 'all' && log.entityType !== selectedEntityType) return false;
    if (selectedAction !== 'all' && log.action !== selectedAction) return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchDetails = (log.details || '').toLowerCase().includes(term);
      const matchReason = (log.reason || '').toLowerCase().includes(term);
      const matchEntity = (log.entityName || '').toLowerCase().includes(term);
      const matchActor = (log.actorName || '').toLowerCase().includes(term);
      const matchId = (log.entityId || '').toLowerCase().includes(term);
      return matchDetails || matchReason || matchEntity || matchActor || matchId;
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedLogId(prev => prev === id ? null : id);
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">CREATE</span>;
      case 'update':
        return <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px]">UPDATE</span>;
      case 'delete':
        return <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px]">DELETE</span>;
      case 'status_change':
        return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">STATUS</span>;
      case 'adjust_hours':
        return <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold text-[10px]">HOURS ADJ</span>;
      case 'mark_paid':
        return <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 font-bold text-[10px]">PAYMENT</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 font-bold text-[10px]">{action.toUpperCase()}</span>;
    }
  };

  const getEntityTypeLabel = (type: string) => {
    switch (type) {
      case 'time_entry': return 'Time Entry';
      case 'retainer_period': return 'Retainer Cycle';
      case 'client_hours': return 'Available Hours';
      case 'invoice': return 'Invoice & Billing';
      case 'historical_record': return 'Historical Log';
      case 'payment': return 'Payment Record';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] border border-border-subtle shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 md:p-8 border-b border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FDFBF7]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sidebar-bg text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-text-main">Comprehensive Audit Trail</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {auditLogs.length} Traceable Events
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Cryptographically verifiable activity logs for time adjustments, retainer cycles, available hours, and financial events.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportAuditLogsJSON}
              className="px-3.5 py-2 bg-white border border-border-subtle hover:bg-gray-50 text-text-main rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              title="Download raw JSON audit log"
            >
              <Database className="w-3.5 h-3.5 text-text-muted" />
              Export JSON
            </button>
            <button
              onClick={exportAuditLogsCSV}
              className="px-3.5 py-2 bg-white border border-border-subtle hover:bg-gray-50 text-text-main rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              title="Download CSV audit log"
            >
              <Download className="w-3.5 h-3.5 text-text-muted" />
              Export CSV
            </button>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-border-subtle bg-white flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search audit records by actor, reason, entity, or details..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedEntityType}
              onChange={e => setSelectedEntityType(e.target.value)}
              className="px-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-medium focus:outline-none"
            >
              <option value="all">All Entity Types</option>
              <option value="time_entry">Time Entries</option>
              <option value="retainer_period">Retainer Cycles</option>
              <option value="client_hours">Available Hours</option>
              <option value="invoice">Invoices</option>
              <option value="historical_record">Historical Records</option>
              <option value="payment">Payments</option>
            </select>

            <select
              value={selectedAction}
              onChange={e => setSelectedAction(e.target.value)}
              className="px-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-medium focus:outline-none"
            >
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="adjust_hours">Adjust Hours</option>
              <option value="status_change">Status Change</option>
              <option value="mark_paid">Payment Completed</option>
            </select>
          </div>
        </div>

        {/* Audit Log Entries List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 bg-[#FAF8F5]">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-border-subtle p-8">
              <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-text-main">No Audit Logs Found</p>
              <p className="text-xs text-text-muted mt-1">Try adjusting search query or filters.</p>
            </div>
          ) : (
            filteredLogs.map(log => {
              const isExpanded = expandedLogId === log.id;
              const formattedDate = new Date(log.timestamp).toLocaleString();

              return (
                <div 
                  key={log.id} 
                  className="bg-white rounded-2xl border border-border-subtle/80 shadow-2xs hover:shadow-xs transition-all overflow-hidden"
                >
                  <div 
                    onClick={() => toggleExpand(log.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-gray-50/70"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="mt-0.5 sm:mt-0">
                        {getActionBadge(log.action)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-text-main">{log.entityName || getEntityTypeLabel(log.entityType)}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                            {getEntityTypeLabel(log.entityType)}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5 font-medium">{log.details}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-text-muted border-t sm:border-t-0 pt-2 sm:pt-0 border-border-subtle">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-semibold text-text-main">{log.actorName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formattedDate}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-border-subtle/60 bg-[#FDFBF7] space-y-3 text-xs animate-in fade-in duration-150">
                      {log.reason && (
                        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80">
                          <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wider block mb-1">
                            Logged Operational Justification:
                          </span>
                          <p className="text-xs text-amber-900 font-medium">{log.reason}</p>
                        </div>
                      )}

                      {/* Field Changes Table */}
                      {log.changes && log.changes.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                            Field Level State Modifications:
                          </span>
                          <div className="bg-white rounded-xl border border-border-subtle overflow-hidden">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-gray-50 text-text-muted border-b border-border-subtle text-[11px]">
                                <tr>
                                  <th className="p-2.5 font-semibold">Field</th>
                                  <th className="p-2.5 font-semibold">Previous Value</th>
                                  <th className="p-2.5 font-semibold">Updated Value</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border-subtle">
                                {log.changes.map((chg, cIdx) => (
                                  <tr key={cIdx} className="font-mono text-[11px]">
                                    <td className="p-2.5 font-semibold text-text-main">{chg.field}</td>
                                    <td className="p-2.5 text-rose-700 bg-rose-50/30 line-through">
                                      {typeof chg.oldValue === 'object' ? JSON.stringify(chg.oldValue) : String(chg.oldValue ?? 'null')}
                                    </td>
                                    <td className="p-2.5 text-emerald-800 bg-emerald-50/30 font-bold">
                                      {typeof chg.newValue === 'object' ? JSON.stringify(chg.newValue) : String(chg.newValue ?? 'null')}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
                        <span>Record ID: <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{log.entityId}</code></span>
                        <span>Log Entry ID: <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{log.id}</code></span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-subtle bg-white flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Showing {filteredLogs.length} of {auditLogs.length} total traceable log entries.
          </span>
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2 bg-sidebar-bg text-white text-xs font-semibold rounded-full hover:bg-sidebar-active transition-colors shadow-xs"
          >
            Close Audit Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
