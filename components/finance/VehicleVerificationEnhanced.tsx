'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Search, CheckCircle, XCircle, Loader } from 'lucide-react';
import { financeService, Verification } from '@/lib/api/financeService';

export function VehicleVerificationEnhanced() {
  const [queryType, setQueryType] = useState<'QR_CODE' | 'STICKER_CODE'>('QR_CODE');
  const [queryValue, setQueryValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verification, setVerification] = useState<Verification | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!queryValue.trim()) {
      setError('Please enter a code to verify');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await financeService.verifyVehicle(queryType, queryValue);
      setVerification(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setError(message);
      setVerification(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQueryValue('');
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
          <CardTitle>Enter Verification Code</CardTitle>
          <CardDescription>
            Scan or enter the QR code or sticker code to verify vehicle information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Query Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="QR_CODE"
                    checked={queryType === 'QR_CODE'}
                    onChange={(e) => setQueryType(e.target.value as 'QR_CODE' | 'STICKER_CODE')}
                    className="h-4 w-4"
                  />
                  <span>QR Code</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="STICKER_CODE"
                    checked={queryType === 'STICKER_CODE'}
                    onChange={(e) => setQueryType(e.target.value as 'QR_CODE' | 'STICKER_CODE')}
                    className="h-4 w-4"
                  />
                  <span>Sticker Code</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-gray-700">
                Code
              </label>
              <Input
                id="code"
                type="text"
                placeholder={queryType === 'QR_CODE' ? 'Scan QR code...' : 'Enter sticker code...'}
                value={queryValue}
                onChange={(e) => setQueryValue(e.target.value)}
                disabled={isLoading}
                autoFocus
                className="text-lg"
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
      {verification && (
        <div className={`border rounded-lg p-6 ${verification.vehicle_found ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start gap-4">
            {verification.vehicle_found ? (
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            )}
            <div className="flex-1">
              <h3 className={`text-lg font-bold ${verification.vehicle_found ? 'text-green-900' : 'text-red-900'}`}>
                {verification.vehicle_found ? 'Vehicle Found' : 'Vehicle Not Found'}
              </h3>

              {verification.vehicle_found && (
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Registration Number</p>
                    <p className="font-semibold text-gray-900">{verification.registration_number}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Owner Name</p>
                    <p className="font-semibold text-gray-900">{verification.owner_name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Vehicle Status</p>
                    <Badge className={verification.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {verification.status}
                    </Badge>
                  </div>

                  {verification.outstanding_fines ? (
                    <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                      <p className="text-sm text-red-900">
                        <span className="font-bold">Outstanding Fines: </span>
                        MWK {verification.outstanding_fines.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                      <p className="text-sm text-green-900">No outstanding fines</p>
                    </div>
                  )}

                  {verification.last_payment && (
                    <div>
                      <p className="text-sm text-gray-600">Last Payment</p>
                      <p className="text-gray-900">{new Date(verification.last_payment).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
