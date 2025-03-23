
import { Wind } from 'lucide-react';
import { WeatherInfo } from '@/lib/types';
import WeatherIcon from './WeatherIcon';
import { useIsMobile } from '@/hooks/use-mobile';

interface WeatherDisplayProps {
  weather: WeatherInfo;
}

const WeatherDisplay = ({ weather }: WeatherDisplayProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`space-y-3 ${isMobile ? 'text-center' : ''}`}>
      {weather.city && (
        <div className="text-lg font-medium text-foreground">
          {weather.city}{weather.country ? `, ${weather.country}` : ''}
        </div>
      )}
      <div className={`flex items-center space-x-4 ${isMobile ? 'justify-center' : ''}`}>
        <div className="text-primary">
          <WeatherIcon iconName={weather.icon} size={12} />
        </div>
        <div>
          <div className="text-2xl font-medium text-foreground">{weather.temperature}°C</div>
          <div className="text-sm text-muted-foreground capitalize">{weather.condition}</div>
        </div>
      </div>
      {weather.windSpeed !== undefined && (
        <div className={`flex items-center gap-2 text-sm text-muted-foreground ${isMobile ? 'justify-center' : ''}`}>
          <Wind className="h-4 w-4" />
          <span>Wind: {weather.windSpeed} m/s</span>
        </div>
      )}
      {weather.feelsLike !== undefined && (
        <div className="text-sm text-muted-foreground">
          Feels like: {weather.feelsLike}°C
        </div>
      )}
      {weather.humidity !== undefined && (
        <div className="text-sm text-muted-foreground">
          Humidity: {weather.humidity}%
        </div>
      )}
    </div>
  );
};

export default WeatherDisplay;
