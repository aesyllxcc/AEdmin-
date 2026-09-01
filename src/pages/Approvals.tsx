import React, { useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  FileText, 
  MessageSquare, 
  Check, 
  RotateCcw, 
  X, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  Filter,
  User,
  Send,
  AlertTriangle,
  Flame,
  Calendar,
  Layers,
  ArrowUpRight,
  HelpCircle,
  Bell,
  Trash2,
  Edit2
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ApprovalItem } from "@/types";

export default function Approvals() {
  const { 
    approvals, 
    clients, 
    userProfile, 
    addApproval, 
    updateApprovalStatus, 
    askApprovalQuestion, 
    deleteApproval 
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  // Selection & Modals
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [reviewDecisionModalOpen, setReviewDecisionModalOpen] = useState(false);
  const [reviewDecisionType, setReviewDecisionType] = useState<"approved" | "revision_requested" | "rejected" | "escalated">("approved");
  const [reviewComment, setReviewComment] = useState("");
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");

  // New Approval Form State
  const [newClientId, setNewClientId] = useState(clients[0]?.id || "");
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ApprovalItem['type']>('deliverable');
  const [newPriority, setNewPriority] = useState<ApprovalItem['priority']>('high');
  const [newOwnerName, setNewOwnerName] = useState(userProfile.fullName || "Ellysa May M. Del Prado");
  const [newAssignedApprover, setNewAssignedApprover] = useState("");
  const [newReviewLink, setNewReviewLink] = useState("");
  const [newDueDate, setNewDueDate] = useState(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]);
  const [newContext, setNewContext] = useState("");
  const [newRecommendation, setNewRecommendation] = useState("");

  // Filtered approvals
  const filteredApprovals = approvals.filter(app => {
    const titleMatch = (app.title || (app as any).deliverableTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                       app.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (app.ownerName || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!titleMatch) return false;
    if (statusFilter !== "all" && app.status !== statusFilter) return false;
    if (clientFilter !== "all" && app.clientId !== clientFilter) return false;
    if (priorityFilter !== "all" && app.priority !== priorityFilter) return false;
    return true;
  });

  // Metric counts
  const totalCount = approvals.length;
  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const revisionCount = approvals.filter(a => a.status === 'revision_requested').length;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  const overdueCount = approvals.filter(a => {
    if (a.status === 'approved' || a.status === 'rejected') return false;
    const due = new Date(a.dueDate).getTime();
    return due < Date.now();
  }).length;

  const handleCreateApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const selectedClient = clients.find(c => c.id === newClientId);

    addApproval({
      clientId: newClientId,
      clientName: selectedClient?.name || 'Client',
      title: newTitle.trim(),
      type: newType,
      priority: newPriority,
      ownerName: newOwnerName.trim() || userProfile.fullName,
      assignedApprover: newAssignedApprover.trim() || selectedClient?.primaryContact || 'Client Lead',
      reviewLink: newReviewLink.trim(),
      dueDate: newDueDate,
      comments: '',
      context: newContext.trim(),
      recommendation: newRecommendation.trim(),
      status: 'pending',
      reminderCount: 0
    } as any);

    setNewModalOpen(false);
    setNewTitle("");
    setNewReviewLink("");
    setNewContext("");
    setNewRecommendation("");
    setNewAssignedApprover("");
  };

  const handleExecuteDecision = () => {
    if (!selectedApproval) return;
    updateApprovalStatus(selectedApproval.id, reviewDecisionType, reviewComment || undefined);
    
    // Update local selected state
    setSelectedApproval({
      ...selectedApproval,
      status: reviewDecisionType,
      comments: reviewComment || selectedApproval.comments,
      decisionHistory: [
        ...(selectedApproval.decisionHistory || []),
        {
          timestamp: new Date().toISOString(),
          action: reviewDecisionType === 'approved' ? 'Approved & Signed Off' :
                  reviewDecisionType === 'revision_requested' ? 'Revision Requested' :
                  reviewDecisionType === 'rejected' ? 'Rejected' : 'Escalated',
          author: selectedApproval.assignedApprover || selectedApproval.clientName,
          note: reviewComment || undefined
        }
      ]
    });

    setReviewDecisionModalOpen(false);
    setReviewComment("");
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !selectedApproval) return;

    askApprovalQuestion(selectedApproval.id, userProfile.fullName || 'Executive Lead', newQuestionText.trim());
    
    const newQ = {
      id: `q_${Date.now()}`,
      author: userProfile.fullName || 'Executive Lead',
      text: newQuestionText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSelectedApproval({
      ...selectedApproval,
      questionsAsked: [...(selectedApproval.questionsAsked || []), newQ]
    });

    setNewQuestionText("");
  };

  const getDeadlineStatus = (dueDate: string, status: string) => {
    if (status === 'approved') return { label: 'Completed', color: 'text-emerald-700 bg-emerald-50' };
    if (status === 'rejected') return { label: 'Closed', color: 'text-stone-500 bg-stone-100' };

    const due = new Date(dueDate).getTime();
    const now = Date.now();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Overdue by ${Math.abs(diffDays)}d`, color: 'text-rose-700 bg-rose-50 font-bold' };
    } else if (diffDays === 0) {
      return { label: 'Due Today', color: 'text-amber-700 bg-amber-100 font-bold' };
    } else if (diffDays === 1) {
      return { label: '1 Day Remaining', color: 'text-amber-700 bg-amber-50' };
    } else {
      return { label: `${diffDays} Days Remaining`, color: 'text-blue-700 bg-blue-50' };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#ECE6DD]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#18191D] text-white text-xs font-bold tracking-wide uppercase">
              Centralized Approval Dashboard
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Client Sign-Offs & Decision Governance
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#18191D] mt-1.5">
            Deliverables & Executive Approvals
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Track ownership, monitor decision deadlines, collect structured feedback, and log audit history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#FAF8F5] p-1 rounded-full border border-[#ECE6DD] text-xs font-bold">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-full transition-all ${
                viewMode === "list" ? "bg-[#18191D] text-white shadow-2xs" : "text-stone-500 hover:text-black"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-full transition-all ${
                viewMode === "kanban" ? "bg-[#18191D] text-white shadow-2xs" : "text-stone-500 hover:text-black"
              }`}
            >
              Kanban Board
            </button>
          </div>

          <button
            onClick={() => setNewModalOpen(true)}
            className="px-5 py-2.5 bg-[#18191D] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Submit Approval Request
          </button>
        </div>
      </div>

      {/* Top Executive Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Total Sign-Offs</span>
            <Layers className="w-4 h-4 text-stone-400" />
          </div>
          <p className="text-2xl font-extrabold text-[#18191D]">{totalCount}</p>
          <span className="text-[11px] text-stone-400">All submitted items</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs space-y-1 bg-blue-50/20">
          <div className="flex items-center justify-between text-blue-900 text-xs font-bold">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-blue-950">{pendingCount}</p>
          <span className="text-[11px] text-blue-800/70">Awaiting stakeholder decision</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs space-y-1 bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-900 text-xs font-bold">
            <span>Revisions Active</span>
            <RotateCcw className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-950">{revisionCount}</p>
          <span className="text-[11px] text-amber-800/70">Feedback under adjustment</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-1 bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-900 text-xs font-bold">
            <span>Signed Off</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-950">{approvedCount}</p>
          <span className="text-[11px] text-emerald-800/70">Fully approved & locked</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-xs space-y-1 bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-900 text-xs font-bold">
            <span>Overdue / Escalated</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-950">{overdueCount}</p>
          <span className="text-[11px] text-rose-800/70">Target deadline exceeded</span>
        </div>

      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 bg-white rounded-3xl border border-[#ECE6DD] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by deliverable title, client, or owner..."
            className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] text-xs font-semibold focus:outline-none focus:bg-white"
          />
        </div>

        {/* Client Filter */}
        <div className="flex items-center gap-2">
          <span className="text-stone-400 font-bold shrink-0">Client:</span>
          <select
            value={clientFilter}
            onChange={e => setClientFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-semibold text-[#18191D] focus:outline-none"
          >
            <option value="all">All Workspaces ({clients.length})</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-stone-400 font-bold shrink-0">Priority:</span>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-semibold text-[#18191D] focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>

      </div>

      {/* Filter Status Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Sign-Offs', count: approvals.length },
          { id: 'pending', label: 'Pending Review', count: pendingCount },
          { id: 'revision_requested', label: 'Revision Requested', count: revisionCount },
          { id: 'approved', label: 'Approved & Signed Off', count: approvedCount },
          { id: 'rejected', label: 'Rejected', count: approvals.filter(a => a.status === 'rejected').length },
          { id: 'escalated', label: 'Escalated', count: approvals.filter(a => a.status === 'escalated').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === tab.id 
                ? 'bg-[#18191D] text-white shadow-2xs' 
                : 'bg-white border border-[#ECE6DD] text-stone-600 hover:text-black'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 1. LIST / TABLE VIEW */}
      {viewMode === "list" && (
        <div className="bg-white rounded-3xl border border-[#ECE6DD] shadow-xs overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#ECE6DD] text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Deliverable & Client</th>
                  <th className="py-3.5 px-4">Ownership</th>
                  <th className="py-3.5 px-4">Approver</th>
                  <th className="py-3.5 px-4">Deadline & SLA</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">History</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE6DD]">
                {filteredApprovals.length > 0 ? (
                  filteredApprovals.map(app => {
                    const titleText = app.title || (app as any).deliverableTitle || "Executive Deliverable";
                    const driveLink = app.reviewLink || (app as any).driveLink;
                    const deadline = getDeadlineStatus(app.dueDate, app.status);

                    return (
                      <tr 
                        key={app.id} 
                        className="hover:bg-[#FAF8F5]/60 transition-colors group cursor-pointer"
                        onClick={() => setSelectedApproval(app)}
                      >
                        <td className="py-4 px-5 max-w-[280px]">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#ECE6DD] text-stone-700">
                              {app.clientName}
                            </span>
                            <h4 className="font-extrabold text-[#18191D] text-xs leading-snug group-hover:text-blue-600 transition-colors">
                              {titleText}
                            </h4>
                            {app.comments && (
                              <p className="text-[11px] text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/50 truncate max-w-full">
                                Note: {app.comments}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#18191D]">{app.ownerName || userProfile.fullName}</span>
                            <p className="text-[10px] text-stone-400">Executive Submitter</p>
                          </div>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#18191D]">{app.assignedApprover || app.clientName}</span>
                            <p className="text-[10px] text-stone-400">Decision Authority</p>
                          </div>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${deadline.color}`}>
                              {deadline.label}
                            </span>
                            <p className="text-[10px] font-mono text-stone-400">Target: {app.dueDate}</p>
                          </div>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize inline-flex items-center gap-1 ${
                            app.status === 'approved' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                            app.status === 'pending' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                            app.status === 'revision_requested' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                            app.status === 'escalated' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                            'bg-rose-100 text-rose-900 border border-rose-200'
                          }`}>
                            {app.status === 'approved' && <Check className="w-3 h-3 text-emerald-700" />}
                            {app.status === 'pending' && <Clock className="w-3 h-3 text-blue-700" />}
                            {app.status === 'revision_requested' && <RotateCcw className="w-3 h-3 text-amber-700" />}
                            {app.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap text-stone-500 font-mono text-[11px]">
                          {(app.decisionHistory || []).length} events
                        </td>

                        <td className="py-4 px-5 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            {driveLink && (
                              <a
                                href={driveLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-white border border-[#ECE6DD] hover:bg-stone-50 text-stone-700 rounded-xl transition-colors"
                                title="Open Drive deliverable"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => setSelectedApproval(app)}
                              className="px-3.5 py-1.5 bg-[#18191D] hover:bg-black text-white rounded-xl text-xs font-bold shadow-2xs"
                            >
                              Inspect
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-400 text-xs">
                      No approval records match your search filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 2. KANBAN BOARD VIEW */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          
          {/* Pending Review Column */}
          <div className="bg-[#FAF8F5] p-4 rounded-3xl border border-[#ECE6DD] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DD]">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Pending Sign-Off ({approvals.filter(a => a.status === 'pending').length})
              </span>
            </div>

            <div className="space-y-3">
              {approvals.filter(a => a.status === 'pending').map(app => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApproval(app)}
                  className="bg-white p-4 rounded-2xl border border-[#ECE6DD] shadow-2xs hover:border-black transition-all cursor-pointer space-y-2"
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] text-stone-600">
                    {app.clientName}
                  </span>
                  <h4 className="text-xs font-bold text-[#18191D] leading-snug">
                    {app.title || (app as any).deliverableTitle}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] pt-1 text-stone-500">
                    <span>Due: {app.dueDate}</span>
                    <span className="font-bold text-blue-700">Awaiting Client</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revisions Requested Column */}
          <div className="bg-[#FAF8F5] p-4 rounded-3xl border border-[#ECE6DD] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DD]">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Revision Requested ({approvals.filter(a => a.status === 'revision_requested').length})
              </span>
            </div>

            <div className="space-y-3">
              {approvals.filter(a => a.status === 'revision_requested').map(app => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApproval(app)}
                  className="bg-white p-4 rounded-2xl border border-[#ECE6DD] shadow-2xs hover:border-black transition-all cursor-pointer space-y-2"
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    {app.clientName}
                  </span>
                  <h4 className="text-xs font-bold text-[#18191D] leading-snug">
                    {app.title || (app as any).deliverableTitle}
                  </h4>
                  {app.comments && (
                    <p className="text-[10px] text-amber-900 bg-amber-50 p-1.5 rounded-lg line-clamp-2">
                      {app.comments}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-[10px] pt-1 text-stone-500">
                    <span>Due: {app.dueDate}</span>
                    <span className="font-bold text-amber-700">Needs Changes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Escalated / High Attention Column */}
          <div className="bg-[#FAF8F5] p-4 rounded-3xl border border-[#ECE6DD] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DD]">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Escalated ({approvals.filter(a => a.status === 'escalated').length})
              </span>
            </div>

            <div className="space-y-3">
              {approvals.filter(a => a.status === 'escalated').map(app => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApproval(app)}
                  className="bg-white p-4 rounded-2xl border border-purple-200 shadow-2xs hover:border-black transition-all cursor-pointer space-y-2"
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200">
                    {app.clientName}
                  </span>
                  <h4 className="text-xs font-bold text-[#18191D] leading-snug">
                    {app.title || (app as any).deliverableTitle}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] pt-1 text-stone-500">
                    <span>Due: {app.dueDate}</span>
                    <span className="font-bold text-purple-700">Escalated</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approved & Signed Off Column */}
          <div className="bg-[#FAF8F5] p-4 rounded-3xl border border-[#ECE6DD] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DD]">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Signed Off ({approvedCount})
              </span>
            </div>

            <div className="space-y-3">
              {approvals.filter(a => a.status === 'approved').map(app => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApproval(app)}
                  className="bg-white p-4 rounded-2xl border border-[#ECE6DD] shadow-2xs hover:border-black transition-all cursor-pointer space-y-2 opacity-85 hover:opacity-100"
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                    {app.clientName}
                  </span>
                  <h4 className="text-xs font-bold text-[#18191D] leading-snug line-through text-stone-500">
                    {app.title || (app as any).deliverableTitle}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] pt-1 text-emerald-700 font-bold">
                    <span>Approved</span>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 3. DETAILED APPROVAL INSPECTION SLIDEOVER / MODAL */}
      {selectedApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-[32px] border border-[#ECE6DD] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#ECE6DD]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#ECE6DD] text-stone-700 uppercase">
                    {selectedApproval.clientName}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                    selectedApproval.status === 'approved' ? 'bg-emerald-100 text-emerald-900' :
                    selectedApproval.status === 'pending' ? 'bg-blue-100 text-blue-900' :
                    selectedApproval.status === 'revision_requested' ? 'bg-amber-100 text-amber-900' :
                    'bg-purple-100 text-purple-900'
                  }`}>
                    {selectedApproval.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-[#18191D]">
                  {selectedApproval.title || (selectedApproval as any).deliverableTitle}
                </h3>
              </div>

              <button 
                onClick={() => setSelectedApproval(null)}
                className="p-2 text-stone-400 hover:text-black rounded-full hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Metadata Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD]">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Owner</span>
                <span className="font-bold text-[#18191D] truncate block">{selectedApproval.ownerName || userProfile.fullName}</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD]">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Approver</span>
                <span className="font-bold text-[#18191D] truncate block">{selectedApproval.assignedApprover || selectedApproval.clientName}</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD]">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Target Due Date</span>
                <span className="font-bold text-[#18191D] font-mono block">{selectedApproval.dueDate}</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD]">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Submitted</span>
                <span className="font-bold text-[#18191D] font-mono block">{selectedApproval.submittedDate}</span>
              </div>
            </div>

            {/* Context & Description */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
                Deliverable Context & Recommendation
              </h4>
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] space-y-2 text-stone-700 leading-relaxed">
                <p>{selectedApproval.context || (selectedApproval as any).description || "Executive deliverable submitted for formal stakeholder review."}</p>
                {selectedApproval.recommendation && (
                  <div className="pt-2 border-t border-[#ECE6DD] text-stone-800">
                    <strong>Lead Recommendation:</strong> {selectedApproval.recommendation}
                  </div>
                )}
              </div>
            </div>

            {/* Attached Review Document Link */}
            {(selectedApproval.reviewLink || (selectedApproval as any).driveLink) && (
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                  <div>
                    <span className="font-bold text-blue-950 block">Google Drive / Review Artifact</span>
                    <span className="text-[11px] text-blue-800/80 truncate block max-w-md">
                      {selectedApproval.reviewLink || (selectedApproval as any).driveLink}
                    </span>
                  </div>
                </div>
                <a
                  href={selectedApproval.reviewLink || (selectedApproval as any).driveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Document
                </a>
              </div>
            )}

            {/* Immutable Decision History Timeline */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-stone-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                Immutable Decision History & Audit Trail
              </h4>
              <div className="space-y-2 border-l-2 border-[#ECE6DD] pl-4 ml-1">
                {(selectedApproval.decisionHistory || [
                  { timestamp: selectedApproval.submittedDate, action: 'Submitted for Review', author: selectedApproval.ownerName || 'Operator' }
                ]).map((hist, idx) => (
                  <div key={idx} className="relative space-y-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#18191D] absolute -left-[21px] top-1.5" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#18191D]">{hist.action}</span>
                      <span className="text-[10px] font-mono text-stone-400">
                        {new Date(hist.timestamp).toLocaleDateString()} {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">By: {hist.author}</p>
                    {hist.note && (
                      <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl mt-1">
                        "{hist.note}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Q&A Thread / Dialogue Box */}
            <div className="space-y-3 text-xs pt-2 border-t border-[#ECE6DD]">
              <h4 className="font-bold text-stone-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                Discussion & Alignment Thread
              </h4>

              {selectedApproval.questionsAsked && selectedApproval.questionsAsked.length > 0 ? (
                <div className="space-y-2">
                  {selectedApproval.questionsAsked.map(q => (
                    <div key={q.id} className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] space-y-1">
                      <div className="flex justify-between text-[10px] text-stone-400 font-bold">
                        <span>{q.author}</span>
                        <span>{q.timestamp}</span>
                      </div>
                      <p className="text-stone-800 text-xs font-medium">{q.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-stone-400 italic">No notes or questions asked yet.</p>
              )}

              <form onSubmit={handleSendQuestion} className="flex gap-2">
                <input 
                  type="text" 
                  value={newQuestionText}
                  onChange={e => setNewQuestionText(e.target.value)}
                  placeholder="Post internal note or client clarification..."
                  className="flex-1 text-xs p-2.5 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#18191D] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" /> Post
                </button>
              </form>
            </div>

            {/* Modal Decision Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#ECE6DD]">
              <button
                type="button"
                onClick={() => {
                  deleteApproval(selectedApproval.id);
                  setSelectedApproval(null);
                }}
                className="text-xs text-stone-400 hover:text-rose-600 font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Sign-Off
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReviewDecisionType("revision_requested");
                    setReviewDecisionModalOpen(true);
                  }}
                  className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Request Revision
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReviewDecisionType("approved");
                    setReviewDecisionModalOpen(true);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" /> Approve & Sign Off
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. DECISION CONFIRMATION SUB-MODAL */}
      {reviewDecisionModalOpen && selectedApproval && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-[#ECE6DD] shadow-2xl max-w-md w-full p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DD]">
              <h3 className="text-sm font-bold text-[#18191D]">
                Confirm Decision: {reviewDecisionType === 'approved' ? 'Approve & Sign Off' : 'Request Revision'}
              </h3>
              <button onClick={() => setReviewDecisionModalOpen(false)} className="p-1 text-stone-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              {reviewDecisionType === 'approved' 
                ? 'Sign off on this deliverable and record the decision into the audit trail.' 
                : 'Enter structured revision notes detailing required changes for the executive team.'}
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Executive Notes & Feedback (Optional)
              </label>
              <textarea 
                rows={3}
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder={reviewDecisionType === 'approved' ? "e.g. Approved without further amendments." : "e.g. Please update slide 4 financial summary figures..."}
                className="w-full text-xs p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewDecisionModalOpen(false)}
                className="px-4 py-2 border border-[#ECE6DD] rounded-xl text-xs font-semibold text-stone-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDecision}
                className={`px-5 py-2 text-white rounded-xl text-xs font-bold shadow-xs ${
                  reviewDecisionType === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                Confirm {reviewDecisionType === 'approved' ? 'Approval' : 'Revision Request'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. NEW APPROVAL SUBMISSION MODAL */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-[32px] border border-[#ECE6DD] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
              <div>
                <h3 className="text-base font-extrabold text-[#18191D]">Submit Deliverable for Approval</h3>
                <p className="text-xs text-stone-500">Initiates formal client sign-off protocol with SLA tracking.</p>
              </div>
              <button onClick={() => setNewModalOpen(false)} className="p-2 text-stone-400 hover:text-black rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateApproval} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Client Workspace</label>
                <select 
                  value={newClientId} 
                  onChange={e => setNewClientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-semibold"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Deliverable Title</label>
                <input 
                  type="text" 
                  required
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Q3 Annual LP Investor Presentation Deck"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Type</label>
                  <select 
                    value={newType} 
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-semibold"
                  >
                    <option value="deliverable">Deliverable</option>
                    <option value="design_proof">Design Proof</option>
                    <option value="content_copy">Content Copy</option>
                    <option value="budget_expansion">Budget / SOW</option>
                    <option value="schedule_change">Schedule Change</option>
                    <option value="invoice_approval">Invoice Approval</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Priority</label>
                  <select 
                    value={newPriority} 
                    onChange={e => setNewPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-semibold"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Assigned Approver</label>
                  <input 
                    type="text" 
                    value={newAssignedApprover} 
                    onChange={e => setNewAssignedApprover(e.target.value)}
                    placeholder="e.g. Sarah Jenkins (Board Lead)"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Target Decision Date</label>
                  <input 
                    type="date" 
                    required
                    value={newDueDate} 
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-semibold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Google Drive / Review Link</label>
                <input 
                  type="url" 
                  value={newReviewLink} 
                  onChange={e => setNewReviewLink(e.target.value)}
                  placeholder="https://docs.google.com/presentation/d/..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Context & Summary</label>
                <textarea 
                  rows={2} 
                  value={newContext} 
                  onChange={e => setNewContext(e.target.value)}
                  placeholder="Summarize key decisions, edits, or considerations..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ECE6DD]">
                <button 
                  type="button" 
                  onClick={() => setNewModalOpen(false)} 
                  className="px-4 py-2 border border-[#ECE6DD] rounded-full text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-[#18191D] hover:bg-black text-white font-bold rounded-full shadow-xs active:scale-95 transition-all"
                >
                  Submit for Approval
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
