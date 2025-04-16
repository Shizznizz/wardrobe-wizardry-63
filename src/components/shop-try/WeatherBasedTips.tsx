import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Snowflake, Wind, MapPin, Thermometer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WeatherBasedTipsProps {
  userPhoto: string | null;
  isUsingOliviaImage: boolean;
  customLocation?: { city: string; country: string } | null;
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
  customLocation
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
  
  const getOutfitSuggestion = (temp: number, condition: string) => {
    if (temp < 0) return "a warm coat with insulated layers";
    if (temp < 10) return "a cozy sweater with a light jacket";
    if (temp < 20) return "a light cardigan or denim jacket";
    return "a breathable tee or summer dress";
  };
  
  if (loading) {
    return (
      <Card className="bg-slate-900/40 border-white/10 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-5 w-5 rounded-full bg-white/10"></div>
            <div className="h-5 w-32 rounded bg-white/10"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!weatherData) return null;
  
  const suggestion = getOutfitSuggestion(weatherData.temperature, weatherData.condition);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-r from-slate-900/40 to-purple-900/20 border-white/10 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getWeatherIcon(weatherData.condition)}
              <span className="flex items-center text-sm font-medium text-white">
                <Thermometer className="h-3.5 w-3.5 mr-1 text-white/70" />
                {weatherData.temperature}°C • {weatherData.condition}
              </span>
            </div>
            
            <div className="flex items-center text-xs text-white/60">
              <MapPin className="h-3 w-3 mr-1" />
              {weatherData.city}, {weatherData.country}
            </div>
          </div>
          
          <p className="mt-2 text-white/80 text-sm">
            <span className="text-purple-300 font-medium">Olivia suggests:</span> Try {suggestion} for today's weather conditions!
          </p>
          
          <div className="mt-2 flex justify-end">
            <Button 
              variant="link" 
              size="sm" 
              className="text-xs text-purple-300 hover:text-purple-200 p-0 h-auto"
            >
              See weather-appropriate outfits
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherBasedTips;
