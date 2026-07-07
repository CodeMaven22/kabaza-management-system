'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { financeService } from '@/lib/api/financeService';
import { Badge } from '@/components/ui/badge';

interface VerificationResult {
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
  };
}

export function VehicleVerificationForm() {
  const [stickerCode, setStickerCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stickerCode.trim()) {
      setError('Sticker code is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      const result = await financeService.verifyVehicle('STICKER_CODE', stickerCode.trim());
      setVerificationResult(result as VerificationResult);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify vehicle';
      setError(message);
      setVerificationResult(null);
      console.error('[v0] Verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'valid':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'invalid':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'expired':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'invalid':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (isPaid: boolean) => {
    return isPaid ? 'Paid' : 'Not Paid';
  };

  const getPaymentStatusColor = (isPaid: boolean) => {
    return isPaid ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Vehicle Verification</h2>
        <p className="text-gray-600 mt-1">Verify vehicle registration status and payment</p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Verify by Sticker Code</CardTitle>
          <CardDescription>Enter the vehicle sticker code to check registration status</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="sticker-code" className="sr-only">
                Sticker Code
              </label>
              <Input
                id="sticker-code"
                type="text"
                placeholder="e.g., MH-KMKK5"
                value={stickerCode}
                onChange={(e) => setStickerCode(e.target.value.toUpperCase())}
                disabled={isLoading}
                className="uppercase"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !stickerCode.trim()}
              className="px-6"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mt-4" role="alert">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Results */}
      {hasSearched && verificationResult && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(verificationResult.status)}
                <div>
                  <CardTitle>Verification Result</CardTitle>
                  <CardDescription>Status for {verificationResult.data?.sticker_code}</CardDescription>
                </div>
              </div>
              <Badge className={getStatusColor(verificationResult.status)}>
                {verificationResult.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Status */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <Badge className={getStatusColor(verificationResult.status)}>
                  {verificationResult.status.charAt(0).toUpperCase() + verificationResult.status.slice(1)}
                </Badge>
              </div>

              {/* Payment Status */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Payment Status</p>
                <Badge className={getPaymentStatusColor(verificationResult.is_paid)}>
                  {getPaymentStatusText(verificationResult.is_paid)}
                </Badge>
              </div>

              {/* Fine Status */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Fine Created</p>
                <Badge className={verificationResult.fine_created ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                  {verificationResult.fine_created ? 'Yes' : 'No'}
                </Badge>
              </div>

              {/* Days Remaining */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Days Remaining</p>
                <p className="text-2xl font-bold text-gray-900">{verificationResult.days_remaining}</p>
              </div>
            </div>

            {/* Vehicle Details */}
            {verificationResult.data && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Vehicle Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Sticker Code</p>
                    <p className="font-mono font-semibold text-gray-900">{verificationResult.data.sticker_code}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Vehicle Type</p>
                    <p className="font-medium text-gray-900">{verificationResult.data.vehicle_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Color</p>
                    <p className="font-medium text-gray-900">{verificationResult.data.color || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Owner</p>
                    <p className="font-medium text-gray-900">{verificationResult.data.owner}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Operator</p>
                    <p className="font-medium text-gray-900">{verificationResult.data.operator}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Registration Status</p>
                    <Badge className={verificationResult.data.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {verificationResult.data.status.charAt(0).toUpperCase() + verificationResult.data.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t pt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStickerCode('');
                  setVerificationResult(null);
                  setHasSearched(false);
                  setError(null);
                }}
              >
                Clear
              </Button>
              {verificationResult.data?.qr_sticker_pdf && (
                <Button
                  variant="default"
                  onClick={() => {
                    window.open(verificationResult.data?.qr_sticker_pdf, '_blank');
                  }}
                >
                  Download PDF
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {hasSearched && !verificationResult && !error && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No results found for the entered sticker code</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
