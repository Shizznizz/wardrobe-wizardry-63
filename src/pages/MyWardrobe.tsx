
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { ClothingItem, Outfit, ClothingType } from '@/lib/types';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import { filterItemsByCategory, applySmartFilter, sortItems } from '@/lib/wardrobe/filterUtils';
import Header from '@/components/Header';
import WardrobeGrid from '@/components/WardrobeGrid';
import WardrobeFilters from '@/components/wardrobe/WardrobeFilters';
import WardrobeControls from '@/components/wardrobe/WardrobeControls';
import UploadModal from '@/components/UploadModal';
import { Button } from '@/components/ui/button';
import { Confetti } from '@/components/ui/confetti';
import OutfitMatchModal from '@/components/OutfitMatchModal';
import { Shirt, Sparkles, X, Check, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
} from "@/components/ui/alert-dialog";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100 } 
  }
};

const MyWardrobe = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasAddedItem, setHasAddedItem] = useState(false);
  const [sortOption, setSortOption] = useState<string>('newest');
  const [showCompactView, setShowCompactView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ClothingType | null>(null);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [selectedItemForMatch, setSelectedItemForMatch] = useState<ClothingItem | null>(null);
  const [clearWardrobeDialogOpen, setClearWardrobeDialogOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [smartFilter, setSmartFilter] = useState<string | null>(null);
  const [itemForPairing, setItemForPairing] = useState<string | null>(null);

  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  useEffect(() => {
    const loadItems = () => {
      setIsLoading(true);
      try {
        const savedItems = localStorage.getItem('wardrobeItems');
        if (savedItems) {
          setItems(JSON.parse(savedItems));
        } else {
          setItems(sampleClothingItems);
          localStorage.setItem('wardrobeItems', JSON.stringify(sampleClothingItems));
        }
        
        const savedOutfits = localStorage.getItem('outfits');
        if (savedOutfits) {
          setOutfits(JSON.parse(savedOutfits));
        } else {
          setOutfits(sampleOutfits);
          localStorage.setItem('outfits', JSON.stringify(sampleOutfits));
        }
      } catch (error) {
        console.error("Failed to load wardrobe items:", error);
        setLoadError("Failed to load your wardrobe items. Please try again later.");
        setItems(sampleClothingItems);
        setOutfits(sampleOutfits);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  const handleUpload = (newItem: ClothingItem) => {
    setItems(prev => [newItem, ...prev]);
    toast.success('New item added to your wardrobe!');
    
    if (!hasAddedItem) {
      setShowConfetti(true);
      setHasAddedItem(true);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, favorite: !item.favorite } 
          : item
      )
    );
    
    const item = items.find(item => item.id === id);
    if (item) {
      const action = !item.favorite ? 'added to' : 'removed from';
      toast.success(`${item.name} ${action} favorites`);
    }
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    if (itemToDelete) {
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success(`${itemToDelete.name} has been removed from your wardrobe`);
    }
  };

  const handleMatchItem = (item: ClothingItem) => {
    setSelectedItemForMatch(item);
    setMatchModalOpen(true);
  };

  const handleClearWardrobe = () => {
    setClearWardrobeDialogOpen(true);
  };

  const confirmClearWardrobe = () => {
    setItems([]);
    setClearWardrobeDialogOpen(false);
    toast.success("Your wardrobe has been cleared");
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedItems([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleSmartFilter = (filterType: string, itemId?: string) => {
    if (filterType === smartFilter && itemId === itemForPairing) {
      setSmartFilter(null);
      setItemForPairing(null);
      return;
    }
    
    setSmartFilter(filterType);
    if (itemId) {
      setItemForPairing(itemId);
    } else {
      setItemForPairing(null);
    }
    
    const filterMessages = {
      'weather': 'Showing items suitable for current weather',
      'pairing': itemId ? `Showing items that pair well with selected item` : null,
      'olivia': "Showing Olivia's suggested pairings for your style"
    };

    const message = filterMessages[filterType as keyof typeof filterMessages];
    if (message) toast.success(message);
  };

  const filteredAndSortedItems = sortItems(
    applySmartFilter(
      filterItemsByCategory(items, selectedCategory),
      smartFilter,
      itemForPairing,
      outfits
    ),
    sortOption
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden max-w-[100vw]">
      <Header />
      
      {showConfetti && (
        <Confetti 
          duration={2000}
          onComplete={() => setShowConfetti(false)}
        />
      )}
      
      <main className="w-full px-3 sm:px-4 pt-24 pb-16 max-w-full overflow-hidden">
        <motion.div 
          className="space-y-8 max-w-full"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-col lg:flex-row items-center gap-6 mb-12 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Your Digital Wardrobe
              </h1>
              <p className="text-base md:text-lg text-white/80 mb-6">
                Browse, organize, and visualize your clothes collection with powerful AI-driven insights.
              </p>
              <div className="flex flex-wrap gap-3">
                <div id="upload-button">
                  <UploadModal onUpload={handleUpload} />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-purple-400/30 text-white hover:bg-white/10"
                    >
                      <Shirt className="mr-2 h-4 w-4" /> Wardrobe Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-900/95 backdrop-blur-md border-slate-700/50 text-white w-56">
                    <DropdownMenuItem 
                      onClick={toggleSelectionMode}
                      className="focus:bg-slate-800"
                    >
                      {isSelectionMode ? (
                        <>
                          <X className="mr-2 h-4 w-4 text-purple-400" />
                          Exit Selection Mode
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4 text-purple-400" />
                          Enter Selection Mode
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleClearWardrobe}
                      className="text-red-400 focus:text-red-300 focus:bg-red-950/30"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Wardrobe
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          </div>

          <motion.div 
            variants={itemVariants} 
            className="flex flex-col w-full"
          >
            <div className="flex flex-wrap justify-between items-center mb-6 md:mb-10 w-full">
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  {user?.email ? `Hi ${user.email.split('@')[0]}, here's your wardrobe` : "My Wardrobe"}
                  {selectedCategory && (
                    <span className="ml-2 text-lg md:text-xl text-white/90">
                      (<span className="capitalize">{selectedCategory}</span>)
                    </span>
                  )}
                </h2>
                <div className="h-1 w-3/4 mt-2 bg-gradient-to-r from-blue-400/70 via-purple-400/70 to-pink-400/70 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
              </div>
            </div>

            <WardrobeFilters
              smartFilter={smartFilter}
              onApplySmartFilter={handleSmartFilter}
              itemForPairing={itemForPairing}
            />

            <div className="flex justify-end mb-6">
              <WardrobeControls
                viewMode={viewMode}
                showCompactView={showCompactView}
                onViewModeChange={setViewMode}
                onCompactViewChange={setShowCompactView}
              />
            </div>

            <WardrobeGrid
              items={filteredAndSortedItems}
              onToggleFavorite={handleToggleFavorite}
              onMatchItem={handleMatchItem}
              onDeleteItem={handleDeleteItem}
              compactView={showCompactView}
              selectable={isSelectionMode}
              selectedItems={selectedItems}
              onToggleSelect={handleToggleSelect}
            />
          </motion.div>
        </motion.div>
      </main>

      {selectedItemForMatch && (
        <OutfitMatchModal
          open={matchModalOpen}
          onOpenChange={setMatchModalOpen}
          item={selectedItemForMatch}
          allItems={items}
        />
      )}

      <AlertDialog open={clearWardrobeDialogOpen} onOpenChange={setClearWardrobeDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Clear entire wardrobe?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This will remove all items from your wardrobe. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmClearWardrobe}
            >
              Clear Wardrobe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyWardrobe;
