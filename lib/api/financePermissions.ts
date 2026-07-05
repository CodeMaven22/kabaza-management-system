import { UserProfile, UserRole } from './authService';

/**
 * Finance Module Role-Based Access Control
 * Implements role permissions as defined in Django backend
 */

export const FINANCE_ROLES = {
  REVENUE_OFFICER: ['REVENUE_OFFICER', 'REVENUE_COLLECTOR'],
  FINANCE_STAFF: ['ACCOUNTS_ASSISTANT', 'REVENUE_OFFICER', 'CHIEF_EXECUTIVE', 'ICT_OFFICER'],
  ICT_OFFICER: ['ICT_OFFICER', 'CHIEF_EXECUTIVE'],
} as const;

export interface FinancePermissions {
  canCreatePayment: boolean;
  canEditPayment: boolean;
  canReversePayment: boolean;
  canCreateFine: boolean;
  canEditFine: boolean;
  canConfiscateVehicle: boolean;
  canGenerateReceipt: boolean;
  canDownloadReceipt: boolean;
  canVerifyVehicle: boolean;
  canViewAnalytics: boolean;
  canViewAuditLog: boolean;
  canExportData: boolean;
}

/**
 * Check if user can perform revenue office operations
 */
export function isRevenueOffice(user: UserProfile | null): boolean {
  if (!user) return false;
  return FINANCE_ROLES.REVENUE_OFFICER.includes(user.role);
}

/**
 * Check if user is finance staff
 */
export function isFinanceStaff(user: UserProfile | null): boolean {
  if (!user) return false;
  return FINANCE_ROLES.FINANCE_STAFF.includes(user.role);
}

/**
 * Check if user is ICT officer
 */
export function isICTOfficer(user: UserProfile | null): boolean {
  if (!user) return false;
  return user.role === 'ICT_OFFICER' || user.role === 'CHIEF_EXECUTIVE';
}

/**
 * Get all finance permissions for a user
 */
export function getFinancePermissions(user: UserProfile | null): FinancePermissions {
  if (!user) {
    return {
      canCreatePayment: false,
      canEditPayment: false,
      canReversePayment: false,
      canCreateFine: false,
      canEditFine: false,
      canConfiscateVehicle: false,
      canGenerateReceipt: false,
      canDownloadReceipt: false,
      canVerifyVehicle: false,
      canViewAnalytics: false,
      canViewAuditLog: false,
      canExportData: false,
    };
  }

  const isRevenue = isRevenueOffice(user);
  const isFinance = isFinanceStaff(user);
  const isICT = isICTOfficer(user);

  return {
    // Revenue operations
    canCreatePayment: isRevenue || isFinance,
    canEditPayment: isRevenue || isFinance,
    canReversePayment: isRevenue || (isFinance && user.role === 'CHIEF_EXECUTIVE'),
    canCreateFine: isRevenue || isFinance,
    canEditFine: isRevenue || isFinance,
    canConfiscateVehicle: isRevenue,
    
    // Receipt operations
    canGenerateReceipt: isFinance,
    canDownloadReceipt: isFinance || isRevenue,
    
    // Verification
    canVerifyVehicle: isRevenue || isFinance || isICT,
    
    // Analytics & Reporting
    canViewAnalytics: isFinance,
    canViewAuditLog: isICT || (isFinance && user.role === 'CHIEF_EXECUTIVE'),
    canExportData: isICT || (isFinance && user.role === 'CHIEF_EXECUTIVE'),
  };
}

/**
 * Check if user can perform a specific action
 */
export function canPerformAction(user: UserProfile | null, action: keyof FinancePermissions): boolean {
  const permissions = getFinancePermissions(user);
  return permissions[action];
}
