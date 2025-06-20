import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, Shirt, Lock, Bookmark, BookmarkCheck, Clock } from 'lucide-react';
import { ClothingItem } from '@/lib/types';
import { toast } from 'sonner';

interface WishlistAndHistoryProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

const WishlistAndHistory = ({ isPremiumUser, onTryItem, onUpgradeToPremium }: WishlistAndHistoryProps) => {
  const [wishlistItems, setWishlistItems] = useState<ClothingItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sample wishlist items
    const sampleWishlist: ClothingItem[] = [
      {
        id: 'wish-1',
        name: 'Oversized Boyfriend Blazer',
        type: 'jacket',
        color: 'black',
        season: ['all'],  // Fixed: array instead of string
        image: '',
        occasion: 'formal',
        brand: 'Zara',
        imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&h=600',
        price: 79.99,  // Fixed: number instead of string
        tags: ['Office', 'Power Look'],
        affiliateUrl: 'https://www.zara.com'
      },
      {
        id: 'wish-2',
        name: 'Satin Midi Skirt',
        type: 'skirt',
        color: 'pink',
        season: ['spring', 'summer'],  // Fixed: array instead of string
        image: '',
        occasion: 'casual',
        brand: 'H&M',
        imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=500&h=600',
        price: 49.99,  // Fixed: number instead of string
        tags: ['Elegant', 'Feminine'],
        affiliateUrl: 'https://www.hm.com'
      },
      {
        id: 'wish-3',
        name: 'Chunky Platform Boots',
        type: 'boots',
        color: 'black',
        season: ['autumn', 'winter'],  // Fixed: array instead of string
        image: '',
        occasion: 'casual',
        brand: 'Dr. Martens',
        imageUrl: 'https://images.unsplash.com/photo-1608256471372-41a9a2ecafe3?auto=format&fit=crop&w=500&h=600',
        price: 159.99,  // Fixed: number instead of string
        tags: ['Edgy', 'Statement'],
        affiliateUrl: 'https://www.drmartens.com'
      },
      {
        id: 'wish-4',
        name: 'Knit Cardigan',
        type: 'sweater',
        color: 'beige',
        season: ['autumn', 'winter'],  // Fixed: array instead of string
        image: '',
        occasion: 'casual',
        brand: 'Mango',
        imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&h=600',
        price: 45.99,  // Fixed: number instead of string
        tags: ['Cozy', 'Layering'],
        affiliateUrl: 'https://www.mango.com'
      }
    ];
    
    // Sample recently viewed items
    const sampleRecent: ClothingItem[] = [
      {
        id: 'recent-1',
        name: 'One-piece Swimsuit',
        type: 'other',  // Changed from 'swimwear' to valid type
        color: 'blue',
        season: ['summer'],  // Fixed: array instead of string
        image: '',
        occasion: 'casual',
        brand: 'Seafolly',
        imageUrl: 'https://images.unsplash.com/photo-1570976447640-ac859a117d57?auto=format&fit=crop&w=500&h=600',
        price: 89.99,  // Fixed: number instead of string
        tags: ['Beach', 'Resort'],
        affiliateUrl: 'https://www.seafolly.com'
      },
      {
        id: 'recent-2',
        name: 'Evening Gown',
        type: 'dress',
        color: 'purple',  // Changed from 'burgundy' to valid color
        season: ['all'],  // Fixed: array instead of string
        image: '',
        occasion: 'formal',
        brand: 'ASOS',
        imageUrl: 'https://images.unsplash.com/photo-1623609163841-5e69d8c62cc7?auto=format&fit=crop&w=500&h=600',
        price: 129.99,  // Fixed: number instead of string
        tags: ['Elegant', 'Event'],
        affiliateUrl: 'https://www.asos.com'
      },
      {
        id: 'recent-3',
        name: 'Leather Tote Bag',
        type: 'accessories',
        color: 'brown',
        season: ['all'],  // Fixed: array instead of string
        image: '',
        occasion: 'casual',
        brand: 'Coach',
        imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&h=600',
        price: 249.99,  // Fixed: number instead of string
        tags: ['Classic', 'Everyday'],
        affiliateUrl: 'https://www.coach.com'
      }
    ];

    setTimeout(() => {
      setWishlistItems(sampleWishlist);
      setRecentlyViewed(sampleRecent);
      setLoading(false);
    }, 800);
  }, []);

  const handleShopNow = (item: ClothingItem) => {
    if (item.affiliateUrl) {
      window.open(item.affiliateUrl, '_blank');
      toast.success('Opening retailer website in a new tab');
    }
  };

  const handleTryOn = (item: ClothingItem) => {
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    
    onTryItem(item);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-12"
      >
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Your Wishlist
          </h2>
        </div>
        <div className="flex justify-center p-8">
          <div className="w-10 h-10 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Your Wishlist
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Card className="h-full border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                
                {!isPremiumUser && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 opacity-0 hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm"
                      onClick={() => onUpgradeToPremium()}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Unlock Try-On
                    </Button>
                  </div>
                )}
                
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                  {item.brand}
                </div>
                
                {item.price && (
                  <div className="absolute top-2 right-2 bg-purple-600/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    ${item.price.toFixed(2)}
                  </div>
                )}
              </div>
              
              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium text-white truncate">{item.name}</h3>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.tags && item.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 flex-1"
                    onClick={() => handleTryOn(item)}
                  >
                    <Shirt className="h-3.5 w-3.5 mr-1.5" />
                    Try Now
                  </Button>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                    onClick={() => handleShopNow(item)}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    Shop
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="flex items-center mt-10 mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Recently Viewed
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentlyViewed.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Card className="h-full border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                
                {!isPremiumUser && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 opacity-0 hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm"
                      onClick={() => onUpgradeToPremium()}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Unlock Try-On
                    </Button>
                  </div>
                )}
                
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                  {item.brand}
                </div>
                
                {item.price && (
                  <div className="absolute top-2 right-2 bg-purple-600/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    ${item.price.toFixed(2)}
                  </div>
                )}
              </div>
              
              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium text-white truncate">{item.name}</h3>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.tags && item.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 flex-1"
                    onClick={() => handleTryOn(item)}
                  >
                    <Shirt className="h-3.5 w-3.5 mr-1.5" />
                    Try Now
                  </Button>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                    onClick={() => handleShopNow(item)}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    Shop
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="text-xs text-center text-white/60 mt-3">
        <p>Affiliate Disclosure: We may earn a commission for purchases made through these links.</p>
      </div>
    </motion.div>
  );
};

export default WishlistAndHistory;
