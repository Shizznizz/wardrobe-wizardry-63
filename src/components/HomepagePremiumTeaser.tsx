
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle, Shirt, Crown, Clock, Wand } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const HomepagePremiumTeaser = () => {
  // Add this to check if the user is Daniel and ensure we always show premium teaser
  const { user } = useAuth();
  const isDanielDeurlooEmail = user?.email === 'danieldeurloo@hotmail.com';
  
  // Modified to explicitly show for Daniel's account
  if (user && !isDanielDeurlooEmail) return null;

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
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full p-3 backdrop-blur-sm">
              <Crown className="h-8 w-8 text-yellow-300" />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            {/* Olivia Image - Left Side */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-start mb-8 md:mb-0 relative">
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600/20 to-coral-500/20 rounded-full blur-3xl"></div>
              <motion.img 
                src="/lovable-uploads/117f17c5-142c-43a5-88dd-5fb06adbbe27.png" 
                alt="Olivia Premium" 
                className="max-h-[280px] drop-shadow-xl -scale-x-100"
                initial={{ scale: 0.95 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              />
            </div>
            
            {/* Premium Content - Right Side */}
            <div className="w-full md:w-2/3 md:pl-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center md:text-left mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Go Premium & Let Olivia Work Her Magic ✨
              </h2>
              
              <p className="text-center md:text-left text-white/80 max-w-3xl mx-auto md:mx-0 mb-8 text-lg">
                Unlock the full power of Olivia with our premium features. Get advanced styling, AI-generated outfits, and personalized fashion advice.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Outfit Try-On Feature */}
                <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-full bg-blue-500/30">
                      <Shirt className="h-6 w-6 text-blue-300" />
                    </div>
                  </div>
                  <h3 className="font-medium text-white text-center text-xl mb-2">Outfit Try-On</h3>
                  <p className="text-white/70 text-sm text-center">
                    Upload your photo and see exactly how new styles will look on your body type before buying.
                  </p>
                </div>
                
                {/* AI Outfit Generator */}
                <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-full bg-pink-500/30">
                      <Wand className="h-6 w-6 text-pink-300" />
                    </div>
                  </div>
                  <h3 className="font-medium text-white text-center text-xl mb-2">AI Outfit Generator</h3>
                  <p className="text-white/70 text-sm text-center">
                    Tell Olivia your mood, occasion, or preferences and get AI-generated outfit ideas instantly.
                  </p>
                </div>
                
                {/* Chat with Olivia */}
                <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-full bg-cyan-500/30">
                      <MessageCircle className="h-6 w-6 text-cyan-300" />
                    </div>
                  </div>
                  <h3 className="font-medium text-white text-center text-xl mb-2">Chat with Olivia</h3>
                  <p className="text-white/70 text-sm text-center">
                    Get personalized style advice and fashion recommendations tailored to your preferences.
                  </p>
                </div>
              </div>
              
              {/* Additional Row with Early Access Feature */}
              <div className="grid grid-cols-1 gap-6 mb-8 max-w-md mx-auto md:mx-0">
                <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-full bg-amber-500/30">
                      <Clock className="h-6 w-6 text-amber-300" />
                    </div>
                  </div>
                  <h3 className="font-medium text-white text-center text-xl mb-2">Exclusive Early Access</h3>
                  <div className="space-y-3">
                    <p className="text-white/70 text-sm text-center">
                      Be first to try new features and get access to exclusive collections before anyone else.
                    </p>
                    
                    {/* Added testimonial */}
                    <p className="text-white/90 text-sm italic text-center border-l-2 border-coral-400 pl-3 py-1">
                      "Since going Premium, I feel confident every morning. Olivia just gets my vibe." – Emily V.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center md:justify-start">
                <Button 
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-12 py-6 rounded-xl h-auto text-lg font-medium shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2"
                >
                  <Link to="/premium">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Upgrade to Premium – Only €2.99/week
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-center md:text-left text-white/60 mt-4">Cancel anytime. No commitment.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomepagePremiumTeaser;
