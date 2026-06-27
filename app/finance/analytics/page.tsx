'use client';

import { FinanceLayout } from '@/components/shared/FinanceLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { AnalyticsDashboard } from '@/components/finance/AnalyticsDashboard';

function AnalyticsPage() {
  return (
    <FinanceLayout currentPage="analytics">
      <AnalyticsDashboard />
    </FinanceLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <AnalyticsPage />
    </ProtectedRoute>
  );
}
