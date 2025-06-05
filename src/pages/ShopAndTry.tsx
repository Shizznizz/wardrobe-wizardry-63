
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { Outfit, ClothingItem } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import OutfitSubscriptionPopup from '@/components/OutfitSubscriptionPopup';
import OliviaImageGallery from '@/components/outfits/OliviaImageGallery';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { generateRandomWeather } from '@/services/WeatherService';

// Import new components
import UserGreetingBar from '@/components/shop-try/UserGreetingBar';
import ShopAndTryHero from '@/components/shop-try/ShopAndTryHero';
import PersonalizedPicksSection from '@/components/shop-try/PersonalizedPicksSection';
import SeeItOnYouSection from '@/components/shop-try/SeeItOnYouSection';
import ImprovedShopByMood from '@/components/shop-try/ImprovedShopByMood';
import EditorsPicks from '@/components/shop-try/EditorsPicks';
import OliviaDailyDrop from '@/components/shop-try/OliviaDailyDrop';
import PremiumFeaturesTeaser from '@/components/shop-try/PremiumFeaturesTeaser';
import ShopTryFooter from '@/components/shop-try/ShopTryFooter';
import FloatingOliviaWidget from '@/components/shop-try/FloatingOliviaWidget';

const ShopAndTry = () => {
  const { isAuthenticated } = useAuth();
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [clothingPhoto, setClothingPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [showOliviaImageGallery, setShowOliviaImageGallery] = useState(false);
  const [isUsingOliviaImage, setIsUsingOliviaImage] = useState(false);
  const [showCompatibleOnly, setShowCompatibleOnly] = useState(false);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [weather, setWeather] = useState(null);
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsPremiumUser(isAuthenticated);
    
    // Generate weather data
    const weatherData = generateRandomWeather("New York", "USA");
    setWeather(weatherData);
    
    // Mock user country detection
    setUserCountry('United States');
  }, [isAuthenticated]);

  const handleScrollToTryOn = () => {
    document.getElementById('see-it-on-you')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleUserPhotoUpload = (file: File) => {
    const photoUrl = URL.createObjectURL(file);
    setUserPhoto(photoUrl);
    setFinalImage(null);
    setIsUsingOliviaImage(false);
    toast.success("Photo uploaded successfully!");
  };

  const handleUseOliviaImage = () => {
    setUserPhoto('/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png');
    setIsUsingOliviaImage(true);
    setFinalImage(null);
    toast.success("Using Olivia as your model!");
  };

  const clearPhotos = () => {
    setUserPhoto(null);
    setClothingPhoto(null);
    setFinalImage(null);
    setSelectedItems([]);
    setIsUsingOliviaImage(false);
    toast.success('Photos cleared');
  };

  const handleTryOutfit = (outfit: any) => {
    if (!userPhoto && !isUsingOliviaImage) {
      toast.error("Please upload a photo or use Olivia first");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setFinalImage(userPhoto || '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png');
      setIsProcessing(false);
      toast.success("Try-on complete! Scroll down to see the result.");
      
      // Scroll to preview
      document.getElementById('see-it-on-you')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 2000);
  };

  const handleSaveOutfit = () => {
    toast.success("Outfit saved to your collection!");
  };

  const handleShopOutfit = () => {
    window.open('https://example.com/shop', '_blank');
    toast.success("Opening shop page in new tab");
  };

  const handleTryItem = (item: ClothingItem) => {
    if (!userPhoto && !isUsingOliviaImage) {
      toast.error("Please upload a photo or use Olivia first");
      return;
    }
    
    setSelectedItems(prev => [...prev, item]);
    handleTryOutfit(item);
  };

  const handleStylistSuggestion = (item: ClothingItem) => {
    toast.info(`Olivia suggests pairing ${item.name} with items from your wardrobe!`);
  };

  const handleShowPremiumPopup = () => {
    setShowSubscriptionPopup(true);
  };

  const handleSaveToWishlist = (itemId: string) => {
    toast.success("Item added to wishlist!");
  };

  const handleSaveToWardrobe = (item: ClothingItem) => {
    toast.success(`${item.name} added to wardrobe!`);
  };

  const handleSeeHowToWear = (itemId: string) => {
    if (isPremiumUser || isAuthenticated) {
      toast.success("Let me show you how to style this...");
    } else {
      setShowSubscriptionPopup(true);
    }
  };

  const handleOpenChat = () => {
    setShowFloatingChat(true);
    toast.info("Olivia is ready to chat about your style!");
  };

  // Create a wrapper function for try-on without parameters
  const handleTryOnClick = () => {
    if (!userPhoto && !isUsingOliviaImage) {
      toast.error("Please upload a photo or use Olivia first");
      return;
    }
    
    // Use a default outfit or the first selected item
    const defaultOutfit = selectedItems.length > 0 ? selectedItems[0] : { name: "Current Selection" };
    handleTryOutfit(defaultOutfit);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden">
      <Header />
      
      {/* User Greeting Bar */}
      <UserGreetingBar />
      
      {/* Hero Section */}
      <ShopAndTryHero onStartStyling={handleScrollToTryOn} />
      
      <main className="pb-20">
        {/* 1. Personalized Picks Section */}
        <PersonalizedPicksSection
          weather={weather}
          onTryOutfit={handleTryOutfit}
          onSaveOutfit={handleSaveOutfit}
          onShopOutfit={handleShopOutfit}
          isPremiumUser={isPremiumUser || isAuthenticated}
        />
        
        {/* 2. See It On You Section */}
        <SeeItOnYouSection
          userPhoto={userPhoto}
          isUsingOliviaImage={isUsingOliviaImage}
          finalImage={finalImage}
          isProcessing={isProcessing}
          onUserPhotoUpload={handleUserPhotoUpload}
          onUseOliviaImage={handleUseOliviaImage}
          onTryOn={handleTryOnClick}
          onClearPhotos={clearPhotos}
          showCompatibleOnly={showCompatibleOnly}
          onToggleCompatibleOnly={setShowCompatibleOnly}
        />
        
        {/* 3. Shop by Mood Section */}
        <ImprovedShopByMood 
          isPremiumUser={isPremiumUser || isAuthenticated}
          onTryItem={handleTryItem}
          onStylistSuggestion={handleStylistSuggestion}
          onUpgradeToPremium={handleShowPremiumPopup}
          activeMood={activeMood}
          onMoodSelect={setActiveMood}
          onSaveToWishlist={handleSaveToWishlist}
        />
        
        {/* 4. Olivia's Daily Drop (Mobile: moved up) */}
        {isMobile && (
          <OliviaDailyDrop
            isPremiumUser={isPremiumUser || isAuthenticated}
            onSeeHowToWear={handleSeeHowToWear}
          />
        )}
        
        {/* 5. Editor's Picks */}
        <EditorsPicks
          isPremiumUser={isPremiumUser || isAuthenticated}
          onTryItem={handleTryItem}
          onUpgradeToPremium={handleShowPremiumPopup}
          userCountry={userCountry}
          onSaveToWardrobe={handleSaveToWardrobe}
        />
        
        {/* 6. Olivia's Daily Drop (Desktop: original position) */}
        {!isMobile && (
          <OliviaDailyDrop
            isPremiumUser={isPremiumUser || isAuthenticated}
            onSeeHowToWear={handleSeeHowToWear}
          />
        )}
        
        {/* 7. Premium Features Teaser */}
        <PremiumFeaturesTeaser
          onUpgrade={handleShowPremiumPopup}
          isPremiumUser={isPremiumUser || isAuthenticated}
        />
        
        {/* Footer */}
        <ShopTryFooter 
          userCountry={userCountry || 'United States'} 
          onCountryChange={(country) => {
            setUserCountry(country);
            toast.success(`Now showing products available in ${country}`);
          }}
        />
        
        <FloatingOliviaWidget
          isPremiumUser={isPremiumUser || isAuthenticated}
          onUpgradeToPremium={handleShowPremiumPopup}
          onOpenChat={handleOpenChat}
        />
      </main>
      
      <OliviaImageGallery 
        isOpen={showOliviaImageGallery} 
        onClose={() => setShowOliviaImageGallery(false)}
        onSelectImage={(imageSrc) => {
          setUserPhoto(imageSrc);
          setFinalImage(null);
          setIsUsingOliviaImage(true);
        }}
      />
      
      <OutfitSubscriptionPopup 
        isOpen={showSubscriptionPopup}
        onClose={() => setShowSubscriptionPopup(false)}
        onUpgrade={() => {
          toast.success('Redirecting to premium subscription');
          setShowSubscriptionPopup(false);
        }}
      />
    </div>
  );
};

export default ShopAndTry;
