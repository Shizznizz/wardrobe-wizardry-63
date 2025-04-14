
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outfit } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface OutfitCarouselProps {
  outfits: Outfit[];
  onPreview: (outfit: Outfit) => void;
  isMobile?: boolean;
  title?: string;
}

const OutfitCarousel = ({ 
  outfits = [], 
  onPreview, 
  isMobile: propIsMobile, 
  title = "Your Outfits" 
}: OutfitCarouselProps) => {
  const autoDetectIsMobile = useIsMobile();
  const isMobile = propIsMobile !== undefined ? propIsMobile : autoDetectIsMobile;
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [hoveredOutfit, setHoveredOutfit] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Detect when carousel comes into view
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.1 });
    
    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }
    
    return () => {
      if (scrollRef.current) {
        observer.unobserve(scrollRef.current);
      }
    };
  }, []);
  
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
  
  // Ensure outfits is always an array
  const safeOutfits = Array.isArray(outfits) ? outfits : [];
  
  // Early return with empty component if outfits is an empty array
  if (safeOutfits.length === 0) {
    return (
      <div className="bg-slate-900/30 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-white/70 flex flex-col items-center justify-center text-center">
        <div className="py-6">
          <Sparkles className="h-8 w-8 text-purple-400 mb-3 mx-auto opacity-70" />
          <p className="text-lg text-white/80 mb-1">No outfits available</p>
          <p className="text-sm text-white/50">Create some outfit combinations in Mix & Match first</p>
        </div>
      </div>
    );
  }
  
  // Filter out any undefined or null outfits to prevent errors
  const validOutfits = safeOutfits.filter(outfit => outfit !== undefined && outfit !== null);
  
  if (validOutfits.length === 0) {
    return <div className="p-4 bg-slate-800/50 rounded-lg text-white/70">No valid outfits available.</div>;
  }
  
  return (
    <div className="relative">
      <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">{title}</h2>
      
      {/* Mobile-optimized carousel */}
      {isMobile ? (
        <div className="relative">
          <ScrollArea className="pb-4">
            <div className="flex space-x-4 pb-2">
              {validOutfits.map((outfit, index) => (
                <motion.div
                  key={outfit?.id || `outfit-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <OutfitCard 
                    outfit={outfit}
                    onPreview={onPreview}
                    isMobile={isMobile}
                    isHovered={hoveredOutfit === outfit?.id}
                    onHover={(isHovered) => setHoveredOutfit(isHovered ? outfit?.id || null : null)}
                  />
                </motion.div>
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
                "absolute left-0 z-10 rounded-full bg-black/40 border-white/20 text-white -ml-4",
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
              {validOutfits.map((outfit, index) => (
                <motion.div
                  key={outfit?.id || `outfit-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
                  className="flex-shrink-0"
                >
                  <OutfitCard 
                    outfit={outfit}
                    onPreview={onPreview}
                    isMobile={isMobile}
                    isHovered={hoveredOutfit === outfit?.id}
                    onHover={(isHovered) => setHoveredOutfit(isHovered ? outfit?.id || null : null)}
                  />
                </motion.div>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute right-0 z-10 rounded-full bg-black/40 border-white/20 text-white -mr-4",
                scrollPosition >= maxScroll - 10 && "opacity-0 pointer-events-none"
              )}
              onClick={scrollNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
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
  // Skip rendering if outfit is undefined
  if (!outfit) return null;
  
  // Add robust default values to prevent undefined errors
  const { 
    id = Math.random().toString(), 
    name = "Outfit", 
    occasions = [], 
    seasons = [],
    items = [],
    favorite = false
  } = outfit;
  
  // Ensure seasons and occasions are arrays
  const safeSeasons = Array.isArray(seasons) ? seasons : [];
  const safeOccasions = Array.isArray(occasions) ? occasions : [];
  const safeItems = Array.isArray(items) ? items : [];
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleTryLook = () => {
    setIsLoading(true);
    setTimeout(() => {
      onPreview(outfit);
      setIsLoading(false);
    }, 300);
  };
  
  return (
    <motion.div
      className={`${isGrid ? 'w-full' : 'w-[260px] md:w-[280px]'} h-full`}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => onHover && onHover(true)}
      onHoverEnd={() => onHover && onHover(false)}
    >
      <div className={cn(
        "rounded-lg overflow-hidden border transition-all h-full",
        "bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-purple-900/30 backdrop-blur-sm",
        favorite ? "border-pink-500/30" : "border-white/10 hover:border-white/30",
        isHovered ? "ring-2 ring-purple-500/30" : "",
      )}>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-white text-sm truncate pr-4">{name}</h3>
            {favorite && (
              <Badge variant="outline" className="bg-pink-500/10 text-pink-300 border-pink-500/30 text-[10px] flex items-center p-1">
                <Sparkles className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Favorite</span>
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {safeItems.slice(0, 4).map((itemId, index) => (
              <div 
                key={`${itemId}-${index}`} 
                className="aspect-square w-full rounded-md bg-slate-800/80 border border-white/5 overflow-hidden"
              >
                {/* Placeholder for item preview - in a real app, you'd fetch the item images */}
                <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                  Item {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2 mb-3">
            {safeSeasons.map((season) => (
              <Badge key={season} className="text-[10px] bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-none">
                {season}
              </Badge>
            ))}
            {safeOccasions.map((occasion) => (
              <Badge key={occasion} variant="outline" className="text-[10px] bg-slate-800 border-slate-700">
                {occasion}
              </Badge>
            ))}
          </div>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleTryLook}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-xs h-8"
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full" />
            ) : (
              <>
                <Eye className="h-3 w-3 mr-1.5" />
                Try This Look
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default OutfitCarousel;
