
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { OutfitItem } from './types';
import { OutfitColors } from './OutfitColors';

interface OutfitCardProps {
  outfit: OutfitItem;
  onClick: () => void;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }} 
      className="h-full cursor-pointer"
      onClick={onClick}
    >
      <Card className="glass-dark border-white/10 h-full transform transition-all duration-300 hover:scale-[1.02]">
        <CardContent className="p-4">
          <div className={`aspect-[3/4] rounded-md overflow-hidden bg-gradient-to-br ${outfit.gradient} mb-3 flex items-center justify-center relative`}>
            {outfit.image ? (
              <motion.img 
                src={outfit.image} 
                alt={outfit.name} 
                className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="text-white/30 text-lg font-medium">
                {outfit.name}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <h3 className="text-lg font-medium text-white">{outfit.name}</h3>
              <p className="text-white/90 text-sm italic mt-1">{outfit.quote}</p>
            </div>
          </div>
          <p className="text-white/70 text-sm">{outfit.season}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-1">
          <OutfitColors colors={outfit.colors} />
        </CardFooter>
      </Card>
    </motion.div>
  );
};
