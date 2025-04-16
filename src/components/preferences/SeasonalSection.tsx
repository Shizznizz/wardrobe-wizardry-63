
import { useState } from 'react';
import { Calendar, Snowflake, Sun, Leaf, Flower, Check } from 'lucide-react';
import { UserPreferences, ClothingSeason } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SeasonalSectionProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
}

const SeasonalSection = ({ preferences, setPreferences }: SeasonalSectionProps) => {
  const [selectedGoToSeason, setSelectedGoToSeason] = useState<ClothingSeason | null>(null);
  
  const handleSeasonToggle = (season: ClothingSeason) => {
    setPreferences(prev => ({
      ...prev,
      seasonalPreferences: {
        ...prev.seasonalPreferences,
        [season]: {
          ...prev.seasonalPreferences[season],
          enabled: !prev.seasonalPreferences[season].enabled
        }
      }
    }));
  };

  const handleTemperatureRangeChange = (season: ClothingSeason, values: number[]) => {
    setPreferences(prev => ({
      ...prev,
      seasonalPreferences: {
        ...prev.seasonalPreferences,
        [season]: {
          ...prev.seasonalPreferences[season],
          temperatureRange: [values[0], values[1]]
        }
      }
    }));
  };
  
  const seasonIcons = {
    spring: <Flower className="h-5 w-5 text-pink-400" />,
    summer: <Sun className="h-5 w-5 text-yellow-400" />,
    autumn: <Leaf className="h-5 w-5 text-orange-400" />,
    winter: <Snowflake className="h-5 w-5 text-blue-400" />,
  };
  
  const seasonColors = {
    spring: "from-pink-500/20 to-green-500/20",
    summer: "from-yellow-500/20 to-orange-500/20",
    autumn: "from-orange-500/20 to-red-500/20",
    winter: "from-blue-500/20 to-purple-500/20",
  };
  
  const handleSaveGoToLook = (season: ClothingSeason) => {
    // Here you would save the "go-to look" for the season
    // This is just a placeholder for the UI demo
    toast.success(`"${season.charAt(0).toUpperCase() + season.slice(1)} Go-To Look" saved!`);
    setSelectedGoToSeason(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-purple-400" />
        <h3 className="text-base font-medium text-white">Seasonal Preferences</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(preferences.seasonalPreferences)
          .filter(([season]) => season !== 'all')
          .map(([season, seasonData]) => (
            <div 
              key={season}
              className={cn(
                "rounded-lg border p-4 space-y-4 bg-gradient-to-br",
                seasonData.enabled 
                  ? `border-${season}-500/30 ${seasonColors[season as ClothingSeason]}` 
                  : "border-white/10 from-slate-900/80 to-slate-900/80"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {seasonIcons[season as ClothingSeason]}
                  <h4 className="text-base font-medium capitalize text-white">{season}</h4>
                </div>
                <Switch 
                  checked={seasonData.enabled} 
                  onCheckedChange={() => handleSeasonToggle(season as ClothingSeason)} 
                />
              </div>
              
              {seasonData.enabled && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/70">Temperature Range</span>
                      <span className="text-xs font-medium text-white">
                        {seasonData.temperatureRange[0]}°C - {seasonData.temperatureRange[1]}°C
                      </span>
                    </div>
                    <Slider
                      value={[seasonData.temperatureRange[0], seasonData.temperatureRange[1]]}
                      min={-10}
                      max={40}
                      step={1}
                      onValueChange={(values) => handleTemperatureRangeChange(season as ClothingSeason, values)}
                    />
                    <div className="flex justify-between text-xs text-white/50">
                      <span>-10°C</span>
                      <span>40°C</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/70">Go-To Look</span>
                      {selectedGoToSeason === season ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleSaveGoToLook(season as ClothingSeason)}
                            className="p-1 rounded-full bg-green-500/20 hover:bg-green-500/30 transition-colors"
                          >
                            <Check className="h-3 w-3 text-green-400" />
                          </button>
                          <button
                            onClick={() => setSelectedGoToSeason(null)}
                            className="text-xs text-white/50 hover:text-white/80"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedGoToSeason(season as ClothingSeason)}
                          className="text-xs text-purple-400 hover:text-purple-300"
                        >
                          {seasonData.goToLook ? "Change" : "Set Look"}
                        </button>
                      )}
                    </div>
                    
                    {selectedGoToSeason === season ? (
                      <Select>
                        <SelectTrigger className="w-full bg-slate-800/50 border-white/10 text-white text-xs h-8">
                          <SelectValue placeholder="Select an outfit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="casual">Casual Everyday</SelectItem>
                          <SelectItem value="office">Office Chic</SelectItem>
                          <SelectItem value="weekend">Weekend Vibes</SelectItem>
                          <SelectItem value="evening">Evening Elegance</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      seasonData.goToLook && (
                        <div className="rounded bg-slate-800/50 px-3 py-1.5 text-xs text-white/80">
                          {seasonData.goToLook}
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SeasonalSection;
