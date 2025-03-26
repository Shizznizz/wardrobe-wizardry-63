
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OutfitGrid from '@/components/OutfitGrid';
import { Outfit, ClothingItem } from '@/lib/types';

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
  return (
    <motion.section variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          My Outfit Collection
        </h2>
        <Button 
          variant="outline" 
          onClick={onCreateOutfit}
          className="border-purple-400/30 text-white hover:bg-white/10 backdrop-blur-sm shadow-md"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Outfit
        </Button>
      </div>
      <OutfitGrid 
        outfits={outfits} 
        onEdit={onEditOutfit}
        onDelete={onDeleteOutfit}
        onToggleFavorite={onToggleFavorite}
        clothingItems={clothingItems}
      />
    </motion.section>
  );
};

export default OutfitCollection;
