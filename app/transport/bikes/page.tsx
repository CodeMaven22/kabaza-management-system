'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TransportLayout } from '@/components/TransportLayout';
import { BikesList } from '@/components/bikes/BikesList';
import { mockBikes, mockOwners, mockOperators } from '@/lib/mockData';

function BikesContent() {
  return (
    <TransportLayout currentPage="bikes">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bike Registration</h1>
          <p className="text-gray-600 mt-2">Manage registered bikes and their information</p>
        </div>
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
