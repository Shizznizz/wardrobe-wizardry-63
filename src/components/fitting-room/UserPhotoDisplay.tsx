
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, RefreshCw, Camera } from 'lucide-react';
import { Card } from '@/components/ui/card';
import OliviaImageBadge from '@/components/outfits/OliviaImageBadge';

interface UserPhotoDisplayProps {
  userPhoto: string | null;
  isUsingOliviaImage: boolean;
  onResetPhoto: () => void;
  className?: string;
}

const UserPhotoDisplay = ({ userPhoto, isUsingOliviaImage, onResetPhoto, className = '' }: UserPhotoDisplayProps) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!userPhoto) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative ${className}`}
    >
      <Card className="border-white/10 bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl">
        <div 
          className="relative rounded-lg overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <OliviaImageBadge isVisible={isUsingOliviaImage} large />
          
          <div className="aspect-auto max-h-[500px] overflow-hidden flex items-center justify-center">
            <img 
              src={userPhoto} 
              alt={isUsingOliviaImage ? "Olivia as your model" : "Your photo"} 
              className="w-full h-auto object-contain max-h-[500px]"
            />
          </div>
          
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/60 flex items-end justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onResetPhoto}
                className="bg-black/30 backdrop-blur-sm border-white/20 text-white hover:bg-black/50"
              >
                <X className="h-4 w-4 mr-2" />
                Change Model
              </Button>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default UserPhotoDisplay;
