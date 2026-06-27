'use client';

import { useState } from 'react';
import { OperatorFormData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface OperatorRegistrationFormProps {
  onSubmit: (data: OperatorFormData) => void;
  isLoading?: boolean;
}

export function OperatorRegistrationForm({
  onSubmit,
  isLoading = false,
}: OperatorRegistrationFormProps) {
  const [formData, setFormData] = useState<OperatorFormData>({
    fullName: '',
    phoneNumber: '',
    address: '',
    nationalId: '',
  });

  const [errors, setErrors] = useState<Partial<OperatorFormData>>({});
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const validateForm = () => {
    const newErrors: Partial<OperatorFormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.nationalId.trim()) newErrors.nationalId = 'National ID is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof OperatorFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
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
        fullName: '',
        phoneNumber: '',
        address: '',
        nationalId: '',
        photo: '',
      });
      setPhotoPreview('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register New Operator</CardTitle>
        <CardDescription>Fill in the operator/owner details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+265 888 123456"
                className={errors.phoneNumber ? 'border-red-500' : ''}
              />
              {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
            </div>
          </div>

          {/* National ID */}
          <div className="space-y-2">
            <Label htmlFor="nationalId">National ID *</Label>
            <Input
              id="nationalId"
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              placeholder="Enter national ID"
              className={errors.nationalId ? 'border-red-500' : ''}
            />
            {errors.nationalId && <p className="text-sm text-red-600">{errors.nationalId}</p>}
          </div>

          {/* Photo */}
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>

          {photoPreview && (
            <div className="space-y-2">
              <Label>Photo Preview</Label>
              <img src={photoPreview} alt="Operator preview" className="h-40 w-40 object-cover rounded-lg border border-gray-200" />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Registering...' : 'Register Operator'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
