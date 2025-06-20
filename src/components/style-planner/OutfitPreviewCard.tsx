
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Shirt } from 'lucide-react';
import { Outfit, ClothingItem } from '@/lib/types';

interface OutfitPreviewCardProps {
  outfit?: Outfit;
  clothingItems: ClothingItem[];
  day: string;
  date: Date;
  onChooseOutfit: () => void;
  onRemoveOutfit: () => void;
  oliviaTip?: string;
}

const OutfitPreviewCard = ({
  outfit,
  clothingItems,
  day,
  date,
  onChooseOutfit,
  onRemoveOutfit,
  oliviaTip
}: OutfitPreviewCardProps) => {
  const getItemById = (id: string) => clothingItems.find(item => item.id === id);
  
  const getItemsByType = (type: string) => {
    if (!outfit) return [];
    return outfit.items
      .map(id => getItemById(id))
      .filter(item => item && item.type.toLowerCase().includes(type.toLowerCase()));
  };

  const top = getItemsByType('shirt')[0] || getItemsByType('top')[0] || getItemsByType('blouse')[0];
  const bottom = getItemsByType('pants')[0] || getItemsByType('jeans')[0] || getItemsByType('skirt')[0];
  const shoes = getItemsByType('shoes')[0] || getItemsByType('sneakers')[0] || getItemsByType('boots')[0];
  const accessories = outfit?.items
    .map(id => getItemById(id))
    .filter(item => item && ['accessory', 'bag', 'jewelry', 'scarf', 'belt'].includes(item.type)) || [];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isToday = new Date().toDateString() === date.toDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <Card className="glass-dark border-white/10 overflow-hidden">
        <CardContent className="p-4">
          {/* Date Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-white">{day}</h3>
              <Badge 
                variant={isToday ? "default" : "outline"} 
                className={isToday ? "bg-purple-500 text-white" : "border-white/20 text-white/60"}
              >
                {formatDate(date)}
              </Badge>
            </div>
            {outfit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemoveOutfit}
                className="h-6 w-6 p-0 text-white/60 hover:text-red-400 hover:bg-red-500/10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {outfit ? (
            <div className="space-y-4">
              {/* Outfit Preview Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Top */}
                <div className="space-y-2">
                  <p className="text-xs text-white/60 uppercase tracking-wide">Top</p>
                  {top ? (
                    <div className="relative aspect-square bg-slate-800/50 rounded-lg overflow-hidden border border-white/10">
                      <img 
                        src={top.imageUrl || top.image} 
                        alt={top.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 left-1 right-1">
                        <p className="text-xs text-white bg-black/50 rounded px-1 py-0.5 truncate">
                          {top.name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square bg-slate-800/30 rounded-lg border border-dashed border-white/20 flex items-center justify-center">
                      <Shirt className="h-6 w-6 text-white/30" />
                    </div>
                  )}
                </div>

                {/* Bottom */}
                <div className="space-y-2">
                  <p className="text-xs text-white/60 uppercase tracking-wide">Bottom</p>
                  {bottom ? (
                    <div className="relative aspect-square bg-slate-800/50 rounded-lg overflow-hidden border border-white/10">
                      <img 
                        src={bottom.imageUrl || bottom.image} 
                        alt={bottom.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 left-1 right-1">
                        <p className="text-xs text-white bg-black/50 rounded px-1 py-0.5 truncate">
                          {bottom.name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square bg-slate-800/30 rounded-lg border border-dashed border-white/20 flex items-center justify-center">
                      <Shirt className="h-6 w-6 text-white/30" />
                    </div>
                  )}
                </div>
              </div>

              {/* Shoes & Accessories Row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <p className="text-xs text-white/60 uppercase tracking-wide">Shoes</p>
                  {shoes ? (
                    <div className="relative aspect-square bg-slate-800/50 rounded-lg overflow-hidden border border-white/10">
                      <img 
                        src={shoes.imageUrl || shoes.image} 
                        alt={shoes.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-slate-800/30 rounded-lg border border-dashed border-white/20 flex items-center justify-center">
                      <Shirt className="h-4 w-4 text-white/30" />
                    </div>
                  )}
                </div>

                <div className="col-span-2 space-y-1">
                  <p className="text-xs text-white/60 uppercase tracking-wide">Accessories</p>
                  <div className="flex gap-1 flex-wrap">
                    {accessories.length > 0 ? (
                      accessories.slice(0, 2).map((item, index) => (
                        <div key={index} className="w-12 h-12 bg-slate-800/50 rounded border border-white/10 overflow-hidden">
                          {item.imageUrl && (
                            <img 
                              src={item.imageUrl || item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="w-12 h-12 bg-slate-800/30 rounded border border-dashed border-white/20 flex items-center justify-center">
                        <Shirt className="h-3 w-3 text-white/30" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Olivia's Tip */}
              {oliviaTip && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-white">O</span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed">{oliviaTip}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-slate-800/30 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                <Shirt className="h-8 w-8 text-white/30" />
              </div>
              <p className="text-white/60 mb-4">No outfit planned</p>
              <Button
                onClick={onChooseOutfit}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                size="sm"
              >
                Choose Outfit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OutfitPreviewCard;
