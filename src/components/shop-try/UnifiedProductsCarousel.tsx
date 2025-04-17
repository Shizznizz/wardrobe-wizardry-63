
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClothingItem } from '@/lib/types';
import { Lock, Sparkles, ExternalLink, Shirt, Plus, Heart } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

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
  const [activeTab, setActiveTab] = useState('trending');
  
  // Mock data - in real app, this would come from Supabase
  const trendingItems: ClothingItem[] = [
    {
      id: 'trending-1',
      name: 'Casual Oversized Tee',
      type: 'shirt',
      color: 'black',
      season: ['all'],
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=300&h=400',
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=300&h=400',
      tags: ['casual', 'everyday'],
      timesWorn: 0
    },
    {
      id: 'trending-2',
      name: 'Summer Dress',
      type: 'dress',
      color: 'blue',
      season: ['summer'],
      image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=300&h=400',
      imageUrl: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=300&h=400',
      tags: ['summer', 'date-night'],
      timesWorn: 0
    },
    {
      id: 'trending-3',
      name: 'Classic Denim Jacket',
      type: 'jacket',
      color: 'blue',
      season: ['spring', 'autumn'],
      image: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&q=80&w=300&h=400',
      imageUrl: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&q=80&w=300&h=400',
      tags: ['casual', 'versatile'],
      timesWorn: 0
    },
    {
      id: 'trending-4',
      name: 'Floral Blouse',
      type: 'top',
      color: 'multicolor',
      season: ['spring', 'summer'],
      image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&q=80&w=300&h=400',
      imageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&q=80&w=300&h=400',
      tags: ['colorful', 'office'],
      timesWorn: 0
    }
  ];
  
  const moods = [
    { id: 'casual', name: 'Casual', icon: '👖' },
    { id: 'elegant', name: 'Elegant', icon: '✨' },
    { id: 'bold', name: 'Bold', icon: '💪' },
    { id: 'minimal', name: 'Minimal', icon: '⚪' },
    { id: 'romantic', name: 'Romantic', icon: '💕' },
    { id: 'edgy', name: 'Edgy', icon: '🔥' }
  ];

  const editorPicks: ClothingItem[] = [
    {
      id: 'editor-1',
      name: 'Leather Jacket',
      type: 'jacket',
      color: 'black',
      season: ['autumn', 'winter'],
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=300&h=400',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=300&h=400',
      tags: ['edgy', 'night-out'],
      timesWorn: 0
    },
    {
      id: 'editor-2',
      name: 'Pleated Midi Skirt',
      type: 'skirt',
      color: 'gray',
      season: ['spring', 'autumn'],
      image: 'https://images.unsplash.com/photo-1582142306909-195724d0a735?auto=format&fit=crop&q=80&w=300&h=400',
      imageUrl: 'https://images.unsplash.com/photo-1582142306909-195724d0a735?auto=format&fit=crop&q=80&w=300&h=400',
      tags: ['elegant', 'office'],
      timesWorn: 0
    },
    {
      id: 'editor-3',
      name: 'Linen Shirt',
      type: 'shirt',
      color: 'white',
      season: ['summer'],
      image: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?auto=format&fit=crop&q=80&w=300&h=400',
      imageUrl: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?auto=format&fit=crop&q=80&w=300&h=400',
      tags: ['minimal', 'summer'],
      timesWorn: 0
    },
    {
      id: 'editor-4',
      name: 'Knit Sweater',
      type: 'sweater',
      color: 'green',
      season: ['winter'],
      image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=300&h=400',
      imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=300&h=400',
      tags: ['cozy', 'winter'],
      timesWorn: 0
    }
  ];
  
  const getFilteredItems = () => {
    const items = activeTab === 'trending' ? trendingItems : editorPicks;
    
    if (!activeMood) return items;
    
    return items.filter(item => 
      item.tags?.some(tag => tag.toLowerCase() === activeMood.toLowerCase())
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative mb-16"
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          {activeMood ? `${activeMood.charAt(0).toUpperCase() + activeMood.slice(1)} Styles` : '✨ Trending Styles'}
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-blue-500/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <Button 
          variant="outline" 
          size="sm" 
          className={`rounded-full px-3 h-8 ${!activeMood ? 'bg-purple-700/30 border-purple-500/50 text-white' : 'border-white/20 text-white/70'}`}
          onClick={() => onMoodSelect(null)}
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          All Styles
        </Button>
        
        {moods.map(mood => (
          <Button 
            key={mood.id}
            variant="outline" 
            size="sm" 
            className={`rounded-full px-3 h-8 ${activeMood === mood.id ? 'bg-purple-700/30 border-purple-500/50 text-white' : 'border-white/20 text-white/70'}`}
            onClick={() => onMoodSelect(mood.id)}
          >
            <span className="mr-1.5">{mood.icon}</span>
            {mood.name}
          </Button>
        ))}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="bg-slate-800/80 border border-white/10">
            <TabsTrigger 
              value="trending" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-700/30 data-[state=active]:to-indigo-700/30"
            >
              Trending Now
            </TabsTrigger>
            <TabsTrigger 
              value="editor" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-700/30 data-[state=active]:to-indigo-700/30"
            >
              Editor's Picks
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="trending" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {getFilteredItems().map((item) => (
              <ProductCard 
                key={item.id}
                item={item}
                isPremiumUser={isPremiumUser}
                onTryItem={onTryItem}
                onUpgradeToPremium={onUpgradeToPremium}
                onStylistSuggestion={onStylistSuggestion}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="editor" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {getFilteredItems().map((item) => (
              <ProductCard 
                key={item.id}
                item={item}
                isPremiumUser={isPremiumUser}
                onTryItem={onTryItem}
                onUpgradeToPremium={onUpgradeToPremium}
                onStylistSuggestion={onStylistSuggestion}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

interface ProductCardProps {
  item: ClothingItem;
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onStylistSuggestion: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

const ProductCard = ({ 
  item, 
  isPremiumUser, 
  onTryItem, 
  onStylistSuggestion,
  onUpgradeToPremium 
}: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-shrink-0"
    >
      <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden h-full">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img 
            src={item.imageUrl || item.image} 
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          
          {!isPremiumUser && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 opacity-0 hover:opacity-100 transition-opacity">
              <Button 
                size="sm"
                onClick={onUpgradeToPremium}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
              >
                <Lock className="h-3.5 w-3.5 mr-1.5" />
                Unlock Try-On
              </Button>
            </div>
          )}
        </div>
        
        <CardContent className="p-4 space-y-3">
          <h3 className="font-medium text-white truncate">{item.name}</h3>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {item.tags?.map((tag, index) => (
              <span key={index} className="text-xs bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded-sm">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 flex-1"
              onClick={() => isPremiumUser ? onTryItem(item) : onUpgradeToPremium()}
            >
              <Shirt className="h-3.5 w-3.5 mr-1.5" />
              Try On
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                    onClick={() => onStylistSuggestion(item)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Get styling suggestions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                  >
                    <Heart className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Save to wishlist</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UnifiedProductsCarousel;
