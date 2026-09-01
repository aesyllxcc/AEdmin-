import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  Plane, 
  UserCheck, 
  Briefcase, 
  Heart, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Check,
  X
} from 'lucide-react';
import { Client, ApprovalItem, Task, Project } from '@/types';

interface ExecutiveDecisionBriefingViewProps {
  client: Client;
  approvals: ApprovalItem[];
  tasks: Task[];
  projects: Project[];
  userFullName: string;
  userTitle: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onAskQuestion?: (id: string, question: string) => void;
}

export const ExecutiveDecisionBriefingView: React.FC<ExecutiveDecisionBriefingViewProps> = ({
  client,
  approvals,
  tasks,
  projects,
  userFullName,
  userTitle,
  onApprove,
  onReject,
  onAskQuestion
}) => {
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionApprovalId, setQuestionApprovalId] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState('');

  const todayDateStr = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const pendingApprovals = approvals.filter(a => a.clientId === client.id && a.status === 'pending');
  const clientTasks = tasks.filter(t => t.clientId === client.id && !t.isArchived);
  const activeDeliverables = clientTasks.filter(t => t.status === 'in_progress' || t.status === 'todo');
  const completedDeliverables = clientTasks.filter(t => t.status === 'completed');

  // Decision-relevant schedule commitments
  const scheduleItems = [
    { time: "09:00 AM", title: "Investor & LP Strategy Sync", type: "work", location: "Zoom • Link in Invite", prepNote: "Briefing deck v2.1 in Drive" },
    { time: "11:30 AM", title: "Executive Leadership & Product Review", type: "work", location: "Google Meet", prepNote: "Review slides 4-9 beforehand" },
    { time: "02:00 PM", title: "Cross-Border Tax & Legal Advisory", type: "work", location: "Private Call", prepNote: "EA attending to take detailed minutes" },
    { time: "05:30 PM", title: "Personal Health & Wellness Session", type: "personal", location: "Equinox Private Club", prepNote: "Trainer confirmed; locker reserved" },
  ];

  // EA Handled Items
  const eaHandledItems = [
    { id: 'h1', text: "Rescheduled external 3:00 PM vendor call to Thursday morning with no calendar clash.", category: "Calendar" },
    { id: 'h2', text: "Checked in online and secured 1A aisle seat for tomorrow's Singapore Airlines flight.", category: "Travel" },
    { id: 'h3', text: "Triaged 38 unread inbox threads; drafted responses for 4 partner intros.", category: "Inbox" },
    { id: 'h4', text: "Performed weekly Google Drive file audit; archived obsolete sprint drafts.", category: "Drive" }
  ];

  // Upcoming Horizon (Next 48h - 7 Days)
  const upcomingHorizon = [
    { date: "Tomorrow", title: "Flight to Tokyo (SQ 012 — 10:45 AM)", category: "Travel", detail: "Chauffeur pick-up confirmed for 07:45 AM." },
    { date: "Thursday", title: "Q3 Board of Directors Deck Sign-Off", category: "Milestone", detail: "Final governance slides review before board distribution." },
    { date: "Friday", title: "Weekly Retainer & Drive Audit Sign-Off", category: "Operations", detail: "Weekly operational health check." },
    { date: "Next Monday", title: "Global Operations Quarterly Kickoff", category: "Strategy", detail: "Agenda draft sent to all department leads." }
  ];

  const handleOpenQuestion = (id: string) => {
    setQuestionApprovalId(id);
    setQuestionText('');
    setQuestionModalOpen(true);
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionApprovalId && questionText.trim() && onAskQuestion) {
      onAskQuestion(questionApprovalId, questionText.trim());
      setQuestionModalOpen(false);
      setQuestionApprovalId(null);
      setQuestionText('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TODAY'S EXECUTIVE BRIEFING HERO: What matters today */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-stone-900 via-[#18191D] to-stone-950 text-white p-7 sm:p-10 shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5 max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold backdrop-blur-md border border-white/10 uppercase tracking-wider">
                Daily Executive Briefing
              </span>
              <span className="text-xs text-stone-300 font-medium">
                {todayDateStr}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Prepared by {userFullName} ({userTitle})</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Good morning, {client.primaryContact.split(' ')[0]}. Here’s what matters today.
            </h2>
          </div>

          {/* Rapid Decision Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Needs Attention</span>
              <span className="text-xl font-bold text-amber-300 block mt-0.5">
                {pendingApprovals.length > 0 ? `${pendingApprovals.length} Decision${pendingApprovals.length > 1 ? 's' : ''}` : 'Zero Blockers'}
              </span>
              <span className="text-[11px] text-stone-400">
                {pendingApprovals.length > 0 ? 'Sign-off unblocks today' : 'All workflows green'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Critical Schedule</span>
              <span className="text-xl font-bold text-white block mt-0.5">{scheduleItems.length} Commitments</span>
              <span className="text-[11px] text-stone-400">First meeting at 09:00 AM</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">EA Unburdened</span>
              <span className="text-xl font-bold text-emerald-400 block mt-0.5">{eaHandledItems.length} Handled</span>
              <span className="text-[11px] text-stone-400">Proactive actions logged</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Upcoming Travel</span>
              <span className="text-xl font-bold text-blue-300 block mt-0.5">Tomorrow (Tokyo)</span>
              <span className="text-[11px] text-stone-400">SQ 012 • 10:45 AM</span>
            </div>
          </div>

          {/* One Concise EA Note */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">
                Executive Note from your EA:
              </h4>
              <p className="text-xs text-stone-200 leading-relaxed mt-0.5">
                "All morning meetings have their briefing packs synchronized in Google Drive. I will be in the background of your 2 PM legal advisory session to capture action items. Have a productive day!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. YOUR ATTENTION: Items requiring decision or input */}
      {pendingApprovals.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-[28px] p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-700" />
              <h3 className="text-base font-bold text-amber-950">
                Your Attention Required ({pendingApprovals.length})
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-200/70 px-3 py-1 rounded-full">
              Decision Queue
            </span>
          </div>

          <div className="space-y-3">
            {pendingApprovals.map(approval => (
              <div 
                key={approval.id} 
                className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 uppercase">
                      {approval.type}
                    </span>
                    <h4 className="text-sm font-bold text-[#18191D]">{approval.title}</h4>
                  </div>
                  <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
                    {approval.description}
                  </p>
                  {approval.externalLink && (
                    <a 
                      href={approval.externalLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline pt-1"
                    >
                      <span>Review Attachment / Document</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Direct Decision Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenQuestion(approval.id)}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Ask Question</span>
                  </button>

                  <button
                    onClick={() => onReject && onReject(approval.id)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Request Changes</span>
                  </button>

                  <button
                    onClick={() => onApprove && onApprove(approval.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TODAY'S SCHEDULE & 4. IMPORTANT MATTERS (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Today's Schedule Timeline (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-[28px] border border-[#ECE6DD] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-[#18191D]">
                Today’s Critical Schedule ({scheduleItems.length})
              </h3>
            </div>
            <span className="text-xs text-stone-500 font-medium">{client.timezone}</span>
          </div>

          <div className="space-y-3">
            {scheduleItems.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE6DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-black/20 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      {item.time}
                    </span>
                    <h4 className="text-xs font-bold text-[#18191D]">{item.title}</h4>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    📍 {item.location} • <span className="font-semibold text-stone-700">Prep: {item.prepNote}</span>
                  </p>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shrink-0 ${
                  item.type === 'work' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: EA Handled Behind the Scenes (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-[28px] border border-[#ECE6DD] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-[#18191D]">
                What Your EA Has Handled
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Unburdened
            </span>
          </div>

          <div className="space-y-2.5">
            {eaHandledItems.map(handled => (
              <div key={handled.id} className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {handled.text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. WORK FOCUS & 6. PERSONAL MATTERS (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Work Focus & Active Deliverables */}
        <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-[#ECE6DD] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-[#18191D]">
                Work & Strategic Deliverables in Motion ({activeDeliverables.length})
              </h3>
            </div>
            <span className="text-xs text-stone-500 font-medium">In-flight velocity</span>
          </div>

          <div className="space-y-2.5">
            {activeDeliverables.slice(0, 4).map(task => (
              <div key={task.id} className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#18191D]">{task.title}</h4>
                  <span className="text-[10px] text-stone-500">Target Date: {task.dueDate || 'Ongoing'}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 uppercase">
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Horizon (Next 48h - 7 Days) */}
        <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-[#ECE6DD] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-[#18191D]">
                Upcoming Horizon (48h – 7 Days Ahead)
              </h3>
            </div>
            <span className="text-xs text-stone-500 font-medium">Forward Look</span>
          </div>

          <div className="space-y-2.5">
            {upcomingHorizon.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-200 text-stone-800">
                      {item.date}
                    </span>
                    <h4 className="text-xs font-bold text-[#18191D]">{item.title}</h4>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">{item.detail}</p>
                </div>
                <span className="text-[10px] font-semibold text-stone-400 shrink-0">{item.category}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Question Modal */}
      {questionModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] border border-[#ECE6DD] p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#18191D]">Ask a Question / Request Clarification</h3>
            <p className="text-xs text-stone-500">
              Your question will be sent directly to {userFullName} ({userTitle}).
            </p>
            <form onSubmit={handleSendQuestion} className="space-y-3">
              <textarea
                required
                rows={3}
                value={questionText}
                onChange={e => setQuestionText(e.target.value)}
                placeholder="e.g. Could you confirm if the legal counsel has approved clause 4?"
                className="w-full text-xs p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#18191D] hover:bg-black text-white text-xs font-bold"
                >
                  Send Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
