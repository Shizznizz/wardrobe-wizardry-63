import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import WardrobeGrid from '@/components/WardrobeGrid';
import OliviaBloomAdvisor from '@/components/OliviaBloomAdvisor';
import OliviaBloomAssistant from '@/components/OliviaBloomAssistant';
import OliviaTips from '@/components/OliviaTips';
import UploadModal from '@/components/UploadModal';
import { ClothingItem, ClothingType, Outfit } from '@/lib/types';
import { sampleClothingItems, sampleOutfits, sampleUserPreferences } from '@/lib/wardrobeData';
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
  Puzzle
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

const Wardrobe = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showUploadTip, setShowUploadTip] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasAddedItem, setHasAddedItem] = useState(false);
  const [sortOption, setSortOption] = useState<'newest' | 'favorites' | 'most-worn' | 'color' | 'most-matched' | 'weather-fit' | 'not-recent'>('newest');
  const [showCompactView, setShowCompactView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ClothingType | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [selectedItemForMatch, setSelectedItemForMatch] = useState<ClothingItem | null>(null);
  const [clearWardrobeDialogOpen, setClearWardrobeDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ClothingItem | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [smartFilter, setSmartFilter] = useState<string | null>(null);
  const [itemForPairing, setItemForPairing] = useState<string | null>(null);

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

  useEffect(() => {
    if (!isLoading && items) {
      localStorage.setItem('wardrobeItems', JSON.stringify(items));
    }
  }, [items, isLoading]);
  
  useEffect(() => {
    if (!isLoading && outfits) {
      localStorage.setItem('outfits', JSON.stringify(outfits));
    }
  }, [outfits, isLoading]);
  
  useEffect(() => {
    if (selectedCategory !== null) {
      setIsSelectionMode(false);
      setSelectedItems([]);
    }
  }, [selectedCategory]);

  const handleToggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };
  
  const handleCreateOutfit = (name: string, itemIds: string[]) => {
    const newOutfit: Outfit = {
      id: `outfit-${Date.now()}`,
      name,
      items: itemIds,
      occasion: 'casual',
      season: [],
      occasions: [],
      seasons: [],
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
    };
    
    setOutfits(prev => [newOutfit, ...prev]);
    setSelectedItems([]);
    setIsSelectionMode(false);
    
    toast.success(`Outfit "${name}" created successfully!`, {
      description: `Created with ${itemIds.length} item${itemIds.length !== 1 ? 's' : ''}`
    });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleUpload = (newItem: ClothingItem) => {
    setItems(prev => [newItem, ...prev]);
    toast.success('New item added to your wardrobe!');
    setShowUploadTip(true);
    
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

  const handleEditItem = (item: ClothingItem) => {
    setItemToEdit(item);
    setEditModalOpen(true);
    toast.info(`Editing ${item.name} would open an edit modal`);
  };

  const handleClearWardrobe = () => {
    setClearWardrobeDialogOpen(true);
  };

  const confirmClearWardrobe = () => {
    setItems([]);
    setClearWardrobeDialogOpen(false);
    toast.success("Your wardrobe has been cleared");
  };

  const handleCategorySelect = (category: ClothingType | null) => {
    setSelectedCategory(category);
    if (category) {
      toast.success(`Showing ${category} items`);
    } else {
      toast.success('Showing all items');
    }
    setCategoryModalOpen(false);
  };

  const handleMatchItem = (item: ClothingItem) => {
    setSelectedItemForMatch(item);
    setMatchModalOpen(true);
  };
  
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedItems([]);
    }
  };
  
  const applySmartFilter = (filterType: string, itemId?: string) => {
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
    
    switch (filterType) {
      case 'weather':
        toast.success('Showing items suitable for current weather');
        break;
      case 'pairing':
        if (itemId) {
          const item = items.find(i => i.id === itemId);
          if (item) {
            toast.success(`Showing items that pair well with "${item.name}"`);
          }
        }
        break;
      case 'olivia':
        toast.success("Showing Olivia's suggested pairings for your style");
        break;
    }
  };

  const applyFilters = () => {
    let filteredItems = [...items];
    
    if (selectedCategory) {
      filteredItems = filteredItems.filter(item => item.type === selectedCategory);
    }
    
    if (smartFilter) {
      switch (smartFilter) {
        case 'weather':
          const currentSeason: 'winter' | 'spring' | 'summer' | 'autumn' = 'spring';
          filteredItems = filteredItems.filter(item => 
            item.season && Array.isArray(item.season) && 
            (item.season.includes(currentSeason) || item.season.includes('all'))
          );
          break;
          
        case 'pairing':
          if (itemForPairing) {
            const relevantOutfits = outfits.filter(outfit => 
              outfit.items && Array.isArray(outfit.items) &&
              outfit.items.includes(itemForPairing)
            );
            
            const pairingItemIds = new Set<string>();
            relevantOutfits.forEach(outfit => {
              if (outfit.items && Array.isArray(outfit.items)) {
                outfit.items.forEach(id => {
                  if (id !== itemForPairing) {
                    pairingItemIds.add(id);
                  }
                });
              }
            });
            
            filteredItems = filteredItems.filter(item => 
              pairingItemIds.has(item.id) || item.id === itemForPairing
            );
          }
          break;
          
        case 'olivia':
          const popularColors = ['black', 'white', 'blue', 'gray'];
          const versatileTypes = ['shirt', 'jeans', 'sneakers', 'sweater'];
          
          filteredItems = filteredItems.filter(item => 
            (item.color && popularColors.includes(item.color)) || 
            (item.type && versatileTypes.includes(item.type)) ||
            item.favorite
          );
          break;
      }
    }
    
    return [...filteredItems].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime();
        case 'favorites':
          return Number(b.favorite || false) - Number(a.favorite || false);
        case 'most-worn':
          return (b.timesWorn || 0) - (a.timesWorn || 0);
        case 'color':
          return (a.color || '').localeCompare(b.color || '');
        case 'most-matched':
          return (b.timesWorn || 0) - (a.timesWorn || 0);
        case 'weather-fit':
          const currentSeason: 'winter' | 'spring' | 'summer' | 'autumn' = 'spring';
          return (b.season && Array.isArray(b.season) && b.season.includes(currentSeason)) ? -1 : 1;
        case 'not-recent':
          return (a.timesWorn || 0) - (b.timesWorn || 0);
        default:
          return 0;
      }
    });
  };

  const sortedItems = applyFilters();

  const getPersonalizedGreeting = () => {
    if (user?.user_metadata?.name) {
      return `Hi ${user.user_metadata.name}, here's your wardrobe`;
    }
    return "My Wardrobe";
  };

  const getSortLabel = (option: string) => {
    switch(option) {
      case 'newest': return 'Newest First';
      case 'favorites': return 'Favorites';
      case 'most-worn': return 'Most Worn';
      case 'color': return 'By Color';
      case 'most-matched': return 'Most Matched';
      case 'weather-fit': return 'Weather Fit';
      case 'not-recent': return 'Not Recent';
      default: return 'Sort';
    }
  };
  
  const getSmartFilterDescription = () => {
    if (!smartFilter) return null;
    
    switch (smartFilter) {
      case 'weather':
        return "Items suitable for today's weather";
      case 'pairing':
        if (itemForPairing) {
          const item = items.find(i => i.id === itemForPairing);
          return item ? `Items that pair well with "${item.name}"` : null;
        }
        return null;
      case 'olivia':
        return "Olivia's personal styling suggestions";
      default:
        return null;
    }
  };

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
          
          <motion.div id="upload-section" variants={itemVariants} className="flex flex-col w-full">
            <div className="flex flex-wrap justify-between items-center mb-6 md:mb-10 w-full">
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  {getPersonalizedGreeting()}
                  {selectedCategory && (
                    <span className="ml-2 text-lg md:text-xl text-white/90">
                      (<span className="capitalize">{selectedCategory}</span>)
                    </span>
                  )}
                </h2>
                <div className="h-1 w-3/4 mt-2 bg-gradient-to-r from-blue-400/70 via-purple-400/70 to-pink-400/70 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                <p className="mt-3 text-gray-400 text-sm md:text-base font-light">
                  Your digital closet, always in style
                </p>
              </div>
              
              {selectedCategory && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="border-indigo-400/30 text-white hover:bg-white/10 mr-2 mt-2 md:mt-0"
                >
                  <X className="h-4 w-4 mr-1" /> Clear Filter
                </Button>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 mb-6 md:mb-10 gap-3 w-full">
              {isMobile ? (
                <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-full backdrop-blur-sm border border-white/5 shadow-md overflow-x-auto max-w-full hide-scrollbar">
                  <Badge variant="gradient" className="mr-1 whitespace-nowrap flex-shrink-0">
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1 text-white" />
                    <span>Sort</span>
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs h-8 rounded-full bg-slate-800/40 border-slate-700/30">
                        {getSortLabel(sortOption)}
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-900/95 backdrop-blur-md border-slate-700/50 text-white">
                      <DropdownMenuItem onClick={() => setSortOption('newest')} className="focus:bg-slate-800">
                        Newest First
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption('favorites')} className="focus:bg-slate-800">
                        Favorites
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption('most-worn')} className="focus:bg-slate-800">
                        Most Worn
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption('color')} className="focus:bg-slate-800">
                        By Color
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption('most-matched')} className="focus:bg-slate-800">
                        Most Matched
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption('weather-fit')} className="focus:bg-slate-800">
                        Weather Fit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption('not-recent')} className="focus:bg-slate-800">
                        Not Recent
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-full backdrop-blur-sm border border-white/5 shadow-md overflow-x-auto max-w-full hide-scrollbar">
                  <Badge variant="gradient" className="mr-1 whitespace-nowrap flex-shrink-0">
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1 text-white" />
                    <span>Sort</span>
                  </Badge>
                  <ToggleGroup 
                    type="single" 
                    value={sortOption} 
                    onValueChange={(value) => value && setSortOption(value as any)}
                    className="bg-slate-800/40 rounded-full p-1 flex flex-nowrap overflow-x-auto hide-scrollbar"
                  >
                    <ToggleGroupItem value="newest" size="sm" className="text-xs h-8 rounded-full data-[state=on]:bg-gradient-to-r from-blue-500/80 to-purple-500/80 data-[state=on]:text-white transition-all duration-200 whitespace-nowrap">Newest</ToggleGroupItem>
                    <ToggleGroupItem value="favorites" size="sm" className="text-xs h-8 rounded-full data-[state=on]:bg-gradient-to-r from-blue-500/80 to-purple-500/80 data-[state=on]:text-white transition-all duration-200 whitespace-nowrap">Favorites</ToggleGroupItem>
                    <ToggleGroupItem value="most-worn" size="sm" className="text-xs h-8 rounded-full data-[state=on]:bg-gradient-to-r from-blue-500/80 to-purple-500/80 data-[state=on]:text-white transition-all duration-200 whitespace-nowrap">Most Worn</ToggleGroupItem>
                    <ToggleGroupItem value="color" size="sm" className="text-xs h-8 rounded-full data-[state=on]:bg-gradient-to-r from-blue-500/80 to-purple-500/80 data-[state=on]:text-white transition-all duration-200 whitespace-nowrap">By Color</ToggleGroupItem>
                    <ToggleGroupItem value="most-matched" size="sm" className="text-xs h-8 rounded-full data-[state=on]:bg-gradient-to-r from-blue-500/80 to-purple-500/80 data-[state=on]:text-white transition-all duration-200 whitespace-nowrap">Most Matched</ToggleGroupItem>
                    <ToggleGroupItem value="weather-fit" size="sm" className="text-xs h-8 rounded-full data-[state=on]:bg-gradient-to-r from-blue-500/80 to-purple-500/80 data-[state=on]:text-white transition-all duration-200 whitespace-nowrap">Weather Fit</ToggleGroupItem>
                    <ToggleGroupItem value="not-recent" size="sm" className="text-xs h-8 rounded-full data-[state=on]:bg-gradient-to-r from-blue-500/80 to-purple-500/80 data-[state=on]:text-white transition-all duration-200 whitespace-nowrap">Not Recent</ToggleGroupItem>
                  </ToggleGroup>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "border-purple-400/30 text-white hover:bg-white/10 flex items-center",
                          isSelectionMode && "bg-purple-500/20 border-purple-500/50"
                        )}
                        onClick={toggleSelectionMode}
                      >
                        {isSelectionMode ? (
                          <>
                            <X className="mr-1.5 h-3.5 w-3.5" />
                            <span>Exit Selection ({selectedItems.length})</span>
                          </>
                        ) : (
                          <>
                            <Check className="mr-1.5 h-3.5 w-3.5" />
                            <span>Select Items</span>
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white">
                      <p className="text-xs">
                        {isSelectionMode 
                          ? "Exit selection mode" 
                          : "Select multiple items to create an outfit"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ToggleGroup 
                        type="single" 
                        value={viewMode} 
                        onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}
                        className="bg-slate-900/60 p-1 rounded-full backdrop-blur-sm border border-white/10 shadow-md"
                      >
                        <ToggleGroupItem value="grid" className="rounded-full h-7 w-7 p-0 data-[state=on]:bg-gradient-to-r data-[state=on]:from-indigo-600 data-[state=on]:to-purple-600">
                          <Grid3X3 className="h-3.5 w-3.5" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="list" className="rounded-full h-7 w-7 p-0 data-[state=on]:bg-gradient-to-r data-[state=on]:from-indigo-600 data-[state=on]:to-purple-600">
                          <List className="h-3.5 w-3.5" />
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white">
                      <p className="text-xs">Toggle between grid and list view</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 bg-slate-900/60 p-2 pl-3 pr-4 rounded-full backdrop-blur-sm border border-white/10 shadow-md transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 group">
                        <Switch 
                          id="compact-view" 
                          checked={showCompactView} 
                          onCheckedChange={setShowCompactView} 
                          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600 data-[state=unchecked]:bg-slate-700/60"
                        />
                        <Label 
                          htmlFor="compact-view" 
                          className="text-xs font-medium text-gray-300 cursor-pointer transition-colors group-hover:text-white flex items-center gap-1.5"
                        >
                          <LayoutGrid className="h-3.5 w-3.5 text-gray-400 group-hover:text-indigo-300 transition-colors" />
                          Compact View
                        </Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900/90 border-white/10 text-white">
                      <p className="text-xs">Show simplified view with fewer tags and smaller images</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <motion.div 
              variants={itemVariants}
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-slate-900/50 p-3 sm:px-4 sm:py-3 rounded-xl backdrop-blur-sm border border-white/5 shadow-md">
                <div className="flex items-center mb-3">
                  <Puzzle className="h-4 w-4 text-purple-400 mr-2" />
                  <h3 className="text-sm font-medium text-white">Smart Filters</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "text-xs border-slate-700/50 hover:bg-slate-800/60",
                            smartFilter === 'weather' && "bg-slate-800/80 border-blue-500/50 text-blue-300"
                          )}
                          onClick={() => applySmartFilter('weather')}
                        >
                          <CloudSun className="mr-1.5 h-3.5 w-3.5" />
                          Wear again in similar weather
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white">
                        <p className="text-xs">Find items suitable for today's weather conditions</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <DropdownMenu>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn(
                                "text-xs border-slate-700/50 hover:bg-slate-800/60",
                                smartFilter === 'pairing' && "bg-slate-800/80 border-green-500/50 text-green-300"
                              )}
                            >
                              <Layers className="mr-1.5 h-3.5 w-3.5" />
                              Works well with
                              <ChevronDown className="ml-1 h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white">
                          <p className="text-xs">Find items that pair well with a specific piece</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <DropdownMenuContent 
                      className="bg-slate-900/95 backdrop-blur-md border-slate-700/50 text-white max-h-[300px] overflow-y-auto"
                    >
                      {items.length === 0 ? (
                        <div className="px-2 py-1.5 text-xs text-gray-400">No items available</div>
                      ) : (
                        items.map(item => (
                          <DropdownMenuItem 
                            key={item.id} 
                            onClick={() => applySmartFilter('pairing', item.id)}
                            className="focus:bg-slate-800 gap-2"
                          >
                            <div className="w-5 h-5 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="truncate">{item.name}</span>
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "text-xs border-slate-700/50 hover:bg-slate-800/60",
                            smartFilter === 'olivia' && "bg-slate-800/80 border-purple-500/50 text-purple-300"
                          )}
                          onClick={() => applySmartFilter('olivia')}
                        >
                          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                          Olivia's Suggested Pairings
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white">
                        <p className="text-xs">Olivia's AI-powered suggestions based on your style</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {getSmartFilterDescription() && (
                  <div className="mt-3 flex items-center text-xs text-indigo-300 bg-indigo-950/30 px-3 py-1.5 rounded-full border border-indigo-500/20">
                    <Info className="h-3 w-3 mr-1.5" />
                    {getSmartFilterDescription()}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-5 w-5 p-0 text-xs hover:bg-indigo-950/50 rounded-full"
                      onClick={() => {
                        setSmartFilter(null);
                        setItemForPairing(null);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
          
          {isLoading && (
            <motion.div variants={itemVariants} className="mb-10 w-full">
              <Card className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/20">
                <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-8 w-8 border-t-2 border-r-2 border-purple-300 rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-semibold mb-2">Loading your wardrobe...</h3>
                    <p className="text-gray-300">Please wait while we fetch your items.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {loadError && !isLoading && (
            <motion.div variants={itemVariants} className="mb-10 w-full">
              <Card className="bg-gradient-to-r from-red-950/60 to-purple-950/60 border border-red-500/20">
                <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-8 w-8 text-red-300" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-semibold mb-2">Error loading your wardrobe</h3>
                    <p className="text-gray-300 mb-4">{loadError}</p>
                    <Button 
                      variant="destructive" 
                      onClick={() => window.location.reload()}
                    >
                      Reload Page
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {!isLoading && !loadError && (items.length <= 2 || (selectedCategory && sortedItems.length === 0)) && (
            <motion.div variants={itemVariants} className="mb-10 w-full">
              <Card className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/20">
                <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-8 w-8 text-purple-300" />
                  </div>
                  <div className="text-center md:text-left">
                    {selectedCategory && sortedItems.length === 0 ? (
                      <>
                        <h3 className="text-xl font-semibold mb-2">No {selectedCategory} items found</h3>
                        <p className="text-gray-300 mb-4">Upload some {selectedCategory} items or choose a different category.</p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                          <UploadModal buttonText={`Add ${selectedCategory}`} onUpload={handleUpload} />
                          <Button 
                            variant="outline" 
                            className="border-purple-400/30 text-white hover:bg-white/10"
                            onClick={() => setSelectedCategory(null)}
                          >
                            Show All Items
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold mb-2">Let's start building your dream wardrobe!</h3>
                        <p className="text-gray-300 mb-4">Upload your favorite pieces to create fabulous outfit combinations.</p>
                        <UploadModal buttonText="Add Your First Item" onUpload={handleUpload} />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {!isLoading && !loadError && items.length > 0 && (
            <motion.div variants={itemVariants} className="glass-dark p-3 sm:p-6 rounded-xl border border-white/10 mt-6 w-full overflow-hidden">
              <WardrobeGrid 
                items={sortedItems} 
                onToggleFavorite={handleToggleFavorite}
                onMatchItem={handleMatchItem}
                onDeleteItem={handleDeleteItem}
                onEditItem={handleEditItem}
                compactView={showCompactView}
                selectable={isSelectionMode}
                selectedItems={selectedItems}
                onToggleSelect={handleToggleSelect}
                onCreateOutfit={handleCreateOutfit}
              />
            </motion.div>
          )}
        </motion.div>
      </main>
      
      {showUploadTip && (
        <OliviaBloomAssistant
          message={getOliviaTip()}
          type="celebration"
          timing="medium"
          actionText="Got it!"
          onAction={() => setShowUploadTip(false)}
          position="bottom-right"
        />
      )}
      
      <OliviaTips position="top-right" />
      
      <OliviaBloomAdvisor 
        items={sampleClothingItems}
        userPreferences={{
          favoriteColors: sampleUserPreferences.favoriteColors,
          favoriteStyles: sampleUserPreferences.favoriteStyles
        }}
        showChatButton={false}
      />
      
      {sortedItems.length > 0 && selectedItemForMatch && (
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
            <AlertDialogTitle>Clear your entire wardrobe?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This action will remove all clothing items from your wardrobe. This cannot be undone.
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

export default Wardrobe;
