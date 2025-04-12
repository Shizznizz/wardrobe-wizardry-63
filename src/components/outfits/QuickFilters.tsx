import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Sun, Cloud, Snowflake, Wind, 
  Tag, Filter, Briefcase, PartyPopper, 
  Heart, Database, Shirt
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuickFiltersProps {
  onFilterChange: (filters: string[]) => void;
  toggleOwnedOnly: () => void;
  showOwnedOnly: boolean;
}

const QuickFilters = ({ onFilterChange, toggleOwnedOnly, showOwnedOnly }: QuickFiltersProps) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  
  const seasonFilters = [
    { id: 'summer', name: 'Summer', icon: <Sun className="h-4 w-4 text-yellow-400" /> },
    { id: 'autumn', name: 'Fall', icon: <Wind className="h-4 w-4 text-orange-400" /> },
    { id: 'winter', name: 'Winter', icon: <Snowflake className="h-4 w-4 text-blue-400" /> },
    { id: 'spring', name: 'Spring', icon: <Cloud className="h-4 w-4 text-green-400" /> },
  ];
  
  const occasionFilters = [
    { id: 'casual', name: 'Casual', icon: <Shirt className="h-4 w-4 text-teal-400" /> },
    { id: 'work', name: 'Work', icon: <Briefcase className="h-4 w-4 text-blue-400" /> },
    { id: 'party', name: 'Party', icon: <PartyPopper className="h-4 w-4 text-purple-400" /> },
    { id: 'formal', name: 'Formal', icon: <Tag className="h-4 w-4 text-pink-400" /> },
  ];
  
  const colorFilters = [
    { id: 'black', name: 'Black', color: 'bg-black' },
    { id: 'white', name: 'White', color: 'bg-white' },
    { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
    { id: 'red', name: 'Red', color: 'bg-red-500' },
    { id: 'green', name: 'Green', color: 'bg-green-500' },
    { id: 'yellow', name: 'Yellow', color: 'bg-yellow-500' },
    { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
    { id: 'pink', name: 'Pink', color: 'bg-pink-500' },
  ];
  
  const toggleFilter = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
    onFilterChange([]);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/40 backdrop-blur-sm border border-white/10 rounded-lg p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-purple-400" />
          <h3 className="font-medium text-white">Quick Filters</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleOwnedOnly}
            className={`${showOwnedOnly ? 'bg-purple-600/50 text-white border-purple-500/50' : 'bg-slate-700/40 border-white/10'} py-1 h-auto text-xs`}
          >
            <Database className="h-3.5 w-3.5 mr-1" />
            {showOwnedOnly ? 'Showing Owned Items' : 'Show All Items'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="py-1 h-auto text-xs border-white/10 bg-slate-700/40"
          >
            {expanded ? 'Show Less' : 'Show More'}
          </Button>
          
          {activeFilters.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="py-1 h-auto text-xs border-white/10 bg-slate-700/40"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {seasonFilters.map((filter) => (
            <Button 
              key={filter.id}
              variant="outline"
              size="sm"
              onClick={() => toggleFilter(filter.id)}
              className={`${
                activeFilters.includes(filter.id) 
                  ? 'bg-purple-600/50 text-white border-purple-500/50' 
                  : 'bg-slate-700/40 border-white/10'
              } py-1 h-auto text-xs`}
            >
              {filter.icon}
              <span className="ml-1">{filter.name}</span>
            </Button>
          ))}
          
          {occasionFilters.map((filter) => (
            <Button 
              key={filter.id}
              variant="outline"
              size="sm"
              onClick={() => toggleFilter(filter.id)}
              className={`${
                activeFilters.includes(filter.id) 
                  ? 'bg-purple-600/50 text-white border-purple-500/50' 
                  : 'bg-slate-700/40 border-white/10'
              } py-1 h-auto text-xs`}
            >
              {filter.icon}
              <span className="ml-1">{filter.name}</span>
            </Button>
          ))}
        </div>
        
        {expanded && (
          <div className="pt-3 border-t border-white/10">
            <h4 className="text-sm font-medium text-white/80 mb-2">Color Palette</h4>
            <div className="flex flex-wrap gap-2">
              {colorFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`w-7 h-7 rounded-full ${filter.color} flex items-center justify-center transition-all duration-200 ${
                    activeFilters.includes(filter.id) 
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800' 
                      : 'ring-1 ring-white/30'
                  }`}
                  title={filter.name}
                >
                  {activeFilters.includes(filter.id) && (
                    <Heart className="h-3.5 w-3.5 text-white drop-shadow-md" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {activeFilters.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="text-xs text-white/60">Active filters:</span>
          {activeFilters.map(filter => (
            <Badge 
              key={filter} 
              variant="outline" 
              className="bg-purple-500/20 text-purple-200 text-xs border-purple-500/30"
            >
              {filter}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default QuickFilters;
