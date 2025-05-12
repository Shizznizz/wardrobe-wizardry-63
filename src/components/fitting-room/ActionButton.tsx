
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActionButtonProps {
  text: string;
  onClick: () => void;
  tooltip?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, onClick, tooltip }) => {
  const button = (
    <motion.div
      className="mt-6" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      whileHover={{ 
        y: -5,
        boxShadow: "0px 10px 25px -5px rgba(168,85,247,0.5)"
      }}
    >
      <Button
        onClick={onClick}
        className="text-lg py-6 px-8 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 rounded-xl shadow-lg group hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all duration-300"
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

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent className="bg-slate-800 border-white/10 text-white max-w-xs">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export default ActionButton;
