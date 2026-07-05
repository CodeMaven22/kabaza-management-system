'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { AlertCircle, Download, FileText, Loader, Plus, QrCode, Search } from 'lucide-react';
import { transportService, type Vehicle } from '@/lib/api/transportService';
import { useQRCodeGeneration, usePDFGeneration } from '@/lib/hooks/useCeleryTask';
import { useAuth } from '@/lib/authContext';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800',
};

export function VehiclesListEnhanced() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);

  const qrGeneration = useQRCodeGeneration(selectedVehicle);
  const pdfGeneration = usePDFGeneration(selectedVehicle);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await transportService.listVehicles({ search: searchTerm });
        setVehicles(response.results || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch vehicles';
        setError(message);
        console.error('[v0] Fetch vehicles error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [searchTerm]);

  const handleQRGenerate = async (vehicleId: number) => {
    setSelectedVehicle(vehicleId);
    try {
      const response = await transportService.generateQRCode(vehicleId);
      // Task will auto-poll in the hook
    } catch (err) {
      console.error('[v0] QR generation failed:', err);
    }
  };

  const handlePDFGenerate = async (vehicleId: number) => {
    setSelectedVehicle(vehicleId);
    try {
      const response = await transportService.generatePDF(vehicleId);
      // Task will auto-poll in the hook
    } catch (err) {
      console.error('[v0] PDF generation failed:', err);
    }
  };

  const handleDownloadPDF = async (vehicleId: number) => {
    try {
      const blob = await transportService.downloadPDF(vehicleId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vehicle-${vehicleId}.pdf`;
      a.click();
    } catch (err) {
      console.error('[v0] PDF download error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicles</h2>
          <p className="text-gray-600 mt-1">Manage and track registered vehicles</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Register Vehicle
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by registration number or sticker code..."
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
          <div>
            <p className="font-medium text-red-900">Error loading vehicles</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle List</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading vehicles...' : `Total vehicles: ${vehicles.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-5 w-5 animate-spin text-gray-400 mr-2" />
              <span className="text-gray-600">Loading vehicles...</span>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No vehicles found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registration</TableHead>
                    <TableHead>Sticker Code</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.registration_number}</TableCell>
                      <TableCell className="text-sm">{vehicle.sticker_code}</TableCell>
                      <TableCell className="text-sm">
                        {vehicle.owner.first_name} {vehicle.owner.last_name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {vehicle.operator.first_name} {vehicle.operator.last_name}
                      </TableCell>
                      <TableCell>{vehicle.vehicle_type}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[vehicle.status]}>
                          {vehicle.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleQRGenerate(vehicle.id)}
                            disabled={qrGeneration.isGenerating}
                            title="Generate QR Code"
                          >
                            {qrGeneration.isGenerating &&
                            selectedVehicle === vehicle.id ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <QrCode className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handlePDFGenerate(vehicle.id)}
                            disabled={pdfGeneration.isGenerating}
                            title="Generate PDF"
                          >
                            {pdfGeneration.isGenerating &&
                            selectedVehicle === vehicle.id ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDownloadPDF(vehicle.id)}
                            title="Download Certificate"
                          >
                            <Download className="h-4 w-4" />
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
