
import React from 'react';
import { ClothingItem } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  // Filter items by category
  const filteredItems = items.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });
  
  // Check if an item is already selected
  const isItemSelected = (item: ClothingItem) => {
    return selectedItems.some(selectedItem => selectedItem.id === item.id);
  };
  
  return (
    <div className="bg-slate-800/30 rounded-xl border border-white/10 p-4">
      <h3 className="text-white font-medium mb-4">Your Wardrobe</h3>
      
      <ScrollArea className="h-48">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className={`
                  relative aspect-square overflow-hidden rounded-md cursor-pointer 
                  border transition-all duration-200 group
                  ${isItemSelected(item) 
                    ? 'border-purple-500 ring-2 ring-purple-500/50' 
                    : 'border-white/20 hover:border-white/40'}
                `}
                onClick={() => onSelectItem(item)}
              >
                <img 
                  src={item.imageUrl || item.image || '/placeholder.svg'} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs text-center px-1">
                    {isItemSelected(item) ? 'Selected' : 'Add to outfit'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-white/60">
            <p>No items found in this category</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default WardrobeDrawer;
