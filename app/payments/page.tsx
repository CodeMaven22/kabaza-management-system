'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { PaymentHistory } from '@/components/payments/PaymentHistory';
import { PaymentDashboard } from '@/components/payments/PaymentDashboard';
import { mockBikes, mockPayments } from '@/lib/mockData';
import { PaymentFormData, Payment } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [bikes] = useState(mockBikes);

  const handlePaymentSubmission = (formData: PaymentFormData) => {
    const bike = bikes.find((b) => b.id === formData.bikeId);
    if (!bike) {
      alert('Bike not found');
      return;
    }

    const newPayment: Payment = {
      id: `PAY${String(payments.length + 1).padStart(3, '0')}`,
      bikeId: formData.bikeId,
      operatorId: bike.operatorId,
      amount: formData.amount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: formData.paymentMethod,
      status: 'completed',
      transactionId: `TXN${String(payments.length + 1).padStart(3, '0')}`,
      receiptNumber: `RCP${String(payments.length + 1).padStart(3, '0')}`,
      description: formData.description,
    };

    setPayments([newPayment, ...payments]);
    alert(`Payment of KES ${formData.amount} recorded successfully! Receipt: ${newPayment.receiptNumber}`);
  };

  return (
    <DashboardLayout currentPage="payments">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>

        <PaymentDashboard payments={payments} />

        <Tabs defaultValue="record" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="record">Record Payment</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="space-y-6">
            <PaymentForm bikes={bikes} onSubmit={handlePaymentSubmission} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <PaymentHistory payments={payments} bikes={bikes} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
