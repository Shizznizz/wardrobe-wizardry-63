
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import HeroSection from '@/components/shop-try/HeroSection';
import UploadPanel from '@/components/shop-try/UploadPanel';
import OliviaStyleFeedback from '@/components/shop-try/OliviaStyleFeedback';
import TrendingNowSection from '@/components/shop-try/TrendingNowSection';
import StylingChallengeSection from '@/components/shop-try/StylingChallengeSection';
import PremiumFeatureSection from '@/components/shop-try/PremiumFeatureSection';
import OliviaMoodAvatar from '@/components/shop-try/OliviaMoodAvatar';
import { Outfit, ClothingItem } from '@/lib/types';
import OutfitSubscriptionPopup from '@/components/OutfitSubscriptionPopup';
import OliviaImageGallery from '@/components/outfits/OliviaImageGallery';

const ShopAndTry = () => {
  const { user, session } = useAuth();
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [clothingPhoto, setClothingPhoto] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isPremiumUser] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [showOliviaImageGallery, setShowOliviaImageGallery] = useState(false);
  const [isUsingOliviaImage, setIsUsingOliviaImage] = useState(false);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [oliviaMood, setOliviaMood] = useState<'happy' | 'neutral' | 'thinking'>('neutral');
  
  // Use the logged-in status to determine if premium features should be accessible
  const effectivePremiumUser = !!user || isPremiumUser;

  const handleUserPhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setUserPhoto(event.target?.result as string);
      setFinalImage(null);
      setIsUsingOliviaImage(false);
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
    toast.success('Selected Olivia as your model!');
  };

  const handleTryOn = async () => {
    if (!userPhoto || !clothingPhoto) {
      toast.error("Please upload both a photo and a clothing item");
      return;
    }

    setIsProcessing(true);
    setFinalImage(null);

    // Simulate processing for demo purposes
    setTimeout(() => {
      setFinalImage(userPhoto);
      setIsProcessing(false);
      setOliviaMood('happy');
      toast.success("Your virtual try-on is ready!");
    }, 2000);
  };

  const handleSaveLook = () => {
    if (!finalImage) {
      toast.error('Create a look first!');
      return;
    }

    if (!effectivePremiumUser) {
      setShowSubscriptionPopup(true);
      return;
    }
    
    toast.success('Look saved to your wardrobe!');
  };

  const handleUpgradeToPremium = () => {
    toast.success('Redirecting to premium subscription page');
    setShowSubscriptionPopup(false);
  };

  const handleTrySimilarLook = () => {
    if (!effectivePremiumUser) {
      setShowSubscriptionPopup(true);
      return;
    }
    
    toast.success('Finding similar styles for you...');
  };

  const handleSeeStyleOptions = () => {
    if (!effectivePremiumUser) {
      setShowSubscriptionPopup(true);
      return;
    }
    
    toast.success('Opening styling options...');
  };

  const handleClearPhotos = () => {
    setUserPhoto(null);
    setClothingPhoto(null);
    setFinalImage(null);
    setPredictionId(null);
    setSelectedItems([]);
    setIsUsingOliviaImage(false);
    setOliviaMood('neutral');
    toast.success('Photos cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white w-full overflow-x-hidden">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-7xl">
        <motion.div 
          className="space-y-16"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {/* Hero Section */}
          <HeroSection onStartStyling={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })} />
          
          {/* Upload Panel */}
          <section id="upload-section" className="pt-8">
            <UploadPanel
              userPhoto={userPhoto}
              clothingPhoto={clothingPhoto}
              isProcessing={isProcessing}
              isUsingOliviaImage={isUsingOliviaImage}
              finalImage={finalImage}
              effectivePremiumUser={effectivePremiumUser}
              onUserPhotoUpload={handleUserPhotoUpload}
              onClothingPhotoUpload={handleClothingPhotoUpload}
              onClearPhotos={handleClearPhotos}
              onTryOn={handleTryOn}
              onShowOliviaImageGallery={() => setShowOliviaImageGallery(true)}
              onSaveLook={handleSaveLook}
            />
            
            {/* Olivia's Style Feedback */}
            {finalImage && (
              <OliviaStyleFeedback 
                onTrySimilarLook={handleTrySimilarLook}
                onSaveLook={handleSaveLook}
                onSeeStyleOptions={handleSeeStyleOptions}
              />
            )}
            
            {/* Olivia Mood Avatar */}
            {finalImage && (
              <OliviaMoodAvatar mood={oliviaMood} />
            )}
          </section>
          
          {/* Trending Now Section */}
          <TrendingNowSection 
            effectivePremiumUser={effectivePremiumUser} 
            onShowPremiumPopup={() => setShowSubscriptionPopup(true)}
          />
          
          {/* Styling Challenge Section */}
          <StylingChallengeSection 
            effectivePremiumUser={effectivePremiumUser}
            onShowPremiumPopup={() => setShowSubscriptionPopup(true)}
          />
          
          {/* Premium Feature Section */}
          <PremiumFeatureSection 
            isPremiumUser={isPremiumUser}
            onUpgradeToPremium={handleUpgradeToPremium}
          />
        </motion.div>
      </main>
      
      {/* Popups and Galleries */}
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
