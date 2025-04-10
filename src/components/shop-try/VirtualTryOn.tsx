
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader } from 'lucide-react';

interface VirtualTryOnProps {
  finalImage: string | null;
  isProcessing: boolean;
  userPhoto: string | null;
  isOliviaImage: boolean;
  effectivePremiumUser: boolean;
  onSaveLook: () => void;
}

const VirtualTryOn = ({
  finalImage,
  isProcessing,
  userPhoto,
  isOliviaImage,
  effectivePremiumUser,
  onSaveLook
}: VirtualTryOnProps) => {
  if (isProcessing) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 rounded-lg border border-white/10 bg-black/20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <Loader className="h-12 w-12 text-purple-400" />
        </motion.div>
        <h3 className="text-xl font-medium mb-2 text-white">
          Creating your style...
        </h3>
        <p className="text-white/70 text-center max-w-md">
          Olivia is working her magic to create your virtual try-on.
        </p>
      </div>
    );
  }
  
  if (userPhoto && !finalImage) {
    return (
      <div className="flex-grow flex flex-col rounded-lg overflow-hidden border border-white/10 relative">
        <div className="relative h-full w-full">
          <AnimatePresence>
            <motion.img 
              key="user-photo"
              src={userPhoto} 
              alt="Your uploaded photo" 
              className="w-full h-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <p className="text-white text-center px-4 py-2 rounded-lg bg-black/50 max-w-xs">
              Select a clothing item to try on
            </p>
          </motion.div>
          {isOliviaImage && (
            <div className="absolute top-2 left-2 bg-purple-600/80 rounded-full py-0.5 px-2 text-xs text-white flex items-center">
              Olivia's Avatar
            </div>
          )}
        </div>
      </div>
    );
  }
  
  if (finalImage) {
    return (
      <div className="flex-grow flex flex-col rounded-lg overflow-hidden border border-white/10 relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={finalImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-full w-full"
          >
            <img 
              src={finalImage} 
              alt="Virtual try-on preview" 
              className="w-full h-full object-contain"
            />
            
            {!effectivePremiumUser && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/90 via-purple-900/50 to-transparent p-4 text-center">
                <p className="text-white text-sm">
                  More styling options available with Premium
                </p>
              </div>
            )}
            
            {isOliviaImage && (
              <div className="absolute top-2 left-2 bg-purple-600/80 rounded-full py-0.5 px-2 text-xs text-white flex items-center">
                Olivia's Avatar
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }
  
  return null;
};

export default VirtualTryOn;
