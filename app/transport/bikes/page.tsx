'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TransportLayout } from '@/components/TransportLayout';
import { BikeRegistrationForm } from '@/components/bikes/BikeRegistrationForm';
import { BikesList } from '@/components/bikes/BikesList';
import { BikeAnalytics } from '@/components/bikes/BikeAnalytics';
import { mockBikes, mockOwners, mockOperators } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Search } from 'lucide-react';
import { BikeFormData } from '@/lib/types';

function BikesContent() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBikes, setFilteredBikes] = useState(mockBikes);

  const handleBikeSubmit = (formData: BikeFormData) => {
    console.log('[v0] Bike registration submitted:', formData);
    alert('Bike registered successfully! QR and sticker codes will be auto-generated.');
    setShowForm(false);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockBikes.filter((bike) =>
      bike.stickerCode?.toLowerCase().includes(value.toLowerCase()) ||
      bike.registrationNumber.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBikes(filtered);
  };

  return (
    <TransportLayout currentPage="bikes">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bike Registration</h1>
            <p className="text-gray-600 mt-2">Manage registered bikes and their information</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus size={18} />
            Add Bike
          </Button>
        </div>

        {/* Analytics */}
        <BikeAnalytics bikes={mockBikes} />

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Register New Bike</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <BikeRegistrationForm operators={mockOperators} onSubmit={handleBikeSubmit} />
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by sticker code or registration number..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <BikesList bikes={filteredBikes} owners={mockOwners} operators={mockOperators} />
      </div>
    </TransportLayout>
  );
}

export default function BikesPage() {
  return (
    <ProtectedRoute>
      <BikesContent />
    </ProtectedRoute>
  );
}
