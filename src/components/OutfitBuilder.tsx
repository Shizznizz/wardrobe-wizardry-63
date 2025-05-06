
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClothingItem, Outfit, ClothingSeason, ClothingOccasion } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Shirt, Plus, CalendarDays, Sun, CloudRain, Trash2, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useOutfitContext } from '@/hooks/useOutfitContext';

interface OutfitBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (outfit: Outfit) => void;
  clothingItems: ClothingItem[];
  initialOutfit?: Outfit | null;
}

const seasons = ['spring', 'summer', 'autumn', 'winter', 'all'] as ClothingSeason[];
const occasions = ['casual', 'formal', 'work', 'sport', 'special', 'travel'] as string[];

const OutfitBuilder = ({ isOpen, onClose, onSave, clothingItems, initialOutfit }: OutfitBuilderProps) => {
  const [outfitName, setOutfitName] = useState('');
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<ClothingSeason[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('items');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { isCreatingNewOutfit } = useOutfitContext();
  
  console.log("OutfitBuilder opened with isCreatingNewOutfit:", isCreatingNewOutfit);
  console.log("initialOutfit:", initialOutfit);
  
  // Reset the form and initialize with initialOutfit if provided
  useEffect(() => {
    console.log("OutfitBuilder effect - isCreatingNewOutfit:", isCreatingNewOutfit, "initialOutfit:", initialOutfit);
    if (initialOutfit && !isCreatingNewOutfit) {
      console.log("Editing existing outfit:", initialOutfit);
      setOutfitName(initialOutfit.name);
      const itemObjects = initialOutfit.items
        .map(itemId => clothingItems.find(item => item.id === itemId))
        .filter(item => item !== undefined) as ClothingItem[];
      setSelectedItems(itemObjects);
      setSelectedSeasons(initialOutfit.season || []);
      setSelectedOccasions(initialOutfit.occasions || [initialOutfit.occasion]);
    } else {
      console.log("Creating new outfit");
      resetForm();
    }
  }, [initialOutfit, isOpen, clothingItems, isCreatingNewOutfit]);
  
  const resetForm = () => {
    console.log("Resetting OutfitBuilder form");
    setOutfitName('');
    setSelectedItems([]);
    setSelectedSeasons([]);
    setSelectedOccasions([]);
    setActiveTab('items');
  };
  
  const handleSave = async () => {
    console.log("Handling outfit save - isCreatingNewOutfit:", isCreatingNewOutfit);
    if (!outfitName.trim()) {
      toast.error("Please provide an outfit name");
      return;
    }
    
    if (selectedItems.length === 0) {
      toast.error("Please select at least one clothing item");
      return;
    }
    
    if (selectedSeasons.length === 0) {
      toast.error("Please select at least one season");
      return;
    }
    
    if (selectedOccasions.length === 0) {
      toast.error("Please select at least one occasion");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to save outfits");
      return;
    }
    
    // Always generate a new UUID for new outfits to avoid ID conflicts
    const outfitId = isCreatingNewOutfit ? crypto.randomUUID() : (initialOutfit?.id || crypto.randomUUID());
    
    const newOutfit: Outfit = {
      id: outfitId,
      name: outfitName,
      items: selectedItems.map(item => item.id),
      season: selectedSeasons,
      seasons: selectedSeasons, // Add this to ensure consistency
      occasion: selectedOccasions[0] || 'casual',
      occasions: selectedOccasions,
      favorite: initialOutfit?.favorite || false,
      timesWorn: initialOutfit?.timesWorn || 0,
      dateAdded: isCreatingNewOutfit ? new Date() : (initialOutfit?.dateAdded || new Date()),
      lastWorn: initialOutfit?.lastWorn
    };
    
    // Log the outfit being saved
    console.log("Saving outfit:", newOutfit);
    console.log("Is creating new outfit:", isCreatingNewOutfit);
    
    // If user is authenticated, save to Supabase
    setIsSaving(true);
    try {
      const outfitData = {
        id: newOutfit.id,
        name: newOutfit.name,
        user_id: user.id,
        items: newOutfit.items,
        season: newOutfit.season,
        occasion: newOutfit.occasion,
        occasions: newOutfit.occasions,
        favorite: newOutfit.favorite,
        times_worn: newOutfit.timesWorn || 0,
        date_added: new Date().toISOString()
      };
      
      // Check if the outfit already exists
      const { data: existingOutfit, error: checkError } = await supabase
        .from('outfits')
        .select('id')
        .eq('id', newOutfit.id)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking for existing outfit:", checkError);
        toast.error("Failed to check if outfit exists");
        setIsSaving(false);
        return;
      }
      
      let result;
      if (existingOutfit && !isCreatingNewOutfit) {
        // Update existing outfit
        console.log("Updating existing outfit");
        result = await supabase
          .from('outfits')
          .update(outfitData)
          .eq('id', newOutfit.id);
      } else {
        // Insert new outfit
        console.log("Creating new outfit");
        result = await supabase
          .from('outfits')
          .insert([outfitData]);
      }
      
      if (result.error) {
        console.error("Error saving outfit to Supabase:", result.error);
        toast.error("Failed to save outfit to database");
        setIsSaving(false);
        return;
      } else {
        toast.success(isCreatingNewOutfit ? "Outfit saved to your collection!" : "Outfit updated successfully!");
        
        // Call the onSave prop to update local state as well
        onSave(newOutfit);
        
        // Reset form and close modal
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error("Exception saving outfit:", error);
      toast.error("An unexpected error occurred");
      setIsSaving(false);
      return;
    }
    
    setIsSaving(false);
  };
  
  const toggleItem = (item: ClothingItem) => {
    if (selectedItems.some(i => i.id === item.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  
  const toggleSeason = (season: ClothingSeason) => {
    if (selectedSeasons.includes(season)) {
      setSelectedSeasons(selectedSeasons.filter(s => s !== season));
    } else {
      setSelectedSeasons([...selectedSeasons, season]);
    }
  };
  
  const toggleOccasion = (occasion: string) => {
    if (selectedOccasions.includes(occasion)) {
      setSelectedOccasions(selectedOccasions.filter(o => o !== occasion));
    } else {
      setSelectedOccasions([...selectedOccasions, occasion]);
    }
  };
  
  const filteredClothingItems = clothingItems.filter(item => {
    return true;
  });
  
  // Define isFormValid function once
  const isFormValid = () => {
    return outfitName.trim() !== '' && selectedItems.length > 0 && 
           selectedSeasons.length > 0 && selectedOccasions.length > 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 border-purple-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {isCreatingNewOutfit ? 'Create New Outfit' : 'Edit Outfit'}
          </DialogTitle>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 hover:bg-slate-800"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="outfitName" className="text-white">Outfit Name</Label>
            <Input
              id="outfitName"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              placeholder="Enter outfit name"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          
          <Tabs defaultValue="items" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 bg-slate-800">
              <TabsTrigger value="items" className="data-[state=active]:bg-indigo-600">
                <Shirt className="h-4 w-4 mr-2" />
                Items
              </TabsTrigger>
              <TabsTrigger value="seasons" className="data-[state=active]:bg-indigo-600">
                <Sun className="h-4 w-4 mr-2" />
                Seasons
              </TabsTrigger>
              <TabsTrigger value="occasions" className="data-[state=active]:bg-indigo-600">
                <CalendarDays className="h-4 w-4 mr-2" />
                Occasions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="items" className="space-y-4 mt-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedItems.map((item) => (
                  <Badge 
                    key={item.id} 
                    variant="outline"
                    className="bg-indigo-800/30 hover:bg-indigo-800/40 border-indigo-500/30 px-2 py-1 flex items-center gap-1"
                  >
                    {item.name}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 text-white/70 hover:text-white hover:bg-transparent ml-1" 
                      onClick={() => toggleItem(item)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {selectedItems.length === 0 && (
                  <p className="text-white/60 text-sm">No items selected yet</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-1">
                {filteredClothingItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item)}
                    className={`
                      cursor-pointer rounded-lg p-3 flex items-center gap-2 transition-colors
                      ${selectedItems.some(i => i.id === item.id) 
                          ? 'bg-indigo-600/30 border border-indigo-500/50' 
                          : 'bg-slate-800 border border-slate-700 hover:border-slate-600'}
                    `}
                  >
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-slate-700 flex items-center justify-center">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <Shirt className="h-6 w-6 text-white/50" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-white/60 truncate">{item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="seasons" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {seasons.map((season) => (
                  <div
                    key={season}
                    onClick={() => toggleSeason(season)}
                    className={`
                      cursor-pointer rounded-lg p-3 flex items-center gap-2 transition-colors
                      ${selectedSeasons.includes(season) 
                          ? 'bg-indigo-600/30 border border-indigo-500/50' 
                          : 'bg-slate-800 border border-slate-700 hover:border-slate-600'}
                    `}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">{season}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="occasions" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {occasions.map((occasion) => (
                  <div
                    key={occasion}
                    onClick={() => toggleOccasion(occasion)}
                    className={`
                      cursor-pointer rounded-lg p-3 flex items-center gap-2 transition-colors
                      ${selectedOccasions.includes(occasion) 
                          ? 'bg-indigo-600/30 border border-indigo-500/50' 
                          : 'bg-slate-800 border border-slate-700 hover:border-slate-600'}
                    `}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">{occasion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="border-white/10"
            type="button"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!isFormValid() || isSaving}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
            type="button"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                {isCreatingNewOutfit ? 'Create Outfit' : 'Update Outfit'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OutfitBuilder;
