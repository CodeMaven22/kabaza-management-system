'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { FinanceLayout } from '@/components/shared/FinanceLayout';
import { ReceiptManagement } from '@/components/receipts/ReceiptManagement';

function ReceiptsContent() {
  return (
    <FinanceLayout currentPage="receipts">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Receipts Management</h1>
          <p className="text-gray-600 mt-2">Generate and track payment receipts</p>
        </div>
        <ReceiptManagement />
      </div>
    </FinanceLayout>
  );
}

export default function ReceiptsPage() {
  return (
    <ProtectedRoute>
      <ReceiptsContent />
    </ProtectedRoute>
  );
}
