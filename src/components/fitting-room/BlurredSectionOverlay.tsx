
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BlurredSectionOverlayProps {
  onClickChooseModel: () => void;
  customMessage?: string;
  buttonText?: string;
}

const BlurredSectionOverlay: React.FC<BlurredSectionOverlayProps> = ({ 
  onClickChooseModel,
  customMessage,
  buttonText = "Choose Your Model"
}) => {
  return (
    <motion.div 
      className="absolute inset-0 backdrop-blur-sm bg-purple-950/50 z-20 flex flex-col items-center justify-center rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-16 w-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
        <Camera className="h-8 w-8 text-purple-300" />
      </div>
      
      <TooltipProvider>
        <h3 className="text-xl font-medium text-white mb-2 text-center px-4 flex items-center">
          {customMessage || "Choose a photo or Olivia to preview these outfits"}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex ml-2 cursor-help">
                <Info className="h-4 w-4 text-purple-300/70" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-slate-900 border-purple-500/20 text-white max-w-sm">
              <p>You need to select a model to see how outfits will look. Choose your own photo or use Olivia.</p>
            </TooltipContent>
          </Tooltip>
        </h3>
      </TooltipProvider>
      
      <p className="text-white/70 text-center max-w-md mb-4 px-4">
        Upload your photo or use Olivia as a model to try on these looks
      </p>
      
      <motion.div
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px 5px rgba(147, 51, 234, 0.3)" }} 
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onClickChooseModel}
          className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all duration-300"
        >
          <User className="mr-2 h-5 w-5" /> {buttonText}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default BlurredSectionOverlay;
