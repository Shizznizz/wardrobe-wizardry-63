
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomepagePremiumTeaser = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
      className="max-w-6xl mx-auto my-20 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-3xl transform -rotate-1 blur-xl"></div>
      
      <div className="glass-dark rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full p-3 backdrop-blur-sm">
              <Sparkles className="h-8 w-8 text-purple-300" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Elevate Your Style Journey with Premium
          </h2>
          
          <p className="text-center text-white/80 max-w-3xl mx-auto mb-8 text-lg">
            Unlock advanced styling features, unlimited virtual try-ons, exclusive collections, and personalized recommendations from Olivia.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30">
                  <Zap className="h-5 w-5 text-pink-300" />
                </div>
                <h3 className="font-medium text-white">Pro Styling AI</h3>
              </div>
              <p className="text-white/70 text-sm">Enhanced AI styling with deeper understanding of your preferences and body type.</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-blue-600/30 to-cyan-600/30">
                  <Star className="h-5 w-5 text-blue-300" />
                </div>
                <h3 className="font-medium text-white">Unlimited Try-Ons</h3>
              </div>
              <p className="text-white/70 text-sm">Try on unlimited outfits with our advanced virtual fitting room technology.</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-green-600/30 to-emerald-600/30">
                  <MessageCircle className="h-5 w-5 text-green-300" />
                </div>
                <h3 className="font-medium text-white">24/7 Style Advice</h3>
              </div>
              <p className="text-white/70 text-sm">Unlimited conversations with Olivia for advice on any style situation.</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-10 py-6 rounded-xl h-auto text-lg font-medium shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
            >
              <Link to="/premium">
                <Sparkles className="mr-2 h-5 w-5" />
                Explore Premium
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomepagePremiumTeaser;
