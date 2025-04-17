import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Heart, Clock, ShoppingBag } from 'lucide-react';
import { ClothingItem, ClothingOccasion } from '@/lib/types';

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
  const [wishlistScrollPosition, setWishlistScrollPosition] = useState(0);
  const [historyScrollPosition, setHistoryScrollPosition] = useState(0);
  
  const wishlistItems: ClothingItem[] = [
    {
      id: 'wish-1',
      name: 'Statement Earrings',
      type: 'accessories',
      color: 'yellow',
      material: 'other',
      season: ['all'],
      occasions: ['party', 'special'] as ClothingOccasion[],
      imageUrl: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      image: '/placeholder.svg'
    },
    {
      id: 'wish-2',
      name: 'Satin Midi Dress',
      type: 'dress',
      color: 'pink',
      material: 'silk',
      season: ['spring', 'summer'],
      occasions: ['party'] as ClothingOccasion[],
      imageUrl: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      image: '/placeholder.svg'
    },
    {
      id: 'wish-3',
      name: 'Boyfriend Blazer',
      type: 'jacket',
      color: 'black',
      material: 'cotton',
      season: ['autumn', 'winter', 'spring'],
      occasions: ['business', 'casual'] as ClothingOccasion[],
      imageUrl: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      image: '/placeholder.svg'
    },
    {
      id: 'wish-4',
      name: 'Chunky Knit Sweater',
      type: 'sweater',
      color: 'white',
      material: 'wool',
      season: ['autumn', 'winter'],
      occasions: ['casual'] as ClothingOccasion[],
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      image: '/placeholder.svg'
    },
    {
      id: 'wish-5',
      name: 'Platform Boots',
      type: 'boots',
      color: 'black',
      material: 'leather',
      season: ['autumn', 'winter'],
      occasions: ['casual', 'party'] as ClothingOccasion[],
      imageUrl: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      image: '/placeholder.svg'
    }
  ];
  
  const viewedItems: ClothingItem[] = [
    {
      id: 'viewed-1',
      name: 'Floral Summer Dress',
      type: 'dress',
      color: 'pink',
      material: 'cotton',
      season: ['spring', 'summer'],
      occasions: ['casual', 'party'] as ClothingOccasion[],
      imageUrl: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      image: '/placeholder.svg'
    },
    {
      id: 'viewed-2',
      name: 'Denim Jacket',
      type: 'jacket',
      color: 'blue',
      material: 'denim',
      season: ['spring', 'autumn'],
      occasions: ['casual'] as ClothingOccasion[],
      imageUrl: 'https://images.unsplash.com/photo-1602533457627-eb2c2089574f?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      image: '/placeholder.svg'
    },
    {
      id: 'viewed-3',
      name: 'Leather Ankle Boots',
      type: 'boots',
      color: 'brown',
      material: 'leather',
      season: ['autumn', 'winter'],
      occasions: ['casual'] as ClothingOccasion[],
      imageUrl: 'https://images.unsplash.com/photo-1543168278-ef4bd865e236?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: true,
      timesWorn: 0,
      dateAdded: new Date(),
      image: '/placeholder.svg'
    },
    {
      id: 'viewed-4',
      name: 'Striped T-Shirt',
      type: 'shirt',
      color: 'multicolor',
      material: 'cotton',
      season: ['spring', 'summer'],
      occasions: ['casual'] as ClothingOccasion[],
      imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      image: '/placeholder.svg'
    },
    {
      id: 'viewed-5',
      name: 'High-Waisted Jeans',
      type: 'jeans',
      color: 'blue',
      material: 'denim',
      season: ['all'],
      occasions: ['casual'] as ClothingOccasion[],
      imageUrl: 'https://images.unsplash.com/photo-1595942484754-c9449816939c?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      image: '/placeholder.svg'
    }
  ];
  
  const wishlistScrollContainerRef = (ref: HTMLDivElement | null) => {
    if (ref) {
      setWishlistScrollPosition(ref.scrollLeft);
    }
  };
  
  const historyScrollContainerRef = (ref: HTMLDivElement | null) => {
    if (ref) {
      setHistoryScrollPosition(ref.scrollLeft);
    }
  };
  
  const scrollWishlistLeft = () => {
    const container = document.getElementById('wishlist-scroll-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollWishlistRight = () => {
    const container = document.getElementById('wishlist-scroll-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  const scrollHistoryLeft = () => {
    const container = document.getElementById('history-scroll-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollHistoryRight = () => {
    const container = document.getElementById('history-scroll-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      {/* Wishlist Section */}
      <div className="relative">
        <div className="flex items-center mb-6">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Your Wishlist
          </h2>
          <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
              onClick={scrollWishlistLeft}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <div
            id="wishlist-scroll-container"
            ref={wishlistScrollContainerRef}
            className="pb-4 flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pl-12 pr-12"
            style={{ scrollbarWidth: 'thin' }}
          >
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[250px]"
              >
                <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden h-full">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    
                    {!isPremiumUser && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                        <Heart className="h-8 w-8 text-purple-400 mb-2" />
                        <p className="text-white font-medium text-center mb-2">Premium Feature</p>
                        <Button 
                          size="sm"
                          onClick={onUpgradeToPremium}
                          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                        >
                          Unlock Now
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-medium text-white truncate">{item.name}</h3>
                    
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 w-full"
                      onClick={() => onTryItem(item)}
                      disabled={!isPremiumUser}
                    >
                      <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                      Try on Olivia
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
              onClick={scrollWishlistRight}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Recently Viewed Section */}
      <div className="relative">
        <div className="flex items-center mb-6">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Recently Viewed
          </h2>
          <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
              onClick={scrollHistoryLeft}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <div
            id="history-scroll-container"
            ref={historyScrollContainerRef}
            className="pb-4 flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pl-12 pr-12"
            style={{ scrollbarWidth: 'thin' }}
          >
            {viewedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[250px]"
              >
                <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden h-full">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-medium text-white truncate">{item.name}</h3>
                    
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 w-full"
                      onClick={() => onTryItem(item)}
                      disabled={!isPremiumUser}
                    >
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
              onClick={scrollHistoryRight}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WishlistAndHistory;
