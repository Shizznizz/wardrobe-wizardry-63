
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { Outfit, ClothingItem } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import OutfitSubscriptionPopup from '@/components/OutfitSubscriptionPopup';
import OliviaImageGallery from '@/components/outfits/OliviaImageGallery';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Import unified components
import PremiumTryOnHero from '@/components/shop-try/PremiumTryOnHero';
import WeatherBasedTips from '@/components/shop-try/WeatherBasedTips';
import UploadPanel from '@/components/shop-try/UploadPanel';
import UnifiedProductsCarousel from '@/components/shop-try/UnifiedProductsCarousel';
import WishlistAndHistory from '@/components/shop-try/WishlistAndHistory';
import FeedbackLoop, { FeedbackData } from '@/components/shop-try/FeedbackLoop';
import ShopTryExplainer from '@/components/shop-try/ShopTryExplainer';

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

  const isMobile = useIsMobile();

  useEffect(() => {
    setIsPremiumUser(isAuthenticated);
  }, [isAuthenticated]);

  const mockOutfit: Outfit = {
    id: 'new-clothing',
    name: 'New Clothing Preview',
    items: selectedItems.map(item => item.id),
    occasions: ['shopping'],
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
          
          // Set Olivia's mood based on the outcome
          setOliviaMood('happy');
          
          // Show feedback
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
    
    // Set a custom location for Olivia
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
      // Simulate AI processing for demo purposes
      setTimeout(() => {
        setFinalImage(userPhoto);
        setIsProcessing(false);
        setOliviaMood('happy');
        
        // Show feedback after a delay
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

  const handleFeedbackSubmit = (feedback: FeedbackData) => {
    console.log('Feedback submitted:', feedback);
    
    // In a real app, this would be sent to the backend
    if (feedback.favorite) {
      toast.success('Added to favorites!');
    }
    
    // Use the rating to improve AI suggestions (just a visual confirmation for demo)
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden">
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-20 max-w-6xl">
        <motion.div 
          className="space-y-12 md:space-y-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* New unified hero section replacing the old intro + steps */}
          <section id="hero-section">
            <PremiumTryOnHero
              isPremiumUser={isPremiumUser || isAuthenticated}
              onStartStyling={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
              onShowPremiumPopup={handleShowPremiumPopup}
            />
          </section>

          <div id="upload-section" className="scroll-mt-24">
            {/* Weather-based Tips - Only shows when a photo is selected */}
            <WeatherBasedTips 
              userPhoto={userPhoto}
              isUsingOliviaImage={isUsingOliviaImage}
              customLocation={customLocation}
              onShowStyleOptions={handleShowStylingOptions}
            />
            
            {/* Upload Panel */}
            <UploadPanel 
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
            />
            
            {/* Feedback Loop - Only show after try-on */}
            {showFeedback && finalImage && (
              <FeedbackLoop 
                visible={showFeedback}
                outfitName={clothingPhoto ? 'this look' : 'Custom Look'}
                onClose={() => setShowFeedback(false)}
                onFeedbackSubmit={handleFeedbackSubmit}
                onSave={handleSaveLook}
                isPremium={isPremiumUser || isAuthenticated}
                onUpgradeToPremium={handleShowPremiumPopup}
              />
            )}
          </div>
          
          {/* Unified Products Carousel */}
          <section id="products-section" className="scroll-mt-24">
            <UnifiedProductsCarousel 
              isPremiumUser={isPremiumUser || isAuthenticated}
              onTryItem={handleTryOnTrendingItem}
              onStylistSuggestion={(item) => toast.info(`Olivia suggests pairing with ${item.name}`)}
              onUpgradeToPremium={handleShowPremiumPopup}
              activeMood={activeMood}
              onMoodSelect={handleSetActiveMood}
            />
          </section>
          
          {/* Wishlist and History */}
          <WishlistAndHistory 
            isPremiumUser={isPremiumUser || isAuthenticated}
            onTryItem={handleTryOnTrendingItem}
            onUpgradeToPremium={handleShowPremiumPopup}
          />
        </motion.div>
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
