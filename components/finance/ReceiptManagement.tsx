'use client';

import { useState } from 'react';
import { Receipt, Payment } from '@/lib/types';
import { mockReceipts, mockPayments } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Trash2, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ReceiptManagement() {
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [newReceipt, setNewReceipt] = useState({ paymentId: '' });

  const filteredReceipts = receipts.filter(
    (receipt) =>
      receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateReceipt = () => {
    if (!newReceipt.paymentId) {
      alert('Please select a payment');
      return;
    }

    const existingReceipt = receipts.find((r) => r.paymentId === newReceipt.paymentId);
    if (existingReceipt) {
      alert('A receipt already exists for this payment');
      return;
    }

    const receipt: Receipt = {
      id: `REC${String(receipts.length + 1).padStart(3, '0')}`,
      paymentId: newReceipt.paymentId,
      receiptNumber: `RCP-2024-${String(receipts.length + 1).padStart(3, '0')}`,
      generatedAt: new Date().toISOString().split('T')[0],
    };

    setReceipts([receipt, ...receipts]);
    setNewReceipt({ paymentId: '' });
    setIsDialogOpen(false);
    alert(`Receipt ${receipt.receiptNumber} created successfully!`);
  };

  const handleDeleteReceipt = (id: string) => {
    if (confirm('Are you sure you want to delete this receipt?')) {
      setReceipts(receipts.filter((r) => r.id !== id));
      alert('Receipt deleted successfully');
    }
  };

  const getPaymentDetails = (paymentId: string): Payment | undefined => {
    return mockPayments.find((p) => p.id === paymentId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Receipt Management</h2>
          <p className="text-gray-600 mt-1">Manage and track all payment receipts</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={18} className="mr-2" />
              Create Receipt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Receipt</DialogTitle>
              <DialogDescription>Generate a receipt for a completed payment</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentId">Select Payment *</Label>
                <Select value={newReceipt.paymentId} onValueChange={(value) => setNewReceipt({ paymentId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPayments
                      .filter((p) => p.status === 'completed' && !receipts.some((r) => r.paymentId === p.id))
                      .map((payment) => (
                        <SelectItem key={payment.id} value={payment.id}>
                          {payment.id} - Bike {payment.bikeId} - MWK {payment.amount.toLocaleString()}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCreateReceipt} className="w-full bg-blue-600 hover:bg-blue-700">
                Create Receipt
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <Input
          placeholder="Search by receipt number or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Receipts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Receipts</CardTitle>
          <CardDescription>{filteredReceipts.length} receipts found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Receipt No.</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Payment ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Generated Date</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.length > 0 ? (
                  filteredReceipts.map((receipt) => {
                    const payment = getPaymentDetails(receipt.paymentId);
                    return (
                      <tr key={receipt.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold">{receipt.receiptNumber}</td>
                        <td className="py-3 px-4">{receipt.paymentId}</td>
                        <td className="py-3 px-4">
                          {payment ? `MWK ${payment.amount.toLocaleString()}` : 'N/A'}
                        </td>
                        <td className="py-3 px-4">{receipt.generatedAt}</td>
                        <td className="py-3 px-4 flex justify-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedReceipt(receipt)}
                              >
                                <Eye size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Receipt Details</DialogTitle>
                              </DialogHeader>
                              {selectedReceipt && payment && (
                                <div className="space-y-4">
                                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="space-y-3">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Receipt Number:</span>
                                        <span className="font-semibold">{selectedReceipt.receiptNumber}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Payment ID:</span>
                                        <span className="font-semibold">{selectedReceipt.paymentId}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Bike ID:</span>
                                        <span className="font-semibold">{payment.bikeId}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-semibold">MWK {payment.amount.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Payment Method:</span>
                                        <span className="font-semibold capitalize">{payment.paymentMethod}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Generated:</span>
                                        <span className="font-semibold">{selectedReceipt.generatedAt}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteReceipt(receipt.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No receipts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
