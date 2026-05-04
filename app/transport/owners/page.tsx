'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TransportLayout } from '@/components/TransportLayout';
import { OwnerRegistrationForm } from '@/components/owners/OwnerRegistrationForm';
import { OwnersList } from '@/components/owners/OwnersList';
import { mockOwners } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { OwnerFormData } from '@/lib/types';

function OwnersContent() {
  const [showForm, setShowForm] = useState(false);

  const handleOwnerSubmit = (formData: OwnerFormData) => {
    console.log('[v0] Owner registration submitted:', formData);
    alert('Owner registered successfully!');
    setShowForm(false);
  };

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
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Register New Owner</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <OwnerRegistrationForm onSubmit={handleOwnerSubmit} />
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
