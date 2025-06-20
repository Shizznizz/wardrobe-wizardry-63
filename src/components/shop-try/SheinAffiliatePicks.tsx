
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Shirt, LightbulbIcon, X } from 'lucide-react';
import { ClothingItem } from '@/lib/types';
import { createShopClothingItem } from '@/lib/itemHelpers';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

interface SheinAffiliatePicksProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

interface StyleTip {
  id: number;
  title: string;
  description: string;
}

const SheinAffiliatePicks = ({ isPremiumUser, onTryItem, onUpgradeToPremium }: SheinAffiliatePicksProps) => {
  const [products, setProducts] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStyleTips, setShowStyleTips] = useState(false);
  const [currentItem, setCurrentItem] = useState<ClothingItem | null>(null);
  const [styleTips, setStyleTips] = useState<StyleTip[]>([]);

  const affiliateTag = "?msockid=2899f7288144623b0eb3e4678084638d";

  useEffect(() => {
    // Sample data for Shein products using helper function
    const sheinProducts: ClothingItem[] = [
      createShopClothingItem({
        id: 'shein-1',
        name: 'Vintage Wash Denim Jacket',
        type: 'jacket',
        color: 'blue',
        season: ['all'],
        image: '',
        imageUrl: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=500&h=600',
        price: 29.99,
        brand: 'Shein',
        tags: ['Casual', 'Streetstyle'],
        affiliateUrl: `https://nl.shein.com/Vintage-Wash-Denim-Jacket${affiliateTag}`
      }),
      createShopClothingItem({
        id: 'shein-2',
        name: 'Floral Midi Dress',
        type: 'dress',
        color: 'multicolor',
        season: ['spring', 'summer'],
        image: '',
        imageUrl: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=500&h=600',
        price: 22.99,
        brand: 'Shein',
        tags: ['Romantic', 'Boho'],
        affiliateUrl: `https://nl.shein.com/Floral-Midi-Dress${affiliateTag}`
      }),
      createShopClothingItem({
        id: 'shein-3',
        name: 'High Waist Wide Leg Pants',
        type: 'pants',
        color: 'black',
        season: ['all'],
        image: '',
        imageUrl: 'https://images.unsplash.com/photo-1551489186-cf8726f514f8?auto=format&fit=crop&w=500&h=600',
        price: 24.99,
        brand: 'Shein',
        tags: ['Minimalist', 'Office'],
        affiliateUrl: `https://nl.shein.com/High-Waist-Wide-Leg-Pants${affiliateTag}`
      }),
      createShopClothingItem({
        id: 'shein-4',
        name: 'Oversized Knit Sweater',
        type: 'sweater',
        color: 'beige',
        season: ['autumn', 'winter'],
        image: '',
        imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&h=600',
        price: 27.99,
        brand: 'Shein',
        tags: ['Cozy', 'Everyday'],
        affiliateUrl: `https://nl.shein.com/Oversized-Knit-Sweater${affiliateTag}`
      }),
      createShopClothingItem({
        id: 'shein-5',
        name: 'Split Hem Midi Skirt',
        type: 'skirt',
        color: 'green',
        season: ['spring', 'summer'],
        image: '',
        imageUrl: 'https://images.unsplash.com/photo-1577900232022-11d542d5790d?auto=format&fit=crop&w=500&h=600',
        price: 19.99,
        brand: 'Shein',
        tags: ['Trendy', 'Date Night'],
        affiliateUrl: `https://nl.shein.com/Split-Hem-Midi-Skirt${affiliateTag}`
      })
    ];

    setTimeout(() => {
      setProducts(sheinProducts);
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
      toast.success('Opening Shein in a new tab');
    }
  };

  const handleShowStyleTips = (item: ClothingItem) => {
    setCurrentItem(item);
    
    // Generate style tips based on the item
    const generatedTips: StyleTip[] = [
      {
        id: 1,
        title: 'Layering',
        description: `For this ${item.type}, try layering with a lightweight ${item.season.includes('winter') ? 'turtleneck' : 'tank top'} underneath for added dimension.`
      },
      {
        id: 2,
        title: 'Accessories',
        description: `Pair this ${item.color} ${item.type} with ${item.color === 'black' ? 'gold' : 'silver'} accessories for a polished look that makes a statement.`
      },
      {
        id: 3,
        title: 'Styling Hack',
        description: `This ${item.type} works great with ${item.type === 'top' || item.type === 'shirt' ? 'high-waisted bottoms' : item.type === 'pants' || item.type === 'skirt' ? 'cropped tops' : 'minimalist shoes'} to create a balanced silhouette.`
      }
    ];
    
    setStyleTips(generatedTips);
    setShowStyleTips(true);
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
            Based on Your Vibe
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
          Based on Your Vibe
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {products.map((product) => (
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
                      Unlock Try-On
                    </Button>
                  </div>
                )}
                
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                  {product.brand}
                </div>
                
                {product.price && (
                  <div className="absolute top-2 right-2 bg-purple-600/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    €{product.price.toFixed(2)}
                  </div>
                )}
              </div>
              
              <CardContent className="p-4 space-y-3">
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
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 flex-1"
                    onClick={() => handleTryOn(product)}
                  >
                    <Shirt className="h-3.5 w-3.5 mr-1.5" />
                    Try Now
                  </Button>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                    onClick={() => handleShowStyleTips(product)}
                  >
                    <LightbulbIcon className="h-3.5 w-3.5 mr-1.5" />
                    Style Tips
                  </Button>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                    onClick={() => handleShopNow(product)}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="sr-only">Shop Now</span>
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
      
      <Dialog open={showStyleTips} onOpenChange={setShowStyleTips}>
        <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Style Tips</span>
              <DialogClose className="text-white/70 hover:text-white">
                <X className="h-4 w-4" />
              </DialogClose>
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {currentItem && `How to style your ${currentItem.name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {styleTips.map(tip => (
              <div key={tip.id} className="bg-slate-800/50 border border-white/5 p-3 rounded-lg">
                <h4 className="font-medium text-white mb-1">{tip.title}</h4>
                <p className="text-sm text-slate-300">{tip.description}</p>
              </div>
            ))}
            
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
              onClick={() => setShowStyleTips(false)}
            >
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SheinAffiliatePicks;
