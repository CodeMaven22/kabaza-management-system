'use client';

import { FinanceLayout } from '@/components/shared/FinanceLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockPayments, mockFines, mockConfiscations, mockReceipts } from '@/lib/mockData';
import { CreditCard, AlertTriangle, Lock, Receipt } from 'lucide-react';

function FinanceDashboard() {
  const completedPayments = mockPayments.filter((p) => p.status === 'completed');
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = mockPayments.filter((p) => p.status === 'pending');
  const paidFines = mockFines.filter((f) => f.status === 'paid');
  const unpaidFines = mockFines.filter((f) => f.status === 'unpaid');
  const totalFines = mockFines.reduce((sum, f) => sum + f.amount, 0);
  const totalFinesPaid = paidFines.reduce((sum, f) => sum + f.amount, 0);

  const stats = [
    {
      title: 'Total Revenue',
      value: `MWK ${totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-green-100 text-green-600',
      description: `${completedPayments.length} completed payments`,
    },
    {
      title: 'Pending Payments',
      value: `MWK ${pendingPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-yellow-100 text-yellow-600',
      description: `${pendingPayments.length} pending`,
    },
    {
      title: 'Total Fines',
      value: `MWK ${totalFines.toLocaleString()}`,
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600',
      description: `${paidFines.length} paid, ${unpaidFines.length} unpaid`,
    },
    {
      title: 'Confiscations',
      value: mockConfiscations.length,
      icon: Lock,
      color: 'bg-purple-100 text-purple-600',
      description: `${mockConfiscations.filter((c) => c.status === 'confiscated').length} active`,
    },
  ];

  return (
    <FinanceLayout currentPage="dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Domain Dashboard</h1>
          <p className="text-gray-600 mt-2">Payments, fines, and financial analytics</p>
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
          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedPayments.slice(0, 3).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-semibold">{payment.description}</p>
                      <p className="text-sm text-gray-600">{payment.paymentDate}</p>
                      <p className="text-xs text-gray-500">{payment.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">MWK {payment.amount.toLocaleString()}</p>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Outstanding Fines */}
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Fines</CardTitle>
              <CardDescription>Unpaid violations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unpaidFines.slice(0, 3).map((fine) => (
                  <div
                    key={fine.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-semibold">{fine.reason}</p>
                      <p className="text-sm text-gray-600">{fine.id}</p>
                      <p className="text-xs text-gray-500">Issued: {fine.issuedDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">MWK {fine.amount.toLocaleString()}</p>
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                        Unpaid
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FinanceLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <FinanceDashboard />
    </ProtectedRoute>
  );
}
