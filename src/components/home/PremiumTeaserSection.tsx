
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

const PremiumTeaserSection = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.button 
            onClick={() => navigate('/premium')}
            className="relative overflow-hidden group w-full md:inline-block"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 to-amber-500/30 animate-pulse rounded-lg"></div>
            
            {/* Golden button */}
            <div className="bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-slate-900 font-semibold px-4 sm:px-10 py-5 sm:py-6 rounded-lg shadow-lg hover:shadow-yellow-500/40 transition-all duration-300 relative z-10 border border-yellow-300/50">
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-800" />
                <span className="text-base sm:text-lg font-bold">Want to discover our premium features?</span>
              </div>
              
              {/* Shine animation effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
            </div>
          </motion.button>
          
          <p className="text-white/70 mt-4 text-sm">
            Get exclusive styling perks, early access, and more
          </p>

          {/* Gold effect illustration */}
          <div className="mt-6 md:mt-8 relative w-full max-w-xs mx-auto">
            <AspectRatio ratio={4/1} className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-32 h-32 md:w-40 md:h-40 bg-gradient-to-r from-yellow-300/40 to-amber-400/40 rounded-full blur-xl animate-pulse"></div>
                <span className="text-xs text-white/70 relative z-10">✨ Premium shine effect ✨</span>
              </div>
            </AspectRatio>
          </div>
          
          {/* Extra sparkle elements - for visual appeal */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full pointer-events-none hidden md:block">
            <div className="absolute left-20 top-2">
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1, 0.8], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                className="w-3 h-3 bg-yellow-300 rounded-full"
              />
            </div>
            <div className="absolute right-24 top-6">
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1, 0.8], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 1.5, delay: 0.5 }}
                className="w-2 h-2 bg-amber-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumTeaserSection;
