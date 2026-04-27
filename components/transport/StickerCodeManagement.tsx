'use client';

import { useState } from 'react';
import { StickerCode, Bike } from '@/lib/types';
import { mockStickerCodes, mockBikes } from '@/lib/mockData';
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
import { Search, Plus, Eye, Trash2, QrCode } from 'lucide-react';

export function StickerCodeManagement() {
  const [stickerCodes, setStickerCodes] = useState<StickerCode[]>(mockStickerCodes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCode, setSelectedCode] = useState<StickerCode | null>(null);
  const [newCode, setNewCode] = useState({
    bikeId: '',
  });

  const filteredCodes = stickerCodes.filter(
    (code) =>
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.bikeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateCode = () => {
    if (!newCode.bikeId) {
      alert('Please select a bike');
      return;
    }

    const bike = mockBikes.find((b) => b.id === newCode.bikeId);
    if (!bike) return;

    const nextNumber = stickerCodes.length + 1;
    const codeNum = String(nextNumber).padStart(6, '0');
    const code: StickerCode = {
      id: `STK${String(stickerCodes.length + 1).padStart(3, '0')}`,
      bikeId: newCode.bikeId,
      code: `MH-K-${codeNum}`,
      issuedDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      verificationCount: 0,
    };

    setStickerCodes([code, ...stickerCodes]);
    setNewCode({ bikeId: '' });
    setShowForm(false);
    alert(`Sticker code ${code.code} generated successfully!`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this sticker code?')) {
      setStickerCodes(stickerCodes.filter((c) => c.id !== id));
    }
  };

  const availableBikes = mockBikes.filter((b) => !stickerCodes.find((c) => c.bikeId === b.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sticker Code Management</h2>
          <p className="text-gray-600">Generate and track sticker codes for bike verification</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={18} />
          Generate Code
        </Button>
      </div>

      {/* Generate Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Generate New Sticker Code</CardTitle>
            <CardDescription>Create a new MH-K format sticker code for a bike</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bikeId">Select Bike *</Label>
              <Select value={newCode.bikeId} onValueChange={(value) => setNewCode({ bikeId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a bike" />
                </SelectTrigger>
                <SelectContent>
                  {availableBikes.map((bike) => (
                    <SelectItem key={bike.id} value={bike.id}>
                      {bike.registrationNumber} - {bike.make} {bike.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleGenerateCode} variant="default">
                Generate Sticker Code
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
          placeholder="Search by code or bike ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Details Modal */}
      {selectedCode && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <QrCode size={24} />
                  {selectedCode.code}
                </CardTitle>
                <CardDescription>Sticker Code Details</CardDescription>
              </div>
              <Button
                onClick={() => setSelectedCode(null)}
                variant="ghost"
                className="text-gray-500"
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Code</p>
                <p className="font-semibold text-lg">{selectedCode.code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  selectedCode.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedCode.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Issued Date</p>
                <p className="font-semibold">{selectedCode.issuedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expiry Date</p>
                <p className="font-semibold">{selectedCode.expiryDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Verification Count</p>
                <p className="font-semibold">{selectedCode.verificationCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bike ID</p>
                <p className="font-semibold">{selectedCode.bikeId}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sticker Codes List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Sticker Codes ({filteredCodes.length})</h3>
        <div className="grid gap-4">
          {filteredCodes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No sticker codes found</p>
              </CardContent>
            </Card>
          ) : (
            filteredCodes.map((code) => {
              const bike = mockBikes.find((b) => b.id === code.bikeId);
              return (
                <Card key={code.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <QrCode size={20} className="text-blue-600" />
                          <p className="font-semibold text-lg">{code.code}</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            code.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {code.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {bike?.registrationNumber} - {bike?.make} {bike?.model}
                        </p>
                        <p className="text-xs text-gray-500">
                          Issued: {code.issuedDate} | Expires: {code.expiryDate} | Verifications: {code.verificationCount}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedCode(code)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Eye size={16} />
                          View
                        </Button>
                        <Button
                          onClick={() => handleDelete(code.id)}
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                        >
                          <Trash2 size={16} />
                          Delete
                        </Button>
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
