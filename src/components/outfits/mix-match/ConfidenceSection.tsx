
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from '@/components/ui/optimized-image';

const ConfidenceSection = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Either scroll to top or navigate to My Wardrobe
    navigate('/my-wardrobe');
  };

  return (
    <section className="py-16 relative bg-purple-950/80">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/60 to-slate-950/80"></div>
      
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Feel Like Your Most Confident Self
            </h2>
            
            <p className="text-lg mb-6 text-pink-100">
              Every great outfit starts with confidence.
              <br />
              Let Olivia guide you to looks that turn heads and make you feel unstoppable.
              <br />
              You've mixed, matched, and created—now own your style with pride. 💜
            </p>
            
            <Button 
              onClick={handleClick}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/20"
              size="lg"
            >
              ✨ Save Your Favorite Looks
            </Button>
          </motion.div>
          
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 flex justify-center md:justify-end"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl bg-pink-400/20 animate-pulse"></div>
              <OptimizedImage
                src="/lovable-uploads/f67b9529-841a-4e17-aa1e-8cbc29cd26c0.png"
                alt="Olivia looking confident"
                className="max-h-[500px] w-auto relative z-10"
                objectFit="contain"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default ConfidenceSection;
