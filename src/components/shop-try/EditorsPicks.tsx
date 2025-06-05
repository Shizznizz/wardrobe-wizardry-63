
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingBag, Star, TrendingUp, Clock, Crown } from 'lucide-react';
import { ClothingItem } from '@/lib/types';

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
  const editorsPicks = [
    {
      id: 'ep-1',
      name: 'Classic Trench Coat',
      price: 189.99,
      image: '/lovable-uploads/f4be744c-31b5-4099-93e8-67f51af83dae.png',
      brand: 'TimelessStyle',
      rating: 4.9,
      metadata: 'timeless',
      description: 'A wardrobe staple that never goes out of style'
    },
    {
      id: 'ep-2',
      name: 'Silk Slip Dress',
      price: 159.99,
      image: '/lovable-uploads/34e8d801-61ee-4254-a7ce-39b52a3a7e65.png',
      brand: 'LuxeWear',
      rating: 4.8,
      metadata: 'trending',
      description: 'Effortlessly elegant for any occasion'
    },
    {
      id: 'ep-3',
      name: 'Structured Blazer',
      price: 149.99,
      image: '/lovable-uploads/6d16aa51-bd78-4fb4-a783-8d27a089e19f.png',
      brand: 'PowerSuit',
      rating: 4.7,
      metadata: 'versatile',
      description: 'Professional polish with modern edge'
    }
  ];

  const getMetadataIcon = (metadata: string) => {
    switch (metadata) {
      case 'trending':
        return <TrendingUp className="h-3 w-3" />;
      case 'timeless':
        return <Clock className="h-3 w-3" />;
      case 'versatile':
        return <Star className="h-3 w-3" />;
      default:
        return <Crown className="h-3 w-3" />;
    }
  };

  const getMetadataColor = (metadata: string) => {
    switch (metadata) {
      case 'trending':
        return 'bg-green-600/20 text-green-300 border-green-500/30';
      case 'timeless':
        return 'bg-blue-600/20 text-blue-300 border-blue-500/30';
      case 'versatile':
        return 'bg-purple-600/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-pink-600/20 text-pink-300 border-pink-500/30';
    }
  };

  const handleTryItem = (item: any) => {
    const clothingItem: ClothingItem = {
      id: item.id,
      name: item.name,
      type: 'top',
      color: 'black',
      season: ['all'],
      image: item.image
    };
    onTryItem(clothingItem);
  };

  const handleSaveToWardrobe = (item: any) => {
    const clothingItem: ClothingItem = {
      id: item.id,
      name: item.name,
      type: 'top',
      color: 'black',
      season: ['all'],
      image: item.image
    };
    onSaveToWardrobe(clothingItem);
  };

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-purple-950/20 to-slate-950/30 pointer-events-none"></div>
      
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
            Selected by our editors for their versatility and trend appeal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {editorsPicks.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-gradient-to-br from-slate-900/80 to-purple-900/30 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative aspect-square">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-2 left-2 ${getMetadataColor(item.metadata)}`}>
                  {getMetadataIcon(item.metadata)}
                  <span className="ml-1 capitalize">{item.metadata}</span>
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white transition-all duration-300"
                  onClick={() => handleSaveToWardrobe(item)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="text-white/60 text-sm">{item.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">${item.price}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-white/60 text-sm">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm">{item.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/20 hover:bg-white/10 text-white transition-all duration-300 hover:border-purple-500/50"
                    onClick={() => handleTryItem(item)}
                  >
                    Try On
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white transition-all duration-300"
                    onClick={() => {
                      window.open('https://example.com/affiliate', '_blank');
                    }}
                  >
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Shop
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default EditorsPicks;
