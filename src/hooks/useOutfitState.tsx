
import { useState, useEffect } from 'react';
import { Outfit, ClothingItem, WeatherInfo, TimeOfDay, Activity } from '@/lib/types';

export function useOutfitState(initialOutfits: Outfit[], initialClothingItems: ClothingItem[]) {
  const [outfits, setOutfits] = useState<Outfit[]>(initialOutfits);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>(initialClothingItems);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<WeatherInfo | null>(null);
  const [showRotatingView, setShowRotatingView] = useState(false);
  const [weatherBackground, setWeatherBackground] = useState("from-slate-950 to-purple-950");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isProcessingTryOn, setIsProcessingTryOn] = useState(false);

  useEffect(() => {
    // Update background based on weather
    if (currentWeather) {
      const condition = currentWeather.condition.toLowerCase();
      if (condition.includes('rain')) {
        setWeatherBackground("from-slate-900 to-blue-950");
      } else if (condition.includes('cloud')) {
        setWeatherBackground("from-slate-800 to-indigo-950");
      } else if (condition.includes('clear') || condition.includes('sun')) {
        setWeatherBackground("from-indigo-900 to-purple-900");
      } else if (condition.includes('snow')) {
        setWeatherBackground("from-slate-800 to-sky-950");
      }
    }
  }, [currentWeather]);

  const handleCreateOutfit = () => {
    setSelectedOutfit(null);
    setIsBuilderOpen(!isBuilderOpen);
  };

  const handleEditOutfit = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    setIsBuilderOpen(true);
  };

  const handleSaveOutfit = (newOutfit: Outfit) => {
    if (selectedOutfit) {
      setOutfits(outfits.map(outfit => outfit.id === selectedOutfit.id ? newOutfit : outfit));
    } else {
      setOutfits([...outfits, { ...newOutfit, id: String(Date.now()) }]);
    }
    setIsBuilderOpen(false);
    setSelectedOutfit(null);
  };

  const handleDeleteOutfit = (id: string) => {
    setOutfits(outfits.filter(outfit => outfit.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setOutfits(prev =>
      prev.map(outfit =>
        outfit.id === id ? { ...outfit, favorite: !outfit.favorite } : outfit
      )
    );
  };

  const handleWeatherChange = (weather: WeatherInfo) => {
    setCurrentWeather(weather);
  };

  const handleShowTips = () => {
    setShowAssistant(true);
  };

  const handleAssistantAction = () => {
    setShowAssistant(false);
  };

  const handleRefreshOutfit = () => {
    // Animation effect for refreshing
    setShowRotatingView(true);
    setTimeout(() => setShowRotatingView(false), 1000);
  };

  const handleUserPhotoChange = (photoUrl: string) => {
    setUserPhoto(photoUrl);
    setFinalImage(null); // Clear any existing try-on result
  };

  const handleClearUserPhoto = () => {
    setUserPhoto(null);
    setFinalImage(null);
  };

  const handleTryOnOutfit = (outfit: Outfit) => {
    if (!userPhoto) return;
    
    setIsProcessingTryOn(true);
    setFinalImage(null);
    
    // Simulate processing - in a real app, this would be an API call to a service
    // that would composite the outfit onto the user's photo
    setTimeout(() => {
      setFinalImage(userPhoto); // For demo, just show the user photo
      setIsProcessingTryOn(false);
      setSelectedOutfit(outfit);
    }, 1500);
  };

  // New functions for outfit calendar and tracking
  const handleWearOutfit = (outfitId: string, date: Date = new Date()) => {
    setOutfits(prev =>
      prev.map(outfit => {
        if (outfit.id === outfitId) {
          return {
            ...outfit,
            timesWorn: outfit.timesWorn + 1,
            lastWorn: date
          };
        }
        return outfit;
      })
    );
  };

  const getOutfitsByDate = (date: Date) => {
    return outfits.filter(
      outfit => outfit.lastWorn && 
      new Date(outfit.lastWorn).toDateString() === date.toDateString()
    );
  };

  const getRarelyWornOutfits = (days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return outfits.filter(outfit => {
      if (!outfit.lastWorn) return true;
      return new Date(outfit.lastWorn) < cutoffDate;
    });
  };

  const getFrequentlyWornOutfits = (threshold: number = 5) => {
    return outfits.filter(outfit => outfit.timesWorn > threshold);
  };

  return {
    outfits,
    clothingItems,
    isBuilderOpen,
    selectedOutfit,
    showAssistant,
    weatherBackground,
    showRotatingView,
    userPhoto,
    finalImage,
    isProcessingTryOn,
    handleCreateOutfit,
    handleEditOutfit,
    handleSaveOutfit,
    handleDeleteOutfit,
    handleToggleFavorite,
    handleWeatherChange,
    handleShowTips,
    handleAssistantAction,
    handleRefreshOutfit,
    handleUserPhotoChange,
    handleClearUserPhoto,
    handleTryOnOutfit,
    // New calendar and tracking functions
    handleWearOutfit,
    getOutfitsByDate,
    getRarelyWornOutfits,
    getFrequentlyWornOutfits,
    setShowAssistant,
    setIsBuilderOpen
  };
}
