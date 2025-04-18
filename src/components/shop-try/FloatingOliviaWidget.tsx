
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, ArrowUpRight, Crown } from 'lucide-react';

interface FloatingOliviaWidgetProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
  onOpenChat: () => void;
}

const FloatingOliviaWidget = ({ isPremiumUser, onUpgradeToPremium, onOpenChat }: FloatingOliviaWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-slate-900 to-purple-900 p-4 sm:p-6 rounded-xl shadow-2xl mb-4 border border-white/10 max-w-xs"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium mr-2">
                  OB
                </div>
                <h3 className="font-semibold text-white">Olivia</h3>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6 text-white/60 hover:text-white hover:bg-white/10 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-white/90 text-sm mb-4">
              {isPremiumUser
                ? "Need styling advice? I'm here to help you find the perfect look!"
                : "Upgrade to Premium for personalized styling advice and unlimited try-ons!"
              }
            </p>
            
            {isPremiumUser ? (
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                onClick={() => {
                  onOpenChat();
                  setIsOpen(false);
                }}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat with Olivia
              </Button>
            ) : (
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                onClick={() => {
                  onUpgradeToPremium();
                  setIsOpen(false);
                }}
              >
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg flex items-center justify-center text-white transition-all hover:shadow-purple-500/30 hover:shadow-xl"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
            <motion.span 
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
            />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingOliviaWidget;
