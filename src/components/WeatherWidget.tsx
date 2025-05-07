
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
      console.log(`Fetching weather for ${city}, ${country}...`);
      
      // We're simulating data for now, but in a production app, you'd call a real weather API
      // This uses our improved weather generation for more realistic data based on location and date
      const data = generateRealisticWeather(city, country);
      
      console.log("Generated weather data:", data);
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
      console.error("Error fetching weather:", errorMessage);
      setError(errorMessage);
      
      if (showToasts) {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Generate realistic weather data based on location and current month
  const generateRealisticWeather = (city: string, country: string): WeatherInfo => {
    const today = new Date();
    const month = today.getMonth();
    const isNorthernHemisphere = country !== 'AU' && country !== 'NZ' && country !== 'AR' && country !== 'CL' && country !== 'ZA';
    
    // Seasonal temperature ranges (approximate for temperate climates)
    let tempMin = 15;
    let tempMax = 25;
    let conditions = ['sunny', 'partly cloudy', 'cloudy'];
    
    if (isNorthernHemisphere) {
      // Northern hemisphere seasons
      if (month >= 2 && month <= 4) { // Spring
        tempMin = 10;
        tempMax = 20;
        conditions = ['sunny', 'partly cloudy', 'rainy', 'cloudy'];
      } else if (month >= 5 && month <= 7) { // Summer
        tempMin = 20;
        tempMax = 30;
        conditions = ['sunny', 'hot', 'partly cloudy'];
      } else if (month >= 8 && month <= 10) { // Fall/Autumn
        tempMin = 10;
        tempMax = 20;
        conditions = ['cloudy', 'rainy', 'partly cloudy', 'windy'];
      } else { // Winter
        tempMin = 0;
        tempMax = 10;
        conditions = ['cloudy', 'rainy', 'snowy', 'windy'];
      }
    } else {
      // Southern hemisphere (opposite seasons)
      if (month >= 2 && month <= 4) { // Fall/Autumn
        tempMin = 10;
        tempMax = 20;
        conditions = ['cloudy', 'rainy', 'partly cloudy'];
      } else if (month >= 5 && month <= 7) { // Winter
        tempMin = 5;
        tempMax = 15;
        conditions = ['cloudy', 'rainy', 'partly cloudy'];
      } else if (month >= 8 && month <= 10) { // Spring
        tempMin = 15;
        tempMax = 25;
        conditions = ['sunny', 'partly cloudy', 'rainy'];
      } else { // Summer
        tempMin = 25;
        tempMax = 35;
        conditions = ['sunny', 'hot', 'partly cloudy'];
      }
    }
    
    // Adjust for specific regions
    if (country === 'NL') { // Netherlands
      // Netherlands rarely gets above 30°C and below -5°C
      if (month >= 5 && month <= 7) { // Summer
        tempMin = 15;
        tempMax = 25; // Realistic summer temps for Netherlands
        conditions = ['partly cloudy', 'sunny', 'rainy'];
      } else if (month >= 11 || month <= 1) { // Winter
        tempMin = 0;
        tempMax = 8; // Realistic winter temps for Netherlands
        conditions = ['rainy', 'cloudy', 'partly cloudy'];
      }
    }
    
    // Get random temperature within the range
    const temperature = Math.floor(Math.random() * (tempMax - tempMin + 1) + tempMin);
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      city,
      country,
      temperature,
      feelsLike: temperature - Math.floor(Math.random() * 3),
      humidity: Math.floor(Math.random() * 50) + 30,
      windSpeed: Math.floor(Math.random() * 30),
      condition,
    };
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
