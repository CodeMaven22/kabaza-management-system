'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/transport');
  }, [router]);

  return (
    <ProtectedRoute>
      <div></div>
    </ProtectedRoute>
  );
}
