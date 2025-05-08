
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const NotificationSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    reminderEnabled: false,
    reminderTime: '08:00',
  });

  useEffect(() => {
    if (user) {
      fetchUserPreferences();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserPreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('reminder_enabled, reminder_time')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setPreferences({
          reminderEnabled: data.reminder_enabled || false,
          reminderTime: data.reminder_time || '08:00',
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Could not load your notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { data: existingPrefs, error: checkError } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      let upsertError;
      
      if (existingPrefs) {
        // Update existing preferences
        const { error } = await supabase
          .from('user_preferences')
          .update({
            reminder_enabled: preferences.reminderEnabled,
            reminder_time: preferences.reminderTime,
          })
          .eq('user_id', user.id);
        
        upsertError = error;
      } else {
        // Insert new preferences
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            reminder_enabled: preferences.reminderEnabled,
            reminder_time: preferences.reminderTime,
          });
        
        upsertError = error;
      }
      
      if (upsertError) throw upsertError;
      
      toast.success('Notification preferences saved');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Could not save your notification preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/30 border-white/10">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Control how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="outfit-reminders">Daily Outfit Reminders</Label>
              <p className="text-sm text-white/60">
                Get a notification to plan your outfit for the day
              </p>
            </div>
            <Switch
              id="outfit-reminders"
              checked={preferences.reminderEnabled}
              onCheckedChange={(checked) => 
                setPreferences({...preferences, reminderEnabled: checked})
              }
            />
          </div>
          
          {preferences.reminderEnabled && (
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Reminder Time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={preferences.reminderTime}
                onChange={(e) => setPreferences({...preferences, reminderTime: e.target.value})}
                className="bg-slate-950/50 border-white/10 w-32"
              />
              <p className="text-xs text-white/50">
                This is the time when you'll receive your daily outfit reminder
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="feature-updates">Feature Updates</Label>
              <p className="text-sm text-white/60">
                Receive notifications about new app features
              </p>
            </div>
            <Switch id="feature-updates" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="style-trends">Style Trends</Label>
              <p className="text-sm text-white/60">
                Updates on seasonal style trends from Olivia
              </p>
            </div>
            <Switch id="style-trends" defaultChecked />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSavePreferences} 
          disabled={saving}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationSettings;
