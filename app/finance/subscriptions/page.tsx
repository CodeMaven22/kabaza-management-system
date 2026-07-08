'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { FinanceLayout } from '@/components/shared/FinanceLayout';
import { SubscriptionManagementEnhanced } from '@/components/finance/SubscriptionManagementEnhanced';

function SubscriptionsContent() {
  return (
    <FinanceLayout currentPage="subscriptions">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions & Payments</h1>
          <p className="text-gray-600 mt-2">Manage active and expired vehicle subscriptions with payment tracking</p>
        </div>
        <SubscriptionManagementEnhanced />
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
