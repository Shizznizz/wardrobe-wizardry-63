
import { useState } from 'react';
import { Filter, Tag, Calendar, Check, Shirt, Sun, Wind, Palette, Party } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClothingSeason } from '@/lib/types';

interface QuickFiltersProps {
  onFilterChange: (filters: string[]) => void;
  toggleOwnedOnly: () => void;
  showOwnedOnly: boolean;
}

const QuickFilters = ({ onFilterChange, toggleOwnedOnly, showOwnedOnly }: QuickFiltersProps) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const seasonFilters = [
    { id: 'spring', label: 'Spring', icon: <Wind className="h-3.5 w-3.5 mr-1.5" /> },
    { id: 'summer', label: 'Summer', icon: <Sun className="h-3.5 w-3.5 mr-1.5" /> },
    { id: 'autumn', label: 'Autumn', icon: <Wind className="h-3.5 w-3.5 mr-1.5" /> },
    { id: 'winter', label: 'Winter', icon: <Wind className="h-3.5 w-3.5 mr-1.5" /> },
  ];
  
  const occasionFilters = [
    { id: 'casual', label: 'Casual', icon: <Shirt className="h-3.5 w-3.5 mr-1.5" /> },
    { id: 'formal', label: 'Formal', icon: <Calendar className="h-3.5 w-3.5 mr-1.5" /> },
    { id: 'work', label: 'Work', icon: <Calendar className="h-3.5 w-3.5 mr-1.5" /> },
    { id: 'special', label: 'Special', icon: <Calendar className="h-3.5 w-3.5 mr-1.5" /> },
  ];
  
  const colorFilters = [
    { id: 'black', label: 'Black', icon: <Palette className="h-3.5 w-3.5 mr-1.5" /> },
    { id: 'white', label: 'White', icon: <Palette className="h-3.5 w-3.5 mr-1.5" /> },
    { id: 'blue', label: 'Blue', icon: <Palette className="h-3.5 w-3.5 mr-1.5" /> },
    { id: 'red', label: 'Red', icon: <Palette className="h-3.5 w-3.5 mr-1.5" /> },
  ];
  
  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => {
      const newFilters = prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId];
      
      onFilterChange(newFilters);
      return newFilters;
    });
  };
  
  return (
    <div className="bg-slate-900/70 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Filter className="h-4 w-4 text-purple-400" />
          Quick Filters
        </h3>
        
        <Button
          variant="ghost"
          size="sm"
          className={`text-xs ${showOwnedOnly ? 'text-purple-300' : 'text-white/70'}`}
          onClick={toggleOwnedOnly}
        >
          <Check className={`h-3.5 w-3.5 mr-1.5 ${showOwnedOnly ? 'opacity-100' : 'opacity-0'}`} />
          <Shirt className="h-3.5 w-3.5 mr-1.5" />
          Show Owned Only
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-medium text-white/70 mb-2 flex items-center">
            <Sun className="h-3.5 w-3.5 mr-1.5 text-yellow-400" />
            Season
          </h4>
          <ScrollArea className="w-full">
            <div className="flex flex-nowrap gap-2 pb-1">
              {seasonFilters.map(filter => (
                <Toggle
                  key={filter.id}
                  variant="outline"
                  size="sm"
                  pressed={activeFilters.includes(filter.id)}
                  onPressedChange={() => toggleFilter(filter.id)}
                  className={`whitespace-nowrap text-xs py-1 px-2.5 h-7 border-white/10 ${
                    activeFilters.includes(filter.id)
                      ? 'bg-purple-950/50 text-purple-200 border-purple-500/30'
                      : 'text-white/70 hover:text-white/90 hover:bg-white/5'
                  }`}
                >
                  {filter.icon}
                  {filter.label}
                </Toggle>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div>
          <h4 className="text-xs font-medium text-white/70 mb-2 flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
            Occasion
          </h4>
          <ScrollArea className="w-full">
            <div className="flex flex-nowrap gap-2 pb-1">
              {occasionFilters.map(filter => (
                <Toggle
                  key={filter.id}
                  variant="outline"
                  size="sm"
                  pressed={activeFilters.includes(filter.id)}
                  onPressedChange={() => toggleFilter(filter.id)}
                  className={`whitespace-nowrap text-xs py-1 px-2.5 h-7 border-white/10 ${
                    activeFilters.includes(filter.id)
                      ? 'bg-blue-950/50 text-blue-200 border-blue-500/30'
                      : 'text-white/70 hover:text-white/90 hover:bg-white/5'
                  }`}
                >
                  {filter.icon}
                  {filter.label}
                </Toggle>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div>
          <h4 className="text-xs font-medium text-white/70 mb-2 flex items-center">
            <Palette className="h-3.5 w-3.5 mr-1.5 text-green-400" />
            Color
          </h4>
          <ScrollArea className="w-full">
            <div className="flex flex-nowrap gap-2 pb-1">
              {colorFilters.map(filter => (
                <Toggle
                  key={filter.id}
                  variant="outline"
                  size="sm"
                  pressed={activeFilters.includes(filter.id)}
                  onPressedChange={() => toggleFilter(filter.id)}
                  className={`whitespace-nowrap text-xs py-1 px-2.5 h-7 border-white/10 ${
                    activeFilters.includes(filter.id)
                      ? 'bg-green-950/50 text-green-200 border-green-500/30'
                      : 'text-white/70 hover:text-white/90 hover:bg-white/5'
                  }`}
                >
                  {filter.icon}
                  {filter.label}
                </Toggle>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default QuickFilters;
