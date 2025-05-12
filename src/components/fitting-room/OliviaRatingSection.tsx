
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Outfit } from '@/lib/types';
import { Sparkles, Shirt } from 'lucide-react';
import { toast } from 'sonner';

interface OliviaRatingSectionProps {
  outfit: Outfit | null;
  suggestion: string;
}

const OliviaRatingSection = ({ outfit, suggestion }: OliviaRatingSectionProps) => {
  const personalizedSuggestions = [
    "This casual look is perfect for a sunny walk in the park. 🌸 The colors really suit you!",
    "I love how this styling brings out your natural vibe. It's relaxed yet put-together for everyday wear. ✨",
    "This is exactly what I'd recommend for a coffee date or casual meetup! The silhouette is so flattering on you. 💫",
    "The way these pieces work together creates such a balanced look. Great for running errands in style! 🛍️",
    "This outfit has the perfect blend of comfort and style. You'll turn heads for all the right reasons! 👗"
  ];

  const displaySuggestion = suggestion || 
    personalizedSuggestions[Math.floor(Math.random() * personalizedSuggestions.length)];
    
  const handleShowAccessories = () => {
    toast.info("Accessory suggestions coming soon!", {
      description: "This feature will be available in a future update."
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="my-6"
    >
      <Card className="border border-purple-500/30 bg-gradient-to-r from-slate-900/80 via-purple-900/20 to-slate-900/80 overflow-hidden shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-purple-900/30 p-2 rounded-full">
              <Sparkles className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-200 mb-1">Olivia's Take</h3>
              <p className="text-white/80 italic">{displaySuggestion}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 pb-4 px-4">
          <Button 
            variant="outline" 
            size="sm"
            className="ml-auto border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200"
            onClick={handleShowAccessories}
          >
            <Shirt className="h-4 w-4 mr-2" />
            Show Accessory Suggestions
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default OliviaRatingSection;
