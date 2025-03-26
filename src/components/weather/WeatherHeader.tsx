
import { WeatherInfo } from '@/lib/types';
import { getWeatherMood } from './WeatherUtils';
import { motion } from 'framer-motion';

interface WeatherHeaderProps {
  weather: WeatherInfo;
  isMobile: boolean;
}

const WeatherHeader = ({ weather, isMobile }: WeatherHeaderProps) => {
  const weatherMood = getWeatherMood(weather);
  
  return (
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
  );
};

export default WeatherHeader;
