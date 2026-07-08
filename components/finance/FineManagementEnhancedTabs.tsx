'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Loader, Search, DollarSign, CheckCircle, Lock, XCircle } from 'lucide-react';
import { financeService } from '@/lib/api/financeService';

type FineTab = 'unpaid' | 'paid' | 'confiscated';

interface Fine {
  id: number;
  vehicle: string;
  amount: number;
  status: string;
  reason_type: string;
  issued_date: string;
  is_confiscated: boolean;
  confiscated_at?: string;
  released_at?: string;
}

export function FineManagementEnhancedTabs() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<FineTab>('unpaid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await financeService.getAllFines();
      setFines(Array.isArray(response) ? response : response.results || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch fines';
      setError(message);
      console.error('[v0] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getReasonTypeColor = (reasonType: string) => {
    const colors: Record<string, string> = {
      EXPIRED: 'bg-orange-100 text-orange-800',
      NO_QR: 'bg-red-100 text-red-800',
      INVALID_QR: 'bg-red-100 text-red-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    return colors[reasonType] || 'bg-gray-100 text-gray-800';
  };

  const filteredFines = fines.filter((fine) => {
    let matchesTab = false;
    
    if (activeTab === 'unpaid') {
      matchesTab = fine.status === 'UNPAID' && !fine.is_confiscated;
    } else if (activeTab === 'paid') {
      matchesTab = fine.status === 'PAID';
    } else if (activeTab === 'confiscated') {
      matchesTab = fine.is_confiscated;
    }

    const matchesSearch = 
      fine.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const unpaidCount = fines.filter(f => f.status === 'UNPAID' && !f.is_confiscated).length;
  const paidCount = fines.filter(f => f.status === 'PAID').length;
  const confiscatedCount = fines.filter(f => f.is_confiscated).length;

  const unpaidTotal = fines
    .filter(f => f.status === 'UNPAID' && !f.is_confiscated)
    .reduce((sum, f) => sum + f.amount, 0);

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unpaid Fines</p>
                <p className="text-2xl font-bold text-red-600">{unpaidCount}</p>
                <p className="text-xs text-gray-500 mt-1">
                  MWK {unpaidTotal.toLocaleString()}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-300" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid Fines</p>
                <p className="text-2xl font-bold text-green-600">{paidCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-300" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confiscated Vehicles</p>
                <p className="text-2xl font-bold text-purple-600">{confiscatedCount}</p>
              </div>
              <Lock className="h-8 w-8 text-purple-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fines Management</CardTitle>
          <CardDescription>
            Track unpaid fines, paid fines, and confiscated vehicles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FineTab)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="unpaid" className="gap-2">
                <XCircle className="h-4 w-4" />
                Unpaid ({unpaidCount})
              </TabsTrigger>
              <TabsTrigger value="paid" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Paid ({paidCount})
              </TabsTrigger>
              <TabsTrigger value="confiscated" className="gap-2">
                <Lock className="h-4 w-4" />
                Confiscated ({confiscatedCount})
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-4">
              {/* Search */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by sticker code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={fetchFines} disabled={isLoading}>
                  {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : 'Refresh'}
                </Button>
              </div>

              {/* Table */}
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : filteredFines.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle (Sticker Code)</TableHead>
                        <TableHead>Fine Amount</TableHead>
                        <TableHead>Reason Type</TableHead>
                        <TableHead>Issued Date</TableHead>
                        {activeTab === 'confiscated' && (
                          <>
                            <TableHead>Confiscated Date</TableHead>
                            <TableHead>Released Date</TableHead>
                          </>
                        )}
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFines.map((fine) => (
                        <TableRow key={fine.id}>
                          <TableCell className="font-mono font-semibold">{fine.vehicle}</TableCell>
                          <TableCell>MWK {parseFloat(String(fine.amount)).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={getReasonTypeColor(fine.reason_type)}>
                              {fine.reason_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(fine.issued_date).toLocaleDateString()}
                          </TableCell>
                          {activeTab === 'confiscated' && (
                            <>
                              <TableCell>
                                {fine.confiscated_at 
                                  ? new Date(fine.confiscated_at).toLocaleDateString()
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                {fine.released_at 
                                  ? new Date(fine.released_at).toLocaleDateString()
                                  : 'Still Confiscated'}
                              </TableCell>
                            </>
                          )}
                          <TableCell className="text-right">
                            <Badge className={
                              fine.status === 'PAID' 
                                ? 'bg-green-100 text-green-800'
                                : fine.status === 'UNPAID' && fine.is_confiscated
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-red-100 text-red-800'
                            }>
                              {fine.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No fines found for this filter</p>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
