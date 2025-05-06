
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Outfit } from '@/lib/types';

interface OutfitContextType {
  isBuilderOpen: boolean;
  setIsBuilderOpen: (isOpen: boolean) => void;
  selectedOutfitId: string | null;
  setSelectedOutfitId: (id: string | null) => void;
  isCreatingNewOutfit: boolean;
  setIsCreatingNewOutfit: (isCreating: boolean) => void;
}

const OutfitContext = createContext<OutfitContextType | undefined>(undefined);

export const OutfitProvider = ({ children }: { children: ReactNode }) => {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null);
  const [isCreatingNewOutfit, setIsCreatingNewOutfit] = useState(false);

  return (
    <OutfitContext.Provider value={{ 
      isBuilderOpen, 
      setIsBuilderOpen,
      selectedOutfitId,
      setSelectedOutfitId,
      isCreatingNewOutfit,
      setIsCreatingNewOutfit
    }}>
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
