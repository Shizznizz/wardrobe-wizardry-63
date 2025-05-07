
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  MessageCircle, 
  X, 
  Send, 
  ChevronRight
} from 'lucide-react';

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
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Auto-open the widget after some time if user hasn't interacted yet
  React.useEffect(() => {
    if (!hasInteracted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasInteracted(true);
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [hasInteracted]);
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-4 bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl overflow-hidden w-72 sm:w-80"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 mr-3">
                  <img 
                    src="/lovable-uploads/c937b60e-901e-48ae-b01d-28d901a11503.png" 
                    alt="Olivia" 
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Olivia</h3>
                  <p className="text-xs text-white/60">Fashion Assistant</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4">
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 mr-3 flex-shrink-0">
                  <img 
                    src="/lovable-uploads/c937b60e-901e-48ae-b01d-28d901a11503.png" 
                    alt="Olivia" 
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div className="bg-white/10 rounded-lg rounded-tl-none p-2.5 text-sm">
                  <p>Hi there! 👋 I'm Olivia, your fashion assistant. Need help finding the perfect outfit for today?</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full border-white/10 hover:bg-white/5 text-white justify-start"
                  onClick={onOpenChat}
                >
                  <span className="mr-2">🔍</span>
                  Help me find an outfit
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
                
                {!isPremiumUser && (
                  <Button 
                    variant="outline" 
                    className="w-full border-white/10 hover:bg-white/5 text-white justify-start"
                    onClick={onUpgradeToPremium}
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                    Upgrade to Premium
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full border-white/10 hover:bg-white/5 text-white justify-start"
                  onClick={() => {
                    window.open('https://example.com/shop', '_blank');
                  }}
                >
                  <span className="mr-2">🛍️</span>
                  Shop Today's Picks
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              </div>
              
              {isPremiumUser && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type your fashion question..."
                      className="w-full pl-4 pr-12 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-white/70 hover:text-white"
                      onClick={onOpenChat}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg hover:shadow-purple-500/20 transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setHasInteracted(true);
        }}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
        <span className="sr-only">Chat with Olivia</span>
      </motion.button>
    </div>
  );
};

export default FloatingOliviaWidget;
