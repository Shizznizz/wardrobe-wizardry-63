
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfileHeader = () => {
  const { user } = useAuth();
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user) return '';
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Avatar className="h-24 w-24 border-4 border-purple-500/30">
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-2xl">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-white/70 max-w-md">
          Customize your style preferences and personalize your Olivia experience
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
