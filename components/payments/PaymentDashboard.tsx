'use client';

import { Payment } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';

interface PaymentDashboardProps {
  payments: Payment[];
}

export function PaymentDashboard({ payments }: PaymentDashboardProps) {
  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const completedCount = payments.filter((p) => p.status === 'completed').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-gray-600">From {completedCount} transactions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">KES {pendingAmount.toLocaleString()}</div>
          <p className="text-xs text-gray-600">
            From {payments.filter((p) => p.status === 'pending').length} pending transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {payments.length > 0 ? Math.round((completedCount / payments.length) * 100) : 0}%
          </div>
          <p className="text-xs text-gray-600">Of all transactions</p>
        </CardContent>
      </Card>
    </div>
  );
}
