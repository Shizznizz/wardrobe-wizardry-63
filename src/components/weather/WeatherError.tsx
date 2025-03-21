
import { AlertTriangle } from 'lucide-react';
import { WeatherInfo } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface WeatherErrorProps {
  error: string;
  weather: WeatherInfo | null;
}

const WeatherError = ({ error, weather }: WeatherErrorProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex flex-col items-center justify-center space-y-2 min-h-[100px] text-center p-4`}>
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <p className="text-sm text-destructive">{error}</p>
      {weather && (
        <div className="mt-2 text-sm">
          <p className="text-center">Using estimated weather data instead</p>
        </div>
      )}
    </div>
  );
};

export default WeatherError;
