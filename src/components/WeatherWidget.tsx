
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
  compact?: boolean; 
}

const WeatherWidget = ({ 
  className, 
  onWeatherChange, 
  city, 
  country, 
  savePreferences = false,
  showError = true,
  showToasts = false,
  compact = false 
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

    if (city !== locationRef.current.city || country !== locationRef.current.country) {
      saveUserPreferences();
    }
  }, [city, country, user, savePreferences]);

  useEffect(() => {
    console.log("WeatherWidget useEffect - Checking for location changes");
    console.log("Previous location:", prevLocationRef.current);
    console.log("Current location:", { city, country });
    
    const hasLocationChanged = city !== prevLocationRef.current.city || country !== prevLocationRef.current.country;
    if (city !== locationRef.current.city || country !== locationRef.current.country) {
      locationRef.current = { city, country };
      fetchedRef.current = false;
    }

    const fetchWeather = async () => {
      if (fetchedRef.current && !hasLocationChanged) {
        console.log("Weather already fetched and location hasn't changed, skipping");
        return;
      }
      
      console.log("Fetching weather data for", city, country);
      
      if (!city || !country) {
        console.log("No city/country provided, generating random weather");
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
        console.log("Calling fetchWeatherData for", city, country);
        const weatherData = await fetchWeatherData(city, country);
        console.log("Weather data received:", weatherData);
        setWeather(weatherData);
        if (onWeatherChange) {
          onWeatherChange(weatherData);
        }
        if (showToasts && hasLocationChanged) {
          toast.success(`Weather updated for ${weatherData.city}`, {
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
            toast.error("Couldn't fetch real weather data, using estimates instead", { duration: 3000 });
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    console.log("Calling fetchWeather function");
    fetchWeather();
    prevLocationRef.current = { city, country };
  }, [city, country, onWeatherChange, showToasts, weather]);

  return (
    <div className={cn(
      "overflow-hidden rounded-lg shadow-sm backdrop-blur-sm transition-all duration-300 border border-white/10",
      isMobile ? "w-full p-2 max-w-full" : compact ? "p-3 max-w-xs" : "p-0 max-w-full h-full",
      className
    )}>
      {isLoading ? (
        <WeatherLoading />
      ) : error && showError ? (
        <WeatherError error={error} weather={weather} />
      ) : weather ? (
        <WeatherDisplay weather={weather} compact={compact} />
      ) : null}
    </div>
  );
};

export default WeatherWidget;
