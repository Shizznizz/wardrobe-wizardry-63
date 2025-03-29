
import { useState, useEffect } from 'react';
import { Outfit, ClothingItem, WeatherInfo, TimeOfDay, Activity } from '@/lib/types';

// Type for outfit log
export type OutfitLog = {
  id: string;
  outfitId: string;
  date: Date;
  timeOfDay: string;
  notes?: string;
  weatherCondition?: string;
  temperature?: string;
};

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
  const [outfitLogs, setOutfitLogs] = useState<OutfitLog[]>([]);

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
    // Also delete any logs associated with this outfit
    setOutfitLogs(outfitLogs.filter(log => log.outfitId !== id));
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

  // New outfit logging functions
  const addOutfitLog = (log: Omit<OutfitLog, 'id'>) => {
    const newLog: OutfitLog = {
      id: Date.now().toString(),
      ...log,
    };
    setOutfitLogs(prev => [...prev, newLog]);
    
    // Also update the outfit's timesWorn and lastWorn properties
    setOutfits(prev =>
      prev.map(outfit => {
        if (outfit.id === log.outfitId) {
          return {
            ...outfit,
            timesWorn: outfit.timesWorn + 1,
            lastWorn: log.date
          };
        }
        return outfit;
      })
    );
  };
  
  const updateOutfitLog = (id: string, updates: Partial<OutfitLog>) => {
    setOutfitLogs(prev =>
      prev.map(log => {
        if (log.id === id) {
          return { ...log, ...updates };
        }
        return log;
      })
    );
  };
  
  const deleteOutfitLog = (id: string) => {
    setOutfitLogs(prev => prev.filter(log => log.id !== id));
  };
  
  // Get logs for a specific date
  const getLogsForDate = (date: Date) => {
    return outfitLogs.filter(log => 
      log.date instanceof Date && 
      log.date.getDate() === date.getDate() &&
      log.date.getMonth() === date.getMonth() &&
      log.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Get logs for a specific outfit
  const getLogsForOutfit = (outfitId: string) => {
    return outfitLogs.filter(log => log.outfitId === outfitId);
  };
  
  // Get outfits not worn recently (in the last N days)
  const getRarelyWornOutfits = (days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return outfits.filter(outfit => {
      // Check logs for this outfit
      const logs = outfitLogs.filter(log => log.outfitId === outfit.id);
      if (logs.length === 0) return true; // Never worn
      
      // Find the most recent log
      const lastWorn = logs.reduce((latest, current) => 
        new Date(latest.date) > new Date(current.date) ? latest : current
      );
      
      return new Date(lastWorn.date) < cutoffDate;
    });
  };
  
  // Get the most frequently worn outfits
  const getFrequentlyWornOutfits = (threshold: number = 5) => {
    return outfits.map(outfit => ({
      ...outfit,
      logCount: outfitLogs.filter(log => log.outfitId === outfit.id).length
    }))
    .filter(outfit => outfit.logCount > threshold)
    .sort((a, b) => b.logCount - a.logCount);
  };
  
  // Get the most worn items from logs
  const getMostWornItems = () => {
    const itemCounts: { [key: string]: number } = {};
    
    outfitLogs.forEach(log => {
      const outfit = outfits.find(o => o.id === log.outfitId);
      if (outfit) {
        outfit.items.forEach(itemId => {
          itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
        });
      }
    });
    
    return Object.entries(itemCounts)
      .map(([itemId, count]) => ({
        itemId,
        item: clothingItems.find(item => item.id === itemId),
        count
      }))
      .filter(entry => entry.item) // Filter out any undefined items
      .sort((a, b) => b.count - a.count);
  };
  
  // Get seasonal insights
  const getSeasonalInsights = () => {
    // Group logs by season
    const seasonalLogs: { [key: string]: OutfitLog[] } = {};
    
    outfitLogs.forEach(log => {
      const outfit = outfits.find(o => o.id === log.outfitId);
      if (outfit) {
        outfit.seasons.forEach(season => {
          if (!seasonalLogs[season]) {
            seasonalLogs[season] = [];
          }
          seasonalLogs[season].push(log);
        });
      }
    });
    
    return Object.entries(seasonalLogs).map(([season, logs]) => ({
      season,
      count: logs.length,
      items: logs.flatMap(log => {
        const outfit = outfits.find(o => o.id === log.outfitId);
        return outfit ? outfit.items : [];
      })
    }));
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
    outfitLogs,
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
    // New outfit logging functions
    addOutfitLog,
    updateOutfitLog,
    deleteOutfitLog,
    getLogsForDate,
    getLogsForOutfit,
    getRarelyWornOutfits,
    getFrequentlyWornOutfits,
    getMostWornItems,
    getSeasonalInsights,
    setShowAssistant,
    setIsBuilderOpen
  };
}
