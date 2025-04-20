
import React from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';

const Premium = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pt-20 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-pink-400">
            Premium Features
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Upgrade your styling experience with Olivia's premium features
          </p>
        </motion.div>
        
        <div className="p-8 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10">
          <p className="text-white/70 text-center">
            Premium features content will be available soon.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Premium;
