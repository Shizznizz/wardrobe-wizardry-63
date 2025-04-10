
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Award, Camera, LockKeyhole } from 'lucide-react';

interface StylingChallengeSectionProps {
  effectivePremiumUser: boolean;
  onShowPremiumPopup: () => void;
}

const StylingChallengeSection = ({ 
  effectivePremiumUser, 
  onShowPremiumPopup 
}: StylingChallengeSectionProps) => {
  const handleParticipate = () => {
    if (!effectivePremiumUser) {
      onShowPremiumPopup();
      return;
    }
    
    // Handle challenge participation
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <Card className="bg-gradient-to-r from-slate-900/90 via-purple-900/30 to-slate-900/90 border-white/10 overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-yellow-500/20">
                  <Award className="h-6 w-6 text-yellow-500" />
                </div>
                <motion.h2 
                  className="text-2xl font-bold"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Style This & Get Featured
                </motion.h2>
              </div>
              
              <motion.p 
                className="text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Create a look using any online item + Olivia or your own photo. Share your best style to enter the spotlight!
              </motion.p>
              
              <motion.p 
                className="text-white/70 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                This week's challenge: <span className="text-pink-400 font-medium">Create a festival-ready look using pieces you can find online</span>
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button 
                  onClick={handleParticipate}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-90 text-black font-medium mt-2"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Participate Now
                </Button>
              </motion.div>
            </div>
            
            <div className="relative">
              <motion.div 
                className="grid grid-cols-2 gap-2 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                  <img 
                    src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" 
                    alt="Styling challenge example" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent px-2 py-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 rounded-full overflow-hidden">
                        <img src="/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png" alt="User" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-white/90">Emma S.</span>
                    </div>
                  </div>
                </div>
                
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                  <img 
                    src="/lovable-uploads/413b249c-e4b5-48cd-a468-d23b2a23eca2.png" 
                    alt="Styling challenge example" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="bg-yellow-500 text-black text-xs font-bold rounded-full px-2 py-0.5 flex items-center">
                      <Award className="h-3 w-3 mr-1" />
                      Featured
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent px-2 py-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 rounded-full overflow-hidden">
                        <img src="/lovable-uploads/05c430e3-091c-4f96-a77b-c360610435d3.png" alt="User" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-white/90">Jasmine R.</span>
                    </div>
                  </div>
                </div>
                
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                  <img 
                    src="/lovable-uploads/075a98ab-d879-4919-8898-87590f8f919a.png" 
                    alt="Styling challenge example" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent px-2 py-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 rounded-full overflow-hidden">
                        <img src="/lovable-uploads/2551cee7-6f38-4c04-b656-16c188b19ace.png" alt="User" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-white/90">Taylor M.</span>
                    </div>
                  </div>
                </div>
                
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/90 text-center p-4">
                    <Camera className="h-8 w-8 text-purple-400 mb-2" />
                    <p className="text-sm text-white font-medium">
                      Your creation could be featured here!
                    </p>
                  </div>
                </div>
                
                {!effectivePremiumUser && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                    <LockKeyhole className="h-10 w-10 text-white mb-3" />
                    <p className="text-white font-medium text-center max-w-[200px] mb-2">
                      Premium feature: Participate in style challenges
                    </p>
                    <Button 
                      size="sm"
                      onClick={onShowPremiumPopup}
                      className="bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      Unlock Premium
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default StylingChallengeSection;
