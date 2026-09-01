export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'waiting_client' | 'waiting_approval' | 'waiting_payment' | 'completed' | 'archived';

export interface Task {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  serviceId?: string;
  serviceName?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  status: TaskStatus;
  priority: PriorityLevel;
  calculatedScore?: number; // Importance + Urgency + Revenue Impact + Client Priority + Due Date Proximity
  importanceScore?: number; // 1-5
  urgencyScore?: number; // 1-5
  revenueImpactScore?: number; // 1-5
  clientPriorityScore?: number; // 1-5
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  notes?: string;
  driveLink?: string;
  isRecurring?: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  createdAt: string;
  completedAt?: string;
  isArchived?: boolean;
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  description: string;
  scope: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'archived';
  startDate: string;
  deadline: string;
  progress: number; // 0-100
  budget: number;
  milestones: {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }[];
  deliverables: string[];
  driveFolderLink?: string;
  reviewLink?: string;
  notes?: string;
  isArchived?: boolean;
}

export interface CustomClientField {
  id: string;
  label: string;
  value: string;
  category?: 'Personal' | 'Business' | 'Family' | 'Household' | 'Travel' | 'Health' | 'Grooming' | 'Dates' | 'Social' | 'Goals' | 'Hobbies' | 'Financial' | 'Custom';
}

export interface ClientIntelligence {
  executiveProfile: {
    preferredName: string;
    pronunciation?: string;
    timezone: string;
    communicationStyle: string; // e.g. "Direct, bullet points, async via Slack"
    meetingPreferences: string; // e.g. "Morning meetings only, max 30 mins, agenda required"
    decisionMakingStyle: string; // e.g. "Data-driven, likes 2-3 structured options"
    reportingPreferences: string; // e.g. "Weekly digest on Friday 4 PM EST"
    legalName?: string;
    pronouns?: string;
    personalEmail?: string;
    personalPhone?: string;
    residenceAddress?: string;
  };
  businessProfile: {
    company: string;
    industry: string;
    website: string;
    coreServices: string;
    currentGoals: string;
    keyChallenges: string;
    keyTeamMembers: string;
    primaryVendors: string;
    coreSystems: string; // e.g. "Google Workspace, Notion, Stripe, Webflow"
    taxIdOrEin?: string;
    businessAddress?: string;
  };
  relationshipProfile: {
    birthday?: string;
    anniversary?: string;
    hobbies: string;
    interests: string;
    travelPreferences: string;
    favoriteRestaurants: string;
    giftIdeas: string;
    personalNotes: string;
  };
  familyInformation?: {
    spouseOrPartner?: string;
    children?: string;
    pets?: string;
    familyNotes?: string;
  };
  householdManagement?: {
    primaryResidence?: string;
    secondaryResidences?: string;
    householdStaff?: string;
    contractorsAndVendors?: string;
    maintenanceSchedule?: string;
    securityAndAccessNotes?: string;
  };
  travelManagement?: {
    passportDetailsAndExpiry?: string;
    frequentFlyerNumbers?: string;
    hotelMemberships?: string;
    airlinePreferences?: string;
    tsaPreOrGlobalEntry?: string;
    travelEmergencyContact?: string;
  };
  healthRecords?: {
    dietaryRestrictions?: string;
    allergies?: string;
    physicianAndDentistContacts?: string;
    wellnessRoutines?: string;
    emergencyMedicalNotes?: string;
  };
  groomingAppointments?: {
    hairStylistOrBarber?: string;
    nailSalon?: string;
    facialAndAesthetician?: string;
    preferredGroomingCadence?: string;
    stylistNotesAndPreferences?: string;
  };
  importantDatesList?: {
    id: string;
    title: string;
    date: string;
    category: 'Birthday' | 'Anniversary' | 'Board Meeting' | 'Milestone' | 'Other';
    notes?: string;
  }[];
  socialRelationshipsVIPs?: {
    id: string;
    name: string;
    role: string;
    company?: string;
    relationshipType: 'Investor' | 'Board Member' | 'Mentor' | 'Key Partner' | 'VIP Client' | 'Friend';
    notes?: string;
  }[];
  strategicGoals?: {
    id: string;
    title: string;
    targetTimeline: string;
    category: 'Business' | 'Personal' | 'Financial';
    progress?: number;
  }[];
  hobbiesAndInterests?: {
    sports?: string;
    leisureAndClubs?: string;
    readingAndMedia?: string;
    favoriteCuisines?: string;
  };
  financialReminders?: {
    id: string;
    title: string;
    dueDate: string;
    frequency?: 'Monthly' | 'Quarterly' | 'Annual' | 'One-off';
    amount?: number;
    notes?: string;
  }[];
  customFields?: CustomClientField[];
  lifestyleContext: {
    familyMembers?: string;
    familyMatters?: string;
    importantDates?: string;
    wellnessRoutine?: string;
    dietaryRestrictions?: string;
    travelHabits?: string;
    travelsAndTrips?: string;
    householdNeeds?: string;
    socialCircleKeyVIPs?: string;
    financesToRemindOrHandle?: string;
    hobbiesAndGoals?: string;
    healthAndFamilyWellness?: string;
    dailyAppointments?: string;
    groomingAppointments?: string; // nails, facial, salon, aesthetician, doctor, dentist, etc.
  };
  memoryVault: {
    id: string;
    date: string;
    title: string;
    content: string;
    category: 'meeting_note' | 'context' | 'lesson_learned' | 'preference';
    visibility: 'internal_only' | 'client_visible';
  }[];
}

export interface OnboardingPhase {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  items: {
    id: string;
    title: string;
    completed: boolean;
    assignedDate?: string;
  }[];
}

export interface ClientDailyRoutine {
  id: string;
  clientId: string;
  title: string;
  phase: 'opening' | 'midday' | 'eod';
  completed: boolean;
  estimatedMinutes?: number;
  timeTarget?: string;
  isInternal?: boolean;
}

export interface Client {
  id: string;
  code: string; // e.g. "ARKG", "STRK"
  name: string;
  primaryContact: string;
  email: string;
  phone?: string;
  company: string;
  status: 'active' | 'onboarding' | 'paused' | 'offboarding' | 'archived';
  avatarColor: string; // pastel color class or hex
  contractType: 'retainer' | 'project' | 'hourly';
  monthlyRetainerFee?: number;
  hourlyRate?: number;
  purchasedHours?: number;
  usedHoursThisMonth: number;
  totalRevenueYTD: number;
  relationshipHealth: 'exceptional' | 'good' | 'needs_attention';
  onboardingProgress: number; // 0-100
  onboardingPhases: OnboardingPhase[];
  intelligence: ClientIntelligence;
  googleDriveFolderUrl?: string;
  slackChannel?: string;
  joinedDate: string;
  portalToken?: string;
  portalCustomNotes?: string;
  dailyRoutines?: ClientDailyRoutine[];
  offboardingChecklist?: {
    id: string;
    title?: string;
    task?: string;
    category?: string;
    notes?: string;
    completed: boolean;
  }[];
  offboardingNotes?: string;
  offboardingProgress?: number;
  offboardingDate?: string;
  // Global Operations & Timezone Hub fields
  timezone?: string; // e.g. "America/Los_Angeles", "Europe/London", "Asia/Tokyo"
  city?: string;
  country?: string;
  countryCode?: string; // "US", "GB", "JP", "FR", "AU", "SG", "DE"
  flagEmoji?: string;
  workingHoursStart?: string; // "09:00"
  workingHoursEnd?: string; // "17:30"
  businessHoursStart?: string; // "08:30"
  businessHoursEnd?: string; // "18:00"
  endOfShiftTime?: string; // "17:30"
  preferredCommsStart?: string; // "10:00"
  preferredCommsEnd?: string; // "16:00"
  meetingAvailabilityStart?: string; // "10:00"
  meetingAvailabilityEnd?: string; // "16:30"
  meetingDays?: string[]; // ["Monday", "Tuesday", "Wednesday", "Thursday"]
  maxMeetingDurationMins?: number; // 25, 45, 60
  communicationChannels?: string[]; // ["Slack", "Email", "WhatsApp", "Voice Memos", "Loom"]
  responseSlaHours?: number; // 2, 4, 12, 24
  isTravelModeActive?: boolean;
  travelCity?: string;
  travelCountry?: string;
  travelTimezone?: string;
  travelStartDate?: string;
  travelEndDate?: string;
  travelReason?: string;
  customHolidays?: { id: string; name: string; date: string; isRecurring?: boolean }[];
  stakeholders?: ClientStakeholder[];
  learnedPatterns?: { id: string; pattern: string; bestWindow: string; confidence: number; category: 'reply_speed' | 'approval_time' | 'meeting_pref' | 'deep_work' }[];
  isArchived?: boolean;
}

export interface TimeAllocation {
  id: string;
  targetType: 'task' | 'client' | 'project';
  targetId: string;
  targetName: string;
  percentage: number; // e.g. 60
}

export interface TimeEntry {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime?: string; // HH:mm
  durationMinutes: number;
  isBillable: boolean;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  serviceId?: string;
  serviceName?: string;
  taskId?: string;
  taskTitle?: string;
  hourlyRate: number;
  value: number;
  notes: string;
  tags: string[];
  allocations?: TimeAllocation[]; // Multi-allocation support
  createdAt: string;
  lastModified?: string;
  modifiedBy?: string;
  editReason?: string;
}

export interface AuditChange {
  field: string;
  label: string;
  oldValue: any;
  newValue: any;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO format
  entityType: 'time_entry' | 'retainer_period' | 'client_hours' | 'invoice' | 'historical_record' | 'payment';
  entityId: string;
  entityTitle: string; // e.g. "INV-2026-083" or "Time Entry: Arkgate Ventures"
  clientId?: string;
  clientName?: string;
  action: 'created' | 'updated' | 'deleted' | 'adjusted_hours' | 'status_changed' | 'marked_paid' | 'archived' | 'restored';
  actor: string; // e.g. "Sarah Jenkins (Lead Freelancer)"
  changes: AuditChange[];
  reason?: string; // Clear operational justification note
  metadata?: Record<string, any>;
}

export interface RetainerPeriodLog {
  id: string;
  clientId: string;
  clientName: string;
  periodMonth: string; // "2026-08", "2026-07", etc.
  purchasedHours: number; // Base contractual hours
  rolloverHours: number; // Hours rolled over from previous period
  manualAdjustmentHours: number; // Operational manual adjustment (+/-)
  usedHours: number; // Logged consumed hours
  effectiveAvailableHours: number; // purchased + rollover + manualAdjustment
  remainingHours: number; // effectiveAvailable - used
  status: 'active' | 'closed' | 'reconciled' | 'archived';
  hourlyRate: number;
  monthlyFee: number;
  notes?: string;
  lastModified: string;
  modifiedBy?: string;
  adjustmentReason?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  category: 'Executive Assistance' | 'Operations' | 'Marketing' | 'Design & Branding' | 'Web & Tech' | 'Consulting' | 'Custom' | string;
  description: string;
  scope: string[];
  deliverables: string[];
  workflowSteps?: string[];
  estimatedTimeline?: string;
  pricingModel: 'Hourly' | 'Monthly Retainer' | 'Fixed Project' | string;
  baseRate: number;
  basePrice?: number;
  tier?: string;
  includedHours?: number;
  idealFor?: string;
  targetMarginPercentage?: number;
  sopReferences?: string[];
  isActive?: boolean;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-0042"
  clientId: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'viewed' | 'partially_paid' | 'paid' | 'archived' | 'overdue' | 'cancelled';
  notes?: string;
  paymentMethod?: string;
  paidDate?: string;
  referenceNumber?: string;
  paymentReferenceNumber?: string;
  paymentUrl?: string; // Required before marking as Paid
  partiallyPaidAmount?: number;
  remainingBalance?: number;
  paymentProofUrl?: string;
  paymentProofFileName?: string;
  paymentNotes?: string;
  receiptLink?: string;
  isArchived?: boolean;
  lastModified?: string;
  modifiedBy?: string;
  editReason?: string;
}

export interface PaymentRecord {
  id: string;
  invoiceId?: string;
  invoiceNumber?: string;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
  method: 'Stripe' | 'Bank Transfer' | 'Wise' | 'PayPal' | 'Credit Card' | 'Check';
  referenceNumber: string;
  notes?: string;
  receiptUrl?: string;
}

export interface ContractTemplate {
  id: string;
  type: 'executive_assistance' | 'retainer' | 'branding' | 'graphic_design' | 'marketing' | 'website_design' | 'website_development' | 'consulting' | 'nda' | 'subcontractor';
  title: string;
  description: string;
  contentTemplate: string;
  requiredFields: string[];
}

export interface GeneratedContract {
  id: string;
  templateType: string;
  title: string;
  clientId: string;
  clientName: string;
  effectiveDate: string;
  expirationDate?: string;
  totalValue: number;
  status: 'draft' | 'sent_for_signature' | 'active' | 'completed' | 'terminated';
  filledContent: string;
  googleDocUrl?: string;
  createdAt: string;
}

export interface ApprovalItem {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  type: 'deliverable' | 'design_proof' | 'content_copy' | 'schedule_change' | 'budget_expansion' | 'expense_reimbursement' | 'invoice_approval';
  status: 'pending' | 'approved' | 'revision_requested' | 'rejected' | 'escalated';
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  ownerName?: string;
  assignedApprover?: string;
  escalationContact?: string;
  reminderCount?: number;
  lastReminderSentAt?: string;
  slaHours?: number;
  submittedDate: string;
  dueDate: string;
  reviewLink: string;
  comments: string;
  context?: string;
  recommendation?: string;
  reasoning?: string;
  expectedOutcomes?: string;
  deliverableType?: 'link' | 'document' | 'design' | 'proposal' | 'content' | 'website' | 'branding' | 'financial';
  relatedModule?: 'invoice' | 'expense' | 'contract' | 'deliverable' | 'time' | 'travel';
  relatedRecordId?: string;
  rejectionReason?: string;
  questionsAsked?: { id: string; author: string; text: string; timestamp: string; reply?: string }[];
  decisionHistory: {
    timestamp: string;
    action: string;
    author: string;
    note?: string;
  }[];
}

export interface ExecutiveBriefing {
  id: string;
  clientId: string;
  date: string;
  type: 'weekly_briefing' | 'quick_checkin' | 'eod_report' | 'monthly_review' | 'executive_summary';
  title: string;
  headline: string;
  summary: string;
  winsAndAccomplishments: string[];
  currentPriorities: {
    id: string;
    title: string;
    businessImpact: string;
    owner: 'assistant' | 'client';
    status: 'in_progress' | 'awaiting_input' | 'completed' | 'on_track';
  }[];
  strategicOpportunities: string[];
  risksAndBlockers: {
    risk: string;
    impact: string;
    mitigationPlan: string;
  }[];
  decisionsNeeded: string[];
  recommendationsSummary?: string;
  nextSteps: string[];
  metricsSnapshot?: {
    label: string;
    value: string;
    trend?: string;
  }[];
}

export interface StrategicRecommendation {
  id: string;
  clientId: string;
  category: 'business_growth' | 'operations' | 'marketing' | 'systems_automation' | 'productivity' | 'customer_experience' | 'cost_savings' | 'strategic_initiatives';
  title: string;
  opportunityDescription: string;
  expectedImpact: string;
  implementationEffort: 'low' | 'medium' | 'high';
  priorityLevel: 'urgent' | 'high' | 'strategic' | 'growth';
  recommendedTimeline: string;
  status: 'proposed' | 'greenlit' | 'under_review' | 'implemented' | 'dismissed';
  clientFeedback?: string;
  actionItems?: string[];
}

export interface ClientStrategicObjective {
  id: string;
  clientId: string;
  title: string;
  category: 'Revenue & Growth' | 'Operational Scaling' | 'Brand & Market Position' | 'Executive Focus & Freedom' | 'Product & Launch';
  strategicIntent: string;
  progressStatus: 'ahead' | 'on_track' | 'needs_alignment' | 'achieved';
  outcomeDescription: string;
  milestones: {
    id: string;
    title: string;
    targetTimeline: string;
    completed: boolean;
    outcomeAchieved?: string;
    owner: 'assistant' | 'client';
  }[];
}

export type TemplateCategory = 
  | 'proposals' 
  | 'proposal'
  | 'reports' 
  | 'report'
  | 'onboarding' 
  | 'communications' 
  | 'client_communication'
  | 'contracts_legal' 
  | 'legal_agreement'
  | 'sow' 
  | 'cover_letters' 
  | 'cover_letter'
  | 'outreach' 
  | 'executive_brief'
  | 'custom'
  | string;

export interface TemplateVariable {
  key: string; // e.g. "client_name"
  label: string; // e.g. "Client Name"
  defaultValue?: string;
  type?: 'text' | 'number' | 'date' | 'textarea' | 'select';
  options?: string[];
  description?: string;
  placeholder?: string;
  required?: boolean;
}

export interface ManagedTemplate {
  id: string;
  title: string;
  category: TemplateCategory;
  description: string;
  content: string; // Markdown or text with {{variable}} placeholders
  variables: TemplateVariable[];
  tags: string[];
  isArchived?: boolean;
  isFavorite?: boolean;
  version?: number;
  usageCount?: number;
  createdAt: string;
  updatedAt: string;
  author?: string;
}

export interface GeneratedDraftRecord {
  id: string;
  templateId: string;
  templateTitle: string;
  clientId?: string;
  clientName?: string;
  title: string;
  content: string; // fully editable output
  variablesUsed: Record<string, string>;
  createdAt: string;
  status: 'draft' | 'finalized' | 'exported';
  format?: 'cover_letter' | 'outreach' | 'proposal' | 'report' | 'document';
}

export interface ClientKnowledgeDocument {
  id: string;
  clientId: string;
  title: string;
  category: 'SOPs' | 'Processes' | 'Documentation' | 'References' | 'Notes' | 'Business Manuals' | 'Brand Guidelines' | 'Operating Processes' | 'Key Resources & Vaults' | 'Onboarding Materials' | string;
  summary: string;
  content: string;
  lastUpdated: string;
  author: string;
  tags: string[];
  externalResourceUrl?: string;
  isPinned?: boolean;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: 'SOPs' | 'Playbooks' | 'Policies' | 'Training Materials' | 'Templates' | 'Processes' | 'Service Delivery' | 'Business Operations' | string;
  summary: string;
  content: string;
  tags: string[];
  lastUpdated: string;
  relatedService?: string;
  isPinned?: boolean;
  author?: string;
}

export interface Opportunity {
  id: string;
  prospectName: string;
  company: string;
  email?: string;
  type: 'lead' | 'referral' | 'partnership' | 'upsell' | 'renewal';
  stage: 'lead' | 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'prospect' | 'closed_won' | 'closed_lost';
  estimatedValue: number;
  serviceInterest: string;
  source: string;
  nextFollowUpDate: string;
  notes: string;
  confidencePercentage: number;
  createdAt: string;
  clientName?: string;
  contactPerson?: string;
  title?: string;
  probability?: number;
  expectedCloseDate?: string;
  serviceType?: string;
}

export interface CEOGoal {
  id: string;
  category: 'Revenue' | 'Savings' | 'Tax Reserve' | 'Capacity & Balance' | 'Studio Growth' | 'Skills & Mastery';
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline: string;
  notes: string;
  status: 'on_track' | 'at_risk' | 'achieved' | 'behind';
}

export interface RateCalculatorInputs {
  // Business Costs (Monthly)
  internetCost: number;
  electricityCost: number;
  softwareSubscriptions: number;
  hostingAndDomains: number;
  equipmentDepreciation: number;
  coworkingOrOffice: number;
  otherBusinessCosts: number;

  // Professional Costs (Monthly / Annualized)
  taxesEstimatedPercentage: number;
  healthInsurance: number;
  governmentRegistration: number;
  legalAndAccounting: number;

  // Lifestyle Compensation (Monthly)
  housingAndLiving: number;
  foodAndGroceries: number;
  transportation: number;
  healthcareAndWellness: number;
  savingsGoal: number;
  emergencyFundContribution: number;
  vacationBufferPercentage: number; // e.g. 10%

  // Capacity
  billableHoursPerWeek: number;
  workingWeeksPerYear: number;
}

export interface UserProfile {
  fullName: string;
  email: string;
  title: string;
  avatarUrl: string;
  timezone: string;
  defaultTimezone?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  flagEmoji?: string;
  workingHoursStart: string; // e.g. "08:30"
  workingHoursEnd: string; // e.g. "17:30"
  businessHoursStart?: string; // e.g. "08:00"
  businessHoursEnd?: string; // e.g. "18:00"
  endOfShiftTime?: string; // e.g. "17:30"
  endOfShiftWindowStart?: string; // e.g. "17:00"
  endOfShiftWindowEnd?: string; // e.g. "18:00"
  agencyName?: string;
  defaultHourlyRate?: number;
  workingDays: string[];
  currency: string;
  monthlyRevenueTarget: number;
  weeklyCapacityHours: number;
  googleDriveRootFolder: string;
  communicationEmail: string;
  defaultFileNamingPrefix: string;
  rememberMeSessionDays: number;
  bio?: string;
  executiveSkills?: string[];
  resumeUrl?: string;
  resumeFileName?: string;
  resumeLastUpdated?: string;
  cvUrl?: string;
  cvFileName?: string;
  cvLastUpdated?: string;
  portfolioLinks?: { id: string; title: string; url: string; platform: string; description?: string }[];
  socialLinks?: { platform: string; url: string; label?: string }[];
  careerDocuments?: { id: string; name: string; type: string; url: string; uploadedDate: string; description?: string; sizeMb?: number }[];
  certifications?: { id: string; name: string; issuer: string; year: string; credentialUrl?: string }[];
  portfolioUrl?: string;
  resumeCvFile?: {
    fileName: string;
    fileUrl: string;
    fileSize?: string;
    uploadedAt: string;
    rawTextContent?: string;
  };
}

// Client Lifecycle & Business Development Module Interfaces
export type LeadStatus = 'identified' | 'outreached' | 'followup_1' | 'followup_2' | 'replied' | 'call_booked' | 'lost';
export type LeadPriority = 'high' | 'medium' | 'low';

export interface LeadItem {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  linkedinUrl?: string;
  channel: 'LinkedIn' | 'Referral' | 'Cold Email' | 'Networking Event' | 'Job Board' | 'Website';
  status: LeadStatus;
  priority: LeadPriority;
  score: number; // 1-100
  estimatedBudget: number;
  outreachSequenceStep: number;
  outreachSequenceTotal: number;
  nextFollowUpDate: string;
  lastContactDate?: string;
  notes: string;
  tags: string[];
}

export interface OutreachTemplateItem {
  id: string;
  category: 'cold_outreach' | 'linkedin_dm' | 'referral_request' | 'networking' | 'cover_letter' | 'follow_up' | 'interview_guide' | 'negotiation_script' | 'proposal_template' | 'onboarding_template' | 'review_request' | 'client_communication';
  title: string;
  subject?: string;
  body: string;
  tags: string[];
  usageCount?: number;
}

export interface ClientDiscoveryItem {
  id: string;
  prospectName: string;
  company: string;
  discoveryDate: string;
  executivePainPoints: string;
  calendarBottlenecks: string;
  systemsInUse: string;
  decisionTimeline: string;
  proposalTier: string;
  proposalValue: number;
  proposalStatus: 'draft' | 'sent' | 'negotiating' | 'approved' | 'rejected';
  negotiationNotes: string;
  contractStatus: 'draft' | 'ready' | 'signed';
  depositVerified: boolean;
  stage: 'discovery' | 'proposal' | 'negotiation' | 'contract' | 'deposit' | 'active';
}

export interface OnboardingItem {
  id: string;
  clientId: string;
  clientName: string;
  kickoffDate: string;
  kickoffAgenda: string;
  infoFormStatus: 'pending' | 'in_progress' | 'completed';
  credentialsCollected: boolean;
  workspaceSetup: boolean;
  firstWeekMilestones: string;
  progressPercent: number;
  checklist: {
    id: string;
    title: string;
    category: 'Legal & Billing' | 'Executive Intake' | 'Access & Vaults' | 'Cadence & Comms' | 'First 7 Days';
    completed: boolean;
  }[];
}

export interface ClientSuccessItem {
  id: string;
  clientId: string;
  clientName: string;
  healthScore: number; // 1-100
  satisfactionRating: number; // 1-5
  weeklyUpdates: {
    id: string;
    date: string;
    summary: string;
    highlights: string[];
  }[];
  eodReports: {
    id: string;
    date: string;
    completed: string;
    inFlight: string;
    tomorrowDefense: string;
  }[];
  quickCheckIns: {
    id: string;
    date: string;
    message: string;
  }[];
  monthlyReviews: {
    id: string;
    month: string;
    rating: number;
    feedback: string;
    expansionOpportunity?: string;
  }[];
  scopeCreepAlerts: {
    id: string;
    date: string;
    requestDetails: string;
    resolution: string;
    status: 'flagged' | 'upsold' | 'absorbed';
  }[];
}

export interface OffboardingItem {
  id: string;
  clientId: string;
  clientName: string;
  offboardingDate: string;
  reason: 'project_completed' | 'client_restructure' | 'mutual_conclusion' | 'capacity_rotation';
  finalDeliverablesCompleted: boolean;
  finalInvoicePaid: boolean;
  handoverDocDelivered: boolean;
  credentialsRevoked: boolean;
  testimonialReceived: boolean;
  testimonialQuote?: string;
  referralRequested: boolean;
  referralNotes?: string;
  isArchived: boolean;
  checklist: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface ClientIntelligenceExtended {
  id: string;
  clientId: string;
  clientName: string;
  executiveProfile: {
    preferredName: string;
    pronouns?: string;
    timezone: string;
    role: string;
    communicationPreferences: string;
    decisionMakingStyle: string;
    morningRoutine: string;
    eveningRoutine: string;
    workingHours: string;
  };
  familyAndPersonal: {
    spousePartner?: string;
    children?: string;
    pets?: string;
    anniversaries?: string;
    birthdays?: string;
    hobbiesInterests: string;
    healthWellnessConsiderations: string;
    dietaryRestrictions: string;
    favoriteRestaurants: string;
    favoriteCuisines: string;
    giftPreferences: string;
  };
  businessContext: {
    companyName: string;
    industry: string;
    executiveGoals: string;
    primaryVendors: string;
    teamMembers: { name: string; role: string; email: string; note: string }[];
    socialCircleKeyVIPs: string[];
    coreSoftwareStack: string;
  };
  executiveAssistantNotes: {
    id: string;
    date: string;
    category: 'Protocol' | 'Preference' | 'Observation' | 'Critical Rule';
    note: string;
  }[];
}

export interface ClientHoliday {
  id: string;
  countryCode: string;
  countryName: string;
  name: string;
  date: string; // YYYY-MM-DD (or MM-DD for annual recurring)
  impact: 'full_closure' | 'bank_holiday' | 'observance';
  affectedClientIds: string[];
  isRecurring?: boolean; // Recurring annual holiday
  isCustom?: boolean; // Custom studio or client shutdown
  category?: 'annual_recurring' | 'custom_observance' | 'studio_closure' | 'national';
  notes?: string;
}

export interface DualTimeConversion {
  freelancerTimeStr: string;
  freelancerTimezone: string;
  freelancerDate: string;
  clientTimeStr: string;
  clientTimezone: string;
  clientDate: string;
  isClientInWorkingHours: boolean;
  isClientInPreferredWindow: boolean;
  isClientSleeping: boolean;
  timeDifferenceLabel: string;
}

export interface MeetingOverlapSlot {
  freelancerTime: string; // e.g. "11:00 AM"
  freelancerHour: number; // 0-23
  clientTimes: {
    clientId: string;
    clientName: string;
    city: string;
    flagEmoji: string;
    localTime: string;
    hour: number;
    status: 'optimal' | 'acceptable' | 'off_hours' | 'sleeping';
  }[];
  overlapScore: 'excellent' | 'good' | 'fair' | 'poor';
  recommendation: string;
}

export interface SmartCommunicationRecommendation {
  clientId: string;
  clientName: string;
  flagEmoji: string;
  city: string;
  actionType: 'send_message' | 'send_update' | 'send_eod_report' | 'send_follow_up' | 'request_approval' | 'schedule_sync';
  urgency: 'now' | 'scheduled' | 'wait_for_morning';
  suggestedFreelancerTime: string;
  suggestedClientTime: string;
  reason: string;
  templateSnippet: string;
}

// ----------------------------------------------------
// Stakeholder Overlap Finder Interfaces
// ----------------------------------------------------
export interface ClientStakeholder {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  timezone: string;
  country?: string;
  countryCode?: string;
  city?: string;
  flagEmoji?: string;
  workingHoursStart: string; // "09:00"
  workingHoursEnd: string; // "17:00"
  businessHoursStart?: string;
  businessHoursEnd?: string;
  endOfShiftTime?: string;
  availabilityNotes?: string;
  avatarColor?: string;
  isActive?: boolean;
}

// ----------------------------------------------------
// Weekly Google Drive File Audit Interfaces
// ----------------------------------------------------
export interface DriveAuditCheckItem {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  category: 'Hierarchy' | 'Naming' | 'Permissions' | 'Archiving' | 'Sync' | 'SignOff';
  completed: boolean;
  notes?: string;
}

export interface DriveAuditRecord {
  id: string;
  auditDate: string;
  auditorName: string;
  clientFolderCount: number;
  filesCleanedCount: number;
  permissionsRevokedCount: number;
  storageOptimizedMB: number;
  status: 'completed' | 'in_progress' | 'scheduled';
  summaryNotes: string;
  completedSteps: string[];
}

// ----------------------------------------------------
// Freelancer Expense Tracker Interfaces
// ----------------------------------------------------
export type ExpenseCategory = 
  | 'software_subscription' 
  | 'client_travel' 
  | 'freelancer_travel' 
  | 'equipment_hardware' 
  | 'contractor_payout' 
  | 'compensation_withdrawal' 
  | 'office_supplies' 
  | 'marketing' 
  | 'other';

export interface FreelancerExpense {
  id: string;
  date: string;
  category: 'withdrawal' | 'transfer' | 'travel' | 'subscription' | 'business_expense' | 'reimbursement' | 'equipment' | 'other' | ExpenseCategory;
  description?: string;
  title?: string;
  amount: number;
  currency?: string;
  paymentMethod: string;
  referenceNumber?: string;
  clientId?: string;
  clientName?: string;
  isReimbursable?: boolean;
  isBillableToClient?: boolean;
  status: 'cleared' | 'pending' | 'reimbursed' | 'paid';
  receiptUrl?: string;
  notes?: string;
  createdAt: string;
}

// Export Multi-Tenant SaaS platform types
export * from './saas';

// ----------------------------------------------------
// Authentication, Roles & Security Interfaces
// ----------------------------------------------------
export type UserRole = 
  | 'Owner' 
  | 'Administrator' 
  | 'Operations Manager' 
  | 'Executive Assistant' 
  | 'Contractor' 
  | 'Read Only';

export interface UserAccount {
  id: string;
  fullName: string;
  username: string;
  email: string;
  passwordHash: string; // SHA-256 with salt
  passwordSalt: string;
  role: UserRole;
  isPrimaryOwner: boolean;
  isSuperAdmin?: boolean; // Ellysa May M. Del Prado is the sole Super Admin
  tenantId?: string; // Isolated workspace ID
  status: 'active' | 'suspended' | 'archived';
  timezone: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  businessName?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
  mustChangePassword?: boolean; // Requires password change on first login
  subscriptionTier?: 'starter_freelance' | 'pro_executive' | 'agency_studio';
  subscriptionStatus?: 'active' | 'pending_payment' | 'past_due' | 'trial' | 'suspended' | 'cancelled';
  hourlyRate?: number;
  currency?: string;
  lastPaymentReference?: string;
  subscriptionExpiresAt?: string;
}

export interface AuthSession {
  user: UserAccount;
  token: string;
  expiresAt: string;
}

export interface AuthAuditLog {
  id: string;
  timestamp: string;
  username: string;
  action: 'login_success' | 'login_failed' | 'account_created' | 'account_suspended' | 'role_changed' | 'password_reset' | 'password_updated' | 'lockout_triggered' | 'logout';
  ipAddress?: string;
  details?: string;
}

// ----------------------------------------------------
// System-Wide Action & Change Logging Interface
// ----------------------------------------------------
export interface SystemActionLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  actionType: 'create' | 'update' | 'delete' | 'archive' | 'payment_verified' | 'export' | 'audit_completed' | 'status_change';
  module: 'tasks' | 'clients' | 'finance' | 'invoices' | 'expenses' | 'approvals' | 'time' | 'drive_audit' | 'briefings' | 'auth' | 'composer';
  description: string;
  targetId?: string;
  targetName?: string;
}

// ----------------------------------------------------
// Smart Message & Document Composer Interfaces
// ----------------------------------------------------
export type ComposerTemplateType = 'message' | 'document' | 'report' | 'outreach_pitch' | 'cover_letter';

export interface ComposerTemplate {
  id: string;
  type: ComposerTemplateType;
  title: string;
  description: string;
  category: string;
  subjectTemplate?: string;
  contentTemplate: string;
  variables: { name: string; label: string; placeholder: string; defaultValue?: string }[];
  usageCount: number;
  isSystem?: boolean;
  createdAt: string;
}

export interface GeneratedDocument {
  id: string;
  templateId?: string;
  templateType: ComposerTemplateType;
  title: string;
  subject?: string;
  content: string;
  clientId?: string;
  clientName?: string;
  format: 'plain' | 'markdown' | 'html';
  createdAt: string;
}

// ----------------------------------------------------
// Ultimate EA Executive Decision Brief Interfaces
// ----------------------------------------------------
export interface ExecutiveBriefTodayItem {
  id: string;
  time?: string;
  title: string;
  category: 'meeting' | 'appointment' | 'deadline' | 'commitment' | 'decision' | 'personal' | 'travel';
  locationOrPlatform?: string;
  duration?: string;
  context?: string;
  prep?: string;
  requiresClientDecision?: boolean;
}

export interface AttentionItem {
  id: string;
  type: 'decision' | 'approval' | 'reply' | 'deadline' | 'blocker';
  title: string;
  dueDateOrTime?: string;
  actionUrl?: string;
  impactContext?: string;
  status: 'pending' | 'resolved';
}

export interface ImportantInfoItem {
  id: string;
  type: 'flight_travel' | 'meeting_change' | 'arrival' | 'package_document' | 'conflict' | 'project_status' | 'personal_reminder';
  title: string;
  details: string;
  impact?: 'high' | 'medium' | 'info';
}

export interface WorkSituationItem {
  id: string;
  category: string; // e.g. "ARKG", "Project X", "Proposal", "Team"
  summary: string;
  status: 'awaiting_approval' | 'on_track' | 'awaiting_response' | 'completed' | 'attention_needed';
}

export interface PersonalSituationItem {
  id: string;
  category: 'Appointments' | 'Family' | 'Travel' | 'Errands' | 'Purchases' | 'Reservations' | 'Birthdays' | 'Grooming' | 'Household';
  summary: string;
  timeOrDate?: string;
}

export interface EAHandledItem {
  id: string;
  title: string;
  timestamp: string;
  completed: boolean;
}

export interface UpcomingItem {
  id: string;
  timeframe: 'Tomorrow' | 'Thursday' | 'Friday' | 'Next Week' | string;
  title: string;
  timeOrDetail: string;
  category?: string;
}

export interface ExecutiveDecisionBrief {
  id: string;
  clientId: string;
  date: string;
  perspective: 'today' | 'tomorrow' | 'week' | 'month';
  eaGreeting: string; // e.g. "Good morning. Here’s what matters today."
  eaNote: string;
  todayItems: ExecutiveBriefTodayItem[];
  attentionItems: AttentionItem[];
  importantItems: ImportantInfoItem[];
  workSituation: WorkSituationItem[];
  personalSituation: PersonalSituationItem[];
  handledForYou: EAHandledItem[];
  upcomingItems: UpcomingItem[];
}

// ----------------------------------------------------
// Proactive High-Impact Notifications Interfaces
// ----------------------------------------------------
export type NotificationPurpose = 
  | 'needs_action' 
  | 'waiting_on_others' 
  | 'growth_opportunity' 
  | 'business_health' 
  | 'executive_reminder';

export interface ProactiveNotification {
  id: string;
  purpose: NotificationPurpose;
  title: string;
  message: string;
  clientId?: string;
  clientName?: string;
  actionLabel?: string;
  actionLink?: string;
  impactScore: number; // 1-100 for high-impact prioritization
  isRead?: boolean;
  createdAt: string;
}



