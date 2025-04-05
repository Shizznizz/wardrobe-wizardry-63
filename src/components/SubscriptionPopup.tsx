
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Sparkles,
  Shirt,
  ShoppingBag,
  MessageCircle,
  X,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface SubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const SubscriptionPopup = ({ isOpen, onClose, onUpgrade }: SubscriptionPopupProps) => {
  const [showLocalDialog, setShowLocalDialog] = useState(false);
  
  // Sync the local state with the prop
  useEffect(() => {
    setShowLocalDialog(isOpen);
  }, [isOpen]);
  
  const handleClose = () => {
    setShowLocalDialog(false);
    // Slight delay to allow animation to complete
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleUpgrade = () => {
    toast.success('Redirecting to premium subscription page');
    onUpgrade();
    handleClose();
  };

  return (
    <Dialog open={showLocalDialog} onOpenChange={setShowLocalDialog}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border-purple-500/30 text-white rounded-2xl shadow-xl p-0 overflow-hidden w-[95%] max-h-[90vh]">
        <ScrollArea className="max-h-[80vh] overflow-y-auto">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 blur-2xl transform -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-2xl transform translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
            <DialogHeader className="relative">
              <motion.div 
                className="absolute -top-8 sm:-top-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 p-2 sm:p-3 rounded-full shadow-lg shadow-purple-500/30"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </motion.div>
              
              <div className="flex items-center justify-center mb-2">
                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-pink-400 mr-2 sm:mr-3">
                  <AvatarImage src="/lovable-uploads/c26c0c8c-7ff3-432a-b79b-1d22494daba6.png" alt="Olivia Bloom" />
                  <AvatarFallback>OB</AvatarFallback>
                </Avatar>
                <div className="relative">
                  <motion.div 
                    className="absolute -top-6 -right-2 bg-white text-purple-600 rounded-full px-2 py-1 text-xs font-medium shadow-md hidden sm:block"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    Let's unlock your style power 💫
                  </motion.div>
                </div>
              </div>
              
              <DialogTitle className="text-2xl sm:text-3xl text-center mt-3 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 font-bold">
                Unlock Fashion Freedom
              </DialogTitle>
              <DialogDescription className="text-center text-white/90 mt-2 text-sm sm:text-base">
                Upgrade your wardrobe experience with next-level styling tools, exclusive access, and Olivia's personal fashion support.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 gap-4 sm:gap-5 py-4 sm:py-6 mt-2">
              <motion.div 
                className="bg-white/10 rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 border border-white/10 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-gradient-to-br from-purple-500/30 to-purple-500/10 p-2 sm:p-3 rounded-lg border border-purple-400/20 flex-shrink-0">
                  <Shirt className="h-5 w-5 sm:h-6 sm:w-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-white">Try Before You Style</h3>
                  <p className="text-sm sm:text-base text-white/80">
                    Instantly see how any outfit looks on you or Olivia Bloom with our immersive AI-powered virtual try-on.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white/10 rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 border border-white/10 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-gradient-to-br from-pink-500/30 to-pink-500/10 p-2 sm:p-3 rounded-lg border border-pink-400/20 flex-shrink-0">
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-pink-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-white">Test Your Look Before You Buy</h3>
                  <p className="text-sm sm:text-base text-white/80">
                    Not sure about that new jacket or dress? Preview how it fits your style before you commit — shop smarter.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white/10 rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 border border-white/10 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-gradient-to-br from-blue-500/30 to-blue-500/10 p-2 sm:p-3 rounded-lg border border-blue-400/20 flex-shrink-0">
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-white">Personal Stylist, 24/7</h3>
                  <p className="text-sm sm:text-base text-white/80">
                    Chat directly with Olivia Bloom — your AI stylist for instant outfit tips, advice, and fashion inspiration.
                  </p>
                </div>
              </motion.div>
            </div>
            
            <DialogFooter className="flex-col gap-3 mt-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-lg shadow-purple-500/30 border border-white/10 transition-all duration-300"
                >
                  <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" /> Upgrade to Premium
                </Button>
              </motion.div>
              
              <Button 
                variant="ghost" 
                onClick={handleClose}
                className="text-white/80 hover:text-white hover:bg-white/10 border border-white/10 text-sm sm:text-base"
              >
                Maybe Later
              </Button>
              
              <p className="text-center text-white/60 text-xs sm:text-sm mt-2">
                Cancel anytime. No pressure, just pure style.
              </p>
            </DialogFooter>
          </div>
        </ScrollArea>
        
        <button 
          onClick={handleClose} 
          className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white z-20"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionPopup;
