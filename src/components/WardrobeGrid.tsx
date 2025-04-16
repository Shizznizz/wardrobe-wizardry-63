
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ClothingItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import WardrobeItemCard from '@/components/WardrobeItemCard';
import EditItemDialog from '@/components/wardrobe/EditItemDialog';
import { Button } from '@/components/ui/button';
import { Plus, X, LayoutGrid, LayoutList } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
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
      <div className="flex justify-end mb-4">
        <div className="bg-slate-800/40 rounded-lg p-1 flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('grid')}
            className={cn(
              "rounded-lg px-3 py-1.5 h-auto", 
              viewMode === 'grid' 
                ? "bg-purple-500/30 text-purple-100" 
                : "text-slate-400 hover:text-white hover:bg-white/10"
            )}
          >
            <LayoutGrid className="h-4 w-4 mr-1.5" />
            Grid
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('list')}
            className={cn(
              "rounded-lg px-3 py-1.5 h-auto", 
              viewMode === 'list' 
                ? "bg-purple-500/30 text-purple-100" 
                : "text-slate-400 hover:text-white hover:bg-white/10"
            )}
          >
            <LayoutList className="h-4 w-4 mr-1.5" />
            List
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
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
      ) : (
        <motion.div
          className="space-y-3"
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          {items.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <div className="bg-slate-800/40 border border-white/5 rounded-xl p-3 hover:border-purple-500/30 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.imageUrl || item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                    {selectable && (
                      <div 
                        className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                        onClick={() => onToggleSelect && onToggleSelect(item.id)}
                      >
                        <div className={cn(
                          "h-5 w-5 rounded-full border-2",
                          selectedItems.includes(item.id) 
                            ? "bg-purple-500 border-white" 
                            : "border-white/70"
                        )} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{item.name}</h3>
                        <div className="text-xs text-gray-400 flex items-center mt-1">
                          <span className="capitalize">{item.type}</span>
                          <span className="mx-1.5">•</span>
                          <span className="capitalize">{item.color}</span>
                          <span className="mx-1.5">•</span>
                          <span>{item.material}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                          onClick={() => onToggleFavorite(item.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={item.favorite ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={cn(
                              "h-4 w-4", 
                              item.favorite ? "text-red-500 fill-red-500" : "text-white"
                            )}
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                        </Button>
                        
                        {onEditItem && (
                          <Button
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => handleEditItem(item)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </Button>
                        )}
                        
                        {onDeleteItem && (
                          <Button
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full text-white/70 hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => onDeleteItem(item.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.season && item.season.map((season) => (
                        <span key={season} className="px-2 py-0.5 bg-blue-500/20 text-blue-200 rounded-full text-xs">
                          {season}
                        </span>
                      ))}
                      
                      {item.occasions && item.occasions.map((occasion) => (
                        <span key={occasion} className="px-2 py-0.5 bg-purple-500/20 text-purple-200 rounded-full text-xs">
                          {occasion}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center text-xs text-gray-400">
                        <span>Worn: {item.timesWorn || 0} times</span>
                        {item.lastWorn && (
                          <>
                            <span className="mx-1.5">•</span>
                            <span>Last: {new Date(item.lastWorn).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => onMatchItem(item)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-8 px-3"
                      >
                        Match This
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      
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
