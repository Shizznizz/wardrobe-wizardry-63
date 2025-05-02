
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
      {safeOutfits.map((outfit) => {
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
      })}
    </div>
  );
};

export default OutfitGrid;
