import { useState } from "react";
import { 
  Plus, 
  Search, 
  DollarSign, 
  Wallet, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MoreVertical, 
  Edit, 
  Copy, 
  Trash2, 
  Check, 
  ExternalLink,
  Printer,
  Download,
  ShieldCheck,
  Eye,
  Send,
  Archive,
  RotateCcw,
  FileSpreadsheet,
  Layers,
  Database
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { InvoiceModal } from "@/components/modals/InvoiceModal";
import { RecordPaymentModal } from "@/components/modals/RecordPaymentModal";
import { AuditLogModal } from "@/components/modals/AuditLogModal";
import { Invoice } from "@/types";

export default function Finance() {
  const { 
    invoices, 
    payments, 
    clients, 
    userProfile, 
    updateInvoiceStatus,
    deleteInvoice, 
    duplicateInvoice,
    auditLogs
  } = useApp();

  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'audit'>('invoices');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
  
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [invoiceToPay, setInvoiceToPay] = useState<Invoice | null>(null);

  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      (inv.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.clientName || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && inv.status === statusFilter;
  });

  const totalPaidRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + (i.total || 0), 0);
  const totalOutstanding = invoices.filter(i => i.status === 'sent' || i.status === 'viewed' || i.status === 'partially_paid').reduce((acc, i) => acc + (i.total || 0), 0);
  const totalDraft = invoices.filter(i => i.status === 'draft').reduce((acc, i) => acc + (i.total || 0), 0);

  const handleExportInvoicesCSV = () => {
    const headers = "InvoiceNumber,ClientName,ClientEmail,IssueDate,DueDate,Status,Subtotal,TaxRate,TaxAmount,Total,PaidDate,PaymentMethod,ReferenceNumber,Notes\n";
    const rows = filteredInvoices.map(inv => {
      const escape = (str: string = '') => `"${str.replace(/"/g, '""')}"`;
      return [
        escape(inv.invoiceNumber),
        escape(inv.clientName),
        escape(inv.clientEmail || ''),
        escape(inv.issueDate),
        escape(inv.dueDate),
        escape(inv.status),
        inv.subtotal || 0,
        inv.taxRate || 0,
        inv.taxAmount || 0,
        inv.total || 0,
        escape(inv.paidDate || ''),
        escape(inv.paymentMethod || ''),
        escape(inv.referenceNumber || ''),
        escape(inv.notes || '')
      ].join(',');
    }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AEDMIN_Invoices_Export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportPaymentsCSV = () => {
    const headers = "ReferenceNumber,InvoiceNumber,ClientName,Amount,Date,Method,Notes\n";
    const rows = payments.map(pay => {
      const escape = (str: string = '') => `"${str.replace(/"/g, '""')}"`;
      return [
        escape(pay.referenceNumber),
        escape(pay.invoiceNumber),
        escape(pay.clientName),
        pay.amount || 0,
        escape(pay.date),
        escape(pay.method),
        escape(pay.notes || '')
      ].join(',');
    }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AEDMIN_Payments_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">PAID</span>;
      case 'partially_paid':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">PARTIALLY PAID</span>;
      case 'sent':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">SENT</span>;
      case 'viewed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">VIEWED</span>;
      case 'draft':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">DRAFT</span>;
      case 'archived':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">ARCHIVED</span>;
      case 'overdue':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">OVERDUE</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-card-green/40 text-emerald-950 text-xs font-semibold tracking-wide">
              FINANCE HQ & CASHFLOW
            </span>
            <span className="text-xs text-text-muted font-medium">
              ${totalPaidRevenue.toLocaleString()} Collected YTD • {invoices.length} Invoices
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mt-1.5">Finance HQ & Invoicing</h1>
          <p className="text-sm text-text-muted mt-1">
            Accounts receivable workflow (Draft &rarr; Sent &rarr; Viewed &rarr; Paid &rarr; Archived) with auditable payment verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAuditModalOpen(true)}
            className="px-4 py-2.5 bg-white border border-border-subtle hover:bg-gray-50 text-text-main rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Audit Trail ({auditLogs.filter(a => a.entityType === 'invoice' || a.entityType === 'payment').length})
          </button>
          <button
            onClick={activeTab === 'payments' ? handleExportPaymentsCSV : handleExportInvoicesCSV}
            className="px-4 py-2.5 bg-white border border-border-subtle hover:bg-gray-50 text-text-main rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => { setInvoiceToEdit(null); setInvoiceModalOpen(true); }}
            className="px-5 py-2.5 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Generate Invoice
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-card-green p-5 rounded-[24px] border border-black/5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-950/70">Collected Revenue YTD</span>
          <div className="text-3xl font-extrabold text-emerald-950 mt-1">${totalPaidRevenue.toLocaleString()}</div>
          <p className="text-xs text-emerald-900/80 mt-1">Directly cleared to operating bank</p>
        </div>

        <div className="bg-card-yellow p-5 rounded-[24px] border border-black/5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-950/70">Outstanding Receivables</span>
          <div className="text-3xl font-extrabold text-amber-950 mt-1">${totalOutstanding.toLocaleString()}</div>
          <p className="text-xs text-amber-900/80 mt-1">Sent, Viewed & Partially Paid</p>
        </div>

        <div className="bg-card-pink p-5 rounded-[24px] border border-black/5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-950/70">Draft Pipeline Value</span>
          <div className="text-3xl font-extrabold text-purple-950 mt-1">${totalDraft.toLocaleString()}</div>
          <p className="text-xs text-purple-900/80 mt-1">Ready to issue</p>
        </div>

        <div className="bg-card-blue p-5 rounded-[24px] border border-black/5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-950/70">Settled Payments</span>
          <div className="text-3xl font-extrabold text-blue-950 mt-1">{payments.length}</div>
          <p className="text-xs text-blue-900/80 mt-1">With verified transaction refs</p>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-border-subtle gap-8">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'invoices' ? 'border-sidebar-bg text-text-main' : 'border-transparent text-text-muted hover:text-text-main'
          }`}
        >
          Invoice Register & Workflow ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'payments' ? 'border-sidebar-bg text-text-main' : 'border-transparent text-text-muted hover:text-text-main'
          }`}
        >
          Payment Transactions Ledger ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'audit' ? 'border-sidebar-bg text-text-main' : 'border-transparent text-text-muted hover:text-text-main'
          }`}
        >
          Financial Audit Trail ({auditLogs.filter(a => a.entityType === 'invoice' || a.entityType === 'payment').length})
        </button>
      </div>

      {/* 1. INVOICES TAB */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              {[
                { id: 'all', label: 'All Invoices' },
                { id: 'draft', label: 'Draft' },
                { id: 'sent', label: 'Sent' },
                { id: 'viewed', label: 'Viewed' },
                { id: 'partially_paid', label: 'Partially Paid' },
                { id: 'paid', label: 'Paid' },
                { id: 'archived', label: 'Archived' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    statusFilter === st.id 
                      ? 'bg-sidebar-bg text-white shadow-xs' 
                      : 'bg-white border border-border-subtle text-text-muted hover:text-text-main'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search invoice # or client..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-border-subtle rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Invoice List */}
          <div className="bg-white rounded-[28px] border border-border-subtle shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] border-b border-border-subtle text-text-muted uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Invoice #</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Issue Date</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Status & Workflow</th>
                    <th className="p-4 text-right">Total Due</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-text-muted">
                        No invoices match your selected filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-[#FDFBF7]/60 transition-colors">
                        <td className="p-4 font-mono font-bold text-text-main">
                          <button onClick={() => setViewInvoice(inv)} className="hover:text-card-blue hover:underline">
                            {inv.invoiceNumber}
                          </button>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-text-main block">{inv.clientName}</span>
                          <span className="text-[11px] text-text-muted">{inv.clientEmail}</span>
                        </td>
                        <td className="p-4 text-text-muted whitespace-nowrap">{inv.issueDate}</td>
                        <td className="p-4 text-text-muted whitespace-nowrap">{inv.dueDate}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(inv.status)}
                            {inv.status === 'paid' && inv.referenceNumber && (
                              <span className="text-[10px] text-emerald-700 font-mono" title={inv.referenceNumber}>
                                Ref: {inv.referenceNumber}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right font-mono font-extrabold text-text-main text-sm">
                          ${(inv.total || 0).toLocaleString()}
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Workflow Quick Action buttons */}
                            {inv.status === 'draft' && (
                              <button
                                onClick={() => updateInvoiceStatus(inv.id, 'sent', 'Sent invoice directly to client')}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg font-semibold flex items-center gap-1 text-[11px]"
                                title="Mark as Sent to Client"
                              >
                                <Send className="w-3 h-3" /> Send
                              </button>
                            )}

                            {inv.status === 'sent' && (
                              <button
                                onClick={() => updateInvoiceStatus(inv.id, 'viewed', 'Client viewed invoice via portal')}
                                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg font-semibold flex items-center gap-1 text-[11px]"
                                title="Mark as Viewed"
                              >
                                <Eye className="w-3 h-3" /> Viewed
                              </button>
                            )}

                            {inv.status !== 'paid' && inv.status !== 'archived' && (
                              <button
                                onClick={() => { setInvoiceToPay(inv); setPaymentModalOpen(true); }}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold flex items-center gap-1 text-[11px] border border-emerald-200"
                                title="Record payment & mark as paid"
                              >
                                <Check className="w-3 h-3" /> Record Payment
                              </button>
                            )}

                            {inv.status === 'paid' && (
                              <button
                                onClick={() => updateInvoiceStatus(inv.id, 'archived', 'Archived paid invoice')}
                                className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold flex items-center gap-1 text-[11px]"
                                title="Archive Invoice"
                              >
                                <Archive className="w-3 h-3" /> Archive
                              </button>
                            )}

                            <button
                              onClick={() => setViewInvoice(inv)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-text-main"
                              title="View & Print Official Invoice"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                            
                            <button
                              onClick={() => { setInvoiceToEdit(inv); setInvoiceModalOpen(true); }}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-text-main"
                              title="Edit Invoice Parameters"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            
                            <button
                              onClick={() => duplicateInvoice(inv.id)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-text-main"
                              title="Duplicate Invoice"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            
                            <button
                              onClick={() => deleteInvoice(inv.id, 'Deleted invoice record')}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600"
                              title="Delete Invoice"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 2. PAYMENTS LEDGER TAB */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-[28px] border border-border-subtle shadow-xs overflow-hidden">
          <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-text-main">Settled Payments & Remittance Ledger</h3>
              <p className="text-xs text-text-muted mt-0.5">
                Traceable transactions with reference number verification, payment methods, and timestamps.
              </p>
            </div>
            <button
              onClick={handleExportPaymentsCSV}
              className="px-4 py-2 bg-[#FDFBF7] border border-border-subtle hover:bg-gray-100 text-text-main text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-text-muted" />
              Download Payments CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDFBF7] border-b border-border-subtle text-text-muted uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Payment Reference</th>
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Payment Date</th>
                  <th className="p-4">Clearing Method</th>
                  <th className="p-4 text-right">Settled Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {payments.map(pay => (
                  <tr key={pay.id} className="hover:bg-[#FDFBF7]/60">
                    <td className="p-4 font-mono font-bold text-text-main flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {pay.referenceNumber}
                    </td>
                    <td className="p-4 font-mono text-card-blue font-bold">{pay.invoiceNumber}</td>
                    <td className="p-4 font-semibold text-text-main">{pay.clientName}</td>
                    <td className="p-4 text-text-muted">{pay.date}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 font-semibold text-[11px] text-gray-800">
                        {pay.method}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-extrabold text-emerald-700 text-sm">
                      +${(pay.amount || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. FINANCIAL AUDIT TRAIL TAB */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-[28px] border border-border-subtle shadow-xs p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
            <div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Invoicing & Payment Audit Ledger
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Full trace of all invoice status adjustments, price modifications, payment settlements, and cancellations.
              </p>
            </div>
            <button
              onClick={() => setAuditModalOpen(true)}
              className="px-4 py-2 bg-sidebar-bg text-white text-xs font-semibold rounded-xl hover:bg-sidebar-active"
            >
              Open Full Audit Inspector
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.filter(a => a.entityType === 'invoice' || a.entityType === 'payment').map(log => (
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
      )}

      {/* View Printable Invoice Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-[28px] border border-border-subtle shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight text-text-main">{userProfile.agencyName || 'AEDMIN STUDIO'}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-card-yellow/50 text-amber-950 font-bold">OFFICIAL INVOICE</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="p-2 rounded-full hover:bg-gray-100 text-gray-500" title="Print Invoice / Save as PDF">
                  <Printer className="w-4 h-4" />
                </button>
                <button onClick={() => setViewInvoice(null)} className="px-3.5 py-1.5 bg-gray-100 rounded-full text-xs font-semibold hover:bg-gray-200">
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs">
              <div>
                <p className="font-bold text-text-main text-sm">{userProfile.fullName}</p>
                <p className="text-text-muted">{userProfile.title}</p>
                <p className="text-text-muted">{userProfile.email}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-text-main">{viewInvoice.invoiceNumber}</p>
                <p className="text-text-muted">Issue Date: {viewInvoice.issueDate}</p>
                <p className="text-text-muted">Due Date: {viewInvoice.dueDate}</p>
                <div className="mt-1 flex justify-end">
                  {getStatusBadge(viewInvoice.status)}
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-border-subtle text-xs">
              <span className="text-text-muted uppercase font-bold text-[10px]">Billed To Client:</span>
              <p className="font-bold text-text-main text-sm mt-0.5">{viewInvoice.clientName}</p>
              <p className="text-text-muted">{viewInvoice.clientEmail}</p>
            </div>

            <div className="border border-border-subtle rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#FDFBF7] border-b border-border-subtle font-semibold text-text-muted uppercase">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {(viewInvoice.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium">{item.description}</td>
                      <td className="p-3 text-center font-mono">{item.quantity}</td>
                      <td className="p-3 text-right font-mono">${(item.unitPrice || 0).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold">${(item.amount || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end text-sm">
              <div className="w-56 space-y-1">
                <div className="flex justify-between text-text-muted text-xs">
                  <span>Subtotal:</span>
                  <span>${(viewInvoice.subtotal || 0).toLocaleString()}</span>
                </div>
                {viewInvoice.taxRate > 0 && (
                  <div className="flex justify-between text-text-muted text-xs">
                    <span>Tax ({viewInvoice.taxRate}%):</span>
                    <span>${(viewInvoice.taxAmount || 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-text-main text-base pt-1 border-t border-border-subtle">
                  <span>Total Due:</span>
                  <span>${(viewInvoice.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {viewInvoice.status === 'paid' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-950 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    Payment Cleared & Settled
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                    Audit Verified
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-950">
                  <p>Settled Date: <strong>{viewInvoice.paidDate || 'Verified'}</strong></p>
                  <p>Method: <strong>{viewInvoice.paymentMethod || 'Bank Wire / ACH'}</strong></p>
                  <p className="sm:col-span-2 font-mono">
                    Ref #: <strong className="bg-white px-1.5 py-0.5 rounded border border-emerald-200">{viewInvoice.referenceNumber || viewInvoice.paymentReferenceNumber || 'REF-TXN-VERIFIED'}</strong>
                  </p>
                  {viewInvoice.paymentUrl && (
                    <p className="sm:col-span-2 truncate">
                      Payment Link / Receipt: <a href={viewInvoice.paymentUrl} target="_blank" rel="noreferrer" className="underline font-mono text-emerald-800 hover:text-emerald-950">{viewInvoice.paymentUrl}</a>
                    </p>
                  )}
                  {viewInvoice.paymentProofFileName && (
                    <p className="sm:col-span-2 text-[11px] text-emerald-900 flex items-center gap-1.5">
                      <span>Proof of Payment:</span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-200">{viewInvoice.paymentProofFileName}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {viewInvoice.status === 'partially_paid' && (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-teal-950 font-bold">
                    <Clock className="w-4 h-4 text-teal-700" />
                    Partial Settlement Recorded
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded">
                    Partially Settled
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-teal-950">
                  <p>Amount Paid: <strong>${(viewInvoice.partiallyPaidAmount || 0).toLocaleString()}</strong></p>
                  <p>Remaining Balance: <strong className="text-rose-700">${(viewInvoice.remainingBalance ?? (viewInvoice.total - (viewInvoice.partiallyPaidAmount || 0))).toLocaleString()}</strong></p>
                  <p className="col-span-2 font-mono">
                    Ref #: <strong className="bg-white px-1.5 py-0.5 rounded border border-teal-200">{viewInvoice.referenceNumber || 'REF-PARTIAL'}</strong>
                  </p>
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-2xl text-[11px] text-text-muted space-y-1">
              <p className="font-semibold text-text-main">Payment Notes & Wire Remittance:</p>
              <p>{viewInvoice.notes}</p>
            </div>

          </div>
        </div>
      )}

      {/* Modals */}
      <InvoiceModal 
        isOpen={invoiceModalOpen} 
        onClose={() => setInvoiceModalOpen(false)} 
        invoiceToEdit={invoiceToEdit} 
      />

      <RecordPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        invoice={invoiceToPay}
      />

      <AuditLogModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        filterEntityType="invoice"
      />

    </div>
  );
}
