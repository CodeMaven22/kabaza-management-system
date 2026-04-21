'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { OperatorProfile } from '@/components/operators/OperatorProfile';
import { mockOperators, mockBikes } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function OperatorProfilePage({ params }: { params: { id: string } }) {
  const operator = mockOperators.find((o) => o.id === params.id);

  if (!operator) {
    return (
      <DashboardLayout currentPage="operators">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Operator Not Found</h2>
          <Link href="/operators">
            <Button variant="outline">Back to Operators</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="operators">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/operators">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Operators
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Operator Profile</h1>
        </div>

        <OperatorProfile operator={operator} bikes={mockBikes} />
      </div>
    </DashboardLayout>
  );
}
