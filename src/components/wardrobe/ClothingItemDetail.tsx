
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Cloud, 
  Edit, 
  Heart, 
  LayoutGrid, 
  Trash2, 
  History, 
  Shirt,
  ThermometerSun,
  Sparkles,
  Tag
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ClothingItem, Outfit, OutfitLog } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format, formatDistance } from "date-fns";
import EditItemDialog from "@/components/wardrobe/EditItemDialog";
import OptimizedImage from "@/components/ui/optimized-image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface ClothingItemDetailProps {
  item: ClothingItem | null;
  outfits: Outfit[];
  logs: OutfitLog[];
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: ClothingItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const ClothingItemDetail = ({
  item,
  outfits,
  logs,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite
}: ClothingItemDetailProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  if (!item) return null;

  // Find outfits that contain this item
  const itemOutfits = outfits.filter(outfit => 
    outfit.items && outfit.items.includes(item.id)
  );

  // Find logs that involve this item
  const itemLogs = logs.filter(log => {
    const outfit = outfits.find(o => o.id === log.outfitId);
    return outfit && outfit.items.includes(item.id);
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleSave = (updatedItem: ClothingItem) => {
    onEdit(updatedItem);
    setEditModalOpen(false);
    toast({
      title: "Item updated",
      description: `${item.name} has been updated successfully`,
    });
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete(item.id);
    onClose();
    setDeleteDialogOpen(false);
    toast({
      title: "Item deleted",
      description: `${item.name} has been removed from your wardrobe`,
    });
  };

  // Usage statistics
  const totalWears = item.timesWorn || 0;
  const lastWorn = itemLogs.length > 0 ? new Date(itemLogs[0].date) : null;
  const mostCommonWeather = getMostCommonWeather(itemLogs);

  function getMostCommonWeather(logs: OutfitLog[]) {
    if (logs.length === 0) return null;
    
    const weatherCounts: Record<string, number> = {};
    logs.forEach(log => {
      if (log.weatherCondition) {
        weatherCounts[log.weatherCondition] = (weatherCounts[log.weatherCondition] || 0) + 1;
      }
    });
    
    let maxCount = 0;
    let mostCommon = '';
    
    Object.entries(weatherCounts).forEach(([weather, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = weather;
      }
    });
    
    return mostCommon ? { condition: mostCommon, count: maxCount } : null;
  }

  // Styling suggestions based on season
  const getStylingTips = () => {
    const currentSeason = getCurrentSeason();
    const isSeasonAppropriate = item.seasons.includes(currentSeason) || item.seasons.includes('all');
    
    if (!isSeasonAppropriate) {
      return {
        tip: `This item is not ideal for ${currentSeason}. Consider wearing it in ${item.seasons.join(' or ')}.`,
        className: "text-amber-300"
      };
    }
    
    switch (item.type) {
      case 'shirt':
      case 'top':
      case 'blouse':
        return {
          tip: `Perfect for ${currentSeason}! Try pairing with a dark bottom for a balanced look.`,
          className: "text-green-300"
        };
      case 'pants':
      case 'jeans':
      case 'skirt':
        return {
          tip: `Great for ${currentSeason}! Pair with a neutral top to create versatile outfits.`,
          className: "text-green-300"
        };
      case 'dress':
        return {
          tip: `Beautiful choice for ${currentSeason}! Add a light cardigan or jacket for variable weather.`,
          className: "text-green-300"
        };
      case 'jacket':
      case 'coat':
        return {
          tip: currentSeason === 'summer' 
            ? "Keep this item ready for cool summer evenings." 
            : `Essential for ${currentSeason}! Layer over long-sleeve tops for extra warmth.`,
          className: "text-green-300"
        };
      default:
        return {
          tip: `This ${item.type} works well in ${currentSeason} with other seasonal items.`,
          className: "text-green-300"
        };
    }
  };

  function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  const stylingTip = getStylingTips();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-slate-900 border-slate-700 text-white">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-2xl font-bold text-white">{item.name}</SheetTitle>
            <SheetDescription className="text-gray-300 flex items-center gap-2">
              <span className="capitalize">{item.type}</span>
              <span>•</span>
              <span className="capitalize">{item.color}</span>
              {item.material && (
                <>
                  <span>•</span>
                  <span className="capitalize">{item.material}</span>
                </>
              )}
            </SheetDescription>
          </SheetHeader>
          
          <div className="relative aspect-square mb-6 rounded-lg overflow-hidden border border-slate-700 mt-4">
            <OptimizedImage
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              priority={true}
            />
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute top-3 right-3 h-8 w-8 rounded-full border border-white/10 backdrop-blur-sm",
                item.favorite ? "bg-red-500/20" : "bg-black/40"
              )}
              onClick={() => onToggleFavorite(item.id)}
            >
              <Heart className={cn(
                "h-4 w-4",
                item.favorite ? "fill-red-500 text-red-500" : "text-white"
              )} />
            </Button>
          </div>
          
          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="bg-slate-800 w-full grid grid-cols-4">
              <TabsTrigger value="details" className="data-[state=active]:bg-slate-700">
                <Tag className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Details</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-slate-700">
                <History className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
              <TabsTrigger value="outfits" className="data-[state=active]:bg-slate-700">
                <LayoutGrid className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Outfits</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="data-[state=active]:bg-slate-700">
                <Sparkles className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Tips</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Seasons</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.seasons.map(season => (
                      <Badge key={season} className="bg-blue-900/30 hover:bg-blue-900/40 text-blue-300">
                        {season}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {item.occasions && item.occasions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Occasions</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.occasions.map(occasion => (
                        <Badge key={occasion} className="bg-purple-900/30 hover:bg-purple-900/40 text-purple-300">
                          {occasion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Times Worn</p>
                    <p className="text-2xl font-bold">{totalWears}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Added</p>
                    <p className="text-lg font-medium">{format(new Date(item.dateAdded), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="pt-4">
              {itemLogs.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Last Worn</p>
                      <p className="text-lg font-medium">{lastWorn ? format(lastWorn, 'MMM d, yyyy') : 'Never'}</p>
                    </div>
                    
                    {mostCommonWeather && (
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <p className="text-sm text-gray-400">Weather Preference</p>
                        <p className="text-lg font-medium capitalize flex items-center">
                          <Cloud className="h-4 w-4 mr-2 text-blue-400" />
                          {mostCommonWeather.condition}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-400 pt-2">Wear History</h3>
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                    {itemLogs.map(log => {
                      const outfit = outfits.find(o => o.id === log.outfitId);
                      return (
                        <div key={log.id} className="bg-slate-800/40 p-3 rounded-lg">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">{format(new Date(log.date), 'MMM d, yyyy')}</p>
                            <p className="text-xs text-gray-400">{log.time_of_day || 'All day'}</p>
                          </div>
                          {outfit && <p className="text-sm text-purple-300">Outfit: {outfit.name}</p>}
                          {log.weatherCondition && (
                            <div className="flex items-center mt-1 text-xs text-gray-400">
                              <Cloud className="h-3 w-3 mr-1" />
                              <span className="capitalize">{log.weatherCondition}</span>
                              {log.temperature && (
                                <>
                                  <span className="mx-1">•</span>
                                  <ThermometerSun className="h-3 w-3 mr-1" />
                                  <span>{log.temperature}°</span>
                                </>
                              )}
                            </div>
                          )}
                          {log.activity && (
                            <p className="text-xs text-gray-400 mt-1">
                              Activity: {log.custom_activity || log.activity}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-500 mb-3" />
                  <h3 className="text-lg font-medium">No wear history</h3>
                  <p className="text-gray-400 mt-1">
                    This item hasn't been logged in any outfits yet.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="outfits" className="pt-4">
              {itemOutfits.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-400">Appears in {itemOutfits.length} outfit{itemOutfits.length !== 1 ? 's' : ''}</h3>
                  <div className="grid gap-3 max-h-80 overflow-y-auto pr-2">
                    {itemOutfits.map(outfit => (
                      <div key={outfit.id} className="bg-slate-800/40 p-3 rounded-lg flex items-center gap-3">
                        <div className="h-12 w-12 bg-slate-700 rounded-md flex-shrink-0">
                          {outfit.imageUrl ? (
                            <img src={outfit.imageUrl} alt={outfit.name} className="h-full w-full object-cover rounded-md" />
                          ) : (
                            <LayoutGrid className="h-6 w-6 m-3 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-medium truncate">{outfit.name}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {outfit.seasons.slice(0, 2).map(season => (
                              <Badge key={season} variant="outline" className="text-[10px] h-5 px-1.5 border-blue-500/30 text-blue-100">
                                {season}
                              </Badge>
                            ))}
                            {outfit.seasons.length > 2 && (
                              <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-gray-500/30 text-gray-100">
                                +{outfit.seasons.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-gray-400">Worn</p>
                          <p className="font-medium">{outfit.timesWorn || 0}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shirt className="h-12 w-12 mx-auto text-gray-500 mb-3" />
                  <h3 className="text-lg font-medium">No outfits yet</h3>
                  <p className="text-gray-400 mt-1">
                    This item hasn't been added to any outfits.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  >
                    Create Outfit
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tips" className="pt-4">
              <div className="space-y-4">
                <div className={cn(
                  "bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg",
                  "bg-gradient-to-r from-purple-950/80 to-indigo-950/80"
                )}>
                  <h3 className="text-lg font-medium flex items-center gap-2 text-purple-300">
                    <Sparkles className="h-5 w-5" />
                    Olivia's Styling Tips
                  </h3>
                  <p className={cn("mt-2", stylingTip.className)}>
                    {stylingTip.tip}
                  </p>
                  
                  <Separator className="my-3 bg-purple-500/20" />
                  
                  <h4 className="text-sm font-medium text-purple-300 mb-2">Great Pairings:</h4>
                  <ul className="space-y-1.5 text-sm text-gray-300">
                    <li>• {item.type === 'top' || item.type === 'shirt' ? 'Dark jeans or trousers' : 'Neutral shirts or blouses'}</li>
                    <li>• {item.color === 'black' ? 'White or bright color accents' : 'Black base pieces for contrast'}</li>
                    <li>• Accessorize with {item.color === 'neutral' ? 'bold' : 'subtle'} jewelry</li>
                  </ul>
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Care Instructions</h3>
                  {item.material === 'cotton' && (
                    <p className="text-sm">Machine washable at 30°C. Tumble dry low or air dry for longevity.</p>
                  )}
                  {item.material === 'silk' && (
                    <p className="text-sm">Hand wash only with mild detergent. Air dry, do not tumble dry.</p>
                  )}
                  {item.material === 'wool' && (
                    <p className="text-sm">Dry clean recommended. If washing, use wool-specific detergent and lay flat to dry.</p>
                  )}
                  {item.material === 'polyester' && (
                    <p className="text-sm">Machine washable at 40°C. Tumble dry safe, but air dry to prevent static.</p>
                  )}
                  {(!item.material || !['cotton', 'silk', 'wool', 'polyester'].includes(item.material)) && (
                    <p className="text-sm">Check garment label for specific care instructions based on material.</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <SheetFooter className="mt-6">
            <div className="flex gap-2 w-full justify-between">
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              
              <div className="flex gap-2">
                <SheetClose asChild>
                  <Button variant="outline" size="sm">
                    Close
                  </Button>
                </SheetClose>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  onClick={handleEdit}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      <EditItemDialog
        item={item}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSave}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClothingItemDetail;
