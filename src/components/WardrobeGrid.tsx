
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ClothingItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import WardrobeItemCard from '@/components/WardrobeItemCard';
import EditItemDialog from '@/components/wardrobe/EditItemDialog';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

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
  onCreateOutfit?: (outfitName: string, itemIds: string[]) => void;
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
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [createOutfitDialogOpen, setCreateOutfitDialogOpen] = useState(false);
  const [newOutfitName, setNewOutfitName] = useState('');
  
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

  const handleCreateOutfit = () => {
    if (selectedItems.length > 0 && newOutfitName.trim() && onCreateOutfit) {
      onCreateOutfit(newOutfitName.trim(), selectedItems);
      setCreateOutfitDialogOpen(false);
      setNewOutfitName('');
    } else if (!newOutfitName.trim()) {
      toast.error("Please enter an outfit name");
    }
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
      
      {/* Floating Action Button for Create Outfit */}
      <AnimatePresence>
        {selectable && selectedItems.length > 0 && (
          <motion.div 
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Button
              onClick={() => setCreateOutfitDialogOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-6 rounded-full shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Outfit from Selection ({selectedItems.length})
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Edit Item Dialog */}
      <EditItemDialog
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEdit}
      />

      {/* Create Outfit Dialog */}
      <Dialog open={createOutfitDialogOpen} onOpenChange={setCreateOutfitDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Create New Outfit</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="outfitName" className="block text-sm font-medium text-gray-300 mb-1">
                  Outfit Name
                </label>
                <Input
                  id="outfitName"
                  placeholder="Summer Casual, Work Meeting, etc."
                  value={newOutfitName}
                  onChange={(e) => setNewOutfitName(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Selected Items: {selectedItems.length}
                </label>
                <div className="bg-slate-800/50 rounded-md p-2 max-h-40 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {selectedItems.map((id) => {
                      const item = items.find((i) => i.id === id);
                      return item ? (
                        <div key={id} className="flex items-center bg-slate-700 rounded-full px-3 py-1 text-xs">
                          <span className="capitalize">{item.name}</span>
                          <button 
                            className="ml-1.5 text-gray-400 hover:text-white"
                            onClick={() => onToggleSelect && onToggleSelect(id)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleCreateOutfit}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
              disabled={!newOutfitName.trim() || selectedItems.length === 0}
            >
              Create Outfit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WardrobeGrid;
