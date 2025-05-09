
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
import HeroSection from '@/components/shared/HeroSection';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Import components for our shop and try page
import StyleItYourWay from '@/components/shop-try/StyleItYourWay';
import StyleAlchemy from '@/components/shop-try/StyleAlchemy';
import VirtualTryOn from '@/components/shop-try/VirtualTryOn';
import ShopByMood from '@/components/shop-try/ShopByMood';
import EditorsPicks from '@/components/shop-try/EditorsPicks';
import OliviaDailyDrop from '@/components/shop-try/OliviaDailyDrop';
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
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [oliviaMood, setOliviaMood] = useState<'happy' | 'thinking' | 'neutral'>('neutral');
  const [stylingTip, setStylingTip] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [customLocation, setCustomLocation] = useState<{ city: string; country: string } | null>(null);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [earlyTester, setEarlyTester] = useState(false);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [mockOutfit, setMockOutfit] = useState<Outfit | null>(null);
  
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsPremiumUser(isAuthenticated);
    
    // Detect user's country by IP (mock implementation)
    const detectUserCountry = async () => {
      try {
        setUserCountry('United States');
      } catch (error) {
        console.error('Error detecting country:', error);
      }
    };
    
    detectUserCountry();
  }, [isAuthenticated]);

  const handleScrollToTryOn = () => {
    document.getElementById('virtual-try-on')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Define missing handler functions
  const handleShowStylingOptions = () => {
    toast.info("Opening styling options...");
    // Implementation would go here in a real app
  };
  
  // Update the handler to accept a File instead of a string
  const handleUserPhotoUpload = (file: File) => {
    // Convert File to string URL for display
    const photoUrl = URL.createObjectURL(file);
    setUserPhoto(photoUrl);
    setFinalImage(null);
    toast.success("Photo uploaded successfully!");
  };

  // Update the handler to accept a File instead of a string
  const handleClothingPhotoUpload = (file: File) => {
    // Convert File to string URL for display
    const photoUrl = URL.createObjectURL(file);
    setClothingPhoto(photoUrl);
    setFinalImage(null);
    toast.success("Clothing item uploaded!");
  };

  const clearPhotos = () => {
    setUserPhoto(null);
    setClothingPhoto(null);
    setFinalImage(null);
    setSelectedItems([]);
    setStylingTip(null);
    toast.success('Photos cleared');
  };

  const handleTryOn = () => {
    if (!userPhoto) {
      toast.error("Please upload a photo first");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setFinalImage(userPhoto);
      setIsProcessing(false);
      setOliviaMood('happy');
      setStylingTip("This style looks great on you!");
      toast.success("Try-on complete!");
    }, 1500);
  };

  const handleSaveLook = () => {
    if (!finalImage) {
      toast.error("Create a look first!");
      return;
    }
    toast.success("Look saved to your collection!");
  };

  const handleAddItem = (item: ClothingItem) => {
    setSelectedItems(prev => [...prev, item]);
    toast.success(`${item.name} added to your selection!`);
  };

  const handleShowPremiumPopup = () => {
    setShowSubscriptionPopup(true);
  };

  const handleAddToEarlyTesters = () => {
    setEarlyTester(true);
    toast.success("You've been added to our early testers group!");
  };

  // Update to match the expected function signature that returns a string
  const handleTryOnTrendingItem = (itemId: string) => {
    const item = selectedItems.find(i => i.id === itemId) || { name: "Selected item", imageUrl: "" }; 
    setClothingPhoto(`/path/to/${item.imageUrl}`);
    toast.info(`Selected ${item.name} for try-on!`);
    return item.imageUrl || "";
  };

  const handleSetActiveMood = (mood: string) => {
    setActiveMood(mood);
    toast.info(`Showing styles for ${mood} mood`);
  };

  // Update to accept string ID instead of ClothingItem
  const handleSaveToWishlist = (itemId: string) => {
    const item = selectedItems.find(i => i.id === itemId) || { name: "Selected item" };
    toast.success(`${item.name} added to wishlist!`);
  };

  const handleSaveToWardrobe = (item: ClothingItem) => {
    toast.success(`${item.name} added to wardrobe!`);
  };

  const trackDailyDropClick = (itemId: string) => {
    console.log(`Clicked on daily drop item ${itemId}`);
    // Analytics tracking would go here
  };

  const handleOpenChat = () => {
    toast.info("Olivia is ready to chat about your style!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden">
      <Header />
      
      <HeroSection
        title="Shop & Try Fashion"
        subtitle=""
        image={{
          src: "/lovable-uploads/e1aaa230-1623-42c4-ab9f-eb7c5f103ebe.png",
          alt: "Olivia your AI Fashion Assistant",
          variant: "standing"
        }}
        buttons={[
          {
            label: "Explore Styles with Olivia",
            onClick: handleScrollToTryOn,
            variant: "primary",
            className: "bg-gradient-to-r from-[#ff4ecb] to-[#a97eff]",
            icon: <ArrowRight className="h-5 w-5" />
          }
        ]}
      />
      
      <main className="pt-6 pb-20">
        {/* SECTION 2: STYLE IT YOUR WAY */}
        <StyleItYourWay 
          onTryBeforeBuy={handleScrollToTryOn}
          onAIStyling={() => document.getElementById('shop-by-mood')?.scrollIntoView({ behavior: 'smooth' })}
          onYourStyle={() => !userPhoto ? setShowOliviaImageGallery(true) : handleScrollToTryOn()}
        />
        
        {/* SECTION 3: STYLE ALCHEMY (WEATHER-BASED RECOMMENDATIONS) */}
        <StyleAlchemy 
          userPhoto={userPhoto}
          isUsingOliviaImage={isUsingOliviaImage}
          customLocation={customLocation}
          onShowStyleOptions={handleShowStylingOptions}
          isPremiumUser={isPremiumUser || isAuthenticated}
          onCombineWithWardrobe={() => {
            if (!isPremiumUser && !isAuthenticated) {
              setShowSubscriptionPopup(true);
            } else {
              toast.info("Opening wardrobe selector...");
              // This would connect to wardrobe in a real implementation
            }
          }}
        />
        
        {/* SECTION 4: VIRTUAL TRY-ON */}
        <VirtualTryOn 
          id="virtual-try-on"
          userPhoto={userPhoto}
          clothingPhoto={clothingPhoto}
          isProcessing={isProcessing}
          isUsingOliviaImage={isUsingOliviaImage}
          finalImage={finalImage}
          mockOutfit={mockOutfit}
          selectedItems={selectedItems}
          generationError={generationError}
          isPremiumUser={isPremiumUser || isAuthenticated}
          oliviaMood={oliviaMood}
          stylingTip={stylingTip}
          onUserPhotoUpload={handleUserPhotoUpload}
          onClothingPhotoUpload={handleClothingPhotoUpload}
          onClearUserPhoto={() => {
            setUserPhoto(null);
            setIsUsingOliviaImage(false);
          }}
          onClearPhotos={clearPhotos}
          onTryOn={handleTryOn}
          onShowOliviaImageGallery={() => setShowOliviaImageGallery(true)}
          onSaveLook={handleSaveLook}
          onAddItem={handleAddItem}
          onShowPremiumPopup={handleShowPremiumPopup}
          onAddToEarlyTesters={handleAddToEarlyTesters}
          earlyTester={earlyTester}
          setShowFeedback={setShowFeedback}
          showFeedback={showFeedback}
        />
        
        {/* SECTION 5: SHOP BY MOOD (CATEGORY-BASED ITEMS) */}
        <ShopByMood 
          id="shop-by-mood"
          isPremiumUser={isPremiumUser || isAuthenticated}
          onTryItem={handleTryOnTrendingItem}
          onStylistSuggestion={(itemId) => {
            const item = selectedItems.find(i => i.id === itemId) || { name: "Selected item" };
            toast.info(`Olivia suggests pairing with ${item.name}`);
          }}
          onUpgradeToPremium={handleShowPremiumPopup}
          activeMood={activeMood}
          onMoodSelect={handleSetActiveMood}
          onSaveToWishlist={handleSaveToWishlist}
        />
        
        {/* SECTION 6: EDITOR'S PICKS / BASED ON YOUR VIBE / WISHLIST */}
        <EditorsPicks
          isPremiumUser={isPremiumUser || isAuthenticated}
          onTryItem={handleTryOnTrendingItem}
          onUpgradeToPremium={handleShowPremiumPopup}
          userCountry={userCountry}
          onSaveToWardrobe={handleSaveToWardrobe}
        />
        
        {/* BONUS SECTION: DAILY FEATURE / STYLING CHALLENGE */}
        <OliviaDailyDrop
          isPremiumUser={isPremiumUser || isAuthenticated}
          onSeeHowToWear={(itemId) => {
            trackDailyDropClick(itemId);
            if (isPremiumUser || isAuthenticated) {
              toast.success("Let me show you how to style this...");
              // Mock AI logic - would be more sophisticated in real implementation
              setTimeout(() => {
                toast.info("This pairs perfectly with items in your wardrobe!");
              }, 1000);
            } else {
              setShowSubscriptionPopup(true);
            }
          }}
        />
        
        {/* Footer with affiliate disclaimer and country filter */}
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
          setShowFeedback(false);
          
          setCustomLocation({
            city: "New York",
            country: "USA"
          });
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
