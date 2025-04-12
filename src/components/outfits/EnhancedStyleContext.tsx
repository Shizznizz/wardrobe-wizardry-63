
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Calendar, Sun, Wind, Droplets, Thermometer, Clock } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const EnhancedStyleContext = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('spring');
  const [selectedWeather, setSelectedWeather] = useState('partly-cloudy');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('morning');
  const [temperature, setTemperature] = useState([18]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full bg-gradient-to-br from-indigo-950/40 to-purple-950/40 rounded-xl border border-white/10 shadow-lg overflow-hidden backdrop-blur-sm"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-400" />
              <h3 className="font-medium text-white">Style Context</h3>
            </div>
            
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="p-4 pt-0 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-white/70 block">Season</label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger className="bg-slate-800/60 border-slate-700/50">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700/50">
                    <SelectItem value="spring">Spring</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="autumn">Autumn</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-white/70 block">Weather</label>
                <Select value={selectedWeather} onValueChange={setSelectedWeather}>
                  <SelectTrigger className="bg-slate-800/60 border-slate-700/50">
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700/50">
                    <SelectItem value="clear">Clear</SelectItem>
                    <SelectItem value="partly-cloudy">Partly Cloudy</SelectItem>
                    <SelectItem value="cloudy">Cloudy</SelectItem>
                    <SelectItem value="rainy">Rainy</SelectItem>
                    <SelectItem value="snowy">Snowy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-white/70 block">Time of Day</label>
                <Select value={selectedTimeOfDay} onValueChange={setSelectedTimeOfDay}>
                  <SelectTrigger className="bg-slate-800/60 border-slate-700/50">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700/50">
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-white/70">Temperature</label>
                  <span className="text-xs font-medium text-white">{temperature[0]}°C</span>
                </div>
                <Slider 
                  defaultValue={[18]} 
                  max={40} 
                  min={-10} 
                  step={1}
                  value={temperature}
                  onValueChange={setTemperature}
                  className="py-2"
                />
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>-10°C</span>
                  <span>40°C</span>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-950/30 rounded-lg p-3 border border-indigo-500/20">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <Sun className="h-3.5 w-3.5 text-yellow-400" />
                  <span className="text-white/80">{selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)}</span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center gap-1.5">
                  <Wind className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-white/80">{selectedWeather.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center gap-1.5">
                  <Thermometer className="h-3.5 w-3.5 text-red-400" />
                  <span className="text-white/80">{temperature[0]}°C</span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-white/80">{selectedTimeOfDay.charAt(0).toUpperCase() + selectedTimeOfDay.slice(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export default EnhancedStyleContext;
