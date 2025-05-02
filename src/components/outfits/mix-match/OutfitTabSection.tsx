
import React from 'react';
import { Heart, Clock, Layers } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Outfit, ClothingItem } from '@/lib/types';
import OutfitGrid from '@/components/OutfitGrid';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface OutfitTabSectionProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  className?: string;
  isDarkSection?: boolean;
}

const OutfitTabSection = ({ 
  outfits, 
  clothingItems,
  className,
  isDarkSection = false
}: OutfitTabSectionProps) => {
  const favorites = outfits.filter(outfit => outfit.favorite);
  const recent = outfits.slice(0, 3); // Most recent outfits (would be based on date in a real app)
  
  // Handle outfit edit
  const handleEdit = (outfit: Outfit) => {
    toast.info(`Editing outfit: ${outfit.name}`);
  };
  
  // Handle outfit delete
  const handleDelete = (id: string) => {
    toast.success("Outfit removed from collection");
  };
  
  // Handle toggling favorite status
  const handleToggleFavorite = (id: string) => {
    toast.success("Favorite status updated");
  };

  return (
    <div className={cn(
      "rounded-xl border border-white/10 overflow-hidden backdrop-blur-md p-6",
      isDarkSection ? "bg-slate-900/50" : "bg-slate-800/30",
      className
    )}>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className={cn(
          "grid grid-cols-3 mb-6", 
          isDarkSection ? "bg-slate-800/70" : "bg-slate-700/50"
        )}>
          <TabsTrigger value="all" className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            All Outfits
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-pink-400" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-blue-400" />
            Recent
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <OutfitGrid 
            outfits={outfits} 
            clothingItems={clothingItems} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
          />
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-0">
          {favorites.length > 0 ? (
            <OutfitGrid 
              outfits={favorites} 
              clothingItems={clothingItems} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
            <div className="py-16 text-center text-white/60">
              <Heart className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-lg">No favorite outfits yet</p>
              <p className="text-sm">Heart your favorite outfits to find them here</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recent" className="mt-0">
          <OutfitGrid 
            outfits={recent} 
            clothingItems={clothingItems} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutfitTabSection;
