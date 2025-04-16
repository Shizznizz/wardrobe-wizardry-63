import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClothingItem, ClothingType, ClothingColor, ClothingMaterial, ClothingSeason, ClothingOccasion } from '@/lib/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Calendar, 
  History, 
  Star, 
  Trash2, 
  ArrowRight, 
  XIcon,
  ShoppingBag,
  ExternalLink,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface WishlistAndHistoryProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

const WishlistAndHistory = ({
  isPremiumUser,
  onTryItem,
  onUpgradeToPremium
}: WishlistAndHistoryProps) => {
  const [activeTab, setActiveTab] = useState('wishlist');
  const [wishlistItems, setWishlistItems] = useState<ClothingItem[]>(dummyWishlistItems);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(dummyHistoryItems);
  
  if (!isPremiumUser) {
    return (
      <Card className="border-white/10 backdrop-blur-sm bg-gradient-to-br from-purple-900/10 to-slate-900/10 overflow-hidden">
        <CardContent className="p-6 text-center">
          <div className="p-3 rounded-full bg-amber-500/10 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <Heart className="h-8 w-8 text-amber-500" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Save Your Favorite Looks</h3>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Premium members can save their favorite items and access their try-on history anytime.
          </p>
          
          <Button 
            onClick={onUpgradeToPremium}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90"
          >
            Upgrade to Premium
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const handleRemoveWishlistItem = (id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    toast.success('Item removed from wishlist');
  };
  
  const handleRemoveHistoryItem = (id: string) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
    toast.success('History item removed');
  };
  
  const handleTryAgain = (item: ClothingItem) => {
    onTryItem(item);
    toast.success('Item ready to try on!');
  };
  
  const handleShopNow = (url: string) => {
    window.open(url, '_blank');
    toast.success('Opening store...');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Your Collection
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-white/10 via-transparent to-transparent"></div>
      </div>
      
      <Card className="border-white/10 bg-slate-900/40 overflow-hidden shadow-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-slate-800 border-b border-white/5 p-0 rounded-none h-11">
            <TabsTrigger
              value="wishlist"
              className="flex-1 h-10 rounded-none data-[state=active]:bg-slate-900 data-[state=active]:shadow-none border-r border-white/5"
            >
              <Heart className="h-4 w-4 mr-2" />
              Wishlist ({wishlistItems.length})
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex-1 h-10 rounded-none data-[state=active]:bg-slate-900 data-[state=active]:shadow-none"
            >
              <History className="h-4 w-4 mr-2" />
              Try-On History ({historyItems.length})
            </TabsTrigger>
          </TabsList>
          
          <CardContent className="p-4">
            {activeTab === 'wishlist' && (
              <div>
                {wishlistItems.length > 0 ? (
                  <ScrollArea className="h-[350px] pr-3">
                    <div className="space-y-3">
                      {wishlistItems.map((item) => (
                        <motion.div
                          key={item.id}
                          className="bg-slate-800/70 border border-white/5 rounded-lg overflow-hidden flex"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="w-20 h-20 flex-shrink-0">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-grow p-3 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-sm text-white">{item.name}</h4>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 text-white/50 hover:text-white -mr-1 -mt-1"
                                  onClick={() => handleRemoveWishlistItem(item.id)}
                                >
                                  <XIcon className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(Array.isArray(item.occasions) ? item.occasions : []).slice(0, 2).map((occasion, i) => (
                                  <Badge 
                                    key={`${item.id}-${i}`} 
                                    variant="outline" 
                                    className="px-1.5 py-0 text-[10px] border-white/10 text-white/70"
                                  >
                                    {occasion}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-xs text-white/60">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                Added {new Date(item.dateAdded).toLocaleDateString()}
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs px-2 text-purple-300 hover:text-purple-200"
                                onClick={() => handleTryAgain(item)}
                              >
                                Try On
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <ScrollBar />
                  </ScrollArea>
                ) : (
                  <div className="py-8 text-center">
                    <Heart className="h-12 w-12 text-white/20 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white mb-2">Your wishlist is empty</h3>
                    <p className="text-white/60 text-sm max-w-xs mx-auto mb-4">
                      Save items you love while shopping to build your dream wardrobe
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                      size="sm"
                    >
                      Browse Trending Items
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'history' && (
              <div>
                {historyItems.length > 0 ? (
                  <ScrollArea className="h-[350px] pr-3">
                    <div className="space-y-3">
                      {historyItems.map((item) => (
                        <motion.div
                          key={item.id}
                          className="bg-slate-800/70 border border-white/5 rounded-lg overflow-hidden"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="flex">
                            <div className="w-20 h-20 flex-shrink-0">
                              <img 
                                src={item.resultImageUrl} 
                                alt="Try-on result" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-grow p-3 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between">
                                  <h4 className="font-medium text-sm text-white">
                                    {item.itemName}
                                  </h4>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 text-white/50 hover:text-white -mr-1 -mt-1"
                                    onClick={() => handleRemoveHistoryItem(item.id)}
                                  >
                                    <XIcon className="h-3 w-3" />
                                  </Button>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-3 w-3 ${i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} 
                                      />
                                    ))}
                                  </div>
                                  
                                  <span className="text-xs text-white/60">
                                    {new Date(item.date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-2">
                                <div className="text-xs text-white/60 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {item.timeAgo}
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs px-2 text-purple-300 hover:text-purple-200"
                                    onClick={() => handleTryAgain(item.item)}
                                  >
                                    Try Again
                                  </Button>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs px-2 text-blue-300 hover:text-blue-200"
                                    onClick={() => handleShopNow(item.affiliateUrl)}
                                  >
                                    <ShoppingBag className="h-3 w-3 mr-1" />
                                    Shop
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <ScrollBar />
                  </ScrollArea>
                ) : (
                  <div className="py-8 text-center">
                    <History className="h-12 w-12 text-white/20 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white mb-2">No try-on history yet</h3>
                    <p className="text-white/60 text-sm max-w-xs mx-auto mb-4">
                      Try on some outfits and they'll appear here for quick access
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                      size="sm"
                    >
                      Start Trying On
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};

interface HistoryItem {
  id: string;
  itemName: string;
  resultImageUrl: string;
  date: Date;
  timeAgo: string;
  rating: number;
  affiliateUrl: string;
  item: ClothingItem;
}

const dummyWishlistItems: ClothingItem[] = Array(5).fill(null).map((_, i) => ({
  id: `wishlist-${i}`,
  name: ['Trench Coat', 'Silk Scarf', 'Striped Shirt', 'Canvas Sneakers', 'Linen Pants'][i],
  type: ['jacket', 'accessories', 'shirt', 'shoes', 'pants'][i] as ClothingType,
  color: ['beige', 'purple', 'blue', 'white', 'brown'][i] as ClothingColor,
  material: ['cotton', 'silk', 'cotton', 'canvas', 'linen'][i] as ClothingMaterial,
  season: ['autumn', 'spring', 'all', 'summer', 'summer'] as ClothingSeason[],
  occasions: ['casual', 'formal', 'business', 'casual', 'casual'] as ClothingOccasion[],
  imageUrl: '/placeholder.svg',
  favorite: false,
  timesWorn: 0,
  dateAdded: new Date()
}));

const dummyHistoryItems: HistoryItem[] = [
  {
    id: 'history-1',
    itemName: 'Blue Denim Jacket',
    resultImageUrl: '/placeholder.svg',
    date: new Date(),
    timeAgo: '2 days ago',
    rating: 4,
    affiliateUrl: 'https://example.com',
    item: {
      id: 'history-item-1',
      name: 'Blue Denim Jacket',
      type: 'jacket' as ClothingType,
      color: 'blue' as ClothingColor,
      material: 'denim' as ClothingMaterial,
      season: ['spring', 'autumn'] as ClothingSeason[],
      occasions: ['casual'] as ClothingOccasion[],
      imageUrl: '/placeholder.svg',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date()
    }
  },
  {
    id: 'history-2',
    itemName: 'Floral Summer Dress',
    resultImageUrl: '/placeholder.svg',
    date: new Date(),
    timeAgo: '1 week ago',
    rating: 5,
    affiliateUrl: 'https://example.com',
    item: {
      id: 'history-item-2',
      name: 'Floral Summer Dress',
      type: 'dress' as ClothingType,
      color: 'pink' as ClothingColor,
      material: 'cotton' as ClothingMaterial,
      season: ['summer'] as ClothingSeason[],
      occasions: ['casual'] as ClothingOccasion[],
      imageUrl: '/placeholder.svg',
      favorite: true,
      timesWorn: 2,
      dateAdded: new Date()
    }
  },
  {
    id: 'history-3',
    itemName: 'Linen Blend Shirt',
    resultImageUrl: '/placeholder.svg',
    date: new Date(),
    timeAgo: '2 weeks ago',
    rating: 3,
    affiliateUrl: 'https://example.com',
    item: {
      id: 'history-item-3',
      name: 'Linen Blend Shirt',
      type: 'shirt' as ClothingType,
      color: 'white' as ClothingColor,
      material: 'linen' as ClothingMaterial,
      season: ['summer'] as ClothingSeason[],
      occasions: ['casual'] as ClothingOccasion[],
      imageUrl: '/placeholder.svg',
      favorite: false,
      timesWorn: 1,
      dateAdded: new Date()
    }
  }
];

export default WishlistAndHistory;

const itemsWithCorrectTypes: ClothingItem[] = [
  {
    id: 'history-1',
    name: 'Silk Blouse',
    type: 'shirt',
    color: 'white',
    material: 'silk',
    season: ['spring', 'summer', 'autumn'],
    occasions: ['formal', 'business'],
    image: '/placeholder.svg',
    imageUrl: 'https://example.com/image.jpg',
    favorite: false,
    timesWorn: 0,
    dateAdded: new Date()
  },
  // ... other items
];
