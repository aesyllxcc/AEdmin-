import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserAccount, 
  UserRole, 
  AuthSession, 
  SystemActionLog, 
  TenantPlanTier, 
  ManualPaymentMethod,
  ManualPaymentRecord,
  TenantSubscription
} from '@/types';
import { 
  hashPasswordWithSalt, 
  generateSalt, 
  generateSessionToken, 
  AUTH_STORAGE_KEYS,
  ROLE_PERMISSIONS 
} from '@/utils/authUtils';
import { 
  SUPER_ADMIN_EMAIL, 
  SUPER_ADMIN_NAME, 
  SUPER_ADMIN_TENANT_ID,
  getWorkspacesRegistry,
  saveWorkspacesRegistry,
  getManualPaymentsLedger,
  saveManualPaymentsLedger,
  initializeTenantDataIfMissing,
  initialWorkspaces
} from '@/utils/workspaceManager';

interface AuthContextType {
  isSetupCompleted: boolean;
  currentUser: UserAccount | null;
  currentSession: AuthSession | null;
  userAccounts: UserAccount[];
  auditLogs: SystemActionLog[];
  isLoading: boolean;
  isSuperAdmin: boolean;
  activeTenantId: string;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; mustChangePassword?: boolean }>;
  logout: () => void;
  updatePasswordForCurrentUser: (newPassword: string, additionalProfile?: { businessName?: string; timezone?: string }) => Promise<{ success: boolean; message?: string }>;
  completeSetupWizard: (data: {
    fullName: string;
    email: string;
    password: string;
    studioName: string;
    timezone: string;
    hourlyRate: number;
    baseCurrency: string;
  }) => Promise<void>;
  provisionTenantAccount: (data: {
    fullName: string;
    email: string;
    businessName: string;
    planTier: TenantPlanTier;
    timezone: string;
    currency: string;
    hourlyRate: number;
    initialPayment: {
      amount: number;
      currency: 'USD' | 'PHP' | 'AUD' | 'GBP' | 'EUR';
      method: ManualPaymentMethod;
      referenceNumber: string;
      billingPeriod: 'monthly' | 'quarterly' | 'annual';
      notes?: string;
      validMonths: number;
    };
    sendTemporaryPassword?: string;
  }) => Promise<{ success: boolean; message?: string; tempPassword?: string; tenantId?: string }>;
  updateTenantSubscriptionStatus: (tenantId: string, status: UserAccount['subscriptionStatus'], notes?: string) => void;
  recordManualPaymentForTenant: (paymentData: {
    tenantId: string;
    amount: number;
    currency: 'USD' | 'PHP' | 'AUD' | 'GBP' | 'EUR';
    paymentMethod: ManualPaymentMethod;
    referenceNumber: string;
    billingPeriod: 'monthly' | 'quarterly' | 'annual';
    validMonths: number;
    notes?: string;
  }) => { success: boolean; message?: string };
  resetTenantPasswordByAdmin: (userId: string, newTempPassword?: string) => Promise<{ success: boolean; tempPassword?: string; message?: string }>;
  deleteTenantWorkspaceByAdmin: (tenantId: string, userId: string) => { success: boolean; message?: string };
  updateUserAccount: (id: string, updates: Partial<UserAccount>) => void;
  logSystemAction: (actionType: SystemActionLog['actionType'], module: SystemActionLog['module'], description: string, targetId?: string, targetName?: string) => void;
  can: (action: keyof typeof ROLE_PERMISSIONS['Owner']) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSetupCompleted, setIsSetupCompleted] = useState<boolean>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEYS.SETUP_COMPLETED);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEYS.USERS_LIST);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Fallthrough to seed default accounts
      }
    }
    return [];
  });

  const [currentSession, setCurrentSession] = useState<AuthSession | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEYS.CURRENT_SESSION);
    return saved ? JSON.parse(saved) : null;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [auditLogs, setAuditLogs] = useState<SystemActionLog[]>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState(true);

  // Initialize Default Super Admin & Starter Demo Account on first mount if empty
  useEffect(() => {
    const initDefaultAccounts = async () => {
      const saved = localStorage.getItem(AUTH_STORAGE_KEYS.USERS_LIST);
      let existing: UserAccount[] = [];
      if (saved) {
        try {
          existing = JSON.parse(saved);
        } catch {
          existing = [];
        }
      }

      const hasSuperAdmin = existing.some(u => u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());

      if (existing.length === 0 || !hasSuperAdmin) {
        const ownerSalt = generateSalt();
        const ownerHash = await hashPasswordWithSalt('AedminOwner2026!', ownerSalt);

        const ellysaOwner: UserAccount = {
          id: 'usr_ellysa_owner',
          username: 'ellysa.delprado',
          email: SUPER_ADMIN_EMAIL,
          fullName: SUPER_ADMIN_NAME,
          role: 'Owner',
          isPrimaryOwner: true,
          isSuperAdmin: true,
          tenantId: SUPER_ADMIN_TENANT_ID,
          status: 'active',
          timezone: 'Asia/Manila',
          workingHoursStart: '09:00',
          workingHoursEnd: '18:00',
          businessName: 'AEDMIN Master Studio',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          createdAt: '2025-09-01T00:00:00.000Z',
          passwordHash: ownerHash,
          passwordSalt: ownerSalt,
          mustChangePassword: false,
          subscriptionTier: 'agency_studio',
          subscriptionStatus: 'active',
          currency: 'USD',
          hourlyRate: 150
        };

        const sarahSalt = generateSalt();
        const sarahHash = await hashPasswordWithSalt('SarahChen2026!', sarahSalt);

        const sarahFreelance: UserAccount = {
          id: 'usr_sarah_chen',
          username: 'sarah.chen',
          email: 'sarah.ops@freelance.studio',
          fullName: 'Sarah Chen',
          role: 'Operations Manager',
          isPrimaryOwner: false,
          isSuperAdmin: false,
          tenantId: 'ws_sarah_freelance',
          status: 'active',
          timezone: 'Asia/Singapore',
          workingHoursStart: '09:00',
          workingHoursEnd: '18:00',
          businessName: 'Sarah Chen Executive Ops',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
          createdAt: '2026-02-15T08:30:00.000Z',
          passwordHash: sarahHash,
          passwordSalt: sarahSalt,
          mustChangePassword: true, // Configured for demonstrating the first-login mandatory password change flow!
          subscriptionTier: 'pro_executive',
          subscriptionStatus: 'active',
          currency: '$',
          hourlyRate: 120,
          lastPaymentReference: 'GCASH-9821049281'
        };

        const combined = [ellysaOwner, sarahFreelance, ...existing.filter(u => u.email !== SUPER_ADMIN_EMAIL && u.email !== 'sarah.ops@freelance.studio')];
        setUserAccounts(combined);
        localStorage.setItem(AUTH_STORAGE_KEYS.USERS_LIST, JSON.stringify(combined));
        localStorage.setItem(AUTH_STORAGE_KEYS.SETUP_COMPLETED, JSON.stringify(true));
        setIsSetupCompleted(true);

        // Pre-seed tenant workspaces
        initializeTenantDataIfMissing(SUPER_ADMIN_TENANT_ID);
        initializeTenantDataIfMissing('ws_sarah_freelance');

        // Automatically log in Ellysa if no session exists
        if (!currentSession) {
          const sessionToken = generateSessionToken();
          const session: AuthSession = {
            token: sessionToken,
            user: ellysaOwner,
            expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
          };
          setCurrentUser(ellysaOwner);
          setCurrentSession(session);
          localStorage.setItem(AUTH_STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
        }
      }
      setIsLoading(false);
    };

    initDefaultAccounts();
  }, []);

  // Sync user object from session on mount and account updates
  useEffect(() => {
    if (currentSession && userAccounts.length > 0) {
      const user = userAccounts.find(u => u.id === currentSession.user.id);
      if (user && user.status === 'active') {
        setCurrentUser(user);
        // Ensure tenant workspace data exists
        const tid = user.tenantId || `ws_${user.id}`;
        initializeTenantDataIfMissing(tid);
      } else {
        // Session invalid
        setCurrentUser(null);
        setCurrentSession(null);
        localStorage.removeItem(AUTH_STORAGE_KEYS.CURRENT_SESSION);
      }
    } else if (!currentSession) {
      setCurrentUser(null);
    }
    setIsLoading(false);
  }, [currentSession, userAccounts]);

  // Persist State
  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEYS.SETUP_COMPLETED, JSON.stringify(isSetupCompleted));
  }, [isSetupCompleted]);

  useEffect(() => {
    if (userAccounts.length > 0) {
      localStorage.setItem(AUTH_STORAGE_KEYS.USERS_LIST, JSON.stringify(userAccounts));
    }
  }, [userAccounts]);

  useEffect(() => {
    if (currentSession) {
      localStorage.setItem(AUTH_STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(currentSession));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEYS.CURRENT_SESSION);
    }
  }, [currentSession]);

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs.slice(0, 200)));
  }, [auditLogs]);

  // System Action Logger
  const logSystemAction = (
    actionType: SystemActionLog['actionType'], 
    module: SystemActionLog['module'], 
    description: string, 
    targetId?: string,
    targetName?: string
  ) => {
    const log: SystemActionLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser?.fullName || 'System Event',
      actorRole: currentUser?.role || 'Owner',
      actionType,
      module,
      description,
      targetId,
      targetName
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Complete Setup Wizard (if brand new setup needed)
  const completeSetupWizard = async (data: {
    fullName: string;
    email: string;
    password: string;
    studioName: string;
    timezone: string;
    hourlyRate: number;
    baseCurrency: string;
  }) => {
    const salt = generateSalt();
    const passwordHash = await hashPasswordWithSalt(data.password, salt);

    const isEllysa = data.email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

    const ownerAccount: UserAccount = {
      id: isEllysa ? 'usr_ellysa_owner' : `usr_${Date.now()}`,
      username: data.email.trim().toLowerCase().split('@')[0],
      email: data.email.trim().toLowerCase(),
      fullName: data.fullName.trim() || SUPER_ADMIN_NAME,
      role: 'Owner',
      isPrimaryOwner: true,
      isSuperAdmin: isEllysa,
      tenantId: isEllysa ? SUPER_ADMIN_TENANT_ID : `ws_usr_${Date.now()}`,
      status: 'active',
      timezone: data.timezone || 'Asia/Manila',
      workingHoursStart: '09:00',
      workingHoursEnd: '18:00',
      businessName: data.studioName.trim() || 'AEDMIN Executive Studio',
      createdAt: new Date().toISOString(),
      passwordHash,
      passwordSalt: salt,
      mustChangePassword: false,
      subscriptionTier: 'agency_studio',
      subscriptionStatus: 'active',
      hourlyRate: data.hourlyRate || 150,
      currency: data.baseCurrency || 'USD'
    };

    const sessionToken = generateSessionToken();
    const session: AuthSession = {
      token: sessionToken,
      user: ownerAccount,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    };

    setUserAccounts([ownerAccount]);
    setCurrentUser(ownerAccount);
    setCurrentSession(session);
    setIsSetupCompleted(true);

    initializeTenantDataIfMissing(ownerAccount.tenantId || SUPER_ADMIN_TENANT_ID);

    logSystemAction('create', 'auth', `Initial owner account created for ${data.email}`, ownerAccount.id, ownerAccount.fullName);
  };

  // Login
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string; mustChangePassword?: boolean }> => {
    const cleanEmail = email.trim().toLowerCase();
    const user = userAccounts.find(u => u.email === cleanEmail);

    if (!user) {
      return { success: false, message: 'Invalid email address or credentials.' };
    }

    if (user.status === 'suspended') {
      return { success: false, message: 'This account has been suspended. Please contact Ellysa May M. Del Prado (hello.aespace@gmail.com) for payment verification or reactivation.' };
    }

    const testHash = await hashPasswordWithSalt(password, user.passwordSalt || '');
    if (testHash !== user.passwordHash) {
      logSystemAction('status_change', 'auth', `Failed login attempt for ${cleanEmail}`);
      return { 
        success: false, 
        message: 'Incorrect password. Please verify your credentials or contact the administrator.' 
      };
    }

    // Successful login
    const sessionToken = generateSessionToken();
    const session: AuthSession = {
      token: sessionToken,
      user,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    };

    setUserAccounts(prev => prev.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          lastLoginAt: new Date().toISOString()
        };
      }
      return u;
    }));

    setCurrentUser(user);
    setCurrentSession(session);

    const tid = user.tenantId || `ws_${user.id}`;
    initializeTenantDataIfMissing(tid);

    logSystemAction('status_change', 'auth', `Successful login for ${user.fullName} (${user.role}) into workspace ${tid}`, user.id, user.fullName);

    return { 
      success: true, 
      mustChangePassword: !!user.mustChangePassword 
    };
  };

  // Update password for current user (mandatory first-login or profile settings)
  const updatePasswordForCurrentUser = async (newPassword: string, additionalProfile?: { businessName?: string; timezone?: string }): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser) return { success: false, message: 'No active session.' };

    const salt = generateSalt();
    const passwordHash = await hashPasswordWithSalt(newPassword, salt);

    const updatedUser: UserAccount = {
      ...currentUser,
      passwordHash,
      passwordSalt: salt,
      mustChangePassword: false,
      businessName: additionalProfile?.businessName || currentUser.businessName,
      timezone: additionalProfile?.timezone || currentUser.timezone
    };

    setUserAccounts(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    if (currentSession) {
      setCurrentSession({ ...currentSession, user: updatedUser });
    }

    logSystemAction('update', 'auth', `Password updated and first-login security requirements fulfilled for ${currentUser.email}`, currentUser.id, currentUser.fullName);
    return { success: true };
  };

  // Logout
  const logout = () => {
    if (currentUser) {
      logSystemAction('status_change', 'auth', `${currentUser.fullName} signed out`, currentUser.id, currentUser.fullName);
    }
    setCurrentUser(null);
    setCurrentSession(null);
    localStorage.removeItem(AUTH_STORAGE_KEYS.CURRENT_SESSION);
  };

  // Super Admin: Provision New Tenant Account with Isolated Workspace
  const provisionTenantAccount = async (data: {
    fullName: string;
    email: string;
    businessName: string;
    planTier: TenantPlanTier;
    timezone: string;
    currency: string;
    hourlyRate: number;
    initialPayment: {
      amount: number;
      currency: 'USD' | 'PHP' | 'AUD' | 'GBP' | 'EUR';
      method: ManualPaymentMethod;
      referenceNumber: string;
      billingPeriod: 'monthly' | 'quarterly' | 'annual';
      notes?: string;
      validMonths: number;
    };
    sendTemporaryPassword?: string;
  }): Promise<{ success: boolean; message?: string; tempPassword?: string; tenantId?: string }> => {
    // Strictly verify caller is Ellysa May M. Del Prado (Super Admin)
    const isOwner = currentUser?.role === 'Owner' && (currentUser.isPrimaryOwner || currentUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
    if (!isOwner) {
      return { success: false, message: 'Unauthorized. Ellysa May M. Del Prado is the sole Super Admin authorized to create tenant accounts.' };
    }

    const cleanEmail = data.email.trim().toLowerCase();
    if (userAccounts.some(u => u.email === cleanEmail)) {
      return { success: false, message: `An account with email ${cleanEmail} already exists.` };
    }

    const tempPassword = data.sendTemporaryPassword || `AEDMIN-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const salt = generateSalt();
    const passwordHash = await hashPasswordWithSalt(tempPassword, salt);

    const tenantId = `ws_tenant_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const planNameMap: Record<TenantPlanTier, string> = {
      starter_freelance: 'Freelance Starter',
      pro_executive: 'Executive Pro',
      agency_studio: 'Agency & Studio'
    };

    const maxClientsMap: Record<TenantPlanTier, number> = {
      starter_freelance: 5,
      pro_executive: 20,
      agency_studio: 999
    };

    const periodEndDate = new Date(Date.now() + (data.initialPayment.validMonths || 1) * 30 * 24 * 60 * 60 * 1000).toISOString();

    const newAccount: UserAccount = {
      id: userId,
      username: cleanEmail.split('@')[0],
      email: cleanEmail,
      fullName: data.fullName.trim(),
      role: 'Operations Manager', // Regular Tenant Operator
      isPrimaryOwner: false,
      isSuperAdmin: false,
      tenantId,
      status: 'active',
      timezone: data.timezone || 'Asia/Manila',
      workingHoursStart: '09:00',
      workingHoursEnd: '18:00',
      businessName: data.businessName.trim() || `${data.fullName.trim()} Operations Studio`,
      createdAt: new Date().toISOString(),
      passwordHash,
      passwordSalt: salt,
      mustChangePassword: true, // Forces password change upon first login!
      subscriptionTier: data.planTier,
      subscriptionStatus: 'active',
      currency: data.currency || '$',
      hourlyRate: data.hourlyRate || 75,
      lastPaymentReference: data.initialPayment.referenceNumber,
      subscriptionExpiresAt: periodEndDate
    };

    // 1. Save User Account
    setUserAccounts(prev => [...prev, newAccount]);

    // 2. Initialize isolated tenant workspace data
    initializeTenantDataIfMissing(tenantId, {
      fullName: data.fullName.trim(),
      email: cleanEmail,
      title: 'Principal Freelancer & Operations Specialist',
      timezone: data.timezone || 'Asia/Manila',
      currency: data.currency || '$',
      workingHoursStart: '09:00',
      workingHoursEnd: '18:00',
      monthlyRevenueTarget: data.hourlyRate * 100 || 7500,
      weeklyCapacityHours: 35,
      defaultFileNamingPrefix: cleanEmail.substring(0, 4).toUpperCase(),
      communicationEmail: cleanEmail
    });

    // 3. Register in Workspaces Registry
    const currentWorkspaces = getWorkspacesRegistry();
    const subscription: TenantSubscription = {
      planId: data.planTier,
      planName: planNameMap[data.planTier],
      price: data.initialPayment.amount,
      currency: data.initialPayment.currency,
      interval: data.initialPayment.billingPeriod,
      status: 'active',
      startDate: new Date().toISOString(),
      currentPeriodEnd: periodEndDate,
      paymentMethod: data.initialPayment.method,
      lastPaymentReference: data.initialPayment.referenceNumber,
      lastPaymentDate: new Date().toISOString(),
      maxClients: maxClientsMap[data.planTier],
      maxStorageMB: data.planTier === 'starter_freelance' ? 2500 : data.planTier === 'pro_executive' ? 10000 : 50000,
      notes: `Manual payment verified by ${SUPER_ADMIN_NAME}. Ref: ${data.initialPayment.referenceNumber}`
    };

    const newWorkspace = {
      id: tenantId,
      name: `${data.businessName.trim()} • Workspace`,
      ownerUserId: userId,
      ownerEmail: cleanEmail,
      ownerFullName: data.fullName.trim(),
      createdAt: new Date().toISOString(),
      plan: data.planTier,
      subscription,
      status: 'active' as const,
      storageUsedMB: 12.0,
      clientCount: 0,
      taskCount: 1,
      invoiceCount: 0
    };

    saveWorkspacesRegistry([...currentWorkspaces, newWorkspace]);

    // 4. Record Manual Payment in Ledger
    const currentPayments = getManualPaymentsLedger();
    const newPaymentRecord: ManualPaymentRecord = {
      id: `pay_rec_${Date.now()}`,
      tenantId,
      userEmail: cleanEmail,
      userName: data.fullName.trim(),
      businessName: data.businessName.trim(),
      planTier: data.planTier,
      amount: data.initialPayment.amount,
      currency: data.initialPayment.currency,
      paymentMethod: data.initialPayment.method,
      referenceNumber: data.initialPayment.referenceNumber,
      billingPeriod: data.initialPayment.billingPeriod,
      notes: data.initialPayment.notes || 'Initial account provisioning payment',
      verifiedBy: SUPER_ADMIN_NAME,
      verifiedAt: new Date().toISOString(),
      periodStartDate: new Date().toISOString(),
      periodEndDate,
      status: 'verified',
      createdAt: new Date().toISOString()
    };
    saveManualPaymentsLedger([newPaymentRecord, ...currentPayments]);

    logSystemAction(
      'create', 
      'auth', 
      `Super Admin provisioned new isolated tenant workspace for ${cleanEmail} (${data.planTier}) with temporary password.`,
      tenantId,
      data.fullName
    );

    return { 
      success: true, 
      tempPassword, 
      tenantId,
      message: `Tenant workspace provisioned successfully for ${data.fullName}!` 
    };
  };

  // Super Admin: Update Tenant Subscription Status
  const updateTenantSubscriptionStatus = (tenantId: string, status: UserAccount['subscriptionStatus'], notes?: string) => {
    const isOwner = currentUser?.role === 'Owner' && (currentUser.isPrimaryOwner || currentUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
    if (!isOwner) return;

    setUserAccounts(prev => prev.map(u => {
      if (u.tenantId === tenantId) {
        return {
          ...u,
          subscriptionStatus: status,
          status: status === 'suspended' ? 'suspended' : 'active'
        };
      }
      return u;
    }));

    const workspaces = getWorkspacesRegistry();
    saveWorkspacesRegistry(workspaces.map(ws => {
      if (ws.id === tenantId) {
        return {
          ...ws,
          status: status === 'suspended' ? 'suspended' : 'active',
          subscription: {
            ...ws.subscription,
            status: status || 'active',
            notes: notes || ws.subscription.notes
          }
        };
      }
      return ws;
    }));

    logSystemAction('update', 'auth', `Tenant subscription for ${tenantId} updated to ${status}`, tenantId);
  };

  // Super Admin: Record Manual Payment for existing Tenant
  const recordManualPaymentForTenant = (paymentData: {
    tenantId: string;
    amount: number;
    currency: 'USD' | 'PHP' | 'AUD' | 'GBP' | 'EUR';
    paymentMethod: ManualPaymentMethod;
    referenceNumber: string;
    billingPeriod: 'monthly' | 'quarterly' | 'annual';
    validMonths: number;
    notes?: string;
  }): { success: boolean; message?: string } => {
    const isOwner = currentUser?.role === 'Owner' && (currentUser.isPrimaryOwner || currentUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
    if (!isOwner) {
      return { success: false, message: 'Only Super Admin can record manual payments.' };
    }

    const user = userAccounts.find(u => u.tenantId === paymentData.tenantId);
    if (!user) {
      return { success: false, message: 'Tenant user not found.' };
    }

    const periodStartDate = new Date().toISOString();
    const periodEndDate = new Date(Date.now() + (paymentData.validMonths || 1) * 30 * 24 * 60 * 60 * 1000).toISOString();

    // 1. Record payment in ledger
    const payments = getManualPaymentsLedger();
    const newRecord: ManualPaymentRecord = {
      id: `pay_rec_${Date.now()}`,
      tenantId: paymentData.tenantId,
      userEmail: user.email,
      userName: user.fullName,
      businessName: user.businessName || `${user.fullName} Studio`,
      planTier: user.subscriptionTier || 'starter_freelance',
      amount: paymentData.amount,
      currency: paymentData.currency,
      paymentMethod: paymentData.paymentMethod,
      referenceNumber: paymentData.referenceNumber,
      billingPeriod: paymentData.billingPeriod,
      notes: paymentData.notes || 'Subscription renewal manual payment',
      verifiedBy: SUPER_ADMIN_NAME,
      verifiedAt: new Date().toISOString(),
      periodStartDate,
      periodEndDate,
      status: 'verified',
      createdAt: new Date().toISOString()
    };
    saveManualPaymentsLedger([newRecord, ...payments]);

    // 2. Update user status
    setUserAccounts(prev => prev.map(u => {
      if (u.tenantId === paymentData.tenantId) {
        return {
          ...u,
          subscriptionStatus: 'active',
          status: 'active',
          lastPaymentReference: paymentData.referenceNumber,
          subscriptionExpiresAt: periodEndDate
        };
      }
      return u;
    }));

    // 3. Update workspace
    const workspaces = getWorkspacesRegistry();
    saveWorkspacesRegistry(workspaces.map(ws => {
      if (ws.id === paymentData.tenantId) {
        return {
          ...ws,
          status: 'active',
          subscription: {
            ...ws.subscription,
            status: 'active',
            currentPeriodEnd: periodEndDate,
            lastPaymentReference: paymentData.referenceNumber,
            lastPaymentDate: new Date().toISOString(),
            notes: `Renewed via ${paymentData.paymentMethod}. Ref: ${paymentData.referenceNumber}`
          }
        };
      }
      return ws;
    }));

    logSystemAction(
      'payment_verified', 
      'finance', 
      `Super Admin verified manual payment of ${paymentData.currency} ${paymentData.amount} (Ref: ${paymentData.referenceNumber}) for ${user.email}`,
      paymentData.tenantId,
      user.fullName
    );

    return { success: true, message: `Payment verified and subscription extended until ${new Date(periodEndDate).toLocaleDateString()}!` };
  };

  // Super Admin: Reset Tenant Password and Issue Temporary Credentials
  const resetTenantPasswordByAdmin = async (userId: string, newTempPassword?: string): Promise<{ success: boolean; tempPassword?: string; message?: string }> => {
    const isOwner = currentUser?.role === 'Owner' && (currentUser.isPrimaryOwner || currentUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
    if (!isOwner) {
      return { success: false, message: 'Unauthorized. Only Super Admin can reset tenant credentials.' };
    }

    const targetUser = userAccounts.find(u => u.id === userId);
    if (!targetUser) return { success: false, message: 'User not found.' };

    const tempPassword = newTempPassword || `AEDMIN-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const salt = generateSalt();
    const passwordHash = await hashPasswordWithSalt(tempPassword, salt);

    setUserAccounts(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          passwordHash,
          passwordSalt: salt,
          mustChangePassword: true
        };
      }
      return u;
    }));

    logSystemAction('update', 'auth', `Super Admin reset password for ${targetUser.email}. Must change on next login.`, targetUser.id, targetUser.fullName);
    return { success: true, tempPassword, message: `Temporary password for ${targetUser.fullName} is: ${tempPassword}` };
  };

  // Super Admin: Delete Tenant Workspace
  const deleteTenantWorkspaceByAdmin = (tenantId: string, userId: string): { success: boolean; message?: string } => {
    const isOwner = currentUser?.role === 'Owner' && (currentUser.isPrimaryOwner || currentUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
    if (!isOwner) {
      return { success: false, message: 'Unauthorized.' };
    }

    if (tenantId === SUPER_ADMIN_TENANT_ID || userId === 'usr_ellysa_owner') {
      return { success: false, message: 'The primary Super Admin master workspace cannot be deleted.' };
    }

    setUserAccounts(prev => prev.filter(u => u.id !== userId && u.tenantId !== tenantId));
    const workspaces = getWorkspacesRegistry();
    saveWorkspacesRegistry(workspaces.filter(ws => ws.id !== tenantId));

    // Clear tenant storage keys
    const keysToRemove = [
      'clients', 'tasks', 'projects', 'time_entries', 'services', 
      'invoices', 'payments', 'approvals', 'knowledge', 'profile', 'templates'
    ];
    keysToRemove.forEach(k => {
      localStorage.removeItem(`aedmin_ws_${tenantId}_${k}`);
    });

    logSystemAction('delete', 'auth', `Super Admin deleted tenant workspace ${tenantId}`, tenantId);
    return { success: true, message: 'Tenant workspace and private data successfully deleted.' };
  };

  // Update User Account details
  const updateUserAccount = (id: string, updates: Partial<UserAccount>) => {
    setUserAccounts(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, ...updates };
      }
      return u;
    }));
    logSystemAction('update', 'auth', `Updated profile for user ${id}`, id);
  };

  // Permission checker
  const can = (action: keyof typeof ROLE_PERMISSIONS['Owner']): boolean => {
    if (!currentUser) return false;
    const permissions = ROLE_PERMISSIONS[currentUser.role];
    return permissions ? permissions[action] : false;
  };

  const isSuperAdmin = !!(
    currentUser && 
    (currentUser.isSuperAdmin || currentUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() || currentUser.isPrimaryOwner)
  );

  const activeTenantId = currentUser?.tenantId || (isSuperAdmin ? SUPER_ADMIN_TENANT_ID : (currentUser ? `ws_${currentUser.id}` : ''));

  return (
    <AuthContext.Provider
      value={{
        isSetupCompleted,
        currentUser,
        currentSession,
        userAccounts,
        auditLogs,
        isLoading,
        isSuperAdmin,
        activeTenantId,
        login,
        logout,
        updatePasswordForCurrentUser,
        completeSetupWizard,
        provisionTenantAccount,
        updateTenantSubscriptionStatus,
        recordManualPaymentForTenant,
        resetTenantPasswordByAdmin,
        deleteTenantWorkspaceByAdmin,
        updateUserAccount,
        logSystemAction,
        can
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
