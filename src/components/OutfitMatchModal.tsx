import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClothingItem, Outfit, ClothingType } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { v4 as uuidv4 } from '@/lib/utils';
import { Shirt, Pants, Footprint, Sparkles, ArrowRight, Check, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import WardrobeGrid from '@/components/WardrobeGrid';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface OutfitMatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ClothingItem;
  allItems: ClothingItem[];
}

const OutfitMatchModal = ({ open, onOpenChange, item, allItems }: OutfitMatchModalProps) => {
  const [activeTab, setActiveTab] = useState<string>("tops");
  const [outfitName, setOutfitName] = useState(`Outfit with ${item.name}`);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([item]);
  const navigate = useNavigate();
  
  const itemTypeCategories = {
    tops: ['shirt', 'sweater', 'hoodie'],
    bottoms: ['jeans', 'pants', 'shorts', 'skirt'],
    shoes: ['shoes', 'sneakers', 'boots'],
    accessories: ['accessories']
  };
  
  // Determine which tab the initial item belongs to
  const getItemCategory = (type: ClothingType): string => {
    for (const [category, types] of Object.entries(itemTypeCategories)) {
      if (types.includes(type)) {
        return category;
      }
    }
    return "tops";
  };
  
  const initialCategory = getItemCategory(item.type);
  
  // Filter items for each category excluding the current item
  const getCategoryItems = (category: string): ClothingItem[] => {
    return allItems.filter(i => {
      const types = itemTypeCategories[category as keyof typeof itemTypeCategories];
      return types?.includes(i.type) && i.id !== item.id;
    });
  };
  
  const handleToggleSelect = (id: string) => {
    const itemCategory = getItemCategory(
      allItems.find(i => i.id === id)?.type as ClothingType
    );
    
    // Only allow one item per category
    setSelectedItems(prev => {
      // Find if we already have an item from this category
      const existingItemOfCategoryIndex = prev.findIndex(
        i => i.id !== item.id && getItemCategory(i.type) === itemCategory
      );
      
      // If we already have an item of this category, replace it
      if (existingItemOfCategoryIndex !== -1) {
        const newItems = [...prev];
        const targetItem = allItems.find(i => i.id === id);
        if (targetItem) {
          newItems[existingItemOfCategoryIndex] = targetItem;
        }
        return newItems;
      }
      
      // Otherwise add the new item
      const newItem = allItems.find(i => i.id === id);
      if (newItem) {
        return [...prev, newItem];
      }
      
      return prev;
    });
  };
  
  const isItemSelected = (id: string): boolean => {
    return selectedItems.some(i => i.id === id);
  };
  
  const handleSaveOutfit = () => {
    // Create a new outfit object
    const newOutfit: Outfit = {
      id: uuidv4(),
      name: outfitName,
      items: selectedItems.map(i => i.id),
      occasions: [...new Set(selectedItems.flatMap(i => i.occasions))],
      seasons: [...new Set(selectedItems.flatMap(i => i.seasons))],
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
    };
    
    // In a real app, you would save this to your state/database
    console.log('New outfit created:', newOutfit);
    
    // Show success message
    toast.success('Outfit created successfully!', {
      description: 'View it in your outfits collection.',
      action: {
        label: 'View Outfits',
        onClick: () => navigate('/outfits')
      }
    });
    
    // Close the modal
    onOpenChange(false);
    setSelectedItems([item]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 text-white border-slate-700 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Create Outfit with {item.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex justify-center p-3 bg-slate-800/50 rounded-lg mb-4">
            <div className="relative w-24 h-24 rounded-md overflow-hidden">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-xs text-white text-center truncate">
                {item.name}
              </div>
            </div>
            
            {selectedItems.length > 1 && (
              <div className="flex items-center">
                <ArrowRight className="h-5 w-5 mx-2 text-purple-400" />
                <div className="flex flex-wrap gap-1 max-w-[300px]">
                  {selectedItems.filter(i => i.id !== item.id).map(i => (
                    <div key={i.id} className="relative w-16 h-16 rounded-md overflow-hidden">
                      <img 
                        src={i.imageUrl} 
                        alt={i.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-0.5 text-[10px] text-white text-center truncate">
                        {i.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="outfit-name" className="text-sm text-gray-300 mb-1 block">
              Outfit Name
            </label>
            <Input
              id="outfit-name"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          
          <div className="text-sm text-gray-300 mb-2">
            Now select additional items to complete your outfit:
          </div>
          
          <Tabs defaultValue={initialCategory !== getItemCategory(item.type) ? initialCategory : "tops"} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="bg-slate-800 mb-4">
              <TabsTrigger 
                value="tops" 
                onClick={() => setActiveTab("tops")}
                disabled={getItemCategory(item.type) === "tops"}
                className="data-[state=active]:bg-indigo-700"
              >
                <Shirt className="h-4 w-4 mr-1" />
                Tops
              </TabsTrigger>
              <TabsTrigger 
                value="bottoms" 
                onClick={() => setActiveTab("bottoms")}
                disabled={getItemCategory(item.type) === "bottoms"}
                className="data-[state=active]:bg-indigo-700"
              >
                <Pants className="h-4 w-4 mr-1" />
                Bottoms
              </TabsTrigger>
              <TabsTrigger 
                value="shoes" 
                onClick={() => setActiveTab("shoes")}
                disabled={getItemCategory(item.type) === "shoes"}
                className="data-[state=active]:bg-indigo-700"
              >
                <Footprint className="h-4 w-4 mr-1" />
                Shoes
              </TabsTrigger>
              <TabsTrigger 
                value="accessories" 
                onClick={() => setActiveTab("accessories")}
                disabled={getItemCategory(item.type) === "accessories"}
                className="data-[state=active]:bg-indigo-700"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Access.
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-hidden">
              {["tops", "bottoms", "shoes", "accessories"].map((category) => (
                <TabsContent 
                  key={category} 
                  value={category} 
                  className="flex-1 h-[300px] data-[state=active]:flex flex-col overflow-hidden"
                >
                  <ScrollArea className="flex-1">
                    {getCategoryItems(category).length > 0 ? (
                      <WardrobeGrid
                        items={getCategoryItems(category)}
                        onToggleFavorite={() => {}}
                        onMatchItem={() => {}}
                        compactView={true}
                        selectable={true}
                        selectedItems={selectedItems.map(i => i.id)}
                        onToggleSelect={handleToggleSelect}
                      />
                    ) : (
                      <div className="p-6 text-center text-gray-400">
                        <p>No items found in this category.</p>
                        <Button 
                          variant="outline" 
                          className="mt-2 border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
                          onClick={() => onOpenChange(false)}
                        >
                          Upload New Items
                        </Button>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between">
          <div className="flex flex-wrap gap-1 items-center">
            <Badge className="bg-purple-600">
              {selectedItems.length} Items
            </Badge>
            {selectedItems.length >= 2 && (
              <Badge variant="outline" className="border-green-500/30 text-green-300">
                <Check className="h-3 w-3 mr-1" /> Ready to save
              </Badge>
            )}
          </div>
          
          <Button 
            onClick={handleSaveOutfit}
            disabled={selectedItems.length < 2}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Outfit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OutfitMatchModal;
