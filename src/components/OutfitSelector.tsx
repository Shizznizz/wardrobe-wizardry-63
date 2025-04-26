
import { useState } from 'react';
import { ClothingItem, Outfit } from '@/lib/types';
import { cn } from '@/lib/utils';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface OutfitSelectorProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  onSelect: (outfit: Outfit) => void;
  selectedOutfitId?: string;
  autoTryOn?: boolean;
}

const OutfitSelector = ({ 
  outfits, 
  clothingItems, 
  onSelect, 
  selectedOutfitId,
  autoTryOn = true // Default to true for automatic try-on
}: OutfitSelectorProps) => {
  const isMobile = useIsMobile();

  const handleSelect = (outfit: Outfit) => {
    onSelect(outfit);
    
    if (autoTryOn) {
      // Scroll to preview section after a short delay to allow state updates
      setTimeout(() => {
        const previewSection = document.getElementById('preview-section');
        if (previewSection) {
          previewSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <Carousel 
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {outfits.map((outfit) => {
            const isSelected = outfit.id === selectedOutfitId;
            
            return (
              <CarouselItem key={outfit.id} className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3">
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 shadow-lg h-full relative",
                    isSelected 
                      ? "border-blue-400 ring-2 ring-blue-400/30 shadow-blue-500/20" 
                      : "border-white/10 hover:border-white/30 shadow-purple-900/10"
                  )}
                  onClick={() => handleSelect(outfit)}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div 
                      className="absolute -top-2 -right-2 z-10"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Gradient overlay for selected item */}
                  {isSelected && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  
                  <div className="p-4 glass-dark h-full relative z-1">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-white text-base truncate">{outfit.name}</h3>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {outfit.items.slice(0, 3).map(itemId => {
                        const item = clothingItems.find(i => i.id === itemId);
                        return item ? (
                          <motion.div 
                            key={item.id} 
                            className="aspect-square w-full rounded-md overflow-hidden border border-white/10 hover:border-white/30 transition-colors"
                            whileHover={{ scale: 1.05 }}
                          >
                            <AspectRatio ratio={1/1}>
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </AspectRatio>
                          </motion.div>
                        ) : null;
                      })}
                    </div>
                    
                    <div className="flex gap-1 flex-wrap">
                      {outfit.seasons?.map(season => (
                        <span 
                          key={season} 
                          className="text-xs py-0.5 px-2 bg-purple-900/40 rounded-full capitalize"
                        >
                          {season}
                        </span>
                      ))}
                      
                      {outfit.occasions && outfit.occasions.length > 0 && outfit.occasions.map(occasion => (
                        <span 
                          key={occasion} 
                          className="text-xs py-0.5 px-2 bg-blue-900/40 rounded-full capitalize"
                        >
                          {occasion}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="flex items-center justify-end mt-4 gap-2">
          <CarouselPrevious className="relative inset-0 h-8 w-8 translate-y-0 border-white/20 bg-slate-800/80 text-white hover:bg-slate-700/90 hover:border-white/30" />
          <CarouselNext className="relative inset-0 h-8 w-8 translate-y-0 border-white/20 bg-slate-800/80 text-white hover:bg-slate-700/90 hover:border-white/30" />
        </div>
      </Carousel>
    </div>
  );
};

export default OutfitSelector;
