
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, CloudFog, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WeatherInfo } from '@/lib/types';

interface WeatherWidgetProps {
  className?: string;
  onWeatherChange?: (weather: WeatherInfo) => void;
  city?: string;
  country?: string;
}

const WeatherWidget = ({ className, onWeatherChange, city, country }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      // Only fetch if both city and country are provided
      if (!city || !country) {
        if (!weather) {
          // If no weather data and no location, use random data for initial state
          generateRandomWeather();
        }
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        // Updated API key
        const apiKey = '1c9b6d1fa305474aac8191102231208';
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city},${country}&aqi=no`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Weather data not available for ${city}, ${country}`);
        }
        
        const data = await response.json();
        
        const weatherData: WeatherInfo = {
          temperature: Math.round(data.current.temp_c),
          condition: data.current.condition.text,
          icon: getIconName(data.current.condition.text),
          city: data.location.name,
          country: data.location.country,
          windSpeed: data.current.wind_kph / 3.6, // Convert km/h to m/s
          humidity: data.current.humidity,
          feelsLike: Math.round(data.current.feelslike_c)
        };
        
        setWeather(weatherData);
        
        if (onWeatherChange) {
          onWeatherChange(weatherData);
        }
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError(err instanceof Error ? err.message : 'Could not load weather data');
        // Generate random weather if there's an error
        generateRandomWeather();
      } finally {
        setIsLoading(false);
      }
    };
    
    const generateRandomWeather = () => {
      const conditions = [
        'Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 
        'Heavy Rain', 'Thunderstorm', 'Snow', 'Foggy'
      ];
      
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const randomTemp = Math.floor(Math.random() * 25) + 5; // Random temp between 5-30°C
      
      const weatherData: WeatherInfo = {
        temperature: randomTemp,
        condition: randomCondition,
        icon: getIconName(randomCondition),
        city: city,
        country: country
      };
      
      setWeather(weatherData);
      
      if (onWeatherChange) {
        onWeatherChange(weatherData);
      }
      
      setIsLoading(false);
    };
    
    fetchWeather();
  }, [city, country, onWeatherChange]);
  
  const getIconName = (condition: string): string => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return 'sun';
    if (lowerCondition.includes('cloud') && !lowerCondition.includes('rain')) return 'cloud';
    if (lowerCondition.includes('rain') || lowerCondition.includes('thunder')) return 'rain';
    if (lowerCondition.includes('snow')) return 'snow';
    if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) return 'fog';
    
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
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
            {weather && (
              <div className="mt-4 text-sm">
                <p>Using estimated weather data instead</p>
              </div>
            )}
          </div>
        ) : weather ? (
          <div className="space-y-3">
            {weather.city && (
              <div className="text-lg font-medium">{weather.city}</div>
            )}
            <div className="flex items-center space-x-4">
              <div className="text-primary">
                {getWeatherIcon()}
              </div>
              <div>
                <div className="text-2xl font-medium">{weather.temperature}°C</div>
                <div className="text-sm text-muted-foreground capitalize">{weather.condition}</div>
              </div>
            </div>
            {weather.windSpeed !== undefined && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wind className="h-4 w-4" />
                <span>Wind: {weather.windSpeed} m/s</span>
              </div>
            )}
            {weather.feelsLike !== undefined && (
              <div className="text-sm text-muted-foreground">
                Feels like: {weather.feelsLike}°C
              </div>
            )}
            {weather.humidity !== undefined && (
              <div className="text-sm text-muted-foreground">
                Humidity: {weather.humidity}%
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
