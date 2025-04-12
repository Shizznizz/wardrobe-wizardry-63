
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sun, Cloud, CloudRain, CloudSnow, Wind } from 'lucide-react';
import { WeatherIcon } from '@/components/ui/weather-icon';
import { useLocationStorage } from '@/hooks/useLocationStorage';
import { toast } from 'sonner';

interface WeatherSummaryProps {
  onWeatherUpdate?: (weather: { temperature: number; condition: string }) => void;
}

const WeatherSummary = ({ onWeatherUpdate }: WeatherSummaryProps) => {
  const { savedLocation } = useLocationStorage();
  const [weather, setWeather] = useState<{ temperature: number; condition: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate weather fetch - in a real app, you'd call a weather API
    const fetchWeather = async () => {
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
    };

    if (savedLocation) {
      fetchWeather();
    } else {
      setIsLoading(false);
    }
  }, [savedLocation, onWeatherUpdate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-3 bg-slate-900/60 rounded-lg border border-white/10 backdrop-blur-sm">
        <div className="animate-pulse h-6 w-32 bg-slate-700/50 rounded"></div>
      </div>
    );
  }

  if (!weather || !savedLocation) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-3 bg-slate-900/60 rounded-lg border border-white/10 backdrop-blur-sm text-center"
      >
        <p className="text-sm text-white/70">Set your location to see weather</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-3 bg-slate-900/60 rounded-lg border border-white/10 backdrop-blur-sm"
    >
      <div className="flex items-center">
        <div className="mr-3">
          <WeatherIcon 
            condition={weather.condition.toLowerCase().includes('cloud') ? 'partly-cloudy' : 
                      weather.condition.toLowerCase().includes('rain') ? 'rainy' :
                      weather.condition.toLowerCase().includes('snow') ? 'snowy' :
                      weather.condition.toLowerCase().includes('fog') ? 'foggy' : 'clear'}
            className="h-8 w-8 text-blue-300"
          />
        </div>
        <div>
          <div className="flex items-center">
            <span className="text-xl font-medium text-white">{weather.temperature}°</span>
            <span className="ml-2 text-sm text-white/80">{weather.condition}</span>
          </div>
          <div className="flex items-center text-xs text-white/60">
            <MapPin className="h-3 w-3 mr-1" />
            {savedLocation.city}, {savedLocation.country}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherSummary;
