
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Cloud, 
  CloudSun, 
  Droplets, 
  Snowflake, 
  Sun, 
  ThermometerIcon,
  Landmark,
  Mountain
} from 'lucide-react';
import { useCallback } from 'react';

interface ClimatePreferencesProps {
  value: string[];
  onChange: (climates: string[]) => void;
}

const ClimatePreferences = ({ value, onChange }: ClimatePreferencesProps) => {
  const climates = [
    { id: 'tropical', label: 'Tropical (Hot & Humid)', icon: Sun, description: 'Hot and humid year-round' },
    { id: 'desert', label: 'Desert (Hot & Dry)', icon: ThermometerIcon, description: 'Hot days, cool nights, very dry' },
    { id: 'temperate_oceanic', label: 'Temperate Oceanic', icon: CloudSun, description: 'Mild temperatures, influenced by oceans' },
    { id: 'temperate_mediterranean', label: 'Temperate Mediterranean', icon: Landmark, description: 'Warm dry summers, mild wet winters' },
    { id: 'continental_humid', label: 'Continental Humid', icon: Cloud, description: 'Hot summers, cold winters, year-round precipitation' },
    { id: 'continental_subarctic', label: 'Continental Subarctic', icon: Mountain, description: 'Short summers, very cold winters' },
    { id: 'polar', label: 'Polar', icon: Snowflake, description: 'Very cold year-round' },
    { id: 'coastal', label: 'Coastal', icon: Droplets, description: 'Mild, influenced by the ocean' }
  ];

  // Memoize the handleChange function to prevent unnecessary re-renders
  const handleChange = useCallback((climateId: string) => {
    // For climate, we'll only allow selecting one option
    onChange([climateId]);
  }, [onChange]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select your primary climate zone for more relevant outfit suggestions.
      </p>
      
      <RadioGroup 
        value={value[0] || ''} 
        onValueChange={handleChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {climates.map((climate) => {
          const Icon = climate.icon;
          return (
            <div 
              key={climate.id}
              className="relative flex items-center space-x-3 rounded-md border p-3 cursor-pointer transition-all hover:bg-muted/50 z-0"
              onClick={() => handleChange(climate.id)}
            >
              <RadioGroupItem 
                value={climate.id} 
                id={`climate-${climate.id}`}
                className="z-10" 
              />
              <div className="flex-1 z-10">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4 text-primary" />}
                  <Label
                    htmlFor={`climate-${climate.id}`}
                    className="cursor-pointer font-medium"
                  >
                    {climate.label}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{climate.description}</p>
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default ClimatePreferences;
