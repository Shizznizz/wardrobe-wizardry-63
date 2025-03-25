
import { Thermometer, Wind } from 'lucide-react';
import { WeatherInfo } from '@/lib/types';
import { getWeatherMood } from './WeatherUtils';

interface WeatherDetailsProps {
  weather: WeatherInfo;
  isMobile: boolean;
}

const WeatherDetails = ({ weather, isMobile }: WeatherDetailsProps) => {
  const weatherMood = getWeatherMood(weather);
  
  return (
    <div className={`space-y-3 ${isMobile ? 'text-center' : ''}`}>
      <div>
        <h3 className="text-lg font-medium text-white/90">
          Weather Mood: <span className="font-bold">{weatherMood}</span>
          {weather.condition.includes('cloud') ? ' & Cloudy' : ''}
        </h3>
        {weather.city && (
          <div className="text-base text-white/80">
            {weather.city}{weather.country ? `, ${weather.country}` : ''}
          </div>
        )}
      </div>
      
      <div className={`flex items-center ${isMobile ? 'justify-center' : ''} gap-2 mt-1`}>
        <div className="text-2xl font-medium text-white">{weather.temperature}°C</div>
        <div className="text-sm text-white/80 capitalize">({weather.condition})</div>
      </div>
      
      <div className="flex flex-wrap gap-4 pt-2">
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
      </div>
    </div>
  );
};

export default WeatherDetails;
