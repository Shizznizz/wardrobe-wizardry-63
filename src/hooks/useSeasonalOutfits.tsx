
import { useState, useEffect } from 'react';
import { Outfit } from '@/lib/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define type for the response from our edge function
interface SeasonalOutfitsResponse {
  outfits: Outfit[];
  season: string;
  generatedAt: string;
  refreshAfter: string;
}

export function useSeasonalOutfits() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [season, setSeason] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Function to fetch outfits from our edge function
  const fetchOutfits = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to get from local storage first (refresh monthly)
      const cachedData = localStorage.getItem('olivia_seasonal_outfits');
      
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const refreshAfter = new Date(parsedData.refreshAfter);
        
        // If cache is still valid, use it
        if (refreshAfter > new Date()) {
          console.log('Using cached seasonal outfits', parsedData);
          setOutfits(parsedData.outfits);
          setSeason(parsedData.season);
          setLastUpdated(new Date(parsedData.generatedAt));
          setIsLoading(false);
          return;
        }
      }
      
      // Cache expired or doesn't exist, call the edge function
      const { data, error } = await supabase.functions.invoke('generate-seasonal-outfits');
      
      if (error) {
        throw new Error(`Error fetching seasonal outfits: ${error.message}`);
      }
      
      // Process and store the result
      const result = data;
      
      setOutfits(result.outfits);
      setSeason(result.season);
      setLastUpdated(new Date(result.lastUpdated));
      
      // Cache the result in local storage
      localStorage.setItem('olivia_seasonal_outfits', JSON.stringify({
        outfits: result.outfits,
        season: result.season,
        generatedAt: result.generatedAt || result.lastUpdated,
        refreshAfter: result.refreshAfter || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }));
      
    } catch (err) {
      console.error('Failed to fetch seasonal outfits:', err);
      setError(err.message || 'Failed to fetch Olivia\'s seasonal outfits');
      toast.error('Could not load Olivia\'s style recommendations');
      
      // Try to load fallback outfits
      loadFallbackOutfits();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refreshing function that shows a loading state
  const refreshOutfits = async () => {
    setIsRefreshing(true);
    try {
      // Remove from local storage to force refresh
      localStorage.removeItem('olivia_seasonal_outfits');
      await fetchOutfits();
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Function to load fallback outfits if the API fails
  const loadFallbackOutfits = () => {
    // Determine current season for fallback
    const now = new Date();
    const month = now.getMonth(); // 0-11
    
    let currentSeason = 'autumn';
    if ([11, 0, 1].includes(month)) currentSeason = 'winter';
    else if ([2, 3, 4].includes(month)) currentSeason = 'spring';
    else if ([5, 6, 7].includes(month)) currentSeason = 'summer';
    
    // Set minimal fallback outfits
    const fallbackOutfits: Outfit[] = [
      {
        id: 'spring-elegance',
        name: 'Spring Elegance',
        items: ['/lovable-uploads/c937b60e-901e-48ae-b01d-28d901a11503.png', '/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png', '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png', '/lovable-uploads/db51966b-4679-4d51-81f2-8844a7a57817.png'],
        seasons: ['spring'],
        occasions: ['dressy', 'outdoor'],
        favorite: false,
        dateAdded: new Date().toISOString()
      },
      {
        id: 'summer-vibes',
        name: 'Summer Vibes',
        items: ['/lovable-uploads/e8fc1e11-c29c-400b-8e33-2577a311b453.png', '/lovable-uploads/5c9492c5-2df1-4f02-8d61-70fd1e57a6af.png', '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png', '/lovable-uploads/075a98ab-d879-4919-8898-87590f8f919a.png'],
        seasons: ['summer'],
        occasions: ['beach', 'casual'],
        favorite: false,
        dateAdded: new Date().toISOString()
      },
      {
        id: 'fall-classic',
        name: 'Fall Classic',
        items: ['/lovable-uploads/f0afcad3-9696-4e23-a118-04525585d72a.png', '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png', '/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png', '/lovable-uploads/f29b0fb8-330c-409a-8488-2e7ae2b351ed.png'],
        seasons: ['autumn'],
        occasions: ['casual', 'everyday'],
        favorite: false,
        dateAdded: new Date().toISOString()
      },
      {
        id: 'winter-chic',
        name: 'Winter Chic',
        items: ['/lovable-uploads/c26c0c8c-7ff3-432a-b79b-1d22494daba6.png', '/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png', '/lovable-uploads/e41d700a-84eb-4544-9ffc-b68b82f30f7e.png', '/lovable-uploads/6d16aa51-bd78-4fb4-a783-8d27a089e19f.png'],
        seasons: ['winter'],
        occasions: ['formal', 'evening'],
        favorite: false,
        dateAdded: new Date().toISOString()
      }
    ];
    
    setOutfits(fallbackOutfits);
    setSeason(currentSeason);
    setLastUpdated(new Date());
  };

  // Fetch outfits on component mount
  useEffect(() => {
    fetchOutfits();
    
    // Set up refresh interval - check once per day if refresh needed
    const dailyCheck = setInterval(() => {
      const cachedData = localStorage.getItem('olivia_seasonal_outfits');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const refreshAfter = new Date(parsedData.refreshAfter);
        
        // If cache expired, refresh
        if (refreshAfter <= new Date()) {
          console.log('Cache expired, refreshing seasonal outfits');
          fetchOutfits();
        }
      }
    }, 24 * 60 * 60 * 1000); // Check once per day
    
    return () => clearInterval(dailyCheck);
  }, []);

  return {
    outfits,
    season,
    isLoading,
    error,
    lastUpdated,
    refreshOutfits,
    isRefreshing
  };
}
