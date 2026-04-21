'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { OperatorRegistrationForm } from '@/components/operators/OperatorRegistrationForm';
import { OperatorsList } from '@/components/operators/OperatorsList';
import { mockOperators } from '@/lib/mockData';
import { OperatorFormData, Operator } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OperatorsPage() {
  const [operators, setOperators] = useState<Operator[]>(mockOperators);

  const handleOperatorRegistration = (formData: OperatorFormData) => {
    const newOperator: Operator = {
      id: `OP${String(operators.length + 1).padStart(3, '0')}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      idNumber: formData.idNumber,
      address: formData.address,
      city: formData.city,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      totalBikes: 0,
    };

    setOperators([...operators, newOperator]);
    alert(`Operator ${formData.firstName} ${formData.lastName} registered successfully!`);
  };

  return (
    <DashboardLayout currentPage="operators">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Operator Management</h1>

        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Register Operator</TabsTrigger>
            <TabsTrigger value="list">View All Operators</TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-6">
            <OperatorRegistrationForm onSubmit={handleOperatorRegistration} />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <OperatorsList operators={operators} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
