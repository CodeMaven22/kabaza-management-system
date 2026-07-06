'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { TransportLayout } from '@/components/shared/TransportLayout';
import { VehicleManagementEnhanced } from '@/components/transport/VehicleManagementEnhanced';

function VehiclesContent() {
  return (
    <TransportLayout currentPage="vehicles">
      <VehicleManagementEnhanced />
    </TransportLayout>
  );
}

export default function VehiclesPage() {
  return (
    <ProtectedRoute requiredRole="REGISTRATION_OFFICER">
      <VehiclesContent />
    </ProtectedRoute>
  );
}
