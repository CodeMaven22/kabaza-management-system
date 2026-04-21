'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { BikeRegistrationForm } from '@/components/bikes/BikeRegistrationForm';
import { BikesList } from '@/components/bikes/BikesList';
import { mockBikes, mockOperators } from '@/lib/mockData';
import { BikeFormData, Bike } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BikesPage() {
  const [bikes, setBikes] = useState<Bike[]>(mockBikes);
  const [operators] = useState(mockOperators);

  const handleBikeRegistration = (formData: BikeFormData) => {
    const newBike: Bike = {
      id: `BIKE${String(bikes.length + 1).padStart(3, '0')}`,
      registrationNumber: `KBZ-${String(bikes.length + 1).padStart(3, '0')}-2024`,
      make: formData.make,
      model: formData.model,
      color: formData.color,
      engineNumber: formData.engineNumber,
      chassisNumber: formData.chassisNumber,
      registrationDate: new Date().toISOString().split('T')[0],
      operatorId: formData.operatorId,
      status: 'active',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      qrCode: `KBZ-${String(bikes.length + 1).padStart(3, '0')}-2024`,
    };

    setBikes([newBike, ...bikes]);
    alert(`Bike ${newBike.registrationNumber} registered successfully!`);
  };

  return (
    <DashboardLayout currentPage="bikes">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Bike Registration Management</h1>

        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Register Bike</TabsTrigger>
            <TabsTrigger value="list">View All Bikes</TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-6">
            <BikeRegistrationForm operators={operators} onSubmit={handleBikeRegistration} />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <BikesList bikes={bikes} operators={operators} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
