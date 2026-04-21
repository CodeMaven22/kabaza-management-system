'use client';

import { useState } from 'react';
import { PaymentFormData, Bike } from '@/lib/types';
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

interface PaymentFormProps {
  bikes: Bike[];
  onSubmit: (data: PaymentFormData) => void;
  isLoading?: boolean;
}

export function PaymentForm({ bikes, onSubmit, isLoading = false }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    bikeId: '',
    amount: 0,
    paymentMethod: 'cash',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      bikeId: value,
    }));
  };

  const handleMethodChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: value as 'cash' | 'mobile_money' | 'bank_transfer',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      bikeId: '',
      amount: 0,
      paymentMethod: 'cash',
      description: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Payment</CardTitle>
        <CardDescription>Record a new payment transaction</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bikeId">Bike Registration</Label>
            <Select value={formData.bikeId} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select bike" />
              </SelectTrigger>
              <SelectContent>
                {bikes.map((bike) => (
                  <SelectItem key={bike.id} value={bike.id}>
                    {bike.registrationNumber} - {bike.make} {bike.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (KES)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={handleMethodChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Registration fee, Annual renewal"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Processing...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
