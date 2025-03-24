
import { useState } from 'react';
import { ClothingItem, ClothingType, ClothingColor, ClothingSeason, Outfit, ClothingOccasion, ClothingMaterial } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Heart, Filter, Shirt, Umbrella, Tag, CircleUser, ShoppingBag, Footprints, Star, Gift, Briefcase, Sparkles, PlusCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import { motion } from 'framer-motion';

interface WardrobeGridProps {
  items: ClothingItem[];
  onToggleFavorite: (id: string) => void;
  compactView?: boolean;
}

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

const getOccasionIcon = (occasion: ClothingOccasion) => {
  switch (occasion) {
    case 'casual':
      return <Shirt className="h-4 w-4" />;
    case 'formal':
    case 'business':
      return <Briefcase className="h-4 w-4" />;
    case 'party':
    case 'special':
    case 'date':
      return <Gift className="h-4 w-4" />;
    case 'sporty':
    case 'outdoor':
    case 'vacation':
      return <ShoppingBag className="h-4 w-4" />;
    case 'everyday':
      return <Star className="h-4 w-4" />;
    default:
      return <Tag className="h-4 w-4" />;
  }
};

const WardrobeGrid = ({ items, onToggleFavorite, compactView = false }: WardrobeGridProps) => {
  const [typeFilter, setTypeFilter] = useState<ClothingType | 'all'>('all');
  const [colorFilter, setColorFilter] = useState<ClothingColor | 'all'>('all');
  const [seasonFilter, setSeasonFilter] = useState<ClothingSeason | 'all'>('all');
  const [occasionFilter, setOccasionFilter] = useState<ClothingOccasion | 'all'>('all');
  const [materialFilter, setMaterialFilter] = useState<ClothingMaterial | 'all'>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [showOutfitDialog, setShowOutfitDialog] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<'type' | 'color' | 'season' | 'occasion' | 'material'>('type');
  const [expandedTagsItem, setExpandedTagsItem] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    if (showOnlyFavorites && !item.favorite) return false;
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (colorFilter !== 'all' && item.color !== colorFilter) return false;
    if (seasonFilter !== 'all' && !item.seasons.includes(seasonFilter as ClothingSeason)) return false;
    if (occasionFilter !== 'all' && !item.occasions.includes(occasionFilter as ClothingOccasion)) return false;
    if (materialFilter !== 'all' && item.material !== materialFilter) return false;
    return true;
  });

  const resetFilters = () => {
    setTypeFilter('all');
    setColorFilter('all');
    setSeasonFilter('all');
    setOccasionFilter('all');
    setMaterialFilter('all');
    setShowOnlyFavorites(false);
  };

  const handleItemClick = (item: ClothingItem) => {
    setSelectedItem(item);
  };

  const generateOutfitSuggestions = (centerItem: ClothingItem): Outfit[] => {
    const similarOccasionItems = items.filter(i => 
      i.id !== centerItem.id && 
      i.occasions.some(occ => centerItem.occasions.includes(occ))
    );
    
    const similarSeasonItems = items.filter(i => 
      i.id !== centerItem.id && 
      i.seasons.some(season => centerItem.seasons.includes(season))
    );
    
    const casualOutfit: Outfit = {
      id: 'casual-weekend',
      name: 'Casual Weekend',
      items: [centerItem.id],
      occasions: centerItem.occasions.includes('casual') 
        ? ['weekend', 'casual'] 
        : [...centerItem.occasions, 'casual'].slice(0, 2),
      seasons: centerItem.seasons,
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      personalityTags: ['casual', 'minimalist']
    };
    
    const casualItems = similarOccasionItems.filter(i => 
      i.occasions.includes('casual') || i.occasions.includes('everyday')
    ).slice(0, 2);
    
    if (casualItems.length < 2) {
      const additionalItems = similarSeasonItems
        .filter(i => !casualItems.some(ci => ci.id === i.id))
        .slice(0, 2 - casualItems.length);
      casualOutfit.items = [...casualOutfit.items, ...casualItems.map(i => i.id), ...additionalItems.map(i => i.id)];
    } else {
      casualOutfit.items = [...casualOutfit.items, ...casualItems.map(i => i.id)];
    }
    
    const formalOutfit: Outfit = {
      id: 'office-elegance',
      name: 'Office Elegance',
      items: [centerItem.id],
      occasions: centerItem.occasions.includes('formal') || centerItem.occasions.includes('business')
        ? ['work', 'office', 'business']
        : ['work', 'office'],
      seasons: centerItem.seasons,
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      personalityTags: ['formal', 'elegant']
    };
    
    const formalItems = similarOccasionItems.filter(i => 
      i.occasions.includes('formal') || i.occasions.includes('business')
    ).slice(0, 2);
    
    if (formalItems.length < 2) {
      const additionalItems = items
        .filter(i => i.id !== centerItem.id && !formalItems.some(fi => fi.id === i.id))
        .slice(0, 2 - formalItems.length);
      formalOutfit.items = [...formalOutfit.items, ...formalItems.map(i => i.id), ...additionalItems.map(i => i.id)];
    } else {
      formalOutfit.items = [...formalOutfit.items, ...formalItems.map(i => i.id)];
    }
    
    const partyOutfit: Outfit = {
      id: 'night-out',
      name: 'Night Out',
      items: [centerItem.id],
      occasions: centerItem.occasions.some(o => ['party', 'special', 'date'].includes(o))
        ? ['party', 'evening']
        : ['party', 'evening'],
      seasons: centerItem.seasons,
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      personalityTags: ['bold', 'trendy']
    };
    
    const partyItems = similarOccasionItems.filter(i => 
      i.occasions.some(o => ['party', 'special', 'date'].includes(o))
    ).slice(0, 2);
    
    if (partyItems.length < 2) {
      const additionalItems = items
        .filter(i => i.id !== centerItem.id && !partyItems.some(pi => pi.id === i.id))
        .slice(0, 2 - partyItems.length);
      partyOutfit.items = [...partyOutfit.items, ...partyItems.map(i => i.id), ...additionalItems.map(i => i.id)];
    } else {
      partyOutfit.items = [...partyOutfit.items, ...partyItems.map(i => i.id)];
    }
    
    const seasonalOutfit: Outfit = {
      id: 'seasonal-staple',
      name: 'Seasonal Staple',
      items: [centerItem.id],
      occasions: centerItem.occasions.includes('everyday') 
        ? ['daily', 'casual'] 
        : ['daily', ...centerItem.occasions.slice(0, 1)],
      seasons: centerItem.seasons,
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date(),
      personalityTags: ['classic', 'casual']
    };
    
    const seasonalItems = similarSeasonItems
      .filter(i => !casualOutfit.items.includes(i.id) && !formalOutfit.items.includes(i.id) && !partyOutfit.items.includes(i.id))
      .slice(0, 2);
    
    if (seasonalItems.length < 2) {
      const additionalItems = items
        .filter(i => 
          i.id !== centerItem.id && 
          !casualOutfit.items.includes(i.id) && 
          !formalOutfit.items.includes(i.id) && 
          !partyOutfit.items.includes(i.id) && 
          !seasonalItems.some(si => si.id === i.id)
        )
        .slice(0, 2 - seasonalItems.length);
      seasonalOutfit.items = [...seasonalOutfit.items, ...seasonalItems.map(i => i.id), ...additionalItems.map(i => i.id)];
    } else {
      seasonalOutfit.items = [...seasonalOutfit.items, ...seasonalItems.map(i => i.id)];
    }
    
    return [casualOutfit, formalOutfit, partyOutfit, seasonalOutfit];
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

  const toggleExpandTags = (itemId: string) => {
    setExpandedTagsItem(expandedTagsItem === itemId ? null : itemId);
  };

  // Maximum number of tags to show before "more" indicator
  const MAX_TAGS = 3;

  const materialOptions: ClothingMaterial[] = ['cotton', 'wool', 'silk', 'polyester', 'leather', 'denim', 'linen', 'other'];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Your Wardrobe</h2>
        
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="default" size="sm" className="flex items-center space-x-1">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {(typeFilter !== 'all' || colorFilter !== 'all' || seasonFilter !== 'all' || occasionFilter !== 'all' || materialFilter !== 'all' || showOnlyFavorites) && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                    <span className="text-xs">
                      {[
                        typeFilter !== 'all' ? 1 : 0,
                        colorFilter !== 'all' ? 1 : 0,
                        seasonFilter !== 'all' ? 1 : 0,
                        occasionFilter !== 'all' ? 1 : 0,
                        materialFilter !== 'all' ? 1 : 0,
                        showOnlyFavorites ? 1 : 0
                      ].reduce((a, b) => a + b, 0)}
                    </span>
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-screen max-w-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Filter Items</h3>
                  {(typeFilter !== 'all' || colorFilter !== 'all' || seasonFilter !== 'all' || occasionFilter !== 'all' || materialFilter !== 'all' || showOnlyFavorites) && (
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 px-2 text-xs">
                      Reset All
                    </Button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  <ToggleGroup type="single" value={activeFilterTab} onValueChange={(value) => value && setActiveFilterTab(value as any)}>
                    <ToggleGroupItem value="type" size="sm" className="text-xs h-8">Type</ToggleGroupItem>
                    <ToggleGroupItem value="color" size="sm" className="text-xs h-8">Color</ToggleGroupItem>
                    <ToggleGroupItem value="season" size="sm" className="text-xs h-8">Season</ToggleGroupItem>
                    <ToggleGroupItem value="occasion" size="sm" className="text-xs h-8">Vibe</ToggleGroupItem>
                    <ToggleGroupItem value="material" size="sm" className="text-xs h-8">Material</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                {activeFilterTab === 'type' && (
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={typeFilter === 'all' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setTypeFilter('all')}
                    >
                      All Types
                    </Button>
                    <Button 
                      variant={typeFilter === 'shirt' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setTypeFilter('shirt')}
                    >
                      <Shirt className="h-3 w-3 mr-1" />
                      Shirts
                    </Button>
                    <Button 
                      variant={typeFilter === 'pants' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setTypeFilter('pants')}
                    >
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      Pants
                    </Button>
                    <Button 
                      variant={typeFilter === 'jeans' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setTypeFilter('jeans')}
                    >
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      Jeans
                    </Button>
                    <Button 
                      variant={typeFilter === 'sweater' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setTypeFilter('sweater')}
                    >
                      <Umbrella className="h-3 w-3 mr-1" />
                      Sweaters
                    </Button>
                    <Button 
                      variant={typeFilter === 'hoodie' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setTypeFilter('hoodie')}
                    >
                      <Umbrella className="h-3 w-3 mr-1" />
                      Hoodies
                    </Button>
                    <Button 
                      variant={typeFilter === 'jacket' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setTypeFilter('jacket')}
                    >
                      <Umbrella className="h-3 w-3 mr-1" />
                      Jackets
                    </Button>
                    <Button 
                      variant={typeFilter === 'dress' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setTypeFilter('dress')}
                    >
                      <CircleUser className="h-3 w-3 mr-1" />
                      Dresses
                    </Button>
                    <Button 
                      variant={typeFilter === 'skirt' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setTypeFilter('skirt')}
                    >
                      <CircleUser className="h-3 w-3 mr-1" />
                      Skirts
                    </Button>
                    <Button 
                      variant={typeFilter === 'shoes' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setTypeFilter('shoes')}
                    >
                      <Footprints className="h-3 w-3 mr-1" />
                      Shoes
                    </Button>
                    <Button 
                      variant={typeFilter === 'accessories' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setTypeFilter('accessories')}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      Accessories
                    </Button>
                  </div>
                )}
                
                {activeFilterTab === 'color' && (
                  <div className="grid grid-cols-4 gap-2">
                    <button 
                      className={cn(
                        "h-8 rounded-md border border-input flex items-center justify-center",
                        colorFilter === 'all' ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => setColorFilter('all')}
                    >
                      <span className="text-xs">All</span>
                    </button>
                    <button 
                      className={cn(
                        "h-8 rounded-md border border-input flex items-center justify-center bg-black",
                        colorFilter === 'black' ? "ring-2 ring-primary ring-offset-2" : ""
                      )}
                      onClick={() => setColorFilter('black')}
                    >
                      <span className="text-xs text-white">Black</span>
                    </button>
                    <button 
                      className={cn(
                        "h-8 rounded-md border border-input flex items-center justify-center bg-white",
                        colorFilter === 'white' ? "ring-2 ring-primary ring-offset-2" : ""
                      )}
                      onClick={() => setColorFilter('white')}
                    >
                      <span className="text-xs text-black">White</span>
                    </button>
                    <button 
                      className={cn(
                        "h-8 rounded-md border border-input flex items-center justify-center bg-gray-500",
                        colorFilter === 'gray' ? "ring-2 ring-primary ring-offset-2" : ""
                      )}
                      onClick={() => setColorFilter('gray')}
                    >
                      <span className="text-xs text-white">Gray</span>
                    </button>
                    <button 
                      className={cn(
                        "h-8 rounded-md border border-input flex items-center justify-center bg-red-500",
                        colorFilter === 'red' ? "ring-2 ring-primary ring-offset-2" : ""
                      )}
                      onClick={() => setColorFilter('red')}
                    >
                      <span className="text-xs text-white">Red</span>
                    </button>
                    <button 
                      className={cn(
                        "h-8 rounded-md border border-input flex items-center justify-center bg-blue-500",
                        colorFilter === 'blue' ? "ring-2 ring-primary ring-offset-2" : ""
                      )}
                      onClick={() => setColorFilter('blue')}
                    >
                      <span className="text-xs text-white">Blue</span>
                    </button>
                    <button 
                      className={cn(
                        "h-8 rounded-md border border-input flex items-center justify-center bg-green-500",
                        colorFilter === 'green' ? "ring-2 ring-primary ring-offset-2" : ""
                      )}
                      onClick={() => setColorFilter('green')}
                    >
                      <span className="text-xs text-white">Green</span>
                    </button>
                    <button 
                      className={cn(
                        "h-8 rounded-md border border-input flex items-center justify-center bg-yellow-400",
                        colorFilter === 'yellow' ? "ring-2 ring-primary ring-offset-2" : ""
                      )}
                      onClick={() => setColorFilter('yellow')}
                    >
                      <span className="text-xs text-black">Yellow</span>
                    </button>
                    <button 
                      className={cn(
                        "h-8 rounded-md border border-input flex items-center justify-center bg-purple-500",
                        colorFilter === 'purple' ? "ring-2 ring-primary ring-offset-2" : ""
                      )}
                      onClick={() => setColorFilter('purple')}
                    >
                      <span className="text-xs text-white">Purple</span>
                    </button>
                    <button 
                      className={cn(
                        "h-8 rounded-md border border-input flex items-center justify-center bg-pink-500",
                        colorFilter === 'pink' ? "ring-2 ring-primary ring-offset-2" : ""
                      )}
                      onClick={() => setColorFilter('pink')}
                    >
                      <span className="text-xs text-white">Pink</span>
                    </button>
                    <button 
                      className={cn(
                        "h-8 rounded-md border border-input flex items-center justify-center bg-orange-500",
                        colorFilter === 'orange' ? "ring-2 ring-primary ring-offset-2" : ""
                      )}
                      onClick={() => setColorFilter('orange')}
                    >
                      <span className="text-xs text-white">Orange</span>
                    </button>
                    <button 
                      className={cn(
                        "h-8 rounded-md border border-input flex items-center justify-center bg-brown-500",
                        colorFilter === 'brown' ? "ring-2 ring-primary ring-offset-2" : ""
                      )}
                      onClick={() => setColorFilter('brown')}
                    >
                      <span className="text-xs text-white">Brown</span>
                    </button>
                    <button 
                      className={cn(
                        "h-8 rounded-md border border-input flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500",
                        colorFilter === 'multicolor' ? "ring-2 ring-primary ring-offset-2" : ""
                      )}
                      onClick={() => setColorFilter('multicolor')}
                    >
                      <span className="text-xs text-white">Multi</span>
                    </button>
                  </div>
                )}
                
                {activeFilterTab === 'season' && (
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={seasonFilter === 'all' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setSeasonFilter('all')}
                    >
                      All Seasons
                    </Button>
                    <Button 
                      variant={seasonFilter === 'spring' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setSeasonFilter('spring')}
                    >
                      Spring
                    </Button>
                    <Button 
                      variant={seasonFilter === 'summer' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setSeasonFilter('summer')}
                    >
                      Summer
                    </Button>
                    <Button 
                      variant={seasonFilter === 'autumn' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setSeasonFilter('autumn')}
                    >
                      Autumn
                    </Button>
                    <Button 
                      variant={seasonFilter === 'winter' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setSeasonFilter('winter')}
                    >
                      Winter
                    </Button>
                    <Button 
                      variant={seasonFilter === 'all' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setSeasonFilter('all')}
                    >
                      All Year
                    </Button>
                  </div>
                )}
                
                {activeFilterTab === 'occasion' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={occasionFilter === 'all' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setOccasionFilter('all')}
                    >
                      All Vibes
                    </Button>
                    <Button 
                      variant={occasionFilter === 'casual' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setOccasionFilter('casual')}
                    >
                      <Shirt className="h-3 w-3 mr-1" />
                      Casual
                    </Button>
                    <Button 
                      variant={occasionFilter === 'formal' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setOccasionFilter('formal')}
                    >
                      <Briefcase className="h-3 w-3 mr-1" />
                      Formal
                    </Button>
                    <Button 
                      variant={occasionFilter === 'business' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setOccasionFilter('business')}
                    >
                      <Briefcase className="h-3 w-3 mr-1" />
                      Business
                    </Button>
                    <Button 
                      variant={occasionFilter === 'party' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setOccasionFilter('party')}
                    >
                      <Gift className="h-3 w-3 mr-1" />
                      Party
                    </Button>
                    <Button 
                      variant={occasionFilter === 'sporty' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setOccasionFilter('sporty')}
                    >
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      Sporty
                    </Button>
                    <Button 
                      variant={occasionFilter === 'everyday' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setOccasionFilter('everyday')}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Everyday
                    </Button>
                    <Button 
                      variant={occasionFilter === 'date' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setOccasionFilter('date')}
                    >
                      <Gift className="h-3 w-3 mr-1" />
                      Date
                    </Button>
                  </div>
                )}
                
                {activeFilterTab === 'material' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={materialFilter === 'all' ? "default" : "outline"} 
                      size="sm" 
                      className="justify-start text-xs"
                      onClick={() => setMaterialFilter('all')}
                    >
                      All Materials
                    </Button>
                    {materialOptions.map(material => (
                      <Button 
                        key={material}
                        variant={materialFilter === material ? "default" : "outline"} 
                        size="sm" 
                        className="justify-start text-xs capitalize"
                        onClick={() => setMaterialFilter(material)}
                      >
                        {material}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-2 border-t">
                  <Checkbox
                    id="favorites-only"
                    checked={showOnlyFavorites}
                    onCheckedChange={(checked) => setShowOnlyFavorites(!!checked)}
                  />
                  <Label htmlFor="favorites-only" className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span>Favorites only</span>
                  </Label>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center border rounded-lg p-10 space-y-4 bg-gray-50/5 backdrop-blur-sm">
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
        <div className={cn(
          "grid gap-4",
          compactView 
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" 
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        )}>
          {filteredItems.map((item) => {
            return (
              <motion.div 
                key={item.id} 
                className={cn(
                  "group relative rounded-lg border overflow-hidden bg-white/5 backdrop-blur-sm shadow-soft transition-all hover-card cursor-pointer",
                  compactView ? "border-white/5" : "border-white/10"
                )}
                onClick={() => handleItemClick(item)}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <div className={cn("overflow-hidden", compactView ? "aspect-[3/4]" : "aspect-square")}>
                  <div className="relative w-full h-full overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="absolute top-1/4 left-1/4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Sparkles className="h-6 w-6 text-white/80 animate-pulse" />
                    </div>
                  </div>
                </div>
                
                <div className={cn("p-3", compactView ? "p-2" : "p-4")}>
                  {!compactView && (
                    <div className="flex justify-between items-start">
                      <h3 className={cn(
                        "font-medium truncate", 
                        compactView ? "text-sm" : ""
                      )}>{item.name}</h3>
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
                  )}
                  
                  {compactView ? (
                    <div className="flex justify-between items-center mt-1">
                      <h3 className="text-xs font-medium truncate">{item.name}</h3>
                      <div className="flex items-center ml-1 text-muted-foreground">
                        {getClothingIcon(item.type)}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Badge variant="secondary" className="capitalize text-xs">
                          {item.color}
                        </Badge>
                        <Badge variant="outline" className="capitalize text-xs">
                          {item.material}
                        </Badge>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {expandedTagsItem === item.id ? (
                          <>
                            {item.occasions.map((occasion) => (
                              <Badge 
                                key={occasion} 
                                variant="outline" 
                                className="bg-primary/10 text-primary text-xs flex items-center gap-1"
                              >
                                {getOccasionIcon(occasion)}
                                <span className="capitalize">{occasion}</span>
                              </Badge>
                            ))}
                            <Badge 
                              variant="outline" 
                              className="bg-primary/10 text-primary text-xs cursor-pointer"
                              onClick={(e) => { e.stopPropagation(); toggleExpandTags(item.id); }}
                            >
                              Show less
                            </Badge>
                          </>
                        ) : (
                          <>
                            {item.occasions.slice(0, MAX_TAGS).map((occasion) => (
                              <Badge 
                                key={occasion} 
                                variant="outline" 
                                className="bg-primary/10 text-primary text-xs flex items-center gap-1"
                              >
                                {getOccasionIcon(occasion)}
                                <span className="capitalize">{occasion}</span>
                              </Badge>
                            ))}
                            {item.occasions.length > MAX_TAGS && (
                              <Badge 
                                variant="outline" 
                                className="bg-primary/10 text-primary text-xs cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); toggleExpandTags(item.id); }}
                              >
                                +{item.occasions.length - MAX_TAGS} more
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.seasons.slice(0, MAX_TAGS).map((season) => (
                          <Badge key={season} variant="secondary" className="bg-primary/10 text-primary text-xs">
                            {season}
                          </Badge>
                        ))}
                        {item.seasons.length > MAX_TAGS && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                            +{item.seasons.length - MAX_TAGS}
                          </Badge>
                        )}
                      </div>
                    </>
                  )}
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          className={cn(
                            "w-full mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white",
                            compactView ? "mt-2 py-1 h-8 text-xs" : ""
                          )}
                          size={compactView ? "sm" : "sm"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMatchThis(item);
                          }}
                        >
                          <Star className={cn("mr-2", compactView ? "h-3 w-3" : "h-4 w-4")} />
                          Match This
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">Get outfit suggestions using this item as a base</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
              </motion.div>
            );
          })}
        </div>
      )}

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
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedItem.occasions && selectedItem.occasions.map(occasion => (
                        <Badge 
                          key={occasion}
                          variant="outline" 
                          className="bg-primary/10 text-primary text-xs flex items-center gap-1"
                        >
                          {getOccasionIcon(occasion)}
                          <span className="capitalize">{occasion}</span>
                        </Badge>
                      ))}
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
