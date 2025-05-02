
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

interface ActivityFeedbackPanelProps {
  activity: string;
  onScroll: () => void;
}

// Activity-specific feedback content
const activityContent = {
  work: {
    title: "Professional Perfection",
    message: "I've put together some business-ready outfits that will keep you looking sharp and feeling confident all day.",
    tip: "Layer with a blazer for meetings, then remove for a more relaxed office look.",
    quote: "\"Dress for the job you want, not the job you have.\""
  },
  casual: {
    title: "Effortlessly Stylish",
    message: "Here are some laid-back but put-together looks that are perfect for your casual day.",
    tip: "Pair a simple tee with your favorite accessories to elevate the look instantly.",
    quote: "\"Style is a way to say who you are without having to speak.\""
  },
  sport: {
    title: "Active & Attractive",
    message: "I've selected performance-focused outfits that look good and support your active lifestyle.",
    tip: "Choose moisture-wicking fabrics in darker colors for a slimming, practical workout look.",
    quote: "\"Look good, feel good, perform better.\""
  },
  formal: {
    title: "Elegantly Styled",
    message: "These sophisticated outfits will ensure you make the right impression at your formal event.",
    tip: "Focus on fit first - even simple formal wear looks amazing when it fits perfectly.",
    quote: "\"Elegance is the only beauty that never fades.\""
  },
  party: {
    title: "Ready to Shine",
    message: "These fun, expressive outfits will help you stand out and feel confident all night long.",
    tip: "Add one statement piece that captures attention, then keep the rest of your outfit more subdued.",
    quote: "\"Life is a party, dress like it.\""
  }
};

const ActivityFeedbackPanel = ({ activity, onScroll }: ActivityFeedbackPanelProps) => {
  const content = activityContent[activity as keyof typeof activityContent];
  
  // If we don't have content for this activity, show a generic message
  if (!content) {
    return (
      <Card className="p-4 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-white/10">
        <p className="text-white">I've selected some outfits for you based on your activity.</p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card className="overflow-hidden border border-white/10">
        <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 p-5">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-white mb-1">{content.title}</h3>
            <p className="text-white/80">{content.message}</p>
          </motion.div>
        </div>
        
        <div className="p-5 bg-slate-900/50">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-4"
          >
            <div className="border-l-2 border-purple-400 pl-3">
              <h4 className="text-sm font-medium text-purple-300">Olivia's Styling Tip</h4>
              <p className="text-white/70 text-sm">{content.tip}</p>
            </div>
            
            <div className="italic text-center text-white/60 text-sm px-4 py-2">
              {content.quote}
            </div>
            
            <div className="pt-2 text-center">
              <Button 
                onClick={onScroll}
                variant="ghost" 
                size="sm"
                className="text-purple-300 hover:text-white group flex items-center gap-1 mx-auto"
              >
                <span>See my recommendations</span>
                <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ActivityFeedbackPanel;
