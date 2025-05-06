import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2, RefreshCcw } from 'lucide-react';
import { ClothingItem, Outfit } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import OutfitFeedbackSection from './OutfitFeedbackSection';
import OutfitItemReplacement from './OutfitItemReplacement';

interface OutfitTabSectionProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  isRefreshing?: boolean;
  onRefresh: () => void;
  onReplaceItem?: (outfitId: string, oldItemId: string, newItemId: string) => void;
}

const OutfitTabSection = ({ outfits, clothingItems, isRefreshing = false, onRefresh, onReplaceItem }: OutfitTabSectionProps) => {
  const [activeTab, setActiveTab] = useState('my-outfits');
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(
    outfits.length > 0 ? outfits[0].id : null
  );
  const [outfitThumbnails, setOutfitThumbnails] = useState<Record<string, string>>({});

  // Filter outfits that have valid items from user's wardrobe
  const validOutfits = outfits.filter(outfit => {
    if (!outfit || !Array.isArray(outfit.items) || outfit.items.length === 0) {
      return false;
    }
    
    // Check if at least one item in the outfit exists in the user's clothing items
    return outfit.items.some(itemId => 
      clothingItems.some(item => item && item.id === itemId)
    );
  });

  const myOutfits = validOutfits.filter(outfit => outfit.favorite);
  const recentOutfits = [...validOutfits].sort((a, b) => {
    const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
    const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 6);
  
  const selectedOutfit = validOutfits.find(outfit => outfit.id === selectedOutfitId);
  
  // Get clothing items for the selected outfit
  const selectedOutfitItems = selectedOutfit?.items?.map(itemId => 
    clothingItems.find(item => item.id === itemId)
  ).filter((item): item is ClothingItem => !!item) || [];

  // Generate thumbnails for outfits based on the first valid clothing item in each outfit
  useEffect(() => {
    const thumbnails: Record<string, string> = {};
    
    validOutfits.forEach(outfit => {
      // Find the first valid clothing item with an image
      if (Array.isArray(outfit.items) && outfit.items.length > 0) {
        for (const itemId of outfit.items) {
          const item = clothingItems.find(item => item.id === itemId);
          if (item && (item.image || item.imageUrl)) {
            thumbnails[outfit.id] = item.image || item.imageUrl || '';
            break;
          }
        }
      }
    });
    
    setOutfitThumbnails(thumbnails);
  }, [validOutfits, clothingItems]);
  
  const handleToggleFavorite = (outfitId: string) => {
    toast.success("Added to favorites!");
  };
  
  const handleShare = (outfitId: string) => {
    toast.success("Link copied to clipboard!");
  };
  
  const handleMakeWarmer = () => {
    toast.info("Generating warmer alternatives...");
  };
  
  const handleChangeTop = () => {
    toast.info("Generating alternative tops...");
  };
  
  const handleSaveOutfit = () => {
    toast.success("Outfit saved to collection!");
  };
  
  // Handler for replacing an item in the selected outfit
  const handleReplaceItem = (oldItemId: string, newItemId: string) => {
    if (selectedOutfitId && onReplaceItem) {
      onReplaceItem(selectedOutfitId, oldItemId, newItemId);
    }
  };

  // Helper function to get outfit thumbnail
  const getOutfitThumbnail = (outfit: Outfit): string | undefined => {
    // If the outfit already has a thumbnail property, use it
    if (outfit.thumbnail) {
      return outfit.thumbnail;
    }
    
    // Otherwise, get from our generated thumbnails
    return outfitThumbnails[outfit.id];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-white">My Collection</h3>
        
        <Button 
          variant="outline" 
          size="sm"
          disabled={isRefreshing}
          onClick={onRefresh}
          className="text-white/70 border-white/10 hover:bg-white/10"
        >
          <RefreshCcw className={cn("h-4 w-4 mr-1", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>
      
      <Tabs defaultValue="my-outfits" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4 bg-slate-800/50">
          <TabsTrigger value="my-outfits">My Outfits</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-outfits" className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {validOutfits.map((outfit) => (
              <Card 
                key={outfit.id} 
                className={cn(
                  "cursor-pointer overflow-hidden border border-white/10 transition-all duration-300",
                  selectedOutfitId === outfit.id ? "ring-2 ring-purple-500 border-purple-500/50" : "hover:border-white/30"
                )}
                onClick={() => setSelectedOutfitId(outfit.id)}
              >
                <div className="aspect-square bg-slate-800/50 relative">
                  {getOutfitThumbnail(outfit) ? (
                    <img 
                      src={getOutfitThumbnail(outfit)} 
                      alt={outfit.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs text-center p-4">
                      No Preview
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 bg-black/40 hover:bg-black/60 text-white rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(outfit.id);
                      }}
                    >
                      <Heart 
                        className={cn(
                          "h-4 w-4", 
                          outfit.favorite ? "fill-red-500 text-red-500" : "fill-transparent"
                        )} 
                      />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 bg-black/40 hover:bg-black/60 text-white rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(outfit.id);
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-2 bg-slate-800/80">
                  <p className="text-white text-sm font-medium truncate">{outfit.name}</p>
                  <p className="text-white/50 text-xs truncate">{outfit.occasion}</p>
                </div>
              </Card>
            ))}
          </div>
          
          {selectedOutfit && (
            <div className="mt-6 space-y-4">
              <Card className="border border-white/10 bg-slate-900/70 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{selectedOutfit.name}</h4>
                      <p className="text-white/70 text-sm">{selectedOutfit.occasion}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                        {selectedOutfit.season && Array.isArray(selectedOutfit.season) 
                          ? selectedOutfit.season.join(', ') 
                          : selectedOutfit.season || 'All Seasons'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-white/90 mb-2">Items in this outfit:</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {selectedOutfitItems.map(item => (
                        <OutfitItemReplacement
                          key={item.id}
                          item={item}
                          onReplaceItem={handleReplaceItem}
                          category={item.type}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h5 className="text-sm font-medium text-white/90 mb-2">Why this works:</h5>
                    <p className="text-white/70 text-sm">
                      {selectedOutfit.notes || 'This combination works well together because of the complementary colors and balanced proportions. The outfit suits the selected occasion and weather conditions.'}
                    </p>
                  </div>
                </CardContent>
                
                <OutfitFeedbackSection
                  outfit={selectedOutfit}
                  onMakeWarmer={handleMakeWarmer}
                  onChangeTop={handleChangeTop}
                  onSaveOutfit={handleSaveOutfit}
                />
              </Card>
            </div>
          )}
          
          {validOutfits.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/50 mb-4">You haven't created any outfits yet</p>
              <Button variant="outline" className="border-purple-500/30 text-white hover:bg-white/10">
                Create Your First Outfit
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {recentOutfits.map((outfit) => (
              <Card 
                key={outfit.id} 
                className="cursor-pointer overflow-hidden border border-white/10 hover:border-white/30"
                onClick={() => {
                  setSelectedOutfitId(outfit.id);
                  setActiveTab('my-outfits');
                }}
              >
                <div className="aspect-square bg-slate-800/50 relative">
                  {getOutfitThumbnail(outfit) ? (
                    <img 
                      src={getOutfitThumbnail(outfit)} 
                      alt={outfit.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs text-center p-4">
                      No Preview
                    </div>
                  )}
                </div>
                <div className="p-2 bg-slate-800/80">
                  <p className="text-white text-sm font-medium truncate">{outfit.name}</p>
                  <p className="text-white/50 text-xs truncate">{outfit.dateAdded 
                    ? new Date(outfit.dateAdded).toLocaleDateString() 
                    : 'Recently added'}
                  </p>
                </div>
              </Card>
            ))}
          </div>
          
          {recentOutfits.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/50">No recent outfits</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {myOutfits.map((outfit) => (
              <Card 
                key={outfit.id} 
                className="cursor-pointer overflow-hidden border border-white/10 hover:border-white/30"
                onClick={() => {
                  setSelectedOutfitId(outfit.id);
                  setActiveTab('my-outfits');
                }}
              >
                <div className="aspect-square bg-slate-800/50 relative">
                  {getOutfitThumbnail(outfit) ? (
                    <img 
                      src={getOutfitThumbnail(outfit)} 
                      alt={outfit.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs text-center p-4">
                      No Preview
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </div>
                </div>
                <div className="p-2 bg-slate-800/80">
                  <p className="text-white text-sm font-medium truncate">{outfit.name}</p>
                  <p className="text-white/50 text-xs truncate">{outfit.occasion}</p>
                </div>
              </Card>
            ))}
          </div>
          
          {myOutfits.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/50 mb-4">No favorite outfits yet</p>
              <p className="text-white/30 text-sm">Click the heart icon on any outfit to add it to favorites</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutfitTabSection;
