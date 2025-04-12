
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useOutfitState } from './useOutfitState';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import { Outfit, ClothingItem } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { useShowroomState } from './useShowroomState';
import { useShowroomCollections } from './useShowroomCollections';
import { useShowroomPopups } from './useShowroomPopups';

export const useShowroom = () => {
  const { isAuthenticated } = useAuth();
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [oliviaMood, setOliviaMood] = useState<'happy' | 'thinking' | 'neutral'>('neutral');
  const [stylingTip, setStylingTip] = useState<string | null>(null);
  const [challengeParticipantCount] = useState<number>(347); // For demo purposes
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const [clothingPhoto, setClothingPhoto] = useState<string | null>(null);
  
  const {
    isPremiumUser,
    userPhoto,
    finalImage,
    setFinalImage,
    isUsingOliviaImage,
    isUploadLoading,
    oliviaSuggestion,
    setOliviaSuggestion,
    selectedOutfit,
    isProcessingTryOn,
    setIsProcessingTryOn,
    handleUserPhotoUpload,
    handleSelectOliviaImage,
    handleTryOnOutfit,
    handleClearUserPhoto,
    handleSaveOutfit,
    setSelectedOutfit
  } = useShowroomState();

  const {
    fashionCollections,
    selectedItems,
    setSelectedItems,
    handleAddItem,
    handleTryOnTrendingItem,
    handleSuggestAnotherOutfit,
    clothingItems
  } = useShowroomCollections(sampleOutfits, sampleClothingItems);

  const {
    showTips,
    showSubscriptionPopup,
    showOliviaImageGallery,
    showStatusBar,
    setShowTips,
    setShowSubscriptionPopup,
    setShowOliviaImageGallery,
    setShowStatusBar,
    handleUpgradeToPremium,
    handleShowPremiumPopup,
    handleCloseSubscriptionPopup
  } = useShowroomPopups(isPremiumUser, isAuthenticated, userPhoto, finalImage);

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

  const handleClothingPhotoUpload = (photo: string) => {
    setClothingPhoto(photo);
    setFinalImage(null);
  };
  
  const handleSelectOutfit = (outfit: Outfit) => {
    handleTryOnOutfit(outfit);
    
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
    
    if (!isPremiumUser && !isAuthenticated) {
      setShowSubscriptionPopup(true);
      return;
    }
    
    handleSaveOutfit();
  };

  const handleTryOn = async () => {
    if (!userPhoto || !clothingPhoto) {
      toast.error("Please upload both a photo of yourself and a clothing item");
      return;
    }

    setIsProcessingTryOn(true);
    setFinalImage(null);
    setStylingTip(null);
    setOliviaMood('thinking');

    try {
      setTimeout(() => {
        setFinalImage(userPhoto);
        setIsProcessingTryOn(false);
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
      }, 1500);
    } catch (error) {
      console.error("Error in AI try-on:", error);
      setGenerationError(String(error));
      setOliviaMood('thinking');
      toast.error("Failed to generate virtual try-on");
      setIsProcessingTryOn(false);
    }
  };

  const clearPhotos = () => {
    handleClearUserPhoto();
    setClothingPhoto(null);
    setSelectedOutfit(null);
    setPredictionId(null);
    setSelectedItems([]);
    setStylingTip(null);
    toast.success('Photos cleared');
  };

  const handleTryOnTrendingItemWithCheck = (item: ClothingItem) => {
    if (!isPremiumUser && !isAuthenticated) {
      setShowSubscriptionPopup(true);
      return;
    }
    
    const imageUrl = handleTryOnTrendingItem(item, isPremiumUser || isAuthenticated);
    if (imageUrl) setClothingPhoto(imageUrl);
    
    if (!userPhoto) {
      toast.info("Please upload a photo first or select Olivia as a model");
    }
  };

  // Wrapper for handleSuggestAnotherOutfit to use local handleTryOnOutfit
  const suggestAnotherOutfit = () => {
    handleSuggestAnotherOutfit(handleTryOnOutfit);
  };

  // Open chat handler
  const handleOpenChat = () => {
    setShowFloatingChat(true);
    toast.info("Olivia is ready to chat about your style!");
  };

  // Added missing methods for Showroom.tsx
  const resetSelection = () => {
    setSelectedOutfit(null);
    setClothingPhoto(null);
    clearPhotos();
  };

  const handlePreviewNow = () => {
    if (userPhoto && selectedOutfit) {
      document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      toast.info("Please select a photo and outfit first");
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
    userPhoto,
    clothingPhoto,
    finalImage,
    isProcessingTryOn,
    selectedOutfit,
    selectedItems,
    fashionCollections,
    clothingItems,
    oliviaMood,
    stylingTip,
    showFloatingChat,
    generationError,
    challengeParticipantCount,
    
    // Added missing methods
    resetSelection,
    handlePreviewNow,
    
    // Add these exported methods
    handleSelectOliviaImage,
    handleSelectOutfit,
    handleUserPhotoUpload,
    handleClothingPhotoUpload,
    handleSaveLook,
    handleUpgradeToPremium,
    handleCloseSubscriptionPopup,
    handleTryOn,
    clearPhotos,
    handleTryOnTrendingItem: handleTryOnTrendingItemWithCheck,
    handleSuggestAnotherOutfit: suggestAnotherOutfit,
    handleShowPremiumPopup,
    handleOpenChat,
    setShowOliviaImageGallery,
    setShowFloatingChat,
    
    // Add the missing setters that were causing errors
    setFinalImage,
    setOliviaSuggestion,
    setIsProcessingTryOn,
    setSelectedItems
  };
};
