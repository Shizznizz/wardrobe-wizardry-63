
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Heart, Calendar, Share, ExternalLink, ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ClothingItem, Outfit, OutfitLog } from "@/lib/types";

export interface OutfitCardProps {
  outfit: any;
  clothingItems?: any[];
  className?: string;
  compact?: boolean;
  onEdit?: (outfit: Outfit) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  getClothingItemById?: (id: string) => ClothingItem | undefined;
  onOutfitAddedToCalendar?: (log: OutfitLog) => void;
  onPreviewInFittingRoom?: (outfit: Outfit) => void;
}

export function OutfitCard({ 
  outfit, 
  clothingItems, 
  className, 
  compact = false,
  onEdit,
  onDelete,
  onToggleFavorite,
  getClothingItemById,
  onOutfitAddedToCalendar,
  onPreviewInFittingRoom
}: OutfitCardProps) {
  const [isFavorite, setIsFavorite] = useState(outfit.favorite || false);
  const [actionsOpen, setActionsOpen] = useState(false);
  
  // Helper functions
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(outfit.id);
    }
    toast.success(
      !isFavorite ? "Added to favorites!" : "Removed from favorites!"
    );
  };

  const addToCalendar = () => {
    if (onOutfitAddedToCalendar) {
      const log: OutfitLog = {
        id: `log-${Date.now()}`,
        outfitId: outfit.id,
        date: new Date(),
        timeOfDay: 'morning'
      };
      onOutfitAddedToCalendar(log);
    }
    toast.success("Outfit added to calendar!");
  };

  const shareOutfit = () => {
    toast.success("Sharing link copied to clipboard!");
  };

  const handleTryOn = () => {
    if (onPreviewInFittingRoom) {
      onPreviewInFittingRoom(outfit);
    } else {
      toast.success("Opening fitting room with this outfit!");
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(outfit);
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(outfit.id);
    }
  };

  // Returns a suitable image URL from the outfit or a default
  const getOutfitImage = () => {
    if (outfit.imageUrl) {
      return outfit.imageUrl;
    }
    
    if (outfit.items && outfit.items.length > 0 && getClothingItemById) {
      const mainItem = getClothingItemById(outfit.items[0]);
      return mainItem?.imageUrl || "/placeholder.svg";
    }
    
    return "/placeholder.svg";
  };
  
  return (
    <Card className={cn(
      "overflow-hidden border border-white/10",
      "bg-slate-800/20 backdrop-filter backdrop-blur-sm hover:bg-slate-800/30 transition-colors",
      "shadow-md hover:shadow-lg", 
      compact ? "max-w-xs" : "max-w-md w-full",
      className
    )}>
      <div className="relative">
        <img
          src={getOutfitImage()}
          alt={outfit.name || "Outfit"}
          className={cn(
            "w-full object-cover",
            compact ? "h-32" : "h-48"
          )}
        />
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 rounded-full bg-black/30 backdrop-blur-sm",
            "h-8 w-8",
            isFavorite ? "text-red-500" : "text-white/70"
          )}
          onClick={toggleFavorite}
        >
          <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
        </Button>
        
        {outfit.featured && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 border-none">
            Featured
          </Badge>
        )}
        
        {outfit.new && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-indigo-500 border-none">
            New
          </Badge>
        )}
      </div>
      
      <CardContent className={cn("p-3", compact ? "pt-2" : "pt-3")}>
        <div className="flex justify-between items-start mb-1">
          <h3 className={cn(
            "font-medium text-white line-clamp-1",
            compact ? "text-sm" : "text-base"
          )}>
            {outfit.name || "Untitled Outfit"}
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-1.5">
          {outfit.tags?.map((tag: string, i: number) => (
            <Badge
              key={i}
              variant="outline"
              className="bg-slate-700/40 text-xs px-1.5 py-0 h-5 border-white/10"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <Collapsible open={actionsOpen} onOpenChange={setActionsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex justify-center border-t border-white/10 py-1 cursor-pointer hover:bg-white/5 transition-colors">
            {actionsOpen ? (
              <ChevronUp className="h-4 w-4 text-white/60" />
            ) : (
              <ChevronDown className="h-4 w-4 text-white/60" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardFooter className="p-3 pt-1 flex flex-wrap gap-2 justify-between">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-slate-700/40 border-white/10 text-white hover:bg-slate-700/60"
              onClick={addToCalendar}
            >
              <Calendar className="h-3.5 w-3.5 mr-1" /> Calendar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-slate-700/40 border-white/10 text-white hover:bg-slate-700/60"
              onClick={shareOutfit}
            >
              <Share className="h-3.5 w-3.5 mr-1" /> Share
            </Button>
            
            <Button
              variant="gradient"
              size="sm"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-none text-white shadow-sm"
              onClick={handleTryOn}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" /> Try On
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
