
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export function useUserRole() {
  const { user } = useAuthContext();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('viewer'); // Default to viewer on error
        } else {
          setRole(data?.role || 'viewer');
        }
      } catch (error) {
        console.error('Unexpected error fetching role:', error);
        setRole('viewer'); // Default to viewer on error
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [user]);

  return { role, isAdmin: role === 'admin', loading };
}

export default useUserRole;
