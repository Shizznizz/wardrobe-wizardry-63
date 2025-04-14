
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shirt, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

const NoOutfitsMessage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-xl bg-gradient-to-br from-slate-900/80 to-purple-900/40 border border-white/10 shadow-lg text-center max-w-md mx-auto"
    >
      <div className="mb-4 flex justify-center">
        <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center">
          <Shirt className="w-8 h-8 text-purple-300" />
        </div>
      </div>
      
      <h3 className="text-lg font-medium mb-2">You haven't created any outfits yet</h3>
      <p className="text-white/70 mb-6">
        Head to Mix & Match to create stylish outfits from your wardrobe items
      </p>
      
      <Link to="/mix-and-match">
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 group">
          <Pencil className="mr-2 h-4 w-4 group-hover:animate-bounce" />
          Create Your First Outfit
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </motion.div>
  );
};

export default NoOutfitsMessage;
