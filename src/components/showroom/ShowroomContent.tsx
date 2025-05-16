
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Outfit } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

// Import refactored components
import HeaderSection from './HeaderSection';
import ButtonSection from './ButtonSection';
import UserPhotoSection from './UserPhotoSection';
import OutfitSelectionSection from './OutfitSelectionSection';
import OutfitPreviewSection from './OutfitPreviewSection';
import PremiumFeaturesSection from './PremiumFeaturesSection';
import IntroductionSlider from './IntroductionSlider';
import ResultSection from './ResultSection';

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
  const { isAuthenticated } = useAuth();
  const effectivePremiumUser = isPremiumUser || isAuthenticated;
  
  return (
    <div className="w-full mx-auto space-y-16">
      <HeaderSection />
      
      <IntroductionSlider />
      
      <ButtonSection onSuggestAnotherOutfit={onSuggestAnotherOutfit} />
      
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
        isPremiumUser={effectivePremiumUser}
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
        
        <ResultSection
          finalImage={finalImage}
          selectedOutfit={selectedOutfit}
          onSuggestAnotherOutfit={onSuggestAnotherOutfit}
        />
      </div>
      
      {/* Only show compact premium features prompt here */}
      {!effectivePremiumUser && (
        <div className="text-center py-4">
          <button 
            onClick={onUpgradeToPremium} 
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-purple-900/50 hover:bg-purple-800/50 text-purple-100 rounded-full border border-purple-500/30 transition-all"
          >
            <span className="text-yellow-400 text-xs">✨</span> Unlock all premium features
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowroomContent;
