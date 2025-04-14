
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, ImageIcon } from 'lucide-react';

const NoPhotoMessage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-xl bg-slate-900/60 border border-white/10 shadow-lg text-center mb-6"
    >
      <div className="mb-4 flex justify-center">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
          <Camera className="w-8 h-8 text-white/60" />
        </div>
      </div>
      
      <h3 className="text-lg font-medium mb-2">Select a photo to start trying on your looks</h3>
      <p className="text-white/70 mb-4">
        Upload your photo or select Olivia as a model to see how your outfits will look
      </p>
      
      <div className="flex justify-center mt-4">
        <motion.div 
          animate={{ y: [0, -6, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-purple-400"
        >
          <ImageIcon className="h-6 w-6" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NoPhotoMessage;
