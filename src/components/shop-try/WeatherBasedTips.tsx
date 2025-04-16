
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, Umbrella, Wind, CloudRain, ThermometerSnowflake, MapPin, CircleHelp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

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
      className="mb-8 overflow-hidden rounded-lg border border-purple-500/20 bg-gradient-to-r from-indigo-950/40 to-purple-950/40 p-4 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
          {getWeatherIcon()}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white/90">
              <span className="inline-flex items-center">
                <MapPin className="mr-1 h-3 w-3 text-pink-400" />
                {weather.location}:
              </span>{' '}
              {weather.temperature}°C and {weather.condition}
            </p>
          </div>
          
          <p className="mt-1 text-xs text-white/70">
            Olivia suggests {getClothingTip()} for today's weather.
          </p>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          className="flex-shrink-0 border border-white/10 bg-white/5 text-xs text-white/80 hover:bg-white/10 hover:text-white"
          onClick={onShowStyleOptions}
        >
          See options
        </Button>
      </div>
    </motion.div>
  );
};

export default WeatherBasedTips;
