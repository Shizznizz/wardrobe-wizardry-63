
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UserPreferences } from '@/lib/types';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

interface WardrobeBehaviorSectionProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences | null>>;
}

const WardrobeBehaviorSection = ({ preferences, setPreferences }: WardrobeBehaviorSectionProps) => {
  
  const handleToggleSetting = (setting: 'useOnlyWardrobe' | 'useTrendsGlobal' | 'useTrendsLocal') => {
    setPreferences(prev => {
      if (!prev) return prev;
      
      const newValue = !prev[setting];
      
      // Show feedback toast
      const settingLabels = {
        useOnlyWardrobe: 'Suggest outfits only from my wardrobe',
        useTrendsGlobal: 'Include global trends',
        useTrendsLocal: 'Include local trends'
      };
      
      toast.success(`${settingLabels[setting]} ${newValue ? 'enabled' : 'disabled'}`, {
        duration: 2000,
        position: 'bottom-center'
      });
      
      return {
        ...prev,
        [setting]: newValue
      };
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Wardrobe Usage Behavior</h3>
        <p className="text-white/70 text-sm mb-4">
          These settings determine how Olivia uses your wardrobe data and trends to provide recommendations.
        </p>
      </div>
      
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Suggest outfits only from my wardrobe</Label>
              <CardDescription className="text-sm text-white/60">
                When enabled, outfit suggestions will only include items you've added to your wardrobe
              </CardDescription>
            </div>
            <Switch
              checked={preferences.useOnlyWardrobe || false}
              onCheckedChange={() => handleToggleSetting('useOnlyWardrobe')}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Include global trends in suggestions</Label>
              <CardDescription className="text-sm text-white/60">
                Get recommendations influenced by worldwide fashion trends
              </CardDescription>
            </div>
            <Switch
              checked={preferences.useTrendsGlobal || false}
              onCheckedChange={() => handleToggleSetting('useTrendsGlobal')}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Include local trends in suggestions</Label>
              <CardDescription className="text-sm text-white/60">
                Get recommendations influenced by trends in your region
              </CardDescription>
            </div>
            <Switch
              checked={preferences.useTrendsLocal || false}
              onCheckedChange={() => handleToggleSetting('useTrendsLocal')}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WardrobeBehaviorSection;
