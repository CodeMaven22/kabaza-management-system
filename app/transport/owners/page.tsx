'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { TransportLayout } from '@/components/shared/TransportLayout';
import { OwnersListEnhanced } from '@/components/transport/OwnersListEnhanced';

function OwnersContent() {
  return (
    <TransportLayout currentPage="owners">
      <OwnersListEnhanced />
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
