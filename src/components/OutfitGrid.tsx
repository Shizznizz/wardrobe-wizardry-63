
import { useState } from 'react';
import { Outfit, ClothingItem } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { toast } from 'sonner';
import { OutfitCard } from './outfits/OutfitCard';

interface OutfitGridProps {
  outfits: Outfit[];
  onEdit: (outfit: Outfit) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  clothingItems: ClothingItem[];
  onOutfitAddedToCalendar?: (log: OutfitLog) => void;
  onSelectOutfit?: (outfit: Outfit) => void;
}

const OutfitGrid = ({ 
  outfits, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  clothingItems,
  onOutfitAddedToCalendar,
  onSelectOutfit 
}: OutfitGridProps) => {
  const navigate = useNavigate();
  const safeOutfits = Array.isArray(outfits) ? outfits : [];
  const safeClothingItems = Array.isArray(clothingItems) ? clothingItems : [];
  
  // Helper function to check if an outfit contains valid items from the user's wardrobe
  const outfitHasValidItems = (outfit: Outfit): boolean => {
    if (!outfit || !Array.isArray(outfit.items) || outfit.items.length === 0) {
      return false;
    }
    
    // Check if at least one item from the outfit exists in the user's wardrobe
    return outfit.items.some(itemId => 
      safeClothingItems.some(item => item && item.id === itemId)
    );
  };
  
  // Filter outfits to only include those with valid items
  const validOutfits = safeOutfits.filter(outfitHasValidItems);
  
  const getClothingItemById = (id: string): ClothingItem | undefined => {
    return safeClothingItems.find(item => item && item.id === id);
  };

  const handlePreviewInFittingRoom = (outfit: Outfit) => {
    if (onSelectOutfit && outfit) {
      onSelectOutfit(outfit);
      return;
    }
    
    if (outfit) {
      localStorage.setItem('previewOutfit', JSON.stringify(outfit));
      toast.success('Taking you to the Fitting Room to preview this look...');
      navigate('/fitting-room');
    }
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {validOutfits.length > 0 ? (
        validOutfits.map((outfit) => {
          if (!outfit) return null;
          
          return (
            <OutfitCard
              key={outfit.id || `outfit-${Math.random()}`}
              outfit={outfit}
              clothingItems={safeClothingItems}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              getClothingItemById={getClothingItemById}
              onOutfitAddedToCalendar={onOutfitAddedToCalendar}
              onPreviewInFittingRoom={handlePreviewInFittingRoom}
            />
          );
        })
      ) : (
        <div className="col-span-full p-8 text-center text-white/70">
          <p>No outfits with valid items from your wardrobe found.</p>
          <p className="mt-2 text-sm">Try adding more clothing items to your wardrobe or creating new outfits.</p>
        </div>
      )}
    </div>
  );
};

export default OutfitGrid;
