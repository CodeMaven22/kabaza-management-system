'use client';

import { SystemLayout } from '@/components/SystemLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UsersManagement } from '@/components/system/UsersManagement';

function UsersPage() {
  return (
    <SystemLayout currentPage="users">
      <UsersManagement />
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
