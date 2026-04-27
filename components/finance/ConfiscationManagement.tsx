'use client';

import { useState } from 'react';
import { Confiscation, Bike } from '@/lib/types';
import { mockConfiscations, mockBikes, mockUsers } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Eye, Trash2, Lock } from 'lucide-react';

export function ConfiscationManagement() {
  const [confiscations, setConfiscations] = useState<Confiscation[]>(mockConfiscations);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedConfiscation, setSelectedConfiscation] = useState<Confiscation | null>(null);
  const [newConfiscation, setNewConfiscation] = useState({
    bikeId: '',
    reason: '',
    storageLocation: '',
    fine: '',
    notes: '',
  });

  const filteredConfiscations = confiscations.filter(
    (c) =>
      c.bikeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateConfiscation = () => {
    if (!newConfiscation.bikeId || !newConfiscation.reason || !newConfiscation.storageLocation) {
      alert('Please fill in all required fields');
      return;
    }

    const bike = mockBikes.find((b) => b.id === newConfiscation.bikeId);
    if (!bike) {
      alert('Bike not found');
      return;
    }

    const confiscation: Confiscation = {
      id: `CONF${String(confiscations.length + 1).padStart(3, '0')}`,
      bikeId: newConfiscation.bikeId,
      reason: newConfiscation.reason,
      confiscatedDate: new Date().toISOString().split('T')[0],
      confiscatedBy: 'USR001',
      storageLocation: newConfiscation.storageLocation,
      status: 'confiscated',
      fine: newConfiscation.fine ? parseInt(newConfiscation.fine) : 0,
      notes: newConfiscation.notes,
    };

    setConfiscations([confiscation, ...confiscations]);
    setNewConfiscation({ bikeId: '', reason: '', storageLocation: '', fine: '', notes: '' });
    setShowForm(false);
    alert('Bike confiscated successfully!');
  };

  const handleRelease = (id: string) => {
    if (confirm('Release this confiscated bike?')) {
      setConfiscations(
        confiscations.map((c) =>
          c.id === id
            ? {
                ...c,
                status: 'released',
                releaseDate: new Date().toISOString().split('T')[0],
              }
            : c
        )
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this confiscation record?')) {
      setConfiscations(confiscations.filter((c) => c.id !== id));
    }
  };

  const activeConfiscations = confiscations.filter((c) => c.status === 'confiscated');
  const releasedBikes = confiscations.filter((c) => c.status === 'released');
  const totalFines = confiscations.filter((c) => c.fine).reduce((sum, c) => sum + (c.fine || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Confiscation Management</h2>
          <p className="text-gray-600">Track confiscated bikes and manage releases</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={18} />
          Confiscate Bike
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Confiscations</p>
                <p className="text-2xl font-bold text-red-600">{activeConfiscations.length}</p>
              </div>
              <Lock className="text-red-600" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Released Bikes</p>
                <p className="text-2xl font-bold text-green-600">{releasedBikes.length}</p>
              </div>
              <Lock className="text-green-600" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Total Fines (MWK)</p>
              <p className="text-2xl font-bold">{totalFines.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confiscation Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Confiscate Bike</CardTitle>
            <CardDescription>Record a new bike confiscation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bikeId">Select Bike *</Label>
                <Select value={newConfiscation.bikeId} onValueChange={(value) => setNewConfiscation({ ...newConfiscation, bikeId: value })}>
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
                <Label htmlFor="reason">Reason for Confiscation *</Label>
                <Input
                  id="reason"
                  placeholder="e.g., Outstanding fines"
                  value={newConfiscation.reason}
                  onChange={(e) => setNewConfiscation({ ...newConfiscation, reason: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Storage Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Lilongwe Police Station - Lot A"
                  value={newConfiscation.storageLocation}
                  onChange={(e) => setNewConfiscation({ ...newConfiscation, storageLocation: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fine">Associated Fine (MWK)</Label>
                <Input
                  id="fine"
                  type="number"
                  placeholder="0"
                  value={newConfiscation.fine}
                  onChange={(e) => setNewConfiscation({ ...newConfiscation, fine: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about the confiscation..."
                value={newConfiscation.notes}
                onChange={(e) => setNewConfiscation({ ...newConfiscation, notes: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateConfiscation} variant="default">
                Confiscate Bike
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <Input
          placeholder="Search by bike ID or reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Details Modal */}
      {selectedConfiscation && (
        <Card className="border-2 border-red-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Lock size={24} className="text-red-600" />
                  {selectedConfiscation.id}
                </CardTitle>
                <CardDescription>Confiscation Details</CardDescription>
              </div>
              <Button
                onClick={() => setSelectedConfiscation(null)}
                variant="ghost"
                className="text-gray-500"
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Bike</p>
                <p className="font-semibold">{mockBikes.find((b) => b.id === selectedConfiscation.bikeId)?.registrationNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  selectedConfiscation.status === 'confiscated'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {selectedConfiscation.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Reason</p>
                <p className="font-semibold">{selectedConfiscation.reason}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fine</p>
                <p className="font-semibold">MWK {(selectedConfiscation.fine || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Confiscated Date</p>
                <p className="font-semibold">{selectedConfiscation.confiscatedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Storage Location</p>
                <p className="font-semibold">{selectedConfiscation.storageLocation}</p>
              </div>
            </div>
            {selectedConfiscation.notes && (
              <div>
                <p className="text-sm text-gray-600">Notes</p>
                <p className="font-semibold">{selectedConfiscation.notes}</p>
              </div>
            )}
            {selectedConfiscation.releaseDate && (
              <div>
                <p className="text-sm text-gray-600">Release Date</p>
                <p className="font-semibold">{selectedConfiscation.releaseDate}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confiscations List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Confiscations ({filteredConfiscations.length})</h3>
        <div className="grid gap-4">
          {filteredConfiscations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No confiscations found</p>
              </CardContent>
            </Card>
          ) : (
            filteredConfiscations.map((confiscation) => {
              const bike = mockBikes.find((b) => b.id === confiscation.bikeId);
              const confiscator = mockUsers.find((u) => u.id === confiscation.confiscatedBy);
              return (
                <Card key={confiscation.id} className={confiscation.status === 'confiscated' ? 'border-red-200' : 'border-green-200'}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Lock size={20} className={confiscation.status === 'confiscated' ? 'text-red-600' : 'text-green-600'} />
                          <p className="font-semibold">{bike?.registrationNumber}</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            confiscation.status === 'confiscated'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {confiscation.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{confiscation.reason}</p>
                        <p className="text-xs text-gray-500">
                          Location: {confiscation.storageLocation} | Fine: MWK {(confiscation.fine || 0).toLocaleString()} | By: {confiscator?.username}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedConfiscation(confiscation)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Eye size={16} />
                          View
                        </Button>
                        {confiscation.status === 'confiscated' && (
                          <Button
                            onClick={() => handleRelease(confiscation.id)}
                            variant="default"
                            size="sm"
                            className="gap-2"
                          >
                            Release
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDelete(confiscation.id)}
                          variant="destructive"
                          size="sm"
                          className="gap-2"
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
    </div>
  );
}
