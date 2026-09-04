// ====================================================
// Multi-Tenant SaaS Platform & Workspace Architecture
// ====================================================

export type TenantPlanTier = 'starter_freelance' | 'pro_executive' | 'agency_studio';

export type TenantSubscriptionStatus = 
  | 'active' 
  | 'pending_payment' 
  | 'past_due' 
  | 'trial' 
  | 'suspended' 
  | 'cancelled';

export type ManualPaymentMethod = 
  | 'gcash' 
  | 'maya' 
  | 'bank_transfer' 
  | 'paypal' 
  | 'wise' 
  | 'stripe_manual' 
  | 'cash_other';

export interface PlanFeatureConfig {
  id: TenantPlanTier;
  name: string;
  badge: string;
  monthlyPriceUSD: number;
  monthlyPricePHP: number;
  annualDiscountPercent: number;
  clientLimit: number; // e.g. 5, 25, unlimited (999)
  teamMemberLimit: number;
  storageLimitMB: number;
  description: string;
  features: string[];
  recommendedFor: string;
}

export interface ManualPaymentRecord {
  id: string;
  tenantId: string;
  userEmail: string;
  userName: string;
  businessName: string;
  planTier: TenantPlanTier;
  amount: number;
  currency: 'USD' | 'PHP' | 'AUD' | 'GBP' | 'EUR';
  paymentMethod: ManualPaymentMethod;
  referenceNumber: string;
  billingPeriod: 'monthly' | 'quarterly' | 'annual';
  notes?: string;
  receiptUrl?: string;
  verifiedBy: string; // e.g., "Ellysa May M. Del Prado"
  verifiedAt: string; // ISO
  periodStartDate: string; // ISO
  periodEndDate: string; // ISO (valid until)
  status: 'verified' | 'pending' | 'rejected';
  createdAt: string;
}

export interface TenantSubscription {
  planId: TenantPlanTier;
  planName: string;
  price: number;
  currency: 'USD' | 'PHP' | 'AUD' | 'GBP' | 'EUR';
  interval: 'monthly' | 'quarterly' | 'annual';
  status: TenantSubscriptionStatus;
  startDate: string;
  currentPeriodEnd: string;
  paymentMethod: ManualPaymentMethod;
  lastPaymentReference?: string;
  lastPaymentDate?: string;
  maxClients: number;
  maxStorageMB: number;
  notes?: string;
}

export interface TenantWorkspace {
  id: string; // e.g., "ws_usr_123"
  name: string; // e.g., "Sarah Chen Executive Ops"
  ownerUserId: string;
  ownerEmail: string;
  ownerFullName: string;
  createdAt: string;
  plan: TenantPlanTier;
  subscription: TenantSubscription;
  status: 'active' | 'suspended' | 'archived';
  storageUsedMB: number;
  clientCount: number;
  taskCount: number;
  invoiceCount: number;
  isSuperAdminWorkspace?: boolean;
}

export interface PlatformManualPaymentConfig {
  gcash: {
    enabled: boolean;
    accountName: string;
    accountNumber: string;
    instructions: string;
    qrImageUrl?: string;
  };
  maya: {
    enabled: boolean;
    accountName: string;
    accountNumber: string;
    instructions: string;
    qrImageUrl?: string;
  };
  bankTransfer: {
    enabled: boolean;
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchOrSwift?: string;
    instructions: string;
  };
  paypal: {
    enabled: boolean;
    email: string;
    paymentLink?: string;
    instructions: string;
  };
  wise: {
    enabled: boolean;
    emailOrTag: string;
    instructions: string;
  };
}

export interface PlatformSettings {
  platformName: string;
  ownerName: string;
  ownerEmail: string;
  supportEmail: string;
  billingMode: 'manual_only' | 'hybrid' | 'automated';
  manualPaymentInstructions: PlatformManualPaymentConfig;
  plans: PlanFeatureConfig[];
  futureStripeIntegration: {
    enabled: boolean;
    publishableKey?: string;
    webhookConfigured: boolean;
    testMode: boolean;
  };
  allowSelfRegistrationWaitlist: boolean;
}

export interface AccessRequest {
  id: string;
  fullName: string;
  email: string;
  businessName?: string;
  planId?: TenantPlanTier;
  billingCycle?: 'monthly' | 'annual';
  currency?: 'USD' | 'PHP';
  amount?: number;
  paymentMethod?: ManualPaymentMethod;
  referenceNumber?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedAt?: string;
  rejectedReason?: string;
}
