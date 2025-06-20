
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink, ShoppingBag, Sparkles } from 'lucide-react';
import { ClothingType, MoodClothingItem } from '@/lib/types';
import { createMoodClothingItem } from '@/lib/itemHelpers';
import { toast } from 'sonner';

interface ShopByMoodProps {
  onAddToWishlist?: (item: MoodClothingItem) => void;
  onTryItem?: (item: MoodClothingItem) => void;
  isPremiumUser?: boolean;
  onStylistSuggestion?: (item: MoodClothingItem) => void;
  onUpgradeToPremium?: () => void;
  activeMood?: string | null;
  onMoodSelect?: (mood: string) => void;
  onSaveToWishlist?: (itemId: string) => void;
}

const ShopByMood = ({ 
  onAddToWishlist, 
  onTryItem,
  isPremiumUser,
  onStylistSuggestion,
  onUpgradeToPremium,
  activeMood,
  onMoodSelect,
  onSaveToWishlist
}: ShopByMoodProps) => {
  const [selectedMood, setSelectedMood] = useState<string>(activeMood || 'confident');

  const moods = [
    { id: 'confident', name: 'Confident', color: 'from-red-500 to-pink-500', emoji: '💪' },
    { id: 'romantic', name: 'Romantic', color: 'from-pink-500 to-rose-500', emoji: '💕' },
    { id: 'edgy', name: 'Edgy', color: 'from-gray-700 to-black', emoji: '🖤' },
    { id: 'playful', name: 'Playful', color: 'from-yellow-400 to-orange-500', emoji: '🌈' },
    { id: 'elegant', name: 'Elegant', color: 'from-purple-600 to-indigo-600', emoji: '✨' },
    { id: 'casual', name: 'Casual', color: 'from-blue-500 to-cyan-500', emoji: '😎' }
  ];

  const moodItems: Record<string, MoodClothingItem[]> = {
    confident: [
      createMoodClothingItem({
        id: 'conf-1',
        name: 'Power Blazer',
        type: 'blazer' as ClothingType,
        color: 'black',
        brand: 'Theory',
        imageUrl: '/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png',
        image: '/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png',
        price: 295,
        mood: 'confident',
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'conf-2',
        name: 'Statement Heels',
        type: 'heels' as ClothingType,
        color: 'red',
        brand: 'Louboutin',
        imageUrl: '/lovable-uploads/b87d5aa1-136e-42c6-b11e-b4651dce8f93.png',
        image: '/lovable-uploads/b87d5aa1-136e-42c6-b11e-b4651dce8f93.png',
        price: 695,
        mood: 'confident',
        season: ['all']
      })
    ],
    romantic: [
      createMoodClothingItem({
        id: 'rom-1',
        name: 'Silk Slip Dress',
        type: 'dress' as ClothingType,
        color: 'blush',
        brand: 'Reformation',
        imageUrl: '/lovable-uploads/22f42482-be2b-4588-a88f-47730da3a352.png',
        image: '/lovable-uploads/22f42482-be2b-4588-a88f-47730da3a352.png',
        price: 198,
        mood: 'romantic',
        season: ['spring', 'summer']
      }),
      createMoodClothingItem({
        id: 'rom-2',
        name: 'Delicate Pearl Necklace',
        type: 'jewelry' as ClothingType,
        color: 'pearl',
        brand: 'Mejuri',
        imageUrl: '/lovable-uploads/976eb626-3977-4b64-a550-f81af9fad23b.png',
        image: '/lovable-uploads/976eb626-3977-4b64-a550-f81af9fad23b.png',
        price: 150,
        mood: 'romantic',
        season: ['all']
      })
    ],
    edgy: [
      createMoodClothingItem({
        id: 'edgy-1',
        name: 'Leather Moto Jacket',
        type: 'jacket' as ClothingType,
        color: 'black',
        brand: 'AllSaints',
        imageUrl: '/lovable-uploads/117f17c5-142c-43a5-88dd-5fb06adbbe27.png',
        image: '/lovable-uploads/117f17c5-142c-43a5-88dd-5fb06adbbe27.png',
        price: 398,
        mood: 'edgy',
        season: ['autumn', 'winter', 'spring']
      })
    ],
    playful: [
      createMoodClothingItem({
        id: 'play-1',
        name: 'Rainbow Stripe Sweater',
        type: 'sweater' as ClothingType,
        color: 'multicolor',
        brand: 'Ganni',
        imageUrl: '/lovable-uploads/5b4ac746-a6e4-4d29-8f41-3a8a6724b87d.png',
        image: '/lovable-uploads/5b4ac746-a6e4-4d29-8f41-3a8a6724b87d.png',
        price: 225,
        mood: 'playful',
        season: ['spring', 'autumn']
      })
    ],
    elegant: [
      createMoodClothingItem({
        id: 'eleg-1',
        name: 'Cashmere Wrap Coat',
        type: 'coat' as ClothingType,
        color: 'camel',
        brand: 'Max Mara',
        imageUrl: '/lovable-uploads/034e8d801-61ee-4254-a7ce-39b52a3a7e65.png',
        image: '/lovable-uploads/034e8d801-61ee-4254-a7ce-39b52a3a7e65.png',
        price: 1290,
        mood: 'elegant',
        season: ['autumn', 'winter']
      })
    ],
    casual: [
      createMoodClothingItem({
        id: 'cas-1',
        name: 'Oversized Denim Jacket',
        type: 'jacket' as ClothingType,
        color: 'blue',
        brand: "Levi's",
        imageUrl: '/lovable-uploads/510dbdf2-837f-4649-8da3-bd06977fa677.png',
        image: '/lovable-uploads/510dbdf2-837f-4649-8da3-bd06977fa677.png',
        price: 98,
        mood: 'casual',
        season: ['spring', 'summer', 'autumn']
      })
    ]
  };

  const handleAddToWishlist = (item: MoodClothingItem) => {
    if (onAddToWishlist) {
      onAddToWishlist(item);
    }
    if (onSaveToWishlist) {
      onSaveToWishlist(item.id);
    }
    toast.success(`${item.name} added to wishlist!`);
  };

  const handleTryItem = (item: MoodClothingItem) => {
    if (onTryItem) {
      onTryItem(item);
    }
    toast.success(`Trying on ${item.name}!`);
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    if (onMoodSelect) {
      onMoodSelect(mood);
    }
  };

  const selectedMoodData = moods.find(m => m.id === selectedMood);
  const items = moodItems[selectedMood] || [];

  return (
    <div className="space-y-6">
      {/* Mood Selector */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Shop by Mood</h3>
        <div className="flex flex-wrap gap-3">
          {moods.map((mood) => (
            <Button
              key={mood.id}
              variant={selectedMood === mood.id ? "default" : "outline"}
              onClick={() => handleMoodSelect(mood.id)}
              className={`
                ${selectedMood === mood.id 
                  ? `bg-gradient-to-r ${mood.color} text-white border-transparent`
                  : 'border-white/20 text-white/70 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <span className="mr-2">{mood.emoji}</span>
              {mood.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Mood Items */}
      {selectedMoodData && (
        <Card className="glass-dark border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${selectedMoodData.color} flex items-center justify-center`}>
                <span>{selectedMoodData.emoji}</span>
              </div>
              {selectedMoodData.name} Vibes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-800/30 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="aspect-square bg-slate-700/30 relative overflow-hidden">
                    <img 
                      src={item.imageUrl || item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddToWishlist(item)}
                        className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                      >
                        <Heart className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="font-medium text-white line-clamp-2">{item.name}</h4>
                      <p className="text-sm text-white/60">{item.brand}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">${item.price}</span>
                      <Badge variant="outline" className="border-white/20 text-white/60">
                        {item.mood}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleTryItem(item)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Try On
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white/70 hover:text-white hover:bg-white/10"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShopByMood;
