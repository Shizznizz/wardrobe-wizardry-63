
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PitchHeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-slate-950/30 to-slate-950/50 pointer-events-none"></div>
      
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <motion.div 
                className="flex items-center space-x-2 text-coral-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium tracking-wider uppercase">AI-Powered Fashion</span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Meet Your Personal{' '}
                <span className="bg-gradient-to-r from-coral-400 to-purple-400 bg-clip-text text-transparent">
                  AI Stylist
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl lg:text-2xl text-white/80 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Olivia curates daily outfits that match your vibe, your wardrobe and the weather.
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-coral-500 to-coral-400 hover:from-coral-400 hover:to-coral-300 text-white shadow-lg hover:shadow-coral transition-all duration-300 text-lg px-8 py-4 rounded-full"
                onClick={() => navigate('/')}
              >
                Start Styling Now
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-coral-400/50 hover:bg-coral-500/10 hover:border-coral-400 text-coral-100 text-lg px-8 py-4 rounded-lg transition-all duration-300"
                onClick={() => navigate('/find-your-style')}
              >
                Explore My Style
              </Button>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4 text-sm text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-coral-400 text-coral-400" />
                ))}
              </div>
              <span>⭐ Loved by 50,000+ style-forward users</span>
            </motion.div>
          </motion.div>
          
          {/* Right Content - Olivia Image with Sparkles */}
          <motion.div 
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-coral-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
              
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border border-coral-400/20 animate-pulse"></div>
              <div className="absolute inset-4 rounded-full border border-purple-400/10"></div>
              
              {/* Animated sparkles */}
              <motion.div 
                className="absolute top-8 right-8 text-coral-400"
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>
              
              <motion.div 
                className="absolute top-20 left-4 text-purple-400"
                animate={{ 
                  y: [10, -15, 10],
                  rotate: [360, 180, 0],
                  scale: [0.8, 1.1, 0.8]
                }}
                transition={{ 
                  duration: 3.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
              
              <motion.div 
                className="absolute bottom-16 right-2 text-coral-300"
                animate={{ 
                  y: [5, -8, 5],
                  rotate: [0, 270, 360],
                  scale: [1.1, 0.9, 1.1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
              
              <motion.div 
                className="absolute bottom-8 left-8 text-purple-300"
                animate={{ 
                  y: [-5, 12, -5],
                  rotate: [180, 45, 180],
                  scale: [0.9, 1.3, 0.9]
                }}
                transition={{ 
                  duration: 4.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1.5
                }}
              >
                <Sparkles className="h-3 w-3" />
              </motion.div>
              
              {/* Olivia Image */}
              <img 
                src="/lovable-uploads/34e8d801-61ee-4254-a7ce-39b52a3a7e65.png" 
                alt="Olivia - Your AI Fashion Assistant"
                className="relative z-10 max-h-[400px] lg:max-h-[500px] w-auto object-contain animate-float drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default PitchHeroSection;
