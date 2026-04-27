'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TransportLayout } from '@/components/TransportLayout';
import { OwnersList } from '@/components/owners/OwnersList';
import { mockOwners } from '@/lib/mockData';

function OwnersContent() {
  return (
    <TransportLayout currentPage="owners">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bike Owners</h1>
          <p className="text-gray-600 mt-2">Manage bike owners and their registrations</p>
        </div>
        <OwnersList owners={mockOwners} />
      </div>
    </TransportLayout>
  );
}

export default function OwnersPage() {
  return (
    <ProtectedRoute>
      <OwnersContent />
    </ProtectedRoute>
  );
}
