
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';

const AppearanceSettings = () => {
  return (
    <motion.div 
      className="glass-dark rounded-xl border border-white/10 p-4 sm:p-6 space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-medium text-blue-200">Appearance</h2>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Label className="font-medium text-white">Dark Mode</Label>
          <p className="text-sm text-blue-100/80 mb-2 sm:mb-0">
            Permanent dark mode for an immersive experience
          </p>
        </div>
        <div className="text-white/70 text-sm">Always Enabled</div>
      </div>
    </motion.div>
  );
};

export default AppearanceSettings;
