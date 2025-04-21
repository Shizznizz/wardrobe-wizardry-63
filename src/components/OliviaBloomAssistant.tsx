import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, MinusCircle, PlusCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ClothingItem, Outfit, WeatherInfo } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface OliviaBloomAssistantProps {
  message: string;
  timing?: 'short' | 'medium' | 'long';
  avatar?: string;
  type?: 'tip' | 'welcome' | 'suggestion' | 'celebration';
  actionText?: string;
  onAction?: () => void;
  outfit?: Outfit;
  items?: ClothingItem[];
  weather?: WeatherInfo;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center' | 'mobile';
  autoClose?: boolean;
  compact?: boolean;
  initialDelay?: number;
  showChatIcon?: boolean;
}

const getPositionClasses = (position: string, isMobile: boolean) => {
  if (isMobile || position === 'mobile') {
    return 'fixed inset-x-4 bottom-4 z-50';
  }
  
  switch(position) {
    case 'bottom-left': return 'bottom-10 left-10';
    case 'top-right': return 'top-10 right-10';
    case 'top-left': return 'top-10 left-10';
    case 'center': return 'bottom-28 left-1/2 -translate-x-1/2';
    default: return 'bottom-10 right-10';
  }
};

const getTypeClasses = (type: string) => {
  switch(type) {
    case 'welcome': return 'from-blue-600 to-indigo-600';
    case 'suggestion': return 'from-purple-600 to-pink-500';
    case 'celebration': return 'from-green-500 to-emerald-400';
    default: return 'from-purple-600 to-pink-500';
  }
};

const OliviaBloomAssistant = ({ 
  message, 
  timing = 'medium', 
  avatar = '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png',
  type = 'tip',
  actionText,
  onAction,
  outfit,
  items,
  weather,
  position = 'mobile',
  autoClose = true,
  compact = false,
  initialDelay = 0,
  showChatIcon = false
}: OliviaBloomAssistantProps) => {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(true);
  const [expanded, setExpanded] = useState(!compact);
  const [minimized, setMinimized] = useState(false);
  
  useEffect(() => {
    if (autoClose) {
      const timeouts = {
        short: 5000,
        medium: 8000,
        long: 12000
      };
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, timeouts[timing]);
      
      return () => clearTimeout(timer);
    }
  }, [timing, autoClose]);

  const handleClose = () => {
    setIsVisible(false);
  };
  
  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };
  
  const handleToggleMinimize = () => {
    setMinimized(!minimized);
  };
  
  const handleAction = () => {
    if (onAction) onAction();
    if (autoClose) setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`${getPositionClasses(position, isMobile)} fixed`}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 25,
            delay: initialDelay
          }}
        >
          {expanded ? (
            <div className={cn(
              "flex items-start gap-3",
              compact ? "max-w-[220px]" : "max-w-sm"
            )}>
              <button 
                onClick={handleToggleExpand}
                className="flex-shrink-0 mt-1"
              >
                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                  <AvatarImage src={avatar} alt="Olivia Bloom" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
                </Avatar>
              </button>
              
              <div className={cn(
                "flex-1 rounded-t-xl rounded-bl-xl rounded-br-2xl shadow-lg p-4 relative",
                minimized ? "max-h-16 overflow-hidden" : "",
                "bg-slate-900/90 text-white backdrop-blur-sm",
                "shadow-[0_4px_15px_rgba(0,0,0,0.2)]",
                "border border-white/20"
              )}>
                <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-slate-900/90 transform rotate-45 shadow-md border-r border-b border-white/20" />
                
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <button 
                    onClick={handleToggleMinimize} 
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    {minimized ? (
                      <PlusCircle className="h-3.5 w-3.5 text-white/80" />
                    ) : (
                      <MinusCircle className="h-3.5 w-3.5 text-white/80" />
                    )}
                  </button>
                  <button 
                    onClick={handleClose} 
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-white/80" />
                  </button>
                </div>
                
                <div className="flex items-center mb-2">
                  <h4 className="font-medium text-white flex items-center text-sm">
                    Olivia Bloom
                    <Sparkles className="h-3.5 w-3.5 ml-1 text-yellow-300" />
                  </h4>
                  <span className="ml-2 text-xs bg-slate-800/80 text-white px-2 py-0.5 rounded-full text-[10px]">
                    Style Advisor
                  </span>
                </div>
                
                <AnimatePresence>
                  {!minimized && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className={cn(
                        "text-white/90 mb-3", 
                        compact ? "text-xs" : "text-sm"
                      )}>
                        {message}
                      </p>
                      
                      {actionText && onAction && (
                        <Button 
                          onClick={handleAction}
                          className={`text-xs px-3 py-1 h-auto bg-gradient-to-r ${getTypeClasses(type)} text-white hover:opacity-90`}
                          size="sm"
                        >
                          {actionText}
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleToggleExpand}
              className="rounded-full h-12 w-12 bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </button>
          )}
          
          {showChatIcon && !expanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-4 -right-4 z-10"
            >
              <Button
                size="icon"
                className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 shadow-md"
                onClick={handleToggleExpand}
              >
                <MessageCircle className="h-4 w-4 text-white" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OliviaBloomAssistant;
