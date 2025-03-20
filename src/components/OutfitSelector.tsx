
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
        onSelect={(index) => setActiveIndex(index)}
      >
        <CarouselContent>
          {outfits.map((outfit, index) => {
            const isSelected = outfit.id === selectedOutfitId;
            
            return (
              <CarouselItem key={outfit.id} className="md:basis-1/2 lg:basis-1/2">
                <div 
                  className={cn(
                    "border rounded-lg p-4 h-full cursor-pointer transition-all",
                    isSelected 
                      ? "border-primary ring-2 ring-primary ring-opacity-50" 
                      : "hover:border-gray-400"
                  )}
                  onClick={() => handleSelect(outfit)}
                >
                  <h3 className="font-medium mb-2">{outfit.name}</h3>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {outfit.items.slice(0, 3).map(itemId => {
                      const item = clothingItems.find(i => i.id === itemId);
                      return item ? (
                        <div key={item.id} className="aspect-square rounded-md overflow-hidden border">
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
                        className="text-xs py-0.5 px-2 bg-secondary rounded-full capitalize"
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
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default OutfitSelector;
