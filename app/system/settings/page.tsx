'use client';

import { SystemLayout } from '@/components/SystemLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SettingsManagement } from '@/components/system/SettingsManagement';

function SettingsPage() {
  return (
    <SystemLayout currentPage="settings">
      <SettingsManagement />
    </SystemLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  );
}
