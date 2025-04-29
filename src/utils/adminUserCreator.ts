
import { supabase } from '@/integrations/supabase/client';

export const createAdminUser = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('create_admin_user', {
      method: 'POST',
    });
    
    if (error) {
      console.error('Error creating admin user:', error);
      return { success: false, error };
    }
    
    console.log('Admin user creation response:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error creating admin user:', error);
    return { success: false, error };
  }
};
