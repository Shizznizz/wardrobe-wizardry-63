
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Trophy, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StylingChallengeSectionProps {
  isPremiumUser: boolean;
  onParticipate: () => void;
  onUpgradeToPremium: () => void;
}

const StylingChallengeSection = ({
  isPremiumUser,
  onParticipate,
  onUpgradeToPremium
}: StylingChallengeSectionProps) => {
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
      
      <Card className="border-0 shadow-soft bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 backdrop-blur-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Weekly Challenge</h3>
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 border-none">New</Badge>
                </div>
                
                <p className="text-white/80 mb-4">
                  Create a look using any online item + Olivia or your own photo. Share your best style to enter the spotlight!
                </p>
                
                {isPremiumUser ? (
                  <Button
                    onClick={onParticipate}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                  >
                    <Trophy className="h-4 w-4 mr-2 text-yellow-300" />
                    Participate Now
                  </Button>
                ) : (
                  <Button
                    onClick={onUpgradeToPremium}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Unlock Premium to Participate
                  </Button>
                )}
                
                <div className="mt-4 text-sm text-white/60">
                  <p>This week's theme: Summer Festival Vibes</p>
                  <p>Ends in: 3 days, 12 hours</p>
                </div>
              </motion.div>
            </div>
            
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div 
                      key={i} 
                      className="aspect-square bg-slate-800/60 rounded-md overflow-hidden relative"
                    >
                      {i === 1 && (
                        <div className="absolute top-1 right-1 z-10">
                          <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-none text-xs px-1.5 py-0.5">
                            Featured
                          </Badge>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MessageSquare className="h-8 w-8 text-white/20" />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 p-2 bg-slate-900/60 rounded-md text-center">
                  <p className="text-white/80 text-sm">
                    Get featured in our community gallery
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    Top styles will be highlighted each week
                  </p>
                </div>
                
                {!isPremiumUser && (
                  <div className="absolute inset-0 backdrop-blur-sm bg-slate-900/60 rounded-md flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-purple-400 mb-2" />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StylingChallengeSection;
