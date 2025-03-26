
import { WeatherInfo } from '@/lib/types';

interface WeatherTemperatureProps {
  weather: WeatherInfo;
  isMobile: boolean;
}

const WeatherTemperature = ({ weather, isMobile }: WeatherTemperatureProps) => {
  return (
    <div className={`flex items-center ${isMobile ? 'justify-center' : ''} gap-2 mt-1`}>
      <div className="text-2xl font-medium text-white">{weather.temperature}°C</div>
      <div className="text-sm text-white/80 capitalize">({weather.condition})</div>
    </div>
  );
};

export default WeatherTemperature;
