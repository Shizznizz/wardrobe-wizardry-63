
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Outfit, ClothingItem } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface OutfitContextType {
  outfits: Outfit[];
  wardrobe: ClothingItem[];
  selectedOutfit: Outfit | null;
  loading: boolean;
  error: string | null;
  addOutfit: (outfit: Omit<Outfit, 'id'>) => Promise<Outfit | null>;
  updateOutfit: (id: string, updates: Partial<Outfit>) => Promise<boolean>;
  deleteOutfit: (id: string) => Promise<boolean>;
  selectOutfit: (outfit: Outfit | null) => void;
  refreshData: () => Promise<void>;
  addToWardrobe: (item: ClothingItem) => Promise<ClothingItem | null>;
  removeFromWardrobe: (itemId: string) => Promise<boolean>;
  toggleFavoriteOutfit: (outfitId: string) => Promise<boolean>;
  toggleFavoriteItem: (itemId: string) => Promise<boolean>;
  userWardrobeCount: number;
  userOutfitCount: number;
}

const OutfitContext = createContext<OutfitContextType | undefined>(undefined);

interface OutfitProviderProps {
  children: ReactNode;
}

export const OutfitProvider = ({ children }: OutfitProviderProps) => {
  const { user, isAuthenticated } = useAuth();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userWardrobeCount, setUserWardrobeCount] = useState(0);
  const [userOutfitCount, setUserOutfitCount] = useState(0);

  // Fetch user data when auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshData();
    } else {
      // Clear data when logged out
      setOutfits([]);
      setWardrobe([]);
      setUserWardrobeCount(0);
      setUserOutfitCount(0);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const refreshData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Fetch user's outfits
      const { data: outfitData, error: outfitError } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', user.id)
        .order('date_added', { ascending: false });
      
      if (outfitError) throw outfitError;
      
      // Fetch user's wardrobe
      const { data: wardrobeData, error: wardrobeError } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('user_id', user.id);
      
      if (wardrobeError) throw wardrobeError;
      
      // Process outfits data
      const processedOutfits = outfitData?.map(item => ({
        ...item,
        dateAdded: new Date(item.date_added),
        lastWorn: item.last_worn ? new Date(item.last_worn) : undefined,
      })) as Outfit[] || [];
      
      // Process wardrobe data
      const processedWardrobe = wardrobeData?.map(item => {
        const itemData = item.item_data as ClothingItem;
        return {
          ...itemData,
          id: itemData.id || item.id,
          favorite: item.favorite || false
        };
      }) || [];
      
      setOutfits(processedOutfits);
      setWardrobe(processedWardrobe);
      setUserOutfitCount(processedOutfits.length);
      setUserWardrobeCount(processedWardrobe.length);
    } catch (e) {
      console.error('Error fetching user data:', e);
      setError('Failed to load your data');
    } finally {
      setLoading(false);
    }
  };

  const addOutfit = async (outfit: Omit<Outfit, 'id'>): Promise<Outfit | null> => {
    if (!user) {
      toast.error('Please log in to save outfits');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('outfits')
        .insert({
          ...outfit,
          user_id: user.id,
          date_added: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const newOutfit = {
        ...data,
        dateAdded: new Date(data.date_added),
        lastWorn: data.last_worn ? new Date(data.last_worn) : undefined,
      } as Outfit;
      
      setOutfits(prev => [newOutfit, ...prev]);
      setUserOutfitCount(prev => prev + 1);
      toast.success('Outfit saved successfully');
      
      return newOutfit;
    } catch (e) {
      console.error('Error adding outfit:', e);
      toast.error('Failed to save outfit');
      return null;
    }
  };

  const updateOutfit = async (id: string, updates: Partial<Outfit>): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to update outfits');
      return false;
    }
    
    try {
      // Convert date objects to ISO strings for the database
      const dbUpdates = {
        ...updates,
        date_added: updates.dateAdded ? updates.dateAdded.toISOString() : undefined,
        last_worn: updates.lastWorn ? updates.lastWorn.toISOString() : undefined,
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

  const deleteOutfit = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to delete outfits');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('outfits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setOutfits(prev => prev.filter(outfit => outfit.id !== id));
      setUserOutfitCount(prev => prev - 1);
      toast.success('Outfit deleted');
      return true;
    } catch (e) {
      console.error('Error deleting outfit:', e);
      toast.error('Failed to delete outfit');
      return false;
    }
  };

  const addToWardrobe = async (item: ClothingItem): Promise<ClothingItem | null> => {
    if (!user) {
      toast.error('Please log in to add items to your wardrobe');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('wardrobe_items')
        .insert({
          user_id: user.id,
          item_data: item,
          favorite: item.favorite || false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      const newItem = {
        ...item,
        id: data.id
      };
      
      setWardrobe(prev => [newItem, ...prev]);
      setUserWardrobeCount(prev => prev + 1);
      toast.success('Item added to your wardrobe');
      
      return newItem;
    } catch (e) {
      console.error('Error adding item to wardrobe:', e);
      toast.error('Failed to add item to wardrobe');
      return null;
    }
  };

  const removeFromWardrobe = async (itemId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to remove items from your wardrobe');
      return false;
    }
    
    try {
      // First, check if this is a database item or just a client-side item
      const dbItem = wardrobe.find(item => item.id === itemId);
      
      if (dbItem) {
        const { error } = await supabase
          .from('wardrobe_items')
          .delete()
          .eq('id', itemId)
          .eq('user_id', user.id);

        if (error) throw error;
      }

      setWardrobe(prev => prev.filter(item => item.id !== itemId));
      setUserWardrobeCount(prev => prev - 1);
      toast.success('Item removed from wardrobe');
      return true;
    } catch (e) {
      console.error('Error removing item from wardrobe:', e);
      toast.error('Failed to remove item');
      return false;
    }
  };

  const toggleFavoriteOutfit = async (outfitId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to favorite outfits');
      return false;
    }
    
    try {
      const outfit = outfits.find(o => o.id === outfitId);
      if (!outfit) return false;
      
      const newFavoriteStatus = !outfit.favorite;
      
      const { error } = await supabase
        .from('outfits')
        .update({ favorite: newFavoriteStatus })
        .eq('id', outfitId)
        .eq('user_id', user.id);

      if (error) throw error;

      setOutfits(prev => prev.map(o => 
        o.id === outfitId ? { ...o, favorite: newFavoriteStatus } : o
      ));
      
      toast.success(newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites');
      return true;
    } catch (e) {
      console.error('Error toggling favorite outfit:', e);
      toast.error('Failed to update favorite status');
      return false;
    }
  };

  const toggleFavoriteItem = async (itemId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to favorite items');
      return false;
    }
    
    try {
      const item = wardrobe.find(i => i.id === itemId);
      if (!item) return false;
      
      const newFavoriteStatus = !item.favorite;
      
      const { error } = await supabase
        .from('wardrobe_items')
        .update({ favorite: newFavoriteStatus })
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;

      setWardrobe(prev => prev.map(i => 
        i.id === itemId ? { ...i, favorite: newFavoriteStatus } : i
      ));
      
      toast.success(newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites');
      return true;
    } catch (e) {
      console.error('Error toggling favorite item:', e);
      toast.error('Failed to update favorite status');
      return false;
    }
  };

  return (
    <OutfitContext.Provider value={{
      outfits,
      wardrobe,
      selectedOutfit,
      loading,
      error,
      addOutfit,
      updateOutfit,
      deleteOutfit,
      selectOutfit: setSelectedOutfit,
      refreshData,
      addToWardrobe,
      removeFromWardrobe,
      toggleFavoriteOutfit,
      toggleFavoriteItem,
      userWardrobeCount,
      userOutfitCount
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
