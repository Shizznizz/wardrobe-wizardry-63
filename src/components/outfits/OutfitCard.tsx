
import { useState } from 'react';
import { Outfit, ClothingItem } from '@/lib/types';
import { Trash2, Pencil, Heart, Calendar, EyeIcon, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addToCalendarOpen, setAddToCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activityNote, setActivityNote] = useState('');

  // Get the actual clothing items that make up this outfit
  const outfitItems = outfit.items
    ? outfit.items.map(id => getClothingItemById(id)).filter(Boolean) as ClothingItem[]
    : [];

  // Display maximum 4 items in the preview
  const displayItems = outfitItems.slice(0, 4);
  const hasMoreItems = outfitItems.length > 4;
  
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const seasonColors: Record<string, string> = {
    'summer': 'bg-yellow-500',
    'winter': 'bg-blue-500',
    'spring': 'bg-green-500',
    'autumn': 'bg-orange-500',
    'all': 'bg-purple-500',
  };

  const handleAddToCalendar = () => {
    if (!onOutfitAddedToCalendar) return;
    
    const newLog: OutfitLog = {
      id: Date.now().toString(),
      outfitId: outfit.id,
      date: selectedDate,
      notes: activityNote,
      activity: 'casual',
      timeOfDay: 'day',
    };
    
    onOutfitAddedToCalendar(newLog);
    setAddToCalendarOpen(false);
    toast.success(`${outfit.name} added to calendar for ${formatDate(selectedDate)}`);
  };

  const handleEdit = () => {
    onEdit(outfit);
  };

  return (
    <>
      <Card className="overflow-hidden border-slate-700 bg-slate-800 text-slate-50 hover:shadow-md transition-shadow duration-300">
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
            {displayItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-1 h-full">
                {displayItems.map((item, index) => (
                  <div key={item.id} className="relative overflow-hidden bg-slate-800/50">
                    <img
                      src={item.imageUrl || item.image}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
                {hasMoreItems && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    +{outfitItems.length - 4} more
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No items in outfit
              </div>
            )}
          </div>

          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-2 right-2 rounded-full ${
              outfit.favorite ? 'bg-rose-600/30 text-rose-300' : 'bg-black/30 text-white/70'
            } hover:bg-rose-600/50 hover:text-rose-300`}
            onClick={() => onToggleFavorite(outfit.id)}
          >
            <Heart className={`h-4 w-4 ${outfit.favorite ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-medium truncate">{outfit.name}</h3>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {outfit.occasion && (
                <Badge variant="outline" className="text-xs border-slate-600 py-0 px-1.5">
                  {outfit.occasion}
                </Badge>
              )}
              
              {Array.isArray(outfit.season) && outfit.season.map((season) => (
                <Badge 
                  key={season}
                  className={`text-xs py-0 px-1.5 ${seasonColors[season] || 'bg-slate-600'}`}
                >
                  {season}
                </Badge>
              ))}
            </div>
            
            <div className="text-xs text-slate-400 mt-1">
              {outfit.timesWorn > 0 ? (
                <span>Worn {outfit.timesWorn} times</span>
              ) : (
                <span>Never worn</span>
              )}
              {outfit.dateAdded && (
                <span> • Added {formatDate(new Date(outfit.dateAdded))}</span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-3 pt-0 flex justify-between">
          <Button size="sm" variant="outline" className="text-xs border-slate-700" onClick={handleEdit}>
            <Pencil className="h-3 w-3 mr-1" />
            Edit
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="text-xs border-slate-700">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
              {onPreviewInFittingRoom && (
                <DropdownMenuItem 
                  onClick={() => onPreviewInFittingRoom(outfit)}
                  className="text-blue-400 hover:text-blue-300 focus:text-blue-300 cursor-pointer"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Preview in Fitting Room
                </DropdownMenuItem>
              )}
              
              {onOutfitAddedToCalendar && (
                <DropdownMenuItem 
                  onClick={() => setAddToCalendarOpen(true)}
                  className="text-green-400 hover:text-green-300 focus:text-green-300 cursor-pointer"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to Calendar
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem 
                onClick={() => setDeleteDialogOpen(true)}
                className="text-red-400 hover:text-red-300 focus:text-red-300 cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete "{outfit.name}" from your outfits collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent text-white border-slate-600 hover:bg-slate-800">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => onDelete(outfit.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
