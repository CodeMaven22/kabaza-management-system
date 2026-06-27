'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { FinanceLayout } from '@/components/shared/FinanceLayout';
import { PaymentManagement } from '@/components/finance/PaymentManagement';

function SubscriptionsContent() {
  return (
    <FinanceLayout currentPage="subscriptions">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions & Payments</h1>
          <p className="text-gray-600 mt-2">Manage monthly bike subscriptions and process payments</p>
        </div>
        <PaymentManagement />
      </div>
    </FinanceLayout>
  );
}

export default function SubscriptionsPage() {
  return (
    <ProtectedRoute>
      <SubscriptionsContent />
    </ProtectedRoute>
  );
}
