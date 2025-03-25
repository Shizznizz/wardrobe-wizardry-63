
import { WeatherInfo } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { getWeatherMood, getWeatherGradient } from './WeatherUtils';
import { WeatherIconSelector } from './WeatherIcons';
import WeatherDetails from './WeatherDetails';

interface WeatherDisplayProps {
  weather: WeatherInfo;
}

const WeatherDisplay = ({ weather }: WeatherDisplayProps) => {
  const isMobile = useIsMobile();
  const weatherMood = getWeatherMood(weather);
  const gradientClass = getWeatherGradient(weather);
  
  return (
    <div className={cn(
      "overflow-hidden rounded-2xl border border-white/20 shadow-lg p-6",
      gradientClass
    )}>
      <div className={`flex ${isMobile ? 'flex-col items-center' : 'items-start gap-6'}`}>
        <div className={`${isMobile ? 'mb-4' : ''}`}>
          <WeatherIconSelector iconName={weather.icon || ''} />
        </div>
        
        <WeatherDetails weather={weather} isMobile={isMobile} />
      </div>
    </div>
  );
};

export default WeatherDisplay;
