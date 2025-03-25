
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClothingItem } from '@/lib/types';
import { sampleClothingItems } from '@/lib/wardrobeData';
import { useIsMobile } from '@/hooks/use-mobile';

const TrendingItems = () => {
  const [trendingItems, setTrendingItems] = useState<ClothingItem[]>(() => {
    // Get 3 random items from the sample data
    const shuffled = [...sampleClothingItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  });
  const isMobile = useIsMobile();
  
  // Don't render on mobile
  if (isMobile) return null;
  
  const shuffleItems = () => {
    const shuffled = [...sampleClothingItems]
      .filter(item => !trendingItems.some(trending => trending.id === item.id))
      .sort(() => 0.5 - Math.random());
    
    setTrendingItems(shuffled.slice(0, 3));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-pink-300" />
          Trending in Your Closet
        </h2>
        
        <Button 
          onClick={shuffleItems} 
          variant="ghost" 
          size="sm" 
          className="text-purple-200 hover:text-white hover:bg-purple-600/30"
        >
          <Shuffle className="h-4 w-4 mr-2" />
          Shuffle
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {trendingItems.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative group"
          >
            <div className="aspect-square rounded-lg overflow-hidden shadow-md border border-white/20 bg-gradient-to-br from-purple-900/50 to-pink-900/50">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/60 bg-gradient-to-br from-purple-800/30 to-pink-800/30">
                  {item.type.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-white">
              {item.type}
            </div>
            
            <div className="absolute top-1 left-1 flex flex-wrap gap-1">
              {item.seasons.slice(0, 2).map((season) => (
                <span 
                  key={season} 
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm",
                    season === 'summer' && "bg-yellow-500/40 text-yellow-100",
                    season === 'winter' && "bg-blue-500/40 text-blue-100",
                    season === 'spring' && "bg-green-500/40 text-green-100",
                    season === 'autumn' && "bg-orange-500/40 text-orange-100"
                  )}
                >
                  {season}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TrendingItems;
