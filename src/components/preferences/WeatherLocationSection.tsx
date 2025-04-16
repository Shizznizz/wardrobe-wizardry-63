
import { useState } from 'react';
import { MapPin, CloudSun } from 'lucide-react';
import { UserPreferences } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface WeatherLocationSectionProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
}

const WeatherLocationSection = ({ preferences, setPreferences }: WeatherLocationSectionProps) => {
  // This would normally be connected to the preferences
  // This is for demo purposes only
  const [location, setLocation] = useState({
    city: "Amsterdam",
    country: "Netherlands"
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-purple-400" />
        <h3 className="text-base font-medium text-white">Weather & Location</h3>
      </div>
      
      <div className="rounded-lg border border-white/10 p-4 space-y-6 bg-slate-900/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm text-white/90">Location-based styling</Label>
              <p className="text-xs text-white/60">Let Olivia consider local weather for outfit suggestions</p>
            </div>
            <Switch defaultChecked id="weather-based" />
          </div>
          
          <Separator className="bg-white/10" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm text-white/90">City</Label>
              <Input
                id="city"
                value={location.city}
                onChange={(e) => setLocation(prev => ({ ...prev, city: e.target.value }))}
                className="bg-slate-800/50 border-white/10 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm text-white/90">Country</Label>
              <Input
                id="country"
                value={location.country}
                onChange={(e) => setLocation(prev => ({ ...prev, country: e.target.value }))}
                className="bg-slate-800/50 border-white/10 text-white"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="text-xs border-white/20 text-white/70">
              Use Current Location
            </Button>
          </div>
          
          <Separator className="bg-white/10" />
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CloudSun className="h-5 w-5 text-blue-400" />
              <Label className="text-sm text-white/90">Climate Preferences</Label>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-white/70">Preferred climate conditions</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <Switch id="rainy-days" />
                  <Label htmlFor="rainy-days" className="text-sm text-white/90">Rainy days</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="hot-days" defaultChecked />
                  <Label htmlFor="hot-days" className="text-sm text-white/90">Hot days</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="cold-days" defaultChecked />
                  <Label htmlFor="cold-days" className="text-sm text-white/90">Cold days</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="windy-days" />
                  <Label htmlFor="windy-days" className="text-sm text-white/90">Windy days</Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherLocationSection;
