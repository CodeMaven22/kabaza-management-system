'use client';

import { SystemLayout } from '@/components/SystemLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RolesManagement } from '@/components/system/RolesManagement';

function RolesPage() {
  return (
    <SystemLayout currentPage="roles">
      <RolesManagement />
    </SystemLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <RolesPage />
    </ProtectedRoute>
  );
}
