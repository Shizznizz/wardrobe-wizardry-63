
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, Umbrella, Wind, CloudRain, ThermometerSnowflake, MapPin, CircleHelp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WeatherBasedTipsProps {
  userPhoto: string | null;
  isUsingOliviaImage: boolean;
  customLocation?: { city: string; country: string } | null;
  onShowStyleOptions: () => void;
}

const WeatherBasedTips = ({ 
  userPhoto, 
  isUsingOliviaImage,
  customLocation,
  onShowStyleOptions
}: WeatherBasedTipsProps) => {
  const [weather, setWeather] = useState<{
    temperature: number;
    condition: string;
    location: string;
  } | null>(null);

  const { isAuthenticated } = useAuth();
  
  // Demo weather data - in a real app this would come from an API
  useEffect(() => {
    if (userPhoto) {
      const randomTemp = Math.floor(Math.random() * 30) - 5; // -5 to 25°C
      const conditions = ['sunny', 'cloudy', 'rainy', 'windy', 'snowy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      let location = 'Your location';
      if (customLocation) {
        location = `${customLocation.city}, ${customLocation.country}`;
      } else if (isUsingOliviaImage) {
        location = 'New York, USA';
      } else {
        // Default locations
        const cities = ['Amsterdam', 'London', 'Paris', 'Berlin', 'Madrid'];
        location = `${cities[Math.floor(Math.random() * cities.length)]}`;
      }
      
      setWeather({
        temperature: randomTemp,
        condition: randomCondition,
        location: location
      });
    } else {
      setWeather(null);
    }
  }, [userPhoto, isUsingOliviaImage, customLocation]);
  
  if (!userPhoto || !weather) return null;
  
  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny': return <Sun className="h-5 w-5 text-yellow-300" />;
      case 'cloudy': return <Cloud className="h-5 w-5 text-blue-300" />;
      case 'rainy': return <CloudRain className="h-5 w-5 text-blue-400" />;
      case 'windy': return <Wind className="h-5 w-5 text-blue-200" />;
      case 'snowy': return <ThermometerSnowflake className="h-5 w-5 text-blue-100" />;
      default: return <CircleHelp className="h-5 w-5 text-gray-300" />;
    }
  };
  
  const getClothingTip = () => {
    const temp = weather.temperature;
    const condition = weather.condition;
    
    if (temp < 0) return "a warm winter coat and layers";
    if (temp < 10) {
      if (condition === 'rainy') return "a waterproof coat with thermal lining";
      if (condition === 'windy') return "a windbreaker with warm layers";
      return "a heavy jacket or light coat";
    }
    if (temp < 20) {
      if (condition === 'rainy') return "a light raincoat or jacket with umbrella";
      if (condition === 'windy') return "a medium-weight jacket";
      return "a light jacket or cardigan";
    }
    if (condition === 'rainy') return "a light water-resistant jacket";
    if (condition === 'windy') return "a light windbreaker or blouse";
    return "light, breathable clothing";
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 overflow-hidden rounded-lg border border-purple-500/30 bg-gradient-to-r from-indigo-950/50 to-purple-950/50 p-5 backdrop-blur-sm"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div 
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {getWeatherIcon()}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Current weather condition</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex-grow space-y-1">
          <div className="flex items-start sm:items-center gap-1 flex-wrap">
            <div className="inline-flex items-center px-2 py-0.5 bg-pink-500/20 rounded-full mr-2">
              <Sparkles className="mr-1 h-3 w-3 text-pink-400" />
              <span className="text-xs font-medium text-pink-300">Olivia's Tip</span>
            </div>
            
            <p className="text-sm font-medium text-white/90">
              <span className="inline-flex items-center">
                <MapPin className="mr-1 h-3 w-3 text-pink-400" />
                {weather.location}:
              </span>{' '}
              {weather.temperature}°C and {weather.condition}
            </p>
          </div>
          
          <p className="mt-1 text-sm text-white/80">
            <span className="font-medium text-purple-300">Style recommendation:</span> Try {getClothingTip()} today for the best comfort and style.
          </p>
        </div>
        
        <Button
          size="sm"
          className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md"
          onClick={onShowStyleOptions}
        >
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>See options</span>
          </span>
        </Button>
      </div>
    </motion.div>
  );
};

export default WeatherBasedTips;
