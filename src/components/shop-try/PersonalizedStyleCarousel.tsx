import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Info, Shirt } from 'lucide-react';
import { ClothingItem, PersonalizedItem } from '@/lib/types';

interface PersonalizedStyleCarouselProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onStyleTips: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

const PersonalizedStyleCarousel = ({
  isPremiumUser,
  onTryItem,
  onStyleTips,
  onUpgradeToPremium
}: PersonalizedStyleCarouselProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const personalizedItems: PersonalizedItem[] = [
    {
      id: 'personal-1',
      name: 'Satin Midi Dress',
      type: 'dress',
      season: ['spring', 'summer'],
      color: 'pink',
      material: 'silk',
      occasions: ['party'],
      imageUrl: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      brand: 'Reformation',
      category: 'Dresses',
      image: '/placeholder.svg'
    },
    {
      id: 'personal-2',
      name: 'Boyfriend Blazer',
      type: 'jacket',
      season: ['autumn', 'winter', 'spring'],
      color: 'black',
      material: 'cotton',
      occasions: ['business', 'casual'],
      imageUrl: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      brand: 'Arket',
      category: 'Outerwear',
      image: '/placeholder.svg'
    },
    {
      id: 'personal-3',
      name: 'Statement Earrings',
      type: 'accessories',
      season: ['all'],
      color: 'yellow',
      material: 'other',
      occasions: ['party', 'special'],
      imageUrl: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      brand: 'Mejuri',
      category: 'Accessories',
      image: '/placeholder.svg'
    },
    {
      id: 'personal-4',
      name: 'Chunky Knit Sweater',
      type: 'sweater',
      season: ['autumn', 'winter'],
      color: 'white',
      material: 'wool',
      occasions: ['casual'],
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      brand: 'COS',
      category: 'Knitwear',
      image: '/placeholder.svg'
    },
    {
      id: 'personal-5',
      name: 'Platform Boots',
      type: 'boots',
      season: ['autumn', 'winter'],
      color: 'black',
      material: 'leather',
      occasions: ['casual', 'party'],
      imageUrl: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?auto=format&fit=crop&q=80&w=300&h=400',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      brand: 'Dr. Martens',
      category: 'Footwear',
      image: '/placeholder.svg'
    }
  ];
  
  const scrollContainerRef = (ref: HTMLDivElement | null) => {
    if (ref) {
      setScrollPosition(ref.scrollLeft);
    }
  };
  
  const scrollLeft = () => {
    const container = document.getElementById('personalized-scroll-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    const container = document.getElementById('personalized-scroll-container');
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
          Based on Your Vibe...
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
          id="personalized-scroll-container"
          ref={scrollContainerRef}
          className="pb-4 flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pl-12 pr-12"
          style={{ scrollbarWidth: 'thin' }}
        >
          {personalizedItems.map((item, index) => (
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
                      <Info className="h-8 w-8 text-purple-400 mb-2" />
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
                      onClick={() => onTryItem(item)}
                      disabled={!isPremiumUser}
                    >
                      <Shirt className="h-3.5 w-3.5 mr-1.5" />
                      Try on Olivia
                    </Button>
                    
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                      onClick={() => onStyleTips(item)}
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

export default PersonalizedStyleCarousel;
