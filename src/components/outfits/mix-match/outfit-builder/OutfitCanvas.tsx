
import React from 'react';
import { ClothingItem } from '@/lib/types';
import { PlusCircle } from 'lucide-react';

interface OutfitCanvasProps {
  selectedItems: ClothingItem[];
  onItemClick: (item: ClothingItem) => void;
}

const OutfitCanvas = ({ selectedItems, onItemClick }: OutfitCanvasProps) => {
  // Group items by category for display
  const itemsByCategory: Record<string, ClothingItem | undefined> = {};
  
  selectedItems.forEach(item => {
    if (item.category) {
      itemsByCategory[item.category] = item;
    }
  });
  
  // Define the categories in order from top to bottom
  const categories = [
    { id: 'outerwear', label: 'Outerwear' },
    { id: 'top', label: 'Top' },
    { id: 'bottom', label: 'Bottom' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'accessories', label: 'Accessories' }
  ];
  
  return (
    <div className="bg-slate-800/50 rounded-xl border border-white/10 p-4 h-full flex flex-col">
      <h3 className="text-white font-medium mb-4 text-center">Your Outfit</h3>
      
      <div className="flex-grow space-y-3">
        {categories.map(category => {
          const item = itemsByCategory[category.id];
          
          return (
            <div key={category.id} className="relative">
              <div className="text-xs text-white/60 mb-1">{category.label}</div>
              
              {item ? (
                <div 
                  className="h-24 bg-slate-700/50 rounded-lg overflow-hidden relative group cursor-pointer"
                  onClick={() => onItemClick(item)}
                >
                  <img 
                    src={item.imageUrl || item.image || '/placeholder.svg'} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs">Click to remove</span>
                  </div>
                </div>
              ) : (
                <div className="h-24 bg-slate-700/30 rounded-lg border border-dashed border-white/20 flex items-center justify-center">
                  <PlusCircle className="h-6 w-6 text-white/30" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center text-xs text-white/60">
        {selectedItems.length === 0 ? (
          <p>Select clothing items below to build your outfit</p>
        ) : (
          <p>Click on an item to remove it</p>
        )}
      </div>
    </div>
  );
};

export default OutfitCanvas;
