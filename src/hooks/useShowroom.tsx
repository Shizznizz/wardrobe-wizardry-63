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
  const { isAuthenticated = false } = useAuth();
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [oliviaMood, setOliviaMood] = useState<'happy' | 'thinking' | 'neutral'>('neutral');
  const [stylingTip, setStylingTip] = useState<string | null>(null);
  const [challengeParticipantCount] = useState<number>(347); // For demo purposes
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const [clothingPhoto, setClothingPhoto] = useState<string | null>(null);
  const [oliviaSuggestion, setOliviaSuggestion] = useState<string>("");
  
  const outfitsWithDefault = Array.isArray(sampleOutfits) ? sampleOutfits : [];
  const clothingItemsWithDefault = Array.isArray(sampleClothingItems) ? sampleClothingItems : [];
  
  const {
    isPremiumUser = false,
    userPhoto = null,
    finalImage = null,
    setFinalImage = () => {},
    isUsingOliviaImage = false,
    isUploadLoading = false,
    selectedOutfit = null,
    isProcessingTryOn = false,
    setIsProcessingTryOn = () => {},
    handleUserPhotoUpload = () => {},
    handleSelectOliviaImage = () => {},
    handleTryOnOutfit = () => {},
    handleClearUserPhoto = () => {},
    handleSaveOutfit = () => {},
    setSelectedOutfit = () => {}
  } = useShowroomState();

  const {
    fashionCollections = [],
    selectedItems = [],
    setSelectedItems = () => {},
    handleAddItem = () => {},
    handleTryOnTrendingItem = () => "",
    handleSuggestAnotherOutfit = () => {},
    clothingItems = []
  } = useShowroomCollections(outfitsWithDefault, clothingItemsWithDefault);

  const {
    showTips = false,
    showSubscriptionPopup = false,
    showOliviaImageGallery = false,
    showStatusBar = false,
    setShowTips = () => {},
    setShowSubscriptionPopup = () => {},
    setShowOliviaImageGallery = () => {},
    setShowStatusBar = () => {},
    handleUpgradeToPremium = () => {},
    handleShowPremiumPopup = () => {},
    handleCloseSubscriptionPopup = () => {}
  } = useShowroomPopups(isPremiumUser, isAuthenticated, userPhoto, finalImage);

  useEffect(() => {
    if (userPhoto && selectedOutfit) {
      setShowStatusBar(true);
      
      const suggestions = [
        "This outfit looks amazing for a summer evening!",
        "Perfect choice for your style profile!",
        "This color really complements your features!",
        "I love how this outfit highlights your silhouette!",
        "This look will definitely turn heads!",
        "The proportions of this outfit are really flattering on you!",
        "These colors work beautifully together and suit your complexion.",
        "This is a great balance of comfort and style - perfect for your day!"
      ];
      setOliviaSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
    } else {
      setShowStatusBar(false);
    }
  }, [userPhoto, selectedOutfit, setShowStatusBar]);

  const handleClothingPhotoUpload = (photo: string) => {
    setClothingPhoto(photo);
    setFinalImage(null);
  };
  
  const handleSelectOutfit = (outfit: Outfit) => {
    if (!outfit) return;
    
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
    
    if (!item) return null;
    
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
    
    // Add these exported methods
    handleSelectOliviaImage,
    handleSelectOutfit,
    handleUserPhotoUpload,
    handleClothingPhotoUpload,
    handleSaveLook,
    handleUpgradeToPremium,
    handleCloseSubscriptionPopup,
    handleTryOn,
    clearPhotos: handleClearUserPhoto,
    handleTryOnTrendingItem: handleTryOnTrendingItemWithCheck,
    handleSuggestAnotherOutfit: suggestAnotherOutfit,
    handleShowPremiumPopup,
    handleOpenChat,
    setShowOliviaImageGallery,
    setShowFloatingChat,
    
    // Add the setters
    setFinalImage,
    setOliviaSuggestion,
    setIsProcessingTryOn,
    setSelectedItems
  };
};
