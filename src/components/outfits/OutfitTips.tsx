
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface OutfitTip {
  id: number;
  title: string;
  content: string;
}

interface OutfitTipsProps {
  tips: OutfitTip[];
  onShowAssistant: () => void;
  showAssistant: boolean;
}

const OutfitTips = ({ tips, onShowAssistant, showAssistant }: OutfitTipsProps) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="lg:w-1/2"
    >
      <div className="relative">
        <div className="absolute -top-4 -left-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full p-3 shadow-lg">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <Card className="glass-dark border-white/10 overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16 border-2 border-purple-400/30">
                <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  Style Suggestion
                  <Sparkles className="h-4 w-4 ml-2 text-yellow-300" />
                </h3>
                <p className="text-white/70">From Olivia Bloom</p>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.p 
                key={currentTipIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-white/90 italic mb-4"
              >
                "{tips[currentTipIndex].content}"
              </motion.p>
            </AnimatePresence>
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleNextTip}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                Next tip
              </Button>
              {!showAssistant && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShowAssistant}
                  className="border-purple-400/30 text-white hover:bg-white/10"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Ask Olivia
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default OutfitTips;
