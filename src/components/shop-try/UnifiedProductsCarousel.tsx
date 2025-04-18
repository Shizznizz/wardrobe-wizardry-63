
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronLeft, ChevronRight, Sparkles, Lock } from 'lucide-react';
import { ClothingItem } from '@/lib/types';
import { toast } from 'sonner';

interface UnifiedProductsCarouselProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onStylistSuggestion: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
  activeMood: string | null;
  onMoodSelect: (mood: string | null) => void;
}

const UnifiedProductsCarousel = ({ 
  isPremiumUser, 
  onTryItem, 
  onStylistSuggestion,
  onUpgradeToPremium,
  activeMood,
  onMoodSelect
}: UnifiedProductsCarouselProps) => {
  const [products, setProducts] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const moods = [
    { name: 'Romantic', color: 'from-pink-500 to-rose-500' },
    { name: 'Power Boss', color: 'from-blue-500 to-indigo-500' },
    { name: 'Everyday Casual', color: 'from-green-500 to-emerald-500' },
    { name: 'Boho Chic', color: 'from-amber-500 to-orange-500' },
    { name: 'Minimalist', color: 'from-gray-500 to-slate-500' }
  ];

  useEffect(() => {
    // Sample data - in a real app this would come from an API or Supabase
    const sampleProducts: ClothingItem[] = [
      {
        id: 'prod-1',
        name: 'Satin Slip Dress',
        type: 'dress',
        color: 'coral',
        season: 'summer',
        occasion: 'party',
        imageUrl: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=500&h=600',
        tags: ['Romantic', 'Date Night'],
        price: '$45.99'
      },
      {
        id: 'prod-2',
        name: 'Oversized Blazer',
        type: 'jacket',
        color: 'black',
        season: 'all',
        occasion: 'formal',
        imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&h=600',
        tags: ['Power Boss', 'Office'],
        price: '$59.99'
      },
      {
        id: 'prod-3',
        name: 'Relaxed Jeans',
        type: 'pants',
        color: 'blue',
        season: 'all',
        occasion: 'casual',
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&h=600',
        tags: ['Everyday Casual', 'Effortless'],
        price: '$38.99'
      },
      {
        id: 'prod-4',
        name: 'Crochet Crop Top',
        type: 'top',
        color: 'cream',
        season: 'summer',
        occasion: 'casual',
        imageUrl: 'https://images.unsplash.com/photo-1499939667766-4afceb292d05?auto=format&fit=crop&w=500&h=600',
        tags: ['Boho Chic', 'Festival'],
        price: '$29.99'
      },
      {
        id: 'prod-5',
        name: 'Boxy White Tee',
        type: 'top',
        color: 'white',
        season: 'all',
        occasion: 'casual',
        imageUrl: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=500&h=600',
        tags: ['Minimalist', 'Everyday'],
        price: '$19.99'
      },
      {
        id: 'prod-6',
        name: 'Linen Wide-Leg Pants',
        type: 'pants',
        color: 'beige',
        season: 'summer',
        occasion: 'casual',
        imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=500&h=600',
        tags: ['Minimalist', 'Boho Chic'],
        price: '$42.99'
      }
    ];

    // Filter products based on active mood if one is selected
    let filteredProducts = [...sampleProducts];
    if (activeMood) {
      filteredProducts = sampleProducts.filter(product => 
        product.tags?.some(tag => tag === activeMood)
      );
    }

    setTimeout(() => {
      setProducts(filteredProducts);
      setLoading(false);
    }, 600);
  }, [activeMood]);

  const handleNext = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTryItem = (item: ClothingItem) => {
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    
    onTryItem(item);
  };

  const handleMoodSelect = (mood: string | null) => {
    onMoodSelect(mood);
    setCurrentIndex(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          Shop by Mood
        </h2>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className="h-8 w-8 rounded-full text-white/70 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={currentIndex >= products.length - 1}
            onClick={handleNext}
            className="h-8 w-8 rounded-full text-white/70 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant={activeMood === null ? "default" : "outline"}
          size="sm"
          onClick={() => handleMoodSelect(null)}
          className={activeMood === null ? "bg-white/10 text-white" : "border-white/10 text-white/70"}
        >
          All Styles
        </Button>
        
        {moods.map((mood) => (
          <Button
            key={mood.name}
            variant={activeMood === mood.name ? "default" : "outline"}
            size="sm"
            onClick={() => handleMoodSelect(mood.name)}
            className={`${activeMood === mood.name 
              ? `bg-gradient-to-r ${mood.color} text-white` 
              : 'border-white/10 text-white/70'} transition-all duration-300`}
          >
            {activeMood === mood.name && <Check className="mr-1 h-3 w-3" />}
            {mood.name}
          </Button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="w-10 h-10 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 bg-white/5 rounded-lg">
          <p className="text-white/70">No items found for this mood. Try selecting a different mood.</p>
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="w-full aspect-[3/4] md:aspect-auto overflow-hidden rounded-xl relative group">
                <img 
                  src={products[currentIndex].imageUrl} 
                  alt={products[currentIndex].name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {!isPremiumUser && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="h-10 w-10 text-purple-400 mb-3 animate-pulse" />
                    <p className="text-white text-center mb-4 max-w-xs px-4">
                      Upgrade to Premium to try on any item with your photos
                    </p>
                    <Button 
                      onClick={onUpgradeToPremium}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Unlock Premium
                    </Button>
                  </div>
                )}
                
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <Badge className="bg-black/60 backdrop-blur-sm text-white border-0 px-3 py-1">
                    {products[currentIndex].type}
                  </Badge>
                  
                  <Badge className="bg-purple-600/80 backdrop-blur-sm text-white border-0 px-3 py-1">
                    {products[currentIndex].price}
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col h-full">
                <Card className="flex-grow bg-white/5 border-white/10">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex-grow">
                      <h3 className="text-2xl font-semibold mb-2">{products[currentIndex].name}</h3>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {products[currentIndex].tags && products[currentIndex].tags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="outline"
                            className="bg-transparent border-purple-400/30 hover:bg-purple-400/10 transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Color</span>
                          <span className="text-white">{products[currentIndex].color}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Season</span>
                          <span className="text-white capitalize">{products[currentIndex].season}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Occasion</span>
                          <span className="text-white capitalize">{products[currentIndex].occasion}</span>
                        </div>
                      </div>
                      
                      <div className="relative p-4 rounded-lg bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-white/10 mb-5">
                        <div className="absolute -top-3 left-3 bg-gradient-to-r from-purple-600 to-blue-600 px-2 py-0.5 rounded-sm text-xs font-medium">
                          Olivia's Tip
                        </div>
                        <p className="text-sm text-white/90">
                          This {products[currentIndex].name.toLowerCase()} would look amazing paired with 
                          {products[currentIndex].type === 'top' || products[currentIndex].type === 'jacket' 
                            ? ' light-wash denim and white sneakers'
                            : products[currentIndex].type === 'pants' || products[currentIndex].type === 'skirt'
                              ? ' a tucked-in white blouse and ankle boots'
                              : ' your favorite accessories'}. 
                          Perfect for your personal style!
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-auto space-y-3">
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        onClick={() => handleTryItem(products[currentIndex])}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Try It On
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-white/20 text-white hover:bg-white/10"
                        onClick={() => onStylistSuggestion(products[currentIndex])}
                      >
                        See Styling Suggestions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-center mt-6">
            {products.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 mx-1 rounded-full transition-all ${
                  index === currentIndex ? 'bg-purple-500 scale-125' : 'bg-white/30'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UnifiedProductsCarousel;
