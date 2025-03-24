
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OutfitSuggestionProps {
  suggestion: {
    title: string;
    description: string;
    image: string;
    items: string[];
  };
  onReset: () => void;
}

const OutfitSuggestion = ({ suggestion, onReset }: OutfitSuggestionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <div className="mb-3 flex justify-center">
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
          <Check className="h-4 w-4 mr-1" /> Perfect Match Found!
        </div>
      </div>
      
      <h3 className="text-xl md:text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
        {suggestion.title}
      </h3>
      
      <div className="relative rounded-lg overflow-hidden mb-4 max-w-sm mx-auto mt-4">
        <img 
          src={suggestion.image} 
          alt={suggestion.title} 
          className="w-full object-cover shadow-lg h-64"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-transparent to-transparent flex items-end">
          <div className="p-4 w-full">
            <div className="text-xs uppercase tracking-wider text-purple-200 mb-1 font-semibold">Olivia says...</div>
            <p className="text-white italic text-sm">
              "{suggestion.description}"
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white/5 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-purple-200 mb-2 flex items-center justify-center">
          <Sparkles className="h-4 w-4 mr-1 text-purple-300" /> Key Pieces
        </h4>
        <ul className="space-y-2">
          {suggestion.items.map((item, index) => (
            <li 
              key={index}
              className="text-sm text-white/80 flex items-center gap-2"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-pink-400"></div>
              {item}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex gap-4 justify-center">
        <Button
          onClick={onReset}
          variant="outline"
          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
        >
          Try Again
        </Button>
        
        <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
          <span>Explore More</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default OutfitSuggestion;
