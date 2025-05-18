
import React, { useState, useEffect } from 'react';
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
  const [suggestions, setSuggestions] = useState<{item: ClothingItem, reason: string, emoji: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Find items not worn in 30+ days (updated from 20 days)
  useEffect(() => {
    if (!items || items.length === 0) return;
    
    // Find unworn items (items with lastWorn > 30 days ago)
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
    const unwornItems = items.filter(item => {
      if (!item.lastWorn) return true;
      const lastWornDate = new Date(item.lastWorn);
      return lastWornDate < thirtyDaysAgo;
    });
    
    // Generate suggestions with appropriate emojis
    if (unwornItems.length > 0) {
      const formattedSuggestions = unwornItems.map(item => {
        const daysSince = item.lastWorn ? 
          Math.floor((new Date().getTime() - new Date(item.lastWorn).getTime()) / (1000 * 3600 * 24)) : 
          30;
          
        // Select appropriate emoji based on item type
        const emoji = getItemEmoji(item.type || '');
        
        return {
          item,
          reason: `You haven't worn your ${item.color} ${item.name || item.type} in ${daysSince} days`,
          emoji
        };
      });
      
      setSuggestions(formattedSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [items]);
  
  // Function to get appropriate emoji based on item type
  const getItemEmoji = (type: string) => {
    type = type.toLowerCase();
    if (type.includes('shoe') || type.includes('sneaker')) return '👟';
    if (type.includes('dress')) return '👗';
    if (type.includes('shirt') || type.includes('top')) return '👕';
    if (type.includes('pant') || type.includes('trouser')) return '👖';
    if (type.includes('hat')) return '🧢';
    if (type.includes('jacket') || type.includes('coat')) return '🧥';
    if (type.includes('sock')) return '🧦';
    if (type.includes('scarf')) return '🧣';
    if (type.includes('glove')) return '🧤';
    return '👚'; // Default clothing emoji
  };
  
  // Rotate through suggestions every 8 seconds if there are multiple
  useEffect(() => {
    if (suggestions.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % suggestions.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [suggestions.length]);
  
  const handleStyleIt = () => {
    if (suggestions.length > 0) {
      const suggestion = suggestions[currentIndex];
      // Set the item in local storage to be used by the Mix & Match page
      localStorage.setItem('selectedWardrobeItem', JSON.stringify(suggestion.item));
      navigate('/mix-and-match');
    }
  };
  
  if (suggestions.length === 0) return null;
  
  const suggestion = suggestions[currentIndex];
  
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
          <div className="flex items-center gap-2">
            {suggestion.item.imageUrl && (
              <img 
                src={suggestion.item.imageUrl} 
                alt={suggestion.item.name || suggestion.item.type} 
                className="w-10 h-10 object-cover rounded-md border border-purple-500/20"
              />
            )}
            <div>
              <h4 className="text-sm font-medium text-purple-200">Olivia Suggests</h4>
              <p className="text-sm text-white/80">
                {suggestion.emoji} {suggestion.reason}
              </p>
              <p className="text-xs text-purple-300/60 mt-1 italic">
                Tap below to create a fresh look
              </p>
            </div>
          </div>
          <Button 
            onClick={handleStyleIt} 
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 mt-3"
          >
            Style it now
          </Button>
          {suggestions.length > 1 && (
            <div className="flex justify-center mt-2">
              {suggestions.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`inline-block mx-1 w-1.5 h-1.5 rounded-full ${
                    idx === currentIndex ? 'bg-purple-400' : 'bg-purple-400/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OliviaSuggests;
