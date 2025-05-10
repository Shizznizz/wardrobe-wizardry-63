import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import WardrobeGrid from '@/components/WardrobeGrid';
import WardrobeControls from '@/components/wardrobe/WardrobeControls';
import { ClothingItem } from '@/lib/types';
import UploadModal from '@/components/UploadModal';
import EnhancedWardrobeFilters from '@/components/wardrobe/EnhancedWardrobeFilters';
import WardrobeInsights from '@/components/wardrobe/WardrobeInsights';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';
import { WardrobeFilters } from '@/lib/wardrobe/enhancedFilterUtils';
import { useAuth } from '@/hooks/useAuth';
import { useWardrobeData } from '@/hooks/useWardrobeData';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const MyWardrobe = () => {
  const { isAuthenticated } = useAuth();
  const { clothingItems, isLoadingItems, addClothingItem, deleteClothingItem, updateClothingItem } = useWardrobeData();
  
  const [showFilters, setShowFilters] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
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
  
  const handleUploadNew = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your wardrobe");
      return;
    }
    setShowUploadModal(true);
  };

  const handleAddItem = (newItem: ClothingItem) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your wardrobe");
      return;
    }
    
    addClothingItem(newItem);
    setShowUploadModal(false);
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
  
  // Apply filters to the clothing items
  const applyFilters = (
    categories: string[],
    colors: string[],
    seasons: string[],
    occasions: string[],
    query: string
  ) => {
    setSelectedCategories(categories);
    setSelectedColors(colors);
    setSelectedSeasons(seasons);
    setSelectedOccasions(occasions);
    setSearchQuery(query);
    
    let filtered = [...clothingItems];
    
    // Apply category filter
    if (categories.length > 0) {
      filtered = filtered.filter(item => categories.includes(item.category || item.type || ''));
    }
    
    // Apply color filter
    if (colors.length > 0) {
      filtered = filtered.filter(item => colors.includes(item.color));
    }
    
    // Apply season filter
    if (seasons.length > 0) {
      filtered = filtered.filter(item => {
        if (Array.isArray(item.season)) {
          return item.season.some(s => seasons.includes(s));
        }
        return false;
      });
    }
    
    // Apply occasion filter
    if (occasions.length > 0) {
      filtered = filtered.filter(item => {
        if (item.occasions) {
          return item.occasions.some(occasion => occasions.includes(occasion));
        }
        return false;
      });
    }
    
    // Apply search query
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(lowerCaseQuery) || 
        item.brand?.toLowerCase().includes(lowerCaseQuery) ||
        item.category?.toLowerCase().includes(lowerCaseQuery) ||
        item.type?.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    setFilterApplied(categories.length > 0 || colors.length > 0 || seasons.length > 0 || occasions.length > 0 || !!query);
    setFilteredItems(filtered);
  };

  // Convert our applyFilters function to match the expected WardrobeFilters interface
  const handleFilterChange = (filters: WardrobeFilters) => {
    const categoryArray = filters.category ? [filters.category] : [];
    const colorArray = filters.color ? [filters.color] : [];
    const seasonArray = selectedSeasons; 
    const occasionArray = filters.occasion ? [filters.occasion] : [];
    const query = filters.searchQuery || '';
    
    applyFilters(categoryArray, colorArray, seasonArray, occasionArray, query);
  };
  
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSeasons([]);
    setSelectedOccasions([]);
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
          },
          {
            label: "Wardrobe Options",
            onClick: handleToggleFilters,
            variant: "neutral",
            className: "bg-slate-800 hover:bg-slate-700"
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
        </motion.div>
        
        {filterApplied && clothingItems.length > 0 && (
          <div className="text-sm text-gray-400 mt-2">
            {filteredItems.length} items match your filters. <button onClick={clearAllFilters} className="underline">Clear Filters</button>
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
      </div>
      
      <UploadModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleAddItem}
        buttonText="Add Item"
      />
    </div>
  );
};

export default MyWardrobe;
