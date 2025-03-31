
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
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface OutfitSelectorProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  onSelect: (outfit: Outfit) => void;
  selectedOutfitId?: string;
}

const OutfitSelector = ({ outfits, clothingItems, onSelect, selectedOutfitId }: OutfitSelectorProps) => {
  const isMobile = useIsMobile();

  const handleSelect = (outfit: Outfit) => {
    onSelect(outfit);
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {outfits.map((outfit) => {
          const isSelected = outfit.id === selectedOutfitId;
          
          return (
            <motion.div
              key={outfit.id}
              whileHover={{ y: -5 }}
              className={cn(
                "border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 shadow-lg",
                isSelected 
                  ? "border-blue-400 ring-2 ring-blue-400/30 shadow-blue-500/20" 
                  : "border-white/10 hover:border-white/30 shadow-purple-900/10"
              )}
              onClick={() => handleSelect(outfit)}
            >
              <div className="p-4 glass-dark">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-white text-base truncate">{outfit.name}</h3>
                  {isSelected && (
                    <div className="bg-blue-500 text-white p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {outfit.items.slice(0, 3).map(itemId => {
                    const item = clothingItems.find(i => i.id === itemId);
                    return item ? (
                      <div key={item.id} className="aspect-square w-full rounded-md overflow-hidden border border-white/10 hover:border-white/30 transition-colors">
                        <AspectRatio ratio={1/1}>
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>
                      </div>
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
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OutfitSelector;
