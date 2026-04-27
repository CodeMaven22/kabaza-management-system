'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TransportLayout } from '@/components/TransportLayout';
import { OperatorsList } from '@/components/operators/OperatorsList';
import { mockOperators } from '@/lib/mockData';

function OperatorsContent() {
  return (
    <TransportLayout currentPage="operators">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operators & Riders</h1>
          <p className="text-gray-600 mt-2">Manage bike operators and their licenses</p>
        </div>
        <OperatorsList operators={mockOperators} />
      </div>
    </TransportLayout>
  );
}

export default function OperatorsPage() {
  return (
    <ProtectedRoute>
      <OperatorsContent />
    </ProtectedRoute>
  );
}
