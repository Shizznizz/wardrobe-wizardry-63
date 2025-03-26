
import { Thermometer, Wind, Droplets } from 'lucide-react';
import { WeatherInfo } from '@/lib/types';

interface WeatherMetricsProps {
  weather: WeatherInfo;
  isMobile: boolean;
}

const WeatherMetrics = ({ weather, isMobile }: WeatherMetricsProps) => {
  return (
    <div className={`flex flex-wrap ${isMobile ? 'justify-center' : ''} gap-4 pt-2`}>
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
      
      {weather.humidity !== undefined && (
        <div className="flex items-center gap-2 text-sm text-white/90">
          <Droplets className="h-4 w-4" />
          <span>Humidity: {weather.humidity}%</span>
        </div>
      )}
    </div>
  );
};

export default WeatherMetrics;
