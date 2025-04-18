
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, MinusCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
  const [message, setMessage] = useState("Need help choosing an outfit? I'm here to help!");
  
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 max-w-xs bg-slate-900/90 backdrop-blur-sm rounded-lg border border-purple-500/20 shadow-lg p-4"
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 border-2 border-purple-500/30">
                <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500">OB</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white text-sm">Olivia Bloom</h3>
                  <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-white/90 text-sm mb-3">{message}</p>
                <Button
                  size="sm"
                  onClick={() => {
                    if (isPremiumUser) {
                      onOpenChat();
                    } else {
                      onUpgradeToPremium();
                    }
                    setIsOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {isPremiumUser ? "Chat with me" : "Unlock Premium Chat"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Button
        size="icon"
        className={`rounded-full w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg hover:shadow-purple-500/20 transition-all duration-300`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
};

export default FloatingOliviaWidget;
