
import React from 'react';
import { motion } from 'framer-motion';

const HeaderSection = () => {
  return (
    <div className="text-center mb-8">
      <motion.h1 
        className="text-3xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Virtual Fitting Room
      </motion.h1>
      <motion.p 
        className="text-base md:text-lg text-white/80 mx-auto max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Upload your photo and discover how outfits look on you with our virtual try-on experience.
      </motion.p>
    </div>
  );
};

export default HeaderSection;
