
import { motion } from 'framer-motion';

const OutfitHero = () => {
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:w-1/2"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
        Your Perfect Outfits
      </h1>
      <p className="text-lg text-white/80 mb-6">
        Discover AI-powered outfit combinations based on your style, occasion, and the weather.
      </p>
    </motion.div>
  );
};

export default OutfitHero;
