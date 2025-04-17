
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, History, Lock, Shirt, Clock, Star } from 'lucide-react';
import { ClothingItem } from '@/lib/types';
import { useState } from 'react';

interface WishlistAndHistoryProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

const WishlistAndHistory = ({
  isPremiumUser,
  onTryItem,
  onUpgradeToPremium
}: WishlistAndHistoryProps) => {
  const [activeTab, setActiveTab] = useState('wishlist');
  
  // Mock data - in a real app this would come from Supabase
  const mockWishlist: ClothingItem[] = isPremiumUser ? [
    {
      id: 'wish-1',
      name: 'Statement Blazer',
      type: 'jacket',
      color: 'black',
      season: ['autumn', 'winter', 'spring'],
      image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&q=80&w=300&h=400',
      imageUrl: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&q=80&w=300&h=400',
      tags: ['formal', 'office'],
      timesWorn: 0
    },
    {
      id: 'wish-2',
      name: 'Boho Maxi Dress',
      type: 'dress',
      color: 'multicolor',
      season: ['summer'],
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=300&h=400',
      imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=300&h=400',
      tags: ['bohemian', 'vacation'],
      timesWorn: 0
    },
    {
      id: 'wish-3',
      name: 'Chunky Knit Cardigan',
      type: 'sweater',
      color: 'beige',
      season: ['winter'],
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=300&h=400',
      imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=300&h=400',
      tags: ['cozy', 'casual'],
      timesWorn: 0
    }
  ] : [];
  
  const mockHistory: ClothingItem[] = isPremiumUser ? [
    {
      id: 'history-1',
      name: 'Tailored Pants',
      type: 'pants',
      color: 'navy',
      season: ['all'],
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=300&h=400',
      imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=300&h=400',
      tags: ['formal', 'work'],
      timesWorn: 0
    },
    {
      id: 'history-2',
      name: 'Graphic Tee',
      type: 'shirt',
      color: 'white',
      season: ['summer'],
      image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=300&h=400',
      imageUrl: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=300&h=400',
      tags: ['casual', 'streetwear'],
      timesWorn: 0
    },
    {
      id: 'history-3',
      name: 'Denim Shorts',
      type: 'shorts',
      color: 'blue',
      season: ['summer'],
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=300&h=400',
      imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=300&h=400',
      tags: ['casual', 'summer'],
      timesWorn: 0
    }
  ] : [];
  
  const getItems = () => {
    return activeTab === 'wishlist' ? mockWishlist : mockHistory;
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
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          {activeTab === 'wishlist' ? '❤️ Your Wishlist' : '🕒 Recently Viewed'}
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-pink-500/30 via-transparent to-transparent"></div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="bg-slate-800/80 border border-white/10">
            <TabsTrigger 
              value="wishlist" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-700/30 data-[state=active]:to-purple-700/30"
            >
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-700/30 data-[state=active]:to-purple-700/30"
            >
              <History className="h-4 w-4 mr-2" />
              Recently Viewed
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="wishlist" className="mt-0">
          {isPremiumUser && mockWishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
              {mockWishlist.map((item) => (
                <WishlistItemCard 
                  key={item.id}
                  item={item}
                  onTryItem={onTryItem}
                />
              ))}
            </div>
          ) : (
            <PremiumFeatureCard 
              title="Save your favorite items"
              description="Create a wishlist of items you'd like to try on and check how they look on you."
              icon={<Heart className="h-6 w-6 text-pink-400" />}
              onUpgradeToPremium={onUpgradeToPremium}
            />
          )}
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          {isPremiumUser && mockHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
              {mockHistory.map((item) => (
                <HistoryItemCard 
                  key={item.id}
                  item={item}
                  onTryItem={onTryItem}
                />
              ))}
            </div>
          ) : (
            <PremiumFeatureCard 
              title="Keep track of items you've viewed"
              description="See your browsing history and easily try on items you've viewed before."
              icon={<Clock className="h-6 w-6 text-indigo-400" />}
              onUpgradeToPremium={onUpgradeToPremium}
            />
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

interface WishlistItemCardProps {
  item: ClothingItem;
  onTryItem: (item: ClothingItem) => void;
}

const WishlistItemCard = ({ item, onTryItem }: WishlistItemCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden h-full">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img 
            src={item.imageUrl || item.image} 
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
            Saved
          </div>
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
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 w-full"
              onClick={() => onTryItem(item)}
            >
              <Shirt className="h-3.5 w-3.5 mr-1.5" />
              Try It On
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface HistoryItemCardProps {
  item: ClothingItem;
  onTryItem: (item: ClothingItem) => void;
}

const HistoryItemCard = ({ item, onTryItem }: HistoryItemCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden h-full">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img 
            src={item.imageUrl || item.image} 
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full">
            Viewed
          </div>
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
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-90 w-full"
              onClick={() => onTryItem(item)}
            >
              <Shirt className="h-3.5 w-3.5 mr-1.5" />
              Try It On Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface PremiumFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onUpgradeToPremium: () => void;
}

const PremiumFeatureCard = ({ 
  title, 
  description, 
  icon,
  onUpgradeToPremium 
}: PremiumFeatureCardProps) => {
  return (
    <div className="max-w-2xl mx-auto px-4">
      <Card className="border-white/10 bg-gradient-to-r from-slate-900/90 to-purple-900/30 backdrop-blur-sm">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 flex items-center justify-center mb-6">
            {icon}
          </div>
          
          <h3 className="text-xl font-medium text-white mb-3">{title}</h3>
          <p className="text-white/70 mb-6 max-w-md">{description}</p>
          
          <Button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6"
            onClick={onUpgradeToPremium}
          >
            <Lock className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
          
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center text-white/60 text-sm">
              <Star className="h-4 w-4 text-yellow-400 mr-1.5" />
              Exclusive Features
            </div>
            <div className="flex items-center text-white/60 text-sm">
              <Heart className="h-4 w-4 text-pink-400 mr-1.5" />
              Unlimited Try-Ons
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WishlistAndHistory;
