
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Outfit } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Eye, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface OutfitCarouselProps {
  outfits: Outfit[];
  onPreview: (outfit: Outfit) => void;
  isMobile: boolean;
}

const OutfitCarousel = ({ outfits, onPreview, isMobile }: OutfitCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setScrollPosition(scrollLeft);
      setMaxScroll(scrollWidth - clientWidth);
    }
  };
  
  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="relative">
      {/* Mobile-optimized carousel */}
      {isMobile ? (
        <div className="relative">
          <ScrollArea className="pb-4">
            <div className="flex space-x-4 pb-2">
              {outfits.map((outfit) => (
                <OutfitCard 
                  key={outfit.id} 
                  outfit={outfit}
                  onPreview={onPreview}
                  isMobile={isMobile}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ) : (
        // Desktop version with navigation arrows
        <div className="relative">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute left-0 z-10 rounded-full bg-black/40 border-white/20 text-white -ml-2",
                scrollPosition <= 10 && "opacity-0 pointer-events-none"
              )}
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div 
              ref={scrollRef}
              className="flex space-x-5 overflow-x-auto scrollbar-none py-2 pb-4 pl-2 pr-2 scroll-smooth"
              onScroll={handleScroll}
            >
              {outfits.map((outfit) => (
                <OutfitCard 
                  key={outfit.id} 
                  outfit={outfit}
                  onPreview={onPreview}
                  isMobile={isMobile}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute right-0 z-10 rounded-full bg-black/40 border-white/20 text-white -mr-2",
                scrollPosition >= maxScroll - 10 && "opacity-0 pointer-events-none"
              )}
              onClick={scrollNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Alternative grid view for desktop */}
      {!isMobile && outfits.length > 3 && (
        <div className="mt-10 grid grid-cols-3 gap-5">
          {outfits.map((outfit) => (
            <OutfitCard 
              key={outfit.id} 
              outfit={outfit}
              onPreview={onPreview}
              isMobile={isMobile}
              isGrid={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface OutfitCardProps {
  outfit: Outfit;
  onPreview: (outfit: Outfit) => void;
  isMobile: boolean;
  isGrid?: boolean;
}

const OutfitCard = ({ outfit, onPreview, isMobile, isGrid = false }: OutfitCardProps) => {
  const { name, occasions, seasons } = outfit;
  
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex-shrink-0 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden shadow-md",
        isMobile ? "w-72" : isGrid ? "w-full" : "w-80"
      )}
    >
      <div className="p-3">
        <div className="flex flex-col h-full">
          <div className="flex space-x-2 mb-3">
            {/* This is a placeholder for outfit preview - in a real app you would show actual outfit images */}
            <div className="w-20 h-24 bg-slate-800 rounded overflow-hidden">
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-xs text-white/50">Top</span>
              </div>
            </div>
            <div className="w-20 h-24 bg-slate-800 rounded overflow-hidden">
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-xs text-white/50">Bottom</span>
              </div>
            </div>
          </div>
          
          <h3 className="font-medium text-lg mb-2">{name}</h3>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {seasons.map(season => (
              <Badge 
                key={season} 
                variant="outline" 
                className="text-xs py-0 px-2 bg-white/5 text-purple-200 border-purple-400/30"
              >
                {season}
              </Badge>
            ))}
            {occasions && occasions.map(occasion => (
              <Badge 
                key={occasion} 
                variant="outline" 
                className="text-xs py-0 px-2 bg-white/5 text-blue-200 border-blue-400/30"
              >
                {occasion}
              </Badge>
            ))}
          </div>
          
          <Button 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 w-full"
            onClick={() => onPreview(outfit)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview in Fitting Room
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default OutfitCarousel;
