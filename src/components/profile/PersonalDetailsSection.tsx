
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPreferences } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { Loader2Icon, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PersonalDetailsSectionProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences | null>>;
}

const PersonalDetailsSection = ({ preferences, setPreferences }: PersonalDetailsSectionProps) => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setAvatarUrl(data.avatar_url);
          
          // Update preferences with profile data
          setPreferences(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              firstName: data.first_name || '',
              lastName: data.last_name || ''
            };
          });
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };
    
    loadProfileData();
  }, [user]);
  
  // Handle name changes
  const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
    if (field === 'firstName') {
      setFirstName(value);
    } else {
      setLastName(value);
    }
    
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };
  
  // Handle pronoun change
  const handlePronounChange = (value: string) => {
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        pronouns: value
      };
    });
  };
  
  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
      return;
    }
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    setUploading(true);
    
    try {
      // First check if storage bucket exists, if not create it
      const { data: buckets } = await supabase
        .storage
        .listBuckets();
      
      const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
      
      if (!avatarBucketExists) {
        const { error: bucketError } = await supabase
          .storage
          .createBucket('avatars', { public: true });
        
        if (bucketError) {
          throw bucketError;
        }
      }
      
      // Upload the file
      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const publicUrl = data.publicUrl;
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      setAvatarUrl(publicUrl);
      toast.success('Profile photo updated');
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile photo');
    } finally {
      setUploading(false);
    }
  };
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar className="h-20 w-20 border-2 border-purple-500/30">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="Profile picture" />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-xl">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
          
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
              <Loader2Icon className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
        
        <div>
          <Button 
            variant="outline" 
            className="relative border-white/10 text-white hover:bg-white/10"
            disabled={uploading}
          >
            <Input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleAvatarUpload}
              accept="image/*"
            />
            <Image className="mr-2 h-4 w-4" />
            Change Photo
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => handleNameChange('firstName', e.target.value)}
            className="bg-slate-950/50 border-white/10"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => handleNameChange('lastName', e.target.value)}
            className="bg-slate-950/50 border-white/10"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={user?.email || ''}
          readOnly
          className="bg-slate-950/50 border-white/10 text-white/50"
        />
        <p className="text-xs text-white/50">Email cannot be changed</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pronouns">Pronouns</Label>
        <Select 
          value={preferences.pronouns || 'not-specified'} 
          onValueChange={handlePronounChange}
        >
          <SelectTrigger className="bg-slate-950/50 border-white/10">
            <SelectValue placeholder="Select your pronouns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not-specified">Prefer not to say</SelectItem>
            <SelectItem value="she/her">She/Her</SelectItem>
            <SelectItem value="he/him">He/Him</SelectItem>
            <SelectItem value="they/them">They/Them</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        
        {preferences.pronouns === 'custom' && (
          <Input
            placeholder="Enter your custom pronouns"
            value={preferences.customPronouns || ''}
            onChange={(e) => setPreferences(prev => ({
              ...prev!,
              customPronouns: e.target.value
            }))}
            className="bg-slate-950/50 border-white/10 mt-2"
          />
        )}
      </div>
    </div>
  );
};

export default PersonalDetailsSection;
