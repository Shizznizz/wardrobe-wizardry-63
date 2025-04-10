
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { WeatherInfo } from '@/lib/types';
import { toast } from 'sonner';
import { fetchWeatherData, generateRandomWeather } from '@/services/WeatherService';
import WeatherDisplay from './weather/WeatherDisplay';
import WeatherLoading from './weather/WeatherLoading';
import WeatherError from './weather/WeatherError';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface WeatherWidgetProps {
  className?: string;
  onWeatherChange?: (weather: WeatherInfo) => void;
  city?: string;
  country?: string;
  savePreferences?: boolean;
  showError?: boolean;
  showToasts?: boolean;
}

const WeatherWidget = ({ 
  className, 
  onWeatherChange, 
  city, 
  country, 
  savePreferences = false,
  showError = true,
  showToasts = false
}: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locationRef = useRef<{ city?: string; country?: string }>({ city, country });
  const fetchedRef = useRef<boolean>(false);
  const prevLocationRef = useRef<{ city?: string; country?: string }>({ city: undefined, country: undefined });
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    const saveUserPreferences = async () => {
      if (savePreferences && user && city && country) {
        try {
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
            console.error('Error saving preferences:', error);
          } else {
            console.log('User preferences saved successfully');
          }
        } catch (err) {
          console.error('Failed to save user preferences:', err);
        }
      }
    };

    // Only save preferences if city or country actually changed
    if (city !== locationRef.current.city || country !== locationRef.current.country) {
      saveUserPreferences();
    }
  }, [city, country, user, savePreferences]);

  useEffect(() => {
    // Check if location has actually changed
    const hasLocationChanged = city !== prevLocationRef.current.city || country !== prevLocationRef.current.country;
    
    if (city !== locationRef.current.city || country !== locationRef.current.country) {
      locationRef.current = { city, country };
      fetchedRef.current = false;
    }

    const fetchWeather = async () => {
      // Avoid fetching weather if we've already fetched it for this location
      if (fetchedRef.current && !hasLocationChanged) {
        return;
      }
      
      if (!city || !country) {
        if (!weather) {
          const randomWeather = generateRandomWeather();
          setWeather(randomWeather);
          
          if (onWeatherChange) {
            onWeatherChange(randomWeather);
          }
        }
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const weatherData = await fetchWeatherData(city, country);
        
        setWeather(weatherData);
        
        if (onWeatherChange) {
          onWeatherChange(weatherData);
        }

        // Only show toast if explicitly enabled AND location has changed
        if (showToasts && hasLocationChanged) {
          toast.success(`Weather updated for ${weatherData.city}`, {
            // Add shorter duration to avoid toast staying too long
            duration: 3000
          });
        }
        
        fetchedRef.current = true;
      } catch (err) {
        console.error('Error fetching weather:', err);
        
        const errorMsg = err instanceof Error ? err.message : 'Unable to fetch weather data. Please try again.';
        setError(errorMsg);
        
        if (!weather) {
          const randomWeather = generateRandomWeather(city, country);
          setWeather(randomWeather);
          
          if (onWeatherChange) {
            onWeatherChange(randomWeather);
          }
          
          if (showToasts) {
            toast.error("Couldn't fetch real weather data, using estimates instead", {
              duration: 3000
            });
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeather();
    
    // Update previous location after fetch is completed
    prevLocationRef.current = { city, country };
    
    // No interval-based updates or polling - only fetch when props change
  }, [city, country, onWeatherChange, showToasts]);

  return (
    <div className={cn(`overflow-hidden rounded-lg shadow-sm backdrop-blur-sm transition-all duration-300 bg-white/5 dark:bg-gray-900/20 border border-white/10 ${isMobile ? 'p-2' : 'p-4'}`, className)}>
      {isLoading ? (
        <WeatherLoading />
      ) : error ? (
        <WeatherError error={error} weather={weather} />
      ) : weather ? (
        <WeatherDisplay weather={weather} />
      ) : null}
    </div>
  );
};

export default WeatherWidget;
