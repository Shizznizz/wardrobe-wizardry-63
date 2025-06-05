
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ShoppingBag, Sparkles, Star, TrendingUp, Crown } from 'lucide-react';
import { ClothingItem } from '@/lib/types';

interface ShopByMoodProps {
  id?: string;
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onStylistSuggestion: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
  activeMood: string | null;
  onMoodSelect: (mood: string) => void;
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
  const [selectedMood, setSelectedMood] = useState(activeMood || 'all');

  const moods = [
    { id: 'all', label: 'All', icon: Star },
    { id: 'casual', label: 'Casual', icon: Heart },
    { id: 'romantic', label: 'Romantic', icon: Heart },
    { id: 'professional', label: 'Professional', icon: Star },
    { id: 'edgy', label: 'Edgy', icon: TrendingUp },
    { id: 'bohemian', label: 'Bohemian', icon: Sparkles }
  ];

  const mockItems = [
    {
      id: '1',
      name: 'Flowy Maxi Dress',
      price: 89.99,
      image: '/lovable-uploads/34e8d801-61ee-4254-a7ce-39b52a3a7e65.png',
      mood: 'romantic',
      brand: 'StyleCo',
      rating: 4.5,
      isOliviaWearing: true
    },
    {
      id: '2',
      name: 'Oversized Blazer',
      price: 129.99,
      image: '/lovable-uploads/f4be744c-31b5-4099-93e8-67f51af83dae.png',
      mood: 'professional',
      brand: 'WorkWear',
      rating: 4.8,
      isOliviaWearing: false
    },
    {
      id: '3',
      name: 'Denim Jacket',
      price: 79.99,
      image: '/lovable-uploads/6d16aa51-bd78-4fb4-a783-8d27a089e19f.png',
      mood: 'casual',
      brand: 'DenimLab',
      rating: 4.3,
      isOliviaWearing: true
    }
  ];

  const filteredItems = selectedMood === 'all' ? mockItems : mockItems.filter(item => item.mood === selectedMood);

  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
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

  const handleStylistSuggestion = (item: any) => {
    const clothingItem: ClothingItem = {
      id: item.id,
      name: item.name,
      type: 'top',
      color: 'black',
      season: ['all'],
      image: item.image
    };
    onStylistSuggestion(clothingItem);
  };

  return (
    <section id={id} className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-purple-950/20 to-slate-950/30 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Mood</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-6">
            Choose outfits that match your vibe — Olivia filters by mood and occasion.
          </p>
        </motion.div>

        {/* Mood Filter Tabs */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs value={selectedMood} onValueChange={handleMoodChange} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-transparent h-auto p-0 w-full">
              {moods.map((mood) => {
                const IconComponent = mood.icon;
                return (
                  <TabsTrigger
                    key={mood.id}
                    value={mood.id}
                    className="flex flex-col items-center gap-2 p-4 h-auto bg-slate-800/30 border border-white/10 rounded-lg data-[state=active]:bg-purple-600/20 data-[state=active]:border-purple-500/50 transition-all duration-300 hover:bg-white/10"
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="text-sm">{mood.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredItems.map((item, index) => (
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
                {item.isOliviaWearing && (
                  <Badge className="absolute top-2 left-2 bg-pink-600/80 text-white border-pink-500">
                    <Crown className="h-3 w-3 mr-1" />
                    Olivia's Choice
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => onSaveToWishlist(item.id)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                    <p className="text-white/60 text-xs">{item.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-sm">${item.price}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-white/60 text-xs">{item.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/20 hover:bg-white/10 text-white text-xs transition-all duration-300 hover:border-purple-500/50"
                    onClick={() => handleTryItem(item)}
                  >
                    Try it
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white text-xs transition-all duration-300"
                    onClick={() => {
                      window.open('https://example.com/affiliate', '_blank');
                    }}
                  >
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    Shop
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default ShopByMood;
