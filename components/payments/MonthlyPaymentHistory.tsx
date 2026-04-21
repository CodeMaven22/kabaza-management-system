'use client';

import { useState, useMemo } from 'react';
import { mockBikes, mockPayments, mockOwners } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';

export function MonthlyPaymentHistory() {
  const [searchTerm, setSearchTerm] = useState('');

  const bikes = mockBikes;
  const payments = mockPayments;
  const owners = mockOwners;

  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

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

  // Get payment status for current month for each bike
  const getBikeMonthlyStatus = (bikeId: string) => {
    const bikePayments = payments.filter((p) => p.bikeId === bikeId);
    const currentMonthPayment = bikePayments.find(
      (p) => p.year === currentYear && p.month === currentMonth
    );

    return {
      isPaid: !!currentMonthPayment && currentMonthPayment.status === 'completed',
      payment: currentMonthPayment,
      allPayments: bikePayments,
    };
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const statusMap = filteredBikes.map((bike) => getBikeMonthlyStatus(bike.id));
    const paidCount = statusMap.filter((s) => s.isPaid).length;
    const unpaidCount = statusMap.filter((s) => !s.isPaid).length;
    const totalExpected = filteredBikes.length * 4000; // 4000 MWK per bike
    const actualRevenue = statusMap
      .filter((s) => s.isPaid)
      .reduce((sum, s) => sum + (s.payment?.amount || 0), 0);

    return {
      paidCount,
      unpaidCount,
      totalBikes: filteredBikes.length,
      collectionRate: filteredBikes.length > 0 ? Math.round((paidCount / filteredBikes.length) * 100) : 0,
      totalExpected,
      actualRevenue,
      outstanding: totalExpected - actualRevenue,
    };
  }, [filteredBikes]);

  return (
    <div className="space-y-6">
      {/* Header with Month Info */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Month Payment Status</h2>
        <p className="text-gray-700 font-semibold text-lg">{monthName}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.paidCount}</div>
            <p className="text-xs text-gray-500 mt-1">bikes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Unpaid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.unpaidCount}</div>
            <p className="text-xs text-gray-500 mt-1">bikes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.collectionRate}%</div>
            <p className="text-xs text-gray-500 mt-1">of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.outstanding.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">MWK</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Box */}
      <Card>
        <CardHeader>
          <CardTitle>Search Bikes</CardTitle>
          <CardDescription>Find bikes by registration number, make, or model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              placeholder="Search by reg number, make, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bikes List with Payment Status */}
      <Card>
        <CardHeader>
          <CardTitle>Bikes Payment Status - {monthName}</CardTitle>
          <CardDescription>
            {filteredBikes.length === 0 ? 'No bikes found' : `Showing ${filteredBikes.length} bike(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBikes.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto text-gray-400 mb-4" size={40} />
              <p className="text-gray-500">No bikes match your search</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredBikes.map((bike) => {
                const status = getBikeMonthlyStatus(bike.id);
                const owner = owners.find((o) => o.id === bike.ownerId);

                return (
                  <div
                    key={bike.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{bike.registrationNumber}</h3>
                          {status.isPaid ? (
                            <Badge className="bg-green-100 text-green-800">Paid</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Unpaid</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {bike.make} {bike.model} ({bike.color})
                        </p>
                        <p className="text-xs text-gray-500">
                          Owner: {owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'}
                        </p>
                      </div>

                      <div className="text-right">
                        {status.isPaid ? (
                          <div className="flex flex-col items-end gap-2">
                            <CheckCircle className="text-green-600" size={24} />
                            <div>
                              <p className="text-sm font-semibold text-green-600">
                                {status.payment?.amount.toLocaleString()} MWK
                              </p>
                              <p className="text-xs text-gray-500">{status.payment?.paymentDate}</p>
                              <p className="text-xs text-gray-500">Ref: {status.payment?.receiptNumber}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-end gap-2">
                            <AlertCircle className="text-red-600" size={24} />
                            <div>
                              <p className="text-sm font-semibold text-red-600">4000 MWK Due</p>
                              <p className="text-xs text-gray-500">Not paid</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment History for this bike */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-600 mb-2">All payments for this bike:</p>
                      <div className="flex flex-wrap gap-2">
                        {status.allPayments.length > 0 ? (
                          status.allPayments.map((payment) => (
                            <span
                              key={payment.id}
                              className={`text-xs px-2 py-1 rounded ${
                                payment.status === 'completed'
                                  ? 'bg-green-50 text-green-700'
                                  : payment.status === 'pending'
                                    ? 'bg-yellow-50 text-yellow-700'
                                    : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {payment.month ? `${payment.month}/${payment.year}` : payment.paymentDate}: {payment.amount} MWK
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No payment history</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Box */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Expected Revenue</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalExpected.toLocaleString()} MWK</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Actual Revenue</p>
              <p className="text-xl font-bold text-green-600">{stats.actualRevenue.toLocaleString()} MWK</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Outstanding</p>
              <p className="text-xl font-bold text-red-600">{stats.outstanding.toLocaleString()} MWK</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Bikes</p>
              <p className="text-xl font-bold text-blue-600">{stats.totalBikes}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
