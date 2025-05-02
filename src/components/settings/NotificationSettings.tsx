
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Switch } from "@/components/ui/switch"
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label"
import { Bell, MessageSquare, Sparkles } from 'lucide-react';

interface NotificationSettingsProps {
  onSave?: () => void;
}

const NotificationSettings = ({ onSave }: NotificationSettingsProps) => {
  const [outfitReminders, setOutfitReminders] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [feedbackRequests, setFeedbackRequests] = useState(false);
  const [styleMessages, setStyleMessages] = useState(true);
  
  const handleSave = () => {
    // In a real app, we'd save these to the backend/database
    localStorage.setItem('notifications', JSON.stringify({
      outfitReminders,
      weatherAlerts,
      feedbackRequests,
      styleMessages
    }));
    
    if (onSave) onSave();
  };
  
  return (
    <motion.div 
      className="glass-dark rounded-xl border border-white/10 p-4 sm:p-6 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 flex items-center">
        <Bell className="mr-2 h-5 w-5 text-pink-400" />
        Notifications
      </h2>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-white/5">
          <div className="space-y-0.5">
            <Label className="text-white">Daily Outfit Reminders</Label>
            <p className="text-xs text-white/70">Get notifications for daily outfit suggestions</p>
          </div>
          <Switch 
            checked={outfitReminders} 
            onCheckedChange={setOutfitReminders} 
            className="data-[state=checked]:bg-gradient-to-r from-pink-500 to-purple-500" 
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-white/5">
          <div className="space-y-0.5">
            <Label className="text-white">Weather Change Alerts</Label>
            <p className="text-xs text-white/70">Get notified when weather affects your outfit</p>
          </div>
          <Switch 
            checked={weatherAlerts} 
            onCheckedChange={setWeatherAlerts} 
            className="data-[state=checked]:bg-gradient-to-r from-pink-500 to-purple-500"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-white/5">
          <div className="space-y-0.5">
            <Label className="text-white">Style Feedback Requests</Label>
            <p className="text-xs text-white/70">Occasional requests for feedback on outfits</p>
          </div>
          <Switch 
            checked={feedbackRequests} 
            onCheckedChange={setFeedbackRequests} 
            className="data-[state=checked]:bg-gradient-to-r from-pink-500 to-purple-500" 
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center">
              <Label className="text-white">Olivia's Style Messages</Label>
              <MessageSquare className="ml-1 h-3 w-3 text-pink-400" />
            </div>
            <p className="text-xs text-white/70">Tips and updates from your personal stylist</p>
          </div>
          <Switch 
            checked={styleMessages} 
            onCheckedChange={setStyleMessages}
            className="data-[state=checked]:bg-gradient-to-r from-pink-500 to-purple-500"
          />
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button 
          onClick={handleSave}
          className="bg-gradient-to-r from-[#ff4ecb] to-[#a97eff] text-white hover:scale-[1.03] transition-transform rounded-xl shadow-md shadow-purple-900/20 flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Save Notification Preferences
        </Button>
      </div>
    </motion.div>
  );
};

export default NotificationSettings;
