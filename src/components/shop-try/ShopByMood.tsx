import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shirt, LightbulbIcon, Heart, ShoppingBag } from 'lucide-react';
import { MoodClothingItem, ClothingType } from '@/lib/types';
import { createMoodClothingItem } from '@/lib/itemHelpers';
import { toast } from 'sonner';

interface ShopByMoodProps {
  isPremiumUser: boolean;
  onTryItem: (item: MoodClothingItem) => void;
  onStylistSuggestion: (item: MoodClothingItem) => void;
  onUpgradeToPremium: () => void;
  activeMood: string | null;
  onMoodSelect: (mood: string) => void;
  onSaveToWishlist: (item: MoodClothingItem) => void;
}

const ShopByMood = ({
  isPremiumUser,
  onTryItem,
  onStylistSuggestion,
  onUpgradeToPremium,
  activeMood,
  onMoodSelect,
  onSaveToWishlist
}: ShopByMoodProps) => {
  const moodCategories = ['confident', 'relaxed', 'adventurous', 'romantic', 'professional'];

  const moodItems: Record<string, MoodClothingItem[]> = {
    confident: [
      createMoodClothingItem({
        id: 'conf-1',
        name: 'Power Blazer',
        type: 'blazer',
        color: 'black',
        brand: 'Confidence Co.',
        imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=500&h=600',
        price: 129.99,
        mood: 'confident',
        stylistNote: 'Perfect for making a bold statement',
        availableColors: ['black', 'navy', 'burgundy'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'conf-2',
        name: 'Statement Heels',
        type: 'shoes',
        color: 'red',
        brand: 'Bold Steps',
        imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&h=600',
        price: 89.99,
        mood: 'confident',
        stylistNote: 'Adds instant confidence to any outfit',
        availableColors: ['red', 'black', 'nude'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'conf-3',
        name: 'Structured Handbag',
        type: 'bag',
        color: 'brown',
        brand: 'Executive Style',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&h=600',
        price: 159.99,
        mood: 'confident',
        stylistNote: 'Professional and sophisticated',
        availableColors: ['brown', 'black', 'tan'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'conf-4',
        name: 'Tailored Trousers',
        type: 'pants',
        color: 'navy',
        brand: 'Sharp Lines',
        imageUrl: 'https://images.unsplash.com/photo-1506629905607-d405343160e3?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1506629905607-d405343160e3?auto=format&fit=crop&w=500&h=600',
        price: 79.99,
        mood: 'confident',
        stylistNote: 'Clean lines for a powerful silhouette',
        availableColors: ['navy', 'black', 'charcoal'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'conf-5',
        name: 'Bold Watch',
        type: 'accessory',
        color: 'gold',
        brand: 'Time Authority',
        imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=500&h=600',
        price: 199.99,
        mood: 'confident',
        stylistNote: 'Makes a statement on your wrist',
        availableColors: ['gold', 'silver', 'rose-gold'],
        season: ['all']
      })
    ],
    relaxed: [
      createMoodClothingItem({
        id: 'relax-1',
        name: 'Soft Knit Sweater',
        type: 'sweater',
        color: 'gray',
        brand: 'Comfort Zone',
        imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&h=600',
        price: 69.99,
        mood: 'relaxed',
        stylistNote: 'Perfect for lounging at home',
        availableColors: ['gray', 'cream', 'light-blue'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'relax-2',
        name: 'Loose Fit Jeans',
        type: 'pants',
        color: 'light-wash',
        brand: 'Easy Living',
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&h=600',
        price: 59.99,
        mood: 'relaxed',
        stylistNote: 'Comfortable and casual',
        availableColors: ['light-wash', 'dark-wash', 'black'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'relax-3',
        name: 'Slip-On Sneakers',
        type: 'shoes',
        color: 'white',
        brand: 'Casual Steps',
        imageUrl: 'https://images.unsplash.com/photo-1560769629-975ef6bbefb3?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1560769629-975ef6bbefb3?auto=format&fit=crop&w=500&h=600',
        price: 49.99,
        mood: 'relaxed',
        stylistNote: 'Easy to wear and stylish',
        availableColors: ['white', 'gray', 'navy'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'relax-4',
        name: 'Oversized T-Shirt',
        type: 'top',
        color: 'white',
        brand: 'Basic Comfort',
        imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&h=600',
        price: 29.99,
        mood: 'relaxed',
        stylistNote: 'Simple and versatile',
        availableColors: ['white', 'black', 'gray'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'relax-5',
        name: 'Cozy Socks',
        type: 'accessory',
        color: 'beige',
        brand: 'Warm Feet',
        imageUrl: 'https://images.unsplash.com/photo-1547906935-29479644f19c?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1547906935-29479644f19c?auto=format&fit=crop&w=500&h=600',
        price: 19.99,
        mood: 'relaxed',
        stylistNote: 'Keeps your feet warm and cozy',
        availableColors: ['beige', 'gray', 'brown'],
        season: ['all']
      })
    ],
    adventurous: [
      createMoodClothingItem({
        id: 'adv-1',
        name: 'Cargo Pants',
        type: 'pants',
        color: 'olive',
        brand: 'Outdoor Gear',
        imageUrl: 'https://images.unsplash.com/photo-1603366447840-999c42c1193e?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1603366447840-999c42c1193e?auto=format&fit=crop&w=500&h=600',
        price: 79.99,
        mood: 'adventurous',
        stylistNote: 'Durable and practical for any adventure',
        availableColors: ['olive', 'khaki', 'black'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'adv-2',
        name: 'Hiking Boots',
        type: 'shoes',
        color: 'brown',
        brand: 'Trail Blazers',
        imageUrl: 'https://images.unsplash.com/photo-1543508282-c8e79f03d608?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1543508282-c8e79f03d608?auto=format&fit=crop&w=500&h=600',
        price: 129.99,
        mood: 'adventurous',
        stylistNote: 'Provides excellent support and grip',
        availableColors: ['brown', 'black', 'gray'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'adv-3',
        name: 'Backpack',
        type: 'bag',
        color: 'green',
        brand: 'Adventure Ready',
        imageUrl: 'https://images.unsplash.com/photo-1563734247433-6639b99d9983?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1563734247433-6639b99d9983?auto=format&fit=crop&w=500&h=600',
        price: 89.99,
        mood: 'adventurous',
        stylistNote: 'Spacious and durable for all your gear',
        availableColors: ['green', 'blue', 'black'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'adv-4',
        name: 'Waterproof Jacket',
        type: 'jacket',
        color: 'blue',
        brand: 'Weather Shield',
        imageUrl: 'https://images.unsplash.com/photo-1531297484003-eeef7cde1da4?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1531297484003-eeef7cde1da4?auto=format&fit=crop&w=500&h=600',
        price: 99.99,
        mood: 'adventurous',
        stylistNote: 'Keeps you dry in any weather',
        availableColors: ['blue', 'red', 'black'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'adv-5',
        name: 'Compass',
        type: 'accessory',
        color: 'silver',
        brand: 'Navigation Tools',
        imageUrl: 'https://images.unsplash.com/photo-1585314064435-d464159a72c4?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1585314064435-d464159a72c4?auto=format&fit=crop&w=500&h=600',
        price: 29.99,
        mood: 'adventurous',
        stylistNote: 'Helps you find your way',
        availableColors: ['silver', 'gold', 'black'],
        season: ['all']
      })
    ],
    romantic: [
      createMoodClothingItem({
        id: 'rom-1',
        name: 'Lace Dress',
        type: 'dress',
        color: 'pink',
        brand: 'Sweetheart Styles',
        imageUrl: 'https://images.unsplash.com/photo-1603432242909-772988939199?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1603432242909-772988939199?auto=format&fit=crop&w=500&h=600',
        price: 89.99,
        mood: 'romantic',
        stylistNote: 'Elegant and feminine',
        availableColors: ['pink', 'white', 'lavender'],
        season: ['spring', 'summer']
      }),
      createMoodClothingItem({
        id: 'rom-2',
        name: 'Ballet Flats',
        type: 'shoes',
        color: 'nude',
        brand: 'Delicate Steps',
        imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&h=600',
        price: 59.99,
        mood: 'romantic',
        stylistNote: 'Comfortable and stylish',
        availableColors: ['nude', 'pink', 'white'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'rom-3',
        name: 'Pearl Necklace',
        type: 'accessory',
        color: 'white',
        brand: 'Timeless Treasures',
        imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=500&h=600',
        price: 79.99,
        mood: 'romantic',
        stylistNote: 'Adds a touch of elegance',
        availableColors: ['white', 'gold', 'silver'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'rom-4',
        name: 'Floral Scarf',
        type: 'accessory',
        color: 'multicolor',
        brand: 'Bloom Accessories',
        imageUrl: 'https://images.unsplash.com/photo-1547906935-29479644f19c?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1547906935-29479644f19c?auto=format&fit=crop&w=500&h=600',
        price: 39.99,
        mood: 'romantic',
        stylistNote: 'Adds a pop of color',
        availableColors: ['multicolor', 'pink', 'lavender'],
        season: ['spring', 'summer']
      }),
      createMoodClothingItem({
        id: 'rom-5',
        name: 'Cardigan',
        type: 'sweater',
        color: 'beige',
        brand: 'Cozy Knits',
        imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&h=600',
        price: 69.99,
        mood: 'romantic',
        stylistNote: 'Perfect for layering',
        availableColors: ['beige', 'pink', 'white'],
        season: ['all']
      })
    ],
    professional: [
      createMoodClothingItem({
        id: 'prof-1',
        name: 'Pencil Skirt',
        type: 'skirt',
        color: 'black',
        brand: 'Executive Wear',
        imageUrl: 'https://images.unsplash.com/photo-1577900232022-11d542d5790d?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1577900232022-11d542d5790d?auto=format&fit=crop&w=500&h=600',
        price: 69.99,
        mood: 'professional',
        stylistNote: 'Classic and versatile',
        availableColors: ['black', 'navy', 'gray'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'prof-2',
        name: 'Button-Down Shirt',
        type: 'top',
        color: 'white',
        brand: 'Corporate Style',
        imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&h=600',
        price: 49.99,
        mood: 'professional',
        stylistNote: 'Essential for any professional wardrobe',
        availableColors: ['white', 'blue', 'gray'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'prof-3',
        name: 'Blazer',
        type: 'jacket',
        color: 'navy',
        brand: 'Business Attire',
        imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=500&h=600',
        price: 99.99,
        mood: 'professional',
        stylistNote: 'Adds a touch of sophistication',
        availableColors: ['navy', 'black', 'gray'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'prof-4',
        name: 'Loafers',
        type: 'shoes',
        color: 'black',
        brand: 'Formal Footwear',
        imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=500&h=600',
        price: 79.99,
        mood: 'professional',
        stylistNote: 'Comfortable and stylish',
        availableColors: ['black', 'brown', 'navy'],
        season: ['all']
      }),
      createMoodClothingItem({
        id: 'prof-5',
        name: 'Briefcase',
        type: 'bag',
        color: 'brown',
        brand: 'Executive Bags',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&h=600',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&h=600',
        price: 129.99,
        mood: 'professional',
        stylistNote: 'Keeps your essentials organized',
        availableColors: ['brown', 'black', 'navy'],
        season: ['all']
      })
    ]
  };

  const handleTryOn = (item: MoodClothingItem) => {
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    onTryItem(item);
  };

  const handleStylistSuggestion = (item: MoodClothingItem) => {
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    onStylistSuggestion(item);
  };

  const getMoodItems = (mood: string): MoodClothingItem[] => {
    return moodItems[mood] || [];
  };

  return (
    <motion.div
      id="shop-by-mood"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Shop By Mood
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        {moodCategories.map((mood) => (
          <Button
            key={mood}
            variant={activeMood === mood ? 'default' : 'outline'}
            className={`capitalize ${activeMood === mood ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'border-white/20 hover:bg-white/10 text-white/80'}`}
            onClick={() => onMoodSelect(mood)}
          >
            {mood}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {getMoodItems(activeMood || moodCategories[0]).map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Card className="h-full border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />

                {!isPremiumUser && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      onClick={() => onUpgradeToPremium()}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                    >
                      Unlock Try-On
                    </Button>
                  </div>
                )}
              </div>

              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium text-white truncate">{item.name}</h3>
                <p className="text-sm text-slate-400">{item.stylistNote}</p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 flex-1"
                    onClick={() => handleTryOn(item)}
                  >
                    <Shirt className="h-3.5 w-3.5 mr-1.5" />
                    Try Now
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                    onClick={() => handleStylistSuggestion(item)}
                  >
                    <LightbulbIcon className="h-3.5 w-3.5 mr-1.5" />
                    Stylist Tip
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                    onClick={() => onSaveToWishlist(item)}
                  >
                    <Heart className="h-3.5 w-3.5" />
                    <span className="sr-only">Add to Wishlist</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ShopByMood;
