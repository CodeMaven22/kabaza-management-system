'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { TransportLayout } from '@/components/shared/TransportLayout';
import { VehiclesListEnhanced } from '@/components/transport/VehiclesListEnhanced';

function BikesContent() {
  return (
    <TransportLayout currentPage="bikes">
      <VehiclesListEnhanced />
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
