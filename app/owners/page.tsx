'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { OwnerRegistrationForm } from '@/components/owners/OwnerRegistrationForm';
import { OwnersList } from '@/components/owners/OwnersList';
import { mockOwners } from '@/lib/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function OwnersContent() {
  const [owners] = useState(mockOwners);

  return (
    <DashboardLayout currentPage="owners">
      <div className="space-y-6">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">Owners List</TabsTrigger>
            <TabsTrigger value="register">Register Owner</TabsTrigger>
          </TabsList>

          {/* Owners List Tab */}
          <TabsContent value="list" className="mt-6">
            <OwnersList owners={owners} />
          </TabsContent>

          {/* Register Owner Tab */}
          <TabsContent value="register" className="mt-6">
            <OwnerRegistrationForm />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

export default function OwnersPage() {
  return (
    <ProtectedRoute>
      <OwnersContent />
    </ProtectedRoute>
  );
}
