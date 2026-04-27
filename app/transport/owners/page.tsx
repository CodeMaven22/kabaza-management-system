'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TransportLayout } from '@/components/TransportLayout';
import { OwnersList } from '@/components/owners/OwnersList';
import { mockOwners } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

function OwnersContent() {
  const [showForm, setShowForm] = useState(false);

  return (
    <TransportLayout currentPage="owners">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bike Owners</h1>
            <p className="text-gray-600 mt-2">Manage bike owners and their registrations</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus size={18} />
            Add Owner
          </Button>
        </div>
        {showForm && (
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900">Owner registration form will appear here</p>
          </div>
        )}
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
