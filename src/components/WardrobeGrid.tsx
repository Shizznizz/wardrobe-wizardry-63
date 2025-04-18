
import React from 'react';
import WardrobeItemCard from '@/components/WardrobeItemCard';
import { ClothingItem } from '@/lib/types';

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
  onCreateOutfit?: (name: string, itemIds: string[]) => void;
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
  onCreateOutfit
}: WardrobeGridProps) => {
  // Ensure items is always an array before rendering
  const safeItems = Array.isArray(items) ? items : [];
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
        />
      ))}
    </div>
  );
};

export default WardrobeGrid;
