
import React from 'react';
import { motion } from 'framer-motion';
import { ClothingItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import OptimizedImage from '@/components/ui/optimized-image';

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

  return (
    <ScrollArea className="h-40 w-full rounded-md border border-white/10">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 p-2">
        {filteredItems.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onSelectItem(item)}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-colors",
              selectedItems.some(selected => selected.id === item.id)
                ? "border-purple-500"
                : "border-transparent hover:border-purple-500/50"
            )}
          >
            <OptimizedImage
              src={item.imageUrl || item.image || ''}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default WardrobeDrawer;
