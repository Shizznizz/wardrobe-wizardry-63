
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLocationStorage } from './useLocationStorage';

interface LocationData {
  country: string;
  city: string;
}

export const useLocation = () => {
  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSavingPreference, setIsSavingPreference] = useState(false);
  const [hasLocationPreference, setHasLocationPreference] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [usingSavedPreference, setUsingSavedPreference] = useState(false);
  const [locationChangedManually, setLocationChangedManually] = useState(false);
  
  const { savedLocation, isLoading, saveLocation } = useLocationStorage();

  // Load saved location preference on mount
  useEffect(() => {
    const loadLocation = async () => {
      try {
        if (savedLocation && savedLocation.country && savedLocation.city) {
          setCountry(savedLocation.country);
          setCity(savedLocation.city);
          setHasLocationPreference(true);
          setUsingSavedPreference(true);
          setHasChanges(false);
        }
      } catch (error) {
        console.error('Error loading location:', error);
      }
    };

    loadLocation();
  }, [savedLocation]);

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setCity(''); // Reset city when country changes
    setHasChanges(true);
    setLocationChangedManually(true);
    setUsingSavedPreference(false);
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    setHasChanges(true);
    setLocationChangedManually(true);
    setUsingSavedPreference(false);
  };

  const clearLocation = () => {
    setCountry('');
    setCity('');
    setHasLocationPreference(false);
    setUsingSavedPreference(false);
    setLocationChangedManually(true);
    setHasChanges(true);
  };

  const detectLocation = async () => {
    setIsDetecting(true);
    
    try {
      // Simulate geolocation API and reverse geocoding
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Use a predefined location for the demo
      const detectedCountry = 'US';
      const detectedCity = 'New York';
      
      setCountry(detectedCountry);
      setCity(detectedCity);
      setHasChanges(true);
      setLocationChangedManually(true);
      setUsingSavedPreference(false);
      
      toast.success(`Location detected: ${detectedCity}, ${detectedCountry}`);
    } catch (error) {
      toast.error('Failed to detect location');
      console.error('Location detection error:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const saveLocationPreference = async () => {
    if (!country || !city) {
      toast.error('Please select both country and city');
      return false;
    }
    
    setIsSavingPreference(true);
    
    try {
      // We need to pass both country and city here
      await saveLocation(country, city);
      setHasLocationPreference(true);
      setUsingSavedPreference(true);
      setHasChanges(false);
      toast.success('Location preference saved!');
      return true;
    } catch (error) {
      toast.error('Failed to save location preference');
      console.error('Error saving location:', error);
      return false;
    } finally {
      setIsSavingPreference(false);
    }
  };

  return {
    country,
    city,
    handleCountryChange,
    handleCityChange,
    detectLocation,
    saveLocationPreference,
    clearLocation,
    isDetecting,
    isSavingPreference,
    hasLocationPreference,
    hasChanges,
    usingSavedPreference,
    locationChangedManually
  };
};
