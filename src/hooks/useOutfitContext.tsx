
import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { WeatherInfo, Outfit } from '@/lib/types';

interface OutfitContextType {
  weather: WeatherInfo | null;
  situation: string | null;
  selectedOutfit: Outfit | null;
  isBuilderOpen: boolean;
  setIsBuilderOpen: (isOpen: boolean) => void;
  updateWeather: (weather: WeatherInfo) => void;
  updateSituation: (situation: string) => void;
  selectOutfit: (outfit: Outfit) => void;
}

const OutfitContext = createContext<OutfitContextType | undefined>(undefined);

export const OutfitProvider = ({ children }: { children: ReactNode }) => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [situation, setSituation] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const updateWeather = useCallback((newWeather: WeatherInfo) => {
    setWeather(newWeather);
  }, []);

  const updateSituation = useCallback((newSituation: string) => {
    setSituation(newSituation);
  }, []);

  const selectOutfit = useCallback((outfit: Outfit) => {
    setSelectedOutfit(outfit);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    weather,
    situation,
    selectedOutfit,
    isBuilderOpen,
    setIsBuilderOpen,
    updateWeather,
    updateSituation,
    selectOutfit
  }), [weather, situation, selectedOutfit, isBuilderOpen, updateWeather, updateSituation, selectOutfit]);

  return (
    <OutfitContext.Provider value={value}>
      {children}
    </OutfitContext.Provider>
  );
};

export const useOutfitContext = () => {
  const context = useContext(OutfitContext);
  if (context === undefined) {
    throw new Error('useOutfitContext must be used within an OutfitProvider');
  }
  return context;
};
