import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { ClothingItem } from '@/lib/types';
import { WardrobeFilters } from '@/lib/wardrobe/enhancedFilterUtils';
import { useAuth } from '@/hooks/useAuth';
import { useWardrobeData } from '@/hooks/useWardrobeData';

import WardrobeGrid from '@/components/WardrobeGrid';
import WardrobeControls from '@/components/wardrobe/WardrobeControls';
import WardrobeHeroSection from '@/components/wardrobe/WardrobeHeroSection';
import FilterDropdownBar from '@/components/wardrobe/FilterDropdownBar';
import FloatingAddButton from '@/components/FloatingAddButton';
import UploadModal from '@/components/UploadModal';
import WardrobeInsights from '@/components/wardrobe/WardrobeInsights';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const MyWardrobe = () => {
  const { isAuthenticated } = useAuth();
  const { clothingItems, isLoadingItems, addClothingItem, deleteClothingItem, updateClothingItem } = useWardrobeData();
  
  const [showFilters, setShowFilters] = useState(false);
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInsights, setShowInsights] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCompactView, setShowCompactView] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  // Filter states - new implementation
  const [activeFilters, setActiveFilters] = useState({
    season: [] as string[],
    type: [] as string[],
    color: [] as string[],
    sortBy: 'newest'
  });

  const handleUploadNew = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your wardrobe");
      return;
    }
    setUploadModalOpen(true);
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
  
  // Apply new filters from the dropdown bar
  const handleFilterChange = (filters: {
    season?: string[],
    type?: string[],
    color?: string[],
    sortBy?: string
  }) => {
    let filtered = [...clothingItems];
    
    // Apply season filter
    if (filters.season && filters.season.length > 0) {
      filtered = filtered.filter(item => {
        if (Array.isArray(item.season)) {
          return item.season.some(s => filters.season?.includes(s)) || item.season.includes('all');
        }
        return false;
      });
    }
    
    // Apply type filter
    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(item => filters.type?.includes(item.type));
    }
    
    // Apply color filter
    if (filters.color && filters.color.length > 0) {
      filtered = filtered.filter(item => filters.color?.includes(item.color));
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filtered = sortItems(filtered, filters.sortBy);
    }
    
    const hasActiveFilters = 
      (filters.season && filters.season.length > 0) || 
      (filters.type && filters.type.length > 0) || 
      (filters.color && filters.color.length > 0);
      
    setFilterApplied(hasActiveFilters);
    setFilteredItems(filtered);
  };
  
  const sortItems = (items: ClothingItem[], sortBy: string): ClothingItem[] => {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime();
        case 'oldest':
          return new Date(a.dateAdded || 0).getTime() - new Date(b.dateAdded || 0).getTime();
        case 'favorites':
          return Number(b.favorite || false) - Number(a.favorite || false);
        case 'most-worn':
          return (b.timesWorn || 0) - (a.timesWorn || 0);
        default:
          return 0;
      }
    });
  };

  // Convert our old applyFilters function to match the expected WardrobeFilters interface
  const handleLegacyFilterChange = (filters: WardrobeFilters) => {
    const categoryArray = filters.category ? [filters.category] : [];
    const colorArray = filters.color ? [filters.color] : [];
    const seasonArray = []; 
    const occasionArray = filters.occasion ? [filters.occasion] : [];
    const query = filters.searchQuery || '';
    
    // applyFilters(categoryArray, colorArray, seasonArray, occasionArray, query);
  };
  
  const clearAllFilters = () => {
    // setSelectedCategories([]);
    // setSelectedColors([]);
    // setSelectedSeasons([]);
    // setSelectedOccasions([]);
    setSearchQuery('');
    setFilteredItems([]);
    setFilterApplied(false);
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
          {/* <Button 
            onClick={handleUploadNew}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Your First Item
          </Button> */}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white pb-20">
      <WardrobeHeroSection 
        onUploadClick={handleUploadNew} 
        onToggleFilters={handleToggleFilters}
      />
      
      <div className="container mx-auto px-4">
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
            <FilterDropdownBar 
              onFilterChange={handleFilterChange}
              totalItems={clothingItems.length}
            />
          )}
        </motion.div>
        
        {showInsights && clothingItems.length > 0 && (
          <motion.div 
            className="mt-6 mb-6"
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
      </div>
      
      {/* Floating action button */}
      <FloatingAddButton onClick={handleUploadNew} />
      
      {/* Upload modal */}
      <UploadModal 
        onUpload={handleAddItem}
        buttonText="Add Item"
      />
    </div>
  );
};

export default MyWardrobe;
