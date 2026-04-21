'use client';

import { useState, useMemo } from 'react';
import { Bike, PaymentFormData } from '@/lib/types';
import { mockBikes } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Search } from 'lucide-react';

export function EnhancedPaymentForm() {
  const [formData, setFormData] = useState<PaymentFormData>({
    bikeId: '',
    amount: 4000,
    paymentMethod: 'cash',
    description: '',
    paymentType: 'monthly',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filteredBikes = useMemo(
    () =>
      mockBikes.filter(
        (bike) =>
          bike.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bike.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bike.model.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  const selectedBike = mockBikes.find((b) => b.id === formData.bikeId);

  const handleBikeSelect = (bike: Bike) => {
    setFormData((prev) => ({
      ...prev,
      bikeId: bike.id,
    }));
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bikeId) {
      alert('Please select a bike');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        bikeId: '',
        amount: 4000,
        paymentMethod: 'cash',
        description: '',
        paymentType: 'monthly',
      });
      setSubmitted(false);
    }, 2000);
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-green-800">
            <CheckCircle className="h-6 w-6" />
            <div>
              <p className="font-semibold">Payment recorded successfully!</p>
              <p className="text-sm">MWK {formData.amount.toLocaleString()} has been recorded for {selectedBike?.registrationNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Payment</CardTitle>
        <CardDescription>Record a new payment for a bike</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bike Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Bike *</label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by registration number, make, or model..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  className="pl-10"
                />
              </div>

              {/* Bike Search Results */}
              {showSearchResults && searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
                  {filteredBikes.length > 0 ? (
                    filteredBikes.map((bike) => (
                      <button
                        key={bike.id}
                        type="button"
                        onClick={() => handleBikeSelect(bike)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                      >
                        <p className="font-semibold text-gray-900">{bike.registrationNumber}</p>
                        <p className="text-sm text-gray-600">
                          {bike.make} {bike.model} - {bike.color}
                        </p>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-500">No bikes found</div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Bike Display */}
            {selectedBike && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-900">
                  {selectedBike.registrationNumber} - {selectedBike.make} {selectedBike.model}
                </p>
              </div>
            )}
          </div>

          {/* Payment Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Payment Type *</label>
            <select
              value={formData.paymentType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  paymentType: e.target.value as any,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="registration">Registration Fee</option>
              <option value="renewal">Renewal Fee</option>
              <option value="monthly">Monthly Fee</option>
              <option value="annual">Annual Fee</option>
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Amount (MWK) *</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-600">MWK</span>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amount: parseInt(e.target.value) || 0,
                  }))
                }
                className="pl-12"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Payment Method *</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  paymentMethod: e.target.value as any,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cash">Cash</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <Input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Add any notes about this payment"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Record Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
