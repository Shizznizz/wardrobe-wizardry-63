
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Sparkle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface OliviaBadgeProps {
  message: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'static';
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
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "relative rounded-xl p-4 max-w-[250px] shadow-lg backdrop-blur-sm",
              "bg-gradient-to-r bg-opacity-90 border border-white/20",
              getVariantClasses(variant),
              // Add tooltip pointer based on position
              position.includes('right') ? "after:content-[''] after:absolute after:top-1/2 after:-right-2 after:w-3 after:h-3 after:rotate-45 after:-translate-y-1/2" : "",
              position.includes('left') ? "after:content-[''] after:absolute after:top-1/2 after:-left-2 after:w-3 after:h-3 after:rotate-45 after:-translate-y-1/2" : "",
              position.includes('top') ? "after:content-[''] after:absolute after:left-1/2 after:-top-2 after:w-3 after:h-3 after:rotate-45 after:-translate-x-1/2" : "",
              position.includes('bottom') ? "after:content-[''] after:absolute after:left-1/2 after:-bottom-2 after:w-3 after:h-3 after:rotate-45 after:-translate-x-1/2" : "",
              // Add variant-specific styling to the pointer
              position.includes('right') && variant === 'tip' ? "after:bg-pink-500" : "",
              position.includes('left') && variant === 'tip' ? "after:bg-pink-500" : "",
              position.includes('top') && variant === 'tip' ? "after:bg-pink-500" : "",
              position.includes('bottom') && variant === 'tip' ? "after:bg-pink-500" : "",
              position.includes('right') && variant === 'question' ? "after:bg-purple-600" : "",
              position.includes('left') && variant === 'question' ? "after:bg-purple-600" : "",
              position.includes('top') && variant === 'question' ? "after:bg-purple-600" : "",
              position.includes('bottom') && variant === 'question' ? "after:bg-purple-600" : "",
              position.includes('right') && variant === 'fact' ? "after:bg-emerald-500" : "",
              position.includes('left') && variant === 'fact' ? "after:bg-emerald-500" : "",
              position.includes('top') && variant === 'fact' ? "after:bg-emerald-500" : "",
              position.includes('bottom') && variant === 'fact' ? "after:bg-emerald-500" : ""
            )}
          >
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute -right-2 -top-2 bg-black/30 rounded-full p-1 shadow-md hover:bg-black/40 transition-colors z-10"
            >
              <X className="h-3 w-3 text-white" />
            </button>
            
            <div className="flex items-start gap-3">
              <Avatar className="h-9 w-9 border border-white/30 shadow-sm flex-shrink-0">
                <AvatarImage src="/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png" alt="Olivia" />
                <AvatarFallback className="bg-purple-600 text-xs">OB</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1.5">
                  <p className="text-sm font-semibold text-white">Olivia</p>
                  {variant === 'tip' && (
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full text-white/90 font-medium">Tip</span>
                  )}
                  {variant === 'question' && (
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full text-white/90 font-medium">Question</span>
                  )}
                  {variant === 'fact' && (
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full text-white/90 font-medium">Fun Fact</span>
                  )}
                </div>
                <p className="text-sm text-white/95 leading-relaxed">{message}</p>
                
                {section && (
                  <div className="mt-2 text-[10px] text-white/80 font-medium">
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
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center shadow-md",
              "bg-gradient-to-r border border-white/20",
              "hover:shadow-lg transition-all duration-300",
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
