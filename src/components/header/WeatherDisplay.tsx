
import { Sun, CloudSun, Cloud, CloudRain, Umbrella } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherDisplayProps {
  weather?: {
    temperature: number;
    condition: string;
  };
  isScrolled?: boolean;
}

export const WeatherDisplay = ({ weather, isScrolled = false }: WeatherDisplayProps) => {
  const getWeatherIcon = () => {
    if (!weather) return <Sun className="w-5 h-5 text-yellow-400" />;
    
    const condition = weather.condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) return <Sun className="w-5 h-5 text-yellow-400" />;
    if (condition.includes('cloud') && condition.includes('sun')) return <CloudSun className="w-5 h-5 text-blue-300" />;
    if (condition.includes('cloud')) return <Cloud className="w-5 h-5 text-blue-200" />;
    if (condition.includes('rain')) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (condition.includes('thunder')) return <Umbrella className="w-5 h-5 text-purple-400" />;
    
    return <Sun className="w-5 h-5 text-yellow-400" />;
  };

  if (!weather) return null;

  return (
    <div className={cn(
      "hidden md:flex items-center space-x-2 rounded-full px-4 py-1.5 shadow-sm hover:shadow-md transition-all",
      isScrolled 
        ? "bg-white/10 backdrop-blur" 
        : "bg-white/10 backdrop-blur-md"
    )}>
      {getWeatherIcon()}
      <span className="text-sm font-medium text-white">{weather.temperature}°</span>
    </div>
  );
};
