'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Plus, DollarSign, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { mockFines, mockBikes, mockOwners } from '@/lib/mockData';
import { Fine } from '@/lib/types';

export function FineManagementFinance() {
  const [fines, setFines] = useState<Fine[]>(mockFines);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'paid' | 'unpaid' | 'cancelled'>('unpaid');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mobile_money' | 'bank_transfer'>('mobile_money');
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const [createFormData, setCreateFormData] = useState({
    bikeId: '',
    amount: '',
    reason: '',
  });

  const filteredFines = fines.filter((fine) => {
    const bike = mockBikes.find((b) => b.id === fine.bikeId);
    const matchesSearch = bike?.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = fine.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const unpaidFinesTotal = fines.filter((f) => f.status === 'unpaid').reduce((sum, f) => sum + f.amount, 0);
  const paidFinesTotal = fines.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);

  const handleCreateFine = () => {
    if (!createFormData.bikeId || !createFormData.amount || !createFormData.reason) {
      alert('Please fill all fields');
      return;
    }

    const newFine: Fine = {
      id: `FINE${Date.now()}`,
      bikeId: createFormData.bikeId,
      amount: parseInt(createFormData.amount),
      reason: createFormData.reason,
      status: 'unpaid',
      issuedBy: 'USR001',
      issuedDate: new Date().toISOString().split('T')[0],
    };

    setFines([...fines, newFine]);
    setCreateFormData({ bikeId: '', amount: '', reason: '' });
    setShowCreateForm(false);
    alert('Fine created successfully!');
  };

  const handlePayFine = () => {
    if (!selectedFine) return;

    setFines(
      fines.map((fine) =>
        fine.id === selectedFine.id ? { ...fine, status: 'paid' as const } : fine
      )
    );
    setShowPaymentDialog(false);
    setSelectedFine(null);
    alert(`Fine MWK ${selectedFine.amount.toLocaleString()} paid successfully via ${paymentMethod}`);
  };

  const handleCancelFine = () => {
    if (!selectedFine || !cancelReason) {
      alert('Please provide a cancellation reason');
      return;
    }

    setFines(fines.filter((fine) => fine.id !== selectedFine.id));
    setShowCancelDialog(false);
    setSelectedFine(null);
    setCancelReason('');
    alert('Fine cancelled successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total Fines</p>
              <p className="text-2xl font-bold">MWK {(unpaidFinesTotal + paidFinesTotal).toLocaleString()}</p>
              <p className="text-xs text-gray-500">{fines.length} fines</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Unpaid Fines</p>
              <p className="text-2xl font-bold text-orange-600">MWK {unpaidFinesTotal.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{fines.filter((f) => f.status === 'unpaid').length} unpaid</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Collected</p>
              <p className="text-2xl font-bold text-green-600">MWK {paidFinesTotal.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{fines.filter((f) => f.status === 'paid').length} paid</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header with controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fines Management</CardTitle>
              <CardDescription>Create and manage traffic fines</CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
              <Plus size={18} />
              Issue Fine
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Issue New Fine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Bike *</label>
                <Select value={createFormData.bikeId} onValueChange={(val) => setCreateFormData({ ...createFormData, bikeId: val })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select bike..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBikes.map((bike) => (
                      <SelectItem key={bike.id} value={bike.id}>
                        {bike.registrationNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Amount (MWK) *</label>
                  <Input
                    type="number"
                    value={createFormData.amount}
                    onChange={(e) => setCreateFormData({ ...createFormData, amount: e.target.value })}
                    placeholder="e.g., 50000"
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Reason *</label>
                  <Input
                    value={createFormData.reason}
                    onChange={(e) => setCreateFormData({ ...createFormData, reason: e.target.value })}
                    placeholder="Violation reason"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateFine} className="flex-1">
                  Create Fine
                </Button>
                <Button onClick={() => setShowCreateForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search & Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by bike registration..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {(['unpaid', 'paid', 'cancelled'] as const).map((status) => {
            const count = fines.filter((f) => f.status === status).length;
            const statusLabels = {
              unpaid: 'Unpaid',
              paid: 'Paid',
              cancelled: 'Cancelled',
            };

            return (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === status
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {statusLabels[status]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Fines List */}
      <div className="space-y-3">
        {filteredFines.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              No fines found
            </CardContent>
          </Card>
        ) : (
          filteredFines.map((fine) => {
            const bike = mockBikes.find((b) => b.id === fine.bikeId);
            const owner = mockOwners.find((o) => o.id === bike?.ownerId);

            return (
              <Card key={fine.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <p className="font-semibold text-gray-900">{bike?.registrationNumber}</p>
                        <p className="text-sm text-gray-600">
                          {owner?.firstName} {owner?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{fine.reason}</p>
                      </div>
                      <Badge
                        variant={
                          fine.status === 'paid'
                            ? 'default'
                            : fine.status === 'cancelled'
                              ? 'secondary'
                              : 'destructive'
                        }
                        className="gap-1"
                      >
                        {fine.status === 'paid' ? (
                          <>
                            <CheckCircle size={14} />
                            Paid
                          </>
                        ) : fine.status === 'cancelled' ? (
                          <>
                            <X size={14} />
                            Cancelled
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={14} />
                            Unpaid
                          </>
                        )}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-3 border-y border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="text-lg font-bold">MWK {fine.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Issued Date</p>
                        <p className="text-sm font-medium">{fine.issuedDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {fine.status === 'cancelled' ? 'Cancelled Date' : 'Status'}
                        </p>
                        <p className="text-sm font-medium capitalize">
                          {fine.status === 'cancelled' ? fine.cancelledDate : fine.status}
                        </p>
                      </div>
                    </div>

                    {fine.status === 'cancelled' && fine.cancelledReason && (
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">
                        <p className="text-gray-600">
                          <span className="font-semibold">Cancellation Reason:</span> {fine.cancelledReason}
                        </p>
                      </div>
                    )}

                    {fine.status === 'unpaid' && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setSelectedFine(fine);
                            setShowPaymentDialog(true);
                          }}
                          className="flex-1 gap-2"
                        >
                          <DollarSign size={16} />
                          Pay Fine
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedFine(fine);
                            setShowCancelDialog(true);
                          }}
                          variant="destructive"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Fine</DialogTitle>
            <DialogDescription>Process payment for fine</DialogDescription>
          </DialogHeader>

          {selectedFine && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Amount: <strong>MWK {selectedFine.amount.toLocaleString()}</strong>
                </AlertDescription>
              </Alert>

              <div>
                <label className="text-sm font-medium">Payment Method *</label>
                <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as any)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handlePayFine} className="flex-1">
                  Confirm Payment
                </Button>
                <Button onClick={() => setShowPaymentDialog(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Fine</DialogTitle>
            <DialogDescription>Provide reason for cancellation</DialogDescription>
          </DialogHeader>

          {selectedFine && (
            <div className="space-y-4">
              <Alert className="border-orange-200 bg-orange-50">
                <AlertDescription className="text-orange-800">
                  Cancelling fine: MWK {selectedFine.amount.toLocaleString()}
                </AlertDescription>
              </Alert>

              <div>
                <label className="text-sm font-medium">Cancellation Reason *</label>
                <Input
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter reason for cancellation"
                  className="mt-2"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCancelFine} variant="destructive" className="flex-1">
                  Cancel Fine
                </Button>
                <Button onClick={() => setShowCancelDialog(false)} variant="outline">
                  Keep Fine
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
