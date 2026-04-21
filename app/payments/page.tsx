'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { EnhancedPaymentForm } from '@/components/payments/EnhancedPaymentForm';
import { PaymentTracker } from '@/components/payments/PaymentTracker';
import { MonthlyPaymentHistory } from '@/components/payments/MonthlyPaymentHistory';
import { PaymentDashboard } from '@/components/payments/PaymentDashboard';
import { mockBikes, mockPayments } from '@/lib/mockData';
import { Payment } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

function PaymentsContent() {
  const [payments] = useState<Payment[]>(mockPayments);
  const [bikes] = useState(mockBikes);
  const [activeSubMenu, setActiveSubMenu] = useState<'record' | 'history' | 'monthly'>('record');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <DashboardLayout currentPage="payments">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-2">Record and track bike registration payments in MWK</p>
        </div>

        <PaymentDashboard payments={payments} />

        {/* Payment Submenu Dropdown */}
        <div className="relative inline-block">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Payment Options
            <ChevronDown size={18} className={`transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <button
                onClick={() => {
                  setActiveSubMenu('record');
                  setDropdownOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 hover:bg-gray-50 ${
                  activeSubMenu === 'record' ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                }`}
              >
                Record Payment
              </button>
              <button
                onClick={() => {
                  setActiveSubMenu('history');
                  setDropdownOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 hover:bg-gray-50 border-t border-gray-200 ${
                  activeSubMenu === 'history' ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                }`}
              >
                Payment History & Tracking
              </button>
              <button
                onClick={() => {
                  setActiveSubMenu('monthly');
                  setDropdownOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 hover:bg-gray-50 border-t border-gray-200 ${
                  activeSubMenu === 'monthly' ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                }`}
              >
                Monthly Payment Status
              </button>
            </div>
          )}
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {activeSubMenu === 'record' ? (
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Record Payment</h2>
                <EnhancedPaymentForm />
              </div>
            </Card>
          ) : activeSubMenu === 'history' ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History & Tracking</h2>
              <PaymentTracker />
            </div>
          ) : (
            <div>
              <MonthlyPaymentHistory />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function PaymentsPage() {
  return (
    <ProtectedRoute>
      <PaymentsContent />
    </ProtectedRoute>
  );
}
