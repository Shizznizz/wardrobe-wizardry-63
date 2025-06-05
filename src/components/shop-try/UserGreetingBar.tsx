
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useStyleInsights } from '@/hooks/useStyleInsights';

const UserGreetingBar = () => {
  const { user } = useAuth();
  const { styleInsights } = useStyleInsights();

  // Get mood from style insights or default
  const getCurrentMood = () => {
    if (styleInsights?.quiz_results?.length > 0) {
      const vibeCheck = styleInsights.quiz_results.find(r => r.quiz_id === 'vibe-check');
      if (vibeCheck?.result_label) {
        return vibeCheck.result_label;
      }
    }
    return 'Casual Explorer';
  };

  const getUserName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    return 'Fashionista';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b border-white/10"
    >
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">👋</span>
            <div>
              <span className="text-white font-medium">Hi {getUserName()},</span>
              <span className="text-white/70 ml-2">your wardrobe mood today is:</span>
            </div>
            <Badge 
              variant="outline" 
              className="bg-purple-500/20 border-purple-500/30 text-purple-200 flex items-center"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {getCurrentMood()}
            </Badge>
          </div>
          
          <div className="hidden md:flex items-center text-white/60 text-sm">
            <span>Ready to style?</span>
          </div>
        </div>
      </Container>
    </motion.div>
  );
};

export default UserGreetingBar;
