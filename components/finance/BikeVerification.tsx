'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { QrCode, Barcode, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { mockBikes, mockOwners, mockOperators, mockSubscriptions, mockFines } from '@/lib/mockData';
import { BikeVerificationResponse } from '@/lib/types';

export function BikeVerification() {
  const [verificationMethod, setVerificationMethod] = useState<'qr' | 'sticker'>('qr');
  const [inputValue, setInputValue] = useState('');
  const [verificationResult, setVerificationResult] = useState<BikeVerificationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateStickerCode = (code: string): boolean => {
    const stickerPattern = /^MH-K-\d{6}$/;
    return stickerPattern.test(code);
  };

  const handleVerification = async () => {
    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let bike = null;

      if (verificationMethod === 'qr') {
        bike = mockBikes.find((b) => b.qrCode === inputValue);
      } else {
        if (!validateStickerCode(inputValue)) {
          setError('Invalid sticker code format. Expected format: MH-K-XXXXXX');
          setLoading(false);
          return;
        }
        bike = mockBikes.find((b) => b.stickerCode === inputValue);
      }

      if (!bike) {
        setError(`No bike found with the provided ${verificationMethod === 'qr' ? 'QR code' : 'sticker code'}`);
        setLoading(false);
        return;
      }

      const owner = mockOwners.find((o) => o.id === bike!.ownerId);
      const operator = mockOperators.find((op) => op.id === bike!.operatorId);
      const subscription = mockSubscriptions.find((s) => s.bikeId === bike!.id);
      const bikeFines = mockFines.filter((f) => f.bikeId === bike!.id && f.status === 'unpaid');

      const subscriptionStatus = subscription?.status || 'expired';
      const isConfiscated = bike.status === 'confiscated';

      // Check if subscription expired - trigger confiscation
      if (subscriptionStatus === 'expired' && !isConfiscated) {
        console.log('[v0] Subscription expired - bike should be confiscated');
      }

      const result: BikeVerificationResponse = {
        bikeId: bike.id,
        registrationNumber: bike.registrationNumber,
        owner: {
          id: owner?.id || '',
          fullName: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown',
        },
        operator: {
          id: operator?.id || '',
          fullName: operator ? `${operator.firstName} ${operator.lastName}` : 'Unknown',
        },
        color: bike.color,
        subscriptionStatus,
        subscriptionEndDate: subscription?.subscriptionEndDate || '',
        fines: {
          unpaidCount: bikeFines.length,
          totalAmount: bikeFines.reduce((sum, f) => sum + f.amount, 0),
        },
        status: isConfiscated ? 'confiscated' : subscriptionStatus === 'expired' ? 'failed' : 'verified',
        message: isConfiscated
          ? 'Bike is confiscated. Contact authorities.'
          : subscriptionStatus === 'expired'
            ? 'Subscription expired. Bike cannot operate.'
            : 'Bike verification successful.',
      };

      setVerificationResult(result);
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setVerificationResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bike Verification</CardTitle>
          <CardDescription>Verify bike registration using QR code or sticker code</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={verificationMethod} onValueChange={(val) => setVerificationMethod(val as 'qr' | 'sticker')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr" className="gap-2">
                <QrCode size={18} />
                QR Code
              </TabsTrigger>
              <TabsTrigger value="sticker" className="gap-2">
                <Barcode size={18} />
                Sticker Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Scan QR Code</label>
                <Input
                  placeholder="Paste QR code data here"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerification()}
                />
              </div>
            </TabsContent>

            <TabsContent value="sticker" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sticker Code (Format: MH-K-XXXXXX)</label>
                <Input
                  placeholder="e.g., MH-K-000001"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerification()}
                />
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 flex gap-3">
            <Button onClick={handleVerification} disabled={!inputValue || loading} className="flex-1">
              {loading ? 'Verifying...' : 'Verify Bike'}
            </Button>
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {verificationResult && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{verificationResult.registrationNumber}</CardTitle>
                <CardDescription>{verificationResult.owner.fullName}</CardDescription>
              </div>
              {verificationResult.status === 'verified' ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle size={16} className="mr-1" />
                  Verified
                </Badge>
              ) : verificationResult.status === 'confiscated' ? (
                <Badge className="bg-red-100 text-red-800">
                  <AlertTriangle size={16} className="mr-1" />
                  Confiscated
                </Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800">
                  <Clock size={16} className="mr-1" />
                  Expired
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Color</p>
                <p className="text-sm font-semibold">{verificationResult.color}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Operator</p>
                <p className="text-sm font-semibold">{verificationResult.operator.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Subscription Status</p>
                <Badge variant={verificationResult.subscriptionStatus === 'active' ? 'default' : 'destructive'}>
                  {verificationResult.subscriptionStatus}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500">Subscription End</p>
                <p className="text-sm font-semibold">{verificationResult.subscriptionEndDate}</p>
              </div>
            </div>

            {verificationResult.fines.unpaidCount > 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  {verificationResult.fines.unpaidCount} unpaid fine(s) totaling MWK{' '}
                  {verificationResult.fines.totalAmount.toLocaleString()}
                </AlertDescription>
              </Alert>
            )}

            <Alert className={verificationResult.status === 'verified' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertDescription className={verificationResult.status === 'verified' ? 'text-green-800' : 'text-red-800'}>
                {verificationResult.message}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
