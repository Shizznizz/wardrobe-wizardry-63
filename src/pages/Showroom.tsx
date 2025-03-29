
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import OliviaTips from '@/components/OliviaTips';
import OliviaImageGallery from '@/components/outfits/OliviaImageGallery';
import SubscriptionPopup from '@/components/SubscriptionPopup';
import { useOutfitState } from '@/hooks/useOutfitState';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';

// Import the new components
import UserPhotoSection from '@/components/showroom/UserPhotoSection';
import OutfitSelectionSection from '@/components/showroom/OutfitSelectionSection';
import OutfitPreviewSection from '@/components/showroom/OutfitPreviewSection';
import PremiumFeaturesSection from '@/components/showroom/PremiumFeaturesSection';

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

  const handleSelectOliviaImage = (imageSrc: string) => {
    handleUserPhotoChange(imageSrc);
    setIsUsingOliviaImage(true);
    toast.success('Selected Olivia\'s image successfully!');
  };

  const handleSelectOutfit = (outfit: any) => {
    handleTryOnOutfit(outfit);
  };

  const handleSaveLook = () => {
    if (!finalImage) {
      toast.error('Create a look first!');
      return;
    }
    
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-32 max-w-full">
        <div className="w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Virtual Try-On Studio
            </h1>
            <p className="text-base md:text-lg text-white/80 mx-auto">
              Upload your photo and discover how outfits look on you with our virtual try-on experience.
            </p>
          </div>
          
          {/* User Photo Section */}
          <UserPhotoSection 
            userPhoto={userPhoto} 
            isUsingOliviaImage={isUsingOliviaImage}
            onUserPhotoChange={handleUserPhotoChange}
            onShowOliviaImageGallery={() => setShowOliviaImageGallery(true)}
          />
          
          {/* Outfit Selection Section */}
          <OutfitSelectionSection 
            fashionCollections={fashionCollections}
            clothingItems={clothingItems}
            selectedOutfit={selectedOutfit}
            isPremiumUser={isPremiumUser}
            onSelectOutfit={handleSelectOutfit}
          />
          
          {/* Outfit Preview Section */}
          <OutfitPreviewSection 
            finalImage={finalImage}
            selectedOutfit={selectedOutfit}
            clothingItems={clothingItems}
            isProcessingTryOn={isProcessingTryOn}
            userPhoto={userPhoto}
            isUsingOliviaImage={isUsingOliviaImage}
            onSaveLook={handleSaveLook}
          />
          
          {/* Premium Features Section */}
          {!isPremiumUser && (
            <PremiumFeaturesSection 
              onUpgradeToPremium={handleUpgradeToPremium} 
            />
          )}
        </div>
      </main>
      
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
