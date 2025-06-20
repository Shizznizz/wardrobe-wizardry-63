import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, Shirt, Lock, Bookmark, BookmarkCheck, Clock } from 'lucide-react';
import { ClothingItem } from '@/lib/types';
import { toast } from 'sonner';
import { createShopClothingItem } from '@/lib/itemHelpers';

interface WishlistAndHistoryProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
  onRemoveFromWishlist: (item: ClothingItem) => void;
}

const WishlistAndHistory = ({ isPremiumUser, onTryItem, onUpgradeToPremium, onRemoveFromWishlist }: WishlistAndHistoryProps) => {
  const [activeTab, setActiveTab] = useState('wishlist');
  
  // Mock wishlist data using helper function
  const wishlistItems: ClothingItem[] = [
    createShopClothingItem({
      id: 'wish-1',
      name: 'Vintage Leather Jacket',
      type: 'jacket',
      color: 'black',
      brand: 'Classic Style',
      imageUrl: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=500&h=600',
      price: 199.99,
      season: ['fall', 'winter'],
      occasions: ['casual'],
      tags: ['vintage', 'edgy']
    }),
    createShopClothingItem({
      id: 'wish-2',
      name: 'Floral Summer Dress',
      type: 'dress',
      color: 'pink',
      brand: 'Bloom Fashion',
      imageUrl: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=500&h=600',
      price: 89.99,
      season: ['spring', 'summer'],
      occasions: ['casual'],
      tags: ['floral', 'feminine']
    }),
    createShopClothingItem({
      id: 'wish-3',
      name: 'High-Waist Trousers',
      type: 'pants',
      color: 'navy',
      brand: 'Professional Line',
      imageUrl: 'https://images.unsplash.com/photo-1551489186-cf8726f514f8?auto=format&fit=crop&w=500&h=600',
      price: 79.99,
      season: ['all'],
      occasions: ['work'],
      tags: ['professional', 'classic']
    }),
    createShopClothingItem({
      id: 'wish-4',
      name: 'Cashmere Cardigan',
      type: 'cardigan',
      color: 'beige',
      brand: 'Luxury Knits',
      imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&h=600',
      price: 149.99,
      season: ['fall', 'winter'],
      occasions: ['casual'],
      tags: ['luxury', 'cozy']
    })
  ];
  
  // Mock recently viewed items using helper function
  const recentlyViewed: ClothingItem[] = [
    createShopClothingItem({
      id: 'recent-1',
      name: 'Striped T-Shirt',
      type: 'top',
      color: 'white',
      brand: 'Basic Essentials',
      imageUrl: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=500&h=600',
      price: 29.99,
      season: ['spring', 'summer'],
      occasions: ['casual'],
      tags: ['basic', 'striped']
    }),
    createShopClothingItem({
      id: 'recent-2',
      name: 'Midi Skirt',
      type: 'skirt',
      color: 'burgundy',
      brand: 'Elegant Wear',
      imageUrl: 'https://images.unsplash.com/photo-1577900232022-11d542d5790d?auto=format&fit=crop&w=500&h=600',
      price: 69.99,
      season: ['fall'],
      occasions: ['work'],
      tags: ['elegant', 'professional']
    }),
    createShopClothingItem({
      id: 'recent-3',
      name: 'Ankle Boots',
      type: 'shoes',
      color: 'black',
      brand: 'Urban Steps',
      imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=500&h=600',
      price: 119.99,
      season: ['fall', 'winter'],
      occasions: ['casual'],
      tags: ['versatile', 'comfortable']
    })
  ];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
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
