
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Palette } from 'lucide-react';

interface OliviaStyleFeedbackProps {
  onTrySimilarLook: () => void;
  onSaveLook: () => void;
  onSeeStyleOptions: () => void;
}

const OliviaStyleFeedback = ({
  onTrySimilarLook,
  onSaveLook,
  onSeeStyleOptions
}: OliviaStyleFeedbackProps) => {
  const feedbacks = [
    "Love this fit with high-rise jeans! Want a recommendation?",
    "A cropped jacket would complete this. Shall I suggest one?",
    "This style works great for your body type! Let me show you more like it.",
    "You're nailing this look! Want to see my styling tips?",
    "This color really brings out your eyes! Save this look?"
  ];
  
  const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-6"
    >
      <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-white/10 rounded-lg p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src="/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png" 
              alt="Olivia" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-grow">
            <h3 className="text-lg font-medium mb-1 text-white">Olivia's Style Tips</h3>
            <p className="text-white/90 mb-3">{randomFeedback}</p>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={onTrySimilarLook}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Try Similar Look
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                onClick={onSaveLook}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Heart className="h-4 w-4 mr-1" />
                Save to My Wardrobe
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onSeeStyleOptions}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Palette className="h-4 w-4 mr-1" />
                See Styling Options
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OliviaStyleFeedback;
