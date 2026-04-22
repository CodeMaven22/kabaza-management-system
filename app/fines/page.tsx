'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FinesManagement } from '@/components/fines/FinesManagement';

function FinesContent() {
  return (
    <DashboardLayout currentPage="fines">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fines Management</h1>
          <p className="text-gray-600 mt-2">Issue and track bike operation fines</p>
        </div>

        <FinesManagement />
      </div>
    </DashboardLayout>
  );
}

export default function FinesPage() {
  return (
    <ProtectedRoute>
      <FinesContent />
    </ProtectedRoute>
  );
}
