'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Edit2, Loader, Plus, Search, Trash2, Users, User, Truck } from 'lucide-react';
import { transportService, type Person, type PersonRole, type PersonCreatePayload } from '@/lib/api/transportService';
import { formatPhoneNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type FilterTab = 'all' | 'vehicle_owner' | 'driver';

export function PersonManagementEnhanced() {
  const [allPersons, setAllPersons] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<PersonCreatePayload>({
    full_name: '',
    email: '',
    phone_number: '',
    national_id: '',
    address: '',
    role: 'vehicle_owner',
  });

  // Fetch all persons on component mount
  useEffect(() => {
    fetchAllPersons();
  }, []);

  const fetchAllPersons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await transportService.listPersons();
      setAllPersons(response.results || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch persons';
      setError(message);
      console.error('[v0] Fetch persons error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter persons based on active tab and search term
  const filteredPersons = useMemo(() => {
    let filtered = allPersons;
    
    // Filter by role/tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(person => person.role === activeTab);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(person => 
        person.full_name.toLowerCase().includes(searchLower) ||
        (person.email?.toLowerCase().includes(searchLower) || false) ||
        person.phone_number.includes(searchTerm.trim())
      );
    }
    
    return filtered;
  }, [allPersons, activeTab, searchTerm]);

  const handleCreatePerson = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.phone_number) {
      setError('Full name and phone number are required');
      return;
    }

    try {
      const response = await transportService.createPerson(formData);
      setAllPersons([response, ...allPersons]);
      
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        national_id: '',
        address: '',
        role: 'vehicle_owner',
      });
      setShowForm(false);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create person';
      setError(message);
      console.error('[v0] Create person error:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this person?')) return;

    try {
      await transportService.deletePerson(id);
      setAllPersons(allPersons.filter((p) => p.id !== id));
    } catch (err) {
      console.error('[v0] Delete error:', err);
      setError('Failed to delete person');
    }
  };

  const tabs: { label: string; value: FilterTab; icon: React.ReactNode }[] = [
    { label: 'All Users', value: 'all', icon: <Users size={16} /> },
    { label: 'Vehicle Owners', value: 'vehicle_owner', icon: <Truck size={16} /> },
    { label: 'Drivers/Operators', value: 'driver', icon: <User size={16} /> },
  ];

  const stats = {
    total: allPersons.length,
    owners: allPersons.filter((p) => p.role === 'vehicle_owner').length,
    drivers: allPersons.filter((p) => p.role === 'driver').length,
  };

  // Helper function to get role display name
  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'vehicle_owner':
        return 'Vehicle Owner';
      case 'driver':
        return 'Driver/Operator';
      default:
        return role;
    }
  };

  // Helper function to get role badge color
  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case 'vehicle_owner':
        return 'bg-green-100 text-green-800';
      case 'driver':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Persons Management</h2>
          <p className="text-gray-600 mt-1">Manage vehicle owners and drivers</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={18} />
          Add Person
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-gray-600 mt-1">Total Persons</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.owners}</p>
              <p className="text-sm text-gray-600 mt-1">Vehicle Owners</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.drivers}</p>
              <p className="text-sm text-gray-600 mt-1">Drivers/Operators</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Add New Person</CardTitle>
            <CardDescription>Create a new vehicle owner or driver</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePerson} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <Input
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <Input
                    placeholder="0987654321"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    placeholder="john@example.com"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                  <Input
                    placeholder="MZK123456789"
                    value={formData.national_id || ''}
                    onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <Input
                    placeholder="123 Main Street"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="user-type" className="block text-sm font-medium text-gray-700 mb-1">User Type *</label>
                  <select
                    id="user-type"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as PersonRole })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    title="Select the user type"
                    aria-label="User Type"
                  >
                    <option value="vehicle_owner">Vehicle Owner</option>
                    <option value="driver">Driver/Operator</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Person</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === tab.value
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            aria-label={`Filter by ${tab.label}`}
            title={`Filter by ${tab.label}`}
          >
            {tab.icon}
            {tab.label}
            <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {tab.value === 'all' 
                ? allPersons.length 
                : allPersons.filter(p => p.role === tab.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
        <label htmlFor="search-persons" className="sr-only">Search persons</label>
        <Input
          id="search-persons"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
          className="flex-1"
          aria-label="Search persons"
          title="Search persons"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Persons Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'all' && 'All Persons'}
            {activeTab === 'vehicle_owner' && 'Vehicle Owners'}
            {activeTab === 'driver' && 'Drivers/Operators'}
          </CardTitle>
          <CardDescription>
            {isLoading ? 'Loading persons...' : `Showing ${filteredPersons.length} of ${allPersons.length} total`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-5 w-5 animate-spin text-gray-400 mr-2" />
              <span className="text-gray-600">Loading persons...</span>
            </div>
          ) : filteredPersons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'No persons found matching your search' : 'No persons yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>National ID</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPersons.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-medium">{person.full_name}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(person.role)}>
                          {getRoleDisplayName(person.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>{person.email || '-'}</TableCell>
                      <TableCell>{formatPhoneNumber(person.phone_number)}</TableCell>
                      <TableCell className="text-sm text-gray-600">{person.national_id || '-'}</TableCell>
                      <TableCell className="text-sm text-gray-600">{person.address || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0" 
                            title="Edit"
                            aria-label={`Edit ${person.full_name}`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(person.id)}
                            title="Delete"
                            aria-label={`Delete ${person.full_name}`}
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
