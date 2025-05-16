
import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClothingItem } from '@/lib/types';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';
import UploadModal from '@/components/UploadModal';
import { formatDistanceToNow } from 'date-fns';

interface WardrobeHeaderProps {
  onUpload: (item: ClothingItem) => void;
  clothingItems: ClothingItem[];
  isAuthenticated: boolean;
}

const WardrobeHeader = ({ onUpload, clothingItems, isAuthenticated }: WardrobeHeaderProps) => {
  const handleUploadNew = () => {
    // This is a placeholder function as the actual functionality is in the UploadModal component
  };

  // Find the most recently added item
  const getLastAddedItem = () => {
    if (!clothingItems || clothingItems.length === 0) return null;
    
    return clothingItems.reduce((newest, current) => {
      const newestDate = newest.dateAdded ? new Date(newest.dateAdded) : new Date(0);
      const currentDate = current.dateAdded ? new Date(current.dateAdded) : new Date(0);
      
      return currentDate > newestDate ? current : newest;
    }, clothingItems[0]);
  };

  const lastAddedItem = getLastAddedItem();
  const currentSeason = (() => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return "Spring";
    if (month >= 5 && month <= 7) return "Summer";
    if (month >= 8 && month <= 10) return "Fall";
    return "Winter";
  })();

  return (
    <>
      <EnhancedHeroSection
        title="Your Digital Wardrobe"
        subtitle="Elevate your style with our AI-powered wardrobe. Upload, organize, and rediscover your fashion favorites."
        image={{
          src: "/lovable-uploads/9d6d8627-f9d3-4af3-a5ec-7b2498799ab2.png",
          alt: "Woman in lilac open-back dress",
          variant: "portrait"
        }}
        buttons={[
          {
            label: "Add Clothing Item",
            onClick: handleUploadNew,
            variant: "primary",
            component: (
              <UploadModal onUpload={onUpload} buttonText="Add Clothing Item">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Clothing Item
                </Button>
              </UploadModal>
            )
          }
        ]}
      />

      {isAuthenticated && clothingItems.length > 0 && (
        <motion.div 
          className="container mx-auto px-4 text-center sm:text-left text-white/80 mt-2 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm">
            You have {clothingItems.length} item{clothingItems.length !== 1 ? 's' : ''} in your wardrobe.
            {lastAddedItem && lastAddedItem.dateAdded && (
              <> Last added: {lastAddedItem.name || lastAddedItem.type}, {formatDistanceToNow(new Date(lastAddedItem.dateAdded), { addSuffix: true })}.</>
            )}
          </p>
          <p className="text-sm text-purple-300/90 mt-1">
            {currentSeason} is here! Want to freshen up your outfit rotation?
          </p>
        </motion.div>
      )}
    </>
  );
};

export default WardrobeHeader;
