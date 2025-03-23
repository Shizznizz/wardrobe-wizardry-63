
import { Sun, CloudSun, Cloud, CloudRain, Umbrella } from 'lucide-react';

interface WeatherDisplayProps {
  weather?: {
    temperature: number;
    condition: string;
  };
}

export const WeatherDisplay = ({ weather }: WeatherDisplayProps) => {
  const getWeatherIcon = () => {
    if (!weather) return <Sun className="w-5 h-5" />;
    
    const condition = weather.condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) return <Sun className="w-5 h-5" />;
    if (condition.includes('cloud') && condition.includes('sun')) return <CloudSun className="w-5 h-5" />;
    if (condition.includes('cloud')) return <Cloud className="w-5 h-5" />;
    if (condition.includes('rain')) return <CloudRain className="w-5 h-5" />;
    if (condition.includes('thunder')) return <Umbrella className="w-5 h-5" />;
    
    return <Sun className="w-5 h-5" />;
  };

  if (!weather) return null;

  return (
    <div className="hidden md:flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-1.5 border border-gray-100 dark:border-gray-700 transition-all hover:bg-white dark:hover:bg-gray-700">
      {getWeatherIcon()}
      <span className="text-sm font-medium">{weather.temperature}°</span>
    </div>
  );
};
