
import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Shirt, Sparkles, ArrowRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const VirtualTryOnSteps = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Card data with step details and corresponding images
  const stepCards = [
    {
      number: "1",
      icon: <Upload className="h-8 w-8 text-purple-400" />,
      title: "Upload a Photo",
      description: "No good photo of yourself? No problem! Choose from Olivia's model images for the perfect virtual try-on experience.",
      beforeImage: "/lovable-uploads/0d17107f-9669-4861-9060-6dbd31ca6db2.png",
      beforeLabel: "You"
    },
    {
      number: "2",
      icon: <Shirt className="h-8 w-8 text-pink-400" />,
      title: "Select Your Outfit",
      description: "Choose from your digital wardrobe or trending items to see how they'll look on you instantly.",
      beforeImage: "/lovable-uploads/976eb626-3977-4b64-a550-f81af9fad23b.png",
      beforeLabel: "Item"
    },
    {
      number: "3",
      icon: <Sparkles className="h-8 w-8 text-blue-400" />,
      title: "See Magic Happen",
      description: "Olivia uses AI to show you wearing the outfit in seconds, no changing room needed!",
      beforeImage: "/lovable-uploads/57e50499-0c71-4a0c-9f68-5708cac95552.png",
      beforeLabel: "Result",
      hasAiBadge: true
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#1b013c]">
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
        
        {/* Step Cards */}
        <div className="space-y-12 md:space-y-16">
          {stepCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`rounded-xl overflow-hidden shadow-lg bg-[#1b013c]/70 backdrop-blur-sm border border-white/5
                          ${index % 2 !== 0 && !isMobile ? 'md:flex-row-reverse' : ''}`}
            >
              <div className={`flex flex-col ${!isMobile ? 'md:flex-row' : ''}`}>
                {/* Image Side */}
                <div className={`${!isMobile ? 'md:w-1/2' : 'w-full'} relative`}>
                  <AspectRatio ratio={isMobile ? 16/9 : 4/3} className="bg-purple-900/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-blue-900/40"></div>
                    <img
                      src={card.beforeImage}
                      alt={`Step ${index + 1}: ${card.title}`}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                      {card.beforeLabel}
                    </div>
                    {card.hasAiBadge && (
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm animate-pulse">
                          AI Generated
                        </div>
                      </div>
                    )}
                  </AspectRatio>
                </div>
                
                {/* Content Side */}
                <div className={`${!isMobile ? 'md:w-1/2' : 'w-full'} p-6 md:p-8 flex flex-col justify-center`}>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 mr-4 border border-white/10">
                      <span className="text-xl font-bold text-white">{card.number}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                  </div>
                  
                  <p className="text-white/80 mb-6">{card.description}</p>
                  
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-gradient-to-br from-purple-900/40 to-indigo-900/40 mr-3">
                      {card.icon}
                    </div>
                    <div className="h-0.5 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-transparent flex-grow"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
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
