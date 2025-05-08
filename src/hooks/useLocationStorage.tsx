
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LocationData {
  country: string;
  city: string;
}

interface LocationContextType {
  savedLocation: LocationData | null;
  isLoading: boolean;
  saveLocation: (country: string, city: string) => Promise<boolean>;
}

// Create a context for location data
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Provider component
export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [savedLocation, setSavedLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  
  const LOCAL_STORAGE_KEY = 'olivia_location_preference';

  // Load location preference on mount or when auth state changes
  useEffect(() => {
    const loadLocationPreference = async () => {
      try {
        setIsLoading(true);
        
        // Always try to get from localStorage first for immediate feedback
        const storedLocation = localStorage.getItem(LOCAL_STORAGE_KEY);
        let locationData: LocationData | null = null;
        
        // If authenticated, try to get from Supabase first
        if (isAuthenticated && user) {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('preferred_city, preferred_country')
            .eq('user_id', user.id)
            .single();
          
          // Only use Supabase data if valid
          if (!error && data?.preferred_city && data?.preferred_country) {
            locationData = {
              city: data.preferred_city,
              country: data.preferred_country
            };
            
            // Update localStorage for next time
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(locationData));
          }
        }
        
        // Fall back to localStorage if no Supabase data available
        if (!locationData && storedLocation) {
          locationData = JSON.parse(storedLocation) as LocationData;
        }
        
        setSavedLocation(locationData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading location preference:', error);
        setIsLoading(false);
      }
    };

    loadLocationPreference();
  }, [user, isAuthenticated]);

  const saveLocation = async (country: string, city: string): Promise<boolean> => {
    try {
      const locationData: LocationData = { country, city };
      
      // Always save to localStorage for immediate access
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(locationData));
      
      // If we have a user, save to Supabase as well
      if (isAuthenticated && user) {
        // Check if user has preferences record
        const { data: existingPrefs, error: checkError } = await supabase
          .from('user_preferences')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (checkError && checkError.code !== 'PGRST116') {
          // An error other than "not found"
          console.error('Error checking user preferences:', checkError);
        }
        
        let saveError;
        if (existingPrefs) {
          // Update existing preferences
          const { error } = await supabase
            .from('user_preferences')
            .update({
              preferred_city: city,
              preferred_country: country,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
          
          saveError = error;
        } else {
          // Create new preferences
          const { error } = await supabase
            .from('user_preferences')
            .insert({
              user_id: user.id,
              preferred_city: city,
              preferred_country: country
            });
          
          saveError = error;
        }
        
        if (saveError) {
          console.error('Error saving location to Supabase:', saveError);
          toast.error('Could not save location to server');
        }
      }
      
      // Update local state
      setSavedLocation(locationData);
      
      return true;
    } catch (error) {
      console.error('Error saving location preference:', error);
      return false;
    }
  };

  // Create value object to be provided by context
  const contextValue: LocationContextType = {
    savedLocation,
    isLoading,
    saveLocation,
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use the location context
export const useLocationStorage = () => {
  const context = useContext(LocationContext);
  
  if (context === undefined) {
    throw new Error('useLocationStorage must be used within a LocationProvider');
  }
  
  return context;
};
