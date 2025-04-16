
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Filter, X } from 'lucide-react';
import { ClothingItem } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StyleMood {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// Sample clothing items for each mood
const moodItems: Record<string, ClothingItem[]> = {
  romantic: Array(6).fill(null).map((_, i) => ({
    id: `romantic-${i}`,
    name: `Romantic Item ${i+1}`,
    type: 'top',
    color: 'pink',
    material: 'cotton',
    seasons: ['spring', 'summer'],
    occasions: ['date', 'party'],
    imageUrl: '/placeholder.svg',
    favorite: false,
    timesWorn: 0,
    dateAdded: new Date()
  })),
  power: Array(6).fill(null).map((_, i) => ({
    id: `power-${i}`,
    name: `Power Boss Item ${i+1}`,
    type: 'blazer',
    color: 'black',
    material: 'polyester',
    seasons: ['fall', 'winter'],
    occasions: ['work', 'formal'],
    imageUrl: '/placeholder.svg',
    favorite: false,
    timesWorn: 0,
    dateAdded: new Date()
  })),
  casual: Array(6).fill(null).map((_, i) => ({
    id: `casual-${i}`,
    name: `Casual Item ${i+1}`,
    type: 'tshirt',
    color: 'blue',
    material: 'cotton',
    seasons: ['all'],
    occasions: ['casual', 'everyday'],
    imageUrl: '/placeholder.svg',
    favorite: false,
    timesWorn: 0,
    dateAdded: new Date()
  })),
  boho: Array(6).fill(null).map((_, i) => ({
    id: `boho-${i}`,
    name: `Boho Item ${i+1}`,
    type: 'dress',
    color: 'brown',
    material: 'linen',
    seasons: ['summer', 'spring'],
    occasions: ['festival', 'casual'],
    imageUrl: '/placeholder.svg',
    favorite: false,
    timesWorn: 0,
    dateAdded: new Date()
  })),
  minimalist: Array(6).fill(null).map((_, i) => ({
    id: `minimalist-${i}`,
    name: `Minimalist Item ${i+1}`,
    type: 'top',
    color: 'white',
    material: 'cotton',
    seasons: ['all'],
    occasions: ['work', 'everyday'],
    imageUrl: '/placeholder.svg',
    favorite: false,
    timesWorn: 0,
    dateAdded: new Date()
  })),
};

const moodOptions: StyleMood[] = [
  {
    id: 'romantic',
    name: 'Romantic',
    icon: '💖',
    description: 'Soft, feminine pieces with floral patterns',
    color: 'bg-pink-500/10 border-pink-500/30 text-pink-300',
  },
  {
    id: 'power',
    name: 'Power Boss',
    icon: '💼',
    description: 'Bold, structured pieces for a confident look',
    color: 'bg-red-500/10 border-red-500/30 text-red-300',
  },
  {
    id: 'casual',
    name: 'Everyday Casual',
    icon: '👕',
    description: 'Comfortable, versatile pieces for daily wear',
    color: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
  },
  {
    id: 'boho',
    name: 'Boho Chic',
    icon: '🌼',
    description: 'Free-spirited, eclectic pieces with natural elements',
    color: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    icon: '✨',
    description: 'Clean lines, neutral colors, and simple silhouettes',
    color: 'bg-gray-500/10 border-gray-500/30 text-gray-300',
  },
];

interface StyleMoodSelectorProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

const StyleMoodSelector = ({
  isPremiumUser,
  onTryItem,
  onUpgradeToPremium
}: StyleMoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(selectedMood === moodId ? null : moodId);
  };
  
  const handleFilterToggle = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  const resetFilters = () => {
    setSelectedMood(null);
    setActiveFilters([]);
  };
  
  // Get filtered items based on selected mood
  const filteredItems = selectedMood ? moodItems[selectedMood] : [];
  
  // Get selected mood details
  const selectedMoodDetails = moodOptions.find(mood => mood.id === selectedMood);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Shop by Mood</h2>
        </div>
        
        {(selectedMood || activeFilters.length > 0) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="text-white/70 hover:text-white"
          >
            <X className="h-4 w-4 mr-1" /> 
            Clear Filters
          </Button>
        )}
      </div>
      
      <ScrollArea className="pb-2">
        <div className="flex gap-2 pb-3">
          {moodOptions.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
                selectedMood === mood.id
                  ? mood.color 
                  : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
              }`}
            >
              <span>{mood.icon}</span>
              <span>{mood.name}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
      
      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mb-4"
        >
          <Card className={`border ${selectedMoodDetails?.color.split(' ')[1]} bg-slate-900/40`}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium mb-1 flex items-center gap-2">
                  <span className="text-xl">{selectedMoodDetails?.icon}</span>
                  {selectedMoodDetails?.name} Style
                </h3>
                <p className="text-white/70 text-sm">
                  {selectedMoodDetails?.description}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="bg-white/5">
                  {filteredItems.length} items
                </Badge>
                <Button size="sm" variant="outline" className="h-8 gap-1 text-xs border-white/20">
                  <Filter className="h-3 w-3" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      <AnimatePresence>
        {selectedMood ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="rounded-lg overflow-hidden bg-slate-800 border border-white/10 hover:border-purple-500/30 transition-all">
                  <div className="relative aspect-square bg-gray-800">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <Button 
                        size="sm" 
                        className="bg-white text-black hover:bg-white/90 text-xs"
                        onClick={() => onTryItem(item)}
                      >
                        Try Now
                      </Button>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-medium text-white/90 line-clamp-1">{item.name}</h3>
                      <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        $49
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/60">H&M</p>
                      {/* Tags */}
                      <div className="flex gap-1">
                        {item.occasions.slice(0, 1).map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-700 rounded-full text-white/60">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-6 px-4 rounded-lg border border-dashed border-white/10 bg-slate-900/30"
          >
            <p className="text-white/70">
              Select a mood above to explore outfits that match your style preference
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StyleMoodSelector;
