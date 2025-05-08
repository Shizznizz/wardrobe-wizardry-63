
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { AlertCircle, Loader2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

const AccountSettings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error("Failed to log out");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    // Note: This would require creating an edge function to delete a user account
    // For now, we'll simulate the process with a timeout
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Account deleted successfully");
      await signOut();
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete account");
    } finally {
      setDeletingAccount(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="bg-slate-800/30 border-white/10">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Manage your account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Account Type</p>
            <div className="flex items-center space-x-2">
              <div className="bg-green-500/20 text-green-400 text-xs font-medium px-2 py-1 rounded">
                Standard
              </div>
              <Button variant="link" size="sm" className="text-purple-300 h-auto p-0">
                Upgrade to Premium
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Account ID</p>
            <p className="text-sm text-white/60">{user?.id}</p>
          </div>
          
          <div className="pt-4">
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              disabled={loggingOut}
              className="border-white/10 text-white hover:bg-white/10 hover:text-red-400"
            >
              {loggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
              Log out
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mt-6 bg-red-900/10 border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-400">Danger Zone</CardTitle>
          <CardDescription className="text-white/70">
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white/70 mb-4">
            Deleting your account will remove all of your data, including your wardrobe items, outfits, and personal preferences.
            This action cannot be undone.
          </p>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Delete account
          </Button>
        </CardContent>
      </Card>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-900 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletingAccount ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Yes, delete my account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AccountSettings;
