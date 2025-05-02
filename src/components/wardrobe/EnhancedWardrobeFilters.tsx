
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { WardrobeFilters } from '@/lib/wardrobe/enhancedFilterUtils';
import { ClothingType, ClothingColor, ClothingOccasion } from '@/lib/types';
import { cn } from '@/lib/utils';

import { 
  Calendar,
  Filter, 
  Sparkles,
  Heart,
  X,
  Sun,
  CloudRain,
  Snowflake,
  Flower,
  Coffee,
  BriefcaseBusiness,
  Shirt,
  Tag,
  CircleSlash,
  Calendar as CalendarIcon,
  Trash2 
} from 'lucide-react';

const clothingTypes: { value: ClothingType; label: string; icon: any }[] = [
  { value: 'top', label: 'Tops', icon: Shirt },
  { value: 'bottom', label: 'Bottoms', icon: Shirt },
  { value: 'dress', label: 'Dresses', icon: Shirt },
  { value: 'coat', label: 'Outerwear', icon: Shirt },
  { value: 'shoes', label: 'Shoes', icon: Shirt },
  { value: 'accessories', label: 'Accessories', icon: Shirt },
];

const colors: { value: ClothingColor; label: string; bgClass: string; textClass: string }[] = [
  { value: 'black', label: 'Black', bgClass: 'bg-black', textClass: 'text-white' },
  { value: 'white', label: 'White', bgClass: 'bg-white', textClass: 'text-black' },
  { value: 'gray', label: 'Gray', bgClass: 'bg-gray-500', textClass: 'text-white' },
  { value: 'red', label: 'Red', bgClass: 'bg-red-500', textClass: 'text-white' },
  { value: 'blue', label: 'Blue', bgClass: 'bg-blue-500', textClass: 'text-white' },
  { value: 'green', label: 'Green', bgClass: 'bg-green-500', textClass: 'text-white' },
  { value: 'yellow', label: 'Yellow', bgClass: 'bg-yellow-400', textClass: 'text-black' },
  { value: 'purple', label: 'Purple', bgClass: 'bg-purple-500', textClass: 'text-white' },
  { value: 'pink', label: 'Pink', bgClass: 'bg-pink-500', textClass: 'text-white' },
  { value: 'orange', label: 'Orange', bgClass: 'bg-orange-500', textClass: 'text-white' },
  { value: 'brown', label: 'Brown', bgClass: 'bg-amber-800', textClass: 'text-white' },
];

const occasions: { value: ClothingOccasion; label: string; icon: any }[] = [
  { value: 'casual', label: 'Casual', icon: Coffee },
  { value: 'formal', label: 'Formal', icon: BriefcaseBusiness },
  { value: 'business', label: 'Business', icon: BriefcaseBusiness },
  { value: 'sport', label: 'Sporty', icon: Shirt },
  { value: 'party', label: 'Party', icon: Sparkles },
];

const seasons = [
  { value: 'winter', label: 'Winter', icon: Snowflake },
  { value: 'spring', label: 'Spring', icon: Flower },
  { value: 'summer', label: 'Summer', icon: Sun },
  { value: 'autumn', label: 'Fall', icon: CloudRain },
  { value: 'all', label: 'All Seasons', icon: Calendar },
];

interface EnhancedWardrobeFiltersProps {
  onFilterChange: (filters: WardrobeFilters) => void;
  totalItems: number;
  filteredCount: number;
  temperature?: number;
  weatherCondition?: string;
  onToggleFilter?: (filterType: keyof WardrobeFilters, value: any) => void;
  currentFilters?: WardrobeFilters;
}

const EnhancedWardrobeFilters: React.FC<EnhancedWardrobeFiltersProps> = ({ 
  onFilterChange,
  totalItems,
  filteredCount,
  temperature,
  weatherCondition,
  onToggleFilter,
  currentFilters
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [activeFilters, setActiveFilters] = useState<WardrobeFilters>({
    category: null,
    color: null,
    occasion: null,
    timeFrame: 'all',
    favorite: null,
    weatherAppropriate: null,
    searchQuery: ''
  });

  // Use currentFilters if provided, otherwise use local state
  const filters = currentFilters || activeFilters;

  // Apply filter change
  const handleFilterChange = (newFilters: Partial<WardrobeFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Handle filter toggle
  const handleToggleFilter = (filterType: keyof WardrobeFilters, value: any) => {
    if (onToggleFilter) {
      onToggleFilter(filterType, value);
    } else {
      handleFilterChange({
        [filterType]: filters[filterType] === value ? null : value
      });
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    const emptyFilters: WardrobeFilters = {
      category: null,
      color: null,
      occasion: null,
      timeFrame: 'all',
      favorite: null,
      weatherAppropriate: null,
      searchQuery: ''
    };
    
    setActiveFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="mb-6 pl-4">
      <div className="bg-slate-900/50 p-4 rounded-xl backdrop-blur-sm border border-white/5 shadow-md">
        {/* Header with counts */}
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-medium text-white">Filter Your Wardrobe</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/70">
              Showing <span className="font-semibold text-white">{filteredCount}</span> of <span className="text-white">{totalItems}</span> items
            </span>
            
            {filteredCount < totalItems && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30"
                onClick={clearAllFilters}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
        
        {/* Main Filter Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4 grid grid-cols-4 h-9 bg-slate-800/70">
            <TabsTrigger value="all">All Filters</TabsTrigger>
            <TabsTrigger value="category">Categories</TabsTrigger>
            <TabsTrigger value="color">Colors</TabsTrigger>
            <TabsTrigger value="occasion">Occasions</TabsTrigger>
          </TabsList>
          
          {/* All Filters Tab */}
          {activeTab === "all" && (
            <div className="space-y-4">
              {/* Categories Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-white/70">Categories</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {clothingTypes.map((type) => {
                    const isActive = filters.category === type.value;
                    const Icon = type.icon;
                    
                    return (
                      <Button
                        key={type.value}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "text-xs border-slate-700/50 hover:bg-slate-800/60 hover:border-purple-500/40",
                          isActive && "bg-slate-800/80 border-purple-500/50 text-purple-300"
                        )}
                        onClick={() => handleToggleFilter('category', type.value)}
                      >
                        <Icon className="h-3.5 w-3.5 mr-1.5" />
                        {type.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              {/* Colors Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-white/70">Colors</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => {
                    const isActive = filters.color === color.value;
                    
                    return (
                      <Button
                        key={color.value}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "text-xs border-slate-700/50 hover:bg-slate-800/60 hover:border-purple-500/40",
                          isActive && "bg-slate-800/80 border-purple-500/50 text-purple-300"
                        )}
                        onClick={() => handleToggleFilter('color', color.value)}
                      >
                        <span 
                          className={`h-3 w-3 rounded-full mr-1.5 ${color.bgClass} border border-white/20`}
                        ></span>
                        {color.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              {/* Occasions Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-white/70">Occasions</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {occasions.map((occasion) => {
                    const isActive = filters.occasion === occasion.value;
                    const Icon = occasion.icon;
                    
                    return (
                      <Button
                        key={occasion.value}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "text-xs border-slate-700/50 hover:bg-slate-800/60 hover:border-purple-500/40",
                          isActive && "bg-slate-800/80 border-purple-500/50 text-purple-300"
                        )}
                        onClick={() => handleToggleFilter('occasion', occasion.value)}
                      >
                        <Icon className="h-3.5 w-3.5 mr-1.5" />
                        {occasion.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              {/* Additional Filters Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-white/70">Additional Filters</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Favorites Filter */}
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "text-xs border-slate-700/50 hover:bg-slate-800/60 hover:border-purple-500/40",
                      filters.favorite === true && "bg-slate-800/80 border-purple-500/50 text-purple-300"
                    )}
                    onClick={() => handleToggleFilter('favorite', filters.favorite === true ? null : true)}
                  >
                    <Heart className={cn(
                      "h-3.5 w-3.5 mr-1.5",
                      filters.favorite === true && "fill-red-500 text-red-500"
                    )} />
                    Favorites
                  </Button>
                  
                  {/* Weather Appropriate Filter */}
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "text-xs border-slate-700/50 hover:bg-slate-800/60 hover:border-purple-500/40",
                      filters.weatherAppropriate === true && "bg-slate-800/80 border-purple-500/50 text-purple-300"
                    )}
                    onClick={() => handleToggleFilter('weatherAppropriate', filters.weatherAppropriate === true ? null : true)}
                    disabled={!temperature}
                  >
                    <Sun className="h-3.5 w-3.5 mr-1.5" />
                    Weather Appropriate
                    {temperature && (
                      <Badge variant="outline" className="ml-1.5 py-0 h-4 text-[10px]">
                        {temperature}°
                      </Badge>
                    )}
                  </Button>
                  
                  {/* Recently Worn Filter */}
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "text-xs border-slate-700/50 hover:bg-slate-800/60 hover:border-purple-500/40",
                      filters.timeFrame !== 'all' && "bg-slate-800/80 border-purple-500/50 text-purple-300"
                    )}
                    onClick={() => handleToggleFilter('timeFrame', filters.timeFrame !== 'recent' ? 'recent' : 'all')}
                  >
                    <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                    Recently Worn
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Category Tab */}
          {activeTab === "category" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
              {clothingTypes.map((type) => {
                const isActive = filters.category === type.value;
                const Icon = type.icon;
                
                return (
                  <Button
                    key={type.value}
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "h-full py-3 flex flex-col items-center justify-center border-slate-700/50",
                      isActive 
                        ? "bg-gradient-to-r from-indigo-600/80 to-purple-600/80 border-0" 
                        : "hover:bg-slate-800/60 hover:border-purple-500/40"
                    )}
                    onClick={() => handleToggleFilter('category', type.value)}
                  >
                    <Icon className={cn("h-5 w-5 mb-1", isActive ? "text-white" : "text-purple-300")} />
                    <span className="text-xs font-medium">{type.label}</span>
                  </Button>
                );
              })}
            </div>
          )}
          
          {/* Colors Tab */}
          {activeTab === "color" && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
              {colors.map((color) => {
                const isActive = filters.color === color.value;
                
                return (
                  <Button
                    key={color.value}
                    variant="outline"
                    className={cn(
                      "h-full py-2 flex flex-col items-center justify-center border-slate-700/50",
                      isActive && "bg-slate-800/80 border-purple-500/50"
                    )}
                    onClick={() => handleToggleFilter('color', color.value)}
                  >
                    <span 
                      className={`h-5 w-5 rounded-full mb-1.5 ${color.bgClass} border border-white/20`}
                    ></span>
                    <span className="text-xs font-medium">{color.label}</span>
                  </Button>
                );
              })}
            </div>
          )}
          
          {/* Occasions Tab */}
          {activeTab === "occasion" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
              {occasions.map((occasion) => {
                const isActive = filters.occasion === occasion.value;
                const Icon = occasion.icon;
                
                return (
                  <Button
                    key={occasion.value}
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "h-full py-3 flex flex-col items-center justify-center border-slate-700/50",
                      isActive 
                        ? "bg-gradient-to-r from-indigo-600/80 to-purple-600/80 border-0" 
                        : "hover:bg-slate-800/60 hover:border-purple-500/40"
                    )}
                    onClick={() => handleToggleFilter('occasion', occasion.value)}
                  >
                    <Icon className={cn("h-5 w-5 mb-1", isActive ? "text-white" : "text-purple-300")} />
                    <span className="text-xs font-medium">{occasion.label}</span>
                  </Button>
                );
              })}
              
              {/* Season filters in Occasion tab */}
              <div className="col-span-full mt-4">
                <Label className="text-sm text-white/70 mb-3 block">Seasons</Label>
                <div className="flex flex-wrap gap-2">
                  {seasons.map((season) => {
                    const Icon = season.icon;
                    // Note: season filtering would need to be added to your filter state
                    
                    return (
                      <Button
                        key={season.value}
                        variant="outline"
                        size="sm"
                        className="text-xs border-slate-700/50 hover:bg-slate-800/60 hover:border-purple-500/40"
                      >
                        <Icon className="h-3.5 w-3.5 mr-1.5" />
                        {season.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedWardrobeFilters;
