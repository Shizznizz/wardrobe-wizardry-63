
import React from 'react';
import { motion } from 'framer-motion';
import { ClothingItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import OptimizedImage from '@/components/ui/optimized-image';

interface OutfitCanvasProps {
  selectedItems: ClothingItem[];
  onItemClick: (item: ClothingItem) => void;
}

const OutfitCanvas = ({ selectedItems, onItemClick }: OutfitCanvasProps) => {
  return (
    <div className="relative w-full aspect-[3/4] bg-slate-900/50 rounded-xl overflow-hidden border border-white/10">
      <div className="absolute inset-0 grid grid-rows-[1fr,1.2fr,0.8fr,0.6fr] gap-2 p-4">
        {/* Top section (shirts, tops) */}
        <div className="relative">
          {selectedItems
            .filter(item => item.category === 'top')
            .map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => onItemClick(item)}
                className="absolute inset-0 cursor-pointer hover:scale-105 transition-transform"
              >
                <OptimizedImage
                  src={item.imageUrl || item.image || ''}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            ))}
        </div>

        {/* Middle section (pants, skirts) */}
        <div className="relative">
          {selectedItems
            .filter(item => item.category === 'bottom')
            .map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => onItemClick(item)}
                className="absolute inset-0 cursor-pointer hover:scale-105 transition-transform"
              >
                <OptimizedImage
                  src={item.imageUrl || item.image || ''}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            ))}
        </div>

        {/* Shoes section */}
        <div className="relative">
          {selectedItems
            .filter(item => item.category === 'shoes')
            .map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => onItemClick(item)}
                className="absolute inset-0 cursor-pointer hover:scale-105 transition-transform"
              >
                <OptimizedImage
                  src={item.imageUrl || item.image || ''}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            ))}
        </div>

        {/* Accessories section */}
        <div className="relative">
          {selectedItems
            .filter(item => item.category === 'accessories')
            .map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => onItemClick(item)}
                className="absolute inset-0 cursor-pointer hover:scale-105 transition-transform"
              >
                <OptimizedImage
                  src={item.imageUrl || item.image || ''}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default OutfitCanvas;
