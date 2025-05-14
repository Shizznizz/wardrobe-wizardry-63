
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const OliviasWeeklyTip = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold inline-flex items-center justify-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              Olivia's Weekly Tip <Sparkles className="ml-2 h-5 w-5 text-yellow-400" />
            </h2>
          </div>
          
          <div className="relative">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-xl rounded-xl"></div>
            
            {/* Message card */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl p-6 relative">
              {/* Triangle pointer */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white/5 border-t border-l border-white/20 rotate-45"></div>
              
              {/* Avatar */}
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-purple-500/30 mr-3 flex-shrink-0">
                  <img 
                    src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" 
                    alt="Olivia"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Olivia</h4>
                  <p className="text-sm text-white/70">Your AI Stylist</p>
                </div>
              </div>
              
              {/* Message */}
              <p className="text-white leading-relaxed text-lg">
                Hey love, did you know wearing soft neutrals on a sunny day makes you glow naturally? Try it with gold jewelry this week. You've got this. <span className="text-yellow-300">💛</span>
              </p>
              
              {/* Timestamp */}
              <p className="text-right text-xs text-white/50 mt-4">
                Updated weekly
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OliviasWeeklyTip;
