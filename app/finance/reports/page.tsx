'use client';

import { FinanceLayout } from '@/components/FinanceLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ReportsManagement } from '@/components/finance/ReportsManagement';

function ReportsPage() {
  return (
    <FinanceLayout currentPage="reports">
      <ReportsManagement />
    </FinanceLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <ReportsPage />
    </ProtectedRoute>
  );
}
