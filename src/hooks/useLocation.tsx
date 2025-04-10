
import { useState, useEffect, useRef } from 'react';
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
  const [locationChangedManually, setLocationChangedManually] = useState(false);
  const initialLoadRef = useRef(true);
  const prevLocationRef = useRef({ country: '', city: '' });
  const loadedRef = useRef(false);
  const { user } = useAuth();

  // Load saved location preference when component mounts - only once
  useEffect(() => {
    if (!loadedRef.current) {
      loadSavedLocation();
      loadedRef.current = true;
    }
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
        
        // Store initial values for comparison
        prevLocationRef.current = {
          country: savedLocation.country,
          city: savedLocation.city || ''
        };
      }
      
      // Mark that initial load is complete
      initialLoadRef.current = false;
    } catch (error) {
      console.error('Failed to load saved location:', error);
      initialLoadRef.current = false;
    }
  };

  // Detect user's location using browser geolocation API
  const detectLocation = async () => {
    setIsDetecting(true);
    setLocationChangedManually(true);
    
    try {
      const location = await getCurrentLocation();
      
      if (location && location.country) {
        // Only show toast if location actually changed
        const isNewLocation = location.country !== country || location.city !== city;
        
        setCountry(location.country);
        setCity(location.city || '');
        setHasChanges(true);
        setUsingSavedPreference(false);
        
        if (isNewLocation) {
          toast.success(`Location detected: ${location.city ? location.city + ', ' : ''}${getCountryName(location.country)}`, {
            duration: 3000, // Shorter toast duration
          });
        }
      } else {
        toast.error("Couldn't detect your location. Please select manually.", {
          duration: 3000, // Shorter toast duration
        });
      }
    } catch (error) {
      console.error('Location detection error:', error);
      toast.error("Couldn't access your location. Please check your browser permissions.", {
        duration: 3000, // Shorter toast duration
      });
    } finally {
      setIsDetecting(false);
    }
  };

  // Save location preference to Supabase and localStorage
  const saveLocationPreference = async () => {
    // Validate the location first
    const validation = validateLocation(country, city);
    if (!validation.isValid) {
      toast.error(validation.message || 'Please select a valid location', {
        duration: 3000, // Shorter toast duration
      });
      return false;
    }
    
    setIsSavingPreference(true);
    setLocationChangedManually(true);
    
    try {
      // Always save to localStorage as fallback
      const locationData = { country, city };
      localStorage.setItem('userLocation', JSON.stringify(locationData));
      
      // Check if the location has actually changed
      const isLocationChanged = country !== prevLocationRef.current.country || city !== prevLocationRef.current.city;
      
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
          toast.error('Failed to save location preference', {
            duration: 3000, // Shorter toast duration
          });
          setIsSavingPreference(false);
          return false;
        }
      }

      setUsingSavedPreference(true);
      setHasChanges(false);
      
      // Update reference for comparison
      prevLocationRef.current = { country, city };
      
      // Only show toast if actually changed
      if (isLocationChanged) {
        toast.success('Location preference saved', {
          duration: 3000, // Shorter toast duration
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save location:', error);
      toast.error('Failed to save location preference', {
        duration: 3000, // Shorter toast duration
      });
      return false;
    } finally {
      setIsSavingPreference(false);
    }
  };

  // Clear current location selection
  const clearLocation = () => {
    setLocationChangedManually(true);
    
    // Only show toast if values are actually cleared (not already empty)
    const wasPopulated = country !== '' || city !== '';
    
    setCountry('');
    setCity('');
    setUsingSavedPreference(false);
    setHasChanges(true);
    
    if (wasPopulated) {
      toast.success('Location cleared', {
        duration: 3000, // Shorter toast duration
      });
    }
  };

  // Update country selection
  const handleCountryChange = (newCountry: string) => {
    if (newCountry !== country) {
      setCountry(newCountry);
      setCity(''); // Reset city when country changes
      setHasChanges(true);
      setUsingSavedPreference(false);
      setLocationChangedManually(true);
    }
  };

  // Update city selection
  const handleCityChange = (newCity: string) => {
    if (newCity !== city) {
      setCity(newCity);
      setHasChanges(true);
      setUsingSavedPreference(false);
      setLocationChangedManually(true);
    }
  };

  return {
    country,
    city,
    isDetecting,
    isSavingPreference,
    hasChanges,
    usingSavedPreference,
    locationChangedManually,
    detectLocation,
    saveLocationPreference,
    clearLocation,
    handleCountryChange,
    handleCityChange
  };
}
