
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SwitchCamera } from 'lucide-react';

interface BeforeAfterToggleProps {
  userPhoto: string | null;
  finalImage: string | null;
  isVisible: boolean;
}

const BeforeAfterToggle = ({ 
  userPhoto, 
  finalImage, 
  isVisible 
}: BeforeAfterToggleProps) => {
  const [showBefore, setShowBefore] = useState(false);
  
  if (!isVisible || !userPhoto || !finalImage) return null;
  
  return (
    <div className="absolute bottom-4 left-4 z-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button 
          variant="secondary"
          className="bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20"
          size="sm"
          onClick={() => setShowBefore(!showBefore)}
        >
          <SwitchCamera className="h-4 w-4 mr-2" />
          {showBefore ? 'Show After' : 'Show Before'}
        </Button>
        
        {showBefore && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 -m-2"
          >
            <div className="absolute inset-0 -z-10">
              <img 
                src={userPhoto} 
                alt="Before" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BeforeAfterToggle;
