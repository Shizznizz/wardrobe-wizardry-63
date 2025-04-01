import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { Outfit, ClothingItem } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import OutfitSubscriptionPopup from '@/components/OutfitSubscriptionPopup';
import OliviaImageGallery from '@/components/outfits/OliviaImageGallery';

import NewClothesHeader from '@/components/new-clothes/NewClothesHeader';
import TryOnSection from '@/components/new-clothes/TryOnSection';
import PreviewResultSection from '@/components/new-clothes/PreviewResultSection';
import RelatedContentSection from '@/components/new-clothes/RelatedContentSection';
import PremiumFeaturesSection from '@/components/new-clothes/PremiumFeaturesSection';
import HelpTipsSection from '@/components/new-clothes/HelpTipsSection';
import { defaultOutfitTips } from '@/components/outfits/OutfitTips';

const NewClothes = () => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [clothingPhoto, setClothingPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isPremiumUser] = useState(false);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [showOliviaImageGallery, setShowOliviaImageGallery] = useState(false);
  const [isUsingOliviaImage, setIsUsingOliviaImage] = useState(false);
  const [showHelpTips, setShowHelpTips] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const isMobile = useIsMobile();
  
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
    if (finalImage && !isPremiumUser) {
      const hasSeenPopup = sessionStorage.getItem('hasSeenOutfitSubscriptionPopup');
      if (!hasSeenPopup) {
        const timer = setTimeout(() => {
          setShowSubscriptionPopup(true);
          sessionStorage.setItem('hasSeenOutfitSubscriptionPopup', 'true');
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [finalImage, isPremiumUser]);

  const handleUserPhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setUserPhoto(event.target?.result as string);
      setFinalImage(null);
      setIsUsingOliviaImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleClothingPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setClothingPhoto(event.target?.result as string);
        setFinalImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectOliviaImage = (imageSrc: string) => {
    setUserPhoto(imageSrc);
    setFinalImage(null);
    setIsUsingOliviaImage(true);
  };

  const handleTryOn = async () => {
    if (!userPhoto || !clothingPhoto) {
      toast.error('Please upload both your photo and a clothing photo');
      return;
    }

    try {
      setIsProcessing(true);
      toast.info('Processing your virtual try-on. This may take a few moments...');

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFinalImage(userPhoto);
      setSelectedItems([{
        id: 'main-item',
        name: 'Uploaded Item',
        type: 'shirt',
        imageUrl: clothingPhoto,
        occasions: ['casual'],
        seasons: ['all'],
        color: 'white',
        material: 'cotton',
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date()
      }]);
      
      toast.success('Virtual try-on complete!');
    } catch (error) {
      console.error('Error in virtual try-on:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddItem = (item: ClothingItem) => {
    setSelectedItems(prev => [...prev, item]);
    toast.success(`Added ${item.name} to your outfit!`);
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
    setSelectedItems([]);
    setIsUsingOliviaImage(false);
    toast.success('Photos cleared');
  };

  const handleSaveLook = () => {
    if (!finalImage) {
      toast.error('Create a look first!');
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
      
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-full">
        <motion.div 
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <NewClothesHeader />

          <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TryOnSection 
              userPhoto={userPhoto}
              clothingPhoto={clothingPhoto}
              isProcessing={isProcessing}
              isUsingOliviaImage={isUsingOliviaImage}
              onUserPhotoUpload={handleUserPhotoUpload}
              onClearUserPhoto={() => {
                setUserPhoto(null);
                setIsUsingOliviaImage(false);
              }}
              onClothingPhotoUpload={handleClothingPhotoUpload}
              onClearPhotos={clearPhotos}
              onTryOn={handleTryOn}
              onShowOliviaImageGallery={() => setShowOliviaImageGallery(true)}
            />
            
            <PreviewResultSection 
              finalImage={finalImage}
              outfit={finalImage ? mockOutfit : null}
              clothingItems={selectedItems}
              isProcessing={isProcessing}
              userPhoto={userPhoto}
              clothingPhoto={clothingPhoto}
              isOliviaImage={isUsingOliviaImage}
              isPremiumUser={isPremiumUser}
              onSaveLook={handleSaveLook}
              onAddItem={handleAddItem}
              onShowPremiumPopup={handleShowPremiumPopup}
            />
          </motion.div>
          
          <RelatedContentSection finalImage={finalImage} />
          
          <PremiumFeaturesSection 
            isPremiumUser={isPremiumUser} 
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
