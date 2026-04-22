'use client';

import { useState } from 'react';
import { Fine } from '@/lib/types';
import { mockFines, mockBikes, mockUsers } from '@/lib/mockData';
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
import { Textarea } from '@/components/ui/textarea';

export function FinesManagement() {
  const [fines, setFines] = useState<Fine[]>(mockFines);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
  const [newFine, setNewFine] = useState({ bikeId: '', amount: '', reason: '' });

  const filteredFines = fines.filter(
    (fine) =>
      fine.bikeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateFine = () => {
    if (!newFine.bikeId || !newFine.amount || !newFine.reason) {
      alert('Please fill in all fields');
      return;
    }

    const fine: Fine = {
      id: `FINE${String(fines.length + 1).padStart(3, '0')}`,
      bikeId: newFine.bikeId,
      amount: parseInt(newFine.amount),
      reason: newFine.reason,
      status: 'unpaid',
      issuedBy: 'USR001',
      issuedDate: new Date().toISOString().split('T')[0],
    };

    setFines([fine, ...fines]);
    setNewFine({ bikeId: '', amount: '', reason: '' });
    setIsDialogOpen(false);
    alert(`Fine issued successfully!`);
  };

  const handleDeleteFine = (id: string) => {
    if (confirm('Are you sure you want to delete this fine?')) {
      setFines(fines.filter((f) => f.id !== id));
      alert('Fine deleted successfully');
    }
  };

  const getBikeInfo = (bikeId: string) => {
    return mockBikes.find((b) => b.id === bikeId);
  };

  const getUsername = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    return user ? user.username : 'Unknown';
  };

  const paidFines = fines.filter((f) => f.status === 'paid').length;
  const unpaidFines = fines.filter((f) => f.status === 'unpaid').length;
  const totalFineAmount = fines.reduce((sum, f) => sum + f.amount, 0);
  const collectedAmount = fines.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Fines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{fines.length}</p>
            <p className="text-xs text-gray-500">All issued fines</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Paid Fines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{paidFines}</p>
            <p className="text-xs text-gray-500">MWK {collectedAmount.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Unpaid Fines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{unpaidFines}</p>
            <p className="text-xs text-gray-500">
              MWK {(totalFineAmount - collectedAmount).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">MWK {totalFineAmount.toLocaleString()}</p>
            <p className="text-xs text-gray-500">All fines</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fines Management</h2>
          <p className="text-gray-600 mt-1">Issue and track bike fines</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={18} className="mr-2" />
              Issue Fine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issue New Fine</DialogTitle>
              <DialogDescription>Create a fine for a bike violation</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bikeId">Select Bike *</Label>
                <Select value={newFine.bikeId} onValueChange={(value) => setNewFine({ ...newFine, bikeId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bike" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBikes.map((bike) => (
                      <SelectItem key={bike.id} value={bike.id}>
                        {bike.registrationNumber} - {bike.make} {bike.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (MWK) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 50000"
                  value={newFine.amount}
                  onChange={(e) => setNewFine({ ...newFine, amount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="Describe the violation reason..."
                  value={newFine.reason}
                  onChange={(e) => setNewFine({ ...newFine, reason: e.target.value })}
                  rows={3}
                />
              </div>

              <Button onClick={handleCreateFine} className="w-full bg-blue-600 hover:bg-blue-700">
                Issue Fine
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <Input
          placeholder="Search by bike registration, reason, or fine ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Fines Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Fines</CardTitle>
          <CardDescription>{filteredFines.length} fines found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Bike</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Reason</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Issued Date</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFines.length > 0 ? (
                  filteredFines.map((fine) => {
                    const bike = getBikeInfo(fine.bikeId);
                    return (
                      <tr key={fine.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold">{bike?.registrationNumber}</td>
                        <td className="py-3 px-4 font-semibold">MWK {fine.amount.toLocaleString()}</td>
                        <td className="py-3 px-4 max-w-xs truncate">{fine.reason}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={fine.status === 'paid' ? 'default' : 'destructive'}
                            className={fine.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          >
                            {fine.status.charAt(0).toUpperCase() + fine.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{fine.issuedDate}</td>
                        <td className="py-3 px-4 flex justify-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedFine(fine)}
                              >
                                <Eye size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Fine Details</DialogTitle>
                              </DialogHeader>
                              {selectedFine && bike && (
                                <div className="space-y-4">
                                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="space-y-3">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Fine ID:</span>
                                        <span className="font-semibold">{selectedFine.id}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Bike:</span>
                                        <span className="font-semibold">
                                          {bike.registrationNumber} ({bike.make} {bike.model})
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-semibold">MWK {selectedFine.amount.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <Badge
                                          variant={selectedFine.status === 'paid' ? 'default' : 'destructive'}
                                          className={
                                            selectedFine.status === 'paid'
                                              ? 'bg-green-100 text-green-800'
                                              : 'bg-red-100 text-red-800'
                                          }
                                        >
                                          {selectedFine.status.charAt(0).toUpperCase() + selectedFine.status.slice(1)}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Issued By:</span>
                                        <span className="font-semibold">{getUsername(selectedFine.issuedBy)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Issued Date:</span>
                                        <span className="font-semibold">{selectedFine.issuedDate}</span>
                                      </div>
                                      <div className="pt-3 border-t">
                                        <span className="text-gray-600">Reason:</span>
                                        <p className="font-semibold mt-1">{selectedFine.reason}</p>
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
                            onClick={() => handleDeleteFine(fine.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No fines found
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
