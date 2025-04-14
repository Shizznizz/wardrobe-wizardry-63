
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Outfit } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface OutfitCarouselProps {
  outfits: Outfit[];
  onPreview: (outfit: Outfit) => void;
  isMobile: boolean;
}

const OutfitCarousel = ({ outfits = [], onPreview, isMobile }: OutfitCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [hoveredOutfit, setHoveredOutfit] = useState<string | null>(null);
  
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
  
  // Early return with empty component if outfits is not an array or is empty
  if (!Array.isArray(outfits) || outfits.length === 0) {
    return <div className="p-4 text-white/70">No outfits available.</div>;
  }
  
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
                  isHovered={hoveredOutfit === outfit.id}
                  onHover={(isHovered) => setHoveredOutfit(isHovered ? outfit.id : null)}
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
                  isHovered={hoveredOutfit === outfit.id}
                  onHover={(isHovered) => setHoveredOutfit(isHovered ? outfit.id : null)}
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
              isHovered={hoveredOutfit === outfit.id}
              onHover={(isHovered) => setHoveredOutfit(isHovered ? outfit.id : null)}
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
  isHovered?: boolean;
  onHover?: (isHovered: boolean) => void;
}

const OutfitCard = ({ 
  outfit, 
  onPreview, 
  isMobile, 
  isGrid = false, 
  isHovered = false,
  onHover
}: OutfitCardProps) => {
  // Safely access properties with default fallbacks
  const { name = "Outfit", occasions = [], seasons = [] } = outfit || {};
  
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => onHover && onHover(true)}
      onHoverEnd={() => onHover && onHover(false)}
      className={cn(
        "flex-shrink-0 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden shadow-md transition-all duration-300",
        isHovered && "border-purple-400/30 shadow-lg shadow-purple-900/20",
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
            {Array.isArray(seasons) && seasons.map(season => (
              <Badge 
                key={season} 
                variant="outline" 
                className="text-xs py-0 px-2 bg-white/5 text-purple-200 border-purple-400/30"
              >
                {season}
              </Badge>
            ))}
            {Array.isArray(occasions) && occasions.map(occasion => (
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
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 w-full group"
            onClick={() => onPreview(outfit)}
          >
            <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Try This Look
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default OutfitCarousel;
