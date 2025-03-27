
import { motion } from 'framer-motion';

const NewClothesHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-6 mb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:w-1/2"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          New Clothes Preview
        </h1>
        <p className="text-lg text-white/80 mb-6">
          Visualize how new items will look on you before making any purchase decisions.
        </p>
      </motion.div>
    </div>
  );
};

export default NewClothesHeader;
