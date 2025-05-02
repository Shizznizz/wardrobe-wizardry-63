import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface LocationData {
  country: string;
  city: string;
}

export const useLocationStorage = () => {
  const [savedLocation, setSavedLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const LOCAL_STORAGE_KEY = 'olivia_location_preference';

  // Load location preference on mount
  useEffect(() => {
    const loadLocationPreference = async () => {
      try {
        setIsLoading(true);
        
        // Always try to get from localStorage first for immediate feedback
        const storedLocation = localStorage.getItem(LOCAL_STORAGE_KEY);
        
        if (storedLocation) {
          const locationData = JSON.parse(storedLocation) as LocationData;
          setSavedLocation(locationData);
          setIsLoading(false);
          return;
        }
        
        // If we have a user, we could potentially get from Supabase here
        // if (user) {
        //   // Get from Supabase profile or preferences table
        // }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading location preference:', error);
        setIsLoading(false);
      }
    };

    loadLocationPreference();
  }, [user]);

  const saveLocation = async (country: string, city: string): Promise<boolean> => {
    try {
      const locationData: LocationData = { country, city };
      
      // Always save to localStorage for immediate access
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(locationData));
      
      // If we have a user, save to Supabase as well
      if (user) {
        // Here we would save to Supabase profile or preferences table
        // This is a placeholder for future implementation
        console.log('Would save to Supabase:', { userId: user.id, location: locationData });
      }
      
      // Update local state
      setSavedLocation(locationData);
      
      return true;
    } catch (error) {
      console.error('Error saving location preference:', error);
      return false;
    }
  };

  return { savedLocation, isLoading, saveLocation };
};
