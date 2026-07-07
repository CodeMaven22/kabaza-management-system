'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader, Download, Printer, X } from 'lucide-react';
import { transportService, type Vehicle } from '@/lib/api/transportService';

interface VehicleDetailModalProps {
  vehicleId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VehicleDetailModal({ vehicleId, open, onOpenChange }: VehicleDetailModalProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (open && vehicleId) {
      fetchVehicleDetails();
    }
  }, [open, vehicleId]);

  const fetchVehicleDetails = async () => {
    if (!vehicleId) return;

    try {
      setIsLoading(true);
      setError(null);
      // Try to get vehicle from sessionStorage first
      const storedVehicle = sessionStorage.getItem(`vehicle_${vehicleId}`);
      if (storedVehicle) {
        setVehicle(JSON.parse(storedVehicle));
      } else {
        console.log('[v0] Vehicle data for ID:', vehicleId);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch vehicle details';
      setError(message);
      console.error('[v0] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!vehicleId) return;

    try {
      setIsDownloading(true);
      setError(null);
      const blob = await transportService.downloadPDF(vehicleId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vehicle-${vehicleId}-registration.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to download PDF';
      setError(message);
      console.error('[v0] Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintSticker = async () => {
    if (!vehicleId) return;

    try {
      setIsPrinting(true);
      setError(null);
      await transportService.printSticker(vehicleId);
      // Show success message
      alert('Sticker print job initiated successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to print sticker';
      setError(message);
      console.error('[v0] Print error:', err);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Vehicle Details</DialogTitle>
          <DialogDescription>
            Registration and document information
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-5 w-5 animate-spin text-gray-400 mr-2" />
            <span className="text-gray-600">Loading details...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {vehicle && (
              <>
                {/* Vehicle Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Registration Number</p>
                    <p className="font-semibold text-gray-900">{vehicle.registration_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sticker Code</p>
                    <p className="font-semibold font-mono text-blue-600">{vehicle.sticker_code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vehicle Type</p>
                    <div className="mt-1">
                      <Badge className="bg-blue-100 text-blue-800">
                        {vehicle.vehicle_type}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Model</p>
                    <p className="font-semibold text-gray-900">{vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Color</p>
                    <p className="font-semibold text-gray-900">{vehicle.color}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="mt-1">
                      <Badge className={
                        vehicle.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }>
                        {vehicle.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Owner & Operator */}
                <div className="border-t pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Owner</p>
                    <p className="font-semibold text-gray-900">
                      {vehicle.owner?.full_name || 'N/A'}
                    </p>
                    {vehicle.owner?.phone_number && (
                      <p className="text-sm text-gray-600 mt-1">{vehicle.owner.phone_number}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Operator/Driver</p>
                    <p className="font-semibold text-gray-900">
                      {vehicle.operator?.full_name || 'N/A'}
                    </p>
                    {vehicle.operator?.phone_number && (
                      <p className="text-sm text-gray-600 mt-1">{vehicle.operator.phone_number}</p>
                    )}
                  </div>
                </div>

                {/* QR Code Display */}
                {vehicle.qr_code && (
                  <div className="border-t pt-4 text-center">
                    <p className="text-sm text-gray-600 mb-3">QR Code</p>
                    <img 
                      src={vehicle.qr_code} 
                      alt="QR Code" 
                      className="h-48 w-48 mx-auto border rounded"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="border-t pt-4 flex gap-3">
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="flex-1 gap-2"
                  >
                    {isDownloading ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Download PDF
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handlePrintSticker}
                    disabled={isPrinting}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    {isPrinting ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Printing...
                      </>
                    ) : (
                      <>
                        <Printer size={16} />
                        Print Sticker
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
