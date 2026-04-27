'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FinanceLayout } from '@/components/FinanceLayout';
import { FinesManagement } from '@/components/fines/FinesManagement';

function FinesContent() {
  return (
    <FinanceLayout currentPage="fines">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fines Management</h1>
          <p className="text-gray-600 mt-2">Track and manage fines in MWK</p>
        </div>
        <FinesManagement />
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
