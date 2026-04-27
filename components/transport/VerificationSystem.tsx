'use client';

import { useState } from 'react';
import { Verification, Bike } from '@/lib/types';
import { mockVerifications, mockBikes, mockStickerCodes, mockUsers } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, CheckCircle, AlertCircle } from 'lucide-react';

export function VerificationSystem() {
  const [verifications, setVerifications] = useState<Verification[]>(mockVerifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [verificationType, setVerificationType] = useState<'qr_scan' | 'sticker_scan' | 'manual_entry'>('qr_scan');
  const [bikeInput, setBikeInput] = useState('');

  const filteredVerifications = verifications.filter(
    (v) =>
      v.bikeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.verifiedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerify = () => {
    if (!bikeInput.trim()) {
      alert('Please enter or select a bike');
      return;
    }

    const bike = mockBikes.find(
      (b) =>
        b.id === bikeInput ||
        b.registrationNumber.toLowerCase() === bikeInput.toLowerCase()
    );

    if (!bike) {
      alert('Bike not found in system');
      return;
    }

    const verification: Verification = {
      id: `VER${String(verifications.length + 1).padStart(3, '0')}`,
      bikeId: bike.id,
      type: verificationType,
      verifiedAt: new Date().toLocaleString(),
      verifiedBy: 'USR001', // Current user
      status: bike.status === 'active' ? 'verified' : 'failed',
      notes: `${verificationType} verification at checkpoint`,
    };

    setVerifications([verification, ...verifications]);
    setBikeInput('');
    setShowForm(false);
    alert(`Verification successful for ${bike.registrationNumber}`);
  };

  const successCount = verifications.filter((v) => v.status === 'verified').length;
  const failedCount = verifications.filter((v) => v.status === 'failed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Verification System</h2>
          <p className="text-gray-600">Verify bikes using QR, sticker, or manual entry</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={18} />
          New Verification
        </Button>
      </div>

      {/* Verification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Verifications</p>
                <p className="text-2xl font-bold">{verifications.length}</p>
              </div>
              <CheckCircle className="text-blue-600" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{successCount}</p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{failedCount}</p>
              </div>
              <AlertCircle className="text-red-600" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Perform Verification</CardTitle>
            <CardDescription>Verify a bike using QR code, sticker, or manual entry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="verificationType">Verification Type *</Label>
                <Select value={verificationType} onValueChange={(value: any) => setVerificationType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qr_scan">QR Code Scan</SelectItem>
                    <SelectItem value="sticker_scan">Sticker Scan</SelectItem>
                    <SelectItem value="manual_entry">Manual Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bikeInput">Bike Registration / ID *</Label>
                <Input
                  id="bikeInput"
                  placeholder="Enter bike registration number or ID"
                  value={bikeInput}
                  onChange={(e) => setBikeInput(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleVerify} variant="default">
                Verify Bike
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <Input
          placeholder="Search by bike ID or verified by..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Verification History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Verification History</h3>
        <div className="grid gap-4">
          {filteredVerifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No verifications found</p>
              </CardContent>
            </Card>
          ) : (
            filteredVerifications.map((verification) => {
              const bike = mockBikes.find((b) => b.id === verification.bikeId);
              const verifier = mockUsers.find((u) => u.id === verification.verifiedBy);
              return (
                <Card key={verification.id} className={verification.status === 'verified' ? 'border-green-200' : 'border-red-200'}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {verification.status === 'verified' ? (
                            <CheckCircle className="text-green-600" size={20} />
                          ) : (
                            <AlertCircle className="text-red-600" size={20} />
                          )}
                          <p className="font-semibold">{bike?.registrationNumber}</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            verification.status === 'verified'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {verification.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {bike?.make} {bike?.model}
                        </p>
                        <p className="text-xs text-gray-500">
                          Type: {verification.type} | Verified by: {verifier?.username} | At: {verification.verifiedAt}
                        </p>
                        {verification.notes && (
                          <p className="text-xs text-gray-600 mt-1">Note: {verification.notes}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
