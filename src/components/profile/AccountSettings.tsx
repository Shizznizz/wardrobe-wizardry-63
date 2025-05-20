
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const AccountSettings = () => {
  const { user } = useAuth();
  
  const handlePasswordReset = async () => {
    try {
      // This would be implemented with Supabase's password reset flow
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (error) {
      toast.error("Failed to send password reset email. Please try again later.");
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
              className="bg-transparent border-white/20 hover:bg-white/10 text-white"
            >
              Reset Password
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
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
