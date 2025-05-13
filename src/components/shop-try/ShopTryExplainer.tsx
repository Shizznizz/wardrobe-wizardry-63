
import { motion } from 'framer-motion';
import { Upload, Search, Sparkles } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const ShopTryExplainer = () => {
  // Card data for the three-step process
  const cards = [
    {
      icon: <Upload className="h-8 w-8 text-purple-400" />,
      title: "Upload Your Photo",
      description: "Start by uploading your photo or use one of Olivia's images as a model"
    },
    {
      icon: <Search className="h-8 w-8 text-pink-400" />,
      title: "Choose an Outfit",
      description: "Browse through trendy outfits or upload your own clothing items to try on"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-blue-400" />,
      title: "See the Result",
      description: "Our AI technology shows you how the outfit would look on you"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-10 mx-auto max-w-6xl px-4 sm:px-6"
    >
      <h2 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
        How It Works
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/10"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 20px rgba(168, 85, 247, 0.15)"
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-900/30 to-pink-900/30 mb-4">
                {card.icon}
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{card.title}</h3>
              <p className="text-white/70 text-sm">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ShopTryExplainer;
