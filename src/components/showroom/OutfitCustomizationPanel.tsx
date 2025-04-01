
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ClothingItem } from '@/lib/types';
import WardrobeGrid from '@/components/WardrobeGrid';

interface OutfitCustomizationPanelProps {
  clothingItems: ClothingItem[];
  onToggleFavorite: (id: string) => void;
  onMatchItem: (item: ClothingItem) => void;
}

const OutfitCustomizationPanel = ({
  clothingItems,
  onToggleFavorite,
  onMatchItem
}: OutfitCustomizationPanelProps) => {
  const [selectedTab, setSelectedTab] = useState<string>('tops');
  
  const tops = clothingItems.filter(item => 
    ['shirt', 'sweater', 'hoodie'].includes(item.type)
  );
  
  const bottoms = clothingItems.filter(item => 
    ['jeans', 'pants', 'shorts', 'skirt'].includes(item.type)
  );
  
  const shoes = clothingItems.filter(item => 
    ['shoes', 'sneakers', 'boots'].includes(item.type)
  );
  
  return (
    <motion.div 
      className="lg:col-span-1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="bg-slate-800/40 rounded-lg border border-white/10 p-4">
        <h3 className="text-lg font-medium mb-3">Customize Outfit</h3>
        
        <Tabs defaultValue="tops" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 w-full mb-4 bg-slate-800/50">
            <TabsTrigger value="tops">Tops</TabsTrigger>
            <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
            <TabsTrigger value="shoes">Shoes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tops">
            <WardrobeGrid 
              items={tops}
              onToggleFavorite={onToggleFavorite}
              onMatchItem={onMatchItem}
              compactView={true}
            />
          </TabsContent>
          
          <TabsContent value="bottoms">
            <WardrobeGrid 
              items={bottoms}
              onToggleFavorite={onToggleFavorite}
              onMatchItem={onMatchItem}
              compactView={true}
            />
          </TabsContent>
          
          <TabsContent value="shoes">
            <WardrobeGrid 
              items={shoes}
              onToggleFavorite={onToggleFavorite}
              onMatchItem={onMatchItem}
              compactView={true}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-4">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default OutfitCustomizationPanel;
