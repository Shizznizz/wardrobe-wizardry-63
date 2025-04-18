
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, Zap, Calendar, CloudSun, Lock } from 'lucide-react';

interface PremiumTeaserSectionProps {
  onUpgrade: () => void;
}

const PremiumTeaserSection = ({ onUpgrade }: PremiumTeaserSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-16 mt-20"
    >
      <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-pink-900/80 border border-white/10 shadow-xl shadow-purple-900/20 relative">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-pink-400/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="p-8 sm:p-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              <motion.div 
                className="h-12 w-12 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  repeatType: "loop" 
                }}
              >
                <Crown className="h-6 w-6 text-white" />
              </motion.div>
            </div>
            
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200"
            >
              Unlock Your Ultimate Wardrobe Experience
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-white/80 text-lg mb-8 max-w-2xl mx-auto"
            >
              Get exclusive access to AI outfit generators, early drops, advanced mix & match tools, and weather-based daily looks tailored just for you.
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/5 rounded-xl p-5 backdrop-blur-sm border border-white/10">
                <Sparkles className="h-8 w-8 text-pink-400 mb-3" />
                <h3 className="font-semibold text-white text-lg mb-2">AI Style Generator</h3>
                <p className="text-white/70">Unlimited AI-generated outfit suggestions based on your personal style.</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-5 backdrop-blur-sm border border-white/10">
                <CloudSun className="h-8 w-8 text-blue-400 mb-3" />
                <h3 className="font-semibold text-white text-lg mb-2">Weather Styling</h3>
                <p className="text-white/70">Daily recommendations based on local weather and your planned activities.</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-5 backdrop-blur-sm border border-white/10">
                <Calendar className="h-8 w-8 text-purple-400 mb-3" />
                <h3 className="font-semibold text-white text-lg mb-2">Outfit Calendar</h3>
                <p className="text-white/70">Plan your looks ahead of time and never repeat an outfit unintentionally.</p>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button 
                onClick={onUpgrade}
                size="lg"
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:opacity-90 text-white px-8 py-6 text-lg rounded-lg shadow-lg relative group overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Lock className="mr-2 h-5 w-5" />
                Upgrade to Premium
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumTeaserSection;
