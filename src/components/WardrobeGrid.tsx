
import React from 'react';
import WardrobeItemCard from '@/components/WardrobeItemCard';
import { ClothingItem } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WardrobeGridProps {
  items: ClothingItem[];
  onToggleFavorite: (id: string) => void;
  onMatchItem: (item: ClothingItem) => void;
  onDeleteItem?: (id: string) => void;
  onEditItem?: (item: ClothingItem) => void;
  compactView?: boolean;
  selectable?: boolean;
  selectedItems?: string[];
  onToggleSelect?: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

const WardrobeGrid = ({
  items,
  onToggleFavorite,
  onMatchItem,
  onDeleteItem,
  onEditItem,
  compactView = false,
  selectable = false,
  selectedItems = [],
  onToggleSelect,
  viewMode = 'grid'
}: WardrobeGridProps) => {
  const safeItems = Array.isArray(items) ? items : [];
  
  if (compactView) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {safeItems.map((item) => (
          <div 
            key={item.id}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 hover:border-purple-500/30 transition-all duration-200"
          >
            <h3 className="font-medium text-sm text-white truncate">{item.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1.5 mb-2">
              <span className="text-xs py-0.5 px-1.5 rounded bg-slate-700/60 text-white/70">{item.type}</span>
              <span className="text-xs py-0.5 px-1.5 rounded bg-slate-700/60 text-white/70">{item.color}</span>
            </div>
            <button
              onClick={() => onMatchItem(item)}
              className="w-full text-xs py-1 mt-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded text-white"
            >
              Match This
            </button>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn(
      "transition-all duration-300",
      viewMode === 'grid' 
        ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        : "flex flex-col space-y-4"
    )}>
      {safeItems.map((item) => (
        <WardrobeItemCard
          key={item.id}
          item={item}
          onToggleFavorite={onToggleFavorite}
          onMatchItem={onMatchItem}
          onDeleteItem={onDeleteItem}
          onEditItem={onEditItem}
          compactView={compactView}
          selectable={selectable}
          isSelected={selectable && selectedItems.includes(item.id)}
          onToggleSelect={onToggleSelect}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default WardrobeGrid;
