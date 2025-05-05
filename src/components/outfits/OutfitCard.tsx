
import React from 'react';
import { Heart, Edit, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Outfit, ClothingItem } from '@/lib/types';
import { OutfitLog } from './OutfitLogItem';
import { toast } from 'sonner';

interface OutfitCardProps {
  outfit: Outfit;
  clothingItems: ClothingItem[];
  onEdit: (outfit: Outfit) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  getClothingItemById: (id: string) => ClothingItem | undefined;
  onOutfitAddedToCalendar?: (log: OutfitLog) => void;
  onPreviewInFittingRoom?: (outfit: Outfit) => void;
}

export const OutfitCard = ({
  outfit,
  clothingItems,
  onEdit,
  onDelete,
  onToggleFavorite,
  getClothingItemById,
  onOutfitAddedToCalendar,
  onPreviewInFittingRoom
}: OutfitCardProps) => {
  if (!outfit) return null;

  // Get the actual clothing items that make up this outfit
  const outfitItems = Array.isArray(outfit.items) 
    ? outfit.items
        .map(itemId => getClothingItemById(itemId))
        .filter(item => item !== undefined) as ClothingItem[]
    : [];

  const maxItems = 4; // Maximum items to show in preview
  const displayItems = outfitItems.slice(0, maxItems);
  const additionalItems = outfitItems.length > maxItems ? outfitItems.length - maxItems : 0;

  const handleAddToCalendar = () => {
    if (onOutfitAddedToCalendar) {
      const log: OutfitLog = {
        id: `log-${Date.now()}`,
        outfitId: outfit.id,
        date: new Date(),
        timeOfDay: 'day',
        user_id: '', // This will be filled in by parent component
        weather_condition: ''
      };
      
      onOutfitAddedToCalendar(log);
      toast.success('Added to calendar');
    }
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-b from-slate-800/80 to-slate-900/90 rounded-xl border border-white/10 shadow-xl">
      <div className="relative">
        {/* Outfit items grid */}
        <div className="grid grid-cols-2 gap-1">
          {displayItems.map((item, index) => (
            <div key={index} className="aspect-square overflow-hidden border border-white/10">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                  {item.name}
                </div>
              )}
            </div>
          ))}
          
          {/* Empty placeholders for fewer than 4 items */}
          {Array.from({ length: Math.max(0, maxItems - displayItems.length) }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square bg-slate-800/50 border border-white/5" />
          ))}

          {/* Show count for additional items */}
          {additionalItems > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded-md">
              +{additionalItems} more
            </div>
          )}
        </div>

        {/* Favorite button (top right) */}
        <button 
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"
          onClick={() => onToggleFavorite(outfit.id)}
        >
          <Heart className={`h-4 w-4 ${outfit.favorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>
      </div>

      <div className="p-3">
        <h3 className="font-medium text-white text-lg mb-1">{outfit.name}</h3>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {Array.isArray(outfit.seasons) && outfit.seasons.map(season => (
            <Badge 
              key={season} 
              variant="outline" 
              className="text-xs bg-white/5 text-white/90 border-white/10"
            >
              {season}
            </Badge>
          ))}
          {Array.isArray(outfit.occasions) && outfit.occasions.map(occasion => (
            <Badge 
              key={occasion} 
              variant="outline" 
              className="text-xs bg-white/5 text-purple-300 border-purple-500/30"
            >
              {occasion}
            </Badge>
          ))}
        </div>

        <div className="flex gap-1 justify-between">
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2 bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white"
              onClick={() => onEdit(outfit)}
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2 bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white"
              onClick={() => onDelete(outfit.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          <div className="flex gap-1">
            {onOutfitAddedToCalendar && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2 bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white"
                onClick={handleAddToCalendar}
              >
                <Calendar className="h-3.5 w-3.5" />
              </Button>
            )}
            
            {onPreviewInFittingRoom && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 hover:from-purple-600 hover:to-indigo-600 border-purple-500/50 text-white"
                onClick={() => onPreviewInFittingRoom(outfit)}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Try On
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
