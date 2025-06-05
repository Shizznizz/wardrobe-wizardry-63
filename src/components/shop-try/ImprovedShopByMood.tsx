
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Coffee, Briefcase, Home, Shirt, Star, ShoppingBag } from 'lucide-react';
import { ClothingItem } from '@/lib/types';
import { toast } from 'sonner';

interface ImprovedShopByMoodProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onStylistSuggestion: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
  activeMood?: string | null;
  onMoodSelect: (mood: string) => void;
  onSaveToWishlist: (itemId: string) => void;
}

const ImprovedShopByMood = ({
  isPremiumUser,
  onTryItem,
  onStylistSuggestion,
  onUpgradeToPremium,
  activeMood,
  onMoodSelect,
  onSaveToWishlist
}: ImprovedShopByMoodProps) => {
  const [selectedMood, setSelectedMood] = useState(activeMood || 'romantic');

  const moodCategories = [
    {
      id: 'romantic',
      label: 'Romantic',
      icon: Heart,
      description: 'Soft, feminine pieces perfect for date nights',
      color: 'from-pink-500/30 to-rose-500/30'
    },
    {
      id: 'casual',
      label: 'Casual',
      icon: Coffee,
      description: 'Comfortable everyday looks for any occasion',
      color: 'from-blue-500/30 to-cyan-500/30'
    },
    {
      id: 'formal',
      label: 'Formal',
      icon: Briefcase,
      description: 'Professional and sophisticated pieces',
      color: 'from-purple-500/30 to-indigo-500/30'
    },
    {
      id: 'cozy',
      label: 'Cozy',
      icon: Home,
      description: 'Warm, comfortable pieces for relaxing',
      color: 'from-amber-500/30 to-orange-500/30'
    }
  ];

  const moodItems: Record<string, ClothingItem[]> = {
    romantic: [
      {
        id: 'romantic-1',
        name: 'Floral Midi Dress',
        type: 'dress',
        color: 'pink',
        season: ['spring', 'summer'],
        image: '/lovable-uploads/f4be744c-31b5-4099-93e8-67f51af83dae.png',
        imageUrl: '/lovable-uploads/f4be744c-31b5-4099-93e8-67f51af83dae.png',
        price: 68.99,
        brand: 'Romance Co.'
      },
      {
        id: 'romantic-2',
        name: 'Silk Camisole',
        type: 'top',
        color: 'white',
        season: ['all'],
        image: '/lovable-uploads/6d16aa51-bd78-4fb4-a783-8d27a089e19f.png',
        imageUrl: '/lovable-uploads/6d16aa51-bd78-4fb4-a783-8d27a089e19f.png',
        price: 45.00,
        brand: 'Elegant Essentials'
      }
    ],
    casual: [
      {
        id: 'casual-1',
        name: 'Relaxed Denim Jacket',
        type: 'jacket',
        color: 'blue',
        season: ['spring', 'autumn'],
        image: '/lovable-uploads/f4be744c-31b5-4099-93e8-67f51af83dae.png',
        imageUrl: '/lovable-uploads/f4be744c-31b5-4099-93e8-67f51af83dae.png',
        price: 79.99,
        brand: 'Casual Vibes'
      }
    ],
    formal: [
      {
        id: 'formal-1',
        name: 'Structured Blazer',
        type: 'jacket',
        color: 'black',
        season: ['all'],
        image: '/lovable-uploads/6d16aa51-bd78-4fb4-a783-8d27a089e19f.png',
        imageUrl: '/lovable-uploads/6d16aa51-bd78-4fb4-a783-8d27a089e19f.png',
        price: 120.00,
        brand: 'Professional Style'
      }
    ],
    cozy: [
      {
        id: 'cozy-1',
        name: 'Oversized Sweater',
        type: 'sweater',
        color: 'beige',
        season: ['autumn', 'winter'],
        image: '/lovable-uploads/f4be744c-31b5-4099-93e8-67f51af83dae.png',
        imageUrl: '/lovable-uploads/f4be744c-31b5-4099-93e8-67f51af83dae.png',
        price: 55.99,
        brand: 'Cozy Corner'
      }
    ]
  };

  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
  };

  return (
    <section id="shop-by-mood" className="py-16 relative">
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
            Shop outfits by how you're feeling today. Olivia curates items for every mood.
          </p>
        </motion.div>

        <Tabs value={selectedMood} onValueChange={handleMoodChange} className="w-full">
          <TabsList className="bg-slate-800/50 border border-white/10 rounded-lg p-1 w-full max-w-2xl mx-auto mb-8 grid grid-cols-4">
            {moodCategories.map((mood) => (
              <TabsTrigger 
                key={mood.id} 
                value={mood.id}
                className="flex items-center gap-2 data-[state=active]:bg-purple-600/50 data-[state=active]:text-white"
              >
                <mood.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{mood.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {moodCategories.map((mood) => (
            <TabsContent key={mood.id} value={mood.id}>
              <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${mood.color} border border-white/20`}>
                  <mood.icon className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold text-white">{mood.label} Mood</h3>
                    <p className="text-white/70 text-sm">{mood.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moodItems[mood.id]?.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="group bg-gradient-to-br from-slate-900/80 to-purple-950/20 border-white/10 hover:border-purple-400/30 transition-all duration-300 overflow-hidden">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-3 right-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-black/50 hover:bg-black/70 text-white"
                            onClick={() => onSaveToWishlist(item.id)}
                            title="Save to wishlist"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="mb-3">
                          <h3 className="font-semibold text-white">{item.name}</h3>
                          <div className="flex justify-between items-baseline">
                            <p className="text-white/60 text-sm">{item.brand}</p>
                            <p className="font-bold text-white">${item.price}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            className="border-white/20 hover:bg-white/10 text-white text-xs"
                            onClick={() => onTryItem(item)}
                            title="Try this item on"
                          >
                            <Shirt className="h-3 w-3 mr-1" />
                            Try
                          </Button>
                          
                          <Button 
                            variant="outline"
                            size="sm"
                            className="border-white/20 hover:bg-white/10 text-white text-xs"
                            onClick={() => onStylistSuggestion(item)}
                            title="Get styling suggestions"
                          >
                            <Star className="h-3 w-3 mr-1" />
                            Style
                          </Button>
                          
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white text-xs"
                            onClick={() => {
                              window.open('https://example.com/shop', '_blank');
                              toast.success('Opening shop page');
                            }}
                            title="Shop this item"
                          >
                            <ShoppingBag className="h-3 w-3 mr-1" />
                            Shop
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Container>
    </section>
  );
};

export default ImprovedShopByMood;
