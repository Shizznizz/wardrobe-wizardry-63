
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Outfit } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

export const useShowroomState = () => {
  const { isAuthenticated, user } = useAuth();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isUsingOliviaImage, setIsUsingOliviaImage] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [oliviaSuggestion, setOliviaSuggestion] = useState("");
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isProcessingTryOn, setIsProcessingTryOn] = useState(false);

  useEffect(() => {
    // Modified to explicitly check user email for non-premium view
    const isDanielDeurlooEmail = user?.email === 'danieldeurloo@hotmail.com';
    // If you're Daniel, don't get premium features
    setIsPremiumUser(isAuthenticated && !isDanielDeurlooEmail);
  }, [isAuthenticated, user]);

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
  };
};
