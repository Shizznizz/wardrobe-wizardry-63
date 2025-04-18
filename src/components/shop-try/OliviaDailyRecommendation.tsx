
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shirt, Zap, ArrowRight, Shuffle } from 'lucide-react';
import { ClothingItem, WeatherInfo } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { generateRandomWeather } from '@/services/WeatherService';
import { toast } from 'sonner';

interface OliviaDailyRecommendationProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
  customLocation?: { city: string; country: string } | null;
}

const OliviaDailyRecommendation = ({
  isPremiumUser,
  onTryItem,
  onUpgradeToPremium,
  customLocation
}: OliviaDailyRecommendationProps) => {
  const [loading, setLoading] = useState(true);
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [recommendation, setRecommendation] = useState<string>('');
  const [recommendedItems, setRecommendedItems] = useState<ClothingItem[]>([]);

  useEffect(() => {
    const fetchWeatherAndItems = async () => {
      try {
        // Fetch or generate weather data
        let weather: WeatherInfo;
        if (customLocation) {
          weather = generateRandomWeather(customLocation.city, customLocation.country);
        } else {
          weather = generateRandomWeather("New York", "USA");
        }
        setWeatherInfo(weather);

        // Generate AI recommendation based on weather
        generateRecommendation(weather);
        
        // Mock clothing items that would match the weather
        const mockItems: ClothingItem[] = [
          {
            id: 'wardrobe-1',
            name: 'Cropped Trench Coat',
            type: 'jacket',
            color: 'beige',
            season: ['autumn', 'spring'],
            image: '',
            imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=300&h=350',
            price: 89.99,
            tags: ['Everyday', 'Classic']
          },
          {
            id: 'wardrobe-2',
            name: 'Light Denim Jeans',
            type: 'jeans',
            color: 'blue',
            season: ['all'],
            image: '',
            imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=300&h=350',
            price: 49.99,
            tags: ['Casual', 'Versatile']
          },
          {
            id: 'wardrobe-3',
            name: 'White Button-Up Shirt',
            type: 'shirt',
            color: 'white',
            season: ['all'],
            image: '',
            imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&h=350',
            price: 34.99,
            tags: ['Office', 'Classic']
          }
        ];
        
        setRecommendedItems(mockItems);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load daily recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherAndItems();
  }, [customLocation]);

  const generateRecommendation = (weather: WeatherInfo) => {
    const recommendations = [
      `Today calls for layers! It's ${weather.condition?.toLowerCase()} and ${weather.temperature}°C—Olivia suggests a cropped trench coat from your wardrobe to pair with light denim.`,
      `Perfect day for a ${weather.condition?.toLowerCase()} look! At ${weather.temperature}°C, try pairing your favorite jeans with a light sweater and statement accessories.`,
      `With ${weather.condition?.toLowerCase()} weather at ${weather.temperature}°C, Olivia thinks a midi dress with a light jacket would be perfect for today's activities.`,
      `The forecast shows ${weather.condition?.toLowerCase()} at ${weather.temperature}°C. An oversized blazer with slim-fit pants would make a great statement today.`
    ];
    
    // Select a random recommendation or generate one based on weather
    const randomIndex = Math.floor(Math.random() * recommendations.length);
    setRecommendation(recommendations[randomIndex]);
  };

  const getWeatherIcon = (condition?: string) => {
    if (!condition) return 'sun';
    
    const lowerCaseCondition = condition.toLowerCase();
    if (lowerCaseCondition.includes('clear') || lowerCaseCondition.includes('sun')) return 'sun';
    if (lowerCaseCondition.includes('cloud')) return 'cloud';
    if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('shower')) return 'cloud-rain';
    if (lowerCaseCondition.includes('snow')) return 'cloud-snow';
    if (lowerCaseCondition.includes('thunder')) return 'cloud-lightning';
    if (lowerCaseCondition.includes('fog') || lowerCaseCondition.includes('mist')) return 'cloud-fog';
    
    return 'sun';
  };

  const handleTryOn = (item: ClothingItem) => {
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    
    onTryItem(item);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-12"
      >
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Olivia's Pick for Today
          </h2>
        </div>
        <div className="flex justify-center p-8">
          <div className="w-10 h-10 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Olivia's Pick for Today
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left side - Olivia image (40% width) */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden h-full">
            <div className="relative aspect-[3/4] h-full w-full">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&h=700" 
                alt="Olivia Bloom, virtual model"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center">
                <span className="mr-1">Today's Pick</span>
                <Zap className="h-3.5 w-3.5 text-yellow-400" />
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right side - Content (60% width) */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Top section - Recommendation text */}
          <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-white mb-2">Olivia's Style Recommendation</h3>
              <p className="text-slate-300 leading-relaxed">{recommendation}</p>
              
              <div className="flex items-center mt-4 text-xs text-slate-400">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-4 h-4 mr-1"
                >
                  <path d={
                    weatherInfo?.icon === 'cloud' ? 'M17.5 21H9.5M3.5 18.5H20.5M5.5 13.5H19.5M8.5 8.5H16.5' :
                    weatherInfo?.icon === 'rain' ? 'M16 13v8M8 13v8M12 15v8M20 16.5A7 7 0 116 16.5' :
                    weatherInfo?.icon === 'snow' ? 'M20 17.5A7 7 0 116 17.5M5 10v1M12 5v1M19 10v1M5 16l-2 2M12 19v1M19 16l2 2' :
                    'M12 3v1M12 20v1M5.5 5.5l1 1M18.5 5.5l-1 1M5.5 18.5l1-1M18.5 18.5l-1-1M3 12h1M20 12h1'
                  } />
                  <circle cx="12" cy="12" r="5" />
                </svg>
                <span>
                  {weatherInfo?.temperature}°C, {weatherInfo?.condition}
                </span>
                <span className="mx-2">•</span>
                <span>{weatherInfo?.city}, {weatherInfo?.country}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Bottom section - Recommended items */}
          <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden flex-grow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">From Your Wardrobe</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-slate-300 hover:text-white"
                >
                  <Shuffle className="h-3.5 w-3.5 mr-1.5" />
                  Refresh
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendedItems.map((item) => (
                  <div key={item.id} className="bg-slate-800/50 rounded-lg overflow-hidden border border-white/5">
                    <div className="relative aspect-square">
                      <img 
                        src={item.imageUrl || '/placeholder.svg'} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {item.tags && item.tags.length > 0 && (
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                          {item.tags[0]}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3">
                      <h4 className="text-sm font-medium text-white truncate" title={item.name}>
                        {item.name}
                      </h4>
                      
                      <div className="mt-3 flex gap-1">
                        <Button 
                          size="sm"
                          variant="default"
                          className="bg-blue-600 hover:bg-blue-700 text-xs w-full py-1 h-auto"
                          onClick={() => handleTryOn(item)}
                        >
                          <Shirt className="h-3 w-3 mr-1" />
                          Try On
                        </Button>
                        
                        <Button 
                          size="sm"
                          variant="outline"
                          className="border-white/10 hover:bg-white/10 text-xs w-full py-1 h-auto"
                        >
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Mix
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default OliviaDailyRecommendation;
