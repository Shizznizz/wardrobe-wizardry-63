
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UserPreferences } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LocationSelector from '@/components/location/LocationSelector';
import { useLocationStorage } from '@/hooks/useLocationStorage';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface LocationSectionProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences | null>>;
}

const LocationSection = ({ preferences, setPreferences }: LocationSectionProps) => {
  const { savedLocation } = useLocationStorage();
  
  const handleTemperatureUnitChange = (value: string) => {
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        temperatureUnit: value as 'C' | 'F'
      };
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Location Settings</h3>
        <p className="text-white/70 text-sm mb-4">
          Your location is used to provide weather-based style recommendations across all Olivia features. 
          This helps make outfit suggestions more relevant to your current conditions.
        </p>
      </div>
      
      <Card className="bg-slate-800/30 border-white/10">
        <CardHeader>
          <CardTitle>Select Your Location</CardTitle>
          <CardDescription>
            Choose your city for personalized weather-based style recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LocationSelector className="max-w-sm" />
          {savedLocation && (
            <p className="text-sm text-white/60">
              Current location: {savedLocation.city}, {savedLocation.country}
            </p>
          )}
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <Label className="text-base">Temperature Unit</Label>
        <RadioGroup 
          value={preferences.temperatureUnit || 'C'} 
          onValueChange={handleTemperatureUnitChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="C" id="celsius" />
            <Label htmlFor="celsius" className="cursor-pointer">Celsius (°C)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="F" id="fahrenheit" />
            <Label htmlFor="fahrenheit" className="cursor-pointer">Fahrenheit (°F)</Label>
          </div>
        </RadioGroup>
        <p className="text-sm text-white/60">
          This setting affects how temperature is displayed throughout the app
        </p>
      </div>
    </div>
  );
};

export default LocationSection;
