
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { WeatherInfo } from '@/lib/types';
import { toast } from 'sonner';
import { fetchWeatherData, generateRandomWeather } from '@/services/WeatherService';
import WeatherDisplay from './weather/WeatherDisplay';
import WeatherLoading from './weather/WeatherLoading';
import WeatherError from './weather/WeatherError';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface WeatherWidgetProps {
  className?: string;
  onWeatherChange?: (weather: WeatherInfo) => void;
  city?: string;
  country?: string;
  savePreferences?: boolean;
}

const WeatherWidget = ({ 
  className, 
  onWeatherChange, 
  city, 
  country, 
  savePreferences = false 
}: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locationRef = useRef<{ city?: string; country?: string }>({ city, country });
  const fetchedRef = useRef<boolean>(false);
  const { user } = useAuth();

  // Save user preferences when location changes and user is logged in
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
    // Reset the fetched flag when location changes
    if (city !== locationRef.current.city || country !== locationRef.current.country) {
      locationRef.current = { city, country };
      fetchedRef.current = false;
    }

    const fetchWeather = async () => {
      // Only fetch if both city and country are provided and not fetched already
      if (!city || !country) {
        if (!weather) {
          // If no weather data and no location, use random data for initial state
          const randomWeather = generateRandomWeather();
          setWeather(randomWeather);
          
          if (onWeatherChange) {
            onWeatherChange(randomWeather);
          }
        }
        setIsLoading(false);
        return;
      }

      // If already fetched for this location, don't fetch again
      if (fetchedRef.current) {
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

        toast.success(`Weather updated for ${weatherData.city}`);
        
        // Mark as fetched for this location
        fetchedRef.current = true;
      } catch (err) {
        console.error('Error fetching weather:', err);
        
        // Check if the error is due to API key
        const errorMsg = err instanceof Error ? err.message : 'Unable to fetch weather data. Please try again.';
        setError(errorMsg);
        
        if (!weather) {
          // Generate random weather if there's no existing data
          const randomWeather = generateRandomWeather(city, country);
          setWeather(randomWeather);
          
          if (onWeatherChange) {
            onWeatherChange(randomWeather);
          }
          
          toast.error("Couldn't fetch real weather data, using estimates instead");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeather();
  }, [city, country, onWeatherChange]); // Remove 'weather' from dependencies

  return (
    <Card className={cn("overflow-hidden bg-white shadow-soft backdrop-blur-sm", className)}>
      <CardContent className="p-4">
        {isLoading ? (
          <WeatherLoading />
        ) : error ? (
          <WeatherError error={error} weather={weather} />
        ) : weather ? (
          <WeatherDisplay weather={weather} />
        ) : null}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
