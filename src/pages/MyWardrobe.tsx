import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import WardrobeGrid from '@/components/WardrobeGrid';
import WardrobeControls from '@/components/wardrobe/WardrobeControls';
import { ClothingItem } from '@/lib/types';
import { sampleClothingItems } from '@/lib/wardrobeData';
import UploadModal from '@/components/UploadModal';
import EnhancedWardrobeFilters from '@/components/wardrobe/EnhancedWardrobeFilters';
import WardrobeInsights from '@/components/wardrobe/WardrobeInsights';
import HeroSection from '@/components/shared/HeroSection';
import { WardrobeFilters } from '@/lib/wardrobe/enhancedFilterUtils';

const MyWardrobe = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
  
  useEffect(() => {
    const loadItems = () => {
      setIsLoading(true);
      try {
        const savedItems = localStorage.getItem('wardrobeItems');
        if (savedItems) {
          setItems(JSON.parse(savedItems));
          setFilteredItems(JSON.parse(savedItems));
        } else {
          setItems(sampleClothingItems);
          setFilteredItems(sampleClothingItems);
          localStorage.setItem('wardrobeItems', JSON.stringify(sampleClothingItems));
        }
      } catch (error) {
        console.error("Failed to load wardrobe data:", error);
        setItems(sampleClothingItems);
        setFilteredItems(sampleClothingItems);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);
  
  const handleUploadNew = () => {
    setShowUploadModal(true);
  };

  const handleAddItem = (newItem: ClothingItem) => {
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setFilteredItems(updatedItems);
    localStorage.setItem('wardrobeItems', JSON.stringify(updatedItems));
    setShowUploadModal(false);
    toast.success("New item added to your wardrobe!");
  };
  
  const handleDeleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    setFilteredItems(updatedItems);
    localStorage.setItem('wardrobeItems', JSON.stringify(updatedItems));
    toast.success("Item removed from your wardrobe");
  };
  
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleToggleInsights = () => {
    setShowInsights(!showInsights);
  };

  const handleToggleFavorite = (id: string) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        return {...item, favorite: !item.favorite};
      }
      return item;
    });
    setItems(updatedItems);
    setFilteredItems(updatedItems);
    localStorage.setItem('wardrobeItems', JSON.stringify(updatedItems));
    toast.success("Favorite status updated");
  };

  const handleMatchItem = (item: ClothingItem) => {
    toast.success(`Finding matches for ${item.name}...`);
    // Implement actual matching logic here
  };
  
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
    
    let filtered = [...items];
    
    // Apply category filter
    if (categories.length > 0) {
      filtered = filtered.filter(item => categories.includes(item.category || ''));
    }
    
    // Apply color filter - fix for color/colors mismatch
    if (colors.length > 0) {
      filtered = filtered.filter(item => colors.includes(item.color));
    }
    
    // Apply season filter - fix for season/seasons mismatch
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
        item.category?.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    setFilterApplied(categories.length > 0 || colors.length > 0 || seasons.length > 0 || occasions.length > 0 || !!query);
    setFilteredItems(filtered);
  };

  // Convert our applyFilters function to match the expected WardrobeFilters interface
  const handleFilterChange = (filters: WardrobeFilters) => {
    const categoryArray = filters.category ? [filters.category] : [];
    const colorArray = filters.color ? [filters.color] : [];
    // Fix: Use filters.occasion for seasons as a workaround since we don't have a seasons property
    // We'll use selectedSeasons state for storing seasons
    const seasonArray = selectedSeasons; // Keep using the existing state
    const occasionArray = filters.occasion ? [filters.occasion] : [];
    const query = filters.searchQuery || '';
    
    // Call our existing function with extracted values
    applyFilters(categoryArray, colorArray, seasonArray, occasionArray, query);
  };
  
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSeasons([]);
    setSelectedOccasions([]);
    setSearchQuery('');
    setFilteredItems(items);
    setFilterApplied(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white pb-20">
      <HeroSection
        title="Your Digital Wardrobe"
        subtitle="Elevate your style with our AI-powered organization tools. Rediscover your fashion sense."
        image={{
          src: "/lovable-uploads/e1aaa230-1623-42c4-ab9f-eb7c5f103ebe.png",
          alt: "Olivia your AI Fashion Assistant"
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
            variant: "secondary",
            className: "bg-slate-800 hover:bg-slate-700"
          }
        ]}
      />
      
      {/* Rest of wardrobe content */}
      <div className="container mx-auto px-4 pt-6">
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
              totalItems={items.length}
              filteredCount={filteredItems.length}
            />
          )}
        </motion.div>
        
        {filterApplied && (
          <div className="text-sm text-gray-400 mt-2">
            {filteredItems.length} items match your filters. <button onClick={clearAllFilters} className="underline">Clear Filters</button>
          </div>
        )}
        
        {showInsights && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WardrobeInsights items={items} />
          </motion.div>
        )}
        
        {isLoading ? (
          <div className="text-center text-gray-400 mt-10">Loading wardrobe...</div>
        ) : (
          <WardrobeGrid 
            items={filterApplied ? filteredItems : items} 
            onDeleteItem={handleDeleteItem}
            onToggleFavorite={handleToggleFavorite}
            onMatchItem={handleMatchItem}
            viewMode={viewMode}
            compactView={showCompactView}
          />
        )}
      </div>
      
      {/* Updated UploadModal component with correct prop */}
      <UploadModal 
        onUpload={handleAddItem}
        buttonText="Add Item"
      >
        {/* UploadModal children */}
      </UploadModal>
    </div>
  );
};

export default MyWardrobe;
