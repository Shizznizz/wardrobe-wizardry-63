
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Calendar, 
  Clock, 
  Leaf, 
  Luggage, 
  RefreshCw, 
  Sun, 
  Thermometer 
} from 'lucide-react';

interface ContextAdjustmentSectionProps {
  season: string;
  occasion: string;
  timeOfDay: string;
  temperature: number;
  weatherCondition: string;
  onContextChange: (key: string, value: string | number) => void;
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
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/50 backdrop-blur-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Adjust Context & Weather</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-400/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                onClick={onRefreshOutfit}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Look
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-900 text-white">
              <p>Get a new outfit based on your current settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Season selector */}
        <div className="space-y-2">
          <Label className="flex items-center text-white">
            <Leaf className="h-4 w-4 mr-2 text-green-400" />
            Season
          </Label>
          <Select 
            value={season} 
            onValueChange={(value) => onContextChange('season', value)}
          >
            <SelectTrigger className="bg-slate-800/70 border-white/10">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white">
              <SelectItem value="spring">Spring</SelectItem>
              <SelectItem value="summer">Summer</SelectItem>
              <SelectItem value="autumn">Autumn</SelectItem>
              <SelectItem value="winter">Winter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Occasion selector */}
        <div className="space-y-2">
          <Label className="flex items-center text-white">
            <Luggage className="h-4 w-4 mr-2 text-yellow-400" />
            Occasion
          </Label>
          <Select 
            value={occasion} 
            onValueChange={(value) => onContextChange('occasion', value)}
          >
            <SelectTrigger className="bg-slate-800/70 border-white/10">
              <SelectValue placeholder="Select occasion" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white">
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="sport">Sport</SelectItem>
              <SelectItem value="party">Party</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Time of day selector */}
        <div className="space-y-2">
          <Label className="flex items-center text-white">
            <Clock className="h-4 w-4 mr-2 text-blue-400" />
            Time of Day
          </Label>
          <Select 
            value={timeOfDay} 
            onValueChange={(value) => onContextChange('timeOfDay', value)}
          >
            <SelectTrigger className="bg-slate-800/70 border-white/10">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white">
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="afternoon">Afternoon</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
              <SelectItem value="night">Night</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Temperature slider */}
        <div className="space-y-4 lg:col-span-2">
          <Label className="flex items-center text-white">
            <Thermometer className="h-4 w-4 mr-2 text-red-400" />
            Temperature: {temperature}°C
          </Label>
          <Slider
            value={[temperature]}
            min={-10}
            max={40}
            step={1}
            onValueChange={(value) => onContextChange('temperature', value[0])}
            className="py-4"
          />
        </div>
        
        {/* Weather condition selector */}
        <div className="space-y-2">
          <Label className="flex items-center text-white">
            <Sun className="h-4 w-4 mr-2 text-amber-400" />
            Weather Condition
          </Label>
          <Select 
            value={weatherCondition} 
            onValueChange={(value) => onContextChange('weatherCondition', value)}
          >
            <SelectTrigger className="bg-slate-800/70 border-white/10">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white">
              <SelectItem value="clear">Clear</SelectItem>
              <SelectItem value="cloudy">Cloudy</SelectItem>
              <SelectItem value="rain">Rain</SelectItem>
              <SelectItem value="snow">Snow</SelectItem>
              <SelectItem value="fog">Fog</SelectItem>
              <SelectItem value="windy">Windy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-white/10 flex justify-center">
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md shadow-purple-900/20"
          onClick={onRefreshOutfit}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Update Recommendations
        </Button>
      </div>
    </div>
  );
};

export default ContextAdjustmentSection;
