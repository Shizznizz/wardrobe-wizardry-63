
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { OutfitTip } from './OutfitTips';
import { Outfit } from '@/lib/types';
import { toast } from 'sonner';

export type AssistantTrigger = 
  | 'outfit-recommendation' 
  | 'outfit-saved' 
  | 'feedback' 
  | 'warmer-request'
  | 'top-change'
  | 'manual';

interface OptimizedOliviaAssistantProps {
  show: boolean;
  message: string;
  trigger?: AssistantTrigger;
  outfit?: Outfit | null;
  onClose: () => void;
  onAction?: () => void;
  actionText?: string;
  position?: 'top' | 'bottom';
  autoHideAfter?: number; // in milliseconds
  hideTipsPreference?: boolean;
  setHideTipsPreference?: (hide: boolean) => void;
}

const OptimizedOliviaAssistant = ({
  show,
  message,
  trigger = 'manual',
  outfit,
  onClose,
  onAction,
  actionText,
  position = 'bottom',
  autoHideAfter = 6000, // 6 seconds default
  hideTipsPreference = false,
  setHideTipsPreference
}: OptimizedOliviaAssistantProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Show the assistant when show prop changes
  useEffect(() => {
    if (show && !hideTipsPreference) {
      setIsVisible(true);
      
      // Set up auto-hide timer if not hovered
      if (autoHideAfter && !isHovered) {
        if (autoHideTimerRef.current) {
          clearTimeout(autoHideTimerRef.current);
        }
        
        autoHideTimerRef.current = setTimeout(() => {
          setIsVisible(false);
          onClose();
        }, autoHideAfter);
      }
    } else {
      setIsVisible(false);
    }
    
    return () => {
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
      }
    };
  }, [show, autoHideAfter, isHovered, onClose, hideTipsPreference]);
  
  // Cancel auto-hide when hovered
  useEffect(() => {
    if (isHovered && autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    } else if (!isHovered && isVisible && autoHideAfter) {
      autoHideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, autoHideAfter);
    }
    
    return () => {
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
      }
    };
  }, [isHovered, isVisible, autoHideAfter, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };
  
  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    
    // Close after action
    setIsVisible(false);
    onClose();
  };
  
  const handleHideTips = () => {
    if (setHideTipsPreference) {
      setHideTipsPreference(true);
      toast.success('Tips are now hidden. Use the summon button to bring Olivia back.');
    }
    handleClose();
  };
  
  const getPositionClass = () => {
    return position === 'top' ? 'top-4 left-1/2 -translate-x-1/2' : 'bottom-4 left-1/2 -translate-x-1/2';
  };
  
  const getTriggerIcon = () => {
    switch (trigger) {
      case 'outfit-recommendation':
        return <Sparkles className="h-4 w-4 text-yellow-300" />;
      case 'outfit-saved':
        return <ThumbsUp className="h-4 w-4 text-green-400" />;
      case 'feedback':
        return <MessageCircle className="h-4 w-4 text-blue-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-purple-300" />;
    }
  };
  
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed z-50 ${getPositionClass()} max-w-sm w-full px-4`}
          initial={{ opacity: 0, y: position === 'top' ? -20 : 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position === 'top' ? -10 : 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-white/10 relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-2 top-2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4 text-white/70" />
            </button>
            
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 border-2 border-purple-500/30">
                <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500">OB</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center mb-2 gap-2">
                  <h3 className="font-medium text-white text-sm">Olivia Bloom</h3>
                  {getTriggerIcon()}
                </div>
                
                <p className="text-white/90 text-sm mb-3">{message}</p>
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleHideTips}
                    className="text-xs text-white/60 hover:text-white hover:bg-white/10"
                  >
                    Don't show tips
                  </Button>
                  
                  {actionText && onAction && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleAction}
                      className="text-xs bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                    >
                      {actionText}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OptimizedOliviaAssistant;
