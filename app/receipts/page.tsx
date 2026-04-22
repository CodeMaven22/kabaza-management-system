'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ReceiptManagement } from '@/components/receipts/ReceiptManagement';

function ReceiptsContent() {
  return (
    <DashboardLayout currentPage="receipts">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Receipts</h1>
          <p className="text-gray-600 mt-2">Manage payment receipts for bike registrations</p>
        </div>

        <ReceiptManagement />
      </div>
    </DashboardLayout>
  );
}

export default function ReceiptsPage() {
  return (
    <ProtectedRoute>
      <ReceiptsContent />
    </ProtectedRoute>
  );
}
