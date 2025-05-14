
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const OliviasLookOfTheWeek = () => {
  const navigate = useNavigate();
  
  // Example outfit items
  const outfitItems = [
    {
      name: "Ribbed Crop Top",
      image: "/lovable-uploads/1d4e81c7-dcef-4208-ba9f-77c0544f9e12.png",
      price: "$35",
    },
    {
      name: "Relaxed Jeans",
      image: "/lovable-uploads/44448809-be5b-44da-a910-3f9b0e36264b.png",
      price: "$59",
    },
    {
      name: "Pearl Necklace",
      image: "/lovable-uploads/363e61f4-22b2-4830-be21-23a0c9266ce5.png",
      price: "$29",
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Get Olivia's Look
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Olivia Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl rounded-lg"></div>
            <div className="relative overflow-hidden rounded-lg bg-slate-800/60">
              <AspectRatio ratio={3/4}>
                <img 
                  src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" 
                  alt="Olivia's Look of the Week" 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          </motion.div>
          
          {/* Outfit Items */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-white mb-6">
              This Week's Featured Pieces
            </h3>
            
            <div className="space-y-4">
              {outfitItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 flex items-center gap-4 cursor-pointer hover:border-purple-500/30 transition-all"
                  onClick={() => navigate('/shop-and-try')}
                >
                  <div className="h-16 w-16 bg-slate-800/40 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-white font-medium">{item.name}</h4>
                    <p className="text-white/70">{item.price}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-white/50" />
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <Button 
                onClick={() => navigate('/shop-and-try')}
                className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white"
              >
                Explore More Looks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OliviasLookOfTheWeek;
