
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lightbulb, Sparkles, BookHeart, Flame } from 'lucide-react';
import OliviaMoodAvatar from './OliviaMoodAvatar';

interface StyleFeedbackSectionProps {
  stylingTip: string;
  isPremiumUser: boolean;
  onSuggestSimilar: () => void;
  onSaveLook: () => void;
  onShowStylingOptions: () => void;
  onUpgradeToPremium: () => void;
}

const StyleFeedbackSection = ({
  stylingTip,
  isPremiumUser,
  onSuggestSimilar,
  onSaveLook,
  onShowStylingOptions,
  onUpgradeToPremium
}: StyleFeedbackSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-950/90 p-6 backdrop-blur-lg">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <OliviaMoodAvatar mood="happy" size="md" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-medium text-white mb-2">Olivia's Styling Take</h3>
            <p className="text-white/80 mb-4">{stylingTip}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                onClick={onSuggestSimilar}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:opacity-90"
                disabled={!isPremiumUser}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Similar Items
              </Button>
              
              <Button 
                onClick={onSaveLook}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                disabled={!isPremiumUser}
              >
                <BookHeart className="h-4 w-4 mr-2" />
                Save This Look
              </Button>
              
              <Button 
                onClick={onShowStylingOptions}
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90"
                disabled={!isPremiumUser}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Styling Options
              </Button>
              
              {!isPremiumUser && (
                <Button 
                  onClick={onUpgradeToPremium}
                  className="bg-gradient-to-r from-red-600 to-pink-600 text-white hover:opacity-90"
                >
                  <Flame className="h-4 w-4 mr-2" />
                  Unlock All Features
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StyleFeedbackSection;
