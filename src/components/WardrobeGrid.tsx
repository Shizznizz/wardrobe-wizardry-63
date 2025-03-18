
import { useState } from 'react';
import { ClothingItem, ClothingType, ClothingColor, ClothingSeason } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Heart, Filter, Shirt, Umbrella, Tag, CircleUser, ShoppingBag, Footprints } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WardrobeGridProps {
  items: ClothingItem[];
  onToggleFavorite: (id: string) => void;
}

// Helper function to get the appropriate icon for each clothing type
const getClothingIcon = (type: ClothingType) => {
  switch (type) {
    case 'top':
      return <Shirt className="h-4 w-4" />;
    case 'bottom':
      return <ShoppingBag className="h-4 w-4" />;
    case 'outerwear':
      return <Umbrella className="h-4 w-4" />;
    case 'dress':
      return <CircleUser className="h-4 w-4" />;
    case 'footwear':
      return <Footprints className="h-4 w-4" />;
    case 'accessory':
      return <Tag className="h-4 w-4" />;
    default:
      return <Tag className="h-4 w-4" />;
  }
};

const WardrobeGrid = ({ items, onToggleFavorite }: WardrobeGridProps) => {
  const [typeFilter, setTypeFilter] = useState<ClothingType | 'all'>('all');
  const [colorFilter, setColorFilter] = useState<ClothingColor | 'all'>('all');
  const [seasonFilter, setSeasonFilter] = useState<ClothingSeason | 'all'>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const filteredItems = items.filter((item) => {
    if (showOnlyFavorites && !item.favorite) return false;
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (colorFilter !== 'all' && item.color !== colorFilter) return false;
    if (seasonFilter !== 'all' && !item.seasons.includes(seasonFilter as ClothingSeason)) return false;
    return true;
  });

  const resetFilters = () => {
    setTypeFilter('all');
    setColorFilter('all');
    setSeasonFilter('all');
    setShowOnlyFavorites(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Your Wardrobe</h2>
        
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-medium">Filter Items</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="type-filter">Type</Label>
                  <Select
                    value={typeFilter}
                    onValueChange={(value) => setTypeFilter(value as ClothingType | 'all')}
                  >
                    <SelectTrigger id="type-filter">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="top">Tops</SelectItem>
                      <SelectItem value="bottom">Bottoms</SelectItem>
                      <SelectItem value="outerwear">Outerwear</SelectItem>
                      <SelectItem value="dress">Dresses</SelectItem>
                      <SelectItem value="footwear">Footwear</SelectItem>
                      <SelectItem value="accessory">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color-filter">Color</Label>
                  <Select
                    value={colorFilter}
                    onValueChange={(value) => setColorFilter(value as ClothingColor | 'all')}
                  >
                    <SelectTrigger id="color-filter">
                      <SelectValue placeholder="All colors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All colors</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="gray">Gray</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="pink">Pink</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="brown">Brown</SelectItem>
                      <SelectItem value="multicolor">Multicolor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="season-filter">Season</Label>
                  <Select
                    value={seasonFilter}
                    onValueChange={(value) => setSeasonFilter(value as ClothingSeason | 'all')}
                  >
                    <SelectTrigger id="season-filter">
                      <SelectValue placeholder="All seasons" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All seasons</SelectItem>
                      <SelectItem value="spring">Spring</SelectItem>
                      <SelectItem value="summer">Summer</SelectItem>
                      <SelectItem value="autumn">Autumn</SelectItem>
                      <SelectItem value="winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="favorites-only"
                    checked={showOnlyFavorites}
                    onCheckedChange={(checked) => setShowOnlyFavorites(!!checked)}
                  />
                  <Label htmlFor="favorites-only">Show favorites only</Label>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center border rounded-lg p-10 space-y-4 bg-gray-50">
          <p className="text-muted-foreground text-center">
            {items.length === 0 
              ? "Your wardrobe is empty. Add your first item!"
              : "No items match your filters."}
          </p>
          {items.length > 0 && (
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="group relative rounded-lg border overflow-hidden bg-white shadow-soft transition-all hover-card"
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium truncate">{item.name}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center ml-1 text-muted-foreground">
                          {getClothingIcon(item.type)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="capitalize">{item.type}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="capitalize text-xs">
                    {item.color}
                  </Badge>
                  <Badge variant="outline" className="capitalize text-xs">
                    {item.material}
                  </Badge>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.seasons.map((season) => (
                    <Badge key={season} variant="secondary" className="bg-primary/10 text-primary text-xs">
                      {season}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => onToggleFavorite(item.id)}
                className={cn(
                  "absolute top-2 right-2 p-1.5 rounded-full transition-all",
                  item.favorite 
                    ? "bg-red-50 text-red-500" 
                    : "bg-white/80 text-gray-400 hover:text-red-500 hover:bg-red-50"
                )}
              >
                <Heart className={cn("h-4 w-4", item.favorite && "fill-current")} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WardrobeGrid;
