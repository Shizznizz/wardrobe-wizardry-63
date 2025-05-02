
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ContextAdjustmentSectionProps {
  season: string;
  occasion: string;
  timeOfDay: string;
  temperature: number;
  weatherCondition: string;
  onContextChange: (contextKey: string, value: string | number) => void;
  onRefreshOutfit: () => void;
}

const ContextAdjustmentSection = ({
  season,
  occasion,
  timeOfDay,
  temperature,
  weatherCondition,
  onContextChange,
  onRefreshOutfit
}: ContextAdjustmentSectionProps) => {
  const seasons = ['spring', 'summer', 'autumn', 'winter'];
  const occasions = ['casual', 'formal', 'business', 'sport', 'party'];
  const timesOfDay = ['morning', 'afternoon', 'evening', 'night'];
  const weatherConditions = ['clear', 'cloudy', 'rainy', 'snowy'];

  const stylePreferences = [
    { value: 'minimal', label: 'Minimal' },
    { value: 'chic', label: 'Chic' },
    { value: 'boho', label: 'Boho' },
    { value: 'edgy', label: 'Edgy' },
    { value: 'casual', label: 'Casual' },
    { value: 'preppy', label: 'Preppy' }
  ];
  
  return (
    <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-white text-lg">Fine-Tune Style Context</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-purple-300 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900/95 border-purple-500/20 text-white max-w-xs">
                  <p>Adjust these settings to refine Olivia's outfit recommendations. 
                  Changes will affect what style elements are prioritized in your suggestions.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-white/70 text-sm">
            Customize how Olivia selects outfits for you by adjusting style parameters
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-purple-400/30 text-white hover:bg-white/10 whitespace-nowrap"
          onClick={onRefreshOutfit}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh Outfit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="season" className="text-sm text-white/80">Season</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-purple-300/70 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900/95 border-purple-500/20 text-white">
                    <p>Affects fabric weight, colors, and layering options</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={season}
              onValueChange={(value) => onContextChange('season', value)}
            >
              <SelectTrigger className="bg-slate-800/50 border-white/10">
                <SelectValue placeholder="Choose season" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {seasons.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="occasion" className="text-sm text-white/80">Occasion</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-purple-300/70 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900/95 border-purple-500/20 text-white">
                    <p>Determines formality level and appropriate attire type</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={occasion}
              onValueChange={(value) => onContextChange('occasion', value)}
            >
              <SelectTrigger className="bg-slate-800/50 border-white/10">
                <SelectValue placeholder="Choose occasion" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {occasions.map((o) => (
                  <SelectItem key={o} value={o} className="capitalize">{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="style" className="text-sm text-white/80">Style Preference</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-purple-300/70 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900/95 border-purple-500/20 text-white">
                    <p>Influences the overall aesthetic of your outfit recommendations</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              defaultValue="chic"
              onValueChange={(value) => onContextChange('stylePreference', value)}
            >
              <SelectTrigger className="bg-slate-800/50 border-white/10">
                <SelectValue placeholder="Choose style" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {stylePreferences.map((style) => (
                  <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="timeOfDay" className="text-sm text-white/80">Time of Day</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-purple-300/70 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900/95 border-purple-500/20 text-white">
                    <p>Affects color palette and outfit formality</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={timeOfDay}
              onValueChange={(value) => onContextChange('timeOfDay', value)}
            >
              <SelectTrigger className="bg-slate-800/50 border-white/10">
                <SelectValue placeholder="Choose time" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {timesOfDay.map((t) => (
                  <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature" className="text-sm text-white/80">Temperature</Label>
              <Badge variant="outline" className="bg-transparent border-white/10">
                {temperature}°C
              </Badge>
            </div>
            <Slider
              id="temperature"
              min={-10}
              max={40}
              step={1}
              value={[temperature]}
              onValueChange={(values) => onContextChange('temperature', values[0])}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-white/50">
              <span>Cold</span>
              <span>Mild</span>
              <span>Hot</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="weatherCondition" className="text-sm text-white/80">Weather Condition</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-purple-300/70 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900/95 border-purple-500/20 text-white">
                    <p>Influences fabric types and outfit practicality</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={weatherCondition}
              onValueChange={(value) => onContextChange('weatherCondition', value)}
            >
              <SelectTrigger className="bg-slate-800/50 border-white/10">
                <SelectValue placeholder="Choose condition" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {weatherConditions.map((w) => (
                  <SelectItem key={w} value={w} className="capitalize">{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextAdjustmentSection;
