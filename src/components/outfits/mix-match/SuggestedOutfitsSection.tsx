
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

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/50 backdrop-blur-md p-6">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h3 className="text-xl font-semibold text-white">Suggested For You</h3>
          </div>
          <p className="text-white/70 text-sm">
            Personalized outfit ideas based on your style, preferences, and the current weather
            {weather?.temperature && weather?.condition && ` (${weather.temperature}°C, ${weather.condition})`}.
          </p>
        </div>
      </div>
      
      <OutfitGrid 
        outfits={outfits}
        clothingItems={clothingItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
      />
      
      <div className="mt-8 text-center">
        <p className="text-white/60 text-sm flex items-center justify-center gap-1">
          <Star className="h-4 w-4 text-amber-400" />
          Outfits are suggested based on your style preferences and past favorites
        </p>
      </div>
    </div>
  );
};

export default SuggestedOutfitsSection;
