
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const TrustBar = () => {
  return (
    <motion.section
      className="py-6 px-4 bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-10 text-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-coral-400 to-purple-400 rounded-full p-1">
              <Check className="h-4 w-4 text-white" />
            </div>
            <span className="text-white/90 text-sm md:text-base">10,000+ women trust Olivia daily</span>
          </div>
          
          <div className="hidden md:block h-5 w-px bg-white/20"></div>
          
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-coral-400 to-purple-400 rounded-full p-1">
              <Check className="h-4 w-4 text-white" />
            </div>
            <span className="text-white/90 text-sm md:text-base">Weather-smart outfit suggestions</span>
          </div>
          
          <div className="hidden md:block h-5 w-px bg-white/20"></div>
          
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-coral-400 to-purple-400 rounded-full p-1">
              <Check className="h-4 w-4 text-white" />
            </div>
            <span className="text-white/90 text-sm md:text-base">Personalized style recommendations</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default TrustBar;
