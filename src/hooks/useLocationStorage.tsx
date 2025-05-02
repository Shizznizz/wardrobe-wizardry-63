
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LocationData {
  country: string;
  city: string;
}

export function useLocationStorage() {
  const [savedLocation, setSavedLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load location from localStorage or Supabase
  useEffect(() => {
    loadUserLocation();
  }, [user?.id]);

  // Load location from localStorage if no user is logged in
  const loadLocalLocation = () => {
    try {
      const savedData = localStorage.getItem('userLocation');
      if (savedData) {
        setSavedLocation(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Failed to load location from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load location from Supabase if user is logged in
  const loadUserLocation = async () => {
    try {
      if (!user) {
        loadLocalLocation();
        return;
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .select('preferred_country, preferred_city')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading location from Supabase:', error);
        loadLocalLocation(); // Fallback to local storage
        return;
      }

      if (data && data.preferred_country) {
        setSavedLocation({
          country: data.preferred_country,
          city: data.preferred_city || ''
        });
      } else {
        loadLocalLocation(); // No data in Supabase, try local storage
      }
    } catch (error) {
      console.error('Failed to load location from Supabase:', error);
      loadLocalLocation(); // Fallback to local storage
    } finally {
      setIsLoading(false);
    }
  };

  // Get location - added for compatibility
  const getLocation = async (): Promise<LocationData | null> => {
    return savedLocation;
  };

  // Save location to both Supabase (if logged in) and localStorage
  const saveLocation = async (country: string, city: string): Promise<boolean> => {
    try {
      // Always save to localStorage as fallback
      const locationData = { country, city };
      localStorage.setItem('userLocation', JSON.stringify(locationData));
      
      // If user is logged in, save to Supabase as well
      if (user) {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            preferred_country: country,
            preferred_city: city
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('Error saving location to Supabase:', error);
          toast.error('Failed to save location preference');
          return false;
        }
      }

      setSavedLocation(locationData);
      toast.success('Location preference saved');
      return true;
    } catch (error) {
      console.error('Failed to save location:', error);
      toast.error('Failed to save location preference');
      return false;
    }
  };

  return {
    savedLocation,
    isLoading,
    saveLocation,
    getLocation
  };
}
