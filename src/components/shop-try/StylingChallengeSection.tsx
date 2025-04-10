
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeCheck, Camera, Sparkles } from 'lucide-react';

interface StylingChallengeSectionProps {
  isPremiumUser: boolean;
  onParticipate: () => void;
  onUpgradeToPremium: () => void;
  customSlot?: React.ReactNode;
}

const StylingChallengeSection = ({
  isPremiumUser,
  onParticipate,
  onUpgradeToPremium,
  customSlot
}: StylingChallengeSectionProps) => {
  const handleParticipate = () => {
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    
    onParticipate();
  };
  
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
          Style This & Get Featured
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-white/10 backdrop-blur-lg overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-block bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full px-3 py-1 text-sm font-medium text-orange-400 mb-2">
                Weekly Challenge
              </div>
              
              <h3 className="text-2xl font-bold text-white">Create a look using any online item + Olivia</h3>
              
              <p className="text-white/70">
                Share your best style to enter the spotlight! Our favorite submissions get featured on the home page and earn exclusive style badges.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="bg-white/10 rounded-full px-3 py-1 text-sm">
                  #StyleChallenge
                </span>
                <span className="bg-white/10 rounded-full px-3 py-1 text-sm">
                  #GetFeatured
                </span>
                <span className="bg-white/10 rounded-full px-3 py-1 text-sm">
                  #OliviaStyle
                </span>
              </div>
              
              <Button 
                onClick={handleParticipate}
                className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
                size="lg"
              >
                <Camera className="mr-2 h-5 w-5" />
                Participate Now
              </Button>
              
              {customSlot && (
                <div className="mt-6">
                  {customSlot}
                </div>
              )}
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden border border-white/20">
                    <img 
                      src="https://images.unsplash.com/photo-1614251056798-0a63eda2bb25?auto=format&fit=crop&q=80&w=300&h=400" 
                      alt="Challenge submission" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="aspect-[3/4] rounded-lg overflow-hidden border border-white/20">
                    <img 
                      src="https://images.unsplash.com/photo-1611428813653-aa3d1ea2e929?auto=format&fit=crop&q=80&w=300&h=400" 
                      alt="Challenge submission" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="space-y-4 pt-8">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/20">
                    <img 
                      src="https://images.unsplash.com/photo-1617551307578-7f5160d6615a?auto=format&fit=crop&q=80&w=300&h=400" 
                      alt="Challenge submission" 
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute top-2 right-2">
                      <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full p-1 shadow-lg">
                        <BadgeCheck className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="aspect-[3/4] rounded-lg overflow-hidden border border-purple-500/30 shadow-lg shadow-purple-500/20 ring-2 ring-purple-500/50">
                    <img 
                      src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300&h=400" 
                      alt="Featured challenge submission" 
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-2 left-2 right-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 flex items-center">
                      <Sparkles className="text-yellow-300 h-4 w-4 mr-2" />
                      <span className="text-white text-xs">Featured Winner!</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {!isPremiumUser && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                  <p className="text-white font-medium text-center mb-4">Premium Feature</p>
                  <Button 
                    onClick={onUpgradeToPremium}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Unlock Premium
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StylingChallengeSection;
