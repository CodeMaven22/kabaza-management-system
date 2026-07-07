'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Loader, Plus, Search, Trash2, Edit2, Bike, Truck, Eye } from 'lucide-react';
import { transportService, type Vehicle } from '@/lib/api/transportService';
import { formatPhoneNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { VehicleRegistrationForm } from './VehicleRegistrationForm';
import { VehicleDetailModal } from './VehicleDetailModal';

type FilterTab = 'all' | 'bicycle' | 'motorbike';

export function VehicleManagementEnhanced() {
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchAllVehicles();
  }, []);

  const fetchAllVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await transportService.listVehicles();
      setAllVehicles(response.results || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch vehicles';
      setError(message);
      console.error('[v0] Fetch vehicles error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter vehicles based on active tab and search term
  const filteredVehicles = useMemo(() => {
    let filtered = allVehicles;
    
    // Filter by vehicle type/tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(vehicle => 
        vehicle.vehicle_type.toLowerCase() === activeTab.toLowerCase()
      );
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(vehicle => 
        vehicle.registration_number.toLowerCase().includes(searchLower) ||
        vehicle.sticker_code.includes(searchTerm.trim()) ||
        vehicle.model.toLowerCase().includes(searchLower) ||
        vehicle.color.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [allVehicles, activeTab, searchTerm]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      await transportService.deleteVehicle(id);
      setAllVehicles(allVehicles.filter((v) => v.id !== id));
    } catch (err) {
      console.error('[v0] Delete error:', err);
      setError('Failed to delete vehicle');
    }
  };

  const handleRegistrationSuccess = () => {
    // Refresh vehicle list
    fetchAllVehicles();
  };

  const handleViewDetails = (vehicleId: number, vehicle: Vehicle) => {
    // Store the vehicle data for the modal to access
    setSelectedVehicleId(vehicleId);
    // You might want to store the vehicle data in state if needed for the detail modal
    sessionStorage.setItem(`vehicle_${vehicleId}`, JSON.stringify(vehicle));
    setShowDetailModal(true);
  };

  const tabs: { label: string; value: FilterTab; icon: React.ReactNode }[] = [
    { label: 'All Vehicles', value: 'all', icon: <Truck size={16} /> },
    { label: 'Bicycles', value: 'bicycle', icon: <Bike size={16} /> },
    { label: 'Motorbikes', value: 'motorbike', icon: <Bike size={16} /> },
  ];

  const stats = {
    total: allVehicles.length,
    bicycles: allVehicles.filter((v) => v.vehicle_type.toLowerCase() === 'bicycle').length,
    motorbikes: allVehicles.filter((v) => v.vehicle_type.toLowerCase() === 'motorbike').length,
  };

  // Helper function to get vehicle type display name
  const getVehicleTypeDisplayName = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'bicycle':
        return 'Bicycle';
      case 'motorbike':
        return 'Motorbike';
      default:
        return type;
    }
  };

  // Helper function to get vehicle type badge color
  const getVehicleTypeBadgeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'bicycle':
        return 'bg-blue-100 text-blue-800';
      case 'motorbike':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get status badge color
  const getStatusBadgeColor = (status?: string): string => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Registration</h2>
          <p className="text-gray-600 mt-1">Manage bicycles and motorbikes</p>
        </div>
        <Button 
          onClick={() => setShowRegistrationForm(true)}
          className="gap-2"
        >
          <Plus size={18} />
          Register Vehicle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-gray-600 mt-1">Total Vehicles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.bicycles}</p>
              <p className="text-sm text-gray-600 mt-1">Bicycles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.motorbikes}</p>
              <p className="text-sm text-gray-600 mt-1">Motorbikes</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
                ? allVehicles.length 
                : allVehicles.filter(v => v.vehicle_type.toLowerCase() === tab.value.toLowerCase()).length}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
        <label htmlFor="search-vehicles" className="sr-only">Search vehicles</label>
        <Input
          id="search-vehicles"
          placeholder="Search by registration, sticker code, model, or color..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
          className="flex-1"
          aria-label="Search vehicles"
          title="Search vehicles"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'all' && 'All Vehicles'}
            {activeTab === 'bicycle' && 'Bicycles'}
            {activeTab === 'motorbike' && 'Motorbikes'}
          </CardTitle>
          <CardDescription>
            {isLoading ? 'Loading vehicles...' : `Showing ${filteredVehicles.length} of ${allVehicles.length} total`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-5 w-5 animate-spin text-gray-400 mr-2" aria-hidden="true" />
              <span className="text-gray-600">Loading vehicles...</span>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'No vehicles found matching your search' : `No ${activeTab === 'all' ? 'vehicles' : activeTab === 'bicycle' ? 'bicycles' : 'motorbikes'} yet`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Operator/Driver</TableHead>
                    <TableHead>Sticker Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.registration_number}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto font-normal hover:underline text-left"
                          onClick={() => handleViewDetails(vehicle.id, vehicle)}
                          title="View details"
                        >
                          <Badge className={getVehicleTypeBadgeColor(vehicle.vehicle_type)}>
                            {getVehicleTypeDisplayName(vehicle.vehicle_type)}
                          </Badge>
                        </Button>
                      </TableCell>
                      <TableCell className="text-sm">
                        {vehicle.owner?.full_name || '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {vehicle.operator?.full_name || '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto font-mono text-blue-600 hover:underline text-left"
                          onClick={() => handleViewDetails(vehicle.id, vehicle)}
                          title="View full details"
                        >
                          {vehicle.sticker_code}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(vehicle.status)}>
                          {vehicle.status 
                            ? vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)
                            : 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0" 
                            title="View details"
                            aria-label={`View details for ${vehicle.sticker_code}`}
                            onClick={() => handleViewDetails(vehicle.id, vehicle)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(vehicle.id)}
                            title="Delete"
                            aria-label={`Delete ${vehicle.sticker_code}`}
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

      {/* Registration Form Modal */}
      <VehicleRegistrationForm 
        open={showRegistrationForm}
        onOpenChange={setShowRegistrationForm}
        onSuccess={handleRegistrationSuccess}
      />

      {/* Detail Modal */}
      <VehicleDetailModal
        vehicleId={selectedVehicleId}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
      />
    </div>
  );
}
