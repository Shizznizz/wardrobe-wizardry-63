
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, ChevronDown, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

interface FilterDropdownBarProps {
  onFilterChange: (filters: {
    season?: string[],
    type?: string[],
    color?: string[],
    sortBy?: string
  }) => void;
  totalItems: number;
}

const FilterDropdownBar = ({ onFilterChange, totalItems }: FilterDropdownBarProps) => {
  const [activeFilters, setActiveFilters] = useState<{
    season: string[],
    type: string[],
    color: string[],
    sortBy: string
  }>({
    season: [],
    type: [],
    color: [],
    sortBy: 'newest'
  });

  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const clothingTypes = [
    'tops', 'shirts', 'blouses', 'pants', 'skirts', 
    'dresses', 'jackets', 'coats', 'shoes', 'accessories'
  ];

  const clothingColors = [
    'black', 'white', 'blue', 'red', 'green', 
    'yellow', 'purple', 'pink', 'brown', 'gray'
  ];

  const seasons = ['spring', 'summer', 'fall', 'winter', 'all'];
  
  const sortOptions = [
    { value: 'newest', label: 'Recently Added' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most-worn', label: 'Most Worn' },
    { value: 'favorites', label: 'Favorites' }
  ];

  const handleSeasonToggle = (season: string) => {
    const updatedSeasons = activeFilters.season.includes(season)
      ? activeFilters.season.filter(s => s !== season)
      : [...activeFilters.season, season];
    
    const newFilters = { ...activeFilters, season: updatedSeasons };
    setActiveFilters(newFilters);
    updateFilterCount(newFilters);
    onFilterChange(newFilters);
  };

  const handleTypeToggle = (type: string) => {
    const updatedTypes = activeFilters.type.includes(type)
      ? activeFilters.type.filter(t => t !== type)
      : [...activeFilters.type, type];
    
    const newFilters = { ...activeFilters, type: updatedTypes };
    setActiveFilters(newFilters);
    updateFilterCount(newFilters);
    onFilterChange(newFilters);
  };

  const handleColorToggle = (color: string) => {
    const updatedColors = activeFilters.color.includes(color)
      ? activeFilters.color.filter(c => c !== color)
      : [...activeFilters.color, color];
    
    const newFilters = { ...activeFilters, color: updatedColors };
    setActiveFilters(newFilters);
    updateFilterCount(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...activeFilters, sortBy };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const updateFilterCount = (filters: typeof activeFilters) => {
    let count = 0;
    if (filters.season.length > 0) count++;
    if (filters.type.length > 0) count++;
    if (filters.color.length > 0) count++;
    setActiveFilterCount(count);
  };

  const clearAllFilters = () => {
    const newFilters = {
      season: [],
      type: [],
      color: [],
      sortBy: 'newest'
    };
    setActiveFilters(newFilters);
    setActiveFilterCount(0);
    onFilterChange(newFilters);
  };

  return (
    <div className="w-full bg-slate-900/40 rounded-lg border border-white/5 p-3 mb-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-white/10 bg-slate-800/50">
                <Filter className="h-4 w-4 text-purple-300" />
                <span className="text-sm">Filter</span>
                <ChevronDown className="h-4 w-4 text-white/70" />
                {activeFilterCount > 0 && (
                  <Badge variant="default" className="ml-1 bg-purple-600 text-white text-[10px] h-5 w-5 flex items-center justify-center p-0">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-slate-900 border-slate-700">
              <DropdownMenuLabel className="text-white/90">Filter By Season</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700/50" />
              <DropdownMenuGroup>
                {seasons.map((season) => (
                  <DropdownMenuCheckboxItem
                    key={season}
                    checked={activeFilters.season.includes(season)}
                    onCheckedChange={() => handleSeasonToggle(season)}
                    className="capitalize"
                  >
                    {season}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator className="bg-slate-700/50" />
              <DropdownMenuLabel className="text-white/90">Filter By Type</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700/50" />
              <div className="max-h-40 overflow-y-auto">
                {clothingTypes.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={activeFilters.type.includes(type)}
                    onCheckedChange={() => handleTypeToggle(type)}
                    className="capitalize"
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
              
              <DropdownMenuSeparator className="bg-slate-700/50" />
              <DropdownMenuLabel className="text-white/90">Filter By Color</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700/50" />
              <div className="max-h-40 overflow-y-auto">
                {clothingColors.map((color) => (
                  <DropdownMenuCheckboxItem
                    key={color}
                    checked={activeFilters.color.includes(color)}
                    onCheckedChange={() => handleColorToggle(color)}
                    className="capitalize"
                  >
                    {color}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-white/10 bg-slate-800/50">
                <span className="text-sm">Sort By</span>
                <ChevronDown className="ml-1 h-4 w-4 text-white/70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-700">
              <DropdownMenuLabel className="text-white/90">Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700/50" />
              {sortOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={activeFilters.sortBy === option.value}
                  onCheckedChange={() => handleSortChange(option.value)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearAllFilters} 
              className="text-xs text-white/70 hover:text-white flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Clear filters
            </Button>
          )}
        </div>
        <div className="text-sm text-white/70">
          {totalItems} item{totalItems !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default FilterDropdownBar;
