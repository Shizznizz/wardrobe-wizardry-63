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
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';

// Import components for our redesigned page
import ShopAndTryHero from '@/components/shop-try/ShopAndTryHero';
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

  const mockOutfit: Outfit = {
    id: 'new-clothing',
    name: 'New Clothing Preview',
    items: selectedItems.map(item => item.id),
    occasion: 'casual',
    occasions: ['shopping'],
    season: ['all'],
    seasons: ['all'],
    favorite: false,
    timesWorn: 0,
    dateAdded: new Date()
  };

  useEffect(() => {
    if (!predictionId) return;
    
    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: { predictionId }
        });

        if (error) throw new Error(error.message);
        
        if (data.generatedImageUrl) {
          setFinalImage(data.generatedImageUrl);
          setPredictionId(null);
          setIsProcessing(false);
          toast.success("AI-generated try-on is ready!");
          
          setOliviaMood('happy');
          
          setTimeout(() => {
            setShowFeedback(true);
          }, 500);
          
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error("Error polling for prediction:", err);
        toast.error("Error checking generation status");
        setOliviaMood('thinking');
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [predictionId]);

  useEffect(() => {
    if (finalImage && !isPremiumUser && !isAuthenticated) {
      const hasSeenPopup = sessionStorage.getItem('hasSeenOutfitSubscriptionPopup');
      if (!hasSeenPopup) {
        const timer = setTimeout(() => {
          setShowSubscriptionPopup(true);
          sessionStorage.setItem('hasSeenOutfitSubscriptionPopup', 'true');
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [finalImage, isPremiumUser, isAuthenticated]);

  const handleUserPhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setUserPhoto(event.target?.result as string);
      setFinalImage(null);
      setIsUsingOliviaImage(false);
      setShowFeedback(false);
    };
    reader.readAsDataURL(file);
  };

  const handleClothingPhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setClothingPhoto(event.target?.result as string);
      setFinalImage(null);
      setShowFeedback(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectOliviaImage = (imageSrc: string) => {
    setUserPhoto(imageSrc);
    setFinalImage(null);
    setIsUsingOliviaImage(true);
    setShowFeedback(false);
    
    setCustomLocation({
      city: "New York",
      country: "USA"
    });
  };

  const handleTryOn = async () => {
    if (!userPhoto || !clothingPhoto) {
      toast.error("Please upload both a photo and a clothing item");
      return;
    }

    setIsProcessing(true);
    setFinalImage(null);
    setOliviaMood('thinking');
    setShowFeedback(false);

    try {
      setTimeout(() => {
        setFinalImage(userPhoto);
        setIsProcessing(false);
        setOliviaMood('happy');
        
        setTimeout(() => {
          setShowFeedback(true);
        }, 500);
        
        toast.success("AI-generated try-on ready!");
      }, 2000);
    } catch (error) {
      console.error("Error in AI try-on:", error);
      setGenerationError(String(error));
      setOliviaMood('thinking');
      toast.error("Failed to generate virtual try-on");
      setIsProcessing(false);
    }
  };

  const handleAddItem = (item: ClothingItem) => {
    setSelectedItems(prev => [...prev, item]);
    toast.success(`Added ${item.name} to your outfit!`);
  };

  const handleTryOnTrendingItem = (item: ClothingItem) => {
    if (!isPremiumUser && !isAuthenticated) {
      setShowSubscriptionPopup(true);
      return;
    }
    
    toast.success(`Preparing to try on ${item.name}...`);
    setClothingPhoto(item.imageUrl);
    
    if (!userPhoto) {
      toast.info("Please upload a photo first or select Olivia as a model");
    }
  };

  const handleUpgradeToPremium = () => {
    toast.success('Redirecting to premium subscription');
    setShowSubscriptionPopup(false);
  };

  const handleShowPremiumPopup = () => {
    setShowSubscriptionPopup(true);
  };

  const clearPhotos = () => {
    setUserPhoto(null);
    setClothingPhoto(null);
    setFinalImage(null);
    setPredictionId(null);
    setSelectedItems([]);
    setIsUsingOliviaImage(false);
    setShowFeedback(false);
    setGenerationError(null);
    toast.success('Photos cleared');
  };

  const handleSaveLook = () => {
    if (!finalImage) {
      toast.error('Create a look first!');
      return;
    }
    
    if (!isPremiumUser && !isAuthenticated) {
      setShowSubscriptionPopup(true);
      return;
    }
    
    toast.success('Look saved to your wardrobe!');
  };

  const handleFeedbackSubmit = (feedback: any) => {
    console.log('Feedback submitted:', feedback);
    
    if (feedback.favorite) {
      toast.success('Added to favorites!');
    }
    
    if (feedback.rating >= 4) {
      toast.success('Olivia will remember your style preferences!');
    }
  };

  const handleSetActiveMood = (mood: string | null) => {
    setActiveMood(mood);
    if (mood) {
      toast.info(`Showing items perfect for a ${mood} mood`);
    } else {
      toast.info('Showing all items');
    }
  };

  const handleShowStylingOptions = () => {
    document.getElementById('products-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    toast.info("Here are some items that match today's weather");
  };

  const handleOpenChat = () => {
    toast.info("Olivia is ready to chat about your style!");
  };

  const handleTryEditorsPick = (item: ClothingItem) => {
    if (!userPhoto) {
      toast.info("Please upload a photo first or select Olivia as a model");
      return;
    }
    
    setClothingPhoto(item.imageUrl || item.image);
    toast.success("Editor's pick selected! Ready to try on.");
  };

  const handleScrollToTryOn = () => {
    document.getElementById('virtual-try-on')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleAddToEarlyTesters = async (email: string) => {
    if (!email) return;
    
    try {
      // Store email in vto_testers table
      const { error } = await supabase
        .from('vto_testers')
        .insert({ email });
      
      if (error) throw error;
      setEarlyTester(true);
      toast.success("You've been added to our early testers list!");
    } catch (err) {
      console.error("Error adding to early testers:", err);
      toast.error("Couldn't add you to early testers. Please try again.");
    }
  };

  const handleSaveToWishlist = async (itemId: string) => {
    if (!isAuthenticated) {
      setShowSubscriptionPopup(true);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('wishlist')
        .insert({ 
          user_id: supabase.auth.getUser().then(data => data.data.user?.id),
          item_id: itemId,
          created_at: new Date()
        });
      
      if (error) throw error;
      toast.success("Item saved to your wishlist!");
    } catch (err) {
      console.error("Error saving to wishlist:", err);
      toast.error("Couldn't save to wishlist. Please try again.");
    }
  };
  
  const handleSaveToWardrobe = async (item: ClothingItem) => {
    if (!isAuthenticated) {
      setShowSubscriptionPopup(true);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('wardrobe_items')
        .insert({ 
          user_id: supabase.auth.getUser().then(data => data.data.user?.id),
          item_data: item,
          created_at: new Date()
        });
      
      if (error) throw error;
      toast.success("Item saved to your wardrobe!");
    } catch (err) {
      console.error("Error saving to wardrobe:", err);
      toast.error("Couldn't save to wardrobe. Please try again.");
    }
  };

  const trackDailyDropClick = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('daily_drop_clicks')
        .insert({ 
          user_id: isAuthenticated ? supabase.auth.getUser().then(data => data.data.user?.id) : null,
          item_id: itemId,
          clicked_at: new Date()
        });
      
      if (error) console.error("Error tracking click:", error);
    } catch (err) {
      console.error("Error tracking daily drop click:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden">
      <Header />
      
      <main className="pt-20 pb-20">
        {/* SECTION 1: HERO HEADER */}
        <ShopAndTryHero onStartStyling={handleScrollToTryOn} />
        
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
          mockOutfit={finalImage ? mockOutfit : null}
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
          onStylistSuggestion={(item) => toast.info(`Olivia suggests pairing with ${item.name}`)}
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
        onSelectImage={handleSelectOliviaImage}
      />
      
      <OutfitSubscriptionPopup 
        isOpen={showSubscriptionPopup}
        onClose={() => setShowSubscriptionPopup(false)}
        onUpgrade={handleUpgradeToPremium}
      />
    </div>
  );
};

export default ShopAndTry;
