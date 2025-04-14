
import React, { useEffect, useState } from 'react';
import { useShowroom } from '@/hooks/useShowroom';
import { useOutfitState } from '@/hooks/useOutfitState';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import Header from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, Heart, Camera, Info, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import UserPhotoSection from '@/components/showroom/UserPhotoSection';
import ShowroomDialogs from '@/components/showroom/ShowroomDialogs';
import OutfitCarousel from '@/components/fitting-room/OutfitCarousel';
import WelcomeMessage from '@/components/fitting-room/WelcomeMessage';
import NoOutfitsMessage from '@/components/fitting-room/NoOutfitsMessage';
import OutfitPreviewArea from '@/components/fitting-room/OutfitPreviewArea';
import NoPhotoMessage from '@/components/fitting-room/NoPhotoMessage';

const FittingRoom = () => {
  const isMobile = useIsMobile();
  const { outfits } = useOutfitState(sampleOutfits, sampleClothingItems);
  const [photoSide, setPhotoSide] = useState<'left' | 'right'>('left');
  const [showOliviaHint, setShowOliviaHint] = useState(false);
  const [triedOnCount, setTriedOnCount] = useState(0);
  const [showOliviaTips, setShowOliviaTips] = useState(true);
  
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
    
    // Methods
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

  // Filter to only user-created outfits
  const userOutfits = outfits.filter(outfit => 
    // This is a placeholder filter - in a real app, you would filter based on 
    // something that indicates the outfit was created by the user
    outfit.name !== "AI Generated Outfit"
  );

  useEffect(() => {
    // Show Olivia's hint after 15 seconds of idle time
    const idleTimer = setTimeout(() => {
      if (userPhoto && !finalImage) {
        setShowOliviaHint(true);
      }
    }, 15000);

    return () => clearTimeout(idleTimer);
  }, [userPhoto, finalImage]);

  // Show shopping suggestion after trying on 3+ outfits
  useEffect(() => {
    if (triedOnCount >= 3 && showOliviaTips) {
      toast(
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center mr-3">
            <span className="text-white text-sm">OB</span>
          </div>
          <p className="text-sm">
            Looking for something new? Maybe Shop & Try is where your next favorite item is hiding...
          </p>
        </div>,
        {
          duration: 8000,
          action: {
            label: "Go there",
            onClick: () => window.location.href = "/shop-and-try",
          },
        }
      );
    }
  }, [triedOnCount, showOliviaTips]);

  const handleOutfitPreview = (outfit) => {
    handleSelectOutfit(outfit);
    setTriedOnCount(prev => prev + 1);
  };

  const handleDownload = async () => {
    if (!finalImage) return;
    
    try {
      const response = await fetch(finalImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fitting-room-preview.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const handleShare = async () => {
    if (!finalImage) return;
    
    try {
      if (navigator.share) {
        const response = await fetch(finalImage);
        const blob = await response.blob();
        const file = new File([blob], 'fitting-room-preview.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'My Outfit Preview',
          text: 'Check out this outfit I created!',
          files: [file]
        });
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Sharing is not supported on this device');
    }
  };

  const toggleOliviaTips = () => {
    setShowOliviaTips(!showOliviaTips);
    toast.success(showOliviaTips 
      ? "Olivia's style tips are now hidden" 
      : "Olivia's style tips are now enabled");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden">
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-32 max-w-[1600px] relative">
        {/* Section 1: Olivia's Welcome Message */}
        <WelcomeMessage />
        
        {/* Toggle for Olivia Tips */}
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleOliviaTips}
            className="bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Info className="h-4 w-4 mr-2" />
            {showOliviaTips ? "Hide Olivia's Tips" : "Show Olivia's Tips"}
          </Button>
        </div>
        
        <div className={`mt-10 grid gap-6 ${isMobile ? 'grid-cols-1' : `grid-cols-${userPhoto && !finalImage ? '2' : '1'}`}`}>
          {/* Section 2: Photo Upload Block */}
          <div className={`${isMobile ? '' : 
            userPhoto && !finalImage ? `${photoSide === 'left' ? 'order-first' : 'order-last'}` : ''
          } ${userPhoto && isMobile ? 'sticky top-20 z-10 bg-slate-950/70 backdrop-blur-md py-3 -mx-4 px-4' : ''}`}>
            {(!userPhoto || isMobile) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">Select Your Model</h2>
                
                <UserPhotoSection 
                  userPhoto={userPhoto} 
                  isUploading={isUploadLoading}
                  isUsingOliviaImage={isUsingOliviaImage}
                  onUserPhotoChange={handleUserPhotoUpload}
                  onShowOliviaImageGallery={() => setShowOliviaImageGallery(true)}
                />
                
                {showOliviaHint && userPhoto && !finalImage && showOliviaTips && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center mr-3">
                      <span className="text-white text-sm">OB</span>
                    </div>
                    <p className="text-sm text-white/90">
                      Want help choosing? Or just try some favorites?
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
            
            {userPhoto && !isMobile && (
              <div className="sticky top-24">
                <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">Your Model</h2>
                <div className="relative rounded-lg overflow-hidden border border-white/10 shadow-lg">
                  <img src={userPhoto} alt="Your photo" className="w-full object-cover aspect-[3/4]" />
                  {isUsingOliviaImage && (
                    <div className="absolute top-2 left-2 bg-purple-600/80 rounded-full py-0.5 px-2 text-xs text-white">
                      Olivia's Image
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white border-white/20"
                    onClick={resetSelection}
                  >
                    Change Photo
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Section 3: Outfit Selection (shown when photo is selected) */}
          {userPhoto && !finalImage ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">Your Outfits</h2>
              
              {userOutfits.length === 0 ? (
                <NoOutfitsMessage />
              ) : (
                <OutfitCarousel 
                  outfits={userOutfits} 
                  onPreview={handleOutfitPreview} 
                  isMobile={isMobile}
                />
              )}
            </div>
          ) : !userPhoto ? (
            <NoPhotoMessage />
          ) : null}
        </div>
        
        {/* Section 4: Outfit Preview Area */}
        {(finalImage || selectedOutfit) && (
          <OutfitPreviewArea
            finalImage={finalImage}
            userPhoto={userPhoto}
            selectedOutfit={selectedOutfit}
            isProcessingTryOn={isProcessingTryOn}
            isUsingOliviaImage={isUsingOliviaImage}
            clothingItems={clothingItems}
            onSaveLook={handleSaveLook}
            onDownload={handleDownload}
            onShare={handleShare}
            onResetSelection={resetSelection}
          />
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
        showTips={showTips && showOliviaTips}
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
