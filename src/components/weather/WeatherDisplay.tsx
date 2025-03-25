
import { Wind, Sun, Cloud, CloudRain, CloudSnow, CloudFog, AlertTriangle, CloudSun, Thermometer } from 'lucide-react';
import { WeatherInfo } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WeatherDisplayProps {
  weather: WeatherInfo;
}

const getWeatherMood = (weather: WeatherInfo): string => {
  const { temperature, condition } = weather;
  const conditionLower = condition.toLowerCase();
  
  // Temperature based descriptions
  if (temperature < 0) return "Freezing";
  if (temperature < 10) return "Chilly";
  if (temperature < 18) return "Cool";
  if (temperature < 25) return "Pleasant";
  if (temperature < 30) return "Warm";
  if (temperature >= 30) return "Hot";
  
  // Fallback to condition based description
  if (conditionLower.includes('rain')) return "Rainy";
  if (conditionLower.includes('cloud')) return "Cloudy";
  if (conditionLower.includes('snow')) return "Snowy";
  if (conditionLower.includes('fog')) return "Foggy";
  if (conditionLower.includes('clear') || conditionLower.includes('sun')) return "Sunny";
  
  return "Interesting";
};

const getWeatherGradient = (weather: WeatherInfo): string => {
  const { temperature, condition } = weather;
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('rain')) {
    return "bg-gradient-to-br from-blue-500/60 to-slate-700/60";
  }
  
  if (conditionLower.includes('snow')) {
    return "bg-gradient-to-br from-blue-100/60 to-blue-300/60";
  }
  
  if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return "bg-gradient-to-br from-gray-300/60 to-gray-500/60";
  }
  
  if (conditionLower.includes('cloud')) {
    return "bg-gradient-to-br from-slate-400/60 to-slate-600/60";
  }
  
  if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
    if (temperature < 15) {
      return "bg-gradient-to-br from-blue-400/60 to-sky-600/60"; // Cold sunny
    } else {
      return "bg-gradient-to-br from-amber-400/60 to-orange-500/60"; // Warm sunny
    }
  }
  
  return "bg-gradient-to-br from-purple-500/60 to-indigo-700/60"; // Default
};

const WeatherDisplay = ({ weather }: WeatherDisplayProps) => {
  const isMobile = useIsMobile();
  
  const WeatherIcon = () => {
    const iconName = weather.icon || '';
    const iconSize = 50;
    
    const sunVariants = {
      animate: {
        rotate: 360,
        transition: { 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }
      }
    };
    
    const cloudVariants = {
      animate: {
        x: [0, 10, 0],
        transition: { 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }
      }
    };
    
    const rainVariants = {
      animate: {
        y: [-5, 5],
        transition: { 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut",
          repeatType: "mirror" // Fixed: Use literal type instead of string
        }
      }
    };
    
    if (iconName.includes('sun') || iconName.includes('clear')) {
      return (
        <motion.div variants={sunVariants} animate="animate" className="text-amber-400">
          <Sun size={iconSize} strokeWidth={1.5} />
        </motion.div>
      );
    }
    
    if (iconName.includes('cloud') && iconName.includes('sun')) {
      return (
        <motion.div variants={cloudVariants} animate="animate" className="text-slate-200">
          <CloudSun size={iconSize} strokeWidth={1.5} />
        </motion.div>
      );
    }
    
    if (iconName.includes('cloud')) {
      return (
        <motion.div variants={cloudVariants} animate="animate" className="text-slate-300">
          <Cloud size={iconSize} strokeWidth={1.5} />
        </motion.div>
      );
    }
    
    if (iconName.includes('rain')) {
      return (
        <motion.div variants={rainVariants} animate="animate" className="text-blue-300">
          <CloudRain size={iconSize} strokeWidth={1.5} />
        </motion.div>
      );
    }
    
    if (iconName.includes('snow')) {
      return (
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            transition: { duration: 2, repeat: Infinity }
          }}
          className="text-blue-100"
        >
          <CloudSnow size={iconSize} strokeWidth={1.5} />
        </motion.div>
      );
    }
    
    if (iconName.includes('fog')) {
      return (
        <motion.div
          animate={{
            opacity: [1, 0.7, 1],
            transition: { duration: 3, repeat: Infinity }
          }}
          className="text-gray-300"
        >
          <CloudFog size={iconSize} strokeWidth={1.5} />
        </motion.div>
      );
    }
    
    return (
      <motion.div
        animate={{
          rotate: 360,
          transition: { 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }
        }}
        className="text-amber-400"
      >
        <Sun size={iconSize} strokeWidth={1.5} />
      </motion.div>
    );
  };
  
  const weatherMood = getWeatherMood(weather);
  const gradientClass = getWeatherGradient(weather);
  
  return (
    <div className={cn(
      "overflow-hidden rounded-2xl border border-white/20 shadow-lg p-6",
      gradientClass
    )}>
      <div className={`flex ${isMobile ? 'flex-col items-center' : 'items-start gap-6'}`}>
        <div className={`${isMobile ? 'mb-4' : ''}`}>
          <WeatherIcon />
        </div>
        
        <div className={`space-y-3 ${isMobile ? 'text-center' : ''}`}>
          <div>
            <h3 className="text-lg font-medium text-white/90">
              Weather Mood: <span className="font-bold">{weatherMood} {weather.condition.includes('cloud') ? '& Cloudy' : ''}</span>
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
          
          <div className="flex flex-wrap gap-4 pt-2">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
