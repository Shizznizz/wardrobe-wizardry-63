
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, CloudSun, Calendar, RefreshCw, Thermometer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  const handleSeasonChange = (value: string) => {
    onContextChange('season', value);
  };

  const handleOccasionChange = (value: string) => {
    onContextChange('occasion', value);
  };

  const handleTimeOfDayChange = (value: string) => {
    onContextChange('timeOfDay', value);
  };

  const handleTemperatureChange = (value: number[]) => {
    onContextChange('temperature', value[0]);
  };

  const handleWeatherConditionChange = (value: string) => {
    onContextChange('weatherCondition', value);
  };

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/50 backdrop-blur-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Adjust Your Style Context</h3>
        <Button 
          variant="outline"
          size="sm"
          onClick={onRefreshOutfit}
          className="bg-slate-800/60 border-white/10 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Outfit
        </Button>
      </div>
      
      <p className="text-white/70 text-sm mb-6">
        Fine-tune your outfit recommendations by adjusting these parameters
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-slate-800/50 border-white/5">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-white">Season</h4>
              <Badge variant="outline" className="bg-slate-700/50 text-xs">
                {season.charAt(0).toUpperCase() + season.slice(1)}
              </Badge>
            </div>
            <Select value={season} onValueChange={handleSeasonChange}>
              <SelectTrigger className="bg-slate-700/50 border-white/10">
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                <SelectItem value="spring">Spring</SelectItem>
                <SelectItem value="summer">Summer</SelectItem>
                <SelectItem value="fall">Fall</SelectItem>
                <SelectItem value="winter">Winter</SelectItem>
                <SelectItem value="all">All Seasons</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-white/5">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-white">Occasion</h4>
              <Badge variant="outline" className="bg-slate-700/50 text-xs">
                {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
              </Badge>
            </div>
            <Select value={occasion} onValueChange={handleOccasionChange}>
              <SelectTrigger className="bg-slate-700/50 border-white/10">
                <SelectValue placeholder="Select occasion" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="party">Party</SelectItem>
                <SelectItem value="sport">Sport/Active</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-white/5">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-white">Time of Day</h4>
              <div className="flex items-center">
                {timeOfDay === 'morning' && <Sun className="h-4 w-4 text-yellow-400 mr-1" />}
                {timeOfDay === 'afternoon' && <CloudSun className="h-4 w-4 text-blue-400 mr-1" />}
                {timeOfDay === 'evening' && <Moon className="h-4 w-4 text-purple-400 mr-1" />}
                <Badge variant="outline" className="bg-slate-700/50 text-xs">
                  {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
                </Badge>
              </div>
            </div>
            <RadioGroup
              value={timeOfDay}
              onValueChange={handleTimeOfDayChange}
              className="flex justify-between"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="morning" id="morning" className="text-yellow-400" />
                <Label htmlFor="morning" className="text-white/80 text-sm">Morning</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="afternoon" id="afternoon" className="text-blue-400" />
                <Label htmlFor="afternoon" className="text-white/80 text-sm">Afternoon</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="evening" id="evening" className="text-purple-400" />
                <Label htmlFor="evening" className="text-white/80 text-sm">Evening</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-white/5">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-white">Weather Condition</h4>
              <Badge variant="outline" className="bg-slate-700/50 text-xs">
                {weatherCondition.charAt(0).toUpperCase() + weatherCondition.slice(1)}
              </Badge>
            </div>
            <Select value={weatherCondition} onValueChange={handleWeatherConditionChange}>
              <SelectTrigger className="bg-slate-700/50 border-white/10">
                <SelectValue placeholder="Select weather" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                <SelectItem value="clear">Clear</SelectItem>
                <SelectItem value="cloudy">Cloudy</SelectItem>
                <SelectItem value="rainy">Rainy</SelectItem>
                <SelectItem value="snowy">Snowy</SelectItem>
                <SelectItem value="windy">Windy</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-slate-800/50 border-white/5 mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Thermometer className="h-4 w-4 mr-2 text-red-400" />
              <h4 className="text-sm font-medium text-white">Temperature</h4>
            </div>
            <Badge variant="outline" className="bg-slate-700/50 text-xs">
              {temperature}°C
            </Badge>
          </div>
          <Slider 
            defaultValue={[temperature]} 
            min={-10} 
            max={40} 
            step={1}
            onValueChange={handleTemperatureChange}
            className="mt-6"
          />
          <div className="flex justify-between mt-2 text-xs text-white/60">
            <span>Cold</span>
            <span>Cool</span>
            <span>Mild</span>
            <span>Warm</span>
            <span>Hot</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextAdjustmentSection;
