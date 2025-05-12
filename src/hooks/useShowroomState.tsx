
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Outfit } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

export const useShowroomState = () => {
  const { isAuthenticated, user, isPremiumUser: authIsPremiumUser } = useAuth();
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isUsingOliviaImage, setIsUsingOliviaImage] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [oliviaSuggestion, setOliviaSuggestion] = useState("");
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isProcessingTryOn, setIsProcessingTryOn] = useState(false);

  // Simply use the isPremiumUser from auth context directly
  // This means Daniel will see all content but not be treated as premium
  // Everyone else who is logged in will get premium features
  const isPremiumUser = authIsPremiumUser;

  const handleUserPhotoUpload = (photo: string) => {
    setIsUploadLoading(true);
    
    setTimeout(() => {
      setUserPhoto(photo);
      setIsUploadLoading(false);
      setFinalImage(null);
    }, 800);
  };

  const handleSelectOliviaImage = (imageSrc: string) => {
    setIsUploadLoading(true);
    setUserPhoto(imageSrc);
    setIsUsingOliviaImage(true);
    setFinalImage(null);
    
    setTimeout(() => {
      setIsUploadLoading(false);
      toast.success('Selected Olivia\'s image successfully!');
    }, 800);
  };

  const handleTryOnOutfit = (outfit?: Outfit) => {
    if (!userPhoto || !outfit) return;
    
    setIsProcessingTryOn(true);
    setFinalImage(null);
    
    setTimeout(() => {
      setFinalImage(userPhoto);
      setIsProcessingTryOn(false);
      setSelectedOutfit(outfit);
    }, 1500);
  };

  const handleClearUserPhoto = () => {
    setUserPhoto(null);
    setFinalImage(null);
    setIsUsingOliviaImage(false);
  };

  const handleSaveOutfit = () => {
    if (!finalImage) {
      toast.error('Create a look first!');
      return;
    }
    
    toast.success('Look saved to your wardrobe!', {
      description: 'You can access it anytime in your personal collection.'
    });
  };

  return {
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
    setSelectedOutfit,
    clearPhotos: handleClearUserPhoto, // Alias for handleClearUserPhoto to match what FittingRoom.tsx expects
  };
};
