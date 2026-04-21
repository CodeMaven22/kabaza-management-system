'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { BikeDetail } from '@/components/bikes/BikeDetail';
import { mockBikes, mockOperators } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BikeDetailPage({ params }: { params: { id: string } }) {
  const bike = mockBikes.find((b) => b.id === params.id);
  const operator = mockOperators.find((o) => o.id === bike?.operatorId);

  if (!bike) {
    return (
      <DashboardLayout currentPage="bikes">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bike Not Found</h2>
          <Link href="/bikes">
            <Button variant="outline">Back to Bikes</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="bikes">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/bikes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bikes
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Bike Details</h1>
        </div>

        <BikeDetail bike={bike} operator={operator} />
      </div>
    </DashboardLayout>
  );
}
