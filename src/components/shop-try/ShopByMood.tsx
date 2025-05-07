
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Heart, 
  Eye, 
  ShoppingBag, 
  Sparkles, 
  Lightning, 
  Smile, 
  Star, 
  Palette, 
  Cloud 
} from 'lucide-react';
import { ClothingItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const [expandedItem, setExpandedItem] = useState<ClothingItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const isMobile = useIsMobile();
  
  // Mock mood categories
  const moodCategories = [
    { id: 'casual', name: 'Casual', icon: <Smile className="h-4 w-4" /> },
    { id: 'elegant', name: 'Elegant', icon: <Star className="h-4 w-4" /> },
    { id: 'colorful', name: 'Colorful', icon: <Palette className="h-4 w-4" /> },
    { id: 'cozy', name: 'Cozy', icon: <Cloud className="h-4 w-4" /> },
    { id: 'bold', name: 'Bold', icon: <Lightning className="h-4 w-4" /> }
  ];
  
  // Mock clothing items
  const clothingItems: ClothingItem[] = [
    {
      id: 'item-1',
      name: 'Sleek Denim Jacket',
      type: 'jacket',
      color: 'blue',
      brand: 'StyleCo',
      price: 89.99,
      imageUrl: '/lovable-uploads/1d4e81c7-dcef-4208-ba9f-77c0544f9e12.png',
      stylingTip: 'Perfect for layering over a simple tee or dress',
      moods: ['casual', 'bold'],
      affiliate: true
    },
    {
      id: 'item-2',
      name: 'Floral Summer Dress',
      type: 'dress',
      color: 'multi',
      brand: 'BloomWear',
      price: 65.95,
      imageUrl: '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png',
      stylingTip: 'Add a denim jacket for cool evenings',
      moods: ['colorful', 'casual'],
      affiliate: true
    },
    {
      id: 'item-3',
      name: 'Elegant Evening Gown',
      type: 'dress',
      color: 'black',
      brand: 'LuxeNight',
      price: 159.99,
      imageUrl: '/lovable-uploads/c0be3b58-4cc0-4277-8c62-da17547e44ff.png',
      stylingTip: 'Pair with subtle jewelry to let the dress shine',
      moods: ['elegant'],
      affiliate: true
    },
    {
      id: 'item-4',
      name: 'Cozy Knit Sweater',
      type: 'sweater',
      color: 'cream',
      brand: 'WarmEssentials',
      price: 55.00,
      imageUrl: '/lovable-uploads/60ffb487-6be9-4d8d-b767-ade57592238d.png',
      stylingTip: 'Great with slim jeans and ankle boots',
      moods: ['cozy', 'casual'],
      affiliate: true
    }
  ];
  
  const filteredItems = activeMood 
    ? clothingItems.filter(item => item.moods?.includes(activeMood)) 
    : clothingItems;

  const handleTryItem = (item: ClothingItem) => {
    setLoading(true);
    
    setTimeout(() => {
      onTryItem(item);
      setLoading(false);
    }, 300);
  };

  return (
    <section className="py-16 relative scroll-mt-24" id={id}>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-purple-950/30 to-slate-950/50 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop By Mood</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Find the perfect outfit that matches how you feel today
          </p>
        </motion.div>
        
        {/* Mood categories */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Button
            variant={activeMood === null ? "fashion-primary" : "fashion-secondary"}
            className="rounded-full px-4"
            onClick={() => onMoodSelect(null)}
          >
            All
          </Button>
          
          {moodCategories.map((mood) => (
            <Button
              key={mood.id}
              variant={activeMood === mood.id ? "fashion-primary" : "fashion-secondary"}
              className="rounded-full px-4"
              onClick={() => onMoodSelect(mood.id)}
            >
              <span className="mr-2">{mood.icon}</span>
              {mood.name}
            </Button>
          ))}
        </div>
        
        {/* Clothing items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card 
              key={item.id}
              className="bg-slate-900/50 border-white/10 hover:border-purple-400/30 overflow-hidden group"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black/50 border-white/20 text-white hover:bg-black/70"
                    onClick={() => setExpandedItem(item)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black/50 border-white/20 text-white hover:bg-black/70"
                    onClick={() => handleTryItem(item)}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Try On
                  </Button>
                </div>
                
                {item.affiliate && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded">
                    Affiliate
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-1 line-clamp-1">{item.name}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-white">${item.price}</p>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-white/10"
                      onClick={() => onSaveToWishlist(item.id)}
                    >
                      <Heart className="h-4 w-4 text-pink-400" />
                    </Button>
                    
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => {
                        window.open('https://example.com/affiliate', '_blank');
                        toast.success('Opening shop page in new tab');
                      }}
                    >
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      Shop
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-white/60 mt-2 line-clamp-1 italic">
                  <Sparkles className="h-3 w-3 inline-block mr-1" />
                  {item.stylingTip}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Item details modal */}
        <Dialog open={!!expandedItem} onOpenChange={(open) => !open && setExpandedItem(null)}>
          <DialogContent className="bg-gradient-to-br from-slate-900 to-purple-950/90 text-white border-white/10 max-w-2xl">
            {expandedItem && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={expandedItem.imageUrl} 
                    alt={expandedItem.name}
                    className="w-full rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <DialogTitle className="text-xl font-bold text-white">
                    {expandedItem.name}
                  </DialogTitle>
                  
                  <div>
                    <p className="text-xl font-bold text-white">${expandedItem.price}</p>
                    <p className="text-sm text-white/60">{expandedItem.brand}</p>
                  </div>
                  
                  <DialogDescription className="text-white/80">
                    <div className="flex items-start space-x-2 mb-4">
                      <Sparkles className="h-4 w-4 text-purple-400 mt-1 flex-shrink-0" />
                      <p>
                        <span className="font-semibold text-purple-300">Olivia's Tip: </span>
                        {expandedItem.stylingTip}
                      </p>
                    </div>
                    
                    {expandedItem.moods && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {expandedItem.moods.map(mood => (
                          <span key={mood} className="bg-purple-900/50 text-purple-200 rounded-full px-3 py-1 text-xs">
                            {mood}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-6 space-y-3">
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                        onClick={() => {
                          window.open('https://example.com/affiliate', '_blank');
                          toast.success('Opening shop page in new tab');
                        }}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Shop Now
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full border-white/20 hover:bg-white/10 text-white"
                        onClick={() => handleTryItem(expandedItem)}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Try on with Olivia
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full border-white/20 hover:bg-white/10 text-white"
                        onClick={() => {
                          onSaveToWishlist(expandedItem.id);
                          setExpandedItem(null);
                        }}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Save to Wishlist
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full border-white/20 hover:bg-white/10 text-white"
                        onClick={() => {
                          onStylistSuggestion(expandedItem);
                          toast.success("Looking for wardrobe matches...");
                        }}
                      >
                        See if it matches my wardrobe
                      </Button>
                    </div>
                  </DialogDescription>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </section>
  );
};

export default ShopByMood;
