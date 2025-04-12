
import { memo, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { WeatherIcon } from '@/components/ui/weather-icon';
import { useLocationStorage } from '@/hooks/useLocationStorage';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherInfo } from '@/lib/types';

interface OptimizedWeatherSummaryProps {
  onWeatherUpdate?: (weather: { temperature: number; condition: string }) => void;
  className?: string;
  compact?: boolean;
}

const OptimizedWeatherSummary = memo(({ 
  onWeatherUpdate, 
  className = "", 
  compact = false 
}: OptimizedWeatherSummaryProps) => {
  const { savedLocation } = useLocationStorage();
  const [weather, setWeather] = useState<{ temperature: number; condition: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the fetchWeather function to prevent unnecessary re-renders
  const fetchWeather = useCallback(async () => {
    if (!savedLocation) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sample weather data - replace with actual API call
      const weatherData = {
        temperature: 18,
        condition: 'Partly Cloudy'
      };
      
      setWeather(weatherData);
      if (onWeatherUpdate) onWeatherUpdate(weatherData);
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast.error('Could not load weather data');
    } finally {
      setIsLoading(false);
    }
  }, [savedLocation, onWeatherUpdate]);

  useEffect(() => {
    if (savedLocation) {
      fetchWeather();
    } else {
      setIsLoading(false);
    }
  }, [savedLocation, fetchWeather]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-2 bg-slate-900/60 rounded-lg border border-white/10 backdrop-blur-sm ${className} ${compact ? 'h-10' : 'h-14'}`}>
        <Skeleton className="h-6 w-32 bg-slate-700/50 rounded" />
      </div>
    );
  }

  if (!weather || !savedLocation) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-2 bg-slate-900/60 rounded-lg border border-white/10 backdrop-blur-sm text-center ${className} ${compact ? 'h-10' : ''}`}
      >
        <p className="text-sm text-white/70">Set your location to see weather</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-between p-2 bg-slate-900/60 rounded-lg border border-white/10 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center">
        <div className={`mr-2 ${compact ? 'scale-75' : ''}`}>
          <WeatherIcon 
            condition={weather.condition.toLowerCase().includes('cloud') ? 'partly-cloudy' : 
                      weather.condition.toLowerCase().includes('rain') ? 'rainy' :
                      weather.condition.toLowerCase().includes('snow') ? 'snowy' :
                      weather.condition.toLowerCase().includes('fog') ? 'foggy' : 'clear'}
            className={`${compact ? 'h-6 w-6' : 'h-8 w-8'} text-blue-300`}
          />
        </div>
        <div>
          <div className="flex items-center">
            <span className={`${compact ? 'text-lg' : 'text-xl'} font-medium text-white`}>
              {weather.temperature}°
            </span>
            {!compact && (
              <span className="ml-2 text-sm text-white/80">{weather.condition}</span>
            )}
          </div>
          <div className="flex items-center text-xs text-white/60">
            <MapPin className="h-3 w-3 mr-1" />
            {compact ? savedLocation.city : `${savedLocation.city}, ${savedLocation.country}`}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

OptimizedWeatherSummary.displayName = 'OptimizedWeatherSummary';

export default OptimizedWeatherSummary;
