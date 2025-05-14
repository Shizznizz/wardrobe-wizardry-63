
import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Shirt, Sparkles, ArrowRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const VirtualTryOnSteps = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: <Upload className="h-8 w-8 text-purple-400" />,
      title: "Upload a Photo",
      description: "No good photo of yourself? No problem! Choose from Olivia's model images for the perfect virtual try-on experience."
    },
    {
      icon: <Shirt className="h-8 w-8 text-pink-400" />,
      title: "Select Your Outfit",
      description: "Choose from your digital wardrobe or trending items to see how they'll look on you instantly."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-blue-400" />,
      title: "See Magic Happen",
      description: "Olivia uses AI to show you wearing the outfit in seconds, no changing room needed!"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-blue-900/30 pointer-events-none"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300">
            How Virtual Try-On Works
          </h2>
          <div className="w-28 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full mx-auto"></div>
          <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
            Experience clothes on yourself before buying with our advanced AI technology
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div className="flex flex-col items-center">
                <div className="p-4 rounded-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 mb-6 border border-white/10 shadow-lg group-hover:shadow-purple-500/20">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-white/70">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative"
        >
          {/* Connector lines between images */}
          <div className="hidden md:block absolute top-1/2 left-1/3 w-[calc(100%/3)] h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Before Image: Olivia */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-lg overflow-hidden shadow-2xl shadow-purple-900/20 border border-white/10 relative"
            >
              <div className="absolute top-4 left-4 bg-black/40 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm z-10">
                Before
              </div>
              <AspectRatio ratio={3/4} className="bg-slate-800/60">
                <img
                  src="/lovable-uploads/0d17107f-9669-4861-9060-6dbd31ca6db2.png"
                  alt="Olivia without shirt"
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </motion.div>
            
            {/* Item Image: T-shirt */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-lg overflow-hidden shadow-2xl shadow-purple-900/20 border border-white/10 relative"
            >
              <div className="absolute top-4 left-4 bg-black/40 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm z-10">
                + This Item
              </div>
              <AspectRatio ratio={3/4} className="bg-gradient-to-b from-slate-800/60 to-purple-900/30 flex items-center justify-center p-4">
                <img
                  src="/lovable-uploads/976eb626-3977-4b64-a550-f81af9fad23b.png"
                  alt="Graphic t-shirt"
                  className="object-contain w-full h-full max-h-[80%]"
                />
              </AspectRatio>
            </motion.div>
            
            {/* After Image: Olivia wearing the t-shirt */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-lg overflow-hidden shadow-2xl shadow-purple-900/20 border border-white/10 relative"
            >
              <div className="absolute top-4 left-4 bg-black/40 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm z-10">
                After
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur opacity-60 animate-pulse"></div>
              <AspectRatio ratio={3/4} className="bg-slate-800/60 relative">
                <img
                  src="/lovable-uploads/57e50499-0c71-4a0c-9f68-5708cac95552.png"
                  alt="Olivia wearing the shirt"
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-4 right-4">
                  <div className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm animate-pulse">
                    AI Generated
                  </div>
                </div>
              </AspectRatio>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-14"
        >
          <Button 
            onClick={() => navigate('/shop-and-try')}
            className="bg-gradient-to-r from-[#EC6FF1] to-[#FF8AF0] text-white px-8 py-6 text-lg rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/20 transition-all group"
          >
            Try it Now
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualTryOnSteps;
