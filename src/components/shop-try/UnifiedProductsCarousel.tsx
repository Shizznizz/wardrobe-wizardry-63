import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  ThumbsUp,
  Palette,
  Filter,
  ArrowLeftCircle,
  ArrowRightCircle
} from 'lucide-react';
import { ClothingItem, ShopItem } from '@/lib/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

import ProductCard from './ProductCard';

const dummyItems: ShopItem[] = Array(12).fill(null).map((_, i) => ({
  id: `item-${i}`,
  name: ['Casual Shirt', 'Summer Dress', 'Denim Jacket', 'Wool Sweater', 'Linen Pants'][i % 5],
  type: ['shirt', 'dress', 'jacket', 'sweater', 'pants'][i % 5] as any,
  color: ['blue', 'red', 'green', 'black', 'white'][i % 5] as any,
  material: ['cotton', 'polyester', 'denim', 'wool', 'linen'][i % 5] as any,
  season: ['summer', 'winter', 'spring', 'autumn'] as any[],
  occasions: ['casual', 'formal', 'business', 'party', 'outdoor'] as any[],
  image: '/placeholder.svg',
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
  activeMood?: string | null;
  onMoodSelect?: (mood: string | null) => void;
}

const UnifiedProductsCarousel = ({
  isPremiumUser,
  onTryItem,
  onStylistSuggestion,
  onUpgradeToPremium,
  activeMood,
  onMoodSelect
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
  
  const handleFilterToggle = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(prev => prev.filter(f => f !== filter));
    } else {
      setActiveFilters(prev => [...prev, filter]);
    }
  };
  
  const handleMoodSelect = (mood: string | null) => {
    if (onMoodSelect) {
      onMoodSelect(mood);
    }
  };
  
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
        
        {onMoodSelect && (
          <div className="flex flex-wrap gap-2 mb-4">
            {['Romantic', 'Power Boss', 'Casual', 'Creative', 'Relaxed'].map((mood) => (
              <Button
                key={mood}
                variant="outline"
                size="sm"
                className={`h-8 text-xs border-white/20 ${
                  activeMood === mood
                    ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white border-purple-500/30'
                    : 'text-white/70'
                }`}
                onClick={() => handleMoodSelect(activeMood === mood ? null : mood)}
              >
                <span className="ml-1.5">{mood}</span>
              </Button>
            ))}
          </div>
        )}
        
        <Card className="border-white/10 bg-slate-900/40 overflow-hidden">
          <CardContent className="p-4 relative">
            <ScrollArea>
              <div className="flex gap-4 pb-4">
                {activeItems.map((item, i) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    index={i}
                    isPremiumUser={isPremiumUser}
                    onTryItem={onTryItem}
                    onUpgradeToPremium={onUpgradeToPremium}
                    likedItems={likedItems}
                    onLikeItem={handleLikeItem}
                  />
                ))}
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
