import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import OliviaMoodAvatar from './OliviaMoodAvatar';

interface FloatingOliviaWidgetProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
  onOpenChat: () => void;
}

const FloatingOliviaWidget = ({ 
  isPremiumUser, 
  onUpgradeToPremium,
  onOpenChat 
}: FloatingOliviaWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleChatClick = () => {
    if (isPremiumUser) {
      onOpenChat();
    } else {
      onUpgradeToPremium();
    }
    setIsOpen(false);
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-lg p-4 rounded-lg border border-purple-500/30 shadow-xl mb-4 w-64"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <OliviaMoodAvatar mood="happy" size="sm" />
                <span className="ml-2 font-medium text-white">Olivia</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-slate-400 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-slate-300">
                Need styling advice or a second opinion on your outfit?
              </p>
              
              <Button 
                onClick={handleChatClick}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500"
                size="sm"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {isPremiumUser ? "Chat with Olivia" : "Upgrade for Advice"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-full p-3 shadow-lg shadow-purple-500/20 flex items-center justify-center relative"
            >
              <MessageCircle className="h-6 w-6 text-white" />
              <span className="absolute -top-2 -right-2 bg-blue-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                1
              </span>
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Need help from Olivia?</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FloatingOliviaWidget;
