
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Outfit } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import OptimizedImage from '@/components/ui/optimized-image';

interface OutfitSelectionSectionProps {
  outfits: Outfit[];
  selectedOutfit: Outfit | null;
  onSelectOutfit: (outfit: Outfit) => void;
  isMobile: boolean;
}

const OutfitSelectionSection = ({
  outfits,
  selectedOutfit,
  onSelectOutfit,
  isMobile
}: OutfitSelectionSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
    }
  };
  
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    
    if (scrollContainer) {
      checkScrollButtons();
      
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [outfits]);
  
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  if (outfits.length === 0) {
    return (
      <Card className="glass-dark border-white/10 p-6 text-center">
        <p className="text-white/70">No outfits found matching your criteria</p>
      </Card>
    );
  }
  
  return (
    <div className="relative">
      {/* Mobile: Swipeable carousel */}
      {isMobile ? (
        <div className="relative">
          <div 
            className="flex overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory scroll-px-4 gap-4"
            ref={scrollContainerRef}
          >
            {outfits.map((outfit) => (
              <div 
                key={outfit.id} 
                className="snap-start flex-shrink-0 w-[calc(100%-32px)]"
              >
                <OutfitCard
                  outfit={outfit}
                  isSelected={selectedOutfit?.id === outfit.id}
                  onSelect={() => onSelectOutfit(outfit)}
                  isMobile={true}
                />
              </div>
            ))}
          </div>
          
          {/* Pagination dots for mobile */}
          <div className="flex justify-center mt-2 gap-1.5">
            {outfits.map((outfit, index) => (
              <button
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  selectedOutfit?.id === outfit.id 
                    ? 'w-4 bg-white' 
                    : 'w-1.5 bg-white/30'
                }`}
                onClick={() => {
                  onSelectOutfit(outfit);
                  // Scroll to view on mobile
                  if (scrollContainerRef.current) {
                    const element = scrollContainerRef.current.children[index] as HTMLElement;
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                    }
                  }
                }}
                aria-label={`Select outfit ${index + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        // Desktop: Grid view
        <div className="relative">
          {/* Scroll buttons for desktop */}
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 rounded-full bg-black/60 border-white/20 text-white"
              onClick={handleScrollLeft}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 rounded-full bg-black/60 border-white/20 text-white"
              onClick={handleScrollRight}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
          
          <ScrollArea className="w-full pr-2">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              ref={scrollContainerRef}
            >
              {outfits.map((outfit) => (
                <OutfitCard 
                  key={outfit.id}
                  outfit={outfit}
                  isSelected={selectedOutfit?.id === outfit.id}
                  onSelect={() => onSelectOutfit(outfit)}
                  isMobile={false}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

interface OutfitCardProps {
  outfit: Outfit;
  isSelected: boolean;
  onSelect: () => void;
  isMobile: boolean;
}

const OutfitCard = ({ outfit, isSelected, onSelect, isMobile }: OutfitCardProps) => {
  const imageUrl = outfit.imageUrl || '/placeholder.svg';
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-xl overflow-hidden cursor-pointer transition-all",
        isSelected 
          ? "ring-2 ring-purple-500 shadow-lg shadow-purple-500/20" 
          : "ring-1 ring-white/10 hover:ring-white/30"
      )}
      onClick={onSelect}
    >
      <div className="relative">
        <div className="aspect-[3/4] bg-slate-800/60 relative overflow-hidden">
          <OptimizedImage
            src={imageUrl}
            alt={outfit.name}
            className="w-full h-full object-cover"
            aspectRatio="aspect-[3/4]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-wrap justify-end gap-1 max-w-[80%]">
            {outfit.seasons.map((season) => (
              <Badge 
                key={season}
                variant="outline" 
                className="bg-black/40 backdrop-blur-sm text-[10px] h-5 border-blue-500/20 text-blue-200"
              >
                {season}
              </Badge>
            ))}
          </div>
          
          {/* Name and details */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-medium text-white truncate">{outfit.name}</h3>
            
            <div className="flex flex-wrap gap-1 mt-1">
              {outfit.occasions?.map((occasion) => (
                <Badge 
                  key={occasion}
                  variant="outline" 
                  className="bg-black/40 backdrop-blur-sm text-[10px] h-5 border-purple-500/20 text-purple-200"
                >
                  {occasion}
                </Badge>
              ))}
            </div>
            
            <Button 
              className="w-full mt-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              size="sm"
            >
              Try On Now
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OutfitSelectionSection;
