
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Outfit, ClothingItem } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Edit, Trash2, Sparkles, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import AddToCalendarButton from '@/components/outfits/AddToCalendarButton';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface OutfitGridProps {
  outfits: Outfit[];
  onEdit: (outfit: Outfit) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  clothingItems: ClothingItem[];
  onOutfitAddedToCalendar?: (log: OutfitLog) => void;
}

const OutfitGrid = ({ 
  outfits, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  clothingItems,
  onOutfitAddedToCalendar 
}: OutfitGridProps) => {
  const [expandedOutfit, setExpandedOutfit] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Helper function to get clothing item by ID
  const getClothingItemById = (id: string): ClothingItem | undefined => {
    return clothingItems.find(item => item.id === id);
  };
  
  const handleOutfitAddedToCalendar = (log: OutfitLog) => {
    if (onOutfitAddedToCalendar) {
      onOutfitAddedToCalendar(log);
    }
  };

  const handlePreviewInFittingRoom = (outfit: Outfit) => {
    // Save the selected outfit to localStorage for retrieval in the Fitting Room
    localStorage.setItem('previewOutfit', JSON.stringify(outfit));
    toast.success('Taking you to the Fitting Room to preview this look...');
    navigate('/fitting-room');
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {outfits.map((outfit) => (
        <motion.div
          key={outfit.id}
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
              {outfit.items && outfit.items.length > 0 ? (
                <div className="absolute inset-0 flex flex-wrap justify-center items-center p-2 gap-1">
                  {outfit.items.slice(0, 4).map((itemId, index) => {
                    const item = getClothingItemById(itemId);
                    return (
                      <div 
                        key={index} 
                        className="w-1/2 h-1/2 p-1.5 overflow-hidden"
                      >
                        <div className="bg-slate-800 rounded-md h-full w-full overflow-hidden flex items-center justify-center">
                          {item?.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="h-full w-full object-cover rounded-md"
                            />
                          ) : (
                            <div className="text-gray-400 text-xs">{item?.name || 'Unknown Item'}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                {outfit.occasions.map((occasion) => (
                  <Badge key={occasion} variant="outline" className="text-xs bg-slate-800 border-slate-700">
                    {occasion}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {outfit.seasons.map((season) => (
                  <Badge key={season} className="text-xs bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-none">
                    {season}
                  </Badge>
                ))}
              </div>
              
              <div className="space-y-2">
                {/* Preview in Fitting Room Button */}
                <Button 
                  variant="default"
                  size="sm"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-xs h-8"
                  onClick={() => handlePreviewInFittingRoom(outfit)}
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Preview in Fitting Room
                </Button>
                
                {/* Add to Calendar Button */}
                <AddToCalendarButton 
                  outfit={outfit} 
                  fullWidth={true}
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-500/10 w-full text-xs h-8"
                  onSuccess={handleOutfitAddedToCalendar}
                />
              </div>
            </CardContent>
            
            <CardFooter className="px-4 py-3 border-t border-white/5 bg-slate-900/50 flex justify-between">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs border-white/10 hover:text-blue-300 hover:border-blue-500/30 hover:bg-blue-950/20"
                onClick={() => onEdit(outfit)}
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs border-white/10 hover:text-red-300 hover:border-red-500/30 hover:bg-red-950/20"
                onClick={() => onDelete(outfit.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Remove
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default OutfitGrid;
