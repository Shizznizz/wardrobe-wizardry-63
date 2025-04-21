
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Outfit, ClothingItem } from '@/lib/types';
import { Heart, Clock } from 'lucide-react';
import OutfitGrid from '@/components/OutfitGrid';
import OutfitCarousel from '@/components/fitting-room/OutfitCarousel';
import OutfitFilters from '@/components/fitting-room/OutfitFilters';
import { toast } from 'sonner';

// Add simple filters for mobile
const mobileTabs = [
  { value: 'all', label: 'All Outfits' },
  { value: 'favorites', label: <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> Favorites</span> },
  { value: 'recent', label: <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Recent</span> }
];

interface OutfitCollectionSectionProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
}

const OutfitCollectionSection = ({ outfits, clothingItems }: OutfitCollectionSectionProps) => {
  const [activeTab, setActiveTab] = useState('all');
  const [localOutfits, setLocalOutfits] = useState<Outfit[]>(outfits);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const isMobile = useIsMobile();

  // Filter outfits based on the selected tab
  const filteredOutfits = localOutfits.filter(outfit => {
    if (activeTab === 'favorites') return outfit.favorite;
    if (activeTab === 'recent') return true; // Placeholder: Would filter by date in a real app
    return true; // 'all' tab
  });

  // OutfitFilters (reuse from fitting room, minimal config for Mix & Match)
  const handleSeasonChange = () => {};
  const handleOccasionChange = () => {};
  const handleFavoritesToggle = () => setShowFavoritesOnly(v => !v);

  // Handle outfit edit
  const handleEdit = (outfit: Outfit) => {
    toast.info(`Editing outfit: ${outfit.name}`);
  };
  // Handle outfit delete
  const handleDelete = (id: string) => {
    setLocalOutfits(prev => prev.filter(outfit => outfit.id !== id));
    toast.success("Outfit removed from collection");
  };
  // Handle toggling favorite status
  const handleToggleFavorite = (id: string) => {
    setLocalOutfits(prev => 
      prev.map(outfit => 
        outfit.id === id ? { ...outfit, favorite: !outfit.favorite } : outfit
      )
    );
    toast.success("Favorite status updated");
  };

  // --- MOBILE VERSION: Carousel with filters ---
  if (isMobile) {
    return (
      <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/50 backdrop-blur-md p-3 w-full">
        <div className="flex flex-col mb-4 gap-3">
          <h3 className="text-xl font-semibold text-white mb-2">My Outfit Collection</h3>
          <div className="flex rounded-lg bg-slate-800/70 divide-x divide-white/10 border border-white/10 w-full overflow-hidden">
            {mobileTabs.map(tab => (
              <button
                key={tab.value}
                className={`flex-1 py-2 px-2 text-sm focus:outline-none 
                  ${activeTab === tab.value 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
                    : "bg-transparent text-white/70 hover:bg-white/5"}`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* Carousel for outfit cards */}
        <Carousel 
          opts={{ loop: false, align: "start" }}
          className="w-full"
        >
          <CarouselContent className="px-1">
            {filteredOutfits.length > 0 ? filteredOutfits.map((outfit) => (
              <CarouselItem key={outfit.id} className="basis-full">
                <motion.div
                  whileHover={{ scale: 1.018, y: -2 }}
                  className="h-full"
                >
                  <div className="rounded-xl overflow-hidden border border-purple-500/40 bg-gradient-to-br from-white/10 to-purple-900/20 shadow-lg p-2">
                    {/* Use OutfitGrid for one outfit or lay out here for custom? Just render as a card for now */}
                    <OutfitGrid 
                      outfits={[outfit]}
                      clothingItems={clothingItems}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </div>
                </motion.div>
              </CarouselItem>
            )) : (
              <div className="py-12 flex justify-center items-center w-full text-white/70 text-lg">
                No outfits found.
              </div>
            )}
          </CarouselContent>
          <div className="flex justify-center mt-3 gap-3">
            <CarouselPrevious className="h-9 w-9 border-white/20 bg-slate-800/80" />
            <CarouselNext className="h-9 w-9 border-white/20 bg-slate-800/80" />
          </div>
        </Carousel>
      </div>
    );
  }

  // --- DESKTOP / TABLET VERSION: Tabs + grid as before ---
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/50 backdrop-blur-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">My Outfit Collection</h3>
      </div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6 bg-slate-800/70">
          <TabsTrigger value="all">All Outfits</TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Recent
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <OutfitGrid 
            outfits={filteredOutfits} 
            clothingItems={clothingItems} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
          />
        </TabsContent>
        <TabsContent value="favorites">
          <OutfitGrid 
            outfits={filteredOutfits} 
            clothingItems={clothingItems} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
          />
        </TabsContent>
        <TabsContent value="recent">
          <OutfitGrid 
            outfits={filteredOutfits} 
            clothingItems={clothingItems} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutfitCollectionSection;
