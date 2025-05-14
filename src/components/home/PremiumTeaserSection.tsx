
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const PremiumTeaserSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.button 
            onClick={() => navigate('/premium')}
            className="relative overflow-hidden group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 to-amber-500/30 animate-pulse rounded-lg"></div>
            <div className="bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-slate-900 font-semibold px-10 py-6 rounded-lg shadow-lg hover:shadow-yellow-500/40 transition-all duration-300 relative z-10 border border-yellow-300/50">
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-800" />
                <span className="text-lg">Want to discover our premium features?</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
            </div>
          </motion.button>
          
          <p className="text-white/70 mt-4 text-sm">
            Get exclusive styling perks, early access, and more
          </p>

          {/* Gold effect illustration */}
          <div className="mt-8 relative w-full max-w-xs mx-auto">
            <AspectRatio ratio={4/1} className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-40 h-40 bg-gradient-to-r from-yellow-300/40 to-amber-400/40 rounded-full blur-xl animate-pulse"></div>
                <span className="text-xs text-white/70 relative z-10">✨ Premium shine effect ✨</span>
              </div>
            </AspectRatio>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumTeaserSection;
