import { 
  TenantWorkspace, 
  TenantPlanTier, 
  ManualPaymentRecord, 
  PlatformSettings, 
  TenantSubscription,
  ManualPaymentMethod,
  AccessRequest
} from '@/types/saas';
import { 
  initialUserProfile, 
  initialClients, 
  initialTasks
} from '@/data/seedData';
import { initialManagedTemplates } from '@/data/templateSeedData';

// Storage Keys for Platform-Wide Registry
export const SAAS_STORAGE_KEYS = {
  PLATFORM_SETTINGS: 'aedmin_saas_platform_settings_v2',
  WORKSPACES_REGISTRY: 'aedmin_saas_workspaces_registry_v2',
  MANUAL_PAYMENTS: 'aedmin_saas_manual_payments_v2',
  PROVISIONING_AUDIT: 'aedmin_saas_provisioning_audit_v2',
  ACCESS_REQUESTS: 'aedmin_saas_access_requests_v2'
};

export const SUPER_ADMIN_EMAIL = 'hello.aespace@gmail.com';
export const SUPER_ADMIN_NAME = 'Ellysa May M. Del Prado';
export const SUPER_ADMIN_TENANT_ID = 'ws_ellysa_owner';

// Default Platform Configuration & Manual Payment Instructions
export const defaultPlatformSettings: PlatformSettings = {
  platformName: 'AEDMIN OS',
  ownerName: SUPER_ADMIN_NAME,
  ownerEmail: SUPER_ADMIN_EMAIL,
  supportEmail: SUPER_ADMIN_EMAIL,
  billingMode: 'manual_only',
  manualPaymentInstructions: {
    gcash: {
      enabled: true,
      accountName: 'Ellysa May M. Del Prado',
      accountNumber: '0917-882-9412',
      instructions: 'Send payment via GCash Express Send. Include your Full Name and Email in the transaction note, then copy the 12-digit Reference Number.',
    },
    maya: {
      enabled: true,
      accountName: 'Ellysa May M. Del Prado',
      accountNumber: '0917-882-9412',
      instructions: 'Transfer via Maya App to mobile number. Retain the official Reference ID and screenshot.',
    },
    bankTransfer: {
      enabled: true,
      bankName: 'BDO Unibank (Philippines)',
      accountName: 'Ellysa May M. Del Prado',
      accountNumber: '0068-4019-2811',
      branchOrSwift: 'BNORPHMM',
      instructions: 'Direct bank deposit or InstaPay / PESONet transfer. Input your email in the remark/memo field.',
    },
    paypal: {
      enabled: true,
      email: 'hello.aespace@gmail.com',
      paymentLink: 'https://paypal.me/ellysadelprado',
      instructions: 'Send payment in USD via PayPal Friends & Family or Goods & Services. Include your AEDMIN account name.',
    },
    wise: {
      enabled: true,
      emailOrTag: 'hello.aespace@gmail.com',
      instructions: 'Direct international transfer via Wise multi-currency account. Low conversion fees for USD/EUR/GBP/AUD.',
    }
  },
  plans: [
    {
      id: 'starter_freelance',
      name: 'Freelance Starter',
      badge: 'Individual Specialist',
      monthlyPriceUSD: 39,
      monthlyPricePHP: 1990,
      annualDiscountPercent: 20,
      clientLimit: 5,
      teamMemberLimit: 1,
      storageLimitMB: 2500,
      description: 'Ideal for independent virtual assistants, operations specialists, and solopreneur service providers.',
      recommendedFor: 'Solo freelancers managing 1–5 retainers',
      features: [
        'Private isolated single-tenant workspace',
        'Up to 5 active client CRM dossiers & portals',
        'Command Center & Daily Routine checklist',
        'Global Times multi-timezone synchronizer',
        'Operations Kanban & milestone tracker',
        'Billable live timer & invoice PDF generator',
        'AESmart Write standard email templates',
        'Manual billing with direct client portal links'
      ]
    },
    {
      id: 'pro_executive',
      name: 'Executive Pro',
      badge: 'Most Popular',
      monthlyPriceUSD: 79,
      monthlyPricePHP: 3990,
      annualDiscountPercent: 25,
      clientLimit: 20,
      teamMemberLimit: 3,
      storageLimitMB: 10000,
      description: 'Designed for high-performing Executive Assistants, Online Business Managers, and C-Suite Chiefs of Staff.',
      recommendedFor: 'Professional EAs & OBMs managing multiple executives',
      features: [
        'Everything in Freelance Starter, plus:',
        'Up to 20 active client dossiers & VIP profiles',
        'Executive Decision Briefing generator & logs',
        'Multi-currency retainers (USD, PHP, AUD, GBP, EUR)',
        'Client Travel Mode & overlap matrix',
        'Deliverable Sign-Off SLA countdowns',
        'Full SOP Vault & Knowledge Base manager',
        'Revenue analytics & burn rate forecasting',
        'Priority email & onboarding support'
      ]
    },
    {
      id: 'agency_studio',
      name: 'Agency & Studio',
      badge: 'High-Volume Capacity',
      monthlyPriceUSD: 149,
      monthlyPricePHP: 7490,
      annualDiscountPercent: 30,
      clientLimit: 999,
      teamMemberLimit: 10,
      storageLimitMB: 50000,
      description: 'Comprehensive operating system for EA agencies, virtual studio firms, and scaling fractional service teams.',
      recommendedFor: 'Agencies and multi-VA service studios',
      features: [
        'Unlimited active client accounts & dossiers',
        'Up to 10 sub-operator logins & RBAC roles',
        'Custom client portal white-label insignias',
        'Advanced Google Drive audit automations',
        'Unlimited AI Composer templates & memo drafts',
        'Dedicated onboarding session with Ellysa',
        'Custom export & data backup pipelines'
      ]
    }
  ],
  futureStripeIntegration: {
    enabled: false,
    publishableKey: '',
    webhookConfigured: false,
    testMode: true
  },
  allowSelfRegistrationWaitlist: true
};

// Initial Workspaces Seed
export const initialWorkspaces: TenantWorkspace[] = [
  {
    id: SUPER_ADMIN_TENANT_ID,
    name: 'Ellysa May Del Prado • Executive Master Workspace',
    ownerUserId: 'usr_ellysa_owner',
    ownerEmail: SUPER_ADMIN_EMAIL,
    ownerFullName: SUPER_ADMIN_NAME,
    createdAt: '2025-09-01T00:00:00.000Z',
    plan: 'agency_studio',
    status: 'active',
    storageUsedMB: 142.5,
    clientCount: 4,
    taskCount: 16,
    invoiceCount: 8,
    isSuperAdminWorkspace: true,
    subscription: {
      planId: 'agency_studio',
      planName: 'Agency & Studio (Master Platform Owner)',
      price: 0,
      currency: 'USD',
      interval: 'annual',
      status: 'active',
      startDate: '2025-09-01T00:00:00.000Z',
      currentPeriodEnd: '2030-09-01T00:00:00.000Z',
      paymentMethod: 'cash_other',
      lastPaymentReference: 'PLATFORM_OWNER_LIFETIME',
      maxClients: 999,
      maxStorageMB: 50000,
      notes: 'Master Super Admin Lifetime Account'
    }
  },
  {
    id: 'ws_sarah_freelance',
    name: 'Sarah Chen • High-Growth EA Studio',
    ownerUserId: 'usr_sarah_chen',
    ownerEmail: 'sarah.ops@freelance.studio',
    ownerFullName: 'Sarah Chen',
    createdAt: '2026-02-15T08:30:00.000Z',
    plan: 'pro_executive',
    status: 'active',
    storageUsedMB: 38.2,
    clientCount: 2,
    taskCount: 6,
    invoiceCount: 2,
    isSuperAdminWorkspace: false,
    subscription: {
      planId: 'pro_executive',
      planName: 'Executive Pro',
      price: 79,
      currency: 'USD',
      interval: 'monthly',
      status: 'active',
      startDate: '2026-08-15T00:00:00.000Z',
      currentPeriodEnd: '2026-09-15T23:59:59.000Z',
      paymentMethod: 'gcash',
      lastPaymentReference: 'GCASH-9821049281',
      lastPaymentDate: '2026-08-15T09:12:00.000Z',
      maxClients: 20,
      maxStorageMB: 10000,
      notes: 'Manual payment verified via GCash by Ellysa'
    }
  }
];

// Initial Manual Payment Ledger
export const initialManualPayments: ManualPaymentRecord[] = [
  {
    id: 'pay_rec_001',
    tenantId: 'ws_sarah_freelance',
    userEmail: 'sarah.ops@freelance.studio',
    userName: 'Sarah Chen',
    businessName: 'Sarah Chen Executive Ops',
    planTier: 'pro_executive',
    amount: 3990,
    currency: 'PHP',
    paymentMethod: 'gcash',
    referenceNumber: 'GCASH-9821049281',
    billingPeriod: 'monthly',
    notes: 'Subscribed for August-September 2026 via GCash mobile transfer.',
    verifiedBy: SUPER_ADMIN_NAME,
    verifiedAt: '2026-08-15T09:15:00.000Z',
    periodStartDate: '2026-08-15T00:00:00.000Z',
    periodEndDate: '2026-09-15T23:59:59.000Z',
    status: 'verified',
    createdAt: '2026-08-15T09:10:00.000Z'
  }
];

// Sample isolated data for Sarah Chen's workspace so testing demonstrates 100% isolation
export const sarahChenPrivateProfile = {
  fullName: "Sarah Chen",
  email: "sarah.ops@freelance.studio",
  title: "Fractional Executive Assistant & Chief of Staff",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
  timezone: "Asia/Singapore",
  workingHoursStart: "09:00",
  workingHoursEnd: "18:00",
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  currency: "$",
  monthlyRevenueTarget: 9500,
  weeklyCapacityHours: 30,
  googleDriveRootFolder: "https://drive.google.com/drive/folders/SARAH_CHEN_STUDIO",
  communicationEmail: "sarah@chenops.co",
  defaultFileNamingPrefix: "SCOPS",
  rememberMeSessionDays: 30
};

export const sarahChenPrivateClients = [
  {
    id: "cli_sc_1",
    code: "APEX",
    name: "Apex Retail Group",
    primaryContact: "Elena Rostova",
    email: "elena@apexretail.io",
    phone: "+65 8123 4567",
    company: "Apex Retail International",
    status: "active",
    avatarColor: "bg-emerald-500",
    contractType: "retainer",
    monthlyRetainerFee: 3800,
    hourlyRate: 120,
    purchasedHours: 30,
    usedHoursThisMonth: 18.5,
    totalRevenueYTD: 19000,
    relationshipHealth: "exceptional",
    onboardingProgress: 100,
    joinedDate: "2026-01-10",
    portalToken: "apex-portal-9921",
    portalCustomNotes: "Sarah Chen's dedicated workspace for Apex Retail operations and weekly board recaps.",
    timezone: "Asia/Singapore",
    city: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    flagEmoji: "🇸🇬",
    workingHoursStart: "09:00",
    workingHoursEnd: "18:00",
    preferredCommsStart: "09:30",
    preferredCommsEnd: "17:00",
    meetingAvailabilityStart: "10:00",
    meetingAvailabilityEnd: "16:00",
    meetingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    maxMeetingDurationMins: 30,
    communicationChannels: ["Slack", "Email"],
    responseSlaHours: 3,
    isTravelModeActive: false,
    learnedPatterns: [],
    dailyRoutines: [
      { id: "scr_1", clientId: "cli_sc_1", title: "Review Apex retail pipeline dashboard", phase: "opening", completed: true, estimatedMinutes: 15, timeTarget: "09:15 AM" },
      { id: "scr_2", clientId: "cli_sc_1", title: "Dispatch daily supplier escalation recap", phase: "eod", completed: false, estimatedMinutes: 20, timeTarget: "05:30 PM" }
    ],
    googleDriveFolderUrl: "https://drive.google.com/drive/folders/APEX_RETAIL",
    slackChannel: "#apex-sarah-ops",
    onboardingPhases: [],
    intelligence: {
      executiveProfile: {
        preferredName: "Elena",
        timezone: "Asia/Singapore",
        communicationStyle: "Fast, concise bullet points via Slack",
        meetingPreferences: "No meetings on Friday afternoon",
        decisionMakingStyle: "Data backed, high urgency",
        reportingPreferences: "Daily EOD summary in Slack"
      },
      businessProfile: {
        company: "Apex Retail Group",
        industry: "E-Commerce & Supply Chain",
        website: "https://apexretail.io",
        coreServices: "Omnichannel retail operations",
        currentGoals: "Launch Southeast Asia logistics expansion",
        keyChallenges: "Managing supplier SLAs",
        keyTeamMembers: "CEO, COO, Head of Ops",
        primaryVendors: "Shopify Plus, Slack",
        coreSystems: "Slack, Notion, Google Workspace"
      },
      relationshipProfile: {
        hobbies: "Marathon running, specialty coffee",
        interests: "Supply chain tech",
        travelPreferences: "Singapore Airlines Business Class",
        favoriteRestaurants: "Burnt Ends Singapore",
        giftIdeas: "Specialty Gesha Coffee Beans",
        personalNotes: "Prefers async audio clips over long Zoom meetings."
      }
    }
  }
];

export const sarahChenPrivateTasks = [
  {
    id: "task_sc_1",
    title: "Prepare Q3 Apex Regional Operations Deck",
    clientId: "cli_sc_1",
    clientName: "Apex Retail Group",
    dueDate: "2026-09-05",
    status: "in_progress" as const,
    priority: "high" as const,
    importanceScore: 5,
    urgencyScore: 4,
    tags: ["Operations", "Board Deck"],
    notes: "Compile logistics latency charts and customer retention metrics.",
    createdAt: "2026-08-28T08:00:00.000Z"
  }
];

// Helper to generate tenant-scoped storage key
export function getTenantStorageKey(tenantId: string, resourceKey: string): string {
  return `aedmin_ws_${tenantId}_${resourceKey}`;
}

// Check if an email is the Super Admin
export function isSuperAdminEmail(email?: string): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

// Workspace Registry Accessors
export function getPlatformSettings(): PlatformSettings {
  const saved = localStorage.getItem(SAAS_STORAGE_KEYS.PLATFORM_SETTINGS);
  if (!saved) return defaultPlatformSettings;
  try {
    return { ...defaultPlatformSettings, ...JSON.parse(saved) };
  } catch {
    return defaultPlatformSettings;
  }
}

export function savePlatformSettings(settings: PlatformSettings) {
  localStorage.setItem(SAAS_STORAGE_KEYS.PLATFORM_SETTINGS, JSON.stringify(settings));
}

export function getWorkspacesRegistry(): TenantWorkspace[] {
  const saved = localStorage.getItem(SAAS_STORAGE_KEYS.WORKSPACES_REGISTRY);
  if (!saved) {
    localStorage.setItem(SAAS_STORAGE_KEYS.WORKSPACES_REGISTRY, JSON.stringify(initialWorkspaces));
    return initialWorkspaces;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return initialWorkspaces;
  }
}

export function saveWorkspacesRegistry(workspaces: TenantWorkspace[]) {
  localStorage.setItem(SAAS_STORAGE_KEYS.WORKSPACES_REGISTRY, JSON.stringify(workspaces));
}

export function getManualPaymentsLedger(): ManualPaymentRecord[] {
  const saved = localStorage.getItem(SAAS_STORAGE_KEYS.MANUAL_PAYMENTS);
  if (!saved) {
    localStorage.setItem(SAAS_STORAGE_KEYS.MANUAL_PAYMENTS, JSON.stringify(initialManualPayments));
    return initialManualPayments;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return initialManualPayments;
  }
}

export function saveManualPaymentsLedger(payments: ManualPaymentRecord[]) {
  localStorage.setItem(SAAS_STORAGE_KEYS.MANUAL_PAYMENTS, JSON.stringify(payments));
}

// Initial Access Requests Seed
export const initialAccessRequests: AccessRequest[] = [
  {
    id: 'req_001',
    fullName: 'Maria Rodriguez',
    email: 'maria.assistant@opsvalencia.es',
    businessName: 'Valencia Ops & Virtual EA',
    planId: 'pro_executive',
    billingCycle: 'monthly',
    currency: 'USD',
    amount: 79,
    paymentMethod: 'paypal',
    referenceNumber: 'PAYPAL-98412894X',
    notes: 'Paid via PayPal USD. Requesting immediate EA Executive setup.',
    status: 'pending',
    submittedAt: '2026-08-30T14:20:00.000Z'
  }
];

export function getAccessRequests(): AccessRequest[] {
  const saved = localStorage.getItem(SAAS_STORAGE_KEYS.ACCESS_REQUESTS);
  if (!saved) {
    localStorage.setItem(SAAS_STORAGE_KEYS.ACCESS_REQUESTS, JSON.stringify(initialAccessRequests));
    return initialAccessRequests;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return initialAccessRequests;
  }
}

export function saveAccessRequests(requests: AccessRequest[]) {
  localStorage.setItem(SAAS_STORAGE_KEYS.ACCESS_REQUESTS, JSON.stringify(requests));
}

export function addAccessRequest(data: Omit<AccessRequest, 'id' | 'submittedAt' | 'status'>): AccessRequest {
  const current = getAccessRequests();
  const newReq: AccessRequest = {
    ...data,
    id: `req_${Date.now()}`,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };
  saveAccessRequests([newReq, ...current]);
  return newReq;
}

export function updateAccessRequestStatus(
  id: string, 
  status: 'approved' | 'rejected', 
  notes?: string
): boolean {
  const current = getAccessRequests();
  const updated = current.map(req => {
    if (req.id === id) {
      return {
        ...req,
        status,
        approvedAt: status === 'approved' ? new Date().toISOString() : undefined,
        rejectedReason: status === 'rejected' ? (notes || 'Declined by administrator') : undefined
      };
    }
    return req;
  });
  saveAccessRequests(updated);
  return true;
}

// Calculate Real Storage and Entity Counts for a Tenant
export function calculateTenantStats(tenantId: string): {
  clientCount: number;
  taskCount: number;
  projectCount: number;
  invoiceCount: number;
  storageUsedKB: number;
  storageUsedMB: number;
} {
  const getCount = (keySuffix: string): number => {
    const key = getTenantStorageKey(tenantId, keySuffix);
    const item = localStorage.getItem(key);
    if (!item) return 0;
    try {
      const parsed = JSON.parse(item);
      return Array.isArray(parsed) ? parsed.length : 1;
    } catch {
      return 0;
    }
  };

  const clientCount = getCount('clients');
  const taskCount = getCount('tasks');
  const projectCount = getCount('projects');
  const invoiceCount = getCount('invoices');

  // Compute total characters of all keys for this tenant
  let totalBytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(`aedmin_ws_${tenantId}_`)) {
      const v = localStorage.getItem(k);
      if (v) {
        totalBytes += k.length + v.length;
      }
    }
  }

  const storageUsedKB = Math.round((totalBytes / 1024) * 10) / 10;
  const storageUsedMB = Math.round((totalBytes / (1024 * 1024)) * 100) / 100;

  return {
    clientCount,
    taskCount,
    projectCount,
    invoiceCount,
    storageUsedKB,
    storageUsedMB
  };
}

// Initialize tenant default data stores if empty
export function initializeTenantDataIfMissing(tenantId: string, initialProfile?: any) {
  const clientsKey = getTenantStorageKey(tenantId, 'clients');
  const tasksKey = getTenantStorageKey(tenantId, 'tasks');
  const profileKey = getTenantStorageKey(tenantId, 'profile');
  const templatesKey = getTenantStorageKey(tenantId, 'templates');

  if (tenantId === SUPER_ADMIN_TENANT_ID) {
    // Seed Ellysa's master workspace if not already present
    if (!localStorage.getItem(clientsKey)) {
      localStorage.setItem(clientsKey, JSON.stringify(initialClients));
    }
    if (!localStorage.getItem(tasksKey)) {
      localStorage.setItem(tasksKey, JSON.stringify(initialTasks));
    }
    if (!localStorage.getItem(profileKey)) {
      localStorage.setItem(profileKey, JSON.stringify({
        ...initialUserProfile,
        fullName: SUPER_ADMIN_NAME,
        email: SUPER_ADMIN_EMAIL,
        title: "Platform Owner & Master Executive Consultant"
      }));
    }
    if (!localStorage.getItem(templatesKey)) {
      localStorage.setItem(templatesKey, JSON.stringify(initialManagedTemplates));
    }
  } else if (tenantId === 'ws_sarah_freelance') {
    // Seed Sarah Chen's demo freelancer workspace
    if (!localStorage.getItem(clientsKey)) {
      localStorage.setItem(clientsKey, JSON.stringify(sarahChenPrivateClients));
    }
    if (!localStorage.getItem(tasksKey)) {
      localStorage.setItem(tasksKey, JSON.stringify(sarahChenPrivateTasks));
    }
    if (!localStorage.getItem(profileKey)) {
      localStorage.setItem(profileKey, JSON.stringify(sarahChenPrivateProfile));
    }
    if (!localStorage.getItem(templatesKey)) {
      localStorage.setItem(templatesKey, JSON.stringify(initialManagedTemplates));
    }
  } else {
    // Brand-new tenant workspace initialized by Super Admin
    if (!localStorage.getItem(profileKey) && initialProfile) {
      localStorage.setItem(profileKey, JSON.stringify(initialProfile));
    }
    if (!localStorage.getItem(clientsKey)) {
      localStorage.setItem(clientsKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(tasksKey)) {
      localStorage.setItem(tasksKey, JSON.stringify([
        {
          id: `task_welcome_${Date.now()}`,
          title: "Complete Workspace Profile & Onboard First Client",
          clientName: "Internal Studio Operations",
          clientId: "internal",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: "todo",
          priority: "high",
          importanceScore: 5,
          urgencyScore: 4,
          tags: ["Onboarding", "AEDMIN OS"],
          notes: "Welcome to your private AEDMIN workspace! Add your clients in the Clients tab and customize your hourly rates.",
          createdAt: new Date().toISOString()
        }
      ]));
    }
    if (!localStorage.getItem(templatesKey)) {
      localStorage.setItem(templatesKey, JSON.stringify(initialManagedTemplates));
    }
  }
}
