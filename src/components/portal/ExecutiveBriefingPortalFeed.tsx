import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  Sparkles, 
  Calendar, 
  Briefcase, 
  Heart, 
  DollarSign, 
  ArrowRight, 
  ExternalLink, 
  MessageSquare, 
  ChevronRight, 
  ChevronDown,
  X,
  Layers, 
  Target, 
  TrendingUp, 
  CheckCheck, 
  FileText, 
  Flame, 
  HelpCircle,
  Eye,
  Info,
  MapPin,
  Coffee,
  Filter,
  Users,
  Folder,
  Bell,
  CheckSquare,
  Lock,
  Send
} from 'lucide-react';
import { 
  Client, 
  ExecutiveBriefingSnapshot, 
  Invoice, 
  Project,
  ApprovalItem
} from '@/types';
import deskStillLife from '@/assets/images/desk_still_life_1788423682933.jpg';

interface ExecutiveBriefingPortalFeedProps {
  client: Client;
  briefing: ExecutiveBriefingSnapshot;
  invoices?: Invoice[];
  projects?: Project[];
  isPreviewMode?: boolean;
  onApproveDecision?: (decisionId: string) => void;
  onRequestDecisionChange?: (decisionId: string, notes: string) => void;
  onToggleOnboardingTask?: (phaseId: number, taskId: string) => void;
  onOpenMessageModal?: () => void;
}

export const ExecutiveBriefingPortalFeed: React.FC<ExecutiveBriefingPortalFeedProps> = ({
  client,
  briefing,
  invoices = [],
  projects = [],
  isPreviewMode = false,
  onApproveDecision,
  onRequestDecisionChange,
  onToggleOnboardingTask,
  onOpenMessageModal
}) => {
  // 1. Time Horizon State (Today, Tomorrow, This Week, This Month)
  const [selectedHorizon, setSelectedHorizon] = useState<'today' | 'tomorrow' | 'week' | 'month'>(
    briefing.perspective || 'today'
  );
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  // 2. Interactive Modals / Drawers for Bottom Stacked Cards & Drill-downs
  const [activeModal, setActiveModal] = useState<
    'projects' | 'retainer' | 'invoices' | 'onboarding' | 'attention' | 'schedule' | 'calendar' | null
  >(null);

  // 3. Attention Action State
  const [selectedAttentionItem, setSelectedAttentionItem] = useState<any | null>(null);
  const [clarificationText, setClarificationText] = useState('');
  const [completedActions, setCompletedActions] = useState<Record<string, 'approved' | 'rejected'>>({});
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // 4. Local onboarding task completion state
  const [localCompletedTasks, setLocalCompletedTasks] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    (client.onboardingPhases || []).forEach(phase => {
      (phase.items || []).forEach(item => {
        if (item.completed) initial[item.id] = true;
      });
    });
    return initial;
  });

  const toggleTask = (phaseId: number, taskId: string) => {
    setLocalCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
    if (onToggleOnboardingTask) {
      onToggleOnboardingTask(phaseId, taskId);
    }
  };

  // Metrics calculation
  const purchased = client.purchasedHours || 100;
  const used = client.usedHoursThisMonth || 62;
  const remaining = Math.max(0, purchased - used);
  const utilizationPct = purchased > 0 ? Math.min(100, Math.round((used / purchased) * 100)) : 62;

  // Open invoices
  const clientInvoices = invoices.filter(i => i.clientId === client.id);
  const openInvoices = clientInvoices.filter(i => i.status === 'sent' || i.status === 'overdue');
  const openInvoiceCount = openInvoices.length > 0 ? openInvoices.length : 1;
  const openInvoiceAmount = openInvoices.length > 0 
    ? openInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
    : 1250;

  // Active Projects
  const clientProjects = projects.filter(p => p.clientId === client.id && p.status === 'active');
  const activeProjectsCount = clientProjects.length > 0 ? clientProjects.length : 3;

  // Date labels
  const dateOptions = [
    { id: 'today' as const, label: 'May 15, 2024', shortLabel: 'Today' },
    { id: 'tomorrow' as const, label: 'May 16, 2024', shortLabel: 'Tomorrow' },
    { id: 'week' as const, label: 'May 13 – 19, 2024', shortLabel: 'This Week' },
    { id: 'month' as const, label: 'May 2024', shortLabel: 'This Month' },
  ];

  const currentDateLabel = dateOptions.find(d => d.id === selectedHorizon)?.label || 'May 15, 2024';

  // Horizon Data Engine
  const horizonData = useMemo(() => {
    if (selectedHorizon === 'tomorrow') {
      return {
        dateLabel: 'May 16, 2024',
        greetingName: client.primaryContact || 'Dr. Olivia',
        upcomingMeetingsCount: 3,
        attentionItems: [
          { id: 'att-tm-1', title: 'Confirm Tokyo Hotel Concierge Transfer', dueLabel: 'Due Tomorrow', dueType: 'urgent', detail: 'Chauffeur pickup protocol and luggage dispatch at Haneda Terminal 2.' },
          { id: 'att-tm-2', title: 'Sign Off on Q3 Vendor Retainer Allocation', dueLabel: 'Due Tomorrow', dueType: 'normal', detail: 'Locks in senior DevOps resource allocation for upcoming launch.' },
          { id: 'att-tm-3', title: 'Review Board Committee Resolutions', dueLabel: 'May 20', dueType: 'normal', detail: 'Governance packet ready for digital review in Drive.' }
        ],
        handledItems: [
          { id: 'h-1', title: 'Confirmed Tokyo flight seats & private lounge access' },
          { id: 'h-2', title: 'Audited international roaming & banking travel notices' },
          { id: 'h-3', title: 'Dispatched meeting agendas to Japan team' },
          { id: 'h-4', title: 'Processed contractor milestone wire transfers' }
        ],
        nextUpItems: [
          { id: 'nu-1', title: 'Flight SQ 012 Departure (Seat 1A)', dateBadge: 'May 16' },
          { id: 'nu-2', title: 'Tokyo Engineering Leadership Touchpoint', dateBadge: 'May 17' },
          { id: 'nu-3', title: 'Board Meeting Prep Sync', dateBadge: 'May 20' }
        ],
        timelineItems: [
          { id: 'tl-1', time: '07:45 AM', title: 'Private Chauffeur Airport Transfer', isPersonal: true },
          { id: 'tl-2', time: '11:15 AM', title: 'Flight SQ 012 to Tokyo (Transit)', isPersonal: false },
          { id: 'tl-3', time: '04:45 PM', title: 'Virtual Engineering Leadership Touchpoint', isPersonal: false },
          { id: 'tl-4', time: '08:30 PM', title: 'Dinner: Ginza Kojyu (Reservation Confirmed)', isPersonal: true }
        ],
        eaNote: "All travel and transit details for Tokyo are locked in. Luggage tag protocols and mobile boarding passes are synced in your Drive folder."
      };
    }

    if (selectedHorizon === 'week') {
      return {
        dateLabel: 'May 13 – 19, 2024',
        greetingName: client.primaryContact || 'Dr. Olivia',
        upcomingMeetingsCount: 8,
        attentionItems: [
          { id: 'att-wk-1', title: 'Approve Q2 Marketing Budget', dueLabel: 'Due Today', dueType: 'urgent', detail: 'Review revised contractor rate card and media spend allocation.' },
          { id: 'att-wk-2', title: 'Review Landing Page Design', dueLabel: 'Due Tomorrow', dueType: 'normal', detail: 'Final visual sign-off for brand relaunch sprint.' },
          { id: 'att-wk-3', title: 'Confirm Board Meeting Attendance', dueLabel: 'May 20', dueType: 'normal', detail: 'RSVP required for dinner seating and quorum.' }
        ],
        handledItems: [
          { id: 'h-1', title: 'Triaged 142 inbox emails and cleared 8 calendar conflicts' },
          { id: 'h-2', title: 'Reconciled 14 vendor software invoices' },
          { id: 'h-3', title: 'Updated master Q2 roadmap timeline' },
          { id: 'h-4', title: 'Organized executive travel arrangements' }
        ],
        nextUpItems: [
          { id: 'nu-1', title: 'Board Meeting', dateBadge: 'May 20' },
          { id: 'nu-2', title: 'Retainer Renewal', dateBadge: 'Jun 1' },
          { id: 'nu-3', title: 'Quarterly Review', dateBadge: 'Jun 5' }
        ],
        timelineItems: [
          { id: 'tl-1', time: '08:00 AM', title: 'Weekly Executive Leadership Standup', isPersonal: false },
          { id: 'tl-2', time: '10:00 AM', title: 'Partner & Investor Strategy Sync', isPersonal: false },
          { id: 'tl-3', time: '01:00 PM', title: 'Board Meeting Preparation', isPersonal: false },
          { id: 'tl-4', time: '05:30 PM', title: 'Equinox Personal Training & Mobility', isPersonal: true }
        ],
        eaNote: "We have strong momentum heading into the mid-quarter milestones. Focus this week is protecting your morning deep work blocks and finalizing the board materials."
      };
    }

    if (selectedHorizon === 'month') {
      return {
        dateLabel: 'May 2024',
        greetingName: client.primaryContact || 'Dr. Olivia',
        upcomingMeetingsCount: 14,
        attentionItems: [
          { id: 'att-mo-1', title: 'Q3 Retainer Scope Renewal Agreement', dueLabel: 'Due May 25', dueType: 'normal', detail: 'Early renewal guarantees priority allocation and senior rate lock.' },
          { id: 'att-mo-2', title: 'Annual Corporate Compliance Filings', dueLabel: 'Due May 28', dueType: 'normal', detail: 'State registration and franchise disclosures ready for digital signature.' }
        ],
        handledItems: [
          { id: 'h-1', title: 'Reclaimed 48+ hours of executive focus time' },
          { id: 'h-2', title: 'Negotiated 15% discount across SaaS subscriptions' },
          { id: 'h-3', title: 'Streamlined client intake pipeline in CRM' },
          { id: 'h-4', title: 'Managed international flight and hotel logistics' }
        ],
        nextUpItems: [
          { id: 'nu-1', title: 'Board Meeting', dateBadge: 'May 20' },
          { id: 'nu-2', title: 'Retainer Renewal', dateBadge: 'Jun 1' },
          { id: 'nu-3', title: 'Quarterly Review', dateBadge: 'Jun 5' }
        ],
        timelineItems: [
          { id: 'tl-1', time: 'Week 1', title: 'Tokyo Operational Tour & Engagements', isPersonal: false },
          { id: 'tl-2', time: 'Week 2', title: 'Board Governance & Legal Review', isPersonal: false },
          { id: 'tl-3', time: 'Week 3', title: 'Investor Roadshow & Milestone Check', isPersonal: false },
          { id: 'tl-4', time: 'Week 4', title: 'Q2 Strategic Planning & Retainer Audit', isPersonal: false }
        ],
        eaNote: "May is progressing ahead of targets. We have cleared all administrative roadblocks, protected 48 hours of uninterrupted deep work, and are on track for Q2 goals."
      };
    }

    // Default: 'today' (Matches image exactly)
    return {
      dateLabel: 'May 15, 2024',
      greetingName: client.primaryContact || 'Dr. Olivia',
      upcomingMeetingsCount: 2,
      attentionItems: [
        { id: 'att-1', title: 'Approve Q2 Marketing Budget', dueLabel: 'Due Today', dueType: 'urgent', detail: 'Final sign-off on the $18,500 digital acquisition budget and creator partnerships.' },
        { id: 'att-2', title: 'Review Landing Page Design', dueLabel: 'Due Tomorrow', dueType: 'normal', detail: 'Figma mockups and responsive wireframes updated for new client portal.' },
        { id: 'att-3', title: 'Confirm Board Meeting Attendance', dueLabel: 'May 20', dueType: 'normal', detail: 'In-person quorum confirmation and dinner dietary RSVP.' }
      ],
      handledItems: [
        { id: 'h-1', title: 'Scheduled 4 meetings' },
        { id: 'h-2', title: 'Submitted vendor payments' },
        { id: 'h-3', title: 'Updated project timeline' },
        { id: 'h-4', title: 'Organized travel arrangements' }
      ],
      nextUpItems: [
        { id: 'nu-1', title: 'Board Meeting', dateBadge: 'May 20' },
        { id: 'nu-2', title: 'Retainer Renewal', dateBadge: 'Jun 1' },
        { id: 'nu-3', title: 'Quarterly Review', dateBadge: 'Jun 5' }
      ],
      timelineItems: [
        { id: 'tl-1', time: '08:00 AM', title: 'Team Daily Huddle', isPersonal: false },
        { id: 'tl-2', time: '10:00 AM', title: 'Patient Case Review', isPersonal: false },
        { id: 'tl-3', time: '01:00 PM', title: 'Board Meeting Preparation', isPersonal: false },
        { id: 'tl-4', time: '04:00 PM', title: 'Strategy Call with Marketing Team', isPersonal: false }
      ],
      eaNote: "Everything is moving forward smoothly. The team is on track and we're making great progress on the Q2 goals."
    };
  }, [selectedHorizon, client.primaryContact]);

  const handleApproveAttention = (id: string, title: string) => {
    setCompletedActions(prev => ({ ...prev, [id]: 'approved' }));
    setActionFeedback(`Approved: ${title}`);
    if (onApproveDecision) onApproveDecision(id);
    setTimeout(() => setActionFeedback(null), 3500);
    setSelectedAttentionItem(null);
  };

  const handleSendClarification = (id: string, title: string) => {
    if (!clarificationText.trim()) return;
    setCompletedActions(prev => ({ ...prev, [id]: 'rejected' }));
    setActionFeedback(`Notes submitted to EA for: ${title}`);
    if (onRequestDecisionChange) onRequestDecisionChange(id, clarificationText);
    setClarificationText('');
    setTimeout(() => setActionFeedback(null), 3500);
    setSelectedAttentionItem(null);
  };

  // Dot calculation for 10-dot indicator (6 filled, 4 empty in screenshot)
  const totalDots = 10;
  const filledDots = 6; // Representing 62% in screenshot

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-stone-900 font-sans antialiased animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {actionFeedback && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-stone-900 text-white shadow-xl flex items-center gap-3 animate-in slide-in-from-top-3 duration-200">
          <CheckCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{actionFeedback}</span>
        </div>
      )}

      {/* Preview Mode Badge (if in preview mode) */}
      {isPreviewMode && (
        <div className="p-3.5 rounded-2xl bg-white/90 border border-stone-200/80 shadow-xs flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <Eye className="w-4 h-4 text-blue-600" />
            <span>Client Perspective Live Preview — Showing exact view as Dr. Olivia experiences it.</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-bold">
            Live View
          </span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. TOP CARD: EXECUTIVE BRIEFING GREETING & STILL LIFE */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-[32px] bg-white border border-[#ECE6DE] shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        
        {/* Left Content */}
        <div className="space-y-4 max-w-lg z-10">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2.5">
              <span>Good morning, {horizonData.greetingName}</span>
              <span className="text-amber-500 select-none">☀️</span>
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Here's your executive briefing for <span className="font-bold text-stone-900">{horizonData.dateLabel}</span>.
            </p>
            <p className="text-stone-400 font-medium text-xs sm:text-sm">
              Everything you need to know in under a minute.
            </p>
          </div>
        </div>

        {/* Right Header Controls & Desk Still Life Illustration */}
        <div className="flex flex-col items-end gap-3 z-10">
          
          {/* Interactive Date Horizon Dropdown Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFEB] border border-[#ECE6DE] text-stone-800 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-stone-600" />
              <span>{currentDateLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {isDateDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-stone-200 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Select Time Horizon
                </div>
                {dateOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedHorizon(opt.id);
                      setIsDateDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      selectedHorizon === opt.id
                        ? 'bg-[#FAF7F2] text-stone-900 font-bold'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="text-[10px] text-stone-400">{opt.shortLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Minimalist 3D Still Life Artwork */}
          <div className="relative w-44 h-32 sm:w-52 sm:h-36 flex items-end justify-end pointer-events-none select-none">
            <img 
              src={deskStillLife} 
              alt="Executive desk still life" 
              className="w-full h-full object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. SNAPSHOT ROW (4 PASTEL CARDS) */}
      {/* ============================================================ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Snapshot
          </h2>
          <button
            type="button"
            onClick={() => setActiveModal('retainer')}
            className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1 group cursor-pointer transition-all"
          >
            <span>View all summary</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Retainer Usage (Soft Yellow) */}
          <div 
            onClick={() => setActiveModal('retainer')}
            className="p-5 rounded-[24px] bg-[#FEF8E7] border border-[#FCEBC4] shadow-[0_2px_12px_rgba(254,248,231,0.5)] flex flex-col justify-between h-44 cursor-pointer hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-amber-200/70 text-amber-900 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-stone-800">Retainer Usage</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-stone-900">62</span>
                <span className="text-stone-600 font-medium text-sm">/ 100 hrs</span>
              </div>
            </div>

            <div className="space-y-2">
              {/* Dot Track (10 dots: 6 filled, 4 light) */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalDots }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i < filledDots ? 'bg-stone-800' : 'bg-amber-300/70'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] font-semibold text-stone-600">
                38 hrs remaining
              </p>
            </div>
          </div>

          {/* Card 2: Active Projects (Soft Pink / Rose) */}
          <div 
            onClick={() => setActiveModal('projects')}
            className="p-5 rounded-[24px] bg-[#FDF0F2] border border-[#FAD9DE] shadow-[0_2px_12px_rgba(253,240,242,0.5)] flex flex-col justify-between h-44 cursor-pointer hover:shadow-md transition-all group relative overflow-hidden"
          >
            {/* Background Folder Watermark */}
            <div className="absolute -bottom-3 -right-3 text-rose-300/40 pointer-events-none select-none">
              <Folder className="w-24 h-24 stroke-[1.2]" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-rose-200/70 text-rose-900 flex items-center justify-center">
                  <Folder className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-stone-800">Active Projects</span>
              </div>
              <div className="text-3xl font-extrabold text-stone-900">
                {activeProjectsCount}
              </div>
            </div>

            <div className="z-10">
              <p className="text-[11px] font-semibold text-stone-600">
                2 on track
              </p>
            </div>
          </div>

          {/* Card 3: Open Invoices (Soft Sage Green) */}
          <div 
            onClick={() => setActiveModal('invoices')}
            className="p-5 rounded-[24px] bg-[#F2F7E8] border border-[#DFEDC7] shadow-[0_2px_12px_rgba(242,247,232,0.5)] flex flex-col justify-between h-44 cursor-pointer hover:shadow-md transition-all group relative overflow-hidden"
          >
            {/* Background Dollar Sign Watermark */}
            <div className="absolute -bottom-4 -right-1 text-emerald-300/40 pointer-events-none select-none">
              <DollarSign className="w-24 h-24 stroke-[1.2]" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-200/70 text-emerald-900 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-stone-800">Open Invoices</span>
              </div>
              <div className="text-3xl font-extrabold text-stone-900">
                {openInvoiceCount}
              </div>
            </div>

            <div className="z-10">
              <p className="text-[11px] font-semibold text-stone-600">
                ${openInvoiceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Card 4: Upcoming Meetings (Soft Lavender / Lilac) */}
          <div 
            onClick={() => setActiveModal('schedule')}
            className="p-5 rounded-[24px] bg-[#F4EFFB] border border-[#E6DAF5] shadow-[0_2px_12px_rgba(244,239,251,0.5)] flex flex-col justify-between h-44 cursor-pointer hover:shadow-md transition-all group relative overflow-hidden"
          >
            {/* Background Star / Sparkle Watermark */}
            <div className="absolute -bottom-3 -right-3 text-purple-300/40 pointer-events-none select-none">
              <Sparkles className="w-24 h-24 stroke-[1.2]" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-purple-200/70 text-purple-900 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-stone-800">Upcoming Meetings</span>
              </div>
              <div className="text-3xl font-extrabold text-stone-900">
                {horizonData.upcomingMeetingsCount}
              </div>
            </div>

            <div className="z-10">
              <p className="text-[11px] font-semibold text-stone-600">
                Today
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. YOUR ATTENTION CARD */}
      {/* ============================================================ */}
      <div className="p-6 sm:p-7 rounded-[28px] bg-white border border-[#ECE6DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Your Attention</h3>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal('attention')}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 group cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="divide-y divide-stone-100">
          {horizonData.attentionItems.map((item) => {
            const isDone = completedActions[item.id] === 'approved';
            const isAsked = completedActions[item.id] === 'rejected';

            return (
              <div 
                key={item.id}
                onClick={() => setSelectedAttentionItem(item)}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-stone-50/70 px-2 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    isDone ? 'bg-emerald-500' : 'bg-rose-400'
                  }`} />
                  <span className={`text-xs sm:text-sm font-semibold transition-all ${
                    isDone ? 'line-through text-stone-400' : 'text-stone-900 group-hover:text-black'
                  }`}>
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isDone ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Approved
                    </span>
                  ) : isAsked ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                      Notes Sent
                    </span>
                  ) : (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.dueType === 'urgent'
                        ? 'bg-[#FDE8EB] text-[#C53048]'
                        : 'bg-[#F3EFEB] text-[#635E59]'
                    }`}>
                      {item.dueLabel}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. TWO-COLUMN MIDDLE ROW: HANDLED BY YOUR EA | NEXT UP */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Handled by Your EA */}
        <div className="p-6 sm:p-7 rounded-[28px] bg-white border border-[#ECE6DE] shadow-xs relative overflow-hidden flex flex-col justify-between space-y-5">
          {/* Subtle Sage Clipboard Watermark */}
          <div className="absolute -bottom-6 -right-4 text-emerald-400/20 pointer-events-none select-none">
            <CheckCircle2 className="w-40 h-40 stroke-[0.8]" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Handled by Your EA</h3>
            </div>

            <div className="space-y-3.5 z-10 relative">
              {horizonData.handledItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-stone-800">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Next Up */}
        <div className="p-6 sm:p-7 rounded-[28px] bg-white border border-[#ECE6DE] shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Next Up</h3>
            </div>

            <div className="divide-y divide-stone-100">
              {horizonData.nextUpItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-800">
                  <span>{item.title}</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#F3ECFB] text-[#7E57C2] text-xs font-semibold">
                    {item.dateBadge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setActiveModal('calendar')}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 group cursor-pointer"
            >
              <span>View full calendar</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 5. TWO-COLUMN LOWER ROW: TODAY'S TIMELINE | EA NOTE */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left (7 cols): Today's Timeline */}
        <div className="md:col-span-7 p-6 sm:p-7 rounded-[28px] bg-white border border-[#ECE6DE] shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Today's Timeline</h3>
            </div>

            <div className="space-y-2.5">
              {horizonData.timelineItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition-all"
                >
                  <span className="text-xs font-medium text-stone-500 w-16 shrink-0">
                    {item.time}
                  </span>

                  <div className="w-2 h-2 rounded-full bg-rose-400 ring-4 ring-rose-50 shrink-0" />

                  <div className="flex-1 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#ECE6DE]/70 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-stone-900 truncate">
                      {item.title}
                    </span>
                    {item.isPersonal && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 shrink-0">
                        Personal & Lifestyle
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setActiveModal('schedule')}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 group cursor-pointer"
            >
              <span>View full schedule</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Right (5 cols): EA Note */}
        <div className="md:col-span-5 p-6 sm:p-7 rounded-[28px] bg-[#FDF1F3] border border-[#F9D7DD] shadow-xs relative overflow-hidden flex flex-col justify-between space-y-6">
          {/* Decorative Giant Quotation Mark */}
          <div className="absolute top-3 right-5 text-rose-200/90 text-7xl font-serif select-none pointer-events-none">
            “
          </div>

          <div className="space-y-3 z-10">
            <h3 className="text-base font-bold text-stone-900">EA Note</h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
              {horizonData.eaNote}
            </p>
          </div>

          <div className="z-10 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-600">
              — Your EA
            </span>
            {onOpenMessageModal && (
              <button
                type="button"
                onClick={onOpenMessageModal}
                className="px-3 py-1 rounded-full bg-white text-stone-800 text-xs font-bold shadow-2xs hover:bg-stone-50 cursor-pointer transition-all"
              >
                Reply
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 6. BOTTOM STACKED NAVIGATION ROWS (PROJECTS, RETAINER, ETC.) */}
      {/* ============================================================ */}
      <div className="space-y-3 pt-2">
        
        {/* Row 1: Projects */}
        <div
          onClick={() => setActiveModal('projects')}
          className="p-4 rounded-2xl bg-white border border-[#ECE6DE] hover:border-stone-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#FEF6E9] text-amber-800 flex items-center justify-center">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">Projects</h4>
              <p className="text-[11px] text-stone-500">See all active projects and progress</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* Row 2: Retainer Details */}
        <div
          onClick={() => setActiveModal('retainer')}
          className="p-4 rounded-2xl bg-white border border-[#ECE6DE] hover:border-stone-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#F2F7E8] text-emerald-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">Retainer Details</h4>
              <p className="text-[11px] text-stone-500">More details about your retainer and hours</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* Row 3: Invoices & Payments */}
        <div
          onClick={() => setActiveModal('invoices')}
          className="p-4 rounded-2xl bg-white border border-[#ECE6DE] hover:border-stone-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#FDF0F2] text-rose-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">Invoices & Payments</h4>
              <p className="text-[11px] text-stone-500">View invoices, payments and transaction history</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* Row 4: Onboarding Progress */}
        <div
          onClick={() => setActiveModal('onboarding')}
          className="p-4 rounded-2xl bg-white border border-[#ECE6DE] hover:border-stone-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#F4EFFB] text-purple-800 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">Onboarding Progress</h4>
              <p className="text-[11px] text-stone-500">Track your onboarding checklist and progress</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-transform group-hover:translate-x-0.5" />
        </div>

      </div>

      {/* ============================================================ */}
      {/* 7. FOOTER CONFIDENTIALITY */}
      {/* ============================================================ */}
      <div className="pt-6 pb-4 flex items-center justify-center gap-2 text-stone-400 text-xs font-medium">
        <Lock className="w-3.5 h-3.5" />
        <span>Your information is secure and confidential.</span>
      </div>

      {/* ============================================================ */}
      {/* MODAL / DRAWER: ATTENTION ITEM ACTION */}
      {/* ============================================================ */}
      {selectedAttentionItem && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-[28px] border border-stone-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                  {selectedAttentionItem.dueLabel}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  {selectedAttentionItem.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedAttentionItem(null)}
                className="text-stone-400 hover:text-stone-700 font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {selectedAttentionItem.detail}
            </p>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-stone-700 block">
                Have questions or revision notes?
              </label>
              <textarea
                value={clarificationText}
                onChange={e => setClarificationText(e.target.value)}
                placeholder="Type your notes or feedback here..."
                rows={3}
                className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-stone-900"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => handleSendClarification(selectedAttentionItem.id, selectedAttentionItem.title)}
                disabled={!clarificationText.trim()}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Send Notes to EA
              </button>

              <button
                type="button"
                onClick={() => handleApproveAttention(selectedAttentionItem.id, selectedAttentionItem.title)}
                className="px-5 py-2 bg-stone-900 hover:bg-black text-white rounded-full text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Approve Decision</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: PROJECTS */}
      {/* ============================================================ */}
      {activeModal === 'projects' && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-[28px] border border-stone-200 max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FEF6E9] text-amber-800 flex items-center justify-center">
                  <Folder className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Active Strategic Projects</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {(clientProjects.length > 0 ? clientProjects : [
                { id: 'p1', name: 'Q2 Digital Brand Relaunch & Portal', status: 'active', progress: 85, budgetHours: 35, usedHours: 28 },
                { id: 'p2', name: 'LP & Investor Relations Data Room Setup', status: 'active', progress: 92, budgetHours: 20, usedHours: 18 },
                { id: 'p3', name: 'Annual Executive Operations Audit & SOP Vault', status: 'active', progress: 65, budgetHours: 15, usedHours: 10 }
              ]).map((proj: any) => (
                <div key={proj.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">{proj.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      On Track
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-stone-900 h-1.5 rounded-full" style={{ width: `${proj.progress || 80}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>Progress: {proj.progress || 80}%</span>
                    <span>{proj.usedHours || 20} of {proj.budgetHours || 30} hrs utilized</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: RETAINER DETAILS */}
      {/* ============================================================ */}
      {activeModal === 'retainer' && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-[28px] border border-stone-200 max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FEF8E7] text-amber-800 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Retainer Allocation & Hours Audit</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                <span className="text-[10px] font-bold text-stone-500 uppercase">Monthly Capacity</span>
                <p className="text-xl font-extrabold text-stone-900 mt-0.5">{purchased}h</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 uppercase">Utilized</span>
                <p className="text-xl font-extrabold text-stone-900 mt-0.5">{used}h</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Remaining</span>
                <p className="text-xl font-extrabold text-emerald-900 mt-0.5">{remaining}h</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FEF8E7] border border-[#FCEBC4] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                <span>Retainer Utilization</span>
                <span>{utilizationPct}%</span>
              </div>
              <div className="w-full bg-amber-200/70 rounded-full h-2 overflow-hidden">
                <div className="bg-stone-900 h-2 rounded-full" style={{ width: `${utilizationPct}%` }} />
              </div>
              <p className="text-[11px] text-stone-600">
                At current burn velocity, hours will comfortably sustain through month-end with 8 rollover buffer hours available.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: INVOICES & PAYMENTS */}
      {/* ============================================================ */}
      {activeModal === 'invoices' && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-[28px] border border-stone-200 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F2F7E8] text-emerald-800 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Invoices & Financial Ledger</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {(clientInvoices.length > 0 ? clientInvoices : [
                { id: 'inv-1', invoiceNumber: 'INV-2024-05', totalAmount: 1250, status: 'sent', issueDate: 'May 01, 2024', dueDate: 'May 15, 2024' },
                { id: 'inv-2', invoiceNumber: 'INV-2024-04', totalAmount: 5500, status: 'paid', issueDate: 'Apr 01, 2024', dueDate: 'Apr 15, 2024' }
              ]).map((inv: any) => (
                <div key={inv.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-900">{inv.invoiceNumber}</span>
                    <p className="text-[10px] text-stone-400">Due: {inv.dueDate || 'May 15, 2024'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-stone-900">${inv.totalAmount?.toLocaleString()}</span>
                    <span className={`block text-[10px] font-bold uppercase ${
                      inv.status === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {inv.status === 'paid' ? 'Paid' : 'Due Today'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ONBOARDING PROGRESS & CHECKLIST */}
      {/* ============================================================ */}
      {activeModal === 'onboarding' && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-[28px] border border-stone-200 max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F4EFFB] text-purple-800 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Onboarding Progress & Checklist</h3>
                  <p className="text-[11px] text-stone-500">Track setup milestones and delegate permissions</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {(client.onboardingPhases || []).map((phase) => (
                <div key={phase.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      Phase {phase.id}: {phase.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      Phase Active
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {(phase.items || []).map((t) => {
                      const isChecked = !!localCompletedTasks[t.id];
                      return (
                        <div
                          key={t.id}
                          onClick={() => toggleTask(phase.id, t.id)}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-stone-200/70 hover:border-stone-300 transition-all cursor-pointer text-xs"
                        >
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                            isChecked ? 'bg-purple-600 border-purple-600 text-white' : 'border-stone-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className={isChecked ? 'line-through text-stone-400' : 'text-stone-800 font-medium'}>
                            {t.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: FULL SCHEDULE */}
      {/* ============================================================ */}
      {(activeModal === 'schedule' || activeModal === 'calendar') && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-[28px] border border-stone-200 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Master Calendar Schedule</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {horizonData.timelineItems.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-stone-900">{item.title}</span>
                    <p className="text-[11px] text-stone-500">{item.time}</p>
                  </div>
                  {item.isPersonal ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      Personal & Lifestyle
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Business
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
