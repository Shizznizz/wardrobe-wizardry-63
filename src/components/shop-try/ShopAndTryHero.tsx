
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Sparkles, ShoppingBag, Shirt, Wand2 } from 'lucide-react';
import OptimizedImage from '@/components/ui/optimized-image';

interface ShopAndTryHeroProps {
  onStartStyling: () => void;
}

const ShopAndTryHero = ({ onStartStyling }: ShopAndTryHeroProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 60, 
        damping: 13, 
        duration: 1.2,
        delay: 0.2
      }
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-transparent pointer-events-none"></div>
      
      <Container>
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Left side - Model Image */}
          <motion.div 
            className="w-full md:w-1/3 lg:w-2/5"
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={imageVariants}
          >
            <div className="relative">
              {/* Animated glow effect behind image */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 to-pink-500/30 rounded-2xl blur-xl"
                animate={{ 
                  opacity: [0.5, 0.7, 0.5],
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              ></motion.div>
              
              {/* Image container */}
              <div className="relative z-10 overflow-hidden rounded-2xl border-2 border-white/10 shadow-xl">
                <OptimizedImage 
                  src="/lovable-uploads/518b004e-6837-4c6f-a4cc-5186fab760e3.png" 
                  alt="Fashion model in pink top and white pants" 
                  className="w-full h-auto object-cover"
                  priority={true}
                  quality="high"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"></div>
              </div>
              
              {/* Animated sparkle icon */}
              <motion.div 
                className="absolute -top-2 -right-2 bg-pink-500 rounded-full p-1.5 shadow-lg z-20"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "loop" 
                }}
              >
                <Sparkles className="h-5 w-5 text-white" />
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right side - Content */}
          <motion.div 
            className="w-full md:w-2/3 lg:w-3/5 space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200"
              variants={itemVariants}
            >
              Shop & Try Fashion
            </motion.h1>
            
            <motion.div 
              className="max-w-2xl space-y-6"
              variants={itemVariants}
            >
              {/* Three-step guide */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-xl p-5 backdrop-blur-md border border-white/10">
                  <div className="bg-gradient-to-tr from-purple-600 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-3 shadow-md relative">
                    <Shirt className="h-6 w-6 text-white" />
                    <div className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-purple-900 font-bold shadow-md">
                      1
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Try on trending outfits</h3>
                  <p className="text-sm text-white/70 mt-1">Preview looks on your photo or use Olivia as your model</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-5 backdrop-blur-md border border-white/10">
                  <div className="bg-gradient-to-tr from-purple-600 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-3 shadow-md relative">
                    <Wand2 className="h-6 w-6 text-white" />
                    <div className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-purple-900 font-bold shadow-md">
                      2
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Combine with your wardrobe</h3>
                  <p className="text-sm text-white/70 mt-1">Mix and match with your existing pieces</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-5 backdrop-blur-md border border-white/10">
                  <div className="bg-gradient-to-tr from-purple-600 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-3 shadow-md relative">
                    <ShoppingBag className="h-6 w-6 text-white" />
                    <div className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-purple-900 font-bold shadow-md">
                      3
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Shop smartly with Olivia</h3>
                  <p className="text-sm text-white/70 mt-1">Get personalized style recommendations</p>
                </div>
              </div>
              
              <motion.div
                className="mt-8"
                variants={itemVariants}
              >
                <Button 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white font-medium px-8 py-6 rounded-lg shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 transition-all duration-300"
                  size="lg"
                  onClick={onStartStyling}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Explore Styles with Olivia
                </Button>
                <p className="text-white/70 text-sm mt-4">
                  Upload a photo or try outfits with Olivia — get inspired by trending fashion.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default ShopAndTryHero;
