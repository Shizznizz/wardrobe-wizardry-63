
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import StyleSituation from '@/components/StyleSituation';

const MixAndMatch = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-24 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-pink-400">
            Style Mixer
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Tell Olivia about your plans, and she'll craft the perfect outfit suggestion for your day.
          </p>
        </motion.div>
        
        <div className="flex justify-center items-center mb-12">
          <StyleSituation />
        </div>
      </main>
    </div>
  );
};

export default MixAndMatch;
