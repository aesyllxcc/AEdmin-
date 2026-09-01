import { ManagedTemplate, GeneratedDraftRecord } from '../types';

export const initialManagedTemplates: ManagedTemplate[] = [
  // 1. COVER LETTERS & JOB OUTREACH
  {
    id: "tpl_cov_cos",
    title: "Fractional Chief of Staff & Ops Lead Cover Letter",
    category: "cover_letters",
    description: "High-impact, authoritative cover letter designed for high-growth founders, venture studios, and scaling executive offices.",
    content: `Dear {{hiring_manager}},

I am writing to express my strong enthusiasm for the {{role_title}} role at {{company_name}}. With over {{years_experience}} years of experience orchestrating high-leverage executive operations, calendar defense, and cross-functional unblocking for high-growth leaders, I specialize in transforming chaotic founder workflows into calm, high-velocity execution engines.

In reviewing the requirements for {{company_name}}, three key priorities immediately resonated with my background:

1. **Strategic Execution & Calendar Defense**: {{key_competency_1}}
2. **Operations Architecture & Systematization**: {{key_competency_2}}
3. **High-Stakes Confidentiality & Composure**: Proven track record supporting CEOs with cap table audits, investor summits, and board deck synthesis.

Most recently, I {{recent_win}}, directly reclaiming 12+ hours of weekly deep work for executive leadership. 

I operate with high autonomy, proactive communication, and extreme attention to nuance. I would welcome the opportunity to discuss how I can immediately unblock your leadership team and accelerate {{company_name}}'s key milestones this quarter.

Thank you for your time and consideration.

Best regards,

{{candidate_name}}
{{candidate_title}}
{{contact_info}}`,
    variables: [
      { key: "hiring_manager", label: "Hiring Manager / Recipient", defaultValue: "Hiring Team" },
      { key: "company_name", label: "Company Name", defaultValue: "Acme Ventures" },
      { key: "role_title", label: "Role Title", defaultValue: "Fractional Chief of Staff" },
      { key: "years_experience", label: "Years of Experience", defaultValue: "7+" },
      { key: "key_competency_1", label: "Core Competency 1 (Focus / Calendar)", defaultValue: "Protected 15+ hours weekly deep-work blocks by establishing strict 25-minute meeting caps and async triage." },
      { key: "key_competency_2", label: "Core Competency 2 (Systems)", defaultValue: "Built centralized company wikis, Notion project databases, and automated Slack status digests." },
      { key: "recent_win", label: "Recent Major Accomplishment", defaultValue: "orchestrated a $75M LP Investor Summit and built an end-to-end institutional data room with zero compliance delays" },
      { key: "candidate_name", label: "Your Full Name", defaultValue: "Olivia Vance" },
      { key: "candidate_title", label: "Your Professional Title", defaultValue: "Principal Executive Operations Consultant" },
      { key: "contact_info", label: "Email / Phone / LinkedIn", defaultValue: "olivia@aedmin.space | linkedin.com/in/oliviavance" }
    ],
    tags: ["Executive", "Chief of Staff", "Cover Letter", "High Impact"],
    isFavorite: true,
    createdAt: "2026-08-01",
    updatedAt: "2026-08-25",
    author: "AEDMIN Core"
  },
  {
    id: "tpl_cov_ea",
    title: "Executive Assistant & Business Operations Partner Cover Letter",
    category: "cover_letters",
    description: "Tailored letter emphasizing proactive inbox zero, seamless travel logistics, high confidentiality, and asynchronous rhythm.",
    content: `Dear {{hiring_manager}},

I am excited to submit my application for the {{role_title}} position at {{company_name}}. 

As an experienced Executive Assistant and Operations Partner, I do not simply manage calendars and correspondence—I operate as an extension of the executive office. My focus is on anticipating friction points before they materialize, filtering cognitive noise, and ensuring seamless daily operations.

Key areas where I create immediate leverage:
• **Inbox Zero & Priority Heuristics**: Triaging 200+ inbound messages daily to surface true strategic priorities while drafting 80% of routine responses autonomously.
• **Flawless Executive Travel**: Curating multi-city international itineraries with synchronized timezones, backup transit logistics, and bespoke accommodation briefs.
• **Stakeholder Diplomacy & Board Readiness**: Handling sensitive investor communications, scheduling board meetings, and formatting polished presentation decks.

Tools & Systems Mastered: {{tools_mastered}}.

I am available starting {{availability_date}} and would love to connect for a brief 15-minute introductory conversation.

Warmly,

{{candidate_name}}
{{candidate_title}}
{{contact_info}}`,
    variables: [
      { key: "hiring_manager", label: "Hiring Manager / Executive", defaultValue: "Leadership Team" },
      { key: "company_name", label: "Company Name", defaultValue: "Horizon Capital" },
      { key: "role_title", label: "Role Title", defaultValue: "Senior Executive Assistant to CEO" },
      { key: "tools_mastered", label: "Key Tools Mastered", defaultValue: "Google Workspace, Superhuman, Notion, Slack Enterprise, Linear, 1Password, Figma, Stripe" },
      { key: "availability_date", label: "Earliest Start Date", defaultValue: "immediately" },
      { key: "candidate_name", label: "Your Full Name", defaultValue: "Olivia Vance" },
      { key: "candidate_title", label: "Your Title", defaultValue: "Executive Business Partner" },
      { key: "contact_info", label: "Contact Information", defaultValue: "olivia@aedmin.space" }
    ],
    tags: ["Executive Assistant", "EA", "Inbox Zero", "Travel"],
    isFavorite: true,
    createdAt: "2026-08-05",
    updatedAt: "2026-08-26",
    author: "AEDMIN Core"
  },
  {
    id: "tpl_out_linkedin",
    title: "LinkedIn Executive Connection & Value Hook Note",
    category: "outreach",
    description: "Concise, high-converting LinkedIn direct connection message respecting the 300-character limit.",
    content: `Hi {{first_name}}, loved your recent insights on {{shared_topic}} at {{company_name}}. As a fractional ops lead helping founders reclaim 12+ hrs/wk from inbox & calendar triage, I’d love to connect and follow your journey! {{candidate_name}}`,
    variables: [
      { key: "first_name", label: "First Name", defaultValue: "Marcus" },
      { key: "company_name", label: "Company Name", defaultValue: "Arkgate" },
      { key: "shared_topic", label: "Topic / Recent Post", defaultValue: "scaling early-stage fund operations" },
      { key: "candidate_name", label: "Your Name", defaultValue: "Olivia" }
    ],
    tags: ["LinkedIn", "Outreach", "Short", "Networking"],
    isFavorite: false,
    createdAt: "2026-08-10",
    updatedAt: "2026-08-20",
    author: "AEDMIN Core"
  },
  {
    id: "tpl_out_cold_email",
    title: "Executive Introduction & Value-First Cold Pitch Email",
    category: "outreach",
    description: "Non-salesy, problem-aware cold email highlighting immediate capacity relief for overwhelmed founders and operators.",
    content: `Subject: Quick question re: executive ops bandwidth at {{company_name}}

Hi {{first_name}},

Noticed {{company_name}}'s recent announcement regarding {{recent_milestone}}—congratulations to the entire team on the momentum.

Typically, when companies reach this inflection stage, leadership calendars get swallowed by context switching, inbox triage, and operational drag.

I run an executive operations practice supporting founders and CEOs as a Fractional Chief of Staff & Executive Partner. For example, with {{comparable_client_or_industry}}, we {{proven_result}} within our first 30 days.

Are you currently open to exploring high-leverage executive support to protect your focus blocks as you scale {{company_name}}?

Either way, wishing you continued success with the launch.

Best regards,

{{candidate_name}}
{{candidate_title}} | {{agency_name}}
{{portfolio_url}}`,
    variables: [
      { key: "first_name", label: "First Name", defaultValue: "Elena" },
      { key: "company_name", label: "Target Company", defaultValue: "Stark Media" },
      { key: "recent_milestone", label: "Recent News / Milestone", defaultValue: "your European expansion and SS27 campaign kickoff" },
      { key: "comparable_client_or_industry", label: "Comparable Client / Industry", defaultValue: "venture-backed tech and creative studio founders" },
      { key: "proven_result", label: "Proven Metric / Result", defaultValue: "reclaimed 14 hours per week of uninterrupted deep work and automated daily LP reporting" },
      { key: "candidate_name", label: "Your Full Name", defaultValue: "Olivia Vance" },
      { key: "candidate_title", label: "Your Title", defaultValue: "Principal Operations Consultant" },
      { key: "agency_name", label: "Studio / Practice Name", defaultValue: "AEDMIN Executive Studio" },
      { key: "portfolio_url", label: "Portfolio / Website Link", defaultValue: "aedmin.space" }
    ],
    tags: ["Cold Email", "Executive Pitch", "Founder Outreach"],
    isFavorite: true,
    createdAt: "2026-08-12",
    updatedAt: "2026-08-26",
    author: "AEDMIN Core"
  },

  // 2. PROPOSALS
  {
    id: "tpl_prop_retainer",
    title: "Comprehensive Executive Retainer Proposal & SOW",
    category: "proposals",
    description: "End-to-end executive partnership proposal outlining scope, SLA commitments, pricing tier, and kickoff timeline.",
    content: `# EXECUTIVE PARTNERSHIP PROPOSAL

**Prepared For:** {{client_name}} ({{company_name}})  
**Prepared By:** {{contractor_name}} | {{agency_name}}  
**Date:** {{proposal_date}}  
**Engagement Model:** Monthly Dedicated Executive Retainer

---

## 1. Executive Summary
{{company_name}} is operating at a rapid pace where leadership attention must remain strictly dedicated to high-leverage strategic growth, product vision, and capital allocation. {{agency_name}} will provide dedicated Chief of Staff and Executive Operations partnership to eliminate operational friction and defend leadership focus.

## 2. Core Scope of Services
• **Calendar Defense & Triage**: Continuous management, 25-minute meeting enforcement, timezone defense.
• **Inbox Zero Architecture**: Daily categorization, drafting 80%+ of outbound responses.
• **Board & Investor Logistics**: Presentation formatting, data room governance, and meeting briefs.
• **Project Tracking & Unblocking**: Cross-functional milestone oversight in Linear/Notion.
• **Daily Briefing & EOD Recaps**: Formatted async summaries dispatched directly to Slack.

## 3. Retainer Allocation & Investment
• **Tier**: {{tier_name}} ({{hours_included}} Dedicated Hours / Month)
• **Monthly Investment**: {{monthly_fee}}
• **Payment Terms**: Invoiced in advance on the 1st of each month via Stripe / Wire (Net 14).
• **Additional Hours**: Billed at {{overage_rate}}/hr with prior written client consent.

## 4. Communication Cadence & SLAs
• **Primary Channel**: Slack ({{slack_channel}}) & Executive Briefing Portal.
• **Response SLA**: Within {{response_sla_hours}} business hours during operating window ({{working_hours}}).
• **Weekly Alignment**: 25-minute async or live calibration every Monday.

## 5. Next Steps to Kickoff
1. Sign Master Services Agreement & NDA.
2. Complete 15-minute Executive Style & Access Intake.
3. Official Kickoff Call on {{kickoff_date}}.

---
*Accepted and Agreed:*

___________________________  
**{{client_name}}**, {{company_name}}  
Date: _____________________`,
    variables: [
      { key: "client_name", label: "Client Name", defaultValue: "Marcus Vance" },
      { key: "company_name", label: "Client Company", defaultValue: "Arkgate Ventures" },
      { key: "contractor_name", label: "Contractor Name", defaultValue: "Olivia Vance" },
      { key: "agency_name", label: "Agency / Studio Name", defaultValue: "AEDMIN Consulting" },
      { key: "proposal_date", label: "Proposal Date", defaultValue: "2026-09-01" },
      { key: "tier_name", label: "Retainer Tier Name", defaultValue: "Executive Chief of Staff Tier" },
      { key: "hours_included", label: "Monthly Hours Allocation", defaultValue: "40" },
      { key: "monthly_fee", label: "Monthly Retainer Fee", defaultValue: "$5,500.00 / month" },
      { key: "overage_rate", label: "Hourly Overage Rate", defaultValue: "$150.00" },
      { key: "slack_channel", label: "Dedicated Slack Channel", defaultValue: "#aedmin-arkgate-ops" },
      { key: "response_sla_hours", label: "Response SLA (Hours)", defaultValue: "2" },
      { key: "working_hours", label: "Operating Window", defaultValue: "09:00 AM - 05:30 PM EST" },
      { key: "kickoff_date", label: "Target Kickoff Date", defaultValue: "September 8, 2026" }
    ],
    tags: ["Proposal", "Retainer", "SOW", "Executive Agreement"],
    isFavorite: true,
    createdAt: "2026-08-15",
    updatedAt: "2026-08-28",
    author: "AEDMIN Core"
  },

  // 3. REPORTS
  {
    id: "tpl_rep_weekly",
    title: "Weekly Strategic Briefing & Operations Digest",
    category: "reports",
    description: "C-level executive weekly digest highlighting big wins, active priorities, blocker mitigations, and decisions needed.",
    content: `# WEEKLY STRATEGIC BRIEFING — {{client_name}}
**Period:** {{week_range}} | **Prepared by:** {{contractor_name}}

---

### 🌟 Top Wins & Major Accomplishments
{{wins_list}}

---

### 🎯 Active Priorities & Milestone Progress
{{priorities_list}}

---

### 🛡️ Schedule & Focus Time Protected
• **Total Hours Logged This Week**: {{hours_logged}} hrs
• **Executive Focus Time Reclaimed**: {{focus_hours_saved}} hrs
• **Meetings Screened / Capped**: {{meetings_optimized}} meetings

---

### ⚠️ Risks & Blockers Under Management
{{blockers_list}}

---

### ⚡ Critical Decisions Needed (Action Items)
{{decisions_needed}}

---
*Next Strategic Calibration:* {{next_sync_time}}`,
    variables: [
      { key: "client_name", label: "Client / Company", defaultValue: "Arkgate Ventures" },
      { key: "week_range", label: "Week Date Range", defaultValue: "Aug 24 - Aug 28, 2026" },
      { key: "contractor_name", label: "Your Name", defaultValue: "Olivia Vance" },
      { key: "wins_list", label: "Key Wins List", defaultValue: "• Finalized LP Summit keynote slide decks\n• Reconciled Carta cap table records\n• Maintained 100% inbox zero across 5 operating days" },
      { key: "priorities_list", label: "Active Priorities", defaultValue: "• Fund III closing document dispatch\n• Private dinner RSVP dietary matrix\n• September travel logistics briefing" },
      { key: "hours_logged", label: "Hours Logged This Week", defaultValue: "10.5" },
      { key: "focus_hours_saved", label: "Executive Hours Reclaimed", defaultValue: "12.0" },
      { key: "meetings_optimized", label: "Meetings Capped / Screened", defaultValue: "8" },
      { key: "blockers_list", label: "Blockers & Mitigations", defaultValue: "• Awaiting venue AV confirmation for SoHo gallery (Follow-up scheduled for 2 PM today)." },
      { key: "decisions_needed", label: "Decisions Required", defaultValue: "1. Sign off on Quince dinner sommelier menu.\n2. Confirm attendance for Sequoia syndicate roundtable." },
      { key: "next_sync_time", label: "Next Sync Time", defaultValue: "Monday, Aug 31 at 09:30 AM PST" }
    ],
    tags: ["Weekly Report", "Executive Digest", "Briefing"],
    isFavorite: true,
    createdAt: "2026-08-16",
    updatedAt: "2026-08-28",
    author: "AEDMIN Core"
  },
  {
    id: "tpl_rep_eod",
    title: "End-of-Day (EOD) Operations Summary (Slack / Email)",
    category: "reports",
    description: "Clean, bulleted daily recap for asynchronous Slack/Email dispatch at the end of the operating shift.",
    content: `*AEDMIN EOD Operations Recap — {{client_name}} ({{date_today}})*

*Today's Key Deliverables:*
{{tasks_completed}}

*In-Flight & Handing Off to Tomorrow:*
{{tasks_in_progress}}

*Decisions / Input Awaiting You:*
{{pending_decisions}}

*Tomorrow's Focus Blocks:*
{{tomorrow_preview}}

Have a wonderful evening! 🌙`,
    variables: [
      { key: "client_name", label: "Client Name", defaultValue: "Arkgate Ventures" },
      { key: "date_today", label: "Date", defaultValue: "Aug 26, 2026" },
      { key: "tasks_completed", label: "Completed Items", defaultValue: "• Cleared 42 inbox items & drafted 6 investor replies\n• Updated SoHo summit call sheet\n• Screened 3 inbound pitch decks" },
      { key: "tasks_in_progress", label: "In Progress Items", defaultValue: "• Cap table reconciliation report with Carta\n• Paris flight itinerary options" },
      { key: "pending_decisions", label: "Pending Sign-offs", defaultValue: "• Quince SF private room deposit approval (Link in Briefing Portal)" },
      { key: "tomorrow_preview", label: "Tomorrow's Schedule", defaultValue: "• 10:30 AM Benchmark Partner Call\n• 01:30 PM Protected Deep Work Block" }
    ],
    tags: ["EOD", "Daily Report", "Slack Recap"],
    isFavorite: false,
    createdAt: "2026-08-17",
    updatedAt: "2026-08-25",
    author: "AEDMIN Core"
  },

  // 4. ONBOARDING DOCUMENTS
  {
    id: "tpl_onb_welcome",
    title: "Client Executive Welcome Kit & Onboarding Roadmap",
    category: "onboarding",
    description: "White-glove welcome document establishing communication norms, shared vaults, SLAs, and kickoff milestones.",
    content: `# WELCOME TO AEDMIN EXECUTIVE OPERATIONS

Dear {{client_name}},

We are thrilled to officially kick off our executive operations partnership with {{company_name}}! 

Our mission is to provide you with seamless, high-conviction operational leverage so you can spend 100% of your energy on your highest-leverage strategic initiatives.

---

### 🔑 1. Your Dedicated Operations Hub
• **Client Code**: \`{{client_code}}\`
• **Dedicated Slack Channel**: \`{{slack_channel}}\`
• **Executive Briefing & Portal Link**: \`{{portal_link}}\`
• **Shared Google Drive Vault**: \`{{drive_vault_link}}\`

---

### ⏱️ 2. Operating Cadence & Response SLAs
• **Active Operating Hours**: {{operating_hours}}
• **Urgent Comms SLA**: Response within {{urgent_sla_hours}} hours.
• **Daily Morning Brief**: Dispatched by {{morning_brief_time}} each morning.
• **EOD Recap**: Dispatched by {{eod_recap_time}} daily.

---

### 🚀 3. First 14-Day Roadmap
1. **Days 1-3**: Security credential transfer via 1Password & email delegation.
2. **Days 4-7**: Calendar defense rules established & inbox zero triage initiated.
3. **Days 8-14**: Full operational rhythm active & first weekly strategic brief delivered.

We look forward to an exceptional collaboration!

Warm regards,

{{contractor_name}}  
Principal Director, {{agency_name}}`,
    variables: [
      { key: "client_name", label: "Client Name", defaultValue: "Harrison Wayne" },
      { key: "company_name", label: "Client Company", defaultValue: "Wayne Technologies" },
      { key: "client_code", label: "Client Code", defaultValue: "WAYN" },
      { key: "slack_channel", label: "Slack Channel", defaultValue: "#aedmin-waynetech-ops" },
      { key: "portal_link", label: "Portal URL", defaultValue: "https://aedmin.space/portal/wayn-vault" },
      { key: "drive_vault_link", label: "Google Drive Folder", defaultValue: "https://drive.google.com/folders/WAYN" },
      { key: "operating_hours", label: "Operating Window", defaultValue: "09:00 AM - 05:30 PM EST" },
      { key: "urgent_sla_hours", label: "Urgent SLA (Hours)", defaultValue: "2" },
      { key: "morning_brief_time", label: "Morning Brief Time", defaultValue: "09:00 AM EST" },
      { key: "eod_recap_time", label: "EOD Recap Time", defaultValue: "05:00 PM EST" },
      { key: "contractor_name", label: "Your Name", defaultValue: "Olivia Vance" },
      { key: "agency_name", label: "Agency Name", defaultValue: "AEDMIN Consulting" }
    ],
    tags: ["Onboarding", "Welcome Kit", "SLA", "Roadmap"],
    isFavorite: false,
    createdAt: "2026-08-18",
    updatedAt: "2026-08-25",
    author: "AEDMIN Core"
  },

  // 5. CLIENT COMMUNICATIONS & NEGOTIATIONS
  {
    id: "tpl_com_rate_expansion",
    title: "Client Retainer Expansion & Rate Alignment Notice",
    category: "communications",
    description: "Diplomatic, value-anchored email script transitioning an expanding client to a higher monthly tier without friction.",
    content: `Subject: Strategic Retainer Calibration for {{upcoming_quarter}} — {{client_name}}

Hi {{first_name}},

I hope you’re having a fantastic week.

Over the past quarter, we’ve achieved tremendous momentum across {{major_achievements}}. As our operational partnership has naturally expanded into higher-leverage strategic initiatives, our current monthly allocation of {{current_hours}} hours has been running at 100% capacity over the last 3 consecutive months.

To ensure we maintain dedicated turnaround times, uninterrupted momentum, and deeper strategic bandwidth for {{upcoming_initiatives}}, I recommend transitioning our engagement to our {{proposed_tier}} ({{proposed_hours}} hours/mo at {{proposed_fee}}) starting on {{effective_date}}.

This will give us the dedicated capacity needed to execute without running into mid-month caps.

Let me know if you’d like to review this briefly on our next sync, or if you are happy for me to update our billing schedule starting on {{effective_date}}.

Best regards,

{{candidate_name}}
{{agency_name}}`,
    variables: [
      { key: "client_name", label: "Client / Company", defaultValue: "Arkgate Ventures" },
      { key: "first_name", label: "Client First Name", defaultValue: "Marcus" },
      { key: "upcoming_quarter", label: "Target Period / Quarter", defaultValue: "Q4" },
      { key: "major_achievements", label: "Major Recent Achievements", defaultValue: "LP summit operations, investor reporting data rooms, and full inbox automation" },
      { key: "current_hours", label: "Current Hours Allocation", defaultValue: "35" },
      { key: "upcoming_initiatives", label: "Upcoming Initiatives", defaultValue: "Fund III closing logistics and European partner roadshows" },
      { key: "proposed_tier", label: "Proposed Tier Name", defaultValue: "Executive Tier (45 Hours)" },
      { key: "proposed_hours", label: "New Monthly Hours", defaultValue: "45" },
      { key: "proposed_fee", label: "New Monthly Retainer Fee", defaultValue: "$6,200/mo" },
      { key: "effective_date", label: "Effective Date", defaultValue: "October 1st, 2026" },
      { key: "candidate_name", label: "Your Full Name", defaultValue: "Olivia Vance" },
      { key: "agency_name", label: "Agency Name", defaultValue: "AEDMIN Consulting" }
    ],
    tags: ["Rate Increase", "Upsell", "Retainer", "Negotiation"],
    isFavorite: true,
    createdAt: "2026-08-19",
    updatedAt: "2026-08-27",
    author: "AEDMIN Core"
  },
  {
    id: "tpl_com_scope_creep",
    title: "Scope Boundary Defense & Supplemental SOW Notice",
    category: "communications",
    description: "Professional script addressing an out-of-scope client request while offering a seamless add-on solution.",
    content: `Subject: Scope alignment & estimate for {{project_title}}

Hi {{first_name}},

Thanks for sharing the details regarding {{project_title}}! It sounds like a high-value initiative.

Taking a look at our current Statement of Work, this falls outside of our standard monthly executive retainer scope ({{current_scope_summary}}).

To execute this with the dedicated focus it requires without impacting our daily operations rhythm, I can support this in one of two ways:

1. **Standalone Sprint**: We can execute this as a dedicated {{estimated_hours}}-hour project sprint at a flat project fee of {{project_fee}}, delivered by {{deliverable_date}}.
2. **Backlog Prioritization**: We can swap out {{existing_task_to_swap}} from our current monthly sprint to accommodate this within our existing retainer allocation.

Let me know which option you'd prefer to proceed with, and I'll prepare the necessary materials immediately.

Best regards,

{{candidate_name}}`,
    variables: [
      { key: "first_name", label: "Client First Name", defaultValue: "Elena" },
      { key: "project_title", label: "New Request Title", defaultValue: "Complete Website Brand Overhaul" },
      { key: "current_scope_summary", label: "Current Scope Summary", defaultValue: "creative shoot logistics, talent coordination, and daily communications" },
      { key: "estimated_hours", label: "Estimated Project Hours", defaultValue: "25" },
      { key: "project_fee", label: "Flat Project Fee", defaultValue: "$3,500" },
      { key: "deliverable_date", label: "Target Delivery Date", defaultValue: "September 20, 2026" },
      { key: "existing_task_to_swap", label: "Alternative Task to Swap", defaultValue: "the Q4 equipment audit" },
      { key: "candidate_name", label: "Your Name", defaultValue: "Olivia Vance" }
    ],
    tags: ["Scope Defense", "Out of Scope", "Boundaries", "Upsell"],
    isFavorite: false,
    createdAt: "2026-08-20",
    updatedAt: "2026-08-25",
    author: "AEDMIN Core"
  },

  // 6. CONTRACTS & LEGAL
  {
    id: "tpl_leg_msa",
    title: "Master Executive Services Agreement (Monthly Retainer)",
    category: "contracts_legal",
    description: "Comprehensive independent contractor agreement with payment terms, IP ownership, confidentiality, and 30-day termination notice.",
    content: `MASTER SERVICES AGREEMENT (RETAINER)

This Master Services Agreement ("Agreement") is entered into by and between {{contractor_name}} ("Contractor") and {{client_company}} ("Company").

1. SCOPE OF SERVICES
Contractor shall provide high-level executive support, operations management, and strategic advisory as outlined in individual Statements of Work (SOW).

2. RETAINER ALLOCATION & AVAILABILITY
• The agreed monthly retainer reserves a guaranteed capacity of {{hours_per_month}} hours per calendar month.
• Unused retainer hours do not roll over to subsequent months unless explicitly agreed in writing.
• Additional hours exceeding the monthly allocation shall be billed at the standard rate of {{overage_rate}}/hour with prior written client approval.

3. FEES & INVOICING
• Retainer fees are billed in advance on the 1st of each calendar month.
• Payment terms are Net-{{payment_terms_days}} from the date of invoice.
• Late payments exceeding 15 days incur a 1.5% monthly finance charge.

4. INTELLECTUAL PROPERTY & WORK PRODUCT
Upon receipt of full payment, all deliverables created specifically for Client shall become the exclusive property of Client. Contractor retains ownership of pre-existing frameworks, templates, and systems.

5. CONFIDENTIALITY & NDA
Contractor agrees to hold all proprietary company documents, financials, cap tables, and executive communications in strict confidence in perpetuity.

6. TERMINATION
Either party may terminate this agreement with thirty (30) days written notice.`,
    variables: [
      { key: "contractor_name", label: "Contractor Name", defaultValue: "AEDMIN Consulting LLC" },
      { key: "client_company", label: "Client Company Name", defaultValue: "Arkgate Ventures LLC" },
      { key: "hours_per_month", label: "Monthly Hours Guaranteed", defaultValue: "40" },
      { key: "overage_rate", label: "Hourly Overage Rate", defaultValue: "$150.00" },
      { key: "payment_terms_days", label: "Payment Terms (Days)", defaultValue: "14" }
    ],
    tags: ["MSA", "Legal", "Master Agreement", "Retainer"],
    isFavorite: false,
    createdAt: "2026-08-01",
    updatedAt: "2026-08-25",
    author: "AEDMIN Legal"
  },
  {
    id: "tpl_leg_nda",
    title: "Mutual Executive Non-Disclosure Agreement (NDA)",
    category: "contracts_legal",
    description: "Standard two-way confidentiality covenant protecting sensitive business strategies, cap tables, and executive assets.",
    content: `MUTUAL NON-DISCLOSURE AGREEMENT (NDA)

1. CONFIDENTIAL INFORMATION
Confidential Information includes all non-public operational, technical, financial, and strategic information disclosed by either Party.

2. OBLIGATIONS
Each Party agrees to protect Confidential Information using the same degree of care it uses to protect its own sensitive assets, but no less than reasonable care.

3. DURATION
The confidentiality obligations shall remain in effect for a period of {{term_years}} years following the disclosure date.

4. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of {{governing_jurisdiction}}.`,
    variables: [
      { key: "term_years", label: "Confidentiality Term (Years)", defaultValue: "3" },
      { key: "governing_jurisdiction", label: "Governing State / Jurisdiction", defaultValue: "the State of Delaware" }
    ],
    tags: ["NDA", "Confidentiality", "Legal"],
    isFavorite: false,
    createdAt: "2026-08-01",
    updatedAt: "2026-08-25",
    author: "AEDMIN Legal"
  }
];

export const initialGeneratedDrafts: GeneratedDraftRecord[] = [
  {
    id: "drf_1",
    templateId: "tpl_cov_cos",
    templateTitle: "Fractional Chief of Staff & Ops Lead Cover Letter",
    clientId: "cli_1",
    clientName: "Arkgate Ventures",
    title: "Arkgate Ventures - Executive Ops Pitch",
    content: `Dear Marcus Vance & Arkgate Team,

I am writing to express my strong enthusiasm for the Fractional Chief of Staff role at Arkgate Ventures. With over 8 years of experience orchestrating high-leverage executive operations, calendar defense, and cross-functional unblocking for venture-backed founders, I specialize in transforming high-stakes operations into calm, predictable execution engines.

In reviewing Arkgate's upcoming milestones, three key priorities immediately aligned with my background:
1. **Strategic Execution & Calendar Defense**: Protected 15+ hours weekly deep-work blocks by establishing strict 25-minute meeting caps and async triage.
2. **Operations Architecture & Systematization**: Built centralized LP data rooms, Notion dealflow databases, and automated Slack status digests.
3. **High-Stakes Confidentiality & Composure**: Proven track record supporting venture partners with cap table audits, LP summits, and board deck synthesis.

Most recently, I orchestrated a $75M LP Investor Summit with 85+ attendees and built an institutional data room with zero compliance delays.

I operate with high autonomy, proactive communication, and extreme attention to detail. I would welcome the opportunity to discuss how I can immediately unblock your partnership team and accelerate Arkgate's key milestones this quarter.

Warm regards,

Olivia Vance
Principal Executive Operations Consultant
olivia@aedmin.space | (415) 890-3321`,
    variablesUsed: {
      hiring_manager: "Marcus Vance & Arkgate Team",
      company_name: "Arkgate Ventures",
      role_title: "Fractional Chief of Staff",
      years_experience: "8"
    },
    createdAt: "2026-08-26",
    status: "finalized",
    format: "cover_letter"
  }
];
