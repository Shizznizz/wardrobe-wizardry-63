
import { Loader } from 'lucide-react';

const WeatherLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 min-h-[100px]">
      <Loader className="h-12 w-12 text-primary animate-spin" />
      <p className="text-sm text-muted-foreground">Loading weather data...</p>
    </div>
  );
};

export default WeatherLoading;
