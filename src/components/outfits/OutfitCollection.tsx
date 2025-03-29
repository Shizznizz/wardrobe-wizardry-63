
import { motion } from 'framer-motion';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OutfitGrid from '@/components/OutfitGrid';
import { Outfit, ClothingItem } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface OutfitCollectionProps {
  outfits: Outfit[];
  onCreateOutfit: () => void;
  onEditOutfit: (outfit: Outfit) => void;
  onDeleteOutfit: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  clothingItems: ClothingItem[];
}

const OutfitCollection = ({ 
  outfits, 
  onCreateOutfit, 
  onEditOutfit, 
  onDeleteOutfit, 
  onToggleFavorite, 
  clothingItems 
}: OutfitCollectionProps) => {
  const isMobile = useIsMobile();
  
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
        outfits={outfits} 
        onEdit={onEditOutfit}
        onDelete={onDeleteOutfit}
        onToggleFavorite={onToggleFavorite}
        clothingItems={clothingItems}
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
