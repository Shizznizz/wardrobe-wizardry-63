
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, MessageCircle, Shirt, ShoppingBag, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface PremiumExperienceProps {
  onUpgrade: () => void;
}

const PremiumExperience = ({ onUpgrade }: PremiumExperienceProps) => {
  const { isAuthenticated } = useAuth();
  
  // Don't show for authenticated users
  if (isAuthenticated) return null;

  const features = [
    {
      id: 'chat',
      icon: <MessageCircle className="h-5 w-5 text-yellow-400" />,
      title: 'Chat with Olivia',
      description: 'Get instant, personalized styling advice for any occasion'
    },
    {
      id: 'try-on',
      icon: <Shirt className="h-5 w-5 text-blue-400" />,
      title: 'Outfit Try-On',
      description: 'Visualize looks by trying them on with your photo'
    },
    {
      id: 'early-access',
      icon: <ShoppingBag className="h-5 w-5 text-purple-400" />,
      title: 'Exclusive Early Access',
      description: 'Shop new collections before they go public'
    },
    {
      id: 'personalization',
      icon: <Sparkles className="h-5 w-5 text-pink-400" />,
      title: 'AI Outfit Generator',
      description: 'Get outfits created just for you based on your style'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-lg border-t border-white/10 py-6 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="inline-flex items-center justify-center mb-4">
            <Crown className="h-6 w-6 text-yellow-400 mr-2" />
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-300">
              Unlock Your Ultimate Wardrobe Experience
            </h2>
          </div>
          <p className="text-white/80 max-w-2xl">
            Exclusive access to Olivia's AI-powered styling, outfit generators, early drops, and more. 
            Take your style to the next level with the Premium Experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm">
                  {feature.icon}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-white/70">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onUpgrade}
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-semibold shadow-lg shadow-amber-500/20 py-6 px-8"
            >
              <Crown className="mr-2 h-5 w-5" />
              Upgrade to Premium Now
            </Button>
          </motion.div>
        </div>

        <p className="text-center text-white/60 text-xs mt-4">
          Cancel anytime. Premium benefits are activated instantly upon subscription.
        </p>
      </div>
    </motion.div>
  );
};

export default PremiumExperience;
