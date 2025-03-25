
import { motion } from 'framer-motion';
import { CloudSun } from 'lucide-react';

const WeatherLoading = () => {
  return (
    <div className="bg-gradient-to-br from-purple-500/60 to-indigo-600/60 rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex flex-col items-center justify-center space-y-4">
        <motion.div 
          animate={{ 
            rotate: 360,
            transition: { duration: 8, repeat: Infinity, ease: "linear" } 
          }}
          className="text-white/70"
        >
          <CloudSun size={50} strokeWidth={1.5} />
        </motion.div>
        
        <div className="space-y-2 w-full">
          <motion.div 
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-5 bg-white/20 rounded-md w-3/4 mx-auto" 
          />
          
          <motion.div 
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="h-8 bg-white/30 rounded-md w-1/2 mx-auto mt-2" 
          />
          
          <div className="flex justify-center gap-4 mt-4">
            <motion.div 
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              className="h-3 bg-white/20 rounded-md w-20" 
            />
            <motion.div 
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
              className="h-3 bg-white/20 rounded-md w-16" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherLoading;
