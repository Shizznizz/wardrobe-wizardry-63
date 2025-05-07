
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Star, ArrowRight, Sparkles, Tag, Shirt } from 'lucide-react';
import { ClothingItem } from '@/lib/types';
import { toast } from 'sonner';

interface EditorsPicksProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
  userCountry: string | null;
  onSaveToWardrobe: (item: ClothingItem) => void;
}

interface ExtendedClothingItem extends ClothingItem {
  stylingTip?: string;
  badge?: string;
  availability?: string[];
}

const EditorsPicks = ({
  isPremiumUser,
  onTryItem,
  onUpgradeToPremium,
  userCountry,
  onSaveToWardrobe
}: EditorsPicksProps) => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock editor's picks
  const editorsPicks: ExtendedClothingItem[] = [
    {
      id: 'editor-1',
      name: 'Pleated Midi Skirt',
      type: 'skirt',
      color: 'green',
      brand: 'Zara',
      price: 49.90,
      imageUrl: '/lovable-uploads/352f9956-7bac-4f42-a91b-d20e04157b0d.png',
      stylingTip: 'Pair with a tucked-in turtleneck and ankle boots for a polished look',
      badge: 'Editor\'s Choice',
      availability: ['United States', 'Canada', 'United Kingdom'],
      season: ['spring', 'summer'],
      occasion: 'casual'
    },
    {
      id: 'editor-2',
      name: 'Oversized Boyfriend Blazer',
      type: 'jacket',
      color: 'black',
      brand: 'H&M',
      price: 59.99,
      imageUrl: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png',
      stylingTip: 'Layer over a slip dress or jeans for an effortless chic look',
      badge: 'Trending',
      availability: ['United States', 'Germany', 'France', 'Australia'],
      season: ['spring', 'autumn'],
      occasion: 'formal'
    },
    {
      id: 'editor-3',
      name: 'Chunky Gold Chain Necklace',
      type: 'accessories',
      color: 'gold',
      brand: 'Mango',
      price: 29.99,
      imageUrl: '/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png',
      stylingTip: 'Elevates even the simplest white tee to statement status',
      badge: 'Popular in your country',
      availability: ['United States', 'United Kingdom', 'Australia'],
      season: ['all'],
      occasion: 'casual'
    }
  ];
  
  // Filter based on user's country if available
  const filteredPicks = userCountry 
    ? editorsPicks.filter(item => !item.availability || item.availability.includes(userCountry))
    : editorsPicks;

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-purple-950/30 to-slate-950/50 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Editor's Picks</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Hand-selected by our fashion editors, these pieces are worth the investment
          </p>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <div className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPicks.map((item) => (
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
                    
                    {item.badge && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        {item.badge}
                      </div>
                    )}
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
                      onClick={() => onSaveToWardrobe(item)}
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      Save to Wardrobe
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-8">
          <Button 
            variant="link" 
            className="text-purple-400 hover:text-purple-300 inline-flex items-center"
            onClick={() => {
              toast.info("Loading more editor's picks...");
            }}
          >
            See more picks
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default EditorsPicks;
