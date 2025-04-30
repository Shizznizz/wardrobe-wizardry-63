import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  MessageCircle, 
  Shirt, 
  ShoppingBag, 
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

interface PremiumExperienceProps {
  onUpgrade: () => void;
}

const PremiumExperience = ({ onUpgrade }: PremiumExperienceProps) => {
  const { isAuthenticated, user } = useAuth();
  
  // If user is authenticated but it's the test user (danieldeurloo@hotmail.com), show the non-premium experience
  const isDanielDeurlooEmail = user?.email === 'danieldeurloo@hotmail.com';
  const effectivePremiumUser = isAuthenticated && !isDanielDeurlooEmail;
  
  // If user is authenticated (and is not Daniel), show a different premium message
  if (effectivePremiumUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-lg border-t border-white/10 py-4 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="flex items-center mb-4 md:mb-0">
              <Crown className="h-5 w-5 text-yellow-400 mr-2" />
              <h2 className="text-lg font-medium text-white">
                You're enjoying Premium features!
              </h2>
            </div>
            <p className="text-white/70 text-sm">
              Thank you for being a premium member. Enjoy exclusive access to all features.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const features = [
    {
      id: 'chat',
      icon: <MessageCircle className="h-5 w-5 text-yellow-400" />,
      title: 'Chat with Olivia',
      description: 'Get instant, personalized styling advice for any occasion',
      tooltip: 'Get 24/7 access to AI-powered fashion advice'
    },
    {
      id: 'try-on',
      icon: <Shirt className="h-5 w-5 text-blue-400" />,
      title: 'Outfit Try-On',
      description: 'Visualize looks by trying them on with your photo',
      tooltip: 'See how outfits look on you before buying'
    },
    {
      id: 'early-access',
      icon: <ShoppingBag className="h-5 w-5 text-purple-400" />,
      title: 'Exclusive Early Access',
      description: 'Shop new collections before they go public',
      tooltip: 'Be the first to access new styles and collections'
    },
    {
      id: 'personalization',
      icon: <Sparkles className="h-5 w-5 text-pink-400" />,
      title: 'AI Outfit Generator',
      description: 'Get outfits created just for you based on your style',
      tooltip: 'Personalized outfit recommendations using AI'
    }
  ];

  const plans = [
    {
      id: 'weekly',
      period: 'Weekly',
      price: '€2.99',
      interval: 'week'
    },
    {
      id: 'monthly',
      period: 'Monthly',
      price: '€8.99',
      interval: 'month',
      popular: true
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-lg border-t border-white/10 py-6 px-4"
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 transition-all duration-300"
            >
              <div className="flex items-start group">
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:bg-white/15 transition-colors">
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

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.02 }}
              className={`relative p-6 rounded-xl backdrop-blur-sm border ${
                plan.popular 
                  ? 'border-yellow-400/30 bg-white/10' 
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {plan.popular && (
                <Badge 
                  variant="gradient" 
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                >
                  Best Value
                </Badge>
              )}
              <div className="text-center">
                <h3 className="text-lg font-medium text-white mb-2">{plan.period}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-white/70 ml-1">/{plan.interval}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onUpgrade}
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-semibold shadow-lg shadow-amber-500/20 py-6 px-8 border border-yellow-300/20"
            >
              <Crown className="mr-2 h-5 w-5" />
              Upgrade to Premium Now
            </Button>
          </motion.div>

          <Link 
            to="/premium" 
            className="group inline-flex items-center text-sm text-white/60 hover:text-white/80 transition-colors"
          >
            <Info className="h-4 w-4 mr-1" />
            Learn more about Premium features
          </Link>

          <p className="text-center text-white/60 text-xs mt-2">
            Cancel anytime. Premium benefits are activated instantly upon subscription.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumExperience;
