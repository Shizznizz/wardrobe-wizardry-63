
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClothingItem } from '@/lib/types';
import { motion } from 'framer-motion';

interface OliviaSuggestsProps {
  items: ClothingItem[];
}

const OliviaSuggests = ({ items }: OliviaSuggestsProps) => {
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = React.useState<{item: ClothingItem, reason: string} | null>(null);
  
  // Find items not worn in 20+ days
  React.useEffect(() => {
    if (!items || items.length === 0) return;
    
    // Find unworn items (items with lastWorn > 20 days ago)
    const currentDate = new Date();
    const twentyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 20));
    const unwornItems = items.filter(item => {
      if (!item.lastWorn) return true;
      const lastWornDate = new Date(item.lastWorn);
      return lastWornDate < twentyDaysAgo;
    });
    
    // Find duplicate items (e.g., 5+ black t-shirts)
    const typeColorCounts: Record<string, ClothingItem[]> = {};
    items.forEach(item => {
      const key = `${item.type}-${item.color}`;
      if (!typeColorCounts[key]) {
        typeColorCounts[key] = [];
      }
      typeColorCounts[key].push(item);
    });
    
    const duplicateTypes = Object.keys(typeColorCounts).filter(key => typeColorCounts[key].length >= 5);
    
    // Prioritize suggestion
    if (unwornItems.length > 0) {
      const randomItem = unwornItems[Math.floor(Math.random() * unwornItems.length)];
      const daysSince = randomItem.lastWorn ? 
        Math.floor((new Date().getTime() - new Date(randomItem.lastWorn).getTime()) / (1000 * 3600 * 24)) : 
        30;
        
      setSuggestion({
        item: randomItem,
        reason: `You haven't worn your ${randomItem.color} ${randomItem.name || randomItem.type} in ${daysSince} days`
      });
    } else if (duplicateTypes.length > 0) {
      const randomTypeKey = duplicateTypes[Math.floor(Math.random() * duplicateTypes.length)];
      const [type, color] = randomTypeKey.split('-');
      const count = typeColorCounts[randomTypeKey].length;
      
      setSuggestion({
        item: typeColorCounts[randomTypeKey][0],
        reason: `You have ${count} ${color} ${type}s in your wardrobe`
      });
    } else {
      setSuggestion(null);
    }
  }, [items]);
  
  const handleStyleIt = () => {
    if (suggestion) {
      // Set the item in local storage to be used by the Mix & Match page
      localStorage.setItem('selectedWardrobeItem', JSON.stringify(suggestion.item));
      navigate('/mix-and-match');
    }
  };
  
  if (!suggestion) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-slate-800/30 border border-purple-500/20 rounded-lg backdrop-blur-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className="bg-purple-500/20 p-2 rounded-full">
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-purple-200 mb-1">Olivia Suggests</h4>
          <p className="text-sm text-white/80 mb-3">{suggestion.reason} – want Olivia to create a new outfit?</p>
          <Button 
            onClick={handleStyleIt} 
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
          >
            Style it now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default OliviaSuggests;
