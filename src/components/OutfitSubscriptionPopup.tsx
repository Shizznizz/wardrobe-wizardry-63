
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
  Star,
  ImageIcon,
  ShoppingBag,
  Settings2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface OutfitSubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const OutfitSubscriptionPopup = ({ isOpen, onClose, onUpgrade }: OutfitSubscriptionPopupProps) => {
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
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-slate-900 to-purple-950 border-purple-500/20 text-white">
        <DialogHeader className="relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-amber-500 p-3 rounded-full shadow-lg">
            <Star className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-2xl text-center mt-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Unlock Premium Outfit Features
          </DialogTitle>
          <DialogDescription className="text-center text-white/80">
            Take your styling experience to the next level with advanced outfit creation and unlimited options!
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4 py-4">
          <motion.div 
            className="bg-white/10 rounded-lg p-4 flex items-start gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-purple-500/20 p-2 rounded-full">
              <ImageIcon className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">Multiple Photos & Items</h3>
              <p className="text-sm text-white/70">Create complete outfits with multiple clothing items and accessories.</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white/10 rounded-lg p-4 flex items-start gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-pink-500/20 p-2 rounded-full">
              <ShoppingBag className="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">Exclusive Collections</h3>
              <p className="text-sm text-white/70">Access to premium clothing items curated by expert stylists.</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white/10 rounded-lg p-4 flex items-start gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-blue-500/20 p-2 rounded-full">
              <Settings2 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">Advanced Styling</h3>
              <p className="text-sm text-white/70">Resize, reposition, and customize outfits for a perfect virtual try-on.</p>
            </div>
          </motion.div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button 
            variant="ghost" 
            onClick={handleClose}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Maybe Later
          </Button>
          <Button 
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            Upgrade to Premium
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OutfitSubscriptionPopup;
