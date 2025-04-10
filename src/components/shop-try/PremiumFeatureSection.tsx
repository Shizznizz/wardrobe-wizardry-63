
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image, MessageCircle, ShoppingBag, Diamond, Unlock } from 'lucide-react';
import { toast } from 'sonner';

interface PremiumFeatureSectionProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
}

const PremiumFeatureSection = ({
  isPremiumUser,
  onUpgradeToPremium
}: PremiumFeatureSectionProps) => {
  const features = [
    {
      icon: <Image className="h-6 w-6 text-purple-400" />,
      title: "Multiple Photo Uploads",
      description: "Try on outfits in different poses or for various events"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-purple-400" />,
      title: "AI Outfit Feedback",
      description: "Olivia will give personalized suggestions for your style"
    },
    {
      icon: <ShoppingBag className="h-6 w-6 text-purple-400" />,
      title: "Premium Closet Access",
      description: "Access curated collections and trending fashion pieces"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <Card className="glass-dark border-white/10 overflow-hidden bg-gradient-to-r from-slate-900/90 to-purple-950/90">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/30 to-purple-500/10 border border-purple-400/20">
              <Diamond className="h-7 w-7 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Unlock Olivia's VIP Closet 💎</h2>
              <p className="text-white/70 mt-1">Elevate your style with premium features</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="glass-dark rounded-lg p-5 border border-white/5 relative overflow-hidden group"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                
                <div className="h-12 w-12 mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-400/20 flex items-center justify-center">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-medium mb-2 text-white">{feature.title}</h3>
                
                <p className="text-white/70 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative group"
            >
              <Button 
                size="lg"
                onClick={onUpgradeToPremium}
                className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-90 shadow-lg h-14 px-8 text-lg relative z-10 transition-all duration-300 hover:shadow-amber-500/30 hover:shadow-xl"
              >
                <Unlock className="mr-2 h-5 w-5" /> Upgrade to Premium – Only $2.99/week
              </Button>
              <div className="absolute inset-0 bg-white/20 blur-lg rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-300 animate-pulse"></div>
            </motion.div>
          </div>
          
          <p className="text-center text-white/50 mt-4 text-sm">
            Cancel anytime. No commitment required.
          </p>
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default PremiumFeatureSection;
