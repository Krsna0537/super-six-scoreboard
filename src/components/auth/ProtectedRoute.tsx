
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthProvider';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect after auth state is resolved and user is not logged in
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  // If requireAdmin is true, we will check the role in the respective component
  // This is a simple auth gate to ensure the user is logged in
  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
