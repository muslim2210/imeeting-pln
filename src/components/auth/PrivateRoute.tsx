'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/AuthContexts';
import Loader from '@/components/ui/Loader';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    
    if (!loading && user && requiredRole && user.role !== requiredRole) {
      router.push('/dashboard');
    }
  }, [user, loading, router, requiredRole]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;