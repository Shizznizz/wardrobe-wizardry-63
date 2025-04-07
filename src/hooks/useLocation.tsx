
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getCurrentLocation, validateLocation, getCountryName } from '@/services/LocationService';
import { countries } from '@/data/countries';

export function useLocation() {
  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSavingPreference, setIsSavingPreference] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [usingSavedPreference, setUsingSavedPreference] = useState(false);
  const { user } = useAuth();

  // Load saved location preference when component mounts
  useEffect(() => {
    loadSavedLocation();
  }, [user]);

  // Load location from Supabase or localStorage
  const loadSavedLocation = async () => {
    try {
      // Try to load from localStorage first as fallback
      const savedLocationData = localStorage.getItem('userLocation');
      let savedLocation = savedLocationData ? JSON.parse(savedLocationData) : null;
      
      // If user is logged in, try to get their preference from Supabase
      if (user) {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('preferred_country, preferred_city')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (!error && data && data.preferred_country) {
          savedLocation = {
            country: data.preferred_country,
            city: data.preferred_city || ''
          };
        }
      }
      
      // If we found a saved location, use it
      if (savedLocation && savedLocation.country) {
        setCountry(savedLocation.country);
        setCity(savedLocation.city || '');
        setUsingSavedPreference(true);
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Failed to load saved location:', error);
    }
  };

  // Detect user's location using browser geolocation API
  const detectLocation = async () => {
    setIsDetecting(true);
    
    try {
      const location = await getCurrentLocation();
      
      if (location && location.country) {
        setCountry(location.country);
        setCity(location.city || '');
        setHasChanges(true);
        setUsingSavedPreference(false);
        
        toast.success(`Location detected: ${location.city ? location.city + ', ' : ''}${getCountryName(location.country)}`);
      } else {
        toast.error("Couldn't detect your location. Please select manually.");
      }
    } catch (error) {
      console.error('Location detection error:', error);
      toast.error("Couldn't access your location. Please check your browser permissions.");
    } finally {
      setIsDetecting(false);
    }
  };

  // Save location preference to Supabase and localStorage
  const saveLocationPreference = async () => {
    // Validate the location first
    const validation = validateLocation(country, city);
    if (!validation.isValid) {
      toast.error(validation.message || 'Please select a valid location');
      return false;
    }
    
    setIsSavingPreference(true);
    
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
          setIsSavingPreference(false);
          return false;
        }
      }

      setUsingSavedPreference(true);
      setHasChanges(false);
      toast.success('Location preference saved');
      return true;
    } catch (error) {
      console.error('Failed to save location:', error);
      toast.error('Failed to save location preference');
      return false;
    } finally {
      setIsSavingPreference(false);
    }
  };

  // Clear current location selection
  const clearLocation = () => {
    setCountry('');
    setCity('');
    setUsingSavedPreference(false);
    setHasChanges(true);
  };

  // Update country selection
  const handleCountryChange = (newCountry: string) => {
    if (newCountry !== country) {
      setCountry(newCountry);
      setCity(''); // Reset city when country changes
      setHasChanges(true);
      setUsingSavedPreference(false);
    }
  };

  // Update city selection
  const handleCityChange = (newCity: string) => {
    if (newCity !== city) {
      setCity(newCity);
      setHasChanges(true);
      setUsingSavedPreference(false);
    }
  };

  return {
    country,
    city,
    isDetecting,
    isSavingPreference,
    hasChanges,
    usingSavedPreference,
    detectLocation,
    saveLocationPreference,
    clearLocation,
    handleCountryChange,
    handleCityChange
  };
}
