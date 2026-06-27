'use client';

import { useState, useMemo } from 'react';
import { Bike, Payment } from '@/lib/types';
import { mockBikes, mockPayments, mockOwners } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Calendar } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BikePaymentRecord {
  bike: Bike;
  totalPaid: number;
  paymentCount: number;
  lastPaymentDate: string;
  monthlyPayments: { month: string; amount: number }[];
}

export function PaymentTracker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBikeId, setSelectedBikeId] = useState<string | null>(null);

  const bikes = mockBikes;
  const payments = mockPayments;

  // Filter bikes based on search
  const filteredBikes = useMemo(
    () =>
      bikes.filter(
        (bike) =>
          bike.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bike.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bike.model.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  // Get payment records for a bike
  const getBikePaymentRecord = (bikeId: string): BikePaymentRecord | null => {
    const bike = bikes.find((b) => b.id === bikeId);
    if (!bike) return null;

    const bikePayments = payments.filter((p) => p.bikeId === bikeId);
    const totalPaid = bikePayments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    // Group payments by month
    const monthlyData: { [key: string]: number } = {};
    bikePayments.forEach((payment) => {
      const date = new Date(payment.paymentDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + payment.amount;
    });

    const monthlyPayments = Object.entries(monthlyData)
      .map(([month, amount]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        amount,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const lastPayment = bikePayments[bikePayments.length - 1];

    return {
      bike,
      totalPaid,
      paymentCount: bikePayments.length,
      lastPaymentDate: lastPayment?.paymentDate || 'No payments',
      monthlyPayments,
    };
  };

  const selectedBikeRecord = selectedBikeId ? getBikePaymentRecord(selectedBikeId) : null;

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Bikes</CardTitle>
          <CardDescription>Find a bike by registration number, make, or model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <Input
              placeholder="Search by registration number, make, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bikes List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Bikes List</CardTitle>
              <CardDescription>{filteredBikes.length} bikes found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredBikes.length > 0 ? (
                  filteredBikes.map((bike) => {
                    const bikeRecord = getBikePaymentRecord(bike.id);
                    const owner = mockOwners.find((o) => o.id === bike.ownerId);
                    return (
                      <button
                        key={bike.id}
                        onClick={() => setSelectedBikeId(bike.id)}
                        className={`w-full p-3 rounded-lg border transition-all text-left ${
                          selectedBikeId === bike.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-sm">{bike.registrationNumber}</p>
                        <p className="text-xs text-gray-600">
                          {bike.make} {bike.model}
                        </p>
                        <p className="text-xs text-gray-500">{owner?.firstName} {owner?.lastName}</p>
                        {bikeRecord && (
                          <p className="text-xs text-blue-600 mt-1">
                            Paid: {bikeRecord.totalPaid.toLocaleString()} MWK
                          </p>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">No bikes found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedBikeRecord ? (
            <>
              {/* Bike Summary */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedBikeRecord.bike.registrationNumber}</CardTitle>
                      <CardDescription>
                        {selectedBikeRecord.bike.make} {selectedBikeRecord.bike.model} ({selectedBikeRecord.bike.color})
                      </CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedBikeRecord.bike.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedBikeRecord.bike.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Paid</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedBikeRecord.totalPaid.toLocaleString()} MWK
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payments</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedBikeRecord.paymentCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Payment</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedBikeRecord.lastPaymentDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Payment Chart */}
              {selectedBikeRecord.monthlyPayments.length > 0 ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={20} className="text-blue-600" />
                      <div>
                        <CardTitle>Monthly Payment History</CardTitle>
                        <CardDescription>Payment breakdown by month</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={selectedBikeRecord.monthlyPayments}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => `${value.toLocaleString()} MWK`}
                          contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                        />
                        <Legend />
                        <Bar dataKey="amount" fill="#3b82f6" name="Amount (MWK)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">No payment history for this bike</p>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Payment List */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>All payments made for this bike</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payments
                      .filter((p) => p.bikeId === selectedBikeRecord.bike.id)
                      .map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div>
                            <p className="font-semibold text-sm">{payment.description}</p>
                            <p className="text-xs text-gray-600">{payment.paymentDate}</p>
                            <p className="text-xs text-gray-500">Receipt: {payment.receiptNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">{payment.amount.toLocaleString()} MWK</p>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                              payment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-12">
                <div className="text-center">
                  <Calendar className="mx-auto text-gray-400 mb-4" size={40} />
                  <p className="text-gray-500 mb-2">Select a bike to view payment history</p>
                  <p className="text-sm text-gray-400">Click on a bike from the list to see its payment details and charts</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
