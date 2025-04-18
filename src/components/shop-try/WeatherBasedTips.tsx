
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Cloud, CloudRain, Thermometer, MapPin, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface WeatherBasedTipsProps {
  userPhoto: string | null;
  isUsingOliviaImage: boolean;
  customLocation?: { city: string; country: string } | null;
  onShowStyleOptions: () => void;
}

const WeatherBasedTips = ({ 
  userPhoto, 
  isUsingOliviaImage, 
  customLocation,
  onShowStyleOptions
}: WeatherBasedTipsProps) => {
  const [weather, setWeather] = useState({
    temperature: 18,
    condition: 'Clear',
    city: 'New York',
    country: 'USA'
  });
  const [expanded, setExpanded] = useState(false);
  const [oliviaRecommendation, setOliviaRecommendation] = useState('');
  const isMobile = useIsMobile();

  useEffect(() => {
    // In a real app, fetch weather data from an API
    // For now, use mock data
    const mockWeatherData = {
      temperature: Math.floor(Math.random() * (30 - 10 + 1)) + 10, // Random temp between 10-30
      condition: ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
      city: customLocation?.city || 'New York',
      country: customLocation?.country || 'USA'
    };
    
    setWeather(mockWeatherData);
    
    // Generate recommendation based on weather
    const recommendations = [
      `It's ${mockWeatherData.temperature}°C and ${mockWeatherData.condition.toLowerCase()} in ${mockWeatherData.city} today. I suggest a ${mockWeatherData.temperature > 20 ? 'light linen shirt with breathable pants' : 'layered outfit with a light jacket'} to keep comfortable all day.`,
      `${mockWeatherData.city} is experiencing ${mockWeatherData.condition.toLowerCase()} conditions at ${mockWeatherData.temperature}°C. Perfect for ${mockWeatherData.temperature > 20 ? 'that new sundress' : 'your favorite jeans and a light sweater'}.`,
      `For today's ${mockWeatherData.condition.toLowerCase()} weather in ${mockWeatherData.city} (${mockWeatherData.temperature}°C), try ${mockWeatherData.condition.includes('Rain') ? 'water-resistant layers and ankle boots' : mockWeatherData.temperature > 25 ? 'breathable fabrics in light colors' : 'light layers that you can add or remove as needed'}.`,
    ];
    
    setOliviaRecommendation(recommendations[Math.floor(Math.random() * recommendations.length)]);
  }, [customLocation]);

  const getWeatherIcon = () => {
    if (weather.condition.includes('Rain')) return <CloudRain className="h-6 w-6 text-blue-400" />;
    if (weather.condition.includes('Cloud')) return <Cloud className="h-6 w-6 text-gray-400" />;
    return <Sun className="h-6 w-6 text-yellow-400" />;
  };

  // Skip this section if no user photo is uploaded yet
  if (!userPhoto) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="border-white/10 bg-gradient-to-br from-slate-900/80 to-indigo-900/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Olivia's Image or User Photo */}
            <div className="w-full sm:w-1/3 sm:max-w-[240px] rounded-lg overflow-hidden">
              <img 
                src={userPhoto} 
                alt={isUsingOliviaImage ? "Olivia" : "You"} 
                className="w-full h-auto rounded-lg object-cover aspect-[3/4]"
              />
              {isUsingOliviaImage && (
                <div className="mt-2 text-center">
                  <span className="text-xs bg-purple-600/60 px-2 py-1 rounded text-white">
                    Olivia
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white">Olivia's Pick for Today</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white/70 hover:text-white sm:hidden"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>
              
              <div className={`${isMobile && !expanded ? 'max-h-24 overflow-hidden' : ''}`}>
                <div className="flex items-center mb-4 text-sm text-white/80">
                  <div className="flex items-center mr-4">
                    {getWeatherIcon()}
                    <span className="ml-1">{weather.condition}</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <Thermometer className="h-5 w-5 text-red-400" />
                    <span className="ml-1">{weather.temperature}°C</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-purple-400" />
                    <span className="ml-1">{weather.city}, {weather.country}</span>
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 mb-4">
                  <p className="text-white/90">
                    {oliviaRecommendation}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-white/90 text-sm font-medium mb-2">Pieces that work for today:</h3>
                  <div className="flex -space-x-3 overflow-hidden">
                    <div className="w-12 h-12 rounded-full border-2 border-purple-600 bg-white/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-indigo-600 bg-white/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-blue-600 bg-white/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center text-xs text-white/80">
                      +5
                    </div>
                  </div>
                </div>
              </div>
              
              {isMobile && !expanded && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/70 hover:text-white w-full"
                  onClick={() => setExpanded(true)}
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  See Full Recommendation
                </Button>
              )}
              
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white"
                onClick={onShowStyleOptions}
              >
                See Suggested Items
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherBasedTips;
