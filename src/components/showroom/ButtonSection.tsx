
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ButtonSectionProps {
  onSuggestAnotherOutfit: () => void;
}

const ButtonSection = ({ onSuggestAnotherOutfit }: ButtonSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex justify-center"
    >
      <Button 
        onClick={onSuggestAnotherOutfit}
        className="neo-blur bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white py-6 px-8 text-lg rounded-lg shadow-lg shadow-purple-500/20 group relative overflow-hidden transition-all duration-300"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <Sparkles className="mr-2 h-5 w-5 text-yellow-200 animate-pulse" />
        <span>Get Styled Now</span>
        <span className="block text-xs font-normal mt-1 opacity-90 max-w-xs">
          Let Olivia recommend the perfect look based on your mood and local weather
        </span>
      </Button>
    </motion.div>
  );
};

export default ButtonSection;
