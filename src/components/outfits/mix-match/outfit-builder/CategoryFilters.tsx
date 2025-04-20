
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  ChevronLeft,
  Watch,
  Layers
} from 'lucide-react';
import { PantsIcon, ShirtIcon } from '@/components/ui/icons';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CategoryFiltersProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilters = ({ selectedCategory, onSelectCategory }: CategoryFiltersProps) => {
  const categories = [
    { id: 'all', name: 'All', icon: <Layers className="h-4 w-4" /> },
    { id: 'outerwear', name: 'Outerwear', icon: <ShirtIcon className="h-4 w-4" /> },
    { id: 'top', name: 'Tops', icon: <ShirtIcon className="h-4 w-4" /> },
    { id: 'bottom', name: 'Bottoms', icon: <PantsIcon className="h-4 w-4" /> },
    { id: 'shoes', name: 'Shoes', icon: <Watch className="h-4 w-4" /> },
    { id: 'accessories', name: 'Accessories', icon: <Watch className="h-4 w-4" /> }
  ];
  
  return (
    <div className="relative">
      <ScrollArea className="w-full pb-2">
        <div className="flex space-x-2 px-1">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`
                px-3 py-2 rounded-lg text-sm flex items-center gap-2 min-w-24
                ${selectedCategory === category.id 
                  ? 'bg-purple-600 text-white border-transparent' 
                  : 'border-white/20 text-white bg-transparent hover:bg-white/10'}
              `}
              onClick={() => onSelectCategory(category.id)}
              size="sm"
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
      
      {/* Scrolling indicators */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 pointer-events-none">
        <ChevronLeft className="h-6 w-6 text-white/40" />
      </div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 pointer-events-none">
        <ChevronRight className="h-6 w-6 text-white/40" />
      </div>
    </div>
  );
};

export default CategoryFilters;
