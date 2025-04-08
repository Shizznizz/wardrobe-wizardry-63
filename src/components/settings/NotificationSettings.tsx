
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { BellRing, AlertCircle, CalendarClock, Sparkles, Cloud } from 'lucide-react';

const NotificationSettings = () => {
  const [outfitReminders, setOutfitReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [newItems, setNewItems] = useState(true);
  const [styleInsights, setStyleInsights] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [reminderDays, setReminderDays] = useState<string[]>(["1", "2", "3", "4", "5"]);
  
  const handleSaveSettings = () => {
    // In a production app, this would save to a database
    toast.success('Notification settings saved successfully');
  };
  
  const toggleDay = (day: string) => {
    setReminderDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };
  
  return (
    <Card className="bg-slate-800/40 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <BellRing className="h-5 w-5 text-purple-400" />
          Notifications
        </CardTitle>
        <CardDescription className="text-slate-400">
          Customize your notification preferences
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-blue-400" />
                Daily Outfit Reminders
              </Label>
              <p className="text-xs text-slate-400">
                Get a reminder to prepare your outfit for the next day
              </p>
            </div>
            <Switch 
              checked={outfitReminders} 
              onCheckedChange={setOutfitReminders} 
            />
          </div>
          
          {outfitReminders && (
            <div className="pl-6 space-y-4 border-l border-slate-700">
              <div className="space-y-1">
                <Label htmlFor="reminder-time" className="text-sm text-slate-300">
                  Reminder Time
                </Label>
                <Input 
                  id="reminder-time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white h-9"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-slate-300">Days of Week</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    {id: "0", label: "S"},
                    {id: "1", label: "M"},
                    {id: "2", label: "T"},
                    {id: "3", label: "W"},
                    {id: "4", label: "T"},
                    {id: "5", label: "F"},
                    {id: "6", label: "S"}
                  ].map((day) => (
                    <Button
                      key={day.id}
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => toggleDay(day.id)}
                      className={`w-9 h-9 p-0 ${
                        reminderDays.includes(day.id)
                          ? "bg-purple-500/20 border-purple-500 text-white"
                          : "bg-transparent border-slate-700 text-slate-400"
                      }`}
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label className="text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-pink-400" />
                New Items & Features
              </Label>
              <p className="text-xs text-slate-400">
                Be notified when new features are available to explore
              </p>
            </div>
            <Switch 
              checked={newItems} 
              onCheckedChange={setNewItems} 
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label className="text-white flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-400" />
                Style Insights & Tips
              </Label>
              <p className="text-xs text-slate-400">
                Receive personalized style recommendations from Olivia
              </p>
            </div>
            <Switch 
              checked={styleInsights} 
              onCheckedChange={setStyleInsights} 
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label className="text-white flex items-center gap-2">
                <Cloud className="h-4 w-4 text-blue-400" />
                Weather Alerts
              </Label>
              <p className="text-xs text-slate-400">
                Get notified of significant weather changes affecting your outfit choices
              </p>
            </div>
            <Switch 
              checked={weatherAlerts} 
              onCheckedChange={setWeatherAlerts} 
            />
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            onClick={handleSaveSettings}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          >
            Save Notification Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
