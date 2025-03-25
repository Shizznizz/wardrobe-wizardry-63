
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
      "overflow-hidden rounded-xl border border-white/20 shadow-lg p-4 md:p-5 h-full",
      gradientClass
    )}>
      <div className={`flex ${isMobile ? 'flex-col items-center' : 'items-start gap-6'}`}>
        <div className={`${isMobile ? 'mb-4 flex justify-center' : ''}`}>
          <WeatherIconSelector iconName={weather.icon || weather.condition.toLowerCase()} 
            iconSize={isMobile ? 60 : 50} />
        </div>
        
        <WeatherDetails weather={weather} isMobile={isMobile} />
      </div>
    </div>
  );
};

export default WeatherDisplay;
