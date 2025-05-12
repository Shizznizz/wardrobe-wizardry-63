
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Outfit } from '@/lib/types';
import { Sparkles } from 'lucide-react';

interface OliviaRatingSectionProps {
  outfit: Outfit | null;
  suggestion: string;
}

const OliviaRatingSection = ({ outfit, suggestion }: OliviaRatingSectionProps) => {
  const defaultSuggestions = [
    "This outfit's colors complement each other beautifully. The proportions are well-balanced too!",
    "I love how this look balances comfort and style. Great choice for everyday wear!",
    "This outfit really highlights your best features. The silhouette is very flattering!",
    "The textures in this outfit work so well together. It creates visual interest without being overwhelming.",
    "These pieces create a cohesive look that's right on-trend but still timeless."
  ];

  const displaySuggestion = suggestion || 
    defaultSuggestions[Math.floor(Math.random() * defaultSuggestions.length)];

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
              <p className="text-white/70 italic">{displaySuggestion}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OliviaRatingSection;
