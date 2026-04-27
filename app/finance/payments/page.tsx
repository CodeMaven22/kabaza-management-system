'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FinanceLayout } from '@/components/FinanceLayout';
import { PaymentTracker } from '@/components/payments/PaymentTracker';
import { mockPayments } from '@/lib/mockData';

function PaymentsContent() {
  return (
    <FinanceLayout currentPage="payments">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-2">Record and track payments in MWK</p>
        </div>
        <PaymentTracker />
      </div>
    </FinanceLayout>
  );
}

export default function PaymentsPage() {
  return (
    <ProtectedRoute>
      <PaymentsContent />
    </ProtectedRoute>
  );
}
