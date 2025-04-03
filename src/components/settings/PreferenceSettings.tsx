
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const PreferenceSettings = () => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      className="glass-dark rounded-xl border border-white/10 p-4 sm:p-6 space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-medium text-blue-200">Fashion Preferences</h2>
          <p className="text-sm text-blue-100/80">
            Manage your style preferences, colors, and outfit settings
          </p>
        </div>
        <Button 
          variant="outline" 
          className={`border-white/20 text-white hover:bg-white/10 ${isMobile ? 'w-full justify-center py-2' : ''}`}
          size={isMobile ? "sm" : "default"}
          asChild
        >
          <Link to="/preferences">
            <Sliders className="h-4 w-4 mr-2" />
            <span>Preferences</span>
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default PreferenceSettings;
