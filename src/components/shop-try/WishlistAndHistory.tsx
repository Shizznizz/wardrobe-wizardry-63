
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Heart, Star, ShoppingBag, Lock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { ClothingItem, ClothingType, ClothingColor, ClothingMaterial, ClothingSeason, ClothingOccasion } from '@/lib/types';

interface WishlistAndHistoryProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

const WishlistAndHistory = ({
  isPremiumUser,
  onTryItem,
  onUpgradeToPremium
}: WishlistAndHistoryProps) => {
  const [activeTab, setActiveTab] = useState('wishlist');
  const isMobile = useIsMobile();
  
  // Sample wishlist items
  const wishlistItems: ClothingItem[] = [
    {
      id: 'wish-1',
      name: 'Denim Jacket',
      type: 'jacket' as ClothingType,
      color: 'blue' as ClothingColor,
      material: 'denim' as ClothingMaterial,
      season: ['spring', 'fall'] as ClothingSeason[],
      occasions: ['casual'] as ClothingOccasion[],
      image: '/placeholder.svg',
      imageUrl: '/placeholder.svg',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date()
    },
    {
      id: 'wish-2',
      name: 'Floral Dress',
      type: 'dress' as ClothingType,
      color: 'multi' as ClothingColor,
      material: 'cotton' as ClothingMaterial,
      season: ['spring', 'summer'] as ClothingSeason[],
      occasions: ['casual', 'party'] as ClothingOccasion[],
      image: '/placeholder.svg',
      imageUrl: '/placeholder.svg',
      favorite: true,
      timesWorn: 0,
      dateAdded: new Date()
    },
    {
      id: 'wish-3',
      name: 'Leather Boots',
      type: 'footwear' as ClothingType,
      color: 'black' as ClothingColor,
      material: 'leather' as ClothingMaterial,
      season: ['fall', 'winter'] as ClothingSeason[],
      occasions: ['casual', 'business'] as ClothingOccasion[],
      image: '/placeholder.svg',
      imageUrl: '/placeholder.svg',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date()
    }
  ];
  
  // Sample history items
  const historyItems: ClothingItem[] = [
    {
      id: 'hist-1',
      name: 'Silk Blouse',
      type: 'shirt' as ClothingType,
      color: 'white' as ClothingColor,
      material: 'silk' as ClothingMaterial,
      season: ['all'] as ClothingSeason[],
      occasions: ['business', 'formal'] as ClothingOccasion[],
      image: '/placeholder.svg',
      imageUrl: '/placeholder.svg',
      favorite: false,
      timesWorn: 3,
      dateAdded: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'hist-2',
      name: 'Cashmere Sweater',
      type: 'sweater' as ClothingType,
      color: 'beige' as ClothingColor,
      material: 'cashmere' as ClothingMaterial,
      season: ['fall', 'winter'] as ClothingSeason[],
      occasions: ['casual', 'business'] as ClothingOccasion[],
      image: '/placeholder.svg',
      imageUrl: '/placeholder.svg',
      favorite: true,
      timesWorn: 5,
      dateAdded: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'hist-3',
      name: 'Linen Pants',
      type: 'pants' as ClothingType,
      color: 'beige' as ClothingColor,
      material: 'linen' as ClothingMaterial,
      season: ['spring', 'summer'] as ClothingSeason[],
      occasions: ['casual'] as ClothingOccasion[],
      image: '/placeholder.svg',
      imageUrl: '/placeholder.svg',
      favorite: false,
      timesWorn: 2,
      dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ];
  
  const renderItem = (item: ClothingItem) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-w-[180px] max-w-[220px] flex-shrink-0"
    >
      <div className="relative rounded-lg overflow-hidden bg-slate-800 border border-white/10 hover:border-purple-500/30 transition-all h-full flex flex-col">
        <div className="relative">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
          />
          
          {item.favorite && (
            <div className="absolute top-2 right-2">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            </div>
          )}
        </div>
        
        <div className="p-3 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-white/90 line-clamp-1">{item.name}</h3>
            
            <div className="flex flex-wrap gap-1 mt-1 mb-2">
              {item.occasions.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-700 rounded-full text-white/60 capitalize">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-auto">
            {activeTab === 'history' && (
              <div className="flex items-center text-xs text-white/60 mb-2">
                <Clock className="h-3 w-3 mr-1" />
                Worn {item.timesWorn} times
              </div>
            )}
            
            <Button 
              size="sm" 
              className="w-full text-xs h-7 bg-gradient-to-r from-purple-600 to-indigo-600"
              onClick={() => isPremiumUser ? onTryItem(item) : onUpgradeToPremium()}
            >
              {!isPremiumUser && <Lock className="h-3 w-3 mr-1" />}
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
  
  const getPremiumMessage = () => {
    switch (activeTab) {
      case 'wishlist':
        return "Save items you love to your wishlist";
      case 'history':
        return "See all items you've tried on before";
      default:
        return "Unlock premium features";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          {activeTab === 'wishlist' ? (
            <Heart className="h-5 w-5 text-pink-400" />
          ) : (
            <Clock className="h-5 w-5 text-blue-400" />
          )}
          <h2 className="text-xl font-semibold text-white">
            {activeTab === 'wishlist' ? 'Your Wishlist' : 'Recently Tried'}
          </h2>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="bg-slate-800/50">
            <TabsTrigger value="wishlist" className="data-[state=active]:bg-pink-900/30">
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-blue-900/30">
              <Clock className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Card className="border-white/10 bg-slate-900/40 overflow-hidden">
        <CardContent className="p-4">
          {isPremiumUser ? (
            <ScrollArea>
              <div className="flex gap-4 pb-4">
                {activeTab === 'wishlist' 
                  ? wishlistItems.map(item => renderItem(item))
                  : historyItems.map(item => renderItem(item))
                }
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <div className="p-6 flex flex-col md:flex-row items-center justify-center gap-6 bg-gradient-to-r from-slate-900/60 to-purple-900/30 rounded-lg">
              <div className="text-center md:text-left">
                <Badge className="bg-purple-500/30 text-purple-300 border-purple-500/30 mb-2">
                  <Star className="h-3 w-3 mr-1 fill-purple-300" /> Premium Feature
                </Badge>
                <h3 className="text-xl font-semibold text-white mb-2">{getPremiumMessage()}</h3>
                <p className="text-white/70 max-w-md">
                  Upgrade to premium to keep track of your favorite styles and get personalized recommendations.
                </p>
              </div>
              
              <Button 
                size={isMobile ? "sm" : "default"}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white min-w-[140px]"
                onClick={onUpgradeToPremium}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button 
          variant="link" 
          className="text-sm text-white/60 hover:text-white"
        >
          View All in Wardrobe 
          <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default WishlistAndHistory;
