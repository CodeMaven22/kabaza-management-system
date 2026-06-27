'use client';

import { TransportLayout } from '@/components/TransportLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BikeVerification } from '@/components/finance/BikeVerification';

function VerificationContent() {
  return (
    <TransportLayout currentPage="verification">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bike Verification</h1>
          <p className="text-gray-600 mt-2">Verify bike registration status using QR code or sticker code</p>
        </div>
        <BikeVerification />
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
