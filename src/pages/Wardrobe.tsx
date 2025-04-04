import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import WardrobeGrid from '@/components/WardrobeGrid';
import OliviaBloomAdvisor from '@/components/OliviaBloomAdvisor';
import OliviaBloomAssistant from '@/components/OliviaBloomAssistant';
import OliviaTips from '@/components/OliviaTips';
import UploadModal from '@/components/UploadModal';
import { ClothingItem, ClothingType } from '@/lib/types';
import { sampleClothingItems, sampleOutfits, sampleUserPreferences } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { Confetti } from '@/components/ui/confetti';
import { ArrowUpDown, Info, Shirt, Sparkles, LayoutGrid, ArrowRight, X, ChevronDown, AlertCircle, Trash2 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import CategoryModal from '@/components/CategoryModal';
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
import { supabase } from '@/integrations/supabase/client';

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
      } catch (error) {
        console.error("Failed to load wardrobe items:", error);
        setLoadError("Failed to load your wardrobe items. Please try again later.");
        setItems(sampleClothingItems);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  useEffect(() => {
    if (window.location.hash === '#upload') {
      const uploadSection = document.getElementById('upload-section');
      if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: 'smooth' });
        const uploadButton = document.getElementById('upload-button');
        if (uploadButton) {
          uploadButton.click();
        }
      }
    }
  }, []);

  const getOliviaTip = () => {
    if (items.length <= 3) {
      return "I see you're just starting to build your wardrobe! Try adding a few essential pieces like a versatile top, a pair of jeans, and shoes to start creating outfits.";
    } else if (items.filter(item => item.favorite).length === 0) {
      return "Don't forget to mark your favorite pieces! This helps me understand your style preferences when suggesting outfits.";
    } else {
      return "Great addition to your wardrobe! I've updated your style profile. Why not try matching this with other pieces to create a new outfit?";
    }
  };

  const filteredItems = selectedCategory 
    ? items.filter(item => item.type === selectedCategory) 
    : items;

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case 'favorites':
        return Number(b.favorite) - Number(a.favorite);
      case 'most-worn':
        return b.timesWorn - a.timesWorn;
      case 'color':
        return a.color.localeCompare(b.color);
      case 'most-matched':
        return b.timesWorn - a.timesWorn;
      case 'weather-fit':
        const currentSeason: 'winter' | 'spring' | 'summer' | 'autumn' = 'spring';
        return b.seasons.includes(currentSeason) ? -1 : 1;
      case 'not-recent':
        return a.timesWorn - b.timesWorn;
      default:
        return 0;
    }
  });

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
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-purple-400/30 text-white hover:bg-white/10"
                  onClick={() => setCategoryModalOpen(true)}
                >
                  <ArrowRight className="mr-2 h-4 w-4" /> Browse Categories
                </Button>
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
              
              <div className="flex items-center">
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
      
      <CategoryModal 
        open={categoryModalOpen} 
        onOpenChange={setCategoryModalOpen}
        onSelectCategory={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

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
