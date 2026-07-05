'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { TransportLayout } from '@/components/shared/TransportLayout';
import { PersonManagementEnhanced } from '@/components/transport/PersonManagementEnhanced';

function PersonsContent() {
  return (
    <TransportLayout currentPage="persons">
      <PersonManagementEnhanced />
    </TransportLayout>
  );
}

export default function PersonsPage() {
  return (
    <ProtectedRoute requiredRole="REGISTRATION_OFFICER">
      <PersonsContent />
    </ProtectedRoute>
  );
}
