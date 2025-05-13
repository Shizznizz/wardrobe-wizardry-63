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
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';
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

  // Define missing handler functions
  const handleShowStylingOptions = () => {
    toast.info("Opening styling options...");
    // Implementation would go here in a real app
  };
  
  // Fix types for file handlers
  const handleUserPhotoUpload = (file: File) => {
    // Convert File to string URL for display
    const photoUrl = URL.createObjectURL(file);
    setUserPhoto(photoUrl);
    setFinalImage(null);
    toast.success("Photo uploaded successfully!");
  };

  // Fix types for file handlers
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

  // Function that should accept ClothingItem but is actually being passed a string itemId
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

  // Modified to accept string parameter instead of ClothingItem
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

  // Fix type mismatch
  const handleSaveToWishlist = (item: ClothingItem) => {
    if (item) {
      toast.success(`${item.name} added to wishlist!`);
    } else {
      toast.success("Item added to wishlist!");
    }
  };

  // Fix type signature for onSaveToWardrobe
  const handleSaveToWardrobe = (item: ClothingItem) => {
    toast.success(`${item.name} added to wardrobe!`);
  };

  const trackDailyDropClick = (itemId: string) => {
    console.log(`Clicked on daily drop item ${itemId}`);
    // Analytics tracking would go here
  };

  // Original function expecting a ClothingItem
  const handleSeeHowToWear = (item: ClothingItem) => {
    if (item && item.id) {
      trackDailyDropClick(item.id);
      if (isPremiumUser || isAuthenticated) {
        toast.success("Let me show you how to style this...");
        // Mock AI logic - would be more sophisticated in real implementation
        setTimeout(() => {
          toast.info("This pairs perfectly with items in your wardrobe!");
        }, 1000);
      } else {
        setShowSubscriptionPopup(true);
      }
    }
  };
  
  // Adapter function for EditorsPicks component that expects itemId as string
  const handleSaveToWardrobeAdapter = (itemId: string) => {
    // Create a minimal ClothingItem with just the id and name to pass to the original handler
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
  
  // Adapter function for OliviaDailyDrop component that expects itemId as string
  const handleSeeHowToWearAdapter = (itemId: string) => {
    // Create a minimal ClothingItem with just the id and name to pass to the original handler
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

  // Create adapter functions to resolve type mismatches
  // Convert string itemId to ClothingItem for components expecting ClothingItem
  const handleTryOnTrendingItemAdapter = (itemId: string) => {
    // Create a minimal ClothingItem to pass to the original handler
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

  // Convert string itemId to ClothingItem for components expecting ClothingItem
  const handleStylistSuggestionAdapter = (itemId: string) => {
    // Create a minimal ClothingItem to pass to the original handler
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

  // New adapter function to convert ClothingItem to string for components expecting string
  const handleSaveToWishlistAdapter = (item: ClothingItem) => {
    if (item && item.id) {
      handleSaveToWishlist(item);
    } else {
      toast.error("Invalid item");
    }
  };
  
  // Fix for EditorsPicks - convert ClothingItem to string ID for onTryItem
  const handleTryOnItemAdapter = (item: ClothingItem) => {
    if (item && item.id) {
      handleTryOnTrendingItemAdapter(item.id);
    } else {
      toast.error("Invalid item for try-on");
    }
  };
  
  // Fix for OliviaDailyDrop - convert ClothingItem to string ID for onSeeHowToWear
  const handleSeeHowToWearFromItemAdapter = (item: ClothingItem) => {
    if (item && item.id) {
      handleSeeHowToWearAdapter(item.id);
    } else {
      toast.error("Invalid item");
    }
  };
  
  // New adapter for lines 383-384: convert ClothingItem to string itemId
  const handleSaveToWardrobeItemAdapter = (item: ClothingItem) => {
    if (item && item.id) {
      handleSaveToWardrobeAdapter(item.id);
    } else {
      toast.error("Invalid item");
    }
  };
  
  // New adapter for line 397: convert string itemId to ClothingItem
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
  
  // New adapter for line 388: convert ClothingItem to string
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
  
  // Create two new adapters for ShopByMood component to fix the errors on lines 417-418
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
      
      <EnhancedHeroSection
        title="Shop & Try Fashion"
        subtitle="Preview new trends, mix with your wardrobe, and get smart fashion recommendations."
        image={{
          src: "/lovable-uploads/f4be744c-31b5-4099-93e8-67f51af83dae.png",
          alt: "Olivia in pink crop top and skirt outfit",
          variant: "standing"
        }}
        buttons={[
          {
            label: "Explore Styles with Olivia",
            onClick: handleScrollToTryOn,
            variant: "primary",
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
          onTryItem={handleTryOnTrendingItemForShopByMood}
          onStylistSuggestion={handleStylistSuggestionForShopByMood}
          onUpgradeToPremium={handleShowPremiumPopup}
          activeMood={activeMood}
          onMoodSelect={handleSetActiveMood}
          onSaveToWishlist={onSaveToWishlistStringAdapter}
        />
        
        {/* SECTION 6: EDITOR'S PICKS / BASED ON YOUR VIBE / WISHLIST */}
        <EditorsPicks
          isPremiumUser={isPremiumUser || isAuthenticated}
          onTryItem={handleTryOnItemAdapter}
          onUpgradeToPremium={handleShowPremiumPopup}
          userCountry={userCountry}
          onSaveToWardrobe={handleSaveToWardrobeItemAdapter}
        />
        
        {/* BONUS SECTION: DAILY FEATURE / STYLING CHALLENGE */}
        <OliviaDailyDrop
          isPremiumUser={isPremiumUser || isAuthenticated}
          onSeeHowToWear={handleSeeHowToWearAdapter2}
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
