import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Plus, Filter, Check, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

import WardrobeGrid from '@/components/WardrobeGrid';
import WardrobeSearch from '@/components/wardrobe/WardrobeSearch';
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
import WardrobeStats from '@/components/wardrobe/WardrobeStats';
import OliviaSuggests from '@/components/wardrobe/OliviaSuggests';
import WardrobeGaps from '@/components/wardrobe/WardrobeGaps';
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
  
  // State to prevent unnecessary refreshes
  const [cachedItems, setCachedItems] = useState<ClothingItem[]>([]);
  const [cachedFilteredItems, setCachedFilteredItems] = useState<ClothingItem[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Cache clothing items whenever they change
  useEffect(() => {
    if (clothingItems.length > 0 && isInitialLoad) {
      setCachedItems(clothingItems);
      setIsInitialLoad(false);
    } else if (!isLoadingItems && !isInitialLoad) {
      setCachedItems(clothingItems);
    }
  }, [clothingItems, isLoadingItems, isInitialLoad]);

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
    const categories = cachedItems.map(item => item.type || item.category || '').filter(Boolean);
    return [...new Set(categories)];
  };
  
  const getUniqueColors = () => {
    const colors = cachedItems.map(item => item.color || '').filter(Boolean);
    return [...new Set(colors)];
  };
  
  // Handle search query changes
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  
  // Apply filters and search to the clothing items
  const applyFilters = useCallback(() => {
    let filtered = [...cachedItems];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const nameMatch = item.name?.toLowerCase().includes(query);
        const typeMatch = item.type?.toLowerCase().includes(query);
        const colorMatch = item.color?.toLowerCase().includes(query);
        const seasonMatch = item.season?.some(s => s.toLowerCase().includes(query));
        
        return nameMatch || typeMatch || colorMatch || seasonMatch;
      });
    }
    
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
    
    setFilterApplied(!!searchQuery || !!categoryFilter || !!colorFilter || !!seasonFilter || !!sortOrder);
    setCachedFilteredItems(filtered);
    setFilteredItems(filtered);
  }, [cachedItems, searchQuery, categoryFilter, colorFilter, seasonFilter, sortOrder]);
  
  // Apply filters when any filter option changes or search query changes
  useEffect(() => {
    if (cachedItems.length > 0) {
      applyFilters();
    }
  }, [applyFilters, cachedItems, searchQuery, categoryFilter, colorFilter, seasonFilter, sortOrder]);
  
  // Reset all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter(null);
    setColorFilter(null);
    setSeasonFilter(null);
    setSortOrder(null);
    setFilterApplied(false);
    setFilteredItems(cachedItems);
  };

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
    if (isAuthenticated && !isLoadingItems && cachedItems.length === 0) {
      return (
        <div className="text-center p-10 border border-dashed border-white/20 rounded-xl bg-slate-900/30 mt-6">
          <h3 className="text-xl font-medium text-white mb-2">Your Wardrobe is Empty</h3>
          <p className="text-white/70 mb-6">Add your first clothing item to get started.</p>
          <UploadModal onUpload={handleAddItem} buttonText="Add Your First Item">
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Your First Item
            </Button>
          </UploadModal>
        </div>
      );
    }
    return null;
  };

  // Render search and stats section
  const renderSearchAndStats = () => {
    return (
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1">
          <WardrobeSearch onSearch={handleSearch} />
        </div>
        <div className="flex-shrink-0">
          <WardrobeStats />
        </div>
      </div>
    );
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
  
  // Render "Add More" section at bottom of grid
  const renderAddMoreSection = () => {
    if (!isAuthenticated || isLoadingItems || cachedItems.length === 0) {
      return null;
    }
    
    return (
      <div className="mt-12 py-8 border-t border-white/10 text-center">
        <h3 className="text-lg font-medium text-white mb-4">Want to add more to your wardrobe?</h3>
        <UploadModal onUpload={handleAddItem}>
          <Button
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Clothing Item
          </Button>
        </UploadModal>
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
            variant: "primary",
            component: (
              <UploadModal onUpload={handleAddItem} buttonText="Add Clothing Item">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Clothing Item
                </Button>
              </UploadModal>
            )
          }
        ]}
      />
      
      <div className="container mx-auto px-4 pt-6">
        {renderAuthNotice()}
        
        <div className="space-y-4">
          {/* Search Bar and Stats Button */}
          {renderSearchAndStats()}
          
          <WardrobeControls 
            viewMode={viewMode}
            showCompactView={showCompactView}
            onViewModeChange={setViewMode}
            onCompactViewChange={setShowCompactView}
          />
        </div>
        
        {/* Olivia Suggests Section - Only shows if there's a relevant suggestion */}
        {isAuthenticated && !isLoadingItems && cachedItems.length > 0 && (
          <OliviaSuggests items={cachedItems} />
        )}
        
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {showFilters && (
            <EnhancedWardrobeFilters
              onFilterChange={handleFilterChange}
              totalItems={cachedItems.length}
              filteredCount={filteredItems.length}
            />
          )}
          
          {renderFilterBar()}
        </motion.div>
        
        {filterApplied && cachedItems.length > 0 && (
          <div className="text-sm text-gray-400 mt-2 mb-4">
            {filteredItems.length} items match your filters.
          </div>
        )}
        
        {showInsights && cachedItems.length > 0 && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WardrobeInsights items={cachedItems} />
          </motion.div>
        )}
        
        {renderEmptyState()}
        
        {isLoadingItems && cachedItems.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">Loading your wardrobe...</div>
        ) : cachedItems.length > 0 ? (
          <div>
            <WardrobeGrid 
              items={filterApplied ? filteredItems : cachedItems} 
              onDeleteItem={handleDeleteItem}
              onToggleFavorite={handleToggleFavorite}
              onMatchItem={handleMatchItem}
              viewMode={viewMode}
              compactView={showCompactView}
            />
            
            {/* Wardrobe Gaps Section - Only shows if relevant */}
            <WardrobeGaps items={cachedItems} />
            
            {/* Add More section at bottom of grid */}
            {renderAddMoreSection()}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MyWardrobe;
