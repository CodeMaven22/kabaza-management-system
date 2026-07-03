import { useAuth } from '@/lib/authContext';
import { UserRole } from '@/lib/api/authService';

// Define role-based permissions
const rolePermissions: Record<UserRole, string[]> = {
  CHIEF_EXECUTIVE: ['view_all', 'manage_users', 'manage_system', 'audit_logs'],
  DIRECTOR_OF_ADMINISTRATION: ['view_all', 'manage_users', 'audit_logs'],
  ICT_OFFICER: ['view_all', 'manage_system', 'manage_users'],
  FINANCE_OFFICER: ['view_finance', 'manage_payments', 'manage_fines', 'view_reports'],
  REVENUE_OFFICER: ['view_finance', 'manage_fines', 'view_reports'],
  REVENUE_COLLECTOR: ['collect_payments', 'view_fines'],
  REGISTRATION_OFFICER: ['register_bikes', 'register_owners', 'register_operators'],
  ACCOUNTS_ASSISTANT: ['view_finance', 'manage_payments'],
  TRAFFIC_OFFICER: ['view_all', 'verify_bikes'],
};

/**
 * Hook for checking user permissions based on role
 */
export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const permissions = rolePermissions[user.role] || [];
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((perm) => hasPermission(perm));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((perm) => hasPermission(perm));
  };

  const isAdmin = (): boolean => {
    return user?.role === 'CHIEF_EXECUTIVE' || user?.role === 'DIRECTOR_OF_ADMINISTRATION';
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    userRole: user?.role,
  };
}
