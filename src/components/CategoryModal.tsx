
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClothingType } from '@/lib/types';
import { cn } from '@/lib/utils';

// Category icons
import { Shirt, Pants, ShoppingBag, Footprints, Wind, Glasses } from 'lucide-react';

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCategory: (category: ClothingType | null) => void;
  selectedCategory: ClothingType | null;
}

interface CategoryItem {
  type: ClothingType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const categories: CategoryItem[] = [
  { type: 'shirt', label: 'Shirts', icon: <Shirt className="h-8 w-8" />, color: 'from-blue-500 to-indigo-600' },
  { type: 'pants', label: 'Pants', icon: <Pants className="h-8 w-8" />, color: 'from-purple-500 to-indigo-600' },
  { type: 'dress', label: 'Dresses', icon: <Wind className="h-8 w-8" />, color: 'from-pink-500 to-purple-600' },
  { type: 'shoes', label: 'Shoes', icon: <Footprints className="h-8 w-8" />, color: 'from-amber-500 to-orange-600' },
  { type: 'accessories', label: 'Accessories', icon: <Glasses className="h-8 w-8" />, color: 'from-teal-500 to-green-600' },
  { type: 'other', label: 'Others', icon: <ShoppingBag className="h-8 w-8" />, color: 'from-gray-500 to-slate-600' },
];

const CategoryModal = ({
  open,
  onOpenChange,
  onSelectCategory,
  selectedCategory
}: CategoryModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Browse By Category
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Select a category to filter your wardrobe items
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {categories.map((category) => (
            <motion.div
              key={category.type}
              className={cn(
                "bg-gradient-to-br p-0.5 rounded-lg shadow-lg transition-all cursor-pointer hover:shadow-xl",
                `bg-gradient-to-br ${category.color}`,
                selectedCategory === category.type ? "ring-4 ring-purple-500 ring-opacity-50" : ""
              )}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(category.type)}
            >
              <div className="bg-slate-900 rounded-[7px] p-4 h-full w-full flex flex-col items-center justify-center">
                <div className="text-white mb-2">{category.icon}</div>
                <span className="font-medium text-white">{category.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {selectedCategory && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              onClick={() => onSelectCategory(null)}
              className="border-purple-400/30 text-white hover:bg-white/10"
            >
              Show All Items
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
