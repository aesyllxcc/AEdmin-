import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  LayoutDashboard, 
  Globe, 
  CalendarDays, 
  Users, 
  Briefcase, 
  Sparkles, 
  Clock, 
  Wallet, 
  CheckCircle2, 
  BookOpen, 
  BarChart2, 
  Eye, 
  Settings, 
  HelpCircle, 
  Compass, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Search, 
  Keyboard, 
  FileText, 
  Layers, 
  TrendingUp, 
  Check,
  ExternalLink,
  MessageSquare,
  Upload,
  Play
} from 'lucide-react';

interface TourStep {
  id: string;
  moduleName: string;
  category: 'core' | 'ai' | 'finance' | 'client' | 'security';
  categoryLabel: string;
  icon: React.ElementType;
  iconColor: string;
  badgeBg: string;
  route: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: {
    title: string;
    description: string;
    badge?: string;
  }[];
  proTips: string[];
  sampleWorkflow: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'command-center',
    moduleName: 'Command Center',
    category: 'core',
    categoryLabel: 'Mission Control',
    icon: LayoutDashboard,
    iconColor: 'text-[#18191D]',
    badgeBg: 'bg-[#F6D5EE]',
    route: '/',
    title: 'Executive Radar & Daily Command Station',
    subtitle: 'High-level operational overview, morning briefing, and real-time metric tracking.',
    description: 'The Command Center is your executive starting point each morning. It synthesizes urgent priorities, client revenue metrics, active time tracking, and risk radars into a unified cockpit.',
    highlights: [
      {
        title: 'Morning Executive Briefing',
        description: 'Auto-synthesizes today’s top 3 high-impact deliverables, impending deadlines, and risk items.',
        badge: 'Priority AI'
      },
      {
        title: 'Live Quick Action Menu',
        description: 'Press Cmd+K or click Quick Actions anywhere to add tasks, log time, or draft invoices instantly.',
        badge: 'Cmd + K'
      },
      {
        title: 'Client Financial Pulse',
        description: 'Track monthly retainer burn, billable hour utilization, and revenue health across all client accounts.',
        badge: 'Real-Time'
      },
      {
        title: 'Active Task Stream',
        description: 'Instant overview of tasks due today with direct completion checkboxes and priority flags.',
        badge: 'Actionable'
      }
    ],
    proTips: [
      'Check the Actionable Notifications bell in the top right to triage decision approvals and critical escalations.',
      'Use the live floating timer at the bottom of the screen to track continuous executive work across tabs.'
    ],
    sampleWorkflow: 'Start your morning by reading the Executive Briefing, check pending approvals, and launch the Live Timer before beginning client work.'
  },
  {
    id: 'global-times',
    moduleName: 'Global Times & Operations',
    category: 'core',
    categoryLabel: 'Cross-Border Ops',
    icon: Globe,
    iconColor: 'text-sky-600',
    badgeBg: 'bg-sky-100',
    route: '/global-times',
    title: 'Cross-Border Timezone Intelligence & Overlap Matrix',
    subtitle: 'Coordinate meetings across global timezones without scheduling mistakes or waking clients.',
    description: 'Designed specifically for global Executive Assistants and Operations Managers managing founders and teams across Manila, San Francisco, London, Sydney, Singapore, Tokyo, and New York.',
    highlights: [
      {
        title: 'Live Worldwide Clocks',
        description: 'Synchronized real-time cards showing current time, day status (morning/working/night), and timezone offset.',
        badge: 'Live UTC'
      },
      {
        title: 'Interactive Overlap Matrix',
        description: 'Visual 24-hour heat map showing the golden hours when both you and your client are in working hours.',
        badge: 'Golden Hours'
      },
      {
        title: 'Client Travel Mode',
        description: 'Toggle travel mode for clients on business trips to automatically adapt meeting scheduler offsets.',
        badge: 'Travel Adaptive'
      },
      {
        title: 'Holiday Tracking Vault',
        description: 'Keep track of US, UK, PH, and global public holidays to avoid scheduling deliverables on bank holidays.',
        badge: 'Holidays'
      }
    ],
    proTips: [
      'Green slots in the Overlap Matrix indicate optimal overlap (both parties in active 9 AM - 6 PM working windows).',
      'Add client travel schedules under Travel Mode to have their active timezone temporarily update on your radar.'
    ],
    sampleWorkflow: 'Before sending a calendar invitation, open Global Times, inspect the golden overlap window, and verify no regional bank holidays.'
  },
  {
    id: 'workday',
    moduleName: 'Schedule & Workday Planner',
    category: 'core',
    categoryLabel: 'Daily Execution',
    icon: CalendarDays,
    iconColor: 'text-amber-600',
    badgeBg: 'bg-amber-100',
    route: '/workday',
    title: 'Time-Blocked Agenda & Three-Phase Executive Routines',
    subtitle: 'Master your calendar with structured opening, midday, and EOD routines.',
    description: 'Workday structures your day into focused time blocks and provides systematic executive checklists to guarantee zero dropped balls.',
    highlights: [
      {
        title: '3-Phase Executive Checklist',
        description: 'Opening Routine (email triage & calendar review), Midday Check-in, and End-of-Day (EOD) wrap-up.',
        badge: 'Structured'
      },
      {
        title: 'Client-Specific Routines',
        description: 'Custom daily check-ins per client (e.g., Slack monitoring, inbox zero, daily standup prep).',
        badge: 'Client Scoped'
      },
      {
        title: 'Interactive Time Blocking',
        description: 'Visual daily time-block grid aligning tasks with designated focus and deep-work hours.',
        badge: 'Focus Blocks'
      }
    ],
    proTips: [
      'Complete the Opening Routine before 9:00 AM to align on client priorities and inbox triage.',
      'Check off client-specific routine tasks to build an audit trail of daily operational rigor.'
    ],
    sampleWorkflow: 'Follow the 3-phase checklist from morning triage to midday syncs, culminating in an EOD executive summary.'
  },
  {
    id: 'clients',
    moduleName: 'Clients & CRM Dossiers',
    category: 'client',
    categoryLabel: 'Client Relationship',
    icon: Users,
    iconColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-100',
    route: '/clients',
    title: 'Executive Client Profiles, Retainers & Dossiers',
    subtitle: 'Holistic client CRM tracking retainers, communication preferences, and contracts.',
    description: 'Manage comprehensive client records including contract types, billing models, primary stakeholders, confidential intelligence notes, and retainer hour burn.',
    highlights: [
      {
        title: 'Comprehensive Dossiers',
        description: 'Detailed intelligence tabs: Executive Profile, Communication Style, Timezone, and Strategic Goals.',
        badge: 'Intelligence'
      },
      {
        title: 'Retainer & Utilization Tracker',
        description: 'Live burn rate meter tracking contracted hours vs. actual logged time for the current billing cycle.',
        badge: 'Retainer Health'
      },
      {
        title: 'Client Documents & Contracts',
        description: 'Store NDAs, Master Service Agreements (MSAs), rate cards, and client-specific onboarding playbooks.',
        badge: 'Vault'
      },
      {
        title: 'Relationship Health Indicator',
        description: 'Track client health (Exceptional, Healthy, Needs Attention) to proactively mitigate churn risks.',
        badge: 'Health Score'
      }
    ],
    proTips: [
      'Click on any client card to open their full dossier with integrated project lists, time logs, and invoices.',
      'Generate a secure Client Portal share link to give your client a real-time branded window into their deliverables.'
    ],
    sampleWorkflow: 'Add new clients with their retainer terms, define communication preferences, and monitor monthly hours utilized.'
  },
  {
    id: 'operations',
    moduleName: 'Operations & Task Hub',
    category: 'core',
    categoryLabel: 'Project Management',
    icon: Briefcase,
    iconColor: 'text-indigo-600',
    badgeBg: 'bg-indigo-100',
    route: '/operations',
    title: 'Deliverable Workflows, Kanban & Milestone Tracking',
    subtitle: 'Orchestrate tasks across projects with dual Kanban and high-density table views.',
    description: 'The operations nerve center for all deliverables. Filter by client, project, priority, and completion status with instant inline updates.',
    highlights: [
      {
        title: 'Dual Views: Kanban & List',
        description: 'Switch seamlessly between drag-and-drop Kanban columns (To Do, In Progress, Review, Completed) and tabular list view.',
        badge: 'Dual View'
      },
      {
        title: 'Billable vs. Non-Billable Tagging',
        description: 'Every task can be marked as billable or internal to keep accurate records for invoicing.',
        badge: 'Accurate Billing'
      },
      {
        title: 'Project Milestone Hierarchy',
        description: 'Group tasks under parent projects with visual completion progress bars and deadline indicators.',
        badge: 'Projects'
      },
      {
        title: 'Deliverable Review Attachment',
        description: 'Attach Google Drive or external deliverable links directly to tasks for one-click review.',
        badge: 'Artifact Link'
      }
    ],
    proTips: [
      'Use the search bar at the top or in the header to filter tasks across any client or keyword.',
      'Set tasks to "In Review" when waiting for client approval to automatically populate the Approvals Hub.'
    ],
    sampleWorkflow: 'Create tasks with milestone deadlines, assign them to client projects, track time against them, and submit deliverables for review.'
  },
  {
    id: 'smart-write',
    moduleName: 'AESmart Write (AI Executive Composer)',
    category: 'ai',
    categoryLabel: 'AI Executive Studio',
    icon: Sparkles,
    iconColor: 'text-fuchsia-600',
    badgeBg: 'bg-fuchsia-100',
    route: '/smart-write',
    title: 'High-Impact Executive Communications & Tone Matching',
    subtitle: 'Generate board memos, client briefing emails, meeting agendas, and crisis communications.',
    description: 'AESmart Write is your AI-powered executive communications partner. It produces polished, context-rich writing matching elite C-suite tones in seconds.',
    highlights: [
      {
        title: 'Executive Tone Engine',
        description: 'Select from tones: Authoritative & Decisive, Diplomatic & Courteous, Concise & Bulleted, or Warm & Professional.',
        badge: 'Tone Selector'
      },
      {
        title: 'Ready-to-Use Template Library',
        description: 'Pre-built templates for Board Summaries, Project Kickoffs, Scope Change Notices, Meeting Follow-ups, and Rate Increases.',
        badge: 'Templates'
      },
      {
        title: 'Custom Template Builder',
        description: 'Create and save your own reusable prompt templates with custom input variables and default tone presets.',
        badge: 'Custom Prompts'
      },
      {
        title: 'Saved Drafts Vault & Copy',
        description: 'All generated compositions are stored in a dedicated draft archive with one-click markdown copy.',
        badge: 'Draft Vault'
      }
    ],
    proTips: [
      'Select a Client in the template runner to automatically inject their company name, stakeholder names, and context.',
      'Use the "Refine" action to adjust tone, shorten paragraphs, or format into bullet points for quick Slack or email delivery.'
    ],
    sampleWorkflow: 'Choose a template (e.g. Weekly Status Briefing), fill in key bullet points, pick your tone, and generate a client-ready communication.'
  },
  {
    id: 'time',
    moduleName: 'Real-Time Time Tracking',
    category: 'finance',
    categoryLabel: 'Effort & Timesheets',
    icon: Clock,
    iconColor: 'text-violet-600',
    badgeBg: 'bg-violet-100',
    route: '/time',
    title: 'Precision Time Logging, Active Timers & Timesheets',
    subtitle: 'Capture every billable minute with seamless live stopwatch and manual entry.',
    description: 'Eliminate lost revenue and under-billing. The time tracking module captures continuous session records with detailed task descriptions.',
    highlights: [
      {
        title: 'Global Floating Live Timer',
        description: 'Always accessible at the bottom of the screen. Start, pause, resume, and stop as you switch tasks.',
        badge: 'Global Widget'
      },
      {
        title: 'Comprehensive Timesheet Logs',
        description: 'Filter entries by date range, client, project, or billable status with total duration calculations.',
        badge: 'Timesheets'
      },
      {
        title: 'Direct Invoice Integration',
        description: 'Logged billable hours automatically feed into invoice generators and client retainer meters.',
        badge: 'Auto-Billing'
      },
      {
        title: 'Manual & Retroactive Entry',
        description: 'Quickly log historical work sessions with precise date, time, and client attribution.',
        badge: 'Quick Log'
      }
    ],
    proTips: [
      'You can update the notes on your active live timer at any time without stopping the clock.',
      'Mark internal operations as non-billable to accurately assess your executive productivity ratio.'
    ],
    sampleWorkflow: 'Click Start Timer when beginning a deliverable, add notes as you work, and click Stop to automatically record the entry.'
  },
  {
    id: 'finance',
    moduleName: 'Billing, Invoices & Retainers',
    category: 'finance',
    categoryLabel: 'Revenue & Retainers',
    icon: Wallet,
    iconColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-100',
    route: '/finance',
    title: 'Automated Invoicing, Retainer Reconciliation & P&L',
    subtitle: 'Generate professional invoices, reconcile monthly retainers, and track revenue health.',
    description: 'Complete financial management for executive retainers, hourly overages, project milestone billing, and contractor expenses.',
    highlights: [
      {
        title: 'One-Click Invoice Generator',
        description: 'Create branded invoices with auto-calculated line items, tax rates, payment terms, and PDF export.',
        badge: 'PDF Ready'
      },
      {
        title: 'Retainer Reconciliation & Periods',
        description: 'Audit monthly hour allocations, rollover balances, and overage billing calculations.',
        badge: 'Rollover Audit'
      },
      {
        title: 'Payment & Expense Tracking',
        description: 'Record incoming client payments and log subcontractor or software expenses for net margin analytics.',
        badge: 'P&L Tracking'
      },
      {
        title: 'Rate Card Calculator',
        description: 'Interactive rate calculator to compute hourly, retainer, and project pricing based on target revenue.',
        badge: 'Rate Tool'
      }
    ],
    proTips: [
      'When creating an invoice for a retainer client, select their unbilled hours to populate line items automatically.',
      'Download clean PDF invoices with your executive insignia and banking instructions.'
    ],
    sampleWorkflow: 'At month-end, review client retainer hour balances, generate overage/monthly invoices, and record payments upon receipt.'
  },
  {
    id: 'approvals',
    moduleName: 'Deliverables & Executive Approvals',
    category: 'core',
    categoryLabel: 'Governance & Sign-Offs',
    icon: CheckCircle2,
    iconColor: 'text-rose-600',
    badgeBg: 'bg-rose-100',
    route: '/approvals',
    title: 'Client Sign-Off Protocol & Immutable Audit Trail',
    subtitle: 'Manage formal deliverable submissions, revisions, and approval deadlines.',
    description: 'Ensure complete accountability with formal sign-off tracking, target decision dates, SLA countdowns, and linked Google Drive review artifacts.',
    highlights: [
      {
        title: 'Dual Views: Table & Kanban',
        description: 'Inspect sign-offs across Pending Review, Needs Revision, Approved, and Rejected stages.',
        badge: 'Governance'
      },
      {
        title: 'Ownership & SLA Attribution',
        description: 'Explicit tracking of Submitter vs. Assigned Client Approver with target decision dates and remaining-time badges.',
        badge: 'SLA Tracking'
      },
      {
        title: 'Deliverable Inspector Drawer',
        description: 'Side drawer with full context, lead recommendation, attached Google Drive URL, and revision history.',
        badge: 'Inspector'
      },
      {
        title: 'Immutable Audit History',
        description: 'Complete record of every approval decision, client feedback comment, and timestamped status change.',
        badge: 'Audit Trail'
      }
    ],
    proTips: [
      'Attach clear Google Drive preview URLs so clients can inspect documents directly inside their portal.',
      'Add specific Lead Recommendations to guide fast C-level approvals without unnecessary back-and-forth.'
    ],
    sampleWorkflow: 'Submit a finished deliverable for approval, set a decision deadline, share the link with the client, and log their formal sign-off.'
  },
  {
    id: 'knowledge',
    moduleName: 'Knowledge Base & SOP Vault',
    category: 'core',
    categoryLabel: 'Operating Manuals',
    icon: BookOpen,
    iconColor: 'text-blue-600',
    badgeBg: 'bg-blue-100',
    route: '/knowledge',
    title: 'Standard Operating Procedures & Client Playbooks',
    subtitle: 'Centralized repository of SOPs, tech stack guides, and executive playbooks.',
    description: 'Eliminate institutional knowledge loss. Document executive procedures, client onboarding steps, software setup guides, and best practices.',
    highlights: [
      {
        title: 'Categorized SOP Manuals',
        description: 'Organize by Operations, Tech Stack & Tools, Client Management, Finance, and Executive Playbooks.',
        badge: 'Categorized'
      },
      {
        title: 'Instant Search & Tags',
        description: 'Quickly find how-to procedures for specific software tools (e.g. Notion, Stripe, Google Workspace, Slack).',
        badge: 'Fast Search'
      },
      {
        title: 'Rich Markdown Formatting',
        description: 'Clean formatted steps, code blocks, checklists, and one-click copyable workflows.',
        badge: 'Markdown'
      }
    ],
    proTips: [
      'Document repetitive client requests as SOPs so team members or assistants can execute them flawlessly.',
      'Tag documents with tool names (e.g. #Asana, #QuickBooks) for lightning-fast retrieval.'
    ],
    sampleWorkflow: 'When refining a client process, draft an SOP in Knowledge Base, tag the category, and share it with your team.'
  },
  {
    id: 'reports',
    moduleName: 'Statistics & Executive Reports',
    category: 'core',
    categoryLabel: 'Analytics & Intelligence',
    icon: BarChart2,
    iconColor: 'text-cyan-600',
    badgeBg: 'bg-cyan-100',
    route: '/reports',
    title: 'Operational Intelligence & Productivity Insights',
    subtitle: 'Visual data charts for revenue trends, client utilization, and task completion velocity.',
    description: 'Transform your daily operational data into actionable executive insights. Review billable ratios, revenue trends, and client profitability.',
    highlights: [
      {
        title: 'Revenue & Retainer Trends',
        description: 'Monthly and quarterly revenue trajectories comparing retainer fees vs. hourly overages.',
        badge: 'Financial Health'
      },
      {
        title: 'Client Time Allocation Pie',
        description: 'Visual breakdown of where your hours are spent across different client accounts.',
        badge: 'Utilization'
      },
      {
        title: 'Task Completion Velocity',
        description: 'Track throughput and efficiency metrics across weekly sprint cycles.',
        badge: 'Velocity'
      },
      {
        title: 'Exportable Executive Summaries',
        description: 'Download executive summary reports for quarterly business reviews and client updates.',
        badge: 'Reports'
      }
    ],
    proTips: [
      'Analyze your billable-to-non-billable ratio to identify opportunities to automate administrative tasks.',
      'Use client utilization charts during quarterly reviews to support retainer tier upgrades.'
    ],
    sampleWorkflow: 'Review weekly analytics on Friday afternoon to verify retainer hour health and evaluate operational throughput.'
  },
  {
    id: 'portal',
    moduleName: 'Client Portal & Live Sharing',
    category: 'client',
    categoryLabel: 'Client Experience',
    icon: Eye,
    iconColor: 'text-teal-600',
    badgeBg: 'bg-teal-100',
    route: '/portal',
    title: 'Branded Client Portal & Tokenized Live Sharing',
    subtitle: 'Give clients a live, transparent window into their deliverables, hours, and approvals.',
    description: 'Elevate your client experience with a standalone, mobile-responsive portal where clients can view live progress, approve deliverables, inspect hours, and access invoices without logging in.',
    highlights: [
      {
        title: 'Standalone Public Portal Link',
        description: 'Generate secure tokenized links (`/portal/:token`) that clients can bookmark and access anytime.',
        badge: 'Token Security'
      },
      {
        title: 'Real-Time Deliverable Approvals',
        description: 'Clients can review attached Google Drive artifacts and click "Approve" or "Request Revision" with instant feedback.',
        badge: 'Self-Serve Sign-Off'
      },
      {
        title: 'Retainer & Timesheet Transparency',
        description: 'Clients can see their utilized vs. remaining hours with itemized task session breakdowns.',
        badge: 'Transparency'
      },
      {
        title: 'Invoices & Knowledge Documents',
        description: 'Direct download access to client invoices and shared onboarding documents.',
        badge: 'Direct Download'
      }
    ],
    proTips: [
      'Use the "Preview Portal" in the sidebar to simulate exactly what your client sees in their portal.',
      'Copy the public link from the Client Dossier or Portal page to include in your weekly client update email.'
    ],
    sampleWorkflow: 'Generate a client portal link, share it with your client, and let them sign off on deliverables in real time.'
  },
  {
    id: 'settings',
    moduleName: 'Executive Settings & Security RBAC',
    category: 'security',
    categoryLabel: 'Identity & Governance',
    icon: ShieldCheck,
    iconColor: 'text-stone-800',
    badgeBg: 'bg-stone-200',
    route: '/settings',
    title: 'Custom Insignia, Career Vault & Multi-User Governance',
    subtitle: 'Manage your executive profile, upload custom portraits, store CVs, and configure RBAC roles.',
    description: 'Complete administrative control over your identity, branding, team permissions, timezone preferences, and full JSON data backup/restore.',
    highlights: [
      {
        title: 'Custom Photo & Insignia Uploader',
        description: 'Upload high-resolution executive portraits and brand logos (supporting files up to 100MB) with drag-and-drop.',
        badge: '100MB Upload'
      },
      {
        title: 'Resume, CV & Portfolio Vault',
        description: 'Manage Executive Resumes, Full CVs, Notion/Drive portfolio showcases, and certification credentials.',
        badge: 'Career Vault'
      },
      {
        title: 'Role-Based Access Control (RBAC)',
        description: 'Manage team access levels: Super Admin/Owner, Executive Assistant, Operations Manager, Contractor, and Read-Only.',
        badge: 'Multi-User RBAC'
      },
      {
        title: 'Full Backup Export & Restore',
        description: 'One-click JSON export to download your entire operational database and restore at any time.',
        badge: 'Zero Data Loss'
      }
    ],
    proTips: [
      'Your uploaded portrait and title automatically brand generated invoices, client portals, and header profiles.',
      'Regularly download a JSON backup from the Data Management section to keep your offline archives up to date.'
    ],
    sampleWorkflow: 'Upload your executive portrait, add your resume and portfolio links, and invite team members with tailored RBAC roles.'
  }
];

export function AppTourModal() {
  const { isTourOpen, setIsTourOpen, tourActiveStep, setTourActiveStep } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'guided' | 'directory' | 'shortcuts'>('guided');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'core' | 'ai' | 'finance' | 'client' | 'security'>('all');

  // Handle keyboard navigation for the guided tour
  useEffect(() => {
    if (!isTourOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsTourOpen(false);
      } else if (activeTab === 'guided') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          handleNextStep();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          handlePrevStep();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourOpen, tourActiveStep, activeTab]);

  if (!isTourOpen) return null;

  const currentStep = TOUR_STEPS[tourActiveStep] || TOUR_STEPS[0];
  const StepIcon = currentStep.icon;

  const handleNextStep = () => {
    if (tourActiveStep < TOUR_STEPS.length - 1) {
      setTourActiveStep(tourActiveStep + 1);
    } else {
      setTourActiveStep(0);
    }
  };

  const handlePrevStep = () => {
    if (tourActiveStep > 0) {
      setTourActiveStep(tourActiveStep - 1);
    } else {
      setTourActiveStep(TOUR_STEPS.length - 1);
    }
  };

  const handleNavigateToRoute = (route: string) => {
    setIsTourOpen(false);
    navigate(route);
  };

  // Filtered feature list for Directory tab
  const filteredFeatures = TOUR_STEPS.filter(step => {
    const matchesCategory = categoryFilter === 'all' || step.category === categoryFilter;
    const matchesSearch = searchQuery.trim() === '' || 
      step.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.highlights.some(h => h.title.toLowerCase().includes(searchQuery.toLowerCase()) || h.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Card Frame */}
      <div className="w-full max-w-4xl max-h-[92vh] bg-[#FAF8F5] text-[#18191D] rounded-[32px] shadow-2xl border border-[#ECE6DD] flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Header Strip */}
        <div className="p-5 sm:p-6 pb-4 bg-[#121316] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F6D5EE] text-[#121316] flex items-center justify-center font-bold shrink-0 shadow-sm">
              <HelpCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#F6D5EE]">AEDMIN OS GUIDE</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-medium">v2.4 Interactive</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                App Tour & Feature Directory
              </h2>
            </div>
          </div>

          {/* Navigation Mode Tabs & Close */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('guided')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'guided' 
                    ? 'bg-[#F6D5EE] text-[#121316] shadow-xs' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Guided Tour</span>
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('directory')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'directory' 
                    ? 'bg-[#F6D5EE] text-[#121316] shadow-xs' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Features ({TOUR_STEPS.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('shortcuts')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'shortcuts' 
                    ? 'bg-[#F6D5EE] text-[#121316] shadow-xs' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Shortcuts</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsTourOpen(false)}
              aria-label="Close Tour Modal"
              className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Depends on active tab */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-7">
          
          {/* TAB 1: GUIDED STEP-BY-STEP TOUR */}
          {activeTab === 'guided' && (
            <div className="space-y-6">
              
              {/* Progress Stepper Pills */}
              <div className="bg-white border border-[#ECE6DD] rounded-2xl p-2.5 shadow-2xs">
                <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 custom-scrollbar">
                  {TOUR_STEPS.map((step, idx) => {
                    const isCurrent = idx === tourActiveStep;
                    const isPassed = idx < tourActiveStep;
                    const Icon = step.icon;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setTourActiveStep(idx)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                          isCurrent 
                            ? 'bg-[#121316] text-white shadow-xs scale-102' 
                            : isPassed 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100' 
                              : 'bg-[#FAF8F5] text-[#6D717C] hover:bg-stone-100'
                        }`}
                        title={step.moduleName}
                      >
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          isCurrent ? 'bg-[#F6D5EE] text-[#121316]' : isPassed ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                        }`}>
                          {isPassed ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : idx + 1}
                        </span>
                        <span className="truncate max-w-[110px]">{step.moduleName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Step Feature Showcase Card */}
              <div className="bg-white border border-[#ECE6DD] rounded-[28px] p-6 sm:p-8 shadow-xs relative overflow-hidden">
                
                {/* Top Badge Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-12 h-12 rounded-2xl ${currentStep.badgeBg} flex items-center justify-center shrink-0 shadow-2xs`}>
                      <StepIcon className={`w-6 h-6 ${currentStep.iconColor}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D717C]">
                          Step {tourActiveStep + 1} of {TOUR_STEPS.length} • {currentStep.categoryLabel}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-semibold">
                          {currentStep.route}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#18191D]">
                        {currentStep.moduleName}
                      </h3>
                    </div>
                  </div>

                  {/* Direct Launch Button */}
                  <button
                    type="button"
                    onClick={() => handleNavigateToRoute(currentStep.route)}
                    className="px-4 py-2 bg-[#121316] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-xs active:scale-95 group"
                  >
                    <span>Go to {currentStep.moduleName}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Subtitle & Description */}
                <p className="text-sm font-semibold text-stone-800 mb-1">
                  {currentStep.subtitle}
                </p>
                <p className="text-xs leading-relaxed text-[#6D717C] mb-6">
                  {currentStep.description}
                </p>

                {/* Grid of Key Highlights */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#18191D] mb-3 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Core Features & Capabilities</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentStep.highlights.map((highlight, hIdx) => (
                      <div 
                        key={hIdx} 
                        className="p-3.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-2xl flex flex-col justify-between hover:border-black/20 transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-[#18191D]">{highlight.title}</span>
                            {highlight.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white border border-[#ECE6DD] text-stone-700">
                                {highlight.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] leading-relaxed text-[#6D717C]">
                            {highlight.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Tips & Workflow Banner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-[#ECE6DD]">
                  
                  {/* Pro Tips */}
                  <div className="p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-2xl">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Executive Pro Tip</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-amber-950/80 list-disc list-inside">
                      {currentStep.proTips.map((tip, tIdx) => (
                        <li key={tIdx} className="leading-snug">{tip}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Sample Workflow */}
                  <div className="p-3.5 bg-sky-50/60 border border-sky-200/70 rounded-2xl">
                    <div className="flex items-center gap-2 text-sky-900 font-bold text-xs mb-1.5">
                      <Play className="w-3.5 h-3.5 text-sky-600" />
                      <span>Recommended Workflow</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-sky-950/80">
                      {currentStep.sampleWorkflow}
                    </p>
                  </div>

                </div>

              </div>

              {/* Bottom Step Control Navigation */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 bg-white border border-[#ECE6DD] hover:bg-stone-100 rounded-2xl text-xs font-bold text-[#18191D] flex items-center gap-2 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {TOUR_STEPS.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTourActiveStep(idx)}
                      aria-label={`Jump to step ${idx + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        idx === tourActiveStep 
                          ? 'w-6 bg-[#121316]' 
                          : idx < tourActiveStep 
                            ? 'w-2 bg-emerald-500' 
                            : 'w-2 bg-stone-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {tourActiveStep === TOUR_STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setIsTourOpen(false)}
                      className="px-5 py-2.5 bg-[#F6D5EE] hover:bg-[#F2BCE5] text-[#121316] rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Complete Tour</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-5 py-2.5 bg-[#121316] hover:bg-black text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
                    >
                      <span>Next Module</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ALL FEATURES DIRECTORY */}
          {activeTab === 'directory' && (
            <div className="space-y-5">
              
              {/* Search & Category Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-[#8E929E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by keyword, tool, module (e.g. 'Invoices', 'Retainers', 'AI', 'Timezones')..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#ECE6DD] rounded-2xl text-xs font-semibold text-[#18191D] placeholder:text-[#8E929E] focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 custom-scrollbar">
                  {[
                    { id: 'all', label: 'All (13)' },
                    { id: 'core', label: 'Core Ops' },
                    { id: 'ai', label: 'AI Studio' },
                    { id: 'finance', label: 'Finance' },
                    { id: 'client', label: 'Clients' },
                    { id: 'security', label: 'Security' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryFilter(cat.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                        categoryFilter === cat.id
                          ? 'bg-[#121316] text-white shadow-xs'
                          : 'bg-white border border-[#ECE6DD] text-[#6D717C] hover:bg-stone-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFeatures.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.id}
                      className="bg-white border border-[#ECE6DD] hover:border-black/30 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${step.badgeBg} flex items-center justify-center shrink-0`}>
                              <Icon className={`w-5 h-5 ${step.iconColor}`} />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E929E]">
                                {step.categoryLabel}
                              </span>
                              <h4 className="text-sm font-bold text-[#18191D] group-hover:text-black">
                                {step.moduleName}
                              </h4>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-semibold">
                            {step.route}
                          </span>
                        </div>

                        <p className="text-xs text-[#6D717C] leading-relaxed mb-4">
                          {step.description}
                        </p>

                        <div className="space-y-1.5 mb-4">
                          {step.highlights.slice(0, 2).map((h, hIdx) => (
                            <div key={hIdx} className="flex items-center gap-2 text-[11px] text-stone-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="font-semibold">{h.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#ECE6DD]">
                        <button
                          type="button"
                          onClick={() => {
                            const foundIdx = TOUR_STEPS.findIndex(s => s.id === step.id);
                            if (foundIdx !== -1) {
                              setTourActiveStep(foundIdx);
                              setActiveTab('guided');
                            }
                          }}
                          className="text-xs font-bold text-stone-600 hover:text-black flex items-center gap-1"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>View Step Walkthrough</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleNavigateToRoute(step.route)}
                          className="px-3.5 py-1.5 bg-[#121316] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <span>Open Page</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredFeatures.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#ECE6DD]">
                  <Search className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-stone-700">No matching features found</p>
                  <p className="text-xs text-stone-500 mt-1">Try clearing your search query or filter.</p>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: SHORTCUTS & PRO WORKFLOWS */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-6">
              
              {/* Keyboard Shortcuts Table */}
              <div className="bg-white border border-[#ECE6DD] rounded-2xl p-6 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#18191D] mb-4 flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-[#18191D]" />
                  <span>Essential Keyboard Shortcuts</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'Cmd + K / Ctrl + K', action: 'Open Global Quick Action Menu (Add tasks, log time, invoices)' },
                    { key: 'Esc', action: 'Close any active modal, inspector drawer, or tour overlay' },
                    { key: 'Arrow Left / Right', action: 'Navigate previous / next module inside Guided Tour' },
                    { key: 'Enter', action: 'Submit search queries in header or trigger active forms' }
                  ].map((sc, scIdx) => (
                    <div key={scIdx} className="p-3 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl flex items-center justify-between gap-3">
                      <span className="text-xs text-[#6D717C]">{sc.action}</span>
                      <kbd className="px-2.5 py-1 bg-white border border-[#ECE6DD] rounded-lg text-xs font-mono font-bold text-[#18191D] shadow-2xs shrink-0">
                        {sc.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>

              {/* Power User Operational Workflows */}
              <div className="bg-white border border-[#ECE6DD] rounded-2xl p-6 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#18191D] mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Executive Assistant Daily Playbook</span>
                </h4>

                <div className="space-y-3">
                  {[
                    {
                      step: '1. Morning Sync (08:30 - 09:00)',
                      desc: 'Open Command Center. Read the AI Executive Briefing. Check Global Times for cross-border client timezones. Complete Opening Routines in Schedule.'
                    },
                    {
                      step: '2. Deep Work Execution (09:00 - 12:30)',
                      desc: 'Click Start Timer on the persistent bar. Open Operations for deliverables. Use AESmart Write for board memos and client communications.'
                    },
                    {
                      step: '3. Midday Governance (12:30 - 13:30)',
                      desc: 'Review Approvals Hub. Submit finished deliverables with Google Drive links. Verify SLA decision deadlines and check client feedback.'
                    },
                    {
                      step: '4. EOD Wrap-up & Retainer Check (17:00 - 17:30)',
                      desc: 'Stop active timers. Complete the EOD Routine checklist. Review client hour burn in CRM. Send weekly status summaries via AESmart Write.'
                    }
                  ].map((wf, wfIdx) => (
                    <div key={wfIdx} className="p-3.5 bg-[#FAF8F5] border border-[#ECE6DD] rounded-xl">
                      <p className="text-xs font-bold text-[#18191D] mb-1">{wf.step}</p>
                      <p className="text-xs text-[#6D717C] leading-relaxed">{wf.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#ECE6DD] flex items-center justify-between text-xs text-[#8E929E] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Aedmin Executive OS • Fully Interactive</span>
          </div>
          <button
            type="button"
            onClick={() => setIsTourOpen(false)}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>

    </div>
  );
}
