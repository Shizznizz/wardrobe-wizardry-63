import { useState } from 'react';
import { ClothingItem, ClothingType, ClothingColor, ClothingSeason, Outfit } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Heart, Filter, Shirt, Umbrella, Tag, CircleUser, ShoppingBag, Footprints, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import { sampleOutfits } from '@/lib/wardrobeData';

interface WardrobeGridProps {
  items: ClothingItem[];
  onToggleFavorite: (id: string) => void;
}

// Helper function to get the appropriate icon for each clothing type
const getClothingIcon = (type: ClothingType) => {
  switch (type) {
    case 'shirt':
      return <Shirt className="h-4 w-4" />;
    case 'jeans':
    case 'pants':
    case 'shorts':
      return <ShoppingBag className="h-4 w-4" />;
    case 'jacket':
    case 'hoodie':
    case 'sweater':
      return <Umbrella className="h-4 w-4" />;
    case 'dress':
    case 'skirt':
      return <CircleUser className="h-4 w-4" />;
    case 'shoes':
    case 'sneakers':
    case 'boots':
      return <Footprints className="h-4 w-4" />;
    case 'accessories':
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
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [showOutfitDialog, setShowOutfitDialog] = useState(false);

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

  const handleItemClick = (item: ClothingItem) => {
    setSelectedItem(item);
  };

  const generateOutfitSuggestions = (centerItem: ClothingItem): Outfit[] => {
    return [
      {
        id: 'casual-weekend',
        name: 'Casual Weekend',
        items: [centerItem.id, ...items.filter(i => i.id !== centerItem.id).slice(0, 2).map(i => i.id)],
        occasions: ['weekend', 'casual'],
        seasons: ['all'],
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date(),
        personalityTags: ['casual', 'minimalist']
      },
      {
        id: 'office-elegance',
        name: 'Office Elegance',
        items: [centerItem.id, ...items.filter(i => i.id !== centerItem.id).slice(2, 4).map(i => i.id)],
        occasions: ['work', 'office'],
        seasons: ['all'],
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date(),
        personalityTags: ['formal', 'elegant']
      },
      {
        id: 'night-out',
        name: 'Night Out',
        items: [centerItem.id, ...items.filter(i => i.id !== centerItem.id).slice(4, 6).map(i => i.id)],
        occasions: ['party', 'evening'],
        seasons: ['all'],
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date(),
        personalityTags: ['bold', 'trendy']
      },
      {
        id: 'seasonal-staple',
        name: 'Seasonal Staple',
        items: [centerItem.id, ...items.filter(i => i.id !== centerItem.id).slice(6, 8).map(i => i.id)],
        occasions: ['daily', 'casual'],
        seasons: centerItem.seasons,
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date(),
        personalityTags: ['classic', 'casual']
      }
    ];
  };

  const [outfitSuggestions, setOutfitSuggestions] = useState<Outfit[]>([]);
  
  const handleMatchThis = (item: ClothingItem) => {
    setSelectedItem(item);
    setOutfitSuggestions(generateOutfitSuggestions(item));
    setShowOutfitDialog(true);
  };

  const handleWearOutfit = (outfitId: string) => {
    console.log('Wearing outfit:', outfitId);
  };

  const handleRefreshOutfit = () => {
    console.log('Refreshing outfit suggestion');
  };

  const handleLikeOutfit = () => {
    console.log('Liked outfit');
  };

  const handleDislikeOutfit = () => {
    console.log('Disliked outfit');
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
                      <SelectItem value="shirt">Shirts</SelectItem>
                      <SelectItem value="jeans">Jeans</SelectItem>
                      <SelectItem value="pants">Pants</SelectItem>
                      <SelectItem value="shorts">Shorts</SelectItem>
                      <SelectItem value="sweater">Sweaters</SelectItem>
                      <SelectItem value="hoodie">Hoodies</SelectItem>
                      <SelectItem value="jacket">Jackets</SelectItem>
                      <SelectItem value="dress">Dresses</SelectItem>
                      <SelectItem value="skirt">Skirts</SelectItem>
                      <SelectItem value="shoes">Shoes</SelectItem>
                      <SelectItem value="sneakers">Sneakers</SelectItem>
                      <SelectItem value="boots">Boots</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
              className="group relative rounded-lg border overflow-hidden bg-white shadow-soft transition-all hover-card cursor-pointer"
              onClick={() => handleItemClick(item)}
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
                
                <Button 
                  className="w-full mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMatchThis(item);
                  }}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Match This
                </Button>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(item.id);
                }}
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

      {/* Dialog for outfit suggestions */}
      <Dialog open={showOutfitDialog} onOpenChange={setShowOutfitDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Outfits with {selectedItem?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="mt-4 space-y-6">
              <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-md overflow-hidden border border-indigo-200">
                    <img 
                      src={selectedItem.imageUrl} 
                      alt={selectedItem.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedItem.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary" className="capitalize text-xs">
                        {selectedItem.color}
                      </Badge>
                      <Badge variant="outline" className="capitalize text-xs">
                        {selectedItem.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-medium">Suggested Outfits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {outfitSuggestions.map((outfit) => (
                  <OutfitSuggestion 
                    key={outfit.id}
                    outfit={outfit}
                    items={items}
                    onWear={handleWearOutfit}
                    onRefresh={handleRefreshOutfit}
                    onLike={handleLikeOutfit}
                    onDislike={handleDislikeOutfit}
                  />
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WardrobeGrid;
