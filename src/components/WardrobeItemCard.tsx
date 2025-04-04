
import { motion } from 'framer-motion';
import { Star, Tally4, Calendar, Tags, Heart, ArrowRight, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ClothingItem } from '@/lib/types';
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
import { useState } from 'react';

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
  onToggleSelect
}: WardrobeItemCardProps) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDeleteItem) {
      onDeleteItem(item.id);
    }
    setDeleteConfirmOpen(false);
  };

  return (
    <>
      <motion.div
        className={cn(
          "relative group overflow-hidden rounded-xl bg-slate-800/40 border border-white/5 transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 flex flex-col",
          isSelected && "ring-2 ring-purple-500"
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

        <div className="relative aspect-square overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Fixed top-right action buttons */}
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              className="rounded-full w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-black/60"
              onClick={() => onToggleFavorite(item.id)}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-colors duration-300",
                  item.favorite ? "fill-red-500 text-red-500" : "text-white"
                )}
              />
            </button>
          </div>

          {/* Fixed bottom-right delete button */}
          {onDeleteItem && (
            <button
              className="absolute bottom-2 right-2 rounded-full w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-black/60"
              onClick={handleDeleteClick}
            >
              <Trash2 className="w-4 h-4 text-white hover:text-red-400" />
            </button>
          )}
          
          {/* Fixed edit button next to delete */}
          {onEditItem && (
            <button
              className="absolute bottom-2 right-12 rounded-full w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-black/60"
              onClick={(e) => {
                e.stopPropagation();
                onEditItem(item);
              }}
            >
              <Edit className="w-4 h-4 text-white hover:text-blue-400" />
            </button>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
            <h3 className="font-semibold text-sm sm:text-base truncate">{item.name}</h3>
            <div className="flex items-center text-xs text-gray-300 mt-1">
              <span className="capitalize">{item.type}</span>
              <span className="mx-1.5">•</span>
              <span className="capitalize">{item.color}</span>
            </div>
          </div>
        </div>

        {!compactView ? (
          <div className="p-3 space-y-2 flex-grow flex flex-col">
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

            <div className="flex flex-wrap gap-1 pt-2 flex-grow">
              {item.seasons.map((season) => (
                <Badge key={season} variant="outline" className="text-[10px] h-5 px-1.5 border-blue-500/30 text-blue-100">
                  {season}
                </Badge>
              ))}
              
              {item.occasions && item.occasions.map((occasion) => (
                <Badge key={occasion} variant="outline" className="text-[10px] h-5 px-1.5 border-purple-500/30 text-purple-100">
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
        ) : (
          <div className="absolute bottom-0 left-0 right-0 p-2">
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

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {item.name}?</AlertDialogTitle>
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

export default WardrobeItemCard;
