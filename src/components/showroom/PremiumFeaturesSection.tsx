
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, UploadIcon, ShoppingBag, Heart, Unlock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface PremiumFeaturesSectionProps {
  onUpgradeToPremium: () => void;
}

const PremiumFeaturesSection = ({
  onUpgradeToPremium
}: PremiumFeaturesSectionProps) => {
  const { isAuthenticated } = useAuth();
  
  // If user is authenticated, don't show this section at all
  if (isAuthenticated) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="glass-dark border-white/10 overflow-hidden bg-gradient-to-r from-slate-900/90 to-purple-950/90">
        <CardContent className="p-4 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-yellow-500/20">
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold">Unlock Premium Features</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="glass-dark rounded-lg p-3 md:p-5 border border-white/5">
              <UploadIcon className="h-5 w-5 mb-3 text-purple-400" />
              <h3 className="text-lg font-medium mb-2">Multiple Photos</h3>
              <p className="text-white/70 text-sm">
                Upload multiple photos and try on different outfits for various occasions.
              </p>
            </div>
            <div className="glass-dark rounded-lg p-3 md:p-5 border border-white/5">
              <ShoppingBag className="h-5 w-5 mb-3 text-purple-400" />
              <h3 className="text-lg font-medium mb-2">Exclusive Collections</h3>
              <p className="text-white/70 text-sm">
                Access to premium outfit collections created by expert stylists.
              </p>
            </div>
            <div className="glass-dark rounded-lg p-3 md:p-5 border border-white/5">
              <Heart className="h-5 w-5 mb-3 text-purple-400" />
              <h3 className="text-lg font-medium mb-2">Advanced Styling</h3>
              <p className="text-white/70 text-sm">
                Resize, reposition, and customize outfits for a perfect virtual try-on.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              size="lg"
              onClick={onUpgradeToPremium}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-90 shadow-lg"
            >
              <Unlock className="mr-2 h-5 w-5" /> Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default PremiumFeaturesSection;
