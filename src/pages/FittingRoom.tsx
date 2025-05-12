
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PremiumFeaturesSection from '@/components/showroom/PremiumFeaturesSection';
import OutfitPreviewSection from '@/components/showroom/OutfitPreviewSection';
import ResultSection from '@/components/showroom/ResultSection';
import { useAuth } from '@/hooks/useAuth';
import { useShowroom } from '@/hooks/useShowroom';
import HowItWorksSection from '@/components/fitting-room/HowItWorksSection';
import PhotoUploadSection from '@/components/fitting-room/PhotoUploadSection';
import OutfitSelectionTabs from '@/components/fitting-room/OutfitSelectionTabs';
import OliviaRatingSection from '@/components/fitting-room/OliviaRatingSection';
import OutfitItemReplacement from '@/components/outfits/mix-match/OutfitItemReplacement';

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
    oliviaSuggestion,
    handleUserPhotoUpload,
    setShowOliviaImageGallery,
    handleSelectOutfit,
    handleSaveLook,
    handleSuggestAnotherOutfit,
    handleUpgradeToPremium,
    setSelectedOutfit
  } = useShowroom();

  // Handle replacing an item in the current outfit
  const handleReplaceItem = (oldItemId: string, newItemId: string) => {
    if (!selectedOutfit) return;
    
    // Create a new outfit with the replaced item
    const updatedOutfit = {
      ...selectedOutfit,
      items: selectedOutfit.items.map(itemId => 
        itemId === oldItemId ? newItemId : itemId
      )
    };
    
    // Update the selected outfit
    setSelectedOutfit(updatedOutfit);
    
    // This will trigger a new try-on with the updated outfit
    handleSelectOutfit(updatedOutfit);
  };

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
      
      <Container className="space-y-16 px-4">
        <HowItWorksSection />
        
        <div id="photo-section">
          <PhotoUploadSection 
            userPhoto={userPhoto} 
            isUploading={isUploadLoading}
            isUsingOliviaImage={isUsingOliviaImage}
            onUserPhotoChange={handleUserPhotoUpload}
            onShowOliviaImageGallery={() => setShowOliviaImageGallery(true)}
          />
        </div>
        
        <div className="flex items-center justify-center my-12">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent w-full max-w-2xl"></div>
        </div>
        
        <OutfitSelectionTabs 
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
          
          {finalImage && selectedOutfit && (
            <OliviaRatingSection 
              outfit={selectedOutfit}
              suggestion={oliviaSuggestion}
            />
          )}
          
          {finalImage && selectedOutfit && selectedOutfit.items && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <Card className="glass-dark border-white/10 overflow-hidden shadow-lg">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                    Customize This Look
                  </h3>
                  <p className="text-white/70 mb-6">
                    Replace individual items to create your perfect outfit
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedOutfit.items.map((itemId) => {
                      const item = clothingItems.find(i => i.id === itemId);
                      if (!item) return null;
                      
                      return (
                        <OutfitItemReplacement
                          key={item.id}
                          item={item}
                          onReplaceItem={handleReplaceItem}
                          category={item.type}
                        />
                      );
                    })}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
          
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
      </Container>
    </div>
  );
};

export default FittingRoom;
