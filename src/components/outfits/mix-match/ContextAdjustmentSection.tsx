
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Sun, Wind, Thermometer, Clock, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';

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
  const [tempValue, setTempValue] = useState([temperature]);
  
  const handleTemperatureChange = (value: number[]) => {
    setTempValue(value);
    onContextChange('temperature', value[0]);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Adjust Context
        </h2>
        
        <Button 
          onClick={onRefreshOutfit}
          variant="outline" 
          size="sm"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Outfit
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <Card className="bg-slate-800/50 border-white/10 shadow-md">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
              <Calendar className="h-4 w-4 text-blue-400" />
              <Label>Season</Label>
            </div>
            <Select 
              value={season} 
              onValueChange={(value) => onContextChange('season', value)}
            >
              <SelectTrigger className="bg-slate-700/60 border-slate-600/50 text-white">
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700/50">
                <SelectItem value="spring">Spring</SelectItem>
                <SelectItem value="summer">Summer</SelectItem>
                <SelectItem value="autumn">Autumn</SelectItem>
                <SelectItem value="winter">Winter</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-white/10 shadow-md">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
              <Tag className="h-4 w-4 text-purple-400" />
              <Label>Occasion</Label>
            </div>
            <Select 
              value={occasion} 
              onValueChange={(value) => onContextChange('occasion', value)}
            >
              <SelectTrigger className="bg-slate-700/60 border-slate-600/50 text-white">
                <SelectValue placeholder="Select occasion" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700/50">
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="party">Party</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-white/10 shadow-md">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
              <Clock className="h-4 w-4 text-orange-400" />
              <Label>Time of Day</Label>
            </div>
            <Select 
              value={timeOfDay} 
              onValueChange={(value) => onContextChange('timeOfDay', value)}
            >
              <SelectTrigger className="bg-slate-700/60 border-slate-600/50 text-white">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700/50">
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-white/10 shadow-md">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
              <Wind className="h-4 w-4 text-cyan-400" />
              <Label>Weather</Label>
            </div>
            <Select 
              value={weatherCondition} 
              onValueChange={(value) => onContextChange('weatherCondition', value)}
            >
              <SelectTrigger className="bg-slate-700/60 border-slate-600/50 text-white">
                <SelectValue placeholder="Select weather" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700/50">
                <SelectItem value="clear">Clear</SelectItem>
                <SelectItem value="clouds">Cloudy</SelectItem>
                <SelectItem value="rain">Rain</SelectItem>
                <SelectItem value="snow">Snow</SelectItem>
                <SelectItem value="windy">Windy</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-white/10 shadow-md">
          <CardContent className="p-3">
            <div className="flex items-center justify-between text-white/80 text-sm mb-2">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-red-400" />
                <Label>Temperature</Label>
              </div>
              <span className="text-white font-medium">{tempValue[0]}°C</span>
            </div>
            <Slider 
              value={tempValue}
              onValueChange={handleTemperatureChange}
              max={40}
              min={-10}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-white/50 mt-1">
              <span>-10°C</span>
              <span>40°C</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContextAdjustmentSection;
