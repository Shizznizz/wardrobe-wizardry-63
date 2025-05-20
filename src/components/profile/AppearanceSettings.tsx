
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AppearanceSettings = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState('system');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [initialValues, setInitialValues] = useState({
    theme: 'system',
    reduceMotion: false,
    highContrast: false
  });
  
  // Load appearance settings from localStorage and supabase
  useEffect(() => {
    // First check localStorage for immediate visual settings
    const storedTheme = localStorage.getItem('theme') || 'system';
    const storedReduceMotion = localStorage.getItem('reduceMotion') === 'true';
    const storedHighContrast = localStorage.getItem('highContrast') === 'true';
    
    setTheme(storedTheme);
    setReduceMotion(storedReduceMotion);
    setHighContrast(storedHighContrast);
    
    // Set initial values for detecting changes
    setInitialValues({
      theme: storedTheme,
      reduceMotion: storedReduceMotion,
      highContrast: storedHighContrast
    });
    
    // Apply the settings to the document
    applyTheme(storedTheme);
    applyReduceMotion(storedReduceMotion);
    applyHighContrast(storedHighContrast);
    
    // Then try to fetch from Supabase if user is logged in
    if (user) {
      fetchAppearanceSettings();
    }
  }, [user]);
  
  const fetchAppearanceSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('appearance_settings')
        .eq('user_id', user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching appearance settings:", error);
        return;
      }
      
      if (data?.appearance_settings) {
        const { theme: serverTheme, reduceMotion: serverReduceMotion, highContrast: serverHighContrast } = data.appearance_settings;
        
        // Only update if values exist and differ from localStorage
        if (serverTheme) {
          setTheme(serverTheme);
          setInitialValues(prev => ({ ...prev, theme: serverTheme }));
          localStorage.setItem('theme', serverTheme);
          applyTheme(serverTheme);
        }
        
        if (serverReduceMotion !== undefined) {
          setReduceMotion(serverReduceMotion);
          setInitialValues(prev => ({ ...prev, reduceMotion: serverReduceMotion }));
          localStorage.setItem('reduceMotion', serverReduceMotion.toString());
          applyReduceMotion(serverReduceMotion);
        }
        
        if (serverHighContrast !== undefined) {
          setHighContrast(serverHighContrast);
          setInitialValues(prev => ({ ...prev, highContrast: serverHighContrast }));
          localStorage.setItem('highContrast', serverHighContrast.toString());
          applyHighContrast(serverHighContrast);
        }
      }
    } catch (error) {
      console.error("Failed to fetch appearance settings:", error);
    }
  };
  
  // Save appearance settings both to localStorage and Supabase
  const saveAppearanceSettings = async () => {
    // Always save to localStorage for immediate effect
    localStorage.setItem('theme', theme);
    localStorage.setItem('reduceMotion', reduceMotion.toString());
    localStorage.setItem('highContrast', highContrast.toString());
    
    // Update initial values to reflect saved state
    setInitialValues({
      theme,
      reduceMotion,
      highContrast
    });
    
    // If user is logged in, save to Supabase as well
    if (user) {
      try {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            appearance_settings: {
              theme,
              reduceMotion,
              highContrast
            }
          }, { onConflict: 'user_id' });
        
        if (error) {
          console.error("Error saving appearance settings:", error);
          toast.error("Failed to save appearance settings");
        } else {
          toast.success("Appearance settings saved");
        }
      } catch (error) {
        console.error("Failed to save appearance settings:", error);
        toast.error("Failed to save appearance settings");
      }
    }
  };
  
  // Apply theme to document
  const applyTheme = (themeValue: string) => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (themeValue === 'dark' || (themeValue === 'system' && prefersDark)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };
  
  // Apply reduce motion to document
  const applyReduceMotion = (reduce: boolean) => {
    const root = document.documentElement;
    if (reduce) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  };
  
  // Apply high contrast to document
  const applyHighContrast = (contrast: boolean) => {
    const root = document.documentElement;
    if (contrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  };
  
  const handleThemeChange = (value: string) => {
    setTheme(value);
    applyTheme(value);
    saveAppearanceSettings();
  };
  
  const handleReduceMotionChange = (checked: boolean) => {
    setReduceMotion(checked);
    applyReduceMotion(checked);
    saveAppearanceSettings();
  };
  
  const handleHighContrastChange = (checked: boolean) => {
    setHighContrast(checked);
    applyHighContrast(checked);
    saveAppearanceSettings();
  };
  
  // Check if any values have changed
  const hasChanges = () => {
    return (
      theme !== initialValues.theme ||
      reduceMotion !== initialValues.reduceMotion ||
      highContrast !== initialValues.highContrast
    );
  };
  
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
              onValueChange={handleThemeChange} 
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
              onCheckedChange={handleReduceMotionChange}
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
              onCheckedChange={handleHighContrastChange}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;
