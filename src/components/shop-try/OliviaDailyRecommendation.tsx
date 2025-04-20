
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shirt, Zap, ArrowRight, Shuffle, CloudSun, Droplet, Wind, Check, Sparkles } from 'lucide-react';
import { ClothingItem, WeatherInfo } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { generateRandomWeather } from '@/services/WeatherService';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Casual');

  useEffect(() => {
    const fetchWeatherAndItems = async () => {
      try {
        let weather: WeatherInfo;
        if (customLocation) {
          weather = generateRandomWeather(customLocation.city, customLocation.country);
        } else {
          weather = generateRandomWeather("New York", "USA");
        }
        setWeatherInfo(weather);

        generateRecommendation(weather);
        
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

  const handleSelectOccasion = (occasion: string) => {
    setSelectedOccasion(occasion);
  };

  const handleSaveToCollection = () => {
    // Implement collection saving logic here
  };

  const handleStyleMore = () => {
    // Implement style more logic here
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
        <h2 className="px-4 text-xl md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-pink-400">
          Your Personalized Daily Outfit by Olivia
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden mb-4">
            <CardContent className="p-4">
              <h3 className="font-medium text-white mb-3 flex items-center">
                <CloudSun className="h-5 w-5 text-blue-400 mr-2" />
                Recommended Outfit Based on Weather
              </h3>
              {weatherInfo && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold text-white">
                      {weatherInfo.temperature}°C
                    </div>
                    <Badge variant="outline" className="bg-white/10 border-white/20">
                      {weatherInfo.condition}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-white/70">
                    <div className="flex items-center">
                      <Wind className="h-4 w-4 mr-1.5 text-blue-400" />
                      Wind: {weatherInfo.windSpeed || "Light"} km/h
                    </div>
                    <div className="flex items-center">
                      <Droplet className="h-4 w-4 mr-1.5 text-blue-400" />
                      Humidity: {weatherInfo.humidity || "60"}%
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden mb-4">
            <CardContent className="p-4">
              <h3 className="font-medium text-white mb-3">I'm dressing for...</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Casual', 'Work', 'Date', 'Party'].map((occasion) => (
                  <Button
                    key={occasion}
                    variant="outline"
                    size="lg"
                    onClick={() => handleSelectOccasion(occasion)}
                    className={`border-white/10 hover:bg-white/10 ${
                      selectedOccasion === occasion 
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-200' 
                        : 'text-white'
                    }`}
                  >
                    {occasion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
              onClick={() => onTryItem(recommendedItems[0])}
            >
              Try on Olivia
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full border-green-500/30 hover:bg-green-500/10 text-green-300"
              onClick={handleSaveToCollection}
            >
              Save to Collection
            </Button>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" />
                    <AvatarFallback>OB</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-white">Olivia's Pick for You Today</h3>
                    <p className="text-sm text-white/70">Based on your style and the weather</p>
                  </div>
                </div>
              </div>

              <div className="relative aspect-square rounded-lg overflow-hidden mb-4 border border-white/10">
                <img 
                  src={recommendedItems[0]?.imageUrl || '/placeholder.svg'}
                  alt="Recommended outfit"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex flex-wrap gap-1.5">
                    {recommendedItems[0]?.tags?.map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="bg-purple-500/20 border-purple-500/30 text-purple-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
                <h4 className="text-sm font-medium text-white mb-2">Key Pieces</h4>
                <ul className="space-y-2">
                  {recommendedItems.map((item, index) => (
                    <li key={index} className="flex items-center text-white/80">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20">
                <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
                  Why This Works
                </h4>
                <ul className="grid grid-cols-2 gap-2 text-sm text-white/80">
                  <li className="flex items-center">
                    <Check className="h-3 w-3 text-green-400 mr-1.5" />
                    Perfect for {weatherInfo?.temperature}°C
                  </li>
                  <li className="flex items-center">
                    <Check className="h-3 w-3 text-green-400 mr-1.5" />
                    Matches your style
                  </li>
                  <li className="flex items-center">
                    <Check className="h-3 w-3 text-green-400 mr-1.5" />
                    Easy to accessorize
                  </li>
                  <li className="flex items-center">
                    <Check className="h-3 w-3 text-green-400 mr-1.5" />
                    Versatile pieces
                  </li>
                </ul>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 border-white/10 hover:bg-white/10 text-white"
                onClick={handleStyleMore}
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Style More Outfits
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default OliviaDailyRecommendation;
