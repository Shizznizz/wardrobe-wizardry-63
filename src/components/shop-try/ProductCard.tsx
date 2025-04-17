
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, TrendingUp, Sparkles, Star, ExternalLink } from 'lucide-react';
import { ShopItem, ClothingItem } from '@/lib/types';
import { toast } from 'sonner';
import ReviewStars from './ReviewStars';

interface ProductCardProps {
  item: ShopItem;
  index: number;
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
  likedItems: Record<string, boolean>;
  onLikeItem: (itemId: string) => void;
}

const ProductCard = ({
  item,
  index,
  isPremiumUser,
  onTryItem,
  onUpgradeToPremium,
  likedItems,
  onLikeItem
}: ProductCardProps) => {
  const handleTryItem = () => {
    const clothingItem: ClothingItem = {
      ...item,
      price: typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : undefined
    };
    onTryItem(clothingItem);
  };
  
  const handleShopNow = () => {
    toast.success(`Opening ${item.retailer} store...`);
    window.open(item.affiliateUrl, '_blank');
  };
  
  const handleLikeItem = () => {
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    onLikeItem(item.id);
  };

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="min-w-[200px] flex-shrink-0"
    >
      <div className="relative rounded-lg overflow-hidden bg-slate-800 border border-white/10 hover:border-purple-500/30 transition-all h-full flex flex-col">
        <div className="relative">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
          />
          
          {item.discount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0">
              -{item.discount}
            </Badge>
          )}
          
          {item.isExclusive && (
            <Badge className="absolute top-2 right-2 bg-purple-500 text-white border-0 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> 
              Exclusive
            </Badge>
          )}
          
          {item.isTrending && !item.isExclusive && (
            <Badge className="absolute top-2 right-2 bg-blue-500 text-white border-0 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> 
              Trending
            </Badge>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center p-4">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="bg-white text-black hover:bg-white/90"
                onClick={handleTryItem}
              >
                Try On
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="bg-black/40 border-white/40 text-white hover:bg-black/60"
                onClick={handleLikeItem}
              >
                <Heart className={`h-4 w-4 ${likedItems[item.id] ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4 space-y-3">
          <h3 className="font-medium text-white truncate">{item.name}</h3>
          
          <ReviewStars rating={item.rating} reviewCount={item.reviewCount} />
          
          <div className="flex justify-between items-start mb-1">
            <span className="text-sm font-bold text-white">{item.price}</span>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-white/60">{item.retailer}</p>
            <div className="flex items-center">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-xs text-white/70">{item.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {item.occasions.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-700 rounded-full text-white/60 capitalize">
                {tag}
              </span>
            ))}
          </div>
          
          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs h-8"
            onClick={handleShopNow}
          >
            Shop Now 
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </div>
    </motion.div>
  );
};

export default ProductCard;
