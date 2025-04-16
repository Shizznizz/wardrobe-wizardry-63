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
  
  const getOutfitTip = (condition: string, temperature: number) => {
    if (temperature < 0) {
      return "a warm winter coat with layers";
    } else if (temperature < 10) {
      return "something cozy with a light jacket";
    } else if (temperature < 20) {
      return "a light sweater or cardigan";
    } else {
      return "something light and breathable";
    }
  };
  
  if (loading || !weatherData) {
    return (
      <div className="h-12 animate-pulse bg-slate-800/50 rounded-lg"></div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="border border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-slate-900/20 backdrop-blur-sm">
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 mr-3">
              {getWeatherIcon(weatherData.condition)}
            </div>
            
            <div>
              <div className="flex items-center gap-1 text-sm text-white/80">
                <MapPin className="h-3 w-3" />
                <span>{weatherData.city}, {weatherData.country}</span>
                <span className="mx-1">•</span>
                <Thermometer className="h-3 w-3" />
                <span>{weatherData.temperature}°C</span>
              </div>
              
              <div className="text-sm text-purple-200 font-medium mt-0.5">
                Olivia suggests {getOutfitTip(weatherData.condition, weatherData.temperature)} today
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="text-xs text-white/70 hover:text-white">
            See Picks
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherBasedTips;
