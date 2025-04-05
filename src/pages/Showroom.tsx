
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import OliviaTips from '@/components/OliviaTips';
import OliviaImageGallery from '@/components/outfits/OliviaImageGallery';
import SubscriptionPopup from '@/components/SubscriptionPopup';
import { useOutfitState } from '@/hooks/useOutfitState';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import { motion, AnimatePresence } from 'framer-motion';

// Import the new components
import UserPhotoSection from '@/components/showroom/UserPhotoSection';
import OutfitSelectionSection from '@/components/showroom/OutfitSelectionSection';
import OutfitPreviewSection from '@/components/showroom/OutfitPreviewSection';
import PremiumFeaturesSection from '@/components/showroom/PremiumFeaturesSection';
import { Button } from '@/components/ui/button';
import { Check, Camera, Shirt, X } from 'lucide-react';
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

  // Show status bar when both photo and outfit are selected
  useEffect(() => {
    if (userPhoto && selectedOutfit) {
      setShowStatusBar(true);
    } else {
      setShowStatusBar(false);
    }
  }, [userPhoto, selectedOutfit]);

  const handleSelectOliviaImage = (imageSrc: string) => {
    handleUserPhotoChange(imageSrc);
    setIsUsingOliviaImage(true);
    toast.success('Selected Olivia\'s image successfully!');
  };

  const handleSelectOutfit = (outfit: any) => {
    handleTryOnOutfit(outfit);
    
    // Scroll to the preview section
    if (userPhoto) {
      setTimeout(() => {
        document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSaveLook = () => {
    if (!finalImage) {
      toast.error('Create a look first!');
      return;
    }
    
    handleSaveOutfit();
    toast.success('Look saved to your wardrobe!');
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
          
          {/* User Photo Section */}
          <motion.div
            id="photo-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <UserPhotoSection 
              userPhoto={userPhoto} 
              isUsingOliviaImage={isUsingOliviaImage}
              onUserPhotoChange={handleUserPhotoChange}
              onShowOliviaImageGallery={() => setShowOliviaImageGallery(true)}
            />
          </motion.div>
          
          {/* Section Divider */}
          <div className="flex items-center justify-center my-8">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent w-full max-w-2xl"></div>
          </div>
          
          {/* Outfit Selection Section */}
          <OutfitSelectionSection 
            fashionCollections={fashionCollections}
            clothingItems={clothingItems}
            selectedOutfit={selectedOutfit}
            isPremiumUser={isPremiumUser}
            onSelectOutfit={handleSelectOutfit}
          />
          
          {/* Section Divider */}
          <div className="flex items-center justify-center my-8">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent w-full max-w-2xl"></div>
          </div>
          
          {/* Outfit Preview Section */}
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
          </div>
          
          {/* Premium Features Section */}
          {!isPremiumUser && (
            <PremiumFeaturesSection 
              onUpgradeToPremium={handleUpgradeToPremium} 
            />
          )}
        </div>
      </main>
      
      {/* Sticky Status Bar */}
      <AnimatePresence>
        {showStatusBar && (
          <motion.div 
            className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-white/10 py-3 px-4 z-40"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-1 ${userPhoto ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {userPhoto ? <Check className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                </div>
                <span className={`text-sm ${userPhoto ? 'text-white' : 'text-gray-400'}`}>
                  {userPhoto ? 'Photo Selected' : 'No Photo Selected'}
                </span>
                
                <div className="mx-2 h-4 w-px bg-white/20"></div>
                
                <div className={`rounded-full p-1 ${selectedOutfit ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {selectedOutfit ? <Check className="h-4 w-4" /> : <Shirt className="h-4 w-4" />}
                </div>
                <span className={`text-sm ${selectedOutfit ? 'text-white' : 'text-gray-400'}`}>
                  {selectedOutfit ? selectedOutfit.name : 'No Outfit Selected'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {isMobile ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                    onClick={resetSelection}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                    onClick={resetSelection}
                  >
                    Reset Selection
                  </Button>
                )}
                
                {!finalImage && userPhoto && selectedOutfit && (
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                    onClick={() => handleTryOnOutfit(selectedOutfit)}
                  >
                    Preview Now
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
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
