'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { OwnerProfile } from '@/components/owners/OwnerProfile';
import { mockOwners, mockBikes } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface OwnerDetailPageProps {
  params: { id: string };
}

export default function OwnerDetailPage({ params }: OwnerDetailPageProps) {
  const owner = mockOwners.find((o) => o.id === params.id);
  const ownerBikes = mockBikes.filter((b) => b.ownerId === params.id);

  if (!owner) {
    return (
      <ProtectedRoute>
        <DashboardLayout currentPage="owners">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Owner not found</p>
            <Link href="/owners">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Owners
              </Button>
            </Link>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="owners">
        <div className="space-y-6">
          <Link href="/owners">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Owners
            </Button>
          </Link>

          <OwnerProfile owner={owner} bikes={ownerBikes} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
