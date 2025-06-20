
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClothingSeason } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WardrobeFilterBarProps {
  uniqueCategories: string[];
  uniqueColors: string[];
  seasons: ClothingSeason[];
  categoryFilter: string | null;
  colorFilter: string | null;
  seasonFilter: ClothingSeason | null;
  sortOrder: string | null;
  setCategoryFilter: (category: string | null) => void;
  setColorFilter: (color: string | null) => void;
  setSeasonFilter: (season: ClothingSeason | null) => void;
  setSortOrder: (order: string | null) => void;
  clearAllFilters: () => void;
  filterApplied: boolean;
  filteredItemsCount: number;
  totalItemsCount: number;
}

const WardrobeFilterBar = React.memo(({
  uniqueCategories,
  uniqueColors,
  seasons,
  categoryFilter,
  colorFilter,
  seasonFilter,
  sortOrder,
  setCategoryFilter,
  setColorFilter,
  setSeasonFilter,
  setSortOrder,
  clearAllFilters,
  filterApplied,
  filteredItemsCount,
  totalItemsCount
}: WardrobeFilterBarProps) => {
  return (
    <>
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
      
      {filterApplied && totalItemsCount > 0 && (
        <div className="text-sm text-gray-400 mt-2 mb-4">
          {filteredItemsCount} items match your filters.
        </div>
      )}
    </>
  );
});

WardrobeFilterBar.displayName = 'WardrobeFilterBar';

export default WardrobeFilterBar;
