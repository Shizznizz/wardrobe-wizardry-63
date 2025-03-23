
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

interface OutfitSelectorProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  onSelect: (outfit: Outfit) => void;
  selectedOutfitId?: string;
}

const OutfitSelector = ({ outfits, clothingItems, onSelect, selectedOutfitId }: OutfitSelectorProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (outfit: Outfit) => {
    onSelect(outfit);
  };

  return (
    <div className="w-full">
      <Carousel
        className="w-full"
      >
        <CarouselContent>
          {outfits.map((outfit, index) => {
            const isSelected = outfit.id === selectedOutfitId;
            
            return (
              <CarouselItem key={outfit.id} className="md:basis-1/2 lg:basis-1/2">
                <div 
                  className={cn(
                    "border rounded-lg p-4 h-full cursor-pointer transition-all glass-dark",
                    isSelected 
                      ? "border-blue-400 ring-2 ring-blue-400/30" 
                      : "border-white/10 hover:border-white/30"
                  )}
                  onClick={() => handleSelect(outfit)}
                >
                  <h3 className="font-medium mb-2 text-white">{outfit.name}</h3>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {outfit.items.slice(0, 3).map(itemId => {
                      const item = clothingItems.find(i => i.id === itemId);
                      return item ? (
                        <div key={item.id} className="aspect-square rounded-md overflow-hidden border border-white/10">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : null;
                    })}
                  </div>
                  
                  <div className="mt-2 flex gap-1">
                    {outfit.seasons.map(season => (
                      <span 
                        key={season} 
                        className="text-xs py-0.5 px-2 bg-purple-900/40 rounded-full capitalize"
                      >
                        {season}
                      </span>
                    ))}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex bg-white/10 border-white/20 text-white hover:bg-white/20" />
        <CarouselNext className="hidden md:flex bg-white/10 border-white/20 text-white hover:bg-white/20" />
      </Carousel>
    </div>
  );
};

export default OutfitSelector;
