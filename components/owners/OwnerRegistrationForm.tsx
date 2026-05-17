'use client';

import { useState } from 'react';
import { OwnerFormData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle } from 'lucide-react';

interface OwnerRegistrationFormProps {
  onSubmit?: (data: OwnerFormData) => void;
}

export function OwnerRegistrationForm({ onSubmit }: OwnerRegistrationFormProps) {
  const [formData, setFormData] = useState<OwnerFormData>({
    fullName: '',
    phoneNumber: '',
    nationalId: '',
    address: '',
  });

  const [errors, setErrors] = useState<Partial<OwnerFormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const validateForm = () => {
    const newErrors: Partial<OwnerFormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.nationalId.trim()) newErrors.nationalId = 'National ID is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      onSubmit?.(formData);
      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          fullName: '',
          phoneNumber: '',
          nationalId: '',
          address: '',
          photo: '',
        });
        setPhotoPreview('');
        setSubmitted(false);
      }, 2000);
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-green-800">
            <CheckCircle className="h-6 w-6" />
            <div>
              <p className="font-semibold">Owner registered successfully!</p>
              <p className="text-sm">The owner profile has been created.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Bike Owner</CardTitle>
        <CardDescription>Enter the details of the bike owner</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name *</label>
            <Input
              type="text"
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
              <label className="text-sm font-medium text-gray-700">Phone Number *</label>
              <Input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+265 888 123456"
                className={errors.phoneNumber ? 'border-red-500' : ''}
              />
              {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>

            {/* National ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">National ID *</label>
              <Input
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                placeholder="Enter national ID"
                className={errors.nationalId ? 'border-red-500' : ''}
              />
              {errors.nationalId && <p className="text-sm text-red-600">{errors.nationalId}</p>}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Address *</label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full address"
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
          </div>

          {/* Photo */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Photo</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>

          {photoPreview && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Photo Preview</label>
              <img src={photoPreview} alt="Owner preview" className="h-40 w-40 object-cover rounded-lg border border-gray-200" />
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Register Owner
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
