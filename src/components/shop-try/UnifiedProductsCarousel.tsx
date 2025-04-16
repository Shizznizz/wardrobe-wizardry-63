
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Heart, 
  TrendingUp, 
  Star, 
  ThumbsUp,
  ExternalLink,
  Sparkles,
  Palette,
  Filter,
  ArrowLeftCircle,
  ArrowRightCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ClothingItem, ClothingType, ClothingColor, ClothingMaterial, ClothingSeason, ClothingOccasion } from '@/lib/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface ShopItem extends ClothingItem {
  price: string;
  retailer: string;
  rating: number;
  reviewCount: number;
  discount?: string;
  affiliateUrl: string;
  isExclusive?: boolean;
  isTrending?: boolean;
}

const dummyItems: ShopItem[] = Array(12).fill(null).map((_, i) => ({
  id: `item-${i}`,
  name: ['Casual Shirt', 'Summer Dress', 'Denim Jacket', 'Wool Sweater', 'Linen Pants'][i % 5],
  type: ['shirt', 'dress', 'jacket', 'sweater', 'pants'][i % 5] as ClothingType,
  color: ['blue', 'red', 'green', 'black', 'white'][i % 5] as ClothingColor,
  material: ['cotton', 'polyester', 'denim', 'wool', 'linen'][i % 5] as ClothingMaterial,
  seasons: ['summer', 'winter', 'spring', 'autumn'] as ClothingSeason[],
  occasions: ['casual', 'formal', 'business', 'party', 'outdoor'] as ClothingOccasion[],
  imageUrl: '/placeholder.svg',
  price: `$${Math.floor(Math.random() * 100) + 20}.99`,
  retailer: ['H&M', 'Zara', 'Mango', 'ASOS', 'Uniqlo'][i % 5],
  rating: 3.5 + Math.random() * 1.5,
  reviewCount: Math.floor(Math.random() * 200) + 10,
  discount: Math.random() > 0.7 ? `${Math.floor(Math.random() * 40) + 10}%` : undefined,
  affiliateUrl: 'https://example.com',
  isExclusive: Math.random() > 0.8,
  isTrending: Math.random() > 0.8,
  favorite: false,
  timesWorn: 0,
  dateAdded: new Date()
}));

// Group items into different categories
const editorsPicks = dummyItems.slice(0, 6);
const trendingItems = dummyItems.slice(6, 12).map(item => ({ ...item, isTrending: true }));
const vibeItems = dummyItems.slice(0, 8).reverse();

interface FilterOption {
  label: string;
  value: string;
  options: string[];
  icon?: React.ReactNode;
}

const filterOptions: FilterOption[] = [
  {
    label: 'Season',
    value: 'season',
    options: ['Spring', 'Summer', 'Fall', 'Winter'],
    icon: <Palette className="h-3 w-3" />
  },
  {
    label: 'Price',
    value: 'price',
    options: ['Under $25', '$25-$50', '$50-$100', 'Over $100'],
    icon: <ShoppingBag className="h-3 w-3" />
  },
  {
    label: 'Occasion',
    value: 'occasion',
    options: ['Casual', 'Work', 'Party', 'Formal', 'Outdoor'],
    icon: <ThumbsUp className="h-3 w-3" />
  },
  {
    label: 'Color',
    value: 'color',
    options: ['Black', 'White', 'Blue', 'Red', 'Green'],
    icon: <Palette className="h-3 w-3" />
  }
];

interface UnifiedProductsCarouselProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onStylistSuggestion?: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

const UnifiedProductsCarousel = ({
  isPremiumUser,
  onTryItem,
  onStylistSuggestion,
  onUpgradeToPremium
}: UnifiedProductsCarouselProps) => {
  const [activeTab, setActiveTab] = useState("editors");
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const handleLikeItem = (itemId: string) => {
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    
    setLikedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
    
    toast.success(likedItems[itemId] ? 'Removed from wishlist' : 'Added to wishlist');
  };
  
  const handleShopNow = (item: ShopItem) => {
    toast.success(`Opening ${item.retailer} store...`);
    window.open(item.affiliateUrl, '_blank');
  };
  
  const handleFilterToggle = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(prev => prev.filter(f => f !== filter));
    } else {
      setActiveFilters(prev => [...prev, filter]);
    }
  };
  
  // Get items based on active tab
  const getActiveItems = () => {
    switch (activeTab) {
      case "editors":
        return editorsPicks;
      case "trending":
        return trendingItems;
      case "vibe":
        return vibeItems;
      default:
        return editorsPicks;
    }
  };
  
  const activeItems = getActiveItems();
  
  // Render product card
  const renderProductCard = (item: ShopItem, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="min-w-[200px] flex-shrink-0"
    >
      <div className="relative rounded-lg overflow-hidden bg-slate-800 border border-white/10 hover:border-purple-500/30 transition-all h-full flex flex-col">
        <div className="relative">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
          />
          
          {item.discount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0">
              -{item.discount}
            </Badge>
          )}
          
          {item.isExclusive && (
            <Badge className="absolute top-2 right-2 bg-purple-500 text-white border-0 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> 
              Exclusive
            </Badge>
          )}
          
          {item.isTrending && !item.isExclusive && (
            <Badge className="absolute top-2 right-2 bg-blue-500 text-white border-0 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> 
              Trending
            </Badge>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center p-4">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="bg-white text-black hover:bg-white/90"
                onClick={() => onTryItem(item)}
              >
                Try On
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="bg-black/40 border-white/40 text-white hover:bg-black/60"
                onClick={() => handleLikeItem(item.id)}
              >
                <Heart className={`h-4 w-4 ${likedItems[item.id] ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-3 flex-grow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-medium text-white/90 line-clamp-1">{item.name}</h3>
              <span className="text-sm font-bold text-white">{item.price}</span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/60">{item.retailer}</p>
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-xs text-white/70">{item.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {item.occasions.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-700 rounded-full text-white/60 capitalize">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs h-8"
            onClick={() => handleShopNow(item)}
          >
            Shop Now 
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Shop Collections</h2>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white/70 hover:text-white"
          onClick={() => setActiveFilters([])}
        >
          View All
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-slate-800/50">
            <TabsTrigger value="editors" className="data-[state=active]:bg-purple-900/30">
              <Star className="h-4 w-4 mr-2" />
              Editor's Picks
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-blue-900/30">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="vibe" className="data-[state=active]:bg-pink-900/30">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Your Vibe
            </TabsTrigger>
          </TabsList>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="border-white/20 text-white/70 hover:text-white flex items-center gap-1.5"
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {filterOptions.map((filter) => (
            <Button
              key={filter.value}
              variant="outline"
              size="sm"
              className={`h-8 text-xs border-white/20 ${
                activeFilters.includes(filter.value) 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/70'
              }`}
              onClick={() => handleFilterToggle(filter.value)}
            >
              {filter.icon}
              <span className="ml-1.5">{filter.label}</span>
            </Button>
          ))}
        </div>
        
        <Card className="border-white/10 bg-slate-900/40 overflow-hidden">
          <CardContent className="p-4 relative">
            <ScrollArea>
              <div className="flex gap-4 pb-4">
                {activeItems.map((item, i) => renderProductCard(item, i))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            
            <motion.div 
              className="absolute top-1/2 left-2 -translate-y-1/2 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-black/30 rounded-full hover:bg-black/50 text-white"
              >
                <ArrowLeftCircle className="h-8 w-8" />
              </Button>
            </motion.div>
            
            <motion.div 
              className="absolute top-1/2 right-2 -translate-y-1/2 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-black/30 rounded-full hover:bg-black/50 text-white"
              >
                <ArrowRightCircle className="h-8 w-8" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default UnifiedProductsCarousel;
