
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { ClothingItem } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import OptimizedImage from '@/components/ui/optimized-image';

interface OutfitItemSwapPanelProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  items: ClothingItem[];
  onSelectItem: (item: ClothingItem) => void;
}

const OutfitItemSwapPanel = ({
  isOpen,
  onClose,
  category,
  items,
  onSelectItem
}: OutfitItemSwapPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  
  const filteredItems = searchQuery 
    ? items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.material && item.material.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : items;
  
  const handleSelectItem = (item: ClothingItem) => {
    onSelectItem(item);
    onClose();
  };
  
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[80%] rounded-t-xl bg-slate-900 border-t border-white/10">
          <SheetHeader className="pb-4 border-b border-white/10">
            <SheetTitle className="text-white capitalize">
              Replace {category}
            </SheetTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder={`Search ${category}s...`}
                className="pl-9 bg-white/5 border-white/10 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </SheetHeader>
          
          <ScrollArea className="h-[calc(100%-8rem)] mt-4">
            <div className="grid grid-cols-2 gap-4 pb-20">
              {filteredItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="h-auto p-0 flex flex-col items-stretch"
                  onClick={() => handleSelectItem(item)}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-800/60">
                    <OptimizedImage
                      src={item.imageUrl || '/placeholder.svg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left mt-2">
                    <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                    <p className="text-xs text-white/60 capitalize">{item.color}</p>
                  </div>
                </Button>
              ))}
              
              {filteredItems.length === 0 && (
                <div className="col-span-2 py-10 text-center">
                  <p className="text-white/60">No matching items found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-900 border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white capitalize">
                Replace {category}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-white/70 hover:text-white"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder={`Search ${category}s...`}
                className="pl-9 bg-white/5 border-white/10 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <ScrollArea className="flex-grow">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="h-auto p-0 flex flex-col items-stretch hover:bg-white/5 rounded-lg"
                    onClick={() => handleSelectItem(item)}
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-800/60">
                      <OptimizedImage
                        src={item.imageUrl || '/placeholder.svg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left p-2">
                      <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                      <p className="text-xs text-white/60 capitalize">{item.color}</p>
                    </div>
                  </Button>
                ))}
                
                {filteredItems.length === 0 && (
                  <div className="col-span-4 py-10 text-center">
                    <p className="text-white/60">No matching items found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OutfitItemSwapPanel;
