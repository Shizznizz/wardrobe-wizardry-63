
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileFooterProps {
  isSaving: boolean;
  onSave: () => Promise<boolean>;
  hasChanges: boolean;
}

const ProfileFooter = ({ isSaving, onSave, hasChanges }: ProfileFooterProps) => {
  const handleSave = async () => {
    try {
      const success = await onSave();
      if (success) {
        toast.success("Your profile has been updated successfully!");
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Something went wrong while saving your profile");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent md:sticky md:bottom-auto md:mt-8 md:pb-4 md:bg-transparent">
      <div className="flex justify-end max-w-5xl mx-auto w-full">
        <Button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white shadow-md transition-all"
          title={!hasChanges ? "No changes to save" : ""}
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save My Profile"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileFooter;
