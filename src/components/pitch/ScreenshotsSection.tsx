
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Smartphone, Monitor, Tablet } from 'lucide-react';

const ScreenshotsSection = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 to-purple-950/30 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Style Magic in 
            <span className="bg-gradient-to-r from-coral-400 to-purple-400 bg-clip-text text-transparent">
              {" "}Action
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            See how Olivia transforms your fashion experience across all your devices.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mobile Preview */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <Smartphone className="h-12 w-12 mx-auto text-coral-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Mobile Experience</h3>
              <p className="text-white/60">Style on-the-go with our intuitive mobile interface</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 rounded-3xl p-8 border border-white/10 aspect-[3/4] shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* Preview Example Badge */}
                <div className="absolute top-4 right-4 bg-coral-500/20 text-coral-300 text-xs px-3 py-1 rounded-full border border-coral-500/30">
                  Preview Example
                </div>
                
                {/* Blurred UI Preview */}
                <div className="w-full h-full p-4 space-y-4">
                  <div className="h-8 bg-gradient-to-r from-coral-400/20 to-purple-400/20 rounded blur-sm"></div>
                  <div className="h-32 bg-gradient-to-br from-purple-400/20 to-coral-400/20 rounded-lg blur-sm"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-white/10 rounded blur-sm"></div>
                    <div className="h-4 bg-white/10 rounded blur-sm w-3/4"></div>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-coral-400/20 to-purple-400/20 rounded blur-sm"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Desktop Preview */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-6">
              <Monitor className="h-12 w-12 mx-auto text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Desktop Power</h3>
              <p className="text-white/60">Full wardrobe management and styling tools</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 rounded-3xl p-8 border border-white/10 aspect-[4/3] shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* Preview Example Badge */}
                <div className="absolute top-4 right-4 bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">
                  Preview Example
                </div>
                
                {/* Blurred UI Preview */}
                <div className="w-full h-full p-6 space-y-4">
                  <div className="h-6 bg-gradient-to-r from-purple-400/20 to-coral-400/20 rounded blur-sm"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-gradient-to-br from-coral-400/20 to-purple-400/20 rounded blur-sm"></div>
                    <div className="h-24 bg-gradient-to-br from-purple-400/20 to-coral-400/20 rounded blur-sm"></div>
                    <div className="h-24 bg-gradient-to-br from-coral-400/20 to-purple-400/20 rounded blur-sm"></div>
                  </div>
                  <div className="h-16 bg-gradient-to-r from-purple-400/20 to-coral-400/20 rounded blur-sm"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tablet Preview */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-6">
              <Tablet className="h-12 w-12 mx-auto text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Tablet Comfort</h3>
              <p className="text-white/60">Perfect for planning outfits and browsing styles</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 rounded-3xl p-8 border border-white/10 aspect-[4/3] shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* Preview Example Badge */}
                <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/30">
                  Preview Example
                </div>
                
                {/* Blurred UI Preview */}
                <div className="w-full h-full p-5 space-y-4">
                  <div className="h-6 bg-gradient-to-r from-emerald-400/20 to-coral-400/20 rounded blur-sm"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-28 bg-gradient-to-br from-coral-400/20 to-emerald-400/20 rounded blur-sm"></div>
                    <div className="h-28 bg-gradient-to-br from-emerald-400/20 to-coral-400/20 rounded blur-sm"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-white/10 rounded blur-sm"></div>
                    <div className="h-3 bg-white/10 rounded blur-sm w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default ScreenshotsSection;
