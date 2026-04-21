'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { EnhancedPaymentForm } from '@/components/payments/EnhancedPaymentForm';
import { PaymentHistory } from '@/components/payments/PaymentHistory';
import { PaymentDashboard } from '@/components/payments/PaymentDashboard';
import { mockBikes, mockPayments } from '@/lib/mockData';
import { Payment } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function PaymentsContent() {
  const [payments] = useState<Payment[]>(mockPayments);
  const [bikes] = useState(mockBikes);

  return (
    <DashboardLayout currentPage="payments">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-2">Record and track bike registration payments</p>
        </div>

        <PaymentDashboard payments={payments} />

        <Tabs defaultValue="record" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="record">Record Payment</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="space-y-6">
            <EnhancedPaymentForm />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <PaymentHistory payments={payments} bikes={bikes} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

export default function PaymentsPage() {
  return (
    <ProtectedRoute>
      <PaymentsContent />
    </ProtectedRoute>
  );
}
