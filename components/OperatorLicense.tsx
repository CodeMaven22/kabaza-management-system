'use client';

import { OperatorLicense as OperatorLicenseType } from '@/lib/types';
import { QRCodeGenerator } from './QRCodeGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OperatorLicenseProps {
  license: OperatorLicenseType;
}

export function OperatorLicense({ license }: OperatorLicenseProps) {
  const isExpired = new Date(license.expiryDate) < new Date();
  const daysUntilExpiry = Math.ceil(
    (new Date(license.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Operating License</CardTitle>
            <p className="text-sm text-gray-600 mt-1">License #: {license.licenseNumber}</p>
          </div>
          <Badge
            variant={isExpired ? 'destructive' : daysUntilExpiry < 90 ? 'secondary' : 'default'}
            className="ml-auto"
          >
            {isExpired ? 'Expired' : daysUntilExpiry < 90 ? 'Expiring Soon' : 'Active'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* License Details */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">License Number</label>
              <p className="text-base font-semibold text-gray-900 mt-1">{license.licenseNumber}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Issue Date</label>
              <p className="text-base text-gray-900 mt-1">{license.issueDate}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Expiry Date</label>
              <p className="text-base text-gray-900 mt-1">{license.expiryDate}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <Badge className="mt-1" variant={isExpired ? 'destructive' : 'default'}>
                {license.status}
              </Badge>
            </div>

            {!isExpired && daysUntilExpiry < 90 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  This license will expire in {daysUntilExpiry} days. Please renew before expiration.
                </p>
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center">
            <h4 className="text-sm font-medium text-gray-600 mb-4">License QR Code</h4>
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
              <QRCodeGenerator
                value={license.licenseNumber}
                size={256}
              />
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Scan this QR code to verify the license
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
