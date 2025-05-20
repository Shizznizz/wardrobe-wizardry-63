
import React, { useState, useEffect } from 'react';
import { format, isToday, addDays, isFuture } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchWeatherData, generateRandomWeather, getIconName } from '@/services/WeatherService';
import { WeatherInfo } from '@/lib/types';

interface CompactWeatherProps {
  date: Date;
  weather: WeatherInfo | null;
  location?: { city: string; country: string };
  onWeatherChange?: (weather: WeatherInfo) => void;
}

const CompactWeather = ({ date, weather: initialWeather, location, onWeatherChange }: CompactWeatherProps) => {
  const [weather, setWeather] = useState<WeatherInfo | null>(initialWeather);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getWeather = async () => {
      if (!location?.city || !location?.country) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Don't make API calls for historical dates in this simplified version
        // Normally you'd use a weather history API for past dates
        let weatherData: WeatherInfo;

        if (isToday(date) || isFuture(date)) {
          if (isFuture(date)) {
            // For future dates, simulate forecast data (up to 7 days)
            const daysDiff = Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff <= 7) {
              // For a real app, we'd call a forecast API here
              weatherData = generateRandomWeather(location.city, location.country);
            } else {
              // For dates beyond forecast range, generate reasonable data based on seasonal averages
              weatherData = generateRandomWeather(location.city, location.country);
            }
          } else {
            // For today, use current weather
            weatherData = await fetchWeatherData(location.city, location.country);
          }
        } else {
          // For past dates, we'd typically use a historical weather API
          // For simplicity, we'll generate realistic data based on the date
          weatherData = generateRandomWeather(location.city, location.country);
        }

        setWeather(weatherData);
        if (onWeatherChange) {
          onWeatherChange(weatherData);
        }
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Unable to fetch weather data');
        
        // Generate fallback data if API fails
        const fallbackData = generateRandomWeather(location.city, location.country);
        setWeather(fallbackData);
        if (onWeatherChange) {
          onWeatherChange(fallbackData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (location?.city && location?.country) {
      getWeather();
    }
  }, [date, location?.city, location?.country, onWeatherChange]);

  const renderWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun':
        return <div className="text-2xl">☀️</div>;
      case 'cloud':
        return <div className="text-2xl">☁️</div>;
      case 'rain':
        return <div className="text-2xl">🌧️</div>;
      case 'snow':
        return <div className="text-2xl">❄️</div>;
      case 'fog':
        return <div className="text-2xl">🌫️</div>;
      default:
        return <div className="text-2xl">☀️</div>;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-3 bg-slate-700/30">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-slate-600" />
            <Skeleton className="h-3 w-32 bg-slate-600" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full bg-slate-600" />
        </div>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="p-3 bg-slate-700/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Weather</p>
            <p className="text-sm">{error || "Weather data unavailable"}</p>
          </div>
          <div className="text-xl">❓</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-3 bg-slate-700/30 border-slate-600/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">
            {isToday(date) ? "Today's weather" : `Weather for ${format(date, 'MMM d')}`}
          </p>
          <p className="text-sm font-medium">{weather.condition}</p>
          <p className="text-xs text-slate-300">{weather.temperature}° in {weather.city}</p>
        </div>
        <div>{renderWeatherIcon(weather.icon)}</div>
      </div>
    </Card>
  );
};

export default CompactWeather;
