
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Outfit, ClothingItem } from '@/lib/types';
import { Heart, Clock } from 'lucide-react';
import OutfitGrid from '@/components/OutfitGrid';

interface OutfitCollectionSectionProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
}

const OutfitCollectionSection = ({ outfits, clothingItems }: OutfitCollectionSectionProps) => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter outfits based on the selected tab
  const filteredOutfits = outfits.filter(outfit => {
    if (activeTab === 'favorites') return outfit.favorite;
    if (activeTab === 'recent') return true; // Would filter by date in a real app
    return true; // 'all' tab shows everything
  });

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/50 backdrop-blur-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">My Outfit Collection</h3>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6 bg-slate-800/70">
          <TabsTrigger value="all">All Outfits</TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Recent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <OutfitGrid outfits={filteredOutfits} clothingItems={clothingItems} />
        </TabsContent>
        
        <TabsContent value="favorites">
          <OutfitGrid outfits={filteredOutfits} clothingItems={clothingItems} />
        </TabsContent>
        
        <TabsContent value="recent">
          <OutfitGrid outfits={filteredOutfits} clothingItems={clothingItems} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutfitCollectionSection;
