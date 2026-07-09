'use client';

import { SystemLayout } from '@/components/shared/SystemLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

function SystemDashboard() {
  return (
    <SystemLayout currentPage="dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
          <p className="text-gray-600 mt-2">User management, roles, and system settings</p>
        </div>

        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Navigate using the sidebar to access system features.</p>
          <p className="text-sm text-gray-500">Select Users, Roles, or other options from the menu.</p>
        </div>
      </div>
    </SystemLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <SystemDashboard />
    </ProtectedRoute>
  );
}
