
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ClothingItem, Outfit, WeatherInfo } from '@/lib/types';

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
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  autoClose?: boolean;
}

const getPositionClasses = (position: string) => {
  switch(position) {
    case 'bottom-left': return 'bottom-6 left-6';
    case 'top-right': return 'top-6 right-6';
    case 'top-left': return 'top-6 left-6';
    case 'center': return 'bottom-24 left-1/2 -translate-x-1/2';
    default: return 'bottom-6 right-6';
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
  avatar = '/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png',
  type = 'tip',
  actionText,
  onAction,
  outfit,
  items,
  weather,
  position = 'bottom-right',
  autoClose = true
}: OliviaBloomAssistantProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [expanded, setExpanded] = useState(true);
  
  // Set timings for auto close
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
  
  const handleAction = () => {
    if (onAction) onAction();
    if (autoClose) setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed z-50 ${getPositionClasses(position)} flex items-end`}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          {expanded ? (
            <div className="flex items-start gap-3 max-w-sm">
              <button 
                onClick={handleToggleExpand}
                className="flex-shrink-0 mt-1"
              >
                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                  <AvatarImage src={avatar} alt="Olivia Bloom" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
                </Avatar>
              </button>
              
              <div className="flex-1 bg-white rounded-t-xl rounded-bl-xl rounded-br-2xl shadow-lg p-4 relative">
                <button 
                  onClick={handleClose} 
                  className="absolute -top-3 -right-3 bg-gray-100 rounded-full p-1 shadow-sm hover:bg-gray-200 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
                
                <div className="flex items-center mb-2">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    Olivia Bloom
                    <Sparkles className="h-4 w-4 ml-1 text-yellow-500" />
                  </h4>
                  <span className="ml-2 text-xs bg-gradient-to-r from-purple-600 to-pink-500 text-white px-2 py-0.5 rounded-full">
                    Style Advisor
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OliviaBloomAssistant;
