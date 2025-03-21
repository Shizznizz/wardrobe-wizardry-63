
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { WeatherInfo } from '@/lib/types';
import { toast } from 'sonner';
import { fetchWeatherData, generateRandomWeather } from '@/services/WeatherService';
import WeatherDisplay from './weather/WeatherDisplay';
import WeatherLoading from './weather/WeatherLoading';
import WeatherError from './weather/WeatherError';

interface WeatherWidgetProps {
  className?: string;
  onWeatherChange?: (weather: WeatherInfo) => void;
  city?: string;
  country?: string;
}

const WeatherWidget = ({ className, onWeatherChange, city, country }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      // Only fetch if both city and country are provided
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

      setIsLoading(true);
      setError(null);
      
      try {
        const weatherData = await fetchWeatherData(city, country);
        
        setWeather(weatherData);
        
        if (onWeatherChange) {
          onWeatherChange(weatherData);
        }

        toast.success(`Weather updated for ${weatherData.city}`);
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
    // Remove 'weather' from the dependency array to prevent continuous updates
  }, [city, country, onWeatherChange]);

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
