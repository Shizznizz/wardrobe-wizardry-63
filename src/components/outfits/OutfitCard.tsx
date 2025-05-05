
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2, Edit, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Outfit, ClothingItem, OutfitLog } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import AddToCalendarButton from './AddToCalendarButton';
import OutfitImageGrid from './OutfitImageGrid';

export interface OutfitCardProps {
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(outfit.id);
    setDeleteConfirmOpen(false);
    toast.success("Outfit deleted successfully");
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(outfit.id);
    toast.success(outfit.favorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(outfit);
  };

  const handleFittingRoomClick = () => {
    if (onPreviewInFittingRoom) {
      onPreviewInFittingRoom(outfit);
    } else {
      toast.info("Previewing in fitting room is not available");
    }
  };

  // Safely access seasons, occasions, and tags
  const seasons = Array.isArray(outfit.season) ? outfit.season : 
    (Array.isArray(outfit.seasons) ? outfit.seasons : []);
  
  const occasions = Array.isArray(outfit.occasions) ? outfit.occasions : 
    (outfit.occasion ? [outfit.occasion] : []);
  
  const tags = Array.isArray(outfit.tags) ? outfit.tags : [];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        className="h-full"
      >
        <Card className="border-white/10 bg-slate-800/50 backdrop-blur-sm h-full relative overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square relative overflow-hidden bg-slate-900 rounded-t-md">
              {/* Outfit image grid */}
              <OutfitImageGrid 
                itemIds={Array.isArray(outfit.items) ? outfit.items : []} 
                getClothingItemById={getClothingItemById}
                clothingItems={clothingItems}
              />
              
              {/* Favorite button */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm z-10"
                onClick={handleToggleFavorite}
              >
                <Heart 
                  className={`h-4 w-4 ${outfit.favorite ? "fill-red-500 text-red-500" : "text-white"}`} 
                />
              </Button>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-white text-lg mb-2">{outfit.name || 'Unnamed Outfit'}</h3>
              
              <div className="flex flex-wrap gap-1.5 mb-3">
                {seasons.slice(0, 2).map((season) => (
                  <Badge key={`season-${season}`} variant="outline" className="bg-blue-500/20 border-blue-500/30">
                    {season}
                  </Badge>
                ))}
                
                {occasions.slice(0, 2).map((occasion) => (
                  <Badge key={`occasion-${occasion}`} variant="outline" className="bg-purple-500/20 border-purple-500/30">
                    {occasion}
                  </Badge>
                ))}
              </div>
              
              <div className="text-xs text-gray-400 mb-4 flex items-center gap-2">
                <span>Added {outfit.dateAdded ? formatDistanceToNow(new Date(outfit.dateAdded), { addSuffix: true }) : 'recently'}</span>
                <span>•</span>
                <span>Worn {outfit.timesWorn || 0} times</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={handleFittingRoomClick}
                >
                  <ArrowRight className="mr-1 h-3.5 w-3.5" />
                  Try On
                </Button>
                
                {onOutfitAddedToCalendar && (
                  <AddToCalendarButton
                    outfit={outfit}
                    onOutfitAdded={onOutfitAddedToCalendar}
                    setIsAddingToCalendar={setIsAddingToCalendar}
                  />
                )}
              </div>
              
              <div className="mt-3 flex justify-between border-t border-white/10 pt-3">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-white/70 hover:text-white hover:bg-transparent"
                  onClick={handleEditClick}
                >
                  <Edit className="mr-1 h-3.5 w-3.5" />
                  Edit
                </Button>
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-white/70 hover:text-red-400 hover:bg-transparent"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {outfit.name || 'this outfit'}?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete this outfit? This action cannot be undone.
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
