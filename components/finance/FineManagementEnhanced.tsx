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
import { AlertCircle, Loader, Plus, X, AlertTriangle } from 'lucide-react';
import { financeService, Fine } from '@/lib/api/financeService';
import { canPerformAction } from '@/lib/api/financePermissions';
import { useAuth } from '@/lib/authContext';
import { formatCurrency, formatDate } from '@/lib/utils';

const fineTypeColors: Record<string, string> = {
  TRAFFIC_VIOLATION: 'bg-red-100 text-red-800',
  REGISTRATION_EXPIRED: 'bg-orange-100 text-orange-800',
  INSURANCE_EXPIRED: 'bg-yellow-100 text-yellow-800',
  OTHER: 'bg-gray-100 text-gray-800',
};

const statusColors: Record<string, string> = {
  OPEN: 'bg-red-100 text-red-800',
  PAID: 'bg-green-100 text-green-800',
  CONFISCATED: 'bg-purple-100 text-purple-800',
  DISPUTED: 'bg-blue-100 text-blue-800',
};

export function FineManagementEnhanced() {
  const { user } = useAuth();
  const [fines, setFines] = useState<Fine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('OPEN');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    fine_amount: '',
    fine_type: 'TRAFFIC_VIOLATION',
    description: '',
  });
  const [totalOutstanding, setTotalOutstanding] = useState(0);

  // Fetch fines on mount and when filters change
  useEffect(() => {
    const fetchFines = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await financeService.getAllFines({
          status: statusFilter || undefined,
        });
        setFines(response.results || []);
        
        // Calculate total outstanding fines
        const total = response.results
          .filter(fine => fine.status === 'OPEN')
          .reduce((sum, fine) => sum + fine.fine_amount, 0);
        setTotalOutstanding(total);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch fines';
        setError(message);
        console.error('[v0] Fetch fines error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFines();
  }, [statusFilter]);

  const handleCreateFine = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canPerformAction(user, 'canCreateFine')) {
      setError('You do not have permission to create fines');
      return;
    }

    try {
      setError(null);
      const newFine = await financeService.createFine({
        vehicle_id: parseInt(formData.vehicle_id),
        fine_amount: parseFloat(formData.fine_amount),
        fine_type: formData.fine_type as any,
        description: formData.description,
      });
      
      setFines([newFine, ...fines]);
      setFormData({
        vehicle_id: '',
        fine_amount: '',
        fine_type: 'TRAFFIC_VIOLATION',
        description: '',
      });
      setShowForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create fine';
      setError(message);
    }
  };

  const handleConfiscateVehicle = async (fineId: number) => {
    if (!canPerformAction(user, 'canConfiscateVehicle')) {
      setError('You do not have permission to confiscate vehicles');
      return;
    }

    try {
      const confiscatedFine = await financeService.confiscateVehicle(fineId, 'Vehicle confiscated due to outstanding fine');
      setFines(fines.map(f => f.id === fineId ? confiscatedFine : f));
      alert('Vehicle confiscated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to confiscate vehicle';
      setError(message);
    }
  };

  const filteredFines = fines.filter(fine => {
    const matchesSearch =
      fine.vehicle_id.toString().includes(searchTerm) ||
      fine.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fine Management</h1>
          <p className="text-gray-600 mt-2">Track and manage vehicle fines</p>
        </div>
        {canPerformAction(user, 'canCreateFine') && (
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus size={18} />
            New Fine
          </Button>
        )}
      </div>

      {/* Outstanding Fines Summary */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="h-5 w-5" />
            Outstanding Fines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-red-600">
            {formatCurrency(totalOutstanding)}
          </div>
          <p className="text-red-700 mt-2">From {fines.filter(f => f.status === 'OPEN').length} open fines</p>
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

      {/* Add Fine Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Issue New Fine</CardTitle>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateFine} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="text-sm font-medium text-gray-700">Fine Amount</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.fine_amount}
                    onChange={(e) => setFormData({ ...formData, fine_amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Fine Type</label>
                  <select
                    value={formData.fine_type}
                    onChange={(e) => setFormData({ ...formData, fine_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="TRAFFIC_VIOLATION">Traffic Violation</option>
                    <option value="REGISTRATION_EXPIRED">Registration Expired</option>
                    <option value="INSURANCE_EXPIRED">Insurance Expired</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the violation..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Issue Fine
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by vehicle ID or description..."
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
          <option value="OPEN">Open</option>
          <option value="PAID">Paid</option>
          <option value="CONFISCATED">Confiscated</option>
          <option value="DISPUTED">Disputed</option>
        </select>
      </div>

      {/* Fines Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fines</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading fines...' : `Total: ${filteredFines.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-5 w-5 animate-spin text-gray-400 mr-2" />
              <span className="text-gray-600">Loading fines...</span>
            </div>
          ) : filteredFines.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No fines found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFines.map((fine) => (
                    <TableRow key={fine.id}>
                      <TableCell className="font-medium">{fine.vehicle_id}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(fine.fine_amount)}</TableCell>
                      <TableCell>
                        <Badge className={fineTypeColors[fine.fine_type]}>
                          {fine.fine_type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(fine.issue_date)}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[fine.status]}>
                          {fine.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{fine.description}</TableCell>
                      <TableCell className="text-right">
                        {canPerformAction(user, 'canConfiscateVehicle') && fine.status === 'OPEN' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleConfiscateVehicle(fine.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Confiscate
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
