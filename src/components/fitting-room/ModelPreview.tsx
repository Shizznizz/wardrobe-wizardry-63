
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, User, RefreshCw, Minimize2 } from 'lucide-react';
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
  const [isMinimized, setIsMinimized] = useState(false);

  if (!userPhoto) return null;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 bg-slate-900/80 backdrop-blur-md border border-purple-500/30 rounded-lg shadow-lg overflow-hidden flex items-center p-2 pr-3"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ maxWidth: isMinimized ? '48px' : '240px' }}
      drag
      dragConstraints={{
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }}
      dragElastic={0.2}
    >
      {isMinimized ? (
        <Button
          variant="ghost" 
          size="sm"
          className="p-0 h-8 w-8 text-white/80"
          onClick={() => setIsMinimized(false)}
        >
          <User className="h-4 w-4" />
        </Button>
      ) : (
        <>
          <div className="relative h-12 w-12 rounded-md overflow-hidden mr-3 bg-slate-800 border border-white/10 flex-shrink-0">
            {userPhoto && (
              <img 
                src={userPhoto} 
                alt="Model preview" 
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col flex-grow min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs text-purple-300 font-medium truncate">
                {isUsingOliviaImage ? (
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1 flex-shrink-0" /> Previewing as: Olivia
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Camera className="h-3 w-3 mr-1 flex-shrink-0" /> Previewing as: My Photo
                  </span>
                )}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 p-0 h-6 w-6 text-white/60 hover:text-white"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-1 h-7 text-xs border-purple-500/30 hover:bg-purple-500/20"
              onClick={onChangeModel}
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Change Model
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ModelPreview;
