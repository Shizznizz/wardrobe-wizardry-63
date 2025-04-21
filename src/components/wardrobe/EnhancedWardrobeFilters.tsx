
import { useState } from 'react';
import { Filter, CloudSun, Calendar, Layers, Tag, Clock, Circle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClothingItem, ClothingType, ClothingColor, ClothingOccasion } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface FilterState {
  category: ClothingType | null;
  color: ClothingColor | null;
  occasion: ClothingOccasion | null;
  timeFrame: 'all' | 'recent' | '3months' | '6months';
  favorite: boolean | null;
  weatherAppropriate: boolean | null;
}

interface EnhancedWardrobeFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  totalItems: number;
  filteredCount: number;
  temperature?: number;
  weatherCondition?: string;
}

const categoryOptions: { value: ClothingType, label: string }[] = [
  { value: 'shirt', label: 'Shirts' },
  { value: 'pants', label: 'Pants' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'dress', label: 'Dresses' },
  { value: 'skirt', label: 'Skirts' },
  { value: 'jacket', label: 'Jackets' },
  { value: 'sweater', label: 'Sweaters' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'other', label: 'Other' }
];

const colorOptions: { value: ClothingColor, label: string }[] = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'gray', label: 'Gray' },
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'orange', label: 'Orange' },
  { value: 'brown', label: 'Brown' },
  { value: 'multicolor', label: 'Multicolor' }
];

const occasionOptions: { value: ClothingOccasion, label: string }[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'work', label: 'Work' },
  { value: 'sport', label: 'Sport' },
  { value: 'special', label: 'Special Occasion' },
  { value: 'party', label: 'Party' },
  { value: 'date', label: 'Date' }
];

const EnhancedWardrobeFilters = ({ 
  onFilterChange, 
  totalItems, 
  filteredCount,
  temperature,
  weatherCondition 
}: EnhancedWardrobeFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    color: null,
    occasion: null,
    timeFrame: 'all',
    favorite: null,
    weatherAppropriate: null
  });
  
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
    
    // Update active filters list for visual feedback
    const active: string[] = [];
    if (updated.category) active.push(`Category: ${updated.category}`);
    if (updated.color) active.push(`Color: ${updated.color}`);
    if (updated.occasion) active.push(`Occasion: ${updated.occasion}`);
    if (updated.timeFrame !== 'all') {
      const timeFrameLabels = {
        'recent': 'Recently worn',
        '3months': 'Worn in last 3 months',
        '6months': 'Worn in last 6 months'
      };
      active.push(timeFrameLabels[updated.timeFrame]);
    }
    if (updated.favorite === true) active.push('Favorites');
    if (updated.weatherAppropriate === true) active.push('Weather appropriate');
    
    setActiveFilters(active);
  };
  
  const clearFilters = () => {
    const resetFilters = {
      category: null,
      color: null,
      occasion: null,
      timeFrame: 'all',
      favorite: null,
      weatherAppropriate: null
    };
    setFilters(resetFilters);
    setActiveFilters([]);
    onFilterChange(resetFilters);
  };
  
  const removeFilter = (filterName: string) => {
    // Extract the filter type from the full filter name (e.g., "Category: shirt" -> "category")
    const filterParts = filterName.split(':');
    const filterType = filterParts[0].trim().toLowerCase();
    
    let updatedFilters = { ...filters };
    
    switch (filterType) {
      case 'category':
        updatedFilters.category = null;
        break;
      case 'color':
        updatedFilters.color = null;
        break;
      case 'occasion':
        updatedFilters.occasion = null;
        break;
      case 'favorites':
        updatedFilters.favorite = null;
        break;
      case 'weather':
      case 'weather appropriate':
        updatedFilters.weatherAppropriate = null;
        break;
      default:
        // Handle time frame filters
        if (filterName.includes('worn')) {
          updatedFilters.timeFrame = 'all';
        }
    }
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
    
    // Update active filters
    setActiveFilters(activeFilters.filter(f => f !== filterName));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center">
          <span className="text-sm text-white/70">
            Showing <span className="font-medium text-white">{filteredCount}</span> of <span className="font-medium text-white">{totalItems}</span> items
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Category filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  "border-white/10 text-white hover:bg-white/10",
                  filters.category && "bg-purple-500/20 border-purple-500/40"
                )}
              >
                <Tag className="mr-2 h-4 w-4" />
                Category
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-700 text-white">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuGroup>
                {categoryOptions.map(option => (
                  <DropdownMenuItem 
                    key={option.value}
                    className={cn(
                      "cursor-pointer hover:bg-slate-800 focus:bg-slate-800",
                      filters.category === option.value && "bg-purple-500/20 text-purple-200"
                    )}
                    onClick={() => updateFilters({ category: option.value })}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Color filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  "border-white/10 text-white hover:bg-white/10",
                  filters.color && "bg-purple-500/20 border-purple-500/40"
                )}
              >
                <Circle className="mr-2 h-4 w-4" />
                Color
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-700 text-white">
              <DropdownMenuLabel>Filter by Color</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuGroup>
                {colorOptions.map(option => (
                  <DropdownMenuItem 
                    key={option.value}
                    className={cn(
                      "cursor-pointer hover:bg-slate-800 focus:bg-slate-800",
                      filters.color === option.value && "bg-purple-500/20 text-purple-200"
                    )}
                    onClick={() => updateFilters({ color: option.value })}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Occasion filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  "border-white/10 text-white hover:bg-white/10",
                  filters.occasion && "bg-purple-500/20 border-purple-500/40"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Occasion
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-700 text-white">
              <DropdownMenuLabel>Filter by Occasion</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuGroup>
                {occasionOptions.map(option => (
                  <DropdownMenuItem 
                    key={option.value}
                    className={cn(
                      "cursor-pointer hover:bg-slate-800 focus:bg-slate-800",
                      filters.occasion === option.value && "bg-purple-500/20 text-purple-200"
                    )}
                    onClick={() => updateFilters({ occasion: option.value })}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Last Worn filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  "border-white/10 text-white hover:bg-white/10",
                  filters.timeFrame !== 'all' && "bg-purple-500/20 border-purple-500/40"
                )}
              >
                <Clock className="mr-2 h-4 w-4" />
                Last Worn
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-700 text-white">
              <DropdownMenuLabel>Filter by Last Worn</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  className={cn(
                    "cursor-pointer hover:bg-slate-800 focus:bg-slate-800",
                    filters.timeFrame === 'recent' && "bg-purple-500/20 text-purple-200"
                  )}
                  onClick={() => updateFilters({ timeFrame: 'recent' })}
                >
                  Recently worn
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(
                    "cursor-pointer hover:bg-slate-800 focus:bg-slate-800",
                    filters.timeFrame === '3months' && "bg-purple-500/20 text-purple-200"
                  )}
                  onClick={() => updateFilters({ timeFrame: '3months' })}
                >
                  Last 3 months
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(
                    "cursor-pointer hover:bg-slate-800 focus:bg-slate-800",
                    filters.timeFrame === '6months' && "bg-purple-500/20 text-purple-200"
                  )}
                  onClick={() => updateFilters({ timeFrame: '6months' })}
                >
                  Last 6 months
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Quick filters */}
          <Button 
            variant="outline" 
            size="sm"
            className={cn(
              "border-white/10 text-white hover:bg-white/10",
              filters.favorite && "bg-purple-500/20 border-purple-500/40"
            )}
            onClick={() => updateFilters({ favorite: filters.favorite ? null : true })}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Favorites
          </Button>
          
          {temperature && (
            <Button 
              variant="outline" 
              size="sm"
              className={cn(
                "border-white/10 text-white hover:bg-white/10",
                filters.weatherAppropriate && "bg-purple-500/20 border-purple-500/40"
              )}
              onClick={() => updateFilters({ weatherAppropriate: filters.weatherAppropriate ? null : true })}
            >
              <CloudSun className="mr-2 h-4 w-4" />
              Weather Appropriate
            </Button>
          )}
          
          {activeFilters.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      
      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {activeFilters.map((filter) => (
            <Badge 
              key={filter}
              variant="outline" 
              className="bg-purple-500/20 text-purple-200 border-purple-500/40 px-2 py-1"
            >
              {filter}
              <button 
                className="ml-2 text-purple-200 hover:text-white"
                onClick={() => removeFilter(filter)}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedWardrobeFilters;
