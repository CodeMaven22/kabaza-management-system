'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TransportLayout } from '@/components/TransportLayout';
import { OperatorsList } from '@/components/operators/OperatorsList';
import { mockOperators } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

function OperatorsContent() {
  const [showForm, setShowForm] = useState(false);

  return (
    <TransportLayout currentPage="operators">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Operators & Riders</h1>
            <p className="text-gray-600 mt-2">Manage bike operators and their licenses</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus size={18} />
            Add Operator
          </Button>
        </div>
        {showForm && (
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900">Operator registration form will appear here</p>
          </div>
        )}
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
