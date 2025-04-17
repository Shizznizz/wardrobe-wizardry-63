
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Check, Sparkles } from 'lucide-react';

interface PremiumFeatureSectionProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
}

const PremiumFeatureSection = ({
  isPremiumUser,
  onUpgradeToPremium
}: PremiumFeatureSectionProps) => {
  const features = [
    "Unlimited virtual try-ons",
    "Access to exclusive clothing items",
    "Save your favorite looks",
    "Personalized style recommendations",
    "Chat with AI stylist Olivia",
    "Compatible with your own wardrobe items"
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 bg-gradient-to-br from-purple-900/40 to-slate-900/40 border-purple-500/20 backdrop-blur-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Premium Features</h2>
            </div>
            
            <p className="text-white/80 mb-6">
              Unlock the full potential of virtual try-on and get personalized styling advice from Olivia.
            </p>
            
            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <div className="rounded-full bg-purple-500/20 p-1">
                    <Check className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="text-white">{feature}</span>
                </motion.li>
              ))}
            </ul>
            
            {!isPremiumUser && (
              <Button 
                onClick={onUpgradeToPremium}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-600 hover:from-yellow-500 hover:to-amber-700 text-slate-900 font-medium"
                size="lg"
              >
                <Crown className="h-5 w-5 mr-2" />
                Upgrade to Premium
              </Button>
            )}
            
            {isPremiumUser && (
              <div className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <p className="text-white font-medium">You're enjoying premium features!</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 hidden md:flex items-center justify-center p-10">
            <div className="text-center">
              <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-50"></div>
                <div className="relative bg-white/10 rounded-full p-6 backdrop-blur-sm">
                  <Crown className="h-20 w-20 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mt-6">Premium Experience</h3>
              <p className="text-white/80 mt-2">
                Unlock all features and enjoy an ad-free experience.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PremiumFeatureSection;
