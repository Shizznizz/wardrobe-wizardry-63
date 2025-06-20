
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Shirt, LightbulbIcon } from 'lucide-react';
import { ClothingItem } from '@/lib/types';
import { toast } from 'sonner';

interface PrettyLittleThingPicksProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

const PrettyLittleThingPicks = ({ 
  isPremiumUser, 
  onTryItem, 
  onUpgradeToPremium 
}: PrettyLittleThingPicksProps) => {
  const [products, setProducts] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sample data for PLT products
    const pltProducts: ClothingItem[] = [
      {
        id: 'plt-1',
        name: 'Oversized Denim Jacket',
        type: 'jacket',
        color: 'blue',
        season: ['all'],
        image: '',
        imageUrl: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=500&h=600',
        price: 49.99,
        brand: 'PrettyLittleThing',
        tags: ['Boho Chic', 'Casual'],
        affiliateUrl: 'https://www.prettylittlething.com/oversized-denim-jacket'
      },
      {
        id: 'plt-2',
        name: 'Satin Slip Dress',
        type: 'dress',
        color: 'rose',  // Updated to match new type
        season: ['spring', 'summer'],
        image: '',
        imageUrl: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=500&h=600',
        price: 35.99,
        brand: 'PrettyLittleThing',
        tags: ['Date Night', 'Romantic'],
        affiliateUrl: 'https://www.prettylittlething.com/satin-slip-dress'
      },
      {
        id: 'plt-3',
        name: 'Tailored Blazer',
        type: 'blazer',  // Updated to match new type
        color: 'black',
        season: ['all'],
        image: '',
        imageUrl: 'https://images.unsplash.com/photo-1591511276520-e0e2b3465b4f?auto=format&fit=crop&w=500&h=600',
        price: 55.99,
        brand: 'PrettyLittleThing',
        tags: ['Power Boss', 'Office'],
        affiliateUrl: 'https://www.prettylittlething.com/tailored-blazer'
      },
      {
        id: 'plt-4',
        name: 'Wide Leg Trousers',
        type: 'pants',
        color: 'cream',
        season: ['all'],
        image: '',
        imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=500&h=600',
        price: 42.99,
        brand: 'PrettyLittleThing',
        tags: ['Minimalist', 'Office'],
        affiliateUrl: 'https://www.prettylittlething.com/wide-leg-trousers'
      }
    ];

    setTimeout(() => {
      setProducts(pltProducts);
      setLoading(false);
    }, 800);
  }, []);

  const handleTryOn = (item: ClothingItem) => {
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    onTryItem(item);
    toast.success(`Preparing to try on ${item.name}...`);
  };

  const handleShopNow = (item: ClothingItem) => {
    if (item.affiliateUrl) {
      window.open(item.affiliateUrl, '_blank');
      toast.success('Opening PrettyLittleThing in a new tab');
    }
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
            Editor's Top Picks
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
          Editor's Top Picks
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
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
                    Try on Olivia
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
    </motion.div>
  );
};

export default PrettyLittleThingPicks;
