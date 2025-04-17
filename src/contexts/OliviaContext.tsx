
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Outfit } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

interface OliviaContextType {
  currentOutfit: Outfit | null;
  setCurrentOutfit: (outfit: Outfit | null) => void;
  userHasPhoto: boolean;
  setUserHasPhoto: (hasPhoto: boolean) => void;
  hasUploadedWardrobe: boolean;
  setHasUploadedWardrobe: (hasWardrobe: boolean) => void;
  weatherTemp: number | undefined;
  setWeatherTemp: (temp: number | undefined) => void;
  weatherCondition: string | undefined;
  setWeatherCondition: (condition: string | undefined) => void;
  isPremiumUser: boolean;
  handleUpgradeToPremium: () => void;
}

const OliviaContext = createContext<OliviaContextType | undefined>(undefined);

interface OliviaProviderProps {
  children: ReactNode;
  isPremiumUser?: boolean;
  onUpgradeToPremium?: () => void;
}

export const OliviaProvider = ({ 
  children,
  isPremiumUser: propIsPremium,
  onUpgradeToPremium
}: OliviaProviderProps) => {
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null);
  const [userHasPhoto, setUserHasPhoto] = useState(false);
  const [hasUploadedWardrobe, setHasUploadedWardrobe] = useState(false);
  const [weatherTemp, setWeatherTemp] = useState<number | undefined>(undefined);
  const [weatherCondition, setWeatherCondition] = useState<string | undefined>(undefined);
  const [isPremiumUser, setIsPremiumUser] = useState(propIsPremium || false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Update premium status when auth changes or props change
  useEffect(() => {
    setIsPremiumUser(propIsPremium || isAuthenticated || false);
  }, [propIsPremium, isAuthenticated]);

  // Default upgrade handler
  const handleUpgradeToPremium = () => {
    if (onUpgradeToPremium) {
      onUpgradeToPremium();
    } else {
      // Fallback for when no handler is provided
      alert('Premium upgrade not available');
    }
  };

  return (
    <OliviaContext.Provider
      value={{
        currentOutfit,
        setCurrentOutfit,
        userHasPhoto,
        setUserHasPhoto,
        hasUploadedWardrobe,
        setHasUploadedWardrobe,
        weatherTemp,
        setWeatherTemp,
        weatherCondition,
        setWeatherCondition,
        isPremiumUser,
        handleUpgradeToPremium
      }}
    >
      {children}
    </OliviaContext.Provider>
  );
};

export const useOlivia = () => {
  const context = useContext(OliviaContext);
  if (context === undefined) {
    throw new Error('useOlivia must be used within an OliviaProvider');
  }
  return context;
};
