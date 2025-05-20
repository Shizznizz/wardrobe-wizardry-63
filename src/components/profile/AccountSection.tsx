import React from 'react';
import { UserPreferences } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2, LogOut, MoonStar, Sun, MonitorSmartphone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface AccountSectionProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences | null>>;
}

const AccountSection: React.FC<AccountSectionProps> = ({ preferences, setPreferences }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  
  const handleAppearanceChange = (setting: string, value: any) => {
    setPreferences(prev => {
      if (!prev) return prev;
      
      // Create or update appearance settings
      const currentSettings = prev.appearanceSettings || {
        theme: 'system',
        highContrast: false,
        reduceMotion: false
      };
      
      return {
        ...prev,
        appearanceSettings: {
          ...currentSettings,
          [setting]: value
        }
      };
    });
  };
  
  const handleSignOut = async () => {
    if (!user || isSigningOut) return;
    
    try {
      setIsSigningOut(true);
      await signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    } finally {
      setIsSigningOut(false);
    }
  };
  
  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <MoonStar className="h-4 w-4" />;
      default:
        return <MonitorSmartphone className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Display Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <RadioGroup 
              value={preferences.appearanceSettings?.theme || 'system'}
              onValueChange={value => handleAppearanceChange('theme', value)}
              className="flex flex-wrap gap-3"
            >
              {['system', 'light', 'dark'].map(theme => (
                <div key={theme} className="flex items-center">
                  <RadioGroupItem 
                    value={theme} 
                    id={`theme-${theme}`} 
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`theme-${theme}`}
                    className="flex items-center gap-2 rounded-md border border-white/20 bg-slate-900/50 px-3 py-2 text-sm hover:bg-slate-800/50 hover:text-white peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-900/20 peer-data-[state=checked]:text-purple-300 cursor-pointer"
                  >
                    {getThemeIcon(theme)}
                    <span className="capitalize">{theme}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="high-contrast" className="text-sm font-medium block">High contrast mode</Label>
              <p className="text-xs text-white/50">Increase contrast for better readability</p>
            </div>
            <Switch
              id="high-contrast"
              checked={preferences.appearanceSettings?.highContrast || false}
              onCheckedChange={value => handleAppearanceChange('highContrast', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reduce-motion" className="text-sm font-medium block">Reduce motion</Label>
              <p className="text-xs text-white/50">Minimize animations throughout the app</p>
            </div>
            <Switch
              id="reduce-motion"
              checked={preferences.appearanceSettings?.reduceMotion || false}
              onCheckedChange={value => handleAppearanceChange('reduceMotion', value)}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Account Management</h3>
        <Card className="bg-slate-800/30 border-white/10 p-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/80">
                Email: <span className="font-medium text-white">{user?.email}</span>
              </p>
              {user?.user_metadata?.provider && (
                <p className="text-xs text-white/50">
                  Sign-in method: {user.user_metadata.provider}
                </p>
              )}
            </div>
            
            {/* Add more account management options here if needed */}
            
            <div className="flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="bg-red-900/30 text-red-300 hover:bg-red-900/50"
              >
                {isSigningOut ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                Sign Out
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountSection;
