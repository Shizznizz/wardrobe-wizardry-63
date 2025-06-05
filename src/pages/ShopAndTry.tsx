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
import { Button } from '@/components/ui/button';
import { ArrowRight, Home, Shirt, ShoppingBag } from 'lucide-react';

// Import components for our shop and try page
import ShopAndTryHero from '@/components/shop-try/ShopAndTryHero';
import StyleItYourWay from '@/components/shop-try/StyleItYourWay';
import StyleAlchemy from '@/components/shop-try/StyleAlchemy';
import VirtualTryOn from '@/components/shop-try/VirtualTryOn';
import ShopByMood from '@/components/shop-try/ShopByMood';
import EditorsPicks from '@/components/shop-try/EditorsPicks';
import OliviaDailyDrop from '@/components/shop-try/OliviaDailyDrop';
import ShopTryFooter from '@/components/shop-try/ShopTryFooter';
import FloatingOliviaWidget from '@/components/shop-try/FloatingOliviaWidget';
import PremiumFeatureSection from '@/components/shop-try/PremiumFeatureSection';

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
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  
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

  const handleShowStylingOptions = () => {
    toast.info("Opening styling options...");
  };
  
  const handleUserPhotoUpload = (file: File) => {
    const photoUrl = URL.createObjectURL(file);
    setUserPhoto(photoUrl);
    setFinalImage(null);
    toast.success("Photo uploaded successfully!");
  };

  const handleClothingPhotoUpload = (file: File) => {
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

  const handleTryOnTrendingItem = (item: ClothingItem) => {
    if (item) {
      setClothingPhoto(`/path/to/${item.imageUrl || ''}`);
      toast.info(`Selected ${item.name} for try-on!`);
    } else {
      toast.info("Selected item for try-on!");
    }
  };

  const handleSetActiveMood = (mood: string) => {
    setActiveMood(mood);
    toast.info(`Showing styles for ${mood} mood`);
  };

  const handleStylistSuggestion = (item: ClothingItem) => {
    if (item && item.id) {
      const matchedItem = selectedItems.find(i => i.id === item.id);
      if (matchedItem) {
        toast.info(`Olivia suggests pairing with ${matchedItem.name}`);
      } else {
        toast.info("Olivia has a styling suggestion for you");
      }
    } else {
      toast.info("Olivia has a styling suggestion for you");
    }
  };

  const handleSaveToWishlist = (item: ClothingItem) => {
    if (item) {
      toast.success(`${item.name} added to wishlist!`);
    } else {
      toast.success("Item added to wishlist!");
    }
  };

  const handleSaveToWardrobe = (item: ClothingItem) => {
    toast.success(`${item.name} added to wardrobe!`);
  };

  const trackDailyDropClick = (itemId: string) => {
    console.log(`Clicked on daily drop item ${itemId}`);
  };

  const handleSeeHowToWear = (item: ClothingItem) => {
    if (item && item.id) {
      trackDailyDropClick(item.id);
      if (isPremiumUser || isAuthenticated) {
        toast.success("Let me show you how to style this...");
        setTimeout(() => {
          toast.info("This pairs perfectly with items in your wardrobe!");
        }, 1000);
      } else {
        setShowSubscriptionPopup(true);
      }
    }
  };
  
  const handleSaveToWardrobeAdapter = (itemId: string) => {
    const mockItem: ClothingItem = {
      id: itemId,
      name: "Item " + itemId,
      type: "top",
      color: "black",
      season: ["all"],
      image: ""
    };
    handleSaveToWardrobe(mockItem);
  };
  
  const handleSeeHowToWearAdapter = (itemId: string) => {
    const mockItem: ClothingItem = {
      id: itemId,
      name: "Item " + itemId,
      type: "top",
      color: "black",
      season: ["all"],
      image: ""
    };
    handleSeeHowToWear(mockItem);
  };
  
  const handleOpenChat = () => {
    setShowFloatingChat(true);
    toast.info("Olivia is ready to chat about your style!");
  };

  const handleTryOnTrendingItemAdapter = (itemId: string) => {
    const mockItem: ClothingItem = {
      id: itemId,
      name: "Item " + itemId,
      type: "top",
      color: "black",
      season: ["all"],
      image: ""
    };
    handleTryOnTrendingItem(mockItem);
  };

  const handleStylistSuggestionAdapter = (itemId: string) => {
    const mockItem: ClothingItem = {
      id: itemId,
      name: "Item " + itemId,
      type: "top",
      color: "black",
      season: ["all"],
      image: ""
    };
    handleStylistSuggestion(mockItem);
  };

  const handleSaveToWishlistAdapter = (item: ClothingItem) => {
    if (item && item.id) {
      handleSaveToWishlist(item);
    } else {
      toast.error("Invalid item");
    }
  };
  
  const handleTryOnItemAdapter = (item: ClothingItem) => {
    if (item && item.id) {
      handleTryOnTrendingItemAdapter(item.id);
    } else {
      toast.error("Invalid item for try-on");
    }
  };
  
  const handleSeeHowToWearFromItemAdapter = (item: ClothingItem) => {
    if (item && item.id) {
      handleSeeHowToWearAdapter(item.id);
    } else {
      toast.error("Invalid item");
    }
  };
  
  const handleSaveToWardrobeItemAdapter = (item: ClothingItem) => {
    if (item && item.id) {
      handleSaveToWardrobeAdapter(item.id);
    } else {
      toast.error("Invalid item");
    }
  };
  
  const handleSeeHowToWearAdapter2 = (itemId: string) => {
    const mockItem: ClothingItem = {
      id: itemId,
      name: "Item " + itemId,
      type: "top",
      color: "black",
      season: ["all"],
      image: ""
    };
    handleSeeHowToWear(mockItem);
  };
  
  const onSaveToWishlistStringAdapter = (itemId: string) => {
    const mockItem: ClothingItem = {
      id: itemId,
      name: "Item " + itemId,
      type: "top",
      color: "black",
      season: ["all"],
      image: ""
    };
    handleSaveToWishlist(mockItem);
  };
  
  const handleTryOnTrendingItemForShopByMood = (item: ClothingItem) => {
    if (item && item.id) {
      handleTryOnTrendingItemAdapter(item.id);
    } else {
      toast.error("Invalid item for try-on");
    }
  };
  
  const handleStylistSuggestionForShopByMood = (item: ClothingItem) => {
    if (item && item.id) {
      handleStylistSuggestionAdapter(item.id);
    } else {
      toast.error("Invalid item for styling suggestion");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden">
      <Header />
      
      {/* Sticky mobile nav bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-white/10">
          <div className="flex items-center justify-around py-2">
            <Button variant="ghost" size="sm" className="flex flex-col items-center text-white/70 hover:text-white">
              <Home className="h-4 w-4" />
              <span className="text-xs">Home</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center text-white/70 hover:text-white" onClick={handleScrollToTryOn}>
              <Shirt className="h-4 w-4" />
              <span className="text-xs">Try-On</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center text-white/70 hover:text-white">
              <ShoppingBag className="h-4 w-4" />
              <span className="text-xs">Shop</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* HERO SECTION - Keep exactly as-is */}
      <ShopAndTryHero onStartStyling={handleScrollToTryOn} />
      
      <main className="pt-6 pb-20">
        {/* SECTION 2: Start Your Smart Styling Flow (renamed from Style It Your Way) */}
        <StyleItYourWay 
          onTryBeforeBuy={handleScrollToTryOn}
          onAIStyling={() => document.getElementById('shop-by-mood')?.scrollIntoView({ behavior: 'smooth' })}
          onYourStyle={() => !userPhoto ? setShowOliviaImageGallery(true) : handleScrollToTryOn()}
        />
        
        {/* SECTION 3: Your Personalized Look Today (renamed from Style Alchemy) */}
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
            }
          }}
        />
        
        {/* SECTION 4: Virtual Try-On Preview (renamed from Virtual Try-On) */}
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
        
        {/* Olivia's Daily Drop - moved above Shop by Mood on mobile */}
        {isMobile && (
          <OliviaDailyDrop
            isPremiumUser={isPremiumUser || isAuthenticated}
            onSeeHowToWear={handleSeeHowToWearAdapter2}
          />
        )}
        
        {/* SECTION 5: Shop by Mood */}
        <ShopByMood 
          id="shop-by-mood"
          isPremiumUser={isPremiumUser || isAuthenticated}
          onTryItem={handleTryOnTrendingItemForShopByMood}
          onStylistSuggestion={handleStylistSuggestionForShopByMood}
          onUpgradeToPremium={handleShowPremiumPopup}
          activeMood={activeMood}
          onMoodSelect={handleSetActiveMood}
          onSaveToWishlist={onSaveToWishlistStringAdapter}
        />
        
        {/* SECTION 6: Editor's Picks */}
        <EditorsPicks
          isPremiumUser={isPremiumUser || isAuthenticated}
          onTryItem={handleTryOnItemAdapter}
          onUpgradeToPremium={handleShowPremiumPopup}
          userCountry={userCountry}
          onSaveToWardrobe={handleSaveToWardrobeItemAdapter}
        />
        
        {/* Olivia's Daily Drop - desktop position */}
        {!isMobile && (
          <OliviaDailyDrop
            isPremiumUser={isPremiumUser || isAuthenticated}
            onSeeHowToWear={handleSeeHowToWearAdapter2}
          />
        )}
        
        {/* Premium Features Section */}
        <PremiumFeatureSection
          isPremiumUser={isPremiumUser || isAuthenticated}
          onUpgradeToPremium={handleShowPremiumPopup}
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
      
      {/* Sticky premium CTA for mobile */}
      {isMobile && !isPremiumUser && !isAuthenticated && (
        <div className="fixed bottom-16 left-4 right-4 z-40">
          <Button 
            onClick={handleShowPremiumPopup}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white shadow-lg"
          >
            Upgrade to Premium
          </Button>
        </div>
      )}
      
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
