'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TransportLayout } from '@/components/TransportLayout';
import { BikesList } from '@/components/bikes/BikesList';
import { mockBikes, mockOwners, mockOperators } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

function BikesContent() {
  const [showForm, setShowForm] = useState(false);

  return (
    <TransportLayout currentPage="bikes">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bike Registration</h1>
            <p className="text-gray-600 mt-2">Manage registered bikes and their information</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus size={18} />
            Add Bike
          </Button>
        </div>
        {showForm && (
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900">Bike registration form will appear here</p>
          </div>
        )}
        <BikesList bikes={mockBikes} owners={mockOwners} operators={mockOperators} />
      </div>
    </TransportLayout>
  );
}

export default function BikesPage() {
  return (
    <ProtectedRoute>
      <BikesContent />
    </ProtectedRoute>
  );
}
