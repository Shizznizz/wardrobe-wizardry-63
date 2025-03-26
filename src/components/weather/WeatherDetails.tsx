
import { Thermometer, Wind, Cloud, Droplets } from 'lucide-react';
import { WeatherInfo } from '@/lib/types';
import { getWeatherMood } from './WeatherUtils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface WeatherDetailsProps {
  weather: WeatherInfo;
  isMobile: boolean;
}

const WeatherDetails = ({ weather, isMobile }: WeatherDetailsProps) => {
  const weatherMood = getWeatherMood(weather);
  
  // Weather-based outfit suggestions
  const getOutfitSuggestion = () => {
    const temp = weather.temperature;
    const condition = weather.condition.toLowerCase();
    
    if (temp < 10) {
      return "It's chilly today - wear a warm coat, scarf, and boots!";
    } else if (temp < 18) {
      return "It's cool outside - try a light jacket and some comfortable jeans.";
    } else if (temp < 25) {
      return "Perfect weather for a light sweater or a long-sleeve shirt.";
    } else {
      return "It's warm today - opt for breathable fabrics and light colors!";
    }
    
    // Could add more specific suggestions based on condition (rainy, etc.)
  };
  
  return (
    <div className={`space-y-3 ${isMobile ? 'text-center w-full' : ''}`}>
      <div>
        <h3 className="text-lg font-medium text-white/90">
          Weather Mood: <span className="font-bold">{weatherMood}</span>
          {weather.condition.includes('cloud') ? ' & Cloudy' : ''}
        </h3>
        {weather.city && (
          <div className="text-base text-white/80">
            {weather.city}{weather.country ? `, ${weather.country}` : ''}
          </div>
        )}
      </div>
      
      <div className={`flex items-center ${isMobile ? 'justify-center' : ''} gap-2 mt-1`}>
        <div className="text-2xl font-medium text-white">{weather.temperature}°C</div>
        <div className="text-sm text-white/80 capitalize">({weather.condition})</div>
      </div>
      
      <div className={`flex flex-wrap ${isMobile ? 'justify-center' : ''} gap-4 pt-2`}>
        {weather.feelsLike !== undefined && (
          <div className="flex items-center gap-2 text-sm text-white/90">
            <Thermometer className="h-4 w-4" />
            <span>Feels like: {weather.feelsLike}°C</span>
          </div>
        )}
        
        {weather.windSpeed !== undefined && (
          <div className="flex items-center gap-2 text-sm text-white/90">
            <Wind className="h-4 w-4" />
            <span>Wind: {weather.windSpeed} m/s</span>
          </div>
        )}
        
        {weather.humidity !== undefined && (
          <div className="flex items-center gap-2 text-sm text-white/90">
            <Droplets className="h-4 w-4" />
            <span>Humidity: {weather.humidity}%</span>
          </div>
        )}
      </div>
      
      <motion.div 
        className="mt-2 bg-white/10 rounded-lg p-3 border border-white/10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-white/90 italic mb-2">
          "{getOutfitSuggestion()}"
        </p>
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-white/80 hover:text-white hover:bg-white/10 p-1 h-auto"
          >
            See items →
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default WeatherDetails;
