'use client';

import { TransportLayout } from '@/components/shared/TransportLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { VerificationSystem } from '@/components/transport/VerificationSystem';

function VerificationContent() {
  return (
    <TransportLayout currentPage="verification">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bike Verification</h1>
          <p className="text-gray-600 mt-2">Verify bike registration status and information</p>
        </div>
        <VerificationSystem />
      </div>
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
