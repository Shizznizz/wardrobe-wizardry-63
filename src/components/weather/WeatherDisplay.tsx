
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, CloudSun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Thermometer, CalendarDays } from 'lucide-react';
import { WeatherInfo } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from '@/components/ui/card';
import { getDayOfWeek } from '@/lib/utils';
import { getWeatherGradient } from '@/components/weather/WeatherUtils';

interface WeatherDisplayProps {
  weather: WeatherInfo;
  compact?: boolean;
  className?: string; // Added className prop to the interface
}

const WeatherDisplay = ({ weather, compact = false, className = '' }: WeatherDisplayProps) => {
  const isMobile = useIsMobile();
  const today = new Date();
  
  const getWeatherIcon = (condition: string = 'clear', size: number = 24) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) 
      return <Sun className={`w-${size} h-${size} text-yellow-400`} />;
    if (lowerCondition.includes('cloud') && lowerCondition.includes('sun')) 
      return <CloudSun className={`w-${size} h-${size} text-blue-300`} />;
    if (lowerCondition.includes('cloud')) 
      return <Cloud className={`w-${size} h-${size} text-blue-200`} />;
    if (lowerCondition.includes('rain')) 
      return <CloudRain className={`w-${size} h-${size} text-blue-400`} />;
    if (lowerCondition.includes('snow')) 
      return <CloudSnow className={`w-${size} h-${size} text-blue-100`} />;
    
    return <Sun className={`w-${size} h-${size} text-yellow-400`} />;
  };

  // Generate forecast for upcoming days (would be replaced with real API data)
  const generateForecast = () => {
    const forecasts = [];
    const conditions = ['Clear sky', 'Partly cloudy', 'Cloudy', 'Light rain', 'Clear sky'];
    const tempVariations = [-1, 2, -2, 1, 0];
    
    for (let i = 1; i <= 5; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      
      forecasts.push({
        day: getDayOfWeek(forecastDate),
        temperature: weather.temperature + tempVariations[i - 1],
        condition: conditions[i - 1]
      });
    }
    
    return forecasts;
  };

  const forecast = generateForecast();
  
  const weatherGradient = getWeatherGradient(weather);

  // Olivia's fashion tips based on weather
  const getOliviasTip = () => {
    const temp = weather.temperature;
    const condition = weather.condition.toLowerCase();
    
    if (condition.includes('rain'))
      return "Don't forget your waterproof layers today! A stylish rain jacket in a vibrant color will brighten this rainy day.";
      
    if (condition.includes('snow'))
      return "Layer up with warm accessories! A chunky knit scarf and waterproof boots will keep you cozy and stylish.";
      
    if (condition.includes('cloud'))
      return "Perfect day for layering! Try a light cardigan or jacket that you can remove if the sun comes out.";
      
    if (temp > 25)
      return "Stay cool with breathable fabrics. Linen and cotton pieces in light colors are perfect for today's heat.";
      
    if (temp < 10)
      return "Bundle up in style! A statement coat with warm accessories will keep you fashionable in this chilly weather.";
      
    return "Today's weather is perfect for showcasing your personal style. Focus on comfort with a touch of flair!";
  };

  return (
    <div className={cn(
      "w-full overflow-hidden rounded-lg",
      compact ? "max-w-xs" : "h-full",
      className // Added className to the component's outermost div
    )}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "h-full",
          weatherGradient
        )}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Current Weather */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <div className="flex items-center mb-1">
                {weather.city && (
                  <span className="text-white font-medium text-lg">{weather.city}</span>
                )}
                {weather.country && (
                  <span className="text-white/70 text-sm ml-2">{weather.country}</span>
                )}
              </div>
              <div className="text-white/80 text-sm">
                {today.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            {!compact && (
              <div className="mt-3 md:mt-0 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm">
                Updated just now
              </div>
            )}
          </div>

          {/* Current Temperature and Condition */}
          <div className="flex flex-col md:flex-row items-start justify-between mb-6">
            <div className="flex items-center">
              <div className="mr-4">
                {getWeatherIcon(weather.condition, 16)}
              </div>
              <div className="flex items-end">
                <span className="text-white text-5xl font-light">{weather.temperature}</span>
                <span className="text-white text-2xl mb-1">°C</span>
              </div>
            </div>
            <div className="mt-2 md:mt-0">
              <div className="text-white text-lg">{weather.condition}</div>
              {weather.feelsLike && (
                <div className="flex items-center text-white/70 text-sm">
                  <Thermometer className="w-3.5 h-3.5 mr-1" />
                  Feels like {weather.feelsLike}°C
                </div>
              )}
            </div>
          </div>

          {/* Weather Details */}
          {!compact && !isMobile && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center mb-1">
                  <Wind className="w-4 h-4 text-blue-200 mr-2" />
                  <span className="text-white/80 text-sm">Wind</span>
                </div>
                <div className="text-white text-lg">{weather.windSpeed} m/s</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center mb-1">
                  <Droplets className="w-4 h-4 text-blue-200 mr-2" />
                  <span className="text-white/80 text-sm">Humidity</span>
                </div>
                <div className="text-white text-lg">{weather.humidity}%</div>
              </div>
            </div>
          )}

          {/* Weekly Forecast - Only show on desktop and when not in compact mode */}
          {!compact && !isMobile && (
            <>
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <CalendarDays className="w-4 h-4 text-white/70 mr-2" />
                  <h3 className="text-white font-medium">5-Day Forecast</h3>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {forecast.map((day, index) => (
                    <div 
                      key={index} 
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center"
                    >
                      <div className="text-white/70 text-xs mb-1">{day.day}</div>
                      <div className="flex justify-center my-1">
                        {getWeatherIcon(day.condition, 5)}
                      </div>
                      <div className="text-white font-medium">{day.temperature}°</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Olivia's Style Recommendation */}
              <div className="mt-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3">
                  <div className="flex items-center mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium mr-2">
                      O
                    </div>
                    <span className="text-white/90 font-medium">Olivia's Style Tip</span>
                  </div>
                  <p className="text-white/80 text-sm">{getOliviasTip()}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WeatherDisplay;
