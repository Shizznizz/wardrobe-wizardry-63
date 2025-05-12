
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, X, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModelPreviewProps {
  userPhoto: string | null;
  isUsingOliviaImage: boolean;
  onChangeModel: () => void;
}

const ModelPreview: React.FC<ModelPreviewProps> = ({ 
  userPhoto, 
  isUsingOliviaImage,
  onChangeModel 
}) => {
  if (!userPhoto) return null;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 bg-slate-900/90 backdrop-blur-md border border-purple-500/30 rounded-lg shadow-lg overflow-hidden flex items-center p-2 pr-4"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="relative h-14 w-14 rounded-md overflow-hidden mr-3 bg-slate-800 border border-white/10">
        {userPhoto && (
          <img 
            src={userPhoto} 
            alt="Model preview" 
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-col">
        <p className="text-xs text-purple-300 font-medium">
          {isUsingOliviaImage ? (
            <span className="flex items-center">
              <User className="h-3 w-3 mr-1" /> Previewing as: Olivia
            </span>
          ) : (
            <span className="flex items-center">
              <Camera className="h-3 w-3 mr-1" /> Previewing as: My Photo
            </span>
          )}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-1 h-7 text-xs border-purple-500/30 hover:bg-purple-500/20"
          onClick={onChangeModel}
        >
          <RefreshCw className="h-3 w-3 mr-1" /> Change Model
        </Button>
      </div>
    </motion.div>
  );
};

export default ModelPreview;
