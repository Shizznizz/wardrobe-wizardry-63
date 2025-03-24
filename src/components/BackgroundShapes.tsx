
import { motion } from 'framer-motion';

const BackgroundShapes = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Top left blob */}
      <motion.div 
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[100px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Bottom right blob */}
      <motion.div 
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[80px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Middle blob */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-pink-500/5 blur-[120px]"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </div>
  );
};

export default BackgroundShapes;
