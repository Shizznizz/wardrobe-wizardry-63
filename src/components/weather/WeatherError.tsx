
import { AlertTriangle } from 'lucide-react';
import { WeatherInfo } from '@/lib/types';

interface WeatherErrorProps {
  error: string;
  weather: WeatherInfo | null;
}

const WeatherError = ({ error, weather }: WeatherErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 min-h-[100px]">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <p className="text-sm text-destructive">{error}</p>
      {weather && (
        <div className="mt-4 text-sm">
          <p className="text-center">Using estimated weather data instead</p>
        </div>
      )}
    </div>
  );
};

export default WeatherError;
