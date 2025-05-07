import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Heart, ArrowRight, Sparkles, Shirt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
  onSaveToWishlist: (id: string) => void;
}

interface ExtendedClothingItem extends ClothingItem {
  stylingTip?: string;
  moods?: string[];
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
  const [loading, setLoading] = useState(false);

  const moods = [
    'Casual', 'Elegant', 'Bold', 'Romantic', 'Professional', 'Cozy'
  ];
  
  // Mock trending items with mood tags
  const trendingItems: ExtendedClothingItem[] = [
    {
      id: 'trend-1',
      name: 'Oversized Denim Jacket',
      type: 'jacket',
      color: 'blue',
      brand: 'Urban Outfitters',
      price: 89.99,
      imageUrl: '/lovable-uploads/c0be3b58-4cc0-4277-8c62-da17547e44ff.png',
      image: '/lovable-uploads/c0be3b58-4cc0-4277-8c62-da17547e44ff.png', // Added image property
      stylingTip: 'Perfect oversized fit for layering over any outfit',
      moods: ['Casual', 'Bold'],
      season: ['all'],
      occasion: 'casual'
    },
    {
      id: 'trend-2',
      name: 'Floral Maxi Dress',
      type: 'dress',
      color: 'purple',
      brand: 'Free People',
      price: 128.00,
      imageUrl: '/lovable-uploads/60ffb487-6be9-4d8d-b767-ade57592238d.png',
      image: '/lovable-uploads/60ffb487-6be9-4d8d-b767-ade57592238d.png', // Added image property
      stylingTip: 'Cinch with a belt to define your waist',
      moods: ['Romantic', 'Elegant'],
      season: ['summer'],
      occasion: 'casual'
    },
    {
      id: 'trend-3',
      name: 'Little Black Dress',
      type: 'dress',
      color: 'black',
      brand: 'Zara',
      price: 49.90,
      imageUrl: '/lovable-uploads/4e16d86c-652b-4717-958f-b48ce5663c9b.png',
      image: '/lovable-uploads/4e16d86c-652b-4717-958f-b48ce5663c9b.png', // Added image property
      stylingTip: 'The ultimate versatile piece for any occasion',
      moods: ['Elegant', 'Professional'],
      season: ['all'],
      occasion: 'formal'
    },
    {
      id: 'trend-4',
      name: 'Chunky Knit Sweater',
      type: 'sweater',
      color: 'beige',
      brand: 'Madewell',
      price: 98.00,
      imageUrl: '/lovable-uploads/2551cee7-6f38-4c04-b656-16c188b19ace.png',
      image: '/lovable-uploads/2551cee7-6f38-4c04-b656-16c188b19ace.png', // Added image property
      stylingTip: 'Size up for that cozy, oversized look',
      moods: ['Cozy', 'Casual'],
      season: ['autumn', 'winter'],
      occasion: 'casual'
    }
  ];
  
  // Filter items based on selected mood
  const filteredItems = activeMood 
    ? trendingItems.filter(item => item.moods?.includes(activeMood))
    : trendingItems;

  return (
    <section className="py-16 relative" id={id}>
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
            Express yourself through fashion. Select your mood and find the perfect outfit
          </p>
          
          <div className="mt-6 flex justify-center gap-4">
            {moods.map((mood) => (
              <Badge
                key={mood}
                className={`cursor-pointer text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-200
                  ${activeMood === mood ? 'bg-purple-500 text-white hover:bg-purple-400' : 'bg-slate-800 text-white/70 hover:bg-slate-700 hover:text-white'}
                `}
                onClick={() => onMoodSelect(activeMood === mood ? null : mood)}
              >
                {mood}
              </Badge>
            ))}
          </div>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <div className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full bg-gradient-to-br from-slate-900/80 to-purple-950/20 border-white/10 hover:border-purple-400/30 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </div>
                  
                  <CardContent className="p-5">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg text-white">{item.name}</h3>
                      <div className="flex justify-between items-baseline">
                        <p className="text-white/60 text-sm">{item.brand}</p>
                        <p className="text-lg font-bold text-white">${item.price}</p>
                      </div>
                    </div>
                    
                    {item.stylingTip && (
                      <div className="flex items-start space-x-2 mb-4 bg-white/5 p-2 rounded">
                        <Sparkles className="h-4 w-4 text-purple-400 mt-1 flex-shrink-0" />
                        <p className="text-sm text-white/70">
                          {item.stylingTip}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        className="border-white/20 hover:bg-white/10 text-white"
                        onClick={() => onTryItem(item)}
                      >
                        <Shirt className="h-4 w-4 mr-2" />
                        Try It
                      </Button>
                      
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                        onClick={() => {
                          window.open('https://example.com/shop', '_blank');
                          toast.success('Opening shop page in new tab');
                        }}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Shop
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost"
                      className="w-full mt-3 text-white/70 hover:text-white"
                      onClick={() => onSaveToWishlist(item.id)}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Save to Wishlist
                    </Button>
                    
                    {isPremiumUser && (
                      <Button 
                        variant="link"
                        className="w-full mt-1 text-purple-400 hover:text-purple-300"
                        onClick={() => onStylistSuggestion(item)}
                      >
                        Ask Olivia for styling suggestion
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        
        {!isPremiumUser && (
          <div className="text-center mt-8">
            <Button 
              variant="secondary" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
              onClick={onUpgradeToPremium}
            >
              Unlock Premium Features
            </Button>
          </div>
        )}
        
        <div className="text-center mt-8">
          <Button 
            variant="link" 
            className="text-purple-400 hover:text-purple-300 inline-flex items-center"
            onClick={() => {
              toast.info("Loading more trending items...");
            }}
          >
            See more trending items
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default ShopByMood;
