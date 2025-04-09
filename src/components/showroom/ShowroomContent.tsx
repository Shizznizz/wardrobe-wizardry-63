
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Outfit } from '@/lib/types';
import UserPhotoSection from './UserPhotoSection';
import OutfitSelectionSection from './OutfitSelectionSection';
import OutfitPreviewSection from './OutfitPreviewSection';
import PremiumFeaturesSection from './PremiumFeaturesSection';
import IntroductionSlider from './IntroductionSlider';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface ShowroomContentProps {
  userPhoto: string | null;
  isUploadLoading: boolean;
  isUsingOliviaImage: boolean;
  selectedOutfit: Outfit | null;
  finalImage: string | null;
  clothingItems: any[];
  fashionCollections: any[];
  isProcessingTryOn: boolean;
  isPremiumUser: boolean;
  onUserPhotoUpload: (photo: string) => void;
  onShowOliviaImageGallery: () => void;
  onSelectOutfit: (outfit: Outfit) => void;
  onSaveLook: () => void;
  onSuggestAnotherOutfit: () => void;
  onUpgradeToPremium: () => void;
}

const ShowroomContent = ({
  userPhoto,
  isUploadLoading,
  isUsingOliviaImage,
  selectedOutfit,
  finalImage,
  clothingItems,
  fashionCollections,
  isProcessingTryOn,
  isPremiumUser,
  onUserPhotoUpload,
  onShowOliviaImageGallery,
  onSelectOutfit,
  onSaveLook,
  onSuggestAnotherOutfit,
  onUpgradeToPremium
}: ShowroomContentProps) => {
  return (
    <div className="w-full mx-auto space-y-16">
      <div className="text-center mb-8">
        <motion.h1 
          className="text-3xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Virtual Try-On Studio
        </motion.h1>
        <motion.p 
          className="text-base md:text-lg text-white/80 mx-auto max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Upload your photo and discover how outfits look on you with our virtual try-on experience.
        </motion.p>
      </div>
      
      {/* Introduction Slider - replaces the static explanation section */}
      <IntroductionSlider />
      
      {/* New CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-center"
      >
        <Button 
          onClick={onSuggestAnotherOutfit}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white py-6 px-8 text-lg rounded-lg shadow-lg shadow-purple-500/20 group relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <Sparkles className="mr-2 h-5 w-5 text-yellow-200 animate-pulse" />
          <span>Get Styled Now</span>
          <span className="block text-xs font-normal mt-1 opacity-90 max-w-xs">
            Let Olivia recommend the perfect look based on your mood and local weather
          </span>
        </Button>
      </motion.div>
      
      <motion.div
        id="photo-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ display: finalImage ? 'none' : 'block' }}
        className="mt-12"
      >
        <UserPhotoSection 
          userPhoto={userPhoto} 
          isUploading={isUploadLoading}
          isUsingOliviaImage={isUsingOliviaImage}
          onUserPhotoChange={onUserPhotoUpload}
          onShowOliviaImageGallery={onShowOliviaImageGallery}
        />
      </motion.div>
      
      <div className="flex items-center justify-center my-12">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent w-full max-w-2xl"></div>
      </div>
      
      <OutfitSelectionSection 
        fashionCollections={fashionCollections}
        clothingItems={clothingItems}
        selectedOutfit={selectedOutfit}
        isPremiumUser={isPremiumUser}
        onSelectOutfit={onSelectOutfit}
      />
      
      <div className="flex items-center justify-center my-12">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent w-full max-w-2xl"></div>
      </div>
      
      <div id="preview-section" className="mt-12">
        <OutfitPreviewSection 
          finalImage={finalImage}
          selectedOutfit={selectedOutfit}
          clothingItems={clothingItems}
          isProcessingTryOn={isProcessingTryOn}
          userPhoto={userPhoto}
          isUsingOliviaImage={isUsingOliviaImage}
          onSaveLook={onSaveLook}
          onChangePhoto={() => {
            document.getElementById('photo-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        
        {finalImage && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-6"
          >
            <Button 
              onClick={onSuggestAnotherOutfit}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white"
            >
              👗 Try Another Outfit
            </Button>
          </motion.div>
        )}
      </div>
      
      {!isPremiumUser && (
        <PremiumFeaturesSection 
          onUpgradeToPremium={onUpgradeToPremium} 
        />
      )}
    </div>
  );
};

export default ShowroomContent;
