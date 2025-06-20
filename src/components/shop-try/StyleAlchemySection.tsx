import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, ShoppingBag } from 'lucide-react';
import { ClothingItem, WeatherInfo } from '@/lib/types';
import { createShopClothingItem } from '@/lib/itemHelpers';
import { toast } from 'sonner';

interface StyleAlchemySectionProps {
  onAddToCart?: (item: ClothingItem) => void;
  onTryItem?: (item: ClothingItem) => void;
  weather?: WeatherInfo;
  isPremiumUser?: boolean;
  onUpgradeToPremium?: () => void;
  customLocation?: { city: string; country: string } | null;
}

const StyleAlchemySection = ({ onAddToCart, onTryItem, weather }: StyleAlchemySectionProps) => {
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);

  const alchemyItem = createShopClothingItem({
    id: 'alchemy-special',
    name: 'Transformative Blazer',
    type: 'blazer',
    color: 'navy',
    season: ['all'],
    image: '/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png',
    imageUrl: '/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png',
    price: 345,
    tags: ['versatile', 'professional', 'weekend-ready']
  });

  const handleTryItem = () => {
    if (onTryItem) {
      onTryItem(alchemyItem);
    }
    toast.success('Trying on the Transformative Blazer!');
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(alchemyItem);
    }
    toast.success('Added to cart!');
  };

  return (
    <Card className="glass-dark border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          Style Alchemy
        </CardTitle>
        <p className="text-white/60 text-sm">
          Discover pieces that transform your entire wardrobe
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="bg-slate-800/30 rounded-lg overflow-hidden border border-white/10">
          <div className="aspect-video bg-slate-700/30 relative overflow-hidden">
            <img 
              src={alchemyItem.imageUrl} 
              alt={alchemyItem.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white mb-2">{alchemyItem.name}</h3>
              <p className="text-white/80 text-sm mb-3">
                The one piece that works for everything - from boardroom to brunch
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {alchemyItem.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-white/30 text-white/80 bg-black/30">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-white">${alchemyItem.price}</span>
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                Editor's Choice
              </Badge>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleTryItem}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Try On
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToCart}
                className="border-white/20 text-white/70 hover:text-white hover:bg-white/10"
              >
                <ShoppingBag className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white/70 hover:text-white hover:bg-white/10"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StyleAlchemySection;
