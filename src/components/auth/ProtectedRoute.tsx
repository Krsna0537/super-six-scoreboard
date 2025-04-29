
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthProvider';
import useUserRole from '@/hooks/useUserRole';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading: authLoading } = useAuthContext();
  const { role, loading: roleLoading, isAdmin } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect after auth state is resolved and user is not logged in
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
      return;
    }

    // Check admin role if required
    if (!roleLoading && requireAdmin && !isAdmin) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate, requireAdmin, role, roleLoading, isAdmin]);

  // Show loading state while checking auth
  if (authLoading || roleLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  // If we require admin, check the role
  if (requireAdmin && !isAdmin) {
    return null;
  }

  // If user is logged in, render the children
  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
