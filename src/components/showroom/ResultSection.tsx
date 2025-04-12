
import React from 'react';
import { motion } from 'framer-motion';
import { Outfit } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface ResultSectionProps {
  finalImage: string | null;
  selectedOutfit: Outfit | null;
  onSuggestAnotherOutfit: () => void;
}

const ResultSection = ({ 
  finalImage, 
  selectedOutfit, 
  onSuggestAnotherOutfit 
}: ResultSectionProps) => {
  if (!finalImage || !selectedOutfit) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex justify-center mt-6"
    >
      <Button 
        onClick={onSuggestAnotherOutfit}
        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white"
      >
        👗 Try Another Outfit
      </Button>
    </motion.div>
  );
};

export default ResultSection;
