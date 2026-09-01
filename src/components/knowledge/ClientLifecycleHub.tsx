import React, { useState } from "react";
import { 
  Users, 
  Send, 
  FileText, 
  CheckCircle2, 
  UserCheck, 
  LogOut, 
  BookOpen, 
  Database, 
  Search, 
  Plus, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Calendar, 
  DollarSign, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight,
  Filter,
  Layers,
  Heart,
  Briefcase,
  Sliders,
  AlertTriangle,
  Award,
  Trash2,
  Edit,
  Mail,
  Linkedin,
  MessageSquare
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { 
  LeadItem, 
  OutreachTemplateItem, 
  ClientDiscoveryItem, 
  OnboardingItem, 
  ClientSuccessItem, 
  OffboardingItem, 
  ClientIntelligenceExtended 
} from "@/types";

// Initial Mock Datasets for CRM
const initialLeads: LeadItem[] = [
  {
    id: "lead_1",
    name: "Harrison Brooks",
    company: "Apex Horizon Capital",
    role: "Managing Partner",
    email: "harrison@apexhorizon.vc",
    linkedinUrl: "https://linkedin.com/in/harrisonbrooks",
    channel: "LinkedIn",
    status: "call_booked",
    priority: "high",
    score: 94,
    estimatedBudget: 6500,
    outreachSequenceStep: 3,
    outreachSequenceTotal: 4,
    nextFollowUpDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    lastContactDate: "2026-08-25",
    notes: "Ex-Goldman VC partner raising a $75M fund. Overwhelmed with LP meeting logistics and personal flight schedules.",
    tags: ["Venture Capital", "Retainer Target", "High Urgency"]
  },
  {
    id: "lead_2",
    name: "Dr. Elena Rostova",
    company: "Novus Biotherapeutics",
    role: "Founder & Chief Scientific Officer",
    email: "elena.rostova@novusbio.io",
    channel: "Referral",
    status: "followup_1",
    priority: "high",
    score: 88,
    estimatedBudget: 5000,
    outreachSequenceStep: 2,
    outreachSequenceTotal: 4,
    nextFollowUpDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    lastContactDate: "2026-08-23",
    notes: "Referred by Marcus Vance (Arkgate VC). Needs calendar defense and international conference travel coordinator.",
    tags: ["Biotech", "Client Referral", "Executive EA"]
  },
  {
    id: "lead_3",
    name: "Julian Sterling",
    company: "Sterling Luxury Hospitality",
    role: "CEO & Principal",
    email: "j.sterling@sterlinggroup.com",
    channel: "Cold Email",
    status: "outreached",
    priority: "medium",
    score: 72,
    estimatedBudget: 4500,
    outreachSequenceStep: 1,
    outreachSequenceTotal: 4,
    nextFollowUpDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    lastContactDate: "2026-08-26",
    notes: "Dispatched customized High-Growth Founder inbox triage framework.",
    tags: ["Hospitality", "Outreach Sequence"]
  }
];

const initialTemplates: OutreachTemplateItem[] = [
  {
    id: "tpl_1",
    category: "linkedin_dm",
    title: "High-Conviction VC / Partner Cold DM",
    body: `Hi {{firstName}}, noticed you just closed {{recentMilestone}}. 

Most venture partners I work with find that their daily calendar becomes 65% administrative overhead right around this inflection point—LP scheduling, board deck iterations, and travel logistics.

I run a fractional Chief of Staff & Executive Operations studio built exclusively for venture partners and founders. We protect 15-20 hours of deep work weekly.

Would it make sense to send over a 2-minute video on how we defend calendar bandwidth during active fund deployment?

Best,
{{my_name}}`,
    tags: ["LinkedIn", "VC", "Cold Outreach"]
  },
  {
    id: "tpl_2",
    category: "referral_request",
    title: "Active Client Graceful Referral Request",
    body: `Hi {{clientName}},

Now that we've stabilized {{recentWin}} and your weekly schedule is running like clockwork, I wanted to check in with a quick question.

I have capacity to take on exactly one additional executive client next month. Do you have a fellow founder or fund partner in your peer network who is currently feeling overwhelmed by operational drag and could benefit from executive-level support?

If someone comes to mind, I'd be grateful for a warm intro, and I'd love to apply a complimentary 10-hour strategy credit to next month's retainer as a thank you.

Warmly,
{{my_name}}`,
    tags: ["Referral", "Client Retention", "Growth"]
  },
  {
    id: "tpl_3",
    category: "negotiation_script",
    title: "Executive Retainer Objection Handling: 'Hourly vs Retainer'",
    body: `Objection: "Can we start on an hourly ad-hoc basis first?"

Response Script:
"I completely understand wanting flexibility! The reason we structure all partnerships as guaranteed monthly retainers rather than hourly billing is calendar defense. 

On an hourly model, my focus is divided across dozens of tasks with unpredictable response times. On a dedicated retainer, I reserve guaranteed priority bandwidth for your office, handle urgent evening/weekend travel re-bookings, and proactively triage your communications so you never have to ask if I'm available.

Let's begin with our Tier 1 Starter Retainer (25 hours/month) for the first 90 days. If our pacing shows you need more or less, we adjust seamlessly."`,
    tags: ["Negotiation", "Objection Handling", "Pricing Defense"]
  },
  {
    id: "tpl_4",
    category: "proposal_template",
    title: "Fractional Chief of Staff Executive Retainer Proposal",
    body: `EXECUTIVE OPERATIONS PROPOSAL
Prepared for: {{prospectName}}, {{company}}
Scope Tier: Senior Executive Operations & Chief of Staff Retainer (40 Hours / Month)
Monthly Retainer Fee: $5,500 / month (Guaranteed Bandwidth)

CORE DELIVERABLES:
1. Executive Inbox & Calendar Defense (Zero-inbox triage, async gatekeeping)
2. Travel Logistics & High-Touch Itineraries (Door-to-door concierge itineraries)
3. Board & Investor Presentation Decks (Quarterly formatting, doc repository)
4. Vendor & Key Stakeholder Management
5. Weekly Executive Briefing & Friday Recap Dispatches

TERMS:
• Billed 1st of month via ACH / Stripe Autopay.
• 30-day notice for tier adjustments.
• Unused hours do not expire for 60 days.`,
    tags: ["Proposal", "Retainer", "Contracts"]
  },
  {
    id: "tpl_5",
    category: "client_communication",
    title: "Quick Async 60-Second Check-In",
    body: `⚡️ Quick Async 60-Second Update — {{clientName}}
Date: {{todayDate}}

1. Completed Today:
• {{task1}}
• {{task2}}

2. Awaiting Your Greenlight (Takes <30 secs):
• {{approvalItem}} (Review link: {{link}})

3. Tomorrow's Protected Focus:
• {{tomorrowFocus}}

No reply needed unless you have edits!`,
    tags: ["Async Check-in", "Daily Ops", "Slack"]
  }
];

const initialDiscoveries: ClientDiscoveryItem[] = [
  {
    id: "disc_1",
    prospectName: "Harrison Brooks",
    company: "Apex Horizon Capital",
    discoveryDate: "2026-08-28",
    executivePainPoints: "Drowning in 150+ daily emails, double-booked meetings with institutional LPs, missing quarterly board prep milestones.",
    calendarBottlenecks: "No buffer between Zoom calls; personal trainer and spouse anniversary forgotten last month.",
    systemsInUse: "Google Workspace, Superhuman, Notion, Carta, Zoom, Telegram",
    decisionTimeline: "Ready to start September 1st.",
    proposalTier: "Executive Tier (40h/mo)",
    proposalValue: 6500,
    proposalStatus: "sent",
    negotiationNotes: "Client requested 24/7 emergency WhatsApp channel. Added $1,000 surge retainer clause.",
    contractStatus: "ready",
    depositVerified: true,
    stage: "proposal"
  }
];

const initialIntelligenceExtended: ClientIntelligenceExtended[] = [
  {
    id: "intel_1",
    clientId: "cli_1",
    clientName: "Marcus Vance (Arkgate Ventures)",
    executiveProfile: {
      preferredName: "Marcus",
      pronouns: "He/Him",
      timezone: "America/New_York (EST)",
      role: "Managing Partner & Founder",
      communicationPreferences: "Ultra-concise bullet points. Never call without sending a Slack head-up first. Prefers async Loom / Voice notes for complex decks.",
      decisionMakingStyle: "Prefers binary choices (Option A vs Option B with clear trade-offs and cost).",
      morningRoutine: "6:00 AM Peloton workout, 7:30 AM coffee & Wall Street Journal review, 8:30 AM first call.",
      eveningRoutine: "No emails after 7:30 PM except urgent LP wire sign-offs.",
      workingHours: "8:30 AM - 6:00 PM EST Mon-Fri"
    },
    familyAndPersonal: {
      spousePartner: "Sarah Vance (Architect at Studio Studio)",
      children: "Leo (Age 6), Chloe (Age 3)",
      pets: "Barnaby (Golden Retriever)",
      anniversaries: "September 18 (Wedding Anniversary)",
      birthdays: "Marcus: Nov 12, Sarah: March 4, Leo: June 15",
      hobbiesInterests: "Endurance cycling, vintage horology (Rolex / Patek), Japanese Whisky, Formula 1 (Ferrari fan).",
      healthWellnessConsiderations: "Gluten sensitivity (mild). Always requests oat milk flat white.",
      dietaryRestrictions: "Prefers Mediterranean & high-protein.",
      favoriteRestaurants: "Le Bernardin (NYC), Carbone (Miami), Cotogna (San Francisco).",
      favoriteCuisines: "Northern Italian, Japanese Omakase, Farm-to-Table.",
      giftPreferences: "Artisan coffee beans, rare single-origin matcha, curated coffee table design books."
    },
    businessContext: {
      companyName: "Arkgate Ventures LLC",
      industry: "Early-Stage Venture Capital (B2B SaaS & AI)",
      executiveGoals: "Close Fund III ($100M) by Q4 2026; publish 6 thought-leadership essays.",
      primaryVendors: "Gunderson Dettmer (Legal), Frank Rimerman (Audit), Brex, Stripe.",
      teamMembers: [
        { name: "Devon Clark", role: "Principal / Deal Lead", email: "devon@arkgatevc.com", note: "Handles initial founder screening." },
        { name: "Maya Lin", role: "Head of Platform", email: "maya@arkgatevc.com", note: "Coordinates annual LP summit." }
      ],
      socialCircleKeyVIPs: ["Marc Andreessen", "Garry Tan", "Sarah Guo", "Jason Calacanis"],
      coreSoftwareStack: "Google Workspace, Superhuman, Notion, Affinity CRM, Slack, 1Password"
    },
    executiveAssistantNotes: [
      { id: "ean_1", date: "2026-08-20", category: "Critical Rule", note: "Never book a meeting before 9:00 AM without explicit prior Slack approval." },
      { id: "ean_2", date: "2026-08-10", category: "Protocol", note: "When booking flights, always select Window Seat (Row 2-4 First Class on Delta)." },
      { id: "ean_3", date: "2026-07-28", category: "Preference", note: "Prefers Friday afternoons 2:00 PM - 5:00 PM completely blocked for deep thesis writing." }
    ]
  }
];

export function ClientLifecycleHub() {
  const { clients, userProfile } = useApp();

  const [activeModule, setActiveModule] = useState<
    'prospecting' | 'acquisition' | 'onboarding' | 'success' | 'offboarding' | 'templates' | 'intelligence'
  >('prospecting');

  // Leads State
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [leadSearch, setLeadSearch] = useState("");
  const [leadFilter, setLeadFilter] = useState<string>("all");
  const [newLeadModal, setNewLeadModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadCompany, setNewLeadCompany] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadRole, setNewLeadRole] = useState("Managing Director");
  const [newLeadBudget, setNewLeadBudget] = useState(5000);
  const [newLeadPriority, setNewLeadPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>("high");
  const [newLeadScore, setNewLeadScore] = useState(85);
  const [newLeadNotes, setNewLeadNotes] = useState("");

  // Discovery / Acquisition State
  const [discoveries, setDiscoveries] = useState<ClientDiscoveryItem[]>(initialDiscoveries);
  const [selectedDiscovery, setSelectedDiscovery] = useState<ClientDiscoveryItem>(initialDiscoveries[0]);

  // Templates State
  const [templates, setTemplates] = useState<OutreachTemplateItem[]>(initialTemplates);
  const [templateCategory, setTemplateCategory] = useState<string>("all");
  const [templateSearch, setTemplateSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Client Intelligence State
  const [intelligenceList, setIntelligenceList] = useState<ClientIntelligenceExtended[]>(initialIntelligenceExtended);
  const [selectedIntelId, setSelectedIntelId] = useState<string>(initialIntelligenceExtended[0]?.id || '');
  const [intelSearch, setIntelSearch] = useState("");

  // Checklists Interactive State
  const [onboardingChecks, setOnboardingChecks] = useState<{ [key: string]: boolean }>({
    "ob_legal": true,
    "ob_billing": true,
    "ob_discovery": true,
    "ob_passwords": true,
    "ob_workspace": true,
    "ob_slack": true,
    "ob_calendar": true,
    "ob_briefing": true,
    "ob_firstweek": false,
    "ob_day3": false
  });

  const [offboardingChecks, setOffboardingChecks] = useState<{ [key: string]: boolean }>({
    "off_deliverables": true,
    "off_invoice": true,
    "off_handover": true,
    "off_passwords": false,
    "off_testimonial": false,
    "off_referral": false,
    "off_archive": false
  });

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim()) return;

    const newLead: LeadItem = {
      id: `lead_${Date.now()}`,
      name: newLeadName,
      company: newLeadCompany || newLeadName,
      role: newLeadRole,
      email: newLeadEmail,
      channel: "LinkedIn",
      status: "identified",
      priority: newLeadPriority,
      score: Number(newLeadScore),
      estimatedBudget: Number(newLeadBudget),
      outreachSequenceStep: 1,
      outreachSequenceTotal: 4,
      nextFollowUpDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      notes: newLeadNotes,
      tags: ["Prospect", "CRM Added"]
    };

    setLeads([newLead, ...leads]);
    setNewLeadModal(false);
    setNewLeadName("");
    setNewLeadCompany("");
    setNewLeadEmail("");
    setNewLeadNotes("");
  };

  const handleAdvanceLeadStep = (leadId: string) => {
    setLeads(leads.map(l => {
      if (l.id === leadId) {
        const nextStep = Math.min(l.outreachSequenceTotal, l.outreachSequenceStep + 1);
        const nextStatus = nextStep === 2 ? 'followup_1' : nextStep === 3 ? 'followup_2' : 'call_booked';
        return {
          ...l,
          outreachSequenceStep: nextStep,
          status: nextStatus,
          lastContactDate: new Date().toISOString().split('T')[0],
          nextFollowUpDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
        };
      }
      return l;
    }));
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.company.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.notes.toLowerCase().includes(leadSearch.toLowerCase());
    if (leadFilter === 'all') return matchesSearch;
    return matchesSearch && l.status === leadFilter;
  });

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.body.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(templateSearch.toLowerCase()));
    if (templateCategory === 'all') return matchesSearch;
    return matchesSearch && t.category === templateCategory;
  });

  const activeIntel = intelligenceList.find(i => i.id === selectedIntelId) || intelligenceList[0];

  return (
    <div className="bg-white rounded-[32px] border border-border-subtle shadow-sm overflow-hidden space-y-6">
      
      {/* 1. Module Navigation Banner */}
      <div className="p-6 md:p-8 bg-[#FDFBF7] border-b border-border-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-0.5 rounded-full bg-sidebar-bg text-white text-xs font-bold tracking-wide">
              LIFECYCLE HUB & CRM
            </span>
            <span className="text-xs text-text-muted font-semibold">
              Complete Client Journey Architecture: Lead → Active → Retention → Referral
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-main tracking-tight mt-1.5">
            Client Lifecycle & Business Development CRM
          </h2>
          <p className="text-xs md:text-sm text-text-muted mt-1 max-w-3xl">
            Maintain complete operational intelligence, multi-step outreach sequences, onboarding playbooks, and client retention infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNewLeadModal(true)}
            className="px-4 py-2 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Prospect Lead
          </button>
        </div>
      </div>

      {/* 2. Lifecycle Stage Navigation Tabs */}
      <div className="px-6 md:px-8 border-b border-border-subtle overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-2 pb-3 min-w-max">
          {[
            { id: 'prospecting', label: '1. Lead Prospecting & Outreach', icon: Send, badge: `${leads.length} Active` },
            { id: 'acquisition', label: '2. Client Acquisition & Proposals', icon: Briefcase },
            { id: 'onboarding', label: '3. Client Onboarding', icon: UserCheck },
            { id: 'success', label: '4. Client Success & Retention', icon: Heart },
            { id: 'offboarding', label: '5. Offboarding & Referrals', icon: LogOut },
            { id: 'templates', label: '6. Templates Library', icon: BookOpen, badge: `${templates.length} Scripts` },
            { id: 'intelligence', label: '7. Client Intelligence Database', icon: Database }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModule(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isActive 
                    ? 'bg-sidebar-bg text-white shadow-xs' 
                    : 'bg-[#FDFBF7] text-text-muted hover:text-text-main border border-border-subtle/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-card-yellow' : 'text-text-muted'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-text-main'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SUB-MODULE CONTENT PANELS */}
      <div className="p-6 md:p-8 pt-0">
        
        {/* ========================================================================= */}
        {/* MODULE 1: LEAD PROSPECTING & OUTREACH */}
        {/* ========================================================================= */}
        {activeModule === 'prospecting' && (
          <div className="space-y-6">
            
            {/* Filters & Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                {['all', 'identified', 'outreached', 'followup_1', 'followup_2', 'call_booked', 'lost'].map(st => (
                  <button
                    key={st}
                    onClick={() => setLeadFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                      leadFilter === st 
                        ? 'bg-sidebar-bg text-white shadow-xs' 
                        : 'bg-[#FDFBF7] border border-border-subtle text-text-muted hover:text-text-main'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  value={leadSearch ?? ''}
                  onChange={e => setLeadSearch(e.target.value)}
                  placeholder="Search leads, funds, notes..."
                  className="w-full pl-9 pr-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-card-blue"
                />
              </div>
            </div>

            {/* Leads Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLeads.map(lead => (
                <div 
                  key={lead.id}
                  className="p-5 bg-[#FDFBF7] rounded-[24px] border border-border-subtle hover:border-gray-300 transition-all shadow-xs flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        lead.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        Score: {lead.score}/100 • {lead.priority}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted">
                        Target: ${lead.estimatedBudget.toLocaleString()}/mo
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-text-main group-hover:text-card-blue transition-colors">
                      {lead.name}
                    </h4>
                    <p className="text-xs font-semibold text-text-muted">{lead.role} • {lead.company}</p>
                    
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-text-muted">
                      <span className="font-mono">{lead.email}</span>
                      {lead.linkedinUrl && (
                        <a href={lead.linkedinUrl} target="_blank" rel="noreferrer" className="text-card-blue hover:underline flex items-center gap-0.5">
                          <Linkedin className="w-3 h-3" /> Profile
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-text-muted mt-3 bg-white p-3 rounded-xl border border-border-subtle/80 leading-relaxed">
                      {lead.notes}
                    </p>
                  </div>

                  {/* Multi-Step Follow-Up Sequence Tracker */}
                  <div className="space-y-3 pt-3 border-t border-border-subtle">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-muted">Outreach Cadence:</span>
                      <span className="font-bold text-text-main">
                        Step {lead.outreachSequenceStep} of {lead.outreachSequenceTotal} ({lead.status.replace('_', ' ')})
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map(step => (
                        <div 
                          key={step} 
                          className={`h-2 rounded-full transition-all ${
                            step <= lead.outreachSequenceStep ? 'bg-sidebar-bg' : 'bg-gray-200'
                          }`}
                          title={`Step ${step}: ${step === 1 ? 'Initial DM' : step === 2 ? 'Value Follow-up' : step === 3 ? 'Call Proposal' : 'Breakup/Check-in'}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Next Sync: {lead.nextFollowUpDate}
                      </span>
                      <button
                        onClick={() => handleAdvanceLeadStep(lead.id)}
                        className="px-2.5 py-1 bg-white border border-border-subtle hover:bg-gray-50 rounded-lg text-text-main font-semibold text-[10px] flex items-center gap-1 shadow-2xs"
                      >
                        Advance Step <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 2: CLIENT ACQUISITION & PROPOSALS */}
        {/* ========================================================================= */}
        {activeModule === 'acquisition' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Pipeline Conversion Stages */}
            <div className="space-y-4">
              <div className="bg-[#FDFBF7] p-6 rounded-[28px] border border-border-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-text-main">Acquisition Funnel</h3>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Active Deals
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { stage: 'discovery', label: '1. Discovery Call Conducted', count: 1, active: true },
                    { stage: 'proposal', label: '2. Proposal Drafted & Sent', count: 1, active: true },
                    { stage: 'negotiation', label: '3. Negotiation & Rate Defense', count: 1, active: true },
                    { stage: 'contract', label: '4. MSA & NDA Contract Prep', count: 1, active: false },
                    { stage: 'deposit', label: '5. Deposit Verified', count: 1, active: true },
                    { stage: 'active', label: '6. Workspace Activated', count: 1, active: false }
                  ].map(st => (
                    <div key={st.stage} className="p-3 bg-white rounded-xl border border-border-subtle flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-main">{st.label}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${st.active ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-600'}`}>
                        {st.count} Deal
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 2 Cols: Discovery Call & Negotiation Intelligence Console */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#FDFBF7] p-6 md:p-8 rounded-[28px] border border-border-subtle space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      Proposal Stage: {selectedDiscovery.stage.toUpperCase()}
                    </span>
                    <h3 className="text-xl font-bold text-text-main mt-2">
                      {selectedDiscovery.prospectName} — {selectedDiscovery.company}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-text-muted font-medium">Proposed Value:</span>
                    <div className="text-2xl font-black text-text-main">${selectedDiscovery.proposalValue.toLocaleString()}/mo</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-white rounded-2xl border border-border-subtle space-y-1">
                    <span className="font-bold text-text-muted uppercase text-[10px]">Executive Bottlenecks</span>
                    <p className="text-text-main font-medium leading-relaxed">{selectedDiscovery.executivePainPoints}</p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-border-subtle space-y-1">
                    <span className="font-bold text-text-muted uppercase text-[10px]">Calendar Chaos Score</span>
                    <p className="text-text-main font-medium leading-relaxed">{selectedDiscovery.calendarBottlenecks}</p>
                  </div>
                </div>

                {/* Pre-Activation Verification Checklist */}
                <div className="p-5 bg-white rounded-2xl border border-border-subtle space-y-3">
                  <span className="text-xs font-bold text-text-main uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-card-blue" />
                    Deposit & Pre-Activation Security Verification
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-emerald-950">Deposit Verified ($6.5k)</span>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-emerald-950">Executed MSA & NDA</span>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-semibold text-blue-950">1Password Vault Ready</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 3: CLIENT ONBOARDING */}
        {/* ========================================================================= */}
        {activeModule === 'onboarding' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Col: 14-Point Automated Onboarding Checklist */}
              <div className="lg:col-span-2 bg-[#FDFBF7] p-6 md:p-8 rounded-[28px] border border-border-subtle space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                  <div>
                    <h3 className="text-base font-bold text-text-main">Automated Executive Onboarding Checklist</h3>
                    <p className="text-xs text-text-muted">Standard protocol for all incoming retained client workspaces.</p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full font-extrabold">
                    80% Complete
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { id: 'ob_legal', title: '1. Executed Master Services Agreement & Mutual NDA', category: 'Legal & Billing' },
                    { id: 'ob_billing', title: '2. Stripe Retainer Autopay Initialized & 1st Month Settled', category: 'Legal & Billing' },
                    { id: 'ob_discovery', title: '3. Executive Style & Decision Intake Questionnaire Dispatched', category: 'Executive Intake' },
                    { id: 'ob_passwords', title: '4. Shared 1Password / Bitwarden Vault Provisioned', category: 'Access & Vaults' },
                    { id: 'ob_workspace', title: '5. Google Workspace / Outlook Delegate Inbox Access Assigned', category: 'Access & Vaults' },
                    { id: 'ob_slack', title: '6. Private Async Slack / WhatsApp Emergency Channel Configured', category: 'Cadence & Comms' },
                    { id: 'ob_calendar', title: '7. Master Calendar Defense Rules & Color-Coding Applied', category: 'Cadence & Comms' },
                    { id: 'ob_briefing', title: '8. Daily Morning Briefing Template Approved by Executive', category: 'Cadence & Comms' },
                    { id: 'ob_firstweek', title: '9. 7-Day Quick Win Milestone Sprints Completed', category: 'First 7 Days' },
                    { id: 'ob_day3', title: '10. 30-Day Check-in & Retainer Capacity Review Scheduled', category: 'First 7 Days' }
                  ].map(item => {
                    const isChecked = !!onboardingChecks[item.id];
                    return (
                      <div 
                        key={item.id}
                        onClick={() => setOnboardingChecks({ ...onboardingChecks, [item.id]: !isChecked })}
                        className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white border-border-subtle hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className={`text-xs font-medium ${isChecked ? 'line-through text-gray-500 font-normal' : 'text-text-main font-semibold'}`}>
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-border-subtle text-text-muted">
                          {item.category}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Col: Kickoff Meeting Planner & First Week Plan */}
              <div className="space-y-6">
                <div className="bg-[#FDFBF7] p-6 rounded-[28px] border border-border-subtle space-y-4">
                  <h3 className="text-base font-bold text-text-main">Kickoff Meeting Planner</h3>
                  
                  <div className="p-4 bg-white rounded-2xl border border-border-subtle space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-main">30-Min Kickoff Agenda</span>
                      <span className="text-text-muted">Day 1 Protocol</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-text-muted leading-relaxed">
                      <li>00-05m: Alignment on communication preferences</li>
                      <li>05-15m: Review immediate calendar emergencies</li>
                      <li>15-25m: Access credentials & 1Password check</li>
                      <li>25-30m: Sign-off on Friday weekly recap format</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-sidebar-bg text-white rounded-2xl space-y-2 text-xs">
                    <span className="text-card-yellow font-bold uppercase text-[10px]">First-Week Action Plan Generator</span>
                    <p className="text-gray-200 text-xs leading-relaxed">
                      "Day 1: Zero-inbox triage. Day 2: 3-week calendar defense. Day 3: Travel profile created. Day 5: First Weekly Briefing delivered."
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 4: CLIENT SUCCESS & RELATIONSHIP MANAGEMENT */}
        {/* ========================================================================= */}
        {activeModule === 'success' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Quick Async Check-In Generator */}
              <div className="bg-[#FDFBF7] p-6 rounded-[28px] border border-border-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-main">Quick Async Check-In</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded-full">Slack Ready</span>
                </div>
                <p className="text-xs text-text-muted">60-second status update to build trust without unnecessary sync meetings.</p>
                <div className="bg-white p-4 rounded-2xl border border-border-subtle font-mono text-[11px] text-text-main space-y-1.5 leading-relaxed">
                  <p className="font-bold text-card-blue">⚡️ Async Briefing — Marcus</p>
                  <p>✓ LP Meeting links refreshed</p>
                  <p>✓ Delta flight upgraded to 2A</p>
                  <p>⏳ Need 10s review on Q3 Deck</p>
                </div>
                <button 
                  onClick={() => handleCopyText("⚡️ Async Briefing — Marcus\n✓ LP Meeting links refreshed\n✓ Delta flight upgraded to 2A\n⏳ Need 10s review on Q3 Deck", "checkin")}
                  className="w-full py-2 bg-white border border-border-subtle hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  {copiedId === 'checkin' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'checkin' ? 'Copied to Clipboard!' : 'Copy Check-In'}
                </button>
              </div>

              {/* End of Day (EOD) Report Creator */}
              <div className="bg-[#FDFBF7] p-6 rounded-[28px] border border-border-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-main">End-of-Day (EOD) Report</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full">Daily Protocol</span>
                </div>
                <p className="text-xs text-text-muted">Daily evening recap establishing executive calendar defense.</p>
                <div className="bg-white p-4 rounded-2xl border border-border-subtle font-mono text-[11px] text-text-main space-y-1.5 leading-relaxed">
                  <p className="font-bold text-emerald-800">📋 EOD Recap — {new Date().toLocaleDateString()}</p>
                  <p>• Completed: 5 Priority Tasks</p>
                  <p>• Retainer Burn: 3.5h logged today</p>
                  <p>• Tomorrow: 3h deep work protected</p>
                </div>
                <button 
                  onClick={() => handleCopyText("📋 EOD Recap — Today\n• Completed: 5 Priority Tasks\n• Retainer Burn: 3.5h logged today\n• Tomorrow: 3h deep work protected", "eod")}
                  className="w-full py-2 bg-white border border-border-subtle hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  {copiedId === 'eod' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'eod' ? 'Copied to Clipboard!' : 'Copy EOD Recap'}
                </button>
              </div>

              {/* Scope Creep & Retainer Defense Guard */}
              <div className="bg-[#FDFBF7] p-6 rounded-[28px] border border-border-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-main">Scope Creep Defense</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">Retainer Guard</span>
                </div>
                <p className="text-xs text-text-muted">Scripts for redirecting out-of-scope tasks into paid retainer tier upgrades.</p>
                <div className="bg-white p-4 rounded-2xl border border-border-subtle text-xs text-text-muted leading-relaxed">
                  <strong className="text-text-main block mb-1">Upgrade Script:</strong>
                  "Happy to take on the complete website redesign! Since that falls outside our 40h operational retainer, I can add a 15-hour milestone block for $2,250 or bump you to Tier 3."
                </div>
                <button 
                  onClick={() => handleCopyText("Happy to take on the complete website redesign! Since that falls outside our 40h operational retainer, I can add a 15-hour milestone block for $2,250 or bump you to Tier 3.", "scope")}
                  className="w-full py-2 bg-white border border-border-subtle hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  {copiedId === 'scope' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'scope' ? 'Copied Upgrade Script!' : 'Copy Upgrade Script'}
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 5: OFFBOARDING & REFERRALS */}
        {/* ========================================================================= */}
        {activeModule === 'offboarding' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 10-Step Offboarding Checklist */}
            <div className="lg:col-span-2 bg-[#FDFBF7] p-6 md:p-8 rounded-[28px] border border-border-subtle space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div>
                  <h3 className="text-base font-bold text-text-main">Graceful Offboarding & Handover Protocol</h3>
                  <p className="text-xs text-text-muted">Ensure flawless handover, credential revocation, and referral acquisition.</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'off_deliverables', title: '1. Final Milestone Deliverables & Documentation Handover' },
                  { id: 'off_invoice', title: '2. Final Invoice Settled & Retainer Hours Reconciled' },
                  { id: 'off_handover', title: '3. Master SOPs and Knowledge Repository Transferred to In-House Lead' },
                  { id: 'off_passwords', title: '4. 1Password Vault Shared Access Revoked & 2FA Transferred' },
                  { id: 'off_testimonial', title: '5. High-Praise Testimonial Request & LinkedIn Endorsement Dispatched' },
                  { id: 'off_referral', title: '6. Founder Peer Referral Incentive Form Shared' },
                  { id: 'off_archive', title: '7. Workspace Safely Archived in Solopreneur Vault' }
                ].map(item => {
                  const isChecked = !!offboardingChecks[item.id];
                  return (
                    <div 
                      key={item.id}
                      onClick={() => setOffboardingChecks({ ...offboardingChecks, [item.id]: !isChecked })}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white border-border-subtle hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-xs font-medium ${isChecked ? 'line-through text-gray-500 font-normal' : 'text-text-main font-semibold'}`}>
                          {item.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Testimonial & Referral Scripts */}
            <div className="space-y-4">
              <div className="bg-[#FDFBF7] p-6 rounded-[28px] border border-border-subtle space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                  High-Converting Testimonial Script
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  &ldquo;Working with &#123;&#123;my_name&#125;&#125; as my fractional Executive Operations Lead gave me back 15 hours every single week. She handled our board materials, travel, and complex scheduling with absolute discretion.&rdquo;
                </p>
                <button 
                  onClick={() => handleCopyText("Working with Olivia as my fractional Executive Operations Lead gave me back 15 hours every single week. She handled our board materials, travel, and complex scheduling with absolute discretion.", "testimonial")}
                  className="w-full py-2 bg-sidebar-bg text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  {copiedId === 'testimonial' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'testimonial' ? 'Copied Prompt!' : 'Copy Testimonial Prompt'}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 6: KNOWLEDGE & TEMPLATES LIBRARY */}
        {/* ========================================================================= */}
        {activeModule === 'templates' && (
          <div className="space-y-6">
            
            {/* Category Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                {[
                  { id: 'all', label: 'All Templates' },
                  { id: 'linkedin_dm', label: 'LinkedIn DMs' },
                  { id: 'referral_request', label: 'Referral Requests' },
                  { id: 'negotiation_script', label: 'Negotiation Scripts' },
                  { id: 'proposal_template', label: 'Proposals' },
                  { id: 'client_communication', label: 'Client Comms' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setTemplateCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      templateCategory === cat.id 
                        ? 'bg-sidebar-bg text-white shadow-xs' 
                        : 'bg-[#FDFBF7] border border-border-subtle text-text-muted hover:text-text-main'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  value={templateSearch ?? ''}
                  onChange={e => setTemplateSearch(e.target.value)}
                  placeholder="Search templates & scripts..."
                  className="w-full pl-9 pr-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-full text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Templates List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTemplates.map(tpl => (
                <div key={tpl.id} className="p-6 bg-[#FDFBF7] rounded-[24px] border border-border-subtle space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-border-subtle text-text-muted">
                        {tpl.category.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-1">
                        {tpl.tags.map((t, idx) => (
                          <span key={idx} className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-full border border-border-subtle">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-text-main">{tpl.title}</h4>
                    <pre className="mt-3 p-4 bg-white rounded-xl border border-border-subtle text-xs text-text-main font-mono whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto">
                      {tpl.body}
                    </pre>
                  </div>

                  <button
                    onClick={() => handleCopyText(tpl.body, tpl.id)}
                    className="w-full py-2.5 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
                  >
                    {copiedId === tpl.id ? <Check className="w-3.5 h-3.5 text-card-yellow" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === tpl.id ? 'Copied to Clipboard!' : 'Copy Template Text'}
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 7: CLIENT INTELLIGENCE DATABASE */}
        {/* ========================================================================= */}
        {activeModule === 'intelligence' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Client Intelligence Profile Selector */}
            <div className="space-y-4">
              <div className="bg-[#FDFBF7] p-5 rounded-[28px] border border-border-subtle space-y-3">
                <h3 className="text-sm font-bold text-text-main">Executive Client Profiles</h3>
                
                <div className="space-y-2">
                  {intelligenceList.map(intel => (
                    <div 
                      key={intel.id}
                      onClick={() => setSelectedIntelId(intel.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        selectedIntelId === intel.id ? 'bg-white border-sidebar-bg shadow-xs ring-1 ring-sidebar-bg' : 'bg-white/60 border-border-subtle hover:bg-white'
                      }`}
                    >
                      <h4 className="text-xs font-bold text-text-main">{intel.clientName}</h4>
                      <p className="text-[11px] text-text-muted mt-0.5">{intel.businessContext.companyName}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 2 Cols: Deep Comprehensive Executive Dossier */}
            <div className="lg:col-span-2 space-y-6">
              {activeIntel && (
                <div className="bg-[#FDFBF7] p-6 md:p-8 rounded-[28px] border border-border-subtle space-y-6">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-card-blue">
                        CONFIDENTIAL EXECUTIVE DOSSIER
                      </span>
                      <h3 className="text-2xl font-bold text-text-main mt-1">
                        {activeIntel.clientName}
                      </h3>
                      <p className="text-xs text-text-muted">{activeIntel.executiveProfile.role} • {activeIntel.businessContext.companyName}</p>
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 bg-white rounded-full border border-border-subtle">
                      TZ: {activeIntel.executiveProfile.timezone.split(' ')[0]}
                    </span>
                  </div>

                  {/* 1. Executive Communication & Decision Norms */}
                  <div className="p-5 bg-white rounded-2xl border border-border-subtle space-y-2 text-xs">
                    <span className="font-bold text-text-main uppercase text-[10px] tracking-wide text-card-blue">
                      Communication & Decision Preferences
                    </span>
                    <p className="text-text-main leading-relaxed">{activeIntel.executiveProfile.communicationPreferences}</p>
                    <p className="text-text-muted leading-relaxed"><strong>Decision Style:</strong> {activeIntel.executiveProfile.decisionMakingStyle}</p>
                  </div>

                  {/* 2. Personal, Family & Lifestyle Intelligence */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-white rounded-2xl border border-border-subtle space-y-2">
                      <span className="font-bold text-text-main uppercase text-[10px]">Family & Personal Life</span>
                      <p className="text-text-muted"><strong>Spouse:</strong> {activeIntel.familyAndPersonal.spousePartner}</p>
                      <p className="text-text-muted"><strong>Children:</strong> {activeIntel.familyAndPersonal.children}</p>
                      <p className="text-text-muted"><strong>Important Dates:</strong> {activeIntel.familyAndPersonal.anniversaries}</p>
                      <p className="text-text-muted"><strong>Birthdays:</strong> {activeIntel.familyAndPersonal.birthdays}</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-border-subtle space-y-2">
                      <span className="font-bold text-text-main uppercase text-[10px]">Lifestyle & Dietary</span>
                      <p className="text-text-muted"><strong>Hobbies:</strong> {activeIntel.familyAndPersonal.hobbiesInterests}</p>
                      <p className="text-text-muted"><strong>Health / Dietary:</strong> {activeIntel.familyAndPersonal.healthWellnessConsiderations}</p>
                      <p className="text-text-muted"><strong>Favorite Spots:</strong> {activeIntel.familyAndPersonal.favoriteRestaurants}</p>
                      <p className="text-text-muted"><strong>Gifts:</strong> {activeIntel.familyAndPersonal.giftPreferences}</p>
                    </div>
                  </div>

                  {/* 3. Executive Assistant Field Notes */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">
                      Executive Assistant Confidential Rules & Protocols
                    </h4>
                    <div className="space-y-2 text-xs">
                      {activeIntel.executiveAssistantNotes.map(note => (
                        <div key={note.id} className="p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-xl flex items-start gap-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200 text-amber-950 rounded uppercase shrink-0">
                            {note.category}
                          </span>
                          <span className="text-text-main font-medium">{note.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Add New Prospect Lead Modal */}
      {newLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-[28px] border border-border-subtle shadow-2xl max-w-lg w-full p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="text-lg font-bold text-text-main">Add New Prospect Lead</h3>
              <button onClick={() => setNewLeadModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-text-muted uppercase mb-1">Executive / Prospect Name</label>
                <input 
                  type="text" 
                  required
                  value={newLeadName ?? ''} 
                  onChange={e => setNewLeadName(e.target.value)}
                  placeholder="e.g. Harrison Brooks"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-sm font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-muted uppercase mb-1">Company / Fund</label>
                  <input 
                    type="text" 
                    value={newLeadCompany ?? ''} 
                    onChange={e => setNewLeadCompany(e.target.value)}
                    placeholder="e.g. Apex Horizon Capital"
                    className="w-full px-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-muted uppercase mb-1">Role</label>
                  <input 
                    type="text" 
                    value={newLeadRole ?? ''} 
                    onChange={e => setNewLeadRole(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-muted uppercase mb-1">Email</label>
                  <input 
                    type="email" 
                    value={newLeadEmail ?? ''} 
                    onChange={e => setNewLeadEmail(e.target.value)}
                    placeholder="prospect@fund.com"
                    className="w-full px-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-muted uppercase mb-1">Target Retainer ($/mo)</label>
                  <input 
                    type="number" 
                    step="500"
                    value={newLeadBudget ?? 5000} 
                    onChange={e => setNewLeadBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-muted uppercase mb-1">Discovery Notes & Context</label>
                <textarea 
                  rows={3} 
                  value={newLeadNotes ?? ''} 
                  onChange={e => setNewLeadNotes(e.target.value)}
                  placeholder="Pain points, calendar drag, mutual contacts, fund size..."
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
                <button type="button" onClick={() => setNewLeadModal(false)} className="px-4 py-2 border rounded-full text-text-muted">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-sidebar-bg text-white font-semibold rounded-full shadow-xs">
                  Save to Lead Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
