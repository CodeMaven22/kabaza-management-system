'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { FinanceLayout } from '@/components/shared/FinanceLayout';
import { FineManagementEnhanced } from '@/components/finance/FineManagementEnhanced';

function FinesContent() {
  return (
    <FinanceLayout currentPage="fines">
      <FineManagementEnhanced />
    </FinanceLayout>
  );
}

export default function FinesPage() {
  return (
    <ProtectedRoute>
      <FinesContent />
    </ProtectedRoute>
  );
}
