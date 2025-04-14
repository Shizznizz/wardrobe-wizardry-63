
import React, { useState } from 'react';
import { useShowroom } from '@/hooks/useShowroom';
import Header from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import WelcomeMessage from '@/components/fitting-room/WelcomeMessage';
import StepsGuide from '@/components/fitting-room/StepsGuide';
import NoPhotoMessage from '@/components/fitting-room/NoPhotoMessage';
import OutfitCarousel from '@/components/fitting-room/OutfitCarousel';
import OutfitFilters from '@/components/fitting-room/OutfitFilters';
import OliviaSuggestionBox from '@/components/fitting-room/OliviaSuggestionBox';
import ShowroomDialogs from '@/components/showroom/ShowroomDialogs';
import UserPhotoSection from '@/components/showroom/UserPhotoSection';
import OutfitPreviewArea from '@/components/fitting-room/OutfitPreviewArea';

const FittingRoom = () => {
  const isMobile = useIsMobile();
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  
  const {
    isPremiumUser,
    showTips,
    showSubscriptionPopup,
    showOliviaImageGallery,
    isUsingOliviaImage,
    showStatusBar,
    isUploadLoading,
    oliviaSuggestion,
    userPhoto,
    finalImage,
    selectedOutfit,
    isProcessingTryOn,
    outfits,
    handleSelectOliviaImage,
    handleSelectOutfit,
    handleUserPhotoUpload,
    handleSaveLook,
    handleUpgradeToPremium,
    handleCloseSubscriptionPopup,
    resetSelection,
    handlePreviewNow,
    setShowOliviaImageGallery,
  } = useShowroom();

  // Filter outfits based on selected filters
  const filteredOutfits = outfits.filter(outfit => {
    if (selectedSeason !== 'All' && !outfit.seasons.includes(selectedSeason.toLowerCase())) return false;
    if (selectedOccasion !== 'All' && !outfit.occasions?.includes(selectedOccasion.toLowerCase())) return false;
    if (favoritesOnly && !outfit.favorite) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-32">
        <WelcomeMessage />
        
        {!userPhoto ? (
          <>
            <StepsGuide />
            <NoPhotoMessage />
          </>
        ) : (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 gap-8'} mt-8`}>
            <div className={`${isMobile ? '' : 'sticky top-24'}`}>
              <UserPhotoSection
                userPhoto={userPhoto}
                isUploading={isUploadLoading}
                isUsingOliviaImage={isUsingOliviaImage}
                onUserPhotoChange={handleUserPhotoUpload}
                onShowOliviaImageGallery={() => setShowOliviaImageGallery(true)}
              />
              
              {finalImage && (
                <OutfitPreviewArea
                  finalImage={finalImage}
                  selectedOutfit={selectedOutfit}
                  isProcessingTryOn={isProcessingTryOn}
                  userPhoto={userPhoto}
                  isUsingOliviaImage={isUsingOliviaImage}
                  onSaveLook={handleSaveLook}
                  onResetSelection={resetSelection}
                />
              )}
            </div>
            
            <div>
              <OliviaSuggestionBox
                weather="Sunny"
                suggestion={oliviaSuggestion || "Let me help you find the perfect outfit for today! 💜"}
              />
              
              <OutfitFilters
                selectedSeason={selectedSeason}
                selectedOccasion={selectedOccasion}
                favoritesOnly={favoritesOnly}
                onSeasonChange={setSelectedSeason}
                onOccasionChange={setSelectedOccasion}
                onFavoritesToggle={() => setFavoritesOnly(!favoritesOnly)}
              />
              
              <OutfitCarousel
                outfits={filteredOutfits}
                onPreview={handleSelectOutfit}
                isMobile={isMobile}
              />
            </div>
          </div>
        )}
      </main>
      
      <ShowroomDialogs
        showStatusBar={showStatusBar}
        userPhoto={userPhoto}
        selectedOutfit={selectedOutfit}
        oliviaSuggestion={oliviaSuggestion}
        finalImage={finalImage}
        isMobile={isMobile}
        showOliviaImageGallery={showOliviaImageGallery}
        showSubscriptionPopup={showSubscriptionPopup}
        showTips={showTips}
        onResetSelection={resetSelection}
        onPreviewNow={handlePreviewNow}
        onCloseOliviaImageGallery={() => setShowOliviaImageGallery(false)}
        onCloseSubscriptionPopup={handleCloseSubscriptionPopup}
        onSelectOliviaImage={handleSelectOliviaImage}
        onUpgradeToPremium={handleUpgradeToPremium}
      />
    </div>
  );
};

export default FittingRoom;
