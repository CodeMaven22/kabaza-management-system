'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FinanceLayout } from '@/components/FinanceLayout';
import { FineManagementFinance } from '@/components/finance/FineManagementFinance';

function FinesContent() {
  return (
    <FinanceLayout currentPage="fines">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fines Management</h1>
          <p className="text-gray-600 mt-2">Issue fines, track payments, and manage violations</p>
        </div>
        <FineManagementFinance />
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
