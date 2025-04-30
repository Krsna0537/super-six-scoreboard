
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createAdminUser } from '@/utils/adminUserCreator';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminCreator = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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
    <div className="p-6 border rounded-md shadow-md mb-4 bg-white dark:bg-gray-900">
      <h3 className="text-xl font-semibold mb-4">Admin Access</h3>
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md">
          <h4 className="font-medium mb-2 text-amber-800 dark:text-amber-300">Security Notice</h4>
          <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
            This will create an admin user with preset credentials. This feature should only be used by the site owner.
          </p>
          <div className="text-sm bg-amber-100 dark:bg-amber-900/50 p-3 rounded-md mb-2">
            <p><strong>Email:</strong> admin@pro2.com</p>
            <p><strong>Password:</strong> Krsna@18</p>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-500">
            For security purposes, please change the password immediately after first login.
          </p>
        </div>
        
        <Button 
          onClick={() => setShowConfirmDialog(true)} 
          disabled={isCreating}
          variant="default"
          className="w-full"
        >
          {isCreating ? "Creating..." : "Create Admin User"}
        </Button>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Admin User?</AlertDialogTitle>
            <AlertDialogDescription>
              This will create an admin user with preset credentials. 
              This action is intended for the site owner only and should be used with caution.
              <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                <p><strong>Email:</strong> admin@pro2.com</p>
                <p><strong>Password:</strong> Krsna@18</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                handleCreateAdmin();
                setShowConfirmDialog(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCreator;
