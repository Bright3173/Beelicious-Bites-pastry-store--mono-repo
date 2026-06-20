'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.login?.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.login?.user);
  console.log('AdminGuard user:', user);
  console.log(
    'Full login state:',
    useSelector((state: RootState) => state.login)
  );
  const router = useRouter();

  console.log('AdminGuard user:', user);

  useEffect(() => {
    isAuthenticated;
    if (user && user.role == 'admin') {
      router.push('/api/admin/dashboard');
    }
  }, [user, router]);
  if (!user || user.role !== 'admin') return null;
  return <>{children}</>;
}
