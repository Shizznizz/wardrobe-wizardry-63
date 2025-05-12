
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shirt, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Outfit } from '@/lib/types';

interface OutfitCarouselProps {
  outfits: Outfit[];
  onPreview: (outfit: Outfit) => void;
  title: string;
  disabled?: boolean;
}

const OutfitCarousel: React.FC<OutfitCarouselProps> = ({ 
  outfits, 
  onPreview,
  title,
  disabled = false
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const visibleCount = window.innerWidth < 640 ? 1 :
                       window.innerWidth < 768 ? 2 :
                       window.innerWidth < 1024 ? 3 : 4;
  
  const maxIndex = Math.max(0, outfits.length - visibleCount);
  
  const next = () => {
    if (isTransitioning || activeIndex >= maxIndex) return;
    setIsTransitioning(true);
    setActiveIndex(prev => Math.min(prev + 1, maxIndex));
    setTimeout(() => setIsTransitioning(false), 300);
  };
  
  const prev = () => {
    if (isTransitioning || activeIndex <= 0) return;
    setIsTransitioning(true);
    setActiveIndex(prev => Math.max(prev - 1, 0));
    setTimeout(() => setIsTransitioning(false), 300);
  };
  
  return (
    <div className="relative">
      {title && (
        <h3 className="text-lg font-medium mb-4 text-white/90">{title}</h3>
      )}
      
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{ 
              transform: `translateX(-${activeIndex * (100 / visibleCount)}%)`,
              width: `${outfits.length * (100 / visibleCount)}%`
            }}
          >
            {outfits.map((outfit) => (
              <div 
                key={outfit.id} 
                className="px-2" 
                style={{ width: `${100 / outfits.length * visibleCount}%` }}
              >
                <OutfitCard 
                  outfit={outfit} 
                  onPreview={onPreview}
                  disabled={disabled}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation arrows */}
        {activeIndex > 0 && (
          <motion.button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white z-10 -ml-3 hover:bg-black/70 transition-colors"
            onClick={prev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>
        )}
        
        {activeIndex < maxIndex && (
          <motion.button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white z-10 -mr-3 hover:bg-black/70 transition-colors"
            onClick={next}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

interface OutfitCardProps {
  outfit: Outfit;
  onPreview: (outfit: Outfit) => void;
  disabled: boolean;
}

const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onPreview, disabled }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:border-purple-400/30 transition-colors"
    >
      <div className="aspect-square relative bg-slate-800/80">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
          <h3 className="text-lg font-medium text-white">{outfit.name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {outfit.occasions?.slice(0, 1).map(occasion => (
              <Badge key={occasion} className="bg-slate-700/70 text-white border-none capitalize">
                {occasion}
              </Badge>
            ))}
            {outfit.seasons?.slice(0, 1).map(season => (
              <Badge key={season} className="bg-blue-700/70 text-white border-none capitalize">
                {season}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full grid grid-cols-2 gap-1 p-2">
          {Array.isArray(outfit.items) && outfit.items.slice(0, 4).map((itemId, index) => (
            <div 
              key={`${itemId}-${index}`}
              className="w-full h-full"
            >
              <div className="aspect-square w-full h-full rounded-md bg-slate-700/50 border border-white/5 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <Shirt className="h-6 w-6 opacity-40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => onPreview(outfit)}
          disabled={disabled}
        >
          <Check className="mr-2 h-4 w-4" /> Try This Look
        </Button>
      </div>
    </motion.div>
  );
};

export default OutfitCarousel;
