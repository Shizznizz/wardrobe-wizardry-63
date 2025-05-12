
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Outfit, ClothingItem } from '@/lib/types';
import { cn } from '@/lib/utils';

interface OutfitCardProps {
  outfit: Outfit;
  onPreview: (outfit: Outfit) => void;
  clothingItems?: ClothingItem[];
  className?: string;
  disabled?: boolean;
  isHighlighted?: boolean;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onLike?: () => void;
  isTrending?: boolean;
}

const OutfitCard = ({
  outfit,
  onPreview,
  clothingItems = [],
  className,
  disabled = false,
  isHighlighted = false,
  actionLabel = "Try This Look",
  actionIcon = <Eye className="h-3.5 w-3.5 mr-1.5" />,
  onLike,
  isTrending = false
}: OutfitCardProps) => {
  
  // Extract items for this outfit if clothingItems array is provided
  const outfitItems = outfit && outfit.items && Array.isArray(outfit.items)
    ? outfit.items
        .map(itemId => clothingItems.find(item => item && item.id === itemId))
        .filter(item => item !== undefined)
    : [];
  
  const handlePreview = () => {
    if (!disabled) {
      onPreview(outfit);
    }
  };
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-slate-900/70 border rounded-lg overflow-hidden shadow-md min-h-[420px] flex flex-col",
        isHighlighted 
          ? "border-purple-500/50 shadow-lg shadow-purple-500/10" 
          : "border-white/10",
        className
      )}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="font-medium text-white mb-1">{outfit.name}</h3>
        <p className="text-white/70 text-sm line-clamp-2">
          {outfit.notes || 'A stylish combination for any occasion.'}
        </p>
      </div>
      
      {/* Outfit Items Grid */}
      <div className="p-4 flex-grow">
        <div className={cn(
          "grid gap-2",
          outfitItems.length > 0 
            ? "grid-cols-2" 
            : "grid-cols-1 place-items-center"
        )}>
          {outfitItems.length > 0 ? (
            outfitItems.map((item, index) => (
              <div 
                key={index}
                className="aspect-square bg-slate-800/50 rounded-md overflow-hidden border border-white/5"
              >
                <img
                  src={item?.imageUrl || '/placeholder.svg'}
                  alt={item?.name || `Item ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-sm text-white/50">
              {disabled ? 'Select a model to preview this outfit' : 'Outfit details will appear here'}
            </div>
          )}
        </div>
        
        {/* Seasons & Tags */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-1.5">
            {outfit.seasons?.map(season => (
              <Badge 
                key={season}
                variant="outline"
                className="text-xs bg-slate-800/80 border-white/10 text-white/80"
              >
                {season}
              </Badge>
            ))}
            
            {outfit.occasions?.slice(0, 2).map(occasion => (
              <Badge
                key={occasion}
                className="bg-purple-600/20 text-purple-300 border-purple-500/30 text-xs"
              >
                {occasion}
              </Badge>
            ))}
            
            {isTrending && (
              <Badge
                className="bg-orange-600/20 text-orange-300 border-orange-500/30 text-xs"
              >
                Trending
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Card Footer with Actions */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex gap-2">
          <Button
            onClick={handlePreview}
            disabled={disabled}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white text-xs h-10"
          >
            {actionIcon}
            {actionLabel}
          </Button>
          
          {onLike && (
            <Button
              onClick={onLike}
              variant="outline"
              size="icon"
              className="border-white/10 hover:bg-white/10"
            >
              <Heart className="h-4 w-4 text-pink-400" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OutfitCard;
