
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const AppearanceSettings = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState('system');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Load appearance settings from local storage and/or database
  useEffect(() => {
    // First load from localStorage for immediate UI update
    const storedTheme = localStorage.getItem('olivia-theme');
    const storedReduceMotion = localStorage.getItem('olivia-reduce-motion') === 'true';
    const storedHighContrast = localStorage.getItem('olivia-high-contrast') === 'true';
    
    if (storedTheme) setTheme(storedTheme);
    setReduceMotion(storedReduceMotion);
    setHighContrast(storedHighContrast);
    
    // Then load from database if user is authenticated
    if (user) {
      loadAppearanceSettings();
    }
    
    // Apply the current settings
    applyAppearanceSettings(storedTheme || theme, storedReduceMotion, storedHighContrast);
    
    setInitialLoad(false);
  }, [user]);
  
  // Save settings when they change (but not during initial load)
  useEffect(() => {
    if (initialLoad) return;
    
    // Save to localStorage for immediate effect and guest users
    localStorage.setItem('olivia-theme', theme);
    localStorage.setItem('olivia-reduce-motion', reduceMotion.toString());
    localStorage.setItem('olivia-high-contrast', highContrast.toString());
    
    // Apply the settings visually
    applyAppearanceSettings(theme, reduceMotion, highContrast);
    
    // Save to database if user is authenticated
    if (user) {
      saveAppearanceSettings();
    }
  }, [theme, reduceMotion, highContrast, initialLoad, user]);
  
  const loadAppearanceSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('appearance_settings')
        .eq('user_id', user!.id)
        .single();
        
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error loading appearance settings:', error);
        }
        return;
      }
      
      if (data?.appearance_settings) {
        setTheme(data.appearance_settings.theme || 'system');
        setReduceMotion(data.appearance_settings.reduceMotion || false);
        setHighContrast(data.appearance_settings.highContrast || false);
      }
    } catch (error) {
      console.error('Failed to load appearance settings:', error);
    }
  };
  
  const saveAppearanceSettings = async () => {
    try {
      const appearanceSettings = {
        theme,
        reduceMotion,
        highContrast
      };
      
      const { error } = await supabase
        .from('user_preferences')
        .update({ appearance_settings: appearanceSettings })
        .eq('user_id', user!.id);
      
      if (error) {
        console.error('Error saving appearance settings:', error);
      }
    } catch (error) {
      console.error('Failed to save appearance settings:', error);
    }
  };
  
  const applyAppearanceSettings = (theme: string, reduceMotion: boolean, highContrast: boolean) => {
    // Apply theme
    document.documentElement.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.add(theme);
    }
    
    // Apply reduce motion
    if (reduceMotion) {
      document.documentElement.style.setProperty('--olivia-motion', 'none');
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.style.removeProperty('--olivia-motion');
      document.documentElement.classList.remove('reduce-motion');
    }
    
    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
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
              onValueChange={(value) => {
                setTheme(value);
                toast.success(`Theme changed to ${value === 'system' ? 'system default' : value}`, {
                  duration: 2000
                });
              }} 
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
              onCheckedChange={(checked) => {
                setReduceMotion(checked);
                toast.success(`Reduced motion ${checked ? 'enabled' : 'disabled'}`, {
                  duration: 2000
                });
              }}
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
              onCheckedChange={(checked) => {
                setHighContrast(checked);
                toast.success(`High contrast mode ${checked ? 'enabled' : 'disabled'}`, {
                  duration: 2000
                });
              }}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;
