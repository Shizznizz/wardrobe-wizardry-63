
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Shirt, ArrowRight } from 'lucide-react';
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
      className="relative"
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Olivia's Styling Tips
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      {isPremiumUser ? (
        <Card className="border-0 shadow-soft bg-gradient-to-r from-purple-900/30 to-slate-900/40 border border-purple-500/20 backdrop-blur-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <OliviaMoodAvatar mood="happy" size="md" />
              
              <div className="flex-1">
                <div className="relative bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 mb-4 before:content-[''] before:absolute before:top-5 before:-left-3 before:border-8 before:border-transparent before:border-r-slate-800/70">
                  <p className="text-white/90">{stylingTip}</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={onSuggestSimilar}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90"
                    size="sm"
                  >
                    <Shirt className="h-4 w-4 mr-2" />
                    Try Similar Look
                  </Button>
                  
                  <Button 
                    onClick={onSaveLook}
                    variant="outline" 
                    className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10 hover:text-pink-200"
                    size="sm"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Save to My Wardrobe
                  </Button>
                  
                  <Button 
                    onClick={onShowStylingOptions}
                    variant="outline" 
                    className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:text-blue-200"
                    size="sm"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    See Styling Options
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="relative border-0 shadow-soft bg-gradient-to-r from-purple-900/20 to-slate-900/30 border border-purple-500/10 backdrop-blur-lg overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-sm bg-slate-900/60 z-10 flex flex-col items-center justify-center">
            <p className="text-white/90 mb-3 px-8 text-center">Unlock Olivia's styling tips and personalized suggestions</p>
            <Button 
              onClick={onUpgradeToPremium} 
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Upgrade to Premium
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <CardContent className="p-6 filter blur-[2px]">
            <div className="flex items-start gap-4">
              <OliviaMoodAvatar mood="happy" size="md" />
              
              <div className="flex-1">
                <div className="relative bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 mb-4 before:content-[''] before:absolute before:top-5 before:-left-3 before:border-8 before:border-transparent before:border-r-slate-800/70">
                  <p className="text-white/90">{stylingTip}</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90"
                    size="sm"
                    disabled
                  >
                    <Shirt className="h-4 w-4 mr-2" />
                    Try Similar Look
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10 hover:text-pink-200"
                    size="sm"
                    disabled
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Save to My Wardrobe
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:text-blue-200"
                    size="sm"
                    disabled
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    See Styling Options
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default StyleFeedbackSection;
