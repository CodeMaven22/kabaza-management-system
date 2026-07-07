'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, AlertCircle } from 'lucide-react';
import { transportService, type CreateVehicleRequest, type Person } from '@/lib/api/transportService';

interface VehicleRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function VehicleRegistrationForm({ open, onOpenChange, onSuccess }: VehicleRegistrationFormProps) {
  const [formData, setFormData] = useState<any>({
    vehicle_type: 'bicycle',
    model: '',
    color: '',
    owner: 0,
    operator: 0,
    registration_number: '',
    year: new Date().getFullYear(),
    engine_number: '',
    chassis_number: '',
  });

  const [owners, setOwners] = useState<Person[]>([]);
  const [operators, setOperators] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load owners and operators on component mount
  useEffect(() => {
    if (open) {
      loadPersons();
    }
  }, [open]);

  const loadPersons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await transportService.listPersons();
      const persons = response.results || [];

      setOwners(persons.filter(p => p.role === 'vehicle_owner'));
      setOperators(persons.filter(p => p.role === 'driver'));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load persons';
      setError(message);
      console.error('[v0] Load persons error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'owner' || name === 'operator' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.registration_number || !formData.model || !formData.color) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.owner === 0 || formData.operator === 0) {
      setError('Please select both owner and operator');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      console.log('[v0] Creating vehicle with data:', formData);
      
      await transportService.createVehicle(formData);

      setSuccess(true);
      
      // Reset form
      setFormData({
        vehicle_type: 'bicycle',
        model: '',
        color: '',
        owner: 0,
        operator: 0,
        registration_number: '',
      });

      // Close dialog and notify parent
      setTimeout(() => {
        onOpenChange(false);
        onSuccess();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to register vehicle';
      setError(message);
      console.error('[v0] Create vehicle error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Register New Vehicle</DialogTitle>
          <DialogDescription>
            Add a new bicycle or motorbike to the system
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <div className="text-green-600 text-4xl mb-3">✓</div>
            <p className="font-semibold text-green-700">Vehicle registered successfully!</p>
            <p className="text-sm text-gray-600 mt-2">QR code and sticker code generated automatically</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type *
              </label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleInputChange}
                disabled={isSubmitting || isLoading}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bicycle">Bicycle</option>
                <option value="motorbike">Motorbike</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Number *
              </label>
              <input
                type="text"
                name="registration_number"
                placeholder="e.g., MH-01-AB-1234"
                value={formData.registration_number}
                onChange={handleInputChange}
                disabled={isSubmitting || isLoading}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model *
              </label>
              <input
                type="text"
                name="model"
                placeholder="e.g., Hero HF Deluxe"
                value={formData.model}
                onChange={handleInputChange}
                disabled={isSubmitting || isLoading}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color *
              </label>
              <input
                type="text"
                name="color"
                placeholder="e.g., Red"
                value={formData.color}
                onChange={handleInputChange}
                disabled={isSubmitting || isLoading}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                name="year"
                placeholder={String(new Date().getFullYear())}
                value={formData.year}
                onChange={handleInputChange}
                disabled={isSubmitting || isLoading}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Engine Number
              </label>
              <input
                type="text"
                name="engine_number"
                placeholder="Engine number"
                value={formData.engine_number}
                onChange={handleInputChange}
                disabled={isSubmitting || isLoading}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chassis Number
              </label>
              <input
                type="text"
                name="chassis_number"
                placeholder="Chassis number"
                value={formData.chassis_number}
                onChange={handleInputChange}
                disabled={isSubmitting || isLoading}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner *
              </label>
              <select
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                disabled={isSubmitting || isLoading}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Select Vehicle Owner</option>
                {owners.map(owner => (
                  <option key={owner.id} value={owner.id}>
                    {owner.full_name} ({owner.phone_number})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operator/Driver *
              </label>
              <select
                name="operator"
                value={formData.operator}
                onChange={handleInputChange}
                disabled={isSubmitting || isLoading}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Select Operator/Driver</option>
                {operators.map(operator => (
                  <option key={operator.id} value={operator.id}>
                    {operator.full_name} ({operator.phone_number})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="flex-1 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register Vehicle'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
