
import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Outfit } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface OliviaOutfitPickProps {
  outfit: Outfit | null;
  onPreview: (outfit: Outfit) => void;
  className?: string;
}

const OliviaOutfitPick = ({ outfit, onPreview, className }: OliviaOutfitPickProps) => {
  if (!outfit) return null;

  const handlePreviewClick = () => {
    onPreview(outfit);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`glass-dark rounded-lg border border-white/10 overflow-hidden ${className}`}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-medium text-white">Olivia's Pick for Today</h3>
        </div>

        <div className="relative rounded-lg overflow-hidden mb-4 aspect-[3/4]">
          <img
            src="/lovable-uploads/413b249c-e4b5-48cd-a468-d23b2a23eca2.png"
            alt={outfit.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-purple-500/70 text-white border-none">
              Perfect for {outfit.occasion || 'today'}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-white/80 text-sm leading-relaxed">
            This look uses pieces you haven't worn in a while and fits today's weather perfectly. 
            Light, comfy, and confident – just like you.
          </p>

          <Button
            onClick={handlePreviewClick}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white group"
          >
            Try This Look
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default OliviaOutfitPick;
