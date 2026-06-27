'use client';

import { SystemLayout } from '@/components/SystemLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UsersManagementEnhanced } from '@/components/system/UsersManagementEnhanced';

function UsersPage() {
  return (
    <SystemLayout currentPage="users">
      <UsersManagementEnhanced />
    </SystemLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <UsersPage />
    </ProtectedRoute>
  );
}
