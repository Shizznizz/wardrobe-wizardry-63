
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTheme } from '@/components/ThemeProvider';

const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();
  
  const handleToggleDarkMode = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast.success(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode enabled`);
  };

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
          <Label htmlFor="dark-mode" className="font-medium text-white">Dark Mode</Label>
          <p className="text-sm text-blue-100/80 mb-2 sm:mb-0">
            Enable dark mode for a darker UI theme
          </p>
        </div>
        <Switch 
          id="dark-mode" 
          checked={theme === 'dark'} 
          onCheckedChange={handleToggleDarkMode}
          className="mt-1 sm:mt-0" 
        />
      </div>
    </motion.div>
  );
};

export default AppearanceSettings;
