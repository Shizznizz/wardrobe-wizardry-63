
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UserPreferences } from '@/lib/types';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { BellIcon, Mail, CloudLightning } from 'lucide-react';

interface NotificationSectionProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences | null>>;
}

const NotificationSection = ({ preferences, setPreferences }: NotificationSectionProps) => {
  
  const handleToggleNotification = (setting: 'weeklyEmailUpdates' | 'notifyNewOutfits' | 'notifyWeatherChanges') => {
    setPreferences(prev => {
      if (!prev) return prev;
      
      const updatedPreferences = {
        ...prev,
        [setting]: !prev[setting]
      };
      
      // Save to localStorage for immediate use in other components
      localStorage.setItem(`notifPref_${setting}`, updatedPreferences[setting].toString());
      
      return updatedPreferences;
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Notifications & Preferences</h3>
        <p className="text-white/70 text-sm mb-4">
          Customize how and when you want to receive updates and recommendations
        </p>
      </div>
      
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-purple-400" />
              <div>
                <Label className="text-base">Weekly outfit ideas via email</Label>
                <CardDescription className="text-sm text-white/60">
                  Receive a weekly email with personalized outfit suggestions
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={preferences.weeklyEmailUpdates || false}
              onCheckedChange={() => handleToggleNotification('weeklyEmailUpdates')}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BellIcon className="h-5 w-5 text-purple-400" />
              <div>
                <Label className="text-base">New outfit notifications</Label>
                <CardDescription className="text-sm text-white/60">
                  Get notified when new matching outfits are available for your wardrobe
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={preferences.notifyNewOutfits || false}
              onCheckedChange={() => handleToggleNotification('notifyNewOutfits')}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CloudLightning className="h-5 w-5 text-purple-400" />
              <div>
                <Label className="text-base">Weather change alerts</Label>
                <CardDescription className="text-sm text-white/60">
                  Get notified when weather changes might affect your planned outfit
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={preferences.notifyWeatherChanges || false}
              onCheckedChange={() => handleToggleNotification('notifyWeatherChanges')}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSection;
