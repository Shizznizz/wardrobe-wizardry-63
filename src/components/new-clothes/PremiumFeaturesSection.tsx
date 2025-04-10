
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Image, ShoppingBag, Sparkles, Unlock, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface PremiumFeaturesSectionProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
}

const PremiumFeaturesSection = ({ 
  isPremiumUser, 
  onUpgradeToPremium 
}: PremiumFeaturesSectionProps) => {
  const { isAuthenticated } = useAuth();
  
  // If user is authenticated, don't show this section at all
  if (isAuthenticated || isPremiumUser) return null;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.div 
      variants={itemVariants} 
      className="mt-16 bg-slate-900/40 border border-white/10 rounded-xl p-8 backdrop-blur-lg"
    >
      <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 flex items-center">
        <Star className="mr-2 h-6 w-6 text-yellow-400" />
        Unlock Premium Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-400/20">
            <Image className="h-6 w-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-medium text-blue-200">Multiple Photos</h3>
          <p className="text-blue-100/80">
            Upload and try on outfits for multiple photos and occasions. See how different clothing looks in various settings.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-400/20">
            <ShoppingBag className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-medium text-purple-200">Exclusive Collections</h3>
          <p className="text-purple-100/80">
            Access premium outfit collections curated by expert stylists, featuring the latest trends and timeless classics.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-400/20">
            <Sparkles className="h-6 w-6 text-pink-400" />
          </div>
          <h3 className="text-xl font-medium text-pink-200">Advanced Styling</h3>
          <p className="text-pink-100/80">
            Customize outfits with detailed editing tools. Resize, reposition, and adjust colors for a perfect virtual try-on.
          </p>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
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
            <Unlock className="mr-2 h-5 w-5" /> Upgrade to Premium
          </Button>
          <div className="absolute inset-0 bg-white/20 blur-lg rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-300 animate-pulse"></div>
        </motion.div>
      </div>
      <p className="text-center text-white/70 mt-4 max-w-md mx-auto">
        Unlock advanced styling and multiple photos with Premium!
      </p>
    </motion.div>
  );
};

export default PremiumFeaturesSection;
