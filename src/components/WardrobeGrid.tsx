
import { motion } from 'framer-motion';
import { Star, Tally4, Calendar, Tags, Heart, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ClothingItem } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WardrobeGridProps {
  items: ClothingItem[];
  onToggleFavorite: (id: string) => void;
  onMatchItem: (item: ClothingItem) => void;
  compactView?: boolean;
  selectable?: boolean;
  selectedItems?: string[];
  onToggleSelect?: (id: string) => void;
}

const WardrobeGrid = ({
  items,
  onToggleFavorite,
  onMatchItem,
  compactView = false,
  selectable = false,
  selectedItems = [],
  onToggleSelect
}: WardrobeGridProps) => {
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400">
        <p>No items found with the current filters.</p>
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "grid gap-3 sm:gap-4",
        compactView
          ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      )}
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => {
        const isSelected = selectedItems.includes(item.id);
        return (
          <motion.div
            key={item.id}
            className={cn(
              "relative group overflow-hidden rounded-xl bg-slate-800/40 border border-white/5 transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10",
              isSelected && "ring-2 ring-purple-500"
            )}
            variants={itemVariants}
            layout
          >
            {selectable && (
              <div className="absolute top-2 left-2 z-20">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleSelect && onToggleSelect(item.id)}
                  className="bg-black/40 backdrop-blur-sm border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
              </div>
            )}

            <div className="relative aspect-square overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                className="absolute top-2 right-2 rounded-full w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-black/60"
                onClick={() => onToggleFavorite(item.id)}
              >
                <Heart
                  className={cn(
                    "w-4 h-4 transition-colors duration-300",
                    item.favorite ? "fill-red-500 text-red-500" : "text-white"
                  )}
                />
              </button>
              
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="font-semibold text-sm sm:text-base truncate">{item.name}</h3>
                <div className="flex items-center text-xs text-gray-300 mt-1">
                  <span className="capitalize">{item.type}</span>
                  <span className="mx-1.5">•</span>
                  <span className="capitalize">{item.color}</span>
                </div>
              </div>
            </div>

            {!compactView && (
              <div className="p-3 space-y-2">
                <div className="flex items-center text-xs text-gray-300 gap-3">
                  <div className="flex items-center">
                    <Tally4 className="w-3 h-3 mr-1 text-purple-400" />
                    <span>{item.timesWorn} wears</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1 text-blue-400" />
                    <span>{formatDistanceToNow(new Date(item.dateAdded), { addSuffix: true })}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-2">
                  {item.seasons.map((season) => (
                    <Badge key={season} variant="outline" className="text-[10px] h-5 px-1.5 border-blue-500/30 text-blue-100">
                      {season}
                    </Badge>
                  ))}
                  
                  {item.occasions.map((occasion) => (
                    <Badge key={occasion} variant="outline" className="text-[10px] h-5 px-1.5 border-purple-500/30 text-purple-100">
                      {occasion}
                    </Badge>
                  ))}
                </div>
                
                <div className="pt-3">
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    onClick={() => onMatchItem(item)}
                  >
                    Match This
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
            
            {compactView && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-transparent">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="w-full text-xs p-1 h-7 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white"
                        onClick={() => onMatchItem(item)}
                      >
                        Match
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white">
                      <p className="text-xs">Create an outfit with this item</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default WardrobeGrid;
