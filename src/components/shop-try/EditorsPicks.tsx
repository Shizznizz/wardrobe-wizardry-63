
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ClothingItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Eye, 
  ShoppingBag, 
  Sparkles, 
  MessageSquare, 
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

interface EditorsPicksProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
  userCountry: string | null;
  onSaveToWardrobe: (item: ClothingItem) => void;
}

const EditorsPicks = ({
  isPremiumUser,
  onTryItem,
  onUpgradeToPremium,
  userCountry,
  onSaveToWardrobe
}: EditorsPicksProps) => {
  // Mock editor's picks
  const editorsPicks: ClothingItem[] = [
    {
      id: 'editors-1',
      name: 'Cashmere Blend Cardigan',
      type: 'cardigan',
      color: 'beige',
      brand: 'LuxeComfort',
      price: 129.99,
      imageUrl: '/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png',
      stylingTip: 'Elegant everyday essential that pairs with anything',
      availability: ['United States', 'Canada', 'UK'],
      badge: 'Popular in your country'
    },
    {
      id: 'editors-2',
      name: 'Structured Blazer',
      type: 'blazer',
      color: 'black',
      brand: 'WorkChic',
      price: 89.95,
      imageUrl: '/lovable-uploads/7bf89910-ba2c-43e0-a523-899d90c3022e.png',
      stylingTip: 'From office to dinner date with simple accessory changes',
      availability: ['United States', 'Canada', 'Germany', 'France'],
      badge: 'Editor\'s Choice'
    },
    {
      id: 'editors-3',
      name: 'Wide-Leg Trousers',
      type: 'pants',
      color: 'navy',
      brand: 'ModernBasics',
      price: 75.00,
      imageUrl: '/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png',
      stylingTip: 'Elongate your silhouette with these flattering trousers',
      availability: ['United States', 'UK', 'Australia'],
      badge: 'New This Week'
    }
  ];
  
  // Filter items by country if we have user country data
  const availableItems = userCountry
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
            Curated selection of pieces our fashion experts are loving right now
          </p>
          
          {userCountry && (
            <div className="inline-flex items-center mt-2 bg-purple-900/30 px-3 py-1 rounded-full text-sm text-purple-200">
              <Globe className="h-4 w-4 mr-1.5" />
              Showing items available in {userCountry}
            </div>
          )}
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-slate-900/50 border-white/10 hover:border-purple-400/30 overflow-hidden group h-full flex flex-col">
                <div className="relative">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded">
                      {item.badge}
                    </div>
                  )}
                  
                  {/* Hover action buttons */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      className="bg-black/50 border-white/20 text-white hover:bg-black/70 mx-1"
                      onClick={() => onTryItem(item)}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      Try On
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="bg-black/50 border-white/20 text-white hover:bg-black/70 mx-1"
                      onClick={() => {
                        toast.success("Opening style advice...");
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                    <p className="text-sm text-white/60">{item.brand}</p>
                    <p className="text-lg font-bold text-white mt-1">${item.price}</p>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                    <p className="text-xs text-white/60 italic line-clamp-1">
                      <Sparkles className="h-3 w-3 inline-block mr-1" />
                      {item.stylingTip}
                    </p>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-white/10"
                      onClick={() => onSaveToWardrobe(item)}
                    >
                      <Heart className="h-4 w-4 text-pink-400" />
                    </Button>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 w-full"
                      onClick={() => {
                        window.open('https://example.com/affiliate', '_blank');
                        toast.success('Opening shop page in new tab');
                      }}
                    >
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      Shop
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 hover:bg-white/10 text-white w-full"
                      onClick={() => onTryItem(item)}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      Try Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default EditorsPicks;
