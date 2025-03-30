
import { useState } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { outfitItems } from './outfits/outfitData';
import { OutfitCard } from './outfits/OutfitCard';
import { OutfitDialog } from './outfits/OutfitDialog';
import { OutfitTooltip } from './outfits/OutfitTooltip';

const OutfitSlider = () => {
  const [selectedOutfitId, setSelectedOutfitId] = useState<number | null>(null);
  
  const selectedOutfit = outfitItems.find(outfit => outfit.id === selectedOutfitId);
  
  return (
    <div>
      <OutfitTooltip />
      
      <Carousel 
        className="w-full" 
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-4">
          {outfitItems.map((outfit) => (
            <CarouselItem key={outfit.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <Dialog>
                <DialogTrigger asChild>
                  <div onClick={() => setSelectedOutfitId(outfit.id)}>
                    <OutfitCard outfit={outfit} onClick={() => {}} />
                  </div>
                </DialogTrigger>
                {selectedOutfit && outfit.id === selectedOutfit.id && (
                  <OutfitDialog outfit={selectedOutfit} />
                )}
              </Dialog>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex bg-white/10 border-white/20 text-white hover:bg-white/20 left-0" />
        <CarouselNext className="hidden md:flex bg-white/10 border-white/20 text-white hover:bg-white/20 right-0" />
      </Carousel>
    </div>
  );
};

export default OutfitSlider;
