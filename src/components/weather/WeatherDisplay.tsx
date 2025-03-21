
import { Wind } from 'lucide-react';
import { WeatherInfo } from '@/lib/types';
import WeatherIcon from './WeatherIcon';

interface WeatherDisplayProps {
  weather: WeatherInfo;
}

const WeatherDisplay = ({ weather }: WeatherDisplayProps) => {
  return (
    <div className="space-y-3">
      {weather.city && (
        <div className="text-lg font-medium">
          {weather.city}{weather.country ? `, ${weather.country}` : ''}
        </div>
      )}
      <div className="flex items-center space-x-4">
        <div className="text-primary">
          <WeatherIcon iconName={weather.icon} size={12} />
        </div>
        <div>
          <div className="text-2xl font-medium">{weather.temperature}°C</div>
          <div className="text-sm text-muted-foreground capitalize">{weather.condition}</div>
        </div>
      </div>
      {weather.windSpeed !== undefined && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
