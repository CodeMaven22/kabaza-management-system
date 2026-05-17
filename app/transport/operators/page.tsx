'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TransportLayout } from '@/components/TransportLayout';
import { OperatorRegistrationForm } from '@/components/operators/OperatorRegistrationForm';
import { OperatorsList } from '@/components/operators/OperatorsList';
import { OperatorsAnalytics } from '@/components/operators/OperatorsAnalytics';
import { mockOperators, mockBikes } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Search } from 'lucide-react';
import { OperatorFormData } from '@/lib/types';

function OperatorsContent() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOperators, setFilteredOperators] = useState(mockOperators);

  const handleOperatorSubmit = (formData: OperatorFormData) => {
    console.log('[v0] Operator registration submitted:', formData);
    alert('Operator registered successfully! License will be auto-generated.');
    setShowForm(false);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockOperators.filter((operator) =>
      operator.firstName.toLowerCase().includes(value.toLowerCase()) ||
      operator.lastName.toLowerCase().includes(value.toLowerCase()) ||
      operator.phoneNumber.includes(value)
    );
    setFilteredOperators(filtered);
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

        {/* Analytics */}
        <OperatorsAnalytics operators={mockOperators} bikes={mockBikes} />

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or phone number..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <OperatorsList operators={filteredOperators} />
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
