import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, setLoading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Simulate checking token validity
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      setLoading(false);
      
      // In a real app, you'd validate the token here
      if (!token) {
        useAuthStore.getState().clearAuth();
      }
    };

    if (isLoading) {
      checkAuth();
    }
  }, [isLoading, setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}