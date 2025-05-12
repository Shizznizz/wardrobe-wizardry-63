
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PremiumFeaturesSection from '@/components/showroom/PremiumFeaturesSection';
import { useAuth } from '@/hooks/useAuth';
import { useShowroom } from '@/hooks/useShowroom';
import HowItWorksSection from '@/components/fitting-room/HowItWorksSection';
import ModelSelectionSection from '@/components/fitting-room/ModelSelectionSection';
import OutfitSelectionSection from '@/components/fitting-room/OutfitSelectionSection';
import ResultPreviewSection from '@/components/fitting-room/ResultPreviewSection';
import OutfitCustomizationSection from '@/components/fitting-room/OutfitCustomizationSection';

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
    setSelectedOutfit,
    clearPhotos
  } = useShowroom();

  // Helper function to get clothing item by ID
  const getClothingItemById = (id: string) => {
    return clothingItems.find(item => item.id === id);
  };

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

  const handleStartOver = () => {
    // Clear photo and outfit selection
    clearPhotos();
    setSelectedOutfit(null);
  };

  const handleTryDifferentOutfit = () => {
    // Keep photo but clear outfit selection
    setSelectedOutfit(null);
    
    // Scroll to outfit selection section
    document.getElementById('outfit-selection-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
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
        {/* Step 1: How It Works Section */}
        <HowItWorksSection />
        
        {/* Step 2: Choose a Model Section */}
        <div id="model-selection-section">
          <ModelSelectionSection 
            userPhoto={userPhoto}
            isUploading={isUploadLoading}
            isUsingOliviaImage={isUsingOliviaImage}
            onUserPhotoChange={handleUserPhotoUpload}
            onShowOliviaImageGallery={() => setShowOliviaImageGallery(true)}
          />
        </div>
        
        {/* Divider */}
        {userPhoto && (
          <div className="flex items-center justify-center my-12">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent w-full max-w-2xl"></div>
          </div>
        )}
        
        {/* Step 3: Outfit Selection Section - only shown after photo is selected */}
        {userPhoto && (
          <div id="outfit-selection-section">
            <OutfitSelectionSection 
              isPremiumUser={effectivePremiumUser}
              onSelectOutfit={handleSelectOutfit}
            />
          </div>
        )}
        
        {/* Divider */}
        {userPhoto && selectedOutfit && (
          <div className="flex items-center justify-center my-12">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent w-full max-w-2xl"></div>
          </div>
        )}
        
        {/* Step 4: Result Preview Section - only shown after both photo and outfit are selected */}
        {userPhoto && selectedOutfit && (
          <div id="result-preview-section">
            <ResultPreviewSection 
              finalImage={finalImage}
              userPhoto={userPhoto}
              selectedOutfit={selectedOutfit}
              isProcessingTryOn={isProcessingTryOn}
              isUsingOliviaImage={isUsingOliviaImage}
              onSaveLook={handleSaveLook}
              onTryDifferentOutfit={handleTryDifferentOutfit}
              onStartOver={handleStartOver}
              oliviaSuggestion={oliviaSuggestion}
            />
          </div>
        )}
        
        {/* Step 5: Outfit Customization Section - only shown after result is visible */}
        {finalImage && selectedOutfit && (
          <div id="outfit-customization-section">
            <OutfitCustomizationSection
              selectedOutfit={selectedOutfit}
              onReplaceItem={handleReplaceItem}
            />
          </div>
        )}
        
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
