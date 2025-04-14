
import React from 'react';
import { motion } from 'framer-motion';
import { User, Camera, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UserPhotoDisplayProps {
  userPhoto: string | null;
  isUsingOliviaImage: boolean;
  onResetPhoto: () => void;
  className?: string;
}

const UserPhotoDisplay = ({ 
  userPhoto, 
  isUsingOliviaImage, 
  onResetPhoto,
  className
}: UserPhotoDisplayProps) => {
  if (!userPhoto) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative rounded-lg overflow-hidden border border-white/10 shadow-xl",
        "bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/30",
        className
      )}
    >
      <div className="aspect-[3/4] w-full relative">
        <img 
          src={userPhoto} 
          alt="Your model" 
          className="w-full h-full object-cover"
        />
        
        {isUsingOliviaImage && (
          <div className="absolute top-3 left-3 bg-purple-600/80 backdrop-blur-sm rounded-full py-1 px-2.5 text-xs text-white flex items-center">
            <User className="h-3 w-3 mr-1.5" />
            Olivia's Image
          </div>
        )}
        
        <div className="absolute bottom-3 right-3 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-black/50 hover:bg-black/70 text-white border-white/20 backdrop-blur-sm text-xs h-8"
            onClick={onResetPhoto}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Change
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserPhotoDisplay;
