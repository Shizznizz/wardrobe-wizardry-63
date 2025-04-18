
import React from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { ClothingItem } from '@/lib/types';
import WardrobeGrid from '@/components/WardrobeGrid';

interface WardrobeDrawerProps {
  items: ClothingItem[];
  selectedCategory: string;
  onSelectItem: (item: ClothingItem) => void;
  selectedItems: ClothingItem[];
}

const WardrobeDrawer = ({
  items,
  selectedCategory,
  onSelectItem,
  selectedItems
}: WardrobeDrawerProps) => {
  const filteredItems = items.filter(
    item => item.category === selectedCategory
  );

  const handleToggleFavorite = () => {}; // No-op for now
  const handleMatchItem = (item: ClothingItem) => onSelectItem(item);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="w-full py-3 px-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg border border-white/10 text-white/70 text-sm transition-colors">
          Open Wardrobe ({filteredItems.length} items)
        </button>
      </DrawerTrigger>
      <DrawerContent className="bg-slate-900 border-t border-white/10">
        <div className="max-h-[80vh] overflow-y-auto p-6">
          <WardrobeGrid
            items={filteredItems}
            onToggleFavorite={handleToggleFavorite}
            onMatchItem={handleMatchItem}
            compactView={true}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default WardrobeDrawer;
