
import React from 'react';
import { useShowroom } from '@/hooks/useShowroom';
import Header from '@/components/Header';
import ShowroomContent from '@/components/showroom/ShowroomContent';
import ShowroomDialogs from '@/components/showroom/ShowroomDialogs';
import { useIsMobile } from '@/hooks/use-mobile';

const FittingRoom = () => {
  const isMobile = useIsMobile();
  const {
    isPremiumUser,
    showTips,
    showSubscriptionPopup,
    showOliviaImageGallery,
    isUsingOliviaImage,
    showStatusBar,
    isUploadLoading,
    oliviaSuggestion,
    clothingItems,
    selectedOutfit,
    userPhoto,
    finalImage,
    isProcessingTryOn,
    fashionCollections,
    
    // Methods
    handleSelectOliviaImage,
    handleSelectOutfit,
    handleUserPhotoUpload,
    handleSaveLook,
    handleUpgradeToPremium,
    handleCloseSubscriptionPopup,
    resetSelection,
    handlePreviewNow,
    handleSuggestAnotherOutfit,
    setShowOliviaImageGallery,
  } = useShowroom();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-32 max-w-full relative">
        <ShowroomContent 
          userPhoto={userPhoto}
          isUploadLoading={isUploadLoading}
          isUsingOliviaImage={isUsingOliviaImage}
          selectedOutfit={selectedOutfit}
          finalImage={finalImage}
          clothingItems={clothingItems}
          fashionCollections={fashionCollections}
          isProcessingTryOn={isProcessingTryOn}
          isPremiumUser={isPremiumUser}
          onUserPhotoUpload={handleUserPhotoUpload}
          onShowOliviaImageGallery={() => setShowOliviaImageGallery(true)}
          onSelectOutfit={handleSelectOutfit}
          onSaveLook={handleSaveLook}
          onSuggestAnotherOutfit={handleSuggestAnotherOutfit}
          onUpgradeToPremium={handleUpgradeToPremium}
        />
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
