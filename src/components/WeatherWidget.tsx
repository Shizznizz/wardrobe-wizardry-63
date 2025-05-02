import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { WeatherInfo } from '@/lib/types';
import WeatherDisplay from '@/components/weather/WeatherDisplay';
import { Skeleton } from '@/components/ui/skeleton';

type WeatherWidgetProps = {
  city?: string;
  country?: string;
  onWeatherChange: (weather: WeatherInfo) => void;
  showToasts?: boolean;
  showError?: boolean;
  autoLoad?: boolean;
  className?: string; // Added missing prop
  savePreferences?: boolean; // Added missing prop
};

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  city,
  country,
  onWeatherChange,
  showToasts = false,
  showError = true,
  autoLoad = false,
  className = '', // Default value
  savePreferences = false // Default value
}) => {
  const [weatherData, setWeatherData] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch weather data
  const fetchWeatherData = async () => {
    if (!city || !country) {
      if (showError) {
        setError('Please select a location');
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const temperature = Math.floor(Math.random() * (30 - 10) + 10);
      const condition = ['sunny', 'cloudy', 'rainy', 'stormy', 'windy', 'snowy'][
        Math.floor(Math.random() * 6)
      ];
      
      const data: WeatherInfo = {
        city,
        country,
        temperature,
        feelsLike: temperature - Math.floor(Math.random() * 3),
        humidity: Math.floor(Math.random() * 50) + 30,
        windSpeed: Math.floor(Math.random() * 30),
        condition,
      };
      
      setWeatherData(data);
      onWeatherChange(data);
      
      if (showToasts) {
        toast.success(`Weather updated for ${city}, ${country}`);
      }
      
      // Handle savePreferences if needed (not implemented in this component)
      if (savePreferences) {
        // This is just a placeholder as the actual implementation would depend on your app
        console.log('Preferences would be saved here if implemented');
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to fetch weather data';
      setError(errorMessage);
      
      if (showToasts) {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto fetch weather when city, country changes or on autoLoad
  useEffect(() => {
    if ((city && country) && autoLoad) {
      fetchWeatherData();
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
