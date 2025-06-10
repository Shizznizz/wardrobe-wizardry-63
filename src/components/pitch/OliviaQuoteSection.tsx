
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Sparkles } from 'lucide-react';

const OliviaQuoteSection = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 to-purple-950/40 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Olivia's Image */}
            <motion.div 
              className="flex justify-center lg:justify-start"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-coral-500/20 via-purple-500/20 to-coral-500/20 blur-2xl rounded-full"></div>
                
                {/* Decorative elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 text-coral-400"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-8 w-8" />
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-4 -left-4 text-purple-400"
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-6 w-6" />
                </motion.div>
                
                {/* Olivia Image */}
                <img 
                  src="/lovable-uploads/34e8d801-61ee-4254-a7ce-39b52a3a7e65.png" 
                  alt="Olivia Bloom"
                  className="relative z-10 max-h-[300px] w-auto object-contain animate-float drop-shadow-2xl"
                />
              </div>
            </motion.div>
            
            {/* Quote Content - Digital Postcard Style */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="space-y-4">
                <h3 className="text-sm font-medium tracking-wider uppercase text-coral-400">
                  A Message from Olivia
                </h3>
                
                {/* Postcard-style quote box */}
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/20 relative shadow-2xl">
                  {/* Floating sparkle near quote */}
                  <motion.div 
                    className="absolute -top-3 -right-3 text-coral-400"
                    animate={{ 
                      y: [-5, 5, -5],
                      rotate: [0, 180, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </motion.div>
                  
                  <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed mb-6">
                    "Fashion isn't about perfection — it's about{' '}
                    <span className="bg-gradient-to-r from-coral-400 to-purple-400 bg-clip-text text-transparent">
                      feeling perfectly you
                    </span>
                    . I'm here to help you discover that confidence, one outfit at a time."
                  </blockquote>
                  
                  <div className="flex items-center space-x-3 text-white/60">
                    <div className="w-12 h-0.5 bg-coral-400"></div>
                    <span className="font-medium">Olivia Bloom, Your AI Style Companion</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <p className="text-white/80 leading-relaxed">
                  I've analyzed millions of style combinations, weather patterns, and fashion trends 
                  to become your personal styling assistant. My goal? To make you feel amazing 
                  in whatever you wear, whenever you wear it.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default OliviaQuoteSection;
