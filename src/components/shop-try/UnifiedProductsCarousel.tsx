import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shirt, Heart, ShoppingBag, LightbulbIcon } from 'lucide-react';
import { ClothingItem, ClothingType, ClothingOccasion } from '@/lib/types';
import { toast } from 'sonner';

interface UnifiedProductsCarouselProps {
  onTryItem: (item: ClothingItem) => void;
  onSaveToWishlist: (item: ClothingItem) => void;
  onSaveToWardrobe: (item: ClothingItem) => void;
}

const products: ClothingItem[] = [
  {
    id: 'unified-1',
    name: 'Oversized Denim Jacket',
    type: 'jacket',
    color: 'blue',
    brand: 'Urban Edge',
    imageUrl: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=500&h=600',
    price: 79.99,
    season: ['spring', 'fall'],
    occasions: ['casual'],
    dateAdded: new Date(),
    timesWorn: 0,
    favorite: false,
    tags: ['trendy', 'versatile']
  },
  {
    id: 'unified-2',
    name: 'Silk Midi Dress',
    type: 'dress',
    color: 'emerald',
    brand: 'Elegance Co.',
    imageUrl: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=500&h=600',
    price: 149.99,
    season: ['spring', 'summer'],
    occasions: ['formal'],
    dateAdded: new Date(),
    timesWorn: 0,
    favorite: false,
    tags: ['elegant', 'formal']
  },
  {
    id: 'unified-3',
    name: 'High-Waisted Jeans',
    type: 'pants',
    color: 'dark-blue',
    brand: 'Perfect Fit',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&h=600',
    price: 89.99,
    season: ['all'],
    occasions: ['casual'],
    dateAdded: new Date(),
    timesWorn: 0,
    favorite: false,
    tags: ['classic', 'everyday']
  },
  {
    id: 'unified-4',
    name: 'Cashmere Sweater',
    type: 'sweater',
    color: 'cream',
    brand: 'Luxury Knits',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&h=600',
    price: 199.99,
    season: ['fall', 'winter'],
    occasions: ['casual'],
    dateAdded: new Date(),
    timesWorn: 0,
    favorite: false,
    tags: ['cozy', 'luxury']
  },
  {
    id: 'unified-5',
    name: 'Pleated Midi Skirt',
    type: 'skirt',
    color: 'black',
    brand: 'Classic Lines',
    imageUrl: 'https://images.unsplash.com/photo-1577900232022-11d542d5790d?auto=format&fit=crop&w=500&h=600',
    price: 69.99,
    season: ['spring', 'summer'],
    occasions: ['work'],
    dateAdded: new Date(),
    timesWorn: 0,
    favorite: false,
    tags: ['professional', 'versatile']
  },
  {
    id: 'unified-6',
    name: 'Leather Ankle Boots',
    type: 'shoes',
    color: 'brown',
    brand: 'Walk Confident',
    imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=500&h=600',
    price: 159.99,
    season: ['fall', 'winter'],
    occasions: ['casual'],
    dateAdded: new Date(),
    timesWorn: 0,
    favorite: false,
    tags: ['durable', 'stylish']
  }
];

const UnifiedProductsCarousel = ({ onTryItem, onSaveToWishlist, onSaveToWardrobe }: UnifiedProductsCarouselProps) => {
  const [selectedCategory, setSelectedCategory] = useState<ClothingType | 'all'>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<ClothingOccasion | 'all'>('all');

  const handleTry = (item: ClothingItem) => {
    onTryItem(item);
  };

  const handleWishlist = (item: ClothingItem) => {
    onSaveToWishlist(item);
  };

  const handleWardrobe = (item: ClothingItem) => {
    onSaveToWardrobe(item);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.type === selectedCategory;
    const matchesOccasion = selectedOccasion === 'all' || product.occasions?.includes(selectedOccasion);
    return matchesCategory && matchesOccasion;
  });

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
          Explore Our Collection
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as ClothingType | 'all')}
          className="bg-slate-800 text-white rounded-full px-4 py-2 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="jacket">Jackets</option>
          <option value="dress">Dresses</option>
          <option value="pants">Pants</option>
          <option value="sweater">Sweaters</option>
          <option value="skirt">Skirts</option>
          <option value="shoes">Shoes</option>
        </select>

        <select
          value={selectedOccasion}
          onChange={(e) => setSelectedOccasion(e.target.value as ClothingOccasion | 'all')}
          className="bg-slate-800 text-white rounded-full px-4 py-2 focus:outline-none"
        >
          <option value="all">All Occasions</option>
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
          <option value="work">Work</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {filteredProducts.map((product) => (
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
                    onClick={() => handleTry(product)}
                  >
                    <Shirt className="h-3.5 w-3.5 mr-1.5" />
                    Try Now
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                    onClick={() => toast.info('Styling tips coming soon!')}
                  >
                    <LightbulbIcon className="h-3.5 w-3.5 mr-1.5" />
                    Style Tips
                  </Button>
                </div>

                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-purple-500/20 hover:bg-purple-500/40 text-white flex-1"
                    onClick={() => handleWishlist(product)}
                  >
                    <Heart className="h-3.5 w-3.5 mr-1.5" />
                    Wishlist
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-blue-500/20 hover:bg-blue-500/40 text-white flex-1"
                    onClick={() => handleWardrobe(product)}
                  >
                    <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                    Wardrobe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UnifiedProductsCarousel;
