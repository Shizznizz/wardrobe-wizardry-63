
import React from 'react';
import { Sun, CloudSun, Cloud, CloudRain, Umbrella, Wind, Snowflake, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { WeatherInfo } from '@/lib/types';

interface WeatherDisplayProps {
  weather: WeatherInfo;
  isScrolled?: boolean;
  className?: string;
}

const WeatherDisplay = ({ weather, isScrolled = false, className = '' }: WeatherDisplayProps) => {
  const isMobile = useIsMobile();
  
  const getWeatherIcon = () => {
    const condition = (weather.condition || 'clear').toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) return <Sun className="w-6 h-6 text-yellow-400" />;
    if (condition.includes('cloud') && (condition.includes('sun') || condition.includes('part'))) return <CloudSun className="w-6 h-6 text-blue-300" />;
    if (condition.includes('cloud')) return <Cloud className="w-6 h-6 text-blue-200" />;
    if (condition.includes('rain') || condition.includes('drizzle')) return <CloudRain className="w-6 h-6 text-blue-400" />;
    if (condition.includes('thunder') || condition.includes('storm')) return <Umbrella className="w-6 h-6 text-purple-400" />;
    if (condition.includes('snow') || condition.includes('frost')) return <Snowflake className="w-6 h-6 text-blue-100" />;
    if (condition.includes('fog') || condition.includes('mist')) return <Droplets className="w-6 h-6 text-blue-200" />;
    if (condition.includes('wind')) return <Wind className="w-6 h-6 text-blue-300" />;
    
    return <Sun className="w-6 h-6 text-yellow-400" />;
  };

  // Ensure we have a valid temperature to display
  const temperature = typeof weather.temperature === 'number' ? Math.round(weather.temperature) : '--';
  
  // Format humidity and wind speed if available
  const humidity = weather.humidity ? `${weather.humidity}%` : '--';
  const windSpeed = weather.windSpeed ? `${weather.windSpeed} km/h` : '--';

  return (
    <div className={cn(
      "bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-xl p-4 border border-white/10 backdrop-blur-md shadow-lg",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-700/50 rounded-lg">
            {getWeatherIcon()}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{temperature}°C</h3>
            <p className="text-sm text-white/70 capitalize">{weather.condition || 'Unknown'}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-white/70">
            {weather.city || '--'}, {weather.country || '--'}
          </div>
          <div className="text-xs text-white/50">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="bg-white/5 p-2 rounded-lg flex items-center">
          <Droplets className="w-4 h-4 mr-2 text-blue-300" />
          <span className="text-xs text-white/80">Humidity: {humidity}</span>
        </div>
        <div className="bg-white/5 p-2 rounded-lg flex items-center">
          <Wind className="w-4 h-4 mr-2 text-blue-300" />
          <span className="text-xs text-white/80">Wind: {windSpeed}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
