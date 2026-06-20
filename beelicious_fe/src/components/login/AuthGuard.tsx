'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.login.user);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    let currentUser = user;

    if (!currentUser && storedUser) {
      currentUser = JSON.parse(storedUser);
    }

    if (!currentUser) {
      router.replace('/');
      return;
    }

    if (currentUser.role !== 'admin') {
      router.replace('/');
      return;
    }

    setLoading(false);
  }, [user, router]);

  if (loading) return null;

  return <>{children}</>;
};

export default AdminGuard;
