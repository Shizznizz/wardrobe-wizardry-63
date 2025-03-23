
import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

const VirtualTryOn = () => {
  const [showInfo, setShowInfo] = useState(false);
  const isMobile = useIsMobile();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Virtual Try On
              </h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowInfo(!showInfo)}>
                      <Info className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>See how clothes will look on you</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                <span>Upload Photo</span>
              </Button>
              <Button size="sm" className="gap-2">
                <Camera className="h-4 w-4" />
                <span>Take Photo</span>
              </Button>
            </div>
          </motion.div>
          
          {showInfo && (
            <motion.div 
              variants={itemVariants}
              className="p-4 bg-blue-900/30 backdrop-blur-md rounded-lg border border-blue-500/20 mb-6"
            >
              <p className="text-sm md:text-base">
                The Virtual Try On feature allows you to see how clothing items will look on you before purchasing. 
                Upload a photo or take a picture, then select clothing items from your wardrobe to see how they look on you.
              </p>
            </motion.div>
          )}
          
          <motion.div variants={itemVariants} className="glass-dark p-6 rounded-xl border border-white/10">
            <VirtualFittingRoom />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default VirtualTryOn;
