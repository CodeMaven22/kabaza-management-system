'use client';

import { TransportLayout } from '@/components/TransportLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockBikes, mockOperators, mockOwners, mockStickerCodes } from '@/lib/mockData';
import { Users, Truck, QrCode, CheckCircle } from 'lucide-react';

function TransportDashboard() {
  const stats = [
    {
      title: 'Total Bikes',
      value: mockBikes.length,
      icon: Truck,
      color: 'bg-blue-100 text-blue-600',
      description: `${mockBikes.filter((b) => b.status === 'active').length} active`,
    },
    {
      title: 'Bike Owners',
      value: mockOwners.length,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      description: `${mockOwners.filter((o) => o.status === 'active').length} active`,
    },
    {
      title: 'Operators',
      value: mockOperators.length,
      icon: Users,
      color: 'bg-green-100 text-green-600',
      description: `${mockOperators.filter((o) => o.status === 'active').length} active`,
    },
    {
      title: 'Sticker Codes',
      value: mockStickerCodes.length,
      icon: QrCode,
      color: 'bg-yellow-100 text-yellow-600',
      description: `${mockStickerCodes.filter((s) => s.status === 'active').length} active`,
    },
  ];

  return (
    <TransportLayout currentPage="dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transport Domain Dashboard</h1>
          <p className="text-gray-600 mt-2">Bike registration, owners, and operators management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-600">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bikes */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Registered Bikes</CardTitle>
              <CardDescription>Latest bike registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBikes.slice(0, 3).map((bike) => {
                  const owner = mockOwners.find((o) => o.id === bike.ownerId);
                  return (
                    <div
                      key={bike.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-semibold">{bike.registrationNumber}</p>
                        <p className="text-sm text-gray-600">
                          {bike.make} {bike.model}
                        </p>
                        <p className="text-xs text-gray-500">{owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          {bike.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Active Operators */}
          <Card>
            <CardHeader>
              <CardTitle>Active Operators</CardTitle>
              <CardDescription>Operators with valid licenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOperators.slice(0, 3).map((operator) => (
                  <div
                    key={operator.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-semibold">
                        {operator.firstName} {operator.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{operator.licenseNumber}</p>
                      <p className="text-xs text-gray-500">License expires: {operator.licenseExpiryDate}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          operator.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {operator.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransportLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <TransportDashboard />
    </ProtectedRoute>
  );
}
