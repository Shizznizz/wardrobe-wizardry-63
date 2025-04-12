
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Filter, Layers, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import { ClothingItem, Outfit, OutfitLogExtended } from '@/lib/types';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { Badge } from '@/components/ui/badge';

interface OutfitGroupsSectionProps {
  groupedOutfits: Record<string, Outfit[]>;
  onToggleFavorite: (id: string) => void;
  onOutfitAddedToCalendar: (log: OutfitLog) => void;
  clothingItems: ClothingItem[];
}

const OutfitGroupsSection = ({
  groupedOutfits,
  onToggleFavorite,
  onOutfitAddedToCalendar,
  clothingItems
}: OutfitGroupsSectionProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Casual & Comfortable': true,
    'Elegant & Formal': false,
    'Summer Ready': false,
    'Winter Warmth': false,
    'Other': false,
  });
  
  const isMobile = useIsMobile();
  
  const handleToggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const sortedCategoryKeys = Object.keys(groupedOutfits).sort((a, b) => {
    const order = ['Casual & Comfortable', 'Elegant & Formal', 'Summer Ready', 'Winter Warmth', 'Other'];
    return order.indexOf(a) - order.indexOf(b);
  });
  
  const getEmoji = (category: string) => {
    switch (category) {
      case 'Casual & Comfortable':
        return '👕';
      case 'Elegant & Formal':
        return '👔';
      case 'Summer Ready':
        return '🌞';
      case 'Winter Warmth':
        return '❄️';
      default:
        return '👚';
    }
  };
  
  const totalOutfits = Object.values(groupedOutfits).reduce(
    (sum, outfits) => sum + outfits.length, 
    0
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">My Outfit Collection</h2>
          <Badge className="bg-purple-600 ml-2">
            {totalOutfits} outfits
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="border-white/10 hover:bg-white/5 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Create Outfit</span>
            <span className="sm:hidden">Create</span>
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="border-white/10 hover:bg-white/5 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh</span>
          </Button>
        </div>
      </div>
      
      {sortedCategoryKeys.length > 0 ? (
        <div className="space-y-6">
          {sortedCategoryKeys.map((category) => {
            const outfits = groupedOutfits[category];
            if (!outfits || outfits.length === 0) return null;
            
            return (
              <Collapsible
                key={category}
                open={openSections[category]}
                onOpenChange={() => handleToggleSection(category)}
                className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden"
              >
                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getEmoji(category)}</span>
                    <h3 className="font-medium text-white">{category}</h3>
                    <Badge variant="outline" className="bg-slate-700/50 border-slate-600/50 text-white/80 ml-2">
                      {outfits.length}
                    </Badge>
                  </div>
                  
                  {openSections[category] ? (
                    <ChevronUp className="h-5 w-5 text-white/60" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-white/60" />
                  )}
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {outfits.slice(0, isMobile ? 2 : 4).map((outfit) => (
                      <div key={outfit.id} className="mt-4">
                        <OutfitSuggestion
                          outfit={outfit}
                          items={clothingItems}
                          hideActions={true}
                        />
                        
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {outfit.tags && outfit.tags.length > 0 && outfit.tags.map((tag) => (
                            <Badge 
                              key={tag}
                              variant="outline" 
                              className="bg-purple-500/20 text-purple-200 text-xs border-purple-500/30"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-500/30 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs"
                            onClick={() => onToggleFavorite(outfit.id)}
                          >
                            {outfit.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-500/30 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 text-xs"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {outfits.length > (isMobile ? 2 : 4) && (
                    <div className="px-4 pb-4 flex justify-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-white/10 hover:bg-white/5 text-white"
                      >
                        Show All {outfits.length} Outfits
                      </Button>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-white/10 p-8 text-center">
          <p className="text-white/70">No outfits match your current filters.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4 border-purple-500/30 hover:bg-purple-500/20 text-purple-200"
          >
            <Filter className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        </div>
      )}
      
      <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
          {['Casual', 'Work', 'Evening', 'Special'].map((category) => (
            <div 
              key={category}
              className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-white/10 p-3 text-center cursor-pointer hover:bg-slate-700/40 transition-colors"
            >
              <h4 className="font-medium text-white">{category}</h4>
              <p className="text-xs text-white/60">
                {Math.floor(Math.random() * 10) + 1} outfits
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 justify-center pt-6">
        {[1, 2, 3, 4].map((idx) => (
          <div 
            key={idx}
            className="bg-slate-800/20 backdrop-blur-sm rounded-lg border border-white/10 p-1.5 flex items-center gap-2 cursor-pointer hover:bg-slate-700/30 transition-colors"
          >
            <div className="h-8 w-8 rounded-md overflow-hidden bg-gradient-to-br from-purple-400 to-pink-500">
              <img 
                src={`/lovable-uploads/${['5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png', '45448793-cb34-4e4c-9dd8-de95f86f25ca.png'][idx % 2]}`} 
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="pr-2">
              <p className="text-xs text-white/90">Suggested for you</p>
              <p className="text-[10px] text-white/60">Based on your style</p>
            </div>
          </div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-purple-900/80 rounded-xl border border-purple-500/20 p-6 mt-8"
      >
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Popular Today</h3>
          <p className="text-white/80">These outfits have been liked by people with similar style preferences</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {Object.values(groupedOutfits).flat().slice(0, 3).map((outfit) => (
              <div key={outfit.id} className="overflow-hidden">
                <OutfitSuggestion
                  outfit={outfit}
                  items={clothingItems}
                  hideActions={true}
                  size="small"
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OutfitGroupsSection;
