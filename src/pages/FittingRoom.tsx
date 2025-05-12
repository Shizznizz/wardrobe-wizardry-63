
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
import OutfitCarousel from '@/components/fitting-room/OutfitCarousel';
import { toast } from 'sonner';
import { Outfit } from '@/lib/types';

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

  // Sample outfits for Olivia's Styles section
  const oliviaStyles: Outfit[] = [
    {
      id: 'olivia-style-1',
      name: 'Spring Elegance',
      items: ['item-1', 'item-2', 'item-3'],
      seasons: ['spring'],
      occasions: ['casual', 'brunch'],
      favorite: false,
      dateAdded: new Date()
    },
    {
      id: 'olivia-style-2',
      name: 'Summer Vibes',
      items: ['item-4', 'item-5', 'item-6'],
      seasons: ['summer'],
      occasions: ['beach', 'vacation'],
      favorite: false,
      dateAdded: new Date()
    },
    {
      id: 'olivia-style-3',
      name: 'Fall Classic',
      items: ['item-7', 'item-8', 'item-9'],
      seasons: ['autumn'], // Changed from 'fall' to 'autumn' to match ClothingSeason type
      occasions: ['office', 'dinner'],
      favorite: false,
      dateAdded: new Date()
    },
    {
      id: 'olivia-style-4',
      name: 'Winter Chic',
      items: ['item-10', 'item-11', 'item-12'],
      seasons: ['winter'],
      occasions: ['evening', 'formal'],
      favorite: true,
      dateAdded: new Date()
    }
  ];

  // Sample outfits for Popular in the Community section
  const communityOutfits: Outfit[] = [
    {
      id: 'community-1',
      name: 'Trending Style',
      items: ['item-13', 'item-14', 'item-15'],
      seasons: ['all'],
      occasions: ['casual', 'weekend'],
      favorite: false,
      dateAdded: new Date()
    },
    {
      id: 'community-2',
      name: 'Office Ready',
      items: ['item-16', 'item-17', 'item-18'],
      seasons: ['autumn', 'winter'], // Changed from 'fall' to 'autumn' to match ClothingSeason type
      occasions: ['business', 'formal'],
      favorite: false,
      dateAdded: new Date()
    },
    {
      id: 'community-3',
      name: 'Date Night',
      items: ['item-19', 'item-20', 'item-21'],
      seasons: ['all'],
      occasions: ['date', 'evening'],
      favorite: true,
      dateAdded: new Date()
    },
    {
      id: 'community-4',
      name: 'Weekend Casual',
      items: ['item-22', 'item-23', 'item-24'],
      seasons: ['spring', 'summer'],
      occasions: ['casual', 'outdoor'],
      favorite: false,
      dateAdded: new Date()
    }
  ];

  const handleTryOutfit = (outfit: Outfit) => {
    if (!userPhoto) {
      toast.error("Please upload a photo first");
      
      // Scroll to model selection section to prompt the user
      document.getElementById('model-selection-section')?.scrollIntoView({
        behavior: 'smooth'
      });
      return;
    }

    handleSelectOutfit(outfit);
    
    // Scroll to result section
    setTimeout(() => {
      document.getElementById('result-preview-section')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
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
        
        {/* New Section 1: Olivia's Styles Section */}
        <div id="olivia-styles-section" className="mt-16">
          <Card className="glass-dark border-white/10 overflow-hidden shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                Olivia's Styles
              </h2>
              <p className="text-white/70 mb-6">
                Personally selected by Olivia to match the season's trends.
              </p>
              
              <OutfitCarousel 
                outfits={oliviaStyles} 
                onPreview={handleTryOutfit}
                title=""
              />
            </div>
          </Card>
        </div>
        
        {/* New Section 2: Popular in the Community Section */}
        <div id="community-outfits-section" className="mt-16">
          <Card className="glass-dark border-white/10 overflow-hidden shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                Popular in the Community
              </h2>
              <p className="text-white/70 mb-6">
                These looks are trending among our users.
              </p>
              
              <OutfitCarousel 
                outfits={communityOutfits} 
                onPreview={handleTryOutfit}
                title=""
              />
            </div>
          </Card>
        </div>
        
        {/* Divider before Premium Features */}
        <div className="flex items-center justify-center my-16">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent w-full max-w-3xl"></div>
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
