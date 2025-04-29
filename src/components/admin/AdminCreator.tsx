
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createAdminUser } from '@/utils/adminUserCreator';
import { useToast } from '@/hooks/use-toast';

const AdminCreator = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  
  const handleCreateAdmin = async () => {
    setIsCreating(true);
    
    try {
      const result = await createAdminUser();
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Admin user created successfully. You can now login with admin@pro2.com and the specified password.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error?.message || "Failed to create admin user. See console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. See console for details.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="p-4 border rounded-md shadow-sm mb-4">
      <h3 className="font-semibold mb-2">Admin User Creation</h3>
      <p className="text-sm mb-4">
        This will create an admin user with email <strong>admin@pro2.com</strong> and the specified password.
      </p>
      <Button 
        onClick={handleCreateAdmin} 
        disabled={isCreating}
      >
        {isCreating ? "Creating..." : "Create Admin User"}
      </Button>
    </div>
  );
};

export default AdminCreator;
