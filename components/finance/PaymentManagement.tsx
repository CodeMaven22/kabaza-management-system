'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Plus, Eye, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { mockSubscriptions, mockBikes, mockOwners } from '@/lib/mockData';
import { Subscription } from '@/lib/types';

export function PaymentManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const bike = mockBikes.find((b) => b.id === sub.bikeId);
    const matchesSearch = bike?.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSubscribe = (bikeId: string) => {
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of next month

    const newSubscription: Subscription = {
      id: `SUB${Date.now()}`,
      bikeId,
      status: 'active',
      subscriptionStartDate: today.toISOString().split('T')[0],
      subscriptionEndDate: endDate.toISOString().split('T')[0],
      paymentMethod: 'mobile_money',
      paidAmount: 50000,
      createdAt: today.toISOString(),
    };

    setSubscriptions([...subscriptions, newSubscription]);
    setShowForm(false);
    alert('Subscription created successfully!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
      alert('Subscription deleted');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subscriptions & Payments</CardTitle>
              <CardDescription>Manage monthly bike subscriptions and payments</CardDescription>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus size={18} />
              New Subscription
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by registration number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val as any)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Form for new subscription */}
      {showForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Create New Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Bike</label>
                <Select onValueChange={(bikeId) => handleSubscribe(bikeId)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a bike..." />
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
              <div className="text-sm text-blue-900">
                Monthly subscription fee: <strong>MWK 50,000</strong>
              </div>
              <Button onClick={() => setShowForm(false)} variant="outline" className="w-full">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscriptions List */}
      <div className="space-y-3">
        {filteredSubscriptions.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              No subscriptions found
            </CardContent>
          </Card>
        ) : (
          filteredSubscriptions.map((subscription) => {
            const bike = mockBikes.find((b) => b.id === subscription.bikeId);
            const owner = mockOwners.find((o) => o.id === bike?.ownerId);

            return (
              <Card key={subscription.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">{bike?.registrationNumber}</p>
                        <p className="text-sm text-gray-600">
                          {bike?.make} {bike?.model} • {owner?.firstName} {owner?.lastName}
                        </p>
                      </div>
                      <Badge
                        variant={subscription.status === 'active' ? 'default' : 'destructive'}
                        className="gap-1"
                      >
                        {subscription.status === 'active' ? (
                          <>
                            <CheckCircle size={14} />
                            Active
                          </>
                        ) : (
                          <>
                            <Clock size={14} />
                            Expired
                          </>
                        )}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 py-3 border-y border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="text-sm font-medium">{subscription.subscriptionStartDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">End Date</p>
                        <p className="text-sm font-medium">{subscription.subscriptionEndDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Amount Paid</p>
                        <p className="text-sm font-medium">MWK {subscription.paidAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Payment Method</p>
                        <p className="text-sm font-medium capitalize">{subscription.paymentMethod.replace('_', ' ')}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye size={16} />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit2 size={16} />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleDelete(subscription.id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
