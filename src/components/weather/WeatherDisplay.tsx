
import React from 'react';
import { WeatherIcon } from '@/components/ui/weather-icon';
import { cn } from '@/lib/utils';
import { WeatherInfo } from '@/lib/types';
import { MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherDisplayProps {
  weather: WeatherInfo;
  compact?: boolean;
}

const WeatherDisplay = ({ weather, compact = false }: WeatherDisplayProps) => {
  // Get condition as lowercase for consistent handling
  const condition = (weather.condition || 'clear').toLowerCase();
  
  // Define mood-based color tints
  const getBgGradient = () => {
    if (condition.includes('clear') || condition.includes('sun')) {
      return 'from-amber-500/20 to-orange-400/10'; // Sunny
    } else if (condition.includes('cloud')) {
      return 'from-blue-500/20 to-slate-400/10'; // Cloudy
    } else if (condition.includes('rain')) {
      return 'from-blue-600/20 to-indigo-400/10'; // Rainy
    } else if (condition.includes('snow')) {
      return 'from-cyan-500/20 to-blue-400/10'; // Snowy
    } else {
      return 'from-purple-500/20 to-indigo-400/10'; // Default
    }
  };

  // Format date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: compact ? 'short' : 'long',
    month: compact ? 'short' : 'long',
    day: 'numeric'
  });

  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg",
      compact ? "p-3" : "p-4"
    )}>
      {/* Dynamic colored background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-80 -z-10",
        getBgGradient()
      )}></div>
      
      <div className={cn(
        "flex items-center justify-between",
        compact ? "flex-col space-y-2" : "flex-row"
      )}>
        <div className="flex items-center">
          <div className={compact ? "text-center" : ""}>
            <div className="flex items-center gap-1 text-white/70 text-sm mb-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{weather.city}</span>
            </div>
            <div className="flex items-center gap-1 text-white/70 text-sm">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className={cn(
          "flex items-center",
          compact ? "flex-col" : "flex-row gap-4"
        )}>
          <motion.div
            className={cn("relative", compact ? "mb-2" : "")}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <WeatherIcon 
              condition={(weather.condition || 'clear').toLowerCase() as any} 
              className={cn(
                "text-white", 
                compact ? "h-10 w-10" : "h-16 w-16"
              )} 
            />
          </motion.div>
          
          <div className={compact ? "text-center" : "text-right"}>
            <div className={cn(
              "font-bold text-white",
              compact ? "text-3xl" : "text-4xl"
            )}>
              {weather.temperature}°C
            </div>
            <div className="text-white/80 capitalize">
              {weather.condition || 'Clear'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
