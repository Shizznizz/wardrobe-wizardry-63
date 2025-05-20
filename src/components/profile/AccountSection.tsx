
import React from 'react';
import { UserPreferences } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';
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

interface AccountSectionProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences | null>>;
}

const AccountSection: React.FC<AccountSectionProps> = ({ preferences, setPreferences }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  
  // Handle appearance preferences changes
  const handleAppearanceChange = (setting: 'theme' | 'highContrast' | 'reduceMotion', value: any) => {
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        appearanceSettings: {
          ...prev.appearanceSettings,
          [setting]: value
        }
      };
    });
  };
  
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Account Settings</h3>
        <p className="text-white/70 text-sm mb-4">
          Manage your account information and preferences
        </p>
      </div>
      
      {/* Account Information */}
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6 space-y-4">
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
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Email Address</p>
            <p className="text-sm text-white/60">{user?.email}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Appearance Settings */}
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6 space-y-6">
          <h3 className="text-md font-medium">Appearance</h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div>
              <Label className="font-medium text-white">Dark Mode</Label>
              <p className="text-sm text-white/70 mb-2 sm:mb-0">
                Permanent dark mode for an immersive experience
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-5 bg-gradient-to-r from-[#ff4ecb] to-[#a97eff] rounded-full relative">
                <div className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-glow"></div>
              </div>
              <span className="ml-3 text-white text-sm font-medium">Always On</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div>
              <Label className="font-medium text-white">UI Animation</Label>
              <p className="text-sm text-white/70 mb-2 sm:mb-0">
                Subtle animations and transitions
              </p>
            </div>
            <div className="flex items-center">
              <Switch 
                checked={!preferences.appearanceSettings?.reduceMotion}
                onCheckedChange={(checked) => handleAppearanceChange('reduceMotion', !checked)}
                className="data-[state=checked]:bg-purple-600"
              />
              <span className="ml-3 text-white text-sm font-medium">
                {preferences.appearanceSettings?.reduceMotion ? 'Disabled' : 'Enabled'}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div>
              <Label className="font-medium text-white">High Contrast</Label>
              <p className="text-sm text-white/70 mb-2 sm:mb-0">
                Enhanced visual contrast for better accessibility
              </p>
            </div>
            <div className="flex items-center">
              <Switch 
                checked={preferences.appearanceSettings?.highContrast || false}
                onCheckedChange={(checked) => handleAppearanceChange('highContrast', checked)}
                className="data-[state=checked]:bg-purple-600"
              />
              <span className="ml-3 text-white text-sm font-medium">
                {preferences.appearanceSettings?.highContrast ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Account Actions */}
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6 pt-4">
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            disabled={loggingOut}
            className="border-white/10 text-white hover:bg-white/10 hover:text-red-400"
          >
            {loggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
            Log out
          </Button>
        </CardContent>
      </Card>
      
      {/* Danger Zone */}
      <Card className="mt-6 bg-red-900/10 border-red-500/20">
        <CardContent className="p-6">
          <h3 className="text-red-400 font-medium mb-4">Danger Zone</h3>
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
    </div>
  );
};

export default AccountSection;
