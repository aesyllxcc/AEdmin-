import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getTenantStorageKey, SUPER_ADMIN_TENANT_ID } from '@/utils/workspaceManager';
import { 
  Task, 
  Client, 
  ClientDailyRoutine,
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
  RateCalculatorInputs,
  ExecutiveBriefing,
  StrategicRecommendation,
  ClientStrategicObjective,
  ClientKnowledgeDocument,
  ClientHoliday,
  ManagedTemplate,
  GeneratedDraftRecord,
  AuditLogEntry,
  AuditChange,
  RetainerPeriodLog
} from '../types';
import { 
  initialUserProfile, 
  initialClients, 
  initialTasks, 
  initialProjects, 
  initialTimeEntries, 
  initialServices, 
  initialInvoices, 
  initialPayments, 
  initialExpenses,
  initialApprovals, 
  initialKnowledgeArticles, 
  initialOpportunities, 
  initialCEOGoals, 
  initialRateCalculator,
  initialHolidays
} from '../data/seedData';
import {
  initialBriefings,
  initialRecommendations,
  initialStrategicObjectives,
  initialClientKnowledgeDocs
} from '../data/portalSeedData';
import {
  initialManagedTemplates,
  initialGeneratedDrafts
} from '../data/templateSeedData';
import {
  initialAuditLogs,
  initialRetainerPeriods
} from '../data/auditSeedData';

interface ActiveTimer {
  isRunning: boolean;
  isPaused: boolean;
  seconds: number;
  startTime?: string;
  clientId: string;
  projectId?: string;
  taskId?: string;
  notes: string;
  isBillable: boolean;
}

interface AppContextType {
  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'joinedDate' | 'totalRevenueYTD' | 'usedHoursThisMonth'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  archiveClient: (id: string) => void;
  restoreClient: (id: string) => void;
  duplicateClient: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  archiveTask: (id: string) => void;
  restoreTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;

  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  archiveProject: (id: string) => void;
  restoreProject: (id: string) => void;

  // Centralized Template Management & Generation
  templates: ManagedTemplate[];
  addTemplate: (template: Omit<ManagedTemplate, 'id' | 'createdAt' | 'updatedAt'>) => ManagedTemplate;
  updateTemplate: (id: string, updates: Partial<ManagedTemplate>) => void;
  deleteTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => void;
  archiveTemplate: (id: string) => void;
  restoreTemplate: (id: string) => void;
  toggleFavoriteTemplate: (id: string) => void;

  // Generated Drafts
  generatedDrafts: GeneratedDraftRecord[];
  saveGeneratedDraft: (draft: Omit<GeneratedDraftRecord, 'id' | 'createdAt'>) => GeneratedDraftRecord;
  deleteGeneratedDraft: (id: string) => void;
  updateGeneratedDraft: (id: string, updates: Partial<GeneratedDraftRecord>) => void;

  // Time Tracking & Retainers
  timeEntries: TimeEntry[];
  addTimeEntry: (entry: Omit<TimeEntry, 'id' | 'createdAt'>, reason?: string) => TimeEntry;
  updateTimeEntry: (id: string, updates: Partial<TimeEntry>, reason?: string) => void;
  deleteTimeEntry: (id: string, reason?: string) => void;
  duplicateTimeEntry: (id: string) => void;
  activeTimer: ActiveTimer;
  startTimer: (details?: { clientId?: string; projectId?: string; taskId?: string; notes?: string; isBillable?: boolean }) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: (save?: boolean) => void;
  updateActiveTimerNotes: (notes: string) => void;

  // Retainer Periods & Hours Management
  retainerPeriods: RetainerPeriodLog[];
  addRetainerPeriod: (period: Omit<RetainerPeriodLog, 'id' | 'lastModified'>, reason?: string) => RetainerPeriodLog;
  updateRetainerPeriod: (id: string, updates: Partial<RetainerPeriodLog>, reason?: string) => void;
  deleteRetainerPeriod: (id: string, reason?: string) => void;
  adjustClientAvailableHours: (clientId: string, newPurchasedHours: number, newRolloverHours?: number, manualAdjustment?: number, reason?: string) => void;

  // Traceable Audit Logs & History
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'actor'> & { actor?: string; timestamp?: string }) => AuditLogEntry;
  clearAuditLogs: () => void;
  exportAuditLogsJSON: () => string;
  exportAuditLogsCSV: () => string;

  // Services
  services: ServicePackage[];
  addService: (service: Omit<ServicePackage, 'id'>) => void;
  updateService: (id: string, updates: Partial<ServicePackage>) => void;
  deleteService: (id: string) => void;
  duplicateService: (id: string) => void;

  // Finance, Invoices & Expenses
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id'>, reason?: string) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>, reason?: string) => void;
  updateInvoiceStatus: (id: string, status: Invoice['status'], reason?: string) => void;
  deleteInvoice: (id: string, reason?: string) => void;
  duplicateInvoice: (id: string) => void;
  markInvoicePaid: (id: string, paymentDetails?: { method?: string; referenceNumber?: string; paidDate?: string; paymentProofUrl?: string; paymentNotes?: string }, reason?: string) => void;

  payments: PaymentRecord[];
  addPayment: (payment: Omit<PaymentRecord, 'id'>) => void;
  deletePayment: (id: string) => void;

  expenses: FreelancerExpense[];
  addExpense: (expense: Omit<FreelancerExpense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<FreelancerExpense>) => void;
  deleteExpense: (id: string) => void;
  updateRetainerHours: (clientId: string, purchasedHours: number, usedHoursThisMonth: number, reason?: string) => void;

  // Approvals
  approvals: ApprovalItem[];
  addApproval: (approval: Omit<ApprovalItem, 'id' | 'submittedDate' | 'decisionHistory'>) => void;
  updateApprovalStatus: (id: string, status: ApprovalItem['status'], comment?: string) => void;
  askApprovalQuestion: (approvalId: string, author: string, question: string) => void;
  deleteApproval: (id: string) => void;

  // Executive Briefings & Client Updates
  briefings: ExecutiveBriefing[];
  addBriefing: (briefing: Omit<ExecutiveBriefing, 'id'>) => void;
  updateBriefing: (id: string, updates: Partial<ExecutiveBriefing>) => void;
  deleteBriefing: (id: string) => void;

  // Strategic Recommendations Hub
  recommendations: StrategicRecommendation[];
  addRecommendation: (rec: Omit<StrategicRecommendation, 'id'>) => void;
  updateRecommendation: (id: string, updates: Partial<StrategicRecommendation>) => void;
  updateRecommendationStatus: (id: string, status: StrategicRecommendation['status'], feedback?: string) => void;
  deleteRecommendation: (id: string) => void;

  // Client Strategic Objectives & Outcomes
  strategicObjectives: ClientStrategicObjective[];
  addStrategicObjective: (obj: Omit<ClientStrategicObjective, 'id'>) => void;
  updateStrategicObjective: (id: string, updates: Partial<ClientStrategicObjective>) => void;
  toggleObjectiveMilestone: (objectiveId: string, milestoneId: string) => void;
  deleteStrategicObjective: (id: string) => void;

  // Client Knowledge Base & Operating Manuals
  clientKnowledgeDocs: ClientKnowledgeDocument[];
  addClientKnowledgeDoc: (doc: Omit<ClientKnowledgeDocument, 'id' | 'lastUpdated'>) => void;
  updateClientKnowledgeDoc: (id: string, updates: Partial<ClientKnowledgeDocument>) => void;
  deleteClientKnowledgeDoc: (id: string) => void;

  // Knowledge HQ
  knowledgeArticles: KnowledgeArticle[];
  addKnowledgeArticle: (article: Omit<KnowledgeArticle, 'id' | 'lastUpdated'>) => void;
  updateKnowledgeArticle: (id: string, updates: Partial<KnowledgeArticle>) => void;
  deleteKnowledgeArticle: (id: string) => void;

  // Opportunities
  opportunities: Opportunity[];
  addOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt'>) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;

  // CEO Goals
  ceoGoals: CEOGoal[];
  updateCEOGoal: (id: string, updates: Partial<CEOGoal>) => void;
  addCEOGoal: (goal: Omit<CEOGoal, 'id'>) => void;
  deleteCEOGoal: (id: string) => void;

  // Rate Calculator
  rateCalculator: RateCalculatorInputs;
  updateRateCalculator: (inputs: Partial<RateCalculatorInputs>) => void;

  // Client Portal Simulation & Access
  portalClientId: string | null;
  setPortalClientId: (clientId: string | null) => void;
  generateClientPortalToken: (clientId: string) => string;

  // Workday Routine checklist state
  dailyRoutines: {
    opening: { id: string; title: string; completed: boolean }[];
    midday: { id: string; title: string; completed: boolean }[];
    eod: { id: string; title: string; completed: boolean }[];
  };
  toggleRoutineItem: (phase: 'opening' | 'midday' | 'eod', id: string) => void;
  resetDailyRoutines: () => void;

  // Client-specific Workday Routines
  toggleClientRoutineItem: (clientId: string, routineId: string) => void;
  addClientRoutineItem: (clientId: string, item: Omit<ClientDailyRoutine, 'id' | 'clientId'>) => void;
  deleteClientRoutineItem: (clientId: string, routineId: string) => void;

  // Global Operations & Holidays
  holidays: ClientHoliday[];
  addHoliday: (holiday: Omit<ClientHoliday, 'id'>) => void;
  deleteHoliday: (id: string) => void;
  toggleClientTravelMode: (clientId: string, travelDetails?: { travelCity?: string; travelCountry?: string; travelTimezone?: string; travelStartDate?: string; travelEndDate?: string; travelReason?: string }) => void;
  updateClientGlobalOps: (clientId: string, updates: Partial<Client>) => void;

  // Quick Action Modal
  quickActionOpen: boolean;
  setQuickActionOpen: (open: boolean) => void;
  quickActionType: string | null;
  openQuickAction: (type: string) => void;

  // App Tour & Walkthrough Guide Modal
  isTourOpen: boolean;
  setIsTourOpen: (open: boolean) => void;
  tourActiveStep: number;
  setTourActiveStep: (step: number) => void;
  openTour: (stepIndex?: number) => void;

  // Backup and Reset
  exportBackupJSON: () => string;
  importBackupJSON: (jsonStr: string) => boolean;
  resetToDefaultSeed: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'aedmin_user_profile',
  CLIENTS: 'aedmin_clients_v2',
  TASKS: 'aedmin_tasks_v2',
  PROJECTS: 'aedmin_projects_v2',
  TIME_ENTRIES: 'aedmin_time_entries_v2',
  SERVICES: 'aedmin_services_v2',
  INVOICES: 'aedmin_invoices_v2',
  PAYMENTS: 'aedmin_payments_v2',
  APPROVALS: 'aedmin_approvals_v2',
  KNOWLEDGE: 'aedmin_knowledge_v2',
  OPPORTUNITIES: 'aedmin_opportunities_v2',
  CEO_GOALS: 'aedmin_ceo_goals_v2',
  RATE_CALC: 'aedmin_rate_calc_v2',
  ROUTINES: 'aedmin_daily_routines_v2',
  BRIEFINGS: 'aedmin_briefings_v2',
  RECOMMENDATIONS: 'aedmin_recommendations_v2',
  OBJECTIVES: 'aedmin_objectives_v2',
  CLIENT_KB: 'aedmin_client_kb_v2',
  HOLIDAYS: 'aedmin_holidays_v2',
  EXPENSES: 'aedmin_expenses_v2',
  TEMPLATES: 'aedmin_templates_v2',
  DRAFTS: 'aedmin_drafts_v2',
  AUDIT_LOGS: 'aedmin_audit_logs_v2',
  RETAINER_PERIODS: 'aedmin_retainer_periods_v2'
};

const initialRoutines = {
  opening: [
    { id: 'op_1', title: 'Command Center Executive Brief & Urgent Review', completed: true },
    { id: 'op_2', title: 'Executive Calendar Defense & Buffer Check', completed: true },
    { id: 'op_3', title: 'Inbox Zero Triage Sweep (4D Heuristic)', completed: false },
    { id: 'op_4', title: 'Dispatch Morning Client Priorities & Briefs', completed: false }
  ],
  midday: [
    { id: 'mid_1', title: 'Unblock Stuck Client Deliverables & Pending Approvals', completed: false },
    { id: 'mid_2', title: 'Check In on Client Communications & Emergency pings', completed: false },
    { id: 'mid_3', title: 'Recalibrate Afternoon Deep Work Task Priorities', completed: false }
  ],
  eod: [
    { id: 'eod_1', title: 'Log Retainer & Billable Hours into AEDMIN', completed: false },
    { id: 'eod_2', title: 'Audit Tomorrow’s Schedule & High-Priority Blocks', completed: false },
    { id: 'eod_3', title: 'Generate & Dispatch End-of-Day (EOD) Client Recaps', completed: false },
    { id: 'eod_4', title: 'Clock Out & Clear Active Workstation', completed: false }
  ]
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeTenantId } = useAuth();
  const currentTenant = activeTenantId || SUPER_ADMIN_TENANT_ID;

  // 1. User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const key = getTenantStorageKey(currentTenant, 'profile');
    const saved = localStorage.getItem(key) || localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  // 2. Clients
  const [clients, setClients] = useState<Client[]>(() => {
    const key = getTenantStorageKey(currentTenant, 'clients');
    const saved = localStorage.getItem(key) || localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!saved) return initialClients;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return initialClients;
      return parsed.map((c: any) => ({
        ...c,
        monthlyRetainerFee: Number(c.monthlyRetainerFee ?? c.monthlyRate ?? 5000),
        purchasedHours: Number(c.purchasedHours ?? 35),
        hourlyRate: Number(c.hourlyRate ?? 150),
        usedHoursThisMonth: Number(c.usedHoursThisMonth ?? 0),
        totalRevenueYTD: Number(c.totalRevenueYTD ?? 0),
        onboardingProgress: Number(c.onboardingProgress ?? 100),
        status: c.status || 'active',
        contractType: c.contractType || 'retainer',
        avatarColor: c.avatarColor || 'bg-card-blue',
        relationshipHealth: c.relationshipHealth || 'exceptional',
        intelligence: c.intelligence || {
          executiveProfile: {
            preferredName: c.primaryContact || c.name || '',
            timezone: 'America/New_York (EST)',
            communicationStyle: 'Direct and concise',
            meetingPreferences: 'Mornings preferred',
            decisionMakingStyle: 'Options-driven',
            reportingPreferences: 'Weekly digest'
          },
          businessProfile: {
            company: c.company || c.name || '',
            industry: 'Professional Services',
            website: 'https://example.com',
            coreServices: 'Operations & Strategy',
            currentGoals: 'Scale bandwidth',
            keyChallenges: 'Execution bottlenecks',
            keyTeamMembers: 'Executive Team',
            primaryVendors: 'Google Workspace, Slack',
            coreSystems: 'Slack, Notion, Google Drive'
          },
          relationshipProfile: {
            hobbies: '',
            interests: '',
            travelPreferences: '',
            favoriteRestaurants: '',
            giftIdeas: '',
            personalNotes: ''
          },
          lifestyleContext: {},
          memoryVault: []
        }
      }));
    } catch {
      return initialClients;
    }
  });

  // 3. Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    const key = getTenantStorageKey(currentTenant, 'tasks');
    const saved = localStorage.getItem(key) || localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : initialTasks;
  });

  // 4. Projects
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : initialProjects;
  });

  // 5. Time Entries
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
    if (!saved) return initialTimeEntries;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return initialTimeEntries;
      return parsed.map((t: any) => ({
        ...t,
        durationMinutes: Number(t.durationMinutes ?? 0),
        hourlyRate: Number(t.hourlyRate ?? 150),
        billableAmount: Number(t.billableAmount ?? 0),
        isBillable: t.isBillable ?? true
      }));
    } catch {
      return initialTimeEntries;
    }
  });

  // 6. Services
  const [services, setServices] = useState<ServicePackage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (!saved) return initialServices;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return initialServices;
      return parsed.map((s: any) => ({
        ...s,
        baseRate: Number(s.baseRate ?? s.basePrice ?? 5000),
        basePrice: Number(s.basePrice ?? s.baseRate ?? 5000),
        pricingModel: s.pricingModel || 'Monthly Retainer',
        category: s.category || 'Executive Assistance',
        name: s.name || 'Executive Service Package',
        description: s.description || '',
        scope: Array.isArray(s.scope) ? s.scope : [],
        deliverables: Array.isArray(s.deliverables) ? s.deliverables : [],
        workflowSteps: Array.isArray(s.workflowSteps) ? s.workflowSteps : [],
        isActive: s.isActive ?? true
      }));
    } catch {
      return initialServices;
    }
  });

  // 7. Invoices & Payments
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (!saved) return initialInvoices;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return initialInvoices;
      return parsed.map((inv: any) => ({
        ...inv,
        subtotal: Number(inv.subtotal ?? 0),
        taxRate: Number(inv.taxRate ?? 0),
        taxAmount: Number(inv.taxAmount ?? 0),
        total: Number(inv.total ?? inv.subtotal ?? 0),
        items: Array.isArray(inv.items) ? inv.items.map((it: any) => ({
          ...it,
          quantity: Number(it.quantity ?? 1),
          unitPrice: Number(it.unitPrice ?? 0),
          amount: Number(it.amount ?? ((it.quantity ?? 1) * (it.unitPrice ?? 0)))
        })) : []
      }));
    } catch {
      return initialInvoices;
    }
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!saved) return initialPayments;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return initialPayments;
      return parsed.map((p: any) => ({
        ...p,
        amount: Number(p.amount ?? 0),
        referenceNumber: p.referenceNumber || 'PAY-000',
        invoiceNumber: p.invoiceNumber || 'INV-000',
        clientName: p.clientName || 'Client'
      }));
    } catch {
      return initialPayments;
    }
  });

  const [expenses, setExpenses] = useState<FreelancerExpense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!saved) return initialExpenses;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return initialExpenses;
      return parsed.map((e: any) => ({
        ...e,
        amount: Number(e.amount ?? 0)
      }));
    } catch {
      return initialExpenses;
    }
  });

  // 8. Approvals
  const [approvals, setApprovals] = useState<ApprovalItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPROVALS);
    return saved ? JSON.parse(saved) : initialApprovals;
  });

  // 9. Knowledge
  const [knowledgeArticles, setKnowledgeArticles] = useState<KnowledgeArticle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE);
    return saved ? JSON.parse(saved) : initialKnowledgeArticles;
  });

  // 10. Opportunities
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
    if (!saved) return initialOpportunities;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return initialOpportunities;
      return parsed.map((o: any) => ({
        ...o,
        estimatedValue: Number(o.estimatedValue ?? 0),
        confidencePercentage: Number(o.confidencePercentage ?? 50),
        stage: o.stage || 'lead',
        prospectName: o.prospectName || 'Prospective Client',
        company: o.company || 'Enterprise'
      }));
    } catch {
      return initialOpportunities;
    }
  });

  // 11. CEO Goals
  const [ceoGoals, setCeoGoals] = useState<CEOGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CEO_GOALS);
    return saved ? JSON.parse(saved) : initialCEOGoals;
  });

  // 12. Rate Calculator
  const [rateCalculator, setRateCalculator] = useState<RateCalculatorInputs>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RATE_CALC);
    return saved ? JSON.parse(saved) : initialRateCalculator;
  });

  // 13. Daily Routines
  const [dailyRoutines, setDailyRoutines] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    return saved ? JSON.parse(saved) : initialRoutines;
  });

  // 14. Executive Briefings & Client Updates
  const [briefings, setBriefings] = useState<ExecutiveBriefing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BRIEFINGS);
    return saved ? JSON.parse(saved) : initialBriefings;
  });

  // 15. Strategic Recommendations Hub
  const [recommendations, setRecommendations] = useState<StrategicRecommendation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
    return saved ? JSON.parse(saved) : initialRecommendations;
  });

  // 16. Client Strategic Objectives
  const [strategicObjectives, setStrategicObjectives] = useState<ClientStrategicObjective[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OBJECTIVES);
    return saved ? JSON.parse(saved) : initialStrategicObjectives;
  });

  // 17. Client Knowledge Base Documents
  const [clientKnowledgeDocs, setClientKnowledgeDocs] = useState<ClientKnowledgeDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENT_KB);
    return saved ? JSON.parse(saved) : initialClientKnowledgeDocs;
  });

  // 18. Centralized Templates
  const [templates, setTemplates] = useState<ManagedTemplate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    return saved ? JSON.parse(saved) : initialManagedTemplates;
  });

  // 19. Generated Draft Records
  const [generatedDrafts, setGeneratedDrafts] = useState<GeneratedDraftRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    return saved ? JSON.parse(saved) : initialGeneratedDrafts;
  });

  // 20. Traceable Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // 21. Retainer Periods & History
  const [retainerPeriods, setRetainerPeriods] = useState<RetainerPeriodLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RETAINER_PERIODS);
    return saved ? JSON.parse(saved) : initialRetainerPeriods;
  });

  // Global Holidays State
  const [holidays, setHolidays] = useState<ClientHoliday[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HOLIDAYS);
    return saved ? JSON.parse(saved) : initialHolidays;
  });

  // Active Live Timer State
  const [activeTimer, setActiveTimer] = useState<ActiveTimer>({
    isRunning: false,
    isPaused: false,
    seconds: 0,
    clientId: initialClients[0]?.id || '',
    notes: '',
    isBillable: true
  });

  // Client Portal preview mode
  const [portalClientId, setPortalClientId] = useState<string | null>(null);

  // Quick Action Modal
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<string | null>(null);

  // App Tour & Walkthrough Guide Modal
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourActiveStep, setTourActiveStep] = useState(0);

  const openTour = (stepIndex?: number) => {
    if (typeof stepIndex === 'number') {
      setTourActiveStep(stepIndex);
    }
    setIsTourOpen(true);
  };

  // Tenant State Reload Synchronization Hook
  useEffect(() => {
    if (!currentTenant) return;
    
    // Load Client Dossiers for this tenant
    const clientsKey = getTenantStorageKey(currentTenant, 'clients');
    const savedClients = localStorage.getItem(clientsKey);
    if (savedClients) {
      try {
        const parsed = JSON.parse(savedClients);
        if (Array.isArray(parsed)) setClients(parsed);
      } catch {}
    } else {
      setClients(currentTenant === SUPER_ADMIN_TENANT_ID ? initialClients : []);
    }

    // Load Tasks for this tenant
    const tasksKey = getTenantStorageKey(currentTenant, 'tasks');
    const savedTasks = localStorage.getItem(tasksKey);
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) setTasks(parsed);
      } catch {}
    } else {
      setTasks(currentTenant === SUPER_ADMIN_TENANT_ID ? initialTasks : []);
    }

    // Load Profile for this tenant
    const profileKey = getTenantStorageKey(currentTenant, 'profile');
    const savedProfile = localStorage.getItem(profileKey);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setUserProfile(parsed);
      } catch {}
    }

    // Load Projects
    const projectsKey = getTenantStorageKey(currentTenant, 'projects');
    const savedProjects = localStorage.getItem(projectsKey);
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch {}
    }

    // Load Invoices
    const invoicesKey = getTenantStorageKey(currentTenant, 'invoices');
    const savedInvoices = localStorage.getItem(invoicesKey);
    if (savedInvoices) {
      try {
        setInvoices(JSON.parse(savedInvoices));
      } catch {}
    }

    // Load Time Entries
    const timeKey = getTenantStorageKey(currentTenant, 'time_entries');
    const savedTime = localStorage.getItem(timeKey);
    if (savedTime) {
      try {
        setTimeEntries(JSON.parse(savedTime));
      } catch {}
    }
  }, [currentTenant]);

  // Tenant-Scoped Persistence Effects
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'profile'), JSON.stringify(userProfile)); }, [userProfile, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'clients'), JSON.stringify(clients)); }, [clients, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'tasks'), JSON.stringify(tasks)); }, [tasks, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'projects'), JSON.stringify(projects)); }, [projects, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'time_entries'), JSON.stringify(timeEntries)); }, [timeEntries, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'services'), JSON.stringify(services)); }, [services, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'invoices'), JSON.stringify(invoices)); }, [invoices, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'payments'), JSON.stringify(payments)); }, [payments, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'expenses'), JSON.stringify(expenses)); }, [expenses, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'approvals'), JSON.stringify(approvals)); }, [approvals, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'knowledge'), JSON.stringify(knowledgeArticles)); }, [knowledgeArticles, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'opportunities'), JSON.stringify(opportunities)); }, [opportunities, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'ceo_goals'), JSON.stringify(ceoGoals)); }, [ceoGoals, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'rate_calc'), JSON.stringify(rateCalculator)); }, [rateCalculator, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'daily_routines'), JSON.stringify(dailyRoutines)); }, [dailyRoutines, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'briefings'), JSON.stringify(briefings)); }, [briefings, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'recommendations'), JSON.stringify(recommendations)); }, [recommendations, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'objectives'), JSON.stringify(strategicObjectives)); }, [strategicObjectives, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'client_kb'), JSON.stringify(clientKnowledgeDocs)); }, [clientKnowledgeDocs, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'holidays'), JSON.stringify(holidays)); }, [holidays, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'templates'), JSON.stringify(templates)); }, [templates, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'drafts'), JSON.stringify(generatedDrafts)); }, [generatedDrafts, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'audit_logs'), JSON.stringify(auditLogs)); }, [auditLogs, currentTenant]);
  useEffect(() => { localStorage.setItem(getTenantStorageKey(currentTenant, 'retainer_periods'), JSON.stringify(retainerPeriods)); }, [retainerPeriods, currentTenant]);

  // Live Timer Tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeTimer.isRunning && !activeTimer.isPaused) {
      interval = setInterval(() => {
        setActiveTimer(prev => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer.isRunning, activeTimer.isPaused]);

  // Timer Control Functions
  const startTimer = (details?: { clientId?: string; projectId?: string; taskId?: string; notes?: string; isBillable?: boolean }) => {
    const defaultClient = clients[0]?.id || '';
    setActiveTimer({
      isRunning: true,
      isPaused: false,
      seconds: 0,
      startTime: new Date().toISOString(),
      clientId: details?.clientId || defaultClient,
      projectId: details?.projectId,
      taskId: details?.taskId,
      notes: details?.notes || '',
      isBillable: details?.isBillable ?? true
    });
  };

  const pauseTimer = () => {
    setActiveTimer(prev => ({ ...prev, isPaused: true }));
  };

  const resumeTimer = () => {
    setActiveTimer(prev => ({ ...prev, isPaused: false }));
  };

  const stopTimer = (save: boolean = true) => {
    if (save && activeTimer.seconds > 10) {
      const client = clients.find(c => c.id === activeTimer.clientId);
      const project = projects.find(p => p.id === activeTimer.projectId);
      const task = tasks.find(t => t.id === activeTimer.taskId);
      const durationMin = Math.round(activeTimer.seconds / 60);
      const rate = client?.hourlyRate || 150;
      const val = activeTimer.isBillable ? (durationMin / 60) * rate : 0;

      const newEntry: TimeEntry = {
        id: `tm_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        durationMinutes: durationMin,
        isBillable: activeTimer.isBillable,
        clientId: activeTimer.clientId,
        clientName: client?.name || 'General Client',
        projectId: activeTimer.projectId,
        projectName: project?.name,
        taskId: activeTimer.taskId,
        taskTitle: task?.title,
        hourlyRate: rate,
        value: Math.round(val),
        notes: activeTimer.notes || 'Session tracked with AEDMIN timer',
        tags: ['Active Session', activeTimer.isBillable ? 'Billable' : 'Non-Billable'],
        createdAt: new Date().toISOString()
      };

      setTimeEntries(prev => [newEntry, ...prev]);

      // Update client used hours if retainer
      if (client && activeTimer.isBillable) {
        updateClient(client.id, {
          usedHoursThisMonth: Number((client.usedHoursThisMonth + (durationMin / 60)).toFixed(1))
        });
      }
    }

    setActiveTimer({
      isRunning: false,
      isPaused: false,
      seconds: 0,
      clientId: clients[0]?.id || '',
      notes: '',
      isBillable: true
    });
  };

  const updateActiveTimerNotes = (notes: string) => {
    setActiveTimer(prev => ({ ...prev, notes }));
  };

  // Helper priority calculator
  const calculateTaskScore = (t: Partial<Task>): number => {
    const imp = t.importanceScore || 3;
    const urg = t.urgencyScore || 3;
    const rev = t.revenueImpactScore || 3;
    const cli = t.clientPriorityScore || 3;
    // Score out of 100
    return Math.min(100, Math.round((imp * 6) + (urg * 6) + (rev * 4) + (cli * 4)));
  };

  // --- Task CRUD Operations ---
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `tsk_${Date.now()}`,
      calculatedScore: calculateTaskScore(taskData),
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const merged = { ...t, ...updates };
        if (updates.importanceScore || updates.urgencyScore || updates.revenueImpactScore || updates.clientPriorityScore) {
          merged.calculatedScore = calculateTaskScore(merged);
        }
        return merged;
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const archiveTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isArchived: true } : t));
  };

  const restoreTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isArchived: false } : t));
  };

  const duplicateTask = (id: string) => {
    const original = tasks.find(t => t.id === id);
    if (!original) return;
    const dup: Task = {
      ...original,
      id: `tsk_${Date.now()}`,
      title: `${original.title} (Copy)`,
      status: 'todo',
      completedAt: undefined,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [dup, ...prev]);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isDone = t.status === 'completed';
        return {
          ...t,
          status: isDone ? 'todo' : 'completed',
          completedAt: isDone ? undefined : new Date().toISOString()
        };
      }
      return t;
    }));
  };

  // --- Client CRUD Operations ---
  const addClient = (clientData: Omit<Client, 'id' | 'joinedDate' | 'totalRevenueYTD' | 'usedHoursThisMonth'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: `cli_${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      totalRevenueYTD: 0,
      usedHoursThisMonth: 0
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const archiveClient = (id: string) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, status: 'archived', isArchived: true } : c));
  };

  const restoreClient = (id: string) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, status: 'active', isArchived: false } : c));
  };

  const duplicateClient = (id: string) => {
    const orig = clients.find(c => c.id === id);
    if (!orig) return;
    const dup: Client = {
      ...orig,
      id: `cli_${Date.now()}`,
      code: `${orig.code}2`,
      name: `${orig.name} (Clone)`,
      joinedDate: new Date().toISOString().split('T')[0],
      usedHoursThisMonth: 0
    };
    setClients(prev => [...prev, dup]);
  };

  // --- Project CRUD Operations ---
  const addProject = (projectData: Omit<Project, 'id'>): Project => {
    const newProj: Project = { ...projectData, id: `prj_${Date.now()}` };
    setProjects(prev => [newProj, ...prev]);
    return newProj;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const duplicateProject = (id: string) => {
    const orig = projects.find(p => p.id === id);
    if (!orig) return;
    const dup: Project = {
      ...orig,
      id: `prj_${Date.now()}`,
      name: `${orig.name} (Copy)`,
      progress: 0,
      milestones: orig.milestones.map(m => ({ ...m, completed: false }))
    };
    setProjects(prev => [dup, ...prev]);
  };

  const archiveProject = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'archived', isArchived: true } : p));
  };

  const restoreProject = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'in_progress', isArchived: false } : p));
  };

  // --- Centralized Template CRUD Operations ---
  const addTemplate = (templateData: Omit<ManagedTemplate, 'id' | 'createdAt' | 'updatedAt'>): ManagedTemplate => {
    const newTpl: ManagedTemplate = {
      ...templateData,
      id: `tpl_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setTemplates(prev => [newTpl, ...prev]);
    return newTpl;
  };

  const updateTemplate = (id: string, updates: Partial<ManagedTemplate>) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : t));
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const duplicateTemplate = (id: string) => {
    const orig = templates.find(t => t.id === id);
    if (!orig) return;
    const dup: ManagedTemplate = {
      ...orig,
      id: `tpl_${Date.now()}`,
      title: `${orig.title} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setTemplates(prev => [dup, ...prev]);
  };

  const archiveTemplate = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, isArchived: true } : t));
  };

  const restoreTemplate = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, isArchived: false } : t));
  };

  const toggleFavoriteTemplate = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t));
  };

  // --- Generated Draft Records CRUD Operations ---
  const saveGeneratedDraft = (draftData: Omit<GeneratedDraftRecord, 'id' | 'createdAt'>): GeneratedDraftRecord => {
    const newDraft: GeneratedDraftRecord = {
      ...draftData,
      id: `drf_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGeneratedDrafts(prev => [newDraft, ...prev]);
    return newDraft;
  };

  const deleteGeneratedDraft = (id: string) => {
    setGeneratedDrafts(prev => prev.filter(d => d.id !== id));
  };

  const updateGeneratedDraft = (id: string, updates: Partial<GeneratedDraftRecord>) => {
    setGeneratedDrafts(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  // --- Centralized Audit Log & Traceability ---
  const addAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'actor'> & { actor?: string; timestamp?: string }): AuditLogEntry => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actor: entry.actor || userProfile.fullName || 'Olivia Vance',
      timestamp: entry.timestamp || new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
  };

  const exportAuditLogsJSON = (): string => {
    return JSON.stringify(auditLogs, null, 2);
  };

  const exportAuditLogsCSV = (): string => {
    const headers = ['Timestamp', 'Entity Type', 'Entity ID', 'Entity Title', 'Client', 'Action', 'Actor', 'Reason', 'Changes'];
    const rows = auditLogs.map(log => [
      `"${log.timestamp}"`,
      `"${log.entityType}"`,
      `"${log.entityId}"`,
      `"${(log.entityTitle || '').replace(/"/g, '""')}"`,
      `"${(log.clientName || '').replace(/"/g, '""')}"`,
      `"${log.action}"`,
      `"${(log.actor || '').replace(/"/g, '""')}"`,
      `"${(log.reason || '').replace(/"/g, '""')}"`,
      `"${(log.changes || []).map(c => `${c.label}: ${c.oldValue} -> ${c.newValue}`).join('; ').replace(/"/g, '""')}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  // --- Retainer Period & Hours Management ---
  const addRetainerPeriod = (periodData: Omit<RetainerPeriodLog, 'id' | 'lastModified'>, reason?: string): RetainerPeriodLog => {
    const effectiveAvailable = (periodData.purchasedHours || 0) + (periodData.rolloverHours || 0) + (periodData.manualAdjustmentHours || 0);
    const remaining = effectiveAvailable - (periodData.usedHours || 0);
    const newPeriod: RetainerPeriodLog = {
      ...periodData,
      id: `ret_${periodData.clientId}_${Date.now().toString().slice(-4)}`,
      effectiveAvailableHours: Number(effectiveAvailable.toFixed(1)),
      remainingHours: Number(remaining.toFixed(1)),
      lastModified: new Date().toISOString(),
      modifiedBy: userProfile.fullName,
      adjustmentReason: reason
    };
    setRetainerPeriods(prev => [newPeriod, ...prev]);

    // Audit log
    addAuditLog({
      entityType: 'retainer_period',
      entityId: newPeriod.id,
      entityTitle: `Retainer Period: ${newPeriod.clientName} (${newPeriod.periodMonth})`,
      clientId: newPeriod.clientId,
      clientName: newPeriod.clientName,
      action: 'created',
      reason: reason || 'Created new client retainer cycle',
      changes: [
        { field: 'purchasedHours', label: 'Purchased Hours', oldValue: null, newValue: newPeriod.purchasedHours },
        { field: 'rolloverHours', label: 'Rollover Hours', oldValue: null, newValue: newPeriod.rolloverHours },
        { field: 'effectiveAvailableHours', label: 'Available Hours', oldValue: null, newValue: newPeriod.effectiveAvailableHours }
      ]
    });

    return newPeriod;
  };

  const updateRetainerPeriod = (id: string, updates: Partial<RetainerPeriodLog>, reason?: string) => {
    const old = retainerPeriods.find(r => r.id === id);
    if (!old) return;

    const purchased = updates.purchasedHours !== undefined ? updates.purchasedHours : old.purchasedHours;
    const rollover = updates.rolloverHours !== undefined ? updates.rolloverHours : old.rolloverHours;
    const adjustment = updates.manualAdjustmentHours !== undefined ? updates.manualAdjustmentHours : old.manualAdjustmentHours;
    const used = updates.usedHours !== undefined ? updates.usedHours : old.usedHours;
    const effectiveAvailable = Number(((purchased || 0) + (rollover || 0) + (adjustment || 0)).toFixed(1));
    const remaining = Number((effectiveAvailable - (used || 0)).toFixed(1));

    const changes: AuditChange[] = [];
    if (updates.purchasedHours !== undefined && updates.purchasedHours !== old.purchasedHours) {
      changes.push({ field: 'purchasedHours', label: 'Purchased Hours', oldValue: old.purchasedHours, newValue: updates.purchasedHours });
    }
    if (updates.rolloverHours !== undefined && updates.rolloverHours !== old.rolloverHours) {
      changes.push({ field: 'rolloverHours', label: 'Rollover Hours', oldValue: old.rolloverHours, newValue: updates.rolloverHours });
    }
    if (updates.manualAdjustmentHours !== undefined && updates.manualAdjustmentHours !== old.manualAdjustmentHours) {
      changes.push({ field: 'manualAdjustmentHours', label: 'Manual Adjustment', oldValue: old.manualAdjustmentHours, newValue: updates.manualAdjustmentHours });
    }
    if (updates.usedHours !== undefined && updates.usedHours !== old.usedHours) {
      changes.push({ field: 'usedHours', label: 'Logged Used Hours', oldValue: old.usedHours, newValue: updates.usedHours });
    }
    if (updates.status !== undefined && updates.status !== old.status) {
      changes.push({ field: 'status', label: 'Period Status', oldValue: old.status, newValue: updates.status });
    }

    setRetainerPeriods(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          ...updates,
          effectiveAvailableHours: effectiveAvailable,
          remainingHours: remaining,
          lastModified: new Date().toISOString(),
          modifiedBy: userProfile.fullName,
          adjustmentReason: reason || updates.adjustmentReason || r.adjustmentReason
        };
      }
      return r;
    }));

    if (changes.length > 0) {
      addAuditLog({
        entityType: 'retainer_period',
        entityId: old.id,
        entityTitle: `Retainer Period: ${old.clientName} (${old.periodMonth})`,
        clientId: old.clientId,
        clientName: old.clientName,
        action: 'adjusted_hours',
        reason: reason || updates.adjustmentReason || 'Retainer log updated with operational adjustments',
        changes
      });
    }
  };

  const deleteRetainerPeriod = (id: string, reason?: string) => {
    const old = retainerPeriods.find(r => r.id === id);
    if (!old) return;
    setRetainerPeriods(prev => prev.filter(r => r.id !== id));
    addAuditLog({
      entityType: 'retainer_period',
      entityId: old.id,
      entityTitle: `Retainer Period: ${old.clientName} (${old.periodMonth})`,
      clientId: old.clientId,
      clientName: old.clientName,
      action: 'deleted',
      reason: reason || 'Retainer period archived / removed',
      changes: [{ field: 'status', label: 'Status', oldValue: old.status, newValue: 'deleted' }]
    });
  };

  const adjustClientAvailableHours = (
    clientId: string, 
    newPurchasedHours: number, 
    newRolloverHours: number = 0, 
    manualAdjustment: number = 0,
    reason: string = 'Operational retainer hours adjustment'
  ) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const oldPurchased = client.purchasedHours || 0;
    const oldUsed = client.usedHoursThisMonth || 0;

    updateClient(clientId, {
      purchasedHours: newPurchasedHours
    });

    // Also update or sync the active monthly retainer period
    const currentMonthStr = new Date().toISOString().slice(0, 7); // e.g. "2026-08"
    const activePeriod = retainerPeriods.find(r => r.clientId === clientId && r.periodMonth === currentMonthStr);
    if (activePeriod) {
      updateRetainerPeriod(activePeriod.id, {
        purchasedHours: newPurchasedHours,
        rolloverHours: newRolloverHours,
        manualAdjustmentHours: manualAdjustment
      }, reason);
    } else {
      addRetainerPeriod({
        clientId: client.id,
        clientName: client.name,
        periodMonth: currentMonthStr,
        purchasedHours: newPurchasedHours,
        rolloverHours: newRolloverHours,
        manualAdjustmentHours: manualAdjustment,
        usedHours: oldUsed,
        effectiveAvailableHours: newPurchasedHours + newRolloverHours + manualAdjustment,
        remainingHours: (newPurchasedHours + newRolloverHours + manualAdjustment) - oldUsed,
        status: 'active',
        hourlyRate: client.hourlyRate || 150,
        monthlyFee: (client.hourlyRate || 150) * newPurchasedHours,
        notes: `Retainer period initialized from client adjustment.`
      }, reason);
    }

    addAuditLog({
      entityType: 'client_hours',
      entityId: client.id,
      entityTitle: `Client Hours: ${client.name}`,
      clientId: client.id,
      clientName: client.name,
      action: 'adjusted_hours',
      reason,
      changes: [
        { field: 'purchasedHours', label: 'Allocated Retainer Hours', oldValue: oldPurchased, newValue: newPurchasedHours },
        { field: 'rolloverHours', label: 'Rollover Hours', oldValue: 0, newValue: newRolloverHours },
        { field: 'manualAdjustment', label: 'Manual Adjustment', oldValue: 0, newValue: manualAdjustment }
      ]
    });
  };

  // --- Time Entries CRUD Operations with Automated Audit Trails ---
  const addTimeEntry = (entry: Omit<TimeEntry, 'id' | 'createdAt'>, reason?: string): TimeEntry => {
    const newEntry: TimeEntry = {
      ...entry,
      id: `tm_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      modifiedBy: userProfile.fullName,
      editReason: reason
    };
    setTimeEntries(prev => [newEntry, ...prev]);

    // Recalculate client used hours
    if (entry.isBillable && entry.clientId) {
      const client = clients.find(c => c.id === entry.clientId);
      if (client) {
        const addedHours = Number((entry.durationMinutes / 60).toFixed(2));
        const newUsed = Number((client.usedHoursThisMonth + addedHours).toFixed(1));
        updateClient(client.id, { usedHoursThisMonth: newUsed });

        // Also update active retainer period if exists
        const currentMonthStr = (entry.date || new Date().toISOString()).slice(0, 7);
        const period = retainerPeriods.find(r => r.clientId === entry.clientId && r.periodMonth === currentMonthStr);
        if (period) {
          const updatedUsed = Number(((period.usedHours || 0) + addedHours).toFixed(1));
          updateRetainerPeriod(period.id, { usedHours: updatedUsed });
        }
      }
    }

    // Auto-generate audit log
    addAuditLog({
      entityType: 'time_entry',
      entityId: newEntry.id,
      entityTitle: `Time Entry: ${newEntry.taskTitle || newEntry.clientName} (${newEntry.durationMinutes}m)`,
      clientId: newEntry.clientId,
      clientName: newEntry.clientName,
      action: 'created',
      reason: reason || 'Logged new work session',
      changes: [
        { field: 'durationMinutes', label: 'Duration (Minutes)', oldValue: null, newValue: newEntry.durationMinutes },
        { field: 'date', label: 'Date', oldValue: null, newValue: newEntry.date },
        { field: 'isBillable', label: 'Billable', oldValue: null, newValue: newEntry.isBillable },
        { field: 'value', label: 'Calculated Value', oldValue: null, newValue: newEntry.value }
      ]
    });

    return newEntry;
  };

  const updateTimeEntry = (id: string, updates: Partial<TimeEntry>, reason?: string) => {
    const old = timeEntries.find(e => e.id === id);
    if (!old) return;

    const changes: AuditChange[] = [];
    if (updates.durationMinutes !== undefined && updates.durationMinutes !== old.durationMinutes) {
      changes.push({ field: 'durationMinutes', label: 'Duration (Minutes)', oldValue: old.durationMinutes, newValue: updates.durationMinutes });
    }
    if (updates.date !== undefined && updates.date !== old.date) {
      changes.push({ field: 'date', label: 'Log Date', oldValue: old.date, newValue: updates.date });
    }
    if (updates.startTime !== undefined && updates.startTime !== old.startTime) {
      changes.push({ field: 'startTime', label: 'Start Time', oldValue: old.startTime, newValue: updates.startTime });
    }
    if (updates.endTime !== undefined && updates.endTime !== old.endTime) {
      changes.push({ field: 'endTime', label: 'End Time', oldValue: old.endTime, newValue: updates.endTime });
    }
    if (updates.isBillable !== undefined && updates.isBillable !== old.isBillable) {
      changes.push({ field: 'isBillable', label: 'Billable Status', oldValue: old.isBillable ? 'Billable' : 'Non-Billable', newValue: updates.isBillable ? 'Billable' : 'Non-Billable' });
    }
    if (updates.hourlyRate !== undefined && updates.hourlyRate !== old.hourlyRate) {
      changes.push({ field: 'hourlyRate', label: 'Hourly Rate', oldValue: old.hourlyRate, newValue: updates.hourlyRate });
    }
    if (updates.value !== undefined && updates.value !== old.value) {
      changes.push({ field: 'value', label: 'Calculated Value', oldValue: old.value, newValue: updates.value });
    }
    if (updates.notes !== undefined && updates.notes !== old.notes) {
      changes.push({ field: 'notes', label: 'Work Description', oldValue: old.notes, newValue: updates.notes });
    }
    if (updates.clientId !== undefined && updates.clientId !== old.clientId) {
      changes.push({ field: 'clientId', label: 'Assigned Client', oldValue: old.clientName, newValue: updates.clientName || updates.clientId });
    }

    const durationDiffMinutes = (updates.durationMinutes !== undefined ? updates.durationMinutes : old.durationMinutes) - old.durationMinutes;

    setTimeEntries(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          ...updates,
          lastModified: new Date().toISOString(),
          modifiedBy: userProfile.fullName,
          editReason: reason || updates.editReason || e.editReason
        };
      }
      return e;
    }));

    // Adjust client consumed hours if duration or billable changed
    if (old.clientId && (durationDiffMinutes !== 0 || updates.isBillable !== undefined)) {
      const client = clients.find(c => c.id === old.clientId);
      if (client) {
        const diffHours = durationDiffMinutes / 60;
        const newUsed = Math.max(0, Number((client.usedHoursThisMonth + diffHours).toFixed(1)));
        updateClient(client.id, { usedHoursThisMonth: newUsed });

        // Update active retainer period
        const periodMonth = (updates.date || old.date).slice(0, 7);
        const period = retainerPeriods.find(r => r.clientId === old.clientId && r.periodMonth === periodMonth);
        if (period) {
          const updatedUsed = Math.max(0, Number(((period.usedHours || 0) + diffHours).toFixed(1)));
          updateRetainerPeriod(period.id, { usedHours: updatedUsed });
        }
      }
    }

    // Record audit entry
    if (changes.length > 0) {
      addAuditLog({
        entityType: old.date < new Date().toISOString().slice(0, 7) ? 'historical_record' : 'time_entry',
        entityId: old.id,
        entityTitle: `Time Entry: ${updates.taskTitle || old.taskTitle || old.clientName}`,
        clientId: old.clientId,
        clientName: old.clientName,
        action: 'updated',
        reason: reason || updates.editReason || 'Operational modification to time record',
        changes
      });
    }
  };

  const deleteTimeEntry = (id: string, reason?: string) => {
    const old = timeEntries.find(e => e.id === id);
    if (!old) return;

    setTimeEntries(prev => prev.filter(e => e.id !== id));

    // Deduct client used hours if billable
    if (old.isBillable && old.clientId) {
      const client = clients.find(c => c.id === old.clientId);
      if (client) {
        const dedHours = old.durationMinutes / 60;
        const newUsed = Math.max(0, Number((client.usedHoursThisMonth - dedHours).toFixed(1)));
        updateClient(client.id, { usedHoursThisMonth: newUsed });

        const periodMonth = old.date.slice(0, 7);
        const period = retainerPeriods.find(r => r.clientId === old.clientId && r.periodMonth === periodMonth);
        if (period) {
          const updatedUsed = Math.max(0, Number(((period.usedHours || 0) - dedHours).toFixed(1)));
          updateRetainerPeriod(period.id, { usedHours: updatedUsed });
        }
      }
    }

    addAuditLog({
      entityType: 'time_entry',
      entityId: old.id,
      entityTitle: `Deleted Time Entry: ${old.taskTitle || old.clientName} (${old.durationMinutes}m)`,
      clientId: old.clientId,
      clientName: old.clientName,
      action: 'deleted',
      reason: reason || 'Deleted time record',
      changes: [{ field: 'status', label: 'Entry Status', oldValue: 'active', newValue: 'deleted' }]
    });
  };

  const duplicateTimeEntry = (id: string) => {
    const orig = timeEntries.find(e => e.id === id);
    if (!orig) return;
    const dup: TimeEntry = {
      ...orig,
      id: `tm_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    setTimeEntries(prev => [dup, ...prev]);
    addAuditLog({
      entityType: 'time_entry',
      entityId: dup.id,
      entityTitle: `Duplicated Time Entry: ${dup.taskTitle || dup.clientName}`,
      clientId: dup.clientId,
      clientName: dup.clientName,
      action: 'created',
      reason: `Duplicated from entry ${orig.id}`,
      changes: [{ field: 'id', label: 'Cloned Entry', oldValue: orig.id, newValue: dup.id }]
    });
  };

  // --- Services CRUD Operations ---
  const addService = (serviceData: Omit<ServicePackage, 'id'>) => {
    const newService: ServicePackage = { ...serviceData, id: `srv_${Date.now()}` };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, updates: Partial<ServicePackage>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const duplicateService = (id: string) => {
    const orig = services.find(s => s.id === id);
    if (!orig) return;
    const dup: ServicePackage = {
      ...orig,
      id: `srv_${Date.now()}`,
      name: `${orig.name} (Custom Package)`
    };
    setServices(prev => [...prev, dup]);
  };

  // --- Fully Editable Invoices & Workflow with Audit Tracking ---
  const addInvoice = (invoiceData: Omit<Invoice, 'id'>, reason?: string): Invoice => {
    const newInvoice: Invoice = { ...invoiceData, id: `inv_${Date.now()}` };
    setInvoices(prev => [newInvoice, ...prev]);

    addAuditLog({
      entityType: 'invoice',
      entityId: newInvoice.id,
      entityTitle: `Invoice ${newInvoice.invoiceNumber} (${newInvoice.clientName})`,
      clientId: newInvoice.clientId,
      clientName: newInvoice.clientName,
      action: 'created',
      reason: reason || 'Created new invoice draft',
      changes: [
        { field: 'invoiceNumber', label: 'Invoice Number', oldValue: null, newValue: newInvoice.invoiceNumber },
        { field: 'total', label: 'Total Amount', oldValue: null, newValue: `$${newInvoice.total}` },
        { field: 'status', label: 'Initial Status', oldValue: null, newValue: newInvoice.status }
      ]
    });

    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>, reason?: string) => {
    const old = invoices.find(inv => inv.id === id);
    if (!old) return;

    const changes: AuditChange[] = [];
    if (updates.status !== undefined && updates.status !== old.status) {
      changes.push({ field: 'status', label: 'Invoice Status', oldValue: old.status, newValue: updates.status });
    }
    if (updates.total !== undefined && updates.total !== old.total) {
      changes.push({ field: 'total', label: 'Invoice Total', oldValue: `$${old.total}`, newValue: `$${updates.total}` });
    }
    if (updates.dueDate !== undefined && updates.dueDate !== old.dueDate) {
      changes.push({ field: 'dueDate', label: 'Due Date', oldValue: old.dueDate, newValue: updates.dueDate });
    }
    if (updates.issueDate !== undefined && updates.issueDate !== old.issueDate) {
      changes.push({ field: 'issueDate', label: 'Issue Date', oldValue: old.issueDate, newValue: updates.issueDate });
    }
    if (updates.notes !== undefined && updates.notes !== old.notes) {
      changes.push({ field: 'notes', label: 'Notes', oldValue: old.notes, newValue: updates.notes });
    }
    if (updates.paymentReferenceNumber !== undefined && updates.paymentReferenceNumber !== old.paymentReferenceNumber) {
      changes.push({ field: 'paymentReferenceNumber', label: 'Payment Reference #', oldValue: old.paymentReferenceNumber || 'None', newValue: updates.paymentReferenceNumber });
    }
    if (updates.paymentMethod !== undefined && updates.paymentMethod !== old.paymentMethod) {
      changes.push({ field: 'paymentMethod', label: 'Payment Method', oldValue: old.paymentMethod || 'None', newValue: updates.paymentMethod });
    }
    if (updates.items !== undefined && JSON.stringify(updates.items) !== JSON.stringify(old.items)) {
      changes.push({ field: 'items', label: 'Line Items', oldValue: `${old.items?.length || 0} items`, newValue: `${updates.items?.length || 0} items` });
    }

    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...updates } : inv));

    if (changes.length > 0) {
      addAuditLog({
        entityType: 'invoice',
        entityId: old.id,
        entityTitle: `Invoice ${updates.invoiceNumber || old.invoiceNumber} (${old.clientName})`,
        clientId: old.clientId,
        clientName: old.clientName,
        action: updates.status && updates.status !== old.status ? 'status_changed' : 'updated',
        reason: reason || 'Updated invoice details',
        changes
      });
    }
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status'], reason?: string) => {
    updateInvoice(id, { status }, reason || `Changed invoice workflow status to ${status.replace('_', ' ').toUpperCase()}`);
  };

  const deleteInvoice = (id: string, reason?: string) => {
    const old = invoices.find(inv => inv.id === id);
    if (!old) return;

    setInvoices(prev => prev.filter(inv => inv.id !== id));
    addAuditLog({
      entityType: 'invoice',
      entityId: old.id,
      entityTitle: `Invoice ${old.invoiceNumber} (${old.clientName})`,
      clientId: old.clientId,
      clientName: old.clientName,
      action: 'deleted',
      reason: reason || 'Deleted invoice from system',
      changes: [{ field: 'status', label: 'Status', oldValue: old.status, newValue: 'deleted' }]
    });
  };

  const duplicateInvoice = (id: string) => {
    const orig = invoices.find(inv => inv.id === id);
    if (!orig) return;
    const num = Math.floor(100 + Math.random() * 900);
    const dup: Invoice = {
      ...orig,
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-2026-${num}`,
      status: 'draft',
      issueDate: new Date().toISOString().split('T')[0],
      paidDate: undefined,
      paymentReferenceNumber: undefined,
      paymentMethod: undefined,
      paymentProofUrl: undefined,
      paymentNotes: undefined
    };
    setInvoices(prev => [dup, ...prev]);
    addAuditLog({
      entityType: 'invoice',
      entityId: dup.id,
      entityTitle: `Invoice ${dup.invoiceNumber} (Cloned)`,
      clientId: dup.clientId,
      clientName: dup.clientName,
      action: 'created',
      reason: `Duplicated from invoice ${orig.invoiceNumber}`,
      changes: [{ field: 'invoiceNumber', label: 'Cloned Invoice', oldValue: orig.invoiceNumber, newValue: dup.invoiceNumber }]
    });
  };

  const markInvoicePaid = (
    id: string, 
    paymentDetails?: { 
      method?: string; 
      referenceNumber?: string; 
      paidDate?: string; 
      paymentProofUrl?: string; 
      paymentNotes?: string 
    },
    reason?: string
  ) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return;

    const method = paymentDetails?.method || invoice.paymentMethod || 'Stripe';
    const paidDate = paymentDetails?.paidDate || new Date().toISOString().split('T')[0];
    const refNum = paymentDetails?.referenceNumber || `REC-${Date.now().toString().slice(-6)}`;

    // Update invoice status with required payment reconciliation fields
    updateInvoice(id, {
      status: 'paid',
      paidDate,
      paymentMethod: method,
      paymentReferenceNumber: refNum,
      paymentProofUrl: paymentDetails?.paymentProofUrl,
      paymentNotes: paymentDetails?.paymentNotes
    }, reason || `Payment reconciled via ${method} (Ref: ${refNum})`);

    // Create linked payment ledger record
    const payment: PaymentRecord = {
      id: `pay_${Date.now()}`,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      clientName: invoice.clientName,
      date: paidDate,
      amount: invoice.total,
      method: (method as PaymentRecord['method']) || 'Stripe',
      referenceNumber: refNum,
      notes: paymentDetails?.paymentNotes,
      receiptUrl: paymentDetails?.paymentProofUrl
    };
    setPayments(prev => [payment, ...prev]);

    // Update client total revenue
    const client = clients.find(c => c.id === invoice.clientId);
    if (client) {
      updateClient(client.id, {
        totalRevenueYTD: (client.totalRevenueYTD || 0) + invoice.total
      });
    }

    // Specific audit log for marking paid with payment audit record
    addAuditLog({
      entityType: 'payment',
      entityId: payment.id,
      entityTitle: `Payment Ledger Entry: ${invoice.invoiceNumber} ($${invoice.total.toLocaleString()})`,
      clientId: invoice.clientId,
      clientName: invoice.clientName,
      action: 'marked_paid',
      reason: reason || `Settled invoice payment with reference ${refNum}`,
      changes: [
        { field: 'status', label: 'Invoice Status', oldValue: invoice.status, newValue: 'paid' },
        { field: 'paymentReferenceNumber', label: 'Reference Number', oldValue: null, newValue: refNum },
        { field: 'paymentMethod', label: 'Payment Method', oldValue: null, newValue: method },
        { field: 'paidDate', label: 'Payment Date', oldValue: null, newValue: paidDate },
        { field: 'amount', label: 'Settled Amount', oldValue: null, newValue: `$${invoice.total}` }
      ]
    });
  };

  const addPayment = (payment: Omit<PaymentRecord, 'id'>) => {
    const newPay: PaymentRecord = { ...payment, id: `pay_${Date.now()}` };
    setPayments(prev => [newPay, ...prev]);
  };

  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  // --- Freelancer Expenses CRUD ---
  const addExpense = (expenseData: Omit<FreelancerExpense, 'id' | 'createdAt'>) => {
    const newExpense: FreelancerExpense = {
      ...expenseData,
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updates: Partial<FreelancerExpense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const updateRetainerHours = (clientId: string, purchasedHours: number, usedHoursThisMonth: number, reason?: string) => {
    updateClient(clientId, {
      purchasedHours,
      usedHoursThisMonth
    });
    adjustClientAvailableHours(clientId, purchasedHours, 0, 0, reason || 'Updated client retainer hours capacity');
  };

  // --- Approvals ---
  const addApproval = (approval: Omit<ApprovalItem, 'id' | 'submittedDate' | 'decisionHistory'>) => {
    const newApp: ApprovalItem = {
      ...approval,
      id: `app_${Date.now()}`,
      submittedDate: new Date().toISOString().split('T')[0],
      decisionHistory: [
        { timestamp: new Date().toISOString(), action: 'Submitted for client review', author: userProfile.fullName }
      ]
    };
    setApprovals(prev => [newApp, ...prev]);
  };

  const updateApprovalStatus = (id: string, status: ApprovalItem['status'], comment?: string) => {
    setApprovals(prev => prev.map(a => {
      if (a.id === id) {
        const history = [...(a.decisionHistory || []), {
          timestamp: new Date().toISOString(),
          action: status === 'approved' ? 'Approved' : status === 'revision_requested' ? 'Revision Requested' : 'Rejected',
          author: a.clientName,
          note: comment
        }];
        return { ...a, status, comments: comment || a.comments, decisionHistory: history };
      }
      return a;
    }));
  };

  const askApprovalQuestion = (approvalId: string, author: string, questionText: string) => {
    setApprovals(prev => prev.map(a => {
      if (a.id === approvalId) {
        const questions = a.questionsAsked || [];
        const newQuestion = {
          id: `q_${Date.now()}`,
          author,
          text: questionText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return { ...a, questionsAsked: [...questions, newQuestion] };
      }
      return a;
    }));
  };

  const deleteApproval = (id: string) => {
    setApprovals(prev => prev.filter(a => a.id !== id));
  };

  // --- Executive Briefings ---
  const addBriefing = (briefing: Omit<ExecutiveBriefing, 'id'>) => {
    const newB: ExecutiveBriefing = { ...briefing, id: `brf_${Date.now()}` };
    setBriefings(prev => [newB, ...prev]);
  };

  const updateBriefing = (id: string, updates: Partial<ExecutiveBriefing>) => {
    setBriefings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBriefing = (id: string) => {
    setBriefings(prev => prev.filter(b => b.id !== id));
  };

  // --- Strategic Recommendations Hub ---
  const addRecommendation = (rec: Omit<StrategicRecommendation, 'id'>) => {
    const newRec: StrategicRecommendation = { ...rec, id: `rec_${Date.now()}` };
    setRecommendations(prev => [newRec, ...prev]);
  };

  const updateRecommendation = (id: string, updates: Partial<StrategicRecommendation>) => {
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const updateRecommendationStatus = (id: string, status: StrategicRecommendation['status'], feedback?: string) => {
    setRecommendations(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          clientFeedback: feedback !== undefined ? feedback : r.clientFeedback
        };
      }
      return r;
    }));
  };

  const deleteRecommendation = (id: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  // --- Client Strategic Objectives ---
  const addStrategicObjective = (obj: Omit<ClientStrategicObjective, 'id'>) => {
    const newObj: ClientStrategicObjective = { ...obj, id: `obj_${Date.now()}` };
    setStrategicObjectives(prev => [newObj, ...prev]);
  };

  const updateStrategicObjective = (id: string, updates: Partial<ClientStrategicObjective>) => {
    setStrategicObjectives(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const toggleObjectiveMilestone = (objectiveId: string, milestoneId: string) => {
    setStrategicObjectives(prev => prev.map(o => {
      if (o.id === objectiveId) {
        const milestones = o.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
        const allCompleted = milestones.every(m => m.completed);
        return {
          ...o,
          milestones,
          progressStatus: allCompleted ? 'achieved' : o.progressStatus
        };
      }
      return o;
    }));
  };

  const deleteStrategicObjective = (id: string) => {
    setStrategicObjectives(prev => prev.filter(o => o.id !== id));
  };

  // --- Client Knowledge Base Documents ---
  const addClientKnowledgeDoc = (doc: Omit<ClientKnowledgeDocument, 'id' | 'lastUpdated'>) => {
    const newDoc: ClientKnowledgeDocument = {
      ...doc,
      id: `ckb_${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setClientKnowledgeDocs(prev => [newDoc, ...prev]);
  };

  const updateClientKnowledgeDoc = (id: string, updates: Partial<ClientKnowledgeDocument>) => {
    setClientKnowledgeDocs(prev => prev.map(d => d.id === id ? { ...d, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : d));
  };

  const deleteClientKnowledgeDoc = (id: string) => {
    setClientKnowledgeDocs(prev => prev.filter(d => d.id !== id));
  };

  // --- Knowledge Articles ---
  const addKnowledgeArticle = (art: Omit<KnowledgeArticle, 'id' | 'lastUpdated'>) => {
    const newArt: KnowledgeArticle = {
      ...art,
      id: `kb_${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setKnowledgeArticles(prev => [newArt, ...prev]);
  };

  const updateKnowledgeArticle = (id: string, updates: Partial<KnowledgeArticle>) => {
    setKnowledgeArticles(prev => prev.map(k => k.id === id ? { ...k, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : k));
  };

  const deleteKnowledgeArticle = (id: string) => {
    setKnowledgeArticles(prev => prev.filter(k => k.id !== id));
  };

  // --- Opportunities ---
  const addOpportunity = (opp: Omit<Opportunity, 'id' | 'createdAt'>) => {
    const newOpp: Opportunity = { ...opp, id: `opp_${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
    setOpportunities(prev => [newOpp, ...prev]);
  };

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities(prev => prev.filter(o => o.id !== id));
  };

  // --- CEO Goals ---
  const updateCEOGoal = (id: string, updates: Partial<CEOGoal>) => {
    setCeoGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const addCEOGoal = (goal: Omit<CEOGoal, 'id'>) => {
    const newGoal: CEOGoal = { ...goal, id: `cg_${Date.now()}` };
    setCeoGoals(prev => [...prev, newGoal]);
  };

  const deleteCEOGoal = (id: string) => {
    setCeoGoals(prev => prev.filter(g => g.id !== id));
  };

  // --- Rate Calculator ---
  const updateRateCalculator = (inputs: Partial<RateCalculatorInputs>) => {
    setRateCalculator(prev => ({ ...prev, ...inputs }));
  };

  // --- User Profile ---
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  // --- Routines ---
  const toggleRoutineItem = (phase: 'opening' | 'midday' | 'eod', id: string) => {
    setDailyRoutines(prev => ({
      ...prev,
      [phase]: prev[phase].map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    }));
  };

  const resetDailyRoutines = () => {
    setDailyRoutines(initialRoutines);
  };

  // --- Client-Specific Routines ---
  const toggleClientRoutineItem = (clientId: string, routineId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId && c.dailyRoutines) {
        return {
          ...c,
          dailyRoutines: c.dailyRoutines.map(r => r.id === routineId ? { ...r, completed: !r.completed } : r)
        };
      }
      return c;
    }));
  };

  const addClientRoutineItem = (clientId: string, item: Omit<ClientDailyRoutine, 'id' | 'clientId'>) => {
    const newRoutine: ClientDailyRoutine = {
      ...item,
      id: `cr_${clientId}_${Date.now()}`,
      clientId
    };
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          dailyRoutines: [...(c.dailyRoutines || []), newRoutine]
        };
      }
      return c;
    }));
  };

  const deleteClientRoutineItem = (clientId: string, routineId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId && c.dailyRoutines) {
        return {
          ...c,
          dailyRoutines: c.dailyRoutines.filter(r => r.id !== routineId)
        };
      }
      return c;
    }));
  };

  // --- Generate Client Portal Token ---
  const generateClientPortalToken = (clientId: string) => {
    const target = clients.find(c => c.id === clientId);
    if (target?.portalToken) return target.portalToken;
    const newToken = `${target?.code?.toLowerCase() || 'client'}-vault-${Math.floor(10000 + Math.random() * 90000)}`;
    updateClient(clientId, { portalToken: newToken });
    return newToken;
  };

  // --- Backup and Restore ---
  const exportBackupJSON = () => {
    const stateObj = {
      version: "2.0",
      timestamp: new Date().toISOString(),
      userProfile,
      clients,
      tasks,
      projects,
      timeEntries,
      services,
      invoices,
      payments,
      approvals,
      knowledgeArticles,
      opportunities,
      ceoGoals,
      rateCalculator,
      dailyRoutines
    };
    const json = JSON.stringify(stateObj, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AEDMIN_OS_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    return json;
  };

  const importBackupJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.userProfile) setUserProfile(data.userProfile);
      if (data.clients) setClients(data.clients);
      if (data.tasks) setTasks(data.tasks);
      if (data.projects) setProjects(data.projects);
      if (data.timeEntries) setTimeEntries(data.timeEntries);
      if (data.services) setServices(data.services);
      if (data.invoices) setInvoices(data.invoices);
      if (data.payments) setPayments(data.payments);
      if (data.approvals) setApprovals(data.approvals);
      if (data.knowledgeArticles) setKnowledgeArticles(data.knowledgeArticles);
      if (data.opportunities) setOpportunities(data.opportunities);
      if (data.ceoGoals) setCeoGoals(data.ceoGoals);
      if (data.rateCalculator) setRateCalculator(data.rateCalculator);
      if (data.dailyRoutines) setDailyRoutines(data.dailyRoutines);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      if (data.retainerPeriods) setRetainerPeriods(data.retainerPeriods);
      return true;
    } catch (e) {
      console.error("Failed to parse backup JSON", e);
      return false;
    }
  };

  // --- Quick Action Dialog Helpers ---
  const openQuickAction = (type: string) => {
    setQuickActionType(type);
    setQuickActionOpen(true);
  };

  // --- Global Operations & Holidays Operations ---
  const addHoliday = (holidayData: Omit<ClientHoliday, 'id'>) => {
    const newHol: ClientHoliday = { ...holidayData, id: `hol_${Date.now()}` };
    setHolidays(prev => [...prev, newHol]);
  };

  const deleteHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
  };

  const toggleClientTravelMode = (clientId: string, travelDetails?: { travelCity?: string; travelCountry?: string; travelTimezone?: string; travelStartDate?: string; travelEndDate?: string; travelReason?: string }) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const nextActive = !c.isTravelModeActive;
        return {
          ...c,
          isTravelModeActive: nextActive,
          ...(travelDetails || {})
        };
      }
      return c;
    }));
  };

  const updateClientGlobalOps = (clientId: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updates } : c));
  };

  // --- Reset All Data ---
  const resetAllData = () => {
    localStorage.clear();
    setUserProfile(initialUserProfile);
    setClients(initialClients);
    setTasks(initialTasks);
    setProjects(initialProjects);
    setTimeEntries(initialTimeEntries);
    setServices(initialServices);
    setInvoices(initialInvoices);
    setPayments(initialPayments);
    setApprovals(initialApprovals);
    setKnowledgeArticles(initialKnowledgeArticles);
    setOpportunities(initialOpportunities);
    setCeoGoals(initialCEOGoals);
    setRateCalculator(initialRateCalculator);
    setDailyRoutines(initialRoutines);
    setHolidays(initialHolidays);
    setTemplates(initialManagedTemplates);
    setGeneratedDrafts(initialGeneratedDrafts);
    setAuditLogs(initialAuditLogs);
    setRetainerPeriods(initialRetainerPeriods);
  };

  const resetToDefaultSeed = resetAllData;

  return (
    <AppContext.Provider value={{
      userProfile,
      updateUserProfile,
      clients,
      addClient,
      updateClient,
      deleteClient,
      archiveClient,
      restoreClient,
      duplicateClient,
      holidays,
      addHoliday,
      deleteHoliday,
      toggleClientTravelMode,
      updateClientGlobalOps,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      archiveTask,
      restoreTask,
      duplicateTask,
      toggleTaskStatus,
      projects,
      addProject,
      updateProject,
      deleteProject,
      duplicateProject,
      archiveProject,
      restoreProject,
      templates,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      duplicateTemplate,
      archiveTemplate,
      restoreTemplate,
      toggleFavoriteTemplate,
      generatedDrafts,
      saveGeneratedDraft,
      deleteGeneratedDraft,
      updateGeneratedDraft,
      timeEntries,
      addTimeEntry,
      updateTimeEntry,
      deleteTimeEntry,
      duplicateTimeEntry,
      activeTimer,
      startTimer,
      pauseTimer,
      resumeTimer,
      stopTimer,
      updateActiveTimerNotes,
      retainerPeriods,
      addRetainerPeriod,
      updateRetainerPeriod,
      deleteRetainerPeriod,
      adjustClientAvailableHours,
      auditLogs,
      addAuditLog,
      clearAuditLogs,
      exportAuditLogsJSON,
      exportAuditLogsCSV,
      services,
      addService,
      updateService,
      deleteService,
      duplicateService,
      invoices,
      addInvoice,
      updateInvoice,
      updateInvoiceStatus,
      deleteInvoice,
      duplicateInvoice,
      markInvoicePaid,
      payments,
      addPayment,
      deletePayment,
      expenses,
      addExpense,
      updateExpense,
      deleteExpense,
      updateRetainerHours,
      approvals,
      addApproval,
      updateApprovalStatus,
      askApprovalQuestion,
      deleteApproval,
      briefings,
      addBriefing,
      updateBriefing,
      deleteBriefing,
      recommendations,
      addRecommendation,
      updateRecommendation,
      updateRecommendationStatus,
      deleteRecommendation,
      strategicObjectives,
      addStrategicObjective,
      updateStrategicObjective,
      toggleObjectiveMilestone,
      deleteStrategicObjective,
      clientKnowledgeDocs,
      addClientKnowledgeDoc,
      updateClientKnowledgeDoc,
      deleteClientKnowledgeDoc,
      knowledgeArticles,
      addKnowledgeArticle,
      updateKnowledgeArticle,
      deleteKnowledgeArticle,
      opportunities,
      addOpportunity,
      updateOpportunity,
      deleteOpportunity,
      ceoGoals,
      updateCEOGoal,
      addCEOGoal,
      deleteCEOGoal,
      rateCalculator,
      updateRateCalculator,
      portalClientId,
      setPortalClientId,
      generateClientPortalToken,
      dailyRoutines,
      toggleRoutineItem,
      resetDailyRoutines,
      toggleClientRoutineItem,
      addClientRoutineItem,
      deleteClientRoutineItem,
      quickActionOpen,
      setQuickActionOpen,
      quickActionType,
      openQuickAction,
      isTourOpen,
      setIsTourOpen,
      tourActiveStep,
      setTourActiveStep,
      openTour,
      exportBackupJSON,
      importBackupJSON,
      resetToDefaultSeed,
      resetAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
