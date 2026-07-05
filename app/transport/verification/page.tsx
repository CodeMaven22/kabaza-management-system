'use client';

import { TransportLayout } from '@/components/shared/TransportLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { VehicleVerificationEnhanced } from '@/components/finance/VehicleVerificationEnhanced';

function VerificationContent() {
  return (
    <TransportLayout currentPage="verification">
      <VehicleVerificationEnhanced />
    </TransportLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <VerificationContent />
    </ProtectedRoute>
  );
}
