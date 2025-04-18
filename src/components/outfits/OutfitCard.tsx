
import { motion } from 'framer-motion';
import { Outfit, ClothingItem } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import OutfitImageGrid from './OutfitImageGrid';
import OutfitCardActions from './OutfitCardActions';

interface OutfitCardProps {
  outfit: Outfit;
  onEdit: (outfit: Outfit) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  getClothingItemById: (id: string) => ClothingItem | undefined;
  onOutfitAddedToCalendar?: (log: OutfitLog) => void;
  onPreviewInFittingRoom: (outfit: Outfit) => void;
}

const OutfitCard = ({
  outfit,
  onEdit,
  onDelete,
  onToggleFavorite,
  getClothingItemById,
  onOutfitAddedToCalendar,
  onPreviewInFittingRoom
}: OutfitCardProps) => {
  const safeItems = Array.isArray(outfit.items) ? outfit.items : [];
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className={cn(
        "overflow-hidden border-white/10 hover:border-purple-500/30 transition-all", 
        "bg-gradient-to-br from-slate-900/90 to-purple-900/40 backdrop-blur-sm",
        outfit.favorite ? "ring-2 ring-pink-500/40" : ""
      )}>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-800/50">
          {safeItems.length > 0 ? (
            <OutfitImageGrid 
              itemIds={safeItems} 
              getClothingItemById={getClothingItemById} 
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/40 text-sm">No items in this outfit</p>
            </div>
          )}
          
          <button
            onClick={() => onToggleFavorite(outfit.id)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 z-10 
              group-hover:opacity-100 transition-opacity"
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-colors", 
                outfit.favorite ? "fill-pink-500 text-pink-500" : "text-white/70"
              )} 
            />
          </button>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-white">
              {outfit.name}
            </h3>
            {outfit.favorite && (
              <Badge variant="outline" className="bg-pink-500/10 text-pink-300 border-pink-500/30 text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Favorite
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 my-2">
            {Array.isArray(outfit.occasions) && outfit.occasions.map((occasion) => (
              <Badge key={occasion} variant="outline" className="text-xs bg-slate-800 border-slate-700">
                {occasion}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {Array.isArray(outfit.seasons) && outfit.seasons.map((season) => (
              <Badge key={season} className="text-xs bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-none">
                {season}
              </Badge>
            ))}
          </div>
          
          <OutfitCardActions 
            outfit={outfit}
            onEdit={onEdit}
            onDelete={onDelete}
            onOutfitAddedToCalendar={onOutfitAddedToCalendar}
            onPreviewInFittingRoom={onPreviewInFittingRoom}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OutfitCard;
