
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Sparkles, Shirt, ArrowRight } from 'lucide-react';
import { ClothingItem, TrendingClothingItem } from '@/lib/types';

interface TrendingNowSectionProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onStyleTips: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

const TrendingNowSection = ({
  isPremiumUser,
  onTryItem,
  onStyleTips,
  onUpgradeToPremium
}: TrendingNowSectionProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const trendingItems: TrendingClothingItem[] = [
    {
      id: 'trend-1',
      name: 'Zara Mesh Corset Top',
      type: 'shirt',
      season: ['spring', 'summer'],
      color: 'black',
      material: 'cotton',
      occasions: ['party'],
      imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      brand: 'Zara',
      category: 'Tops',
      image: '/placeholder.svg'
    },
    {
      id: 'trend-2',
      name: 'TikTok Wide-Leg Jeans',
      type: 'pants',
      season: ['all'],
      color: 'blue',
      material: 'denim',
      occasions: ['casual'],
      imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      brand: 'Urban Outfitters',
      category: 'Bottoms',
      image: '/placeholder.svg'
    },
    {
      id: 'trend-3',
      name: 'Revolve Party Bag',
      type: 'accessories',
      season: ['all'],
      color: 'gray',
      material: 'leather',
      occasions: ['party'],
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      brand: 'Revolve',
      category: 'Accessories',
      image: '/placeholder.svg'
    },
    {
      id: 'trend-4',
      name: 'Urban Outfitters Hoodie',
      type: 'hoodie',
      season: ['autumn', 'winter'],
      color: 'gray',
      material: 'cotton',
      occasions: ['casual'],
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      brand: 'Urban Outfitters',
      category: 'Tops',
      image: '/placeholder.svg'
    },
    {
      id: 'trend-5',
      name: 'Shein Sparkle Crop Top',
      type: 'shirt',
      season: ['summer'],
      color: 'yellow',
      material: 'polyester',
      occasions: ['party'],
      imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      brand: 'Shein',
      category: 'Tops',
      image: '/placeholder.svg'
    }
  ];
  
  const scrollContainerRef = (ref: HTMLDivElement | null) => {
    if (ref) {
      setScrollPosition(ref.scrollLeft);
    }
  };
  
  const scrollLeft = () => {
    const container = document.getElementById('trending-scroll-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    const container = document.getElementById('trending-scroll-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Trending Now in Paris, Milan & TikTok
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        
        <div
          id="trending-scroll-container"
          ref={scrollContainerRef}
          className="pb-4 flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pl-12 pr-12"
          style={{ scrollbarWidth: 'thin' }}
        >
          {trendingItems.map((item, index) => (
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
                      <Sparkles className="h-8 w-8 text-purple-400 mb-2" />
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
                  
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                    {item.brand}
                  </div>
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-white truncate">{item.name}</h3>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 flex-1"
                      onClick={() => onTryItem({
                        ...item,
                        season: item.season || ['all'],
                        image: item.image || '/placeholder.svg'
                      } as ClothingItem)}
                      disabled={!isPremiumUser}
                    >
                      <Shirt className="h-3.5 w-3.5 mr-1.5" />
                      Try on Olivia
                    </Button>
                    
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                      onClick={() => onStyleTips({
                        ...item,
                        season: item.season || ['all'],
                        image: item.image || '/placeholder.svg'
                      } as ClothingItem)}
                      disabled={!isPremiumUser}
                    >
                      Style Tips
                    </Button>
                  </div>
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
            onClick={scrollRight}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TrendingNowSection;
