
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NoOutfitsMessage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-xl bg-slate-900/60 border border-white/10 shadow-lg text-center max-w-md mx-auto"
    >
      <h3 className="text-lg font-medium mb-2">You haven't created any outfits yet</h3>
      <p className="text-white/70 mb-4">
        Head to Mix & Match to create outfits from your wardrobe items
      </p>
      
      <Link to="/mix-and-match">
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          Create Your First Outfit
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </motion.div>
  );
};

export default NoOutfitsMessage;
