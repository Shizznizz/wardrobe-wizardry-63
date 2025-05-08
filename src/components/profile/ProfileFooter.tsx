
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileFooterProps {
  isSaving: boolean;
  onSave: () => Promise<boolean>;
}

const ProfileFooter = ({ isSaving, onSave }: ProfileFooterProps) => {
  const handleSave = async () => {
    try {
      const success = await onSave();
      if (success) {
        toast.success("Your profile has been saved successfully!");
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Something went wrong while saving your profile");
    }
  };

  return (
    <div className="flex justify-end mt-8 pb-4">
      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
      >
        {isSaving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Save My Profile
      </Button>
    </div>
  );
};

export default ProfileFooter;
