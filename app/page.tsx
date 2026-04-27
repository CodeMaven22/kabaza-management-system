'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/transport');
  }, [router]);

  return (
    <ProtectedRoute>
      <div></div>
    </ProtectedRoute>
  );
}

// Original Dashboard Content Below (Kept for reference)
/*
'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDashboardStats, mockBikes, mockOperators, mockPayments } from '@/lib/mockData';
import { Users, Bike, DollarSign, TrendingUp } from 'lucide-react';

function DashboardContent() {
  const stats = [
    {
      title: 'Total Bikes',
      value: mockDashboardStats.totalBikes,
      icon: Bike,
      color: 'bg-blue-100 text-blue-600',
      description: `${mockDashboardStats.activeBikes} active`,
    },
    {
      title: 'Total Operators',
      value: mockDashboardStats.totalOperators,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      description: `${mockDashboardStats.activeOperators} active`,
    },
    {
      title: 'Total Revenue',
      value: `MWK ${mockDashboardStats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      description: `From ${mockPayments.filter((p) => p.status === 'completed').length} transactions`,
    },
    {
      title: 'Pending Payments',
      value: `MWK ${mockDashboardStats.pendingPayments.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-yellow-100 text-yellow-600',
      description: `${mockPayments.filter((p) => p.status === 'pending').length} pending transactions`,
    },
  ];

  const recentBikes = mockBikes.slice(0, 3);
  const recentPayments = mockPayments.slice(0, 3);

  return (
    <DashboardLayout currentPage="dashboard">
      <div className="space-y-8">
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
                {recentBikes.map((bike) => {
                  const operator = mockOperators.find((op) => op.id === bike.operatorId);
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
                        <p className="text-xs text-gray-500">
                          {operator ? `${operator.firstName} ${operator.lastName}` : 'Unknown'}
                        </p>
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

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Latest payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => {
                  const bike = mockBikes.find((b) => b.id === payment.bikeId);
                  return (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-semibold">{bike?.registrationNumber}</p>
                        <p className="text-sm text-gray-600">{payment.description}</p>
                        <p className="text-xs text-gray-500">{payment.paymentDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">MWK {payment.amount.toLocaleString()}</p>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function HomeOld() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
*/
