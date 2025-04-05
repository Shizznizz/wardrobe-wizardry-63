import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Camera, Shirt, X, MessageCircle } from 'lucide-react';
import { Outfit } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  userPhoto: string | null;
  selectedOutfit: Outfit | null;
  oliviaSuggestion: string;
  onReset: () => void;
  onPreviewNow: () => void;
  isMobile: boolean;
  finalImage: string | null;
}

const StatusBar = ({
  userPhoto,
  selectedOutfit,
  oliviaSuggestion,
  onReset,
  onPreviewNow,
  isMobile,
  finalImage
}: StatusBarProps) => {
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white/5 backdrop-blur-xl border-t border-white/10 py-3 px-4 z-40 shadow-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className={`rounded-full p-1 ${userPhoto ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
            {userPhoto ? <Check className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
          </div>
          <span className={cn("text-sm", userPhoto ? "text-white" : "text-gray-400")}>
            {userPhoto ? 'Photo Selected' : 'No Photo Selected'}
          </span>
          
          <div className="mx-2 h-4 w-px bg-white/20"></div>
          
          <div className={cn("rounded-full p-1", selectedOutfit ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400')}>
            {selectedOutfit ? <Check className="h-4 w-4" /> : <Shirt className="h-4 w-4" />}
          </div>
          <span className={cn("text-sm", selectedOutfit ? "text-white" : "text-gray-400")}>
            {selectedOutfit ? selectedOutfit.name : 'No Outfit Selected'}
          </span>
          
          {selectedOutfit && (
            <div className="flex items-center ml-2 text-xs space-x-1">
              {selectedOutfit.seasons.map(season => (
                <span 
                  key={season} 
                  className="py-0.5 px-2 bg-purple-500/20 rounded-full capitalize text-purple-300"
                >
                  {season}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {oliviaSuggestion && selectedOutfit && (
          <motion.div 
            className="flex items-start gap-2 bg-purple-500/10 px-3 py-2 rounded-lg my-2 sm:my-0 max-w-xs sm:max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex-shrink-0 bg-purple-600 rounded-full w-6 h-6 mt-0.5 flex items-center justify-center">
              <MessageCircle className="h-3 w-3 text-white" />
            </div>
            <p className="text-xs sm:text-sm text-purple-100 flex-1">{oliviaSuggestion}</p>
          </motion.div>
        )}
        
        <div className="flex items-center gap-2 ml-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-red-500/30 text-red-300 hover:bg-red-500/20 transition-colors"
            onClick={onReset}
          >
            {isMobile ? <X className="h-4 w-4" /> : "Reset"}
          </Button>
          
          {!finalImage && userPhoto && selectedOutfit && (
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
              onClick={() => onPreviewNow()}
            >
              Preview Now
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatusBar;
