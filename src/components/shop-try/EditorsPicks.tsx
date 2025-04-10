
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ExternalLink, Shirt } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AffiliateProduct {
  id: string;
  image: string;
  title: string;
  brand: string;
  affiliateUrl: string;
  tryOnEnabled: boolean;
  moodTags: string[];
  price?: string;
  clicks?: number;
}

interface EditorsPicksProps {
  isPremiumUser: boolean;
  onTryItem: (imageUrl: string) => void;
  onUpgradeToPremium: () => void;
}

const EditorsPicks = ({ isPremiumUser, onTryItem, onUpgradeToPremium }: EditorsPicksProps) => {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, use sample data
    // In a real implementation, fetch from Supabase
    setProducts([
      {
        id: 'affiliate-1',
        image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=300&h=400',
        title: 'Oversized Blazer',
        brand: 'Zara',
        affiliateUrl: 'https://www.zara.com',
        tryOnEnabled: true,
        moodTags: ['Power Boss', 'Minimal'],
        price: '$79.90'
      },
      {
        id: 'affiliate-2',
        image: 'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?auto=format&fit=crop&q=80&w=300&h=400',
        title: 'Ribbed Crop Top',
        brand: 'H&M',
        affiliateUrl: 'https://www.hm.com',
        tryOnEnabled: true,
        moodTags: ['Y2K Rewind', 'Festival'],
        price: '$19.99'
      },
      {
        id: 'affiliate-3',
        image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&q=80&w=300&h=400',
        title: 'Satin Midi Dress',
        brand: 'ASOS',
        affiliateUrl: 'https://www.asos.com',
        tryOnEnabled: true,
        moodTags: ['Date Night', 'Romantic'],
        price: '$45.00'
      },
      {
        id: 'affiliate-4',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=300&h=400',
        title: 'Cargo Pants',
        brand: 'Urban Outfitters',
        affiliateUrl: 'https://www.urbanoutfitters.com',
        tryOnEnabled: true,
        moodTags: ['Streetstyle', 'Festival'],
        price: '$69.00'
      }
    ]);
    setLoading(false);
    
    // In a real implementation, fetch from Supabase like this:
    /*
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('affiliate_products')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching affiliate products:', error);
        toast.error('Failed to load product recommendations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
    */
  }, []);

  const trackClick = async (productId: string) => {
    // In a real implementation, track clicks in Supabase
    console.log(`Tracking click for product: ${productId}`);
    
    /*
    try {
      await supabase
        .from('affiliate_products')
        .update({ clicks: supabase.sql`clicks + 1` })
        .eq('id', productId);
    } catch (error) {
      console.error('Failed to track click:', error);
    }
    */
  };

  const handleTryOn = (product: AffiliateProduct) => {
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    
    if (product.tryOnEnabled) {
      onTryItem(product.image);
      toast.success(`Preparing to try on ${product.title}...`);
    }
  };

  const handleShopNow = (product: AffiliateProduct) => {
    trackClick(product.id);
    window.open(product.affiliateUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mb-16"
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Editor's Picks – Shop & Try via Olivia
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-10">
          <div className="w-10 h-10 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto pb-6 no-scrollbar">
            <div className="flex gap-6 px-4">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-64"
                >
                  <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden h-full">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      
                      {!isPremiumUser && product.tryOnEnabled && (
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
                          {product.price}
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-medium text-white truncate">{product.title}</h3>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {product.moodTags.map((tag, index) => (
                          <span key={index} className="text-xs bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        {product.tryOnEnabled && (
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 flex-1"
                            onClick={() => handleTryOn(product)}
                          >
                            <Shirt className="h-3.5 w-3.5 mr-1.5" />
                            Try on Olivia
                          </Button>
                        )}
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm"
                                variant="outline"
                                className="border-white/20 hover:bg-white/10"
                                onClick={() => handleShopNow(product)}
                              >
                                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                Shop Now
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="text-xs">Opens in a new tab</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="text-xs text-slate-400 text-center mt-2">
            <p>Affiliate Disclosure: We may earn a commission for purchases made through these links.</p>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default EditorsPicks;
