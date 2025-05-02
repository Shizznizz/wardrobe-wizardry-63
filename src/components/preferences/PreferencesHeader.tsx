
import { Info, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PreferencesHeader = () => {
  const sparkleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 0.4,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div className="relative px-6 py-4 bg-gradient-to-r from-purple-900/40 to-pink-900/40 flex items-center justify-between rounded-lg shadow-inner shadow-purple-600/5 border border-purple-500/10">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-0 w-20 h-20 bg-purple-400/5 rounded-full blur-xl"></div>
        <div className="absolute right-1/4 bottom-0 w-24 h-24 bg-pink-400/5 rounded-full blur-xl"></div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
            <span className="text-white text-xs">OB</span>
          </div>
          <motion.div 
            className="absolute -top-1 -right-1"
            variants={sparkleVariants}
            initial="initial"
            animate="animate"
          >
            <Sparkles className="w-3 h-3 text-pink-300" />
          </motion.div>
        </div>
        <p className="text-sm font-medium text-white">
          Let's shape your style preferences together 
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent ml-1 relative">
            with Olivia
            <span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-gradient-to-r from-pink-400 to-purple-400 opacity-70"></span>
          </span>
        </p>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="rounded-full p-1.5 hover:bg-white/10 cursor-pointer transition-colors">
              <Info className="h-4 w-4 text-white/70" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-slate-900/95 border-purple-500/20">
            <p className="text-xs max-w-xs">
              Olivia will use your preferences to create outfits tailored to your style and needs
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default PreferencesHeader;
