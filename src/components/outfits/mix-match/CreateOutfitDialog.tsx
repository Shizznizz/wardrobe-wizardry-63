
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClothingItem, Outfit } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Plus, Save, X } from 'lucide-react';
import { v4 as uuidv4 } from '@/lib/utils';
import { toast } from 'sonner';

interface CreateOutfitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clothingItems: ClothingItem[];
  onSave: (outfit: Outfit) => void;
}

const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const STYLES = ['Casual', 'Formal', 'Sporty', 'Business', 'Chic', 'Streetwear'];

const CreateOutfitDialog = ({ open, onOpenChange, clothingItems, onSave }: CreateOutfitDialogProps) => {
  const [outfitName, setOutfitName] = useState('My New Outfit');
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Casual']);
  
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setOutfitName('My New Outfit');
      setSelectedItems([]);
      setSelectedSeasons([]);
      setSelectedStyles(['Casual']);
    }
  }, [open]);
  
  const handleToggleItem = (item: ClothingItem) => {
    setSelectedItems(prev => {
      if (prev.some(i => i.id === item.id)) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };
  
  const handleToggleSeason = (season: string) => {
    setSelectedSeasons(prev => {
      if (prev.includes(season)) {
        return prev.filter(s => s !== season);
      } else {
        return [...prev, season];
      }
    });
  };
  
  const handleToggleStyle = (style: string) => {
    setSelectedStyles(prev => {
      if (prev.includes(style)) {
        return prev.filter(s => s !== style);
      } else {
        return [...prev, style];
      }
    });
  };
  
  const handleSaveOutfit = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item for your outfit');
      return;
    }
    
    // Create new outfit object
    const newOutfit: Outfit = {
      id: uuidv4(),
      name: outfitName,
      items: selectedItems.map(item => item.id),
      season: selectedSeasons.length > 0 ? selectedSeasons.map(s => s.toLowerCase()) : ['all'],
      occasion: selectedStyles[0]?.toLowerCase() || 'casual',
      occasions: selectedStyles.map(s => s.toLowerCase()),
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
    };
    
    onSave(newOutfit);
    onOpenChange(false);
    toast.success('Outfit created successfully!');
  };
  
  // Group clothing items by type
  const groupedItems = clothingItems.reduce((acc, item) => {
    const type = item.type.toLowerCase();
    
    if (type.includes('shirt') || type.includes('top') || type.includes('blouse') || 
        type.includes('sweater') || type.includes('jacket') || type.includes('hoodie')) {
      acc.tops.push(item);
    } else if (type.includes('pants') || type.includes('jeans') || type.includes('skirt') || 
              type.includes('shorts') || type.includes('bottom')) {
      acc.bottoms.push(item);
    } else if (type.includes('shoe') || type.includes('sneaker') || type.includes('boot') || 
              type.includes('sandal')) {
      acc.shoes.push(item);
    } else {
      acc.accessories.push(item);
    }
    
    return acc;
  }, { tops: [] as ClothingItem[], bottoms: [] as ClothingItem[], shoes: [] as ClothingItem[], accessories: [] as ClothingItem[] });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 text-white border-slate-700 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Your New Outfit</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="mb-4">
            <Label htmlFor="outfit-name">Name Your Outfit</Label>
            <Input
              id="outfit-name"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="My Awesome Outfit"
            />
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Select Clothing Items</h4>
            <Tabs defaultValue="tops" className="w-full">
              <TabsList className="bg-slate-800">
                <TabsTrigger value="tops">Tops</TabsTrigger>
                <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
                <TabsTrigger value="shoes">Shoes</TabsTrigger>
                <TabsTrigger value="accessories">Accessories</TabsTrigger>
              </TabsList>
              
              {(['tops', 'bottoms', 'shoes', 'accessories'] as const).map((category) => (
                <TabsContent key={category} value={category} className="h-[200px]">
                  <ScrollArea className="h-full">
                    {groupedItems[category].length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-1">
                        {groupedItems[category].map((item) => {
                          const isSelected = selectedItems.some(i => i.id === item.id);
                          return (
                            <div 
                              key={item.id}
                              className={`relative border rounded-md overflow-hidden cursor-pointer transition-all ${
                                isSelected ? 'border-purple-500 shadow-sm shadow-purple-500/30' : 'border-slate-700'
                              }`}
                              onClick={() => handleToggleItem(item)}
                            >
                              <div className="aspect-square">
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-1 bg-slate-800/90 text-xs truncate">
                                {item.name}
                              </div>
                              {isSelected && (
                                <div className="absolute top-1 right-1 bg-purple-500 rounded-full p-1">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-full text-slate-400">
                        No {category} found in your wardrobe
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div className="mb-2">
            <h4 className="text-sm font-medium mb-2">Selected Items ({selectedItems.length})</h4>
            {selectedItems.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {selectedItems.map((item) => (
                  <Badge 
                    key={item.id} 
                    variant="outline" 
                    className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700"
                  >
                    <span className="text-xs truncate max-w-[100px]">{item.name}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleItem(item);
                      }} 
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 text-sm">No items selected</div>
            )}
          </div>
          
          <div className="space-y-3 mt-3">
            <div>
              <h4 className="text-sm font-medium mb-2">Seasons (Optional)</h4>
              <div className="flex flex-wrap gap-2">
                {SEASONS.map((season) => (
                  <Badge 
                    key={season}
                    variant={selectedSeasons.includes(season) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedSeasons.includes(season) 
                        ? "bg-purple-600 hover:bg-purple-700" 
                        : "hover:bg-slate-700"
                    }`}
                    onClick={() => handleToggleSeason(season)}
                  >
                    {season}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Styles (Optional)</h4>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((style) => (
                  <Badge 
                    key={style}
                    variant={selectedStyles.includes(style) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedStyles.includes(style) 
                        ? "bg-purple-600 hover:bg-purple-700" 
                        : "hover:bg-slate-700"
                    }`}
                    onClick={() => handleToggleStyle(style)}
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-end gap-2 pt-4 mt-4 border-t border-slate-700">
          <Button 
            variant="outline" 
            className="border-slate-600"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="default"
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleSaveOutfit}
            disabled={selectedItems.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Outfit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOutfitDialog;
