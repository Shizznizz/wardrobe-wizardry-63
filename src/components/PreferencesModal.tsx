
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Settings, Loader2 } from 'lucide-react';
import { ClothingColor, ClothingSeason, UserPreferences } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { saveUserPreferences } from '@/integrations/supabase/client';

interface PreferencesModalProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  buttonClassName?: string;
  buttonVariant?: string;
}

const PreferencesModal = ({ preferences, onSave, buttonClassName, buttonVariant = "outline" }: PreferencesModalProps) => {
  const [open, setOpen] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleColorToggle = (color: ClothingColor) => {
    setLocalPreferences(prev => {
      const newColors = prev.favoriteColors.includes(color)
        ? prev.favoriteColors.filter(c => c !== color)
        : [...prev.favoriteColors, color];
      
      return {
        ...prev,
        favoriteColors: newColors
      };
    });
  };

  const handleStyleToggle = (style: string) => {
    setLocalPreferences(prev => {
      const newStyles = prev.favoriteStyles.includes(style)
        ? prev.favoriteStyles.filter(s => s !== style)
        : [...prev.favoriteStyles, style];
      
      return {
        ...prev,
        favoriteStyles: newStyles
      };
    });
  };

  const handleSeasonToggle = (season: ClothingSeason) => {
    setLocalPreferences(prev => ({
      ...prev,
      seasonalPreferences: {
        ...prev.seasonalPreferences,
        [season]: {
          ...prev.seasonalPreferences[season],
          enabled: !prev.seasonalPreferences[season].enabled
        }
      }
    }));
  };

  const handleTemperatureRangeChange = (season: ClothingSeason, values: number[]) => {
    setLocalPreferences(prev => ({
      ...prev,
      seasonalPreferences: {
        ...prev.seasonalPreferences,
        [season]: {
          ...prev.seasonalPreferences[season],
          temperatureRange: [values[0], values[1]]
        }
      }
    }));
  };

  const handleReminderToggle = (checked: boolean) => {
    setLocalPreferences(prev => ({
      ...prev,
      outfitReminders: checked
    }));
  };

  const handleReminderTimeChange = (time: string) => {
    setLocalPreferences(prev => ({
      ...prev,
      reminderTime: time
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (user) {
        // Save preferences to Supabase if user is authenticated
        const { success, error } = await saveUserPreferences(user.id, localPreferences);
        
        if (success) {
          onSave(localPreferences);
          toast.success('Preferences saved successfully');
          setOpen(false);
        } else {
          toast.error('Error saving preferences to server');
          console.error(error);
        }
      } else {
        // Just save locally if user is not authenticated
        onSave(localPreferences);
        toast.success('Preferences saved locally');
        setOpen(false);
      }
    } catch (error) {
      toast.error('Error saving preferences');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const colors: ClothingColor[] = [
    'black', 'white', 'gray', 'red', 'blue', 
    'green', 'yellow', 'purple', 'pink', 'orange', 'brown'
  ];

  const styles = [
    'casual', 'formal', 'business casual', 'sporty', 
    'bohemian', 'vintage', 'minimalist', 'streetwear'
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          className="w-full sm:w-auto"
        >
          <Button 
            variant={buttonVariant as any} 
            className={`space-x-2 ${buttonClassName || ''} w-full`}
          >
            <Settings className="h-4 w-4" />
            <span>Preferences</span>
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Preferences</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[70vh] overflow-hidden">
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Favorite Colors</h3>
                <div className="grid grid-cols-3 gap-2">
                  {colors.map((color) => (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox
                        id={`color-${color}`}
                        checked={localPreferences.favoriteColors.includes(color)}
                        onCheckedChange={() => handleColorToggle(color)}
                      />
                      <Label
                        htmlFor={`color-${color}`}
                        className="capitalize cursor-pointer text-sm"
                      >
                        {color}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Favorite Styles</h3>
                <div className="grid grid-cols-2 gap-2">
                  {styles.map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox
                        id={`style-${style}`}
                        checked={localPreferences.favoriteStyles.includes(style)}
                        onCheckedChange={() => handleStyleToggle(style)}
                      />
                      <Label
                        htmlFor={`style-${style}`}
                        className="capitalize cursor-pointer text-sm"
                      >
                        {style}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Seasonal Preferences</h3>
                
                {(Object.keys(localPreferences.seasonalPreferences) as ClothingSeason[])
                  .filter(season => season !== 'all')
                  .map((season) => (
                    <div key={season} className="space-y-2 border-b pb-4">
                      <div className="flex items-center justify-between">
                        <Label 
                          htmlFor={`season-${season}`}
                          className="capitalize cursor-pointer"
                        >
                          {season}
                        </Label>
                        <Switch
                          id={`season-${season}`}
                          checked={localPreferences.seasonalPreferences[season].enabled}
                          onCheckedChange={() => handleSeasonToggle(season)}
                        />
                      </div>
                      
                      {localPreferences.seasonalPreferences[season].enabled && (
                        <div className="pt-2">
                          <p className="text-xs text-muted-foreground mb-4">
                            Temperature range: {localPreferences.seasonalPreferences[season].temperatureRange[0]}°C - {localPreferences.seasonalPreferences[season].temperatureRange[1]}°C
                          </p>
                          <Slider
                            value={[
                              localPreferences.seasonalPreferences[season].temperatureRange[0], 
                              localPreferences.seasonalPreferences[season].temperatureRange[1]
                            ]}
                            min={-10}
                            max={40}
                            step={1}
                            onValueChange={(values) => handleTemperatureRangeChange(season, values)}
                          />
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-muted-foreground">-10°C</span>
                            <span className="text-xs text-muted-foreground">40°C</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Daily Outfit Reminders</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="reminders">Enable daily reminders</Label>
                  <Switch
                    id="reminders"
                    checked={localPreferences.outfitReminders}
                    onCheckedChange={handleReminderToggle}
                  />
                </div>
                
                {localPreferences.outfitReminders && (
                  <div className="space-y-2">
                    <Label htmlFor="reminder-time">Reminder time</Label>
                    <Input
                      id="reminder-time"
                      type="time"
                      value={localPreferences.reminderTime}
                      onChange={(e) => handleReminderTimeChange(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreferencesModal;
