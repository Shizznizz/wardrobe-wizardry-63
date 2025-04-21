
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ShoppingBag, CloudSun, Wind, Droplet, Sparkles } from 'lucide-react';
import { WeatherInfo, ClothingItem } from '@/lib/types';
import { toast } from 'sonner';

interface StyleAlchemySectionProps {
  weather: WeatherInfo | null;
  onTryItem: (item: ClothingItem) => void;
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
  customLocation?: { city: string; country: string } | null;
}

const StyleAlchemySection = ({
  weather,
  onTryItem,
  isPremiumUser,
  onUpgradeToPremium,
  customLocation
}: StyleAlchemySectionProps) => {
  const [recommendedItem, setRecommendedItem] = useState<ClothingItem>({
    id: 'recommended-1',
    name: 'Blush Pink Silk Blouse',
    type: 'top',
    color: 'pink',
    season: ['spring', 'summer'],
    image: '',
    imageUrl: 'https://images.unsplash.com/photo-1551799517-eb8f03cb5e6a?auto=format&fit=crop&w=500&h=500',
    price: 79.99,
    tags: ['Versatile', 'Office-ready', 'Date night']
  });

  const handleShopNow = () => {
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    onTryItem(recommendedItem);
    toast.success("Let's try this on!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-coral-400">
          Style Alchemy: Olivia's Must-Have Combos for You
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden mb-4">
            <CardContent className="p-4">
              <h3 className="font-medium text-white mb-3 flex items-center">
                <CloudSun className="h-5 w-5 text-blue-400 mr-2" />
                Current Weather Mood
              </h3>
              {weather && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold text-white">
                      {weather.temperature}°C
                    </div>
                    <Badge variant="outline" className="bg-white/10 border-white/20">
                      {weather.condition}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-white/70">
                    <div className="flex items-center">
                      <Wind className="h-4 w-4 mr-1.5 text-blue-400" />
                      Wind: {weather.windSpeed || "Light"} km/h
                    </div>
                    <div className="flex items-center">
                      <Droplet className="h-4 w-4 mr-1.5 text-blue-400" />
                      Humidity: {weather.humidity || "60"}%
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm overflow-hidden mb-4">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" />
                  <AvatarFallback>OB</AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-white">Olivia's Style Note</h3>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                "I noticed those gorgeous blue jeans in your wardrobe! 💙 For today's {weather?.condition?.toLowerCase()} weather at {weather?.temperature}°C, I've found the perfect top to create an absolutely stunning combo. This blush pink silk blouse will add a touch of elegance while keeping you perfectly comfortable!"
              </p>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
            onClick={handleShopNow}
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Shop & Try On Now
          </Button>
        </div>

        <div className="lg:col-span-3">
          <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
                  <h3 className="font-medium text-white">Perfect Match for Your Style</h3>
                </div>
              </div>

              <div className="relative aspect-square rounded-lg overflow-hidden mb-4 border border-white/10">
                <img 
                  src={recommendedItem.imageUrl}
                  alt={recommendedItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex flex-wrap gap-1.5">
                    {recommendedItem.tags?.map((tag, index) => (
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

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-lg font-medium text-white mb-2">{recommendedItem.name}</h4>
                <p className="text-white/80 text-sm mb-3">
                  A luxurious and versatile addition to your wardrobe. Perfect for both office hours and evening occasions.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">${recommendedItem.price}</span>
                  <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-200">
                    Perfect for today's weather
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default StyleAlchemySection;
