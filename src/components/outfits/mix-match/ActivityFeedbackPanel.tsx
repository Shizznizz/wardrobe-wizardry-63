
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ActivityFeedbackPanelProps {
  activity: string;
  onScroll?: () => void;
  className?: string;
}

const ActivityFeedbackPanel: React.FC<ActivityFeedbackPanelProps> = ({ 
  activity, 
  onScroll,
  className 
}) => {
  const getFeedbackForActivity = (activity: string) => {
    switch (activity.toLowerCase()) {
      case 'work':
        return {
          message: "Great choice! Olivia has curated a stunning outfit for your workday.",
          tip: "Add a statement accessory to elevate your professional look.",
          quote: "Dress like you're going to meet your biggest client today.",
          funFact: "Studies show people who dress well at work are 41% more likely to be promoted."
        };
      case 'casual':
        return {
          message: "Perfect! Olivia has put together a stylish casual outfit for today.",
          tip: "Layer with lightweight pieces for versatility throughout the day.",
          quote: "Style is a way to say who you are without having to speak.",
          funFact: "The term 'casual Friday' originated in Hawaii in the 1960s with 'Aloha Fridays'."
        };
      case 'sport':
        return {
          message: "Ready to get active! Olivia has selected the perfect sportswear for you.",
          tip: "Choose moisture-wicking fabrics to stay comfortable during your workout.",
          quote: "Look good, feel good, perform better.",
          funFact: "Wearing proper athletic clothes can improve your performance by up to 15%."
        };
      case 'formal':
        return {
          message: "Make an impression! Olivia has designed an elegant formal look for you.",
          tip: "Consider the venue lighting when selecting jewelry - softer light pairs well with pearls.",
          quote: "Elegance is the only beauty that never fades.",
          funFact: "The tradition of formal attire dates back to King Louis XIV of France in the 17th century."
        };
      case 'party':
        return {
          message: "Time to shine! Olivia has created a fabulous party outfit for your occasion.",
          tip: "Play with textures to add dimension to your party look.",
          quote: "Life is a party, dress like it.",
          funFact: "The concept of 'party clothes' emerged in the 1920s during the Prohibition era."
        };
      default:
        return {
          message: "Perfect choice! Olivia has curated a stylish outfit for your day.",
          tip: "Express your personality through your accessories.",
          quote: "Fashion is what you buy. Style is what you do with it.",
          funFact: "The average person makes 35,000 decisions each day - including what to wear."
        };
    }
  };

  const feedback = getFeedbackForActivity(activity);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "bg-gradient-to-br from-purple-900/60 to-indigo-900/40 backdrop-blur-md",
        "border border-white/10 rounded-xl p-5 shadow-lg",
        className
      )}
    >
      <div className="flex items-start gap-4 mb-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Avatar className="h-12 w-12 border-2 border-purple-400/50 bg-gradient-to-br from-purple-600 to-pink-500">
            <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
            <AvatarFallback className="bg-purple-800 text-white">OB</AvatarFallback>
          </Avatar>
        </motion.div>
        
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-1">
              {feedback.message}
            </h3>
            <div className="flex flex-wrap gap-2 my-2">
              <Badge variant="outline" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                {activity.charAt(0).toUpperCase() + activity.slice(1)}
              </Badge>
              <Badge variant="outline" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                Personalized
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="space-y-4 mt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <span className="text-purple-300 font-medium">Olivia's Style Tip:</span>
          <p className="text-white/90 mt-1">{feedback.tip}</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <span className="text-blue-300 font-medium">Fun Fact:</span>
          <p className="text-white/90 mt-1">{feedback.funFact}</p>
        </div>
        
        <div className="text-center p-3 italic text-white/80">
          "{feedback.quote}"
        </div>
        
        <motion.div 
          className="flex flex-col items-center mt-5 cursor-pointer"
          onClick={onScroll}
          whileHover={{ y: 5 }}
          animate={{ 
            y: [0, 5, 0],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <p className="text-white/70 mb-1 text-sm">Scroll to see your complete look</p>
          <ArrowDown className="w-5 h-5 text-purple-400" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ActivityFeedbackPanel;
