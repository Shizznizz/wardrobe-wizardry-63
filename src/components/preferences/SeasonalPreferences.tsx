
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
  ThermometerIcon,
  CalendarIcon
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

type SeasonalPreferencesValue = Record<ClothingSeason, {
  enabled: boolean;
  temperatureRange: [number, number];
  timeOfYear?: [number, number]; // Added time of year range (1-3 for early, mid, late in season)
}>;

interface SeasonalPreferencesProps {
  value: SeasonalPreferencesValue;
  onChange: (value: SeasonalPreferencesValue) => void;
}

const SeasonalPreferences = ({ value, onChange }: SeasonalPreferencesProps) => {
  const [openSeason, setOpenSeason] = useState<string | null>(null);
  
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
  
  const handleTimeOfYearChange = (season: ClothingSeason, newRange: number[]) => {
    onChange({
      ...value,
      [season]: {
        ...value[season],
        timeOfYear: [newRange[0], newRange[1]] as [number, number]
      }
    });
  };
  
  const getTimeOfYearLabel = (value: number) => {
    if (value <= 1) return "Early";
    if (value <= 2) return "Mid";
    return "Late";
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
          const isOpen = openSeason === season;
          
          // Initialize timeOfYear if not present
          if (!preferences.timeOfYear) {
            preferences.timeOfYear = [1, 3]; // Default to full season range
          }
          
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
                <Collapsible
                  open={isOpen}
                  onOpenChange={(open) => setOpenSeason(open ? season : null)}
                  className="pt-2 space-y-4"
                >
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
                  
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full flex justify-between items-center p-0 h-8">
                      <span className="flex items-center gap-1 text-sm font-normal">
                        <CalendarIcon className="h-4 w-4" />
                        Advanced Settings
                      </span>
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Time of Year</span>
                        <span className="text-sm font-medium">
                          {getTimeOfYearLabel(preferences.timeOfYear![0])} - {getTimeOfYearLabel(preferences.timeOfYear![1])}
                        </span>
                      </div>
                      <Slider
                        value={[preferences.timeOfYear![0], preferences.timeOfYear![1]]}
                        min={1}
                        max={3}
                        step={0.1}
                        onValueChange={(values) => handleTimeOfYearChange(season as ClothingSeason, values)}
                        className="my-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Early</span>
                        <span>Mid</span>
                        <span>Late</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default SeasonalPreferences;
