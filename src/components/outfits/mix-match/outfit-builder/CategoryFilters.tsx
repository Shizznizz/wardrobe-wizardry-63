
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Shirt, CircleDot } from 'lucide-react';
import { PantsIcon, ShirtIcon } from '@/components/ui/icons';

interface CategoryFiltersProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilters = ({ selectedCategory, onSelectCategory }: CategoryFiltersProps) => {
  return (
    <ToggleGroup
      type="single"
      value={selectedCategory}
      onValueChange={onSelectCategory}
      className="flex flex-wrap justify-center gap-2"
    >
      <ToggleGroupItem
        value="top"
        aria-label="Toggle tops"
        className="data-[state=on]:bg-purple-600"
      >
        <ShirtIcon className="w-4 h-4 mr-2" />
        Tops
      </ToggleGroupItem>
      
      <ToggleGroupItem
        value="bottom"
        aria-label="Toggle bottoms"
        className="data-[state=on]:bg-purple-600"
      >
        <PantsIcon className="w-4 h-4 mr-2" />
        Bottoms
      </ToggleGroupItem>
      
      <ToggleGroupItem
        value="outerwear"
        aria-label="Toggle outerwear"
        className="data-[state=on]:bg-purple-600"
      >
        <Shirt className="w-4 h-4 mr-2 rotate-180" />
        Outerwear
      </ToggleGroupItem>
      
      <ToggleGroupItem
        value="shoes"
        aria-label="Toggle shoes"
        className="data-[state=on]:bg-purple-600"
      >
        <CircleDot className="w-4 h-4 mr-2" />
        Shoes
      </ToggleGroupItem>
      
      <ToggleGroupItem
        value="accessories"
        aria-label="Toggle accessories"
        className="data-[state=on]:bg-purple-600"
      >
        <CircleDot className="w-4 h-4 mr-2" />
        Accessories
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default CategoryFilters;
