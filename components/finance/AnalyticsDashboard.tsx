'use client';

import { useState } from 'react';
import { mockPayments, mockFines, mockConfiscations, mockBikes } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AnalyticsDashboard() {
  const completedPayments = mockPayments.filter((p) => p.status === 'completed');
  const monthlyPayments = mockPayments.filter((p) => p.paymentType === 'monthly' && p.status === 'completed');
  
  // Monthly revenue data
  const monthlyData = [
    { month: 'Jan', revenue: 18000 },
    { month: 'Feb', revenue: 26000 },
    { month: 'Mar', revenue: 22000 },
    { month: 'Apr', revenue: 8000 },
  ];

  // Payment method distribution
  const paymentMethodData = [
    { name: 'Cash', value: completedPayments.filter((p) => p.paymentMethod === 'cash').length },
    { name: 'Mobile Money', value: completedPayments.filter((p) => p.paymentMethod === 'mobile_money').length },
  ];

  // Fine status
  const fineData = [
    { name: 'Paid Fines', value: mockFines.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0) },
    { name: 'Unpaid Fines', value: mockFines.filter((f) => f.status === 'unpaid').reduce((sum, f) => sum + f.amount, 0) },
  ];

  const COLORS = ['#10b981', '#ef4444'];

  // Collection efficiency by bike
  const bikeCollectionData = mockBikes.slice(0, 5).map((bike) => {
    const bikePayments = completedPayments.filter((p) => p.bikeId === bike.id);
    return {
      name: bike.registrationNumber,
      revenue: bikePayments.reduce((sum, p) => sum + p.amount, 0),
      count: bikePayments.length,
    };
  });

  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalFines = mockFines.reduce((sum, f) => sum + f.amount, 0);
  const totalConfiscations = mockConfiscations.length;
  const averageTransaction = completedPayments.length > 0 ? totalRevenue / completedPayments.length : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Financial Analytics</h2>
        <p className="text-gray-600">Revenue trends and financial performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">MWK {totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">{completedPayments.length} completed payments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Average Transaction</p>
              <p className="text-3xl font-bold">MWK {Math.round(averageTransaction).toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Per payment</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Total Fines</p>
              <p className="text-3xl font-bold text-red-600">MWK {totalFines.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">{mockFines.length} issued fines</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Confiscations</p>
              <p className="text-3xl font-bold text-purple-600">{totalConfiscations}</p>
              <p className="text-xs text-gray-500 mt-2">Active confiscations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue collected by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `MWK ${value.toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Method Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Transaction count by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#8b5cf6" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fine Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Fine Collections Status</CardTitle>
            <CardDescription>Paid vs unpaid fines (MWK)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{ name: 'Fines', ...fineData.reduce((acc, item) => ({ ...acc, [item.name]: item.value }), {}) }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `MWK ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="Paid Fines" fill="#10b981" />
                <Bar dataKey="Unpaid Fines" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Bikes */}
        <Card>
          <CardHeader>
            <CardTitle>Top Revenue Generating Bikes</CardTitle>
            <CardDescription>Bikes with highest payment collections</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bikeCollectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => `MWK ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Collection Rate Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Performance Summary</CardTitle>
          <CardDescription>Key performance indicators for the financial system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-green-600 pl-4">
              <p className="text-sm text-gray-600">Collection Rate</p>
              <p className="text-3xl font-bold">92%</p>
              <p className="text-xs text-gray-500 mt-1">Of expected monthly revenue collected</p>
            </div>
            <div className="border-l-4 border-yellow-600 pl-4">
              <p className="text-sm text-gray-600">Outstanding Balance</p>
              <p className="text-3xl font-bold">MWK 8,000</p>
              <p className="text-xs text-gray-500 mt-1">Pending payment from 1 bike</p>
            </div>
            <div className="border-l-4 border-red-600 pl-4">
              <p className="text-sm text-gray-600">Fine Recovery Rate</p>
              <p className="text-3xl font-bold">40%</p>
              <p className="text-xs text-gray-500 mt-1">Of issued fines paid</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
