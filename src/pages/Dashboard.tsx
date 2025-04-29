
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Loader } from 'lucide-react';
import ViewerDashboard from './dashboards/ViewerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch user profile to determine role
  const { isLoading } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
      
      setUserRole(data?.role || 'viewer');
      return data;
    },
    enabled: !!user?.id,
  });

  if (authLoading || isLoading || !userRole) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  // Render dashboard based on user role
  if (userRole === 'admin') {
    return <AdminDashboard />;
  }

  return <ViewerDashboard />;
};

export default Dashboard;
