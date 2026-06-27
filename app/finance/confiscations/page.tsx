'use client';

import { FinanceLayout } from '@/components/shared/FinanceLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { ConfiscationManagement } from '@/components/finance/ConfiscationManagement';

function ConfiscationsPage() {
  return (
    <FinanceLayout currentPage="confiscations">
      <ConfiscationManagement />
    </FinanceLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <ConfiscationsPage />
    </ProtectedRoute>
  );
}
