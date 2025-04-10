import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useOutfitState } from './useOutfitState';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import { Outfit } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

export const useShowroom = () => {
  const { isAuthenticated } = useAuth();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [showOliviaImageGallery, setShowOliviaImageGallery] = useState(false);
  const [isUsingOliviaImage, setIsUsingOliviaImage] = useState(false);
  const [showStatusBar, setShowStatusBar] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [oliviaSuggestion, setOliviaSuggestion] = useState("");
  
  useEffect(() => {
    setIsPremiumUser(isAuthenticated);
  }, [isAuthenticated]);
  
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

  useEffect(() => {
    if (userPhoto && finalImage && !isPremiumUser && !isAuthenticated) {
      const hasSeenPopup = sessionStorage.getItem('hasSeenSubscriptionPopup');
      if (!hasSeenPopup) {
        const timer = setTimeout(() => {
          setShowSubscriptionPopup(true);
          sessionStorage.setItem('hasSeenSubscriptionPopup', 'true');
        }, 1500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [userPhoto, finalImage, isPremiumUser, isAuthenticated]);

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

  const handleSelectOutfit = (outfit: Outfit) => {
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
    
    handleSaveOutfit(selectedOutfit!);
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

  const handlePreviewNow = () => {
    if (selectedOutfit) {
      handleTryOnOutfit(selectedOutfit);
    }
  };

  const handleSuggestAnotherOutfit = () => {
    const recommendedOutfits = fashionCollections.find(c => c.id === 'recommended')?.outfits || [];
    if (recommendedOutfits.length > 0) {
      const randomOutfit = recommendedOutfits[Math.floor(Math.random() * recommendedOutfits.length)];
      handleTryOnOutfit(randomOutfit);
      toast.success('Olivia suggested a new outfit for you!');
    }
  };

  return {
    isPremiumUser: isPremiumUser || isAuthenticated,
    showTips,
    showSubscriptionPopup,
    showOliviaImageGallery,
    isUsingOliviaImage,
    showStatusBar,
    isUploadLoading,
    oliviaSuggestion,
    outfits,
    clothingItems,
    selectedOutfit,
    userPhoto,
    finalImage,
    isProcessingTryOn,
    fashionCollections,
    
    handleSelectOliviaImage,
    handleSelectOutfit,
    handleUserPhotoUpload,
    handleSaveLook,
    handleUpgradeToPremium,
    handleCloseSubscriptionPopup,
    resetSelection,
    handlePreviewNow,
    handleSuggestAnotherOutfit,
    setShowOliviaImageGallery,
  };
};
