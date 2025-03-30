
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BellIcon, BellOffIcon } from 'lucide-react';

interface ReminderPreferencesProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  reminderTime: string;
  onTimeChange: (time: string) => void;
}

const ReminderPreferences = ({ 
  enabled, 
  onToggle, 
  reminderTime, 
  onTimeChange 
}: ReminderPreferencesProps) => {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Get daily reminders for outfit suggestions based on weather and your preferences.
      </p>
      
      <div className="flex items-center justify-between border rounded-lg p-4">
        <div className="flex items-center gap-3">
          {enabled ? (
            <BellIcon className="h-5 w-5 text-primary" />
          ) : (
            <BellOffIcon className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <Label className="font-medium">Daily Outfit Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Receive daily outfit suggestions
            </p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      
      {enabled && (
        <div className="border rounded-lg p-4 space-y-2">
          <Label htmlFor="reminderTime">Reminder Time</Label>
          <p className="text-sm text-muted-foreground">
            When would you like to receive outfit recommendations?
          </p>
          <Input
            id="reminderTime"
            type="time"
            value={reminderTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="max-w-[200px] mt-2"
          />
        </div>
      )}
    </div>
  );
};

export default ReminderPreferences;
