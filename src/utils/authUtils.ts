import { UserAccount, UserRole, AuthSession, SystemActionLog } from '@/types';

// Web Crypto SHA-256 password hasher
export async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt + 'aedmin_secure_pepper_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Password Strength Evaluation
export interface PasswordStrength {
  score: number; // 0 to 4
  isValid: boolean;
  feedback: string[];
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('At least 8 characters required');

  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  else feedback.push('Mixed uppercase & lowercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('At least one numeric digit');

  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 1;
  else feedback.push('At least one special character (!@#$%^&*)');

  return {
    score,
    isValid: score >= 3 && password.length >= 8,
    feedback
  };
}

// Role Capabilities Matrix
export const ROLE_PERMISSIONS: Record<UserRole, {
  canManageUsers: boolean;
  canManageFinances: boolean;
  canManageClients: boolean;
  canEditClientBrief: boolean;
  canRunDriveAudit: boolean;
  canUseComposer: boolean;
  canExportBackup: boolean;
  canManageSOPs: boolean;
}> = {
  Owner: {
    canManageUsers: true,
    canManageFinances: true,
    canManageClients: true,
    canEditClientBrief: true,
    canRunDriveAudit: true,
    canUseComposer: true,
    canExportBackup: true,
    canManageSOPs: true
  },
  Administrator: {
    canManageUsers: true,
    canManageFinances: true,
    canManageClients: true,
    canEditClientBrief: true,
    canRunDriveAudit: true,
    canUseComposer: true,
    canExportBackup: true,
    canManageSOPs: true
  },
  'Operations Manager': {
    canManageUsers: false,
    canManageFinances: true,
    canManageClients: true,
    canEditClientBrief: true,
    canRunDriveAudit: true,
    canUseComposer: true,
    canExportBackup: false,
    canManageSOPs: true
  },
  'Executive Assistant': {
    canManageUsers: false,
    canManageFinances: false,
    canManageClients: true,
    canEditClientBrief: true,
    canRunDriveAudit: true,
    canUseComposer: true,
    canExportBackup: false,
    canManageSOPs: true
  },
  Contractor: {
    canManageUsers: false,
    canManageFinances: false,
    canManageClients: false,
    canEditClientBrief: false,
    canRunDriveAudit: false,
    canUseComposer: false,
    canExportBackup: false,
    canManageSOPs: false
  },
  'Read Only': {
    canManageUsers: false,
    canManageFinances: false,
    canManageClients: false,
    canEditClientBrief: false,
    canRunDriveAudit: false,
    canUseComposer: false,
    canExportBackup: false,
    canManageSOPs: false
  }
};

export const AUTH_STORAGE_KEYS = {
  SETUP_COMPLETED: 'aedmin_setup_completed_v1',
  USERS_LIST: 'aedmin_user_accounts_v1',
  CURRENT_SESSION: 'aedmin_current_session_v1',
  AUDIT_LOGS: 'aedmin_auth_audit_logs_v1',
  LOCKOUT_STORE: 'aedmin_auth_lockout_store_v1'
};
