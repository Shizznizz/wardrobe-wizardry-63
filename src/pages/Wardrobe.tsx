
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import WardrobeGrid from '@/components/WardrobeGrid';
import OliviaBloomAdvisor from '@/components/OliviaBloomAdvisor';
import OliviaBloomAssistant from '@/components/OliviaBloomAssistant';
import OliviaTips from '@/components/OliviaTips';
import UploadModal from '@/components/UploadModal';
import { ClothingItem, ClothingType, Outfit, OutfitLog } from '@/lib/types';
import { sampleClothingItems, sampleOutfits, sampleUserPreferences, sampleOutfitLogs } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { Confetti } from '@/components/ui/confetti';
import { cn } from "@/lib/utils";
import { 
  ArrowUpDown, 
  Info, 
  Shirt, 
  Sparkles, 
  LayoutGrid, 
  X, 
  ChevronDown, 
  AlertCircle, 
  Trash2, 
  Check,
  Grid3X3,
  List,
  Clock,
  CloudSun,
  Layers,
  Puzzle,
  Heart
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import OutfitMatchModal from '@/components/OutfitMatchModal';
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ClothingItemDetail from '@/components/wardrobe/ClothingItemDetail';

const Wardrobe = () => {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>(sampleClothingItems);
  const [outfits, setOutfits] = useState<Outfit[]>(sampleOutfits);
  const [outfitLogs, setOutfitLogs] = useState<OutfitLog[]>(sampleOutfitLogs || []);
  const [showConfetti, setShowConfetti] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [isCompactView, setIsCompactView] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [itemToMatch, setItemToMatch] = useState<ClothingItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isFavoriteFilter, setIsFavoriteFilter] = useState(false);
  const [isClothingDetailOpen, setIsClothingDetailOpen] = useState(false);
  const [selectedClothingItem, setSelectedClothingItem] = useState<ClothingItem | null>(null);

  const isMobile = useIsMobile();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      toast({
        title: "Welcome back!",
        description: `Hi ${user.email}, your wardrobe is ready.`,
      });
    }
  }, [user]);

  useEffect(() => {
    if (clothingItems.length > 0) {
      const timer = setTimeout(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [clothingItems]);

  const handleUploadSuccess = (newItem: ClothingItem) => {
    setClothingItems([...clothingItems, newItem]);
    toast.success(`${newItem.name} added to your wardrobe!`);
  };

  const toggleFavorite = (id: string) => {
    setClothingItems(clothingItems.map(item =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    ));
  };

  const handleMatchItem = (item: ClothingItem) => {
    setItemToMatch(item);
    setIsMatching(true);
  };

  const handleDeleteItem = (id: string) => {
    setClothingItems(clothingItems.filter(item => item.id !== id));
  };

  const handleEditItem = (updatedItem: ClothingItem) => {
    setClothingItems(clothingItems.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleCreateOutfit = (name: string, itemIds: string[]) => {
    const newOutfit: Outfit = {
      id: Math.random().toString(36).substring(7),
      name: name,
      items: itemIds,
      occasions: [],
      seasons: [],
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
    };
    setOutfits([...outfits, newOutfit]);
    setSelectedItems([]);
    setIsMultiSelectMode(false);
    toast.success(`${name} outfit created!`);
  };

  const handleItemClick = (item: ClothingItem) => {
    if (isMultiSelectMode) {
      toggleSelect(item.id);
    } else {
      setSelectedClothingItem(item);
      setIsClothingDetailOpen(true);
    }
  };

  const filteredItems = isFavoriteFilter
    ? clothingItems.filter(item => item.favorite)
    : clothingItems;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      {showConfetti && <Confetti />}
      <Header>
        <div className="space-x-2">
          <Button variant="outline" size="icon" onClick={() => setIsMultiSelectMode(!isMultiSelectMode)}>
            {isMultiSelectMode ? <X className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={() => setIsFavoriteFilter(!isFavoriteFilter)}>
            {isFavoriteFilter ? <X className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
          </Button>
          <Button onClick={() => setUploadModalOpen(true)}>
            <Shirt className="mr-2 h-4 w-4" />
            Add Clothing
          </Button>
        </div>
      </Header>

      <div className="container max-w-7xl mx-auto px-4 pb-12 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Items</h2>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setIsCompactView(!isCompactView)}>
                      {isCompactView ? <LayoutGrid className="h-5 w-5" /> : <List className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white">
                    <p className="text-xs">{isCompactView ? "Show Full Details" : "Show Compact View"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <WardrobeGrid
            items={filteredItems}
            onToggleFavorite={toggleFavorite}
            onMatchItem={handleMatchItem}
            onDeleteItem={handleDeleteItem}
            onEditItem={handleEditItem}
            onItemClick={handleItemClick}
            compactView={isCompactView}
            selectable={isMultiSelectMode}
            selectedItems={selectedItems}
            onToggleSelect={toggleSelect}
            onCreateOutfit={handleCreateOutfit}
          />
        </motion.div>
      </div>

      <UploadModal onUpload={handleUploadSuccess} open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
      <OutfitMatchModal open={isMatching} onOpenChange={setIsMatching} item={itemToMatch} allItems={clothingItems} />
      
      {/* Clothing Item Detail Modal */}
      {selectedClothingItem && (
        <Dialog open={isClothingDetailOpen} onOpenChange={setIsClothingDetailOpen}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
            <ClothingItemDetail 
              item={selectedClothingItem} 
              outfits={outfits}
              logs={outfitLogs}
              isOpen={isClothingDetailOpen}
              onClose={() => setIsClothingDetailOpen(false)}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onToggleFavorite={toggleFavorite}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Wardrobe;
