import { useState, useEffect } from 'react';
import { Outfit, ClothingItem, WeatherInfo, TimeOfDay, Activity, ClothingSeason } from '@/lib/types';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';

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
    setShowRotatingView(true);
    setTimeout(() => setShowRotatingView(false), 1000);
  };

  const handleUserPhotoChange = (photoUrl: string) => {
    setUserPhoto(photoUrl);
    setFinalImage(null);
  };

  const handleClearUserPhoto = () => {
    setUserPhoto(null);
    setFinalImage(null);
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

  const addOutfitLog = (log: Omit<OutfitLog, 'id'>) => {
    const newLog: OutfitLog = {
      id: Date.now().toString(),
      ...log,
    };
    setOutfitLogs(prev => [...prev, newLog]);
    
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

  const getLogsForDate = (date: Date) => {
    return outfitLogs.filter(log => 
      log.date instanceof Date && 
      log.date.getDate() === date.getDate() &&
      log.date.getMonth() === date.getMonth() &&
      log.date.getFullYear() === date.getFullYear()
    );
  };

  const getLogsForOutfit = (outfitId: string) => {
    return outfitLogs.filter(log => log.outfitId === outfitId);
  };

  const getRarelyWornOutfits = (days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return outfits.filter(outfit => {
      const logs = outfitLogs.filter(log => log.outfitId === outfit.id);
      if (logs.length === 0) return true;
      
      const lastWorn = logs.reduce((latest, current) => 
        new Date(latest.date) > new Date(current.date) ? latest : current
      );
      
      return new Date(lastWorn.date) < cutoffDate;
    });
  };

  const getFrequentlyWornOutfits = (threshold: number = 5) => {
    return outfits.map(outfit => ({
      ...outfit,
      logCount: outfitLogs.filter(log => log.outfitId === outfit.id).length
    }))
    .filter(outfit => outfit.logCount > threshold)
    .sort((a, b) => b.logCount - a.logCount);
  };

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
      .filter(entry => entry.item)
      .sort((a, b) => b.count - a.count);
  };

  const getSeasonalInsights = () => {
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

  const getWeatherBasedRecommendations = () => {
    if (!currentWeather) return [];
    
    const temp = currentWeather.temperature;
    let recommendedSeason: ClothingSeason = 'all';
    
    if (temp < 5) recommendedSeason = 'winter';
    else if (temp < 15) recommendedSeason = 'autumn';
    else if (temp < 25) recommendedSeason = 'spring';
    else recommendedSeason = 'summer';
    
    return outfits
      .filter(outfit => 
        outfit.seasons.includes(recommendedSeason) || 
        outfit.seasons.includes('all')
      )
      .map(outfit => {
        const suitabilityScore = outfitLogs
          .filter(log => 
            log.outfitId === outfit.id && 
            log.weatherCondition === currentWeather.condition.toLowerCase()
          )
          .length;
        
        return {
          outfit,
          suitabilityScore,
          lastWorn: outfit.lastWorn
        };
      })
      .sort((a, b) => {
        if (b.suitabilityScore !== a.suitabilityScore) {
          return b.suitabilityScore - a.suitabilityScore;
        }
        
        if (!a.lastWorn) return -1;
        if (!b.lastWorn) return 1;
        
        return new Date(a.lastWorn).getTime() - new Date(b.lastWorn).getTime();
      })
      .slice(0, 5);
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
    addOutfitLog,
    updateOutfitLog,
    deleteOutfitLog,
    getLogsForDate,
    getLogsForOutfit,
    getRarelyWornOutfits,
    getFrequentlyWornOutfits,
    getMostWornItems,
    getSeasonalInsights,
    getWeatherBasedRecommendations,
    setShowAssistant,
    setIsBuilderOpen
  };
}
