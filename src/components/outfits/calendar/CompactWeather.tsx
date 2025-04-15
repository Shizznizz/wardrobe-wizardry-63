
import { WeatherInfo } from '@/lib/types';
import { Sun, Cloud, CloudRain, CloudFog, Thermometer } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompactWeatherProps {
  weather: WeatherInfo | null;
  date: Date;
}

const CompactWeather = ({ weather, date }: CompactWeatherProps) => {
  const getWeatherIcon = () => {
    if (!weather) return <Thermometer className="w-4 h-4" />;
    
    const condition = weather.condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) {
      return <Sun className="w-4 h-4 text-yellow-400" />;
    }
    if (condition.includes('cloud') && !condition.includes('rain')) {
      return <Cloud className="w-4 h-4 text-blue-200" />;
    }
    if (condition.includes('rain')) {
      return <CloudRain className="w-4 h-4 text-blue-400" />;
    }
    if (condition.includes('mist') || condition.includes('fog')) {
      return <CloudFog className="w-4 h-4 text-gray-400" />;
    }
    
    return <Thermometer className="w-4 h-4" />;
  };

  const getOliviaTip = () => {
    if (!weather) return "Loading weather info...";
    
    if (weather.temperature > 25) {
      return "Stay cool with light, breathable fabrics.";
    } else if (weather.temperature > 20) {
      return "Perfect weather for a light outfit!";
    } else if (weather.temperature > 15) {
      return "Consider adding a light jacket.";
    } else if (weather.temperature > 10) {
      return "Layer up for comfort today.";
    } else {
      return "Bundle up warmly today!";
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded-full">
        {getWeatherIcon()}
        <span>{weather?.temperature}°C</span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 bg-slate-800/50 px-2 py-1 rounded-full cursor-help">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs">
                O
              </div>
              <span className="truncate max-w-[150px]">{getOliviaTip()}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Style tip from Olivia</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CompactWeather;
