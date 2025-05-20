
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';

const AccountSettings = () => {
  const { user } = useAuth();
  const [isPasswordResetRequested, setIsPasswordResetRequested] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handlePasswordReset = async () => {
    try {
      setIsPasswordResetRequested(true);
      const { error } = await supabase.auth.resetPasswordForEmail(
        user?.email || '',
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );
      
      if (error) {
        throw error;
      }
      
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (error: any) {
      console.error("Failed to send password reset email:", error);
      toast.error("Failed to send password reset email. Please try again later.");
    } finally {
      setTimeout(() => setIsPasswordResetRequested(false), 3000);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      setIsDeleting(true);
      
      // First delete user data from all tables
      // This relies on cascade delete from auth.users to profiles table
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        throw error;
      }
      
      // Sign out the user
      await supabase.auth.signOut();
      
      toast.success("Your account has been deleted successfully.");
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (error: any) {
      console.error("Failed to delete account:", error);
      toast.error("Failed to delete your account. Please try again later.");
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Account Settings</h3>
        <p className="text-white/70 text-sm">
          Manage your account credentials and security preferences
        </p>
      </div>
      
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6 space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Email Address</p>
            <p className="text-white/80">{user?.email}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-4">Password</p>
            <Button 
              variant="outline" 
              onClick={handlePasswordReset}
              disabled={isPasswordResetRequested}
              className="bg-transparent border-white/20 hover:bg-white/10 text-white"
            >
              {isPasswordResetRequested ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Email Sent
                </>
              ) : "Reset Password"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6">
          <div className="space-y-2">
            <p className="font-medium text-white">Delete Account</p>
            <p className="text-sm text-white/70 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button 
              variant="destructive"
              className="bg-red-700 hover:bg-red-800"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              This action will permanently delete your account and all of your data including your wardrobe, outfits, and preferences. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteAccount();
              }}
              disabled={isDeleting}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : "Yes, delete my account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountSettings;
