'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserManagement } from '@/components/users/UserManagement';

function UsersContent() {
  return (
    <DashboardLayout currentPage="users">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users & Roles Management</h1>
          <p className="text-gray-600 mt-2">Manage system users and assign roles</p>
        </div>

        <UserManagement />
      </div>
    </DashboardLayout>
  );
}

export default function UsersPage() {
  return (
    <ProtectedRoute>
      <UsersContent />
    </ProtectedRoute>
  );
}
