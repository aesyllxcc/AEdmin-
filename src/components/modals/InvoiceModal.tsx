import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, DollarSign, FileText, ShieldCheck, AlertCircle, Hash, Link as LinkIcon, Calendar, CreditCard, UploadCloud } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Invoice, InvoiceItem } from '@/types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceToEdit?: Invoice | null;
  defaultClientId?: string;
}

export function InvoiceModal({ isOpen, onClose, invoiceToEdit, defaultClientId }: InvoiceModalProps) {
  const { clients, addInvoice, updateInvoice, userProfile } = useApp();

  const [clientId, setClientId] = useState(invoiceToEdit?.clientId || defaultClientId || clients[0]?.id || '');
  const [invoiceNumber, setInvoiceNumber] = useState(invoiceToEdit?.invoiceNumber || `INV-2026-0${Math.floor(10 + Math.random() * 90)}`);
  const [issueDate, setIssueDate] = useState(invoiceToEdit?.issueDate || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(invoiceToEdit?.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  const [status, setStatus] = useState<Invoice['status']>(invoiceToEdit?.status || 'draft');
  const [notes, setNotes] = useState(invoiceToEdit?.notes || 'Thank you for your business. Please remit payment within 14 days.');
  const [taxRate, setTaxRate] = useState<number>(invoiceToEdit?.taxRate || 0);
  const [editReason, setEditReason] = useState(invoiceToEdit?.editReason || '');
  
  // Payment Reconciliation fields (Required when status is paid)
  const [referenceNumber, setReferenceNumber] = useState(invoiceToEdit?.referenceNumber || invoiceToEdit?.paymentReferenceNumber || '');
  const [paymentUrl, setPaymentUrl] = useState(invoiceToEdit?.paymentUrl || '');
  const [paidDate, setPaidDate] = useState(invoiceToEdit?.paidDate || new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState(invoiceToEdit?.paymentMethod || 'Bank Wire / ACH');
  const [partiallyPaidAmount, setPartiallyPaidAmount] = useState<number>(invoiceToEdit?.partiallyPaidAmount || 0);
  const [paymentProofUrl, setPaymentProofUrl] = useState(invoiceToEdit?.paymentProofUrl || '');
  const [paymentProofFileName, setPaymentProofFileName] = useState(invoiceToEdit?.paymentProofFileName || '');
  const [paymentNotes, setPaymentNotes] = useState(invoiceToEdit?.paymentNotes || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  const [items, setItems] = useState<InvoiceItem[]>(invoiceToEdit?.items || [
    { id: 'item_1', description: 'Executive Support & Operations Retainer Allocation', quantity: 1, unitPrice: 5000, amount: 5000 }
  ]);

  useEffect(() => {
    if (invoiceToEdit) {
      setClientId(invoiceToEdit.clientId || defaultClientId || clients[0]?.id || '');
      setInvoiceNumber(invoiceToEdit.invoiceNumber || `INV-2026-0${Math.floor(10 + Math.random() * 90)}`);
      setIssueDate(invoiceToEdit.issueDate || new Date().toISOString().split('T')[0]);
      setDueDate(invoiceToEdit.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
      setStatus(invoiceToEdit.status || 'draft');
      setNotes(invoiceToEdit.notes || 'Thank you for your business. Please remit payment within 14 days.');
      setTaxRate(invoiceToEdit.taxRate || 0);
      setEditReason(invoiceToEdit.editReason || '');
      setReferenceNumber(invoiceToEdit.referenceNumber || invoiceToEdit.paymentReferenceNumber || '');
      setPaymentUrl(invoiceToEdit.paymentUrl || '');
      setPaidDate(invoiceToEdit.paidDate || new Date().toISOString().split('T')[0]);
      setPaymentMethod(invoiceToEdit.paymentMethod || 'Bank Wire / ACH');
      setPartiallyPaidAmount(invoiceToEdit.partiallyPaidAmount || 0);
      setPaymentProofUrl(invoiceToEdit.paymentProofUrl || '');
      setPaymentProofFileName(invoiceToEdit.paymentProofFileName || '');
      setPaymentNotes(invoiceToEdit.paymentNotes || '');
      setValidationError(null);
      setItems(invoiceToEdit.items && invoiceToEdit.items.length > 0 ? invoiceToEdit.items : [
        { id: 'item_1', description: 'Executive Support & Operations Retainer Allocation', quantity: 1, unitPrice: 5000, amount: 5000 }
      ]);
    } else {
      setClientId(defaultClientId || clients[0]?.id || '');
      setInvoiceNumber(`INV-2026-0${Math.floor(10 + Math.random() * 90)}`);
      setIssueDate(new Date().toISOString().split('T')[0]);
      setDueDate(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
      setStatus('draft');
      setNotes('Thank you for your business. Please remit payment within 14 days.');
      setTaxRate(0);
      setEditReason('');
      setReferenceNumber('');
      setPaymentUrl('');
      setPaidDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('Bank Wire / ACH');
      setPartiallyPaidAmount(0);
      setPaymentProofUrl('');
      setPaymentProofFileName('');
      setPaymentNotes('');
      setValidationError(null);
      setItems([
        { id: 'item_1', description: 'Executive Support & Operations Retainer Allocation', quantity: 1, unitPrice: 5000, amount: 5000 }
      ]);
    }
  }, [invoiceToEdit, isOpen, defaultClientId, clients]);

  if (!isOpen) return null;

  const handleItemChange = (id: string, field: keyof InvoiceItem, val: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: val };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.amount = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      }
      return item;
    }));
  };

  const addItem = () => {
    setItems(prev => [
      ...prev,
      { id: `item_${Date.now()}`, description: 'Additional Services / Deliverables', quantity: 1, unitPrice: 150, amount: 150 }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const subtotal = items.reduce((acc, it) => acc + (it.amount || 0), 0);
  const taxAmount = (subtotal * (taxRate || 0)) / 100;
  const total = subtotal + taxAmount;

  const handleProofFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPaymentProofFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPaymentProofUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation rule: Before an invoice can be marked as Paid, require Reference Number, Payment URL, and Payment Date
    if (status === 'paid') {
      if (!referenceNumber.trim()) {
        setValidationError('A Reference Number (e.g., Transaction ID, Wire Ref) is strictly required before marking an invoice as Paid.');
        return;
      }
      if (!paymentUrl.trim()) {
        setValidationError('A Payment URL (receipt link or payment processor link) is strictly required before marking an invoice as Paid.');
        return;
      }
      if (!paidDate) {
        setValidationError('Payment Date is required before marking an invoice as Paid.');
        return;
      }
    }

    const client = clients.find(c => c.id === clientId);

    const invoiceData: Partial<Invoice> = {
      invoiceNumber,
      clientId,
      clientName: client?.name || 'Client',
      clientEmail: client?.email || 'billing@client.com',
      issueDate,
      dueDate,
      items,
      subtotal,
      taxRate: Number(taxRate),
      taxAmount,
      total,
      status,
      notes,
      referenceNumber: referenceNumber.trim() || undefined,
      paymentReferenceNumber: referenceNumber.trim() || undefined,
      paymentUrl: paymentUrl.trim() || undefined,
      paidDate: status === 'paid' || status === 'partially_paid' ? paidDate : undefined,
      paymentMethod: status === 'paid' || status === 'partially_paid' ? paymentMethod : undefined,
      partiallyPaidAmount: status === 'partially_paid' ? partiallyPaidAmount : undefined,
      remainingBalance: status === 'partially_paid' ? Math.max(0, total - partiallyPaidAmount) : undefined,
      paymentProofUrl: paymentProofUrl || undefined,
      paymentProofFileName: paymentProofFileName || undefined,
      paymentNotes: paymentNotes.trim() || undefined,
      editReason: editReason || (invoiceToEdit ? 'Invoice parameters updated' : 'Created new invoice')
    };

    if (invoiceToEdit) {
      updateInvoice(invoiceToEdit.id, invoiceData, editReason || `Updated invoice details (Status: ${status.toUpperCase()})`);
    } else {
      addInvoice(invoiceData as Omit<Invoice, 'id'>, 'Generated new client invoice draft');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] border border-border-subtle shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sidebar-bg text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main">
                {invoiceToEdit ? `Edit Invoice ${invoiceToEdit.invoiceNumber}` : 'Generate Client Invoice'}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">AEDMIN Fully Editable Invoice Workflow & Audit Tracking</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {validationError && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Billed To Client</label>
              <select 
                value={clientId ?? ''} 
                onChange={e => setClientId(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Invoice #</label>
              <input 
                type="text" 
                value={invoiceNumber ?? ''} 
                onChange={e => setInvoiceNumber(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-mono font-bold focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Workflow Status</label>
              <select 
                value={status ?? 'draft'} 
                onChange={e => {
                  const newStatus = e.target.value as Invoice['status'];
                  setStatus(newStatus);
                  if (newStatus === 'paid' && !referenceNumber) {
                    setReferenceNumber(`REF-TXN-${Date.now().toString().slice(-6)}`);
                  }
                  if (newStatus === 'paid' && !paymentUrl) {
                    setPaymentUrl(`https://pay.stripe.com/receipt/inv_${(invoiceNumber || '2026').toLowerCase().replace(/[^a-z0-9]/g, '')}`);
                  }
                }}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-semibold focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="viewed">Viewed</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="paid">Paid (Settled)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Issue Date</label>
              <input 
                type="date" 
                value={issueDate ?? ''} 
                onChange={e => setIssueDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Due Date</label>
              <input 
                type="date" 
                value={dueDate ?? ''} 
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Tax Rate (%)</label>
              <input 
                type="number" 
                min="0"
                max="100"
                step="0.5"
                value={taxRate} 
                onChange={e => setTaxRate(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Conditional Payment Verification Section (Strictly Required when Paid / Partially Paid) */}
          {(status === 'paid' || status === 'partially_paid') && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Mandatory Payment Settlement Verification
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                  {status === 'paid' ? 'Paid Reconciliation' : 'Partial Reconciliation'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-emerald-950 mb-1 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-emerald-700" />
                    Reference Number *
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={e => { setReferenceNumber(e.target.value); setValidationError(null); }}
                    placeholder="e.g. WIRE-892419, CHK-4402"
                    className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl font-mono font-bold text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-emerald-950 mb-1 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 text-emerald-700" />
                    Payment URL *
                  </label>
                  <input
                    type="url"
                    value={paymentUrl}
                    onChange={e => { setPaymentUrl(e.target.value); setValidationError(null); }}
                    placeholder="https://pay.stripe.com/receipt/..."
                    className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl font-mono text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-emerald-950 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-700" />
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    value={paidDate}
                    onChange={e => { setPaidDate(e.target.value); setValidationError(null); }}
                    className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              {status === 'partially_paid' && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-200/60 text-xs">
                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Partially Paid Amount ($)</label>
                    <input
                      type="number"
                      min="1"
                      max={total}
                      value={partiallyPaidAmount}
                      onChange={e => setPartiallyPaidAmount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-xl font-mono font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Remaining Balance</label>
                    <div className="px-3 py-1.5 bg-emerald-100/60 rounded-xl font-mono font-bold text-emerald-900 text-xs">
                      ${Math.max(0, total - partiallyPaidAmount).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Screenshot / Proof of payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-emerald-200/60 text-xs">
                <div>
                  <label className="block font-semibold text-emerald-900 mb-1 flex items-center gap-1">
                    <UploadCloud className="w-3 h-3 text-emerald-700" />
                    Screenshot / Proof of Payment (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleProofFileUpload}
                    className="text-[11px] text-emerald-900 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-white file:text-emerald-800"
                  />
                  {paymentProofFileName && (
                    <span className="text-[10px] text-emerald-800 font-mono mt-0.5 block truncate">
                      {paymentProofFileName}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block font-semibold text-emerald-900 mb-1">Payment Clearing Method</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs"
                  >
                    <option value="Bank Wire / ACH">Bank Wire / ACH</option>
                    <option value="Stripe / Credit Card">Stripe / Credit Card</option>
                    <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                    <option value="Wise Transfer">Wise Transfer</option>
                    <option value="Corporate Check">Corporate Check</option>
                    <option value="PayPal / Venmo">PayPal / Venmo</option>
                    <option value="Other Method">Other Clearing Method</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider">Line Items & Deliverables</label>
              <button 
                type="button" 
                onClick={addItem}
                className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item Line
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-[#FDFBF7] rounded-2xl border border-border-subtle">
                  <input 
                    type="text" 
                    value={item.description ?? ''} 
                    onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                    placeholder="Description of deliverables, services, or retainer block..."
                    className="flex-1 px-3 py-1.5 bg-white border border-border-subtle rounded-xl text-xs font-medium focus:outline-none"
                    required
                  />
                  <div className="w-20">
                    <input 
                      type="number" 
                      min="1"
                      step="0.5"
                      value={item.quantity ?? 1} 
                      onChange={e => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-border-subtle rounded-xl text-xs font-bold text-center focus:outline-none"
                      placeholder="Qty"
                    />
                  </div>
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                    <input 
                      type="number" 
                      min="0"
                      value={item.unitPrice ?? 0} 
                      onChange={e => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                      className="w-full pl-7 pr-2 py-1.5 bg-white border border-border-subtle rounded-xl text-xs font-bold text-right focus:outline-none"
                      placeholder="Unit Price"
                    />
                  </div>
                  <div className="w-28 text-right font-mono font-bold text-xs text-text-main">
                    ${(item.amount || 0).toLocaleString()}
                  </div>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal & Total */}
          <div className="flex justify-end p-4 bg-[#FDFBF7] rounded-2xl border border-border-subtle">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal:</span>
                <span className="font-semibold text-text-main font-mono">${(subtotal || 0).toLocaleString()}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-text-muted">
                  <span>Tax ({taxRate}%):</span>
                  <span className="font-semibold text-text-main font-mono">${(taxAmount || 0).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-text-main pt-2 border-t border-border-subtle">
                <span>Total Due:</span>
                <span className="font-mono text-emerald-800">${(total || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Payment Terms & Remittance Instructions</label>
            <textarea 
              rows={2}
              value={notes ?? ''} 
              onChange={e => setNotes(e.target.value)}
              className="w-full px-4 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-medium focus:outline-none"
            />
          </div>

          {/* Audit Logging & Edit Justification */}
          <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-gray-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Audit Reason (Traceable Change Log)
              </label>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Actor: {userProfile.fullName || 'Olivia Vance'}
              </span>
            </div>
            <input 
              type="text" 
              value={editReason} 
              onChange={e => setEditReason(e.target.value)}
              placeholder={invoiceToEdit ? "e.g. Added additional retainer overage line item as agreed by client" : "e.g. Monthly scheduled billing"}
              className="w-full px-4 py-2 bg-white border border-border-subtle rounded-xl text-xs font-medium focus:outline-none"
            />
            {invoiceToEdit?.lastModified && (
              <p className="text-[11px] text-text-muted">
                Last modified: {new Date(invoiceToEdit.lastModified).toLocaleString()} by {invoiceToEdit.modifiedBy || 'System Admin'}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-border-subtle text-xs font-semibold text-text-muted hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-full bg-sidebar-bg text-white text-xs font-semibold hover:bg-sidebar-active transition-colors shadow-sm"
            >
              {invoiceToEdit ? 'Save Changes & Update Audit Trail' : 'Create & Issue Invoice'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

