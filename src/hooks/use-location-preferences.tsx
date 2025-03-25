
import { useState, useEffect } from 'react';

type LocationPreference = {
  country: string;
  city: string;
};

export function useLocationPreferences() {
  const [preferences, setPreferences] = useState<LocationPreference>({
    country: '',
    city: ''
  });

  useEffect(() => {
    // Load preferences from localStorage on mount
    const storedPreferences = localStorage.getItem('locationPreferences');
    if (storedPreferences) {
      try {
        const parsed = JSON.parse(storedPreferences);
        setPreferences(parsed);
      } catch (e) {
        console.error('Failed to parse stored location preferences', e);
      }
    }
  }, []);

  const savePreferences = (country: string, city: string) => {
    const newPreferences = { country, city };
    localStorage.setItem('locationPreferences', JSON.stringify(newPreferences));
    setPreferences(newPreferences);
  };

  return {
    locationPreferences: preferences,
    saveLocationPreferences: savePreferences
  };
}
