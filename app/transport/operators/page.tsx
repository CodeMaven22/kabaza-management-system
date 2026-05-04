'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TransportLayout } from '@/components/TransportLayout';
import { OperatorRegistrationForm } from '@/components/operators/OperatorRegistrationForm';
import { OperatorsList } from '@/components/operators/OperatorsList';
import { mockOperators } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { OperatorFormData } from '@/lib/types';

function OperatorsContent() {
  const [showForm, setShowForm] = useState(false);

  const handleOperatorSubmit = (formData: OperatorFormData) => {
    console.log('[v0] Operator registration submitted:', formData);
    alert('Operator registered successfully! License will be auto-generated.');
    setShowForm(false);
  };

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
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Register New Operator</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <OperatorRegistrationForm onSubmit={handleOperatorSubmit} />
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
