
import { motion } from 'framer-motion';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OutfitHeroProps {
  onCreateOutfit: () => void;
}

const OutfitHero = ({ onCreateOutfit }: OutfitHeroProps) => {
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
      <div className="flex flex-wrap gap-4">
        <motion.div
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          className="w-full sm:w-auto"
        >
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 w-full sm:w-auto shadow-lg"
            onClick={onCreateOutfit}
          >
            <Plus className="mr-2 h-5 w-5" /> Create New Outfit
          </Button>
        </motion.div>
        <motion.div
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          className="w-full sm:w-auto"
        >
          <Button 
            size="lg" 
            variant="outline" 
            className="border-purple-400/30 text-white hover:bg-white/10 w-full sm:w-auto shadow-md backdrop-blur-sm"
          >
            <Filter className="mr-2 h-5 w-5" /> Filter Options
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OutfitHero;
