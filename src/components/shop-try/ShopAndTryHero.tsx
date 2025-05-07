
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Sparkles, ShoppingBag, Shirt, Wand2 } from 'lucide-react';

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

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-transparent pointer-events-none"></div>
      
      <Container>
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Left side - Olivia Avatar */}
          <motion.div 
            className="w-full md:w-1/3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="rounded-full bg-gradient-to-tr from-purple-600 to-pink-400 p-1.5 shadow-lg shadow-purple-600/30">
                <img 
                  src="/lovable-uploads/c937b60e-901e-48ae-b01d-28d901a11503.png" 
                  alt="Olivia" 
                  className="rounded-full w-full aspect-square object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-tr from-pink-500 to-pink-400 rounded-full p-1.5 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
          
          {/* Right side - Content */}
          <motion.div 
            className="w-full md:w-2/3 space-y-6"
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
                  <div className="bg-gradient-to-tr from-purple-600 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-3 shadow-md">
                    <Shirt className="h-6 w-6 text-white" />
                    <div className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-purple-900 font-bold shadow-md">
                      1
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Try on trending outfits</h3>
                  <p className="text-sm text-white/70 mt-1">Preview looks on your photo or use Olivia as your model</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-5 backdrop-blur-md border border-white/10">
                  <div className="bg-gradient-to-tr from-purple-600 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-3 shadow-md">
                    <Wand2 className="h-6 w-6 text-white" />
                    <div className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-purple-900 font-bold shadow-md">
                      2
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Combine with your wardrobe</h3>
                  <p className="text-sm text-white/70 mt-1">Mix and match with your existing pieces</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-5 backdrop-blur-md border border-white/10">
                  <div className="bg-gradient-to-tr from-purple-600 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-3 shadow-md">
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
                  Start Styling with Olivia
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default ShopAndTryHero;
