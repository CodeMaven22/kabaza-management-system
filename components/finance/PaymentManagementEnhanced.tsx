'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle, Loader, Plus, X, TrendingUp } from 'lucide-react';
import { financeService, Payment } from '@/lib/api/financeService';
import { canPerformAction } from '@/lib/api/financePermissions';
import { useAuth } from '@/lib/authContext';
import { formatCurrency, formatDate } from '@/lib/utils';

const paymentMethodColors: Record<string, string> = {
  CASH: 'bg-green-100 text-green-800',
  CHECK: 'bg-blue-100 text-blue-800',
  BANK_TRANSFER: 'bg-purple-100 text-purple-800',
  MOBILE_MONEY: 'bg-orange-100 text-orange-800',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CORRECTED: 'bg-blue-100 text-blue-800',
  REVERSED: 'bg-red-100 text-red-800',
};

export function PaymentManagementEnhanced() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState({
    receipt_number: '',
    vehicle_id: '',
    amount: '',
    payment_method: 'CASH',
  });
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Fetch payments on mount and when filters change
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await financeService.getAllPayments({
          status: statusFilter || undefined,
        });
        setPayments(response.results || []);
        
        // Calculate total revenue
        const total = response.results.reduce((sum, payment) => {
          if (payment.status === 'COMPLETED') return sum + payment.amount;
          return sum;
        }, 0);
        setTotalRevenue(total);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch payments';
        setError(message);
        console.error('[v0] Fetch payments error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [statusFilter]);

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canPerformAction(user, 'canCreatePayment')) {
      setError('You do not have permission to create payments');
      return;
    }

    try {
      setError(null);
      const newPayment = await financeService.createPayment({
        receipt_number: formData.receipt_number,
        vehicle_id: parseInt(formData.vehicle_id),
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method as any,
      });
      
      setPayments([newPayment, ...payments]);
      setFormData({
        receipt_number: '',
        vehicle_id: '',
        amount: '',
        payment_method: 'CASH',
      });
      setShowForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create payment';
      setError(message);
    }
  };

  const handleReversePayment = async (paymentId: number) => {
    if (!canPerformAction(user, 'canReversePayment')) {
      setError('You do not have permission to reverse payments');
      return;
    }

    try {
      const reversedPayment = await financeService.reversePayment(paymentId, 'Manual reversal');
      setPayments(payments.map(p => p.id === paymentId ? reversedPayment : p));
      alert('Payment reversed successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reverse payment';
      setError(message);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.vehicle_id.toString().includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-2">Track and manage vehicle payments</p>
        </div>
        {canPerformAction(user, 'canCreatePayment') && (
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus size={18} />
            New Payment
          </Button>
        )}
      </div>

      {/* Revenue Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-gray-600 mt-2">From {payments.filter(p => p.status === 'COMPLETED').length} completed payments</p>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Add Payment Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Record New Payment</CardTitle>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Receipt Number</label>
                  <Input
                    value={formData.receipt_number}
                    onChange={(e) => setFormData({ ...formData, receipt_number: e.target.value })}
                    placeholder="RCP-001"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Vehicle ID</label>
                  <Input
                    type="number"
                    value={formData.vehicle_id}
                    onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                    placeholder="Vehicle ID"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Amount</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="CASH">Cash</option>
                    <option value="CHECK">Check</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="MOBILE_MONEY">Mobile Money</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Record Payment
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by receipt number or vehicle ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CORRECTED">Corrected</option>
          <option value="REVERSED">Reversed</option>
        </select>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading payments...' : `Total: ${filteredPayments.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-5 w-5 animate-spin text-gray-400 mr-2" />
              <span className="text-gray-600">Loading payments...</span>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No payments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Vehicle ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.receipt_number}</TableCell>
                      <TableCell>{payment.vehicle_id}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <Badge className={paymentMethodColors[payment.payment_method]}>
                          {payment.payment_method}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(payment.payment_date)}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[payment.status]}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {canPerformAction(user, 'canReversePayment') && payment.status === 'COMPLETED' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReversePayment(payment.id)}
                          >
                            Reverse
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
