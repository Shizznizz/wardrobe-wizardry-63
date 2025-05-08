
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface ProfileFooterProps {
  isSaving: boolean;
  onSave: () => Promise<boolean>;
}

const ProfileFooter = ({ isSaving, onSave }: ProfileFooterProps) => {
  return (
    <div className="flex justify-end mt-8 pb-4">
      <Button
        onClick={onSave}
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
