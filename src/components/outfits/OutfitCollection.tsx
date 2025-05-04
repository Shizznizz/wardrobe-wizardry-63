
import { motion } from 'framer-motion';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OutfitGrid from '@/components/OutfitGrid';
import { Outfit, ClothingItem } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';

interface OutfitCollectionProps {
  outfits: Outfit[];
  onCreateOutfit: () => void;
  onEditOutfit: (outfit: Outfit) => void;
  onDeleteOutfit: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  clothingItems: ClothingItem[];
  onOutfitAddedToCalendar?: (log: OutfitLog) => void;
  onSelectOutfit?: (outfit: Outfit) => void;
}

const OutfitCollection = ({ 
  outfits, 
  onCreateOutfit, 
  onEditOutfit, 
  onDeleteOutfit, 
  onToggleFavorite, 
  clothingItems,
  onOutfitAddedToCalendar,
  onSelectOutfit
}: OutfitCollectionProps) => {
  const isMobile = useIsMobile();
  
  // Helper function to check if an outfit has valid items
  const outfitHasValidItems = (outfit: Outfit): boolean => {
    if (!outfit || !Array.isArray(outfit.items) || outfit.items.length === 0) {
      return false;
    }
    
    return outfit.items.some(itemId => 
      clothingItems.some(item => item && item.id === itemId)
    );
  };
  
  // Filter outfits to only include those with valid items
  const validOutfits = Array.isArray(outfits) 
    ? outfits.filter(outfitHasValidItems) 
    : [];
  
  return (
    <motion.section variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          My Outfit Collection
        </h2>
        <div className="flex space-x-3">
          {!isMobile && (
            <Button 
              variant="outline" 
              className="border-purple-400/30 text-white hover:bg-white/10 backdrop-blur-sm shadow-md"
              onClick={() => {}}
            >
              <Filter className="mr-2 h-4 w-4" /> Filter Options
            </Button>
          )}
          <Button 
            size={isMobile ? "default" : "lg"}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 shadow-lg"
            onClick={onCreateOutfit}
          >
            <Plus className="mr-2 h-4 w-4" /> {isMobile ? "New Outfit" : "Create New Outfit"}
          </Button>
        </div>
      </div>
      <OutfitGrid 
        outfits={outfits}  // Pass all outfits to OutfitGrid which will handle the filtering
        onEdit={onEditOutfit}
        onDelete={onDeleteOutfit}
        onToggleFavorite={onToggleFavorite}
        clothingItems={clothingItems}
        onOutfitAddedToCalendar={onOutfitAddedToCalendar}
        onSelectOutfit={onSelectOutfit}
      />
      
      <div className="mt-6 flex justify-center">
        <Button 
          variant="outline" 
          onClick={onCreateOutfit}
          className="border-purple-400/30 text-white hover:bg-white/10 backdrop-blur-sm shadow-md"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Another Outfit
        </Button>
      </div>
    </motion.section>
  );
};

export default OutfitCollection;
