
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState(true);
  
  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    toast.success(`Notifications ${!notifications ? 'enabled' : 'disabled'}`);
  };

  return (
    <motion.div 
      className="glass-dark rounded-xl border border-white/10 p-4 sm:p-6 space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h2 className="text-xl font-medium text-blue-200">Notifications</h2>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Label htmlFor="notifications" className="font-medium text-white">Push Notifications</Label>
          <p className="text-sm text-blue-100/80 mb-2 sm:mb-0">
            Receive notifications about weather and outfit suggestions
          </p>
        </div>
        <Switch 
          id="notifications" 
          checked={notifications} 
          onCheckedChange={handleToggleNotifications}
          className="mt-1 sm:mt-0"
        />
      </div>
    </motion.div>
  );
};

export default NotificationSettings;
