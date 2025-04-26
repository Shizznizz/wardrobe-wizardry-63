
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Outfit } from '@/lib/types';
import { Eye, Sparkles } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface OliviaOutfitPickProps {
  outfit: Outfit;
  onPreview: (outfit: Outfit) => void;
  className?: string;
}

const OliviaOutfitPick = ({ outfit, onPreview, className }: OliviaOutfitPickProps) => {
  const [enlarged, setEnlarged] = useState(false);

  const handlePreview = () => {
    onPreview(outfit);
  };
  
  const handleImageClick = () => {
    setEnlarged(true);
  };

  // Use a placeholder image if no image is available
  // First try to use outfit.image (if it exists), then fall back to a placeholder
  const outfitImage = '/placeholder.svg';

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <motion.div
        className="glass-dark border border-white/10 rounded-lg overflow-hidden"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-medium text-white flex items-center">
              <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
              Olivia's Pick for Today
            </h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div 
              className="relative md:w-3/5 cursor-pointer overflow-hidden rounded-lg" 
              onClick={handleImageClick}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <div className="bg-black/40 backdrop-blur-sm p-3 rounded-full">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              <img 
                src={outfitImage} 
                alt={outfit.name || 'Outfit of the day'} 
                className="w-full h-auto object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                style={{ minHeight: "380px", objectFit: "cover" }}
              />
            </div>
            
            <div className="md:w-2/5 flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-medium text-white mb-3">
                  {outfit.name || 'Perfect for Today'}
                </h4>
                <p className="text-md text-white/80 mb-6">
                  This outfit perfectly matches today's weather and your style preferences. The color palette harmonizes beautifully with your profile.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {outfit.seasons && outfit.seasons.map((season) => (
                    <span 
                      key={season} 
                      className="text-sm py-1 px-3 bg-purple-500/20 text-purple-200 rounded-full"
                    >
                      {season}
                    </span>
                  ))}
                  {outfit.occasions && outfit.occasions.map((occasion) => (
                    <span 
                      key={occasion} 
                      className="text-sm py-1 px-3 bg-blue-500/20 text-blue-200 rounded-full"
                    >
                      {occasion}
                    </span>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={handlePreview}
                className="w-full mt-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105 py-7 text-lg"
              >
                <Eye className="w-6 h-6 mr-2" />
                Try This Look
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
      
      <Dialog open={enlarged} onOpenChange={setEnlarged}>
        <DialogContent className="sm:max-w-[800px] bg-black/90 border-white/10">
          <div className="p-1">
            <img 
              src={outfitImage} 
              alt={outfit.name || 'Enlarged outfit view'} 
              className="w-full h-auto object-contain max-h-[80vh]"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OliviaOutfitPick;
