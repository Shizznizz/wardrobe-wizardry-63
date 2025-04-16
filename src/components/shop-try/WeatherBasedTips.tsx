
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Snowflake, Wind, MapPin, Thermometer, Sparkle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WeatherBasedTipsProps {
  userPhoto: string | null;
  isUsingOliviaImage: boolean;
  customLocation?: { city: string; country: string } | null;
  onShowStyleOptions?: () => void;
}

interface WeatherData {
  temperature: number;
  condition: 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  city: string;
  country: string;
}

const WeatherBasedTips = ({
  userPhoto,
  isUsingOliviaImage,
  customLocation,
  onShowStyleOptions
}: WeatherBasedTipsProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Only show this component if a photo is uploaded or Olivia is selected
  if (!userPhoto) return null;
  
  // Mock fetching weather data
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      
      // If we have custom location from props, use it
      if (customLocation) {
        setTimeout(() => {
          // Random weather for better demo experience
          const conditions = ['clear', 'cloudy', 'rainy', 'snowy', 'windy'] as const;
          const randomTemp = Math.floor(Math.random() * 30) - 5; // -5 to 25°C
          const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
          
          setWeatherData({
            temperature: randomTemp,
            condition: randomCondition,
            city: customLocation.city,
            country: customLocation.country
          });
          
          setLoading(false);
        }, 800);
        return;
      }
      
      // Otherwise use a default location
      setTimeout(() => {
        setWeatherData({
          temperature: 9,
          condition: 'cloudy',
          city: 'Rotterdam',
          country: 'Netherlands'
        });
        
        setLoading(false);
      }, 800);
    };
    
    fetchWeather();
  }, [customLocation, userPhoto]);
  
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear':
        return <Sun className="h-5 w-5 text-yellow-400" />;
      case 'cloudy':
        return <Cloud className="h-5 w-5 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="h-5 w-5 text-blue-400" />;
      case 'snowy':
        return <Snowflake className="h-5 w-5 text-sky-400" />;
      case 'windy':
        return <Wind className="h-5 w-5 text-teal-400" />;
      default:
        return <Cloud className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getOutfitTip = (condition: string, temperature: number) => {
    if (temperature < 0) {
      return "Olivia suggests a warm insulated coat with layered knits today";
    } else if (temperature < 10) {
      return "Olivia recommends a wool coat with a scarf and boots today";
    } else if (temperature < 20) {
      return "A light jacket or cardigan would be perfect for today's weather";
    } else {
      return "Today's perfect for lightweight fabrics and breezy silhouettes";
    }
  };
  
  const getWeatherStyle = (condition: string) => {
    switch (condition) {
      case 'clear':
        return "from-blue-500/20 to-yellow-500/20 border-yellow-500/30";
      case 'cloudy':
        return "from-slate-500/20 to-slate-700/20 border-slate-500/30";
      case 'rainy':
        return "from-blue-500/20 to-indigo-500/20 border-blue-500/30";
      case 'snowy':
        return "from-blue-400/20 to-indigo-300/20 border-blue-300/30";
      case 'windy':
        return "from-teal-500/20 to-cyan-500/20 border-teal-500/30";
      default:
        return "from-purple-500/20 to-indigo-500/20 border-purple-500/30";
    }
  };
  
  if (loading || !weatherData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="h-16 animate-pulse bg-slate-800/50 rounded-xl" />
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className={`border border-purple-500/20 bg-gradient-to-r ${getWeatherStyle(weatherData.condition)} backdrop-blur-sm`}>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center">
              <div className={`p-2 rounded-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 mr-3 shadow-lg`}>
                {getWeatherIcon(weatherData.condition)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-1 text-sm text-white/80 mb-1">
                  <MapPin className="h-3 w-3" />
                  <span>{weatherData.city}, {weatherData.country}</span>
                  <span className="mx-1">•</span>
                  <Thermometer className="h-3 w-3" />
                  <span>{weatherData.temperature}°C</span>
                </div>
                
                <div className="text-sm sm:text-base text-white font-medium flex items-center gap-1.5">
                  <Sparkle className="h-3 w-3 text-yellow-300" />
                  <span>{getOutfitTip(weatherData.condition, weatherData.temperature)}</span>
                </div>
              </div>
            </div>
            
            {onShowStyleOptions && (
              <Button 
                onClick={onShowStyleOptions}
                variant="ghost" 
                size="sm" 
                className="text-xs sm:text-sm text-white/80 hover:text-white hover:bg-white/10 whitespace-nowrap"
              >
                See Suggested Items
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherBasedTips;
