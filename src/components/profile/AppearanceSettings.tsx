
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const AppearanceSettings = () => {
  // These would typically be stored in application state and persisted to user preferences
  const [theme, setTheme] = useState('system');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Appearance</h3>
        <p className="text-white/70 text-sm">
          Customize how Olivia looks and feels
        </p>
      </div>
      
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-base">Theme</Label>
            <RadioGroup 
              value={theme} 
              onValueChange={setTheme} 
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="cursor-pointer">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="cursor-pointer">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="cursor-pointer">System</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Reduce motion</Label>
              <p className="text-sm text-white/60">
                Minimize animations throughout the app
              </p>
            </div>
            <Switch
              checked={reduceMotion}
              onCheckedChange={setReduceMotion}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">High contrast mode</Label>
              <p className="text-sm text-white/60">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch
              checked={highContrast}
              onCheckedChange={setHighContrast}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;
