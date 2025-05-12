
import React from 'react';
import { motion } from 'framer-motion';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';
import HeaderSection from '@/components/showroom/HeaderSection';
import ButtonSection from '@/components/showroom/ButtonSection';
import UserPhotoSection from '@/components/showroom/UserPhotoSection';
import OutfitSelectionSection from '@/components/showroom/OutfitSelectionSection';
import OutfitPreviewSection from '@/components/showroom/OutfitPreviewSection';
import PremiumFeaturesSection from '@/components/showroom/PremiumFeaturesSection';
import IntroductionSlider from '@/components/showroom/IntroductionSlider';
import ResultSection from '@/components/showroom/ResultSection';
import { useAuth } from '@/hooks/useAuth';
import { useShowroom } from '@/hooks/useShowroom';

const FittingRoom = () => {
  const { isAuthenticated, isPremiumUser } = useAuth();
  const effectivePremiumUser = isPremiumUser || isAuthenticated;
  
  const {
    userPhoto,
    isUploadLoading,
    isUsingOliviaImage,
    selectedOutfit,
    finalImage,
    clothingItems,
    fashionCollections,
    isProcessingTryOn,
    handleUserPhotoUpload,
    setShowOliviaImageGallery,
    handleSelectOutfit,
    handleSaveLook,
    handleSuggestAnotherOutfit,
    handleUpgradeToPremium
  } = useShowroom();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white pb-20">
      <EnhancedHeroSection
        title="Try On Your Wardrobe"
        subtitle="Upload a photo or use Olivia to see how clothes from your wardrobe look when styled together."
        image={{
          src: "/lovable-uploads/0e9ba14f-845b-4c56-a82c-5a616b0a3efb.png",
          alt: "Olivia in pink blouse and white pants",
          variant: "standing"
        }}
      />
      
      <div className="w-full mx-auto space-y-16 container px-4">
        <HeaderSection />
        
        <IntroductionSlider />
        
        <ButtonSection onSuggestAnotherOutfit={handleSuggestAnotherOutfit} />
        
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
            onUserPhotoChange={handleUserPhotoUpload}
            onShowOliviaImageGallery={() => setShowOliviaImageGallery(true)}
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
          onSelectOutfit={handleSelectOutfit}
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
            onSaveLook={handleSaveLook}
            onChangePhoto={() => {
              document.getElementById('photo-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
          
          <ResultSection
            finalImage={finalImage}
            selectedOutfit={selectedOutfit}
            onSuggestAnotherOutfit={handleSuggestAnotherOutfit}
          />
        </div>
        
        {!effectivePremiumUser && (
          <PremiumFeaturesSection 
            onUpgradeToPremium={handleUpgradeToPremium} 
          />
        )}
      </div>
    </div>
  );
};

export default FittingRoom;
