
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowLeft, Filter, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ClothingSeason, ClothingOccasion, Outfit, ClothingItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import OutfitFilters from '@/components/fitting-room/OutfitFilters';
import OutfitImageGrid from '@/components/outfits/OutfitImageGrid';

interface WardrobeOutfitSelectorProps {
  outfits: Outfit[];
  selectedSeason: ClothingSeason | null;
  selectedOccasion: ClothingOccasion | null;
  showFavoritesOnly: boolean;
  onSeasonChange: (season: ClothingSeason) => void;
  onOccasionChange: (occasion: ClothingOccasion) => void;
  onFavoritesToggle: () => void;
  onPreview: (outfit: Outfit) => void;
  onCancel: () => void;
  clothingItems?: ClothingItem[]; // Add this prop to receive clothing items
}

const WardrobeOutfitSelector = ({
  outfits,
  selectedSeason,
  selectedOccasion,
  showFavoritesOnly,
  onSeasonChange,
  onOccasionChange,
  onFavoritesToggle,
  onPreview,
  onCancel,
  clothingItems = [] // Add default empty array
}: WardrobeOutfitSelectorProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = [
    { id: "all", name: "All Outfits" },
    { id: "casual", name: "Casual" },
    { id: "business", name: "Business" },
    { id: "party", name: "Party" },
    { id: "date", name: "Date Night" },
    { id: "favorites", name: "Favorites" }
  ];
  
  const filteredOutfits = outfits.filter(outfit => {
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchesName = outfit.name?.toLowerCase().includes(query);
      const matchesSeason = outfit.seasons?.some(season => season.toLowerCase().includes(query));
      const matchesOccasion = outfit.occasions?.some(occasion => occasion.toLowerCase().includes(query));
      
      if (!matchesName && !matchesSeason && !matchesOccasion) {
        return false;
      }
    }
    
    // Filter by tab category
    if (activeTab !== "all" && activeTab !== "favorites") {
      if (!outfit.occasions?.includes(activeTab as ClothingOccasion)) {
        return false;
      }
    }
    
    if (activeTab === "favorites" && !outfit.favorite) {
      return false;
    }
    
    return true;
  });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchQuery("");
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Helper function to get clothing item by ID
  const getClothingItemById = (id: string): ClothingItem | undefined => {
    return clothingItems.find(item => item && item.id === id);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-dark border border-white/10 rounded-lg overflow-hidden mb-8"
    >
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onCancel}
              className="mr-2 text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-medium">Select an Outfit</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFilters}
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
          <Input
            type="text"
            placeholder="Search outfits by name, season, occasion..."
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 text-white/40 hover:text-white"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6 bg-white/5 p-1">
            {categories.map(category => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-purple-600 text-sm"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-white/10"
          >
            <div className="p-4">
              <OutfitFilters 
                selectedSeason={selectedSeason}
                selectedOccasion={selectedOccasion}
                showFavoritesOnly={showFavoritesOnly}
                onSeasonChange={onSeasonChange}
                onOccasionChange={onOccasionChange}
                onFavoritesToggle={onFavoritesToggle}
                totalOutfits={outfits.length}
                filteredOutfits={filteredOutfits.length}
                className="bg-transparent border-none shadow-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="p-4">
        {filteredOutfits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/70">No outfits match your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredOutfits.map((outfit) => (
              <motion.div
                key={outfit.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer relative group"
                onClick={() => onPreview(outfit)}
              >
                <div className="aspect-square rounded-lg overflow-hidden border border-white/10 transition-all group-hover:border-purple-500 relative">
                  {/* Update OutfitImageGrid with clothingItems prop */}
                  {outfit.items && outfit.items.length > 0 ? (
                    <OutfitImageGrid 
                      itemIds={outfit.items} 
                      getClothingItemById={getClothingItemById}
                      clothingItems={clothingItems}
                    />
                  ) : (
                    <img 
                      src="/placeholder.svg" 
                      alt={outfit.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                    <h3 className="font-medium text-white text-sm line-clamp-1">{outfit.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {outfit.seasons?.slice(0, 2).map((season) => (
                        <Badge
                          key={season}
                          variant="outline"
                          className="bg-black/40 border-white/20 text-white text-[10px] py-0"
                        >
                          {season}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      size="icon"
                      className="w-8 h-8 rounded-full bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-white/10 flex justify-between items-center">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <div className="text-sm text-white/60">
          {filteredOutfits.length} outfit{filteredOutfits.length !== 1 ? 's' : ''} found
        </div>
      </div>
    </motion.div>
  );
};

export default WardrobeOutfitSelector;
