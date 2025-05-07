
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Eye, Shirt, Wand } from 'lucide-react';

interface StyleItYourWayProps {
  onTryBeforeBuy: () => void;
  onAIStyling: () => void;
  onYourStyle: () => void;
}

const StyleItYourWay = ({ onTryBeforeBuy, onAIStyling, onYourStyle }: StyleItYourWayProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/50 to-slate-950/50 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Style It Your Way</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Explore your style with Olivia's help and discover new ways to express yourself
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Your Style Enhanced */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-purple-400/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            onClick={onYourStyle}
          >
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-400 flex items-center justify-center mb-6 shadow-md shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">Your Style Enhanced</h3>
            <p className="text-white/70 group-hover:text-white/90 transition-colors">Upload your photo and let Olivia help you find your perfect style.</p>
            <div className="mt-4 text-purple-300 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <span>Enhance your style</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.div>
          
          {/* Try Before You Buy */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-purple-400/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            onClick={onTryBeforeBuy}
          >
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-400 flex items-center justify-center mb-6 shadow-md shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
              <Shirt className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">Try Before You Buy</h3>
            <p className="text-white/70 group-hover:text-white/90 transition-colors">See how clothes look on you before making a purchase decision.</p>
            <div className="mt-4 text-purple-300 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <span>Try on now</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.div>
          
          {/* AI Styling */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-purple-400/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            onClick={onAIStyling}
          >
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-400 flex items-center justify-center mb-6 shadow-md shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
              <Wand className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">AI Styling</h3>
            <p className="text-white/70 group-hover:text-white/90 transition-colors">Get personalized styling advice based on your preferences.</p>
            <div className="mt-4 text-purple-300 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <span>Get AI styling</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default StyleItYourWay;
