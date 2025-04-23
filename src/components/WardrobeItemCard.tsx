import { motion } from 'framer-motion';
import { Star, Tally4, Calendar, Tags, Heart, ArrowRight, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ClothingItem, ClothingSeason, ClothingOccasion } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, memo } from 'react';
import OptimizedImage from '@/components/ui/optimized-image';
import { toast } from 'sonner';

interface WardrobeItemCardProps {
  item: ClothingItem;
  onToggleFavorite: (id: string) => void;
  onMatchItem: (item: ClothingItem) => void;
  onDeleteItem?: (id: string) => void;
  onEditItem?: (item: ClothingItem) => void;
  compactView?: boolean;
  selectable?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

const WardrobeItemCard = ({
  item,
  onToggleFavorite,
  onMatchItem,
  onDeleteItem,
  onEditItem,
  compactView = false,
  selectable = false,
  isSelected = false,
  onToggleSelect,
  viewMode = 'grid'
}: WardrobeItemCardProps) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDeleteItem) {
      onDeleteItem(item.id);
      toast.success(`${item.name} has been removed from your wardrobe`);
    }
    setDeleteConfirmOpen(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditItem) {
      onEditItem(item);
    }
  };

  const seasons = Array.isArray(item.season) ? item.season : [];
  
  const occasions = Array.isArray(item.occasions) 
    ? item.occasions.filter(occ => typeof occ === 'string') as ClothingOccasion[]
    : ['casual'] as ClothingOccasion[];

  return (
    <>
      <motion.div
        className={cn(
          "relative group overflow-hidden rounded-xl bg-slate-800/40 border border-white/5 transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10",
          isSelected && "ring-2 ring-purple-500",
          viewMode === 'list' && "flex"
        )}
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

        <div className={cn(
          "relative overflow-hidden",
          viewMode === 'grid' ? "aspect-square w-full" : "w-32 h-32 flex-shrink-0"
        )}>
          <OptimizedImage
            src={item.imageUrl || item.image || ''}
            alt={item.name || 'Clothing item'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            showSkeleton={true}
            aspectRatio="aspect-square"
            fallbackSrc="/placeholder.svg"
          />
          
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              className="rounded-full w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-black/60"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(item.id);
              }}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-colors duration-300",
                  item.favorite ? "fill-red-500 text-red-500" : "text-white"
                )}
              />
            </button>
          </div>

          {onDeleteItem && (
            <button
              className="absolute bottom-2 right-2 rounded-full w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-black/60"
              onClick={handleDeleteClick}
              aria-label="Delete item"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4 text-white hover:text-red-400" />
            </button>
          )}
          
          {onEditItem && (
            <button
              className="absolute bottom-2 right-12 rounded-full w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-black/60"
              onClick={handleEditClick}
              aria-label="Edit item"
              title="Edit item"
            >
              <Edit className="w-4 h-4 text-white hover:text-blue-400" />
            </button>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
            <h3 className="font-semibold text-sm sm:text-base truncate">{item.name || 'Untitled Item'}</h3>
            <div className="flex items-center text-xs text-gray-300 mt-1">
              <span className="capitalize">{item.type || 'Unknown'}</span>
              <span className="mx-1.5">•</span>
              <span className="capitalize">{item.color || 'Unknown'}</span>
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-white text-lg mb-2">{item.name || 'Untitled Item'}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-slate-700/50">
                  {item.type}
                </Badge>
                <Badge variant="outline" className="bg-slate-700/50">
                  {item.color}
                </Badge>
                {item.material && (
                  <Badge variant="outline" className="bg-slate-700/50">
                    {item.material}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <Tally4 className="w-4 h-4 text-purple-400" />
                  {item.timesWorn || 0} wears
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  {item.dateAdded ? formatDistanceToNow(new Date(item.dateAdded), { addSuffix: true }) : 'Recently added'}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                onClick={() => onMatchItem(item)}
              >
                Match This
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
              <div className="flex gap-2">
                {onEditItem && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20"
                    onClick={handleEditClick}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {onDeleteItem && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-2 flex-grow flex flex-col">
            <div className="flex items-center text-xs text-gray-300 gap-3">
              <div className="flex items-center">
                <Tally4 className="w-3 h-3 mr-1 text-purple-400" />
                <span>{item.timesWorn || 0} wears</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1 text-blue-400" />
                <span>{item.dateAdded ? formatDistanceToNow(new Date(item.dateAdded), { addSuffix: true }) : 'Recently added'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 pt-2 flex-grow">
              {seasons.length > 0 && seasons.map((season) => (
                <Badge key={`season-${season}`} variant="outline" className="text-[10px] h-5 px-1.5 border-blue-500/30 text-blue-100">
                  {season}
                </Badge>
              ))}
              
              {occasions.length > 0 && occasions.map((occasion) => (
                <Badge key={`occasion-${occasion}`} variant="outline" className="text-[10px] h-5 px-1.5 border-purple-500/30 text-purple-100">
                  {occasion}
                </Badge>
              ))}
            </div>
            
            <div className="pt-3 mt-auto">
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
      </motion.div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {item.name || 'this item'}?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to remove this item from your wardrobe? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default memo(WardrobeItemCard);
