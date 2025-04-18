import React, { useEffect, useState } from 'react';
import { useShowroom } from '@/hooks/useShowroom';
import { useOutfitState } from '@/hooks/useOutfitState';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import Header from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { Share2, Download, Heart, Info, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import UserPhotoSection from '@/components/showroom/UserPhotoSection';
import ShowroomDialogs from '@/components/showroom/ShowroomDialogs';
import WelcomeMessage from '@/components/fitting-room/WelcomeMessage';
import NoOutfitsMessage from '@/components/fitting-room/NoOutfitsMessage';
import OutfitPreviewArea from '@/components/fitting-room/OutfitPreviewArea';
import NoPhotoMessage from '@/components/fitting-room/NoPhotoMessage';
import { ClothingSeason, ClothingOccasion, WeatherInfo, Outfit } from '@/lib/types';

import OliviaRecommendationBox from '@/components/fitting-room/OliviaRecommendationBox';
import OutfitFilters from '@/components/fitting-room/OutfitFilters';
import OutfitCarousel from '@/components/fitting-room/OutfitCarousel';
import UserPhotoDisplay from '@/components/fitting-room/UserPhotoDisplay';
import StyleOfTheDay from '@/components/fitting-room/StyleOfTheDay';
import TrendingLooks from '@/components/fitting-room/TrendingLooks';
import Sparkles from '@/components/fitting-room/Sparkles';

const FittingRoom = () => {
  const isMobile = useIsMobile();

  const { 
    outfits = [], 
    clothingItems = [],
    handleCreateOutfit = () => {},
    handleEditOutfit = () => {},
    handleSaveOutfit = () => {},
    handleDeleteOutfit = () => {},
    handleToggleFavorite = () => {},
    handleWeatherChange = () => {},
    handleShowTips = () => {},
    handleAssistantAction = () => {},
    handleRefreshOutfit = () => {},
    handleUserPhotoChange = () => {},
    handleClearUserPhoto = () => {},
    handleTryOnOutfit = () => {}
  } = useOutfitState(sampleOutfits || [], sampleClothingItems || []);

  const [photoSide, setPhotoSide] = useState<'left' | 'right'>('left');
  const [showOliviaHint, setShowOliviaHint] = useState(false);
  const [triedOnCount, setTriedOnCount] = useState(0);
  const [showOliviaTips, setShowOliviaTips] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<ClothingSeason | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<ClothingOccasion | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  const [currentWeather, setCurrentWeather] = useState<WeatherInfo>({
    temperature: 22,
    condition: 'Sunny',
    icon: 'sun'
  });

  const {
    isPremiumUser = false,
    showTips = false,
    showSubscriptionPopup = false,
    showOliviaImageGallery = false,
    isUsingOliviaImage = false,
    showStatusBar = false,
    isUploadLoading = false,
    oliviaSuggestion = "",
    clothingItems: showroomClothingItems = [],
    selectedOutfit = null,
    userPhoto = null,
    finalImage = null,
    isProcessingTryOn = false,
    
    handleSelectOliviaImage = () => {},
    handleSelectOutfit = () => {},
    handleUserPhotoUpload = () => {},
    handleSaveLook = () => {},
    handleUpgradeToPremium = () => {},
    handleCloseSubscriptionPopup = () => {},
    resetSelection = () => {},
    handlePreviewNow = () => {},
    setShowOliviaImageGallery = () => {},
  } = useShowroom();

  const userOutfits = Array.isArray(outfits) ? outfits : [];

  useEffect(() => {
    const idleTimer = setTimeout(() => {
      if (userPhoto && !finalImage) {
        setShowOliviaHint(true);
      }
    }, 15000);

    return () => clearTimeout(idleTimer);
  }, [userPhoto, finalImage]);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOutfitPreview = (outfit: Outfit) => {
    if (!outfit) return;
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

  const handleSeasonChange = (season: ClothingSeason) => {
    setSelectedSeason(prev => prev === season ? null : season);
  };

  const handleOccasionChange = (occasion: ClothingOccasion) => {
    setSelectedOccasion(prev => prev === occasion ? null : occasion);
  };

  const toggleFavorites = () => {
    setShowFavoritesOnly(prev => !prev);
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterByTag = (tag: string) => {
    if (tag === 'weather') {
      const temp = currentWeather?.temperature || 20;
      let season: ClothingSeason = 'summer';
      
      if (temp < 10) season = 'winter';
      else if (temp < 20) season = 'autumn';
      else if (temp < 25) season = 'spring';
      
      handleSeasonChange(season);
    } else if (tag === 'style') {
      handleAssistantAction();
    }
  };

  const filteredOutfits = userOutfits.filter((outfit) => {
    if (!outfit) return false;
    
    if (selectedSeason && Array.isArray(outfit.seasons)) {
      if (!outfit.seasons.includes(selectedSeason)) {
        return false;
      }
    }
    
    if (selectedOccasion && Array.isArray(outfit.occasions)) {
      if (!outfit.occasions.includes(selectedOccasion)) {
        return false;
      }
    }
    
    if (showFavoritesOnly && outfit.favorite !== true) {
      return false;
    }
    
    return true;
  });

  const safeFilteredOutfits = Array.isArray(filteredOutfits) ? filteredOutfits : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden">
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-32 max-w-[1600px] relative">
        <WelcomeMessage />
        
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
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-8 mb-12"
        >
          <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">Select Your Model</h2>
          
          <UserPhotoSection 
            userPhoto={userPhoto} 
            isUploading={isUploadLoading}
            isUsingOliviaImage={isUsingOliviaImage}
            onUserPhotoChange={handleUserPhotoUpload}
            onShowOliviaImageGallery={() => setShowOliviaImageGallery(true)}
          />
        </motion.div>
        
        <div className="mt-10">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {userPhoto && (
              <div>
                <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">Your Model</h2>
                <UserPhotoDisplay 
                  userPhoto={userPhoto}
                  isUsingOliviaImage={isUsingOliviaImage}
                  onResetPhoto={resetSelection}
                />
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">Olivia's Suggestions</h2>
              <OliviaRecommendationBox 
                weather={currentWeather} 
                selectedOutfit={selectedOutfit}
                onSuggestOutfit={handleRefreshOutfit}
                onFilterByTag={handleFilterByTag}
                onTryOutfit={handleOutfitPreview}
                outfits={safeFilteredOutfits}
              />
            </div>
          </motion.div>
          
          <div className="mt-14" id="outfits-section">
            <OutfitFilters 
              selectedSeason={selectedSeason}
              selectedOccasion={selectedOccasion}
              showFavoritesOnly={showFavoritesOnly}
              onSeasonChange={handleSeasonChange}
              onOccasionChange={handleOccasionChange}
              onFavoritesToggle={toggleFavorites}
              totalOutfits={userOutfits.length}
              filteredOutfits={safeFilteredOutfits.length}
            />
            
            {!Array.isArray(safeFilteredOutfits) || safeFilteredOutfits.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-dark border border-white/10 rounded-lg p-6 text-center"
              >
                <Sparkles className="h-8 w-8 text-purple-400 mb-3 mx-auto" />
                <h3 className="text-lg font-medium text-white mb-2">No outfits yet</h3>
                <p className="text-white/70 mb-4">Would you like Olivia to create some looks for you?</p>
                <Button
                  onClick={handleAssistantAction}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                >
                  Generate Looks
                </Button>
              </motion.div>
            ) : (
              <OutfitCarousel 
                outfits={safeFilteredOutfits} 
                onPreview={handleOutfitPreview} 
                title="Your Outfits & Collections"
              />
            )}
          </div>
          
          <StyleOfTheDay 
            outfit={safeFilteredOutfits[0] || null} 
            onPreview={handleOutfitPreview}
          />
          
          <TrendingLooks onShowLogin={handleUpgradeToPremium} />
        </div>
        
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
      
      {showScrollToTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            variant="default"
            size="icon"
            onClick={scrollToTop}
            className="rounded-full w-12 h-12 bg-purple-600 hover:bg-purple-700 shadow-lg"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
      
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
