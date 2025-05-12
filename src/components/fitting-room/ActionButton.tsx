
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface ActionButtonProps {
  text: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, onClick }) => {
  return (
    <motion.div
      className="w-full flex justify-center my-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Button
        onClick={onClick}
        className="text-lg py-6 px-8 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 rounded-xl shadow-lg group"
        size="lg"
      >
        {text}
        <motion.div
          className="ml-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            repeatType: "loop" 
          }}
        >
          <ArrowDown className="h-5 w-5" />
        </motion.div>
      </Button>
    </motion.div>
  );
};

export default ActionButton;
