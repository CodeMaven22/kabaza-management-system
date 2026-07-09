'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Loader, Search, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { financeService, type Payment } from '@/lib/api/financeService';

type SubscriptionTab = 'paid' | 'unpaid';

interface Subscription {
  id: number;
  vehicle_id: number;
  vehicle: string;
  amount: number;
  payment_type: string;
  payment_method: string;
  payment_date: string;
  expiry_date: string;
  status: string;
}

export function SubscriptionManagementEnhanced() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<SubscriptionTab>('paid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await financeService.getAllPayments({
        payment_type: 'SUBSCRIPTION',
        page: 1,
      });
      const paymentsList = response?.results || (Array.isArray(response) ? response : []);
      setPayments(paymentsList as Payment[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch subscriptions';
      setError(message);
      console.error('[v0] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesTab = activeTab === 'paid' 
      ? payment.status === 'ACTIVE' && new Date(payment.expiry_date) > new Date()
      : payment.status === 'ACTIVE' && new Date(payment.expiry_date) <= new Date();
    
    const matchesSearch = 
      payment.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.vehicle_id.toString().includes(searchTerm);
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-900">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Subscriptions Management</CardTitle>
          <CardDescription>
            Monitor active and expired vehicle subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SubscriptionTab)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paid" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Active ({payments.filter(p => p.status === 'ACTIVE' && new Date(p.expiry_date) > new Date()).length})
              </TabsTrigger>
              <TabsTrigger value="unpaid" className="gap-2">
                <Clock className="h-4 w-4" />
                Expired ({payments.filter(p => p.status === 'ACTIVE' && new Date(p.expiry_date) <= new Date()).length})
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-4">
              {/* Search */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by sticker code or vehicle ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={fetchSubscriptions} disabled={isLoading}>
                  {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : 'Refresh'}
                </Button>
              </div>

              {/* Table */}
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : filteredPayments.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle (Sticker Code)</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment) => {
                        const isExpired = new Date(payment.expiry_date) <= new Date();
                        return (
                          <TableRow key={payment.id}>
                            <TableCell className="font-mono font-semibold">{payment.vehicle}</TableCell>
                            <TableCell>MWK {parseFloat(String(payment.amount)).toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{payment.payment_method}</Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(payment.payment_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {isExpired ? (
                                  <Clock className="h-4 w-4 text-orange-600" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                )}
                                {new Date(payment.expiry_date).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className={isExpired ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                                {isExpired ? 'Expired' : 'Active'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No subscriptions found for this filter</p>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
