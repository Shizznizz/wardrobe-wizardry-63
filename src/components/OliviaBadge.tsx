
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Sparkle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface OliviaBadgeProps {
  message: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  variant?: 'tip' | 'question' | 'fact';
  section?: string;
  autoOpen?: boolean;
  className?: string;
}

const getPositionClasses = (position: string) => {
  switch(position) {
    case 'top-right': return 'top-4 right-4';
    case 'top-left': return 'top-4 left-4';
    case 'bottom-left': return 'bottom-4 left-4';
    default: return 'bottom-4 right-4';
  }
};

const getVariantClasses = (variant: string) => {
  switch(variant) {
    case 'question': return 'from-purple-600 to-blue-500';
    case 'fact': return 'from-emerald-500 to-teal-400';
    default: return 'from-pink-500 to-purple-600';
  }
};

const OliviaBadge = ({ 
  message, 
  position = 'bottom-right', 
  variant = 'tip',
  section = '',
  autoOpen = false,
  className
}: OliviaBadgeProps) => {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // Adjust for when the badge is used in a contained layout vs absolute positioning
  const isPositioned = position !== 'static';

  return (
    <div className={cn(
      isPositioned ? "absolute z-20" : "",
      isPositioned ? getPositionClasses(position) : "",
      className
    )}>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className={cn(
              "rounded-lg p-3 max-w-xs shadow-lg backdrop-blur-sm",
              "bg-gradient-to-r bg-opacity-80 border border-white/10",
              getVariantClasses(variant)
            )}
          >
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute -right-2 -top-2 bg-black/20 rounded-full p-1"
            >
              <X className="h-3 w-3 text-white" />
            </button>
            
            <div className="flex items-start gap-2">
              <Avatar className="h-8 w-8 border border-white/20">
                <AvatarImage src="/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png" alt="Olivia" />
                <AvatarFallback className="bg-purple-600 text-xs">OB</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-xs font-medium text-white">Olivia</p>
                  {variant === 'tip' && (
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full text-white/90">Tip</span>
                  )}
                  {variant === 'question' && (
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full text-white/90">Question</span>
                  )}
                  {variant === 'fact' && (
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full text-white/90">Fun Fact</span>
                  )}
                </div>
                <p className="text-xs text-white/90">{message}</p>
                
                {section && (
                  <div className="mt-2 text-[10px] text-white/70">
                    About: {section}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center shadow-md",
              "bg-gradient-to-r",
              getVariantClasses(variant)
            )}
          >
            {variant === 'tip' && <Sparkle className="h-4 w-4 text-white" />}
            {variant === 'question' && <MessageSquare className="h-4 w-4 text-white" />}
            {variant === 'fact' && <Sparkle className="h-4 w-4 text-white" />}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OliviaBadge;
