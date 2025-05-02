
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface FinalCtaProps {
  onGetStarted: () => void;
}

const FinalCta: React.FC<FinalCtaProps> = ({ onGetStarted }) => {
  return (
    <motion.section
      className="py-20 px-4 bg-gradient-to-r from-coral-500/20 to-purple-500/20 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.7 }}
    >
      <div className="container mx-auto max-w-5xl relative">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-2/3 text-center md:text-left md:pr-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
              Ready to Transform Your Style Experience?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto md:mx-0">
              Join Olivia today and discover the perfect outfits that match your style, body type, and lifestyle.
            </p>
            <Button 
              className="bg-gradient-to-r from-[#ff4ecb] to-[#a97eff] text-white hover:scale-[1.03] transition-transform font-bold py-6 px-10 rounded-xl shadow-lg shadow-purple-900/20 h-auto text-lg flex items-center gap-2 mx-auto md:mx-0"
              onClick={onGetStarted}
            >
              <Sparkles className="h-5 w-5" />
              Get Started For Free
            </Button>
            <p className="text-white/60 mt-4">No credit card required. Join 10,000+ happy users.</p>
          </div>
          
          {/* Olivia head with speech bubble */}
          <motion.div 
            className="w-full md:w-1/3 mt-8 md:mt-0 flex justify-center md:justify-end relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute -left-40 top-0 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10 speech-bubble-left max-w-[200px]">
                <p className="text-white/90">You're just 60 seconds away from effortless style!</p>
              </div>
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-coral-500/30 shadow-lg shadow-purple-500/20">
                <img 
                  src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" 
                  alt="Olivia" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default FinalCta;
