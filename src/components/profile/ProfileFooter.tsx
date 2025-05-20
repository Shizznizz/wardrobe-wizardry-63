
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface ProfileFooterProps {
  isSaving: boolean;
  onSave: () => Promise<boolean>;
  hasChanges: boolean;
}

const ProfileFooter = ({ isSaving, onSave, hasChanges }: ProfileFooterProps) => {
  const handleSave = async () => {
    if (isSaving) return;
    
    try {
      await onSave();
      // Success is handled in the onSave function
    } catch (error) {
      console.error('Error saving profile:', error);
      // Error is handled in the onSave function
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent md:sticky md:bottom-auto md:mt-8 md:pb-4 md:bg-transparent z-10">
      <div className="flex justify-end max-w-5xl mx-auto w-full">
        <Button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white shadow-md transition-all ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
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
