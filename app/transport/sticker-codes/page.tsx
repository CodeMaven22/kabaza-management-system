'use client';

import { TransportLayout } from '@/components/TransportLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StickerCodeManagement } from '@/components/transport/StickerCodeManagement';

function StickerCodesPage() {
  return (
    <TransportLayout currentPage="sticker-codes">
      <StickerCodeManagement />
    </TransportLayout>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <StickerCodesPage />
    </ProtectedRoute>
  );
}
