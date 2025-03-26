
import { WeatherInfo } from '@/lib/types';
import WeatherHeader from './WeatherHeader';
import WeatherTemperature from './WeatherTemperature';
import WeatherMetrics from './WeatherMetrics';
import OutfitSuggestionBox from './OutfitSuggestionBox';

interface WeatherDetailsProps {
  weather: WeatherInfo;
  isMobile: boolean;
}

const WeatherDetails = ({ weather, isMobile }: WeatherDetailsProps) => {
  return (
    <div className={`space-y-3 ${isMobile ? 'text-center w-full' : ''}`}>
      <WeatherHeader weather={weather} isMobile={isMobile} />
      <WeatherTemperature weather={weather} isMobile={isMobile} />
      <WeatherMetrics weather={weather} isMobile={isMobile} />
      <OutfitSuggestionBox weather={weather} />
    </div>
  );
};

export default WeatherDetails;
