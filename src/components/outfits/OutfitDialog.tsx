
import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OutfitItem } from './types';
import { OutfitColors } from './OutfitColors';

interface OutfitDialogProps {
  outfit: OutfitItem;
}

export const OutfitDialog: React.FC<OutfitDialogProps> = ({ outfit }) => {
  return (
    <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-800 text-white">
      <DialogHeader>
        <DialogTitle className="text-xl">{outfit.name} Outfit</DialogTitle>
        <DialogDescription className="text-slate-400">
          Perfect for {outfit.season.toLowerCase()} occasions
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4">
        <div className={`aspect-video rounded-lg overflow-hidden bg-gradient-to-br ${outfit.gradient} flex items-center justify-center`}>
          {outfit.image ? (
            <motion.img 
              src={outfit.image} 
              alt={outfit.name} 
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div className="text-white/50 text-xl font-medium">
              {outfit.name} Preview
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Colors</h3>
          <OutfitColors colors={outfit.colors} />
        </div>
        
        <blockquote className="italic border-l-2 border-purple-500 pl-3 text-slate-300">
          "{outfit.quote}"
        </blockquote>
        
        <div>
          <Button className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <PlusCircle size={16} />
            <span>Copy to My Wardrobe</span>
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};
