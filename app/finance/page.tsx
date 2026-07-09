'use client';

import { FinanceLayout } from '@/components/shared/FinanceLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Redirect } from '@/components/ui/redirect';

function FinanceDashboard() {
  return (
    <FinanceLayout currentPage="dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Domain</h1>
          <p className="text-gray-600 mt-2">Manage payments, subscriptions, and fines</p>
        </div>

        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Navigate using the sidebar to access specific finance features.</p>
          <p className="text-sm text-gray-500">Select Payments, Subscriptions, Fines, or Verification from the menu.</p>
        </div>
      </div>
    </FinanceLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <FinanceDashboard />
    </ProtectedRoute>
  );
}
