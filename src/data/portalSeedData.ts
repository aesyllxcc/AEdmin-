import { 
  ExecutiveBriefing, 
  StrategicRecommendation, 
  ClientStrategicObjective, 
  ClientKnowledgeDocument,
  ApprovalItem
} from '../types';

export const initialBriefings: ExecutiveBriefing[] = [
  {
    id: "brf_arkg_1",
    clientId: "cli_1",
    date: "2026-08-26",
    type: "weekly_briefing",
    title: "Weekly Strategic Briefing — Fund III Momentum & Summit Ops",
    headline: "All 18 LP summit keynote decks aligned; investor roadshow calendar 100% defended.",
    summary: "Over the past 7 days, we completed the Fund III LP Summit collateral suite, streamlined partner meeting buffers, and advanced cap table reconciliation with Sarah and Carta support. Focus is squarely on fund closing and high-impact investor interactions.",
    winsAndAccomplishments: [
      "Secured 100% speaker deck alignment for the upcoming LP Annual General Meeting in San Francisco.",
      "Reclaimed 11.5 hours of executive focus time by enforcing the strict 25-minute meeting cap and 10-minute transition buffers.",
      "Completed Q3 portfolio performance data synthesis across 14 seed-stage investments ahead of schedule."
    ],
    currentPriorities: [
      {
        id: "p_1",
        title: "Fund III Closing Protocol & Investor Sign-off Package",
        businessImpact: "Finalizes $18M institutional capital tranche with zero regulatory delays.",
        owner: "assistant",
        status: "in_progress"
      },
      {
        id: "p_2",
        title: "Keynote Deck Visual & Theme Sign-Off",
        businessImpact: "Ensures cohesive executive presence before 85+ global Limited Partners.",
        owner: "client",
        status: "awaiting_input"
      },
      {
        id: "p_3",
        title: "Affinity CRM Dealflow Pipeline Triage",
        businessImpact: "Accelerates tier-1 founder response latency down to under 4 hours.",
        owner: "assistant",
        status: "on_track"
      }
    ],
    strategicOpportunities: [
      "Pre-closing LP dinner in Menlo Park: Recommended hosting a private 8-person dinner for prospective lead anchors.",
      "Carta automated investor reporting integration to eliminate manual quarterly deck exports."
    ],
    risksAndBlockers: [
      {
        risk: "Late slide submissions from external portfolio founders.",
        impact: "Could delay printing of hardcover LP briefing dossiers.",
        mitigationPlan: "Enforced hard async cutoff of August 29 with automated reminder prompts."
      }
    ],
    decisionsNeeded: [
      "Approve finalized per-diem and private dinner catering selection for the LP Summit (Decision link in Approvals).",
      "Confirm attendance for the Sequoia Capital syndicate partner roundtable next Thursday."
    ],
    recommendationsSummary: "Adopt the automated investor inquiry routing rule in Superhuman to route inbound pitch decks directly to the associate triage queue.",
    nextSteps: [
      "Dispatch final summit attendee itineraries to all 42 confirmed LPs by Friday 2 PM EST.",
      "Finalize Q3 investor memo draft for Marcus's review."
    ],
    metricsSnapshot: [
      { label: "Executive Time Protected", value: "11.5 hrs", trend: "+3.2 hrs vs last week" },
      { label: "LP Summit Readiness", value: "92%", trend: "On track for Sept 15" },
      { label: "Pending Decisions", value: "2 items", trend: "Action required" }
    ]
  },
  {
    id: "brf_arkg_2",
    clientId: "cli_1",
    date: "2026-08-26",
    type: "quick_checkin",
    title: "Morning Async Executive Check-In",
    headline: "Calendar defended for today; 2 high-priority partner calls briefed.",
    summary: "Good morning Marcus. Your inbox has been cleared of noise (32 newsletters unsubscribed/filtered). Today's schedule features 3 focused investor calls, all supplied with 1-page dossiers. You have a 2.5-hour deep work block from 1:30 PM to 4:00 PM PST.",
    winsAndAccomplishments: [
      "Inbox zero achieved at 08:15 AM PST.",
      "1-page briefings prepared and attached to calendar invites for Apex Capital and Benchmark."
    ],
    currentPriorities: [
      {
        id: "p_checkin_1",
        title: "Benchmark Partner Call at 10:30 AM PST",
        businessImpact: "Explores co-investment syndicate for Series A robotics lead.",
        owner: "client",
        status: "on_track"
      },
      {
        id: "p_checkin_2",
        title: "Cap Table Export Reconciliation with Carta",
        businessImpact: "Verifies pro-rata rights for Fund II carry allocation.",
        owner: "assistant",
        status: "in_progress"
      }
    ],
    strategicOpportunities: [],
    risksAndBlockers: [],
    decisionsNeeded: [
      "Review the revised Fund III pitch deck appendix slides when your deep work block begins."
    ],
    nextSteps: [
      "Log recap notes immediately following Benchmark call.",
      "Publish EOD digest at 5:00 PM PST."
    ]
  },
  {
    id: "brf_arkg_3",
    clientId: "cli_1",
    date: "2026-08-25",
    type: "eod_report",
    title: "End-of-Day Operations Recap",
    headline: "All daily targets accomplished; tomorrow's schedule locked and protected.",
    summary: "Today we cleared all pending investor intros, finalized the vendor agreement for the summit AV team, and closed out 4 high-priority admin items. Tomorrow's calendar is clean with zero morning conflicts.",
    winsAndAccomplishments: [
      "Closed AV contract with 12% early-booking discount ($1,850 saved).",
      "Dispatched 8 investor introduction follow-ups within 45 minutes of receipt."
    ],
    currentPriorities: [],
    strategicOpportunities: [],
    risksAndBlockers: [],
    decisionsNeeded: [],
    nextSteps: [
      "Morning calendar sweep at 08:30 AM PST.",
      "Deliver final attendee badges to production printers."
    ]
  },
  {
    id: "brf_arkg_4",
    clientId: "cli_1",
    date: "2026-08-01",
    type: "monthly_review",
    title: "Monthly Strategic Executive Review — July 2026",
    headline: "Achieved 46 hours of calendar protection and accelerated Fund III velocity.",
    summary: "During July, we overhauled the partner meeting operating rhythm, migrated 220+ LP records to the new Notion Second Brain, and maintained an average email response time of under 18 minutes for tier-1 LPs.",
    winsAndAccomplishments: [
      "Protected 46 hours of deep focus time across the month.",
      "Standardized 4 key operational SOPs for portfolio founder onboarding.",
      "Maintained 100% SLA on LP inquiry turnarounds."
    ],
    currentPriorities: [],
    strategicOpportunities: [
      "Expand quarterly LP updates to interactive web dashboards."
    ],
    risksAndBlockers: [],
    decisionsNeeded: [],
    nextSteps: [
      "Begin August sprint focusing on LP Annual Summit readiness."
    ]
  },
  // Stark Media Studio Briefings
  {
    id: "brf_strk_1",
    clientId: "cli_2",
    date: "2026-08-26",
    type: "weekly_briefing",
    title: "Weekly Strategic Briefing — Paris Fashion Week Production Ops",
    headline: "All Paris logistics 85% confirmed; call sheets and crew per-diems locked.",
    summary: "We have secured the shoot locations in the 1st and 8th arrondissements, finalized travel coordination for 9 crew members, and streamlined asset handoff pipelines with post-production editors in London.",
    winsAndAccomplishments: [
      "Confirmed studio permits with the City of Paris for Place Vendôme golden hour shoot.",
      "Finalized flight bookings and luxury hotel room blocks with €2,400 corporate discount.",
      "Set up instant Frame.io client review pipeline for real-time editorial approvals."
    ],
    currentPriorities: [
      {
        id: "sp_1",
        title: "Approve Equipment Rental Manifest & Crew Per-Diem Budget",
        businessImpact: "Locks in backup camera package before supplier rental cutoff.",
        owner: "client",
        status: "awaiting_input"
      },
      {
        id: "sp_2",
        title: "Call Sheet V2 Dispatch to London Post-Production Team",
        businessImpact: "Ensures seamless 24-hour turnaround for brand social teasers.",
        owner: "assistant",
        status: "in_progress"
      }
    ],
    strategicOpportunities: [
      "Brand sponsorship expansion: Explore backstage beauty partnership for Paris runway showcase."
    ],
    risksAndBlockers: [
      {
        risk: "Customs clearance for specialized anamorphic lens kit.",
        impact: "May delay prep day by 4 hours if paperwork is incomplete.",
        mitigationPlan: "ATA Carnet documents pre-validated with French customs broker."
      }
    ],
    decisionsNeeded: [
      "Greenlight the ARRI Alexa 35 backup body line item in the Approvals Center."
    ],
    nextSteps: [
      "Conduct pre-departure production call with European lead on Thursday.",
      "Issue final call sheets to talent reps on Friday morning."
    ],
    metricsSnapshot: [
      { label: "Production Budget Status", value: "Under by 4%", trend: "€3,200 cushion" },
      { label: "Shoot Permissions", value: "100% Granted", trend: "Paris permits cleared" },
      { label: "Crew Logistics", value: "9/9 Confirmed", trend: "Complete" }
    ]
  }
];

export const initialRecommendations: StrategicRecommendation[] = [
  {
    id: "rec_1",
    clientId: "cli_1",
    category: "systems_automation",
    title: "Automated LP Onboarding & Interactive Cap Table Pipeline",
    opportunityDescription: "Currently, incoming LP documentation and compliance KYC forms are handled via email threads with manual PDF verification. By deploying a streamlined Typeform/DocuSign pipeline integrated directly into Carta, we can eliminate 85% of manual email ping-pong.",
    expectedImpact: "Saves ~6 hours of executive and associate time per closing; delivers a frictionless luxury experience for institutional LPs.",
    implementationEffort: "low",
    priorityLevel: "strategic",
    recommendedTimeline: "Q3 Sprint (3-5 days implementation)",
    status: "proposed",
    actionItems: [
      "Build secure DocuSign web intake template",
      "Connect automated webhook to shared Google Drive & Carta data room",
      "Test end-to-end flow with sample test signatory"
    ]
  },
  {
    id: "rec_2",
    clientId: "cli_1",
    category: "cost_savings",
    title: "SaaS Stack Consolidation & Subscription Audit ($14,800/yr savings)",
    opportunityDescription: "Our audit of Arkgate's software stack identified 4 overlapping tools across CRM, document storage, and video recording (e.g. redundant Zoom Enterprise + Google Meet, duplicate Loom + Supernormal licenses, unused PitchBook seats).",
    expectedImpact: "Immediate direct reduction of $1,230/month ($14,760 annually) in software overhead without impacting team output.",
    implementationEffort: "low",
    priorityLevel: "high",
    recommendedTimeline: "Immediate 7-Day Window (Before renewal dates)",
    status: "proposed",
    actionItems: [
      "Cancel 3 inactive PitchBook seat add-ons",
      "Consolidate team on Google Workspace Enterprise",
      "Downgrade unused legacy storage tiers"
    ]
  },
  {
    id: "rec_3",
    clientId: "cli_1",
    category: "productivity",
    title: "AI-Powered Meeting Intelligence & Executive Follow-Up Engine",
    opportunityDescription: "Integrate automated meeting transcription with customized prompt templates that automatically extract decision logs, partner assignments, and founders' key metrics into Notion within 5 minutes of call completion.",
    expectedImpact: "Eliminates partner note-taking; ensures zero dropped action items across 30+ weekly founder discovery calls.",
    implementationEffort: "medium",
    priorityLevel: "growth",
    recommendedTimeline: "Next 2 Weeks",
    status: "greenlit",
    actionItems: [
      "Configure Granola / Otter API integration with Notion Database",
      "Train partner prompt model for venture capital term sheet heuristics"
    ]
  },
  {
    id: "rec_4",
    clientId: "cli_2",
    category: "operations",
    title: "Cloud-Based Raw Footage Ingestion & Frame.io Asset Governance",
    opportunityDescription: "Implement a standardized naming and automated cloud proxy upload pipeline for all high-resolution fashion shoot footage directly from location DIT carts.",
    expectedImpact: "Reduces post-production turnaround from 72 hours to same-day delivery for luxury fashion brand clients.",
    implementationEffort: "medium",
    priorityLevel: "high",
    recommendedTimeline: "Prior to Paris Fashion Week",
    status: "greenlit"
  },
  {
    id: "rec_5",
    clientId: "cli_2",
    category: "business_growth",
    title: "Editorial Retainer Tiering for High-Volume Luxury Fashion Houses",
    opportunityDescription: "Package ongoing monthly campaign content retainers ($8,500/mo base) with guaranteed 48-hour turnarounds, converting seasonal one-off shoots into predictable multi-quarter recurring revenue.",
    expectedImpact: "Increases baseline monthly recurring revenue by +$17,000/mo across next 2 quarters.",
    implementationEffort: "medium",
    priorityLevel: "strategic",
    recommendedTimeline: "Q4 2026 Commercial Rollout",
    status: "proposed"
  }
];

export const initialStrategicObjectives: ClientStrategicObjective[] = [
  {
    id: "obj_arkg_1",
    clientId: "cli_1",
    title: "Fund III Closing & Institutional Capital Accumulation ($75M)",
    category: "Revenue & Growth",
    strategicIntent: "Secure lead anchor commitments and close Fund III oversubscribed before December 2026.",
    progressStatus: "on_track",
    outcomeDescription: "Currently at $58M in signed LP commitments (77% toward $75M target). All legal documentation, data rooms, and capital call mechanisms are operating smoothly.",
    milestones: [
      {
        id: "m_1",
        title: "Complete Institutional Data Room & Cap Table Audits",
        targetTimeline: "Q2 2026",
        completed: true,
        outcomeAchieved: "Data room certified by top-tier fund counsel with zero compliance findings.",
        owner: "assistant"
      },
      {
        id: "m_2",
        title: "Host Global LP Annual Summit (85+ Institutional Attendees)",
        targetTimeline: "September 2026",
        completed: false,
        owner: "assistant"
      },
      {
        id: "m_3",
        title: "Execute Final Tranche Fund III Closing Agreements",
        targetTimeline: "November 2026",
        completed: false,
        owner: "client"
      }
    ]
  },
  {
    id: "obj_arkg_2",
    clientId: "cli_1",
    title: "Executive Calendar Defense & 15+ Hours Weekly Focus Protection",
    category: "Executive Focus & Freedom",
    strategicIntent: "Shield Marcus from operational triage so partner time is strictly invested in deal evaluation and LP relationships.",
    progressStatus: "ahead",
    outcomeDescription: "Averaging 14.2 hours of protected deep-work blocks per week; inbox zero maintained daily; meeting prep dossiers delivered 24h prior to every call.",
    milestones: [
      {
        id: "m_4",
        title: "Implement Strict 25-Min Meeting & 10-Min Buffer Heuristics",
        targetTimeline: "July 2026",
        completed: true,
        outcomeAchieved: "Zero back-to-back meeting fatigue across 6 consecutive weeks.",
        owner: "assistant"
      },
      {
        id: "m_5",
        title: "Automate Tier-1 Investor Inbound Triage Protocol",
        targetTimeline: "August 2026",
        completed: true,
        outcomeAchieved: "Unsolicited pitch decks auto-routed to associate queue within 3 minutes.",
        owner: "assistant"
      }
    ]
  },
  {
    id: "obj_strk_1",
    clientId: "cli_2",
    title: "European Luxury Campaign Expansion & Milan/Paris Presence",
    category: "Brand & Market Position",
    strategicIntent: "Establish Stark Media as the premier boutique visual production house for European heritage fashion brands.",
    progressStatus: "on_track",
    outcomeDescription: "3 major European runway/editorial contracts locked for Q3/Q4; production crew network established in Paris and London.",
    milestones: [
      {
        id: "m_strk_1",
        title: "Establish French Production Logistics & Crew Network",
        targetTimeline: "August 2026",
        completed: true,
        outcomeAchieved: "Vetted 12 Parisian crew specialists with negotiated corporate day-rates.",
        owner: "assistant"
      },
      {
        id: "m_strk_2",
        title: "Deliver Paris Fashion Week SS27 Campaign Showcase",
        targetTimeline: "September 2026",
        completed: false,
        owner: "client"
      }
    ]
  }
];

export const initialClientKnowledgeDocs: ClientKnowledgeDocument[] = [
  {
    id: "ckb_1",
    clientId: "cli_1",
    title: "Arkgate Ventures: Executive Operating Manual & Decision Framework",
    category: "Business Manuals",
    summary: "Complete reference for Marcus's decision rules, delegation matrix, communication protocols, and vendor authorities.",
    content: `# Arkgate Ventures Executive Operating Manual

## 1. Core Decision-Making Matrix
- **Tier 1 ($0 - $5,000)**: Autonomous approval by Executive Assistant (travel rebookings, software renewals, recurring catering, logistics).
- **Tier 2 ($5,000 - $25,000)**: Fast async review via Briefing Center (LP summit vendors, PR contracts, legal retainer invoices).
- **Tier 3 ($25,000+)**: Requires partner alignment & formal signature.

## 2. Executive Calendar Defense Rules
- **No internal meetings before 10:00 AM PST.**
- **All pitch meetings capped at 25 minutes** with a mandatory 5-minute pre-brief review and 10-minute post-call buffer.
- **Deep Work Blocks**: Tuesdays and Thursdays 1:30 PM - 4:30 PM are strictly protected and never booked over without explicit verbal override.

## 3. Communication Standards
- **Slack**: Primary channel for urgent matters (<2 hr SLA).
- **Executive Briefing Center**: Centralized hub for all approvals, deliverables, weekly briefings, and recommendations.
- **Email**: External stakeholders only. All investor emails tagged with Priority markers.`,
    lastUpdated: "2026-08-20",
    author: "Olivia Vance (Chief of Staff)",
    tags: ["Operating Manual", "Decision Matrix", "Calendar Rules"]
  },
  {
    id: "ckb_2",
    clientId: "cli_1",
    title: "LP Investor Communication & Data Room Security SOP",
    category: "Company SOPs",
    summary: "Standard operating procedure for handling prospective LP inquiries, NDA verification, and secure data room granting.",
    content: `# LP Communication & Data Room Protocol

## Step 1: Inbound Investor Verification
1. Cross-reference prospect in Affinity CRM and PitchBook.
2. Confirm institutional or accredited status.

## Step 2: NDA Verification
1. Send automated Clickwrap NDA via Carta/DocuSign.
2. Once signed, system automatically archives executed PDF into \`01_Administrative_Legal/Executed_NDAs\`.

## Step 3: Tiered Data Room Access
- **Tier A (General Overview)**: Pitch Deck, Fund Thesis, Partner Bios.
- **Tier B (Full Diligence)**: Audited track record, cap table models, LPA draft (requires Marcus's explicit greenlight).`,
    lastUpdated: "2026-08-15",
    author: "Olivia Vance (Chief of Staff)",
    tags: ["Investor Relations", "Compliance", "Data Room", "SOP"]
  },
  {
    id: "ckb_3",
    clientId: "cli_1",
    title: "Centralized Resource Directory & Secure Vault Access",
    category: "Key Resources & Vaults",
    summary: "Quick access links to company workspaces, shared 1Password vaults, Carta, bank conduits, and master Google Drive folders.",
    content: `# Centralized Company Resource Directory

- **Master Google Drive**: [https://drive.google.com/drive/folders/ARKG_Arkgate_Ventures](https://drive.google.com/drive/folders/ARKG_Arkgate_Ventures)
- **Carta Cap Table & Fund Admin**: [https://app.carta.com/arkgate-ventures](https://app.carta.com/arkgate-ventures)
- **Affinity CRM Dealflow**: [https://arkgate.affinity.co](https://arkgate.affinity.co)
- **Shared 1Password Vault**: Managed via \`ops@arkgatevc.com\`
- **LP Summit Figma Production File**: [https://figma.com/file/arkg-keynote-v3](https://figma.com/file/arkg-keynote-v3)`,
    lastUpdated: "2026-08-22",
    author: "Olivia Vance (Chief of Staff)",
    tags: ["Vault", "Links", "Resources", "Credentials"],
    externalResourceUrl: "https://drive.google.com/drive/folders/ARKG_Arkgate_Ventures"
  }
];
