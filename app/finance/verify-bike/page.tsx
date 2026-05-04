'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FinanceLayout } from '@/components/FinanceLayout';
import { BikeVerification } from '@/components/finance/BikeVerification';

function VerifyBikeContent() {
  return (
    <FinanceLayout currentPage="verify-bike">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bike Verification</h1>
          <p className="text-gray-600 mt-2">Verify bike registration status using QR code or sticker code</p>
        </div>
        <BikeVerification />
      </div>
    </FinanceLayout>
  );
}

export default function VerifyBikePage() {
  return (
    <ProtectedRoute>
      <VerifyBikeContent />
    </ProtectedRoute>
  );
}
