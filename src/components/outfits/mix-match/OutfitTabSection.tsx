
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OutfitCard } from '@/components/outfits/OutfitCard';
import { cn } from '@/lib/utils';
import { Heart, Clock, Grid } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader } from '@/components/ui/card';
import { Outfit, ClothingItem } from '@/lib/types';

interface OutfitTabSectionProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
}

const OutfitTabSection = ({ outfits, clothingItems }: OutfitTabSectionProps) => {
  const [activeTab, setActiveTab] = useState('all');
  
  const favoriteOutfits = outfits.filter(outfit => outfit.favorite);
  const recentOutfits = [...outfits].sort((a, b) => {
    const dateA = new Date(a.createdAt || new Date()).getTime();
    const dateB = new Date(b.createdAt || new Date()).getTime();
    return dateB - dateA;
  }).slice(0, 6);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const getClothingItemById = (id: string): ClothingItem | undefined => {
    return clothingItems.find(item => item && item.id === id);
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  return (
    <Card className="border border-white/20 bg-slate-900/50 backdrop-blur-md pt-4 pb-6 px-4">
      <CardHeader className="pb-2">
        <h2 className="text-2xl font-semibold text-white">My Collection</h2>
      </CardHeader>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full bg-slate-800/60 mb-6">
          <TabsTrigger 
            value="all"
            className={cn(
              "flex-1 data-[state=active]:bg-slate-700 data-[state=active]:text-white",
              "flex items-center justify-center gap-1.5"
            )}
          >
            <Grid className="h-4 w-4" />
            All Outfits
          </TabsTrigger>
          <TabsTrigger 
            value="favorites"
            className={cn(
              "flex-1 data-[state=active]:bg-slate-700 data-[state=active]:text-white",
              "flex items-center justify-center gap-1.5"
            )}
          >
            <Heart className="h-4 w-4" />
            Favorites
          </TabsTrigger>
          <TabsTrigger 
            value="recent"
            className={cn(
              "flex-1 data-[state=active]:bg-slate-700 data-[state=active]:text-white",
              "flex items-center justify-center gap-1.5"
            )}
          >
            <Clock className="h-4 w-4" />
            Recent
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {outfits.map((outfit) => (
              <OutfitCard 
                key={outfit.id} 
                outfit={outfit} 
                clothingItems={clothingItems}
                getClothingItemById={getClothingItemById}
              />
            ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="favorites">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {favoriteOutfits.length > 0 ? (
              favoriteOutfits.map((outfit) => (
                <OutfitCard 
                  key={outfit.id} 
                  outfit={outfit} 
                  clothingItems={clothingItems}
                  getClothingItemById={getClothingItemById}
                />
              ))
            ) : (
              <p className="text-white/70 text-center col-span-full py-8">
                You haven't added any outfits to your favorites yet.
              </p>
            )}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="recent">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {recentOutfits.map((outfit) => (
              <OutfitCard 
                key={outfit.id} 
                outfit={outfit} 
                clothingItems={clothingItems}
                getClothingItemById={getClothingItemById}
              />
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default OutfitTabSection;
