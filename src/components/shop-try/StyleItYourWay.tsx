
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { User, Package, Sparkles } from 'lucide-react';

interface StyleItYourWayProps {
  onTryBeforeBuy: () => void;
  onAIStyling: () => void;
  onYourStyle: () => void;
}

const StyleItYourWay = ({ onTryBeforeBuy, onAIStyling, onYourStyle }: StyleItYourWayProps) => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-slate-950/30 to-slate-950/50 pointer-events-none"></div>
      
      <Container>
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">Style It Your Way</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Discover the perfect outfit with personalized recommendations
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <motion.div 
            className="bg-gradient-to-br from-purple-900/30 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 h-full flex flex-col glass"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.15)' }}
          >
            <div className="rounded-xl bg-gradient-to-tr from-purple-600/20 to-pink-600/20 p-3 w-14 h-14 mb-5 flex items-center justify-center">
              <User className="h-7 w-7 text-purple-400" />
            </div>
            
            <h3 className="text-xl font-bold mb-3">Your Style Enhanced</h3>
            
            <p className="text-white/70 mb-6 flex-grow">
              Let Olivia or your photo guide your wardrobe upgrades
            </p>
            
            <Button 
              variant="outline" 
              className="border-white/20 hover:bg-white/10 text-white w-full"
              onClick={onYourStyle}
            >
              Try Your Photo
            </Button>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-purple-900/30 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 h-full flex flex-col glass"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.15)' }}
          >
            <div className="rounded-xl bg-gradient-to-tr from-purple-600/20 to-pink-600/20 p-3 w-14 h-14 mb-5 flex items-center justify-center">
              <Package className="h-7 w-7 text-pink-400" />
            </div>
            
            <h3 className="text-xl font-bold mb-3">Try Before You Buy</h3>
            
            <p className="text-white/70 mb-6 flex-grow">
              See how clothes fit digitally before purchasing
            </p>
            
            <Button 
              variant="outline"
              className="border-white/20 hover:bg-white/10 text-white w-full"
              onClick={onTryBeforeBuy}
            >
              Preview Outfits
            </Button>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-purple-900/30 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 h-full flex flex-col glass"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.15)' }}
          >
            <div className="rounded-xl bg-gradient-to-tr from-purple-600/20 to-pink-600/20 p-3 w-14 h-14 mb-5 flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-blue-400" />
            </div>
            
            <h3 className="text-xl font-bold mb-3">AI Styling</h3>
            
            <p className="text-white/70 mb-6 flex-grow">
              Personalized picks for your unique taste
            </p>
            
            <Button
              variant="outline"
              className="border-white/20 hover:bg-white/10 text-white w-full"
              onClick={onAIStyling}
            >
              Get Recommendations
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default StyleItYourWay;
