
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SummonOliviaButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onSummon: () => void;
  tooltip?: string;
}

const SummonOliviaButton = ({ 
  position = 'bottom-right', 
  onSummon,
  tooltip = 'Chat with Olivia'
}: SummonOliviaButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getPositionClass = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-24 right-4';
      case 'top-left':
        return 'top-24 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };
  
  return (
    <motion.div
      className={`fixed z-40 ${getPositionClass()}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className={`rounded-full w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 ${
                isHovered ? 'scale-110' : ''
              }`}
              onClick={onSummon}
            >
              <MessageCircle className="h-5 w-5 text-white" />
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-white/20"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0, scale: 1.3 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop" }}
                  />
                )}
              </AnimatePresence>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-slate-900 text-white border-purple-400/30">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
};

export default SummonOliviaButton;
