
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Star, 
  Heart,
  TrendingUp,
  ExternalLink 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  imageUrl: string;
  rating: number;
  storeName: string;
  affiliateUrl: string;
}

const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Classic White Shirt',
    brand: 'Fashion Brand',
    price: '$45.99',
    imageUrl: '/placeholder.svg',
    rating: 4.7,
    storeName: 'Fashion Store',
    affiliateUrl: 'https://example.com/product1'
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    brand: 'Denim Co',
    price: '$59.99',
    imageUrl: '/placeholder.svg',
    rating: 4.5,
    storeName: 'Denim World',
    affiliateUrl: 'https://example.com/product2'
  },
  {
    id: '3',
    name: 'Leather Jacket',
    brand: 'Urban Style',
    price: '$129.99',
    imageUrl: '/placeholder.svg',
    rating: 4.8,
    storeName: 'Urban Outfitters',
    affiliateUrl: 'https://example.com/product3'
  }
];

interface AffiliateProductsProps {
  className?: string;
}

const AffiliateProducts = ({ className }: AffiliateProductsProps) => {
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});
  
  const handleLikeProduct = (productId: string) => {
    setLikedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
    toast.success(likedProducts[productId] ? 'Removed from favorites' : 'Added to favorites');
  };
  
  const handleShopNow = (product: Product) => {
    // In a real implementation, this would track the affiliate click
    toast.success(`Redirecting to ${product.storeName}`);
    window.open(product.affiliateUrl, '_blank');
  };
  
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="h-5 w-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">Complete Your Look</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dummyProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="overflow-hidden h-full border-white/10 bg-slate-900/40 backdrop-blur-sm">
              <div className="relative h-48">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="bg-black/30 hover:bg-black/50 rounded-full" 
                    onClick={() => handleLikeProduct(product.id)}
                  >
                    <Heart 
                      className={`h-5 w-5 ${likedProducts[product.id] ? 'text-red-500 fill-red-500' : 'text-white'}`} 
                    />
                  </Button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Trending
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <p className="text-sm text-white/60">{product.brand}</p>
                  <h3 className="font-medium text-white">{product.name}</h3>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-white">{product.price}</p>
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 text-yellow-400 mr-1 fill-yellow-400" />
                    <span className="text-xs text-white/80">{product.rating}</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
                  onClick={() => handleShopNow(product)}
                >
                  Shop Now 
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AffiliateProducts;
