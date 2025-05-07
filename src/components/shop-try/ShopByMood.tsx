
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Heart, 
  ShoppingBag, 
  Shirt, 
  PlusCircle,
  ThumbsUp,
  Tag
} from 'lucide-react';
import { ClothingItem } from '@/lib/types';
import { toast } from 'sonner';

interface ShopByMoodProps {
  id?: string;
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onStylistSuggestion: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
  activeMood: string | null;
  onMoodSelect: (mood: string | null) => void;
  onSaveToWishlist: (itemId: string) => void;
}

// Define extended ClothingItem type with additional properties
interface MoodClothingItem extends ClothingItem {
  mood?: string;
  stylistNote?: string;
  availableColors?: string[];
}

const ShopByMood = ({
  id,
  isPremiumUser,
  onTryItem,
  onStylistSuggestion,
  onUpgradeToPremium,
  activeMood,
  onMoodSelect,
  onSaveToWishlist
}: ShopByMoodProps) => {
  const [loading, setLoading] = useState(true);
  
  // Mock products data
  const products: MoodClothingItem[] = [
    {
      id: 'casual-1',
      name: 'Relaxed Fit T-Shirt',
      type: 'top',
      color: 'white',
      brand: 'Mango',
      imageUrl: '/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png',
      price: 24.90,
      mood: 'casual',
      stylistNote: 'Perfect for running errands or weekend brunch',
      availableColors: ['white', 'black', 'gray'],
      season: ['spring', 'summer']
    },
    {
      id: 'casual-2',
      name: 'High-Waisted Jeans',
      type: 'bottom',
      color: 'blue',
      brand: 'Zara',
      imageUrl: '/lovable-uploads/7bf89910-ba2c-43e0-a523-899d90c3022e.png',
      price: 49.90,
      mood: 'casual',
      stylistNote: 'These jeans go with everything in your wardrobe',
      availableColors: ['blue', 'black', 'light blue'],
      season: ['all']
    },
    {
      id: 'romantic-1',
      name: 'Floral Midi Dress',
      type: 'dress',
      color: 'pink',
      brand: 'H&M',
      imageUrl: '/lovable-uploads/1d4e81c7-dcef-4208-ba9f-77c0544f9e12.png',
      price: 69.99,
      mood: 'romantic',
      stylistNote: 'Perfect for date nights or special occasions',
      availableColors: ['pink', 'blue'],
      season: ['spring', 'summer']
    },
    {
      id: 'formal-1',
      name: 'Tailored Blazer',
      type: 'outerwear',
      color: 'black',
      brand: 'Massimo Dutti',
      imageUrl: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png',
      price: 129.00,
      mood: 'formal',
      stylistNote: 'A versatile piece for work or evening events',
      availableColors: ['black', 'beige', 'navy'],
      season: ['autumn', 'winter', 'spring']
    },
    {
      id: 'cozy-1',
      name: 'Oversized Knit Sweater',
      type: 'top',
      color: 'beige',
      brand: 'COS',
      imageUrl: '/lovable-uploads/e4bf2134-0936-46f8-8d70-adcc220e50be.png',
      price: 89.00,
      mood: 'cozy',
      stylistNote: 'Looks great with leggings or skinny jeans',
      availableColors: ['beige', 'gray'],
      season: ['autumn', 'winter']
    }
  ];
  
  // Filter products based on selected mood
  const filteredProducts = activeMood 
    ? products.filter(product => product.mood === activeMood) 
    : products;

  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 relative" id={id || "shop-by-mood"}>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-purple-950/30 to-slate-950/50 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Mood</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Find the perfect piece to match how you're feeling today
          </p>
        </motion.div>
        
        <div className="mb-8 flex justify-center">
          <Tabs 
            value={activeMood || 'all'} 
            onValueChange={(value) => onMoodSelect(value === 'all' ? null : value)}
            className="w-full"
          >
            <TabsList className="bg-white/5 border border-white/10 p-1 overflow-x-auto flex flex-nowrap justify-start md:justify-center max-w-full">
              <TabsTrigger value="all" className="rounded-md">All</TabsTrigger>
              <TabsTrigger value="casual" className="rounded-md">Casual</TabsTrigger>
              <TabsTrigger value="romantic" className="rounded-md">Romantic</TabsTrigger>
              <TabsTrigger value="formal" className="rounded-md">Formal</TabsTrigger>
              <TabsTrigger value="cozy" className="rounded-md">Cozy</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <div className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.15)' }}
                className="bg-gradient-to-br from-purple-900/20 to-slate-900/90 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute top-2 right-2 z-10">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm h-8 w-8 rounded-full"
                      onClick={() => {
                        onSaveToWishlist(item.id);
                        toast.success('Added to wishlist');
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="absolute top-2 left-2 z-10">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white hover:opacity-90 backdrop-blur-sm h-7 rounded-full"
                      onClick={() => onTryItem(item)}
                    >
                      <Shirt className="h-3.5 w-3.5 mr-1" />
                      Try It
                    </Button>
                  </div>
                  
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="font-medium text-white text-lg">{item.name}</h3>
                    <p className="text-white/70 text-sm">{item.brand}</p>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-baseline mb-3">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1.5 text-purple-400" />
                      <div className="text-xl font-bold">${item.price.toFixed(2)}</div>
                    </div>
                    
                    {item.availableColors && (
                      <div className="flex items-center space-x-1">
                        {item.availableColors.slice(0, 3).map((color, idx) => (
                          <div 
                            key={idx} 
                            className="w-3 h-3 rounded-full border border-white/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        {item.availableColors.length > 3 && (
                          <span className="text-xs text-white/60">+{item.availableColors.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {item.stylistNote && (
                    <div className="flex items-start mb-4 bg-white/5 p-2 rounded">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mr-2 flex-shrink-0">
                        <Sparkles className="h-3.5 w-3.5 text-white" />
                      </div>
                      <p className="text-xs text-white/70">
                        "{item.stylistNote}"
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-white/20 hover:bg-white/10 text-white"
                      onClick={() => {
                        onStylistSuggestion(item);
                      }}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1.5" />
                      Suggest
                    </Button>
                    
                    <Button 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                      onClick={() => {
                        window.open('https://example.com/affiliate', '_blank');
                        toast.success('Opening shop page in new tab');
                      }}
                    >
                      <ShoppingBag className="h-4 w-4 mr-1.5" />
                      Shop
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {isPremiumUser && (
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={() => {
                toast.info('More items coming soon!');
              }}
              className="border-white/20 hover:bg-white/10 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Load More
            </Button>
          </div>
        )}
        
        {!isPremiumUser && (
          <motion.div 
            className="mt-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 md:p-8 border border-purple-500/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold mb-2">Unlock More Styles</h3>
                <p className="text-white/70">
                  Access all moods and get personalized style suggestions with Premium
                </p>
              </div>
              <Button 
                onClick={onUpgradeToPremium}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white px-8"
                size="lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          </motion.div>
        )}
      </Container>
    </section>
  );
};

export default ShopByMood;
