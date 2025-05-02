
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const AppearanceSettings = () => {
  return (
    <motion.div 
      className="glass-dark rounded-xl border border-white/10 p-4 sm:p-6 space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">Appearance</h2>
        <Badge variant="outline" className="border-purple-400/30 bg-purple-500/10 text-purple-300 text-xs">
          System
        </Badge>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-2 border-t border-white/5">
        <div>
          <Label className="font-medium text-white">Dark Mode</Label>
          <p className="text-sm text-white/70 mb-2 sm:mb-0">
            Permanent dark mode for an immersive experience
          </p>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-5 bg-gradient-to-r from-[#ff4ecb] to-[#a97eff] rounded-full relative">
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-glow"></div>
          </div>
          <span className="ml-3 text-white text-sm font-medium">Always On</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
        <div>
          <Label className="font-medium text-white">UI Animation</Label>
          <p className="text-sm text-white/70 mb-2 sm:mb-0">
            Subtle animations and transitions
          </p>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-5 bg-gradient-to-r from-[#ff4ecb] to-[#a97eff] rounded-full relative">
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-glow"></div>
          </div>
          <span className="ml-3 text-white text-sm font-medium">Enabled</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AppearanceSettings;
