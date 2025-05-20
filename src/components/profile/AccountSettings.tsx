
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AccountSettings = () => {
  const { user, signOut } = useAuth();
  const [isPasswordResetting, setIsPasswordResetting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handlePasswordReset = async () => {
    if (!user?.email) {
      toast.error("No email address found for your account");
      return;
    }
    
    try {
      setIsPasswordResetting(true);
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error("Password reset error:", error);
        toast.error("Failed to send password reset email. Please try again later.");
      } else {
        toast.success("Password reset email sent! Please check your inbox.");
      }
    } catch (error) {
      console.error("Password reset exception:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsPasswordResetting(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      setIsDeleting(true);
      
      // Delete user data from profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      if (profileError) {
        console.error("Error deleting profile:", profileError);
        toast.error("Failed to delete your profile data.");
        setIsDeleting(false);
        return;
      }
      
      // Delete user data from user_preferences
      const { error: prefError } = await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', user.id);
      
      if (prefError) {
        console.error("Error deleting preferences:", prefError);
        toast.error("Failed to delete your preference data.");
        setIsDeleting(false);
        return;
      }
      
      // Delete user account
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete your account. Please try again later.");
      } else {
        await signOut();
        toast.success("Your account has been successfully deleted.");
        // Redirect to homepage after a short delay
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      console.error("Delete account exception:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setDeleteConfirmation("");
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
              disabled={isPasswordResetting}
              className="bg-transparent border-white/20 hover:bg-white/10 text-white"
            >
              {isPasswordResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Email...
                </>
              ) : (
                "Reset Password"
              )}
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
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  className="bg-red-700 hover:bg-red-800"
                >
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-900 border-red-900/50">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center text-red-400">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Permanently Delete Your Account?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-white/70">
                    <p className="mb-4">
                      This action will permanently delete your account and all associated data including:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      <li>Your profile information</li>
                      <li>Your wardrobe items</li>
                      <li>Your outfits and style preferences</li>
                      <li>All historical data and settings</li>
                    </ul>
                    <p className="font-medium">This action cannot be undone.</p>
                    
                    <div className="mt-6">
                      <p className="mb-2">Type "DELETE" to confirm:</p>
                      <input
                        type="text"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-red-700/30 rounded text-white"
                        placeholder="DELETE"
                      />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deleteConfirmation !== "DELETE" || isDeleting}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteAccount();
                    }}
                    className="bg-red-700 hover:bg-red-800 text-white"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Forever"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
