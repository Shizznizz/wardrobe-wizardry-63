
import { Bell, Calendar } from 'lucide-react';
import { UserPreferences } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface RemindersSectionProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
}

const RemindersSection = ({ preferences, setPreferences }: RemindersSectionProps) => {
  const handleReminderToggle = (checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      outfitReminders: checked
    }));
  };

  const handleReminderTimeChange = (time: string) => {
    setPreferences(prev => ({
      ...prev,
      reminderTime: time
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-purple-400" />
        <h3 className="text-base font-medium text-white">Daily Outfit Reminders</h3>
      </div>
      
      <div className="rounded-lg border border-white/10 p-4 space-y-6 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="reminders" className="text-sm text-white/90">Enable daily outfit suggestions</Label>
            <p className="text-xs text-white/60">Olivia will send you outfit ideas for the next day</p>
          </div>
          <Switch
            id="reminders"
            checked={preferences.outfitReminders}
            onCheckedChange={handleReminderToggle}
          />
        </div>
        
        {preferences.outfitReminders && (
          <>
            <Separator className="bg-white/10" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reminder-time" className="text-sm text-white/90">Reminder time</Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={preferences.reminderTime}
                  onChange={(e) => handleReminderTimeChange(e.target.value)}
                  className="bg-slate-800/50 border-white/10 text-white"
                />
                <p className="text-xs text-white/60">When to receive your daily outfit suggestions</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-white/90">Reminder frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekdays">Weekdays only</SelectItem>
                    <SelectItem value="weekly">Weekly (Sunday)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-white/60">How often you'd like to receive suggestions</p>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm text-white/90">Include in reminders</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Switch id="include-weather" defaultChecked />
                    <Label htmlFor="include-weather" className="text-sm text-white/90">Weather forecast</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="include-events" defaultChecked />
                    <Label htmlFor="include-events" className="text-sm text-white/90">Calendar events</Label>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RemindersSection;
