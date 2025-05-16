
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Plus, Filter, Check, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

import WardrobeGrid from '@/components/WardrobeGrid';
import WardrobeControls from '@/components/wardrobe/WardrobeControls';
import { ClothingItem, ClothingSeason } from '@/lib/types';
import UploadModal from '@/components/UploadModal';
import EnhancedWardrobeFilters from '@/components/wardrobe/EnhancedWardrobeFilters';
import WardrobeInsights from '@/components/wardrobe/WardrobeInsights';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';
import { WardrobeFilters } from '@/lib/wardrobe/enhancedFilterUtils';
import { useAuth } from '@/hooks/useAuth';
import { useWardrobeData } from '@/hooks/useWardrobeData';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MyWardrobe = () => {
  const { isAuthenticated } = useAuth();
  const { clothingItems, isLoadingItems, addClothingItem, deleteClothingItem, updateClothingItem } = useWardrobeData();
  
  const [showFilters, setShowFilters] = useState(false);
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInsights, setShowInsights] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCompactView, setShowCompactView] = useState(false);
  
  // New filter state
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [seasonFilter, setSeasonFilter] = useState<ClothingSeason | null>(null);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  
  const handleUploadNew = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your wardrobe");
      return;
    }
    // We'll let the UploadModal manage its own visibility
  };

  const handleAddItem = (newItem: ClothingItem) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your wardrobe");
      return;
    }
    
    addClothingItem(newItem);
    toast.success("New item added to your wardrobe!");
  };
  
  const handleDeleteItem = (itemId: string) => {
    deleteClothingItem(itemId);
  };
  
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleToggleInsights = () => {
    setShowInsights(!showInsights);
  };

  const handleToggleFavorite = (id: string) => {
    const item = clothingItems.find(item => item.id === id);
    if (item) {
      updateClothingItem(id, { favorite: !item.favorite });
      toast.success("Favorite status updated");
    }
  };

  const handleMatchItem = (item: ClothingItem) => {
    toast.success(`Finding matches for ${item.name}...`);
    // Match logic would be implemented here
  };
  
  // Get unique values for filters
  const getUniqueCategories = () => {
    const categories = clothingItems.map(item => item.type || item.category || '').filter(Boolean);
    return [...new Set(categories)];
  };
  
  const getUniqueColors = () => {
    const colors = clothingItems.map(item => item.color || '').filter(Boolean);
    return [...new Set(colors)];
  };
  
  // Apply filters to the clothing items
  const applyFilters = () => {
    let filtered = [...clothingItems];
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(item => item.type === categoryFilter || item.category === categoryFilter);
    }
    
    // Apply color filter
    if (colorFilter) {
      filtered = filtered.filter(item => item.color === colorFilter);
    }
    
    // Apply season filter
    if (seasonFilter) {
      filtered = filtered.filter(item => {
        if (Array.isArray(item.season)) {
          return item.season.includes(seasonFilter);
        }
        return false;
      });
    }
    
    // Apply sort order
    if (sortOrder) {
      switch(sortOrder) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime());
          break;
        case 'oldest':
          filtered.sort((a, b) => new Date(a.dateAdded || 0).getTime() - new Date(b.dateAdded || 0).getTime());
          break;
        case 'most-worn':
          filtered.sort((a, b) => (b.timesWorn || 0) - (a.timesWorn || 0));
          break;
        case 'name-asc':
          filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          break;
        case 'name-desc':
          filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
          break;
        default:
          break;
      }
    }
    
    setFilterApplied(!!categoryFilter || !!colorFilter || !!seasonFilter || !!sortOrder);
    setFilteredItems(filtered);
  };
  
  // Reset all filters
  const clearAllFilters = () => {
    setCategoryFilter(null);
    setColorFilter(null);
    setSeasonFilter(null);
    setSortOrder(null);
    setFilterApplied(false);
    setFilteredItems([]);
  };
  
  // Apply filters when any filter option changes
  React.useEffect(() => {
    applyFilters();
  }, [categoryFilter, colorFilter, seasonFilter, sortOrder, clothingItems]);

  // Convert our applyFilters function to match the expected WardrobeFilters interface
  const handleFilterChange = (filters: WardrobeFilters) => {
    const categoryArray = filters.category ? [filters.category] : [];
    const colorArray = filters.color ? [filters.color] : [];
    const seasonArray = selectedSeasons; 
    const occasionArray = filters.occasion ? [filters.occasion] : [];
    const query = filters.searchQuery || '';
    
    applyFilters();
  };
  
  // Show authentication notice if user is not logged in
  const renderAuthNotice = () => {
    if (!isAuthenticated) {
      return (
        <Alert variant="warning" className="mb-6 bg-amber-900/20 border-amber-500/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in to see your wardrobe items and save new ones.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };
  
  // Show empty state if authenticated but no items
  const renderEmptyState = () => {
    if (isAuthenticated && !isLoadingItems && clothingItems.length === 0) {
      return (
        <div className="text-center p-10 border border-dashed border-white/20 rounded-xl bg-slate-900/30 mt-6">
          <h3 className="text-xl font-medium text-white mb-2">Your Wardrobe is Empty</h3>
          <p className="text-white/70 mb-6">Add your first clothing item to get started.</p>
          <Button 
            onClick={handleUploadNew}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Your First Item
          </Button>
        </div>
      );
    }
    return null;
  };

  // Render filter bar
  const renderFilterBar = () => {
    const uniqueCategories = getUniqueCategories();
    const uniqueColors = getUniqueColors();
    const seasons: ClothingSeason[] = ['summer', 'winter', 'autumn', 'spring', 'all'];
    
    return (
      <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-slate-800/80 border-slate-700">
                Category {categoryFilter && <Check className="ml-1 h-3 w-3" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-slate-900 border-slate-700">
              <DropdownMenuLabel>Select Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {categoryFilter && (
                  <DropdownMenuItem 
                    className="text-red-400"
                    onClick={() => setCategoryFilter(null)}
                  >
                    Clear Selection
                  </DropdownMenuItem>
                )}
                {uniqueCategories.map(category => (
                  <DropdownMenuItem 
                    key={category}
                    className={categoryFilter === category ? "bg-purple-900/30" : ""}
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category} {categoryFilter === category && <Check className="ml-auto h-3 w-3" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-slate-800/80 border-slate-700">
                Color {colorFilter && <Check className="ml-1 h-3 w-3" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-slate-900 border-slate-700">
              <DropdownMenuLabel>Select Color</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {colorFilter && (
                  <DropdownMenuItem 
                    className="text-red-400"
                    onClick={() => setColorFilter(null)}
                  >
                    Clear Selection
                  </DropdownMenuItem>
                )}
                {uniqueColors.map(color => (
                  <DropdownMenuItem 
                    key={color}
                    className={colorFilter === color ? "bg-purple-900/30" : ""}
                    onClick={() => setColorFilter(color)}
                  >
                    {color} {colorFilter === color && <Check className="ml-auto h-3 w-3" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-slate-800/80 border-slate-700">
                Season {seasonFilter && <Check className="ml-1 h-3 w-3" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-slate-900 border-slate-700">
              <DropdownMenuLabel>Select Season</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {seasonFilter && (
                  <DropdownMenuItem 
                    className="text-red-400"
                    onClick={() => setSeasonFilter(null)}
                  >
                    Clear Selection
                  </DropdownMenuItem>
                )}
                {seasons.map(season => (
                  <DropdownMenuItem 
                    key={season}
                    className={seasonFilter === season ? "bg-purple-900/30" : ""}
                    onClick={() => setSeasonFilter(season)}
                  >
                    {season} {seasonFilter === season && <Check className="ml-auto h-3 w-3" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-slate-800/80 border-slate-700">
                Sort {sortOrder && <Check className="ml-1 h-3 w-3" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-slate-900 border-slate-700">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {sortOrder && (
                  <DropdownMenuItem 
                    className="text-red-400"
                    onClick={() => setSortOrder(null)}
                  >
                    Clear Sorting
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  className={sortOrder === 'newest' ? "bg-purple-900/30" : ""}
                  onClick={() => setSortOrder('newest')}
                >
                  Newest First {sortOrder === 'newest' && <Check className="ml-auto h-3 w-3" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={sortOrder === 'oldest' ? "bg-purple-900/30" : ""}
                  onClick={() => setSortOrder('oldest')}
                >
                  Oldest First {sortOrder === 'oldest' && <Check className="ml-auto h-3 w-3" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={sortOrder === 'most-worn' ? "bg-purple-900/30" : ""}
                  onClick={() => setSortOrder('most-worn')}
                >
                  Most Worn {sortOrder === 'most-worn' && <Check className="ml-auto h-3 w-3" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={sortOrder === 'name-asc' ? "bg-purple-900/30" : ""}
                  onClick={() => setSortOrder('name-asc')}
                >
                  Name (A-Z) {sortOrder === 'name-asc' && <Check className="ml-auto h-3 w-3" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={sortOrder === 'name-desc' ? "bg-purple-900/30" : ""}
                  onClick={() => setSortOrder('name-desc')}
                >
                  Name (Z-A) {sortOrder === 'name-desc' && <Check className="ml-auto h-3 w-3" />}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {filterApplied && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-sm bg-transparent border-red-500/30 text-red-400 hover:bg-red-900/20"
            onClick={clearAllFilters}
          >
            Clear All Filters
          </Button>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white pb-20">
      <EnhancedHeroSection
        title="Your Digital Wardrobe"
        subtitle="Elevate your style with our AI-powered wardrobe. Upload, organize, and rediscover your fashion favorites."
        image={{
          src: "/lovable-uploads/9d6d8627-f9d3-4af3-a5ec-7b2498799ab2.png",
          alt: "Woman in lilac open-back dress",
          variant: "portrait"
        }}
        buttons={[
          {
            label: "Add Clothing Item",
            onClick: handleUploadNew,
            variant: "primary"
          }
        ]}
      />
      
      <div className="container mx-auto px-4 pt-6">
        {renderAuthNotice()}
        
        <WardrobeControls 
          viewMode={viewMode}
          showCompactView={showCompactView}
          onViewModeChange={setViewMode}
          onCompactViewChange={setShowCompactView}
        />
        
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {showFilters && (
            <EnhancedWardrobeFilters
              onFilterChange={handleFilterChange}
              totalItems={clothingItems.length}
              filteredCount={filteredItems.length}
            />
          )}
          
          {renderFilterBar()}
        </motion.div>
        
        {filterApplied && clothingItems.length > 0 && (
          <div className="text-sm text-gray-400 mt-2 mb-4">
            {filteredItems.length} items match your filters.
          </div>
        )}
        
        {showInsights && clothingItems.length > 0 && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WardrobeInsights items={clothingItems} />
          </motion.div>
        )}
        
        {renderEmptyState()}
        
        {isLoadingItems ? (
          <div className="text-center text-gray-400 mt-10">Loading your wardrobe...</div>
        ) : clothingItems.length > 0 ? (
          <WardrobeGrid 
            items={filterApplied ? filteredItems : clothingItems} 
            onDeleteItem={handleDeleteItem}
            onToggleFavorite={handleToggleFavorite}
            onMatchItem={handleMatchItem}
            viewMode={viewMode}
            compactView={showCompactView}
          />
        ) : null}
        
        <div className="flex justify-center mt-10">
          <Button 
            onClick={handleUploadNew}
            className="px-6 py-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            <Plus className="mr-2 h-5 w-5" /> Add Item
          </Button>
        </div>
      </div>
      
      {/* Using UploadModal */}
      <UploadModal 
        onUpload={handleAddItem}
        buttonText="Add Item"
      />
    </div>
  );
};

export default MyWardrobe;
