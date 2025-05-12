
import { useState, useEffect } from 'react';
import { Outfit } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TrendingOutfitsResult {
  outfits: Outfit[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshOutfits: () => Promise<void>;
  isRefreshing: boolean;
}

export const useTrendingOutfits = (): TrendingOutfitsResult => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchTrendingOutfits = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call our edge function to get trending outfits
      const { data, error } = await supabase.functions.invoke('get-trending-outfits');
      
      if (error) {
        console.error('Error fetching trending outfits:', error);
        setError('Failed to fetch trending outfits. Please try again later.');
        return;
      }
      
      if (data && data.outfits) {
        setOutfits(data.outfits);
        setLastUpdated(new Date(data.lastUpdated));
      } else {
        // If no trending outfits available, fetch some random outfits as fallback
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('outfits')
          .select('*')
          .limit(10);
          
        if (fallbackError) {
          console.error('Error fetching fallback outfits:', fallbackError);
          setError('Failed to fetch outfits. Please try again later.');
          return;
        }
        
        if (fallbackData) {
          setOutfits(fallbackData);
          setLastUpdated(new Date());
        }
      }
    } catch (err) {
      console.error('Exception fetching trending outfits:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTrendingOutfits();
  }, [refreshCounter]);

  const refreshOutfits = async () => {
    setIsRefreshing(true);
    try {
      await fetchTrendingOutfits();
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    outfits,
    isLoading,
    error,
    lastUpdated,
    refreshOutfits,
    isRefreshing
  };
};
