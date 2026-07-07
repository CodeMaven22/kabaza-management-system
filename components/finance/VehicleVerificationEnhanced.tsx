'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Search, CheckCircle, XCircle, Loader, Download } from 'lucide-react';
import { financeService } from '@/lib/api/financeService';

interface VerificationResponse {
  status: string;
  verification_method: string;
  is_paid: boolean;
  fine_created: boolean;
  fine_id?: number;
  days_remaining: number;
  data?: {
    id: number;
    sticker_code: string;
    vehicle_type: string;
    owner: string;
    operator: string;
    color?: string;
    status: string;
    is_paid: boolean;
    days_overdue?: number | null;
    qr_sticker_pdf?: string;
    qr_code?: string;
  };
}

export function VehicleVerificationEnhanced() {
  const [stickerCode, setStickerCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verification, setVerification] = useState<VerificationResponse | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stickerCode.trim()) {
      setError('Please enter a sticker code to verify');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await financeService.verifyVehicle('STICKER_CODE', stickerCode.trim());
      setVerification(result as VerificationResponse);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setError(message);
      setVerification(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStickerCode('');
    setError(null);
    setVerification(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Verification</h1>
        <p className="text-gray-600 mt-2">Verify vehicle registration and check for outstanding fines</p>
      </div>

      {/* Query Form */}
      <Card>
        <CardHeader>
          <CardTitle>Verify Vehicle by Sticker Code</CardTitle>
          <CardDescription>
            Enter the vehicle sticker code to check registration status and payment information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="sticker-code" className="text-sm font-medium text-gray-700">
                Sticker Code
              </label>
              <Input
                id="sticker-code"
                type="text"
                placeholder="e.g., MH-KMKK5"
                value={stickerCode}
                onChange={(e) => setStickerCode(e.target.value.toUpperCase())}
                disabled={isLoading}
                autoFocus
                className="text-lg uppercase font-mono"
              />
            </div>

            {error && (
              <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Verify Vehicle
                  </>
                )}
              </Button>
              {verification && (
                <Button type="button" variant="outline" onClick={handleReset}>
                  Clear
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Verification Results */}
      {verification && verification.data && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {verification.status === 'valid' ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
                <div>
                  <CardTitle>Verification Result</CardTitle>
                  <CardDescription>Status for {verification.data.sticker_code}</CardDescription>
                </div>
              </div>
              <Badge className={verification.status === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {verification.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Verification Status</p>
                <Badge className={verification.status === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                </Badge>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Payment Status</p>
                <Badge className={verification.is_paid ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                  {verification.is_paid ? 'Paid' : 'Not Paid'}
                </Badge>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Fine Status</p>
                <Badge className={verification.fine_created ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                  {verification.fine_created ? 'Yes' : 'No'}
                </Badge>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Days Remaining</p>
                <p className="text-2xl font-bold text-gray-900">{verification.days_remaining}</p>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Vehicle Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Sticker Code</p>
                  <p className="font-mono font-semibold text-gray-900">{verification.data.sticker_code}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Vehicle Type</p>
                  <p className="font-medium text-gray-900">{verification.data.vehicle_type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Color</p>
                  <p className="font-medium text-gray-900">{verification.data.color || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Owner</p>
                  <p className="font-medium text-gray-900">{verification.data.owner}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Operator/Driver</p>
                  <p className="font-medium text-gray-900">{verification.data.operator}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Registration Status</p>
                  <Badge className={verification.data.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {verification.data.status.charAt(0).toUpperCase() + verification.data.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-4 flex gap-2 flex-wrap">
              <Button variant="outline" onClick={handleReset}>
                Clear
              </Button>
              {verification.data.qr_sticker_pdf && (
                <Button
                  variant="default"
                  onClick={() => window.open(verification.data?.qr_sticker_pdf, '_blank')}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
