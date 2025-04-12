
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Outfit, ClothingItem } from '@/lib/types';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import OutfitCollectionPreview from '@/components/outfits/OutfitCollectionPreview';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface CollectionsSectionProps {
  personalOutfits: Outfit[];
  popularOutfits: Outfit[];
  sampleOutfits: Outfit[];
  clothingItems: ClothingItem[];
}

const CollectionsSection = ({ 
  personalOutfits, 
  popularOutfits, 
  sampleOutfits,
  clothingItems 
}: CollectionsSectionProps) => {
  const isMobile = useIsMobile();
  
  // Filter to show only 4 outfits for each collection
  const myOutfits = personalOutfits.length ? personalOutfits : sampleOutfits.slice(0, 4);
  const trendingOutfits = popularOutfits.slice(0, 4);

  // Render the carousel view for mobile
  const renderMobileCarousel = (outfits: Outfit[], title: string, description: string) => (
    <div className="mb-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-white/70">{description}</p>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {outfits.map((outfit) => (
            <CarouselItem key={outfit.id} className="pl-4 basis-full sm:basis-1/2">
              <motion.div
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="border-white/10 bg-slate-800/50 backdrop-blur-sm h-full p-3">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900/50 rounded-lg mb-3">
                    {outfit.items && outfit.items.length > 0 ? (
                      <div className="absolute inset-0 grid grid-cols-2 gap-1 p-2">
                        {outfit.items.slice(0, 4).map((itemId, index) => {
                          const item = clothingItems.find(item => item.id === itemId);
                          return (
                            <div 
                              key={index} 
                              className="overflow-hidden rounded-md bg-slate-800"
                            >
                              {item?.imageUrl ? (
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.name} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                                  {item?.name || 'Item'}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-white/40 text-sm">
                        No items
                      </div>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-white mb-2">{outfit.name}</h4>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {outfit.seasons.slice(0, 2).map((season) => (
                      <span 
                        key={season} 
                        className="px-2 py-0.5 bg-purple-500/20 text-purple-200 rounded-full text-xs"
                      >
                        {season}
                      </span>
                    ))}
                    {outfit.occasions.slice(0, 1).map((occasion) => (
                      <span 
                        key={occasion} 
                        className="px-2 py-0.5 bg-blue-500/20 text-blue-200 rounded-full text-xs"
                      >
                        {occasion}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="relative inset-0 h-8 w-8 translate-y-0 border-white/20 bg-slate-800/80" />
          <CarouselNext className="relative inset-0 h-8 w-8 translate-y-0 border-white/20 bg-slate-800/80" />
        </div>
      </Carousel>
    </div>
  );

  return (
    <>
      {isMobile ? (
        // Mobile view with carousels
        <div className="mt-8">
          {renderMobileCarousel(
            myOutfits,
            "My Outfit Collection",
            "Outfits you've created and saved"
          )}
          
          {renderMobileCarousel(
            trendingOutfits,
            "Popular Today",
            "Trending outfits loved by the community"
          )}
        </div>
      ) : (
        // Desktop view with traditional grid layout
        <>
          <section className="mb-8">
            <OutfitCollectionPreview
              title="My Outfit Collection"
              description="Outfits you've created and saved"
              outfits={myOutfits}
              clothingItems={clothingItems}
              viewAllLink="/outfits"
            />
          </section>
          
          <section>
            <OutfitCollectionPreview
              title="Popular Today"
              description="Trending outfits loved by the community"
              outfits={trendingOutfits}
              clothingItems={clothingItems}
            />
          </section>
        </>
      )}
    </>
  );
};

export default CollectionsSection;
