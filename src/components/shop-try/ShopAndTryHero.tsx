
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ShopAndTryHeroProps {
  onStartStyling: () => void;
}

const ShopAndTryHero = ({ onStartStyling }: ShopAndTryHeroProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden py-16 lg:py-24"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-600/20 rounded-full filter blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <motion.h1 
              className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Shop & Try Fashion
            </motion.h1>
            
            <motion.p 
              className="text-lg lg:text-xl text-white/80 max-w-lg leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Preview new trends, mix with your wardrobe, and get smart fashion recommendations.
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                onClick={onStartStyling}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
                size="lg"
              >
                → Explore Styles with Olivia
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Right image */}
          <motion.div 
            className="relative lg:block hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative">
              <img 
                src="/lovable-uploads/c3684b42-6eb5-450b-a266-eb618f7c3d1e.png"
                alt="Fashion model in pink outfit"
                className="w-full h-auto max-w-md ml-auto"
              />
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-400/30 rounded-full animate-pulse" />
              <div className="absolute top-1/3 -left-6 w-6 h-6 bg-purple-400/30 rounded-full animate-pulse delay-1000" />
              <div className="absolute bottom-1/4 -right-8 w-4 h-4 bg-blue-400/30 rounded-full animate-pulse delay-2000" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ShopAndTryHero;
