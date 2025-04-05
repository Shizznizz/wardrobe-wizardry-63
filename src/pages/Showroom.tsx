import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import OliviaTips from '@/components/OliviaTips';
import OliviaImageGallery from '@/components/outfits/OliviaImageGallery';
import SubscriptionPopup from '@/components/SubscriptionPopup';
import { useOutfitState } from '@/hooks/useOutfitState';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import { motion, AnimatePresence } from 'framer-motion';

import UserPhotoSection from '@/components/showroom/UserPhotoSection';
import OutfitSelectionSection from '@/components/showroom/OutfitSelectionSection';
import OutfitPreviewSection from '@/components/showroom/OutfitPreviewSection';
import PremiumFeaturesSection from '@/components/showroom/PremiumFeaturesSection';
import ShowroomPreviewCarousel from '@/components/showroom/ShowroomPreviewCarousel';
import StatusBar from '@/components/showroom/StatusBar';
import { Button } from '@/components/ui/button';
import { Check, Camera, Shirt, X, MessageCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const fashionCollections = [
  {
    id: 'recommended',
    name: 'Olivia\'s Picks',
    description: 'Personalized recommendations based on your style profile',
    outfits: sampleOutfits.slice(0, 4),
  },
  {
    id: 'wardrobe',
    name: 'Your Outfits',
    description: 'Outfits you\'ve created and saved',
    outfits: sampleOutfits.slice(0, 3),
  },
  {
    id: 'business',
    name: 'Business Casual',
    description: 'Professional looks that maintain comfort and style',
    outfits: sampleOutfits.slice(2, 6),
    premium: true,
  },
  {
    id: 'summer',
    name: 'Summer Breeze',
    description: 'Light and airy ensembles for warm weather',
    outfits: sampleOutfits.slice(1, 5),
    premium: true,
  },
  {
    id: 'winter',
    name: 'Winter Formal',
    description: 'Elegant outfits for colder months and special occasions',
    outfits: sampleOutfits.slice(3, 7),
    premium: true,
  },
];

const Showroom = () => {
  const [isPremiumUser] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [showOliviaImageGallery, setShowOliviaImageGallery] = useState(false);
  const [isUsingOliviaImage, setIsUsingOliviaImage] = useState(false);
  const [showStatusBar, setShowStatusBar] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [oliviaSuggestion, setOliviaSuggestion] = useState("");
  const isMobile = useIsMobile();

  const {
    outfits,
    clothingItems, 
    selectedOutfit,
    userPhoto,
    finalImage,
    isProcessingTryOn,
    handleUserPhotoChange,
    handleClearUserPhoto,
    handleTryOnOutfit,
    handleSaveOutfit
  } = useOutfitState(sampleOutfits, sampleClothingItems);

  useEffect(() => {
    if (userPhoto && finalImage && !isPremiumUser) {
      const hasSeenPopup = sessionStorage.getItem('hasSeenSubscriptionPopup');
      if (!hasSeenPopup) {
        const timer = setTimeout(() => {
          setShowSubscriptionPopup(true);
          sessionStorage.setItem('hasSeenSubscriptionPopup', 'true');
        }, 1500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [userPhoto, finalImage, isPremiumUser]);

  useEffect(() => {
    if (userPhoto && selectedOutfit) {
      setShowStatusBar(true);
      
      const suggestions = [
        "This outfit looks amazing for a summer evening!",
        "Perfect choice for your style profile!",
        "This color really complements your features!",
        "I love how this outfit highlights your silhouette!",
        "This look will definitely turn heads!"
      ];
      setOliviaSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
    } else {
      setShowStatusBar(false);
    }
  }, [userPhoto, selectedOutfit]);

  const handleSelectOliviaImage = (imageSrc: string) => {
    setIsUploadLoading(true);
    handleUserPhotoChange(imageSrc);
    setIsUsingOliviaImage(true);
    
    setTimeout(() => {
      setIsUploadLoading(false);
      toast.success('Selected Olivia\'s image successfully!');
    }, 800);
  };

  const handleSelectOutfit = (outfit: any) => {
    handleTryOnOutfit(outfit);
    
    if (userPhoto) {
      setTimeout(() => {
        document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleUserPhotoUpload = (photo: string) => {
    setIsUploadLoading(true);
    
    setTimeout(() => {
      handleUserPhotoChange(photo);
      setIsUploadLoading(false);
    }, 800);
  };

  const handleSaveLook = () => {
    if (!finalImage) {
      toast.error('Create a look first!');
      return;
    }
    
    handleSaveOutfit();
    toast.success('Look saved to your wardrobe!', {
      description: 'You can access it anytime in your personal collection.'
    });
  };

  const handleUpgradeToPremium = () => {
    toast('This would navigate to the premium subscription page', {
      description: 'Unlock unlimited outfit swaps, priority styling, and more!'
    });
  };

  const handleCloseSubscriptionPopup = () => {
    setShowSubscriptionPopup(false);
  };

  const resetSelection = () => {
    handleClearUserPhoto();
    setShowStatusBar(false);
  };

  const handleSuggestAnotherOutfit = () => {
    const recommendedOutfits = fashionCollections.find(c => c.id === 'recommended')?.outfits || [];
    if (recommendedOutfits.length > 0) {
      const randomOutfit = recommendedOutfits[Math.floor(Math.random() * recommendedOutfits.length)];
      handleTryOnOutfit(randomOutfit);
      toast.success('Olivia suggested a new outfit for you!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-32 max-w-full relative">
        <div className="w-full mx-auto">
          <div className="text-center mb-8">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Virtual Try-On Studio
            </motion.h1>
            <motion.p 
              className="text-base md:text-lg text-white/80 mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Upload your photo and discover how outfits look on you with our virtual try-on experience.
            </motion.p>
          </div>
          
          {!userPhoto && !isUploadLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <ShowroomPreviewCarousel />
            </motion.div>
          )}
          
          <motion.div
            id="photo-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ display: finalImage ? 'none' : 'block' }}
          >
            <UserPhotoSection 
              userPhoto={userPhoto} 
              isUploading={isUploadLoading}
              isUsingOliviaImage={isUsingOliviaImage}
              onUserPhotoChange={handleUserPhotoUpload}
              onShowOliviaImageGallery={() => setShowOliviaImageGallery(true)}
            />
          </motion.div>
          
          <div className="flex items-center justify-center my-8">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent w-full max-w-2xl"></div>
          </div>
          
          <OutfitSelectionSection 
            fashionCollections={fashionCollections}
            clothingItems={clothingItems}
            selectedOutfit={selectedOutfit}
            isPremiumUser={isPremiumUser}
            onSelectOutfit={handleSelectOutfit}
          />
          
          <div className="flex items-center justify-center my-8">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent w-full max-w-2xl"></div>
          </div>
          
          <div id="preview-section">
            <OutfitPreviewSection 
              finalImage={finalImage}
              selectedOutfit={selectedOutfit}
              clothingItems={clothingItems}
              isProcessingTryOn={isProcessingTryOn}
              userPhoto={userPhoto}
              isUsingOliviaImage={isUsingOliviaImage}
              onSaveLook={handleSaveLook}
              onChangePhoto={() => {
                document.getElementById('photo-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            
            {finalImage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mt-4"
              >
                <Button 
                  onClick={handleSuggestAnotherOutfit}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white"
                >
                  👗 Try Another Outfit
                </Button>
              </motion.div>
            )}
          </div>
          
          {!isPremiumUser && (
            <PremiumFeaturesSection 
              onUpgradeToPremium={handleUpgradeToPremium} 
            />
          )}
        </div>
      </main>
      
      <AnimatePresence>
        {showStatusBar && (
          <StatusBar 
            userPhoto={userPhoto}
            selectedOutfit={selectedOutfit}
            oliviaSuggestion={oliviaSuggestion}
            onReset={resetSelection}
            onPreviewNow={() => handleTryOnOutfit(selectedOutfit!)}
            isMobile={isMobile}
            finalImage={finalImage}
          />
        )}
      </AnimatePresence>
      
      <OliviaImageGallery 
        isOpen={showOliviaImageGallery}
        onClose={() => setShowOliviaImageGallery(false)}
        onSelectImage={handleSelectOliviaImage}
      />
      
      <SubscriptionPopup 
        isOpen={showSubscriptionPopup}
        onClose={handleCloseSubscriptionPopup}
        onUpgrade={handleUpgradeToPremium}
      />
      
      {showTips && (
        <OliviaTips position="bottom-right" />
      )}
    </div>
  );
};

export default Showroom;
