
import { WeatherInfo } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { getWeatherMood, getWeatherGradient } from './WeatherUtils';
import { WeatherIconSelector } from './WeatherIcons';
import WeatherDetails from './WeatherDetails';
import { motion } from 'framer-motion';

interface WeatherDisplayProps {
  weather: WeatherInfo;
  className?: string;
}

const WeatherDisplay = ({ weather, className }: WeatherDisplayProps) => {
  const isMobile = useIsMobile();
  const weatherMood = getWeatherMood(weather);
  const gradientClass = getWeatherGradient(weather);
  
  // Condition-based animations
  const isRainy = weather.condition.toLowerCase().includes('rain');
  const isCloudy = weather.condition.toLowerCase().includes('cloud');
  const isSunny = weather.condition.toLowerCase().includes('sun') || weather.condition.toLowerCase().includes('clear');
  
  const raindrops = Array.from({ length: 10 }, (_, i) => i + 1);
  const clouds = Array.from({ length: 3 }, (_, i) => i + 1);
  const sunrays = Array.from({ length: 8 }, (_, i) => i + 1);
  
  return (
    <motion.div 
      className={cn(
        "overflow-hidden rounded-xl border border-white/20 shadow-lg p-4 md:p-5 h-full transition-all duration-300 hover:shadow-xl relative",
        gradientClass,
        className
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Weather ambient effects */}
      {isRainy && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {raindrops.map((drop) => (
            <motion.div
              key={`raindrop-${drop}`}
              className="absolute w-0.5 h-2 bg-blue-200/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
              }}
              animate={{
                y: ["0%", "105%"],
                opacity: [0.7, 0.3],
              }}
              transition={{
                duration: 0.8 + Math.random() * 0.5,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}
      
      {isCloudy && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {clouds.map((cloud) => (
            <motion.div
              key={`cloud-${cloud}`}
              className="absolute h-8 w-16 bg-white/10 rounded-full blur-sm"
              style={{
                left: `${-20 + (cloud * 40)}%`,
                top: `${10 + (cloud * 5)}%`,
              }}
              animate={{
                x: ["0%", "5%", "0%"],
              }}
              transition={{
                duration: 8 + cloud * 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
      
      {isSunny && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-4 right-4 h-14 w-14 rounded-full bg-yellow-500/20 blur-sm"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {sunrays.map((ray) => (
            <motion.div
              key={`sunray-${ray}`}
              className="absolute h-1 bg-yellow-400/20 origin-left"
              style={{
                left: '85%',
                top: '25%',
                width: '20%',
                transform: `rotate(${ray * 45}deg)`,
              }}
              animate={{
                opacity: [0.3, 0.5, 0.3],
                width: ['15%', '20%', '15%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: ray * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      <div className={`flex ${isMobile ? 'flex-col items-center' : 'items-start gap-6'} relative z-10`}>
        <motion.div 
          className={`${isMobile ? 'mb-4 flex justify-center' : ''}`}
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            repeatType: "reverse", 
            ease: "easeInOut" 
          }}
        >
          <WeatherIconSelector 
            iconName={weather.icon || weather.condition.toLowerCase()} 
            iconSize={isMobile ? 60 : 80} 
          />
        </motion.div>
        
        <WeatherDetails weather={weather} isMobile={isMobile} />
      </div>
    </motion.div>
  );
};

export default WeatherDisplay;
