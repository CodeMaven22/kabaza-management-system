'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { FinanceLayout } from '@/components/shared/FinanceLayout';
import { PaymentManagementEnhanced } from '@/components/finance/PaymentManagementEnhanced';

function PaymentsContent() {
  return (
    <FinanceLayout currentPage="payments">
      <PaymentManagementEnhanced />
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
