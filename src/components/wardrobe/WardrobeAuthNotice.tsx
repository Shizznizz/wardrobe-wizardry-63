
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface WardrobeAuthNoticeProps {
  isAuthenticated: boolean;
}

const WardrobeAuthNotice = ({ isAuthenticated }: WardrobeAuthNoticeProps) => {
  if (isAuthenticated) {
    return null;
  }

  return (
    <Alert variant="warning" className="mb-6 bg-amber-900/20 border-amber-500/50">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Authentication Required</AlertTitle>
      <AlertDescription>
        Please log in to see your wardrobe items and save new ones.
      </AlertDescription>
    </Alert>
  );
};

export default WardrobeAuthNotice;
