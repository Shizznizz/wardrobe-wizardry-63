
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, Clock, CloudLightning } from 'lucide-react';

interface PremiumTeaserSectionProps {
  onUpgrade: () => void;
}

const PremiumTeaserSection = ({ onUpgrade }: PremiumTeaserSectionProps) => {
  const features = [
    {
      id: 'ai-styling',
      icon: <Sparkles className="h-5 w-5 text-yellow-400" />,
      title: 'AI Outfit Generator',
      description: 'Get personalized outfits created just for you based on your style preferences.',
    },
    {
      id: 'early-access',
      icon: <Clock className="h-5 w-5 text-blue-400" />,
      title: 'Early Drops Access',
      description: 'Be the first to shop and try on new collections before they go public.',
    },
    {
      id: 'advanced-tools',
      icon: <Sparkles className="h-5 w-5 text-purple-400" />,
      title: 'Advanced Mix & Match',
      description: 'Experiment with unlimited combinations of tops, bottoms, and accessories.',
    },
    {
      id: 'weather-looks',
      icon: <CloudLightning className="h-5 w-5 text-green-400" />,
      title: 'Weather-Based Looks',
      description: 'Automatically receive outfit suggestions tailored to the daily forecast.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-16 rounded-xl overflow-hidden"
    >
      <div className="relative">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-800/80 via-indigo-700/80 to-violet-900/80 z-0"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=2000&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'overlay',
            opacity: 0.2
          }}
        ></div>
        
        <div className="bg-gradient-to-br from-purple-800/80 via-indigo-700/80 to-violet-900/80 relative z-10 px-6 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-6 p-2 rounded-full bg-white/10 backdrop-blur-sm">
              <Crown className="h-5 w-5 text-yellow-300 mr-2" />
              <span className="text-sm font-medium text-white">Premium Experience</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Unlock Your Ultimate Wardrobe Experience
            </h2>
            
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Get exclusive access to AI outfit generators, early drops, advanced mix & match tools, and 
              weather-based daily looks tailored just for you.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto">
              {features.map((feature) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * features.indexOf(feature), duration: 0.4 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                >
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mb-3 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium text-white text-center mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/80 text-center">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            <Button
              size="lg"
              onClick={onUpgrade}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-medium shadow-xl shadow-amber-900/20 py-6 px-8"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
            
            <p className="text-xs text-white/60 mt-4">
              Cancel anytime. Premium benefits are activated instantly upon subscription.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumTeaserSection;
