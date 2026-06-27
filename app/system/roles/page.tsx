'use client';

import { SystemLayout } from '@/components/shared/SystemLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
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
