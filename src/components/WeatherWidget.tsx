
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, CloudFog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WeatherInfo } from '@/lib/types';

interface WeatherWidgetProps {
  className?: string;
  onWeatherChange?: (weather: WeatherInfo) => void;
}

const WeatherWidget = ({ className, onWeatherChange }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, we would fetch data from a weather API
        // For demo purposes, we'll simulate a weather fetch with random data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const conditions = [
          'Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 
          'Heavy Rain', 'Thunderstorm', 'Snow', 'Foggy'
        ];
        
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const randomTemp = Math.floor(Math.random() * 25) + 5; // Random temp between 5-30°C
        
        const weatherData: WeatherInfo = {
          temperature: randomTemp,
          condition: randomCondition,
          icon: getIconName(randomCondition)
        };
        
        setWeather(weatherData);
        
        if (onWeatherChange) {
          onWeatherChange(weatherData);
        }
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Could not load weather data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeather();
    
    // In a real app, you might refresh weather periodically
    const interval = setInterval(fetchWeather, 30 * 60 * 1000); // Every 30 mins
    
    return () => clearInterval(interval);
  }, [onWeatherChange]);
  
  const getIconName = (condition: string): string => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return 'sun';
    if (lowerCondition.includes('cloud') && !lowerCondition.includes('rain')) return 'cloud';
    if (lowerCondition.includes('rain') || lowerCondition.includes('thunder')) return 'rain';
    if (lowerCondition.includes('snow')) return 'snow';
    if (lowerCondition.includes('fog')) return 'fog';
    
    return 'sun'; // Default
  };
  
  const getWeatherIcon = () => {
    if (!weather) return <Sun className="h-12 w-12" />;
    
    switch (weather.icon) {
      case 'sun':
        return <Sun className="h-12 w-12" />;
      case 'cloud':
        return <Cloud className="h-12 w-12" />;
      case 'rain':
        return <CloudRain className="h-12 w-12" />;
      case 'snow':
        return <CloudSnow className="h-12 w-12" />;
      case 'fog':
        return <CloudFog className="h-12 w-12" />;
      default:
        return <Sun className="h-12 w-12" />;
    }
  };

  return (
    <Card className={cn("overflow-hidden bg-white shadow-soft backdrop-blur-sm", className)}>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-2 min-h-[100px]">
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">Loading weather data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center space-y-2 min-h-[100px]">
            <Wind className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : weather ? (
          <div className="flex items-center space-x-4">
            <div className="text-primary">
              {getWeatherIcon()}
            </div>
            <div>
              <div className="text-2xl font-medium">{weather.temperature}°C</div>
              <div className="text-sm text-muted-foreground">{weather.condition}</div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
