
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

// Import new section components
import HeroSection from '@/components/shop-try/HeroSection';
import UploadPanel from '@/components/shop-try/UploadPanel';
import StyleFeedbackSection from '@/components/shop-try/StyleFeedbackSection';
import TrendingNowSection from '@/components/shop-try/TrendingNowSection';
import StylingChallengeSection from '@/components/shop-try/StylingChallengeSection';
import PremiumFeatureSection from '@/components/shop-try/PremiumFeatureSection';
import OliviaMoodAvatar from '@/components/shop-try/OliviaMoodAvatar';
import HelpTipsSection from '@/components/new-clothes/HelpTipsSection';
import { defaultOutfitTips } from '@/components/outfits/OutfitTips';

const NewClothes = () => {
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
  const [showHelpTips, setShowHelpTips] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [oliviaMood, setOliviaMood] = useState<'happy' | 'thinking' | 'neutral'>('neutral');
  const [stylingTip, setStylingTip] = useState<string | null>(null);

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
          
          // Generate a random styling tip
          const tips = [
            "Love this fit with high-rise jeans! Want a rec?",
            "A cropped jacket would complete this. Shall I suggest one?",
            "This color really enhances your features! Try pairing with gold accessories.",
            "This silhouette works so well for your body type!",
            "Perfect for casual outings. Want to see dressier options?"
          ];
          setStylingTip(tips[Math.floor(Math.random() * tips.length)]);
          
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
      setStylingTip(null);
    };
    reader.readAsDataURL(file);
  };

  const handleClothingPhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setClothingPhoto(event.target?.result as string);
      setFinalImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectOliviaImage = (imageSrc: string) => {
    setUserPhoto(imageSrc);
    setFinalImage(null);
    setIsUsingOliviaImage(true);
    setStylingTip(null);
  };

  const handleTryOn = async () => {
    if (!userPhoto || !clothingPhoto) {
      toast.error("Please upload both a photo of yourself and a clothing item");
      return;
    }

    setIsProcessing(true);
    setFinalImage(null);
    setStylingTip(null);
    setOliviaMood('thinking');

    try {
      const promptText = "a photorealistic image of a person wearing the provided white t-shirt";
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: promptText,
          userPhotoUrl: userPhoto,
          clothingPhotoUrl: clothingPhoto
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("AI generation response:", data);

      if (data?.generatedImageUrl) {
        setFinalImage(data.generatedImageUrl);
        setOliviaMood('happy');
        
        // Generate a random styling tip
        const tips = [
          "Love this fit with high-rise jeans! Want a rec?",
          "A cropped jacket would complete this. Shall I suggest one?",
          "This color really enhances your features! Try pairing with gold accessories.",
          "This silhouette works so well for your body type!",
          "Perfect for casual outings. Want to see dressier options?"
        ];
        setStylingTip(tips[Math.floor(Math.random() * tips.length)]);
        
        toast.success("AI-generated try-on ready!");
      } else if (data?.predictionId) {
        setPredictionId(data.predictionId);
        toast("Generating AI try-on image...", {
          description: "This may take a minute or two. We'll notify you when it's ready."
        });
      } else {
        throw new Error("No result returned from generation API");
      }
    } catch (error) {
      console.error("Error in AI try-on:", error);
      setGenerationError(String(error));
      setOliviaMood('thinking');
      toast.error("Failed to generate virtual try-on");
    } finally {
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
    
    // For now, just show a placeholder behavior
    toast.success(`Preparing to try on ${item.name}...`);
    setClothingPhoto(item.imageUrl);
    
    if (!userPhoto) {
      toast.info("Please upload a photo first or select Olivia as a model");
    }
  };

  const handleUpgradeToPremium = () => {
    toast.success('Redirecting to premium subscription page');
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
    setStylingTip(null);
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

  const handleNextTip = () => {
    if (currentTipIndex < defaultOutfitTips.length - 1) {
      setCurrentTipIndex(prevIndex => prevIndex + 1);
    } else {
      setShowHelpTips(false);
      setCurrentTipIndex(0);
    }
  };

  const handleParticipateInChallenge = () => {
    if (!isPremiumUser && !isAuthenticated) {
      setShowSubscriptionPopup(true);
      return;
    }
    
    toast.success('Taking you to the Style Challenge page...');
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
      
      <HelpTipsSection 
        showHelpTips={showHelpTips}
        onShowHelpTips={setShowHelpTips}
        currentTipIndex={currentTipIndex}
        onNextTip={handleNextTip}
      />
      
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
        <motion.div 
          className="space-y-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <HeroSection onStartStyling={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })} />

          <div id="upload-section">
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
          </div>
          
          {finalImage && stylingTip && (
            <StyleFeedbackSection 
              stylingTip={stylingTip}
              isPremiumUser={isPremiumUser || isAuthenticated}
              onSuggestSimilar={() => toast.info("Olivia is finding similar styles for you...")}
              onSaveLook={handleSaveLook}
              onShowStylingOptions={() => toast.info("Exploring styling options...")}
              onUpgradeToPremium={handleShowPremiumPopup}
            />
          )}
          
          <TrendingNowSection 
            isPremiumUser={isPremiumUser || isAuthenticated}
            onTryItem={handleTryOnTrendingItem}
            onStyleTips={(item) => toast.info(`Style tips for ${item.name}`)}
            onUpgradeToPremium={handleShowPremiumPopup}
          />
          
          <StylingChallengeSection 
            isPremiumUser={isPremiumUser || isAuthenticated}
            onParticipate={handleParticipateInChallenge}
            onUpgradeToPremium={handleShowPremiumPopup}
          />
          
          <PremiumFeatureSection 
            isPremiumUser={isPremiumUser || isAuthenticated}
            onUpgradeToPremium={handleUpgradeToPremium} 
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

export default NewClothes;
