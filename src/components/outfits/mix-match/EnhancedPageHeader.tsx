
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ShirtIcon, PlusIcon, RibbonIcon } from 'lucide-react';
import { CTAButton } from '@/components/ui/cta-button';

interface EnhancedPageHeaderProps {
  userName?: string | null;
  onScrollToWeather: () => void;
  onScrollToOutfits?: () => void;
  onOpenCreateOutfitDialog?: () => void;
}

const EnhancedPageHeader = ({ 
  userName, 
  onScrollToWeather,
  onScrollToOutfits,
  onOpenCreateOutfitDialog
}: EnhancedPageHeaderProps) => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  const sparkleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 0.8,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      x: 40,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 60, 
        damping: 13, 
        duration: 1.2,
        delay: 0.2
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="relative py-6 md:py-8 lg:py-10 px-4 text-center"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl"></div>
        
        {/* Additional futuristic elements */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
        <div className="absolute -left-20 top-1/4 w-40 h-40 rounded-full border border-pink-300/20"></div>
        <div className="absolute right-10 bottom-1/4 w-20 h-20 rounded-full border border-indigo-300/20"></div>
      </div>

      {/* Main content with image */}
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <motion.div className="relative">
            <motion.div
              className="absolute -top-6 left-1/4"
              variants={sparkleVariants}
              initial="initial"
              animate="animate"
            >
              <Sparkles className="w-5 h-5 text-pink-400" />
            </motion.div>
            <motion.h1 
              variants={fadeUp}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-coral-500 via-purple-400 to-indigo-400 leading-tight mx-auto"
            >
              Your Daily Style, Curated by Olivia
            </motion.h1>
            
            <motion.p 
              variants={fadeUp} 
              className="text-base xs:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              {userName 
                ? `Hi ${userName}, get AI-powered outfits based on your style, mood, and local weather.`
                : `Get AI-powered outfits based on your style, mood, and local weather.`
              }
            </motion.p>

            <motion.div 
              variants={fadeUp}
              className="flex flex-wrap justify-center gap-4 mx-auto"
            >
              <CTAButton 
                variant="hero-primary"
                onClick={onScrollToWeather}
                className="flex items-center justify-center min-w-[180px] text-white hover:shadow-[0_0_15px_rgba(236,72,153,0.6)] transition-all duration-300 group"
                icon={<RibbonIcon className="h-4 w-4" />}
                iconPosition="left"
                glowColor="rgba(236,72,153,0.6)"
              >
                <span>Let Olivia Style Me Today</span>
              </CTAButton>
              
              <Button 
                onClick={onScrollToOutfits}
                variant="hero-secondary"
                size="lg"
                className="flex items-center justify-center min-w-[180px]"
              >
                <ShirtIcon className="h-4 w-4 mr-2" />
                See My Outfits
              </Button>
              
              <Button 
                onClick={onOpenCreateOutfitDialog}
                variant="hero-secondary"
                size="lg"
                className="flex items-center justify-center min-w-[180px]"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add New Outfit
              </Button>
            </motion.div>
          </motion.div>
          
          {/* New Olivia image with animation */}
          <motion.div
            className="hidden md:flex justify-center items-center"
            variants={imageVariants}
            whileHover="hover"
          >
            <div className="relative">
              {/* Image glow effects */}
              <motion.div 
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl transform translate-y-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 0.8, 0.6] 
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
              
              <img 
                src="/lovable-uploads/1d4e81c7-dcef-4208-ba9f-77c0544f9e12.png" 
                alt="Olivia Bloom"
                className="rounded-full max-h-[460px] w-auto object-cover border-2 border-purple-300/30 shadow-lg shadow-purple-500/20"
                style={{
                  filter: "drop-shadow(0 8px 20px rgba(159, 122, 234, 0.4))"
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedPageHeader;
