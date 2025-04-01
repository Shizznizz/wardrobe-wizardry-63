
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ClothingItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import WardrobeItemCard from '@/components/WardrobeItemCard';
import EditItemDialog from '@/components/wardrobe/EditItemDialog';

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
  onToggleSelect
}: WardrobeGridProps) => {
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  const handleEditItem = (item: ClothingItem) => {
    setEditingItem(item);
  };

  const handleSaveEdit = (updatedItem: ClothingItem) => {
    if (onEditItem) {
      onEditItem(updatedItem);
    }
    setEditingItem(null);
  };

  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400">
        <p>No items found with the current filters.</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className={cn(
          "grid gap-3 sm:gap-4",
          compactView
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}
        variants={variants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <WardrobeItemCard
              item={item}
              onToggleFavorite={onToggleFavorite}
              onMatchItem={onMatchItem}
              onDeleteItem={onDeleteItem}
              onEditItem={handleEditItem}
              compactView={compactView}
              selectable={selectable}
              isSelected={selectedItems.includes(item.id)}
              onToggleSelect={onToggleSelect}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Edit Item Dialog */}
      <EditItemDialog
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default WardrobeGrid;
