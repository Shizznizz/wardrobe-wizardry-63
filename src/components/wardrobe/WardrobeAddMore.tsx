
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClothingItem } from '@/lib/types';
import UploadModal from '@/components/UploadModal';

interface WardrobeAddMoreProps {
  onUpload: (item: ClothingItem) => void;
  isAuthenticated: boolean;
  isLoadingItems: boolean;
  hasItems: boolean;
}

const WardrobeAddMore = ({ 
  onUpload, 
  isAuthenticated, 
  isLoadingItems, 
  hasItems 
}: WardrobeAddMoreProps) => {
  if (!isAuthenticated || isLoadingItems || !hasItems) {
    return null;
  }

  return (
    <div className="mt-12 py-8 border-t border-white/10 text-center">
      <h3 className="text-lg font-medium text-white mb-4">Want to add more to your wardrobe?</h3>
      <UploadModal onUpload={onUpload}>
        <Button
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Clothing Item
        </Button>
      </UploadModal>
    </div>
  );
};

export default WardrobeAddMore;
