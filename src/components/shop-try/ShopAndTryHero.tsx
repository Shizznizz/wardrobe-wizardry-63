
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, UserCircle2, Shirt } from 'lucide-react';
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
      className="text-center relative overflow-hidden py-10 sm:py-16"
    >
      {/* Background shape */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-600/20 rounded-full filter blur-3xl" />
      </div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto max-w-xl mb-8"
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            className="w-28 h-28 relative"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full opacity-20 animate-pulse" />
            <div className="absolute inset-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Shirt className="w-12 h-12 text-white/90" />
            </div>
            <motion.div 
              className="absolute -right-2 -top-2 bg-pink-500 rounded-full p-1.5"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "loop" 
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>
        </div>
        
        <motion.h1 
          className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Style It Your Way
        </motion.h1>
        
        <motion.p 
          className="text-lg text-white/80 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Upload a photo or use Olivia to try on trending fashion pieces from the internet.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button 
            onClick={onStartStyling}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white py-6 px-8 text-lg rounded-lg shadow-lg shadow-purple-500/20 group relative overflow-hidden"
            size="lg"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <Zap className="mr-2 h-5 w-5 text-yellow-200 animate-pulse" />
            <span>Start Styling with Olivia</span>
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="backdrop-blur-sm bg-white/5 rounded-xl p-5 border border-white/10">
          <UserCircle2 className="h-10 w-10 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your Style, Enhanced</h3>
          <p className="text-white/70 text-sm">Upload your photo and see how the latest trends look on you.</p>
        </div>
        
        <div className="backdrop-blur-sm bg-white/5 rounded-xl p-5 border border-white/10">
          <Shirt className="h-10 w-10 text-pink-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Try Before You Buy</h3>
          <p className="text-white/70 text-sm">Test any clothing item from any online store before purchasing.</p>
        </div>
        
        <div className="backdrop-blur-sm bg-white/5 rounded-xl p-5 border border-white/10">
          <Sparkles className="h-10 w-10 text-blue-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Olivia's AI Styling</h3>
          <p className="text-white/70 text-sm">Get personalized style recommendations from our AI fashion assistant.</p>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default ShopAndTryHero;
