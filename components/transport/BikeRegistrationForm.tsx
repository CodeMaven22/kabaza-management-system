'use client';

import { useState } from 'react';
import { BikeFormData, Operator, Owner } from '@/lib/types';
import { mockOwners } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BikeRegistrationFormProps {
  operators: Operator[];
  onSubmit: (data: BikeFormData) => void;
  isLoading?: boolean;
}

export function BikeRegistrationForm({
  operators,
  onSubmit,
  isLoading = false,
}: BikeRegistrationFormProps) {
  const owners = mockOwners;
  const [formData, setFormData] = useState<BikeFormData>({
    color: '',
    ownerId: '',
    operatorId: '',
    bikeType: 'motorbike',
    email: '',
    photo: '',
  });

  const [errors, setErrors] = useState<Partial<BikeFormData>>({});
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const validateForm = () => {
    const newErrors: Partial<BikeFormData> = {};

    if (!formData.color.trim()) newErrors.color = 'Color is required';
    if (!formData.ownerId.trim()) newErrors.ownerId = 'Owner is required';
    if (!formData.operatorId.trim()) newErrors.operatorId = 'Operator is required';
    if (!formData.bikeType) newErrors.bikeType = 'Bike type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof BikeFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field as keyof BikeFormData]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setFormData((prev) => ({
          ...prev,
          photo: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        color: '',
        ownerId: '',
        operatorId: '',
        bikeType: 'motorbike',
        email: '',
        photo: '',
      });
      setPhotoPreview('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register New Bike</CardTitle>
        <CardDescription>Fill in the bike details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bike Type */}
          <div className="space-y-2">
            <Label htmlFor="bikeType">Bike Type *</Label>
            <Select value={formData.bikeType} onValueChange={(value) => handleSelectChange('bikeType', value)}>
              <SelectTrigger className={errors.bikeType ? 'border-red-500' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="motorbike">Motorbike</SelectItem>
                <SelectItem value="bicycle">Bicycle</SelectItem>
              </SelectContent>
            </Select>
            {errors.bikeType && <p className="text-sm text-red-600">{errors.bikeType}</p>}
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color">Bike Color *</Label>
            <Input
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="e.g., Red, Blue, Black"
              className={errors.color ? 'border-red-500' : ''}
            />
            {errors.color && <p className="text-sm text-red-600">{errors.color}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Owner */}
            <div className="space-y-2">
              <Label htmlFor="ownerId">Bike Owner *</Label>
              <Select value={formData.ownerId} onValueChange={(value) => handleSelectChange('ownerId', value)}>
                <SelectTrigger className={errors.ownerId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((owner) => (
                    <SelectItem key={owner.id} value={owner.id}>
                      {owner.firstName} {owner.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ownerId && <p className="text-sm text-red-600">{errors.ownerId}</p>}
            </div>

            {/* Operator */}
            <div className="space-y-2">
              <Label htmlFor="operatorId">Operator (Rider) *</Label>
              <Select value={formData.operatorId} onValueChange={(value) => handleSelectChange('operatorId', value)}>
                <SelectTrigger className={errors.operatorId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((op) => (
                    <SelectItem key={op.id} value={op.id}>
                      {op.firstName} {op.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.operatorId && <p className="text-sm text-red-600">{errors.operatorId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="bike@example.com"
              />
            </div>

            {/* Photo */}
            <div className="space-y-2">
              <Label htmlFor="photo">Bike Photo</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </div>
          </div>

          {photoPreview && (
            <div className="space-y-2">
              <Label>Photo Preview</Label>
              <img src={photoPreview} alt="Bike preview" className="h-48 w-48 object-cover rounded-lg border border-gray-200" />
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> QR Code and Sticker Code (MH-K-XXXXXX) will be auto-generated by the system upon bike registration. Receipt will be printed automatically.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Registering...' : 'Register Bike'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
