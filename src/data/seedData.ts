import { 
  Task, 
  Client, 
  ClientHoliday,
  Project, 
  TimeEntry, 
  ServicePackage, 
  Invoice, 
  PaymentRecord, 
  FreelancerExpense,
  ApprovalItem, 
  KnowledgeArticle, 
  Opportunity, 
  CEOGoal, 
  UserProfile,
  RateCalculatorInputs
} from '../types';

export const initialUserProfile: UserProfile = {
  fullName: "Olivia Vance",
  email: "hello.aespace@gmail.com",
  title: "Principal Executive Consultant & Studio Director",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  timezone: "America/New_York (EST)",
  workingHoursStart: "08:30",
  workingHoursEnd: "17:30",
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  currency: "$",
  monthlyRevenueTarget: 18000,
  weeklyCapacityHours: 35,
  googleDriveRootFolder: "https://drive.google.com/drive/folders/AEDMIN_STUDIO_ROOT",
  communicationEmail: "olivia@aedmin.space",
  defaultFileNamingPrefix: "AEDM",
  rememberMeSessionDays: 30
};

export const initialClients: Client[] = [
  {
    id: "cli_1",
    code: "ARKG",
    name: "Arkgate Ventures",
    primaryContact: "Marcus Vance",
    email: "marcus@arkgatevc.com",
    phone: "+1 (415) 890-3321",
    company: "Arkgate Ventures LLC",
    status: "active",
    avatarColor: "bg-card-blue",
    contractType: "retainer",
    monthlyRetainerFee: 5500,
    hourlyRate: 150,
    purchasedHours: 40,
    usedHoursThisMonth: 31.5,
    totalRevenueYTD: 44000,
    relationshipHealth: "exceptional",
    onboardingProgress: 100,
    joinedDate: "2025-10-15",
    portalToken: "arkg-vault-88219",
    portalCustomNotes: "Welcome Marcus. All LP summit logistics, cap table models, and monthly deliverable sign-offs are tracked live below.",
    timezone: "America/Los_Angeles",
    city: "San Francisco",
    country: "United States",
    countryCode: "US",
    flagEmoji: "🇺🇸",
    workingHoursStart: "09:00",
    workingHoursEnd: "18:00",
    preferredCommsStart: "10:30",
    preferredCommsEnd: "16:30",
    meetingAvailabilityStart: "10:00",
    meetingAvailabilityEnd: "16:00",
    meetingDays: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    maxMeetingDurationMins: 25,
    communicationChannels: ["Slack", "Email", "Loom"],
    responseSlaHours: 4,
    isTravelModeActive: false,
    learnedPatterns: [
      { id: "lp_1", category: "reply_speed", pattern: "Peak Slack response speed between 10:30 AM - 11:45 AM PST", bestWindow: "10:30 - 11:45 AM PST", confidence: 96 },
      { id: "lp_2", category: "approval_time", pattern: "Signs off on deal docs and wire approvals on Thursday afternoons", bestWindow: "14:00 - 16:30 PST", confidence: 91 },
      { id: "lp_3", category: "deep_work", pattern: "Tuesday mornings reserved for LP partner meetings (Do not schedule syncs)", bestWindow: "08:30 - 11:00 PST", confidence: 98 }
    ],
    dailyRoutines: [
      { id: "cr_1_1", clientId: "cli_1", title: "Morning inbox sweep & LP high-priority filter", phase: "opening", completed: true, estimatedMinutes: 20, timeTarget: "08:45 AM" },
      { id: "cr_1_2", clientId: "cli_1", title: "Calendar audit: protect 25m investor call limits", phase: "opening", completed: true, estimatedMinutes: 15, timeTarget: "09:15 AM" },
      { id: "cr_1_3", clientId: "cli_1", title: "Midday partner alignment & dealflow status check", phase: "midday", completed: false, estimatedMinutes: 25, timeTarget: "12:30 PM" },
      { id: "cr_1_4", clientId: "cli_1", title: "EOD Async digest dispatch to #aedmin-arkgate-ops", phase: "eod", completed: false, estimatedMinutes: 20, timeTarget: "05:00 PM" },
    ],
    googleDriveFolderUrl: "https://drive.google.com/drive/folders/ARKG_Arkgate_Ventures",
    slackChannel: "#aedmin-arkgate-ops",
    onboardingPhases: [
      {
        id: 1,
        name: "Administrative & Contract Setup",
        description: "Legal agreements, billing setup, and workspace initialization.",
        completed: true,
        items: [
          { id: "ob_1_1", title: "Executed Master Services Agreement & NDA", completed: true },
          { id: "ob_1_2", title: "Stripe Recurring Retainer Autopay Configured", completed: true },
          { id: "ob_1_3", title: "AEDMIN Client Workspace & Drive Folders Generated", completed: true }
        ]
      },
      {
        id: 2,
        name: "Executive & Business Discovery",
        description: "Deep dive into communication patterns, stakeholders, and strategic goals.",
        completed: true,
        items: [
          { id: "ob_2_1", title: "Executive Style & Decision Intake Questionnaire", completed: true },
          { id: "ob_2_2", title: "Key Stakeholders & Vendor Map Documented", completed: true }
        ]
      },
      {
        id: 3,
        name: "Access & Security Setup",
        description: "1Password vault sharing, Google Workspace delegate access, and Slack.",
        completed: true,
        items: [
          { id: "ob_3_1", title: "Executive Email Delegation / Inbox Shared Access", completed: true },
          { id: "ob_3_2", title: "Calendar Management Permissions Assigned", completed: true },
          { id: "ob_3_3", title: "Shared 1Password Vault Provisioned", completed: true }
        ]
      },
      {
        id: 4,
        name: "Service & Workflow Setup",
        description: "Operating cadences, daily brief formatting, and weekly agendas established.",
        completed: true,
        items: [
          { id: "ob_4_1", title: "Daily Morning Briefing Format Approved", completed: true },
          { id: "ob_4_2", title: "Weekly Sync Cadence Set (Mon 9 AM)", completed: true }
        ]
      },
      {
        id: 5,
        name: "Official Kickoff",
        description: "Live 45-minute orientation and systems confirmation.",
        completed: true,
        items: [
          { id: "ob_5_1", title: "Kickoff Call Conducted & Minutes Filed", completed: true }
        ]
      },
      {
        id: 6,
        name: "Active Operations & Rhythm",
        description: "Full steady-state executive support.",
        completed: true,
        items: [
          { id: "ob_6_1", title: "Steady State Operational Rhythm Active", completed: true }
        ]
      }
    ],
    intelligence: {
      executiveProfile: {
        preferredName: "Marcus",
        pronunciation: "MAR-kus",
        timezone: "America/Los_Angeles (PST)",
        communicationStyle: "Async-first, bullet points only, high autonomy. Prefers Slack over email.",
        meetingPreferences: "No meetings before 10 AM PST. Strict 25-minute caps. Never schedule back-to-back without 10m buffer.",
        decisionMakingStyle: "Give 2-3 structured recommendations with pros/cons and a default choice.",
        reportingPreferences: "Daily EOD async check-in on Slack, Friday high-level executive recap."
      },
      businessProfile: {
        company: "Arkgate Ventures",
        industry: "Early-Stage Venture Capital & Tech Incubator",
        website: "https://arkgatevc.com",
        coreServices: "Seed investing, LP relations, Founder portfolio acceleration",
        currentGoals: "Close Fund III ($75M) by Q4 2026; streamline portfolio quarterly updates.",
        keyChallenges: "Overwhelmed email inbox (200+ pitch decks/week), overlapping LP calendar invites.",
        keyTeamMembers: "Sarah Jenkins (Partner), Dev Shah (Venture Associate)",
        primaryVendors: "Carta, Affinity CRM, Notion, PitchBook",
        coreSystems: "Google Workspace, Slack Enterprise, Notion, Carta, Superhuman"
      },
      relationshipProfile: {
        birthday: "1982-11-14",
        hobbies: "Cycling, vintage watch collecting, specialty espresso brewing",
        interests: "Aerospace technology, architecture, modern photography",
        travelPreferences: "Window seat, United 1K, boutique design hotels (Proper, Edition)",
        favoriteRestaurants: "Benu (SF), Cotogna (SF), Gramercy Tavern (NYC)",
        giftIdeas: "Single-origin pour-over beans (Sey, Onyx), architectural monograph books",
        personalNotes: "Prefers oat milk flat whites. Loves when trip itineraries include local specialty cafe stops."
      },
      lifestyleContext: {
        familyMembers: "Spouse: Claire (architect); Daughter: Maya (age 7)",
        importantDates: "Wedding Anniversary: June 22; Maya's Birthday: Sept 18",
        wellnessRoutine: "Pilates Tuesday & Thursday 7:00 AM; protect morning block.",
        dietaryRestrictions: "Pescatarian, lactose intolerant (strict dairy-free).",
        travelHabits: "Carry-on luggage only; pre-books airport lounges."
      },
      memoryVault: [
        {
          id: "mem_1",
          date: "2026-08-14",
          title: "LP Annual Meeting Venue Preference",
          content: "Marcus explicitly noted that hotel conference rooms feel too sterile. Preferred booking a private art gallery in SoHo for next year's LP dinner.",
          category: "preference",
          visibility: "internal_only"
        },
        {
          id: "mem_2",
          date: "2026-07-28",
          title: "Pitch Deck Triage Heuristics",
          content: "Auto-decline any cold inbound decks without a warm intro or clear ARR traction >$50k/mo unless focused on space robotics.",
          category: "lesson_learned",
          visibility: "internal_only"
        }
      ]
    }
  },
  {
    id: "cli_2",
    code: "STRK",
    name: "Stark Media Studio",
    primaryContact: "Elena Rostova",
    email: "elena@starkmediastudio.com",
    phone: "+1 (212) 555-0199",
    company: "Stark Media LLC",
    status: "active",
    avatarColor: "bg-card-pink",
    contractType: "retainer",
    monthlyRetainerFee: 6200,
    hourlyRate: 160,
    purchasedHours: 45,
    usedHoursThisMonth: 41.0,
    totalRevenueYTD: 49600,
    relationshipHealth: "exceptional",
    onboardingProgress: 100,
    joinedDate: "2025-11-01",
    portalToken: "strk-vault-44120",
    portalCustomNotes: "Stark Media Creative Workspace. Review in-flight shoots, equipment sign-offs, and monthly retainer utilization in real-time.",
    timezone: "America/New_York",
    city: "New York",
    country: "United States",
    countryCode: "US",
    flagEmoji: "🇺🇸",
    workingHoursStart: "09:30",
    workingHoursEnd: "18:30",
    preferredCommsStart: "11:00",
    preferredCommsEnd: "17:00",
    meetingAvailabilityStart: "13:00",
    meetingAvailabilityEnd: "17:30",
    meetingDays: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    maxMeetingDurationMins: 30,
    communicationChannels: ["Voice Memos", "Figma", "Slack"],
    responseSlaHours: 2,
    isTravelModeActive: true,
    travelCity: "Paris",
    travelCountry: "France",
    travelTimezone: "Europe/Paris",
    travelStartDate: "2026-08-25",
    travelEndDate: "2026-09-05",
    travelReason: "Paris Fashion Week Creative Shoot Direction & Editorial Campaign",
    learnedPatterns: [
      { id: "lp_4", category: "approval_time", pattern: "Reviews creative proofing and moodboards at 15:00 CEST while in Paris", bestWindow: "14:30 - 16:00 CEST", confidence: 94 },
      { id: "lp_5", category: "reply_speed", pattern: "Answers voice memos in <15 mins during European transit hours", bestWindow: "09:00 - 10:00 CEST", confidence: 89 }
    ],
    dailyRoutines: [
      { id: "cr_2_1", clientId: "cli_2", title: "Figma comment & voice memo sweep", phase: "opening", completed: true, estimatedMinutes: 15, timeTarget: "09:00 AM" },
      { id: "cr_2_2", clientId: "cli_2", title: "Vendor equipment & studio shoot budget sign-off review", phase: "midday", completed: true, estimatedMinutes: 20, timeTarget: "01:30 PM" },
      { id: "cr_2_3", clientId: "cli_2", title: "Digital asset deliverables sync to Frame.io", phase: "eod", completed: false, estimatedMinutes: 25, timeTarget: "04:30 PM" },
      { id: "cr_2_4", clientId: "cli_2", title: "EOD Voice recap dispatch to Elena", phase: "eod", completed: false, estimatedMinutes: 10, timeTarget: "05:15 PM" },
    ],
    googleDriveFolderUrl: "https://drive.google.com/drive/folders/STRK_Stark_Media",
    slackChannel: "#aedmin-stark-direct",
    onboardingPhases: [
      { id: 1, name: "Administrative Setup", description: "Completed onboarding phases", completed: true, items: [{ id: "s1", title: "Complete", completed: true }] },
      { id: 2, name: "Business Discovery", description: "Completed onboarding phases", completed: true, items: [{ id: "s2", title: "Complete", completed: true }] },
      { id: 3, name: "Access Setup", description: "Completed onboarding phases", completed: true, items: [{ id: "s3", title: "Complete", completed: true }] },
      { id: 4, name: "Service Setup", description: "Completed onboarding phases", completed: true, items: [{ id: "s4", title: "Complete", completed: true }] },
      { id: 5, name: "Kickoff", description: "Completed onboarding phases", completed: true, items: [{ id: "s5", title: "Complete", completed: true }] },
      { id: 6, name: "Active Operations", description: "Steady state operations", completed: true, items: [{ id: "s6", title: "Active", completed: true }] }
    ],
    intelligence: {
      executiveProfile: {
        preferredName: "Elena",
        timezone: "America/New_York (EST)",
        communicationStyle: "Visual, expressive, fast-paced. Loves voice notes and Figma comment links.",
        meetingPreferences: "Afternoon work blocks preferred. Keeps Fridays completely meeting-free.",
        decisionMakingStyle: "Fast intuition backed by creative aesthetic criteria.",
        reportingPreferences: "End-of-day voice memo summary or concise bulleted Slack recap."
      },
      businessProfile: {
        company: "Stark Media Studio",
        industry: "Luxury Fashion & Lifestyle Creative Production",
        website: "https://starkmediastudio.com",
        coreServices: "Campaign direction, brand identity, editorial visual storytelling",
        currentGoals: "Launch Paris Fashion Week digital campaign; onboard 3 new luxury maison accounts.",
        keyChallenges: "Complex shoot production timelines, international vendor invoicing.",
        keyTeamMembers: "Julian (Senior Art Director), Chloe (Production Coordinator)",
        primaryVendors: "Frame.io, Capture One, Dropbox, Runway ML",
        coreSystems: "Apple Workspace, Figma, Notion, Slack, Frame.io"
      },
      relationshipProfile: {
        birthday: "1988-04-03",
        hobbies: "Contemporary art, organic winemaking, trail running in Hudson Valley",
        interests: "Minimalist interior design, typography archives, film photography",
        travelPreferences: "Air France Business, boutique hotels (Le Marais, Hotel Costes)",
        favoriteRestaurants: "Le Chateaubriand (Paris), Buvette (NYC), Via Carota (NYC)",
        giftIdeas: "Art gallery exhibition prints, botanical candles, natural wines",
        personalNotes: "Huge fan of classic typography publications and Swiss design posters."
      },
      lifestyleContext: {
        familyMembers: "Partner: David; Dog: Bruno (Italian Greyhound)",
        wellnessRoutine: "Reformer Pilates at 8:00 AM MWF; evening runs.",
        dietaryRestrictions: "Gluten-free preference, loves green matcha teas."
      },
      memoryVault: [
        {
          id: "mem_3",
          date: "2026-08-10",
          title: "Production Budget Sign-off Authority",
          content: "Elena pre-approved Olivia to sign off on vendor equipment rentals up to $3,500 without requiring synchronous ping.",
          category: "preference",
          visibility: "internal_only"
        }
      ]
    }
  },
  {
    id: "cli_3",
    code: "WAYN",
    name: "Wayne Technologies",
    primaryContact: "Harrison Wayne",
    email: "harrison@waynetech.io",
    phone: "+1 (617) 490-1288",
    company: "Wayne AI & Robotics Systems",
    status: "onboarding",
    avatarColor: "bg-card-yellow",
    contractType: "retainer",
    monthlyRetainerFee: 4800,
    hourlyRate: 150,
    purchasedHours: 32,
    usedHoursThisMonth: 12.0,
    totalRevenueYTD: 9600,
    relationshipHealth: "good",
    onboardingProgress: 65,
    joinedDate: "2026-07-20",
    portalToken: "wayn-vault-99312",
    portalCustomNotes: "Wayne Tech Executive Dashboard. Autonomous drone telemetry pilots, Linear board status, and onboarding milestone tracker.",
    timezone: "America/New_York",
    city: "Boston",
    country: "United States",
    countryCode: "US",
    flagEmoji: "🇺🇸",
    workingHoursStart: "08:00",
    workingHoursEnd: "17:00",
    preferredCommsStart: "08:30",
    preferredCommsEnd: "12:00",
    meetingAvailabilityStart: "09:00",
    meetingAvailabilityEnd: "12:00",
    meetingDays: ["Monday", "Wednesday", "Friday"],
    maxMeetingDurationMins: 20,
    communicationChannels: ["Email", "Linear", "Slack"],
    responseSlaHours: 6,
    isTravelModeActive: false,
    learnedPatterns: [
      { id: "lp_6", category: "reply_speed", pattern: "Early morning response surge between 08:30 - 10:00 AM EST", bestWindow: "08:30 - 10:00 AM EST", confidence: 93 },
      { id: "lp_7", category: "deep_work", pattern: "Protects Tuesday & Thursday afternoons for engineering deep work", bestWindow: "13:00 - 17:00 EST", confidence: 99 }
    ],
    dailyRoutines: [
      { id: "cr_3_1", clientId: "cli_3", title: "Linear board issue triage & engineer priority check", phase: "opening", completed: true, estimatedMinutes: 20, timeTarget: "09:30 AM" },
      { id: "cr_3_2", clientId: "cli_3", title: "Review telemetry pilot SLA metrics with Dr. Lin", phase: "midday", completed: false, estimatedMinutes: 20, timeTarget: "02:00 PM" },
      { id: "cr_3_3", clientId: "cli_3", title: "Onboarding Phase 4 milestone check-in", phase: "eod", completed: false, estimatedMinutes: 15, timeTarget: "04:45 PM" },
    ],
    googleDriveFolderUrl: "https://drive.google.com/drive/folders/WAYN_Wayne_Tech",
    slackChannel: "#aedmin-waynetech-onboarding",
    onboardingPhases: [
      {
        id: 1,
        name: "Administrative Setup",
        description: "Contracts and billing configuration",
        completed: true,
        items: [
          { id: "w_1", title: "MSA & Custom IP Schedule Executed", completed: true },
          { id: "w_2", title: "Invoiced Retainer Deposit ($4,800) Paid", completed: true }
        ]
      },
      {
        id: 2,
        name: "Business Discovery",
        description: "Organizational mapping and tech stack audit",
        completed: true,
        items: [
          { id: "w_3", title: "Executive Style Questionnaire completed", completed: true },
          { id: "w_4", title: "Operations & Key Calendar audit", completed: true }
        ]
      },
      {
        id: 3,
        name: "Access Setup",
        description: "Credential and system delegation",
        completed: true,
        items: [
          { id: "w_5", title: "Google Workspace & Calendar delegation", completed: true },
          { id: "w_6", title: "Jira / Linear board guest permissions", completed: true }
        ]
      },
      {
        id: 4,
        name: "Service Setup",
        description: "Operating guidelines & templates",
        completed: false,
        items: [
          { id: "w_7", title: "Weekly investor update template drafting", completed: true },
          { id: "w_8", title: "Establish inbox triage protocol rules", completed: false }
        ]
      },
      {
        id: 5,
        name: "Kickoff",
        description: "Official launch review",
        completed: false,
        items: [
          { id: "w_9", title: "Review first full sprint operating review", completed: false }
        ]
      },
      {
        id: 6,
        name: "Active Operations",
        description: "Steady state",
        completed: false,
        items: [
          { id: "w_10", title: "Transfer to ongoing retainer rhythm", completed: false }
        ]
      }
    ],
    intelligence: {
      executiveProfile: {
        preferredName: "Harrison",
        timezone: "America/New_York (EST)",
        communicationStyle: "Direct, analytical, engineering-oriented. Prefers concise numbers over long narratives.",
        meetingPreferences: "Strictly protects Tuesday & Thursday afternoons for engineering deep dives.",
        decisionMakingStyle: "Matrix comparisons with clear numerical scorecards.",
        reportingPreferences: "Weekly dashboard metrics table."
      },
      businessProfile: {
        company: "Wayne Technologies",
        industry: "Autonomous Industrial Drone Software",
        website: "https://waynetech.io",
        coreServices: "B2B SaaS drone fleet management, real-time telemetry API",
        currentGoals: "Expand enterprise pilots to 10 Tier-1 logistics hubs.",
        keyChallenges: "Executive context switching between hardware R&D and investor fundraising.",
        keyTeamMembers: "Dr. Karen Lin (Chief Scientist), Vikram Ray (VP Sales)",
        primaryVendors: "AWS, Datadog, GitHub Enterprise, HubSpot",
        coreSystems: "Google Workspace, Linear, Slack, HubSpot"
      },
      relationshipProfile: {
        birthday: "1979-09-29",
        hobbies: "Competitive chess, triathlon training, astronomy",
        interests: "Deep tech, quantum computing, aerospace",
        travelPreferences: "Star Alliance Gold; stays near technical campuses.",
        favoriteRestaurants: "O Ya (Boston), Blue Hill at Stone Barns",
        giftIdeas: "High-end mechanical puzzles, specialty teas, telescope optics gear",
        personalNotes: "Appreciates ultra-structured agendas with exact minute allocations."
      },
      lifestyleContext: {
        wellnessRoutine: "Daily 5:30 AM swim training; bedtime strictly by 10:00 PM."
      },
      memoryVault: [
        {
          id: "mem_4",
          date: "2026-08-01",
          title: "Investor Deck Versioning",
          content: "Always use standard AEDMIN file naming syntax with exact timestamp for Series B data room files.",
          category: "preference",
          visibility: "internal_only"
        }
      ]
    }
  },
  {
    id: "cli_4",
    code: "NXDS",
    name: "Nexus Design Collective",
    primaryContact: "Siddharth Mehta",
    email: "sid@nexuscollective.co",
    phone: "+44 20 7946 0912",
    company: "Nexus Collective Ltd",
    status: "active",
    avatarColor: "bg-card-green",
    contractType: "project",
    hourlyRate: 165,
    usedHoursThisMonth: 18.5,
    totalRevenueYTD: 28500,
    relationshipHealth: "good",
    onboardingProgress: 100,
    joinedDate: "2026-01-10",
    portalToken: "nxds-vault-11048",
    portalCustomNotes: "Nexus Design Collective Studio Hub. UK/US timezone synchronization, brand sprint deliverables, and milestone assets.",
    timezone: "Europe/London",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    flagEmoji: "🇬🇧",
    workingHoursStart: "09:00",
    workingHoursEnd: "18:00",
    preferredCommsStart: "14:00",
    preferredCommsEnd: "17:30",
    meetingAvailabilityStart: "14:00",
    meetingAvailabilityEnd: "17:30",
    meetingDays: ["Tuesday", "Wednesday", "Thursday"],
    maxMeetingDurationMins: 45,
    communicationChannels: ["Slack", "Figma", "WhatsApp"],
    responseSlaHours: 3,
    isTravelModeActive: false,
    learnedPatterns: [
      { id: "lp_8", category: "meeting_pref", pattern: "Optimal US-UK bridge overlap between 14:30 - 17:00 BST (09:30 - 12:00 EDT)", bestWindow: "14:30 - 17:00 BST", confidence: 97 },
      { id: "lp_9", category: "reply_speed", pattern: "Responds to WhatsApp voice memos within 20 mins during afternoon coffee runs", bestWindow: "15:00 - 16:30 BST", confidence: 92 }
    ],
    dailyRoutines: [
      { id: "cr_4_1", clientId: "cli_4", title: "London/US timezone synchronization & async handoff check", phase: "opening", completed: true, estimatedMinutes: 15, timeTarget: "08:30 AM" },
      { id: "cr_4_2", clientId: "cli_4", title: "Figma packaging sprint assets review with Aoi", phase: "midday", completed: false, estimatedMinutes: 30, timeTarget: "01:00 PM" },
      { id: "cr_4_3", clientId: "cli_4", title: "Friday status memo compilation & dispatch", phase: "eod", completed: false, estimatedMinutes: 20, timeTarget: "04:30 PM" },
    ],
    googleDriveFolderUrl: "https://drive.google.com/drive/folders/NXDS_Nexus_Design",
    slackChannel: "#aedmin-nexus-ops",
    onboardingPhases: [],
    intelligence: {
      executiveProfile: {
        preferredName: "Sid",
        timezone: "Europe/London (BST)",
        communicationStyle: "Warm, collaborative, concise. Loves bullet points and voice check-ins.",
        meetingPreferences: "Best between 14:00 - 18:00 London time for US overlap.",
        decisionMakingStyle: "Collaborative, highly appreciates creative point of view.",
        reportingPreferences: "Weekly Friday status deck."
      },
      businessProfile: {
        company: "Nexus Collective",
        industry: "Brand Architecture & Product Design",
        website: "https://nexuscollective.co",
        coreServices: "Global rebrands, packaging systems, design sprints",
        currentGoals: "Scale from 8 to 15 full-time creative leads.",
        keyChallenges: "Multi-timezone team synchronization across London, NY, and Tokyo.",
        keyTeamMembers: "Aoi (Design Principal), Liam (Operations Lead)",
        primaryVendors: "Figma, Notion, Slack, Harvest",
        coreSystems: "Notion, Google Workspace, Figma, Slack"
      },
      relationshipProfile: {
        hobbies: "Contemporary furniture restoration, architecture photography",
        interests: "Japanese stationery, mid-century Scandinavian design",
        travelPreferences: "British Airways Executive Club; boutique hotels",
        favoriteRestaurants: "St. JOHN (London), Dishoom (London)",
        giftIdeas: "Handmade ceramic mugs, Japanese fountain pens, design monographs",
        personalNotes: "Values thoughtful proactive follow-ups before milestones."
      },
      lifestyleContext: {
        travelHabits: "Frequently in NYC during spring and autumn design weeks."
      },
      memoryVault: []
    }
  },
  {
    id: "cli_5",
    code: "KRDS",
    name: "Kuroda Spatial Systems",
    primaryContact: "Kenji Kuroda",
    email: "kenji@kurodaspatial.jp",
    phone: "+81 3 5555 0142",
    company: "Kuroda Spatial Systems KK",
    status: "active",
    avatarColor: "bg-card-peach",
    contractType: "retainer",
    monthlyRetainerFee: 5000,
    hourlyRate: 175,
    purchasedHours: 30,
    usedHoursThisMonth: 14.5,
    totalRevenueYTD: 35000,
    relationshipHealth: "exceptional",
    onboardingProgress: 100,
    joinedDate: "2025-12-01",
    portalToken: "krds-vault-33019",
    portalCustomNotes: "Tokyo Operations Bridge. Spatial computing SDK launch assets, Asian market briefing, and async task status.",
    timezone: "Asia/Tokyo",
    city: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    flagEmoji: "🇯🇵",
    workingHoursStart: "09:30",
    workingHoursEnd: "18:30",
    preferredCommsStart: "10:00",
    preferredCommsEnd: "17:00",
    meetingAvailabilityStart: "08:30",
    meetingAvailabilityEnd: "11:30",
    meetingDays: ["Tuesday", "Wednesday", "Thursday"],
    maxMeetingDurationMins: 30,
    communicationChannels: ["Slack", "Notion", "Email"],
    responseSlaHours: 8,
    isTravelModeActive: false,
    learnedPatterns: [
      { id: "lp_10", category: "meeting_pref", pattern: "Prefers morning Tokyo calls (08:30 - 10:30 JST = 19:30 - 21:30 EDT previous evening)", bestWindow: "08:30 - 10:30 JST", confidence: 95 },
      { id: "lp_11", category: "reply_speed", pattern: "Reviews comprehensive asynchronous briefs at 10:00 JST start of Tokyo workday", bestWindow: "10:00 - 11:30 JST", confidence: 90 }
    ],
    dailyRoutines: [
      { id: "cr_5_1", clientId: "cli_5", title: "Tokyo evening handoff recap check & translation review", phase: "opening", completed: true, estimatedMinutes: 15, timeTarget: "08:30 AM" },
      { id: "cr_5_2", clientId: "cli_5", title: "Spatial SDK release notes validation", phase: "midday", completed: false, estimatedMinutes: 25, timeTarget: "01:30 PM" },
    ],
    googleDriveFolderUrl: "https://drive.google.com/drive/folders/KRDS_Kuroda_Spatial",
    slackChannel: "#aedmin-kuroda-tokyo",
    onboardingPhases: [],
    intelligence: {
      executiveProfile: {
        preferredName: "Kenji",
        timezone: "Asia/Tokyo (JST)",
        communicationStyle: "Ultra-precise, respectful, async-first. Prefers Notion RFCs and detailed agendas.",
        meetingPreferences: "Morning Tokyo slots or asynchronous video walkthroughs.",
        decisionMakingStyle: "Thorough, values technical rigor and clean execution.",
        reportingPreferences: "Bi-weekly sprint recap with milestone checklist."
      },
      businessProfile: {
        company: "Kuroda Spatial Systems",
        industry: "Spatial Computing & VisionOS Industrial Tools",
        website: "https://kurodaspatial.jp",
        coreServices: "VisionOS simulation engines, architectural LiDAR reconstruction",
        currentGoals: "Launch North America developer SDK beta.",
        keyChallenges: "Managing 13-hour time difference with US enterprise partners.",
        keyTeamMembers: "Yuki (Lead SDK Engineer), Rena (Global BD)",
        primaryVendors: "Apple Developer, AWS Tokyo, Notion",
        coreSystems: "Notion, GitHub, Google Workspace, Slack"
      },
      relationshipProfile: {
        hobbies: "Matcha ceremony, architecture walks in Omotesando, skiing in Niseko",
        interests: "Optics hardware, industrial robotics, brutalist architecture",
        travelPreferences: "ANA First / Business; Palace Hotel Tokyo",
        favoriteRestaurants: "Den (Tokyo), Sushi Sawada (Tokyo)",
        giftIdeas: "Single-estate Uji matcha, artisanal Japanese woodwork",
        personalNotes: "Appreciates clear timezone headers in all document titles."
      },
      lifestyleContext: {
        travelHabits: "Visits SF / Cupertino twice annually for WWDC and developer summits."
      },
      memoryVault: []
    }
  }
];

export const initialHolidays: ClientHoliday[] = [
  { id: "hol_1", countryCode: "US", countryName: "United States", name: "Labor Day", date: "2026-09-07", impact: "full_closure", affectedClientIds: ["cli_1", "cli_2", "cli_3"] },
  { id: "hol_2", countryCode: "GB", countryName: "United Kingdom", name: "Summer Bank Holiday", date: "2026-08-31", impact: "bank_holiday", affectedClientIds: ["cli_4"] },
  { id: "hol_3", countryCode: "JP", countryName: "Japan", name: "Respect for the Aged Day", date: "2026-09-21", impact: "full_closure", affectedClientIds: ["cli_5"] },
  { id: "hol_4", countryCode: "JP", countryName: "Japan", name: "Autumnal Equinox", date: "2026-09-23", impact: "full_closure", affectedClientIds: ["cli_5"] },
  { id: "hol_5", countryCode: "FR", countryName: "France", name: "All Saints' Day (Toussaint)", date: "2026-11-01", impact: "observance", affectedClientIds: ["cli_2"] },
  { id: "hol_6", countryCode: "US", countryName: "United States", name: "Thanksgiving Day", date: "2026-11-26", impact: "full_closure", affectedClientIds: ["cli_1", "cli_2", "cli_3"] },
  { id: "hol_7", countryCode: "US", countryName: "United States", name: "Day After Thanksgiving", date: "2026-11-27", impact: "observance", affectedClientIds: ["cli_1", "cli_2", "cli_3"] },
  { id: "hol_8", countryCode: "GB", countryName: "United Kingdom", name: "Christmas Day Bank Holiday", date: "2026-12-25", impact: "full_closure", affectedClientIds: ["cli_4"] },
  { id: "hol_9", countryCode: "GB", countryName: "United Kingdom", name: "Boxing Day Bank Holiday", date: "2026-12-28", impact: "bank_holiday", affectedClientIds: ["cli_4"] }
];

export const initialTasks: Task[] = [
  {
    id: "tsk_1",
    title: "Draft & Dispatch Weekly LP Executive Digest",
    clientId: "cli_1",
    clientName: "Arkgate Ventures",
    dueDate: "2026-08-26",
    dueTime: "11:30",
    status: "in_progress",
    priority: "urgent",
    importanceScore: 5,
    urgencyScore: 5,
    revenueImpactScore: 5,
    clientPriorityScore: 5,
    calculatedScore: 98,
    estimatedHours: 1.5,
    actualHours: 0.75,
    tags: ["Investor Relations", "Executive Briefing", "Weekly Cadence"],
    notes: "Compile Q3 portfolio highlights from Sarah and Dev. AttachCarta valuation summary link.",
    driveLink: "https://docs.google.com/document/d/ARKG_LP_Digest_Aug26",
    createdAt: "2026-08-24"
  },
  {
    id: "tsk_2",
    title: "Review Paris Fashion Week Call Sheet & Production Schedule",
    clientId: "cli_2",
    clientName: "Stark Media Studio",
    dueDate: "2026-08-26",
    dueTime: "14:00",
    status: "waiting_approval",
    priority: "urgent",
    importanceScore: 5,
    urgencyScore: 4,
    revenueImpactScore: 5,
    clientPriorityScore: 5,
    calculatedScore: 92,
    estimatedHours: 2.0,
    actualHours: 1.5,
    tags: ["Production", "Approvals", "Shoot Ops"],
    notes: "Awaiting Elena's final greenlight on lighting crew per-diem budget line.",
    driveLink: "https://docs.google.com/spreadsheets/d/STRK_Paris_Schedule_V02",
    createdAt: "2026-08-25"
  },
  {
    id: "tsk_3",
    title: "Configure Inbox Triage Protocol & Filter Rules",
    clientId: "cli_3",
    clientName: "Wayne Technologies",
    dueDate: "2026-08-26",
    dueTime: "16:30",
    status: "todo",
    priority: "high",
    importanceScore: 4,
    urgencyScore: 4,
    revenueImpactScore: 4,
    clientPriorityScore: 4,
    calculatedScore: 82,
    estimatedHours: 1.5,
    tags: ["Onboarding", "Systems Setup", "Gmail Ops"],
    notes: "Phase 4 Onboarding deliverable: set up automated labels for VIP LPs, Board Members, and Tier-1 Prospects.",
    createdAt: "2026-08-25"
  },
  {
    id: "tsk_4",
    title: "Generate End-of-Day Async Check-In Recaps",
    clientId: "cli_1",
    clientName: "Arkgate Ventures",
    dueDate: "2026-08-26",
    dueTime: "17:15",
    status: "todo",
    priority: "high",
    importanceScore: 4,
    urgencyScore: 5,
    revenueImpactScore: 4,
    clientPriorityScore: 5,
    calculatedScore: 88,
    estimatedHours: 0.5,
    tags: ["Workday Routine", "EOD", "Client Comms"],
    notes: "Run AEDMIN EOD Generator and push formatted update to #aedmin-arkgate-ops.",
    createdAt: "2026-08-26"
  },
  {
    id: "tsk_5",
    title: "Finalize Monthly Retainer Invoice & Hour Audit for August",
    clientId: "cli_2",
    clientName: "Stark Media Studio",
    dueDate: "2026-08-28",
    dueTime: "17:00",
    status: "todo",
    priority: "medium",
    importanceScore: 4,
    urgencyScore: 3,
    revenueImpactScore: 5,
    clientPriorityScore: 4,
    calculatedScore: 78,
    estimatedHours: 1.0,
    tags: ["Finance", "Invoicing", "Retainer Audit"],
    createdAt: "2026-08-24"
  },
  {
    id: "tsk_6",
    title: "Conduct Weekly Studio Google Drive Audit & File Naming Review",
    clientId: "cli_1",
    clientName: "Arkgate Ventures",
    dueDate: "2026-08-28",
    dueTime: "16:00",
    status: "todo",
    priority: "medium",
    importanceScore: 3,
    urgencyScore: 3,
    revenueImpactScore: 3,
    clientPriorityScore: 3,
    calculatedScore: 65,
    isRecurring: true,
    recurringInterval: "weekly",
    tags: ["Operations", "Google Drive", "SOP Audit"],
    createdAt: "2026-08-22"
  },
  {
    id: "tsk_7",
    title: "Prepare Board Deck Appendix Slides",
    clientId: "cli_1",
    clientName: "Arkgate Ventures",
    dueDate: "2026-08-24", // Overdue item for attention center demonstration
    dueTime: "17:00",
    status: "waiting_client",
    priority: "urgent",
    importanceScore: 5,
    urgencyScore: 5,
    revenueImpactScore: 4,
    clientPriorityScore: 5,
    calculatedScore: 94,
    estimatedHours: 2.0,
    actualHours: 1.0,
    tags: ["Board Prep", "Overdue", "Awaiting Assets"],
    notes: "Waiting on final cap table reconciliation export from Marcus.",
    createdAt: "2026-08-20"
  },
  {
    id: "tsk_8",
    title: "Reconcile Q2 Expense Receipts & Tax Deductions",
    clientId: "cli_1",
    clientName: "Arkgate Ventures",
    dueDate: "2026-08-25",
    status: "completed",
    priority: "medium",
    importanceScore: 3,
    urgencyScore: 4,
    revenueImpactScore: 3,
    clientPriorityScore: 3,
    calculatedScore: 70,
    estimatedHours: 1.5,
    actualHours: 1.4,
    tags: ["Finance", "Tax Prep"],
    completedAt: "2026-08-25T16:30:00Z",
    createdAt: "2026-08-21"
  }
];

export const initialProjects: Project[] = [
  {
    id: "prj_1",
    clientId: "cli_1",
    clientName: "Arkgate Ventures",
    name: "Fund III Annual Investor Summit & Data Room",
    description: "End-to-end executive event coordination, speaker briefing packs, venue curation, and LP collateral data room setup.",
    scope: "Design LP agendas, coordinate 12 venture partner travel arrangements, manage SoHo gallery venue contract, organize data room documents.",
    status: "in_progress",
    startDate: "2026-07-01",
    deadline: "2026-10-15",
    progress: 68,
    budget: 14500,
    deliverables: [
      "Curated 40-page LP Master Prospectus (PDF)",
      "Speaker Dossiers & Timing Breakdown",
      "Private Dinner RSVP & Dietary Protocol Matrix",
      "Executive Virtual Portal & Recorded Presentations Vault"
    ],
    milestones: [
      { id: "m_1", title: "Venue & Catering Contract Executed", dueDate: "2026-07-20", completed: true },
      { id: "m_2", title: "Keynote Speakers Confirmed & Slotted", dueDate: "2026-08-10", completed: true },
      { id: "m_3", title: "Master Slide Deck Design Review", dueDate: "2026-09-01", completed: false },
      { id: "m_4", title: "Final Rehearsal & Live Run-of-Show", dueDate: "2026-10-10", completed: false }
    ],
    driveFolderLink: "https://drive.google.com/drive/folders/ARKG_Fund_III_Summit_2026",
    reviewLink: "https://www.figma.com/file/arkgate-summit-assets"
  },
  {
    id: "prj_2",
    clientId: "cli_2",
    clientName: "Stark Media Studio",
    name: "Paris Fashion Week SS27 Campaign Orchestration",
    description: "Managing European crew logistics, equipment carnet manifests, talent schedules, and daily media asset distribution.",
    scope: "3 commercial shoots, 14 talent VIP bookings, daily on-set production support, and express dailies delivery to editorial publishers.",
    status: "in_progress",
    startDate: "2026-08-01",
    deadline: "2026-09-30",
    progress: 45,
    budget: 18000,
    deliverables: [
      "Consolidated Multi-Day Call Sheet & Route Maps",
      "International Carnet & Equipment Customs Clearance",
      "Frame.io Review Portal Setup & Permission Tiering"
    ],
    milestones: [
      { id: "m_21", title: "Studio & Location Permits Secured", dueDate: "2026-08-15", completed: true },
      { id: "m_22", title: "Production Schedule & Call Sheet Greenlit", dueDate: "2026-08-27", completed: false },
      { id: "m_23", title: "Shoot Days 1-3 Live Coordination", dueDate: "2026-09-18", completed: false }
    ],
    driveFolderLink: "https://drive.google.com/drive/folders/STRK_PFW_SS27_Production",
    reviewLink: "https://app.frame.io/projects/strk-pfw-27"
  },
  {
    id: "prj_3",
    clientId: "cli_3",
    clientName: "Wayne Technologies",
    name: "Series B Data Room & Executive Operations Setup",
    description: "Structuring standard corporate folders, board minutes repository, investor update systems, and CEO calendar defense.",
    scope: "Clean up 2 years of backlog documentation, establish standard naming SOPs, train founders on async executive protocol.",
    status: "planning",
    startDate: "2026-08-01",
    deadline: "2026-09-15",
    progress: 30,
    budget: 8500,
    deliverables: [
      "Due Diligence Index & Cleaned Google Drive Structure",
      "Automated Monthly Metrics Dashboard Template",
      "Executive Assistant Operating Manual for Wayne Tech"
    ],
    milestones: [
      { id: "m_31", title: "Access Audit & Security Delegation", dueDate: "2026-08-15", completed: true },
      { id: "m_32", title: "Data Room Index Hierarchy Complete", dueDate: "2026-08-30", completed: false }
    ]
  }
];

export const initialTimeEntries: TimeEntry[] = [
  {
    id: "tm_1",
    date: "2026-08-26",
    startTime: "09:00",
    endTime: "10:30",
    durationMinutes: 90,
    isBillable: true,
    clientId: "cli_1",
    clientName: "Arkgate Ventures",
    projectId: "prj_1",
    projectName: "Fund III Summit",
    taskId: "tsk_1",
    taskTitle: "Draft & Dispatch Weekly LP Executive Digest",
    hourlyRate: 150,
    value: 225,
    notes: "Aggregated Q3 portfolio returns, checked Carta cap table revisions, drafted email digest.",
    tags: ["Investor Relations", "Deep Work"],
    allocations: [
      { id: "alc_1", targetType: "project", targetId: "prj_1", targetName: "Fund III Summit", percentage: 70 },
      { id: "alc_2", targetType: "client", targetId: "cli_1", targetName: "Arkgate Ventures - General Ops", percentage: 30 }
    ],
    createdAt: "2026-08-26T10:30:00Z"
  },
  {
    id: "tm_2",
    date: "2026-08-26",
    startTime: "10:45",
    endTime: "11:45",
    durationMinutes: 60,
    isBillable: true,
    clientId: "cli_2",
    clientName: "Stark Media Studio",
    projectId: "prj_2",
    projectName: "Paris Fashion Week SS27",
    taskId: "tsk_2",
    taskTitle: "Review Paris Fashion Week Call Sheet & Production Schedule",
    hourlyRate: 160,
    value: 160,
    notes: "Cross-checked Paris transport logistics, reconciled van rental quotes, updated Google Sheets schedule.",
    tags: ["Production", "Logistics"],
    allocations: [
      { id: "alc_3", targetType: "project", targetId: "prj_2", targetName: "PFW Production", percentage: 100 }
    ],
    createdAt: "2026-08-26T11:45:00Z"
  },
  {
    id: "tm_3",
    date: "2026-08-25",
    startTime: "13:00",
    endTime: "15:00",
    durationMinutes: 120,
    isBillable: true,
    clientId: "cli_3",
    clientName: "Wayne Technologies",
    projectId: "prj_3",
    projectName: "Series B Data Room",
    hourlyRate: 150,
    value: 300,
    notes: "Audited Wayne Tech cloud drives and standardized file names for historical contracts.",
    tags: ["Data Room", "Google Drive"],
    createdAt: "2026-08-25T15:00:00Z"
  },
  {
    id: "tm_4",
    date: "2026-08-25",
    startTime: "16:00",
    endTime: "17:00",
    durationMinutes: 60,
    isBillable: false,
    clientId: "cli_1",
    clientName: "AEDMIN Studio Ops",
    hourlyRate: 0,
    value: 0,
    notes: "Studio bookkeeping, rate calculator adjustments, and Knowledge HQ SOP updates.",
    tags: ["Internal Ops", "Non-Billable"],
    createdAt: "2026-08-25T17:00:00Z"
  }
];

export const initialServices: ServicePackage[] = [
  {
    id: "srv_1",
    name: "Executive Assistant & Chief of Staff Retainer",
    category: "Executive Assistance",
    description: "Dedicated tier-1 executive partnership managing calendar defense, inbox zero triage, travel curation, and board coordination.",
    scope: [
      "Continuous daily calendar management and defensive scheduling",
      "Executive inbox triage and proactive draft replies",
      "VIP travel coordination with hyper-detailed digital itineraries",
      "Meeting agendas, real-time board minutes, and action item tracking",
      "Daily Morning Executive Briefing and End-of-Day async recaps"
    ],
    deliverables: [
      "Daily Morning Brief (Slack/Email)",
      "Weekly Strategic Sync Agenda & Priority Audit",
      "Zero-Conflict Executive Calendar",
      "Executive Relationship Intelligence Vault"
    ],
    workflowSteps: [
      "08:30 Morning Triage: Inbox Zero & Priority Scrub",
      "12:30 Midday Check: Unblock stuck tasks & pings",
      "17:00 EOD Routine: Update status, log hours, dispatch recap"
    ],
    estimatedTimeline: "Ongoing Monthly Retainer (30-50 hours/mo)",
    pricingModel: "Monthly Retainer",
    baseRate: 5500,
    targetMarginPercentage: 78,
    sopReferences: ["SOP-EA-001: Inbox Triage Protocols", "SOP-EA-002: Travel Curation Standards"],
    isActive: true
  },
  {
    id: "srv_2",
    name: "Online Business Management & Operations Architecture",
    category: "Operations",
    description: "Systematizing client workspaces, establishing Notion/Linear pipelines, automating billing, and managing subcontractors.",
    scope: [
      "End-to-end SOP documentation and process mapping",
      "Project management workspace architecture (Notion / Linear / ClickUp)",
      "Vendor and subcontractor onboarding and milestone oversight",
      "Google Drive directory architecture and file naming governance"
    ],
    deliverables: [
      "Master Company Wiki & Second Brain Setup",
      "Standard Operating Procedures (SOP) Library (15+ core SOPs)",
      "Automated Client Onboarding Flow"
    ],
    workflowSteps: [
      "Phase 1: Deep Operations Audit & Bottleneck Mapping",
      "Phase 2: Workspace Architecture & Tool Consolidation",
      "Phase 3: Team Training & Standardized Operating Rhythm"
    ],
    estimatedTimeline: "6-8 Weeks Sprint or $4,800/mo Retainer",
    pricingModel: "Monthly Retainer",
    baseRate: 4800,
    targetMarginPercentage: 82,
    sopReferences: ["SOP-OPS-010: Google Drive Architecture Rules"],
    isActive: true
  },
  {
    id: "srv_3",
    name: "Brand Identity & Visual System Design",
    category: "Design & Branding",
    description: "Editorial-grade brand identities for boutique studios, venture funds, and executive consultants.",
    scope: [
      "Visual direction & moodboard exploration",
      "Primary logo, logomarks, typography system & color tokens",
      "Brand collateral suite (pitch deck template, stationery, email signatures)",
      "Comprehensive Brand Guidelines Book (PDF & Figma)"
    ],
    deliverables: [
      "Vector Logo Package (SVG, PNG, EPS)",
      "Figma Design Tokens & Typography Scale",
      "Executive Slide Presentation Deck (Keynote & Google Slides)",
      "40-page Brand Identity Guidelines Document"
    ],
    workflowSteps: [
      "Week 1: Creative Discovery & Aesthetic Positioning",
      "Week 2: 2 Distinct Visual Territory Directions",
      "Week 3: Refinement & Collateral Expansion",
      "Week 4: Final Asset Handoff & Guidelines Book"
    ],
    estimatedTimeline: "4 Weeks Fixed Sprint",
    pricingModel: "Fixed Project",
    baseRate: 7500,
    targetMarginPercentage: 85,
    sopReferences: ["SOP-DSN-004: Brand Deliverable Packaging"],
    isActive: true
  },
  {
    id: "srv_4",
    name: "Boutique Website Design & Webflow / Next.js Development",
    category: "Web & Tech",
    description: "High-performance, typography-focused digital experiences built for creative studios, funds, and high-end services.",
    scope: [
      "Information architecture, wireframes, and responsive Figma prototypes",
      "Clean Webflow / Next.js development with responsive fluid layout",
      "CMS collections for portfolio cases, team bios, and insights",
      "SEO, OpenGraph metadata, analytics integration, and page speed optimization"
    ],
    deliverables: [
      "Full Figma Production File",
      "Production-Ready Live Webflow / Next.js Website",
      "Client Video Training Guides for CMS Updates"
    ],
    workflowSteps: [
      "Week 1: Architecture & Low-Fidelity Layouts",
      "Week 2: High-Fidelity Responsive Design in Figma",
      "Week 3: Frontend Development & Interactions",
      "Week 4: QA, Cross-Browser Testing, and Launch"
    ],
    estimatedTimeline: "4-6 Weeks Fixed Sprint",
    pricingModel: "Fixed Project",
    baseRate: 9500,
    targetMarginPercentage: 80,
    sopReferences: ["SOP-WEB-007: Pre-Launch QA Checklist"],
    isActive: true
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: "inv_1",
    invoiceNumber: "INV-2026-081",
    clientId: "cli_1",
    clientName: "Arkgate Ventures",
    clientEmail: "marcus@arkgatevc.com",
    issueDate: "2026-08-01",
    dueDate: "2026-08-15",
    subtotal: 5500,
    taxRate: 0,
    taxAmount: 0,
    total: 5500,
    status: "paid",
    paidDate: "2026-08-03",
    paymentMethod: "Stripe Autopay",
    receiptLink: "https://stripe.com/receipts/rec_881923847",
    notes: "August 2026 Executive Assistant & Operations Retainer (40 hours allocation).",
    items: [
      { id: "ii_1", description: "Executive Assistant & Operations Retainer - August 2026", quantity: 1, unitPrice: 5500, amount: 5500 }
    ]
  },
  {
    id: "inv_2",
    invoiceNumber: "INV-2026-082",
    clientId: "cli_2",
    clientName: "Stark Media Studio",
    clientEmail: "elena@starkmediastudio.com",
    issueDate: "2026-08-01",
    dueDate: "2026-08-15",
    subtotal: 6200,
    taxRate: 0,
    taxAmount: 0,
    total: 6200,
    status: "paid",
    paidDate: "2026-08-05",
    paymentMethod: "Bank Wire",
    receiptLink: "https://chase.com/wire/ref_9921049",
    notes: "August 2026 Creative Production Coordination Retainer (45 hours allocation).",
    items: [
      { id: "ii_2", description: "Creative Production & Executive Support Retainer - August 2026", quantity: 1, unitPrice: 6200, amount: 6200 }
    ]
  },
  {
    id: "inv_3",
    invoiceNumber: "INV-2026-083",
    clientId: "cli_3",
    clientName: "Wayne Technologies",
    clientEmail: "harrison@waynetech.io",
    issueDate: "2026-08-15",
    dueDate: "2026-08-30",
    subtotal: 4800,
    taxRate: 0,
    taxAmount: 0,
    total: 4800,
    status: "sent",
    notes: "September 2026 Onboarding & Executive Operations Retainer (32 hours allocation).",
    items: [
      { id: "ii_3", description: "Executive Operations & Series B Prep Retainer - Month 2", quantity: 1, unitPrice: 4800, amount: 4800 }
    ]
  },
  {
    id: "inv_4",
    invoiceNumber: "INV-2026-079",
    clientId: "cli_4",
    clientName: "Nexus Design Collective",
    clientEmail: "sid@nexuscollective.co",
    issueDate: "2026-07-20",
    dueDate: "2026-08-10",
    subtotal: 3500,
    taxRate: 0,
    taxAmount: 0,
    total: 3500,
    status: "overdue",
    notes: "Milestone 2 Deliverable: Brand Architecture Strategy sprint.",
    items: [
      { id: "ii_4", description: "Brand Strategy Sprint - Phase 2 Final Asset Pack", quantity: 1, unitPrice: 3500, amount: 3500 }
    ]
  }
];

export const initialPayments: PaymentRecord[] = [
  {
    id: "pay_1",
    invoiceId: "inv_1",
    invoiceNumber: "INV-2026-081",
    clientId: "cli_1",
    clientName: "Arkgate Ventures",
    date: "2026-08-03",
    amount: 5500,
    method: "Stripe",
    referenceNumber: "ch_3N84k192019488",
    receiptUrl: "https://dashboard.stripe.com/payments/ch_3N84k192019488"
  },
  {
    id: "pay_2",
    invoiceId: "inv_2",
    invoiceNumber: "INV-2026-082",
    clientId: "cli_2",
    clientName: "Stark Media Studio",
    date: "2026-08-05",
    amount: 6200,
    method: "Bank Transfer",
    referenceNumber: "WIRE-NYC-9921049",
    receiptUrl: "https://banking.portal/wire/WIRE-NYC-9921049"
  },
  {
    id: "pay_3",
    invoiceNumber: "INV-2026-075",
    clientId: "cli_1",
    clientName: "Arkgate Ventures",
    date: "2026-07-03",
    amount: 5500,
    method: "Stripe",
    referenceNumber: "ch_3M74k192019477"
  },
  {
    id: "pay_4",
    invoiceNumber: "INV-2026-076",
    clientId: "cli_2",
    clientName: "Stark Media Studio",
    date: "2026-07-06",
    amount: 6200,
    method: "Bank Transfer",
    referenceNumber: "WIRE-NYC-8812038"
  }
];

export const initialExpenses: FreelancerExpense[] = [
  {
    id: "exp_1",
    date: "2026-08-05",
    category: "withdrawal",
    description: "App Account Owner Profit Distribution / Salary Draw (Ellysa May M. Del Prado)",
    amount: 3500,
    paymentMethod: "Bank Transfer",
    referenceNumber: "WD-2026-0805",
    status: "cleared",
    notes: "Monthly executive draw transferred to primary personal account.",
    createdAt: "2026-08-05"
  },
  {
    id: "exp_2",
    date: "2026-08-10",
    category: "subscription",
    description: "Executive Suite Tech Stack: Google Workspace Enterprise, Notion AI, Zoom Pro",
    amount: 145,
    paymentMethod: "Credit Card",
    referenceNumber: "SUB-TECH-8891",
    status: "cleared",
    notes: "Essential communications, cloud file security, and client wiki infrastructure.",
    createdAt: "2026-08-10"
  },
  {
    id: "exp_3",
    date: "2026-08-14",
    category: "travel",
    description: "Client On-Site Logistics: Train & Executive Transit (SF Bay Area Client Review)",
    amount: 185,
    paymentMethod: "Credit Card",
    referenceNumber: "TRV-BAY-4421",
    clientId: "cli_1",
    clientName: "Arkgate Ventures",
    isReimbursable: true,
    status: "reimbursed",
    notes: "Onsite board presentation review with Marcus Vance.",
    createdAt: "2026-08-14"
  },
  {
    id: "exp_4",
    date: "2026-08-18",
    category: "reimbursement",
    description: "Expedited Courier & Notarized Legal Filings for Kuroda Spatial Systems",
    amount: 220,
    paymentMethod: "Wise",
    referenceNumber: "EXP-REIM-1092",
    clientId: "cli_5",
    clientName: "Kuroda Spatial Systems",
    isReimbursable: true,
    status: "pending",
    notes: "Awaiting next retainer invoice inclusion.",
    createdAt: "2026-08-18"
  },
  {
    id: "exp_5",
    date: "2026-08-20",
    category: "transfer",
    description: "Tax Reserve & Studio Sinking Fund Allocation (25% Revenue Set-Aside)",
    amount: 2500,
    paymentMethod: "Bank Transfer",
    referenceNumber: "TX-SAV-202608",
    status: "cleared",
    notes: "Transferred to high-yield business savings for quarterly estimated taxes.",
    createdAt: "2026-08-20"
  },
  {
    id: "exp_6",
    date: "2026-08-22",
    category: "business_expense",
    description: "High-Resolution Display Calibrator & Ergonomic Travel Peripherals",
    amount: 320,
    paymentMethod: "Credit Card",
    referenceNumber: "EQP-HARD-7712",
    status: "cleared",
    notes: "Studio hardware maintenance and client deck QA.",
    createdAt: "2026-08-22"
  }
];

export const initialApprovals: ApprovalItem[] = [
  {
    id: "app_1",
    title: "Paris Fashion Week Equipment Rental Manifest & Crew Per-Diem Budget",
    clientId: "cli_2",
    clientName: "Stark Media Studio",
    projectId: "prj_2",
    projectName: "Paris Fashion Week SS27",
    type: "budget_expansion",
    deliverableType: "financial",
    status: "pending",
    submittedDate: "2026-08-25",
    dueDate: "2026-08-27",
    reviewLink: "https://docs.google.com/spreadsheets/d/STRK_PFW_Budget_Review",
    comments: "Added additional line for ARRI Alexa 35 backup body rental (+€1,400) per Julian's request.",
    context: "During international fashion week productions, camera sensor failures or lens mount issues can halt shoot days costing upwards of €12,000/day in talent and location permits.",
    recommendation: "Greenlight the backup ARRI Alexa 35 body package with Panavision Paris.",
    reasoning: "We negotiated a 30% standby discount with Panavision Paris (€1,400 vs standard €2,000 rate). Having identical A/B camera packages guarantees zero downtime for the Place Vendôme golden hour shoot.",
    expectedOutcomes: "100% production continuity, zero risk of lost daylight permits, and identical color science across dual camera units.",
    questionsAsked: [
      {
        id: "q_1",
        author: "Elena Rostova (Client)",
        text: "Does this include the dual-battery charging station and extra CFexpress Type B media cards?",
        timestamp: "09:42 AM",
        reply: "Yes, fully bundled into the Panavision package with 4x 2TB cards and dual high-speed sharkfin chargers."
      }
    ],
    decisionHistory: [
      { timestamp: "2026-08-25T14:30:00Z", action: "Submitted for client review with recommendation", author: "Olivia Vance" }
    ]
  },
  {
    id: "app_2",
    title: "LP Summit Keynote Slide Layouts & Speaker Bio Treatment",
    clientId: "cli_1",
    clientName: "Arkgate Ventures",
    projectId: "prj_1",
    projectName: "Fund III Summit",
    type: "design_proof",
    deliverableType: "branding",
    status: "approved",
    submittedDate: "2026-08-22",
    dueDate: "2026-08-24",
    reviewLink: "https://figma.com/file/arkg-keynote-v3",
    comments: "Marcus loved the dark typography cards; approved without revisions.",
    context: "Keynote presentation for 85+ institutional LPs at the Annual General Meeting in San Francisco.",
    recommendation: "Approve the high-contrast Swiss typography style with monochrome partner portraits.",
    reasoning: "Differentiates Arkgate from standard VC slide decks with a modern, high-conviction luxury aesthetic.",
    expectedOutcomes: "Maximized LP engagement and memorable visual identity during Fund III commitment pitches.",
    decisionHistory: [
      { timestamp: "2026-08-22T11:00:00Z", action: "Submitted for review", author: "Olivia Vance" },
      { timestamp: "2026-08-23T09:15:00Z", action: "Approved", author: "Marcus Vance", note: "Approved. Looks ultra sharp." }
    ]
  },
  {
    id: "app_3",
    title: "Series B Institutional Data Room NDA & Diligence Protocol",
    clientId: "cli_3",
    clientName: "Wayne Technologies",
    projectId: "prj_3",
    projectName: "Series B Data Room",
    type: "deliverable",
    deliverableType: "document",
    status: "pending",
    submittedDate: "2026-08-25",
    dueDate: "2026-08-28",
    reviewLink: "https://docs.google.com/document/d/WAYN_DataRoom_NDA_Protocol",
    comments: "Legal counsel reviewed; waiting on Harrison's final sign-off.",
    context: "Prepares data room governance for upcoming $25M Series B funding round with institutional venture investors.",
    recommendation: "Approve tiered 2-stage NDA gating (general overview vs audited financials).",
    reasoning: "Protects proprietary algorithm IP while eliminating unnecessary sign-off friction for initial investor screening.",
    expectedOutcomes: "Accelerates lead investor diligence velocity by 40% while preserving strict IP confidentiality.",
    decisionHistory: [
      { timestamp: "2026-08-25T17:00:00Z", action: "Submitted for review", author: "Olivia Vance" }
    ]
  },
  {
    id: "app_4",
    title: "Fund III LP Summit Private Anchor Dinner Catering & Venue Agreement",
    clientId: "cli_1",
    clientName: "Arkgate Ventures",
    projectId: "prj_1",
    projectName: "Fund III Summit",
    type: "budget_expansion",
    deliverableType: "proposal",
    status: "pending",
    submittedDate: "2026-08-26",
    dueDate: "2026-08-29",
    reviewLink: "https://docs.google.com/document/d/ARKG_LP_Summit_Dinner_Contract",
    comments: "Private room reservation at Quince SF for 12 lead LP principals ($4,200 food & beverage minimum).",
    context: "Pre-summit intimate dinner for prospective $10M+ anchor check writers the evening before the main summit.",
    recommendation: "Approve private dining contract at Quince SF.",
    reasoning: "Secured private wine cellar room with customized sommelier pairing menu; provides quiet acoustic environment for closing discussions.",
    expectedOutcomes: "Direct conversion environment for $25M in combined lead LP anchor commitments.",
    decisionHistory: [
      { timestamp: "2026-08-26T08:00:00Z", action: "Submitted for client decision", author: "Olivia Vance" }
    ]
  }
];

export const initialKnowledgeArticles: KnowledgeArticle[] = [
  {
    id: "kb_1",
    title: "The Ultimate Executive Assistant Operating Guide & Daily Cadence",
    category: "SOPs",
    summary: "Standard operational operating rhythm for daily executive defense, inbox zero heuristics, and proactive support.",
    content: `## 1. Start of Day (08:30 - 09:30)
- **Dashboard Review**: Inspect AEDMIN Command Center for overdue tasks, urgent approvals, and payment notices.
- **Calendar Defensive Scrub**: Verify today's and tomorrow's meetings. Confirm links, Zoom URLs, dial-ins, and physical addresses. Ensure a 10-15m buffer between calls.
- **Inbox Zero Sweep**: Apply the 4D rule: Delete, Delegate, Do (<2 mins), or Defer (convert to AEDMIN task).
- **Dispatch Morning Brief**: Send a concise 3-5 bullet brief with top priorities and critical decisions needed today.

## 2. Midday Rhythm (12:30 - 13:30)
- **Check-In on Blockers**: Monitor pending client approvals and unblock stuck deliverables.
- **Reprioritize**: Adjust task rankings based on incoming morning client communications.

## 3. End of Day Routine (17:00 - 17:30)
- **Log Billable & Retainer Time**: Enter exact durations and multi-allocations in AEDMIN Time Tracking.
- **Prepare Tomorrow**: Schedule priority deep-work blocks in calendar.
- **Dispatch EOD Report**: Generate formatted EOD update and post to client Slack/Email channel.`,
    tags: ["EA Guide", "Core SOP", "Daily Routine"],
    lastUpdated: "2026-08-20",
    isPinned: true
  },
  {
    id: "kb_2",
    title: "Client Google Drive Directory Architecture & File Naming Governance",
    category: "Client Management",
    summary: "Consistent folder hierarchies, permission tiering, and standardized file naming conventions across all client assets.",
    content: `## Mandatory Folder Structure per Client
Every client Google Drive root MUST follow this standard folder hierarchy:
1. \`01_Administrative_Legal\` (MSAs, NDAs, Invoices, Contracts)
2. \`02_Brand_Assets_Guidelines\` (Logos, Fonts, Color tokens, Imagery)
3. \`03_Active_Projects\` (Individual project subfolders with exact naming)
4. \`04_Operations_SOPs\` (Operating guides, calendars, meeting notes)
5. \`05_Archive\` (Completed project vaults)

## File Naming Standard Syntax
All uploaded files must strictly adhere to the AEDMIN standardized formula:
\`[CLIENTCODE]_[DocumentType]_[ProjectOrContext]_[Version]_[YYYY-MM-DD]\`

*Example*: \`ARKG_Proposal_WebsiteRedesign_V01_2026-08-21\`
*Example*: \`STRK_CallSheet_PFWDay1_V02_2026-09-18\``,
    tags: ["Google Drive", "File Naming", "SOP"],
    lastUpdated: "2026-08-15",
    isPinned: true
  },
  {
    id: "kb_3",
    title: "Proactive Executive Support: Anticipating Needs Before They Arise",
    category: "Service Delivery",
    summary: "Framework for transitioning from reactive task taker to indispensable strategic partner.",
    content: `## The Proactive Spectrum
1. **Level 1 (Reactive)**: "Tell me what to do."
2. **Level 2 (Informed)**: "I noticed X is happening; do you want me to do Y?"
3. **Level 3 (Proactive)**: "I completed Y because X was upcoming, and here are the next 2 options for your decision."

Always draft meeting preparation briefs 24 hours in advance. If an executive has a lunch meeting, verify dietary preferences and reserve the table without waiting to be asked.`,
    tags: ["Executive Strategy", "Proactive EA"],
    lastUpdated: "2026-08-10"
  },
  {
    id: "kb_4",
    title: "Freelancer Retainer Management & Burn Forecasting Protocol",
    category: "Finance SOPs",
    summary: "How to prevent scope creep, forecast hour exhaustion, and upsell additional capacity smoothly.",
    content: `## The 75% Retainer Milestone Alert
When a client hits 75% of their monthly allocated hours before the 20th of the month:
1. Automatically trigger an operational review email.
2. Provide a breakdown of hours logged to date.
3. Offer an add-on 10-hour pack or reprioritize non-essential backlog items to the subsequent billing cycle.`,
    tags: ["Finance", "Retainers", "Capacity"],
    lastUpdated: "2026-08-01"
  }
];

export const initialOpportunities: Opportunity[] = [
  {
    id: "opp_1",
    prospectName: "Vanguard Robotics Group",
    company: "Vanguard Labs Inc.",
    email: "contact@vanguardlabs.ai",
    type: "lead",
    stage: "proposal",
    estimatedValue: 6500,
    serviceInterest: "Executive Assistant & Operations Retainer",
    source: "Referral from Marcus Vance (Arkgate)",
    nextFollowUpDate: "2026-08-28",
    notes: "CEO needs 40 hrs/mo calendar defense and board meeting preparation.",
    confidencePercentage: 80,
    createdAt: "2026-08-18"
  },
  {
    id: "opp_2",
    prospectName: "Maison Saint-Germain",
    company: "MSG Paris Brand Group",
    email: "claire@msg-paris.com",
    type: "referral",
    stage: "discovery",
    estimatedValue: 12000,
    serviceInterest: "Visual Identity & Digital Campaign Website",
    source: "Elena Rostova (Stark Media)",
    nextFollowUpDate: "2026-09-02",
    notes: "Luxury fragrance launch campaign; needs comprehensive brand book & Webflow site.",
    confidencePercentage: 60,
    createdAt: "2026-08-22"
  },
  {
    id: "opp_3",
    prospectName: "Wayne Tech Expansion",
    company: "Wayne Technologies",
    type: "upsell",
    stage: "negotiation",
    estimatedValue: 2400,
    serviceInterest: "Add-on 15 Hours Monthly Operations Capacity",
    source: "Existing Client",
    nextFollowUpDate: "2026-08-29",
    notes: "Harrison requested dedicated support for their European logistics pilots.",
    confidencePercentage: 90,
    createdAt: "2026-08-20"
  }
];

export const initialCEOGoals: CEOGoal[] = [
  {
    id: "cg_1",
    category: "Revenue",
    title: "Hit $20,000 / Month Consistent Studio Revenue",
    currentValue: 16500,
    targetValue: 20000,
    unit: "$/mo",
    deadline: "2026-12-31",
    notes: "Onboard 1 additional $4,500/mo retainer client while maintaining 80%+ margins.",
    status: "on_track"
  },
  {
    id: "cg_2",
    category: "Capacity & Balance",
    title: "Cap Personal Billable Hours at 30 hrs/week",
    currentValue: 32,
    targetValue: 30,
    unit: "hrs/wk",
    deadline: "2026-10-31",
    notes: "Increase hourly rates and transition repetitive data entry tasks to automated scripts.",
    status: "on_track"
  },
  {
    id: "cg_3",
    category: "Tax Reserve",
    title: "Maintain 30% Automated Tax Reserve Vault",
    currentValue: 28500,
    targetValue: 35000,
    unit: "$",
    deadline: "2026-12-15",
    notes: "Transfer 30% of every invoice receipt directly to high-yield tax vault account.",
    status: "achieved"
  },
  {
    id: "cg_4",
    category: "Savings",
    title: "6-Month Studio Emergency Runway Fund",
    currentValue: 45000,
    targetValue: 60000,
    unit: "$",
    deadline: "2026-11-30",
    notes: "Current monthly living + business baseline is $7,800/mo.",
    status: "on_track"
  },
  {
    id: "cg_5",
    category: "Studio Growth",
    title: "Document 25 Standardized AEDMIN Studio SOPs",
    currentValue: 14,
    targetValue: 25,
    unit: "SOPs",
    deadline: "2026-09-30",
    notes: "Prepares AEDMIN for hiring the first junior associate / trainee EA in 2027.",
    status: "on_track"
  }
];

export const initialRateCalculator: RateCalculatorInputs = {
  // Business Costs (Monthly)
  internetCost: 110,
  electricityCost: 140,
  softwareSubscriptions: 350,
  hostingAndDomains: 60,
  equipmentDepreciation: 200,
  coworkingOrOffice: 450,
  otherBusinessCosts: 150,

  // Professional Costs (Monthly / Annualized)
  taxesEstimatedPercentage: 28,
  healthInsurance: 550,
  governmentRegistration: 50,
  legalAndAccounting: 250,

  // Lifestyle Compensation (Monthly)
  housingAndLiving: 3200,
  foodAndGroceries: 950,
  transportation: 350,
  healthcareAndWellness: 250,
  savingsGoal: 2000,
  emergencyFundContribution: 1000,
  vacationBufferPercentage: 10,

  // Capacity
  billableHoursPerWeek: 25,
  workingWeeksPerYear: 46
};
