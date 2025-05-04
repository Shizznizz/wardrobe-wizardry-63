
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { ClothingItem, Outfit, ClothingType, ClothingSeason, ClothingOccasion } from '@/lib/types';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import { supabase } from '@/integrations/supabase/client';
import { applyFilters, WardrobeFilters } from '@/lib/wardrobe/enhancedFilterUtils';
import Header from '@/components/Header';
import WardrobeGrid from '@/components/WardrobeGrid';
import WardrobeControls from '@/components/wardrobe/WardrobeControls';
import WardrobeInsights from '@/components/wardrobe/WardrobeInsights';
import WardrobeSearch from '@/components/wardrobe/WardrobeSearch';
import EnhancedWardrobeFilters from '@/components/wardrobe/EnhancedWardrobeFilters';
import UploadModal from '@/components/UploadModal';
import OutfitMatchModal from '@/components/OutfitMatchModal';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Confetti } from '@/components/ui/confetti';
import { Shirt, Sparkles, X, Check, Trash2, Upload } from 'lucide-react';
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
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasAddedItem, setHasAddedItem] = useState(false);
  const [showCompactView, setShowCompactView] = useState(false);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [selectedItemForMatch, setSelectedItemForMatch] = useState<ClothingItem | null>(null);
  const [clearWardrobeDialogOpen, setClearWardrobeDialogOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [temperature, setTemperature] = useState<number | undefined>(undefined);
  const [weatherCondition, setWeatherCondition] = useState<string | undefined>(undefined);
  const [profile, setProfile] = useState<{ first_name: string | null } | null>(null);
  const [filters, setFilters] = useState<WardrobeFilters>({
    category: null,
    color: null,
    occasion: null,
    timeFrame: 'all',
    favorite: null,
    weatherAppropriate: null,
    searchQuery: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    loadItems();
  }, [user, navigate]);

  const loadItems = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('clothing_items')
        .select('*')
        .eq('user_id', user.id)
        .order('date_added', { ascending: false });

      if (error) {
        console.error("Error loading items:", error);
        setLoadError("Failed to load your wardrobe items");
        return;
      }

      const formattedItems: ClothingItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        color: item.color,
        material: item.material || '',
        season: item.season || ['all'],
        occasions: item.occasions || ['casual'],
        favorite: item.favorite || false,
        imageUrl: item.image_url,
        image: item.image_url,
        timesWorn: item.times_worn || 0,
        dateAdded: new Date(item.date_added)
      }));

      setItems(formattedItems);
    } catch (error) {
      console.error("Failed to load wardrobe items:", error);
      setLoadError("Failed to load your wardrobe items. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setProfile(data);
          }
        });
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setTemperature(18);
        setWeatherCondition('clear');
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      }
    };
    
    fetchWeather();
  }, []);

  useEffect(() => {
    const applyAllFilters = () => {
      const filtered = applyFilters(items, { ...filters, searchQuery }, temperature, weatherCondition);
      setFilteredItems(filtered);
    };
    
    applyAllFilters();
  }, [items, filters, searchQuery, temperature, weatherCondition]);

  const handleUpload = async (newItem: ClothingItem) => {
    if (!user) {
      toast.error('Please sign in to add items');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clothing_items')
        .insert([{
          user_id: user.id,
          name: newItem.name,
          type: newItem.type,
          color: newItem.color,
          material: newItem.material,
          season: newItem.season,
          occasions: newItem.occasions,
          favorite: newItem.favorite,
          image_url: newItem.imageUrl || newItem.image,
          times_worn: 0
        }])
        .select()
        .single();

      if (error) throw error;

      const formattedItem: ClothingItem = {
        id: data.id,
        name: data.name,
        type: data.type,
        color: data.color,
        material: data.material || '',
        season: data.season || ['all'],
        occasions: data.occasions || ['casual'],
        favorite: data.favorite || false,
        imageUrl: data.image_url,
        image: data.image_url,
        timesWorn: data.times_worn || 0,
        dateAdded: new Date(data.date_added)
      };

      setItems(prevItems => [formattedItem, ...prevItems]);
      toast.success('New item added to your wardrobe!');
      
      if (!hasAddedItem) {
        setShowConfetti(true);
        setHasAddedItem(true);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item. Please try again.');
    }
  };

  const handleEditItem = async (updatedItem: ClothingItem) => {
    try {
      const { error } = await supabase
        .from('clothing_items')
        .update({
          name: updatedItem.name,
          type: updatedItem.type,
          color: updatedItem.color,
          material: updatedItem.material,
          season: updatedItem.season,
          occasions: updatedItem.occasions,
          favorite: updatedItem.favorite,
          image_url: updatedItem.imageUrl || updatedItem.image
        })
        .eq('id', updatedItem.id);

      if (error) throw error;

      setItems(prevItems =>
        prevItems.map(item =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      toast.success(`${updatedItem.name} has been updated`);
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clothing_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(items.filter(item => item.id !== id));
      toast.success('Item removed from your wardrobe');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item. Please try again.');
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const itemToUpdate = items.find(item => item.id === id);
    if (!itemToUpdate) return;

    try {
      const { error } = await supabase
        .from('clothing_items')
        .update({ favorite: !itemToUpdate.favorite })
        .eq('id', id);

      if (error) throw error;

      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, favorite: !item.favorite } : item
        )
      );

      toast.success(
        itemToUpdate.favorite 
          ? `${itemToUpdate.name} removed from favorites` 
          : `${itemToUpdate.name} added to favorites`
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite status. Please try again.');
    }
  };

  const handleMatchItem = (item: ClothingItem) => {
    setSelectedItemForMatch(item);
    setMatchModalOpen(true);
  };

  const handleClearWardrobe = () => {
    setClearWardrobeDialogOpen(true);
  };

  const confirmClearWardrobe = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('clothing_items')
        .delete()
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setItems([]);
      setClearWardrobeDialogOpen(false);
      toast.success("Your wardrobe has been cleared");
    } catch (error) {
      console.error('Error clearing wardrobe:', error);
      toast.error('Failed to clear wardrobe. Please try again.');
    }
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: WardrobeFilters) => {
    setFilters(newFilters);
  };

  const handleToggleFilter = (filterType: keyof WardrobeFilters, value: any) => {
    setFilters(prev => {
      // If the current filter value matches the clicked filter, clear it
      if (prev[filterType] === value) {
        return {
          ...prev,
          [filterType]: null
        };
      }
      // Otherwise, set the filter to the clicked value
      return {
        ...prev,
        [filterType]: value
      };
    });
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    console.log("Changing view mode to:", mode);
    setViewMode(mode);
  };

  const handleCompactViewChange = (show: boolean) => {
    console.log("Setting compact view to:", show);
    setShowCompactView(show);
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
      
      <main className="w-full px-3 sm:px-4 pt-20 pb-16 max-w-full overflow-hidden">
        <motion.div 
          className="space-y-8 max-w-full"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Updated PageHeader with a different mobile layout structure */}
          <PageHeader
            title="Your Digital Wardrobe"
            subtitle="Elevate your style with our AI-powered organization tools. Rediscover your fashion sense."
            showAvatar={true}
            imagePosition="right"
            isLeftAligned={true}
            className="mb-8 relative overflow-visible py-12 md:py-16"
            halfBodyImage="/lovable-uploads/c937b60e-901e-48ae-b01d-28d901a11503.png"
            animationStyle="slide"
            overlayEffect="glow"
            useCustomMobileLayout={true}
          >
            <div className="flex flex-wrap gap-3 mt-6 z-10 relative">
              <UploadModal onUpload={handleUpload}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 transition-all duration-300"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Add Clothing Item
                  </Button>
                </motion.div>
              </UploadModal>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-purple-400/30 text-white hover:bg-white/10"
                    >
                      <Shirt className="mr-2 h-4 w-4" /> Wardrobe Options
                    </Button>
                  </motion.div>
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
          </PageHeader>

          {/* Remove the redundant collection title since it's now in the PageHeader */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col w-full"
          >
            <WardrobeInsights items={items} />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6 pl-4">
              <div className="md:col-span-2">
                <WardrobeSearch onSearch={handleSearch} />
              </div>
              <div className="md:col-span-3 flex justify-start">
                <WardrobeControls
                  viewMode={viewMode}
                  showCompactView={showCompactView}
                  onViewModeChange={handleViewModeChange}
                  onCompactViewChange={handleCompactViewChange}
                />
              </div>
            </div>

            <EnhancedWardrobeFilters
              onFilterChange={handleFilterChange}
              totalItems={items.length}
              filteredCount={filteredItems.length}
              temperature={temperature}
              weatherCondition={weatherCondition}
              onToggleFilter={handleToggleFilter}
              currentFilters={filters}
            />

            <div className="mt-6 pl-4">
              {isLoading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                  <p className="text-white/70">Loading your wardrobe...</p>
                </div>
              ) : loadError ? (
                <div className="text-center py-10 text-red-400">
                  <p className="mb-2">{loadError}</p>
                  <Button 
                    variant="outline" 
                    onClick={loadItems} 
                    className="border-red-400 text-red-400 hover:bg-red-400/10"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <>
                  <WardrobeGrid
                    items={filteredItems}
                    onToggleFavorite={handleToggleFavorite}
                    onMatchItem={handleMatchItem}
                    onDeleteItem={handleDeleteItem}
                    onEditItem={handleEditItem}
                    compactView={showCompactView}
                    selectable={isSelectionMode}
                    selectedItems={selectedItems}
                    onToggleSelect={handleToggleSelect}
                    viewMode={viewMode}
                  />
                  
                  {filteredItems.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-lg text-white/70">No items found matching your filters</p>
                      <Button 
                        variant="link" 
                        className="text-purple-400 mt-2"
                        onClick={() => {
                          setFilters({
                            category: null,
                            color: null,
                            occasion: null,
                            timeFrame: 'all',
                            favorite: null,
                            weatherAppropriate: null,
                            searchQuery: ''
                          });
                          setSearchQuery('');
                        }}
                      >
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
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
