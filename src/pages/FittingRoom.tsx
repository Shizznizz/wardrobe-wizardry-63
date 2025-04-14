import React, { useState } from 'react';
import { useShowroom } from '@/hooks/useShowroom';
import { useIsMobile } from '@/hooks/use-mobile';
import { ClothingSeason, ClothingOccasion } from '@/lib/types';
import Header from '@/components/Header';
import WelcomeMessage from '@/components/fitting-room/WelcomeMessage';
import StepsGuide from '@/components/fitting-room/StepsGuide';
import NoPhotoMessage from '@/components/fitting-room/NoPhotoMessage';
import OutfitCarousel from '@/components/fitting-room/OutfitCarousel';
import OutfitFilters from '@/components/fitting-room/OutfitFilters';
import OliviaSuggestionBox from '@/components/fitting-room/OliviaSuggestionBox';
import ShowroomDialogs from '@/components/showroom/ShowroomDialogs';
import UserPhotoSection from '@/components/showroom/UserPhotoSection';
import OutfitPreviewArea from '@/components/fitting-room/OutfitPreviewArea';
import { sampleClothingItems } from '@/lib/wardrobeData';

const FittingRoom = () => {
  const isMobile = useIsMobile();
  const [selectedSeason, setSelectedSeason] = useState<ClothingSeason>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<ClothingOccasion>('casual');
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
    clothingItems,
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

  const outfits = Array.isArray(clothingItems) ? clothingItems.map((item, index) => ({
    id: `outfit-${index}`,
    name: `Outfit ${index + 1}`,
    items: [item.id],
    occasions: item.occasions || ['casual'],
    seasons: item.seasons || ['all'],
    favorite: Boolean(index % 3 === 0),
    timesWorn: index,
    dateAdded: new Date(),
  })) : [];

  const filteredOutfits = outfits.filter(outfit => {
    const seasonMatch = selectedSeason === 'all' || 
      outfit.seasons.includes(selectedSeason as ClothingSeason);
    
    const occasionMatch = selectedOccasion === 'casual' || 
      outfit.occasions.includes(selectedOccasion as ClothingOccasion);
    
    const favoriteMatch = !favoritesOnly || outfit.favorite;
    
    return seasonMatch && occasionMatch && favoriteMatch;
  });

  const handleDownload = () => {
    if (!finalImage) return;
    const a = document.createElement('a');
    a.href = finalImage;
    a.download = 'fitting-room-preview.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = () => {
    if (!finalImage || !navigator.share) return;
    
    navigator.share({
      title: 'My Outfit',
      text: 'Check out my outfit from Olivia Bloom!',
      url: window.location.href
    }).catch(err => console.error('Error sharing:', err));
  };

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
                  clothingItems={clothingItems || sampleClothingItems}
                  onSaveLook={handleSaveLook}
                  onResetSelection={resetSelection}
                  onDownload={handleDownload}
                  onShare={handleShare}
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
