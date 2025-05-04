import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { WeatherInfo } from '@/lib/types';
import WeatherDisplay from '@/components/weather/WeatherDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchWeatherData, generateRandomWeather } from '@/services/WeatherService';

type WeatherWidgetProps = {
  city?: string;
  country?: string;
  onWeatherChange: (weather: WeatherInfo) => void;
  showToasts?: boolean;
  showError?: boolean;
  autoLoad?: boolean;
  className?: string;
  savePreferences?: boolean;
};

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  city,
  country,
  onWeatherChange,
  showToasts = false,
  showError = true,
  autoLoad = false,
  className = '',
  savePreferences = false
}) => {
  const [weatherData, setWeatherData] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch weather data
  const fetchWeather = async () => {
    if (!city || !country) {
      if (showError) {
        setError('Please select a location');
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Attempt to fetch real weather data
      const data = await fetchWeatherData(city, country);
      
      setWeatherData(data);
      onWeatherChange(data);
      
      if (showToasts) {
        toast.success(`Weather updated for ${city}, ${country}`);
      }
      
      // Handle savePreferences if needed
      if (savePreferences) {
        console.log('Preferences would be saved here if implemented');
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      
      // Fallback to simulated weather data in case of API error
      const fallbackData = generateRandomWeather(city, country);
      
      setWeatherData(fallbackData);
      onWeatherChange(fallbackData);
      
      if (showToasts) {
        toast.info(`Using simulated weather data for ${city}, ${country}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto fetch weather when city, country changes or on autoLoad
  useEffect(() => {
    if ((city && country) && autoLoad) {
      fetchWeather();
    }
  }, [city, country, autoLoad]);

  if (isLoading) {
    return (
      <div className={`p-2 bg-slate-800/40 rounded-lg ${className}`}>
        <Skeleton className="h-24 bg-white/5" />
      </div>
    );
  }

  if (error && showError) {
    return (
      <div className={`p-4 text-center bg-red-900/20 border border-red-900/30 rounded-lg ${className}`}>
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    );
  }

  if (!weatherData) {
    // If we have city and country but no data yet, and we should autoload, show a loading state
    if (city && country && autoLoad) {
      return (
        <div className={`p-2 bg-slate-800/40 rounded-lg ${className}`}>
          <Skeleton className="h-24 bg-white/5" />
        </div>
      );
    }
    
    // Otherwise show the empty state / placeholder
    return (
      <div className={`text-center p-6 bg-slate-800/40 rounded-lg ${className}`}>
        <p className="text-white/60 text-sm">
          {city && country 
            ? "Click 'Save Preference' to view weather" 
            : "Select a location to view weather"}
        </p>
      </div>
    );
  }

  return <WeatherDisplay className={className} weather={weatherData} />;
};

export default WeatherWidget;
