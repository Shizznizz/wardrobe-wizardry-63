
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, History, ShoppingBag, ExternalLink, Lock } from 'lucide-react';
import { ClothingItem } from '@/lib/types';

interface WishlistAndHistoryProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

const WishlistAndHistory = ({ isPremiumUser, onTryItem, onUpgradeToPremium }: WishlistAndHistoryProps) => {
  const [wishlistItems, setWishlistItems] = useState<ClothingItem[]>([]);
  const [historyItems, setHistoryItems] = useState<ClothingItem[]>([]);
  const [sheinProducts, setSheinProducts] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sample data for Shein products
    const sampleSheinProducts: ClothingItem[] = [
      {
        id: 'shein-1',
        name: 'Floral Maxi Dress',
        type: 'dress',
        color: 'multicolor',
        season: 'summer',
        occasion: 'casual',
        brand: 'SHEIN',
        imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=500&h=600',
        price: '$22.99',
        tags: ['Boho Chic', 'Summer'],
        affiliateUrl: 'https://nl.shein.com/floral-maxi-dress.html?msockid=2899f7288144623b0eb3e4678084638d'
      },
      {
        id: 'shein-2',
        name: 'Ribbed Crop Top',
        type: 'top',
        color: 'white',
        season: 'all',
        occasion: 'casual',
        brand: 'SHEIN',
        imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=500&h=600',
        price: '$8.99',
        tags: ['Everyday Casual', 'Minimalist'],
        affiliateUrl: 'https://nl.shein.com/ribbed-crop-top.html?msockid=2899f7288144623b0eb3e4678084638d'
      },
      {
        id: 'shein-3',
        name: 'Pleated Mini Skirt',
        type: 'skirt',
        color: 'black',
        season: 'all',
        occasion: 'casual',
        brand: 'SHEIN',
        imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=500&h=600',
        price: '$15.99',
        tags: ['Date Night', 'Party'],
        affiliateUrl: 'https://nl.shein.com/pleated-mini-skirt.html?msockid=2899f7288144623b0eb3e4678084638d'
      },
      {
        id: 'shein-4',
        name: 'Oversized Graphic Tee',
        type: 'top',
        color: 'gray',
        season: 'all',
        occasion: 'casual',
        brand: 'SHEIN',
        imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&h=600',
        price: '$12.99',
        tags: ['Everyday Casual', 'Streetwear'],
        affiliateUrl: 'https://nl.shein.com/oversized-graphic-tee.html?msockid=2899f7288144623b0eb3e4678084638d'
      }
    ];

    // Sample wishlist data
    const sampleWishlist: ClothingItem[] = [
      {
        id: 'wish-1',
        name: 'Leather Jacket',
        type: 'jacket',
        color: 'black',
        season: 'fall',
        occasion: 'casual',
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&h=600',
        price: '$120.99'
      },
      {
        id: 'wish-2',
        name: 'Crochet Bikini',
        type: 'swimwear',
        color: 'white',
        season: 'summer',
        occasion: 'beach',
        imageUrl: 'https://images.unsplash.com/photo-1582751836556-7ff8173e5ed7?auto=format&fit=crop&w=500&h=600',
        price: '$32.99'
      }
    ];

    // Sample history data
    const sampleHistory: ClothingItem[] = [
      {
        id: 'hist-1',
        name: 'Ruched Midi Dress',
        type: 'dress',
        color: 'burgundy',
        season: 'all',
        occasion: 'formal',
        imageUrl: 'https://images.unsplash.com/photo-1546052646-a88eafec0399?auto=format&fit=crop&w=500&h=600',
        price: '$45.99'
      },
      {
        id: 'hist-2',
        name: 'Pleated Trousers',
        type: 'pants',
        color: 'navy',
        season: 'all',
        occasion: 'formal',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&h=600',
        price: '$62.99'
      }
    ];

    setTimeout(() => {
      setSheinProducts(sampleSheinProducts);
      setWishlistItems(sampleWishlist);
      setHistoryItems(sampleHistory);
      setLoading(false);
    }, 800);
  }, []);

  const handleTryOn = (item: ClothingItem) => {
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    
    onTryItem(item);
  };

  const handleShopNow = (item: ClothingItem) => {
    if (item.affiliateUrl) {
      window.open(item.affiliateUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-16"
      >
        <div className="flex justify-center p-8">
          <div className="w-10 h-10 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Shein Products Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <div className="flex items-center mb-6">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"></div>
          <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
            Based on Your Vibe - SHEIN
          </h2>
          <div className="h-px flex-grow bg-gradient-to-r from-pink-500/30 via-transparent to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sheinProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card className="h-full border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
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
                    {product.brand}
                  </div>
                  
                  {product.price && (
                    <div className="absolute top-2 right-2 bg-pink-600/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {product.price}
                    </div>
                  )}
                </div>
                
                <div className="p-4 space-y-3">
                  <h3 className="font-medium text-white truncate">{product.name}</h3>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.tags && product.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-pink-600 to-red-500 hover:opacity-90 flex-1"
                      onClick={() => handleTryOn(product)}
                    >
                      Try On
                    </Button>
                    
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                      onClick={() => handleShopNow(product)}
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      Shop
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="text-xs text-center text-white/60 mt-3">
          <p>Affiliate Disclosure: We may earn a commission for purchases made through these links.</p>
        </div>
      </motion.div>
      
      {/* Wishlist and History Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-16"
      >
        <Tabs defaultValue="wishlist" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-slate-800/50 border border-white/10">
              <TabsTrigger value="wishlist" className="data-[state=active]:bg-indigo-600">
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-indigo-600">
                <History className="h-4 w-4 mr-2" />
                Recently Viewed
              </TabsTrigger>
            </TabsList>
            
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              <ShoppingBag className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
          
          <TabsContent value="wishlist" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-lg">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <h3 className="text-white font-medium text-sm">{item.name}</h3>
                    <p className="text-white/80 text-xs">{item.price}</p>
                    
                    <div className="mt-2 flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-indigo-600 hover:bg-indigo-700 h-8 text-xs flex-1"
                        onClick={() => handleTryOn(item)}
                      >
                        Try On
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {historyItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-lg">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <h3 className="text-white font-medium text-sm">{item.name}</h3>
                    <p className="text-white/80 text-xs">{item.price}</p>
                    
                    <div className="mt-2 flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-indigo-600 hover:bg-indigo-700 h-8 text-xs flex-1"
                        onClick={() => handleTryOn(item)}
                      >
                        Try On
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  );
};

export default WishlistAndHistory;
