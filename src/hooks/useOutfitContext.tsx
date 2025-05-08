
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Outfit } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define the OutfitContextType to include all required properties
export interface OutfitContextType {
  selectedOutfitId: string | null;
  setSelectedOutfitId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedOutfit: Outfit | null;
  setSelectedOutfit: React.Dispatch<React.SetStateAction<Outfit | null>>;
  isCreatingNewOutfit: boolean;
  setIsCreatingNewOutfit: React.Dispatch<React.SetStateAction<boolean>>;
  isBuilderOpen: boolean;
  setIsBuilderOpen: React.Dispatch<React.SetStateAction<boolean>>;
  outfits: Outfit[];
  setOutfits: React.Dispatch<React.SetStateAction<Outfit[]>>;
  updateOutfit: (id: string, updates: Partial<Outfit>) => Promise<boolean>;
}

// Create the context with an initial undefined value
const OutfitContext = createContext<OutfitContextType | undefined>(undefined);

// Define the provider props
interface OutfitProviderProps {
  children: ReactNode;
}

// Create the provider component
export const OutfitProvider = ({ children }: OutfitProviderProps) => {
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isCreatingNewOutfit, setIsCreatingNewOutfit] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const { user } = useAuth();

  const updateOutfit = async (id: string, updates: Partial<Outfit>): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to update outfits');
      return false;
    }
    
    try {
      // Convert date objects to ISO strings for the database
      const dbUpdates = {
        ...updates,
        date_added: updates.dateAdded ? (updates.dateAdded instanceof Date ? updates.dateAdded.toISOString() : updates.dateAdded) : undefined,
        last_worn: updates.lastWorn ? (updates.lastWorn instanceof Date ? updates.lastWorn.toISOString() : updates.lastWorn) : undefined,
        // Remove properties that aren't in the database schema
        dateAdded: undefined,
        lastWorn: undefined
      };
      
      const { error } = await supabase
        .from('outfits')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setOutfits(prev => prev.map(outfit => 
        outfit.id === id ? { ...outfit, ...updates } : outfit
      ));
      
      toast.success('Outfit updated');
      return true;
    } catch (e) {
      console.error('Error updating outfit:', e);
      toast.error('Failed to update outfit');
      return false;
    }
  };

  // Create the value object to be provided by the context
  const contextValue: OutfitContextType = {
    selectedOutfitId,
    setSelectedOutfitId,
    selectedOutfit,
    setSelectedOutfit,
    isCreatingNewOutfit,
    setIsCreatingNewOutfit,
    isBuilderOpen,
    setIsBuilderOpen,
    outfits,
    setOutfits,
    updateOutfit
  };

  return (
    <OutfitContext.Provider value={contextValue}>
      {children}
    </OutfitContext.Provider>
  );
};

// Create a custom hook to use the context
export const useOutfitContext = () => {
  const context = useContext(OutfitContext);
  
  if (context === undefined) {
    throw new Error('useOutfitContext must be used within an OutfitProvider');
  }
  
  return context;
};
