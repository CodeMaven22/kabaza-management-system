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
    make: '',
    model: '',
    color: '',
    engineNumber: '',
    chassisNumber: '',
    ownerId: '',
    operatorId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      operatorId: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      make: '',
      model: '',
      color: '',
      engineNumber: '',
      chassisNumber: '',
      operatorId: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register New Bike</CardTitle>
        <CardDescription>Fill in the bike details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                name="make"
                value={formData.make}
                onChange={handleChange}
                placeholder="e.g., Honda"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g., CG 125"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g., Red"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerId">Bike Owner *</Label>
              <Select value={formData.ownerId} onValueChange={(value) => setFormData(prev => ({ ...prev, ownerId: value }))}>
                <SelectTrigger>
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operatorId">Operator (Rider) *</Label>
              <Select value={formData.operatorId} onValueChange={handleSelectChange}>
                <SelectTrigger>
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="engineNumber">Engine Number</Label>
              <Input
                id="engineNumber"
                name="engineNumber"
                value={formData.engineNumber}
                onChange={handleChange}
                placeholder="Engine number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chassisNumber">Chassis Number</Label>
              <Input
                id="chassisNumber"
                name="chassisNumber"
                value={formData.chassisNumber}
                onChange={handleChange}
                placeholder="Chassis number"
                required
              />
            </div>
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
