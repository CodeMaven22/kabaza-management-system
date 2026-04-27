'use client';

import { TransportLayout } from '@/components/TransportLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { VerificationSystem } from '@/components/transport/VerificationSystem';

function VerificationPage() {
  return (
    <TransportLayout currentPage="verification">
      <VerificationSystem />
    </TransportLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <VerificationPage />
    </ProtectedRoute>
  );
}
