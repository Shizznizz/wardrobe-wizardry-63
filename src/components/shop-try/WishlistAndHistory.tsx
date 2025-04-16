
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClothingItem } from '@/lib/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Clock, 
  Trash2, 
  RotateCcw, 
  ShoppingBag, 
  Calendar, 
  Lock, 
  Image,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface TryOnHistoryItem {
  id: string;
  date: string;
  imageUrl: string;
  itemName: string;
  saved: boolean;
}

interface WishlistAndHistoryProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
  onTryItem: (item: ClothingItem) => void;
}

const dummyHistoryItems: TryOnHistoryItem[] = Array(6).fill(null).map((_, i) => ({
  id: `history-${i}`,
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
  imageUrl: '/placeholder.svg',
  itemName: ['Blue Jacket', 'White Dress', 'Summer Hat', 'Casual Jeans', 'Floral Blouse', 'Leather Boots'][i],
  saved: Math.random() > 0.5
}));

const dummyWishlistItems: ClothingItem[] = Array(5).fill(null).map((_, i) => ({
  id: `wishlist-${i}`,
  name: ['Trench Coat', 'Silk Scarf', 'Striped Shirt', 'Canvas Sneakers', 'Linen Pants'][i],
  type: ['coat', 'scarf', 'shirt', 'shoes', 'pants'][i],
  colors: ['beige', 'multicolor', 'blue', 'white', 'tan'],
  seasons: ['fall', 'spring', 'all', 'summer', 'summer'],
  occasions: ['casual', 'formal', 'work', 'casual', 'casual'],
  imageUrl: '/placeholder.svg',
}));

const WishlistAndHistory = ({
  isPremiumUser,
  onUpgradeToPremium,
  onTryItem
}: WishlistAndHistoryProps) => {
  const [activeTab, setActiveTab] = useState('wishlist');
  const [wishlistItems, setWishlistItems] = useState(dummyWishlistItems);
  const [historyItems, setHistoryItems] = useState(dummyHistoryItems);
  
  const handleRemoveWishlistItem = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Item removed from wishlist');
  };
  
  const handleToggleSavedHistory = (itemId: string) => {
    setHistoryItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, saved: !item.saved } 
          : item
      )
    );
    
    const isNowSaved = historyItems.find(item => item.id === itemId)?.saved;
    toast.success(isNowSaved ? 'Removed from saved looks' : 'Added to saved looks');
  };
  
  const handleClearHistory = () => {
    setHistoryItems([]);
    toast.success('Try-on history cleared');
  };
  
  const handleTryOnAgain = (item: TryOnHistoryItem) => {
    toast.success(`Preparing to try on ${item.itemName} again...`);
  };
  
  if (!isPremiumUser) {
    return (
      <Card className="border-white/10 bg-gradient-to-br from-slate-900/80 to-purple-950/80 overflow-hidden">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 flex items-center justify-center">
            <Lock className="h-8 w-8 text-yellow-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Premium Feature</h3>
          <p className="text-white/70 max-w-md mx-auto mb-6">
            Unlock wishlists and try-on history with Premium. Save your favorite looks and easily access your past try-ons.
          </p>
          <Button 
            onClick={onUpgradeToPremium}
            className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-90"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Unlock Premium Features
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-white/10 bg-slate-900/40 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-400" />
            <h2 className="text-xl font-semibold text-white">Your Collection</h2>
          </div>
          
          {activeTab === 'history' && historyItems.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/70 hover:text-white"
              onClick={handleClearHistory}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Clear History
            </Button>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-800/50">
            <TabsTrigger value="wishlist" className="data-[state=active]:bg-pink-900/30">
              <Heart className="h-4 w-4 mr-2" />
              Saved Items
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-blue-900/30">
              <Clock className="h-4 w-4 mr-2" />
              Try-On History
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            {activeTab === 'wishlist' ? (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {wishlistItems.length > 0 ? (
                  <ScrollArea>
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 pb-4">
                      {wishlistItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative group"
                        >
                          <div className="rounded-lg overflow-hidden bg-slate-800 border border-white/10 hover:border-pink-500/30 transition-all">
                            <div className="relative aspect-square bg-gray-800">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                                  <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                                    <Button 
                                      size="sm" 
                                      className="flex-1 h-8 text-xs bg-white text-black hover:bg-white/90"
                                      onClick={() => onTryItem(item)}
                                    >
                                      Try On
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="h-8 w-8 p-0 bg-black/60 border-white/40 text-white"
                                      onClick={() => handleRemoveWishlistItem(item.id)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="p-2.5">
                              <h3 className="text-sm font-medium text-white/90 line-clamp-1">{item.name}</h3>
                              <div className="flex justify-between items-center mt-0.5">
                                <p className="text-xs text-white/60 capitalize">{item.type}</p>
                                <div className="flex gap-1">
                                  {item.seasons.slice(0, 1).map(season => (
                                    <span key={season} className="text-[10px] px-1.5 py-0.5 bg-slate-700 rounded-full text-white/60 capitalize">
                                      {season}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                ) : (
                  <div className="text-center py-10 px-4 border border-dashed border-white/10 rounded-lg">
                    <Heart className="h-10 w-10 text-white/20 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white/80 mb-1">Your wishlist is empty</h3>
                    <p className="text-white/60 text-sm">
                      Save items you love by clicking the heart icon
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {historyItems.length > 0 ? (
                  <ScrollArea>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                      {historyItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative group"
                        >
                          <div className="rounded-lg overflow-hidden bg-slate-800 border border-white/10 hover:border-blue-500/30 transition-all">
                            <div className="relative aspect-square bg-gray-800">
                              <img
                                src={item.imageUrl}
                                alt={item.itemName}
                                className="w-full h-full object-cover"
                              />
                              <Badge 
                                variant="outline" 
                                className="absolute top-2 left-2 bg-black/60 border-white/20 text-white/90 flex items-center gap-1"
                              >
                                <Calendar className="h-3 w-3" />
                                {item.date}
                              </Badge>
                              
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
                                  <p className="text-white text-sm font-medium">{item.itemName}</p>
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="h-8 flex-1 bg-white/10 border-white/40 backdrop-blur-sm text-white text-xs"
                                      onClick={() => handleTryOnAgain(item)}
                                    >
                                      <RotateCcw className="h-3 w-3 mr-1" />
                                      Try Again
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className={`h-8 w-8 p-0 ${
                                        item.saved 
                                          ? 'bg-pink-500/20 border-pink-500/50 text-pink-300' 
                                          : 'bg-black/60 border-white/40 text-white'
                                      }`}
                                      onClick={() => handleToggleSavedHistory(item.id)}
                                    >
                                      <Heart className={`h-3.5 w-3.5 ${item.saved ? 'fill-pink-300' : ''}`} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                ) : (
                  <div className="text-center py-10 px-4 border border-dashed border-white/10 rounded-lg">
                    <Image className="h-10 w-10 text-white/20 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white/80 mb-1">No try-on history yet</h3>
                    <p className="text-white/60 text-sm">
                      Your try-on history will appear here after you generate looks
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WishlistAndHistory;
