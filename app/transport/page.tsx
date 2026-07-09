'use client';

import { TransportLayout } from '@/components/shared/TransportLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

function TransportDashboard() {
  return (
    <TransportLayout currentPage="dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transport Domain</h1>
          <p className="text-gray-600 mt-2">Vehicle registration, owners, and operators management</p>
        </div>

        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Navigate using the sidebar to access specific transport features.</p>
          <p className="text-sm text-gray-500">Select Vehicles, Persons, or Verification from the menu.</p>
        </div>
      </div>
    </TransportLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <TransportDashboard />
    </ProtectedRoute>
  );
}
