
import { useState, useEffect } from 'react';
import { Outfit } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SeasonalOutfitsResult {
  outfits: Outfit[];
  season: string;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshOutfits: () => Promise<void>;
  isRefreshing: boolean; // Added the missing property
}

export const useSeasonalOutfits = (): SeasonalOutfitsResult => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [season, setSeason] = useState<string>('autumn');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false); // Added missing state

  // Determine current season based on hemisphere and month
  const determineCurrentSeason = () => {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const northernHemisphere = true; // Default to northern hemisphere
    
    if (northernHemisphere) {
      if (month >= 3 && month <= 5) return 'spring';
      if (month >= 6 && month <= 8) return 'summer';
      if (month >= 9 && month <= 11) return 'autumn';
      return 'winter';
    } else {
      if (month >= 3 && month <= 5) return 'autumn';
      if (month >= 6 && month <= 8) return 'winter';
      if (month >= 9 && month <= 11) return 'spring';
      return 'summer';
    }
  };

  const fetchSeasonalOutfits = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentSeason = determineCurrentSeason();
      setSeason(currentSeason);
      
      // Call our edge function to get seasonal outfits
      const { data, error } = await supabase.functions.invoke('generate-seasonal-outfits', {
        body: { season: currentSeason }
      });
      
      if (error) {
        console.error('Error fetching seasonal outfits:', error);
        setError('Failed to fetch seasonal outfits. Please try again later.');
        return;
      }
      
      if (data && data.outfits) {
        setOutfits(data.outfits);
        setLastUpdated(new Date());
      } else {
        // If no seasonal outfits available, fetch some random outfits as fallback
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
      console.error('Exception fetching seasonal outfits:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Make sure to reset refresh state
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSeasonalOutfits();
  }, []);

  const refreshOutfits = async () => {
    setIsRefreshing(true);
    await fetchSeasonalOutfits();
  };

  return {
    outfits,
    season,
    isLoading,
    error,
    lastUpdated,
    refreshOutfits,
    isRefreshing // Return the missing property
  };
};
