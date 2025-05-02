
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLocationStorage } from './useLocationStorage';

export const useLocation = () => {
  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSavingPreference, setIsSavingPreference] = useState(false);
  const [hasLocationPreference, setHasLocationPreference] = useState(false);
  
  const { saveLocation, getLocation } = useLocationStorage();

  // Load saved location preference on mount
  useEffect(() => {
    const loadLocation = async () => {
      try {
        const savedLocation = await getLocation();
        if (savedLocation && savedLocation.country && savedLocation.city) {
          setCountry(savedLocation.country);
          setCity(savedLocation.city);
          setHasLocationPreference(true);
        }
      } catch (error) {
        console.error('Error loading location:', error);
      }
    };

    loadLocation();
  }, []);

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setCity(''); // Reset city when country changes
  };

  const handleCityChange = (value: string) => {
    setCity(value);
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
      await saveLocation({ country, city });
      setHasLocationPreference(true);
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
    isDetecting,
    isSavingPreference,
    hasLocationPreference
  };
};
