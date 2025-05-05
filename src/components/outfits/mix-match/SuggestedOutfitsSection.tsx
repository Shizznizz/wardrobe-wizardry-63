
import React from 'react';
import { motion } from 'framer-motion';
import { Outfit, ClothingItem } from '@/lib/types';
import { Sparkles, Star } from 'lucide-react';
import OutfitGrid from '@/components/OutfitGrid';
import { toast } from 'sonner';

interface SuggestedOutfitsSectionProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  weather?: {
    temperature?: number;
    condition?: string;
  };
}

const SuggestedOutfitsSection = ({ outfits, clothingItems, weather }: SuggestedOutfitsSectionProps) => {
  // Handle edit (would typically open a modal/dialog)
  const handleEdit = (outfit: Outfit) => {
    toast.info(`Viewing outfit: ${outfit.name}`);
  };

  // Handle delete from suggestions (would typically remove from view)
  const handleDelete = (id: string) => {
    toast.info(`Removed from suggestions`);
  };

  // Handle toggle favorite
  const handleToggleFavorite = (id: string) => {
    toast.success(outfits.find(o => o.id === id)?.favorite 
      ? "Removed from favorites" 
      : "Added to favorites");
  };

  // Filter outfits to only include those with valid items from user's wardrobe
  const filterOutfitsByWardrobe = (outfits: Outfit[], clothingItems: ClothingItem[]): Outfit[] => {
    if (!Array.isArray(outfits) || !Array.isArray(clothingItems)) return [];
    
    return outfits.filter(outfit => {
      if (!outfit || !Array.isArray(outfit.items) || outfit.items.length === 0) return false;
      
      // Check if at least one item from the outfit exists in the user's wardrobe
      return outfit.items.some(itemId => 
        clothingItems.some(item => item && item.id === itemId)
      );
    });
  };
  
  const validOutfits = filterOutfitsByWardrobe(outfits, clothingItems);
  
  if (validOutfits.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/50 backdrop-blur-md p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <h3 className="text-xl font-semibold text-white">Suggested For You</h3>
        </div>
        <p className="text-white/70 mb-6">
          Add more clothing items to your wardrobe to see personalized outfit suggestions.
        </p>
        <p className="text-white/60 text-sm flex items-center justify-center gap-1">
          <Star className="h-4 w-4 text-amber-400" />
          All suggestions will use only your actual wardrobe items
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/50 backdrop-blur-md p-6">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h3 className="text-xl font-semibold text-white">Suggested From Your Wardrobe</h3>
          </div>
          <p className="text-white/70 text-sm">
            Outfit ideas created exclusively from your wardrobe items
            {weather?.temperature && weather?.condition && ` (${weather.temperature}°C, ${weather.condition})`}.
          </p>
        </div>
      </div>
      
      <OutfitGrid 
        outfits={validOutfits}
        clothingItems={clothingItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
      />
      
      <div className="mt-8 text-center">
        <p className="text-white/60 text-sm flex items-center justify-center gap-1">
          <Star className="h-4 w-4 text-amber-400" />
          All outfits are created using only items from your wardrobe
        </p>
      </div>
    </div>
  );
};

export default SuggestedOutfitsSection;
