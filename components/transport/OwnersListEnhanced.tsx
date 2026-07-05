'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { AlertCircle, Edit2, Loader, Plus, Search, Trash2 } from 'lucide-react';
import { transportService, type Owner } from '@/lib/api/transportService';

export function OwnersListEnhanced() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await transportService.listOwners();
        setOwners(response.results || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch owners';
        setError(message);
        console.error('[v0] Fetch owners error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwners();
  }, []);

  const filteredOwners = owners.filter(
    (owner) =>
      owner.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.phone_number.includes(searchTerm)
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this owner?')) return;

    try {
      await transportService.deleteOwner(id);
      setOwners(owners.filter((o) => o.id !== id));
    } catch (err) {
      console.error('[v0] Delete error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bike Owners</h2>
          <p className="text-gray-600 mt-1">Manage vehicle owners</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Add Owner
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search owners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Owners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Owners</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading owners...' : `Total owners: ${filteredOwners.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-5 w-5 animate-spin text-gray-400 mr-2" />
              <span className="text-gray-600">Loading owners...</span>
            </div>
          ) : filteredOwners.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No owners found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>National ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOwners.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell className="font-medium">
                        {owner.first_name} {owner.last_name}
                      </TableCell>
                      <TableCell>{owner.email}</TableCell>
                      <TableCell>{owner.phone_number}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {owner.national_id}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(owner.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
