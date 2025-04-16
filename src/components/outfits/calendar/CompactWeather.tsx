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
  customTip?: string;
}

const CompactWeather = ({ weather, date, customTip }: CompactWeatherProps) => {
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
    if (customTip) return customTip;
    if (!weather) return "Loading weather info...";
    
    const condition = weather.condition.toLowerCase();
    const month = date.getMonth();
    const season = month >= 2 && month <= 4 ? 'spring' :
                  month >= 5 && month <= 7 ? 'summer' :
                  month >= 8 && month <= 10 ? 'autumn' : 'winter';
    
    if (condition.includes('rain')) {
      return weather.temperature > 20 
        ? "Don't forget a light rain jacket!"
        : "Stay dry with waterproof layers today.";
    }
    
    if (condition.includes('snow')) {
      return "Bundle up warmly and wear waterproof boots!";
    }
    
    if (condition.includes('wind')) {
      return weather.temperature > 20
        ? "A light windbreaker might be useful today."
        : "Layer up against the wind today!";
    }
    
    switch (season) {
      case 'summer':
        return weather.temperature > 25 
          ? "Stay cool with breathable, light fabrics."
          : "Perfect weather for your summer outfits!";
      case 'winter':
        return weather.temperature < 5
          ? "Bundle up with warm layers today!"
          : "Layer up for winter comfort.";
      case 'spring':
        return weather.temperature < 15
          ? "Spring can be chilly - layer up!"
          : "Perfect spring weather for light layers!";
      case 'autumn':
        return weather.temperature < 15
          ? "Autumn chill - time for cozy layers!"
          : "Enjoy the mild autumn weather!";
      default:
        return "Dress comfortably for today's weather!";
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
