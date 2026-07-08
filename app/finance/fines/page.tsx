'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { FinanceLayout } from '@/components/shared/FinanceLayout';
import { FineManagementEnhancedTabs } from '@/components/finance/FineManagementEnhancedTabs';

function FinesContent() {
  return (
    <FinanceLayout currentPage="fines">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fines Management</h1>
          <p className="text-gray-600 mt-2">Track unpaid fines, paid fines, and confiscated vehicles</p>
        </div>
        <FineManagementEnhancedTabs />
      </div>
    </FinanceLayout>
  );
}

export default function FinesPage() {
  return (
    <ProtectedRoute>
      <FinesContent />
    </ProtectedRoute>
  );
}
