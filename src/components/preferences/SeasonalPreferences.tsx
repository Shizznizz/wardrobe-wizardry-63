
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ClothingSeason } from '@/lib/types';
import { useState } from 'react';
import { 
  SunIcon, 
  Leaf, 
  Snowflake,
  Flower,
  ThermometerIcon
} from 'lucide-react';

type SeasonalPreferencesValue = Record<ClothingSeason, {
  enabled: boolean;
  temperatureRange: [number, number];
}>;

interface SeasonalPreferencesProps {
  value: SeasonalPreferencesValue;
  onChange: (value: SeasonalPreferencesValue) => void;
}

const SeasonalPreferences = ({ value, onChange }: SeasonalPreferencesProps) => {
  const seasonIcons = {
    spring: Flower,
    summer: SunIcon,
    autumn: Leaf,
    winter: Snowflake,
    all: ThermometerIcon
  };

  const handleToggleSeason = (season: ClothingSeason) => {
    onChange({
      ...value,
      [season]: {
        ...value[season],
        enabled: !value[season].enabled
      }
    });
  };

  const handleTemperatureRangeChange = (season: ClothingSeason, newRange: number[]) => {
    onChange({
      ...value,
      [season]: {
        ...value[season],
        temperatureRange: [newRange[0], newRange[1]] as [number, number]
      }
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Adjust temperature ranges for each season to receive more accurate outfit recommendations.
      </p>
      
      {Object.entries(value)
        .filter(([season]) => season !== 'all')
        .map(([season, preferences]) => {
          const SeasonIcon = seasonIcons[season as ClothingSeason];
          
          return (
            <div key={season} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {SeasonIcon && <SeasonIcon className="w-5 h-5 text-primary" />}
                  <Label className="text-lg font-medium capitalize">{season}</Label>
                </div>
                <Switch 
                  checked={preferences.enabled} 
                  onCheckedChange={() => handleToggleSeason(season as ClothingSeason)} 
                />
              </div>
              
              {preferences.enabled && (
                <div className="pt-2 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Temperature Range</span>
                      <span className="text-sm font-medium">
                        {preferences.temperatureRange[0]}°C - {preferences.temperatureRange[1]}°C
                      </span>
                    </div>
                    <Slider
                      value={[preferences.temperatureRange[0], preferences.temperatureRange[1]]}
                      min={-10}
                      max={40}
                      step={1}
                      onValueChange={(values) => handleTemperatureRangeChange(season as ClothingSeason, values)}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>-10°C</span>
                      <span>40°C</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default SeasonalPreferences;
